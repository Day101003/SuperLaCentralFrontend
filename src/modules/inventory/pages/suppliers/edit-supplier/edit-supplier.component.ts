import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AlertService } from '../../../../../app/shared/services/alert.service';
import { SupplierFormComponent } from '../../../components/supplier-form/supplier-form.component';
import { Supplier } from '../../../models/supplier.model';
import { SupplierRequest, SupplierService } from '../../../services/supplier.service';
@Component({
  selector: 'app-edit-supplier',
  standalone: true,
  imports: [SupplierFormComponent],
  templateUrl: './edit-supplier.component.html',
  styleUrl: './edit-supplier.component.css',
})
export class EditSupplierComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(SupplierService);
  private alert = inject(AlertService);
  supplier: Supplier | null = null;
  loading = true;
  saving = false;
  id = 0;
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.service
      .getSupplierById(this.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (s) => (this.supplier = s),
        error: () => this.alert.error('Error', 'No se pudo cargar el proveedor'),
      });
  }
  submit(data: SupplierRequest): void {
    this.saving = true;
    this.service
      .updateSupplier(this.id, data)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => this.alert.success('Proveedor actualizado').then(() => this.cancel()),
        error: (e) =>
          this.alert.error(
            'Error',
            typeof e.error === 'string' ? e.error : 'No se pudo actualizar',
          ),
      });
  }
  cancel(): void {
    this.router.navigate(['/inventory/suppliers']);
  }
}
