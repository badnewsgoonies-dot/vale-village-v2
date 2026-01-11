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

  const maxMana = Number.isFinite((state as any).maxMana) ? state.maxMana : calculateTeamManaPool(state.playerTeam);
  const remainingMana = Number.isFinite((state as any).remainingMana) ? state.remainingMana : maxMana;
  const currentTurn = Number.isFinite((state as any).currentTurn) ? state.currentTurn : DEFAULT_CURRENT_TURN;
  const roundNumber = Number.isFinite((state as any).roundNumber) ? state.roundNumber : DEFAULT_ROUND_NUMBER;
  const currentQueueIndex = Number.isFinite((state as any).currentQueueIndex) ? state.currentQueueIndex : DEFAULT_CURRENT_QUEUE_INDEX;
  const executionIndex = Number.isFinite((state as any).executionIndex) ? state.executionIndex : DEFAULT_EXECUTION_INDEX;

  const phase = VALID_PHASES_SET.has(state.phase) ? state.phase : DEFAULT_PHASE;
  const status = state.status ?? DEFAULT_STATUS;

  const queuedDjinn = Array.isArray((state as any).queuedDjinn) ? state.queuedDjinn : [];
  const log = Array.isArray((state as any).log) ? state.log : [];
  const turnOrder = Array.isArray((state as any).turnOrder) ? state.turnOrder : [];
  const djinnRecoveryTimers = (state as any).djinnRecoveryTimers ?? {};

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
