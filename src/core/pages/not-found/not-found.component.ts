import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements AfterViewInit {
  currentYear: number = new Date().getFullYear();
  
  constructor() {}

  ngAfterViewInit(): void {
    // Initialize Feather Icons
    if ((globalThis as any).feather) {
      (globalThis as any).feather.replace();
    }
  }
}
