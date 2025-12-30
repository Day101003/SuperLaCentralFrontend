import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {
    // Initialize Feather Icons
    if ((globalThis as any).feather) {
      (globalThis as any).feather.replace();
    }
  }
}
