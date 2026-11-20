import { useEffect } from 'react';

export interface ShortcutHandlers {
  onSearch?: () => void;
  onThemeToggle?: () => void;
  onNextRow?: () => void;
  onPrevRow?: () => void;
  onSelectRow?: () => void;
  onSelectFindingIndex?: (index: number) => void;
  onOpenDecision?: () => void;
  onEscape?: () => void;
  onBack?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement | null;
      const isInput =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handlers.onSearch?.();
        return;
      }

      if (modKey && e.key === '.') {
        e.preventDefault();
        handlers.onThemeToggle?.();
        return;
      }

      if (isInput) {
        if (e.key === 'Escape') {
          handlers.onEscape?.();
        }
        return;
      }

      if (e.key === 'Escape') {
        handlers.onEscape?.();
      } else if (e.key === 'j' || e.key === 'ArrowDown') {
        handlers.onNextRow?.();
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        handlers.onPrevRow?.();
      } else if (e.key === 'Enter') {
        handlers.onSelectRow?.();
      } else if (e.key === 'd' || e.key === 'D') {
        handlers.onOpenDecision?.();
      } else if (e.key === 'Backspace') {
        handlers.onBack?.();
      } else if (/^[1-9]$/.test(e.key)) {
        handlers.onSelectFindingIndex?.(parseInt(e.key, 10) - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers, enabled]);
}
