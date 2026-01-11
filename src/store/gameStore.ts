import { createWithEqualityFn } from 'zustand/traditional';
import { immer } from 'zustand/middleware/immer';
import type { Equipment } from '../core/models/Equipment';

export type ScreenType = 'title' | 'intro' | 'overworld' | 'battle' | 'menu' | 'team-select' | 'shop' | 'compendium' | 'rewards' | 'team-management' | 'djinn-collection' | 'tower' | 'credits' | 'epilogue';

export type ModalType = 'inventory' | 'settings' | 'dialogue' | 'pause' | 'team-management' | 'djinn-collection' | 'save' | 'help';

export interface FlowState {
    screen: ScreenType;
    modal: ModalType | null;
    modalReturnTo: ModalType | null;
    isTransitioning: boolean;
    compendiumReturnTo: { screen: ScreenType; modal: ModalType | null } | null;
    shopEntryContext: 'menu' | 'overworld' | null;
}

export type BattlePhase = 'idle' | 'playerTurn' | 'enemyTurn' | 'victory' | 'defeat';

export type BattleEventType = 'attack' | 'ability' | 'item' | 'system';

export interface BattleEvent {
    id: string;
    type: BattleEventType;
    description?: string;
}

export interface BattleState {
    enemyId: string;
    phase: BattlePhase;
}

export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    slot?: Equipment['slot'];
    statBonus?: Partial<Equipment['statBonus']>;
}

export interface InventoryState {
    items: InventoryItem[];
    capacity: number;
}

export interface BattleRewards {
    experience: number;
    currency: number;
    items: InventoryItem[];
}

export interface BattleSession {
    battle: BattleState;
    rngSeed: number;
    turnNumber: number;
    eventQueue: BattleEvent[];
    rewards: BattleRewards | null;
}

export interface TeamMemberStats {
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
}

export interface TeamMember {
    id: string;
    name: string;
    level: number;
    stats: TeamMemberStats;
}

export interface SaveSlot {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
}

export interface PlayerData {
    team: TeamMember[];
    inventory: InventoryState;
    currency: number;
    storyFlags: string[];  // Changed from Set<string> for JSON serialization
    saves: SaveSlot[];
}

export interface GameSlice {
    flow: FlowState;
    shopEntryContext: FlowState['shopEntryContext'];
    setScreen: (screen: ScreenType) => void;
    startTransition: (screen: ScreenType) => void;
    openModal: (modal: ModalType) => void;
    closeModal: () => void;
    openCompendium: () => void;
    closeCompendium: () => void;
    openShopFromMainMenu: () => void;
    exitShop: () => void;
    setTransitioning: (isTransitioning: boolean) => void;
    resetFlow: () => void;
}

export interface StartBattleParams {
    enemyId: string;
    rngSeed?: number;
}

export interface BattleSlice {
    battleSession: BattleSession | null;
    startBattle: (params: StartBattleParams) => void;
    endBattle: () => void;
    queueBattleEvent: (event: BattleEvent) => void;
    advanceTurn: () => void;
    setBattlePhase: (phase: BattlePhase) => void;
    clearBattleEvents: () => void;
}

export interface TeamSlice {
    playerData: PlayerData;
    setTeam: (team: TeamMember[]) => void;
    addTeamMember: (member: TeamMember) => void;
    updateTeamMember: (memberId: string, updater: (member: TeamMember) => TeamMember) => void;
    removeTeamMember: (memberId: string) => void;
}

export interface InventorySlice {
    setInventory: (inventory: InventoryState) => void;
    addItem: (item: InventoryItem) => void;
    removeItem: (itemId: string, quantity?: number) => void;
    clearInventory: () => void;
}

export type GameStore = GameSlice & BattleSlice & TeamSlice & InventorySlice;

type GameStoreSetState = (fn: (state: GameStore) => void) => void;
type GameStoreGetState = () => GameStore;
type EqualityFn<T> = (left: T, right: T) => boolean;

const DEFAULT_INVENTORY_CAPACITY = 32;

const initialFlowState: FlowState = {
    screen: 'title',
    modal: null,
    modalReturnTo: null,
    isTransitioning: false,
    compendiumReturnTo: null,
    shopEntryContext: null,
};

const initialPlayerData: PlayerData = {
    team: [],
    inventory: {
        items: [],
        capacity: DEFAULT_INVENTORY_CAPACITY,
    },
    currency: 0,
    storyFlags: [],  // Changed from Set<string> for JSON serialization
    saves: [],
};

/** Counter to track transition requests and cancel stale ones */
let transitionId = 0;

