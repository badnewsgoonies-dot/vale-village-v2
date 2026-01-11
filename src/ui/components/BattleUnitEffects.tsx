import { useEffect, useState, useRef } from 'preact/hooks';
import { useStore } from '../state/store';
import type { BattleEvent } from '../../core/services/types';

interface BattleUnitEffectsProps {
  unitId: string;
}

export function BattleUnitEffects({ unitId }: BattleUnitEffectsProps) {
  // Selectors
  const events = useStore((s) => s.events);
  const critFlash = useStore((s) => s.critFlash);

  // Local State for this unit's effects
  const [floater, setFloater] = useState<{ id: number; amount: number; kind: 'damage' | 'heal'; isCrit: boolean } | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Refs for tracking
  const lastProcessedEventRef = useRef<BattleEvent | undefined>(undefined);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const floatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const counterRef = useRef(0);
  const currentAttackerRef = useRef<string | null>(null);

  useEffect(() => {
    if (events.length === 0) return;
    const evt = events[0];
    if (!evt) return;

    // Track attacker from ability events
    if (evt.type === 'ability') {
      currentAttackerRef.current = evt.casterId;
    }
    
    // De-dupe processing
    if (evt === lastProcessedEventRef.current) return;
    
    // Check if this event targets US
    let isTarget = false;
    if (evt.type === 'hit' || evt.type === 'heal' || evt.type === 'status-applied' || evt.type === 'status-expired') {
        if (evt.targetId === unitId) {
            isTarget = true;
        }
    }

    if (!isTarget) return;
    
    // Mark as processed for this unit
    lastProcessedEventRef.current = evt;

    if (evt.type === 'hit' || evt.type === 'heal') {
      const attacker = currentAttackerRef.current;
      // Crit check: if hit and attacker exists and attacker has critFlash
      const isCrit = !!(evt.type === 'hit' && attacker && critFlash[attacker]);
      
      // 1. Trigger Floater
      setFloater({
        id: ++counterRef.current,
        amount: evt.amount,
        kind: evt.type === 'heal' ? 'heal' : 'damage',
        isCrit
      });

      if (floatTimeoutRef.current) clearTimeout(floatTimeoutRef.current);
      floatTimeoutRef.current = setTimeout(() => {
        setFloater(null);
      }, isCrit ? 1400 : 1150);

      // 2. Trigger Shake (Damage only)
      if (evt.type === 'hit') {
        setIsShaking(true);
        if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
        shakeTimeoutRef.current = setTimeout(() => {
          setIsShaking(false);
        }, isCrit ? 350 : 240);
      }
    }
  }, [events, unitId, critFlash]);

  // Clean up
  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
      if (floatTimeoutRef.current) clearTimeout(floatTimeoutRef.current);
    };
  }, []);

  // Direct DOM manipulation for shake animation to avoid parent re-renders
  useEffect(() => {
    const el = document.getElementById(`unit-wrapper-${unitId}`);
    if (el) {
      el.style.animation = isShaking ? 'unitDamageShake 240ms ease-in-out' : 'none';
    }
  }, [isShaking, unitId]);

  if (!floater) return null;

  const displayValue = Math.abs(floater.amount);
  const { kind, isCrit } = floater;

  return (
    <div
      key={floater.id}
      style={{
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '10px',
        color: kind === 'heal' ? '#6df0a2' : isCrit ? '#FFD54A' : '#ff6b6b',
        fontSize: isCrit ? '1.4rem' : '1rem',
        fontWeight: 800,
        textShadow: isCrit
          ? '0 0 12px rgba(255, 215, 74, 0.9), 0 0 20px rgba(255, 180, 0, 0.6), 2px 2px 4px rgba(0,0,0,0.9)'
          : '0 0 6px rgba(0,0,0,0.8)',
        animation: isCrit ? 'criticalFloat 1.3s ease-out forwards' : 'floatNumber 1.05s ease-out forwards',
        pointerEvents: 'none',
        zIndex: isCrit ? 20 : 12,
        whiteSpace: 'nowrap',
      }}
    >
      {isCrit && <span style={{ display: 'block', fontSize: '0.7rem', color: '#FFD54A', textAlign: 'center' }}>CRITICAL!</span>}
      {kind === 'heal' ? `+${displayValue}` : `-${displayValue}`}
    </div>
  );
}
