import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CaseNarrativeProps {
  narrativeText: string | null;
  evidenceCount: number;
}

export const CaseNarrative: React.FC<CaseNarrativeProps> = ({
  narrativeText,
  evidenceCount,
}) => {
  return (
    <div className="rounded-sm border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          System Synthesis Summary
        </h3>
        <Badge variant="draft">DRAFT</Badge>
      </div>

      <p className="text-xs leading-relaxed text-foreground/90 font-sans">
        {narrativeText || 'No synthetic summary available for this finding.'}
      </p>

      <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-mono">
        <span>Evidence cited: {evidenceCount} sources</span>
        <span className="font-sans text-[10px]">Automated extraction review required</span>
      </div>
    </div>
  );
};
