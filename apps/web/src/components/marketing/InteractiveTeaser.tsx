'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, FileText, Database, ShieldAlert, Check } from 'lucide-react';

export const InteractiveTeaser: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'conflict' | 'resolved'>('conflict');

  return (
    <section className="py-16 md:py-20 max-w-6xl mx-auto px-4 lg:px-8">
      <div className="flex flex-col items-center text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Real-Time Evidentiary Conflict Detection
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
          VeriTraceAI contrasts self-reported shareholder declarations directly with statutory filings, pinning discrepancies to source document coordinates.
        </p>

        {/* Interactive toggle */}
        <div className="mt-6 inline-flex p-1 rounded-xs border border-border bg-surface-raised">
          <button
            type="button"
            onClick={() => setActiveTab('conflict')}
            className={`px-3 py-1 rounded-xs text-xs font-medium transition-colors ${
              activeTab === 'conflict'
                ? 'bg-finding-bg text-finding-indicator font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Active Discrepancy (UK-12345678)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resolved')}
            className={`px-3 py-1 rounded-xs text-xs font-medium transition-colors ${
              activeTab === 'resolved'
                ? 'bg-success-bg text-success font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Resolved Case (BD-C-987654)
          </button>
        </div>
      </div>

      {/* Live Teaser Card */}
      <div className="rounded-sm border border-border bg-surface shadow-md overflow-hidden">
        {/* Card Header */}
        <div className="border-b border-border bg-surface-raised px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-foreground">
              {activeTab === 'conflict' ? 'Nordhaven Trading Ltd' : 'Bengal Shipping Corp'}
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              {activeTab === 'conflict' ? 'UK-12345678 • UK' : 'BD-C-987654 • BD'}
            </span>
          </div>

          <div>
            {activeTab === 'conflict' ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-xs font-medium bg-finding-bg text-finding-indicator border border-finding-indicator/30">
                <span className="text-[10px]">⚑</span>
                <span>Under Review (2 Discrepancies)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-xs font-medium bg-success-bg text-success border border-success/30">
                <Check className="h-3 w-3" />
                <span>Cleared (Audit Sealed)</span>
              </span>
            )}
          </div>
        </div>

        {/* Comparison Body */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Declared */}
          <div className="rounded-xs border border-border bg-surface p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Declared Ingestion
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {activeTab === 'conflict' ? '40% Ownership' : '100% Wholly Owned'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span>shareholder_declaration_2026.pdf (p.3)</span>
              </div>
              <blockquote className="p-2.5 rounded-xs bg-finding-bg border border-finding-indicator/30 text-xs font-mono text-foreground leading-relaxed">
                {activeTab === 'conflict'
                  ? '“Nordhaven Trading Ltd maintains a forty percent (40%) qualifying ownership share in Greenfield Subsidiary Ltd.”'
                  : '“Bengal Shipping Corp certifies 100% direct operational custody of all dry bulk carrier assets.”'}
              </blockquote>
            </div>
            <div className="mt-3 pt-2 text-[10px] font-mono text-muted-foreground">
              OCR Model: doc-ocr-v2.1 • 98.5% confidence
            </div>
          </div>

          {/* Observed */}
          <div className="rounded-xs border border-border bg-surface p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Observed Registry Record
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {activeTab === 'conflict' ? '55% PSC Majority' : 'RJSC Certified Form XII'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                <Database className="h-3.5 w-3.5 text-primary" />
                <span>Companies House PSC Confirmation CS01</span>
              </div>
              <blockquote className="p-2.5 rounded-xs bg-finding-bg border border-finding-indicator/30 text-xs font-mono text-foreground leading-relaxed">
                {activeTab === 'conflict'
                  ? '“Ownership of shares - More than 50% but less than 75% (Notified holding: 55%). Date of change: 12/04/2026.”'
                  : '“Registered Office of Bengal Shipping Corp: 42 Dilkusha C/A, Motijheel, Dhaka-1000.”'}
              </blockquote>
            </div>
            <div className="mt-3 pt-2 text-[10px] font-mono text-muted-foreground">
              Resolver: ubo-resolver-transformer-v1 • 94.2% confidence
            </div>
          </div>
        </div>

        {/* Card Footer Action */}
        <div className="border-t border-border bg-surface-raised px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5 text-finding-indicator" />
            <span>Interactive inspection ready. Full bounding box provenance enabled.</span>
          </div>

          <Link
            href={activeTab === 'conflict' ? '/cases/case_001' : '/cases/case_002'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span>Open Complete Case File</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
};
