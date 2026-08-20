import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CustomersStore } from '../../store/customer.store';
import { Customer } from '../../models/customer';
import { CustomerFormComponent } from '../../components/customer-form/customer-form.component';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [CommonModule, RouterLink, CustomerFormComponent],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css'
})
export class EditCustomerComponent implements OnInit, AfterViewInit {
  private customersStore = inject(CustomersStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = false;
  errorMessage = '';
  successMessage = '';
  customerData: Customer | null = null;
  customerId: number | null = null;

  // Datos mock temporales (mientras el backend no esté disponible)
  private mockUsers: Customer[] = [
    {
      id_customer: 1,
      customer_name: 'Juan',
      last_name: 'Pérez',
      email: 'juan@example.com',
      identity_card: '123456789',
      image: '',
      customer_status: 1,
      registration_date: '2024-01-01',
      age: 28,
      customer_description: 'Cliente VIP'
    },
    {
      id_customer: 2,
      customer_name: 'María',
      last_name: 'González',
      customer_description: 'Cliente frecuente',
      identity_card: '987654321',
      age: 30,
      image: '',
      email: 'maria@example.com',
      registration_date: '2024-01-15',
      customer_status: 1,
    },
    {
      id_customer: 3,
      customer_name: 'Carlos',
      last_name: 'Rodríguez',
      customer_description: 'Cliente nuevo',
      identity_card: '555555555',
      age: 25,
      image: '',
      email: 'carlos@example.com',
      customer_status: 0,
      registration_date: '2024-02-01'
    },
    {
      id_customer: 4,
      customer_name: 'Carlos',
      last_name: 'Rodríguez',
      customer_description: 'Cliente nuevo',
      identity_card: '555555555',
      age: 25,
      image: '',
      email: 'carlos@example.com',
      customer_status: 0,
      registration_date: '2024-02-01'
    },
    {
      id_customer: 5,
      customer_name: 'Luis',
      last_name: 'Sánchez',
      customer_description: 'Cliente frecuente',
      identity_card: '333333333',
      age: 35,
      image: '',
      email: 'luis@example.com',
      customer_status: 1,
      registration_date: '2024-03-01'
    }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.customerId = +params['id'];
      if (this.customerId) {
        this.loadCustomerData();
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const feather = (globalThis as any).feather;

      if (feather?.icons && typeof feather.replace === 'function') {
        feather.replace();
      }
    }, 100);
  }


  loadCustomerData(): void {
    if (!this.customerId) return;

    this.loading = true;
    this.errorMessage = '';

    this.customersStore.customers$.subscribe({
      next: (customers) => {
        const customer = customers.find(c => c.id_customer === this.customerId);

        if (customer) {
          this.customerData = customer;
        } else {
          this.errorMessage = 'Cliente no encontrado';
        }

        this.loading = false;

        setTimeout(() => {
          const feather = (globalThis as any).feather;

          if (feather?.icons && typeof feather.replace === 'function') {
            feather.replace();
          }
        }, 100);
      },

      error: () => {
        this.errorMessage = 'Error al cargar los datos del cliente';
        this.loading = false;
      }
    });

    this.customersStore.loadCustomers();
  }

  onFormSubmit(formData: any): void {
    if (!this.customerId) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Datos del formulario antes de enviar:', formData);

    const customerToUpdate = { ...formData, id_customer: this.customerId };
    this.customersStore.updateCustomer(customerToUpdate);
    this.successMessage = 'Cliente actualizado exitosamente';
    this.loading = false;
    setTimeout(() => {
      this.router.navigate(['/customers']);
    }, 2000);
  }

  onFormCancel(): void {
    this.router.navigate(['/customers']);
  }
}
