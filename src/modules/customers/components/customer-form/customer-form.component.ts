import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, AfterViewInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css'
})
export class CustomerFormComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() customerData: Customer | null = null;
  @Input() loading = false;
  @Input() errorMessage = '';
  
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  
  customerForm!: FormGroup;
  imagePreview: string | null = null;
  currentStep = 1;
  totalSteps = 4;


  steps = [
    { number: 1, title: 'Información Personal', icon: 'users' },
    { number: 2, title: 'Información de Cuenta', icon: 'lock' },
    { number: 3, title: 'Imagen de Perfil', icon: 'image' },
    { number: 4, title: 'Estado', icon: 'settings' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customerData'] && this.customerData && this.customerForm) {
      this.loadCustomerData();
    }
  }

  ngAfterViewInit(): void {
    this.replaceFeatherIcons();
  }

  initForm(): void {
    this.customerForm = this.fb.group({
      customer_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      customer_description: [''],
      identity_card: ['', [Validators.required]],
      age: [0, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      image: [''],
      customer_status: [1, [Validators.required]]
    });

    if (this.customerData) {
      this.loadCustomerData();
    }
  }

loadCustomerData(): void {
  if (!this.customerData) return;

  this.customerForm.patchValue({
    customer_name: this.customerData?.customer_name ?? '',
    last_name: this.customerData?.last_name ?? '',
    customer_description: this.customerData?.customer_description ?? '',
    identity_card: this.customerData?.identity_card ?? '',
    age: this.customerData?.age ?? 0,
    email: this.customerData?.email ?? '',
    customer_status: this.customerData?.customer_status ?? 1
  });

  if (this.customerData?.image) {
    this.imagePreview = `data:image/jpeg;base64,${this.customerData.image}`;
  }
}

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = { ...this.customerForm.value };

    if (!formData.image || formData.image === '') {
      formData.image = null;
    }

    // Ensure numeric fields are numbers
    formData.age = Number(formData.age);
    formData.customer_status = Number(formData.customer_status);

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
      const step1Fields = ['customer_name', 'last_name', 'identity_card', 'age'];
      step1Fields.forEach(field => {
        const control = this.customerForm.get(field);
        if (control) {
          control.markAsTouched();
          if (control.invalid) {
            isValid = false;
          }
        }
      });
    } else if (this.currentStep === 2) {
      const step2Fields = ['email'];
      step2Fields.forEach((field: string) => {
        const control = this.customerForm.get(field);
        if (control) {
          control.markAsTouched();
          if (control.invalid) {
            isValid = false;
          }
        }
      });
    } else if (this.currentStep === 4) {
      const step4Fields = ['customer_status'];
      step4Fields.forEach(field => {
        const control = this.customerForm.get(field);
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
      const step1Fields = ['customer_name', 'last_name', 'identity_card', 'age'];
      return step1Fields.every(field => {
        const control = this.customerForm.get(field);
        return control && control.valid;
      });
    } else if (step === 2) {
      const step2Fields = ['email'];
      return step2Fields.every((field: string) => {
        const control = this.customerForm.get(field);
        return control && control.valid;
      });
    } else if (step === 4) {
      const step4Fields = ['customer_status'];
      return step4Fields.every(field => {
        const control = this.customerForm.get(field);
        return control && control.valid;
      });
    }
    return true;
  }

  markAllAsTouched(): void {
    Object.keys(this.customerForm.controls).forEach(key => {
      this.customerForm.get(key)?.markAsTouched();
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
          
          this.customerForm.patchValue({ image: base64Only });
          this.imagePreview = compressedBase64;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

replaceFeatherIcons(): void {
  setTimeout(() => {
    const feather = (globalThis as any).feather;

    if (!feather?.icons || typeof feather.replace !== 'function') return;

    const elements = document.querySelectorAll('[data-feather]');

    elements.forEach((el) => {
      const iconName = el.getAttribute('data-feather');

      if (iconName && !feather.icons[iconName]) {
        console.warn('🔥 Icono inválido detectado:', iconName);
        el.setAttribute('data-feather', 'circle');
      }
    });

    feather.replace();
  }, 100);
}

  // Getters para validaciones en template
  get customer_name() { return this.customerForm.get('customer_name'); }
  get last_name() { return this.customerForm.get('last_name'); }
  get email() { return this.customerForm.get('email'); }
  get customer_description() { return this.customerForm.get('customer_description'); }
  get identity_card() { return this.customerForm.get('identity_card'); }
  get age() { return this.customerForm.get('age'); }
  get customer_status() { return this.customerForm.get('customer_status'); }
}
