'use client';

import React from 'react';
import { ExtractedField } from '@veritrace/types';
import { CheckCircle2, Crosshair } from 'lucide-react';

interface ExtractedFieldListProps {
  fields: ExtractedField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
}

export const ExtractedFieldList: React.FC<ExtractedFieldListProps> = ({
  fields,
  selectedFieldId,
  onSelectField,
}) => {
  return (
    <aside
      aria-label="Extracted document fields"
      className="w-full lg:w-[320px] shrink-0 border-t lg:border-t-0 lg:border-l border-border bg-surface flex flex-col"
    >
      <div className="p-3 border-b border-border bg-surface-raised flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Extracted Fields ({fields.length})
        </h2>
        <span className="text-[10px] text-muted-foreground font-mono">OCR v2.1</span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {fields.length === 0 ? (
          <div className="p-4 text-xs text-muted-foreground italic text-center">
            No fields extracted from this document.
          </div>
        ) : (
          fields.map((field) => {
            const isSelected = field.id === selectedFieldId;
            return (
              <div
                key={field.id}
                onClick={() => onSelectField(field.id)}
                className={`p-3.5 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-finding-bg/40 font-medium ring-1 ring-inset ring-finding-indicator/40'
                    : 'hover:bg-surface-raised/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Crosshair className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-finding-indicator' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-semibold text-foreground truncate font-mono">
                      {field.field_name}
                    </span>
                  </div>
                  <span className="text-[10px] px-1 py-0.5 rounded-xs bg-surface border border-border text-muted-foreground uppercase font-mono">
                    {field.field_type}
                  </span>
                </div>

                <div className="mt-1 p-2 rounded-xs bg-surface border border-border text-xs font-mono text-foreground break-all">
                  {field.value}
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-success" />
                    <span>{(field.confidence * 100).toFixed(1)}% conf</span>
                  </div>
                  <span>
                    Region: ({field.bounding_box.x}, {field.bounding_box.y})
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
