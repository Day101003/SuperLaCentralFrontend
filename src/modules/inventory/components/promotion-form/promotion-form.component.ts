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
import { Product } from '../../models/product.model';
import { Promotion, PromotionRequest } from '../../models/promotion.model';

@Component({
  selector: 'app-promotion-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './promotion-form.component.html',
  styleUrl: './promotion-form.component.css',
})
export class PromotionFormComponent implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() promotionData: Promotion | null = null;
  @Input() products: Product[] = [];
  @Input() loading = false;
  @Output() formSubmit = new EventEmitter<PromotionRequest>();
  @Output() formCancel = new EventEmitter<void>();
  private readonly formBuilder = inject(FormBuilder);
  private readonly alert = inject(AlertService);
  form = this.formBuilder.nonNullable.group({
    description: ['', Validators.maxLength(200)],
    id_product: [0, [Validators.required, Validators.min(1)]],
    discount: [0, [Validators.required, Validators.min(0.01), Validators.max(100)]],
    start_date: ['', Validators.required],
    end_date: ['', Validators.required],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['promotionData'] && this.promotionData) {
      this.form.patchValue({
        description: this.promotionData.description ?? '',
        id_product: this.promotionData.id_product,
        discount: Number(this.promotionData.discount),
        start_date: this.toLocalInput(this.promotionData.start_date),
        end_date: this.toLocalInput(this.promotionData.end_date),
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert.warning('Formulario incompleto', 'Revisa los campos marcados');
      return;
    }
    const value = this.form.getRawValue();
    if (new Date(value.end_date) <= new Date(value.start_date)) {
      this.alert.warning(
        'Fechas inválidas',
        'La fecha final debe ser posterior a la fecha inicial',
      );
      return;
    }
    this.formSubmit.emit({
      description: value.description.trim() || null,
      id_product: Number(value.id_product),
      discount: Number(value.discount),
      start_date: new Date(value.start_date).toISOString(),
      end_date: new Date(value.end_date).toISOString(),
    });
  }

  invalid(name: string): boolean {
    const field = this.form.get(name);
    return !!field?.invalid && !!field?.touched;
  }
  private toLocalInput(value: string): string {
    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  }
}
