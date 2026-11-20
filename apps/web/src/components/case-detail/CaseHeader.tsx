import React from 'react';
import { Case } from '@veritrace/types';
import { StatusBadge } from '@/components/shared/StatusBadge';

interface CaseHeaderProps {
  caseData: Case;
}

export const CaseHeader: React.FC<CaseHeaderProps> = ({ caseData }) => {
  return (
    <header className="border-b border-border bg-surface px-4 py-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            {caseData.entity_name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-mono">
            <span>Registry: <strong className="font-semibold text-foreground">{caseData.registry_id}</strong></span>
            <span aria-hidden="true">•</span>
            <span>Jurisdiction: <strong className="font-semibold text-foreground">{caseData.jurisdiction}</strong></span>
            <span aria-hidden="true">•</span>
            <span className="font-sans">
              Assigned: <strong className="font-semibold text-foreground">{caseData.assigned_investigator}</strong>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs text-muted-foreground">Status:</span>
          <StatusBadge status={caseData.status} />
        </div>
      </div>
    </header>
  );
};
