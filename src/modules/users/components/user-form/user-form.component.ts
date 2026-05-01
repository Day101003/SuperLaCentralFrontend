import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, AfterViewInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { Role } from '../../../roles/models/role';
import { RolesService } from '../../../roles/services/roles.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() userData: User | null = null;
  @Input() loading = false;
  @Input() errorMessage = '';
  
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  private readonly rolesService = inject(RolesService);
  
  userForm!: FormGroup;
  imagePreview: string | null = null;
  currentStep = 1;
  totalSteps = 4;
  
  // Signal para los roles
  roles = signal<Role[]>([]);
  loadingRoles = signal<boolean>(false);

  steps = [
    { number: 1, title: 'Información Personal', icon: 'user' },
    { number: 2, title: 'Información de Cuenta', icon: 'lock' },
    { number: 3, title: 'Imagen de Perfil', icon: 'image' },
    { number: 4, title: 'Rol y Estado', icon: 'settings' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRoles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && this.userData && this.userForm) {
      this.loadUserData();
    }
  }

  ngAfterViewInit(): void {
    this.replaceFeatherIcons();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name_user: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      identity_card: ['', [Validators.required]],
      password_user: ['', this.mode === 'create' ? [Validators.required, Validators.minLength(6)] : []],
      image: [''],
      id_rol: [2, [Validators.required]],
      is_active: [true, [Validators.required]]
    });

    if (this.userData) {
      this.loadUserData();
    }
  }

  loadRoles(): void {
    this.loadingRoles.set(true);
    this.rolesService.getRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        this.loadingRoles.set(false);
        console.log('Roles cargados:', roles);
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        this.loadingRoles.set(false);
        // Si falla, usar roles por defecto
        this.roles.set([
          { id_rol: 1, rol_name: 'Admin' },
          { id_rol: 2, rol_name: 'Usuario' },
          { id_rol: 3, rol_name: 'Editor' }
        ]);
      }
    });
  }

  loadUserData(): void {
    if (!this.userData) return;

    this.userForm.patchValue({
      name_user: this.userData.name_user,
      lastname: this.userData.lastname,
      email: this.userData.email,
      phone: this.userData.phone,
      address: this.userData.address,
      identity_card: this.userData.identity_card,
      id_rol: this.userData.id_rol || 2,
      is_active: this.userData.is_active !== undefined ? this.userData.is_active : true
    });

    if (this.userData.image) {
      this.imagePreview = `data:image/jpeg;base64,${this.userData.image}`;
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = { ...this.userForm.value };
    
    // Si es modo edicion y no hay password, eliminarlo del payload
    if (this.mode === 'edit' && !formData.password_user) {
      delete formData.password_user;
    }
    
    if (!formData.image || formData.image === '') {
      formData.image = null;
    }

    // Asegurar que is_active sea un booleano
    formData.is_active = Boolean(formData.is_active);

    this.formSubmit.emit(formData);
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      if (this.validateCurrentStep()) {
        this.currentStep++;
        setTimeout(() => this.replaceFeatherIcons(), 0);
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      setTimeout(() => this.replaceFeatherIcons(), 0);
    }
  }

  goToStep(step: number): void {
    if (step <= this.currentStep || this.validateStepsUntil(step - 1)) {
      this.currentStep = step;
      setTimeout(() => this.replaceFeatherIcons(), 0);
    }
  }

  validateCurrentStep(): boolean {
    let isValid = true;
    
    if (this.currentStep === 1) {
      const step1Fields = ['name_user', 'lastname', 'identity_card', 'phone', 'address'];
      step1Fields.forEach(field => {
        const control = this.userForm.get(field);
        if (control) {
          control.markAsTouched();
          if (control.invalid) {
            isValid = false;
          }
        }
      });
    } else if (this.currentStep === 2) {
      const step2Fields = ['email'];
      if (this.mode === 'create') {
        step2Fields.push('password_user');
      }
      step2Fields.forEach(field => {
        const control = this.userForm.get(field);
        if (control) {
          control.markAsTouched();
          if (control.invalid) {
            isValid = false;
          }
        }
      });
    } else if (this.currentStep === 4) {
      const step4Fields = ['id_rol', 'is_active'];
      step4Fields.forEach(field => {
        const control = this.userForm.get(field);
        if (control) {
          control.markAsTouched();
          if (control.invalid) {
            isValid = false;
          }
        }
      });
    }
    
    return isValid;
  }

  validateStepsUntil(step: number): boolean {
    for (let i = 1; i <= step; i++) {
      const prevStep = this.currentStep;
      this.currentStep = i;
      if (!this.validateCurrentStep()) {
        this.currentStep = prevStep;
        return false;
      }
    }
    return true;
  }

  isStepValid(step: number): boolean {
    if (step === 1) {
      const step1Fields = ['name_user', 'lastname', 'identity_card', 'phone', 'address'];
      return step1Fields.every(field => {
        const control = this.userForm.get(field);
        return control && control.valid;
      });
    } else if (step === 2) {
      const step2Fields = ['email'];
      if (this.mode === 'create') {
        step2Fields.push('password_user');
      }
      return step2Fields.every(field => {
        const control = this.userForm.get(field);
        return control && control.valid;
      });
    } else if (step === 4) {
      const step4Fields = ['id_rol', 'is_active'];
      return step4Fields.every(field => {
        const control = this.userForm.get(field);
        return control && control.valid;
      });
    }
    return true;
  }

  markAllAsTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.markAsTouched();
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 150;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.4);
          const base64Only = compressedBase64.split(',')[1];
          
          this.userForm.patchValue({ image: base64Only });
          this.imagePreview = compressedBase64;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  private replaceFeatherIcons(): void {
    if ((globalThis as any).feather) {
      (globalThis as any).feather.replace();
    }
  }

  // Getters para validaciones en template
  get name_user() { return this.userForm.get('name_user'); }
  get lastname() { return this.userForm.get('lastname'); }
  get email() { return this.userForm.get('email'); }
  get password_user() { return this.userForm.get('password_user'); }
  get phone() { return this.userForm.get('phone'); }
  get address() { return this.userForm.get('address'); }
  get identity_card() { return this.userForm.get('identity_card'); }
  get id_rol() { return this.userForm.get('id_rol'); }
  get is_active() { return this.userForm.get('is_active'); }
}
