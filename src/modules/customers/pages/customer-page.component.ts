import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DataTableComponent, TableColumn, TableAction } from '../../../shared/components/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination.component';
import { usePagination } from '../../../shared/composables/use-pagination';
import { CustomersStore } from '../store/customer.store';
import { Customer } from '../models/customer';
import { AlertService } from '../../../app/shared/services/alert.service';

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DataTableComponent, PaginationComponent],
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.css']
})
export class CustomersPageComponent implements OnInit {
  private customersStore = inject(CustomersStore);
  private router = inject(Router);
  private alert = inject(AlertService);

  customers = signal<Customer[]>([]);
  loading = signal(false);
  error = signal('');

  tableColumns: TableColumn[] = [
    {
      key: 'customer_name',
      label: 'Nombre Completo',
      sortable: true,
      render: (value: string, row: Customer) => {
        return `${row.customer_name} ${row.last_name}`;
      }
    },
    {
      key: 'email',
      label: 'Correo Electrónico',
      sortable: true
    },
    {
      key: 'identity_card',
      label: 'Cédula',
      sortable: true
    },
    {
      key: 'age',
      label: 'Edad',
      sortable: true
    },
    {
      key: 'customer_status',
      label: 'Estado',
      sortable: true,
      render: (value: number) => {
        const bgColor = value === 1
          ? 'bg-emerald-100 text-emerald-800'
          : 'bg-red-100 text-red-800';

        const text = value === 1 ? 'Activo' : 'Inactivo';

        return `<span class="px-3 py-1 rounded-full text-xs font-semibold ${bgColor}">${text}</span>`;
      }
    }
  ];

  tableActions: TableAction[] = [
    {
      icon: 'edit-2',
      label: 'Editar',
      class: 'bg-[rgb(30,27,75)] hover:bg-[rgb(40,37,95)] text-white',
      handler: (customer: Customer) => this.editCustomer(customer)
    },
    {
      icon: 'trash-2',
      label: 'Eliminar',
      class: 'bg-red-50 hover:bg-red-100 text-red-600',
      handler: (customer: Customer) => this.deleteCustomer(customer)
    }
  ];

  pagination = usePagination<Customer>([], 10);

  activeCustomersCount = computed(() =>
    this.customers().filter(customer => customer.customer_status === 1).length
  );

  inactiveCustomersCount = computed(() =>
    this.customers().filter(customer => customer.customer_status !== 1).length
  );

  newCustomersThisMonthCount = computed(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return this.customers().filter(customer => {
      if (!customer.registration_date) return false;

      const date = new Date(customer.registration_date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
  });

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading.set(true);
    this.error.set('');

    this.customersStore.customers$.subscribe({
      next: (customers) => {
        this.customers.set(customers);
        this.pagination.setItems(customers);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar los clientes del store');
        this.loading.set(false);
        this.alert.error('Error', 'No se pudieron cargar los clientes');
      }
    });

    this.customersStore.loadCustomers();
  }

  onSearch(query: string): void {
    this.pagination.setSearchQuery(query);
  }

  onPageChange(page: number): void {
    this.pagination.setPage(page);
  }

  editCustomer(customer: Customer): void {
    this.router.navigate(['/customers/editar', customer.id_customer]);
  }

  deleteCustomer(customer: Customer): void {
    const fullName = `${customer.customer_name} ${customer.last_name}`;

    this.alert.confirm(
      '¿Eliminar cliente?',
      `Se eliminará a ${fullName}`
    ).then(result => {
      if (result.isConfirmed) {
        this.loading.set(true);

        this.customersStore.deleteCustomer(customer.id_customer.toString());

        this.alert.success(
          'Eliminado',
          'Cliente eliminado correctamente'
        );
      }
    });
  }
}