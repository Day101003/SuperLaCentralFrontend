import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UsersStore } from '../../store/users.store';
import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, RouterLink, UserFormComponent],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements AfterViewInit {
  private usersStore = inject(UsersStore);
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

    this.usersStore.addUser(formData);
    this.successMessage = 'Usuario creado exitosamente';
    this.loading = false;
    setTimeout(() => {
      this.router.navigate(['/users']);
    }, 2000);
  }

  onFormCancel(): void {
    this.router.navigate(['/users']);
  }
}
