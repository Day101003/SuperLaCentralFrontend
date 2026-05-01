import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { PermissionsService } from '../../services/permissions.service';

@Component({
  selector: 'app-edit-permission',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-permission.component.html',
  styleUrls: ['./edit-permission.component.css']
})
export class EditPermissionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private permissionsService = inject(PermissionsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  permissionForm: FormGroup;
  loading = signal(false);
  loadingData = signal(true);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  permissionId: number = 0;

  constructor() {
    this.permissionForm = this.fb.group({
      permission_name: ['', [Validators.required, Validators.minLength(3)]],
      permission_description: [''],
      is_active: [true, Validators.required]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.permissionId = id ? parseInt(id, 10) : 0;
    if (this.permissionId) {
      this.loadPermission();
    } else {
      this.errorMessage.set('ID de permiso no válido');
      this.loadingData.set(false);
    }
  }

  loadPermission() {
    this.loadingData.set(true);
    this.permissionsService.getPermissionById(this.permissionId).subscribe({
      next: (permissionData) => {
        if (!permissionData) {
          this.errorMessage.set('No se pudo cargar el permiso');
          this.loadingData.set(false);
          return;
        }

        const isActive = (permissionData.is_active as any) === 1 || permissionData.is_active === true;

        this.permissionForm.patchValue({
          permission_name: permissionData.permission_name,
          permission_description: permissionData.permission_description || '',
          is_active: isActive
        });

        this.loadingData.set(false);
      },
      error: (error) => {
        console.error('Error al cargar permiso:', error);
        this.errorMessage.set('Error al cargar el permiso. Por favor, intente nuevamente.');
        this.loadingData.set(false);
      }
    });
  }

  onSubmit() {
    if (this.permissionForm.valid) {
      this.loading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      const formValue = this.permissionForm.value;
      const permissionData = {
        ...formValue,
        is_active: formValue.is_active ? 1 : 0
      };

      this.permissionsService.updatePermission(this.permissionId, permissionData).subscribe({
        next: () => {
          this.successMessage.set('¡Permiso actualizado exitosamente!');
          this.loading.set(false);
          setTimeout(() => {
            this.router.navigate(['/permisos']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error al actualizar permiso:', error);
          let errorMsg = 'Error al actualizar el permiso. Por favor, intente nuevamente.';
          if (error.error?.message) {
            errorMsg = error.error.message;
          } else if (error.error?.errors) {
            const errors = error.error.errors;
            errorMsg = Object.keys(errors).map(key => `${key}: ${errors[key]}`).join(', ');
          }
          this.errorMessage.set(errorMsg);
          this.loading.set(false);
        }
      });
    } else {
      Object.keys(this.permissionForm.controls).forEach(key => {
        this.permissionForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.router.navigate(['/permisos']);
  }

  get permission_name() { return this.permissionForm.get('permission_name'); }
  get permission_description() { return this.permissionForm.get('permission_description'); }
  get is_active() { return this.permissionForm.get('is_active'); }
}
