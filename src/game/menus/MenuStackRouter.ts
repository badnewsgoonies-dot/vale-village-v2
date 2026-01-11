import type { GameStore, ModalType } from '@/store/gameStore';
import { useGameStore } from '@/store/gameStore';
import type {
  InputEnabledHandler,
  InputLockHandle,
  InputLockSceneKey,
  RegisterSceneOptions,
} from '@/input/InputLock';
import { inputLock } from '@/input/InputLock';

type ModalSnapshot = Readonly<{
  modal: ModalType | null;
}>;

type StackEntry = Readonly<{
  returnModal: ModalType | null;
}>;

type InputConfig = Readonly<{
  sceneKey: InputLockSceneKey;
  register: RegisterSceneOptions;
}>;

export type MenuStackRouterOptions = Readonly<{
  /**
   * Modals this router manages as a "stack domain".
   * When one of these modals closes, the router may restore the previous modal from its stack.
   *
   * Defaults to `['settings', 'help']` to fix Settings/How-To-Play navigation.
   */
  routedModals?: readonly ModalType[];
}>;

const DEFAULT_ROUTED_MODALS: readonly ModalType[] = ['settings', 'help'];

/**
 * MenuStackRouter
 *
 * A minimal modal stack router intended for Settings/How-To-Play (and similar) navigation:
 * - `open(modal)` pushes the current modal and replaces it in a single write (no "flash")
 * - `close()` / `closeToPrevious()` pops the stack and restores the correct return modal
 * - Subscribes to external closes to prevent soft-locks / lost return targets
 * - Optional InputLock integration for scene-level input gating
 */
export class MenuStackRouter {
  private readonly routedModalSet: ReadonlySet<ModalType>;
  private stack: StackEntry[] = [];
  private unsubscribe: (() => void) | null = null;
  private inputConfig: InputConfig | null = null;
  private lockHandle: InputLockHandle | null = null;

  constructor(options: MenuStackRouterOptions = {}) {
    this.routedModalSet = new Set(options.routedModals ?? DEFAULT_ROUTED_MODALS);
  }

  configureInputLock(
    sceneKey: InputLockSceneKey,
    setInputEnabled: InputEnabledHandler,
    options?: Omit<RegisterSceneOptions, 'setInputEnabled'>,
  ): void {
    if (this.inputConfig && this.inputConfig.sceneKey !== sceneKey) {
      this.releaseLock();
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
  }

  open(modal: ModalType): void {
    if (!this.isRoutedModal(modal)) return;

    const state = useGameStore.getState();
    if (state.flow.isTransitioning) return;

    const currentModal = state.flow.modal;
    if (currentModal === modal) return;

    this.stack.push({ returnModal: currentModal });
    this.ensureSubscribed();
    this.ensureLocked();

    // Important: do not close the current modal first; replace it in one write.
    state.openModal(modal);
  }

  openSettings(): void {
    this.open('settings');
  }

  openHowToPlay(): void {
    this.open('help');
  }

  /**
   * Default close behavior: goes "Back" when a return stack exists, otherwise closes outright.
   */
  close(): void {
    if (this.stack.length > 0) {
      this.closeToPrevious();
      return;
    }
    this.closeAll();
  }

  /**
   * Back behavior: close the current routed modal and return to the previous modal (if any).
   */
  closeToPrevious(): void {
    const entry = this.stack.pop() ?? null;
    const state = useGameStore.getState();
    const currentModal = state.flow.modal;

    if (!this.isRoutedModal(currentModal)) {
      this.stack = [];
      this.releaseLockIfIdle();
      return;
    }

    const returnModal = entry?.returnModal ?? null;
    if (returnModal) {
      state.openModal(returnModal);
    } else {
      state.closeModal();
    }

    this.releaseLockIfIdle();
  }

  /**
   * Close behavior: exit routed modals entirely (clears any return stack).
   * Useful for an explicit "Close" that should resume gameplay.
   */
  closeAll(): void {
    const state = useGameStore.getState();
    const currentModal = state.flow.modal;
    this.stack = [];

    if (this.isRoutedModal(currentModal)) {
      state.closeModal();
    }

    this.releaseLockIfIdle();
  }

  /**
   * Clears internal state and releases any held input lock.
   */
  destroy(): void {
    this.stack = [];
    this.releaseLock();

    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  getDepth(): number {
    return this.stack.length;
  }

  peekReturnModal(): ModalType | null {
    const entry = this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
    return entry?.returnModal ?? null;
  }

  private isRoutedModal(modal: ModalType | null): boolean {
    return modal !== null && this.routedModalSet.has(modal);
  }

  private ensureSubscribed(): void {
    if (this.unsubscribe) return;

    this.unsubscribe = useGameStore.subscribe((next: GameStore, prev?: GameStore) => {
      const modal = next.flow.modal;
      const prevModal = prev?.flow.modal ?? null;

      if (this.isRoutedModal(prevModal) && !this.isRoutedModal(modal)) {
        if (modal === null && this.stack.length > 0) {
          this.returnFromExternalClose();
          return;
        }

        this.stack = [];
        this.releaseLockIfIdle();
        return;
      }

      if (!this.isRoutedModal(modal) && this.stack.length > 0) {
        this.stack = [];
        this.releaseLockIfIdle();
      }
    });
  }

  private returnFromExternalClose(): void {
    const entry = this.stack.pop() ?? null;
    const state = useGameStore.getState();
    const returnModal = entry?.returnModal ?? null;

    if (returnModal) {
      state.openModal(returnModal);
    }

    this.releaseLockIfIdle();
  }

  private ensureLocked(): void {
    if (this.lockHandle) return;
    if (!this.inputConfig) return;

    inputLock.registerScene(this.inputConfig.sceneKey, this.inputConfig.register);
    this.lockHandle = inputLock.lock(this.inputConfig.sceneKey);
  }

  private releaseLockIfIdle(): void {
    const modalSnapshot: ModalSnapshot = { modal: useGameStore.getState().flow.modal };
    if (this.isRoutedModal(modalSnapshot.modal)) return;
    if (this.stack.length > 0) return;
    this.releaseLock();
  }

  private releaseLock(): void {
    if (!this.lockHandle) return;
    const handle = this.lockHandle;
    this.lockHandle = null;
    handle.release();
  }
}

export const settingsHowToPlayRouter = new MenuStackRouter();