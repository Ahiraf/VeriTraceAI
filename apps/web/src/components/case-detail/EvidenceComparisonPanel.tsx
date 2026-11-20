import React from 'react';
import Link from 'next/link';
import { Finding, Evidence } from '@veritrace/types';
import { CaseNarrative } from './CaseNarrative';
import { FileText, Database, ArrowRight } from 'lucide-react';

interface EvidenceComparisonPanelProps {
  caseId: string;
  finding: Finding | null;
  evidenceList: Evidence[];
  narrativeText: string | null;
}

export const EvidenceComparisonPanel: React.FC<EvidenceComparisonPanelProps> = ({
  caseId,
  finding,
  evidenceList,
  narrativeText,
}) => {
  if (!finding) {
    return (
      <div className="flex-1 p-8 text-center text-xs text-muted-foreground">
        Select a finding from the left rail to compare evidence.
      </div>
    );
  }

  // Split evidence into Declared (document/form) and Observed (registry/external)
  const declaredEvidence = evidenceList.filter(
    (e) => e.source_type === 'document' || e.source_type === 'manual'
  );
  const observedEvidence = evidenceList.filter(
    (e) => e.source_type === 'registry' || e.source_type === 'screening'
  );

  return (
    <div className="flex-1 p-4 lg:p-6 flex flex-col gap-6 overflow-y-auto">
      {/* Finding header */}
      <div className="border-b border-border pb-3">
        <h2 className="text-base font-semibold text-foreground">
          {finding.label}
        </h2>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {finding.summary}
        </p>
      </div>

      {/* Two-Column Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1: Declared */}
        <section
          aria-labelledby="declared-heading"
          className="rounded-sm border border-border bg-surface p-4 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
              <span id="declared-heading" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Declared
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {finding.declared_value !== undefined ? `Value: ${finding.declared_value}` : 'Self-Reported'}
              </span>
            </div>

            {declaredEvidence.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No declared evidence on file.</p>
            ) : (
              declaredEvidence.map((ev) => (
                <div key={ev.id} className="flex flex-col gap-2 mb-3 last:mb-0">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <span>{ev.source_reference}</span>
                  </div>
                  {ev.source_quote && (
                    <blockquote className="p-2.5 rounded-xs bg-finding-bg border border-finding-indicator/30 text-xs font-mono text-foreground leading-relaxed">
                      &ldquo;{ev.source_quote}&rdquo;
                    </blockquote>
                  )}
                  {ev.provenance && (
                    <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                      <span>OCR Confidence: {(ev.provenance.confidence * 100).toFixed(1)}%</span>
                      <span>•</span>
                      <span>{ev.provenance.latency_ms}ms</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-border mt-3">
            <Link
              href={`/cases/${caseId}/documents/doc_001`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
            >
              <span>View source document page</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </section>

        {/* Column 2: Observed */}
        <section
          aria-labelledby="observed-heading"
          className="rounded-sm border border-border bg-surface p-4 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
              <span id="observed-heading" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Observed
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {finding.observed_value !== undefined ? `Value: ${finding.observed_value}` : 'Official Record'}
              </span>
            </div>

            {observedEvidence.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No observed registry record available.</p>
            ) : (
              observedEvidence.map((ev) => (
                <div key={ev.id} className="flex flex-col gap-2 mb-3 last:mb-0">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Database className="h-3.5 w-3.5 text-primary" />
                    <span>{ev.source_reference}</span>
                  </div>
                  {ev.source_quote && (
                    <blockquote className="p-2.5 rounded-xs bg-finding-bg border border-finding-indicator/30 text-xs font-mono text-foreground leading-relaxed">
                      &ldquo;{ev.source_quote}&rdquo;
                    </blockquote>
                  )}
                  {ev.provenance && (
                    <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-2">
                      <span>Match Confidence: {(ev.provenance.confidence * 100).toFixed(1)}%</span>
                      <span>•</span>
                      <span>{ev.provenance.latency_ms}ms</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-border mt-3 text-[11px] text-muted-foreground">
            Registry Source: Statutory Register API Verification
          </div>
        </section>
      </div>

      {/* AI-Drafted Summary Card */}
      <CaseNarrative narrativeText={narrativeText} evidenceCount={evidenceList.length} />
    </div>
  );
};
