import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
      <h2 className="text-xl font-semibold text-foreground">Page Not Found</h2>
      <p className="text-xs text-muted-foreground mt-1 mb-4">
        The requested compliance route does not exist or has been archived.
      </p>
      <Link
        href="/cases"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Return to Case Workspace</span>
      </Link>
    </div>
  );
}
