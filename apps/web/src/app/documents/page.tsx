'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { CaseDocument } from '@veritrace/types';
import { FileText, ArrowRight, Search, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const cases = useSimulationStore((s) => s.cases);

  useEffect(() => {
    let isMounted = true;
    apiClient.getAllDocuments().then((docs) => {
      if (isMounted) {
        setDocuments(docs);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = documents.filter((doc) => {
    const parentCase = cases.find((c) => c.id === doc.case_id);
    const searchTarget = `${doc.title} ${doc.filename} ${parentCase?.entity_name || ''}`.toLowerCase();
    return searchTarget.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex-1 px-4 py-6 lg:px-8 max-w-7xl w-full mx-auto flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Document Evidence Intake
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Statutory filings, shareholder registers, and beneficial ownership declarations on file.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          Total Documents: <strong className="text-foreground">{documents.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="relative w-full max-w-sm">
          <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by document name or case entity..."
            className="w-full h-8 pl-8 pr-3 text-xs rounded-xs border border-border bg-surface text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="w-full border border-border rounded-sm bg-surface overflow-hidden divide-y divide-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-2 w-1/3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No documents matching search"
          description="Try adjusting your search terms to view ingested evidence files."
          action={searchQuery ? { label: 'Clear search', onClick: () => setSearchQuery('') } : undefined}
        />
      ) : (
        <div className="w-full border border-border rounded-sm bg-surface overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-raised select-none text-muted-foreground font-semibold">
                  <th scope="col" className="py-2.5 px-4 font-medium">Document Details</th>
                  <th scope="col" className="py-2.5 px-4 font-medium">Associated Case</th>
                  <th scope="col" className="py-2.5 px-4 font-medium">Pages</th>
                  <th scope="col" className="py-2.5 px-4 font-medium">Extracted Fields</th>
                  <th scope="col" className="py-2.5 px-4 font-medium">Uploaded</th>
                  <th scope="col" className="py-2.5 px-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((doc) => {
                  const parentCase = cases.find((c) => c.id === doc.case_id);
                  const formattedDate = new Date(doc.uploaded_at).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={doc.id} className="hover:bg-surface-raised transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-foreground truncate max-w-sm">
                              {doc.title}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              {doc.filename}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {parentCase ? (
                          <Link
                            href={`/cases/${parentCase.id}`}
                            className="text-primary hover:underline font-medium"
                          >
                            {parentCase.entity_name}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground font-mono">{doc.case_id}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 tabular-nums text-muted-foreground">
                        {doc.total_pages} pages
                      </td>
                      <td className="py-3 px-4 tabular-nums font-mono text-muted-foreground">
                        <span className="inline-flex items-center gap-1 text-foreground font-medium">
                          <Eye className="h-3 w-3 text-primary" />
                          <span>{doc.extracted_fields.length} regions</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 tabular-nums text-muted-foreground">
                        {formattedDate}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/cases/${doc.case_id}/documents/${doc.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline px-2.5 py-1 rounded-xs border border-border bg-surface hover:bg-surface-raised"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