const createGameSlice = (set: GameStoreSetState, get: GameStoreGetState): GameSlice => ({

    flow: initialFlowState,
    shopEntryContext: initialFlowState.shopEntryContext,
    setScreen: (screen) =>
        set((state) => {
            transitionId += 1;
            state.flow.isTransitioning = false;
            state.flow.modal = null;
            state.flow.modalReturnTo = null;
            state.flow.screen = screen;
        }),
    startTransition: (screen) => {
        // Increment transition ID to cancel any previous in-flight transitions
        const currentTransitionId = ++transitionId;

        // Start fade to black
        set((state) => {
            state.flow.isTransitioning = true;
            state.flow.modal = null;
            state.flow.modalReturnTo = null;
        });

        // Smoother 350ms transition for Golden Sun feel
        setTimeout(() => {
            // Check if this transition was cancelled by a newer one
            if (currentTransitionId !== transitionId) {
                return;
            }

            set((state) => {
                state.flow.screen = screen;
            });

            // Wait for new screen to mount then fade back in
            setTimeout(() => {
                if (currentTransitionId !== transitionId) {
                    return;
                }

                set((state) => {
                    state.flow.isTransitioning = false;
                });
            }, 350);
        }, 350);
    },
    openModal: (modal) =>
        set((state) => {
            if (state.flow.isTransitioning) {
                return;
            }
            
            if (state.flow.modal && state.flow.modal !== modal) {
                state.flow.modalReturnTo = state.flow.modal;
            }
            
            state.flow.modal = modal;
        }),
    closeModal: () =>
        set((state) => {
            if (state.flow.modalReturnTo) {
                state.flow.modal = state.flow.modalReturnTo;
                state.flow.modalReturnTo = null;
            } else {
                state.flow.modal = null;
            }
        }),
    openCompendium: () => {
        set((state) => {
            state.flow.compendiumReturnTo = {
                screen: state.flow.screen,
                modal: state.flow.modal,
            };
            state.flow.modal = null;
            state.flow.modalReturnTo = null;
        });

        get().setScreen('compendium');
    },
    closeCompendium: () => {
        set((state) => {
            transitionId += 1;
            state.flow.isTransitioning = false;
            const returnTo = state.flow.compendiumReturnTo;
            state.flow.compendiumReturnTo = null;
            state.flow.screen = returnTo?.screen ?? 'menu';
            state.flow.modal = returnTo?.modal ?? null;
            state.flow.modalReturnTo = null;
        });
    },
    openShopFromMainMenu: () => {
        set((state) => {
            state.shopEntryContext = 'menu';
            state.flow.shopEntryContext = 'menu';
            state.flow.modal = null;
            state.flow.modalReturnTo = null;
        });

        get().startTransition('shop');
    },
    exitShop: () => {
        const entryContext = get().shopEntryContext ?? get().flow.shopEntryContext;

        set((state) => {
            state.shopEntryContext = null;
            state.flow.shopEntryContext = null;
            state.flow.modal = null;
            state.flow.modalReturnTo = null;
        });

        get().startTransition(entryContext === 'menu' ? 'menu' : 'overworld');
    },
    setTransitioning: (isTransitioning) =>
        set((state) => {
            state.flow.isTransitioning = isTransitioning;
        }),
    resetFlow: () =>
        set((state) => {
            transitionId += 1;
            state.flow = { ...initialFlowState };
            state.shopEntryContext = initialFlowState.shopEntryContext;
        }),
});

const createBattleSlice = (set: GameStoreSetState, _get: GameStoreGetState): BattleSlice => ({

    battleSession: null,
    startBattle: ({ enemyId, rngSeed }) =>
        set((state) => {
            const seed = rngSeed ?? Date.now();
            state.battleSession = {
                battle: {
                    enemyId,
                    phase: 'playerTurn',
                },
                rngSeed: seed,
                turnNumber: 1,
                eventQueue: [],
                rewards: null,
            };
            state.flow.screen = 'battle';
            state.flow.modal = null;
            state.flow.modalReturnTo = null;
        }),
    endBattle: () =>
        set((state) => {
            state.battleSession = null;
            if (state.flow.screen === 'battle') {
                state.flow.screen = 'overworld';
            }
        }),
    queueBattleEvent: (event) =>
        set((state) => {
            if (!state.battleSession) {
                return;
            }
            state.battleSession.eventQueue.push(event);
        }),
    advanceTurn: () =>
        set((state) => {
            if (!state.battleSession) {
                return;
            }
            state.battleSession.turnNumber += 1;
        }),
    setBattlePhase: (phase) =>
        set((state) => {
            if (!state.battleSession) {
                return;
            }
            state.battleSession.battle.phase = phase;
        }),
    clearBattleEvents: () =>
        set((state) => {
            if (!state.battleSession) {
                return;
            }
            state.battleSession.eventQueue = [];
        }),
});

