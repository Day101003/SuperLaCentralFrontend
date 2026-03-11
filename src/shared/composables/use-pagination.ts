import { signal, computed } from '@angular/core';

export interface PaginationState<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export function usePagination<T>(items: T[], pageSize: number = 10) {
  const currentPage = signal(1);
  const itemsPerPage = signal(pageSize);
  const allItems = signal<T[]>(items);
  const searchQuery = signal('');

  const filteredItems = computed(() => {
    const query = searchQuery().toLowerCase();
    if (!query) return allItems();
    
    return allItems().filter(item => 
      Object.values(item as any).some(value => 
        String(value).toLowerCase().includes(query)
      )
    );
  });

  const totalItems = computed(() => filteredItems().length);
  const totalPages = computed(() => Math.ceil(totalItems() / itemsPerPage()));

  const paginatedItems = computed(() => {
    const start = (currentPage() - 1) * itemsPerPage();
    const end = start + itemsPerPage();
    return filteredItems().slice(start, end);
  });

  const startRecord = computed(() => {
    if (totalItems() === 0) return 0;
    return (currentPage() - 1) * itemsPerPage() + 1;
  });

  const endRecord = computed(() => {
    const end = currentPage() * itemsPerPage();
    return Math.min(end, totalItems());
  });

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages()) {
      currentPage.set(page);
    }
  };

  const setPageSize = (size: number) => {
    itemsPerPage.set(size);
    currentPage.set(1);
  };

  const setItems = (newItems: T[]) => {
    allItems.set(newItems);
    currentPage.set(1);
  };

  const setSearchQuery = (query: string) => {
    searchQuery.set(query);
    currentPage.set(1);
  };

  const nextPage = () => {
    if (currentPage() < totalPages()) {
      currentPage.update(p => p + 1);
    }
  };

  const previousPage = () => {
    if (currentPage() > 1) {
      currentPage.update(p => p - 1);
    }
  };

  const goToFirstPage = () => currentPage.set(1);
  const goToLastPage = () => currentPage.set(totalPages());

  return {
    // Signals
    currentPage: currentPage.asReadonly(),
    itemsPerPage: itemsPerPage.asReadonly(),
    totalItems: totalItems,
    totalPages: totalPages,
    paginatedItems: paginatedItems,
    startRecord: startRecord,
    endRecord: endRecord,
    searchQuery: searchQuery.asReadonly(),
    
    // Actions
    setPage,
    setPageSize,
    setItems,
    setSearchQuery,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage
  };
}
