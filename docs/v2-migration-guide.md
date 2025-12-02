# Implementation Guidelines: v2 Zustand Store Migration

## 1. STATE STRUCTURE

### Flatten Session-Based State

Combine related state into session objects to reduce top-level keys:

```typescript
// v1: Flat keys scattered across root
{ battle, rngSeed, turnNumber, events, team, inventory, ... }

// v2: Grouped by domain session
interface GameState {
  // Core sessions
  battleSession: BattleSession | null;
  overworldSession: OverworldSession;
  
  // Persistent data (survives sessions)
  playerData: PlayerData;
  
  // UI/Flow state
  flow: FlowState;
  
  // Dev-only (tree-shaken in prod)
  _dev?: DevState;
}
```

### Recommended Type Definitions

```typescript
// src/store/types.ts

interface BattleSession {
  battle: BattleState;
  rngSeed: number;
  turnNumber: number;
  eventQueue: BattleEvent[];  // Renamed from 'events' for clarity
}

interface OverworldSession {
  location: LocationId;
  npcStates: Map<NpcId, NpcState>;
  dialogueStack: DialogueFrame[];
}

interface PlayerData {
  team: TeamMember[];
  inventory: InventoryState;
  currency: number;
  storyFlags: Set<string>;
  saves: SaveSlot[];
}

interface FlowState {
  screen: ScreenType;
  modal: ModalType | null;
  isTransitioning: boolean;
}
```

### What to Remove/Consolidate

| v1 State | v2 Decision | Rationale |
|----------|-------------|-----------|
| `battle` + `rngSeed` + `turnNumber` + `events` | Merge → `battleSession` | Always mutate together |
| `queueBattle` | Remove | Derive from flow state |
| `team` + `inventory` + `saves` | Merge → `playerData` | Persistent player state |
| `story` | Merge → `playerData.storyFlags` | Just a Set<string> |
| `gameFlow` + `dialogue` | Merge → `flow` + `overworldSession.dialogueStack` | Split UI vs game state |
| `devMode` | Move → `_dev` (optional) | Tree-shake in prod |
| `rewards` | Keep transient in `battleSession` | Clear on battle end |

---

## 2. SLICES: Port Strategy

### Slice Mapping

```
v1 Slices              →  v2 Slices
─────────────────────────────────────
battle                 →  battleSlice (owns battleSession)
queueBattle            →  (removed - handled by flowSlice)
team                   →  playerSlice (owns playerData)
save                   →  playerSlice (merged)
story                  →  playerSlice (merged as storyFlags)
inventory              →  playerSlice (merged)
rewards                →  battleSlice (transient)
gameFlow               →  flowSlice (owns flow state)
overworld              →  overworldSlice (owns overworldSession)
dialogue               →  overworldSlice (merged as dialogueStack)
devMode                →  devSlice (conditional import)
tower                  →  towerSlice (keep separate - complex)
```

### Final v2 Slice Count: 5 (down from 12)

1. **battleSlice** - Combat logic, events, RNG
2. **playerSlice** - Team, inventory, saves, story flags
3. **overworldSlice** - Location, NPCs, dialogue
4. **flowSlice** - Screen transitions, modals
5. **towerSlice** - Tower-specific mechanics

---

## 3. ACTIONS: Redux Thunks → Zustand

### Pattern: Sync Thunk → Direct Mutation

```typescript
// v1 Redux-style (in old Zustand)
performAction: (actionId: string) => {
  const { battle, rngSeed, turnNumber, events } = get();
  if (!battle) return;
  
  const rng = createRNGStream(rngSeed, 'ACTIONS', turnNumber);
  const result = performActionService(battle, actionId, rng);
  
  set({
    battle: result.battle,
    events: [...events, ...result.events],
  });
}

// v2 Pattern: Session-based mutation
performAction: (actionId: string) => {
  const session = get().battleSession;
  if (!session) return;
  
  const rng = createRNGStream(session.rngSeed, 'ACTIONS', session.turnNumber);
  const result = performActionService(session.battle, actionId, rng);
  
  set((state) => ({
    battleSession: {
      ...session,
      battle: result.battle,
      eventQueue: [...session.eventQueue, ...result.events],
    },
  }));
}
```

### Pattern: Combine Multi-Step Actions

