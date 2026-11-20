import React from 'react';
import {
  HeroSection,
  InteractiveTeaser,
  ComplianceStandards,
  CapabilitiesSection,
  WorkflowSteps,
} from '@/components/marketing';

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <InteractiveTeaser />
      <ComplianceStandards />
      <CapabilitiesSection />
      <WorkflowSteps />
    </div>
  );
}
