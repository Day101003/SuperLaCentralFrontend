import { Component, Input, Output, EventEmitter } from '@angular/core';
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
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
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
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="m7 15 5 5 5-5M7 9l5-5 5 5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                        </svg>
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
              @for (row of data; track trackByField($index, row)) {
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
                    <td class="px-6 py-4">
                      <div class="action-buttons">
                        @for (action of actions; track action.label) {
                          <button
                            type="button"
                            (click)="handleAction(action, row)"
                            [title]="action.label"
                            [attr.data-action-class]="action.class"
                            class="action-btn">
                            @if (action.icon === 'edit-2' || action.icon === 'edit') {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            } @else if (action.icon === 'trash-2' || action.icon === 'trash') {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            } @else if (action.icon === 'eye') {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            } @else {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="12" cy="5" r="1"></circle>
                                <circle cx="12" cy="19" r="1"></circle>
                              </svg>
                            }
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
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                    </svg>
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

    /* Table container */
    .overflow-x-auto {
      -webkit-overflow-scrolling: touch;
    }

    /* Table styles */
    table {
      table-layout: auto;
      min-width: 100%;
    }

    th, td {
      white-space: nowrap;
    }

    /* Actions column should always align right */
    th:last-child,
    td:last-child {
      text-align: right;
    }

    /* Action buttons styles */
    .action-buttons {
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
      white-space: nowrap;
      min-width: fit-content;
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
      flex-shrink: 0;
      min-width: 32px;
      min-height: 32px;
    }

    .action-btn:hover {
      background-color: #e5e7eb;
      transform: translateY(-1px);
    }

    .action-btn svg {
      width: 16px;
      height: 16px;
      display: block;
      flex-shrink: 0;
      stroke-width: 2;
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
export class DataTableComponent {
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

  // Función de tracking que usa el campo especificado o el índice como fallback
  trackByField(index: number, item: any): any {
    const value = item[this.trackBy];
    // Si el valor es undefined, null, o string vacío, usar el índice
    return (value !== undefined && value !== null && value !== '') ? value : index;
  }

  handleAction(action: TableAction, row: any): void {
    action.handler(row);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }

  onSort(key: string): void {
    this.sort.emit(key);
  }
}
