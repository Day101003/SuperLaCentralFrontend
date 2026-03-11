import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user';

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/User`;

  getUsers(): Observable<User[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        console.log('Usuarios recibidos del backend:', response.data);
        // Asegurar que is_active sea booleano
        const users = response.data.map((user: any) => {
          const isActiveValue = user.is_active;
          console.log(`Usuario ${user.id_user}: is_active =`, isActiveValue, typeof isActiveValue);
          return {
            ...user,
            is_active: isActiveValue === true || isActiveValue === 1 || isActiveValue === '1' || isActiveValue === 'true'
          };
        });
        console.log('Usuarios procesados:', users);
        return users;
      })
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        console.log('Usuario recibido del backend:', response.data);
        // Asegurar que is_active sea booleano
        const isActiveValue = response.data.is_active;
        console.log(`Usuario ${response.data.id_user}: is_active =`, isActiveValue, typeof isActiveValue);
        const user = {
          ...response.data,
          is_active: isActiveValue === true || isActiveValue === 1 || isActiveValue === '1' || isActiveValue === 'true'
        };
        console.log('Usuario procesado:', user);
        return user;
      })
    );
  }

  createUser(userData: any): Observable<any> {
    // Convertir is_active a 1 o 0 para el backend .NET
    const dataToSend = {
      ...userData,
      is_active: userData.is_active ? 1 : 0
    };
    
    return this.http.post<ApiResponse<any>>(this.apiUrl, dataToSend).pipe(
      map(response => response.data)
    );
  }

  updateUser(id: number, userData: any): Observable<any> {
    console.log('Actualizando usuario:', id, userData);
    console.log('URL:', `${this.apiUrl}/${id}`);
    console.log('Datos originales:', userData);
    
    // Construir el objeto UpdateUserDto exactamente como lo espera el backend
    const updateDto: any = {
      name_user: userData.name_user,
      lastname: userData.lastname,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      identity_card: userData.identity_card,
      id_rol: Number(userData.id_rol),
      is_active: Boolean(userData.is_active)  
    };

   
    if (userData.image !== undefined && userData.image !== null && userData.image !== '') {
      updateDto.image = userData.image;
    }

  
    if (userData.password_user && userData.password_user.trim() !== '') {
      updateDto.password_user = userData.password_user;
    }
    
    console.log('Datos a enviar al backend:', updateDto);
    console.log('Tipo de is_active:', typeof updateDto.is_active, 'Valor:', updateDto.is_active);
    console.log('Tipo de id_rol:', typeof updateDto.id_rol, 'Valor:', updateDto.id_rol);
    console.log('JSON a enviar:', JSON.stringify(updateDto, null, 2));
    
   
    return this.http.put<any>(`${this.apiUrl}/${id}`, updateDto);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }
}
