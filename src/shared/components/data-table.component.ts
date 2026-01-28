import { Component, Input, Output, EventEmitter, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => string;
}

export interface TableAction {
  icon: string;
  label: string;
  class?: string;
  handler: (row: any) => void;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <!-- Search and Actions Bar -->
      @if (showSearch || customActions) {
        <div class="p-6 border-b border-gray-200 flex items-center justify-between gap-4">
          @if (showSearch) {
            <div class="flex-1 max-w-md">
              <div class="relative">
                <i data-feather="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Buscar..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all"
                  (input)="onSearch($event)"
                />
              </div>
            </div>
          }
          @if (customActions) {
            <div class="flex gap-2">
              <ng-content select="[slot=actions]"></ng-content>
            </div>
          }
        </div>
      }

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              @for (column of columns; track column.key) {
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div class="flex items-center gap-2">
                    <span>{{ column.label }}</span>
                    @if (column.sortable) {
                      <button (click)="onSort(column.key)" class="text-gray-400 hover:text-gray-600">
                        <i data-feather="arrow-up-down" class="w-4 h-4"></i>
                      </button>
                    }
                  </div>
                </th>
              }
              @if (actions && actions.length > 0) {
                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            @if (data && data.length > 0) {
              @for (row of data; track row[trackBy]) {
                <tr class="hover:bg-gray-50 transition-colors">
                  @for (column of columns; track column.key) {
                    <td class="px-6 py-4 text-sm text-gray-900">
                      @if (column.render) {
                        <div [innerHTML]="column.render(row[column.key], row)"></div>
                      } @else {
                        {{ row[column.key] }}
                      }
                    </td>
                  }
                  @if (actions && actions.length > 0) {
                    <td class="px-6 py-4 text-right">
                      <div class="action-buttons">
                        @for (action of actions; track action.label) {
                          <button
                            (click)="action.handler(row)"
                            [title]="action.label"
                            [attr.data-action-class]="action.class"
                            class="action-btn">
                            <i [attr.data-feather]="action.icon"></i>
                          </button>
                        }
                      </div>
                    </td>
                  }
                </tr>
              }
            } @else {
              <tr>
                <td [attr.colspan]="columns.length + (actions && actions.length > 0 ? 1 : 0)" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-3 text-gray-400">
                    <i data-feather="inbox" class="w-12 h-12"></i>
                    <p class="text-sm font-medium">{{ emptyMessage }}</p>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Footer with info and pagination slot -->
      @if (showFooter) {
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Mostrando <span class="font-semibold">{{ startRecord }}</span> a 
            <span class="font-semibold">{{ endRecord }}</span> de 
            <span class="font-semibold">{{ totalRecords }}</span> registros
          </div>
          <ng-content select="[slot=pagination]"></ng-content>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    /* Action buttons styles */
    .action-buttons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .action-btn {
      padding: 0.5rem;
      border-radius: 0.5rem;
      border: none;
      background-color: #f3f4f6;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .action-btn:hover {
      background-color: #e5e7eb;
      transform: translateY(-1px);
    }

    .action-btn i,
    .action-btn svg {
      width: 16px;
      height: 16px;
      display: block;
    }

    /* Specific action button colors based on data attribute */
    .action-btn[data-action-class*="blue"] {
      background-color: #eff6ff;
      color: #2563eb;
    }

    .action-btn[data-action-class*="blue"]:hover {
      background-color: #dbeafe;
    }

    .action-btn[data-action-class*="red"] {
      background-color: #fef2f2;
      color: #dc2626;
    }

    .action-btn[data-action-class*="red"]:hover {
      background-color: #fee2e2;
    }

    .action-btn[data-action-class*="green"] {
      background-color: #f0fdf4;
      color: #16a34a;
    }

    .action-btn[data-action-class*="green"]:hover {
      background-color: #dcfce7;
    }

    .action-btn[data-action-class*="yellow"] {
      background-color: #fefce8;
      color: #ca8a04;
    }

    .action-btn[data-action-class*="yellow"]:hover {
      background-color: #fef9c3;
    }
  `]
})
export class DataTableComponent implements AfterViewInit, AfterViewChecked {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions?: TableAction[];
  @Input() trackBy: string = 'id';
  @Input() showSearch: boolean = true;
  @Input() showFooter: boolean = true;
  @Input() customActions: boolean = false;
  @Input() emptyMessage: string = 'No hay datos para mostrar';
  @Input() startRecord: number = 0;
  @Input() endRecord: number = 0;
  @Input() totalRecords: number = 0;

  @Output() search = new EventEmitter<string>();
  @Output() sort = new EventEmitter<string>();

  private isInitialized = false;

  constructor(private cdr: ChangeDetectorRef) {}

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

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }

  onSort(key: string): void {
    this.sort.emit(key);
  }
}
