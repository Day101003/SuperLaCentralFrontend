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
import { Supplier } from '../../../models/supplier.model';
import { SuppliersStore } from '../../../store/suppliers.store';
@Component({
  selector: 'app-suppliers-page',
  standalone: true,
  imports: [CommonModule, DataTableComponent, PaginationComponent],
  templateUrl: './suppliers-page.component.html',
  styleUrl: './suppliers-page.component.css',
})
export class SuppliersPageComponent implements OnInit {
  private readonly store = inject(SuppliersStore);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);
  suppliers = this.store.suppliers;
  loading = this.store.loading;
  error = this.store.error;
  withEmailCount = this.store.withEmailCount;
  pagination = usePagination<Supplier>([], 5);
  tableColumns: TableColumn[] = [
    { key: 'supplier_name', label: 'Proveedor', sortable: true },
    {
      key: 'company',
      label: 'Empresa',
      sortable: true,
      render: (value) => value || 'Sin registrar',
    },
    { key: 'phone', label: 'Teléfono', render: (value) => value || 'Sin registrar' },
    { key: 'email', label: 'Correo', render: (value) => value || 'Sin registrar' },
  ];
  tableActions: TableAction[] = [
    {
      icon: 'edit-2',
      label: 'Editar',
      class: 'bg-[rgb(30,27,75)] text-white',
      handler: (supplier) =>
        this.router.navigate(['/inventory/suppliers/edit', supplier.id_supplier]),
    },
    {
      icon: 'trash-2',
      label: 'Eliminar',
      class: 'bg-red-50 text-red-600',
      handler: (supplier) => this.deleteSupplier(supplier),
    },
  ];
  constructor() {
    effect(() => this.pagination.setItems(this.suppliers()));
  }
  ngOnInit(): void {
    this.store.loadSuppliers();
  }
  createSupplier(): void {
    this.router.navigate(['/inventory/suppliers/create']);
  }
  deleteSupplier(supplier: Supplier): void {
    this.alert
      .confirm('¿Eliminar proveedor?', `Se eliminará "${supplier.supplier_name}"`)
      .then((result) => {
        if (result.isConfirmed) this.store.deleteSupplier(supplier.id_supplier);
      });
  }
  onSearch(term: string): void {
    this.pagination.setSearchQuery(term);
  }
  onPageChange(page: number): void {
    this.pagination.setPage(page);
  }
}
