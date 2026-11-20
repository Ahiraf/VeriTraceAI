import React from 'react';
import {
  PricingTiers,
  PricingComparison,
  PricingFaq,
  ComplianceStandards,
} from '@/components/marketing';

export default function PricingPage() {
  return (
    <div className="flex-1 py-12 px-4 lg:px-8 max-w-6xl w-full mx-auto flex flex-col gap-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          Transparent Compliance Intelligence Pricing
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          From boutique AML investigation practices to sovereign central bank oversight. Every tier includes deterministic cross-referencing and immutable audit logging.
        </p>
      </div>

      <PricingTiers />
      <PricingComparison />
      <PricingFaq />
      <ComplianceStandards />
    </div>
  );
}
