import type { GameStore, ModalType } from '@/store/gameStore';
import { useGameStore } from '@/store/gameStore';
import type {
  InputEnabledHandler,
  InputLockHandle,
  InputLockSceneKey,
  RegisterSceneOptions,
} from '@/input/InputLock';
import { inputLock } from '@/input/InputLock';

export type SettingsHowToPlayModal = Extract<ModalType, 'settings' | 'help'>;

export type MenuSelectionSnapshot = Readonly<{
  index: number;
  itemId?: string;
}>;

const isSettingsHowToPlayModal = (modal: ModalType | null): modal is SettingsHowToPlayModal =>
  modal === 'settings' || modal === 'help';

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

const isFocusable = (value: unknown): value is HTMLElement =>
  Boolean(value) && typeof value === 'object' && value instanceof HTMLElement && typeof value.focus === 'function';

const safeActiveElement = (): HTMLElement | null => {
  if (typeof document === 'undefined') return null;
  const el = document.activeElement;
  return isFocusable(el) ? el : null;
};

const defaultFocusSelectorForModal = (modal: ModalType | null): string | null => {
  switch (modal) {
    case 'pause':
      return '.pause-menu';
    case 'settings':
      return '.modal--settings .close-btn, .modal--settings';
    case 'help':
      return '.modal--help .close-btn, .modal--help';
    default:
      return '.main-menu-option.selected, .main-menu-option';
  }
};

const focusSelectorWithRetries = (selector: string, attempts: number): (() => void) => {
  let cancelled = false;
  let frameId: number | null = null;
  let remaining = Math.max(0, attempts);

  const tryFocus = () => {
    frameId = null;
    if (cancelled) return;

    const el = typeof document !== 'undefined' ? document.querySelector(selector) : null;
    if (isFocusable(el)) {
      el.focus();
      return;
    }

    remaining -= 1;
    if (remaining <= 0) return;
    frameId = scheduleNextFrame(tryFocus);
  };

  frameId = scheduleNextFrame(tryFocus);

  return () => {
    cancelled = true;
    if (frameId !== null) {
      cancelScheduledFrame(frameId);
      frameId = null;
    }
  };
};

type FocusSnapshot = Readonly<{
  element: HTMLElement | null;
  fallbackSelector: string | null;
}>;

type StackEntry = Readonly<{
  returnModal: ModalType | null;
  returnFocus: FocusSnapshot;
  returnSelection: MenuSelectionSnapshot | null;
}>;

type InputConfig = Readonly<{
  sceneKey: InputLockSceneKey;
  register: RegisterSceneOptions;
}>;

const pendingSelectionByModal = new Map<ModalType, MenuSelectionSnapshot>();

export function setPendingMenuSelection(modal: ModalType, selection: MenuSelectionSnapshot): void {
  pendingSelectionByModal.set(modal, selection);
}

export function consumePendingMenuSelection(modal: ModalType): MenuSelectionSnapshot | null {
  const existing = pendingSelectionByModal.get(modal) ?? null;
  if (existing) pendingSelectionByModal.delete(modal);
  return existing;
}

/**
 * SettingsHowToPlayMenu
 *
 * Coordinates opening Settings / How-To-Play from other menus without:
 * - dropping to "no modal" between screens (prevents input from briefly re-enabling)
 * - leaving input-locked state behind on close/back
 * - losing hint-state for returning focus/selection
 *
 * Intended usage:
 * - Call `settingsHowToPlayMenu.configureInputLock(...)` once per scene (optional).
 * - Use `settingsHowToPlayMenu.openSettings()` / `.openHowToPlay()` instead of `closeModal(); openModal(...)`.
 * - Wire Settings/Help close handlers to `settingsHowToPlayMenu.closeToPrevious()` (Back behavior),
 *   or `settingsHowToPlayMenu.closeAll()` (Close behavior).
 */
export class SettingsHowToPlayMenu {
  private inputConfig: InputConfig | null = null;
  private lockHandle: InputLockHandle | null = null;
  private stack: StackEntry[] = [];
  private unsubscribe: (() => void) | null = null;
  private pendingFocusCleanup: (() => void) | null = null;

