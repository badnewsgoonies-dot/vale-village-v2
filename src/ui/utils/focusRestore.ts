/**
 * focusRestore helper
 * Captures the currently focused element and returns a function to restore focus to it.
 */

export function focusRestore(): () => void {
  const prev = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  return () => {
    if (prev && typeof prev.focus === 'function') {
      prev.focus();
    }
  };
}

export function attachFocusRestore(triggerTestId: string, modalTestId: string, closeTestId: string): void {
  if (typeof document === 'undefined') return;
  const recordKey = '__focusRestore_last';
  const sel = (id: string) => `[data-testid="${id}"]`;
  const trigger = document.querySelector(sel(triggerTestId)) as HTMLElement | null;
  if (trigger) {
    trigger.addEventListener('click', () => {
      (window as any)[recordKey] = trigger;
    });
  }

  const restore = () => {
    const last = (window as any)[recordKey] as HTMLElement | undefined;
    if (last && typeof last.focus === 'function') {
      try { last.focus(); } catch (e) { /* ignore */ }
      delete (window as any)[recordKey];
    }
  };

  const closeBtn = document.querySelector(sel(closeTestId)) as HTMLElement | null;
  if (closeBtn) closeBtn.addEventListener('click', restore);

  // Fallback: if modal is removed from DOM, restore focus
  const modal = document.querySelector(sel(modalTestId));
  if (modal && modal.parentNode) {
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const n of Array.from(m.removedNodes)) {
          if (n === modal) {
            restore();
            observer.disconnect();
            return;
          }
        }
      }
    });
    observer.observe(modal.parentNode, { childList: true });
  }
}
