import { FunctionComponent, JSX } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { shallow } from 'zustand/shallow';

import { useGameStore, ScreenType, ModalType, GameStore } from './store/gameStore';

import { TitleScreen } from './screens/TitleScreen';
import { OverworldMap } from './screens/OverworldMap';
import { QueueBattleView } from './screens/QueueBattleView';
import { MainMenu } from './screens/MainMenu';
import { CompendiumScreen } from './screens/CompendiumScreen';
import { PreBattleTeamSelectScreenV2 } from './ui/components/PreBattleTeamSelectScreenV2';
import { RewardsScreen } from './ui/components/RewardsScreen';
import { ShopScreen } from './ui/components/ShopScreen';
import { TowerHubScreen } from './ui/components/TowerHubScreen';
import { useStore, store } from './ui/state/store';

// Wrapper that reads team-select props from V1 store
const TeamSelectWrapper: FunctionComponent = () => {
  const { pendingBattleEncounterId, confirmBattleTeam, returnToOverworld } = useStore((s) => ({
    pendingBattleEncounterId: s.pendingBattleEncounterId,
    confirmBattleTeam: s.confirmBattleTeam,
    returnToOverworld: s.returnToOverworld,
  }));
  const setScreen = useGameStore((s) => s.setScreen);

  const handleConfirm = () => {
    confirmBattleTeam();
    setScreen('battle');
  };

  const handleCancel = () => {
    returnToOverworld();
    setScreen('menu');
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
  const setScreen = useGameStore((s) => s.setScreen);

  const handleRewardsContinue = () => {
    claimRewards();
    setBattle(null, 0);

    // Clear the stored encounterId after using it (if needed in future)
    store.setState({ lastBattleEncounterId: null });

    // Check if we're in tower mode - if so, return to tower hub instead of overworld
    if (towerStatus === 'in-run' || towerStatus === 'completed') {
      setMode('tower');
      setScreen('tower');
    } else {
      // Return to overworld for normal battles
      returnToOverworld();
      setScreen('overworld');
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
  const setScreen = useGameStore((s) => s.setScreen);

  const handleClose = () => {
    returnToOverworld();
    setScreen('overworld');
  };

  if (!currentShopId) {
    // No shop ID, redirect to overworld
    return <div style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>No shop available...</div>;
  }

  return <ShopScreen shopId={currentShopId} onClose={handleClose} />;
};

import { PauseMenu } from './modals/PauseMenu';
import { DialogueBox } from './modals/DialogueBox';
import { InventoryModal } from './modals/InventoryModal';
import { SettingsModal } from './modals/SettingsModal';
import { SaveMenu } from './modals/SaveMenu';
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

  const { screen, modal, isTransitioning, setScreen, openModal, closeModal } = useGameStore(
    (state: GameStore) => ({
      screen: state.flow.screen,
      modal: state.flow.modal,
      isTransitioning: state.flow.isTransitioning,
      setScreen: state.setScreen,
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
          setScreen('title');
          break;
        case 'Digit2':
          setScreen('overworld');
          break;
        case 'Digit3':
          setScreen('battle');
          break;
        case 'Digit4':
          setScreen('menu');
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
        return <PartyManagementScreen onClose={() => setScreen('overworld')} />;
      case 'djinn-collection':
        return <DjinnCollectionScreen onClose={() => setScreen('overworld')} />;
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
      case 'dialogue':
        return <DialogueBox />;
      case 'save':
        return <SaveMenu onClose={closeModal} />;
      case 'help':
        return <HowToPlay onClose={closeModal} />;
      case 'pause':
        return <PauseMenu
          onClose={closeModal}
          onTeamManagement={() => {
            closeModal();
            setScreen('team-management');
          }}
          onInventory={() => {
            closeModal();
            openModal('inventory');
          }}
          onDjinnCollection={() => {
            closeModal();
            setScreen('djinn-collection');
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
            setScreen('title');
          }}
        />;
      default:
        return null;
    }
  };

  return (
    <div className={`app-root${isTransitioning ? ' app-root--transitioning' : ''}`}>
      {renderScreen()}
      {renderModal()}
      {isDevMode && <DevOverlay screen={screen} modal={modal} />}
    </div>
  );
};

export { App };
export default App;
