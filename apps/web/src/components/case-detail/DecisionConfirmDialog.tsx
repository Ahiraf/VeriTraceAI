'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCaseDetailStore } from '@/stores/useCaseDetailStore';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { validateCaseTransition } from '@/lib/state-machine';
import { Case, Finding } from '@veritrace/types';

interface DecisionConfirmDialogProps {
  caseData: Case;
  currentFinding: Finding | null;
  onDecisionRecorded: (actionLabel: string) => void;
}

export const DecisionConfirmDialog: React.FC<DecisionConfirmDialogProps> = ({
  caseData,
  currentFinding,
  onDecisionRecorded,
}) => {
  const {
    isDecisionDialogOpen,
    decisionType,
    rationaleDraft,
    isSubmitting,
    closeDecisionDialog,
    setRationaleDraft,
    setIsSubmitting,
  } = useCaseDetailStore();

  const recordDecisionInStore = useSimulationStore((s) => s.recordDecision);
  const findings = useSimulationStore((s) => s.findings);

  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isDecisionDialogOpen || !decisionType || !currentFinding) return null;

  const isRationaleValid = rationaleDraft.trim().length >= 10;

  const handleConfirm = async () => {
    setValidationError(null);

    if (!isRationaleValid) {
      setValidationError('Rationale is strictly required (minimum 10 characters).');
      return;
    }

    // State machine validation if target decision is Cleared
    if (decisionType === 'Cleared') {
      const remainingOpen = findings.filter(
        (f) => f.case_id === caseData.id && f.id !== currentFinding.id && f.status === 'open'
      ).length;

      if (remainingOpen > 0) {
        // Clearing this individual finding is allowed, but note if other findings remain open
      } else {
        const validation = validateCaseTransition(caseData, 'Cleared', findings);
        if (!validation.allowed && validation.reason) {
          setValidationError(validation.reason);
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      recordDecisionInStore(
        caseData.id,
        currentFinding.id,
        decisionType,
        rationaleDraft.trim(),
        true
      );

      const actionText =
        decisionType === 'Cleared'
          ? 'Finding cleared'
          : decisionType === 'Escalated'
          ? 'Case escalated to compliance officer'
          : 'Additional evidence requested';

      onDecisionRecorded(actionText);
      closeDecisionDialog();
    } catch (err: unknown) {
      setValidationError(err instanceof Error ? err.message : 'Failed to record decision.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const actionTitles = {
    Cleared: 'Clear Finding',
    EvidenceRequested: 'Request Additional Evidence',
    Escalated: 'Escalate Case to Compliance Officer',
  };

  return (
    <Dialog
      open={isDecisionDialogOpen}
      onClose={closeDecisionDialog}
      title={actionTitles[decisionType]}
      description={`You are recording a formal decision for ${caseData.entity_name} regarding "${currentFinding.label}". This action is logged into the audit ledger.`}
    >
      <div className="flex flex-col gap-4 mt-2">
        <div>
          <label
            htmlFor="decision-rationale"
            className="block text-xs font-semibold text-foreground mb-1.5"
          >
            Investigator Rationale <span className="text-escalated">*</span>
          </label>
          <Textarea
            id="decision-rationale"
            value={rationaleDraft}
            onChange={(e) => {
              setRationaleDraft(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Document legal or registry justification for this determination (minimum 10 characters)..."
            rows={4}
            error={!!validationError}
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span
              className={
                rationaleDraft.trim().length >= 10
                  ? 'text-muted-foreground'
                  : 'text-escalated font-medium'
              }
            >
              {rationaleDraft.trim().length} / 10 characters min
            </span>
            <span className="text-muted-foreground">Compliance Rule: Audit Sealed Record</span>
          </div>
        </div>

        {validationError && (
          <div
            role="alert"
            className="p-2.5 rounded-xs bg-escalated-bg border border-escalated/30 text-escalated text-xs font-medium"
          >
            {validationError}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={closeDecisionDialog}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant={
              decisionType === 'Cleared'
                ? 'success'
                : decisionType === 'Escalated'
                ? 'escalated'
                : 'primary'
            }
            size="sm"
            onClick={handleConfirm}
            isLoading={isSubmitting}
            disabled={!isRationaleValid || isSubmitting}
          >
            {isSubmitting ? 'Recording...' : `Confirm ${decisionType}`}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
