import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { CustomersService } from '../services/customers.service';

@Injectable({ providedIn: 'root' })
export class CustomersStore {
  private customersSubject = new BehaviorSubject<Customer[]>([]);
  customers$: Observable<Customer[]> = this.customersSubject.asObservable();

  constructor(private customersService: CustomersService) {}

  loadCustomers(): void {
    this.customersService.getCustomers().subscribe(customers => {
      this.customersSubject.next(customers);
    });
  }

  addCustomer(customer: Customer): void {
    this.customersService.createCustomer(customer).subscribe(newCustomer => {
      const customers = [...this.customersSubject.value, newCustomer];
      this.customersSubject.next(customers);
    });
  }

  updateCustomer(customer: Customer): void {
    this.customersService.updateCustomer(customer.id_customer, customer).subscribe(updateCustomer => {
      const customers = this.customersSubject.value.map(c => c.id_customer === updateCustomer.id_customer ? updateCustomer : c);
      this.customersSubject.next(customers);
    });
  }

  deleteCustomer(id: string): void {
    this.customersService.deleteCustomer(Number(id)).subscribe(() => {
      const customers = this.customersSubject.value.filter(c => c.id_customer !== Number(id));
      this.customersSubject.next(customers);
    });
  }
}
