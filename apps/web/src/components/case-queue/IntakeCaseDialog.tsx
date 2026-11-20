'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { Plus, ShieldAlert } from 'lucide-react';

interface IntakeCaseDialogProps {
  open: boolean;
  onClose: () => void;
  onCaseCreated: (entityName: string) => void;
}

export const IntakeCaseDialog: React.FC<IntakeCaseDialogProps> = ({
  open,
  onClose,
  onCaseCreated,
}) => {
  const [entityName, setEntityName] = useState('');
  const [jurisdiction, setJurisdiction] = useState<'UK' | 'BD'>('UK');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const simulateIntake = useSimulationStore((s) => s.simulateIntakeNewCase);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!entityName.trim() || entityName.trim().length < 3) {
      setError('Entity legal name must be at least 3 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      await simulateIntake(entityName.trim(), jurisdiction);
      onCaseCreated(entityName.trim());
      setEntityName('');
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to intake case.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Initiate Beneficial Ownership Intake"
      description="Simulate ingestion of corporate registry filings for automated entity resolution and sanctions extraction."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <div>
          <label htmlFor="intake-entity" className="block text-xs font-semibold text-foreground mb-1.5">
            Entity Legal Name <span className="text-escalated">*</span>
          </label>
          <Input
            id="intake-entity"
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
            placeholder="e.g. Thames Horizon Maritime Ltd"
            disabled={isSubmitting}
            error={!!error}
          />
        </div>

        <div>
          <span className="block text-xs font-semibold text-foreground mb-1.5">
            Statutory Jurisdiction Mode
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setJurisdiction('UK')}
              className={`p-2.5 rounded-xs border text-left transition-colors ${
                jurisdiction === 'UK'
                  ? 'border-primary bg-primary/10 text-primary font-semibold'
                  : 'border-border bg-surface text-muted-foreground hover:bg-surface-raised'
              }`}
            >
              <div className="text-xs font-medium text-foreground">United Kingdom (UK)</div>
              <div className="text-[10px] text-muted-foreground font-mono">Companies House PSC</div>
            </button>

            <button
              type="button"
              onClick={() => setJurisdiction('BD')}
              className={`p-2.5 rounded-xs border text-left transition-colors ${
                jurisdiction === 'BD'
                  ? 'border-primary bg-primary/10 text-primary font-semibold'
                  : 'border-border bg-surface text-muted-foreground hover:bg-surface-raised'
              }`}
            >
              <div className="text-xs font-medium text-foreground">Bangladesh (BD)</div>
              <div className="text-[10px] text-muted-foreground font-mono">RJSC Schedule XII</div>
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="p-2.5 rounded-xs bg-escalated-bg border border-escalated/30 text-escalated text-xs flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            <Plus className="h-3.5 w-3.5" />
            <span>Intake Case</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
