'use client';

import React from 'react';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  currentPage: number;
  totalPages: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoom,
  currentPage,
  totalPages,
  onZoomIn,
  onZoomOut,
  onPrevPage,
  onNextPage,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface px-4 py-2 text-xs">
      {/* Page navigation */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onPrevPage}
          disabled={currentPage <= 1}
          className="h-7 px-2 rounded-xs border border-border bg-surface hover:bg-surface-raised disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <span className="tabular-nums px-2 font-mono text-muted-foreground">
          Page <strong className="text-foreground">{currentPage}</strong> of {totalPages}
        </span>

        <button
          type="button"
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          className="h-7 px-2 rounded-xs border border-border bg-surface hover:bg-surface-raised disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onZoomOut}
          disabled={zoom <= 50}
          className="h-7 w-7 rounded-xs border border-border bg-surface hover:bg-surface-raised disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>

        <span className="tabular-nums px-2 font-mono text-muted-foreground min-w-[50px] text-center">
          {zoom}%
        </span>

        <button
          type="button"
          onClick={onZoomIn}
          disabled={zoom >= 150}
          className="h-7 w-7 rounded-xs border border-border bg-surface hover:bg-surface-raised disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
