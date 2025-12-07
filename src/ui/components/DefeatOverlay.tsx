/**
 * DefeatOverlay Component
 * Displays defeat animation after battle loss
 */

import { useEffect, useState } from 'preact/hooks';
import './DefeatOverlay.css';

interface DefeatOverlayProps {
  onComplete: () => void;
  duration?: number;
}

export function DefeatOverlay({ onComplete, duration = 2500 }: DefeatOverlayProps) {
  const [stage, setStage] = useState<'fadeIn' | 'text' | 'complete'>('fadeIn');

  useEffect(() => {
    const textTimer = setTimeout(() => {
      setStage('text');
    }, 500);

    const completeTimer = setTimeout(() => {
      setStage('complete');
      onComplete();
    }, duration);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  if (stage === 'complete') return null;

  return (
    <div class="defeat-overlay">
      <div class="defeat-vignette" />
      <div class="defeat-text">
        <h1 class="defeat-title">DEFEAT...</h1>
        <p class="defeat-subtitle">Your party has fallen.</p>
      </div>
      <button class="defeat-continue" onClick={onComplete}>
        Continue
      </button>
    </div>
  );
}
