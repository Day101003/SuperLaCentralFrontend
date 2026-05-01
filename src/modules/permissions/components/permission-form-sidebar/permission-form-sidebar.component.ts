import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { Permission } from '../../models/permission';
import { FormsModule } from '@angular/forms';
import { PermissionsStore } from '../../store/permissions.store';

@Component({
  selector: 'app-permission-form-sidebar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './permission-form-sidebar.component.html',
  styleUrls: ['./permission-form-sidebar.component.css']
})
export class PermissionFormSidebarComponent implements OnChanges {
  @Input() permission: Permission | null = null;
  @Output() closeSidebar = new EventEmitter<void>();

  private readonly permissionsStore = inject(PermissionsStore);

  formData = {
    permission_name: '',
    permission_description: '',
    is_active: true
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['permission'] && this.permission) {
      this.formData = {
        permission_name: this.permission.permission_name ?? '',
        permission_description: this.permission.permission_description ?? '',
        is_active: this.permission.is_active ?? true
      };
    } else if (changes['permission'] && !this.permission) {
      this.formData = {
        permission_name: '',
        permission_description: '',
        is_active: true
      };
    }
  }

  onClose() {
    this.closeSidebar.emit();
  }

  onSubmit() {
    if (!this.formData.permission_name.trim()) return;
    if (this.permission) {
      this.permissionsStore.updatePermission(this.permission.id_permission, this.formData, () => this.closeSidebar.emit());
    } else {
      this.permissionsStore.createPermission(this.formData, () => this.closeSidebar.emit());
    }
  }
}
