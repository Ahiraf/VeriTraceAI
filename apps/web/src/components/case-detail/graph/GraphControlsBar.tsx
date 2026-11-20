'use client';

import React from 'react';
import { Filter, Maximize2, ShieldAlert, Layers, Shuffle } from 'lucide-react';

export type EdgeFilterType = 'all' | 'conflicts' | 'declared' | 'observed';

interface GraphControlsBarProps {
  filter: EdgeFilterType;
  onFilterChange: (filter: EdgeFilterType) => void;
  onFitView: () => void;
  onRandomizeGraph?: () => void;
  conflictCount: number;
  totalNodes: number;
  uboCount: number;
}

export const GraphControlsBar: React.FC<GraphControlsBarProps> = ({
  filter,
  onFilterChange,
  onFitView,
  onRandomizeGraph,
  conflictCount,
  totalNodes,
  uboCount,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 border-b border-border bg-surface text-xs select-none">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
          <Filter className="h-3.5 w-3.5" />
          <span>Filter:</span>
        </span>

        <div className="inline-flex rounded-xs border border-border bg-surface-raised p-0.5">
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-xs transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Edges
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('conflicts')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-xs transition-colors flex items-center gap-1 ${
              filter === 'conflicts'
                ? 'bg-finding-indicator text-white font-semibold'
                : 'text-finding-indicator hover:bg-finding-bg'
            }`}
          >
            <span>Discrepancies</span>
            {conflictCount > 0 && (
              <span className="px-1 py-0.2 rounded-full text-[9px] font-mono bg-white/20">
                {conflictCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('declared')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-xs transition-colors ${
              filter === 'declared'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Declared
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('observed')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-xs transition-colors ${
              filter === 'observed'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Observed
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
          <span className="flex items-center gap-1">
            <Layers className="h-3 w-3" />
            <span>{totalNodes} Entities</span>
          </span>
          <span className="text-border">|</span>
          <span>{uboCount} UBOs (&gt;25%)</span>
          {conflictCount > 0 && (
            <>
              <span className="text-border">|</span>
              <span className="text-finding-indicator font-semibold flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" />
                <span>{conflictCount} Conflict</span>
              </span>
            </>
          )}
        </div>

        {onRandomizeGraph && (
          <button
            type="button"
            onClick={onRandomizeGraph}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-xs border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-medium transition-colors"
            title="Generate random ownership graph structure"
          >
            <Shuffle className="h-3 w-3" />
            <span>Random Graph</span>
          </button>
        )}

        <button
          type="button"
          onClick={onFitView}
          className="inline-flex items-center gap-1 h-7 px-2.5 rounded-xs border border-border bg-surface hover:bg-surface-raised text-muted-foreground hover:text-foreground text-[11px] font-medium transition-colors"
          title="Fit view to graph bounds"
        >
          <Maximize2 className="h-3 w-3" />
          <span>Fit View</span>
        </button>
      </div>
    </div>
  );
};
