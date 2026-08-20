import { Injectable, computed, inject, signal } from '@angular/core';
import { Category, CategoryRequest } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { AlertService } from '../../../app/shared/services/alert.service';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class CategoriesStore {
  private readonly service = inject(CategoryService);
  private readonly alert = inject(AlertService);
  private readonly state = signal<CategoriesState>({ categories: [], loading: false, error: null });
  categories = computed(() => this.state().categories);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  withDescriptionCount = computed(
    () => this.state().categories.filter((c) => !!c.category_description?.trim()).length,
  );

  loadCategories(): void {
    this.state.update((s) => ({ ...s, loading: true, error: null }));
    this.service.getCategories().subscribe({
      next: (categories) => this.state.update((s) => ({ ...s, categories, loading: false })),
      error: (error) => this.setError(error, 'Error al cargar las categorías'),
    });
  }
  createCategory(data: CategoryRequest, done?: () => void): void {
    this.state.update((s) => ({ ...s, loading: true, error: null }));
    this.service.createCategory(data).subscribe({
      next: () => {
        this.loadCategories();
        this.alert.success('Categoría creada', 'La categoría se creó correctamente');
        done?.();
      },
      error: (e) => this.setError(e, 'Error al crear la categoría'),
    });
  }
  updateCategory(id: number, data: CategoryRequest, done?: () => void): void {
    this.state.update((s) => ({ ...s, loading: true, error: null }));
    this.service.updateCategory(id, data).subscribe({
      next: () => {
        this.loadCategories();
        this.alert.success('Categoría actualizada', 'Los cambios se guardaron correctamente');
        done?.();
      },
      error: (e) => this.setError(e, 'Error al actualizar la categoría'),
    });
  }
  deleteCategory(id: number): void {
    this.state.update((s) => ({ ...s, loading: true, error: null }));
    this.service.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories();
        this.alert.success('Categoría eliminada', 'La categoría se eliminó correctamente');
      },
      error: (e) =>
        this.setError(e, 'No se pudo eliminar la categoría; podría tener productos asociados'),
    });
  }
  private setError(error: any, fallback: string): void {
    const message =
      typeof error.error === 'string' ? error.error : error.error?.message || fallback;
    this.state.update((s) => ({ ...s, loading: false, error: message }));
    this.alert.error('Error', message);
  }
}
