import type { GameStore, ModalType } from '@/store/gameStore';
import { useGameStore } from '@/store/gameStore';
import type {
  InputEnabledHandler,
  InputLockHandle,
  InputLockSceneKey,
  RegisterSceneOptions,
} from '@/input/InputLock';
import { inputLock } from '@/input/InputLock';
import { settingsHowToPlayRouter } from '@/game/menus/MenuStackRouter';

type PauseMenuModal = Extract<ModalType, 'pause'>;
type RoutedModal = Extract<ModalType, 'settings' | 'help'>;

const isRoutedModal = (modal: ModalType | null): modal is RoutedModal =>
  modal === 'settings' || modal === 'help';

const isPauseDomainModal = (modal: ModalType | null): modal is PauseMenuModal | RoutedModal =>
  modal === 'pause' || isRoutedModal(modal);

type InputConfig = Readonly<{
  sceneKey: InputLockSceneKey;
  register: RegisterSceneOptions;
}>;

/**
 * PauseMenuController
 *
 * Coordinates Pause -> Settings/How-To-Play navigation via MenuStackRouter while ensuring
 * scene input is locked for the entire "pause domain" and reliably re-enabled when exiting.
 *
 * Intended usage:
 * - Call `pauseMenuController.configureInputLock(...)` once per scene (optional but recommended).
 * - Use `pauseMenuController.openSettings()` / `.openHowToPlay()` from the pause UI.
 * - Wire Settings/Help close handlers to `pauseMenuController.closeActive()` to avoid input "flash".
 * - Use `pauseMenuController.resume()` to exit all menus and re-enable input.
 */
export class PauseMenuController {
  private inputConfig: InputConfig | null = null;
  private pauseLockHandle: InputLockHandle | null = null;
  private unsubscribe: (() => void) | null = null;

  configureInputLock(
    sceneKey: InputLockSceneKey,
    setInputEnabled: InputEnabledHandler,
    options?: Omit<RegisterSceneOptions, 'setInputEnabled'>,
  ): void {
    if (this.inputConfig && this.inputConfig.sceneKey !== sceneKey) {
      this.releasePauseLock();
    }

    this.inputConfig = {
      sceneKey,
      register: {
        setInputEnabled,
        lifecycle: options?.lifecycle,
        cleanupEvents: options?.cleanupEvents,
      },
    };

    inputLock.registerScene(sceneKey, this.inputConfig.register);
    settingsHowToPlayRouter.configureInputLock(sceneKey, setInputEnabled, options);
  }

  open(): void {
    const state = useGameStore.getState();
    if (state.flow.isTransitioning) return;
    if (state.flow.modal === 'pause') return;

    this.ensureSubscribed();
    this.ensurePauseLocked();
    state.openModal('pause');
  }

  toggle(): void {
    const modal = useGameStore.getState().flow.modal;
    if (modal === 'pause') {
      this.resume();
      return;
    }
    this.open();
  }

  openSettings(): void {
    this.ensureSubscribed();
    this.ensurePauseLocked();
    settingsHowToPlayRouter.openSettings();
  }

  openHowToPlay(): void {
    this.ensureSubscribed();
    this.ensurePauseLocked();
    settingsHowToPlayRouter.openHowToPlay();
  }

  /**
   * Close handler intended for Settings/How-To-Play "Close" / "Back" buttons.
   * Uses MenuStackRouter to avoid dropping to `modal: null` in between screens.
   */
  closeRouted(): void {
    settingsHowToPlayRouter.close();
    this.maybeReleasePauseLock();
  }

  /**
   * Closes whichever pause-domain modal is currently active.
   * - Settings/Help: routes back to Pause when possible
   * - Pause: resumes gameplay
   */
  closeActive(): void {
    const modal = useGameStore.getState().flow.modal;
    if (isRoutedModal(modal)) {
      this.closeRouted();
      return;
    }
    if (modal === 'pause') {
      this.resume();
      return;
    }
  }

  /**
   * Exits all pause-domain menus and re-enables scene input.
   */
  resume(): void {
    settingsHowToPlayRouter.closeAll();

    const state = useGameStore.getState();
    const modal = state.flow.modal;
    if (isPauseDomainModal(modal)) {
      state.closeModal();
    }

    this.maybeReleasePauseLock(true);
  }

  destroy(): void {
    this.releasePauseLock();
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  private ensureSubscribed(): void {
    if (this.unsubscribe) return;

    this.unsubscribe = useGameStore.subscribe((next: GameStore, prev?: GameStore) => {
      if (!this.pauseLockHandle) return;

      const modal = next.flow.modal;
      const prevModal = prev?.flow.modal ?? null;

      // If we briefly hit `modal: null` while a MenuStackRouter return stack exists,
      // keep the pause lock until routing completes.
      if (modal === null && settingsHowToPlayRouter.getDepth() > 0) {
        return;
      }

      // Release the pause lock when exiting all menus (i.e. back to gameplay).
      if (prevModal !== null && modal === null) {
        this.maybeReleasePauseLock(true);
      }
    });
  }

  private ensurePauseLocked(): void {
    if (this.pauseLockHandle) return;
    if (!this.inputConfig) return;

    inputLock.registerScene(this.inputConfig.sceneKey, this.inputConfig.register);
    this.pauseLockHandle = inputLock.lock(this.inputConfig.sceneKey);
  }

  private maybeReleasePauseLock(force?: boolean): void {
    if (!this.pauseLockHandle) return;

    const modal = useGameStore.getState().flow.modal;
    if (!force && modal !== null) return;
    if (settingsHowToPlayRouter.getDepth() > 0) return;

    this.releasePauseLock();
  }

  private releasePauseLock(): void {
    if (!this.pauseLockHandle) return;
    const handle = this.pauseLockHandle;
    this.pauseLockHandle = null;
    handle.release();
  }
}

export const pauseMenuController = new PauseMenuController();