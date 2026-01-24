import { GameState, DispatchResult } from '../dev/driver';

// Constants (no magic numbers)
const DEFAULT_SEED = 42;
const DEFAULT_MAX_HP = 10;
const START_LEVEL_ID = 'start_village';

// Small deterministic PRNG (mulberry32)
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createInitialState(seed?: number): GameState {
  const s = typeof seed === 'number' ? seed : DEFAULT_SEED;
  const rng = mulberry32(s);
  const posX = Math.floor(rng() * 10);
  const posY = Math.floor(rng() * 10);

  const state: GameState = {
    tick: 0,
    player: {
      hp: DEFAULT_MAX_HP,
      maxHp: DEFAULT_MAX_HP,
      position: { x: posX, y: posY },
      deaths: 0,
    },
    world: {
      levelId: START_LEVEL_ID,
      timeElapsed: 0,
      enemies: [],
    },
    terminal: { kind: 'running' },
    flags: {},
    metrics: { enemiesDefeated: 0, itemsCollected: 0, novelty: 0 },
  };

  return state;
}

let state = createInitialState(DEFAULT_SEED);

function cloneState(): GameState {
  // Return pure data snapshot
  return JSON.parse(JSON.stringify(state));
}

export function getState(): GameState {
  return cloneState();
}

export function resetRun(seed?: number): void {
  state = createInitialState(seed);
}

export function dispatch(action: any): DispatchResult {
  // Allow a RESET_RUN via dispatch for convenience (deterministic reset)
  if (action && action.type === 'RESET_RUN') {
    resetRun(action.seed);
    return { ok: true, terminal: state.terminal };
  }

  // If terminal, reject further actions except RESET_RUN
  if (state.terminal && state.terminal.kind !== 'running') {
    return { ok: false, notes: ['terminal: run already finished'], terminal: state.terminal };
  }

  switch (action && action.type) {
    case 'MOVE': {
      const dx = Number(action.dx) || 0;
      const dy = Number(action.dy) || 0;
      state.player.position.x += dx;
      state.player.position.y += dy;
      break;
    }
    case 'NOOP':
      // explicit time step
      break;
    case 'ATTACK':
      // Simplified: no effect, might add notes
      break;
    case 'INTERACT':
      // Simplified: no effect
      break;
    default:
      return { ok: false, notes: ['unknown action'], terminal: state.terminal };
  }

  // Tick increments after each dispatch
  state.tick += 1;
  state.world.timeElapsed += 1;

  return { ok: true, terminal: state.terminal };
}

export const store = { getState, dispatch, resetRun };
