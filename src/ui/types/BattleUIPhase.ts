/**
 * Explicit UI phase states for battle view
 * Mirrors BattleState.phase but with UI-specific granularity
 */
export type BattleUIPhase =
  | 'idle'           // No battle loaded
  | 'planning'       // Selecting actions
  | 'executing'      // Animating events
  | 'victory'        // Battle won
  | 'defeat';        // Battle lost

/**
 * Valid phase transitions - enforces state machine rules
 */
export const VALID_TRANSITIONS: Record<BattleUIPhase, readonly BattleUIPhase[]> = {
  idle: ['planning'],
  planning: ['executing'],
  executing: ['planning', 'victory', 'defeat'],
  victory: ['idle'],
  defeat: ['idle'],
} as const;

/**
 * Check if a phase transition is valid
 */
export function isValidTransition(from: BattleUIPhase, to: BattleUIPhase): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

/**
 * Assert a transition is valid (throws if not)
 */
export function assertValidTransition(from: BattleUIPhase, to: BattleUIPhase): void {
  if (!isValidTransition(from, to)) {
    throw new Error(`Invalid phase transition: ${from} -> ${to}`);
  }
}

/**
 * Derive UI phase from battle state
 */
export function deriveUIPhase(battlePhase: string | null | undefined): BattleUIPhase {
  if (!battlePhase) return 'idle';
  switch (battlePhase) {
    case 'planning': return 'planning';
    case 'executing': return 'executing';
    case 'victory': return 'victory';
    case 'defeat': return 'defeat';
    default: return 'idle';
  }
}
