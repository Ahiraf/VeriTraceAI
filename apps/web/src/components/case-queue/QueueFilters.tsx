'use client';

import React from 'react';
import { useCaseQueueStore, StatusFilterOption } from '@/stores/useCaseQueueStore';
import { Case } from '@veritrace/types';
import { Search, X } from 'lucide-react';

interface QueueFiltersProps {
  cases: Case[];
}

export const QueueFilters: React.FC<QueueFiltersProps> = ({ cases }) => {
  const { statusFilter, setStatusFilter, searchQuery, setSearchQuery } = useCaseQueueStore();

  const counts = {
    all: cases.length,
    needs_review: cases.filter((c) =>
      ['AnalystReview', 'Intake', 'FindingsReady', 'Extracting', 'Resolving', 'GraphBuilt', 'NarrativeDrafted', 'EvidenceRequested'].includes(
        c.status
      )
    ).length,
    escalated: cases.filter((c) => c.status === 'Escalated').length,
    cleared: cases.filter((c) => c.status === 'Cleared' || c.status === 'AuditSealed').length,
  };

  const filterTabs: { id: StatusFilterOption; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'needs_review', label: 'Needs Review', count: counts.needs_review },
    { id: 'escalated', label: 'Escalated', count: counts.escalated },
    { id: 'cleared', label: 'Cleared', count: counts.cleared },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
      <div className="flex flex-wrap items-center gap-2">
        {filterTabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-medium transition-colors border select-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-surface text-muted-foreground border-border hover:text-foreground hover:bg-surface-raised'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`tabular-nums text-[11px] px-1 rounded-xs ${
                  isActive ? 'bg-white/20 text-white' : 'bg-surface-raised text-muted-foreground'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter queue by entity, ID..."
          className="w-full h-8 pl-8 pr-7 text-xs bg-surface border border-border rounded-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border-strong focus:ring-1 focus:ring-ring transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-2 text-muted-foreground hover:text-foreground text-xs"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
