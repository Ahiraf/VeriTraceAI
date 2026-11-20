import React from 'react';
import Link from 'next/link';
import {
  CapabilitiesSection,
  WorkflowSteps,
  ComplianceStandards,
} from '@/components/marketing';
import { ArrowRight, Database, GitFork, FileSearch, ShieldCheck } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="flex flex-col w-full">
      <section className="pt-12 pb-16 border-b border-border bg-surface text-center">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-4">
            <span>Deterministic Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground">
            Engineered for Irrefutable Compliance Proof
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Every feature in VeriTraceAI is constructed to withstand adversarial legal review, statutory inquiries, and sanctions enforcement scrutiny.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/cases"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xs bg-primary text-primary-foreground text-xs font-semibold hover:bg-opacity-90"
            >
              <span>Explore Live Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/documents"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xs border border-border bg-surface text-foreground text-xs font-semibold hover:bg-surface-raised"
            >
              <span>Inspect Document Intake</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Deep-dive pillars */}
      <section className="py-16 max-w-6xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-sm border border-border bg-surface flex flex-col gap-3">
          <Database className="h-6 w-6 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Bilateral Multi-Registry Ingestion
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ingests both corporate registry APIs (UK Companies House PSC, Bangladesh RJSC Form XII) and statutory legal filings. Validates jurisdiction identifiers, registered offices, and officer appointments.
          </p>
        </div>

        <div className="p-6 rounded-sm border border-border bg-surface flex flex-col gap-3">
          <GitFork className="h-6 w-6 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Graph Neural Network Traversal
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Maps ownership shares across parent companies and nominees. Detects circular ownership rings and dynamically calculates aggregate control against OFAC 50% Rule sanctions thresholds.
          </p>
        </div>

        <div className="p-6 rounded-sm border border-border bg-surface flex flex-col gap-3">
          <FileSearch className="h-6 w-6 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            OCR Bounding Box Source Coordinates
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every extracted ownership claim links back to its exact document pixel coordinates with model confidence provenance. Visual quotes render strictly in IBM Plex Mono to preserve source fidelity.
          </p>
        </div>

        <div className="p-6 rounded-sm border border-border bg-surface flex flex-col gap-3">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            State-Machine Governed Determinations
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Terminal decisions (Clear, Request Evidence, Escalate) are governed by mathematical transition guards. Investigators must provide written rationale, generating cryptographic audit proofs.
          </p>
        </div>
      </section>

      <CapabilitiesSection />
      <WorkflowSteps />
      <ComplianceStandards />
    </div>
  );
}
