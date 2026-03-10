import { Routes } from '@angular/router';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/roles-page.component').then(m => m.RolesPageComponent)
  },
  {
    path: 'crear',
    loadComponent: () => import('./pages/create-role/create-role.component').then(m => m.CreateRoleComponent)
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./pages/edit-role/edit-role.component').then(m => m.EditRoleComponent)
  }
];
