import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../app/shared/services/alert.service';
import { Supplier } from '../../models/supplier.model';
import { SupplierRequest } from '../../services/supplier.service';
@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.css',
})
export class SupplierFormComponent implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() supplierData: Supplier | null = null;
  @Input() loading = false;
  @Output() formSubmit = new EventEmitter<SupplierRequest>();
  @Output() formCancel = new EventEmitter<void>();
  private readonly fb = inject(FormBuilder);
  private readonly alert = inject(AlertService);
  form = this.fb.nonNullable.group({
    supplier_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    company: ['', Validators.maxLength(200)],
    phone: ['', Validators.maxLength(20)],
    email: ['', Validators.email],
  });
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['supplierData'] && this.supplierData)
      this.form.patchValue({
        supplier_name: this.supplierData.supplier_name,
        company: this.supplierData.company ?? '',
        phone: this.supplierData.phone ?? '',
        email: this.supplierData.email ?? '',
      });
  }
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert.warning('Formulario incompleto', 'Revisa los campos marcados');
      return;
    }
    const value = this.form.getRawValue();
    this.formSubmit.emit({
      supplier_name: value.supplier_name.trim(),
      company: value.company.trim() || null,
      phone: value.phone.trim() || null,
      email: value.email.trim() || null,
    });
  }
  invalid(name: string): boolean {
    const field = this.form.get(name);
    return !!field?.invalid && !!field?.touched;
  }
}
