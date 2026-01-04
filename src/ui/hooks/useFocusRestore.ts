import { useEffect, useRef } from 'preact/hooks';

type RefLike = { current: HTMLElement | null } | null | undefined;

/**
 * Minimal focus restore hook.
 * - When `isOpen` becomes true, captures document.activeElement.
 * - When `isOpen` becomes false, attempts to restore focus to the previously focused element
 *   if it is still in the document.
 *
 * The contract (docs/focus-restore-contract.md) declares the testids used by consumers:
 * - data-testid="focus-restore-open-button" the control that opens the dialog
 * - data-testid="focus-restore-dialog" the dialog/container that receives focus when opened
 * - data-testid="focus-restore-close" the close button inside the dialog
 */
export default function useFocusRestore(isOpen: boolean, containerRef?: RefLike) {
  const previousFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Remember current focused element when opening
      previousFocused.current = document.activeElement as HTMLElement | null;

      // Move focus to containerRef or to the dialog testid if available
      const container = containerRef?.current ?? document.querySelector('[data-testid="focus-restore-dialog"]') as HTMLElement | null;
      if (container) {
        // Try to focus first focusable inside, otherwise focus container
        const focusable = container.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        (focusable ?? container).focus?.();
      }

      return;
    }

    // On close: restore focus to previously focused element if still present
    const prev = previousFocused.current;
    if (prev && document.contains(prev)) {
      // Restore on next tick to allow close animations/DOM updates
      const t = setTimeout(() => prev.focus?.(), 0);
      return () => clearTimeout(t);
    }

    return;
  }, [isOpen, containerRef]);
}
