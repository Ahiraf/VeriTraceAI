'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Case } from '@veritrace/types';
import { useCaseQueueStore, SortField } from '@/stores/useCaseQueueStore';
import { useKeyboardShortcuts } from '@/lib/keyboard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface CaseQueueTableProps {
  cases: Case[];
}

export const CaseQueueTable: React.FC<CaseQueueTableProps> = ({ cases }) => {
  const router = useRouter();
  const {
    statusFilter,
    searchQuery,
    sortBy,
    sortDirection,
    selectedRowIndex,
    setSort,
    setSelectedRowIndex,
    resetFilters,
  } = useCaseQueueStore();

  // Filter cases based on selected filter and search query
  const filteredCases = cases.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.entity_name.toLowerCase().includes(q) ||
        c.registry_id.toLowerCase().includes(q) ||
        c.jurisdiction.toLowerCase().includes(q) ||
        c.assigned_investigator.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter === 'all') return true;
    if (statusFilter === 'escalated') return c.status === 'Escalated';
    if (statusFilter === 'cleared') return c.status === 'Cleared' || c.status === 'AuditSealed';
    if (statusFilter === 'needs_review') {
      return ['AnalystReview', 'Intake', 'FindingsReady', 'Extracting', 'Resolving', 'GraphBuilt', 'NarrativeDrafted', 'EvidenceRequested'].includes(
        c.status
      );
    }
    return true;
  });

  // Sort cases
  const sortedCases = [...filteredCases].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'entity_name') {
      comparison = a.entity_name.localeCompare(b.entity_name);
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortBy === 'finding_count') {
      comparison = a.finding_count - b.finding_count;
    } else if (sortBy === 'updated_at') {
      comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Wire keyboard j / k / Enter navigation
  useKeyboardShortcuts({
    onNextRow: () => {
      if (sortedCases.length === 0) return;
      setSelectedRowIndex((prev) => Math.min(prev + 1, sortedCases.length - 1));
    },
    onPrevRow: () => {
      if (sortedCases.length === 0) return;
      setSelectedRowIndex((prev) => Math.max(prev - 1, 0));
    },
    onSelectRow: () => {
      const target = sortedCases[selectedRowIndex];
      if (target) router.push(`/cases/${target.id}`);
    },
  });

  if (cases.length === 0) {
    return (
      <EmptyState
        title="No cases yet"
        description="Cases appear here when created."
      />
    );
  }

  if (sortedCases.length === 0) {
    return (
      <EmptyState
        title="No cases match the current filters"
        description="Try adjusting your filter selection to view active cases."
        action={{ label: 'Clear filters', onClick: resetFilters }}
      />
    );
  }

  const renderSortIndicator = (field: SortField) => {
    if (sortBy !== field) return <ArrowUpDown className="h-3 w-3 opacity-30 group-hover:opacity-100" />;
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-primary" />
    ) : (
      <ArrowDown className="h-3 w-3 text-primary" />
    );
  };

  return (
    <div className="w-full border border-border rounded-sm bg-surface overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-raised select-none text-muted-foreground font-semibold">
              <th scope="col" className="py-2.5 px-4 font-medium">
                <button
                  type="button"
                  onClick={() => setSort('entity_name')}
                  className="group flex items-center gap-1.5 hover:text-foreground"
                >
                  <span>Entity</span>
                  {renderSortIndicator('entity_name')}
                </button>
              </th>
              <th scope="col" className="py-2.5 px-4 font-medium">
                <button
                  type="button"
                  onClick={() => setSort('status')}
                  className="group flex items-center gap-1.5 hover:text-foreground"
                >
                  <span>Status</span>
                  {renderSortIndicator('status')}
                </button>
              </th>
              <th scope="col" className="py-2.5 px-4 font-medium">
                <button
                  type="button"
                  onClick={() => setSort('finding_count')}
                  className="group flex items-center gap-1.5 hover:text-foreground"
                >
                  <span>Findings</span>
                  {renderSortIndicator('finding_count')}
                </button>
              </th>
              <th scope="col" className="py-2.5 px-4 font-medium">
                Assigned
              </th>
              <th scope="col" className="py-2.5 px-4 font-medium">
                <button
                  type="button"
                  onClick={() => setSort('updated_at')}
                  className="group flex items-center gap-1.5 hover:text-foreground"
                >
                  <span>Updated</span>
                  {renderSortIndicator('updated_at')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedCases.map((caseItem, idx) => {
              const isSelected = idx === selectedRowIndex;
              const formattedDate = new Date(caseItem.updated_at).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <tr
                  key={caseItem.id}
                  onClick={() => router.push(`/cases/${caseItem.id}`)}
                  onMouseEnter={() => setSelectedRowIndex(idx)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-surface-raised font-medium' : 'hover:bg-surface-raised'
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="text-foreground font-medium text-xs">
                        {caseItem.entity_name}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {caseItem.registry_id} • {caseItem.jurisdiction}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={caseItem.status} />
                  </td>
                  <td className="py-3 px-4 tabular-nums">
                    {caseItem.open_finding_count > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-finding-indicator font-medium">
                        <span aria-hidden="true" className="text-xs">●</span>
                        <span>{caseItem.open_finding_count} open</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">— none</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                    {caseItem.assigned_investigator}
                  </td>
                  <td className="py-3 px-4 tabular-nums text-muted-foreground whitespace-nowrap">
                    {formattedDate}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
