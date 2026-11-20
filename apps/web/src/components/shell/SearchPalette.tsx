'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Building, ArrowRight } from 'lucide-react';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { StatusBadge } from '@/components/shared/StatusBadge';

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchPalette: React.FC<SearchPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const cases = useSimulationStore((s) => s.cases);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = cases.filter(
    (c) =>
      c.entity_name.toLowerCase().includes(query.toLowerCase()) ||
      c.registry_id.toLowerCase().includes(query.toLowerCase()) ||
      c.jurisdiction.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length ? (prev + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      router.push(`/cases/${filtered[selectedIndex].id}`);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Case Search Palette"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-border bg-surface-raised shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-border bg-surface">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases by entity name, ID, jurisdiction..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded-xs bg-surface-raised border border-border text-muted-foreground font-mono">
            ESC
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No cases matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            <ul className="flex flex-col gap-0.5" role="listbox">
              {filtered.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <li
                    key={item.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      router.push(`/cases/${item.id}`);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between px-3 py-2 rounded-sm text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-foreground hover:bg-surface-raised'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="truncate text-foreground font-medium">
                          {item.entity_name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {item.registry_id} • {item.jurisdiction}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={item.status} />
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
