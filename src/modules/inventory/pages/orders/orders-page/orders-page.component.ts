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
import { OrderView } from '../../../models/order.model';
import { OrdersStore } from '../../../store/orders.store';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule, DataTableComponent, PaginationComponent],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.css',
})
export class OrdersPageComponent implements OnInit {
  private readonly store = inject(OrdersStore);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);
  orders = this.store.orders;
  loading = this.store.loading;
  error = this.store.error;
  pendingCount = this.store.pendingCount;
  receivedCount = this.store.receivedCount;
  cancelledCount = this.store.cancelledCount;
  totalAmount = this.store.totalAmount;
  pagination = usePagination<OrderView>([], 5);
  tableColumns: TableColumn[] = [
    {
      key: 'date_purchase',
      label: 'Fecha',
      sortable: true,
      render: (value) =>
        new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium', timeStyle: 'short' }).format(
          new Date(value),
        ),
    },
    {
      key: 'product_count',
      label: 'Productos',
      sortable: true,
      render: (value, row) => `${value} productos (${row.unit_count} unidades)`,
    },
    {
      key: 'status_order',
      label: 'Estado',
      sortable: true,
      render: (value) => this.statusBadge(value),
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (value) => `₡${Number(value).toLocaleString('es-CR', { minimumFractionDigits: 2 })}`,
    },
  ];
  tableActions: TableAction[] = [
    {
      icon: 'edit-2',
      label: 'Editar',
      class: 'bg-[rgb(30,27,75)] text-white',
      handler: (order) => this.router.navigate(['/inventory/orders/edit', order.id_order_purchase]),
    },
    {
      icon: 'trash-2',
      label: 'Eliminar',
      class: 'bg-red-50 text-red-600',
      handler: (order) => this.deleteOrder(order),
    },
  ];
  constructor() {
    effect(() => this.pagination.setItems(this.orders()));
  }
  ngOnInit(): void {
    this.store.loadOrders();
  }
  createOrder(): void {
    this.router.navigate(['/inventory/orders/create']);
  }
  deleteOrder(order: OrderView): void {
    this.alert
      .confirm('¿Eliminar orden?', 'También se eliminarán todos sus detalles.')
      .then((result) => {
        if (result.isConfirmed) this.store.deleteOrder(order);
      });
  }
  onSearch(term: string): void {
    this.pagination.setSearchQuery(term);
  }
  onPageChange(page: number): void {
    this.pagination.setPage(page);
  }
  private statusBadge(status: number): string {
    const values: Record<number, [string, string]> = {
      1: ['Pendiente', 'bg-yellow-100 text-yellow-800'],
      2: ['Recibida', 'bg-emerald-100 text-emerald-800'],
      3: ['Cancelada', 'bg-red-100 text-red-800'],
    };
    const [label, classes] = values[status] ?? ['Desconocido', 'bg-gray-100 text-gray-700'];
    return `<span class="px-3 py-1 rounded-full text-xs font-semibold ${classes}">${label}</span>`;
  }
}
