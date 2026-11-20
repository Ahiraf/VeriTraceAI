import React from 'react';
import { DocumentViewerClient } from './DocumentViewerClient';
import documentsData from '@/lib/fixtures/documents.json';

export function generateStaticParams() {
  return documentsData.map((d) => ({
    caseId: d.case_id,
    documentId: d.id,
  }));
}

export default function DocumentViewerPage() {
  return <DocumentViewerClient />;
}
