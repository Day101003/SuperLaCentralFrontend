import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionsService } from '../services/permissions.service';
import { Permission } from '../models/permission';

interface PermissionsState {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionsStore {
  private permissionsService = inject(PermissionsService);
  private router = inject(Router);

  private state = signal<PermissionsState>({
    permissions: [],
    loading: false,
    error: null
  });

  permissions = computed(() => this.state().permissions);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  activePermissionsCount = computed(() => this.state().permissions.filter(p => p.is_active).length);
  inactivePermissionsCount = computed(() => this.state().permissions.filter(p => !p.is_active).length);

  loadPermissions(): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));

    this.permissionsService.getPermissions().subscribe({
      next: (permissions) => {
        this.state.update(state => ({ ...state, permissions, loading: false, error: null }));
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Error al cargar los permisos';
        this.state.update(state => ({ ...state, loading: false, error: errorMessage }));
      }
    });
  }

  getPermissionById(id: number): Permission | undefined {
    return this.state().permissions.find(p => p.id_permission === id);
  }

  createPermission(permissionData: Partial<Permission>, onSuccess?: () => void): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));

    this.permissionsService.createPermission(permissionData).subscribe({
      next: () => {
        this.state.update(state => ({ ...state, loading: false, error: null }));
        this.loadPermissions();
        if (onSuccess) {
          onSuccess();
        } else {
          this.router.navigate(['/permisos']);
        }
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Error al crear el permiso';
        this.state.update(state => ({ ...state, loading: false, error: errorMessage }));
      }
    });
  }

  updatePermission(id: number, permissionData: Partial<Permission>, onSuccess?: () => void): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));

    this.permissionsService.updatePermission(id, permissionData).subscribe({
      next: () => {
        this.state.update(state => ({ ...state, loading: false, error: null }));
        this.loadPermissions();
        if (onSuccess) {
          onSuccess();
        } else {
          this.router.navigate(['/permisos']);
        }
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Error al actualizar el permiso';
        this.state.update(state => ({ ...state, loading: false, error: errorMessage }));
      }
    });
  }

  deletePermission(id: number): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));

    this.permissionsService.deletePermission(id).subscribe({
      next: () => {
        this.state.update(state => ({ ...state, loading: false, error: null }));
        this.loadPermissions();
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Error al eliminar el permiso';
        this.state.update(state => ({ ...state, loading: false, error: errorMessage }));
      }
    });
  }

  clearError(): void {
    this.state.update(state => ({ ...state, error: null }));
  }
}
