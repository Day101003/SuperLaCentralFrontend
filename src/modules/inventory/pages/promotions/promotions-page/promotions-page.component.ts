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
import { PromotionView } from '../../../models/promotion.model';
import { PromotionsStore } from '../../../store/promotions.store';

@Component({
  selector: 'app-promotions-page',
  standalone: true,
  imports: [CommonModule, DataTableComponent, PaginationComponent],
  templateUrl: './promotions-page.component.html',
  styleUrl: './promotions-page.component.css',
})
export class PromotionsPageComponent implements OnInit {
  private readonly store = inject(PromotionsStore);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);
  promotions = this.store.promotions;
  loading = this.store.loading;
  error = this.store.error;
  activeCount = this.store.activeCount;
  expiringSoonCount = this.store.expiringSoonCount;
  pagination = usePagination<PromotionView>([], 5);
  tableColumns: TableColumn[] = [
    {
      key: 'description',
      label: 'Promoción',
      sortable: true,
      render: (value) => value || 'Sin descripción',
    },
    { key: 'product_name', label: 'Producto', sortable: true },
    {
      key: 'discount',
      label: 'Descuento',
      sortable: true,
      render: (value) =>
        `<span class="px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-semibold">${Number(value).toLocaleString('es-CR')}%</span>`,
    },
    {
      key: 'start_date',
      label: 'Inicio',
      sortable: true,
      render: (value) => this.formatDate(value),
    },
    {
      key: 'end_date',
      label: 'Finaliza',
      sortable: true,
      render: (value) => this.formatDate(value),
    },
  ];
  tableActions: TableAction[] = [
    {
      icon: 'edit-2',
      label: 'Editar',
      class: 'bg-[rgb(30,27,75)] text-white',
      handler: (promotion) =>
        this.router.navigate(['/inventory/promotions/edit', promotion.id_promotion]),
    },
    {
      icon: 'trash-2',
      label: 'Eliminar',
      class: 'bg-red-50 text-red-600',
      handler: (promotion) => this.deletePromotion(promotion),
    },
  ];
  constructor() {
    effect(() => this.pagination.setItems(this.promotions()));
  }
  ngOnInit(): void {
    this.store.loadPromotions();
  }
  createPromotion(): void {
    this.router.navigate(['/inventory/promotions/create']);
  }
  deletePromotion(promotion: PromotionView): void {
    this.alert
      .confirm('¿Eliminar promoción?', `Se eliminará la promoción de "${promotion.product_name}"`)
      .then((result) => {
        if (result.isConfirmed) this.store.deletePromotion(promotion.id_promotion);
      });
  }
  onSearch(term: string): void {
    this.pagination.setSearchQuery(term);
  }
  onPageChange(page: number): void {
    this.pagination.setPage(page);
  }
  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(value),
    );
  }
}
