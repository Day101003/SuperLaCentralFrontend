import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { Role } from '../../models/role';
import { FormsModule } from '@angular/forms';
import { RolesStore } from '../../store/roles.store';

@Component({
  selector: 'app-role-form-sidebar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './role-form-sidebar.component.html',
  styleUrls: ['./role-form-sidebar.component.css']
})
export class RoleFormSidebarComponent implements OnChanges {
  @Input() role: Role | null = null;
  @Output() closeSidebar = new EventEmitter<void>();

  private readonly rolesStore = inject(RolesStore);

  formData = {
    rol_name: '',
    description_rol: '',
    is_active: true
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['role'] && this.role) {
      this.formData = {
        rol_name: this.role.rol_name ?? '',
        description_rol: this.role.description_rol ?? '',
        is_active: this.role.is_active ?? true
      };
    } else if (changes['role'] && !this.role) {
      this.formData = {
        rol_name: '',
        description_rol: '',
        is_active: true
      };
    }
  }

  onClose() {
    this.closeSidebar.emit();
  }

  onSubmit() {
    if (!this.formData.rol_name.trim()) return;
    if (this.role) {
      this.rolesStore.updateRole(this.role.id_rol, this.formData, () => this.closeSidebar.emit());
    } else {
      this.rolesStore.createRole(this.formData, () => this.closeSidebar.emit());
    }
  }
}
