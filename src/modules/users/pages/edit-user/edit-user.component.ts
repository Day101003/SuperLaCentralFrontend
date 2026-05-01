import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { UsersStore } from '../../store/users.store';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { User } from '../../models/user';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, RouterLink, UserFormComponent],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit, AfterViewInit {
  private usersStore = inject(UsersStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = false;
  errorMessage = '';
  successMessage = '';
  userData: User | null = null;
  userId: number | null = null;

  // Datos mock temporales (mientras el backend no esté disponible)
  private mockUsers: User[] = [
    { 
      id_user: 1, 
      name_user: 'Juan', 
      lastname: 'Pérez', 
      email: 'juan@example.com', 
      phone: '12345678',
      address: 'San José, Costa Rica',
      identity_card: '123456789',
      image: '',
      is_active: true,
      date_time: '2024-01-01',
      rol_name: 'Admin',
      id_rol: 1
    },
    { 
      id_user: 2, 
      name_user: 'María', 
      lastname: 'González', 
      email: 'maria@example.com', 
      phone: '87654321',
      address: 'Heredia, Costa Rica',
      identity_card: '987654321',
      image: '',
      is_active: true,
      date_time: '2024-01-15',
      rol_name: 'Usuario',
      id_rol: 2
    },
    { 
      id_user: 3, 
      name_user: 'Carlos', 
      lastname: 'Rodríguez', 
      email: 'carlos@example.com', 
      phone: '55555555',
      address: 'Cartago, Costa Rica',
      identity_card: '555555555',
      image: '',
      is_active: false,
      date_time: '2024-02-01',
      rol_name: 'Editor',
      id_rol: 3
    },
    { 
      id_user: 4, 
      name_user: 'Ana', 
      lastname: 'Martínez', 
      email: 'ana@example.com', 
      phone: '44444444',
      address: 'Alajuela, Costa Rica',
      identity_card: '444444444',
      image: '',
      is_active: true,
      date_time: '2024-02-10',
      rol_name: 'Usuario',
      id_rol: 2
    },
    { 
      id_user: 5, 
      name_user: 'Luis', 
      lastname: 'Sánchez', 
      email: 'luis@example.com', 
      phone: '33333333',
      address: 'Puntarenas, Costa Rica',
      identity_card: '333333333',
      image: '',
      is_active: true,
      date_time: '2024-03-01',
      rol_name: 'Admin',
      id_rol: 1
    }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      if (this.userId) {
        this.loadUserData();
      }
    });
  }

  ngAfterViewInit(): void {
    // Initialize Feather Icons
    if ((globalThis as any).feather) {
      (globalThis as any).feather.replace();
    }
  }

  loadUserData(): void {
    if (!this.userId) return;

    this.loading = true;
    this.errorMessage = '';
    
    this.loading = true;
    this.errorMessage = '';
    this.usersStore.users$.subscribe({
      next: (users) => {
        const user = users.find(u => u.id_user === this.userId);
        if (user) {
          this.userData = user;
        }
        this.loading = false;
        setTimeout(() => {
          if ((globalThis as any).feather) {
            (globalThis as any).feather.replace();
          }
        }, 0);
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los datos del usuario';
        this.loading = false;
      }
    });
    this.usersStore.loadUsers();
  }

  onFormSubmit(formData: any): void {
    if (!this.userId) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Datos del formulario antes de enviar:', formData);

    const userToUpdate = { ...formData, id_user: this.userId };
    this.usersStore.updateUser(userToUpdate);
    this.successMessage = 'Usuario actualizado exitosamente';
    this.loading = false;
    setTimeout(() => {
      this.router.navigate(['/users']);
    }, 2000);
  }

  onFormCancel(): void {
    this.router.navigate(['/users']);
  }
}
