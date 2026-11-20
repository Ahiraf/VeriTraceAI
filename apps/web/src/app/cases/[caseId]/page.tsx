'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { useCaseDetailStore } from '@/stores/useCaseDetailStore';
import { useKeyboardShortcuts } from '@/lib/keyboard';
import { apiClient } from '@/lib/api-client';
import { CaseHeader } from '@/components/case-detail/CaseHeader';
import { FindingsList } from '@/components/case-detail/FindingsList';
import { EvidenceComparisonPanel } from '@/components/case-detail/EvidenceComparisonPanel';
import { OwnershipGraphPanel } from '@/components/case-detail/OwnershipGraphPanel';
import { DecisionRow } from '@/components/case-detail/DecisionRow';
import { DecisionConfirmDialog } from '@/components/case-detail/DecisionConfirmDialog';
import { CaseDetailSkeleton } from '@/components/case-detail/CaseDetailSkeleton';
import { Toast } from '@/components/shared/Toast';
import { ArrowLeft, GitFork, Scale } from 'lucide-react';
import { Evidence, OwnershipGraph } from '@veritrace/types';

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = (params?.caseId as string) || '';
  const router = useRouter();

  const cases = useSimulationStore((s) => s.cases);
  const allFindings = useSimulationStore((s) => s.findings);
  const { activeFindingId, setActiveFindingId, openDecisionDialog } = useCaseDetailStore();

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'evidence' | 'graph'>('evidence');
  const [graphData, setGraphData] = useState<OwnershipGraph | null>(null);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [narrativeText, setNarrativeText] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: string; message: string; variant: 'info' | 'success' | 'escalated' }[]>([]);

  const currentCase = cases.find((c) => c.id === caseId);
  const caseFindings = allFindings.filter((f) => f.case_id === caseId);

  // Load ownership graph
  useEffect(() => {
    let isMounted = true;
    apiClient.getOwnershipGraph(caseId).then((data) => {
      if (isMounted) setGraphData(data);
    });
    return () => {
      isMounted = false;
    };
  }, [caseId]);

  // Set default active finding if none selected
  useEffect(() => {
    if (caseFindings.length > 0 && (!activeFindingId || !caseFindings.some((f) => f.id === activeFindingId))) {
      setActiveFindingId(caseFindings[0].id);
    }
  }, [caseFindings, activeFindingId, setActiveFindingId]);

  const activeFinding = caseFindings.find((f) => f.id === activeFindingId) || null;

  // Load evidence and narrative for active finding
  useEffect(() => {
    let isMounted = true;
    if (activeFinding) {
      apiClient.getEvidence(activeFinding.evidence_ids).then((res) => {
        if (isMounted) setEvidenceList(res);
      });
      apiClient.getNarrative(activeFinding.id).then((res) => {
        if (isMounted) setNarrativeText(res);
      });
    } else {
      setEvidenceList([]);
      setNarrativeText(null);
    }
    return () => {
      isMounted = false;
    };
  }, [activeFinding]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 120);
    return () => clearTimeout(timer);
  }, [caseId]);

  // Wire keyboard shortcuts: 1-9 for findings, d for decision dialog, Backspace to queue
  useKeyboardShortcuts({
    onSelectFindingIndex: (idx) => {
      if (caseFindings[idx]) setActiveFindingId(caseFindings[idx].id);
    },
    onOpenDecision: () => {
      if (activeFinding && currentCase?.status !== 'Cleared' && currentCase?.status !== 'Escalated') {
        openDecisionDialog('Cleared');
      }
    },
    onBack: () => {
      router.push('/cases');
    },
  });

  const handleDecisionRecorded = (actionLabel: string) => {
    const toastId = `toast_${Date.now()}`;
    setToasts((prev) => [
      ...prev,
      { id: toastId, message: `Decision recorded: ${actionLabel}. Audit record committed.`, variant: 'success' },
    ]);
  };

  if (isLoading) {
    return <CaseDetailSkeleton />;
  }

  if (!currentCase) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-base font-semibold text-foreground">Case Not Found</h2>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          The requested compliance case &ldquo;{caseId}&rdquo; does not exist or has been archived.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Case Queue</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background relative min-h-0">
      <CaseHeader caseData={currentCase} />

      {/* Investigation View Mode Switcher */}
      <div className="border-b border-border bg-surface px-4 lg:px-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center gap-1.5 py-2.5 text-xs font-medium border-b-2 transition-colors select-none ${
            activeTab === 'evidence'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Scale className="h-3.5 w-3.5" />
          <span>Evidentiary Findings ({caseFindings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('graph')}
          className={`flex items-center gap-1.5 py-2.5 text-xs font-medium border-b-2 transition-colors select-none ${
            activeTab === 'graph'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <GitFork className="h-3.5 w-3.5" />
          <span>Beneficial Ownership Network</span>
        </button>
      </div>

      {activeTab === 'evidence' ? (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          <FindingsList findings={caseFindings} />

          <EvidenceComparisonPanel
            caseId={caseId}
            finding={activeFinding}
            evidenceList={evidenceList}
            narrativeText={narrativeText}
          />
        </div>
      ) : (
        <OwnershipGraphPanel graphData={graphData} caseId={caseId} />
      )}

      <DecisionRow caseData={currentCase} />

      <DecisionConfirmDialog
        caseData={currentCase}
        currentFinding={activeFinding}
        onDecisionRecorded={handleDecisionRecorded}
      />

      {/* Floating toast alerts container */}
      <aside aria-label="Notifications" className="fixed bottom-16 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-auto">
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
