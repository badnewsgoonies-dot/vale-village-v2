/**
 * Debug Router
 * Parses URL hash routes to set up specific screen states for screenshots
 *
 * Usage: http://localhost:5173/#/debug/battle?phase=planning
 *
 * This enables the automated screenshot capture tool to navigate to any
 * screen state without manual gameplay.
 */

import { FunctionComponent, JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useGameStore } from '../store/gameStore';
import { useStore } from '../ui/state/store';

// Mock data imports
import { createUnit } from '../core/models/Unit';
import { createTeam } from '../core/models/Team';
import { ADEPT, WAR_MAGE, MYSTIC, RANGER } from '../data/definitions/units';
import { VictoryOverlay } from '../ui/components/VictoryOverlay';
import { DefeatOverlay } from '../ui/components/DefeatOverlay';

/**
 * Parse the current URL hash for debug routing
 * Format: #/debug/{route}?{params}
 */
function parseDebugHash(): { route: string; params: URLSearchParams } | null {
  const hash = window.location.hash;
  if (!hash.startsWith('#/debug/')) {
    return null;
  }

  const [pathPart, queryPart] = hash.slice(2).split('?'); // Remove '#/'
  const route = pathPart?.replace('debug/', '') || '';
  const params = new URLSearchParams(queryPart || '');

  return { route, params };
}

/**
 * Set up mock team for debug screens
 */
function setupMockTeam() {
  const store = useStore.getState();
  if (store.team && store.team.units.length > 0) return;

  const isaac = createUnit(ADEPT, 15, 0);
  const garet = createUnit(WAR_MAGE, 14, 1);
  const ivan = createUnit(MYSTIC, 13, 2);
  const mia = createUnit(RANGER, 14, 3);

  store.addUnitToRoster(isaac);
  store.addUnitToRoster(garet);
  store.addUnitToRoster(ivan);
  store.addUnitToRoster(mia);

  const team = createTeam([isaac, garet, ivan, mia]);
  store.setTeam(team);
}

/**
 * Set up mock battle state
 */
function setupMockBattle(params: URLSearchParams) {
  setupMockTeam();
  const store = useStore.getState();

  // Set up a pending battle
  const encounterId = params.get('encounter') || 'encounter_vale_01';
  store.setPendingBattle(encounterId);
}

/**
 * Debug overlay components for victory/defeat that don't auto-dismiss
 */
interface DebugVictoryOverlayProps {
  params: URLSearchParams;
}

const DebugVictoryOverlay: FunctionComponent<DebugVictoryOverlayProps> = ({ params }) => {
  const variant = (params.get('variant') || 'normal') as 'normal' | 'flawless' | 'boss';
  const showLevelup = params.get('levelup') === 'true';
  const showDrops = params.get('drops') === 'true';

  setupMockTeam();
  const team = useStore((s) => s.team);

  const levelUps = showLevelup ? [
    { unitId: 'adept', unitName: 'Isaac', oldLevel: 15, newLevel: 16, newAbilitiesUnlocked: ['Ragnarok'] }
  ] : undefined;

  const drops = showDrops ? [
    { id: 'mythril_sword', name: 'Mythril Sword' },
    { id: 'lucky_medal', name: 'Lucky Medal' },
  ] : undefined;

  // Cast to work around readonly
  const partyUnits = team?.units ? [...team.units] : undefined;

  return (
    <VictoryOverlay
      onComplete={() => {}} // No-op for debug
      duration={999999} // Don't auto-dismiss
      variant={variant}
      party={partyUnits}
      levelUps={levelUps as any}
      drops={drops as any}
    />
  );
};

const DebugDefeatOverlay: FunctionComponent = () => {
  return (
    <DefeatOverlay
      onComplete={() => {}}
      duration={999999}
    />
  );
};

/**
 * Main debug router component
 * Renders nothing but sets up state based on URL
 */