```typescript
// v1: Components call 3 actions in sequence
// startTurnTick() → performAIAction() → endTurn()

// v2: Single composite action
advanceTurn: () => {
  const session = get().battleSession;
  if (!session) return;

  let { battle, rngSeed, turnNumber, eventQueue } = session;
  const events: BattleEvent[] = [];

  // Step 1: Start turn tick
  const tickResult = battleServiceStartTurnTick(battle, rngSeed, turnNumber);
  battle = tickResult.battle;
  events.push(...tickResult.events);

  // Step 2: AI decision if needed
  if (isAITurn(battle)) {
    const aiRng = createRNGStream(rngSeed, 'AI', turnNumber);
    const aiAction = makeAIDecision(battle, aiRng);
    const aiResult = performActionService(battle, aiAction, aiRng);
    battle = aiResult.battle;
    events.push(...aiResult.events);
  }

  // Step 3: End turn
  const endResult = endTurnService(battle);
  battle = endResult.battle;
  events.push(...endResult.events);

  set({
    battleSession: {
      battle,
      rngSeed,
      turnNumber: turnNumber + 1,
      eventQueue: [...eventQueue, ...events],
    },
  });
}
```

### Pattern: Cross-Slice Access

```typescript
// When battle ends, update playerData
endBattle: (outcome: BattleOutcome) => {
  const { battleSession, playerData } = get();
  if (!battleSession) return;

  const rewards = calculateRewards(battleSession.battle, outcome);
  
  set({
    battleSession: null,  // Clear battle
    playerData: {
      ...playerData,
      team: applyExpGains(playerData.team, rewards.exp),
      inventory: addItems(playerData.inventory, rewards.items),
      currency: playerData.currency + rewards.currency,
    },
  });
}
```

---

## 4. TYPING: TypeScript Patterns

### Slice Creator Type

```typescript
// src/store/types.ts
import type { StateCreator } from 'zustand';

export type GameStore = GameState & GameActions;

export type SliceCreator<T> = StateCreator<
  GameStore,
  [['zustand/devtools', never]],
  [],
  T
>;
```

### Typed Slice Example

```typescript
// src/store/slices/battleSlice.ts
import type { SliceCreator } from '../types';

interface BattleSliceState {
  battleSession: BattleSession | null;
}

interface BattleSliceActions {
  startBattle: (config: BattleConfig) => void;
  performAction: (actionId: string) => void;
  advanceTurn: () => void;
  endBattle: (outcome: BattleOutcome) => void;
  consumeEvent: () => BattleEvent | undefined;
}

export type BattleSlice = BattleSliceState & BattleSliceActions;

export const createBattleSlice: SliceCreator<BattleSlice> = (set, get) => ({
  // State
  battleSession: null,

  // Actions
  startBattle: (config) => {
    set({
      battleSession: {
        battle: initializeBattle(config),
        rngSeed: config.seed ?? Date.now(),
        turnNumber: 0,
        eventQueue: [],
      },
    });
  },
  
  performAction: (actionId) => { /* ... */ },
  advanceTurn: () => { /* ... */ },
  endBattle: (outcome) => { /* ... */ },
  
  consumeEvent: () => {
    const session = get().battleSession;
    if (!session || session.eventQueue.length === 0) return undefined;
    
    const [event, ...rest] = session.eventQueue;
    set({
      battleSession: { ...session, eventQueue: rest },
    });
    return event;
  },
});
```

### Selector Types

```typescript
// src/store/selectors.ts
import type { GameStore } from './types';

// Typed selector creators
export const selectBattle = (state: GameStore) => state.battleSession?.battle;
export const selectTeam = (state: GameStore) => state.playerData.team;
export const selectCurrentScreen = (state: GameStore) => state.flow.screen;

// Derived selectors with memoization hints
export const selectActiveCombatant = (state: GameStore) => {
  const battle = state.battleSession?.battle;
  if (!battle) return null;
  return battle.combatants[battle.activeCombatantIndex];
};
```

---

## 5. SPECIFIC CODE PATTERNS

### Store Factory (v2)

