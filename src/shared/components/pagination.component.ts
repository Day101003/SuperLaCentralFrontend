import { Component, Input, Output, EventEmitter, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2">
      <!-- Previous Button -->
      <button
        (click)="onPageChange(currentPage - 1)"
        [disabled]="currentPage === 1"
        class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1">
        <i data-feather="chevron-left" class="w-4 h-4"></i>
        <span class="hidden sm:inline">Anterior</span>
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-1">
        @for (page of visiblePages; track page) {
          @if (page === '...') {
            <span class="px-3 py-2 text-gray-400">...</span>
          } @else {
            <button
              (click)="onPageChange(+page)"
              [class]="'px-3 py-2 rounded-lg border transition-all ' + 
                      (currentPage === +page 
                        ? 'border-primary bg-primary text-white font-semibold' 
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50')">
              {{ page }}
            </button>
          }
        }
      </div>

      <!-- Next Button -->
      <button
        (click)="onPageChange(currentPage + 1)"
        [disabled]="currentPage === totalPages"
        class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1">
        <span class="hidden sm:inline">Siguiente</span>
        <i data-feather="chevron-right" class="w-4 h-4"></i>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PaginationComponent implements AfterViewInit, AfterViewChecked {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() maxVisible: number = 5;
  
  @Output() pageChange = new EventEmitter<number>();

  private isInitialized = false;

  constructor(private cdr: ChangeDetectorRef) {}

  get visiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const half = Math.floor(this.maxVisible / 2);
    
    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(this.totalPages, start + this.maxVisible - 1);
    
    if (end - start + 1 < this.maxVisible) {
      start = Math.max(1, end - this.maxVisible + 1);
    }
    
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (end < this.totalPages) {
      if (end < this.totalPages - 1) pages.push('...');
      pages.push(this.totalPages);
    }
    
    return pages;
  }

  ngAfterViewInit(): void {
    this.isInitialized = true;
    this.updateFeatherIcons();
  }

  ngAfterViewChecked(): void {
    if (this.isInitialized) {
      this.updateFeatherIcons();
    }
  }

  private updateFeatherIcons(): void {
    if ((globalThis as any).feather) {
      (globalThis as any).feather.replace();
    }
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
