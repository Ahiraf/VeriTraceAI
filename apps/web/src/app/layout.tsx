import type { Metadata } from 'next';
import '../styles/globals.css';
import { Providers } from './providers';
import { TopNav } from '@/components/shell/TopNav';
import { Breadcrumbs } from '@/components/shell/Breadcrumbs';
import { Footer } from '@/components/shell/Footer';

export const metadata: Metadata = {
  title: 'VeriTraceAI — Automated Beneficial Ownership Verification',
  description: 'Evidence-first regulatory compliance and beneficial ownership verification platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground flex flex-col">
        <Providers>
          <TopNav />
          <Breadcrumbs />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
