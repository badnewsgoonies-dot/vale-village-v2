import type { BattleState } from '../models/BattleState';
import { buildUnitIndex, calculateTeamManaPool } from '../models/BattleState';
import { createEmptyQueue, MIN_PARTY_SIZE, MAX_PARTY_SIZE } from '../constants';

// Named defaults to avoid magic numbers and centralize semantics for normalization
const DEFAULT_CURRENT_TURN = 0;
const DEFAULT_ROUND_NUMBER = 1;
const DEFAULT_CURRENT_QUEUE_INDEX = 0;
const DEFAULT_EXECUTION_INDEX = 0;
const DEFAULT_PHASE = 'planning';
const DEFAULT_STATUS = 'ongoing';

const VALID_PHASES = ['planning', 'executing', 'victory', 'defeat'] as const;
const VALID_PHASES_SET = new Set<string>(VALID_PHASES as unknown as string[]);

/**
 * Pure utility: normalize a BattleState into a well-formed, immutable-compatible object.
 * Returns a new BattleState instance without mutating the input.
 */
export function normalizeBattleState(state: BattleState): BattleState {
  if (!state || !state.playerTeam || !Array.isArray(state.playerTeam.units) || !Array.isArray(state.enemies)) {
    throw new Error('Invalid BattleState: missing playerTeam or enemies');
  }

  const teamSize = state.playerTeam.units.length;
  const safeTeamSize = Math.min(Math.max(teamSize, MIN_PARTY_SIZE), MAX_PARTY_SIZE);
  const baseQueue = createEmptyQueue(safeTeamSize) as BattleState['queuedActions'];

  const queuedActions: (BattleState['queuedActions'] extends readonly (infer U)[] ? U : unknown)[] =
    Array.isArray(state.queuedActions) ? [...state.queuedActions] : [...baseQueue];
  if (queuedActions.length < safeTeamSize) {
    while (queuedActions.length < safeTeamSize) queuedActions.push(null as unknown as typeof queuedActions[number]);
  } else if (queuedActions.length > safeTeamSize) {
    queuedActions.length = safeTeamSize;
  }

  const maxMana = typeof state.maxMana === 'number' ? state.maxMana : calculateTeamManaPool(state.playerTeam);
  const remainingMana = typeof state.remainingMana === 'number' ? state.remainingMana : maxMana;
  const currentTurn = typeof state.currentTurn === 'number' ? state.currentTurn : DEFAULT_CURRENT_TURN;
  const roundNumber = typeof state.roundNumber === 'number' ? state.roundNumber : DEFAULT_ROUND_NUMBER;
  const currentQueueIndex = typeof state.currentQueueIndex === 'number' ? state.currentQueueIndex : DEFAULT_CURRENT_QUEUE_INDEX;
  const executionIndex = typeof state.executionIndex === 'number' ? state.executionIndex : DEFAULT_EXECUTION_INDEX;

  const phase = VALID_PHASES_SET.has(state.phase) ? state.phase : DEFAULT_PHASE;
  const status = state.status ?? DEFAULT_STATUS;

  const queuedDjinn = Array.isArray(state.queuedDjinn) ? state.queuedDjinn : [];
  const log = Array.isArray(state.log) ? state.log : [];
  const turnOrder = Array.isArray(state.turnOrder) ? state.turnOrder : [];
  const djinnRecoveryTimers = state.djinnRecoveryTimers ?? {};

  const unitById = state.unitById instanceof Map ? state.unitById : buildUnitIndex(state.playerTeam.units, state.enemies);

  return {
    ...state,
    queuedActions: queuedActions as BattleState['queuedActions'],
    queuedDjinn: queuedDjinn as BattleState['queuedDjinn'],
    maxMana,
    remainingMana,
    currentTurn,
    roundNumber,
    currentQueueIndex,
    executionIndex,
    phase,
    status,
    log: log as BattleState['log'],
    turnOrder: turnOrder as BattleState['turnOrder'],
    djinnRecoveryTimers: djinnRecoveryTimers as BattleState['djinnRecoveryTimers'],
    unitById,
  } as BattleState;
}
