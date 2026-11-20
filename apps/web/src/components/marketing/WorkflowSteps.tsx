import React from 'react';

export const WorkflowSteps: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Statutory Filing Ingestion',
      desc: 'Upload shareholder registers, Articles of Association, or PSC filings. OCR extracts entity names, stakes, and signatories with precise spatial bounding boxes.',
    },
    {
      step: '02',
      title: 'Graph Neural Resolution',
      desc: 'Ingested declarations are resolved against official corporate registries. Multi-layered parent-subsidiary trees and Ultimate Beneficial Owners (UBO) are mapped.',
    },
    {
      step: '03',
      title: 'Evidentiary Discrepancy Flagging',
      desc: 'Discrepancies (such as 40% declared vs 55% observed majority control) are highlighted in calm amber indicators without alarmist red styling.',
    },
    {
      step: '04',
      title: 'Audited Decision Sealing',
      desc: 'Investigators record determinations (Clear, Request Evidence, or Escalate) accompanied by mandatory written rationale, generating an immutable audit ledger entry.',
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            How VeriTraceAI Executes Verification
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            From raw statutory PDF ingestion to cryptographically sealed compliance determination.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="p-4 rounded-xs border border-border bg-surface flex flex-col gap-2">
              <span className="text-xl font-mono font-bold text-primary">
                {s.step}
              </span>
              <h3 className="text-xs font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
