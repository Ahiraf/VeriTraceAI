import React from 'react';
import { GitFork, FileSearch, ShieldCheck, Database } from 'lucide-react';

export const CapabilitiesSection: React.FC = () => {
  const capabilities = [
    {
      icon: Database,
      title: 'Statutory Registry Cross-Referencing',
      description:
        'Direct synchronization with UK Companies House and Bangladesh RJSC Schedule XII registries to verify legal name variants, director appointments, and statutory filing histories.',
    },
    {
      icon: GitFork,
      title: 'Beneficial Ownership Network Graphs',
      description:
        'Resolves multi-tier parent-subsidiary trees, highlights conflicting ownership percentages in amber, and computes aggregated control against the OFAC 50% Rule sanctions criteria.',
    },
    {
      icon: FileSearch,
      title: 'Monospace Source Provenance',
      description:
        'Source excerpts strictly render in IBM Plex Mono alongside document coordinate bounding boxes, guaranteeing that quoted declarations never blur with AI narrative drafts.',
    },
    {
      icon: ShieldCheck,
      title: 'Consequential Audit Ledger',
      description:
        'No stealth approvals. Compliance state transitions require verified written rationale (minimum 10 characters) and generate verifiable cryptographic hashes for examination.',
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-border bg-surface">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Compliance Architecture Built for Rigorous Scrutiny
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Designed for compliance officers, legal analysts, and regulatory investigators who require verifiable, reproducible evidence rather than probabilistic black-box guesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div key={cap.title} className="flex flex-col gap-2 p-4 rounded-sm border border-border bg-background">
                <div className="h-8 w-8 rounded-xs bg-primary/10 text-primary flex items-center justify-center mb-1">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {cap.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
