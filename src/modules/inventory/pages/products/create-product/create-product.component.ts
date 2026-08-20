import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize, forkJoin, switchMap } from 'rxjs';
import { AlertService } from '../../../../../app/shared/services/alert.service';
import { ProductFormComponent } from '../../../components/product-form/product-form.component';
import { Category } from '../../../models/category.model';
import { ProductFormValue } from '../../../models/product.model';
import { Supplier } from '../../../models/supplier.model';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { SupplierRelationService } from '../../../services/supplier-relation.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductFormComponent],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent implements OnInit {
  private readonly categoriesService = inject(CategoryService);
  private readonly productsService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);
  private readonly relationsService = inject(SupplierRelationService);
  categories = signal<Category[]>([]);
  suppliers = signal<Supplier[]>([]);
  loading = false;
  ngOnInit(): void {
    forkJoin({
      categories: this.categoriesService.getCategories(),
      suppliers: this.relationsService.getSuppliers(),
    }).subscribe({
      next: (data) => {
        this.categories.set(data.categories);
        this.suppliers.set(data.suppliers);
      },
      error: () => this.alert.error('Error', 'No se pudieron cargar los datos del formulario'),
    });
  }
  onSubmit(data: ProductFormValue): void {
    this.loading = true;
    const { supplier_ids, ...product } = data;
    this.productsService
      .createProduct(product)
      .pipe(
        switchMap((result) =>
          this.relationsService.syncProductSuppliers(result.id_product, supplier_ids),
        ),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next: () =>
          this.alert
            .success('Producto creado', 'El producto se creó correctamente')
            .then(() => this.onCancel()),
        error: (error) =>
          this.alert.error(
            'Error al crear',
            typeof error.error === 'string' ? error.error : 'No se pudo crear el producto',
          ),
      });
  }
  onCancel(): void {
    this.router.navigate(['/inventory/products']);
  }
}
