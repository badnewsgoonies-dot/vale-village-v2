import { FunctionComponent, JSX } from 'preact';
import { useState, useEffect, useMemo } from 'preact/hooks';
import { shallow } from 'zustand/shallow';

import { useGameStore, ScreenType, ModalType, GameStore } from './store/gameStore';

import { TitleScreen } from './screens/TitleScreen';
import { OverworldMap } from './screens/OverworldMap';
import { QueueBattleView } from './screens/QueueBattleView';
import { MainMenu } from './screens/MainMenu';
import { CompendiumScreen } from './ui/components/CompendiumScreen';
import { PreBattleTeamSelectScreenV2 } from './ui/components/PreBattleTeamSelectScreenV2';
import { RewardsScreen } from './ui/components/RewardsScreen';
import { ShopScreen } from './ui/components/ShopScreen';
import { TowerHubScreen } from './ui/components/TowerHubScreen';
import { IntroScreen } from './ui/components/IntroScreen';
import { useStore, store } from './ui/state/store';
import type { GameFlowSlice } from './ui/state/gameFlowSlice';
import { ToolboxHelpers } from './ui/components/debug/ToolboxHelpers';

// Wrapper that reads team-select props from V1 store
const TeamSelectWrapper: FunctionComponent = () => {
  const { pendingBattleEncounterId, confirmBattleTeam, setPendingBattle, setMode, towerEntryContext } = useStore((s) => ({
    pendingBattleEncounterId: s.pendingBattleEncounterId,
    confirmBattleTeam: s.confirmBattleTeam,
    setPendingBattle: s.setPendingBattle,
    setMode: s.setMode,
    towerEntryContext: s.towerEntryContext,
  }));
  const startTransition = useGameStore((s) => s.startTransition);

  const handleConfirm = () => {
    confirmBattleTeam();
    startTransition('battle');
  };

  const handleCancel = () => {
    setPendingBattle(null);
    if (towerEntryContext) {
      setMode('tower');
      startTransition('tower');
    } else {
      startTransition('overworld');
    }
  };

  if (!pendingBattleEncounterId) {
    // No pending battle, show loading or redirect
    return <div style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>No battle pending...</div>;
  }

  return (
    <PreBattleTeamSelectScreenV2
      encounterId={pendingBattleEncounterId}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
};

// Wrapper that reads rewards props from V1 store
const RewardsWrapper: FunctionComponent = () => {
  const {
    lastBattleRewards,
    team,
    lastBattleNewDjinnIds,
    lastBattleBonusEquipment,
    lastBattleBonusRecruits,
    claimRewards,
    selectEquipmentChoice,
    returnToOverworld,
    setBattle,
    towerStatus,
    setMode,
  } = useStore((s) => ({
    lastBattleRewards: s.lastBattleRewards,
    team: s.team,
    lastBattleNewDjinnIds: s.lastBattleNewDjinnIds,
    lastBattleBonusEquipment: s.lastBattleBonusEquipment,
    lastBattleBonusRecruits: s.lastBattleBonusRecruits,
    claimRewards: s.claimRewards,
    selectEquipmentChoice: s.selectEquipmentChoice,
    returnToOverworld: s.returnToOverworld,
    setBattle: s.setBattle,
    towerStatus: s.towerStatus,
    setMode: s.setMode,
  }));
  const startTransition = useGameStore((s) => s.startTransition);

  const handleRewardsContinue = () => {
    claimRewards();
    setBattle(null, 0);

    // Clear the stored encounterId after using it (if needed in future)
    store.setState({ lastBattleEncounterId: null });

    // Check if we're in tower mode - if so, return to tower hub instead of overworld
    if (towerStatus === 'in-run' || towerStatus === 'completed') {
      setMode('tower');
      startTransition('tower');
    } else {
      // Return to overworld for normal battles
      returnToOverworld();
      startTransition('overworld');
    }
  };

  if (!lastBattleRewards || !team) {
    return <div style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>No rewards available...</div>;
  }

  return (
    <RewardsScreen
      rewards={lastBattleRewards}
      team={team}
      newDjinnIds={lastBattleNewDjinnIds}
      bonusEquipment={lastBattleBonusEquipment}
      bonusRecruits={lastBattleBonusRecruits}
      onContinue={handleRewardsContinue}
      onSelectEquipment={selectEquipmentChoice}
    />
  );
};

// Wrapper that reads shop props from V1 store
const ShopWrapper: FunctionComponent = () => {
  const { currentShopId, shopEntryContext, exitShop } = useStore((s) => ({
    currentShopId: s.currentShopId,
    shopEntryContext: s.shopEntryContext,
    exitShop: s.exitShop,
  }));
  const startTransition = useGameStore((s) => s.startTransition);

  const handleClose = () => {
    const entryContext = shopEntryContext;
    exitShop();
    startTransition(entryContext === 'menu' ? 'menu' : 'overworld');
  };

  if (!currentShopId) {
    // No shop ID, redirect to overworld
    return <div style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>No shop available...</div>;
  }

  return <ShopScreen shopId={currentShopId} onClose={handleClose} />;
};

import { PauseMenu } from './modals/PauseMenu';
import { DialogueChatOverlay } from './ui/components/DialogueChatOverlay';
import { InventoryModal } from './modals/InventoryModal';
import { SettingsModal } from './modals/SettingsModal';
import { SaveMenu } from './ui/components/SaveMenu';
import { HowToPlay } from './modals/HowToPlay';
import { PartyManagementScreen } from './ui/components/PartyManagementScreen';
import { DjinnCollectionScreen } from './ui/components/DjinnCollectionScreen';
import { CreditsScreen } from './ui/components/CreditsScreen';
import { EpilogueScreen } from './ui/components/EpilogueScreen';

import './index.css';

// Global sync: V1 store mode → V2 gameStore screen
// This ensures tower battles return to tower hub correctly
function useStoreSync() {
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const towerStatus = useStore((s) => s.towerStatus);
  const currentScreen: ScreenType = useGameStore((s) => s.flow.screen);
  const activeModal = useGameStore((s) => s.flow.modal);
  const startTransition = useGameStore((s) => s.startTransition);
  const openModal = useGameStore((s) => s.openModal);
  const closeModal = useGameStore((s) => s.closeModal);

  useEffect(() => {
    switch (mode) {
      case 'tower':
        if (
          (towerStatus === 'in-run' || towerStatus === 'completed' || towerStatus === 'idle') &&
          currentScreen !== 'tower'
        ) {
          startTransition('tower');
        }
        break;
      case 'team-select':
        if (currentScreen !== 'team-select') {
          startTransition('team-select');
        }
        break;
      case 'battle':
        if (currentScreen !== 'battle') {
          startTransition('battle');
        }
        break;
      case 'rewards':
        if (currentScreen !== 'rewards') {
          startTransition('rewards');
        }
        break;
      case 'shop':
        if (currentScreen !== 'shop') {
          startTransition('shop');
        }
        break;
      case 'compendium':
        if (currentScreen !== 'compendium') {
          startTransition('compendium');
        }
        break;
      case 'team-management':
        if (currentScreen !== 'team-management') {
          startTransition('team-management');
        }
        if (activeModal) {
          closeModal();
        }
        break;
      case 'djinn-collection':
        if (currentScreen !== 'djinn-collection') {
          startTransition('djinn-collection');
        }
        if (activeModal) {
          closeModal();
        }
        break;
      case 'credits':
        if (currentScreen !== 'credits') {
          startTransition('credits');
        }
        if (activeModal) {
          closeModal();
        }
        break;
      case 'epilogue':
        if (currentScreen !== 'epilogue') {
          startTransition('epilogue');
        }
        if (activeModal) {
          closeModal();
        }
        break;
      case 'overworld':
        if (currentScreen !== 'overworld') {
          startTransition('overworld');
        }
        if (activeModal) {
          closeModal();
        }
        break;
      case 'intro':
        if (currentScreen !== 'intro') {
          startTransition('intro');
        }
        if (activeModal) {
          closeModal();
        }
        break;
      case 'main-menu':
        if (currentScreen !== 'menu') {
          startTransition('menu');
        }
        if (activeModal) {
          closeModal();
        }
        break;
      case 'title-screen':
        if (currentScreen !== 'title') {
          startTransition('title');
        }
        if (activeModal) {
          closeModal();
        }
        break;
      case 'dialogue':
        if (activeModal !== 'dialogue') {
          openModal('dialogue');
        }
        break;
      default:
        break;
    }
  }, [mode, towerStatus, currentScreen, activeModal, startTransition, openModal, closeModal]);

  // Keep the legacy V1 store's mode aligned when navigation is driven by the new gameStore.
  useEffect(() => {
    const screenToMode: Partial<Record<ScreenType, GameFlowSlice['mode']>> = {
      title: 'title-screen',
      menu: 'main-menu',
      intro: 'intro',
      overworld: 'overworld',
      battle: 'battle',
      rewards: 'rewards',
      shop: 'shop',
      'team-select': 'team-select',
      compendium: 'compendium',
      tower: 'tower',
      'team-management': 'team-management',
      'djinn-collection': 'djinn-collection',
      credits: 'credits',
      epilogue: 'epilogue',
    };

    const desiredMode = screenToMode[currentScreen];
    if (desiredMode && desiredMode !== mode) {
      setMode(desiredMode);
      return;
    }

    if (activeModal === 'dialogue' && mode !== 'dialogue') {
      setMode('dialogue');
    }
  }, [activeModal, currentScreen, mode, setMode]);
}

type DevOverlayProps = {
  screen: ScreenType;
  modal: ModalType | null;
};

const DevOverlay: FunctionComponent<DevOverlayProps> = ({ screen, modal }) => (
  <div className="dev-overlay">
    <div className="dev-overlay__panel">
      <div className="dev-overlay__header">Dev Mode</div>
      <div className="dev-overlay__row">
        <span>Screen: {screen}</span>
        <span>Modal: {modal ?? 'none'}</span>
      </div>
      <div className="dev-overlay__row">
        <span>F1</span>
        <span>Toggle dev overlay</span>
      </div>
      <div className="dev-overlay__row">
        <span>1 / 2 / 3 / 4</span>
        <span>title / overworld / battle / menu</span>
      </div>
      <div className="dev-overlay__row">
        <span>I / O / P / D</span>
        <span>inventory / settings / pause / dialogue modal</span>
      </div>
      <div className="dev-overlay__row">
        <span>Esc</span>
        <span>Close active modal</span>
      </div>
    </div>
  </div>
);

const App: FunctionComponent = () => {
  // Sync V1 store mode to V2 gameStore screen
  useStoreSync();

  const { showCredits, setShowCredits, mode, setMode } = useStore((s) => ({
    showCredits: s.showCredits,
    setShowCredits: s.setShowCredits,
    mode: s.mode,
    setMode: s.setMode,
  }));
  const { screen, modal, isTransitioning, setScreen, startTransition, openModal, closeModal, closeCompendium } = useGameStore(
    (state: GameStore) => ({
      screen: state.flow.screen,
      modal: state.flow.modal,
      isTransitioning: state.flow.isTransitioning,
      setScreen: state.setScreen,
      startTransition: state.startTransition,
      openModal: state.openModal,
      closeModal: state.closeModal,
      closeCompendium: state.closeCompendium,
    }),
    shallow
  );
  const closeCompendiumFlow = useStore((state) => state.closeCompendium);

  const setModal = (m: ModalType | null) => {
    if (m === null) {
      closeModal();
    } else {
      openModal(m);
    }
  };

  const [isDevMode, setIsDevMode] = useState<boolean>(false);
  const modeMapping = useMemo<Partial<Record<ScreenType, GameFlowSlice['mode']>>>(() => ({
    title: 'title-screen',
    intro: 'intro',
    overworld: 'overworld',
    battle: 'battle',
    menu: 'main-menu',
    compendium: 'compendium',
    'team-select': 'team-select',
    rewards: 'rewards',
    shop: 'shop',
    tower: 'tower',
    'team-management': 'team-management',
    'djinn-collection': 'djinn-collection',
    credits: 'credits',
    epilogue: 'epilogue',
  }), []);

  useEffect(() => {
    if (!showCredits) {
      return;
    }
    setShowCredits(false);
    startTransition('credits');
  }, [showCredits, setShowCredits, startTransition]);

  useEffect(() => {
    const mappedMode = modeMapping[screen];
    if (!mappedMode) {
      return;
    }

    if (mappedMode !== mode) {
      setMode(mappedMode);
    }
  }, [screen, mode, setMode, modeMapping]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'F1') {
        event.preventDefault();
        setIsDevMode((value) => !value);
        return;
      }

      if (!isDevMode) {
        return;
      }

      switch (event.code) {
        case 'Digit1':
          startTransition('title');
          break;
        case 'Digit2':
          startTransition('overworld');
          break;
        case 'Digit3':
          startTransition('battle');
          break;
        case 'Digit4':
          startTransition('menu');
          break;
        case 'KeyI':
          setModal('inventory');
          break;
        case 'KeyO':
          setModal('settings');
          break;
        case 'KeyP':
          setModal('pause');
          break;
        case 'KeyD':
          setModal('dialogue');
          break;
        case 'Escape':
          setModal(null);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDevMode, setScreen, setModal]);

  const renderScreen = (): JSX.Element => {
    switch (screen) {
      case 'title':
        return <TitleScreen />;
      case 'intro':
        return <IntroScreen />;
      case 'overworld':
        return <OverworldMap />;
      case 'battle':
        return <QueueBattleView />;
      case 'menu':
        return <MainMenu />;
      case 'compendium':
        return (
          <CompendiumScreen
            onClose={() => {
              closeCompendiumFlow();
              closeCompendium();
            }}
          />
        );
      case 'team-select':
        return <TeamSelectWrapper />;
      case 'rewards':
        return <RewardsWrapper />;
      case 'shop':
        return <ShopWrapper />;
      case 'team-management':
        return <PartyManagementScreen onClose={() => startTransition('overworld')} />;
      case 'djinn-collection':
        return <DjinnCollectionScreen onClose={() => startTransition('overworld')} />;
      case 'tower':
        return <TowerHubScreen />;
      case 'credits':
        return <CreditsScreen onExit={() => startTransition('epilogue')} />;
      case 'epilogue':
        return <EpilogueScreen onComplete={() => startTransition('title')} />;
      default:
        return <TitleScreen />;
    }
  };

  const renderModal = (): JSX.Element | null => {
    if (!modal) {
      return null;
    }

    switch (modal) {
      case 'inventory':
        return <InventoryModal onClose={closeModal} />;
      case 'settings':
        return <SettingsModal onClose={closeModal} />;
      // 'dialogue' case removed - dialogue is rendered via DialogueChatOverlay (portal) and self-manages visibility
      case 'save':
        return <SaveMenu onClose={closeModal} />;
      case 'help':
        return <HowToPlay onClose={closeModal} />;
      case 'pause':
        return <PauseMenu
          onClose={closeModal}
          onTeamManagement={() => {
            closeModal();
            startTransition('team-management');
          }}
          onInventory={() => {
            closeModal();
            openModal('inventory');
          }}
          onDjinnCollection={() => {
            closeModal();
            startTransition('djinn-collection');
          }}
          onSaveGame={() => {
            closeModal();
            openModal('save');
          }}
          onSettings={() => {
            closeModal();
            openModal('settings');
          }}
          onHowToPlay={() => {
            closeModal();
            openModal('help');
          }}
          onReturnToTitle={() => {
            closeModal();
            startTransition('title');
          }}
        />;
      default:
        return null;
    }
  };

  const toolboxActions = [
    {
      id: 'toggle-dev',
      label: isDevMode ? 'Hide Dev Overlay' : 'Show Dev Overlay',
      tooltip: 'Alt+T also toggles the toolbox; Ctrl+D still toggles dev overlay',
      onClick: () => setIsDevMode((prev) => !prev),
    },
    {
      id: 'open-settings',
      label: 'Settings',
      tooltip: 'Open settings modal',
      onClick: () => openModal('settings'),
    },
    {
      id: 'open-help',
      label: 'How to Play',
      tooltip: 'Open how-to-play modal',
      onClick: () => openModal('help'),
    },
    {
      id: 'return-title',
      label: 'Return to Title',
      tooltip: 'Jump back to title screen',
      onClick: () => startTransition('title'),
    },
  ];

  return (
    <div className={`app-root${isTransitioning ? ' app-root--transitioning' : ''}`}>
      {renderScreen()}
      {renderModal()}
      {/* DialogueChatOverlay always rendered - uses portal and self-manages visibility */}
      <DialogueChatOverlay />
      <ToolboxHelpers
        title="Toolbox"
        actions={toolboxActions}
        position="top-right"
        initiallyOpen={false}
      />
      {isDevMode && <DevOverlay screen={screen} modal={modal} />}
    </div>
  );
};

export { App };
export default App;
