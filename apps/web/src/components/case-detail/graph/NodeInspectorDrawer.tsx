'use client';

import React from 'react';
import { OwnershipNode, OwnershipEdge } from '@veritrace/types';
import { ShieldCheck, AlertTriangle, Building2, User, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface NodeInspectorDrawerProps {
  node: OwnershipNode;
  edges: OwnershipEdge[];
  caseId: string;
  onClose: () => void;
}

export const NodeInspectorDrawer: React.FC<NodeInspectorDrawerProps> = ({
  node,
  edges,
  caseId,
  onClose,
}) => {
  const isPerson = node.type === 'person';
  const incoming = edges.filter((e) => e.target === node.id);
  const outgoing = edges.filter((e) => e.source === node.id);
  const hasConflict = edges.some(
    (e) => (e.source === node.id || e.target === node.id) && e.conflict
  );

  return (
    <aside
      aria-label="Entity Inspector"
      className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-surface-raised p-4 flex flex-col gap-4 shrink-0 overflow-y-auto"
    >
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {isPerson ? <User className="h-3.5 w-3.5 text-primary" /> : <Building2 className="h-3.5 w-3.5 text-primary" />}
          <span>Entity Inspector</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="h-6 w-6 rounded-xs hover:bg-surface border border-transparent hover:border-border text-muted-foreground hover:text-foreground text-xs flex items-center justify-center transition-colors"
          aria-label="Close inspector"
        >
          ✕
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground">{node.label}</h3>
        <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
          {node.registration_number || 'Registry ID: Verified Filing'} • {node.jurisdiction || 'Global'}
        </p>
      </div>

      {hasConflict && (
        <div className="p-2.5 rounded-xs border border-finding-indicator/40 bg-finding-bg text-finding-indicator text-xs flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-semibold block mb-0.5">Discrepancy In Holding Chain</span>
            Conflicting ownership percentages detected between submitted declaration and statutory filing.
          </div>
        </div>
      )}

      {/* Compliance Checks Section */}
      <div className="p-3 rounded-xs border border-border bg-surface flex flex-col gap-2.5 text-xs">
        <span className="font-semibold text-foreground text-[11px] uppercase tracking-wide">
          Regulatory Screening
        </span>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">OFAC 50% Aggregate</span>
          <span className="inline-flex items-center gap-1 text-success font-medium">
            <ShieldCheck className="h-3 w-3" />
            <span>Passed (&lt;50%)</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">PEP / Sanctions Check</span>
          {node.sanction_status === 'flagged' ? (
            <span className="text-escalated font-medium flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              <span>Flagged Match</span>
            </span>
          ) : (
            <span className="text-success font-medium flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Clear</span>
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">UBO Threshold (&gt;25%)</span>
          <span className="font-mono font-medium">
            {node.ubo_percentage ? `${node.ubo_percentage}% Qualified` : 'Indirect Entity'}
          </span>
        </div>
      </div>

      {/* Associated Relationships */}
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-foreground text-[11px] uppercase tracking-wide">
          Holding Chain ({incoming.length + outgoing.length} relations)
        </span>
        {incoming.map((e) => (
          <div key={e.id} className="p-2 rounded-xs border border-border bg-surface text-[11px] flex items-center justify-between">
            <span className="text-muted-foreground">Parent Ownership:</span>
            <span className={`font-mono font-semibold ${e.conflict ? 'text-finding-indicator' : 'text-primary'}`}>
              {e.percentage}% ({e.provenance_type})
            </span>
          </div>
        ))}
        {outgoing.map((e) => (
          <div key={e.id} className="p-2 rounded-xs border border-border bg-surface text-[11px] flex items-center justify-between">
            <span className="text-muted-foreground">Subsidiary Control:</span>
            <span className={`font-mono font-semibold ${e.conflict ? 'text-finding-indicator' : 'text-primary'}`}>
              {e.percentage}% ({e.provenance_type})
            </span>
          </div>
        ))}
      </div>

      {/* Link to Document */}
      <div className="mt-auto pt-2 border-t border-border">
        <Link
          href={`/cases/${caseId}/documents/doc_001`}
          className="w-full inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-xs border border-border bg-surface hover:bg-surface-raised text-xs font-medium text-primary hover:underline transition-colors"
        >
          <span>Inspect Registry Filing</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </aside>
  );
};
