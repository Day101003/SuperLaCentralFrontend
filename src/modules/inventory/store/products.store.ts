import { Injectable, computed, inject, signal } from '@angular/core';
import { AlertService } from '../../../app/shared/services/alert.service';
import { ProductFull } from '../models/product.model';
import { ProductService } from '../services/product.service';

interface ProductsState {
  products: ProductFull[];
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProductsStore {
  private readonly service = inject(ProductService);
  private readonly alert = inject(AlertService);
  private readonly state = signal<ProductsState>({ products: [], loading: false, error: null });
  products = computed(() => this.state().products);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  lowStockCount = computed(() => this.state().products.filter((p) => p.stock <= 5).length);
  outOfStockCount = computed(() => this.state().products.filter((p) => p.stock === 0).length);

  loadProducts(): void {
    this.state.update((s) => ({ ...s, loading: true, error: null }));
    this.service.getProductsFull().subscribe({
      next: (products) => this.state.update((s) => ({ ...s, products, loading: false })),
      error: (error) => this.setError(error, 'Error al cargar los productos'),
    });
  }
  deleteProduct(id: number): void {
    this.state.update((s) => ({ ...s, loading: true, error: null }));
    this.service.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
        this.alert.success('Producto eliminado', 'El producto se eliminó correctamente');
      },
      error: (error) =>
        this.setError(error, 'No se pudo eliminar el producto; podría tener registros asociados'),
    });
  }
  private setError(error: any, fallback: string): void {
    const message =
      typeof error.error === 'string' ? error.error : error.error?.message || fallback;
    this.state.update((s) => ({ ...s, loading: false, error: message }));
    this.alert.error('Error', message);
  }
}
