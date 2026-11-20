import React from 'react';
import { Check, Minus } from 'lucide-react';

export const PricingComparison: React.FC = () => {
  const categories = [
    {
      name: 'Registry Intelligence & Ingestion',
      features: [
        { name: 'UK Companies House (PSC & CS01)', core: true, pro: true, enterprise: true },
        { name: 'Bangladesh RJSC (Schedule XII)', core: true, pro: true, enterprise: true },
        { name: 'EU Beneficial Ownership Registers', core: false, pro: true, enterprise: true },
        { name: 'Custom National Registry Connectors', core: false, pro: false, enterprise: true },
      ],
    },
    {
      name: 'Network Graph & Sanctions Screening',
      features: [
        { name: 'Two-Column Discrepancy Contrast', core: true, pro: true, enterprise: true },
        { name: 'Interactive Graph ML Visualizer (@xyflow)', core: false, pro: true, enterprise: true },
        { name: 'OFAC 50% Rule Sanctions Screening', core: false, pro: true, enterprise: true },
        { name: 'Circular Ownership Cycle Detection', core: false, pro: true, enterprise: true },
      ],
    },
    {
      name: 'Audit, Security & Governance',
      features: [
        { name: 'Mandatory Rationale Enforcement (≥10 chars)', core: true, pro: true, enterprise: true },
        { name: 'Document Bounding Box Coordinate Overlays', core: false, pro: true, enterprise: true },
        { name: 'WORM Immutable Audit Partitions', core: false, pro: false, enterprise: true },
        { name: 'Air-Gapped / On-Premise Deployment', core: false, pro: false, enterprise: true },
      ],
    },
  ];

  return (
    <div className="w-full mt-20">
      <div className="text-center mb-10">
        <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          Detailed Capability Matrix
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Compare statutory verification capabilities across enterprise tiers.
        </p>
      </div>

      <div className="border border-border rounded-sm bg-surface overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-raised select-none text-muted-foreground">
              <th scope="col" className="p-4 font-semibold text-foreground w-1/2 sm:w-2/5">Platform Feature</th>
              <th scope="col" className="p-4 font-semibold text-center w-1/6">Core</th>
              <th scope="col" className="p-4 font-semibold text-center w-1/6 text-primary">Pro</th>
              <th scope="col" className="p-4 font-semibold text-center w-1/6">Sovereign</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((cat) => (
              <React.Fragment key={cat.name}>
                <tr className="bg-surface-raised/40">
                  <td colSpan={4} className="p-3 px-4 font-bold text-foreground uppercase tracking-wider text-[11px]">
                    {cat.name}
                  </td>
                </tr>
                {cat.features.map((feat) => (
                  <tr key={feat.name} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="p-3.5 px-4 text-foreground/90 font-medium">{feat.name}</td>
                    <td className="p-3.5 text-center">
                      {feat.core ? (
                        <Check className="h-4 w-4 text-primary mx-auto" />
                      ) : (
                        <Minus className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                      )}
                    </td>
                    <td className="p-3.5 text-center bg-primary/5">
                      {feat.pro ? (
                        <Check className="h-4 w-4 text-primary mx-auto" />
                      ) : (
                        <Minus className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      {feat.enterprise ? (
                        <Check className="h-4 w-4 text-primary mx-auto" />
                      ) : (
                        <Minus className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
