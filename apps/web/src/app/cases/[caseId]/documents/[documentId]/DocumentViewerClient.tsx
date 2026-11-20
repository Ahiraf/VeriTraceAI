'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { CaseDocument } from '@veritrace/types';
import { DocumentCanvas } from '@/components/document-viewer/DocumentCanvas';
import { ExtractedFieldList } from '@/components/document-viewer/ExtractedFieldList';
import { ZoomControls } from '@/components/document-viewer/ZoomControls';
import { DocumentViewerSkeleton } from '@/components/document-viewer/DocumentViewerSkeleton';
import { ArrowLeft, FileText } from 'lucide-react';

export function DocumentViewerClient() {
  const params = useParams();
  const caseId = (params?.caseId as string) || '';
  const documentId = (params?.documentId as string) || '';

  const [documentData, setDocumentData] = useState<CaseDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(3);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>('fld_002');

  useEffect(() => {
    let isMounted = true;
    apiClient.getDocument(caseId, documentId).then((doc) => {
      if (isMounted) {
        setDocumentData(doc);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [caseId, documentId]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, documentData?.total_pages || 8));

  if (isLoading) {
    return <DocumentViewerSkeleton />;
  }

  if (!documentData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-base font-semibold text-foreground">Document Not Found</h2>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          The requested document &ldquo;{documentId}&rdquo; could not be retrieved from evidence intake.
        </p>
        <Link
          href={`/cases/${caseId}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Case Detail</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background min-h-0">
      {/* Top document navigation bar */}
      <div className="border-b border-border bg-surface px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/cases/${caseId}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline shrink-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Case</span>
          </Link>
          <span className="text-border" aria-hidden="true">|</span>
          <div className="flex items-center gap-1.5 min-w-0">
            <FileText className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-semibold text-foreground truncate">
              {documentData.filename}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-muted-foreground font-mono hidden md:block">
          Evidence Bounding Box Inspection
        </div>
      </div>

      {/* Zoom and page bar */}
      <ZoomControls
        zoom={zoom}
        currentPage={currentPage}
        totalPages={documentData.total_pages}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />

      {/* Split canvas and fields list */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        <DocumentCanvas
          sampleImage={documentData.sample_page_image}
          zoom={zoom}
          extractedFields={documentData.extracted_fields}
          selectedFieldId={selectedFieldId}
          onSelectField={(id) => setSelectedFieldId(id)}
        />

        <ExtractedFieldList
          fields={documentData.extracted_fields}
          selectedFieldId={selectedFieldId}
          onSelectField={(id) => setSelectedFieldId(id)}
        />
      </div>
    </div>
  );
}
