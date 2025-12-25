import type { ModalType, ScreenType } from '../store/gameStore';
import { useGameStore } from '../store/gameStore';

export type MainMenuNavigationTarget =
  | { kind: 'screen'; screen: ScreenType }
  | { kind: 'modal'; modal: ModalType };

export interface MainMenuTransitionHandlerOptions {
  /**
   * Called with `false` to disable input, `true` to re-enable input.
   * Intended to be wired to the underlying scene/button input system.
   */
  setInputEnabled?: (enabled: boolean) => void;
  /**
   * Minimum time (ms) input stays disabled when opening a modal.
   * Helps prevent "flash" by ensuring the click that opened the overlay can't immediately close it.
   */
  modalLockMs?: number;
  /**
   * Minimum time (ms) input stays disabled when changing screens/scenes.
   */
  screenLockMs?: number;
}

const DEFAULT_MODAL_LOCK_MS = 120;
const DEFAULT_SCREEN_LOCK_MS = 350;

const scheduleNextFrame = (fn: () => void): number => {
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(() => fn());
  }
  return setTimeout(fn, 0) as unknown as number;
};

const cancelScheduledFrame = (id: number): void => {
  if (typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(id);
    return;
  }
  clearTimeout(id);
};

/**
 * MainMenuScene
 *
 * Centralizes main-menu navigation so all button clicks flow through a single
 * transition handler that temporarily disables input during overlay/screen changes.
 */
export class MainMenuScene {
  private inputLocked = false;
  private activeRequestId = 0;
  private pendingFrameId: number | null = null;
  private pendingUnlock: ReturnType<typeof setTimeout> | null = null;

  private readonly openModal: (modal: ModalType) => void;
  private readonly startTransition: (screen: ScreenType) => void;

  constructor(private readonly options: MainMenuTransitionHandlerOptions = {}) {
    const state = useGameStore.getState();
    this.openModal = state.openModal;
    this.startTransition = state.startTransition;
  }

  destroy(): void {
    if (this.pendingFrameId !== null) {
      cancelScheduledFrame(this.pendingFrameId);
      this.pendingFrameId = null;
    }
    if (this.pendingUnlock !== null) {
      clearTimeout(this.pendingUnlock);
      this.pendingUnlock = null;
    }
    this.inputLocked = false;
    this.options.setInputEnabled?.(true);
  }

  /**
   * Unified click handler for all main-menu buttons.
   * Call this from Settings / How-To-Play (and any other navigation buttons).
   */
  handleNavigation(target: MainMenuNavigationTarget, event?: Event): void {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    if (this.inputLocked) return;

    const { flow } = useGameStore.getState();
    if (flow.isTransitioning) return;

    if (target.kind === 'modal' && flow.modal !== null) return;

    const requestId = ++this.activeRequestId;
    this.lockInput();

    if (this.pendingFrameId !== null) {
      cancelScheduledFrame(this.pendingFrameId);
      this.pendingFrameId = null;
    }

    this.pendingFrameId = scheduleNextFrame(() => {
      this.pendingFrameId = null;
      if (requestId !== this.activeRequestId) return;

      if (target.kind === 'modal') {
        this.openModal(target.modal);
        this.unlockAfter(this.options.modalLockMs ?? DEFAULT_MODAL_LOCK_MS, requestId);
      } else {
        this.startTransition(target.screen);
        this.unlockAfter(this.options.screenLockMs ?? DEFAULT_SCREEN_LOCK_MS, requestId);
      }
    });
  }

  onSettingsPressed(event?: Event): void {
    this.handleNavigation({ kind: 'modal', modal: 'settings' }, event);
  }

  onHowToPlayPressed(event?: Event): void {
    this.handleNavigation({ kind: 'modal', modal: 'help' }, event);
  }

  private lockInput(): void {
    this.inputLocked = true;
    this.options.setInputEnabled?.(false);

    if (this.pendingUnlock !== null) {
      clearTimeout(this.pendingUnlock);
      this.pendingUnlock = null;
    }
  }

  private unlockAfter(delayMs: number, requestId: number): void {
    this.pendingUnlock = setTimeout(() => {
      if (requestId !== this.activeRequestId) return;
      this.pendingUnlock = null;
      this.inputLocked = false;
      this.options.setInputEnabled?.(true);
    }, Math.max(0, delayMs));
  }
}