  configureInputLock(sceneKey: InputLockSceneKey, setInputEnabled: InputEnabledHandler, options?: Omit<RegisterSceneOptions, 'setInputEnabled'>): void {
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
   * Back behavior: close Settings/Help and return to the previous modal (if any).
   * If no previous modal exists, closes Settings/Help outright.
   */
  closeToPrevious(): void {
    const entry = this.stack.pop() ?? null;
    const state = useGameStore.getState();
    const currentModal = state.flow.modal;

    if (!isSettingsHowToPlayModal(currentModal)) {
      this.stack = [];
      this.releaseLockIfIdle();
      return;
    }

    const returnModal = entry?.returnModal ?? null;
    const returnFocus = entry?.returnFocus ?? { element: null, fallbackSelector: defaultFocusSelectorForModal(returnModal) };
    const returnSelection = entry?.returnSelection ?? null;

    if (returnModal && returnSelection) {
      setPendingMenuSelection(returnModal, returnSelection);
    }

    if (returnModal) {
      state.openModal(returnModal);
    } else {
      state.closeModal();
    }

    this.restoreFocus(returnFocus);
    this.releaseLockIfIdle();
  }

  /**
   * Close behavior: exit Settings/Help entirely (clears any return stack).
   * Useful for an explicit "Close" button that should resume gameplay.
   */
  closeAll(): void {
    const state = useGameStore.getState();
    const currentModal = state.flow.modal;
    const originEntry = this.stack.length > 0 ? this.stack[0] : null;
    const focusSnapshot: FocusSnapshot = originEntry?.returnFocus ?? {
      element: null,
      fallbackSelector: defaultFocusSelectorForModal(null),
    };
    const returnSelection = originEntry?.returnSelection ?? null;
    const returnModal = originEntry?.returnModal ?? null;

    this.stack = [];

    if (isSettingsHowToPlayModal(currentModal)) {
      state.closeModal();
    }

    if (returnModal && returnSelection) {
      setPendingMenuSelection(returnModal, returnSelection);
    }

    this.restoreFocus(focusSnapshot);
    this.releaseLockIfIdle();
  }

  destroy(): void {
    this.stack = [];
    this.releaseLock();

    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    if (this.pendingFocusCleanup) {
      this.pendingFocusCleanup();
      this.pendingFocusCleanup = null;
    }
  }

  private open(target: SettingsHowToPlayModal): void {
    const state = useGameStore.getState();
    const currentModal = state.flow.modal;

    if (state.flow.isTransitioning) return;

    if (isSettingsHowToPlayModal(currentModal)) {
      if (currentModal === target) return;

      this.stack.push({
        returnModal: currentModal,
        returnFocus: {
          element: safeActiveElement(),
          fallbackSelector: defaultFocusSelectorForModal(currentModal),
        },
        returnSelection: null,
      });

      this.ensureSubscribed();
      this.ensureLocked();
      state.openModal(target);
      return;
    }

    const focusSnapshot: FocusSnapshot = {
      element: safeActiveElement(),
      fallbackSelector: defaultFocusSelectorForModal(currentModal),
    };

    const selectionHint: MenuSelectionSnapshot | null =
      currentModal === 'pause'
        ? { index: target === 'settings' ? 5 : 6, itemId: target === 'settings' ? 'settings' : 'help' }
        : null;

    this.stack.push({
      returnModal: currentModal,
      returnFocus: focusSnapshot,
      returnSelection: selectionHint,
    });

    this.ensureSubscribed();
    this.ensureLocked();

    // Important: do not clear the current modal first; replace it in one write to avoid input "flash".
    state.openModal(target);
  }

  private ensureSubscribed(): void {
    if (this.unsubscribe) return;

    this.unsubscribe = useGameStore.subscribe((state: GameStore, prev?: GameStore) => {
      const modal = state.flow.modal;
      const prevModal = prev?.flow.modal ?? null;

      if (isSettingsHowToPlayModal(prevModal) && !isSettingsHowToPlayModal(modal)) {
        if (modal === null && this.stack.length > 0) {
          this.returnFromExternalClose();
          return;
        }

        this.stack = [];
        this.releaseLockIfIdle();
        return;
      }

      if (!isSettingsHowToPlayModal(modal) && this.stack.length > 0) {
        this.stack = [];
        this.releaseLockIfIdle();
      }
    });
  }

  private returnFromExternalClose(): void {
    const entry = this.stack.pop() ?? null;
    const state = useGameStore.getState();

    const returnModal = entry?.returnModal ?? null;
    const returnFocus = entry?.returnFocus ?? { element: null, fallbackSelector: defaultFocusSelectorForModal(returnModal) };
    const returnSelection = entry?.returnSelection ?? null;

    if (returnModal && returnSelection) {
      setPendingMenuSelection(returnModal, returnSelection);
    }

    if (returnModal) {
      state.openModal(returnModal);
    }

    this.restoreFocus(returnFocus);
    this.releaseLockIfIdle();
  }

  private ensureLocked(): void {
    if (this.lockHandle) return;
    if (!this.inputConfig) return;

    inputLock.registerScene(this.inputConfig.sceneKey, this.inputConfig.register);
    this.lockHandle = inputLock.lock(this.inputConfig.sceneKey);
  }

  private releaseLockIfIdle(): void {
    const modal = useGameStore.getState().flow.modal;
    if (isSettingsHowToPlayModal(modal)) return;
    if (this.stack.length > 0) return;
    this.releaseLock();
  }

  private releaseLock(): void {
    if (!this.lockHandle) return;
    const handle = this.lockHandle;
    this.lockHandle = null;
    handle.release();
  }

  private restoreFocus(snapshot: FocusSnapshot): void {
    if (this.pendingFocusCleanup) {
      this.pendingFocusCleanup();
      this.pendingFocusCleanup = null;
    }

    const { element, fallbackSelector } = snapshot;
    if (element && element.isConnected) {
      const focusElement = () => {
        if (!element.isConnected) return;
        element.focus();
      };

      scheduleNextFrame(focusElement);
      return;
    }

    if (fallbackSelector) {
      this.pendingFocusCleanup = focusSelectorWithRetries(fallbackSelector, 10);
    }
  }
}

export const settingsHowToPlayMenu = new SettingsHowToPlayMenu();
