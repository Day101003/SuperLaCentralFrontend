import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Customer`;

  getCustomers(): Observable<Customer[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        console.log('Respuesta completa clientes:', response);

        const data = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        return data.map((customer: any) => ({
          ...customer,
          customer_status: Number(customer.customer_status) === 1 ? 1 : 0
        }));
      })
    );
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        const customer = response?.data ?? response;

        return {
          ...customer,
          customer_status: Number(customer.customer_status) === 1 ? 1 : 0
        };
      })
    );
  }

  createCustomer(customerData: any): Observable<Customer> {
    const dataToSend = {
      ...customerData,
      customer_status: Number(customerData.customer_status) === 1 ? 1 : 0
    };

    console.log('Creando cliente:', dataToSend);

    return this.http.post<any>(this.apiUrl, dataToSend).pipe(
      map(response => {
        console.log('Respuesta crear:', response);
        return response?.data ?? response;
      })
    );
  }

  updateCustomer(id: number, customerData: any): Observable<Customer> {
    const updateDto = {
      customer_name: customerData.customer_name,
      last_name: customerData.last_name,
      customer_description: customerData.customer_description,
      identity_card: customerData.identity_card,
      age: Number(customerData.age),
      image: customerData.image ?? '',
      email: customerData.email,
      customer_status: Number(customerData.customer_status) === 1 ? 1 : 0
    };
    console.log('Actualizando cliente:', id);
    console.log('Datos a enviar:', updateDto);

    return this.http.put<any>(`${this.apiUrl}/${id}`, updateDto).pipe(
      map(response => response?.data ?? response)
    );
  }

  deleteCustomer(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    });
  }
}