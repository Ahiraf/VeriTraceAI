import React from 'react';
import { CaseDetailPageClient } from './CaseDetailPageClient';
import casesData from '@/lib/fixtures/cases.json';

export function generateStaticParams() {
  return casesData.map((c) => ({
    caseId: c.id,
  }));
}

export default function CaseDetailPage() {
  return <CaseDetailPageClient />;
}
