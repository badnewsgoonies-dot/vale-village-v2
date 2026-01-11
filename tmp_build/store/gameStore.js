"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInventoryStore = exports.useTeamStore = exports.useBattleStore = exports.useFlowStore = exports.useGameStore = void 0;
const traditional_1 = require("zustand/traditional");
const immer_1 = require("zustand/middleware/immer");
const DEFAULT_INVENTORY_CAPACITY = 32;
const initialFlowState = {
    screen: 'title',
    modal: null,
    modalReturnTo: null,
    isTransitioning: false,
    compendiumReturnTo: null,
    shopEntryContext: null,
};
const initialPlayerData = {
    team: [],
    inventory: {
        items: [],
        capacity: DEFAULT_INVENTORY_CAPACITY,
    },
    currency: 0,
    storyFlags: [], // Changed from Set<string> for JSON serialization
    saves: [],
};
/** Counter to track transition requests and cancel stale ones */
let transitionId = 0;
const createGameSlice = (set, get) => ({
    flow: initialFlowState,
    shopEntryContext: initialFlowState.shopEntryContext,
    setScreen: (screen) => set((state) => {
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
        // Smoother 400ms transition for Golden Sun feel
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
            }, 400);
        }, 400);
    },
    openModal: (modal) => set((state) => {
        if (state.flow.isTransitioning) {
            return;
        }
        if (state.flow.modal && state.flow.modal !== modal) {
            state.flow.modalReturnTo = state.flow.modal;
        }
        state.flow.modal = modal;
    }),
    closeModal: () => set((state) => {
        if (state.flow.modalReturnTo) {
            state.flow.modal = state.flow.modalReturnTo;
            state.flow.modalReturnTo = null;
        }
        else {
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
    setTransitioning: (isTransitioning) => set((state) => {
        state.flow.isTransitioning = isTransitioning;
    }),
    resetFlow: () => set((state) => {
        transitionId += 1;
        state.flow = { ...initialFlowState };
        state.shopEntryContext = initialFlowState.shopEntryContext;
    }),
});
const createBattleSlice = (set, _get) => ({
    battleSession: null,
    startBattle: ({ enemyId, rngSeed }) => set((state) => {
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
    endBattle: () => set((state) => {
        state.battleSession = null;
        if (state.flow.screen === 'battle') {
            state.flow.screen = 'overworld';
        }
    }),
    queueBattleEvent: (event) => set((state) => {
        if (!state.battleSession) {
            return;
        }
        state.battleSession.eventQueue.push(event);
    }),
    advanceTurn: () => set((state) => {
        if (!state.battleSession) {
            return;
        }
        state.battleSession.turnNumber += 1;
    }),
    setBattlePhase: (phase) => set((state) => {
        if (!state.battleSession) {
            return;
        }
        state.battleSession.battle.phase = phase;
    }),
    clearBattleEvents: () => set((state) => {
        if (!state.battleSession) {
            return;
        }
        state.battleSession.eventQueue = [];
    }),
});
const createTeamSlice = (set, _get) => ({
    playerData: initialPlayerData,
    setTeam: (team) => set((state) => {
        state.playerData.team = team;
    }),
    addTeamMember: (member) => set((state) => {
        state.playerData.team.push(member);
    }),
    updateTeamMember: (memberId, updater) => set((state) => {
        const index = state.playerData.team.findIndex((member) => member.id === memberId);
        if (index === -1) {
            return;
        }
        const member = state.playerData.team[index];
        if (member)
            state.playerData.team[index] = updater(member);
    }),
    removeTeamMember: (memberId) => set((state) => {
        state.playerData.team = state.playerData.team.filter((member) => member.id !== memberId);
    }),
});
const createInventorySlice = (set, _get) => ({
    setInventory: (inventory) => set((state) => {
        state.playerData.inventory = inventory;
    }),
    addItem: (item) => set((state) => {
        const existing = state.playerData.inventory.items.find((it) => it.id === item.id);
        if (existing) {
            existing.quantity += item.quantity;
        }
        else {
            state.playerData.inventory.items.push({ ...item });
        }
    }),
    removeItem: (itemId, quantity) => set((state) => {
        const items = state.playerData.inventory.items;
        const index = items.findIndex((item) => item.id === itemId);
        if (index === -1) {
            return;
        }
        const item = items[index];
        if (!item)
            return;
        if (quantity === undefined || quantity >= item.quantity) {
            items.splice(index, 1);
        }
        else if (quantity > 0) {
            item.quantity -= quantity;
        }
    }),
    clearInventory: () => set((state) => {
        state.playerData.inventory.items = [];
    }),
});
exports.useGameStore = (0, traditional_1.createWithEqualityFn)()((0, immer_1.immer)((set, get) => ({
    ...createGameSlice(set, get),
    ...createBattleSlice(set, get),
    ...createTeamSlice(set, get),
    ...createInventorySlice(set, get),
})));
const extractGameSlice = (state) => ({
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
const extractBattleSlice = (state) => ({
    battleSession: state.battleSession,
    startBattle: state.startBattle,
    endBattle: state.endBattle,
    queueBattleEvent: state.queueBattleEvent,
    advanceTurn: state.advanceTurn,
    setBattlePhase: state.setBattlePhase,
    clearBattleEvents: state.clearBattleEvents,
});
const extractTeamSlice = (state) => ({
    playerData: state.playerData,
    setTeam: state.setTeam,
    addTeamMember: state.addTeamMember,
    updateTeamMember: state.updateTeamMember,
    removeTeamMember: state.removeTeamMember,
});
const extractInventorySlice = (state) => ({
    setInventory: state.setInventory,
    addItem: state.addItem,
    removeItem: state.removeItem,
    clearInventory: state.clearInventory,
});
const useFlowStore = (selector, equalityFn) => equalityFn
    ? (0, exports.useGameStore)((state) => selector(extractGameSlice(state)), equalityFn)
    : (0, exports.useGameStore)((state) => selector(extractGameSlice(state)));
exports.useFlowStore = useFlowStore;
const useBattleStore = (selector, equalityFn) => equalityFn
    ? (0, exports.useGameStore)((state) => selector(extractBattleSlice(state)), equalityFn)
    : (0, exports.useGameStore)((state) => selector(extractBattleSlice(state)));
exports.useBattleStore = useBattleStore;
const useTeamStore = (selector, equalityFn) => equalityFn
    ? (0, exports.useGameStore)((state) => selector(extractTeamSlice(state)), equalityFn)
    : (0, exports.useGameStore)((state) => selector(extractTeamSlice(state)));
exports.useTeamStore = useTeamStore;
const useInventoryStore = (selector, equalityFn) => equalityFn
    ? (0, exports.useGameStore)((state) => selector(extractInventorySlice(state)), equalityFn)
    : (0, exports.useGameStore)((state) => selector(extractInventorySlice(state)));
exports.useInventoryStore = useInventoryStore;
