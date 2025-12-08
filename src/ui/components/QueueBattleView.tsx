/**
 * Queue-Based Battle View Component
 * Bottom layout implementation aligning with battle UI spec.
 */

import { useEffect, useState, useMemo, useRef, useCallback } from 'preact/hooks';
import { useStore } from '../state/store';
import { useGameStore } from '../../store/gameStore';
import { renderEventText } from '../utils/text';
import { BattleLog } from './BattleLog';
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
import { ModeLabel } from './ModeLabel';
import type { Ability } from '../../data/schemas/AbilitySchema';
import type { Unit } from '../../core/models/Unit';
import type { BattleEvent } from '../../core/services/types';
import { getEnemyBattleSprite } from '../sprites/mappings/battleSprites';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { BattleUnitSprite } from './BattleUnitSprite';
import { ABILITIES } from '../../data/definitions/abilities';
// Direct ability→GIF mapping in ABILITY_FX_MAP below (only for existing GIFs)
import { DIALOGUES } from '../../data/definitions/dialogues';
import { VS1_ENCOUNTER_ID, VS1_SCENE_PRE } from '../../story/vs1Constants';
import { type BattleUIPhase, deriveUIPhase } from '../types/BattleUIPhase';
import { getEventTiming } from '../constants/animationTiming';
import { useBattleSpeed } from '../hooks/useBattleSpeed';

// Z-Index layering constants to prevent overlay conflicts
const Z_INDEX = {
  BACKGROUND: 0,
  SPRITES: 10,
  HUD: 40,
  BATTLE_LOG: 45,
  BOTTOM_BAR: 50,
  MODE_LABEL: 55,
  TARGET_MODAL: 60,
  RESOLVING_CARD: 80,
  FX_CARD: 90,
} as const;

const FX_LIBRARY = {
  grandGaia: '/sprites/psynergy/Grand_Gaia.gif',
  pyroclasm: '/sprites/psynergy/Pyroclasm.gif',
  sparkPlasma: '/sprites/psynergy/Spark_Plasma.gif',
  deluge: '/sprites/psynergy/Deluge.gif',
  blueBolt: '/sprites/psynergy/Blue_Bolt.gif',
  heatWave: '/sprites/psynergy/Heat_Wave.gif',
  tempest: '/sprites/psynergy/Tempest.gif',
  glacier: '/sprites/psynergy/Glacier.gif',
  freezePrism: '/sprites/psynergy/Freeze_Prism.gif',
  inferno: '/sprites/psynergy/Inferno.gif',
  supernova: '/sprites/psynergy/Supernova.gif',
  dragonFire: '/sprites/psynergy/Dragon_Fire.gif',
  fieryBlast: '/sprites/psynergy/Fiery_Blast.gif',
  iceMissile: '/sprites/psynergy/Ice_Missile.gif',
  nettle: '/sprites/psynergy/Nettle.gif',
  destructRay: '/sprites/psynergy/Destruct_Ray.gif',
  frothSpiral: '/sprites/psynergy/Froth_Spiral.gif',
  fume: '/sprites/psynergy/Fume.gif',
  sonicSlash: '/sprites/psynergy/Sonic_Slash.gif',
} as const;
const FX_FALLBACK = FX_LIBRARY.sonicSlash;

