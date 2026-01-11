import { RefObject } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

/**
 * Small, safe focus-restore hook for menus.
 * - Call with isOpen true when the menu is mounted/opened.
 * - On unmount/close the hook will attempt to restore focus to the
 *   previously active element, or to an optional fallback ref.
 */
export function useFocusRestore(isOpen: boolean, fallbackRef?: RefObject<HTMLElement>) {
  const previous = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) {
      previous.current = document.activeElement;
    }

    return () => {
      const prev = previous.current as HTMLElement | null;
      try {
        if (prev && document.contains(prev) && typeof prev.focus === 'function') {
          prev.focus();
          return;
        }
      } catch (e) {
        // swallow any focus-related errors
      }

      if (fallbackRef?.current && typeof fallbackRef.current.focus === 'function') {
        try { fallbackRef.current.focus(); } catch (_) { /* noop */ }
      }
    };
  }, [isOpen, fallbackRef]);
}
