import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { RolesService } from '../../services/roles.service';
import { Role } from '../../models/role';

@Component({
  selector: 'app-edit-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent implements OnInit {
  private fb = inject(FormBuilder);
  private rolesService = inject(RolesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  roleForm: FormGroup;
  loading = signal(false);
  loadingData = signal(true);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  roleId: number = 0;

  constructor() {
    this.roleForm = this.fb.group({
      rol_name: ['', [Validators.required, Validators.minLength(3)]],
      description_rol: [''],
      is_active: [true, Validators.required]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.roleId = id ? parseInt(id, 10) : 0;
    if (this.roleId) {
      this.loadRole();
    } else {
      this.errorMessage.set('ID de rol no válido');
      this.loadingData.set(false);
    }
  }

  loadRole() {
    this.loadingData.set(true);
    this.rolesService.getRoleById(this.roleId).subscribe({
      next: (roleData) => {
        console.log('Rol cargado:', roleData);
        
        if (!roleData) {
          this.errorMessage.set('No se pudo cargar el rol');
          this.loadingData.set(false);
          return;
        }
        
        // Convertir is_active de 0/1 a boolean para el formulario
        const isActive = (roleData.is_active as any) === 1 || roleData.is_active === true;
        
        this.roleForm.patchValue({
          rol_name: roleData.rol_name,
          description_rol: roleData.description_rol || '',
          is_active: isActive
        });
        
        this.loadingData.set(false);
      },
      error: (error) => {
        console.error('Error al cargar rol:', error);
        this.errorMessage.set('Error al cargar el rol. Por favor, intente nuevamente.');
        this.loadingData.set(false);
      }
    });
  }

  onSubmit() {
    if (this.roleForm.valid) {
      this.loading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      const formValue = this.roleForm.value;
      
      // Convertir is_active de boolean a 1/0 para el backend
      const roleData = {
        ...formValue,
        is_active: formValue.is_active ? 1 : 0
      };

      console.log('Actualizando rol:', roleData);

      this.rolesService.updateRole(this.roleId, roleData).subscribe({
        next: (response) => {
          console.log('Rol actualizado exitosamente:', response);
          this.successMessage.set('¡Rol actualizado exitosamente!');
          this.loading.set(false);
          
          // Redirigir después de 1.5 segundos
          setTimeout(() => {
            this.router.navigate(['/roles']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error al actualizar rol:', error);
          
          // Extraer mensaje de error detallado
          let errorMsg = 'Error al actualizar el rol. Por favor, intente nuevamente.';
          
          if (error.error?.message) {
            errorMsg = error.error.message;
          } else if (error.error?.errors) {
            const errors = error.error.errors;
            const errorMessages = Object.keys(errors).map(key => `${key}: ${errors[key]}`);
            errorMsg = errorMessages.join(', ');
          }
          
          this.errorMessage.set(errorMsg);
          this.loading.set(false);
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.roleForm.controls).forEach(key => {
        this.roleForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.router.navigate(['/roles']);
  }

  // Getters para validación
  get rol_name() {
    return this.roleForm.get('rol_name');
  }

  get description_rol() {
    return this.roleForm.get('description_rol');
  }

  get is_active() {
    return this.roleForm.get('is_active');
  }
}
