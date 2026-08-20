import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AlertService } from '../../../../../app/shared/services/alert.service';
import { SupplierFormComponent } from '../../../components/supplier-form/supplier-form.component';
import { SupplierRequest, SupplierService } from '../../../services/supplier.service';
@Component({
  selector: 'app-create-supplier',
  standalone: true,
  imports: [SupplierFormComponent],
  templateUrl: './create-supplier.component.html',
  styleUrl: './create-supplier.component.css',
})
export class CreateSupplierComponent {
  private service = inject(SupplierService);
  private router = inject(Router);
  private alert = inject(AlertService);
  loading = false;
  submit(data: SupplierRequest): void {
    this.loading = true;
    this.service
      .createSupplier(data)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => this.alert.success('Proveedor creado').then(() => this.cancel()),
        error: (e) =>
          this.alert.error('Error', typeof e.error === 'string' ? e.error : 'No se pudo crear'),
      });
  }
  cancel(): void {
    this.router.navigate(['/inventory/suppliers']);
  }
}
