import { Injectable, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AlertService } from '../../../app/shared/services/alert.service';
import { PromotionView } from '../models/promotion.model';
import { ProductService } from '../services/product.service';
import { PromotionService } from '../services/promotion.service';

interface PromotionsState {
  promotions: PromotionView[];
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class PromotionsStore {
  private readonly promotionService = inject(PromotionService);
  private readonly productService = inject(ProductService);
  private readonly alert = inject(AlertService);
  private readonly state = signal<PromotionsState>({ promotions: [], loading: false, error: null });
  promotions = computed(() => this.state().promotions);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  activeCount = computed(
    () =>
      this.state().promotions.filter(
        (promotion) =>
          new Date(promotion.start_date) <= new Date() &&
          new Date(promotion.end_date) >= new Date(),
      ).length,
  );
  expiringSoonCount = computed(() => {
    const now = Date.now();
    const limit = now + 7 * 24 * 60 * 60 * 1000;
    return this.state().promotions.filter(
      (promotion) =>
        new Date(promotion.end_date).getTime() >= now &&
        new Date(promotion.end_date).getTime() <= limit,
    ).length;
  });

  loadPromotions(): void {
    this.state.update((state) => ({ ...state, loading: true, error: null }));
    forkJoin({
      promotions: this.promotionService.getPromotions(),
      products: this.productService.getProducts(),
    }).subscribe({
      next: ({ promotions, products }) => {
        const productNames = new Map(
          products.map((product) => [product.id_product, product.product_name]),
        );
        this.state.set({
          promotions: promotions.map((promotion) => ({
            ...promotion,
            product_name: productNames.get(promotion.id_product) ?? 'Producto no disponible',
          })),
          loading: false,
          error: null,
        });
      },
      error: (error) => this.setError(error, 'No se pudieron cargar las promociones'),
    });
  }

  deletePromotion(id: number): void {
    this.state.update((state) => ({ ...state, loading: true, error: null }));
    this.promotionService.deletePromotion(id).subscribe({
      next: () => {
        this.alert.success('Promoción eliminada', 'La promoción se eliminó correctamente');
        this.loadPromotions();
      },
      error: (error) => this.setError(error, 'No se pudo eliminar la promoción'),
    });
  }

  private setError(error: any, fallback: string): void {
    const message =
      typeof error.error === 'string' ? error.error : error.error?.message || fallback;
    this.state.update((state) => ({ ...state, loading: false, error: message }));
    this.alert.error('Error', message);
  }
}
