import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Supplier, SupplierProductRelation } from '../models/supplier.model';

@Injectable({ providedIn: 'root' })
export class SupplierRelationService {
  private readonly http = inject(HttpClient);
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${environment.apiUrl}/Supplier`);
  }
  getRelations(): Observable<SupplierProductRelation[]> {
    return this.http.get<SupplierProductRelation[]>(`${environment.apiUrl}/SupplierProducts`);
  }
  syncProductSuppliers(productId: number, supplierIds: number[]): Observable<void> {
    const desired = [...new Set(supplierIds)];
    return this.getRelations().pipe(
      switchMap((relations) => {
        const current = relations.filter((r) => r.id_product === productId);
        const remove = current
          .filter((r) => !desired.includes(r.id_supplier))
          .map((r) =>
            this.http.delete(`${environment.apiUrl}/SupplierProducts/${r.id_supplier_product}`, {
              responseType: 'text',
            }),
          );
        const currentIds = new Set(current.map((r) => r.id_supplier));
        const add = desired
          .filter((id) => !currentIds.has(id))
          .map((id) =>
            this.http.post(
              `${environment.apiUrl}/SupplierProducts`,
              { id_supplier: id, id_product: productId },
              { responseType: 'text' },
            ),
          );
        const operations = [...remove, ...add];
        return operations.length ? forkJoin(operations).pipe(map(() => void 0)) : of(void 0);
      }),
    );
  }
}
