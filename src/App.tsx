import { FunctionComponent, JSX } from 'preact';
import { useEffect } from 'preact/hooks';
import { shallow } from 'zustand/shallow';

import { useGameStore, ScreenType, GameStore } from './store/gameStore';

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
import { DIALOGUES } from '@/data/definitions/dialogues';
import { ENCOUNTER_TO_POST_BATTLE_DIALOGUE } from '@/data/definitions/postBattleDialogues';
import type { GameFlowSlice } from './ui/state/gameFlowSlice';
import { TransitionSpiral } from './ui/components/TransitionSpiral';
import { DevModeOverlay } from './ui/components/debug/DevModeOverlay';

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
    if (useStore.getState().mode === "battle") {
      startTransition("battle");
    } else {
      console.error("Failed to start battle - validation or creation error");
    }
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
    return (
      <div style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>No battle pending...</div>
        <button
          onClick={() => {
            if (towerEntryContext) {
              setMode('tower');
              startTransition('tower');
            } else {
              setMode('overworld');
              startTransition('overworld');
            }
          }}
          class="gs-button"
          style={{ margin: '0 auto' }}
        >
          Return
        </button>
      </div>
    );
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
    lastBattleEncounterId,
    startDialogueTree,
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
    lastBattleEncounterId: s.lastBattleEncounterId,
    startDialogueTree: s.startDialogueTree,
  }));
  const startTransition = useGameStore((s) => s.startTransition);

  useEffect(() => {
    if (lastBattleRewards && team) {
      return;
    }

    if (towerStatus === 'in-run' || towerStatus === 'completed') {
      setMode('tower');
      startTransition('tower');
      return;
    }

    returnToOverworld();
    startTransition('overworld');
  }, [lastBattleRewards, team, towerStatus, returnToOverworld, setMode, startTransition]);

  const handleRewardsContinue = () => {
    claimRewards();
    setBattle(null, 0);

    const encounterId = lastBattleEncounterId;

    if (encounterId) {
      const postId = ENCOUNTER_TO_POST_BATTLE_DIALOGUE[encounterId] ?? null;
      if (postId && DIALOGUES[postId]) {
        store.setState({ lastBattleEncounterId: null });
        startDialogueTree(DIALOGUES[postId]);
        return;
      }
      store.setState({ lastBattleEncounterId: null });
    }

    if (towerStatus === 'in-run' || towerStatus === 'completed') {
      setMode('tower');
      startTransition('tower');
    } else {
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
  const { currentShopId, shopEntryContext, exitShop, setMode } = useStore((s) => ({
    currentShopId: s.currentShopId,
    shopEntryContext: s.shopEntryContext,
    exitShop: s.exitShop,
    setMode: s.setMode,
  }));
  const startTransition = useGameStore((s) => s.startTransition);

  const handleClose = () => {
    const entryContext = shopEntryContext;
    exitShop();
    startTransition(entryContext === 'menu' ? 'menu' : 'overworld');
  };

  useEffect(() => {
    if (currentShopId) {
      return;
    }

    if (shopEntryContext === 'menu') {
      setMode('main-menu');
      startTransition('menu');
      return;
    }

    setMode('overworld');
    startTransition('overworld');
  }, [currentShopId, shopEntryContext, setMode, startTransition]);

  if (!currentShopId) {
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

function useStoreSync() {
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const isDialogueActive = useStore((s) => Boolean(s.currentDialogueState));
  const towerStatus = useStore((s) => s.towerStatus);
  const pendingBattleEncounterId = useStore((s) => s.pendingBattleEncounterId);
  const currentScreen: ScreenType = useGameStore((s) => s.flow.screen);
  const activeModal = useGameStore((s) => s.flow.modal);
  const isTransitioning = useGameStore((s) => s.flow.isTransitioning);
  const startTransition = useGameStore((s) => s.startTransition);
  const openModal = useGameStore((s) => s.openModal);
  const closeModal = useGameStore((s) => s.closeModal);

  useEffect(() => {
    if (isTransitioning) {
      return;
    }

    if (pendingBattleEncounterId && currentScreen !== 'team-select') {
      startTransition('team-select');
      return;
    }

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
        break;
      case 'djinn-collection':
        if (currentScreen !== 'djinn-collection') {
          startTransition('djinn-collection');
        }
        break;
      case 'credits':
        if (currentScreen !== 'credits') {
          startTransition('credits');
        }
        break;
      case 'epilogue':
        if (currentScreen !== 'epilogue') {
          startTransition('epilogue');
        }
        break;
      case 'overworld':
        if (currentScreen !== 'overworld') {
          startTransition('overworld');
        }
        break;
      case 'intro':
        if (currentScreen !== 'intro') {
          startTransition('intro');
        }
        break;
      case 'main-menu':
        if (currentScreen !== 'menu') {
          startTransition('menu');
        }
        break;
      case 'title-screen':
        if (currentScreen !== 'title') {
          startTransition('title');
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
  }, [mode, towerStatus, currentScreen, activeModal, isTransitioning, startTransition, openModal, closeModal]);

  useEffect(() => {
    if (isTransitioning) {
      return;
    }
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
      if (desiredMode === 'overworld' && mode === 'team-select' && pendingBattleEncounterId) {
        return;
      }
      setMode(desiredMode);
      return;
    }

    if (activeModal === 'dialogue' && mode !== 'dialogue') {
      if (isDialogueActive) {
        setMode('dialogue');
      } else {
        closeModal();
      }
    }
  }, [activeModal, currentScreen, isDialogueActive, isTransitioning, pendingBattleEncounterId, setMode, closeModal]);
}

const App: FunctionComponent = () => {
  useStoreSync();

  const setMode = useStore((s) => s.setMode);

  const { screen, modal, isTransitioning, startTransition, openModal, closeModal, closeCompendium } = useGameStore(
    (state: GameStore) => ({
      screen: state.flow.screen,
      modal: state.flow.modal,
      isTransitioning: state.flow.isTransitioning,
      startTransition: state.startTransition,
      openModal: state.openModal,
      closeModal: state.closeModal,
      closeCompendium: state.closeCompendium,
    }),
    shallow
  );
  const closeCompendiumFlow = useStore((state) => state.closeCompendium);


  const renderScreen = (): JSX.Element => {
    switch (screen) {
      case 'title': return <TitleScreen />;
      case 'intro': return <IntroScreen />;
      case 'overworld': return <OverworldMap />;
      case 'battle': return <QueueBattleView />;
      case 'menu': return <MainMenu />;
      case 'compendium': return <CompendiumScreen onClose={() => { closeCompendiumFlow(); closeCompendium(); }} />;
      case 'team-select': return <TeamSelectWrapper />;
      case 'rewards': return <RewardsWrapper />;
      case 'shop': return <ShopWrapper />;
      case 'team-management': return <PartyManagementScreen onClose={() => startTransition('overworld')} />;
      case 'djinn-collection': return <DjinnCollectionScreen onClose={() => startTransition('overworld')} />;
      case 'tower': return <TowerHubScreen />;
      case 'credits': return <CreditsScreen onExit={() => startTransition('epilogue')} />;
      case 'epilogue': return <EpilogueScreen onComplete={() => startTransition('title')} />;
      default: return <TitleScreen />;
    }
  };

  const renderModal = (): JSX.Element | null => {
    if (!modal) return null;
    switch (modal) {
      case 'inventory': return <InventoryModal onClose={closeModal} />;
      case 'settings': return <SettingsModal onClose={closeModal} />;
      case 'save': return <SaveMenu onClose={closeModal} />;
      case 'help': return <HowToPlay onClose={closeModal} />;
      case 'pause':
        return <PauseMenu
          onClose={closeModal}
          onTeamManagement={() => { setMode('team-management'); startTransition('team-management'); }}
          onInventory={() => openModal('inventory')}
          onDjinnCollection={() => { setMode('djinn-collection'); startTransition('djinn-collection'); }}
          onSaveGame={() => openModal('save')}
          onSettings={() => openModal('settings')}
          onHowToPlay={() => openModal('help')}
          onReturnToTitle={() => startTransition('title')}
        />;
      default: return null;
    }
  };



  return (
    <div className={`app-root${isTransitioning ? ' app-root--transitioning' : ''}`}>
      {renderScreen()}
      {renderModal()}
      <TransitionSpiral isVisible={isTransitioning && screen === 'battle'} />
      <DialogueChatOverlay />
      <DevModeOverlay />
    </div>
  );
};

export { App };
export default App;
