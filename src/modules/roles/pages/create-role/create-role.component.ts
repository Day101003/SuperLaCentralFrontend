import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-create-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent {
  private readonly rolesService = inject(RolesService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  roleForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.roleForm = this.fb.group({
      rol_name: ['', [Validators.required, Validators.minLength(3)]],
      description_rol: [''],
      is_active: [true, [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const roleData = {
      ...this.roleForm.value,
      is_active: this.roleForm.value.is_active ? 1 : 0
    };

    this.rolesService.createRole(roleData).subscribe({
      next: () => {
        this.successMessage = 'Rol creado exitosamente';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/roles']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error al crear rol:', error);
        this.errorMessage = error.error?.message || 'Error al crear el rol';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/roles']);
  }

  get rol_name() { return this.roleForm.get('rol_name'); }
  get description_rol() { return this.roleForm.get('description_rol'); }
  get is_active() { return this.roleForm.get('is_active'); }
}
