import { FunctionComponent, JSX } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { shallow } from 'zustand/shallow';

import { useGameStore, ScreenType, ModalType, GameStore } from './store/gameStore';

import { TitleScreen } from './screens/TitleScreen';
import { OverworldMap } from './screens/OverworldMap';
import { QueueBattleView } from './screens/QueueBattleView';
import { MainMenu } from './screens/MainMenu';

import { PauseMenu } from './modals/PauseMenu';
import { DialogueBox } from './modals/DialogueBox';
import { InventoryModal } from './modals/InventoryModal';
import { SettingsModal } from './modals/SettingsModal';

import './index.css';

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
        return <InventoryModal />;
      case 'settings':
        return <SettingsModal />;
      case 'dialogue':
        return <DialogueBox />;
      case 'pause':
        return <PauseMenu />;
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
