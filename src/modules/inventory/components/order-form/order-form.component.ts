import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../app/shared/services/alert.service';
import { Order, OrderDetail, OrderFormValue } from '../../models/order.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css',
})
export class OrderFormComponent implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() orderData: Order | null = null;
  @Input() orderDetails: OrderDetail[] = [];
  @Input() products: Product[] = [];
  @Input() loading = false;
  @Output() formSubmit = new EventEmitter<OrderFormValue>();
  @Output() formCancel = new EventEmitter<void>();
  private readonly formBuilder = inject(FormBuilder);
  private readonly alert = inject(AlertService);
  currentStep = signal(1);
  readonly totalSteps = 2;
  form = this.formBuilder.nonNullable.group({
    status_order: [1, [Validators.required, Validators.min(1)]],
    details: this.formBuilder.array<ReturnType<OrderFormComponent['createDetailGroup']>>([]),
  });
  total(): number {
    return this.details.controls.reduce(
      (sum, detail) =>
        sum + Number(detail.controls.quantity.value) * Number(detail.controls.purchase_price.value),
      0,
    );
  }
  get details(): FormArray<ReturnType<OrderFormComponent['createDetailGroup']>> {
    return this.form.controls.details;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderData'] && this.orderData)
      this.form.controls.status_order.setValue(this.orderData.status_order);
    if (
      (changes['orderDetails'] || changes['products']) &&
      this.orderData &&
      this.orderDetails.length &&
      this.details.length === 0
    )
      this.orderDetails.forEach((detail) => this.details.push(this.createDetailGroup(detail)));
    if (this.mode === 'create' && this.details.length === 0) this.addDetail();
  }
  createDetailGroup(detail?: Partial<OrderDetail>) {
    return this.formBuilder.nonNullable.group({
      id_product: [detail?.id_product ?? 0, [Validators.required, Validators.min(1)]],
      quantity: [detail?.quantity ?? 1, [Validators.required, Validators.min(1)]],
      purchase_price: [
        Number(detail?.purchase_price ?? 0),
        [Validators.required, Validators.min(0.01)],
      ],
    });
  }
  addDetail(): void {
    this.details.push(this.createDetailGroup());
  }
  removeDetail(index: number): void {
    if (this.details.length === 1) {
      this.alert.warning('Detalle requerido', 'La orden debe incluir al menos un producto');
      return;
    }
    this.details.removeAt(index);
  }
  nextStep(): void {
    if (this.details.invalid || this.details.length === 0) {
      this.details.markAllAsTouched();
      this.alert.warning('Detalles incompletos', 'Revisa los productos de la orden');
      return;
    }
    this.currentStep.set(2);
  }
  previousStep(): void {
    this.currentStep.set(1);
  }
  onSubmit(): void {
    if (this.form.invalid || this.total() <= 0) {
      this.form.markAllAsTouched();
      this.alert.warning('Formulario incompleto', 'Revisa los campos marcados');
      return;
    }
    const value = this.form.getRawValue();
    this.formSubmit.emit({
      status_order: Number(value.status_order),
      details: value.details.map((detail) => ({
        id_product: Number(detail.id_product),
        quantity: Number(detail.quantity),
        purchase_price: Number(detail.purchase_price),
      })),
      total: this.total(),
    });
  }
  invalid(index: number, field: string): boolean {
    const control = this.details.at(index).get(field);
    return !!control?.invalid && !!control?.touched;
  }
  productName(id: number): string {
    return (
      this.products.find((product) => product.id_product === Number(id))?.product_name ?? 'Producto'
    );
  }
}
