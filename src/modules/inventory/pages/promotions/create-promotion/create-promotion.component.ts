import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AlertService } from '../../../../../app/shared/services/alert.service';
import { PromotionFormComponent } from '../../../components/promotion-form/promotion-form.component';
import { Product } from '../../../models/product.model';
import { PromotionRequest } from '../../../models/promotion.model';
import { ProductService } from '../../../services/product.service';
import { PromotionService } from '../../../services/promotion.service';

@Component({
  selector: 'app-create-promotion',
  standalone: true,
  imports: [RouterLink, PromotionFormComponent],
  templateUrl: './create-promotion.component.html',
  styleUrl: './create-promotion.component.css',
})
export class CreatePromotionComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly promotionService = inject(PromotionService);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);
  products = signal<Product[]>([]);
  loading = false;
  ngOnInit(): void {
    this.productService
      .getProducts()
      .subscribe({
        next: (products) => this.products.set(products),
        error: () => this.alert.error('Error', 'No se pudieron cargar los productos'),
      });
  }
  submit(data: PromotionRequest): void {
    this.loading = true;
    this.promotionService
      .createPromotion(data)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () =>
          this.alert
            .success('Promoción creada', 'La promoción se creó correctamente')
            .then(() => this.cancel()),
        error: (error) =>
          this.alert.error(
            'Error al crear',
            typeof error.error === 'string' ? error.error : 'No se pudo crear la promoción',
          ),
      });
  }
  cancel(): void {
    this.router.navigate(['/inventory/promotions']);
  }
}
