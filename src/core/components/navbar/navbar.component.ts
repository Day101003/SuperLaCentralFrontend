import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit {
  @Output() sidebarToggle = new EventEmitter<void>();

  constructor() {}

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  ngAfterViewInit(): void {
    // Initialize Feather Icons with a small delay
    setTimeout(() => {
      if ((globalThis as any).feather) {
        (globalThis as any).feather.replace();
      }
    }, 100);
  }
}
