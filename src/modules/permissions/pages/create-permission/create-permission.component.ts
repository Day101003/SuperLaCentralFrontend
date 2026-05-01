import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PermissionsService } from '../../services/permissions.service';

@Component({
  selector: 'app-create-permission',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-permission.component.html',
  styleUrl: './create-permission.component.css'
})
export class CreatePermissionComponent {
  private readonly permissionsService = inject(PermissionsService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  permissionForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.permissionForm = this.fb.group({
      permission_name: ['', [Validators.required, Validators.minLength(3)]],
      permission_description: [''],
      is_active: [true, [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.permissionForm.invalid) {
      this.permissionForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const permissionData = {
      ...this.permissionForm.value,
      is_active: this.permissionForm.value.is_active ? 1 : 0
    };

    this.permissionsService.createPermission(permissionData).subscribe({
      next: () => {
        this.successMessage = 'Permiso creado exitosamente';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/permisos']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error al crear permiso:', error);
        this.errorMessage = error.error?.message || 'Error al crear el permiso';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/permisos']);
  }

  get permission_name() { return this.permissionForm.get('permission_name'); }
  get permission_description() { return this.permissionForm.get('permission_description'); }
  get is_active() { return this.permissionForm.get('is_active'); }
}
