import React from 'react';
import { Check } from 'lucide-react';

export const ComplianceStandards: React.FC = () => {
  const standards = [
    {
      framework: 'FATF Recommendations 24 & 25',
      focus: 'Transparency and Beneficial Ownership of Legal Persons and Legal Arrangements.',
    },
    {
      framework: 'FinCEN Corporate Transparency Act (CTA)',
      focus: 'UBO reporting verification, 25% ownership threshold computation, and exempt entity screening.',
    },
    {
      framework: 'UK Economic Crime & Corporate Transparency Act (ECCTA)',
      focus: 'Companies House PSC verification, registered office address checks, and officer identity validation.',
    },
    {
      framework: 'EU 6th Anti-Money Laundering Directive (6AMLD)',
      focus: 'Cross-border beneficial ownership tracing and criminal liability risk mitigation.',
    },
  ];

  return (
    <section className="py-14 border-t border-border bg-surface-raised">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            Built Directly on International Regulatory Frameworks
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Deterministic rules eliminate compliance ambiguity across statutory jurisdictions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {standards.map((std) => (
            <div key={std.framework} className="p-3.5 rounded-xs border border-border bg-surface flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Check className="h-3.5 w-3.5 text-success shrink-0" />
                <span className="truncate">{std.framework}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {std.focus}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
