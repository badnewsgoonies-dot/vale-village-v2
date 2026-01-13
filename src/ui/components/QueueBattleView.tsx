/**
 * Queue-Based Battle View Component
 * Bottom layout implementation aligning with battle UI spec.
 */

import { useEffect, useState, useMemo, useRef, useCallback } from 'preact/hooks';
import { ToolboxHelpers } from './debug/ToolboxHelpers';
import { useStore } from '../state/store';
import { useGameStore } from '../../store/gameStore';
import { PostBattleCutscene } from './PostBattleCutscene';
import { VictoryOverlay } from './VictoryOverlay';
import { DefeatOverlay } from './DefeatOverlay';
import { getValidTargets } from '../../core/algorithms/targeting';
import { getPlanningTurnOrder } from '../../core/services/QueueBattleService';
import { isUnitKO } from '../../core/models/Unit';
import { getEncounterId } from '../../core/models/BattleState';
import { BattleManaBar } from './BattleManaBar';
import { BattlePortraitRow } from './BattlePortraitRow';
import { BattleActionMenu, type ActionMenuMode } from './BattleActionMenu';
import { BattlefieldV2 } from './battle/BattlefieldV2';
import { useBattleOrchestrator } from '../hooks/useBattleOrchestrator';
import { useBattleController } from '../hooks/useBattleController';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { Unit } from '../../core/models/Unit';
import type { BattleEvent } from '../../core/services/types';
import { ABILITIES } from '../../data/definitions/abilities';
import { DJINN } from '../../data/definitions/djinn';
import { DIALOGUES } from '../../data/definitions/dialogues';
import { VS1_ENCOUNTER_ID, VS1_SCENE_PRE } from '../../story/vs1Constants';
import { BASIC_ATTACK_IDS, UI_TIMEOUTS } from '../state/types';
import { getBackgroundPath, getTowerFloorBackground } from '../sprites/backgrounds';
import type { FloatingNumber as FNumber, FloatingAction as FAction } from '../state/types';
import type { BattleState } from '../../core/models/BattleState';

function getElementColor(element?: string): string {
  switch (element) {
    case 'Venus': return '#8B4513'; // Brown/Earth
    case 'Mars': return '#ff6600'; // Orange/Fire
    case 'Mercury': return '#00ccff'; // Blue/Water
    case 'Jupiter': return '#9932CC'; // Purple/Wind
    default: return '#ffd87f'; // Golden default
  }
}

function isBasicAttackAbility(abilityId: string): boolean {
  return BASIC_ATTACK_IDS.includes(abilityId);
}

// Z-Index layering constants to prevent overlay conflicts
const Z_INDEX = {
  BACKGROUND: 0,
  SPRITES: 10,
  HUD: 40,
  BOTTOM_BAR: 50,
  MODE_LABEL: 55,
  TARGET_MODAL: 60,
} as const;

// Element to sprite path mapping for Djinn
const DJINN_SPRITE_BY_ELEMENT: Record<string, string> = {
  Venus: '/sprites/battle/djinn/Venus_Djinn_Front.gif',
  Mars: '/sprites/battle/djinn/Mars_Djinn_Front.gif',
  Mercury: '/sprites/battle/djinn/Mercury_Djinn_Front.gif',
  Jupiter: '/sprites/battle/djinn/Jupiter_Djinn_Front.gif',
};

