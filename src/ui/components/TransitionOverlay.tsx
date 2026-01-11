import { useEffect, useState } from 'preact/hooks';

interface TransitionOverlayProps {
  isVisible: boolean;
  durationMs?: number;
  onComplete?: () => void;
}

/**
 * Simple fade-to-black overlay for transitions (e.g., floor changes)
 */
export function TransitionOverlay({ isVisible, durationMs = 400, onComplete }: TransitionOverlayProps) {
  const [render, setRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setRender(true);
      const timer = setTimeout(() => {
        onComplete?.();
      }, durationMs);
      return () => clearTimeout(timer);
    }
    // Fade out then unmount
    const timer = setTimeout(() => setRender(false), durationMs);
    return () => clearTimeout(timer);
  }, [isVisible, durationMs, onComplete]);

  if (!render) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${durationMs}ms ease`,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
