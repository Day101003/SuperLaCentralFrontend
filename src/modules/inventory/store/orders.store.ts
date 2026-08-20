import { Injectable, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AlertService } from '../../../app/shared/services/alert.service';
import { Order, OrderView } from '../models/order.model';
import { OrderService } from '../services/order.service';

interface OrdersState {
  orders: OrderView[];
  loading: boolean;
  error: string | null;
}
@Injectable({ providedIn: 'root' })
export class OrdersStore {
  private readonly service = inject(OrderService);
  private readonly alert = inject(AlertService);
  private readonly state = signal<OrdersState>({ orders: [], loading: false, error: null });
  orders = computed(() => this.state().orders);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  pendingCount = computed(
    () => this.state().orders.filter((order) => order.status_order === 1).length,
  );
  receivedCount = computed(
    () => this.state().orders.filter((order) => order.status_order === 2).length,
  );
  cancelledCount = computed(
    () => this.state().orders.filter((order) => order.status_order === 3).length,
  );
  totalAmount = computed(() =>
    this.state().orders.reduce((sum, order) => sum + Number(order.total), 0),
  );
  loadOrders(): void {
    this.state.update((state) => ({ ...state, loading: true, error: null }));
    forkJoin({
      orders: this.service.getOrders(),
      details: this.service.getOrderDetails(),
    }).subscribe({
      next: ({ orders, details }) =>
        this.state.set({
          orders: orders.map((order) => {
            const orderDetails = details.filter(
              (detail) => detail.id_order_purchase === order.id_order_purchase,
            );
            return {
              ...order,
              product_count: new Set(orderDetails.map((detail) => detail.id_product)).size,
              unit_count: orderDetails.reduce((sum, detail) => sum + detail.quantity, 0),
            };
          }),
          loading: false,
          error: null,
        }),
      error: (error) => this.setError(error, 'No se pudieron cargar las órdenes'),
    });
  }
  deleteOrder(order: Order): void {
    this.state.update((state) => ({ ...state, loading: true }));
    this.service.deleteOrderWithDetails(order).subscribe({
      next: () => {
        this.alert.success(
          'Orden eliminada',
          'La orden y sus detalles se eliminaron correctamente',
        );
        this.loadOrders();
      },
      error: (error) => this.setError(error, 'No se pudo eliminar la orden'),
    });
  }
  private setError(error: any, fallback: string): void {
    const message =
      typeof error.error === 'string' ? error.error : error.error?.message || fallback;
    this.state.update((state) => ({ ...state, loading: false, error: message }));
    this.alert.error('Error', message);
  }
}
