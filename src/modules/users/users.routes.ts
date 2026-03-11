import { Routes } from '@angular/router';
import { UsersPageComponent } from './pages/users-page.component';

export const USERS_ROUTES: Routes = [
  { path: '', component: UsersPageComponent },
  { 
    path: 'crear', 
    loadComponent: () => import('./pages/create-user/create-user.component').then(m => m.CreateUserComponent)
  },
  { 
    path: 'editar/:id', 
    loadComponent: () => import('./pages/edit-user/edit-user.component').then(m => m.EditUserComponent)
  }
];
