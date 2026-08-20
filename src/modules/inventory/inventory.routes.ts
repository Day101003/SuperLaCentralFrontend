import { Routes } from '@angular/router';

import { InventoryPageComponent } from './pages/inventory-page/inventory-page.component';
import { CategoriesPageComponent } from './pages/categories/categories-page/categories-page.component';
import { ProductsPageComponent } from './pages/products/products-page/products-page.component';
import { SuppliersPageComponent } from './pages/suppliers/suppliers-page/suppliers-page.component';
import { PromotionsPageComponent } from './pages/promotions/promotions-page/promotions-page.component';
import { OrdersPageComponent } from './pages/orders/orders-page/orders-page.component';

export const INVENTORY_ROUTES: Routes = [
  {
    path: '',
    component: InventoryPageComponent,
  },

  {
    path: 'categories',
    component: CategoriesPageComponent,
  },
  {
    path: 'categories/create',
    loadComponent: () =>
      import('./pages/categories/create-category/create-category.component').then(
        (m) => m.CreateCategoryComponent,
      ),
  },
  {
    path: 'categories/edit/:id',
    loadComponent: () =>
      import('./pages/categories/edit-category/edit-category.component').then(
        (m) => m.EditCategoryComponent,
      ),
  },

  {
    path: 'products',
    component: ProductsPageComponent,
  },
  {
    path: 'products/create',
    loadComponent: () =>
      import('./pages/products/create-product/create-product.component').then(
        (m) => m.CreateProductComponent,
      ),
  },
  {
    path: 'products/edit/:id',
    loadComponent: () =>
      import('./pages/products/edit-product/edit-product.component').then(
        (m) => m.EditProductComponent,
      ),
  },

  {
    path: 'suppliers',
    component: SuppliersPageComponent,
  },
  {
    path: 'suppliers/create',
    loadComponent: () =>
      import('./pages/suppliers/create-supplier/create-supplier.component').then(
        (m) => m.CreateSupplierComponent,
      ),
  },
  {
    path: 'suppliers/edit/:id',
    loadComponent: () =>
      import('./pages/suppliers/edit-supplier/edit-supplier.component').then(
        (m) => m.EditSupplierComponent,
      ),
  },

  {
    path: 'promotions',
    component: PromotionsPageComponent,
  },
  {
    path: 'promotions/create',
    loadComponent: () =>
      import('./pages/promotions/create-promotion/create-promotion.component').then(
        (m) => m.CreatePromotionComponent,
      ),
  },
  {
    path: 'promotions/edit/:id',
    loadComponent: () =>
      import('./pages/promotions/edit-promotion/edit-promotion.component').then(
        (m) => m.EditPromotionComponent,
      ),
  },

  {
    path: 'orders',
    component: OrdersPageComponent,
  },
  {
    path: 'orders/create',
    loadComponent: () =>
      import('./pages/orders/create-order/create-order.component').then(
        (m) => m.CreateOrderComponent,
      ),
  },
  {
    path: 'orders/edit/:id',
    loadComponent: () =>
      import('./pages/orders/edit-order/edit-order.component').then((m) => m.EditOrderComponent),
  },
];
