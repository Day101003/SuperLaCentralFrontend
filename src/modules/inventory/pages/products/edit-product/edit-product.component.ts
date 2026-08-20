import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, finalize, switchMap } from 'rxjs';
import { AlertService } from '../../../../../app/shared/services/alert.service';
import { ProductFormComponent } from '../../../components/product-form/product-form.component';
import { Category } from '../../../models/category.model';
import { Product, ProductFormValue } from '../../../models/product.model';
import { Supplier } from '../../../models/supplier.model';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { SupplierRelationService } from '../../../services/supplier-relation.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductFormComponent],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);
  private readonly categoriesService = inject(CategoryService);
  private readonly productsService = inject(ProductService);
  private readonly relationsService = inject(SupplierRelationService);
  product = signal<Product | null>(null);
  categories = signal<Category[]>([]);
  suppliers = signal<Supplier[]>([]);
  selectedSupplierIds: number[] = [];
  loading = true;
  saving = false;
  productId = 0;
  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(this.productId) || this.productId <= 0) {
      this.alert.error('Producto inválido');
      this.onCancel();
      return;
    }
    forkJoin({
      product: this.productsService.getProductById(this.productId),
      categories: this.categoriesService.getCategories(),
      suppliers: this.relationsService.getSuppliers(),
      relations: this.relationsService.getRelations(),
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (result) => {
          this.product.set(result.product);
          this.categories.set(result.categories);
          this.suppliers.set(result.suppliers);
          this.selectedSupplierIds = [
            ...new Set(
              result.relations
                .filter((r) => r.id_product === this.productId)
                .map((r) => r.id_supplier),
            ),
          ];
        },
        error: () => this.alert.error('Error', 'No se pudo cargar la información del producto'),
      });
  }
  onSubmit(data: ProductFormValue): void {
    this.saving = true;
    const { supplier_ids, ...product } = data;
    this.productsService
      .updateProduct(this.productId, product)
      .pipe(
        switchMap(() => this.relationsService.syncProductSuppliers(this.productId, supplier_ids)),
        finalize(() => (this.saving = false)),
      )
      .subscribe({
        next: () =>
          this.alert
            .success('Producto actualizado', 'Los cambios se guardaron correctamente')
            .then(() => this.onCancel()),
        error: (error) =>
          this.alert.error(
            'Error al actualizar',
            typeof error.error === 'string' ? error.error : 'No se pudo actualizar el producto',
          ),
      });
  }
  onCancel(): void {
    this.router.navigate(['/inventory/products']);
  }
}
