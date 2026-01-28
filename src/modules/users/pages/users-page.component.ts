import { Component, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataTableComponent, TableColumn, TableAction } from '../../../shared/components/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination.component';
import { usePagination } from '../../../shared/composables/use-pagination';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
}

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DataTableComponent, PaginationComponent],
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements AfterViewInit {
  // Datos de ejemplo
  private mockUsers: User[] = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin', status: 'Activo' },
    { id: 2, name: 'María González', email: 'maria@example.com', role: 'Usuario', status: 'Activo' },
    { id: 3, name: 'Carlos Rodríguez', email: 'carlos@example.com', role: 'Editor', status: 'Inactivo' },
    { id: 4, name: 'Ana Martínez', email: 'ana@example.com', role: 'Usuario', status: 'Activo' },
    { id: 5, name: 'Luis Sánchez', email: 'luis@example.com', role: 'Admin', status: 'Activo' },
    { id: 6, name: 'Patricia López', email: 'patricia@example.com', role: 'Editor', status: 'Activo' },
    { id: 7, name: 'Roberto Díaz', email: 'roberto@example.com', role: 'Usuario', status: 'Inactivo' },
    { id: 8, name: 'Laura Torres', email: 'laura@example.com', role: 'Usuario', status: 'Activo' },
  ];

  // Configuración de la tabla
  tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'email', label: 'Correo Electrónico', sortable: true },
    { 
      key: 'role', 
      label: 'Rol', 
      sortable: true,
      render: (value: string) => {
        const colors: Record<string, string> = {
          'Admin': 'bg-blue-100 text-blue-800',
          'Editor': 'bg-purple-100 text-purple-800',
          'Usuario': 'bg-gray-100 text-gray-800'
        };
        return `<span class="px-3 py-1 rounded-full text-xs font-semibold ${colors[value] || colors['Usuario']}">${value}</span>`;
      }
    },
    { 
      key: 'status', 
      label: 'Estado', 
      sortable: true,
      render: (value: string) => {
        const isActive = value === 'Activo';
        const bgColor = isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800';
        return `<span class="px-3 py-1 rounded-full text-xs font-semibold ${bgColor}">${value}</span>`;
      }
    }
  ];

  tableActions: TableAction[] = [
    {
      icon: 'edit-2',
      label: 'Editar',
      class: 'bg-blue-50 hover:bg-blue-100 text-blue-600',
      handler: (user: User) => this.editUser(user)
    },
    {
      icon: 'trash-2',
      label: 'Eliminar',
      class: 'bg-red-50 hover:bg-red-100 text-red-600',
      handler: (user: User) => this.deleteUser(user)
    }
  ];

  // Paginación
  pagination = usePagination(this.mockUsers, 5);
  
  constructor() {
    // Efecto para actualizar los iconos cuando cambien los datos
    effect(() => {
      // Acceder a las señales para que el efecto se ejecute cuando cambien
      this.pagination.paginatedItems();
      setTimeout(() => this.updateFeatherIcons(), 0);
    });
  }

  ngAfterViewInit(): void {
    this.updateFeatherIcons();
  }

  private updateFeatherIcons(): void {
    if ((globalThis as any).feather) {
      (globalThis as any).feather.replace();
    }
  }

  onSearch(query: string): void {
    this.pagination.setSearchQuery(query);
  }

  onPageChange(page: number): void {
    this.pagination.setPage(page);
  }

  editUser(user: User): void {
    console.log('Editar usuario:', user);
    // Implementar lógica de edición
  }

  deleteUser(user: User): void {
    console.log('Eliminar usuario:', user);
    // Implementar lógica de eliminación
  }
}
