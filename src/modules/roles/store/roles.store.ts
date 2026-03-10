import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { RolesService } from '../services/roles.service';
import { Role } from '../models/role';

interface RolesState {
  roles: Role[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class RolesStore {
  private rolesService = inject(RolesService);
  private router = inject(Router);

 
  private state = signal<RolesState>({
    roles: [],
    loading: false,
    error: null
  });

  roles = computed(() => this.state().roles);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  activeRolesCount = computed(() => this.state().roles.filter(r => r.is_active).length);
  inactiveRolesCount = computed(() => this.state().roles.filter(r => !r.is_active).length);

  
  loadRoles(): void {
    this.state.update(state => ({
      ...state,
      loading: true,
      error: null
    }));

    this.rolesService.getRoles().subscribe({
      next: (roles) => {
        console.log('Roles cargados en el store:', roles);
        this.state.update(state => ({
          ...state,
          roles,
          loading: false,
          error: null
        }));
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        const errorMessage = error.error?.message || 'Error al cargar los roles';
        this.state.update(state => ({
          ...state,
          loading: false,
          error: errorMessage
        }));
      }
    });
  }

  
  getRoleById(id: number): Role | undefined {
    return this.state().roles.find(role => role.id_rol === id);
  }

  
  createRole(roleData: Partial<Role>, onSuccess?: () => void): void {
    this.state.update(state => ({
      ...state,
      loading: true,
      error: null
    }));

    this.rolesService.createRole(roleData).subscribe({
      next: (response) => {
        console.log('Rol creado exitosamente:', response);
        this.state.update(state => ({
          ...state,
          loading: false,
          error: null
        }));
        
        this.loadRoles();
        if (onSuccess) {
          onSuccess();
        } else {
          this.router.navigate(['/roles']);
        }
      },
      error: (error) => {
        console.error('Error al crear rol:', error);
        const errorMessage = error.error?.message || 'Error al crear el rol';
        this.state.update(state => ({
          ...state,
          loading: false,
          error: errorMessage
        }));
      }
    });
  }


  updateRole(id: number, roleData: Partial<Role>, onSuccess?: () => void): void {
    this.state.update(state => ({
      ...state,
      loading: true,
      error: null
    }));

    this.rolesService.updateRole(id, roleData).subscribe({
      next: (response) => {
        console.log('Rol actualizado exitosamente:', response);
        this.state.update(state => ({
          ...state,
          loading: false,
          error: null
        }));
       
        this.loadRoles();
        if (onSuccess) {
          onSuccess();
        } else {
          this.router.navigate(['/roles']);
        }
      },
      error: (error) => {
        console.error('Error al actualizar rol:', error);
        const errorMessage = error.error?.message || 'Error al actualizar el rol';
        this.state.update(state => ({
          ...state,
          loading: false,
          error: errorMessage
        }));
      }
    });
  }

  
  deleteRole(id: number): void {
    this.state.update(state => ({
      ...state,
      loading: true,
      error: null
    }));

    this.rolesService.deleteRole(id).subscribe({
      next: () => {
        console.log('Rol eliminado exitosamente');
        this.state.update(state => ({
          ...state,
          loading: false,
          error: null
        }));

        this.loadRoles();
      },
      error: (error) => {
        console.error('Error al eliminar rol:', error);
        const errorMessage = error.error?.message || 'Error al eliminar el rol';
        this.state.update(state => ({
          ...state,
          loading: false,
          error: errorMessage
        }));
      }
    });
  }

 
  clearError(): void {
    this.state.update(state => ({
      ...state,
      error: null
    }));
  }
}
