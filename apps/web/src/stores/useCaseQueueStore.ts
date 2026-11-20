import { create } from 'zustand';

export type StatusFilterOption = 'all' | 'needs_review' | 'escalated' | 'cleared';
export type SortField = 'entity_name' | 'status' | 'finding_count' | 'updated_at';
export type SortDirection = 'asc' | 'desc';

interface CaseQueueState {
  statusFilter: StatusFilterOption;
  searchQuery: string;
  sortBy: SortField;
  sortDirection: SortDirection;
  selectedRowIndex: number;

  setStatusFilter: (filter: StatusFilterOption) => void;
  setSearchQuery: (query: string) => void;
  setSort: (field: SortField) => void;
  setSelectedRowIndex: (index: number | ((prev: number) => number)) => void;
  resetFilters: () => void;
}

export const useCaseQueueStore = create<CaseQueueState>((set) => ({
  statusFilter: 'all',
  searchQuery: '',
  sortBy: 'updated_at',
  sortDirection: 'desc',
  selectedRowIndex: 0,

  setStatusFilter: (statusFilter) => set({ statusFilter, selectedRowIndex: 0 }),
  setSearchQuery: (searchQuery) => set({ searchQuery, selectedRowIndex: 0 }),
  setSort: (field) =>
    set((state) => {
      if (state.sortBy === field) {
        return { sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc' };
      }
      return { sortBy: field, sortDirection: 'desc' };
    }),
  setSelectedRowIndex: (updater) =>
    set((state) => ({
      selectedRowIndex: typeof updater === 'function' ? updater(state.selectedRowIndex) : updater,
    })),
  resetFilters: () =>
    set({
      statusFilter: 'all',
      searchQuery: '',
      sortBy: 'updated_at',
      sortDirection: 'desc',
      selectedRowIndex: 0,
    }),
}));
