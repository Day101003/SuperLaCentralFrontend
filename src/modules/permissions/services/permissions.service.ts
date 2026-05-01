import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Permission } from '../models/permission';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Permission`;

  getPermissions(): Observable<Permission[]> {
    return this.http.get<ApiResponse<Permission[]>>(this.apiUrl).pipe(
      map(response => {
        return response.data.map((permission: any) => ({
          ...permission,
          is_active: permission.is_active === true || permission.is_active === 1 || permission.is_active === '1' || permission.is_active === 'true'
        }));
      }),
      catchError(error => {
        console.error('Error al cargar permisos desde API:', error);
        if (error.status === 404) {
          console.error('⚠️ El endpoint /api/Permission no existe en el backend');
        }
        return of([]);
      })
    );
  }

  getPermissionById(id: number): Observable<Permission | null> {
    return this.http.get<ApiResponse<Permission>>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        const permission = response.data as any;
        return {
          ...permission,
          is_active: permission.is_active === true || permission.is_active === 1 || permission.is_active === '1' || permission.is_active === 'true'
        };
      }),
      catchError(error => {
        console.error('Error al obtener permiso:', error);
        return of(null);
      })
    );
  }

  createPermission(permission: Partial<Permission>): Observable<Permission> {
    return this.http.post<ApiResponse<Permission>>(this.apiUrl, permission).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error al crear permiso - Status:', error.status);
        console.error('Error al crear permiso - Body:', error.error);
        throw error;
      })
    );
  }

  updatePermission(id: number, permission: Partial<Permission>): Observable<Permission> {
    const dataToSend = {
      id_permission: id,
      ...permission
    };
    return this.http.put<ApiResponse<Permission>>(`${this.apiUrl}/${id}`, dataToSend).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error al actualizar permiso - Status:', error.status);
        console.error('Error al actualizar permiso - Body:', error.error);
        throw error;
      })
    );
  }

  deletePermission(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
