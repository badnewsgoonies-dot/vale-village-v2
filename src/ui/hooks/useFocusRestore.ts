import { useEffect, useRef } from 'preact/hooks';

export default function useFocusRestore<T extends HTMLElement = HTMLElement>(ref: { current: T | null }) {
  const prevActive = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Save current active element and move focus into the provided container if possible
    prevActive.current = document.activeElement as HTMLElement | null;
    try {
      ref?.current?.focus?.();
    } catch (e) {
      // ignore
    }

    return () => {
      // Restore focus to the previously focused element when the container unmounts
      const el = prevActive.current;
      if (el && typeof el.focus === 'function') {
        el.focus();
      }
    };
  }, [ref]);
}
