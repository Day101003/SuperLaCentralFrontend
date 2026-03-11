import { Routes } from '@angular/router';

import { InventoryPageComponent } from './pages/inventory-page/inventory-page.component';
import { CategoriasPageComponent } from './pages/categorias-page/categorias-page.component';
import { ProductosPageComponent } from './pages/productos-page/productos-page.component';
import { ProveedoresPageComponent } from './pages/proveedores-page/proveedores-page.component';
import { PromocionesPageComponent } from './pages/promociones-page/promociones-page.component';
import { OrdenesPageComponent } from './pages/ordenes-page/ordenes-page.component';

export const INVENTORY_ROUTES: Routes = [

  {
    path: '',
    component: InventoryPageComponent
  },

  {
    path: 'categorias',
    component: CategoriasPageComponent
  },

  {
    path: 'productos',
    component: ProductosPageComponent
  },

  {
    path: 'proveedores',
    component: ProveedoresPageComponent
  },

  {
    path: 'promociones',
    component: PromocionesPageComponent
  },

  {
    path: 'ordenes',
    component: OrdenesPageComponent
  }

];
