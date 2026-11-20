'use client';

import React, { useState, useEffect } from 'react';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { QueueFilters } from '@/components/case-queue/QueueFilters';
import { CaseQueueTable } from '@/components/case-queue/CaseQueueTable';
import { CaseQueueSkeleton } from '@/components/case-queue/CaseQueueSkeleton';
import { IntakeCaseDialog } from '@/components/case-queue/IntakeCaseDialog';
import { ErrorBanner } from '@/components/shared/ErrorBanner';
import { Toast } from '@/components/shared/Toast';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CasesQueuePage() {
  const cases = useSimulationStore((s) => s.cases);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; message: string; variant: 'info' | 'success' }[]>([]);

  useEffect(() => {
    setMounted(true);
    // Simulated initial render loading for skeleton demonstration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleCaseCreated = (name: string) => {
    const toastId = `toast_${Date.now()}`;
    setToasts((prev) => [
      ...prev,
      { id: toastId, message: `Intake registered for "${name}". Processing statutory extraction.`, variant: 'success' },
    ]);
  };

  return (
    <div className="flex-1 px-4 py-6 lg:px-8 max-w-7xl w-full mx-auto flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Beneficial Ownership Case Queue
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select a compliance subject to review evidentiary discrepancies and record formal determinations.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setIsIntakeOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Intake New Case</span>
          </Button>
          <div className="text-xs text-muted-foreground font-mono">
            Active: <strong className="text-foreground">{cases.length}</strong>
          </div>
        </div>
      </div>

      {hasError && (
        <ErrorBanner
          message="Unable to synchronize case queue with compliance state."
          onRetry={() => {
            setHasError(false);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 200);
          }}
        />
      )}

      <QueueFilters cases={cases} />

      {isLoading || !mounted ? (
        <CaseQueueSkeleton />
      ) : (
        <CaseQueueTable cases={cases} />
      )}

      <IntakeCaseDialog
        open={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        onCaseCreated={handleCaseCreated}
      />

      <aside aria-label="Queue Notifications" className="fixed bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-auto">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            id={t.id}
            message={t.message}
            variant={t.variant}
            onDismiss={(id) => setToasts((prev) => prev.filter((item) => item.id !== id))}
          />
        ))}
      </aside>
    </div>
  );
}
