import { CommonModule } from '@angular/common';
import { Component, OnInit, effect, inject } from '@angular/core';
import {
  DataTableComponent,
  TableAction,
  TableColumn,
} from '../../../../../shared/components/data-table.component';
import { PaginationComponent } from '../../../../../shared/components/pagination.component';
import { usePagination } from '../../../../../shared/composables/use-pagination';
import { Category } from '../../../models/category.model';
import { CategoriesStore } from '../../../store/categories.store';
import { Router } from '@angular/router';
import { AlertService } from '../../../../../app/shared/services/alert.service';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, DataTableComponent, PaginationComponent],
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css'],
})
export class CategoriesPageComponent implements OnInit {
  private readonly store = inject(CategoriesStore);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);
  categories = this.store.categories;
  loading = this.store.loading;
  error = this.store.error;
  withDescriptionCount = this.store.withDescriptionCount;
  pagination = usePagination<Category>([], 5);
  tableColumns: TableColumn[] = [
    { key: 'category_name', label: 'Nombre', sortable: true },
    { key: 'category_description', label: 'Descripción' },
  ];
  tableActions: TableAction[] = [
    {
      icon: 'edit-2',
      label: 'Editar',
      class: 'bg-[rgb(30,27,75)] hover:bg-[rgb(40,37,95)] text-white',
      handler: (category) => this.editCategory(category),
    },
    {
      icon: 'trash-2',
      label: 'Eliminar',
      class: 'delete',
      handler: (category) => this.deleteCategory(category),
    },
  ];
  constructor() {
    effect(() => this.pagination.setItems(this.categories()));
  }
  ngOnInit(): void {
    this.loadCategories();
  }
  loadCategories(): void {
    this.store.loadCategories();
  }
  editCategory(category: Category): void {
    this.router.navigate(['/inventory/categories/edit', category.id_category]);
  }
  deleteCategory(category: Category): void {
    this.alert
      .confirm('¿Eliminar categoría?', `Se eliminará "${category.category_name}"`)
      .then((result) => {
        if (result.isConfirmed) this.store.deleteCategory(category.id_category);
      });
  }
  onSearch(term: string): void {
    this.pagination.setSearchQuery(term);
  }
  onPageChange(page: number): void {
    this.pagination.setPage(page);
  }
  createCategory(): void {
    this.router.navigate(['/inventory/categories/create']);
  }
}
