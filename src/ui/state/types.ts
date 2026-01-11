import type { Unit } from '../../core/models/Unit';

// Shared UI state/local types used by components for stronger typing

export type FloatingNumber = {
  id: number;
  unitId: string;
  amount: number;
  kind: 'damage' | 'heal';
  isCrit?: boolean;
};

export type FloatingAction = {
  id: number;
  unitId: string;
  text: string;
  color: string;
};

// Minimal BattlePhase used by UI consumers
export type BattlePhase = 'idle' | 'playerTurn' | 'enemyTurn' | 'victory' | 'defeat';

// Lightweight BattleState shape for UI components (keeps only fields needed by views)
export interface BattleState {
  // Legacy single-enemy id (may be undefined for multi-enemy encounters)
  enemyId?: string;

  // Current phase
  phase: BattlePhase;

  // Team / participant shapes
  playerTeam: {
    units: Unit[];
    equippedDjinn: string[];
    maxMana?: number;
  };
  enemies: Unit[];

  // Queue of planned actions (indexed by player unit index). Entries may be null when no action queued.
  queuedActions: Array<null | { casterIndex?: number; abilityId: string | null; targets: readonly string[]; manaCost?: number }>;

  // Battle resource caps
  maxMana: number;

  // Visual / story metadata
  backgroundId?: string;
  meta?: { encounterId?: string; [key: string]: any };
  encounterId?: string;
  leaderSpriteId?: string;

  // Turn order / actor pointers (optional)
  turnOrder?: string[];
  currentActorIndex?: number;

  // Allow additional fields from core-normalized state without breaking consumers
  [key: string]: any;
}

export const BASIC_ATTACK_IDS = ['strike', 'heavy-strike', 'guard-break', 'precise-jab'];

export const UI_TIMEOUTS = { floating: 1150, critFloating: 1400, shake: 240, critShake: 350, attackLunge: 400, castPulse: 500, floatingAction: 1200, koAction: 1500 } as const;
