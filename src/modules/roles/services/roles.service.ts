import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Role } from '../models/role';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Rol`;

  getRoles(): Observable<Role[]> {
    console.log('Cargando roles desde:', this.apiUrl);
    return this.http.get<ApiResponse<Role[]>>(this.apiUrl).pipe(
      map(response => {
        console.log('Roles recibidos del backend:', response);
        // Asegurar que is_active sea booleano
        const roles = response.data.map((role: any) => ({
          ...role,
          is_active: role.is_active === true || role.is_active === 1 || role.is_active === '1' || role.is_active === 'true'
        }));
        return roles;
      }),
      catchError(error => {
        console.error('Error al cargar roles desde API:', error);
        console.error('Status:', error.status);
        console.error('URL intentada:', this.apiUrl);
        if (error.status === 404) {
          console.error('⚠️ El endpoint /api/Rol no existe en el backend');
        }
        return of([]);
      })
    );
  }

  getRoleById(id: number): Observable<Role | null> {
    return this.http.get<ApiResponse<Role>>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        const role = response.data as any;
        return {
          ...role,
          is_active: role.is_active === true || role.is_active === 1 || role.is_active === '1' || role.is_active === 'true'
        };
      }),
      catchError(error => {
        console.error('Error al obtener rol:', error);
        return of(null);
      })
    );
  }

  createRole(role: Partial<Role>): Observable<Role> {
    console.log('Enviando datos para crear rol:', JSON.stringify(role, null, 2));
    return this.http.post<ApiResponse<Role>>(this.apiUrl, role).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error al crear rol - Status:', error.status);
        console.error('Error al crear rol - Body:', error.error);
        throw error;
      })
    );
  }

  updateRole(id: number, role: Partial<Role>): Observable<Role> {
    // Incluir id_rol en el body como requiere el backend
    const dataToSend = {
      id_rol: id,
      ...role
    };
    console.log('Enviando datos para actualizar rol:', JSON.stringify(dataToSend, null, 2));
    return this.http.put<ApiResponse<Role>>(`${this.apiUrl}/${id}`, dataToSend).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error al actualizar rol - Status:', error.status);
        console.error('Error al actualizar rol - Body:', error.error);
        throw error;
      })
    );
  }

  deleteRole(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
