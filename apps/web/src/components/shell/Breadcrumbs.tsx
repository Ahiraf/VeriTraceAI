'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useSimulationStore } from '@/stores/useSimulationStore';

export const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const cases = useSimulationStore((s) => s.cases);

  // Parse path segments: /cases/[caseId]/documents/[docId]
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;
  if (segments[0] !== 'cases' && segments[0] !== 'documents') return null;

  const isDocumentsRoot = segments[0] === 'documents';
  const caseId = segments[0] === 'cases' ? segments[1] : null;
  const isDocumentPage = segments[2] === 'documents';
  const currentCase = caseId ? cases.find((c) => c.id === caseId) : null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="h-8 border-b border-border bg-surface/50 px-4 lg:px-6 flex items-center text-xs text-muted-foreground select-none"
    >
      <ol className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
        {isDocumentsRoot ? (
          <li>
            <span className="font-medium text-foreground">Documents Intake Repository</span>
          </li>
        ) : (
          <li>
            {segments.length === 1 ? (
              <span className="font-medium text-foreground">Cases</span>
            ) : (
              <Link
                href="/cases"
                className="hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
              >
                Cases
              </Link>
            )}
          </li>
        )}

        {caseId && (
          <>
            <li aria-hidden="true" className="text-muted-foreground/60">
              <ChevronRight className="h-3 w-3" />
            </li>
            <li>
              {!isDocumentPage ? (
                <span className="font-medium text-foreground max-w-[200px] truncate block">
                  {currentCase ? currentCase.entity_name : caseId}
                </span>
              ) : (
                <Link
                  href={`/cases/${caseId}`}
                  className="hover:text-foreground transition-colors max-w-[200px] truncate block focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
                >
                  {currentCase ? currentCase.entity_name : caseId}
                </Link>
              )}
            </li>
          </>
        )}

        {isDocumentPage && (
          <>
            <li aria-hidden="true" className="text-muted-foreground/60">
              <ChevronRight className="h-3 w-3" />
            </li>
            <li>
              <span className="font-medium text-foreground">
                Document Viewer
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};
