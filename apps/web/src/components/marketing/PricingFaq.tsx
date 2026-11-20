'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const PricingFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does VeriTraceAI maintain evidence determinism without hallucination?',
      a: 'VeriTraceAI never relies on generative models to invent ownership facts. All evidence quotes are extracted verbatim via OCR coordinate bounding boxes, rendered strictly in monospace (IBM Plex Mono), and cross-referenced with statutory API feeds from official national registries.',
    },
    {
      q: 'What is the OFAC 50% Rule and how is it calculated?',
      a: 'Under OFAC guidance, any entity owned 50 percent or more in the aggregate by one or more blocked persons is considered blocked by operation of law. VeriTraceAI traverses the multi-tier ownership graph to calculate aggregated direct and indirect control shares automatically.',
    },
    {
      q: 'Can VeriTraceAI be deployed on-premise or in an isolated private cloud?',
      a: 'Yes. The Enterprise Sovereign tier provides full containerized deployment blueprints or bare-metal setups that operate without external telemetry, satisfying strict national banking secrecy and data residency requirements.',
    },
    {
      q: 'How are state-altering determinations audited?',
      a: 'All actions (Clear, Request Evidence, Escalate) are governed by strict finite-state transition machines. State alterations require a mandatory written rationale (minimum 10 characters) and generate a cryptographic SHA-256 seal stored in an append-only ledger.',
    },
  ];

  return (
    <div className="w-full mt-20 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          Frequently Asked Questions
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Everything compliance, procurement, and legal teams need to know.
        </p>
      </div>

      <div className="divide-y divide-border border border-border rounded-sm bg-surface overflow-hidden">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div key={faq.q} className="p-4 transition-colors">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4 select-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
              >
                <span className="text-xs font-semibold text-foreground">{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-primary shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </button>

              {isOpen && (
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