export function QueueBattleView() {
  // Use the controller hook for UI state and logic (Event Loop, Timing, Phase)
  const {
    battle,
    events,
    uiPhase,
    activePortraitIndex,
    currentUnit,
    mode,
    setActivePortrait,
    speedPreset,
    applySpeed,
    cycleSpeed,
    getTimeout,
  } = useBattleController();

  // Use the orchestrator hook for battle actions (Execute, Queue, Clear)
  const { 
    isExecuting, 
    handleExecuteRound, 
    queueUnitAction, 
    clearUnitAction,
  } = useBattleOrchestrator();

  // V2 gameStore for screen navigation
  const setScreen = useGameStore((s) => s.setScreen);
  const openModal = useGameStore((s) => s.openModal);

  // V1 store for remaining domain state (that isn't covered by hooks yet)
  const setBattle = useStore((s) => s.setBattle);
  const setMode = useStore((s) => s.setMode);
  const startDialogueTree = useStore((s) => s.startDialogueTree);
  const returnToOverworldV1 = useStore((s) => s.returnToOverworld);
  const currentManaDisplay = useStore((s) => s.currentMana);
  const maxManaDisplay = useStore((s) => s.maxMana);
  const pendingManaThisRound = useStore((s) => s.pendingManaThisRound);
  const pendingManaNextRound = useStore((s) => s.pendingManaNextRound);
  const towerStatus = useStore((s) => s.towerStatus);
  const activeTowerEncounterId = useStore((s) => s.activeTowerEncounterId);
  const getCurrentTowerFloor = useStore((s) => s.getCurrentTowerFloor);
  const handleTowerBattleCompleted = useStore((s) => s.handleTowerBattleCompleted);
  const storyFlags = useStore((s) => s.story.flags);
  const setStoryFlag = useStore((s) => s.setStoryFlag);
  const critCounters = useStore((s) => s.critCounters);
  const critThresholds = useStore((s) => s.critThresholds);
  const critFlash = useStore((s) => s.critFlash);
  const incrementCritCounter = useStore((s) => s.incrementCritCounter);
  const resetCritCounter = useStore((s) => s.resetCritCounter);
  const triggerCritFlash = useStore((s) => s.triggerCritFlash);
  const lastBattleRewards = useStore((s) => s.lastBattleRewards);
  const processVictory = useStore((s) => s.processVictory);
  const lastError = useStore((s) => s.lastError);
  const clearError = useStore((s) => s.clearError);

  // Wrapper to sync both V1 and V2 store when returning to overworld
  const returnToOverworld = () => {
    returnToOverworldV1();
    setScreen('overworld');
  };

  // Selection State
  const [selectedAbilityId, setSelectedAbilityId] = useState<string | null | undefined>(undefined);
  const [menuMode, setMenuMode] = useState<ActionMenuMode>('root');

  // Tower battle tutorial (Floor 1)
  const [tutorialOpenedPsynergy, setTutorialOpenedPsynergy] = useState(false);
  const [tutorialQueuedAction, setTutorialQueuedAction] = useState(false);
  const [tutorialExecutedRound, setTutorialExecutedRound] = useState(false);

  // Post-battle State
  const [showCutscene, setShowCutscene] = useState(false);
  const [showVictoryOverlay, setShowVictoryOverlay] = useState(false);
  const [showDefeatOverlay, setShowDefeatOverlay] = useState(false);
  const [battleOutcome, setBattleOutcome] = useState<'victory' | 'defeat' | null>(null);
  const [floatingNumbers, setFloatingNumbers] = useState<FNumber[]>([]);
  const [floatingActions, setFloatingActions] = useState<FAction[]>([]);
  const [showBattleTips, setShowBattleTips] = useState<boolean>(false);
  const floatingIdRef = useRef(0);
  const floatingActionIdRef = useRef(0);
  const [shakingUnits, setShakingUnits] = useState<Set<string>>(new Set());
  const [attackingUnits, setAttackingUnits] = useState<Set<string>>(new Set());
  const [castingUnits, setCastingUnits] = useState<Set<string>>(new Set());
  const [, setIsScreenShaking] = useState(false);
  const shakeTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const attackTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const castTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const currentAttackerRef = useRef<string | null>(null);
  const floatingTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const floatingActionTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const lastProcessedEventRef = useRef<BattleEvent | undefined>(undefined);
  const lastCritProcessedEventRef = useRef<BattleEvent | undefined>(undefined);
  const lastActionEventRef = useRef<BattleEvent | undefined>(undefined);
  const lastAttackAnimEventRef = useRef<BattleEvent | undefined>(undefined);

  // Redirect to tower hub if battle is null during tower run
  useEffect(() => {
    if (!battle && (towerStatus === 'in-run' || towerStatus === 'completed')) {
      setMode('tower');
      setScreen('tower');
    }
  }, [battle, towerStatus, setMode, setScreen]);

  // --- EFFECTS ---

  // 1. Auto-select first unit based on SPEED
  useEffect(() => {
    if (uiPhase === 'planning' && activePortraitIndex === null && battle) {
      const order = getPlanningTurnOrder(battle);
      if (order.length > 0 && order[0] !== undefined) {
        setActivePortrait(order[0]);
      }
    }
  }, [uiPhase, activePortraitIndex, battle, setActivePortrait]);

  // 2. Detect battle end and kick off result flow
  useEffect(() => {
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
  useEffect(() => {
    if (!battle || battleOutcome !== 'victory') return;
    const isTowerBattle = towerStatus === 'in-run' && !!activeTowerEncounterId;
    if (isTowerBattle) return; // tower flow handles its own rewards

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
  useEffect(() => {
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
  useEffect(() => {
    return () => {
      // Cleanup floating numbers and actions on unmount
      setFloatingNumbers([]);
      setFloatingActions([]);
    };
  }, []);

  // Spawn floating damage/heal numbers and trigger shake when events resolve
  useEffect(() => {
    if (!battle || uiPhase !== 'executing') return;
    const evt = events[0];
    if (!evt) return;
    if (evt === lastProcessedEventRef.current) return;
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
      }, getTimeout(isCrit ? UI_TIMEOUTS.critFloating : UI_TIMEOUTS.floating)); // Crits stay longer
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
        
        // Gap 4: Screen Shake on Critical Hits
        if (isCrit) {
          setIsScreenShaking(true);
          setTimeout(() => setIsScreenShaking(false), 400);
        }

        // Remove after animation duration (crits shake longer)
        const shakeTimeout = setTimeout(() => {
          setShakingUnits((prev) => {
            const next = new Set(prev);
            next.delete(targetId);
            return next;
          });
          shakeTimeoutsRef.current.delete(targetId);
        }, getTimeout(isCrit ? UI_TIMEOUTS.critShake : UI_TIMEOUTS.shake));
        shakeTimeoutsRef.current.set(targetId, shakeTimeout);
      }
    }
  }, [uiPhase, events, battle, critFlash, getTimeout]);

  // Crit counter progression for basic attacks
  useEffect(() => {
    if (!battle || uiPhase !== 'executing') return;
    const evt = events[0];
    if (!evt) return;
    if (evt === lastCritProcessedEventRef.current) return;
    lastCritProcessedEventRef.current = evt;

    if (evt.type === 'ability' && BASIC_ATTACK_IDS.includes(evt.abilityId)) {
      const casterId = evt.casterId;
      const isPlayerUnit = battle.playerTeam.units.some((u: Unit) => u.id === casterId);
      if (isPlayerUnit) {
        const nextCount = (critCounters[casterId] ?? 0) + 1;
        const threshold = critThresholds[casterId] ?? 10;
        if (nextCount >= threshold) {
          resetCritCounter(casterId);
          triggerCritFlash(casterId);
        } else {
          incrementCritCounter(casterId);
        }
      }
    }
  }, [uiPhase, events, battle, critCounters, critThresholds, incrementCritCounter, resetCritCounter, triggerCritFlash]);

  // Spawn floating action text
  useEffect(() => {
    if (!battle || uiPhase !== 'executing') return;
    const evt = events[0];
    if (!evt) return;
    if (evt === lastActionEventRef.current) return;
    lastActionEventRef.current = evt;

    if (evt.type === 'ability') {
      const ability = ABILITIES[evt.abilityId];
      const abilityName = ability?.name ?? evt.abilityId;
      const element = ability?.element;
      const color = getElementColor(element);
      
      const id = floatingActionIdRef.current + 1;
      floatingActionIdRef.current = id;
      
      setFloatingActions((prev) => [...prev, { id, unitId: evt.casterId, text: abilityName, color }]);
      const timeoutId = setTimeout(() => {
        setFloatingActions((prev) => prev.filter((a) => a.id !== id));
        floatingActionTimeoutsRef.current.delete(id);
      }, getTimeout(UI_TIMEOUTS.floatingAction));
      floatingActionTimeoutsRef.current.set(id, timeoutId);
    } else if (evt.type === 'ko') {
      const id = floatingActionIdRef.current + 1;
      floatingActionIdRef.current = id;
      
      setFloatingActions((prev) => [...prev, { id, unitId: evt.unitId, text: 'KO!', color: '#ff4444' }]);
      const timeoutId = setTimeout(() => {
        setFloatingActions((prev) => prev.filter((a) => a.id !== id));
        floatingActionTimeoutsRef.current.delete(id);
      }, getTimeout(UI_TIMEOUTS.koAction));
      floatingActionTimeoutsRef.current.set(id, timeoutId);
    }
  }, [uiPhase, events, battle, getTimeout]);

  // Trigger attack/cast animations
  useEffect(() => {
    if (!battle || uiPhase !== 'executing') return;
    const evt = events[0];
    if (!evt) return;
    if (evt === lastAttackAnimEventRef.current) return;
    lastAttackAnimEventRef.current = evt;

    if (evt.type === 'ability') {
      const casterId = evt.casterId;
      const isBasicAttack = BASIC_ATTACK_IDS.includes(evt.abilityId);
      
      const existingAttackTimeout = attackTimeoutsRef.current.get(casterId);
      if (existingAttackTimeout) clearTimeout(existingAttackTimeout);
      const existingCastTimeout = castTimeoutsRef.current.get(casterId);
      if (existingCastTimeout) clearTimeout(existingCastTimeout);
      
      if (isBasicAttack) {
        setAttackingUnits((prev) => new Set([...prev, casterId]));
        const timeout = setTimeout(() => {
          setAttackingUnits((prev) => {
            const next = new Set(prev);
            next.delete(casterId);
            return next;
          });
          attackTimeoutsRef.current.delete(casterId);
        }, getTimeout(UI_TIMEOUTS.attackLunge));
        attackTimeoutsRef.current.set(casterId, timeout);
      } else {
        setCastingUnits((prev) => new Set([...prev, casterId]));
        const timeout = setTimeout(() => {
          setCastingUnits((prev) => {
            const next = new Set(prev);
            next.delete(casterId);
            return next;
          });
          castTimeoutsRef.current.delete(casterId);
        }, getTimeout(UI_TIMEOUTS.castPulse));
        castTimeoutsRef.current.set(casterId, timeout);
      }
    }
  }, [uiPhase, events, battle, getTimeout]);

  // --- COMPUTED VALUES ---

  const totalQueuedMana = useMemo(() =>
    battle?.queuedActions?.reduce((sum: number, a: BattleState['queuedActions'][number]) => sum + (a?.manaCost || 0), 0) || 0
  , [battle?.queuedActions]);

  const isQueueComplete = useMemo(() => {
    if (!battle) return false;
    const aliveUnits = battle.playerTeam.units.filter((u: Unit) => !isUnitKO(u));

    let queuedCount = 0;
    for (let i = 0; i < battle.playerTeam.units.length; i++) {
      const unit = battle.playerTeam.units[i];
      const action = battle.queuedActions[i];
      if (unit && !isUnitKO(unit) && action !== null) {
        queuedCount++;
      }
    }

    return aliveUnits.length === queuedCount && totalQueuedMana <= battle.maxMana;
  }, [battle, totalQueuedMana]);

  const currentFloor = useMemo(() => (towerStatus === 'in-run' ? getCurrentTowerFloor() : null), [towerStatus, getCurrentTowerFloor]);
  const battleType = towerStatus === 'in-run' ? 'tower' : 'story';

  const towerTutorialFlagKey = 'tutorial:tower-battle-controls';
  const showTowerBattleTutorial =
    battleType === 'tower' &&
    Boolean(currentFloor?.tags?.includes('tutorial')) &&
    storyFlags[towerTutorialFlagKey] !== true;

  const backgroundUrl = useMemo(() => {
    if (currentFloor?.floorNumber) {
      const towerBgId = getTowerFloorBackground(currentFloor.floorNumber);
      return getBackgroundPath(towerBgId);
    }
    if (battle?.backgroundId) {
      return getBackgroundPath(battle.backgroundId);
    }
    return getBackgroundPath(undefined);
  }, [currentFloor?.floorNumber, battle?.backgroundId]);

  const currentEvent = events[0];
  const currentActorId =
    currentEvent?.type === 'ability' ? currentEvent.casterId :
    currentEvent?.type === 'hit' || currentEvent?.type === 'heal' || currentEvent?.type === 'status-applied' || currentEvent?.type === 'status-expired' ? undefined :
    currentEvent?.type === 'ko' ? currentEvent.unitId :
    undefined;
  
  const isBasicAttackEvent = currentEvent?.type === 'ability' && isBasicAttackAbility(currentEvent.abilityId);
  const attackingUnitId = isBasicAttackEvent ? currentActorId : null;
  
  const hitTargetIds = new Set<string>();
  if (currentEvent?.type === 'hit') {
    hitTargetIds.add(currentEvent.targetId);
  } else if (isBasicAttackEvent && currentEvent?.type === 'ability') {
    currentEvent.targets.forEach(t => hitTargetIds.add(t));
  }
  
  const highlightedTargets = new Set<string>();
  if (currentEvent) {
    if (currentEvent.type === 'ability') {
      currentEvent.targets.forEach((t) => highlightedTargets.add(t));
    } else if (currentEvent.type === 'hit' || currentEvent.type === 'heal' || currentEvent.type === 'status-applied' || currentEvent.type === 'status-expired') {
      highlightedTargets.add(currentEvent.targetId);
    } else if (currentEvent.type === 'ko') {
      highlightedTargets.add(currentEvent.unitId);
    }
  }

  // --- Tower Battle Tutorial ---
  useEffect(() => {
    if (!showTowerBattleTutorial) return;
    setTutorialOpenedPsynergy(false);
    setTutorialQueuedAction(false);
    setTutorialExecutedRound(false);
  }, [showTowerBattleTutorial, battle?.meta?.encounterId, battle?.encounterId]);

  useEffect(() => {
    if (!showTowerBattleTutorial) return;
    if (menuMode === 'abilities') {
      setTutorialOpenedPsynergy(true);
    }
  }, [showTowerBattleTutorial, menuMode]);

  useEffect(() => {
    if (!showTowerBattleTutorial || !battle) return;
    if (battle.queuedActions.some((action: BattleState['queuedActions'][number]) => action !== null)) {
      setTutorialQueuedAction(true);
    }
  }, [showTowerBattleTutorial, battle]);

  useEffect(() => {
    if (!showTowerBattleTutorial) return;
    if (uiPhase === 'executing') {
      setTutorialExecutedRound(true);
    }
  }, [showTowerBattleTutorial, uiPhase]);

  useEffect(() => {
    if (!showTowerBattleTutorial) return;
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

    const encounterId = battle ? getEncounterId(battle) : null;

    if (encounterId === VS1_ENCOUNTER_ID) {
      const preScene = DIALOGUES[VS1_SCENE_PRE];
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

    if (battleOutcome !== 'victory') return;

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

  const handleSelectAttack = () => {
    setSelectedAbilityId(null);
    setMenuMode('root');
  };

  const handleAbilitySelect = (id: string | null, ability?: Ability) => {
    if (selectedAbilityId === id) {
      setSelectedAbilityId(undefined);
      return;
    }
    setSelectedAbilityId(id);
    void ability;
    setMenuMode('root');
  };

  const handleTargetSelect = (targetId: string, abilityIdOverride?: string | null) => {
    if (!currentUnit || activePortraitIndex === null || !battle) return;

    const abilityIdToUse = abilityIdOverride ?? selectedAbilityId;
    const ability = abilityIdToUse ? currentUnit.abilities.find(a => a.id === abilityIdToUse) : undefined;

    let targetIds: string[] = [targetId];
    const aliveEnemies = battle.enemies.filter((e: Unit) => !isUnitKO(e)).map((e: Unit) => e.id);
    const aliveAllies = battle.playerTeam.units.filter((u: Unit) => !isUnitKO(u)).map((u: Unit) => u.id);

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

    const existingAction = battle.queuedActions[activePortraitIndex];
    if (existingAction !== null) {
      const order = getPlanningTurnOrder(battle);
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

    const queued = queueUnitAction(activePortraitIndex, abilityIdToUse ?? null, targetIds, ability);
    if (!queued) {
      return;
    }

    setSelectedAbilityId(undefined);

    const order = getPlanningTurnOrder(battle);
    const currentOrderIdx = order.indexOf(activePortraitIndex);
    for (let i = currentOrderIdx + 1; i < order.length; i++) {
      const nextIndex = order[i];
      if (nextIndex === undefined) continue;
      const nextUnit = battle.playerTeam.units[nextIndex];
      if (nextUnit && !isUnitKO(nextUnit) && battle.queuedActions[nextIndex] === null) {
        setActivePortrait(nextIndex);
        break;
      }
    }
  };

  const handleAutoAttack = useCallback(() => {
    if (!battle || uiPhase !== 'planning') return;
    if (!currentUnit || activePortraitIndex === null) return;
    if (isUnitKO(currentUnit)) return;

    const targets = getValidTargets(null, currentUnit, battle.playerTeam, battle.enemies);
    const firstTarget = targets[0];
    if (!firstTarget) return;

    handleSelectAttack();
    handleTargetSelect(firstTarget.id, null);
  }, [battle, uiPhase, currentUnit, activePortraitIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'q' && event.key !== 'Q') return;
      if (event.repeat) return;
      handleAutoAttack();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [handleAutoAttack]);

  // 'S' key for speed cycling
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 's' || event.key === 'S') {
        if (!event.repeat) cycleSpeed();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cycleSpeed]);

  const handleExecute = () => {
    if (isQueueComplete && uiPhase === 'planning') {
      handleExecuteRound();
    }
  };

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

  if (!battle) {
    return (
      <div
        style={{
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
        }}
      >
        <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Battle not ready</div>
        <div style={{ color: '#aaa' }}>Try starting a new battle from the overworld.</div>
        {lastError && (
          <div
            style={{
              maxWidth: 520,
              padding: '0.75rem 1rem',
              borderRadius: 8,
              background: 'rgba(255, 99, 71, 0.15)',
              border: '1px solid rgba(255, 99, 71, 0.4)',
              color: '#ffb3b3',
            }}
          >
            {lastError}
          </div>
        )}
        <button
          onClick={returnToOverworld}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Return to Overworld
        </button>
      </div>
    );
  }

  // Post-battle handling
  if (showCutscene && battleOutcome) {
    return (
      <PostBattleCutscene
        victory={battleOutcome === 'victory'}
        onComplete={() => {
          setShowCutscene(false);
          if (battleOutcome === 'victory') {
            setShowVictoryOverlay(true);
          } else {
            setShowDefeatOverlay(true);
          }
        }}
      />
    );
  }

  if (battleOutcome === 'victory' && showVictoryOverlay) {
    return <VictoryOverlay onComplete={handleVictoryOverlayComplete} />;
  }

  if (battleOutcome === 'defeat' && showDefeatOverlay) {
    return <DefeatOverlay onComplete={() => {
      setShowDefeatOverlay(false);
      handleDefeatResolution();
    }} />;
  }

  // Determine valid targets if in selection mode (only during planning phase)
  let validTargets: readonly { id: string; name: string }[] = [];
  if (uiPhase === 'planning' && selectedAbilityId !== undefined && currentUnit) {
    const ability = selectedAbilityId
      ? currentUnit.abilities.find(a => a.id === selectedAbilityId)
      : undefined;
    validTargets = getValidTargets(ability || null, currentUnit, battle.playerTeam, battle.enemies);
  }
  const validTargetIds = new Set(validTargets.map((t: { id: string }) => t.id));
  const isTargeting = selectedAbilityId !== undefined && validTargets.length > 0;

  return (
    <div
      data-testid="battle-view"
      style={{
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
      }}
    >
      <div
        style={{
          width: 900,
          height: 600,
          position: 'relative',
          background: '#000',
          overflow: 'hidden',
          imageRendering: 'pixelated',
          color: '#fff',
        }}
      >
        <ToolboxHelpers title="Battle" position="top-right" actions={toolboxActions} />
        {showTowerBattleTutorial && (
          <div
            data-testid="battle-tutorial"
            style={{
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
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ color: '#FFD87F', fontWeight: 800, letterSpacing: 0.5 }}>
                Tower Battle Tutorial
              </div>
              <button
                onClick={skipTowerBattleTutorial}
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  color: '#eaeaea',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 6,
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                Skip
              </button>
            </div>

            <div style={{ color: '#cfcfcf', fontSize: 12, marginBottom: 10 }}>
              Queue actions for your party, then execute the round.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ width: 16, textAlign: 'center', color: tutorialOpenedPsynergy ? '#7FFFD4' : '#999' }}>
                  {tutorialOpenedPsynergy ? '✓' : '□'}
                </span>
                <span>Open <span style={{ fontWeight: 800 }}>PSYNERGY</span> to view abilities</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ width: 16, textAlign: 'center', color: tutorialQueuedAction ? '#7FFFD4' : '#999' }}>
                  {tutorialQueuedAction ? '✓' : '□'}
                </span>
                <span>Queue an action (<span style={{ fontWeight: 800 }}>ATTACK</span> → click an enemy)</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ width: 16, textAlign: 'center', color: tutorialExecutedRound ? '#7FFFD4' : '#999' }}>
                  {tutorialExecutedRound ? '✓' : '□'}
                </span>
                <span>Press <span style={{ fontWeight: 800 }}>Execute Round</span></span>
              </div>
            </div>

            <div style={{ marginTop: 10, color: '#aaa', fontSize: 11 }}>
              Tip: Attacks generate +1 mana. Spend mana on PSYNERGY.
            </div>
          </div>
        )}
        {showBattleTips && (
          <div style={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 6,
            padding: '6px 8px',
            fontSize: 12,
            zIndex: 101,
          }}>
            <div>Controls: Q = auto-attack | S = cycle speed | Click = select | Esc = pause</div>
          </div>
        )}

        <style>
          {`
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
            @keyframes screenShake {
              0% { transform: translate(0, 0); }
              20% { transform: translate(-4px, 4px); }
              40% { transform: translate(4px, -4px); }
              60% { transform: translate(-2px, 2px); }
              80% { transform: translate(2px, -2px); }
              100% { transform: translate(0, 0); }
            }
            @keyframes castPulse {
              0% { transform: scale(1); filter: brightness(1); }
              25% { transform: scale(1.1); filter: brightness(1.4) drop-shadow(0 0 10px rgba(255,216,127,0.8)); }
              50% { transform: scale(1.05); filter: brightness(1.2) drop-shadow(0 0 6px rgba(255,216,127,0.5)); }
              100% { transform: scale(1); filter: brightness(1); }
            }
          `}
        </style>
        {/* Battlefield Area */}
        {battle && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
            <div
              style={{
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
              }}
            />
            
            <BattlefieldV2
              battle={battle}
              events={[...events]}
              validTargetIds={validTargetIds}
              highlightedTargets={highlightedTargets}
              currentActorId={currentActorId ?? null}
              shakingUnits={shakingUnits}
              attackingUnits={attackingUnits}
              castingUnits={castingUnits}
              hitTargetIds={hitTargetIds}
              attackingUnitId={attackingUnitId ?? null}
              floatingNumbers={floatingNumbers}
              floatingActions={floatingActions}
              onTargetSelect={(id) => handleTargetSelect(id)}
              equippedDjinn={[...battle.playerTeam.equippedDjinn]}
              onOpenSummonMenu={() => setMenuMode('summon')}
              djinnSpriteByElement={DJINN_SPRITE_BY_ELEMENT}
              djinnData={DJINN}
            />
          </div>
        )}

        {/* Target Selection Modal */}
        {validTargets.length > 0 && (
          <div
            style={{
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
            }}
          >
            <div style={{ color: '#FFD87F', fontWeight: 700, marginBottom: 4 }}>Select target</div>
            <div style={{ color: '#ccc', fontSize: '0.9rem' }}>Click a highlighted target to confirm</div>
            <button
              onClick={() => {
                setSelectedAbilityId(undefined);
              }}
              style={{
                marginTop: 8,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#eaeaea',
                padding: '6px 10px',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Bottom UI Strip */}
        <div
          style={{
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
          }}
        >
          <BattleManaBar
            currentMana={currentManaDisplay}
            maxMana={maxManaDisplay}
            pendingThisRound={pendingManaThisRound}
            pendingNextRound={pendingManaNextRound}
          />
          
          {/* Quick Attack Button */}
          <button
            onClick={handleAutoAttack}
            disabled={isExecuting || uiPhase !== 'planning' || !currentUnit || isUnitKO(currentUnit)}
            data-testid="battle-quick-attack"
            title="Quick Attack (Q)"
            style={{
              width: 56,
              height: 56,
              borderRadius: 8,
              background: isExecuting ? 'rgba(0,0,0,0.5)' : 'linear-gradient(180deg, #3a3a4a 0%, #1a1a2e 100%)',
              border: '2px solid rgba(255, 213, 74, 0.7)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              cursor: isExecuting || uiPhase !== 'planning' ? 'not-allowed' : 'pointer',
              opacity: isExecuting ? 0.5 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            <img
              src="/sprites/icons/buttons/Attack.gif"
              alt="Attack"
              width={28}
              height={28}
              style={{ imageRendering: 'pixelated' }}
            />
            <span style={{ color: '#ffd87f', fontSize: '0.6rem', fontWeight: 700 }}>ATK</span>
          </button>

          <BattlePortraitRow
            units={battle?.playerTeam.units || []}
            activeIndex={activePortraitIndex}
            queuedActions={battle?.queuedActions || ([] as readonly (BattleState['queuedActions'][number])[])}
            critCounters={critCounters}
            critThresholds={critThresholds}
            critFlashes={critFlash}
            onSelect={(idx) => {
              const unit = battle?.playerTeam.units[idx];
              if (isTargeting && unit && validTargetIds.has(unit.id)) {
                handleTargetSelect(unit.id);
                return;
              }
              if (uiPhase === 'planning') {
                const hasQueuedAction = battle?.queuedActions[idx] !== null;
                if (hasQueuedAction) {
                  clearUnitAction(idx);
                  setActivePortrait(idx);
                  setSelectedAbilityId(undefined);
                } else {
                  setActivePortrait(idx);
                  setSelectedAbilityId(undefined);
                }
              }
            }}
          />

          <div
            style={{
              alignSelf: 'flex-end',
              position: 'relative',
              zIndex: 60,
              opacity: isExecuting ? 0.5 : 1,
              pointerEvents: isExecuting ? 'none' : 'auto',
              transition: 'opacity 0.2s ease',
            }}
          >
            <BattleActionMenu
              battle={battle!}
              currentUnit={currentUnit}
              selectedAbilityId={selectedAbilityId ?? null}
              mode={menuMode}
              onModeChange={setMenuMode}
              onSelectAttack={handleSelectAttack}
              onSelectAbility={handleAbilitySelect}
            />
            {isExecuting && (
              <div
                style={{
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
                }}
              >
                Resolving...
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 200 }}>
            <button
              onClick={cycleSpeed}
              style={{
                padding: '6px 10px',
                background: 'rgba(255,255,255,0.1)',
                color: '#ccc',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '0.8rem',
                marginBottom: 4,
              }}
              title="Click to change battle speed (S key)"
            >
              Speed: {speedPreset.charAt(0).toUpperCase() + speedPreset.slice(1)}
            </button>
            <button
              onClick={handleExecute}
              disabled={!canExecute}
              data-testid="battle-execute-round"
              style={{
                padding: '10px 14px',
                background: canExecute ? '#FFD54A' : 'rgba(255,255,255,0.08)',
                color: canExecute ? '#000' : '#888',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 8,
                cursor: canExecute ? 'pointer' : 'not-allowed',
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              {isExecuting ? 'Executing...' : isQueueComplete ? 'Execute Round' : 'Queue all actions first'}
            </button>
            {lastError && (
              <div
                style={{
                  color: '#ffb3b3',
                  fontSize: '0.85rem',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,99,71,0.4)',
                  borderRadius: 6,
                  padding: '6px 8px',
                  maxWidth: 240,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ flex: 1 }}>{lastError}</span>
                  <button
                    onClick={clearError}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ffb3b3',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                    aria-label="Dismiss error"
                  >
                    x
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlays */}
      {showCutscene && battleOutcome && (
        <PostBattleCutscene
          victory={battleOutcome === 'victory'}
          onComplete={() => {
            setShowCutscene(false);
            if (battleOutcome === 'victory') {
              setShowVictoryOverlay(true);
            } else {
              setShowDefeatOverlay(true);
            }
          }}
        />
      )}

      {battleOutcome === 'victory' && showVictoryOverlay && (
        <VictoryOverlay onComplete={handleVictoryOverlayComplete} />
      )}

      {battleOutcome === 'defeat' && showDefeatOverlay && (
        <DefeatOverlay onComplete={() => {
          setShowDefeatOverlay(false);
          handleDefeatResolution();
        }} />
      )}
    </div>
  );
}