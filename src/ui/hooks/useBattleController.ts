/**
 * Battle Controller Hook
 * Handles battle UI state logic, event processing loop, and timing.
 * Separates logic from the rendering in QueueBattleView.
 */

import { useEffect, useRef, useMemo } from 'preact/hooks';
import { useStore } from '../state/store';
import { useBattleSpeed } from './useBattleSpeed';
import { type BattleUIPhase, deriveUIPhase } from '../types/BattleUIPhase';
import { getEventTiming } from '../constants/animationTiming';
import type { BattleState } from '../../core/models/BattleState';
import type { BattleEvent } from '../../core/services/types';
import type { Unit } from '../../core/models/Unit';

export function useBattleController() {
  // Store selections
  const battle = useStore((s) => s.battle) as BattleState | null;
  const events = useStore((s) => s.events) as readonly BattleEvent[];
  const dequeue = useStore((s) => s.dequeueEvent);
  const mode = useStore((s) => s.mode);
  const activePortraitIndex = useStore((s) => s.activePortraitIndex);
  const setActivePortrait = useStore((s) => s.setActivePortrait);
  const skipAnimations = useStore((s) => s.skipAnimations);
  
  // Battle speed hook
  const { speedPreset, applySpeed, cycleSpeed } = useBattleSpeed();

  // Derive UI Phase
  // KEY FIX: If events exist, we are 'executing' regardless of battle.phase
  const uiPhase: BattleUIPhase = events.length > 0 ? 'executing' : deriveUIPhase(battle?.phase);

  // Ref for stale closure protection in event loop
  const pendingDequeueEventRef = useRef<string | undefined>(undefined);

  // --- Event Dequeue Loop ---
  useEffect(() => {
    if (!battle || uiPhase !== 'executing' || events.length === 0) {
      return;
    }

    const currentEvent = events[0]!;
    // Unique ID for the specific event instance to prevent race conditions
    const eventId = `${currentEvent.type}-${currentEvent.type === 'ability' ? currentEvent.casterId : currentEvent.type === 'turn-start' ? currentEvent.actorId : 'event'}-${Date.now()}`;
    pendingDequeueEventRef.current = eventId;

    const baseDelay = getEventTiming(currentEvent?.type ?? 'unknown', false);
    let delay = skipAnimations ? 0 : applySpeed(baseDelay);

    // Hit Stop effect (freeze flow for impact)
    if (currentEvent?.type === 'hit' && !skipAnimations) {
      delay += 120; // 120ms hit stop
    }

    const timer = setTimeout(() => {
      // Only dequeue if this timer is still the active one
      if (pendingDequeueEventRef.current === eventId) {
        dequeue();
        pendingDequeueEventRef.current = undefined;
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      if (pendingDequeueEventRef.current === eventId) {
        pendingDequeueEventRef.current = undefined;
      }
    };
  }, [uiPhase, events, dequeue, battle, applySpeed, skipAnimations]);

  // --- Computed State ---

  const currentUnit = useMemo<Unit | null>(() => {
    if (!battle) return null;
    if (activePortraitIndex === null || activePortraitIndex === undefined) return null;
    return battle.playerTeam.units[activePortraitIndex] ?? null;
  }, [battle, activePortraitIndex]);

  const getTimeout = (ms: number) => skipAnimations ? 0 : ms;

  return {
    // State
    battle,
    events,
    uiPhase,
    activePortraitIndex,
    currentUnit,
    mode,
    skipAnimations,
    
    // Actions
    setActivePortrait,
    
    // Timing / Speed
    speedPreset,
    applySpeed,
    cycleSpeed,
    getTimeout,
  };
}