```typescript
// src/store/index.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createBattleSlice } from './slices/battleSlice';
import { createPlayerSlice } from './slices/playerSlice';
import { createOverworldSlice } from './slices/overworldSlice';
import { createFlowSlice } from './slices/flowSlice';
import { createTowerSlice } from './slices/towerSlice';
import type { GameStore } from './types';

const storeFactory = (...args: Parameters<SliceCreator<GameStore>>) => ({
  ...createBattleSlice(...args),
  ...createPlayerSlice(...args),
  ...createOverworldSlice(...args),
  ...createFlowSlice(...args),
  ...createTowerSlice(...args),
});

// Singleton store with conditional devtools
export const useGameStore = create<GameStore>()(
  import.meta.env.DEV
    ? devtools(storeFactory, { name: 'vale-village' })
    : storeFactory
);

// Direct access for non-React code
export const gameStore = useGameStore;

// Typed selectors for common access patterns
export { selectBattle, selectTeam, selectCurrentScreen } from './selectors';
```

### Preact Component Usage

```typescript
// src/components/BattleScreen.tsx
import { useGameStore } from '@/store';
import { selectBattle, selectActiveCombatant } from '@/store/selectors';
import { useShallow } from 'zustand/react/shallow';

export function BattleScreen() {
  // Granular subscriptions prevent unnecessary rerenders
  const battle = useGameStore(selectBattle);
  const activeCombatant = useGameStore(selectActiveCombatant);
  
  // Multiple values with shallow compare
  const { performAction, advanceTurn } = useGameStore(
    useShallow((s) => ({
      performAction: s.performAction,
      advanceTurn: s.advanceTurn,
    }))
  );

  if (!battle) return null;

  return (
    <div>
      <CombatantDisplay combatant={activeCombatant} />
      <ActionBar onAction={performAction} />
      <button onClick={advanceTurn}>End Turn</button>
    </div>
  );
}
```

### Event Queue Consumer Hook

```typescript
// src/hooks/useBattleEvents.ts
import { useEffect } from 'preact/hooks';
import { useGameStore } from '@/store';

export function useBattleEvents(handler: (event: BattleEvent) => void) {
  const consumeEvent = useGameStore((s) => s.consumeEvent);
  const eventQueueLength = useGameStore(
    (s) => s.battleSession?.eventQueue.length ?? 0
  );

  useEffect(() => {
    if (eventQueueLength === 0) return;
    
    const event = consumeEvent();
    if (event) {
      handler(event);
    }
  }, [eventQueueLength, consumeEvent, handler]);
}

// Usage in component
function BattleAnimator() {
  useBattleEvents((event) => {
    switch (event.type) {
      case 'DAMAGE':
        playDamageAnimation(event.target, event.amount);
        break;
      case 'STATUS_APPLIED':
        showStatusToast(event.status);
        break;
    }
  });
  
  return null;
}
```

### Testing Pattern

```typescript
// src/store/__tests__/battleSlice.test.ts
import { createStore } from 'zustand';
import { createBattleSlice } from '../slices/battleSlice';
import { createPlayerSlice } from '../slices/playerSlice';

function createTestStore(initialState = {}) {
  return createStore<GameStore>()((set, get, api) => ({
    ...createBattleSlice(set, get, api),
    ...createPlayerSlice(set, get, api),
    ...initialState,
  }));
}

describe('battleSlice', () => {
  it('starts battle with correct initial state', () => {
    const store = createTestStore();
    
    store.getState().startBattle({
      enemies: [mockEnemy],
      seed: 12345,
    });
    
    const session = store.getState().battleSession;
    expect(session).not.toBeNull();
    expect(session!.rngSeed).toBe(12345);
    expect(session!.turnNumber).toBe(0);
    expect(session!.eventQueue).toEqual([]);
  });

  it('advanceTurn increments turn number', () => {
    const store = createTestStore({
      battleSession: mockBattleSession,
    });
    
    store.getState().advanceTurn();
    
    expect(store.getState().battleSession!.turnNumber).toBe(1);
  });
});
```

---

## Migration Checklist

- [ ] Create `src/store/types.ts` with all interfaces
- [ ] Create slice files in `src/store/slices/`
- [ ] Implement `battleSlice` with session-based state
- [ ] Implement `playerSlice` (team + inventory + saves + story)
- [ ] Implement `overworldSlice` (location + dialogue)
- [ ] Implement `flowSlice` (screens + modals)
- [ ] Port `towerSlice` (keep mostly as-is)
- [ ] Create `src/store/selectors.ts` with typed selectors
- [ ] Wire up store factory in `src/store/index.ts`
- [ ] Add `useBattleEvents` hook for event consumption
- [ ] Write tests for each slice
- [ ] Remove v1 slice files after verification