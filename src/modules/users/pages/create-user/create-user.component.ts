import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  userForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  imagePreview: string | null = null;

  constructor() {
    this.userForm = this.fb.group({
      name_user: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      identity_card: ['', [Validators.required]],
      password_user: ['', [Validators.required, Validators.minLength(6)]],
      image: [''],
      id_rol: [2, [Validators.required]] // Por defecto rol 2
    });
  }

  ngAfterViewInit(): void {
    // Initialize Feather Icons
    if ((globalThis as any).feather) {
      (globalThis as any).feather.replace();
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = { ...this.userForm.value };
    
    if (!formData.image || formData.image === '') {
      formData.image = null;
    }

    this.authService.register(formData).subscribe({
      next: (response) => {
        console.log('Usuario creado exitosamente:', response);
        this.successMessage = 'Usuario creado exitosamente';
        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        this.errorMessage = error.error?.message || 'Error al crear usuario';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

  get name_user() {
    return this.userForm.get('name_user');
  }

  get lastname() {
    return this.userForm.get('lastname');
  }

  get email() {
    return this.userForm.get('email');
  }

  get password_user() {
    return this.userForm.get('password_user');
  }

  get phone() {
    return this.userForm.get('phone');
  }

  get address() {
    return this.userForm.get('address');
  }

  get identity_card() {
    return this.userForm.get('identity_card');
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Por favor selecciona un archivo de imagen válido';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'La imagen no debe superar 5MB';
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
}
