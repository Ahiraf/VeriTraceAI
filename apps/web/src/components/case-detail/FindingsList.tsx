'use client';

import React from 'react';
import { Finding } from '@veritrace/types';
import { useCaseDetailStore } from '@/stores/useCaseDetailStore';

interface FindingsListProps {
  findings: Finding[];
}

export const FindingsList: React.FC<FindingsListProps> = ({ findings }) => {
  const { activeFindingId, setActiveFindingId } = useCaseDetailStore();

  if (findings.length === 0) {
    return (
      <div className="w-full lg:w-[280px] shrink-0 border-r border-border bg-surface p-4 text-xs text-muted-foreground">
        No findings raised for this case.
      </div>
    );
  }

  return (
    <aside
      aria-label="Findings Navigation"
      className="w-full lg:w-[280px] shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-surface"
    >
      <div className="p-3 border-b border-border bg-surface-raised flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Findings ({findings.length})
        </h2>
      </div>

      {/* Responsive layout: vertical list on desktop, horizontal scroll on mobile */}
      <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto divide-x lg:divide-x-0 lg:divide-y divide-border">
        {findings.map((finding, idx) => {
          const isActive = finding.id === activeFindingId;
          const isOpen = finding.status === 'open';

          return (
            <button
              key={finding.id}
              type="button"
              onClick={() => setActiveFindingId(finding.id)}
              className={`text-left p-3.5 transition-colors min-w-[240px] lg:min-w-0 border-l-[3px] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring ${
                isActive
                  ? 'border-primary bg-surface-raised font-medium'
                  : 'border-transparent hover:bg-surface-raised/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-foreground truncate">
                  {idx + 1}. {finding.label}
                </span>
                {isOpen ? (
                  <span
                    className="h-2 w-2 rounded-full bg-finding-indicator shrink-0"
                    title="Open discrepancy"
                    aria-label="Status: Open"
                  />
                ) : (
                  <span
                    className="text-[11px] text-success font-bold shrink-0"
                    title="Resolved finding"
                    aria-label="Status: Resolved"
                  >
                    ✓
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {finding.summary}
              </p>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
