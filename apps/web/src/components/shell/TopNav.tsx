'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Search, Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import { SearchPalette } from './SearchPalette';

export const TopNav: React.FC = () => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { href: '/features', label: 'Capabilities', active: pathname === '/features' },
    { href: '/pricing', label: 'Pricing', active: pathname === '/pricing' },
    { href: '/cases', label: 'Cases Queue', active: pathname.startsWith('/cases') },
    { href: '/documents', label: 'Document Intake', active: pathname.startsWith('/documents') },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 h-12 w-full border-b border-border bg-surface/95 backdrop-blur px-4 lg:px-6">
        <div className="flex h-full items-center justify-between">
          {/* Left: Brand + Nav */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-[15px] font-semibold text-primary tracking-tight select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              VeriTrace<span className="text-foreground">AI</span>
            </Link>

            <nav className="hidden md:flex items-center h-12 gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center h-12 text-xs font-medium transition-colors ${
                    link.active
                      ? 'text-primary border-b-2 border-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Search, Theme Toggle, Workspace CTA */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 h-7 px-2.5 rounded-xs border border-border bg-surface-raised text-muted-foreground hover:text-foreground text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
              aria-label="Open search palette"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search cases...</span>
              <kbd className="hidden lg:inline-block px-1 py-0.5 text-[10px] rounded-xs bg-surface border border-border font-mono text-muted-foreground">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="h-8 w-8 inline-flex items-center justify-center rounded-xs text-muted-foreground hover:text-foreground hover:bg-surface-raised transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
              aria-label="Toggle light/dark theme"
            >
              {mounted ? (
                resolvedTheme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )
              ) : (
                <div className="h-4 w-4" />
              )}
            </button>

            <Link
              href="/cases"
              className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-xs bg-primary text-primary-foreground text-xs font-medium hover:bg-opacity-90 transition-colors"
            >
              <span>Workspace</span>
              <ArrowRight className="h-3 w-3" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden h-8 w-8 inline-flex items-center justify-center rounded-xs text-muted-foreground hover:text-foreground"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-surface-raised px-4 py-3 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="flex items-center gap-2 h-8 px-3 rounded-xs border border-border bg-surface text-muted-foreground text-xs"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search cases (⌘K)</span>
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-medium py-1.5 text-foreground hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cases"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-1 flex items-center justify-center gap-1.5 h-8 rounded-xs bg-primary text-primary-foreground text-xs font-medium"
            >
              <span>Launch Investigator Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </header>

      <SearchPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
