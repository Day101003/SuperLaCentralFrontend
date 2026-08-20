import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductFull, ProductRequest } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Product`;
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  getProductsFull(): Observable<ProductFull[]> {
    return this.http.get<ProductFull[]>(`${this.apiUrl}/full`);
  }
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
  createProduct(data: ProductRequest): Observable<{ id_product: number }> {
    return this.http.post<{ id_product: number }>(this.apiUrl, data);
  }
  updateProduct(id: number, data: ProductRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { responseType: 'text' });
  }
  deleteProduct(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  getDeleteBlockers(id: number): Observable<string[]> {
    return forkJoin({
      suppliers: this.http.get<Array<{ id_product: number }>>(
        `${environment.apiUrl}/SupplierProducts`,
      ),
      promotions: this.http.get<Array<{ id_product: number }>>(`${environment.apiUrl}/Promotions`),
      orderDetails: this.http.get<Array<{ id_product: number }>>(
        `${environment.apiUrl}/OrderDetails`,
      ),
    }).pipe(
      map((relations) => {
        const blockers: string[] = [];
        if (relations.suppliers.some((item) => item.id_product === id))
          blockers.push('proveedores asociados');
        if (relations.promotions.some((item) => item.id_product === id))
          blockers.push('promociones asociadas');
        if (relations.orderDetails.some((item) => item.id_product === id))
          blockers.push('órdenes de compra asociadas');
        return blockers;
      }),
    );
  }
}
