"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueBattleView = QueueBattleView;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * Queue-Based Battle View Component
 * Bottom layout implementation aligning with battle UI spec.
 */
const hooks_1 = require("preact/hooks");
const ToolboxHelpers_1 = require("./debug/ToolboxHelpers");
const store_1 = require("../state/store");
const gameStore_1 = require("../../store/gameStore");
const PostBattleCutscene_1 = require("./PostBattleCutscene");
const VictoryOverlay_1 = require("./VictoryOverlay");
const DefeatOverlay_1 = require("./DefeatOverlay");
const targeting_1 = require("../../core/algorithms/targeting");
const QueueBattleService_1 = require("../../core/services/QueueBattleService");
const Unit_1 = require("../../core/models/Unit");
const BattleState_1 = require("../../core/models/BattleState");
const BattleManaBar_1 = require("./BattleManaBar");
const BattlePortraitRow_1 = require("./BattlePortraitRow");
const BattleActionMenu_1 = require("./BattleActionMenu");
const ModeLabel_1 = require("./ModeLabel");
const battleSprites_1 = require("../sprites/mappings/battleSprites");
const SimpleSprite_1 = require("../sprites/SimpleSprite");
const BattleUnitSprite_1 = require("./BattleUnitSprite");
const abilities_1 = require("../../data/definitions/abilities");
const djinn_1 = require("../../data/definitions/djinn");
// Direct ability→GIF mapping in ABILITY_FX_MAP below (only for existing GIFs)
const dialogues_1 = require("../../data/definitions/dialogues");
const vs1Constants_1 = require("../../story/vs1Constants");
const BattleUIPhase_1 = require("../types/BattleUIPhase");
const animationTiming_1 = require("../constants/animationTiming");
const types_1 = require("../state/types");
const useBattleSpeed_1 = require("../hooks/useBattleSpeed");
const backgrounds_1 = require("../sprites/backgrounds");
function getElementColor(element) {
    switch (element) {
        case 'Venus': return '#8B4513'; // Brown/Earth
        case 'Mars': return '#ff6600'; // Orange/Fire
        case 'Mercury': return '#00ccff'; // Blue/Water
        case 'Jupiter': return '#9932CC'; // Purple/Wind
        default: return '#ffd87f'; // Golden default
    }
}
// Basic attack ability IDs provided by shared UI types.
function isBasicAttackAbility(abilityId) {
    return types_1.BASIC_ATTACK_IDS.includes(abilityId);
}
// Z-Index layering constants to prevent overlay conflicts
const Z_INDEX = {
    BACKGROUND: 0,
    SPRITES: 10,
    HUD: 40,
    BOTTOM_BAR: 50,
    MODE_LABEL: 55,
    TARGET_MODAL: 60,
};
// Element to sprite path mapping for Djinn
const DJINN_SPRITE_BY_ELEMENT = {
    Venus: '/sprites/battle/djinn/Venus_Djinn_Front.gif',
    Mars: '/sprites/battle/djinn/Mars_Djinn_Front.gif',
    Mercury: '/sprites/battle/djinn/Mercury_Djinn_Front.gif',
    Jupiter: '/sprites/battle/djinn/Jupiter_Djinn_Front.gif',
};
// --- CSS CONSTANTS ---
// Unused - commented out to fix TypeScript warnings
/*
const STYLES = {
  root: {
    height: '100vh',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    backgroundColor: '#0a0b10',
    color: '#fff',
    fontFamily: '"Segoe UI", Tahoma, sans-serif',
    overflow: 'hidden',
  },
  topHud: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(180deg, rgba(10,15,25,0.95) 0%, rgba(10,15,25,0.8) 100%)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: 100,
  },
  battlefield: {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    background: 'radial-gradient(circle at 50% 30%, #1a253a 0%, #050810 80%)',
    perspective: '1000px',
  },
  enemyRow: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '4rem',
    transform: 'scale(1.1)',
  },
  playerRow: {
    display: 'flex',
    gap: '3rem',
    alignItems: 'flex-end',
    zIndex: 10,
  },
  commandDeck: {
    height: '280px',
    background: 'linear-gradient(180deg, #1a202c 0%, #0f1218 100%)',
    borderTop: '4px double #4a5568', // Double border for RPG feel
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    zIndex: 20,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.6)',
  },
  deckLeft: {
    borderRight: '2px solid #2d3748',
    display: 'flex',
    flexDirection: 'column' as const,
    background: 'rgba(0,0,0,0.2)',
  },
  deckRight: {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    background: 'rgba(0,0,0,0.4)',
    overflow: 'hidden',
  },
  abilityList: {
    overflowY: 'auto' as const,
    flex: 1,
  },
  abilityBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: '#a0aec0',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.1s',
    fontFamily: 'inherit', // Inherit font for consistent feel
  },
  abilityBtnSelected: {
    background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0) 100%)',
    color: '#ffd700',
    borderLeft: '4px solid #ffd700',
    textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
  },
  abilityBtnHover: {
    background: 'rgba(255,255,255,0.05)',
    color: '#e2e8f0',
  },
  activeUnitIndicator: {
    padding: '0.75rem 1rem',
    background: 'linear-gradient(90deg, #2d3748 0%, #1a202c 100%)',
    borderBottom: '1px solid #4a5568',
    fontWeight: 'bold' as const,
    color: '#ffd700',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.2)',
  },
  detailsPanel: {
    position: 'absolute' as const,
    top: 0, left: 0, right: 0, bottom: 0,
    padding: '1.5rem',
    background: 'linear-gradient(135deg, rgba(26, 32, 44, 0.98) 0%, rgba(15, 20, 30, 0.98) 100%)',
    zIndex: 5,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  detailsHeader: {
    borderBottom: '1px solid #4a5568',
    paddingBottom: '0.5rem',
    marginBottom: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  detailsTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold' as const,
    color: '#ffd700',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  },
  detailsMeta: {
    fontSize: '0.9rem',
    color: '#63b3ed',
    fontWeight: 500,
  },
  detailsBody: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
  },
  statBlock: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
    background: 'rgba(0,0,0,0.2)',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#718096',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontWeight: 600,
  },
  statValue: {
    fontSize: '1.1rem',
    color: '#e2e8f0',
    fontWeight: 500,
  },
  targetOverlay: {
    position: 'absolute' as const,
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '1rem 2rem',
    background: 'rgba(15, 20, 30, 0.9)',
    borderRadius: '8px',
    border: '1px solid #ffd700',
    zIndex: 50,
    textAlign: 'center' as const,
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
  },
  executeBtn: {
    padding: '1rem',
    background: 'linear-gradient(180deg, #48bb78 0%, #2f855a 100%)',
    color: '#fff',
    border: 'none',
    borderTop: '1px solid #68d391',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    marginTop: 'auto',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
    transition: 'all 0.2s',
  }
};
*/
function QueueBattleView() {
    // V2 gameStore for screen navigation
    const setScreen = (0, gameStore_1.useGameStore)((s) => s.setScreen);
    const openModal = (0, gameStore_1.useGameStore)((s) => s.openModal);
    // V1 store for battle domain state
    const battle = (0, store_1.useStore)((s) => s.battle);
    const events = (0, store_1.useStore)((s) => s.events);
    const dequeue = (0, store_1.useStore)((s) => s.dequeueEvent);
    const setBattle = (0, store_1.useStore)((s) => s.setBattle);
    const queueUnitAction = (0, store_1.useStore)((s) => s.queueUnitAction);
    const clearUnitAction = (0, store_1.useStore)((s) => s.clearUnitAction);
    const executeQueuedRound = (0, store_1.useStore)((s) => s.executeQueuedRound);
    const setMode = (0, store_1.useStore)((s) => s.setMode);
    const mode = (0, store_1.useStore)((s) => s.mode);
    const startDialogueTree = (0, store_1.useStore)((s) => s.startDialogueTree);
    const returnToOverworldV1 = (0, store_1.useStore)((s) => s.returnToOverworld);
    const activePortraitIndex = (0, store_1.useStore)((s) => s.activePortraitIndex);
    const setActivePortrait = (0, store_1.useStore)((s) => s.setActivePortrait);
    const currentManaDisplay = (0, store_1.useStore)((s) => s.currentMana);
    const maxManaDisplay = (0, store_1.useStore)((s) => s.maxMana);
    const pendingManaThisRound = (0, store_1.useStore)((s) => s.pendingManaThisRound);
    const pendingManaNextRound = (0, store_1.useStore)((s) => s.pendingManaNextRound);
    const towerStatus = (0, store_1.useStore)((s) => s.towerStatus);
    const activeTowerEncounterId = (0, store_1.useStore)((s) => s.activeTowerEncounterId);
    const getCurrentTowerFloor = (0, store_1.useStore)((s) => s.getCurrentTowerFloor);
    const handleTowerBattleCompleted = (0, store_1.useStore)((s) => s.handleTowerBattleCompleted);
    const storyFlags = (0, store_1.useStore)((s) => s.story.flags);
    const setStoryFlag = (0, store_1.useStore)((s) => s.setStoryFlag);
    const critCounters = (0, store_1.useStore)((s) => s.critCounters);
    const critThresholds = (0, store_1.useStore)((s) => s.critThresholds);
    const critFlash = (0, store_1.useStore)((s) => s.critFlash);
    const incrementCritCounter = (0, store_1.useStore)((s) => s.incrementCritCounter);
    const resetCritCounter = (0, store_1.useStore)((s) => s.resetCritCounter);
    const triggerCritFlash = (0, store_1.useStore)((s) => s.triggerCritFlash);
    const lastBattleRewards = (0, store_1.useStore)((s) => s.lastBattleRewards);
    const processVictory = (0, store_1.useStore)((s) => s.processVictory);
    const lastError = (0, store_1.useStore)((s) => s.lastError);
    const clearError = (0, store_1.useStore)((s) => s.clearError);
    const skipAnimations = (0, store_1.useStore)((s) => s.skipAnimations);
    // Wrapper to sync both V1 and V2 store when returning to overworld
    const returnToOverworld = () => {
        returnToOverworldV1();
        setScreen('overworld');
    };
    // Derive UI phase - if events exist, we're 'executing' regardless of battle.phase
    // This is the KEY FIX: executeRound() returns planning phase, but we need executing while events drain
    const uiPhase = events.length > 0 ? 'executing' : (0, BattleUIPhase_1.deriveUIPhase)(battle?.phase);
    // Battle speed control
    const { speedPreset, applySpeed, cycleSpeed } = (0, useBattleSpeed_1.useBattleSpeed)();
    const getTimeout = (ms) => skipAnimations ? 0 : ms;
    // Selection State
    const [selectedAbilityId, setSelectedAbilityId] = (0, hooks_1.useState)(undefined);
    const [menuMode, setMenuMode] = (0, hooks_1.useState)('root');
    // Tower battle tutorial (Floor 1)
    const [tutorialOpenedPsynergy, setTutorialOpenedPsynergy] = (0, hooks_1.useState)(false);
    const [tutorialQueuedAction, setTutorialQueuedAction] = (0, hooks_1.useState)(false);
    const [tutorialExecutedRound, setTutorialExecutedRound] = (0, hooks_1.useState)(false);
    // Post-battle State
    const [showCutscene, setShowCutscene] = (0, hooks_1.useState)(false);
    const [showVictoryOverlay, setShowVictoryOverlay] = (0, hooks_1.useState)(false);
    const [showDefeatOverlay, setShowDefeatOverlay] = (0, hooks_1.useState)(false);
    const [battleOutcome, setBattleOutcome] = (0, hooks_1.useState)(null);
    const [floatingNumbers, setFloatingNumbers] = (0, hooks_1.useState)([]);
    const [floatingActions, setFloatingActions] = (0, hooks_1.useState)([]);
    const [showBattleTips, setShowBattleTips] = (0, hooks_1.useState)(false);
    const floatingIdRef = (0, hooks_1.useRef)(0);
    const floatingActionIdRef = (0, hooks_1.useRef)(0);
    const [shakingUnits, setShakingUnits] = (0, hooks_1.useState)(new Set());
    const [attackingUnits, setAttackingUnits] = (0, hooks_1.useState)(new Set());
    const [castingUnits, setCastingUnits] = (0, hooks_1.useState)(new Set());
    const shakeTimeoutsRef = (0, hooks_1.useRef)(new Map());
    const attackTimeoutsRef = (0, hooks_1.useRef)(new Map());
    const castTimeoutsRef = (0, hooks_1.useRef)(new Map());
    const currentAttackerRef = (0, hooks_1.useRef)(null);
    const floatingTimeoutsRef = (0, hooks_1.useRef)(new Map());
    const floatingActionTimeoutsRef = (0, hooks_1.useRef)(new Map());
    const lastProcessedEventRef = (0, hooks_1.useRef)(undefined);
    const lastCritProcessedEventRef = (0, hooks_1.useRef)(undefined);
    const lastActionEventRef = (0, hooks_1.useRef)(undefined);
    const lastAttackAnimEventRef = (0, hooks_1.useRef)(undefined);
    const pendingDequeueEventRef = (0, hooks_1.useRef)(undefined);
    // Redirect to tower hub if battle is null during tower run
    (0, hooks_1.useEffect)(() => {
        if (!battle && (towerStatus === 'in-run' || towerStatus === 'completed')) {
            setMode('tower');
            setScreen('tower');
        }
    }, [battle, towerStatus, setMode, setScreen]);
    // --- EFFECTS ---
    // 1. Auto-select first unit based on SPEED
    (0, hooks_1.useEffect)(() => {
        if (uiPhase === 'planning' && activePortraitIndex === null && battle) {
            const order = (0, QueueBattleService_1.getPlanningTurnOrder)(battle);
            if (order.length > 0 && order[0] !== undefined) {
                setActivePortrait(order[0]);
            }
        }
    }, [uiPhase, activePortraitIndex, battle, setActivePortrait]);
    // 2. Detect battle end and kick off result flow
    (0, hooks_1.useEffect)(() => {
        if (!battle) {
            setBattleOutcome(null);
            setShowCutscene(false);
            setShowVictoryOverlay(false);
            setShowDefeatOverlay(false);
            return;
        }
        if (uiPhase === 'victory') {
            setBattleOutcome('victory');
            setShowCutscene(true);
            return;
        }
        if (uiPhase === 'defeat') {
            setBattleOutcome('defeat');
            setShowCutscene(true);
            return;
        }
        setBattleOutcome(null);
        setShowCutscene(false);
        setShowVictoryOverlay(false);
    }, [uiPhase, battle]);
    // 3. Safety net: if victory state exists but mode never transitioned, force rewards
    (0, hooks_1.useEffect)(() => {
        if (!battle || battleOutcome !== 'victory')
            return;
        const isTowerBattle = towerStatus === 'in-run' && !!activeTowerEncounterId;
        if (isTowerBattle)
            return; // tower flow handles its own rewards
        if (!showCutscene && !showVictoryOverlay && mode !== 'rewards' && !lastBattleRewards) {
            processVictory(battle);
            setScreen('rewards');
        }
    }, [
        battle,
        battleOutcome,
        mode,
        lastBattleRewards,
        processVictory,
        setScreen,
        towerStatus,
        activeTowerEncounterId,
        showCutscene,
        showVictoryOverlay,
    ]);
    // Reset floating numbers, actions and animation states when battle changes and clear timers on unmount
    (0, hooks_1.useEffect)(() => {
        floatingTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
        floatingTimeoutsRef.current.clear();
        floatingActionTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
        floatingActionTimeoutsRef.current.clear();
        shakeTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
        shakeTimeoutsRef.current.clear();
        attackTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
        attackTimeoutsRef.current.clear();
        castTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
        castTimeoutsRef.current.clear();
        setFloatingNumbers([]);
        setFloatingActions([]);
        setShakingUnits(new Set());
        setAttackingUnits(new Set());
        setCastingUnits(new Set());
        lastProcessedEventRef.current = undefined;
        lastCritProcessedEventRef.current = undefined;
        lastActionEventRef.current = undefined;
        lastAttackAnimEventRef.current = undefined;
        return () => {
            floatingTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
            floatingTimeoutsRef.current.clear();
            floatingActionTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
            floatingActionTimeoutsRef.current.clear();
            shakeTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
            shakeTimeoutsRef.current.clear();
            attackTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
            attackTimeoutsRef.current.clear();
            castTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
            castTimeoutsRef.current.clear();
        };
    }, [battle]);
    // Add separate effect for unmount cleanup
    (0, hooks_1.useEffect)(() => {
        return () => {
            // Cleanup floating numbers and actions on unmount
            setFloatingNumbers([]);
            setFloatingActions([]);
        };
    }, []);
    // Spawn floating damage/heal numbers and trigger shake when events resolve
    (0, hooks_1.useEffect)(() => {
        if (!battle || uiPhase !== 'executing')
            return;
        const evt = events[0];
        if (!evt)
            return;
        if (evt === lastProcessedEventRef.current)
            return;
        lastProcessedEventRef.current = evt;
        // Track current attacker from ability events
        if (evt.type === 'ability') {
            currentAttackerRef.current = evt.casterId;
        }
        if (evt.type === 'hit' || evt.type === 'heal') {
            const id = floatingIdRef.current + 1;
            floatingIdRef.current = id;
            const kind = evt.type === 'heal' ? 'heal' : 'damage';
            // Check if this is a critical hit (attacker has critFlash active)
            const isCrit = !!(evt.type === 'hit' && currentAttackerRef.current && critFlash[currentAttackerRef.current]);
            setFloatingNumbers((prev) => [...prev, { id, unitId: evt.targetId, amount: evt.amount, kind, isCrit }]);
            const timeoutId = setTimeout(() => {
                setFloatingNumbers((prev) => prev.filter((n) => n.id !== id));
                floatingTimeoutsRef.current.delete(id);
            }, getTimeout(isCrit ? types_1.UI_TIMEOUTS.critFloating : types_1.UI_TIMEOUTS.floating)); // Crits stay longer
            floatingTimeoutsRef.current.set(id, timeoutId);
            // Trigger shake animation for damage hits
            if (evt.type === 'hit') {
                const targetId = evt.targetId;
                // Clear any existing shake timeout for this unit
                const existingTimeout = shakeTimeoutsRef.current.get(targetId);
                if (existingTimeout) {
                    clearTimeout(existingTimeout);
                }
                // Add unit to shaking set
                setShakingUnits((prev) => new Set([...prev, targetId]));
                // Remove after animation duration (crits shake longer)
                const shakeTimeout = setTimeout(() => {
                    setShakingUnits((prev) => {
                        const next = new Set(prev);
                        next.delete(targetId);
                        return next;
                    });
                    shakeTimeoutsRef.current.delete(targetId);
                }, getTimeout(isCrit ? types_1.UI_TIMEOUTS.critShake : types_1.UI_TIMEOUTS.shake));
                shakeTimeoutsRef.current.set(targetId, shakeTimeout);
            }
        }
    }, [uiPhase, events, battle, critFlash]);
    // Crit counter progression for basic attacks (during execution phase)
    // This ensures the counter only increments when the attack actually happens,
    // not during planning (prevents counter increment if unit is KO'd before their turn)
    (0, hooks_1.useEffect)(() => {
        if (!battle || uiPhase !== 'executing')
            return;
        const evt = events[0];
        if (!evt)
            return;
        if (evt === lastCritProcessedEventRef.current)
            return;
        lastCritProcessedEventRef.current = evt;
        // Only process 'ability' events for basic attacks from player units
        if (evt.type === 'ability' && types_1.BASIC_ATTACK_IDS.includes(evt.abilityId)) {
            const casterId = evt.casterId;
            // Only track crit counters for player units
            const isPlayerUnit = battle.playerTeam.units.some((u) => u.id === casterId);
            if (isPlayerUnit) {
                const nextCount = (critCounters[casterId] ?? 0) + 1;
                const threshold = critThresholds[casterId] ?? 10;
                if (nextCount >= threshold) {
                    resetCritCounter(casterId);
                    triggerCritFlash(casterId);
                }
                else {
                    incrementCritCounter(casterId);
                }
            }
        }
    }, [uiPhase, events, battle, critCounters, critThresholds, incrementCritCounter, resetCritCounter, triggerCritFlash]);
    // Spawn floating action text for ability events (shows ability name near caster)
    (0, hooks_1.useEffect)(() => {
        if (!battle || uiPhase !== 'executing')
            return;
        const evt = events[0];
        if (!evt)
            return;
        if (evt === lastActionEventRef.current)
            return;
        lastActionEventRef.current = evt;
        if (evt.type === 'ability') {
            const ability = abilities_1.ABILITIES[evt.abilityId];
            const abilityName = ability?.name ?? evt.abilityId;
            const element = ability?.element;
            const color = getElementColor(element);
            const id = floatingActionIdRef.current + 1;
            floatingActionIdRef.current = id;
            setFloatingActions((prev) => [...prev, { id, unitId: evt.casterId, text: abilityName, color }]);
            const timeoutId = setTimeout(() => {
                setFloatingActions((prev) => prev.filter((a) => a.id !== id));
                floatingActionTimeoutsRef.current.delete(id);
            }, getTimeout(types_1.UI_TIMEOUTS.floatingAction));
            floatingActionTimeoutsRef.current.set(id, timeoutId);
        }
        else if (evt.type === 'ko') {
            const id = floatingActionIdRef.current + 1;
            floatingActionIdRef.current = id;
            setFloatingActions((prev) => [...prev, { id, unitId: evt.unitId, text: 'KO!', color: '#ff4444' }]);
            const timeoutId = setTimeout(() => {
                setFloatingActions((prev) => prev.filter((a) => a.id !== id));
                floatingActionTimeoutsRef.current.delete(id);
            }, getTimeout(types_1.UI_TIMEOUTS.koAction));
            floatingActionTimeoutsRef.current.set(id, timeoutId);
        }
    }, [uiPhase, events, battle]);
    // Trigger attack/cast animations when ability events fire
    (0, hooks_1.useEffect)(() => {
        if (!battle || uiPhase !== 'executing')
            return;
        const evt = events[0];
        if (!evt)
            return;
        if (evt === lastAttackAnimEventRef.current)
            return;
        lastAttackAnimEventRef.current = evt;
        if (evt.type === 'ability') {
            const casterId = evt.casterId;
            const isBasicAttack = types_1.BASIC_ATTACK_IDS.includes(evt.abilityId);
            // Clear any existing animation timeout for this unit
            const existingAttackTimeout = attackTimeoutsRef.current.get(casterId);
            if (existingAttackTimeout)
                clearTimeout(existingAttackTimeout);
            const existingCastTimeout = castTimeoutsRef.current.get(casterId);
            if (existingCastTimeout)
                clearTimeout(existingCastTimeout);
            if (isBasicAttack) {
                // Physical attack - lunge animation
                setAttackingUnits((prev) => new Set([...prev, casterId]));
                const timeout = setTimeout(() => {
                    setAttackingUnits((prev) => {
                        const next = new Set(prev);
                        next.delete(casterId);
                        return next;
                    });
                    attackTimeoutsRef.current.delete(casterId);
                }, getTimeout(types_1.UI_TIMEOUTS.attackLunge));
                attackTimeoutsRef.current.set(casterId, timeout);
            }
            else {
                // Psynergy/ability - cast pulse animation
                setCastingUnits((prev) => new Set([...prev, casterId]));
                const timeout = setTimeout(() => {
                    setCastingUnits((prev) => {
                        const next = new Set(prev);
                        next.delete(casterId);
                        return next;
                    });
                    castTimeoutsRef.current.delete(casterId);
                }, getTimeout(types_1.UI_TIMEOUTS.castPulse));
                castTimeoutsRef.current.set(casterId, timeout);
            }
        }
    }, [uiPhase, events, battle]);
    // 4. Event Queue Processing - with stale closure protection
    (0, hooks_1.useEffect)(() => {
        if (!battle || uiPhase !== 'executing' || events.length === 0) {
            return;
        }
        const currentEvent = events[0]; // Safe: we check events.length > 0 above
        const eventId = `${currentEvent.type}-${currentEvent.type === 'ability' ? currentEvent.casterId : currentEvent.type === 'turn-start' ? currentEvent.actorId : 'event'}-${Date.now()}`;
        pendingDequeueEventRef.current = eventId;
        const baseDelay = (0, animationTiming_1.getEventTiming)(currentEvent?.type ?? 'unknown', false);
        const delay = skipAnimations ? 0 : applySpeed(baseDelay);
        const timer = setTimeout(() => {
            // Only dequeue if this timer is still the active one (prevents stale closure race)
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
    }, [uiPhase, events, dequeue, battle, applySpeed]);
    // --- COMPUTED VALUES ---
    const currentUnit = (0, hooks_1.useMemo)(() => {
        if (!battle)
            return null;
        if (activePortraitIndex === null || activePortraitIndex === undefined)
            return null;
        return battle.playerTeam.units[activePortraitIndex] ?? null;
    }, [battle, activePortraitIndex]);
    const totalQueuedMana = (0, hooks_1.useMemo)(() => battle?.queuedActions?.reduce((sum, a) => sum + (a?.manaCost || 0), 0) || 0, [battle?.queuedActions]);
    const isQueueComplete = (0, hooks_1.useMemo)(() => {
        if (!battle)
            return false;
        const aliveUnits = battle.playerTeam.units.filter((u) => !(0, Unit_1.isUnitKO)(u));
        // Count queued actions by index, matching alive units
        let queuedCount = 0;
        for (let i = 0; i < battle.playerTeam.units.length; i++) {
            const unit = battle.playerTeam.units[i];
            const action = battle.queuedActions[i];
            if (unit && !(0, Unit_1.isUnitKO)(unit) && action !== null) {
                queuedCount++;
            }
        }
        return aliveUnits.length === queuedCount && totalQueuedMana <= battle.maxMana;
    }, [battle, totalQueuedMana]);
    const currentFloor = (0, hooks_1.useMemo)(() => (towerStatus === 'in-run' ? getCurrentTowerFloor() : null), [towerStatus, getCurrentTowerFloor]);
    const battleType = towerStatus === 'in-run' ? 'tower' : 'story';
    const locationName = battle?.meta?.encounterId || battle?.encounterId || 'Story Battle';
    const towerTutorialFlagKey = 'tutorial:tower-battle-controls';
    const showTowerBattleTutorial = battleType === 'tower' &&
        Boolean(currentFloor?.tags?.includes('tutorial')) &&
        storyFlags[towerTutorialFlagKey] !== true;
    // Determine battle background: tower floor > encounter > default
    const backgroundUrl = (0, hooks_1.useMemo)(() => {
        // For tower battles, use floor-based background rotation
        if (currentFloor?.floorNumber) {
            const towerBgId = (0, backgrounds_1.getTowerFloorBackground)(currentFloor.floorNumber);
            return (0, backgrounds_1.getBackgroundPath)(towerBgId);
        }
        // For story/encounter battles, use encounter's backgroundId
        if (battle?.backgroundId) {
            return (0, backgrounds_1.getBackgroundPath)(battle.backgroundId);
        }
        // Default background
        return (0, backgrounds_1.getBackgroundPath)(undefined);
    }, [currentFloor?.floorNumber, battle?.backgroundId]);
    const currentEvent = events[0];
    const currentActorId = currentEvent?.type === 'ability' ? currentEvent.casterId :
        currentEvent?.type === 'hit' || currentEvent?.type === 'heal' || currentEvent?.type === 'status-applied' || currentEvent?.type === 'status-expired' ? undefined :
            currentEvent?.type === 'ko' ? currentEvent.unitId :
                undefined;
    // Determine if a unit should show attack animation (for basic attacks)
    const isBasicAttackEvent = currentEvent?.type === 'ability' && isBasicAttackAbility(currentEvent.abilityId);
    const attackingUnitId = isBasicAttackEvent ? currentActorId : null;
    // Determine targets being hit (for hit animation)
    const hitTargetIds = new Set();
    if (currentEvent?.type === 'hit') {
        hitTargetIds.add(currentEvent.targetId);
    }
    else if (isBasicAttackEvent && currentEvent?.type === 'ability') {
        currentEvent.targets.forEach(t => hitTargetIds.add(t));
    }
    const highlightedTargets = new Set();
    if (currentEvent) {
        if (currentEvent.type === 'ability') {
            currentEvent.targets.forEach((t) => highlightedTargets.add(t));
        }
        else if (currentEvent.type === 'hit' || currentEvent.type === 'heal' || currentEvent.type === 'status-applied' || currentEvent.type === 'status-expired') {
            highlightedTargets.add(currentEvent.targetId);
        }
        else if (currentEvent.type === 'ko') {
            highlightedTargets.add(currentEvent.unitId);
        }
    }
    // --- Tower Battle Tutorial ---
    (0, hooks_1.useEffect)(() => {
        if (!showTowerBattleTutorial)
            return;
        setTutorialOpenedPsynergy(false);
        setTutorialQueuedAction(false);
        setTutorialExecutedRound(false);
    }, [showTowerBattleTutorial, battle?.meta?.encounterId, battle?.encounterId]);
    (0, hooks_1.useEffect)(() => {
        if (!showTowerBattleTutorial)
            return;
        if (menuMode === 'abilities') {
            setTutorialOpenedPsynergy(true);
        }
    }, [showTowerBattleTutorial, menuMode]);
    (0, hooks_1.useEffect)(() => {
        if (!showTowerBattleTutorial || !battle)
            return;
        if (battle.queuedActions.some((action) => action !== null)) {
            setTutorialQueuedAction(true);
        }
    }, [showTowerBattleTutorial, battle]);
    (0, hooks_1.useEffect)(() => {
        if (!showTowerBattleTutorial)
            return;
        if (uiPhase === 'executing') {
            setTutorialExecutedRound(true);
        }
    }, [showTowerBattleTutorial, uiPhase]);
    (0, hooks_1.useEffect)(() => {
        if (!showTowerBattleTutorial)
            return;
        if (tutorialOpenedPsynergy && tutorialQueuedAction && tutorialExecutedRound) {
            setStoryFlag(towerTutorialFlagKey, true);
        }
    }, [
        showTowerBattleTutorial,
        tutorialOpenedPsynergy,
        tutorialQueuedAction,
        tutorialExecutedRound,
        setStoryFlag,
        towerTutorialFlagKey,
    ]);
    const skipTowerBattleTutorial = () => {
        setStoryFlag(towerTutorialFlagKey, true);
    };
    // --- HANDLERS ---
    const handleDefeatResolution = () => {
        const isTowerBattle = towerStatus === 'in-run' && !!activeTowerEncounterId;
        if (isTowerBattle && battle) {
            handleTowerBattleCompleted({ battle, events });
            setBattle(null, 0);
            setScreen('tower');
            return;
        }
        const encounterId = battle ? (0, BattleState_1.getEncounterId)(battle) : null;
        if (encounterId === vs1Constants_1.VS1_ENCOUNTER_ID) {
            const preScene = dialogues_1.DIALOGUES[vs1Constants_1.VS1_SCENE_PRE];
            if (preScene) {
                startDialogueTree(preScene);
                setMode('dialogue');
                return;
            }
        }
        returnToOverworld();
    };
    const handleVictoryOverlayComplete = () => {
        setShowVictoryOverlay(false);
        if (battleOutcome !== 'victory')
            return;
        const isTowerBattle = towerStatus === 'in-run' && !!activeTowerEncounterId;
        if (isTowerBattle && battle) {
            handleTowerBattleCompleted({ battle, events });
            setScreen('rewards');
            return;
        }
        if (battle && !lastBattleRewards) {
            processVictory(battle);
            setScreen('rewards');
            return;
        }
        if (lastBattleRewards) {
            setMode('rewards');
            setScreen('rewards');
        }
    };
    // const handleAbilityHover = (id: string | null) => {
    //   setHoveredAbilityId(id);
    // };
    const handleSelectAttack = () => {
        setSelectedAbilityId(null);
        setMenuMode('root');
    };
    const handleAbilitySelect = (id, ability) => {
        if (selectedAbilityId === id) {
            setSelectedAbilityId(undefined);
            return;
        }
        setSelectedAbilityId(id);
        void ability; // reserved for future metadata uses
        setMenuMode('root');
    };
    const handleTargetSelect = (targetId, abilityIdOverride) => {
        if (!currentUnit || activePortraitIndex === null || !battle)
            return;
        const abilityIdToUse = abilityIdOverride ?? selectedAbilityId;
        const ability = abilityIdToUse ? currentUnit.abilities.find(a => a.id === abilityIdToUse) : undefined;
        // Resolve target list based on ability target type
        let targetIds = [targetId];
        const aliveEnemies = battle.enemies.filter((e) => !(0, Unit_1.isUnitKO)(e)).map((e) => e.id);
        const aliveAllies = battle.playerTeam.units.filter((u) => !(0, Unit_1.isUnitKO)(u)).map((u) => u.id);
        switch (ability?.targets) {
            case 'all-enemies':
                targetIds = aliveEnemies;
                break;
            case 'all-allies':
                targetIds = aliveAllies;
                break;
            case 'self':
                targetIds = [currentUnit.id];
                break;
            default:
                targetIds = [targetId];
        }
        // Check if this unit already has an action queued
        const existingAction = battle.queuedActions[activePortraitIndex];
        if (existingAction !== null) {
            // Already has an action, skip to next unit
            const order = (0, QueueBattleService_1.getPlanningTurnOrder)(battle);
            const currentOrderIdx = order.indexOf(activePortraitIndex);
            for (let i = currentOrderIdx + 1; i < order.length; i++) {
                const nextIndex = order[i];
                if (nextIndex !== undefined && battle.queuedActions[nextIndex] === null) {
                    setActivePortrait(nextIndex);
                    break;
                }
            }
            setSelectedAbilityId(undefined);
            return;
        }
        // Queue the action
        const queued = queueUnitAction(activePortraitIndex, abilityIdToUse ?? null, targetIds, ability);
        if (!queued) {
            return;
        }
        // NOTE: Crit counter progression moved to execution phase (see effect below)
        // This prevents incrementing the counter if the unit is KO'd before their turn
        // Reset selection for next
        setSelectedAbilityId(undefined);
        // Auto-advance to next unit by SPEED, skipping KO'd units and those with actions
        const order = (0, QueueBattleService_1.getPlanningTurnOrder)(battle);
        const currentOrderIdx = order.indexOf(activePortraitIndex);
        for (let i = currentOrderIdx + 1; i < order.length; i++) {
            const nextIndex = order[i];
            if (nextIndex === undefined)
                continue;
            const nextUnit = battle.playerTeam.units[nextIndex];
            // Skip KO'd units and units that already have an action queued
            if (nextUnit && !(0, Unit_1.isUnitKO)(nextUnit) && battle.queuedActions[nextIndex] === null) {
                setActivePortrait(nextIndex);
                break;
            }
        }
    };
    const handleAutoAttack = (0, hooks_1.useCallback)(() => {
        if (!battle || uiPhase !== 'planning')
            return;
        if (!currentUnit || activePortraitIndex === null)
            return;
        if ((0, Unit_1.isUnitKO)(currentUnit))
            return;
        const targets = (0, targeting_1.getValidTargets)(null, currentUnit, battle.playerTeam, battle.enemies);
        const firstTarget = targets[0];
        if (!firstTarget)
            return;
        handleSelectAttack();
        handleTargetSelect(firstTarget.id, null);
    }, [battle, uiPhase, currentUnit, activePortraitIndex]);
    (0, hooks_1.useEffect)(() => {
        const onKeyDown = (event) => {
            if (event.key !== 'q' && event.key !== 'Q')
                return;
            if (event.repeat)
                return;
            handleAutoAttack();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [handleAutoAttack]);
    // 'S' key for speed cycling
    (0, hooks_1.useEffect)(() => {
        const onKeyDown = (event) => {
            if (event.key === 's' || event.key === 'S') {
                if (!event.repeat)
                    cycleSpeed();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [cycleSpeed]);
    const handleExecute = () => {
        if (isQueueComplete && uiPhase === 'planning')
            executeQueuedRound();
    };
    // Button should only be enabled in planning phase with complete queue
    const canExecute = isQueueComplete && uiPhase === 'planning';
    const toolboxActions = [
        {
            id: 'toggle-tips',
            label: showBattleTips ? 'Hide Tips' : 'Show Tips',
            tooltip: 'Toggle inline battle control hints',
            onClick: () => setShowBattleTips((v) => !v),
        },
        {
            id: 'speed-1x',
            label: 'Speed: 1x',
            tooltip: 'Normal battle speed',
            onClick: () => applySpeed(1),
        },
        {
            id: 'speed-2x',
            label: 'Speed: 2x',
            tooltip: 'Faster battle speed',
            onClick: () => applySpeed(2),
        },
        {
            id: 'open-settings',
            label: 'Settings',
            tooltip: 'Open settings modal',
            onClick: () => openModal('settings'),
        },
    ];
    // --- RENDER ---
    if (!battle) {
        return ((0, jsx_runtime_1.jsxs)("div", { style: {
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                background: '#000',
                color: '#fff',
                textAlign: 'center',
                padding: '2rem',
            }, children: [(0, jsx_runtime_1.jsx)("div", { style: { fontSize: '1.1rem', fontWeight: 700 }, children: "Battle not ready" }), (0, jsx_runtime_1.jsx)("div", { style: { color: '#aaa' }, children: "Try starting a new battle from the overworld." }), lastError && ((0, jsx_runtime_1.jsx)("div", { style: {
                        maxWidth: 520,
                        padding: '0.75rem 1rem',
                        borderRadius: 8,
                        background: 'rgba(255, 99, 71, 0.15)',
                        border: '1px solid rgba(255, 99, 71, 0.4)',
                        color: '#ffb3b3',
                    }, children: lastError })), (0, jsx_runtime_1.jsx)("button", { onClick: returnToOverworld, style: {
                        padding: '0.6rem 1.2rem',
                        borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        cursor: 'pointer',
                    }, children: "Return to Overworld" })] }));
    }
    // Post-battle handling
    if (showCutscene && battleOutcome) {
        return ((0, jsx_runtime_1.jsx)(PostBattleCutscene_1.PostBattleCutscene, { victory: battleOutcome === 'victory', onComplete: () => {
                setShowCutscene(false);
                if (battleOutcome === 'victory') {
                    setShowVictoryOverlay(true);
                }
                else {
                    setShowDefeatOverlay(true);
                }
            } }));
    }
    if (battleOutcome === 'victory' && showVictoryOverlay) {
        return (0, jsx_runtime_1.jsx)(VictoryOverlay_1.VictoryOverlay, { onComplete: handleVictoryOverlayComplete });
    }
    if (battleOutcome === 'defeat' && showDefeatOverlay) {
        return (0, jsx_runtime_1.jsx)(DefeatOverlay_1.DefeatOverlay, { onComplete: () => {
                setShowDefeatOverlay(false);
                handleDefeatResolution();
            } });
    }
    // Determine valid targets if in selection mode (only during planning phase)
    let validTargets = [];
    if (uiPhase === 'planning' && selectedAbilityId !== undefined && currentUnit) {
        // selectedAbilityId is null -> Basic Attack
        // selectedAbilityId is string -> Ability
        const ability = selectedAbilityId
            ? currentUnit.abilities.find(a => a.id === selectedAbilityId)
            : undefined; // undefined corresponds to 'Basic Attack' in getValidTargets if logic allows?
        // Actually getValidTargets expects ability object or undefined for Basic Attack
        // Note: getValidTargets signature might need checking.
        // Assuming getValidTargets(ability | null/undefined, unit, team, enemies)
        // Checking import... getValidTargets(ability: Ability | null | undefined, ...)
        validTargets = (0, targeting_1.getValidTargets)(ability || null, currentUnit, battle.playerTeam, battle.enemies);
    }
    const validTargetIds = new Set(validTargets.map((t) => t.id));
    const isTargeting = selectedAbilityId !== undefined && validTargets.length > 0;
    // --- HELPERS FOR RENDERING ABILITY LIST ---
    // Helpers not required; rendering handled via BattleActionMenu.
    const isExecuting = uiPhase === 'executing';
    return ((0, jsx_runtime_1.jsx)("div", { "data-testid": "battle-view", style: {
            width: '100vw',
            height: '100vh',
            background: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'fixed',
            inset: 0,
            zIndex: 999,
        }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                width: 900,
                height: 600,
                position: 'relative',
                background: '#000',
                overflow: 'hidden',
                imageRendering: 'pixelated',
                color: '#fff',
            }, children: [(0, jsx_runtime_1.jsx)(ToolboxHelpers_1.ToolboxHelpers, { title: "Battle", position: "top-right", actions: toolboxActions }), showTowerBattleTutorial && ((0, jsx_runtime_1.jsxs)("div", { "data-testid": "battle-tutorial", style: {
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        width: 300,
                        background: 'rgba(0,0,0,0.55)',
                        border: '1px solid rgba(255,255,255,0.16)',
                        borderRadius: 8,
                        padding: '10px 12px',
                        zIndex: 120,
                        backdropFilter: 'blur(6px)',
                    }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 6 }, children: [(0, jsx_runtime_1.jsx)("div", { style: { color: '#FFD87F', fontWeight: 800, letterSpacing: 0.5 }, children: "Tower Battle Tutorial" }), (0, jsx_runtime_1.jsx)("button", { onClick: skipTowerBattleTutorial, style: {
                                        background: 'rgba(0,0,0,0.35)',
                                        color: '#eaeaea',
                                        border: '1px solid rgba(255,255,255,0.18)',
                                        borderRadius: 6,
                                        padding: '4px 8px',
                                        cursor: 'pointer',
                                        fontSize: 12,
                                    }, children: "Skip" })] }), (0, jsx_runtime_1.jsx)("div", { style: { color: '#cfcfcf', fontSize: 12, marginBottom: 10 }, children: "Queue actions for your party, then execute the round." }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: 8, alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)("span", { style: { width: 16, textAlign: 'center', color: tutorialOpenedPsynergy ? '#7FFFD4' : '#999' }, children: tutorialOpenedPsynergy ? '✓' : '□' }), (0, jsx_runtime_1.jsxs)("span", { children: ["Open ", (0, jsx_runtime_1.jsx)("span", { style: { fontWeight: 800 }, children: "PSYNERGY" }), " to view abilities"] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: 8, alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)("span", { style: { width: 16, textAlign: 'center', color: tutorialQueuedAction ? '#7FFFD4' : '#999' }, children: tutorialQueuedAction ? '✓' : '□' }), (0, jsx_runtime_1.jsxs)("span", { children: ["Queue an action (", (0, jsx_runtime_1.jsx)("span", { style: { fontWeight: 800 }, children: "ATTACK" }), " \u2192 click an enemy)"] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: 8, alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)("span", { style: { width: 16, textAlign: 'center', color: tutorialExecutedRound ? '#7FFFD4' : '#999' }, children: tutorialExecutedRound ? '✓' : '□' }), (0, jsx_runtime_1.jsxs)("span", { children: ["Press ", (0, jsx_runtime_1.jsx)("span", { style: { fontWeight: 800 }, children: "Execute Round" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 10, color: '#aaa', fontSize: 11 }, children: "Tip: Attacks generate +1 mana. Spend mana on PSYNERGY." })] })), showBattleTips && ((0, jsx_runtime_1.jsx)("div", { style: {
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 6,
                        padding: '6px 8px',
                        fontSize: 12,
                        zIndex: 101,
                    }, children: (0, jsx_runtime_1.jsx)("div", { children: "Controls: Q = auto-attack | S = cycle speed | Click = select | Esc = pause" }) })), (0, jsx_runtime_1.jsx)("style", { children: `
            @keyframes floatNumber {
              0% { opacity: 1; transform: translate(-50%, 0) scale(1); }
              60% { opacity: 1; transform: translate(-50%, -6px) scale(1.02); }
              100% { opacity: 0; transform: translate(-50%, -24px) scale(1.05); }
            }
            @keyframes unitDamageShake {
              0% { transform: translateX(0); }
              20% { transform: translateX(-4px); }
              40% { transform: translateX(4px); }
              60% { transform: translateX(-2px); }
              80% { transform: translateX(2px); }
              100% { transform: translateX(0); }
            }
            @keyframes criticalFloat {
              0% { opacity: 1; transform: translate(-50%, 0) scale(1.5); filter: brightness(1.5); }
              15% { transform: translate(-50%, -4px) scale(1.8); filter: brightness(2); }
              40% { opacity: 1; transform: translate(-50%, -10px) scale(1.4); filter: brightness(1.3); }
              100% { opacity: 0; transform: translate(-50%, -32px) scale(1.2); filter: brightness(1); }
            }
            @keyframes floatAction {
              0% { opacity: 1; transform: translate(-50%, 0) scale(1); }
              20% { opacity: 1; transform: translate(-50%, -8px) scale(1.1); }
              100% { opacity: 0; transform: translate(-50%, -30px) scale(0.9); }
            }
            @keyframes attackLungeLeft {
              0% { transform: translateX(0) scale(1); }
              30% { transform: translateX(-25px) scale(1.15); }
              60% { transform: translateX(-20px) scale(1.1); }
              100% { transform: translateX(0) scale(1); }
            }
            @keyframes attackLungeRight {
              0% { transform: translateX(0) scale(1); }
              30% { transform: translateX(25px) scale(1.15); }
              60% { transform: translateX(20px) scale(1.1); }
              100% { transform: translateX(0) scale(1); }
            }
            @keyframes castPulse {
              0% { transform: scale(1); filter: brightness(1); }
              25% { transform: scale(1.1); filter: brightness(1.4) drop-shadow(0 0 10px rgba(255,216,127,0.8)); }
              50% { transform: scale(1.05); filter: brightness(1.2) drop-shadow(0 0 6px rgba(255,216,127,0.5)); }
              100% { transform: scale(1); filter: brightness(1); }
            }
          ` }), (0, jsx_runtime_1.jsxs)("div", { style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        overflow: 'hidden',
                    }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${backgroundUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center 70%',
                                imageRendering: 'pixelated',
                                zIndex: 0,
                            } }), (0, jsx_runtime_1.jsx)("div", { style: { position: 'absolute', top: 8, left: 8, zIndex: Z_INDEX.MODE_LABEL }, children: (0, jsx_runtime_1.jsx)(ModeLabel_1.ModeLabel, { battleType: battleType, locationName: locationName, floorNumber: currentFloor?.floorNumber }) }), isExecuting && ((0, jsx_runtime_1.jsx)("div", { style: {
                                position: 'absolute',
                                top: 16,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0,0,0,0.7)',
                                border: '1px solid rgba(255,216,127,0.4)',
                                borderRadius: 8,
                                padding: '8px 12px',
                                color: '#FFD87F',
                                fontWeight: 700,
                                letterSpacing: 0.5,
                                zIndex: 5,
                            }, children: "\u2694\uFE0F Executing round..." })), (0, jsx_runtime_1.jsxs)("div", { style: {
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 48,
                                height: '100%',
                                position: 'relative',
                                zIndex: 1,
                            }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                        position: 'absolute',
                                        bottom: '42%',
                                        left: '8%',
                                        display: 'flex',
                                        gap: '3rem',
                                        zIndex: 10,
                                    }, children: battle.enemies.map((enemy, enemyIndex) => {
                                        const isTargetCandidate = validTargetIds.has(enemy.id);
                                        const isResolvingTarget = highlightedTargets.has(enemy.id);
                                        const isActor = currentActorId === enemy.id;
                                        const isShaking = shakingUnits.has(enemy.id);
                                        const isAttacking = attackingUnits.has(enemy.id);
                                        const isCasting = castingUnits.has(enemy.id);
                                        // Don't filter out KO'd units if they have ANY pending events related to them
                                        // This includes ability casts, hits, heals, status changes, and KO animations
                                        const hasPendingEvent = events.some((evt) => {
                                            if (evt.type === 'ability' && evt.casterId === enemy.id)
                                                return true;
                                            if (evt.type === 'ability' && evt.targets.includes(enemy.id))
                                                return true;
                                            if (evt.type === 'hit' && evt.targetId === enemy.id)
                                                return true;
                                            if (evt.type === 'heal' && evt.targetId === enemy.id)
                                                return true;
                                            if (evt.type === 'ko' && evt.unitId === enemy.id)
                                                return true;
                                            if (evt.type === 'status-applied' && evt.targetId === enemy.id)
                                                return true;
                                            if (evt.type === 'status-expired' && evt.targetId === enemy.id)
                                                return true;
                                            return false;
                                        });
                                        if ((0, Unit_1.isUnitKO)(enemy) && !hasPendingEvent)
                                            return null;
                                        // Use NPC sprite override for the first enemy (leader) if available
                                        const isLeader = enemyIndex === 0;
                                        const mappedSprite = isLeader
                                            ? (0, battleSprites_1.getEnemyBattleSpriteWithOverride)(enemy.id, 'idle', battle.leaderSpriteId)
                                            : (0, battleSprites_1.getEnemyBattleSprite)(enemy.id, 'idle');
                                        const nameBasedFallback = `/sprites/battle/enemies/${enemy.name.replace(/\s+/g, '')}.gif`;
                                        const spriteId = mappedSprite ?? nameBasedFallback;
                                        // Determine animation: attack lunge (right toward player), shake, or casting
                                        let spriteAnimation = 'none';
                                        if (isAttacking) {
                                            spriteAnimation = 'attackLungeRight 400ms ease-out';
                                        }
                                        else if (isCasting) {
                                            spriteAnimation = 'castPulse 500ms ease-out';
                                        }
                                        else if (isShaking) {
                                            spriteAnimation = 'unitDamageShake 240ms ease-in-out';
                                        }
                                        return ((0, jsx_runtime_1.jsxs)("div", { "data-testid": `battle-enemy-${enemy.id}`, onClick: () => isTargetCandidate && handleTargetSelect(enemy.id), style: {
                                                position: 'relative',
                                                cursor: isTargetCandidate ? 'pointer' : 'default',
                                                textAlign: 'center',
                                            }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: '50%',
                                                        transform: 'translateX(-50%)',
                                                        width: 70,
                                                        height: 24,
                                                        background: 'rgba(0,0,0,0.6)',
                                                        borderRadius: '50%',
                                                        filter: 'blur(4px)',
                                                        pointerEvents: 'none',
                                                        zIndex: 0,
                                                    } }), (0, jsx_runtime_1.jsx)("div", { style: {
                                                        position: 'relative',
                                                        transform: isActor ? 'scale(3.2)' : 'scale(3)',
                                                        zIndex: 1,
                                                        filter: isResolvingTarget
                                                            ? 'drop-shadow(0 0 14px rgba(255,216,127,0.9))'
                                                            : isTargetCandidate
                                                                ? 'drop-shadow(0 0 8px rgba(255,216,127,0.7))'
                                                                : 'none',
                                                        animation: spriteAnimation,
                                                    }, children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: spriteId, width: 64, height: 64, fallback: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: "/sprites/battle/enemies/Goblin.gif", width: 64, height: 64, imageRendering: "pixelated" }), imageRendering: "pixelated" }) }), floatingNumbers
                                                    .filter((n) => n.unitId === enemy.id)
                                                    .map((num, idx) => {
                                                    const displayValue = Math.abs(num.amount);
                                                    const isCritical = num.isCrit;
                                                    return ((0, jsx_runtime_1.jsxs)("div", { style: {
                                                            position: 'absolute',
                                                            bottom: `calc(100% + ${idx * 16 + 6}px)`,
                                                            left: '50%',
                                                            color: num.kind === 'heal' ? '#6df0a2' : isCritical ? '#FFD54A' : '#ff6b6b',
                                                            fontSize: isCritical ? '1.4rem' : '1rem',
                                                            fontWeight: 800,
                                                            textShadow: isCritical
                                                                ? '0 0 12px rgba(255, 215, 74, 0.9), 0 0 20px rgba(255, 180, 0, 0.6), 2px 2px 4px rgba(0,0,0,0.9)'
                                                                : '0 0 6px rgba(0,0,0,0.8)',
                                                            animation: isCritical ? 'criticalFloat 1.3s ease-out forwards' : 'floatNumber 1.05s ease-out forwards',
                                                            pointerEvents: 'none',
                                                            zIndex: isCritical ? 20 : 12,
                                                        }, children: [isCritical && (0, jsx_runtime_1.jsx)("span", { style: { display: 'block', fontSize: '0.7rem', color: '#FFD54A' }, children: "CRITICAL!" }), num.kind === 'heal' ? `+${displayValue}` : `-${displayValue}`] }, num.id));
                                                }), floatingActions
                                                    .filter((a) => a.unitId === enemy.id)
                                                    .map((action, idx) => ((0, jsx_runtime_1.jsx)("div", { style: {
                                                        position: 'absolute',
                                                        top: `calc(-20px - ${idx * 18}px)`,
                                                        left: '50%',
                                                        color: action.color,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        textShadow: '0 0 6px rgba(0,0,0,0.9), 1px 1px 2px rgba(0,0,0,0.8)',
                                                        animation: 'floatAction 1.1s ease-out forwards',
                                                        pointerEvents: 'none',
                                                        zIndex: 15,
                                                        whiteSpace: 'nowrap',
                                                    }, children: action.text }, action.id))), (0, jsx_runtime_1.jsx)("div", { style: {
                                                        marginTop: 4,
                                                        fontSize: '0.8rem',
                                                        color: isTargetCandidate ? '#FFD87F' : '#aaa',
                                                    }, children: enemy.name }), isTargetCandidate && ((0, jsx_runtime_1.jsx)("div", { style: { color: '#FFD87F', fontSize: '0.75rem' }, children: "Click to target" })), isResolvingTarget && ((0, jsx_runtime_1.jsx)("div", { style: {
                                                        position: 'absolute',
                                                        top: -12,
                                                        left: '50%',
                                                        transform: 'translateX(-50%)',
                                                        color: '#FFD87F',
                                                        fontSize: '1.2rem',
                                                        fontWeight: 900,
                                                        textShadow: '0 0 8px rgba(255,216,127,0.9)',
                                                        pointerEvents: 'none',
                                                        zIndex: 15,
                                                    }, children: "\u2BC8" }))] }, enemy.id));
                                    }) }), (0, jsx_runtime_1.jsx)("div", { style: {
                                        position: 'absolute',
                                        bottom: '28%',
                                        right: '15%',
                                        width: 260,
                                        height: 160,
                                        zIndex: 10,
                                    }, children: battle.playerTeam.units.map((unit, index) => {
                                        // Don't filter out KO'd units if they have ANY pending events related to them
                                        // This includes ability casts, hits, heals, status changes, and KO animations
                                        const hasPendingEvent = events.some((evt) => {
                                            if (evt.type === 'ability' && evt.casterId === unit.id)
                                                return true;
                                            if (evt.type === 'ability' && evt.targets.includes(unit.id))
                                                return true;
                                            if (evt.type === 'hit' && evt.targetId === unit.id)
                                                return true;
                                            if (evt.type === 'heal' && evt.targetId === unit.id)
                                                return true;
                                            if (evt.type === 'ko' && evt.unitId === unit.id)
                                                return true;
                                            if (evt.type === 'status-applied' && evt.targetId === unit.id)
                                                return true;
                                            if (evt.type === 'status-expired' && evt.targetId === unit.id)
                                                return true;
                                            return false;
                                        });
                                        if ((0, Unit_1.isUnitKO)(unit) && !hasPendingEvent)
                                            return null;
                                        const isActor = currentActorId === unit.id;
                                        const isTarget = highlightedTargets.has(unit.id);
                                        const isShaking = shakingUnits.has(unit.id);
                                        const isAttacking = attackingUnits.has(unit.id);
                                        const isCasting = castingUnits.has(unit.id);
                                        const isAttackingBasic = attackingUnitId === unit.id;
                                        const isBeingHit = hitTargetIds.has(unit.id);
                                        // Determine sprite state: attack > hit > idle
                                        const spriteState = isAttackingBasic ? 'attack' : isBeingHit ? 'hit' : 'idle';
                                        // Determine animation: attack lunge (left toward enemy), shake, or casting
                                        let spriteAnimation = 'none';
                                        if (isAttacking) {
                                            spriteAnimation = 'attackLungeLeft 400ms ease-out';
                                        }
                                        else if (isCasting) {
                                            spriteAnimation = 'castPulse 500ms ease-out';
                                        }
                                        else if (isShaking) {
                                            spriteAnimation = 'unitDamageShake 240ms ease-in-out';
                                        }
                                        return ((0, jsx_runtime_1.jsxs)("div", { style: {
                                                position: 'absolute',
                                                left: index * 55,
                                                bottom: index * 12,
                                                textAlign: 'center',
                                            }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                                                        position: 'absolute',
                                                        bottom: 4,
                                                        left: '50%',
                                                        transform: 'translateX(-50%)',
                                                        width: 48,
                                                        height: 16,
                                                        background: isActor || isTarget ? 'rgba(255,216,127,0.3)' : 'rgba(0,0,0,0.6)',
                                                        borderRadius: '50%',
                                                        filter: 'blur(4px)',
                                                        pointerEvents: 'none',
                                                        zIndex: 0,
                                                    } }), (0, jsx_runtime_1.jsx)("div", { style: {
                                                        position: 'relative',
                                                        transform: isActor ? 'scale(2.7)' : 'scale(2.5)',
                                                        zIndex: 1,
                                                        filter: isTarget ? 'drop-shadow(0 0 12px rgba(255,216,127,0.8))' : 'none',
                                                        animation: spriteAnimation,
                                                    }, children: (0, jsx_runtime_1.jsx)(BattleUnitSprite_1.BattleUnitSprite, { unitId: unit.id, state: spriteState, size: "large" }) }), isTarget && ((0, jsx_runtime_1.jsx)("div", { style: {
                                                        position: 'absolute',
                                                        top: -12,
                                                        left: '50%',
                                                        transform: 'translateX(-50%)',
                                                        color: '#FFD87F',
                                                        fontSize: '1.2rem',
                                                        fontWeight: 900,
                                                        textShadow: '0 0 8px rgba(255,216,127,0.9)',
                                                        pointerEvents: 'none',
                                                        zIndex: 15,
                                                    }, children: "\u2BC8" })), floatingNumbers
                                                    .filter((n) => n.unitId === unit.id)
                                                    .map((num, idx) => {
                                                    const displayValue = Math.abs(num.amount);
                                                    const isCritical = num.isCrit;
                                                    return ((0, jsx_runtime_1.jsxs)("div", { style: {
                                                            position: 'absolute',
                                                            bottom: `calc(100% + ${idx * 16 + 6}px)`,
                                                            left: '50%',
                                                            color: num.kind === 'heal' ? '#6df0a2' : isCritical ? '#FFD54A' : '#ff6b6b',
                                                            fontSize: isCritical ? '1.4rem' : '1rem',
                                                            fontWeight: 800,
                                                            textShadow: isCritical
                                                                ? '0 0 12px rgba(255, 215, 74, 0.9), 0 0 20px rgba(255, 180, 0, 0.6), 2px 2px 4px rgba(0,0,0,0.9)'
                                                                : '0 0 6px rgba(0,0,0,0.8)',
                                                            animation: isCritical ? 'criticalFloat 1.3s ease-out forwards' : 'floatNumber 1.05s ease-out forwards',
                                                            pointerEvents: 'none',
                                                            zIndex: isCritical ? 20 : 12,
                                                        }, children: [isCritical && (0, jsx_runtime_1.jsx)("span", { style: { display: 'block', fontSize: '0.7rem', color: '#FFD54A' }, children: "CRITICAL!" }), num.kind === 'heal' ? `+${displayValue}` : `-${displayValue}`] }, num.id));
                                                }), floatingActions
                                                    .filter((a) => a.unitId === unit.id)
                                                    .map((action, idx) => ((0, jsx_runtime_1.jsx)("div", { style: {
                                                        position: 'absolute',
                                                        top: `calc(-20px - ${idx * 18}px)`,
                                                        left: '50%',
                                                        color: action.color,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        textShadow: '0 0 6px rgba(0,0,0,0.9), 1px 1px 2px rgba(0,0,0,0.8)',
                                                        animation: 'floatAction 1.1s ease-out forwards',
                                                        pointerEvents: 'none',
                                                        zIndex: 15,
                                                        whiteSpace: 'nowrap',
                                                    }, children: action.text }, action.id)))] }, unit.id));
                                    }) }), battle.playerTeam.equippedDjinn.length > 0 && ((0, jsx_runtime_1.jsx)("div", { onClick: () => setMenuMode('summon'), title: "Open Summon Menu", style: {
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        right: '6%',
                                        bottom: '34%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 4,
                                        zIndex: 8,
                                    }, children: battle.playerTeam.equippedDjinn.map((djinnId, idx) => {
                                        const djinn = djinn_1.DJINN[djinnId];
                                        if (!djinn)
                                            return null;
                                        const spritePath = DJINN_SPRITE_BY_ELEMENT[djinn.element] || '/sprites/battle/djinn/Venus_Djinn_Front.gif';
                                        return ((0, jsx_runtime_1.jsx)("div", { style: {
                                                position: 'relative',
                                                left: idx % 2 === 0 ? 0 : 6,
                                            }, children: (0, jsx_runtime_1.jsx)("img", { src: spritePath, alt: djinn.name, width: 32, height: 32, style: { imageRendering: 'pixelated', transform: 'scale(2.5)' } }) }, djinnId));
                                    }) }))] }), validTargets.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { style: {
                                position: 'absolute',
                                bottom: 24,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0,0,0,0.8)',
                                padding: '12px 16px',
                                borderRadius: 8,
                                border: '1px solid rgba(255,216,127,0.4)',
                                textAlign: 'center',
                                zIndex: Z_INDEX.TARGET_MODAL,
                            }, children: [(0, jsx_runtime_1.jsx)("div", { style: { color: '#FFD87F', fontWeight: 700, marginBottom: 4 }, children: "Select target" }), (0, jsx_runtime_1.jsx)("div", { style: { color: '#ccc', fontSize: '0.9rem' }, children: "Click a highlighted target to confirm" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                        setSelectedAbilityId(undefined);
                                    }, style: {
                                        marginTop: 8,
                                        background: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        color: '#eaeaea',
                                        padding: '6px 10px',
                                        borderRadius: 6,
                                        cursor: 'pointer',
                                    }, children: "Cancel" })] }))] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 100,
                        background: 'linear-gradient(to top, rgba(8,8,10,0.95), transparent)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 16,
                        padding: '10px 20px',
                        zIndex: Z_INDEX.BOTTOM_BAR,
                    }, children: [(0, jsx_runtime_1.jsx)(BattleManaBar_1.BattleManaBar, { currentMana: currentManaDisplay, maxMana: maxManaDisplay, pendingThisRound: pendingManaThisRound, pendingNextRound: pendingManaNextRound }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleAutoAttack, disabled: isExecuting || uiPhase !== 'planning' || !currentUnit || (0, Unit_1.isUnitKO)(currentUnit), "data-testid": "battle-quick-attack", title: "Quick Attack (Q)", style: {
                                width: 56,
                                height: 56,
                                padding: 0,
                                background: isExecuting ? 'rgba(0,0,0,0.5)' : 'linear-gradient(180deg, #3a3a4a 0%, #1a1a2e 100%)',
                                border: '2px solid rgba(255, 213, 74, 0.7)',
                                borderRadius: 8,
                                cursor: isExecuting || uiPhase !== 'planning' ? 'not-allowed' : 'pointer',
                                opacity: isExecuting ? 0.5 : 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                transition: 'all 0.15s ease',
                            }, children: [(0, jsx_runtime_1.jsx)("img", { src: "/sprites/icons/buttons/Attack.gif", alt: "Attack", width: 28, height: 28, style: { imageRendering: 'pixelated' } }), (0, jsx_runtime_1.jsx)("span", { style: { color: '#ffd87f', fontSize: '0.6rem', fontWeight: 700 }, children: "ATK" })] }), (0, jsx_runtime_1.jsx)(BattlePortraitRow_1.BattlePortraitRow, { units: battle.playerTeam.units, activeIndex: activePortraitIndex, queuedActions: battle.queuedActions, critCounters: critCounters, critThresholds: critThresholds, critFlashes: critFlash, onSelect: (idx) => {
                                const unit = battle.playerTeam.units[idx];
                                if (isTargeting && unit && validTargetIds.has(unit.id)) {
                                    handleTargetSelect(unit.id);
                                    return;
                                }
                                if (uiPhase === 'planning') {
                                    // If clicking on a unit with a queued action, cancel it
                                    const hasQueuedAction = battle.queuedActions[idx] !== null;
                                    if (hasQueuedAction) {
                                        clearUnitAction(idx);
                                        setActivePortrait(idx); // Select the unit so they can queue a new action
                                        setSelectedAbilityId(undefined);
                                    }
                                    else {
                                        setActivePortrait(idx);
                                        setSelectedAbilityId(undefined);
                                    }
                                }
                            } }), (0, jsx_runtime_1.jsxs)("div", { style: {
                                alignSelf: 'flex-end',
                                position: 'relative',
                                zIndex: 60,
                                opacity: isExecuting ? 0.5 : 1,
                                pointerEvents: isExecuting ? 'none' : 'auto',
                                transition: 'opacity 0.2s ease',
                            }, children: [(0, jsx_runtime_1.jsx)(BattleActionMenu_1.BattleActionMenu, { battle: battle, currentUnit: currentUnit, selectedAbilityId: selectedAbilityId ?? null, mode: menuMode, onModeChange: setMenuMode, onSelectAttack: handleSelectAttack, onSelectAbility: handleAbilitySelect }), isExecuting && ((0, jsx_runtime_1.jsx)("div", { style: {
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'rgba(0,0,0,0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 8,
                                        color: '#FFD87F',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                    }, children: "Resolving..." }))] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 200 }, children: [(0, jsx_runtime_1.jsxs)("button", { onClick: cycleSpeed, style: {
                                        padding: '6px 10px',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: '#ccc',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: 6,
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        marginBottom: 4,
                                    }, title: "Click to change battle speed (S key)", children: ["Speed: ", speedPreset.charAt(0).toUpperCase() + speedPreset.slice(1)] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleExecute, disabled: !canExecute, "data-testid": "battle-execute-round", style: {
                                        padding: '10px 14px',
                                        background: canExecute ? '#FFD54A' : 'rgba(255,255,255,0.08)',
                                        color: canExecute ? '#000' : '#888',
                                        border: '1px solid rgba(255,255,255,0.18)',
                                        borderRadius: 8,
                                        cursor: canExecute ? 'pointer' : 'not-allowed',
                                        fontWeight: 700,
                                        letterSpacing: 0.5,
                                    }, children: isExecuting ? 'Executing...' : isQueueComplete ? 'Execute Round' : 'Queue all actions first' }), lastError && ((0, jsx_runtime_1.jsx)("div", { style: {
                                        color: '#ffb3b3',
                                        fontSize: '0.85rem',
                                        background: 'rgba(0,0,0,0.6)',
                                        border: '1px solid rgba(255,99,71,0.4)',
                                        borderRadius: 6,
                                        padding: '6px 8px',
                                        maxWidth: 240,
                                    }, children: (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [(0, jsx_runtime_1.jsx)("span", { style: { flex: 1 }, children: lastError }), (0, jsx_runtime_1.jsx)("button", { onClick: clearError, style: {
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#ffb3b3',
                                                    cursor: 'pointer',
                                                    fontWeight: 700,
                                                }, "aria-label": "Dismiss error", children: "x" })] }) }))] })] })] }) }));
}
