import { useEffect, useState } from 'preact/hooks';

interface TransitionSpiralProps {
  isVisible: boolean;
  durationMs?: number;
  onComplete?: () => void;
}

/**
 * Spiral transition overlay for entering battle.
 * Renders a radial gradient that spins while scaling up.
 */
export function TransitionSpiral({ isVisible, durationMs = 900, onComplete }: TransitionSpiralProps) {
  const [render, setRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setRender(true);
      const timer = setTimeout(() => onComplete?.(), durationMs);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setRender(false), durationMs);
    return () => clearTimeout(timer);
  }, [isVisible, durationMs, onComplete]);

  if (!render) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 9998,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '180vmax',
          height: '180vmax',
          background: 'conic-gradient(from 90deg, rgba(255,216,127,0.9), rgba(255,122,81,0.85), rgba(76,175,255,0.85), rgba(255,216,127,0.9))',
          borderRadius: '50%',
          transform: isVisible ? 'scale(1) rotate(1080deg)' : 'scale(0.2) rotate(0deg)',
          transition: `transform ${durationMs}ms ease-in`,
          filter: 'blur(1px)',
        }}
      />
    </div>
  );
}
