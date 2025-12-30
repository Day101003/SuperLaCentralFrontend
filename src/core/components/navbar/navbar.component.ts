import { Component, AfterViewInit } from '@angular/core';
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
  constructor() {}

  toggleSidebar(): void {
    const body = document.body;
    body.classList.toggle('sidenav-toggled');
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