const createTeamSlice = (set: GameStoreSetState, _get: GameStoreGetState): TeamSlice => ({

    playerData: initialPlayerData,
    setTeam: (team) =>
        set((state) => {
            state.playerData.team = team;
        }),
    addTeamMember: (member) =>
        set((state) => {
            state.playerData.team.push(member);
        }),
    updateTeamMember: (memberId, updater) =>
        set((state) => {
            const index = state.playerData.team.findIndex((member) => member.id === memberId);
            if (index === -1) {
                return;
            }
            const member = state.playerData.team[index];
            if (member) state.playerData.team[index] = updater(member);
        }),
    removeTeamMember: (memberId) =>
        set((state) => {
            state.playerData.team = state.playerData.team.filter((member) => member.id !== memberId);
        }),
});

const createInventorySlice = (set: GameStoreSetState, _get: GameStoreGetState): InventorySlice => ({
    setInventory: (inventory) =>
        set((state) => {
            state.playerData.inventory = inventory;
        }),
    addItem: (item) =>
        set((state) => {
            const existing = state.playerData.inventory.items.find((it) => it.id === item.id);
            if (existing) {
                existing.quantity += item.quantity;
            } else {
                state.playerData.inventory.items.push({ ...item });
            }
        }),
    removeItem: (itemId, quantity) =>
        set((state) => {
            const items = state.playerData.inventory.items;
            const index = items.findIndex((item) => item.id === itemId);
            if (index === -1) {
                return;
            }
            const item = items[index];
            if (!item) return;
            if (quantity === undefined || quantity >= item.quantity) {
                items.splice(index, 1);
            } else if (quantity > 0) {
                item.quantity -= quantity;
            }
        }),
    clearInventory: () =>
        set((state) => {
            state.playerData.inventory.items = [];
        }),
});

export const useGameStore = createWithEqualityFn<GameStore>()(
    immer((set, get) => ({
        ...createGameSlice(set as GameStoreSetState, get as GameStoreGetState),
        ...createBattleSlice(set as GameStoreSetState, get as GameStoreGetState),
        ...createTeamSlice(set as GameStoreSetState, get as GameStoreGetState),
        ...createInventorySlice(set as GameStoreSetState, get as GameStoreGetState),
    })),
);

const extractGameSlice = (state: GameStore): GameSlice => ({
    flow: state.flow,
    shopEntryContext: state.shopEntryContext,
    setScreen: state.setScreen,
    startTransition: state.startTransition,
    openModal: state.openModal,
    closeModal: state.closeModal,
    openCompendium: state.openCompendium,
    closeCompendium: state.closeCompendium,
    openShopFromMainMenu: state.openShopFromMainMenu,
    exitShop: state.exitShop,
    setTransitioning: state.setTransitioning,
    resetFlow: state.resetFlow,
});

const extractBattleSlice = (state: GameStore): BattleSlice => ({
    battleSession: state.battleSession,
    startBattle: state.startBattle,
    endBattle: state.endBattle,
    queueBattleEvent: state.queueBattleEvent,
    advanceTurn: state.advanceTurn,
    setBattlePhase: state.setBattlePhase,
    clearBattleEvents: state.clearBattleEvents,
});

const extractTeamSlice = (state: GameStore): TeamSlice => ({
    playerData: state.playerData,
    setTeam: state.setTeam,
    addTeamMember: state.addTeamMember,
    updateTeamMember: state.updateTeamMember,
    removeTeamMember: state.removeTeamMember,
});

const extractInventorySlice = (state: GameStore): InventorySlice => ({
    setInventory: state.setInventory,
    addItem: state.addItem,
    removeItem: state.removeItem,
    clearInventory: state.clearInventory,
});

export const useFlowStore = <T>(
    selector: (slice: GameSlice) => T,
    equalityFn?: EqualityFn<T>,
): T => equalityFn
    ? useGameStore((state) => selector(extractGameSlice(state)), equalityFn)
    : useGameStore((state) => selector(extractGameSlice(state)));

export const useBattleStore = <T>(
    selector: (slice: BattleSlice) => T,
    equalityFn?: EqualityFn<T>,
): T => equalityFn
    ? useGameStore((state) => selector(extractBattleSlice(state)), equalityFn)
    : useGameStore((state) => selector(extractBattleSlice(state)));

export const useTeamStore = <T>(
    selector: (slice: TeamSlice) => T,
    equalityFn?: EqualityFn<T>,
): T => equalityFn
    ? useGameStore((state) => selector(extractTeamSlice(state)), equalityFn)
    : useGameStore((state) => selector(extractTeamSlice(state)));

export const useInventoryStore = <T>(
    selector: (slice: InventorySlice) => T,
    equalityFn?: EqualityFn<T>,
): T => equalityFn
    ? useGameStore((state) => selector(extractInventorySlice(state)), equalityFn)
    : useGameStore((state) => selector(extractInventorySlice(state)));
