'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useCaseDetailStore, DecisionType } from '@/stores/useCaseDetailStore';
import { Case } from '@veritrace/types';
import { Flag, HelpCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface DecisionRowProps {
  caseData: Case;
}

export const DecisionRow: React.FC<DecisionRowProps> = ({ caseData }) => {
  const { activeFindingId, openDecisionDialog } = useCaseDetailStore();

  const isTerminal =
    caseData.status === 'Cleared' ||
    caseData.status === 'Escalated' ||
    caseData.status === 'AuditSealed';

  const isDisabled = isTerminal || !activeFindingId;

  const handleAction = (type: DecisionType) => {
    if (isDisabled) return;
    openDecisionDialog(type);
  };

  return (
    <footer className="sticky bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur px-4 py-3 lg:px-6 shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground self-start sm:self-center">
          <Flag className="h-3.5 w-3.5 text-finding-indicator" />
          <span className="font-semibold text-foreground">Record Decision:</span>
          {isTerminal ? (
            <span className="italic">Case is in terminal state ({caseData.status}).</span>
          ) : !activeFindingId ? (
            <span className="italic">Select a finding above to record a decision.</span>
          ) : (
            <span>Consequential action with mandatory rationale.</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isDisabled}
            onClick={() => handleAction('EvidenceRequested')}
            className="text-primary hover:bg-primary/10 border-primary/30"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Request More Evidence</span>
          </Button>

          <Button
            type="button"
            variant="success"
            size="sm"
            disabled={isDisabled}
            onClick={() => handleAction('Cleared')}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Clear Finding</span>
          </Button>

          <Button
            type="button"
            variant="escalated"
            size="sm"
            disabled={isDisabled}
            onClick={() => handleAction('Escalated')}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Escalate Case</span>
          </Button>
        </div>
      </div>
    </footer>
  );
};
