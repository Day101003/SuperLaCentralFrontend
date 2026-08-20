import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AlertService } from '../../../../../app/shared/services/alert.service';
import { CategoryFormComponent } from '../../../components/category-form/category-form.component';
import { Category, CategoryRequest } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [RouterLink, CategoryFormComponent],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css',
})
export class EditCategoryComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly alert = inject(AlertService);
  category: Category | null = null;
  loading = true;
  saving = false;
  categoryId = 0;

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(this.categoryId) || this.categoryId <= 0) {
      this.alert.error('Categoría inválida', 'El identificador de la categoría no es válido');
      this.cancel();
      return;
    }
    this.categoryService
      .getCategoryById(this.categoryId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (category) => (this.category = category),
        error: () => this.alert.error('Error', 'No se pudo cargar la categoría'),
      });
  }

  submit(data: CategoryRequest): void {
    this.saving = true;
    this.categoryService
      .updateCategory(this.categoryId, data)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () =>
          this.alert
            .success('Categoría actualizada', 'Los cambios se guardaron correctamente')
            .then(() => this.cancel()),
        error: (error) =>
          this.alert.error(
            'Error al actualizar',
            typeof error.error === 'string'
              ? error.error
              : error.error?.message || 'No se pudo actualizar la categoría',
          ),
      });
  }

  cancel(): void {
    this.router.navigate(['/inventory/categories']);
  }
}
