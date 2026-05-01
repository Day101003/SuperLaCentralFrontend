import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DataTableComponent, TableColumn, TableAction } from '../../../shared/components/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination.component';
import { usePagination } from '../../../shared/composables/use-pagination';
import { RolesStore } from '../store/roles.store';
import { Role } from '../models/role';
import { RoleFormSidebarComponent } from '../components/role-form-sidebar/role-form-sidebar.component';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DataTableComponent, PaginationComponent, RoleFormSidebarComponent],
  templateUrl: './roles-page.component.html',
  styleUrl: './roles-page.component.css'
})
export class RolesPageComponent implements OnInit {
  private readonly rolesStore = inject(RolesStore);
  private readonly router = inject(Router);

  
  roles = this.rolesStore.roles;
  loading = this.rolesStore.loading;
  error = this.rolesStore.error;

 
  activeRolesCount = this.rolesStore.activeRolesCount;
  inactiveRolesCount = this.rolesStore.inactiveRolesCount;

  
  pagination = usePagination<Role>([], 10);

  constructor() {
    
    effect(() => {
      const currentRoles = this.roles();
      if (currentRoles.length > 0) {
        this.pagination.setItems(currentRoles);
      }
    });
  }

  
  tableColumns: TableColumn[] = [
    {
      key: 'id_rol',
      label: 'ID',
      sortable: true
    },
    {
      key: 'rol_name',
      label: 'Nombre',
      sortable: true
    },
    {
      key: 'description_rol',
      label: 'Descripción'
    },
    {
      key: 'is_active',
      label: 'Estado',
      render: (value: any) => {
        const isActive = value === true || value === 1 || value === '1' || value === 'true';
        return isActive
          ? '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Activo</span>'
          : '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactivo</span>';
      }
    }
  ];


  tableActions: TableAction[] = [
    {
      icon: 'edit-2',
      label: 'Editar',
      class: 'edit',
      handler: (role: Role) => this.editRole(role)
    },
    {
      icon: 'trash-2',
      label: 'Eliminar',
      class: 'delete',
      handler: (role: Role) => this.deleteRole(role)
    }
  ];

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.rolesStore.loadRoles();
  }

  editRole(role: Role): void {
    this.openSidebar(role);
  }

  deleteRole(role: Role): void {
    if (confirm(`¿Está seguro que desea eliminar el rol "${role.rol_name}"?`)) {
      this.rolesStore.deleteRole(role.id_rol);
    }
  }

  onSearch(searchTerm: string): void {
    this.pagination.setSearchQuery(searchTerm);
  }

  onPageChange(page: number): void {
    this.pagination.setPage(page);
  }

  showSidebar = false;
  editingRole: Role | null = null;

  openSidebar(role?: Role) {
    this.showSidebar = true;
    this.editingRole = role ?? null;
  }

  closeSidebar() {
    this.showSidebar = false;
    this.editingRole = null;
  }
}
