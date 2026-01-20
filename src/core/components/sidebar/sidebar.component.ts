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
  isOpen = false;
  isMobile = false;
  isGestionAdminOpen = false;

  constructor() {
    this.checkScreenSize();
  }

  ngAfterViewInit(): void {
    // Initialize Feather Icons with a small delay
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
