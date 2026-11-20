import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <Link href="/" className="text-base font-semibold text-primary tracking-tight">
              VeriTrace<span className="text-foreground">AI</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Deterministic beneficial ownership verification and evidentiary UBO compliance. Built for regulatory scrutiny, sanctions screening, and statutory registry cross-referencing.
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-success" />
              <span>FATF Recommendation 24/25 &amp; FinCEN CTA Aligned</span>
            </div>
          </div>

          {/* Platform Nav */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Platform
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
              <li>
                <Link href="/cases" className="hover:text-foreground transition-colors">
                  Case Investigation Queue
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-foreground transition-colors">
                  Document Intake Repository
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-foreground transition-colors">
                  System Architecture &amp; Capabilities
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  Enterprise Plans &amp; Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Regulatory Standards */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Jurisdictions
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-muted-foreground font-mono">
              <li>UK Companies House PSC</li>
              <li>Bangladesh RJSC Schedule XII</li>
              <li>OFAC 50% Rule Screening</li>
              <li>EU 6AMLD Beneficial Ownership</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} VeriTraceAI Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/cases" className="hover:text-foreground flex items-center gap-1 font-medium text-primary">
              <span>Open Investigator Sandbox</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
