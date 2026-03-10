import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DataTableComponent, TableColumn, TableAction } from '../../../shared/components/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination.component';
import { usePagination } from '../../../shared/composables/use-pagination';
import { UsersStore } from '../store/users.store';
import { User } from '../models/user';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DataTableComponent, PaginationComponent],
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit {
  private usersStore = inject(UsersStore);
  private router = inject(Router);
  
  users = signal<User[]>([]);
  loading = signal(false);
  error = signal('');

 
  tableColumns: TableColumn[] = [
    
    { 
      key: 'name_user', 
      label: 'Nombre Completo', 
      sortable: true,
      render: (value: string, row: User) => {
        return `${row.name_user} ${row.lastname}`;
      }
    },
    { key: 'email', label: 'Correo Electrónico', sortable: true },
    { key: 'phone', label: 'Teléfono', sortable: true },
    { 
      key: 'rol_name', 
      label: 'Rol', 
      sortable: true,
      render: (value: string) => {
        const colors: Record<string, string> = {
          'Admin': 'bg-[#fefce8] text-[rgb(30,27,75)]',
          'Editor': 'bg-purple-100 text-purple-800',
          'Usuario': 'bg-gray-100 text-gray-800'
        };
        return `<span class="px-3 py-1 rounded-full text-xs font-semibold ${colors[value] || colors['Usuario']}">${value}</span>`;
      }
    },
    { 
      key: 'is_active', 
      label: 'Estado', 
      sortable: true,
      render: (value: boolean) => {
        const bgColor = value ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800';
        const text = value ? 'Activo' : 'Inactivo';
        return `<span class="px-3 py-1 rounded-full text-xs font-semibold ${bgColor}">${text}</span>`;
      }
    }
  ];

  tableActions: TableAction[] = [
    {
      icon: 'edit-2',
      label: 'Editar',
      class: 'bg-[rgb(30,27,75)] hover:bg-[rgb(40,37,95)] text-white',
      handler: (user: User) => this.editUser(user)
    },
    {
      icon: 'trash-2',
      label: 'Eliminar',
      class: 'bg-red-50 hover:bg-red-100 text-red-600',
      handler: (user: User) => this.deleteUser(user)
    }
  ];


  pagination = usePagination<User>([], 10);

  
  activeUsersCount = computed(() => this.users().filter(u => u.is_active).length);
  inactiveUsersCount = computed(() => this.users().filter(u => !u.is_active).length);

  ngOnInit(): void {
    this.loading.set(true);
    this.error.set('');
    this.usersStore.users$.subscribe({
      next: (users) => {
        this.users.set(users);
        this.pagination.setItems(users);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los usuarios del store');
        this.loading.set(false);
      }
    });
    this.usersStore.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set('');
    this.usersStore.loadUsers();
  }

  onSearch(query: string): void {
    this.pagination.setSearchQuery(query);
  }

  onPageChange(page: number): void {
    this.pagination.setPage(page);
  }

  editUser(user: User): void {
    console.log('Editar usuario:', user);
    this.router.navigate(['/users/editar', user.id_user]);
  }

  deleteUser(user: User): void {
    console.log('Eliminar usuario:', user);
    const fullName = `${user.name_user} ${user.lastname}`;
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario ${fullName}?`)) {
      this.loading.set(true);
      this.usersStore.deleteUser(user.id_user.toString());
    }
  }
}
