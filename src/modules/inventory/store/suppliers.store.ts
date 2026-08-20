import { Injectable, computed, inject, signal } from '@angular/core';
import { AlertService } from '../../../app/shared/services/alert.service';
import { Supplier } from '../models/supplier.model';
import { SupplierService } from '../services/supplier.service';
interface SuppliersState {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
}
@Injectable({ providedIn: 'root' })
export class SuppliersStore {
  private readonly service = inject(SupplierService);
  private readonly alert = inject(AlertService);
  private readonly state = signal<SuppliersState>({ suppliers: [], loading: false, error: null });
  suppliers = computed(() => this.state().suppliers);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  withEmailCount = computed(() => this.state().suppliers.filter((s) => !!s.email).length);
  loadSuppliers(): void {
    this.state.update((s) => ({ ...s, loading: true, error: null }));
    this.service
      .getSuppliers()
      .subscribe({
        next: (suppliers) => this.state.update((s) => ({ ...s, suppliers, loading: false })),
        error: (e) => this.setError(e, 'Error al cargar los proveedores'),
      });
  }
  deleteSupplier(id: number): void {
    this.state.update((s) => ({ ...s, loading: true, error: null }));
    this.service.deleteSupplier(id).subscribe({
      next: () => {
        this.loadSuppliers();
        this.alert.success('Proveedor eliminado', 'El proveedor se eliminó correctamente');
      },
      error: (e) =>
        this.setError(e, 'No se pudo eliminar el proveedor; podría tener productos asociados'),
    });
  }
  private setError(error: any, fallback: string): void {
    const message =
      typeof error.error === 'string' ? error.error : error.error?.message || fallback;
    this.state.update((s) => ({ ...s, loading: false, error: message }));
    this.alert.error('Error', message);
  }
}
