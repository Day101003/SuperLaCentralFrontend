import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const CORE_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'users',
        loadChildren: () =>
          import('../modules/users/users.routes')
            .then(m => m.USERS_ROUTES)
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
