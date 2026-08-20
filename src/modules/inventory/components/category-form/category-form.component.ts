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
import { Category, CategoryRequest } from '../../models/category.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css',
})
export class CategoryFormComponent implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() categoryData: Category | null = null;
  @Input() loading = false;
  @Output() formSubmit = new EventEmitter<CategoryRequest>();
  @Output() formCancel = new EventEmitter<void>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly alert = inject(AlertService);

  form = this.formBuilder.nonNullable.group({
    category_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    category_description: ['', [Validators.maxLength(200)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryData'] && this.categoryData) {
      this.form.patchValue({
        category_name: this.categoryData.category_name,
        category_description: this.categoryData.category_description ?? '',
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert.warning('Formulario incompleto', 'Revisa los campos marcados antes de guardar');
      return;
    }

    const value = this.form.getRawValue();
    this.formSubmit.emit({
      category_name: value.category_name.trim(),
      category_description: value.category_description.trim() || null,
    });
  }

  invalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!field?.invalid && !!field?.touched;
  }
}
