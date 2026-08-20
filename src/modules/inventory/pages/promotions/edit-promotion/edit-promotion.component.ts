import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { AlertService } from '../../../../../app/shared/services/alert.service';
import { PromotionFormComponent } from '../../../components/promotion-form/promotion-form.component';
import { Product } from '../../../models/product.model';
import { Promotion, PromotionRequest } from '../../../models/promotion.model';
import { ProductService } from '../../../services/product.service';
import { PromotionService } from '../../../services/promotion.service';

@Component({
  selector: 'app-edit-promotion',
  standalone: true,
  imports: [RouterLink, PromotionFormComponent],
  templateUrl: './edit-promotion.component.html',
  styleUrl: './edit-promotion.component.css',
})
export class EditPromotionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly promotionService = inject(PromotionService);
  private readonly alert = inject(AlertService);
  products = signal<Product[]>([]);
  promotion = signal<Promotion | null>(null);
  loading = true;
  saving = false;
  id = 0;
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(this.id) || this.id <= 0) {
      this.alert.error('Promoción inválida');
      this.cancel();
      return;
    }
    forkJoin({
      promotion: this.promotionService.getPromotionById(this.id),
      products: this.productService.getProducts(),
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          this.promotion.set(data.promotion);
          this.products.set(data.products);
        },
        error: () => this.alert.error('Error', 'No se pudo cargar la promoción'),
      });
  }
  submit(data: PromotionRequest): void {
    this.saving = true;
    this.promotionService
      .updatePromotion(this.id, data)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () =>
          this.alert
            .success('Promoción actualizada', 'Los cambios se guardaron correctamente')
            .then(() => this.cancel()),
        error: (error) =>
          this.alert.error(
            'Error al actualizar',
            typeof error.error === 'string' ? error.error : 'No se pudo actualizar la promoción',
          ),
      });
  }
  cancel(): void {
    this.router.navigate(['/inventory/promotions']);
  }
}