// Direct ability ID → GIF mapping (only for GIFs we actually have)
const ABILITY_FX_MAP: Record<string, string> = {
  // === BASIC/PHYSICAL ATTACKS ===
  'strike': FX_LIBRARY.sonicSlash,
  'heavy-strike': FX_LIBRARY.sonicSlash,
  'guard-break': FX_LIBRARY.sonicSlash,
  'precise-jab': FX_LIBRARY.sonicSlash,
  'wooden-strike': FX_LIBRARY.sonicSlash,
  'bronze-slash': FX_LIBRARY.sonicSlash,
  'iron-thrust': FX_LIBRARY.sonicSlash,
  'iron-bulwark': FX_LIBRARY.sonicSlash,
  'arcane-bolt': FX_LIBRARY.blueBolt,
  'steel-focus': FX_LIBRARY.sonicSlash,

  // === FIRE/MARS ===
  'fireball': FX_LIBRARY.heatWave,
  'fire-burst': FX_LIBRARY.heatWave,
  'flare': FX_LIBRARY.heatWave,
  'burn-touch': FX_LIBRARY.heatWave,
  'inferno-slash': FX_LIBRARY.inferno,
  'supernova': FX_LIBRARY.supernova,
  'pyroclasm': FX_LIBRARY.pyroclasm,
  'dragon-breath': FX_LIBRARY.dragonFire,
  'flame-burst-damage': FX_LIBRARY.fieryBlast,
  'blazing-fury': FX_LIBRARY.fieryBlast,
  'meteor-strike': FX_LIBRARY.pyroclasm,

  // === ICE/MERCURY ===
  'ice-shard': FX_LIBRARY.glacier,
  'freeze-blast': FX_LIBRARY.freezePrism,
  'blizzard': FX_LIBRARY.freezePrism,
  'ice-lance-damage': FX_LIBRARY.iceMissile,
  'heal': FX_LIBRARY.deluge,
  'party-heal': FX_LIBRARY.deluge,
  'cure': FX_LIBRARY.deluge,

  // === LIGHTNING/JUPITER ===
  'chain-lightning': FX_LIBRARY.sparkPlasma,
  'paralyze-shock': FX_LIBRARY.sparkPlasma,
  'tempest': FX_LIBRARY.tempest,
  'gust': FX_LIBRARY.tempest,
  'plasma-shot': FX_LIBRARY.blueBolt,

  // === EARTH/VENUS ===
  'quake': FX_LIBRARY.grandGaia,
  'earthquake': FX_LIBRARY.grandGaia,
  'earth-spike': FX_LIBRARY.grandGaia,
  'poison-strike': FX_LIBRARY.fume,

  // === STATUS/BUFF ===
  'boost-atk': FX_LIBRARY.heatWave,
  'boost-def': FX_LIBRARY.grandGaia,
  'weaken-def': FX_LIBRARY.fume,
  'blind': FX_LIBRARY.fume,
  'guard': FX_LIBRARY.grandGaia,
};

/**
 * SIMPLIFIED FX SYSTEM
 * Single source of truth for event -> GIF mapping
 * No complex fallback chains - just simple, predictable logic
 */
function getEventGif(event: BattleEvent | undefined): string | null {
  if (!event || event.type !== 'ability') return null;  // Only abilities show GIFs

  const abilityId = event.abilityId;

  // Basic attacks always use sonic slash
  if (['strike', 'heavy-strike', 'guard-break', 'precise-jab'].includes(abilityId)) {
    return FX_LIBRARY.sonicSlash;
  }

  // Direct mapping (most abilities)
  if (ABILITY_FX_MAP[abilityId]) {
    return ABILITY_FX_MAP[abilityId];
  }

  // Element fallback for unmapped psynergy
  const ability = ABILITIES[abilityId];
  if (ability?.element) {
    switch (ability.element) {
      case 'Mars':
        return FX_LIBRARY.heatWave;
      case 'Mercury':
        return FX_LIBRARY.deluge;
      case 'Jupiter':
        return FX_LIBRARY.sparkPlasma;
      case 'Venus':
        return FX_LIBRARY.grandGaia;
    }
  }

  // Final fallback
  return FX_LIBRARY.sonicSlash;
}


const djinnSprites = [
  { id: 'venus', name: 'Flint', path: '/sprites/battle/djinn/Venus_Djinn_Front.gif' },
  { id: 'mars', name: 'Granite', path: '/sprites/battle/djinn/Mars_Djinn_Front.gif' },
  { id: 'mercury', name: 'Echo', path: '/sprites/battle/djinn/Mercury_Djinn_Front.gif' },
];

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

