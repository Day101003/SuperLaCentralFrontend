import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Order,
  OrderDetail,
  OrderDetailRequest,
  OrderFormDetail,
  OrderRequest,
} from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly ordersUrl = `${environment.apiUrl}/Orders`;
  private readonly detailsUrl = `${environment.apiUrl}/OrderDetails`;
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersUrl);
  }
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.ordersUrl}/${id}`);
  }
  createOrder(data: OrderRequest): Observable<{ id_order_purchase: number }> {
    return this.http.post<{ id_order_purchase: number }>(this.ordersUrl, data);
  }
  updateOrder(id: number, data: OrderRequest): Observable<string> {
    return this.http.put(`${this.ordersUrl}/${id}`, data, { responseType: 'text' });
  }
  deleteOrder(id: number): Observable<string> {
    return this.http.delete(`${this.ordersUrl}/${id}`, { responseType: 'text' });
  }
  getOrderDetails(): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(this.detailsUrl);
  }
  createOrderDetail(data: OrderDetailRequest): Observable<string> {
    return this.http.post(this.detailsUrl, data, { responseType: 'text' });
  }
  deleteOrderDetail(id: number): Observable<string> {
    return this.http.delete(`${this.detailsUrl}/${id}`, { responseType: 'text' });
  }
  createDetails(orderId: number, details: OrderFormDetail[]): Observable<string[]> {
    return details.length
      ? forkJoin(
          details.map((detail) =>
            this.createOrderDetail({ ...detail, id_order_purchase: orderId }),
          ),
        )
      : of([]);
  }
  replaceDetails(
    orderId: number,
    current: OrderDetail[],
    details: OrderFormDetail[],
  ): Observable<string[]> {
    const removals = current.length
      ? forkJoin(current.map((detail) => this.deleteOrderDetail(detail.id_detail_order)))
      : of([]);
    return removals.pipe(switchMap(() => this.createDetails(orderId, details)));
  }
  deleteOrderWithDetails(order: Order): Observable<string> {
    return this.getOrderDetails().pipe(
      map((details) =>
        details.filter((detail) => detail.id_order_purchase === order.id_order_purchase),
      ),
      switchMap((details) =>
        details.length
          ? forkJoin(details.map((detail) => this.deleteOrderDetail(detail.id_detail_order)))
          : of([]),
      ),
      switchMap(() => this.deleteOrder(order.id_order_purchase)),
    );
  }
}
