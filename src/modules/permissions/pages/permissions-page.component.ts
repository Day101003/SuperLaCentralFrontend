import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataTableComponent, TableColumn, TableAction } from '../../../shared/components/data-table.component';
import { PaginationComponent } from '../../../shared/components/pagination.component';
import { usePagination } from '../../../shared/composables/use-pagination';
import { PermissionsStore } from '../store/permissions.store';
import { Permission } from '../models/permission';
import { PermissionFormSidebarComponent } from '../components/permission-form-sidebar/permission-form-sidebar.component';

@Component({
  selector: 'app-permissions-page',
  standalone: true,
  imports: [CommonModule, DataTableComponent, PaginationComponent, PermissionFormSidebarComponent],
  templateUrl: './permissions-page.component.html',
  styleUrl: './permissions-page.component.css'
})
export class PermissionsPageComponent implements OnInit {
  private readonly permissionsStore = inject(PermissionsStore);
  private readonly router = inject(Router);

  permissions = this.permissionsStore.permissions;
  loading = this.permissionsStore.loading;
  error = this.permissionsStore.error;

  activePermissionsCount = this.permissionsStore.activePermissionsCount;
  inactivePermissionsCount = this.permissionsStore.inactivePermissionsCount;

  pagination = usePagination<Permission>([], 10);

  constructor() {
    effect(() => {
      const currentPermissions = this.permissions();
      if (currentPermissions.length > 0) {
        this.pagination.setItems(currentPermissions);
      }
    });
  }

  tableColumns: TableColumn[] = [
    { key: 'id_permission', label: 'ID', sortable: true },
    { key: 'permission_name', label: 'Nombre', sortable: true },
    { key: 'permission_description', label: 'Descripción' },
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
      handler: (permission: Permission) => this.editPermission(permission)
    },
    {
      icon: 'trash-2',
      label: 'Eliminar',
      class: 'delete',
      handler: (permission: Permission) => this.deletePermission(permission)
    }
  ];

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.permissionsStore.loadPermissions();
  }

  editPermission(permission: Permission): void {
    this.openSidebar(permission);
  }

  deletePermission(permission: Permission): void {
    if (confirm(`¿Está seguro que desea eliminar el permiso "${permission.permission_name}"?`)) {
      this.permissionsStore.deletePermission(permission.id_permission);
    }
  }

  onSearch(searchTerm: string): void {
    this.pagination.setSearchQuery(searchTerm);
  }

  onPageChange(page: number): void {
    this.pagination.setPage(page);
  }

  showSidebar = false;
  editingPermission: Permission | null = null;

  openSidebar(permission?: Permission) {
    this.showSidebar = true;
    this.editingPermission = permission ?? null;
  }

  closeSidebar() {
    this.showSidebar = false;
    this.editingPermission = null;
  }
}
