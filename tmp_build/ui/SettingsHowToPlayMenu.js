"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsHowToPlayMenu = exports.SettingsHowToPlayMenu = void 0;
exports.setPendingMenuSelection = setPendingMenuSelection;
exports.consumePendingMenuSelection = consumePendingMenuSelection;
const gameStore_1 = require("@/store/gameStore");
const InputLock_1 = require("@/input/InputLock");
const isSettingsHowToPlayModal = (modal) => modal === 'settings' || modal === 'help';
const scheduleNextFrame = (fn) => {
    if (typeof requestAnimationFrame === 'function') {
        return requestAnimationFrame(() => fn());
    }
    return setTimeout(fn, 0);
};
const cancelScheduledFrame = (id) => {
    if (typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(id);
        return;
    }
    clearTimeout(id);
};
const isFocusable = (value) => Boolean(value) && typeof value === 'object' && value instanceof HTMLElement && typeof value.focus === 'function';
const safeActiveElement = () => {
    if (typeof document === 'undefined')
        return null;
    const el = document.activeElement;
    return isFocusable(el) ? el : null;
};
const defaultFocusSelectorForModal = (modal) => {
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
const focusSelectorWithRetries = (selector, attempts) => {
    let cancelled = false;
    let frameId = null;
    let remaining = Math.max(0, attempts);
    const tryFocus = () => {
        frameId = null;
        if (cancelled)
            return;
        const el = typeof document !== 'undefined' ? document.querySelector(selector) : null;
        if (isFocusable(el)) {
            el.focus();
            return;
        }
        remaining -= 1;
        if (remaining <= 0)
            return;
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
const pendingSelectionByModal = new Map();
function setPendingMenuSelection(modal, selection) {
    pendingSelectionByModal.set(modal, selection);
}
function consumePendingMenuSelection(modal) {
    const existing = pendingSelectionByModal.get(modal) ?? null;
    if (existing)
        pendingSelectionByModal.delete(modal);
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
class SettingsHowToPlayMenu {
    constructor() {
        Object.defineProperty(this, "inputConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "lockHandle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "stack", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "unsubscribe", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "pendingFocusCleanup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    configureInputLock(sceneKey, setInputEnabled, options) {
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
        InputLock_1.inputLock.registerScene(sceneKey, this.inputConfig.register);
    }
    openSettings() {
        this.open('settings');
    }
    openHowToPlay() {
        this.open('help');
    }
    /**
     * Default close behavior: goes "Back" when a return stack exists, otherwise closes outright.
     */
    close() {
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
    closeToPrevious() {
        const entry = this.stack.pop() ?? null;
        const state = gameStore_1.useGameStore.getState();
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
        }
        else {
            state.closeModal();
        }
        this.restoreFocus(returnFocus);
        this.releaseLockIfIdle();
    }
    /**
     * Close behavior: exit Settings/Help entirely (clears any return stack).
     * Useful for an explicit "Close" button that should resume gameplay.
     */
    closeAll() {
        const state = gameStore_1.useGameStore.getState();
        const currentModal = state.flow.modal;
        const originEntry = this.stack.length > 0 ? this.stack[0] : null;
        const focusSnapshot = originEntry?.returnFocus ?? {
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
    destroy() {
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
    open(target) {
        const state = gameStore_1.useGameStore.getState();
        const currentModal = state.flow.modal;
        if (state.flow.isTransitioning)
            return;
        if (isSettingsHowToPlayModal(currentModal)) {
            if (currentModal === target)
                return;
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
        const focusSnapshot = {
            element: safeActiveElement(),
            fallbackSelector: defaultFocusSelectorForModal(currentModal),
        };
        const selectionHint = currentModal === 'pause'
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
    ensureSubscribed() {
        if (this.unsubscribe)
            return;
        this.unsubscribe = gameStore_1.useGameStore.subscribe((state, prev) => {
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
    returnFromExternalClose() {
        const entry = this.stack.pop() ?? null;
        const state = gameStore_1.useGameStore.getState();
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
    ensureLocked() {
        if (this.lockHandle)
            return;
        if (!this.inputConfig)
            return;
        InputLock_1.inputLock.registerScene(this.inputConfig.sceneKey, this.inputConfig.register);
        this.lockHandle = InputLock_1.inputLock.lock(this.inputConfig.sceneKey);
    }
    releaseLockIfIdle() {
        const modal = gameStore_1.useGameStore.getState().flow.modal;
        if (isSettingsHowToPlayModal(modal))
            return;
        if (this.stack.length > 0)
            return;
        this.releaseLock();
    }
    releaseLock() {
        if (!this.lockHandle)
            return;
        const handle = this.lockHandle;
        this.lockHandle = null;
        handle.release();
    }
    restoreFocus(snapshot) {
        if (this.pendingFocusCleanup) {
            this.pendingFocusCleanup();
            this.pendingFocusCleanup = null;
        }
        const { element, fallbackSelector } = snapshot;
        if (element && element.isConnected) {
            const focusElement = () => {
                if (!element.isConnected)
                    return;
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
exports.SettingsHowToPlayMenu = SettingsHowToPlayMenu;
exports.settingsHowToPlayMenu = new SettingsHowToPlayMenu();
