import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CustomersStore} from '../../store/customer.store';
import { CustomerFormComponent } from '../../components/customer-form/customer-form.component';

@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [CommonModule, RouterLink, CustomerFormComponent],
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.css'
})
export class CreateCustomerComponent implements AfterViewInit {
  private customersStore = inject(CustomersStore);
  private router = inject(Router);

  loading = false;
  errorMessage = '';
  successMessage = '';

  ngAfterViewInit(): void {
  
    if ((globalThis as any).feather) {
      (globalThis as any).feather.replace();
    }
  }

  onFormSubmit(formData: any): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

  this.customersStore.addCustomer(formData);
    this.successMessage = 'Cliente creado exitosamente';
    this.loading = false;
    setTimeout(() => {
      this.router.navigate(['/customers']);
    }, 2000);
  }

  onFormCancel(): void {
    this.router.navigate(['/customers']);
  }
}