export function QueueBattleView() {
  // V2 gameStore for screen navigation
  const setScreen = useGameStore((s) => s.setScreen);

  // V1 store for battle domain state
  const battle = useStore((s) => s.battle);
  const events = useStore((s) => s.events);
  const dequeue = useStore((s) => s.dequeueEvent);
  const queueUnitAction = useStore((s) => s.queueUnitAction);
  const executeQueuedRound = useStore((s) => s.executeQueuedRound);
  const setMode = useStore((s) => s.setMode);
  const mode = useStore((s) => s.mode);
  const startDialogueTree = useStore((s) => s.startDialogueTree);
  const returnToOverworldV1 = useStore((s) => s.returnToOverworld);
  const activePortraitIndex = useStore((s) => s.activePortraitIndex);
  const setActivePortrait = useStore((s) => s.setActivePortrait);
  const currentManaDisplay = useStore((s) => s.currentMana);
  const maxManaDisplay = useStore((s) => s.maxMana);
  const pendingManaThisRound = useStore((s) => s.pendingManaThisRound);
  const pendingManaNextRound = useStore((s) => s.pendingManaNextRound);
  const towerStatus = useStore((s) => s.towerStatus);
  const activeTowerEncounterId = useStore((s) => s.activeTowerEncounterId);
  const getCurrentTowerFloor = useStore((s) => s.getCurrentTowerFloor);
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

  // Derive UI phase - if events exist, we're 'executing' regardless of battle.phase
  // This is the KEY FIX: executeRound() returns planning phase, but we need executing while events drain
  const uiPhase: BattleUIPhase = events.length > 0 ? 'executing' : deriveUIPhase(battle?.phase);

  // Battle speed control
  const { speedPreset, applySpeed, cycleSpeed } = useBattleSpeed();

  // Selection State
  const [selectedAbilityId, setSelectedAbilityId] = useState<string | null | undefined>(undefined);
  const [menuMode, setMenuMode] = useState<ActionMenuMode>('root');

  // Post-battle State
  const [showCutscene, setShowCutscene] = useState(false);
  const [showVictoryOverlay, setShowVictoryOverlay] = useState(false);
  const [showDefeatOverlay, setShowDefeatOverlay] = useState(false);
  const [battleOutcome, setBattleOutcome] = useState<'victory' | 'defeat' | null>(null);
  const loadedFxRef = useRef<Set<string>>(new Set());
  const [floatingNumbers, setFloatingNumbers] = useState<
    { id: number; unitId: string; amount: number; kind: 'damage' | 'heal' }[]
  >([]);
  const floatingIdRef = useRef(0);
  const floatingTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const lastProcessedEventRef = useRef<BattleEvent | undefined>(undefined);
  const lastCritProcessedEventRef = useRef<BattleEvent | undefined>(undefined);
  const pendingDequeueEventRef = useRef<string | undefined>(undefined);

  // Reset per-battle transient state
  useEffect(() => {
    if (!battle) return;
    loadedFxRef.current.clear();
  }, [battle]);

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
    }
  }, [
    battle,
    battleOutcome,
    mode,
    lastBattleRewards,
    processVictory,
    towerStatus,
    activeTowerEncounterId,
    showCutscene,
    showVictoryOverlay,
  ]);

  const currentFx = useMemo(() => getEventGif(events[0]), [events]);

  // Reset floating numbers when battle changes and clear timers on unmount
  useEffect(() => {
    floatingTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    floatingTimeoutsRef.current.clear();
    setFloatingNumbers([]);
    lastProcessedEventRef.current = undefined;
    lastCritProcessedEventRef.current = undefined;

    return () => {
      floatingTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      floatingTimeoutsRef.current.clear();
    };
  }, [battle]);

  // Add separate effect for unmount cleanup
  useEffect(() => {
    return () => {
      // Cleanup floating numbers on unmount
      setFloatingNumbers([]);
    };
  }, []);

  // Spawn floating damage/heal numbers when events resolve
  useEffect(() => {
    if (!battle || uiPhase !== 'executing') return;
    const evt = events[0];
    if (!evt) return;
    if (evt === lastProcessedEventRef.current) return;
    lastProcessedEventRef.current = evt;

    if (evt.type === 'hit' || evt.type === 'heal') {
      const id = floatingIdRef.current + 1;
      floatingIdRef.current = id;
      const kind = evt.type === 'heal' ? 'heal' : 'damage';
      setFloatingNumbers((prev) => [...prev, { id, unitId: evt.targetId, amount: evt.amount, kind }]);
      const timeoutId = setTimeout(() => {
        setFloatingNumbers((prev) => prev.filter((n) => n.id !== id));
        floatingTimeoutsRef.current.delete(id);
      }, 1150);
      floatingTimeoutsRef.current.set(id, timeoutId);
    }
  }, [uiPhase, events, battle]);

  // Crit counter progression for basic attacks (during execution phase)
  // This ensures the counter only increments when the attack actually happens,
  // not during planning (prevents counter increment if unit is KO'd before their turn)
  const BASIC_ATTACK_IDS = ['strike', 'heavy-strike', 'guard-break', 'precise-jab'];
  useEffect(() => {
    if (!battle || uiPhase !== 'executing') return;
    const evt = events[0];
    if (!evt) return;
    if (evt === lastCritProcessedEventRef.current) return;
    lastCritProcessedEventRef.current = evt;

    // Only process 'ability' events for basic attacks from player units
    if (evt.type === 'ability' && BASIC_ATTACK_IDS.includes(evt.abilityId)) {
      const casterId = evt.casterId;
      // Only track crit counters for player units
      const isPlayerUnit = battle.playerTeam.units.some(u => u.id === casterId);
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

  // 4. Event Queue Processing - with stale closure protection
  useEffect(() => {
    if (!battle || uiPhase !== 'executing' || events.length === 0) {
      return;
    }

    const currentEvent = events[0]!; // Safe: we check events.length > 0 above
    const eventId = `${currentEvent.type}-${currentEvent.type === 'ability' ? currentEvent.casterId : currentEvent.type === 'turn-start' ? currentEvent.actorId : 'event'}-${Date.now()}`;
    pendingDequeueEventRef.current = eventId;

    const baseDelay = getEventTiming(currentEvent?.type ?? 'unknown', loadedFxRef.current.has(currentFx ?? ''));
    const delay = applySpeed(baseDelay);
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
  }, [uiPhase, events, dequeue, currentFx, battle, applySpeed]);

  // --- COMPUTED VALUES ---

  const currentUnit = useMemo<Unit | null>(() => {
    if (!battle) return null;
    if (activePortraitIndex === null || activePortraitIndex === undefined) return null;
    return battle.playerTeam.units[activePortraitIndex] ?? null;
  }, [battle, activePortraitIndex]);

  const totalQueuedMana = useMemo(() =>
    battle?.queuedActions.reduce((sum, a) => sum + (a?.manaCost || 0), 0) || 0
  , [battle?.queuedActions]);

  const isQueueComplete = useMemo(() => {
    if (!battle) return false;
    const aliveUnits = battle.playerTeam.units.filter(u => !isUnitKO(u));

    // Count queued actions by index, matching alive units
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
  const locationName = battle?.meta?.encounterId || battle?.encounterId || 'Story Battle';
  const currentEvent = events[0];
  const currentActorId =
    currentEvent?.type === 'ability' ? currentEvent.casterId :
    currentEvent?.type === 'hit' || currentEvent?.type === 'heal' || currentEvent?.type === 'status-applied' || currentEvent?.type === 'status-expired' ? undefined :
    currentEvent?.type === 'ko' ? currentEvent.unitId :
    undefined;
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

  // --- HANDLERS ---

  const handleDefeatResolution = () => {
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

    const isTowerBattle = towerStatus === 'in-run' && !!activeTowerEncounterId;
    if (isTowerBattle) return;
    if (battleOutcome !== 'victory') return;

    if (battle && !lastBattleRewards) {
      processVictory(battle);
    } else if (lastBattleRewards) {
      setMode('rewards');
    }
  };

  // const handleAbilityHover = (id: string | null) => {
  //   setHoveredAbilityId(id);
  // };

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
    void ability; // reserved for future metadata uses
    setMenuMode('root');
  };

  const handleTargetSelect = (targetId: string, abilityIdOverride?: string | null) => {
    if (!currentUnit || activePortraitIndex === null || !battle) return;

    const abilityIdToUse = abilityIdOverride ?? selectedAbilityId;
    const ability = abilityIdToUse ? currentUnit.abilities.find(a => a.id === abilityIdToUse) : undefined;

    // Resolve target list based on ability target type
    let targetIds: string[] = [targetId];
    const aliveEnemies = battle.enemies.filter((e) => !isUnitKO(e)).map((e) => e.id);
    const aliveAllies = battle.playerTeam.units.filter((u) => !isUnitKO(u)).map((u) => u.id);

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

    // Queue the action
    const queued = queueUnitAction(activePortraitIndex, abilityIdToUse ?? null, targetIds, ability);
    if (!queued) {
      return;
    }

    // NOTE: Crit counter progression moved to execution phase (see effect below)
    // This prevents incrementing the counter if the unit is KO'd before their turn

    // Reset selection for next
    setSelectedAbilityId(undefined);

    // Auto-advance to next unit by SPEED
    const order = getPlanningTurnOrder(battle);
    const currentOrderIdx = order.indexOf(activePortraitIndex);
    if (currentOrderIdx !== -1 && currentOrderIdx < order.length - 1) {
      const nextIndex = order[currentOrderIdx + 1];
      if (nextIndex !== undefined) {
        setActivePortrait(nextIndex);
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
    if (isQueueComplete && uiPhase === 'planning') executeQueuedRound();
  };

  // Button should only be enabled in planning phase with complete queue
  const canExecute = isQueueComplete && uiPhase === 'planning';

  // --- RENDER ---

  if (!battle) return <div>Loading Battle...</div>;

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
    // selectedAbilityId is null -> Basic Attack
    // selectedAbilityId is string -> Ability
    const ability = selectedAbilityId
      ? currentUnit.abilities.find(a => a.id === selectedAbilityId)
      : undefined; // undefined corresponds to 'Basic Attack' in getValidTargets if logic allows?
                   // Actually getValidTargets expects ability object or undefined for Basic Attack

    // Note: getValidTargets signature might need checking.
    // Assuming getValidTargets(ability | null/undefined, unit, team, enemies)
    // Checking import... getValidTargets(ability: Ability | null | undefined, ...)
    validTargets = getValidTargets(ability || null, currentUnit, battle.playerTeam, battle.enemies);
  }
  const validTargetIds = new Set(validTargets.map((t) => t.id));
  const isTargeting = selectedAbilityId !== undefined && validTargets.length > 0;

  // --- HELPERS FOR RENDERING ABILITY LIST ---
  // Helpers not required; rendering handled via BattleActionMenu.

  const isExecuting = uiPhase === 'executing';

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
        <style>
          {`
            @keyframes floatNumber {
              0% { opacity: 1; transform: translate(-50%, 0) scale(1); }
              60% { opacity: 1; transform: translate(-50%, -6px) scale(1.02); }
              100% { opacity: 0; transform: translate(-50%, -24px) scale(1.05); }
            }
          `}
        </style>
        {/* Battlefield Area */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
          }}
        >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(/sprites/backgrounds/gs1/Kolima_Forest.gif)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 70%',
            imageRendering: 'pixelated',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'absolute', top: 8, left: 8, zIndex: Z_INDEX.MODE_LABEL }}>
          <ModeLabel
            battleType={battleType}
            locationName={locationName}
            floorNumber={currentFloor?.floorNumber}
          />
        </div>

        {isExecuting && (
          <div
            style={{
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
            }}
          >
            ⚔️ Executing round...
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
              gap: 48,
              height: '100%',
              position: 'relative',
              zIndex: 1,
            }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: '42%',
              left: '8%',
              display: 'flex',
              gap: '3rem',
              zIndex: 10,
            }}
          >
            {battle.enemies.map((enemy) => {
              const isTargetCandidate = validTargetIds.has(enemy.id);
              const isResolvingTarget = highlightedTargets.has(enemy.id);
              const isActor = currentActorId === enemy.id;
              // Don't filter out KO'd units if they have ANY pending events related to them
              // This includes ability casts, hits, heals, status changes, and KO animations
              const hasPendingEvent = events.some(evt => {
                if (evt.type === 'ability' && evt.casterId === enemy.id) return true;
                if (evt.type === 'ability' && evt.targets.includes(enemy.id)) return true;
                if (evt.type === 'hit' && evt.targetId === enemy.id) return true;
                if (evt.type === 'heal' && evt.targetId === enemy.id) return true;
                if (evt.type === 'ko' && evt.unitId === enemy.id) return true;
                if (evt.type === 'status-applied' && evt.targetId === enemy.id) return true;
                if (evt.type === 'status-expired' && evt.targetId === enemy.id) return true;
                return false;
              });
              if (isUnitKO(enemy) && !hasPendingEvent) return null;
              const mappedSprite = getEnemyBattleSprite(enemy.id, 'idle');
              const nameBasedFallback = `/sprites/battle/enemies/${enemy.name.replace(/\s+/g, '')}.gif`;
              const spriteId = mappedSprite ?? nameBasedFallback;
              return (
                <div
                  key={enemy.id}
                  onClick={() => isTargetCandidate && handleTargetSelect(enemy.id)}
                  style={{
                    position: 'relative',
                    cursor: isTargetCandidate ? 'pointer' : 'default',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
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
                    }}
                  />
                  <div
                    style={{
                      position: 'relative',
                      transform: isActor ? 'scale(3.2)' : 'scale(3)',
                      zIndex: 1,
                      filter: isResolvingTarget
                      ? 'drop-shadow(0 0 14px rgba(255,216,127,0.9))'
                      : isTargetCandidate
                        ? 'drop-shadow(0 0 8px rgba(255,216,127,0.7))'
                        : 'none',
                    }}
                  >
                    <SimpleSprite
                      id={spriteId}
                      width={64}
                      height={64}
                      fallback={
                        <SimpleSprite
                          id="/sprites/battle/enemies/Goblin.gif"
                          width={64}
                          height={64}
                          imageRendering="pixelated"
                        />
                      }
                      imageRendering="pixelated"
                    />
                  </div>
                  {floatingNumbers
                    .filter((n) => n.unitId === enemy.id)
                    .map((num, idx) => {
                      const displayValue = Math.abs(num.amount);
                      return (
                        <div
                          key={num.id}
                          style={{
                            position: 'absolute',
                            bottom: `calc(100% + ${idx * 16 + 6}px)`,
                            left: '50%',
                            color: num.kind === 'heal' ? '#6df0a2' : '#ff6b6b',
                            fontWeight: 800,
                            textShadow: '0 0 6px rgba(0,0,0,0.8)',
                            animation: 'floatNumber 1.05s ease-out forwards',
                            pointerEvents: 'none',
                            zIndex: 12,
                          }}
                        >
                          {num.kind === 'heal' ? `+${displayValue}` : `-${displayValue}`}
                        </div>
                      );
                    })}
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: '0.8rem',
                      color: isTargetCandidate ? '#FFD87F' : '#aaa',
                    }}
                  >
                    {enemy.name}
                  </div>
                  {isTargetCandidate && (
                    <div style={{ color: '#FFD87F', fontSize: '0.75rem' }}>Click to target</div>
                  )}
                  {isResolvingTarget && (
                    <div
                      style={{
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
                      }}
                    >
                      ⯈
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '28%',
              right: '15%',
              width: 260,
              height: 160,
              zIndex: 10,
            }}
          >
            {battle.playerTeam.units.map((unit, index) => {
              // Don't filter out KO'd units if they have ANY pending events related to them
              // This includes ability casts, hits, heals, status changes, and KO animations
              const hasPendingEvent = events.some(evt => {
                if (evt.type === 'ability' && evt.casterId === unit.id) return true;
                if (evt.type === 'ability' && evt.targets.includes(unit.id)) return true;
                if (evt.type === 'hit' && evt.targetId === unit.id) return true;
                if (evt.type === 'heal' && evt.targetId === unit.id) return true;
                if (evt.type === 'ko' && evt.unitId === unit.id) return true;
                if (evt.type === 'status-applied' && evt.targetId === unit.id) return true;
                if (evt.type === 'status-expired' && evt.targetId === unit.id) return true;
                return false;
              });
              if (isUnitKO(unit) && !hasPendingEvent) return null;
              const isActor = currentActorId === unit.id;
              const isTarget = highlightedTargets.has(unit.id);
              return (
                <div
                  key={unit.id}
                  style={{
                    position: 'absolute',
                    left: index * 55,
                    bottom: index * 12,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
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
                    }}
                  />
                  <div
                    style={{
                      position: 'relative',
                      transform: isActor ? 'scale(2.7)' : 'scale(2.5)',
                      zIndex: 1,
                      filter: isTarget ? 'drop-shadow(0 0 12px rgba(255,216,127,0.8))' : 'none',
                    }}
                  >
                    <BattleUnitSprite unitId={unit.id} state="idle" size="large" />
                  </div>
                  {isTarget && (
                    <div
                      style={{
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
                      }}
                    >
                      ⯈
                    </div>
                  )}
                  {floatingNumbers
                    .filter((n) => n.unitId === unit.id)
                    .map((num, idx) => {
                      const displayValue = Math.abs(num.amount);
                      return (
                        <div
                          key={num.id}
                          style={{
                            position: 'absolute',
                            bottom: `calc(100% + ${idx * 16 + 6}px)`,
                            left: '50%',
                            color: num.kind === 'heal' ? '#6df0a2' : '#ff6b6b',
                            fontWeight: 800,
                            textShadow: '0 0 6px rgba(0,0,0,0.8)',
                            animation: 'floatNumber 1.05s ease-out forwards',
                            pointerEvents: 'none',
                            zIndex: 12,
                          }}
                        >
                          {num.kind === 'heal' ? `+${displayValue}` : `-${displayValue}`}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>

          {/* Djinn companions behind party */}
          <div
            style={{
              position: 'absolute',
              right: '6%',
              bottom: '34%',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              zIndex: 8,
            }}
          >
            {djinnSprites.map((djinn, idx) => (
              <div
                key={djinn.id}
                style={{
                  position: 'relative',
                left: idx % 2 === 0 ? 0 : 6,
              }}
            >
              <img
                src={djinn.path}
                alt={djinn.name}
                width={32}
                height={32}
                style={{ imageRendering: 'pixelated', transform: 'scale(2.5)' }}
              />
            </div>
          ))}
        </div>
        </div>

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

        {isExecuting && (
          <div
            style={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              width: 340,
              maxHeight: '45vh',
              overflow: 'auto',
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              padding: 8,
              zIndex: Z_INDEX.BATTLE_LOG,
            }}
          >
            <BattleLog events={events} renderText={renderEventText} />
          </div>
        )}
      </div>

      {/* Bottom UI simplified strip */}
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
        <BattlePortraitRow
          units={battle.playerTeam.units}
          activeIndex={activePortraitIndex}
          queuedActions={battle.queuedActions}
          critCounters={critCounters}
          critThresholds={critThresholds}
          critFlashes={critFlash}
          onSelect={(idx) => {
            const unit = battle.playerTeam.units[idx];
            if (isTargeting && unit && validTargetIds.has(unit.id)) {
              handleTargetSelect(unit.id);
              return;
            }
            if (uiPhase === 'planning') {
              setActivePortrait(idx);
              setSelectedAbilityId(undefined);
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
            battle={battle}
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

      {/* Execution overlay to show current resolving event */}
      {isExecuting && events.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.65)',
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid rgba(255, 215, 127, 0.4)',
            color: '#f9e0a8',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(0,0,0,0.45)',
            zIndex: Z_INDEX.RESOLVING_CARD,
            minWidth: 260,
            textAlign: 'center',
            transition: 'transform 0.2s ease, opacity 0.2s ease',
          }}
        >
          Resolving: {events[0] ? renderEventText(events[0]) : 'Loading...'}
        </div>
      )}

      {/* FX overlay for ability events only (hit/heal/status just show damage numbers) */}
      {isExecuting && events.length > 0 && events[0]?.type === 'ability' && (
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.25)',
            padding: '14px 18px',
            borderRadius: 12,
            border: '1px solid rgba(255, 215, 127, 0.45)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            zIndex: Z_INDEX.FX_CARD,
            minWidth: 420,
            justifyContent: 'center',
          }}
        >
          {(() => {
            const evt = events[0];
            if (!evt || evt.type !== 'ability') return null;
            const fx = getEventGif(evt);
            const abilityName = ABILITIES[evt.abilityId]?.name ?? evt.abilityId;

            // Find target names for display
            const targetNames = evt.targets.map(targetId => {
              const enemy = battle.enemies.find(e => e.id === targetId);
              const ally = battle.playerTeam.units.find(u => u.id === targetId);
              return enemy?.name || ally?.name || 'Unknown';
            }).join(', ');

            return (
              <>
                {fx && (
                  <img
                    src={fx}
                    width={180}
                    height={180}
                    style={{
                      borderRadius: 10,
                      imageRendering: 'pixelated',
                      objectFit: 'cover',
                      boxShadow: '0 0 24px rgba(255,255,255,0.65)',
                      mixBlendMode: 'screen',
                    }}
                    onLoad={() => loadedFxRef.current.add(fx)}
                    onError={() => {
                      loadedFxRef.current.add(FX_FALLBACK);
                    }}
                    alt="Ability effect"
                  />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontWeight: 800, color: '#ffd87f', fontSize: '1.05rem' }}>{abilityName}</div>
                  {targetNames && (
                    <div style={{ color: '#FFD87F', fontSize: '0.85rem', fontWeight: 600 }}>
                      Target: {targetNames}
                    </div>
                  )}
                  <div style={{ color: '#e0e0e0', fontSize: '0.95rem', maxWidth: 320 }}>
                    {renderEventText(evt)}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
      </div>
    </div>
  );
}
