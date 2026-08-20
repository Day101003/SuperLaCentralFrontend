import { CommonModule } from '@angular/common';
import { Component, OnInit, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../../../../app/shared/services/alert.service';
import {
  DataTableComponent,
  TableAction,
  TableColumn,
} from '../../../../../shared/components/data-table.component';
import { PaginationComponent } from '../../../../../shared/components/pagination.component';
import { usePagination } from '../../../../../shared/composables/use-pagination';
import { ProductFull } from '../../../models/product.model';
import { ProductsStore } from '../../../store/products.store';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, DataTableComponent, PaginationComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css',
})
export class ProductsPageComponent implements OnInit {
  private readonly store = inject(ProductsStore);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);
  private readonly productService = inject(ProductService);
  products = this.store.products;
  loading = this.store.loading;
  error = this.store.error;
  selectedProduct: ProductFull | null = null;
  lowStockCount = this.store.lowStockCount;
  outOfStockCount = this.store.outOfStockCount;
  pagination = usePagination<ProductFull>([], 5);
  tableColumns: TableColumn[] = [
    { key: 'product_name', label: 'Producto', sortable: true },
    { key: 'category_name', label: 'Categoría', sortable: true },
    {
      key: 'supplier_name',
      label: 'Proveedores',
      sortable: true,
      render: (value) => this.renderSupplierCount(value),
    },
    {
      key: 'sale_price',
      label: 'Precio',
      sortable: true,
      render: (value) => `₡${Number(value).toLocaleString('es-CR', { minimumFractionDigits: 2 })}`,
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (value) =>
        `<span class="px-3 py-1 rounded-full text-xs font-semibold ${value === 0 ? 'bg-red-100 text-red-800' : value <= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-emerald-100 text-emerald-800'}">${value}</span>`,
    },
  ];
  tableActions: TableAction[] = [
    {
      icon: 'eye',
      label: 'Ver proveedores',
      class: 'bg-blue-50 text-primary',
      handler: (product) => (this.selectedProduct = product),
    },
    {
      icon: 'edit-2',
      label: 'Editar',
      class: 'bg-[rgb(30,27,75)] text-white',
      handler: (product) => this.router.navigate(['/inventory/products/edit', product.id_product]),
    },
    {
      icon: 'trash-2',
      label: 'Eliminar',
      class: 'bg-red-50 text-red-600',
      handler: (product) => this.deleteProduct(product),
    },
  ];
  constructor() {
    effect(() => this.pagination.setItems(this.products()));
  }
  ngOnInit(): void {
    this.loadProducts();
  }
  loadProducts(): void {
    this.store.loadProducts();
  }
  createProduct(): void {
    this.router.navigate(['/inventory/products/create']);
  }
  deleteProduct(product: ProductFull): void {
    this.productService.getDeleteBlockers(product.id_product).subscribe({
      next: (blockers) => {
        if (blockers.length > 0) {
          this.alert.warning('No se puede eliminar', `El producto tiene ${blockers.join(', ')}.`);
          return;
        }
        this.alert
          .confirm('¿Eliminar producto?', `Se eliminará "${product.product_name}"`)
          .then((result) => {
            if (result.isConfirmed) this.store.deleteProduct(product.id_product);
          });
      },
      error: () =>
        this.alert.error('Error', 'No se pudieron verificar las relaciones del producto'),
    });
  }
  onSearch(term: string): void {
    this.pagination.setSearchQuery(term);
  }
  onPageChange(page: number): void {
    this.pagination.setPage(page);
  }

  supplierNames(product: ProductFull | null): string[] {
    return (
      product?.supplier_name
        ?.split(',')
        .map((name) => name.trim())
        .filter(Boolean) ?? []
    );
  }

  private renderSupplierCount(value: string | null | undefined): string {
    const count =
      value
        ?.split(',')
        .map((name) => name.trim())
        .filter(Boolean).length ?? 0;
    return count === 0
      ? '<span class="text-gray-500">Sin asignar</span>'
      : `<span class="px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-semibold">${count} ${count === 1 ? 'proveedor' : 'proveedores'}</span>`;
  }
}
