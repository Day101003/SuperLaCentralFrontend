import { Routes } from '@angular/router';

export const PERMISSIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/permissions-page.component').then(m => m.PermissionsPageComponent)
  },
  {
    path: 'crear',
    loadComponent: () => import('./pages/create-permission/create-permission.component').then(m => m.CreatePermissionComponent)
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./pages/edit-permission/edit-permission.component').then(m => m.EditPermissionComponent)
  }
];
