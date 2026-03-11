import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';

export const CORE_ROUTES: Routes = [

  {
    path: 'auth',
    loadChildren: () =>
      import('../modules/auth/login.routes')
        .then(m => m.AUTH_ROUTES)
  },

  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },

      {
        path: 'users',
        loadChildren: () =>
          import('../modules/users/users.routes')
            .then(m => m.USERS_ROUTES)
      },

      {
        path: 'inventory',
        loadChildren: () =>
          import('../modules/inventory/inventory.routes')
            .then(m => m.INVENTORY_ROUTES)

      },
      {
        path: 'roles',
        loadChildren: () =>
          import('../modules/roles/roles.routes')
            .then(m => m.ROLES_ROUTES)
      }
    ]
  },

  {
    path: '404',
    component: NotFoundComponent
  },

  {
    path: '**',
    redirectTo: '404'
  }
];
