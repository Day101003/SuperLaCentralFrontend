import { Routes } from '@angular/router';
import { CustomersPageComponent } from './pages/customer-page.component';

export const CUSTOMERS_ROUTES: Routes = [
  { path: '', component: CustomersPageComponent },
  { 
    path: 'crear', 
    loadComponent: () => import('./pages/create-customer/create-customer.component').then(m => m.CreateCustomerComponent)
  },
  { 
    path: 'editar/:id', 
    loadComponent: () => import('./pages/edit-customer/edit-customer.component').then(m => m.EditCustomerComponent)
  }
];
