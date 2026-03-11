import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  protected authStore = inject(AuthStore);

  registerForm: FormGroup;
  imagePreview: string | null = null;

  constructor() {
    this.registerForm = this.fb.group({
      name_user: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      identity_card: ['', [Validators.required]],
      password_user: ['', [Validators.required, Validators.minLength(6)]],
      image: [''],
      id_rol: [2, [Validators.required]] // Por defecto rol 2 (ajusta según tu backend)
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const formData = { ...this.registerForm.value };
    
    // Si no hay imagen, enviar null en lugar de string vacía
    if (!formData.image || formData.image === '') {
      formData.image = null;
    }

    console.log('Datos a enviar:', formData);
    this.authStore.register(formData);
  }

  get name_user() {
    return this.registerForm.get('name_user');
  }

  get lastname() {
    return this.registerForm.get('lastname');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password_user() {
    return this.registerForm.get('password_user');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get address() {
    return this.registerForm.get('address');
  }

  get identity_card() {
    return this.registerForm.get('identity_card');
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        console.error('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error('La imagen no debe superar 5MB');
        return;
      }

      // Comprimir y redimensionar la imagen agresivamente
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          // Redimensionar a máximo 150x150 para reducir tamaño
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

          // Convertir a base64 con alta compresión (40% calidad)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.4);
          
          // Remover el prefijo data:image/jpeg;base64, para ahorrar espacio
          const base64Only = compressedBase64.split(',')[1];
          
          console.log('Tamaño original:', file.size, 'bytes');
          console.log('Tamaño comprimido:', base64Only.length, 'caracteres');
          
          this.imagePreview = compressedBase64;
          this.registerForm.patchValue({ image: base64Only });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.registerForm.patchValue({ image: '' });
  }
}
