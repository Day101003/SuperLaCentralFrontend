import { Component, AfterViewInit } from '@angular/core';
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
  constructor() {}

  ngAfterViewInit(): void {
    // Initialize Feather Icons with a small delay
    setTimeout(() => {
      if ((globalThis as any).feather) {
        (globalThis as any).feather.replace();
      }
    }, 100);
  }
}
