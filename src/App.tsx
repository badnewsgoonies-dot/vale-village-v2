import { FunctionComponent, JSX } from 'preact';
import { useState, useEffect } from 'preact/hooks';
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
import { useStore, store } from './ui/state/store';
import { ToolboxHelpers } from './ui/components/debug/ToolboxHelpers';

// Wrapper that reads team-select props from V1 store
const TeamSelectWrapper: FunctionComponent = () => {
  const { pendingBattleEncounterId, confirmBattleTeam, returnToOverworld } = useStore((s) => ({
    pendingBattleEncounterId: s.pendingBattleEncounterId,
    confirmBattleTeam: s.confirmBattleTeam,
    returnToOverworld: s.returnToOverworld,
  }));
  const startTransition = useGameStore((s) => s.startTransition);

  const handleConfirm = () => {
    confirmBattleTeam();
    startTransition('battle');
  };

  const handleCancel = () => {
    returnToOverworld();
    startTransition('menu');
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
  const { lastBattleRewards, team, claimRewards, selectEquipmentChoice, returnToOverworld, setBattle, towerStatus, setMode } = useStore((s) => ({
    lastBattleRewards: s.lastBattleRewards,
    team: s.team,
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
      onContinue={handleRewardsContinue}
      onSelectEquipment={selectEquipmentChoice}
    />
  );
};

// Wrapper that reads shop props from V1 store
const ShopWrapper: FunctionComponent = () => {
  const { currentShopId, returnToOverworld } = useStore((s) => ({
    currentShopId: s.currentShopId,
    returnToOverworld: s.returnToOverworld,
  }));
  const startTransition = useGameStore((s) => s.startTransition);

  const handleClose = () => {
    returnToOverworld();
    startTransition('overworld');
  };

  if (!currentShopId) {
    // No shop ID, redirect to overworld
    return <div style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>No shop available...</div>;
  }

  return <ShopScreen shopId={currentShopId} onClose={handleClose} />;
};

import { PauseMenu } from './modals/PauseMenu';
import { DialogueBoxV2 } from './ui/components/DialogueBoxV2';
import { InventoryModal } from './modals/InventoryModal';
import { SettingsModal } from './modals/SettingsModal';
import { SaveMenu } from './ui/components/SaveMenu';
import { HowToPlay } from './modals/HowToPlay';
import { PartyManagementScreen } from './ui/components/PartyManagementScreen';
import { DjinnCollectionScreen } from './ui/components/DjinnCollectionScreen';

import './index.css';

// Global sync: V1 store mode → V2 gameStore screen
// This ensures tower battles return to tower hub correctly
function useStoreSync() {
  const mode = useStore((s) => s.mode);
  const towerStatus = useStore((s) => s.towerStatus);
  const setScreen = useGameStore((s) => s.setScreen);

  useEffect(() => {
    // Only sync tower mode - other modes are handled by their respective components
    if (mode === 'tower' && (towerStatus === 'in-run' || towerStatus === 'completed' || towerStatus === 'idle')) {
      setScreen('tower');
    }
  }, [mode, towerStatus, setScreen]);
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

  const { screen, modal, isTransitioning, setScreen, startTransition, openModal, closeModal } = useGameStore(
    (state: GameStore) => ({
      screen: state.flow.screen,
      modal: state.flow.modal,
      isTransitioning: state.flow.isTransitioning,
      setScreen: state.setScreen,
      startTransition: state.startTransition,
      openModal: state.openModal,
      closeModal: state.closeModal,
    }),
    shallow
  );

  const setModal = (m: ModalType | null) => {
    if (m === null) {
      closeModal();
    } else {
      openModal(m);
    }
  };

  const [isDevMode, setIsDevMode] = useState<boolean>(false);

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
      case 'overworld':
        return <OverworldMap />;
      case 'battle':
        return <QueueBattleView />;
      case 'menu':
        return <MainMenu />;
      case 'compendium':
        return <CompendiumScreen />;
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
      // 'dialogue' case removed - DialogueBoxV2 is always rendered and self-manages visibility
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
      {/* DialogueBoxV2 always rendered - uses portal and self-manages visibility */}
      <DialogueBoxV2 />
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
