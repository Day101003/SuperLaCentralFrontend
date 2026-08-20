import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize, switchMap } from 'rxjs';
import { AlertService } from '../../../../../app/shared/services/alert.service';
import { OrderFormComponent } from '../../../components/order-form/order-form.component';
import { OrderFormValue } from '../../../models/order.model';
import { Product } from '../../../models/product.model';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [RouterLink, OrderFormComponent],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css',
})
export class CreateOrderComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
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
  submit(value: OrderFormValue): void {
    this.loading = true;
    this.orderService
      .createOrder({ status_order: value.status_order, total: value.total })
      .pipe(
        switchMap((result) =>
          this.orderService.createDetails(result.id_order_purchase, value.details),
        ),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next: () =>
          this.alert
            .success('Orden creada', 'La orden y sus detalles se crearon correctamente')
            .then(() => this.cancel()),
        error: (error) =>
          this.alert.error(
            'Error al crear',
            typeof error.error === 'string' ? error.error : 'No se pudo crear la orden',
          ),
      });
  }
  cancel(): void {
    this.router.navigate(['/inventory/orders']);
  }
}
