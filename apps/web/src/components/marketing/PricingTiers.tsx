'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

export const PricingTiers: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      name: 'Investigator Core',
      description: 'For boutique compliance agencies and independent AML/KYC investigators.',
      priceMonthly: 490,
      priceAnnual: 390,
      popular: false,
      features: [
        'Up to 50 active case investigations / mo',
        'UK Companies House & BD RJSC integration',
        'Two-column evidence comparison interface',
        'Standard audit trail logging',
        'Exportable compliance audit PDF summaries',
        'Single investigator seat included',
      ],
      cta: 'Start Core Sandbox',
      href: '/cases',
    },
    {
      name: 'Compliance Pro',
      description: 'For mid-size banks, maritime logistics, and fintech compliance departments.',
      priceMonthly: 1850,
      priceAnnual: 1480,
      popular: true,
      features: [
        'Up to 500 active case investigations / mo',
        'Full beneficial ownership network graph ML',
        'Automated OFAC 50% Rule sanctions screening',
        'Document canvas with SVG OCR bounding boxes',
        'Multi-investigator delegation and review queues',
        'Mandatory rationale audit ledger enforcement',
        'Priority registry synchronization (15-min SLA)',
        '5 investigator seats included ($120/seat add-on)',
      ],
      cta: 'Deploy Pro Investigation Suite',
      href: '/cases',
    },
    {
      name: 'Enterprise Sovereign',
      description: 'For tier-1 financial institutions, central authorities, and sovereign regulators.',
      priceMonthly: null,
      priceAnnual: null,
      popular: false,
      features: [
        'Unlimited active case investigations',
        'Dedicated VPC or air-gapped on-premise deployment',
        'Custom national statutory registry connectors',
        'WORM immutable audit ledger partitions',
        'Custom Graph Neural Network training pipelines',
        'Dedicated compliance officer & 24/7 SLA guarantee',
        'Unlimited investigator and auditor seats',
        'Formal regulatory audit defense representation',
      ],
      cta: 'Contact Sovereign Procurement',
      href: '/cases',
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Billing Switcher */}
      <div className="flex items-center gap-3 p-1 rounded-xs border border-border bg-surface-raised mb-12">
        <button
          type="button"
          onClick={() => setIsAnnual(false)}
          className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-colors ${
            !isAnnual ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Monthly Billing
        </button>
        <button
          type="button"
          onClick={() => setIsAnnual(true)}
          className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-colors flex items-center gap-1.5 ${
            isAnnual ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>Annual Billing</span>
          <span className="px-1.5 py-0.2 rounded-xs bg-success-bg text-success text-[10px] font-bold">
            Save 20%
          </span>
        </button>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {tiers.map((t) => {
          const price = isAnnual ? t.priceAnnual : t.priceMonthly;

          return (
            <div
              key={t.name}
              className={`p-6 rounded-sm border bg-surface flex flex-col justify-between transition-all ${
                t.popular
                  ? 'border-primary ring-1 ring-primary shadow-md relative'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              {t.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-xs bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider select-none">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-base font-semibold text-foreground">{t.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed min-h-[36px]">
                  {t.description}
                </p>

                <div className="my-6 pt-4 border-t border-border">
                  {price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold tracking-tight text-foreground font-mono">
                        ${price}
                      </span>
                      <span className="text-xs text-muted-foreground">/ month</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold tracking-tight text-foreground">
                      Custom Sovereign
                    </div>
                  )}
                  {isAnnual && price !== null && (
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Billed annually (${price * 12} / year)
                    </div>
                  )}
                </div>

                <ul className="flex flex-col gap-2.5 text-xs text-muted-foreground mb-8">
                  {t.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="leading-tight text-foreground/90">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={t.href}
                className={`w-full h-9 rounded-xs text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                  t.popular
                    ? 'bg-primary text-primary-foreground hover:bg-opacity-90'
                    : 'border border-border bg-surface text-foreground hover:bg-surface-raised'
                }`}
              >
                <span>{t.cta}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