export function DebugRouter(): JSX.Element | null {
  const [debugRoute, setDebugRoute] = useState<{ route: string; params: URLSearchParams } | null>(null);
  const [overlayComponent, setOverlayComponent] = useState<FunctionComponent | null>(null);
  const [overlayParams, setOverlayParams] = useState<URLSearchParams | null>(null);

  const setScreen = useGameStore((s) => s.setScreen);
  const openModal = useGameStore((s) => s.openModal);

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseDebugHash();
      setDebugRoute(parsed);
    };

    // Initial parse
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!debugRoute) return;

    const { route, params } = debugRoute;

    // Route handlers
    const routeHandlers: Record<string, () => void> = {
      // Main menu routes
      'title': () => setScreen('title'),
      'menu': () => {
        if (params.get('hasSave') === 'true') {
          // Mock a save slot
          localStorage.setItem('vale-save-0', JSON.stringify({ timestamp: Date.now() }));
        }
        setScreen('menu');
      },

      // Settings
      'settings': () => {
        setupMockTeam();
        setScreen('overworld');
        setTimeout(() => openModal('settings'), 100);
      },

      // Overworld
      'overworld': () => {
        setupMockTeam();
        setScreen('overworld');
      },

      // Battle
      'battle': () => {
        setupMockBattle(params);
        setScreen('battle');
      },

      // Victory/Defeat overlays (special handling)
      'victory': () => {
        setOverlayParams(params);
        setOverlayComponent(() => DebugVictoryOverlay);
      },
      'defeat': () => {
        setOverlayComponent(() => DebugDefeatOverlay);
      },

      // Rewards
      'rewards': () => {
        setupMockTeam();
        setScreen('rewards');
      },

      // Pause menu and modals
      'pause': () => {
        setupMockTeam();
        setScreen('overworld');
        setTimeout(() => openModal('pause'), 100);
      },
      'save': () => {
        setupMockTeam();
        setScreen('overworld');
        setTimeout(() => openModal('save'), 100);
      },
      'help': () => {
        setupMockTeam();
        setScreen('overworld');
        setTimeout(() => openModal('help'), 100);
      },
      'inventory': () => {
        setupMockTeam();
        setScreen('overworld');
        setTimeout(() => openModal('inventory'), 100);
      },

      // Shops
      'shop': () => {
        setupMockTeam();
        setScreen('shop');
      },

      // Compendium
      'compendium': () => {
        setupMockTeam();
        setScreen('compendium');
      },

      // Dialogue
      'dialogue': () => {
        setupMockTeam();
        setScreen('overworld');
        setTimeout(() => openModal('dialogue'), 100);
      },

      // Team select
      'team-select': () => {
        setupMockTeam();
        const store = useStore.getState();
        store.setPendingBattle('encounter_vale_01');
        setScreen('team-select');
      },

      // Djinn screens
      'djinn-collection': () => {
        setupMockTeam();
        setScreen('djinn-collection');
      },
      'djinn-detail': () => {
        setupMockTeam();
        setScreen('djinn-collection');
      },
      'djinn-equip': () => {
        setupMockTeam();
        setScreen('team-management');
      },

      // Party management
      'party': () => {
        setupMockTeam();
        setScreen('team-management');
      },

      // Tower
      'tower': () => {
        setupMockTeam();
        setScreen('tower');
      },

      // Credits/Epilogue
      'credits': () => setScreen('credits'),
      'epilogue': () => setScreen('epilogue'),

      // Error state (intentional error for screenshot)
      'error': () => {
        throw new Error('Debug error for screenshot capture');
      },

      // Loading state
      'loading': () => {
        setScreen('title');
      },
    };

    const handler = routeHandlers[route];
    if (handler) {
      handler();
    } else {
      console.warn(`Unknown debug route: ${route}`);
    }
  }, [debugRoute, setScreen, openModal]);

  // Render overlay if one is set
  if (overlayComponent) {
    const OverlayComponent = overlayComponent;
    if (OverlayComponent === DebugVictoryOverlay && overlayParams) {
      return <DebugVictoryOverlay params={overlayParams} />;
    }
    return <OverlayComponent />;
  }

  return null;
}

/**
 * Check if we're in debug routing mode
 */
export function isDebugRouting(): boolean {
  return window.location.hash.startsWith('#/debug/');
}
