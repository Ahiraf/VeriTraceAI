import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Scale, Database } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border bg-gradient-to-b from-surface to-background">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 text-center flex flex-col items-center">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6 select-none">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>Statutory Registry Intelligence &amp; Beneficial Ownership Compliance</span>
        </div>

        {/* Display headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground max-w-4xl leading-[1.15]">
          Deterministic Beneficial Ownership Verification
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Cross-reference international company filings, detect declared vs. observed shareholder conflicts, and enforce OFAC 50% Rule sanctions thresholds with cryptographic audit trails.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/cases"
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xs bg-primary text-primary-foreground text-xs font-semibold hover:bg-opacity-90 transition-all shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span>Launch Investigator Workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xs border border-border bg-surface text-foreground text-xs font-semibold hover:bg-surface-raised transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span>View Enterprise Pricing</span>
          </Link>
        </div>

        {/* Micro-metrics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-border/80 w-full max-w-2xl text-left">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-primary" />
              <span>FATF Aligned</span>
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              Recommendations 24 &amp; 25 UBO Transparency
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-primary" />
              <span>Multi-Registry</span>
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              UK Companies House &amp; BD RJSC Schedule XII
            </span>
          </div>

          <div className="flex flex-col col-span-2 md:col-span-1">
            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              <span>Deterministic Provenance</span>
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              Verbatim quotes in IBM Plex Mono with OCR provenance
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
