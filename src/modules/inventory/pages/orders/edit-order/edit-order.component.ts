import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin, switchMap } from 'rxjs';
import { AlertService } from '../../../../../app/shared/services/alert.service';
import { OrderFormComponent } from '../../../components/order-form/order-form.component';
import { Order, OrderDetail, OrderFormValue } from '../../../models/order.model';
import { Product } from '../../../models/product.model';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [RouterLink, OrderFormComponent],
  templateUrl: './edit-order.component.html',
  styleUrl: './edit-order.component.css',
})
export class EditOrderComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);
  private readonly productService = inject(ProductService);
  private readonly alert = inject(AlertService);
  order = signal<Order | null>(null);
  details = signal<OrderDetail[]>([]);
  products = signal<Product[]>([]);
  loading = true;
  saving = false;
  id = 0;
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(this.id) || this.id <= 0) {
      this.alert.error('Orden inválida');
      this.cancel();
      return;
    }
    forkJoin({
      order: this.orderService.getOrderById(this.id),
      details: this.orderService.getOrderDetails(),
      products: this.productService.getProducts(),
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          this.order.set(data.order);
          this.details.set(data.details.filter((detail) => detail.id_order_purchase === this.id));
          this.products.set(data.products);
        },
        error: () => this.alert.error('Error', 'No se pudo cargar la orden'),
      });
  }
  submit(value: OrderFormValue): void {
    this.saving = true;
    this.orderService
      .updateOrder(this.id, { status_order: value.status_order, total: value.total })
      .pipe(
        switchMap(() => this.orderService.replaceDetails(this.id, this.details(), value.details)),
        finalize(() => (this.saving = false)),
      )
      .subscribe({
        next: () =>
          this.alert
            .success('Orden actualizada', 'Los cambios se guardaron correctamente')
            .then(() => this.cancel()),
        error: (error) =>
          this.alert.error(
            'Error al actualizar',
            typeof error.error === 'string' ? error.error : 'No se pudo actualizar la orden',
          ),
      });
  }
  cancel(): void {
    this.router.navigate(['/inventory/orders']);
  }
}
