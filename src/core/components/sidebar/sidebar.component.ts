import { Component, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements AfterViewInit {
  isOpen = true; // Iniciar abierto, el CSS se encarga del responsive
  isMobile = false;
  isGestionAdminOpen = false;
  isInventarioOpen = false;

  constructor() {
    this.checkScreenSize();
  }

  toggleInventario() {
  this.isInventarioOpen = !this.isInventarioOpen;
}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if ((globalThis as any).feather) {
        (globalThis as any).feather.replace();
      }
    }, 100);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 1024;
    if (!this.isMobile) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  closeSidebar() {
    if (this.isMobile) {
      this.isOpen = false;
    }
  }

  toggleGestionAdmin() {
    this.isGestionAdminOpen = !this.isGestionAdminOpen;
  }
}
