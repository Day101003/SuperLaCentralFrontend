import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AlertService } from '../../../../../app/shared/services/alert.service';
import { CategoryFormComponent } from '../../../components/category-form/category-form.component';
import { CategoryRequest } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [RouterLink, CategoryFormComponent],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.css',
})
export class CreateCategoryComponent {
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);
  private readonly alert = inject(AlertService);
  loading = false;

  submit(data: CategoryRequest): void {
    this.loading = true;
    this.categoryService
      .createCategory(data)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () =>
          this.alert
            .success('Categoría creada', 'La categoría se creó correctamente')
            .then(() => this.cancel()),
        error: (error) =>
          this.alert.error(
            'Error al crear',
            typeof error.error === 'string'
              ? error.error
              : error.error?.message || 'No se pudo crear la categoría',
          ),
      });
  }

  cancel(): void {
    this.router.navigate(['/inventory/categories']);
  }
}
