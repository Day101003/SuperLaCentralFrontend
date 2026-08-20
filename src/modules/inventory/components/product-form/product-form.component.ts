import { CommonModule } from '@angular/common';
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
import { Category } from '../../models/category.model';
import { Product, ProductFormValue } from '../../models/product.model';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() productData: Product | null = null;
  @Input() categories: Category[] = [];
  @Input() suppliers: Supplier[] = [];
  @Input() selectedSupplierIds: number[] = [];
  @Input() loading = false;
  @Output() formSubmit = new EventEmitter<ProductFormValue>();
  @Output() formCancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly alert = inject(AlertService);
  currentStep = 1;
  readonly totalSteps = 3;
  readonly steps = [
    { number: 1, title: 'Información General' },
    { number: 2, title: 'Precio e Inventario' },
    { number: 3, title: 'Proveedores' },
  ];
  productForm = this.fb.nonNullable.group({
    product_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    product_description: ['', [Validators.maxLength(200)]],
    sale_price: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
    status_product: [1, [Validators.required]],
    id_category: [0, [Validators.required, Validators.min(1)]],
    supplier_ids: this.fb.nonNullable.control<number[]>([]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productData'] && this.productData) {
      this.productForm.patchValue({
        ...this.productData,
        product_description: this.productData.product_description ?? '',
      });
    }
    if (changes['selectedSupplierIds'])
      this.productForm.controls.supplier_ids.setValue(this.selectedSupplierIds);
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.alert.warning('Formulario incompleto', 'Revisa los campos marcados');
      return;
    }
    const value = this.productForm.getRawValue();
    this.formSubmit.emit({
      product_name: value.product_name.trim(),
      product_description: value.product_description.trim() || null,
      sale_price: Number(value.sale_price),
      stock: Number(value.stock),
      status_product: Number(value.status_product),
      id_category: Number(value.id_category),
      supplier_ids: value.supplier_ids.map(Number),
    });
  }
  onCancel(): void {
    this.formCancel.emit();
  }
  nextStep(): void {
    if (this.validateStep(this.currentStep) && this.currentStep < this.totalSteps)
      this.currentStep++;
  }
  previousStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }
  goToStep(step: number): void {
    if (step <= this.currentStep || this.validateStepsUntil(step - 1)) this.currentStep = step;
  }
  isStepValid(step: number): boolean {
    return this.fieldsForStep(step).every((name) => this.productForm.get(name)?.valid);
  }
  private validateStep(step: number): boolean {
    const fields = this.fieldsForStep(step);
    fields.forEach((name) => this.productForm.get(name)?.markAsTouched());
    return fields.every((name) => this.productForm.get(name)?.valid);
  }
  private validateStepsUntil(step: number): boolean {
    for (let current = 1; current <= step; current++) if (!this.validateStep(current)) return false;
    return true;
  }
  private fieldsForStep(step: number): string[] {
    if (step === 1) return ['product_name', 'product_description', 'id_category'];
    if (step === 2) return ['sale_price', 'stock', 'status_product'];
    return ['supplier_ids'];
  }
  toggleSupplier(id: number, checked: boolean): void {
    const current = this.productForm.controls.supplier_ids.value;
    this.productForm.controls.supplier_ids.setValue(
      checked ? [...new Set([...current, id])] : current.filter((value) => value !== id),
    );
  }
  invalid(name: string): boolean {
    const field = this.productForm.get(name);
    return !!field?.invalid && !!field?.touched;
  }
}
