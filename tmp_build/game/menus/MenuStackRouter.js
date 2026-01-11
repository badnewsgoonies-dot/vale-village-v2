"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsHowToPlayRouter = exports.MenuStackRouter = void 0;
const gameStore_1 = require("@/store/gameStore");
const InputLock_1 = require("@/input/InputLock");
const DEFAULT_ROUTED_MODALS = ['settings', 'help'];
/**
 * MenuStackRouter
 *
 * A minimal modal stack router intended for Settings/How-To-Play (and similar) navigation:
 * - `open(modal)` pushes the current modal and replaces it in a single write (no "flash")
 * - `close()` / `closeToPrevious()` pops the stack and restores the correct return modal
 * - Subscribes to external closes to prevent soft-locks / lost return targets
 * - Optional InputLock integration for scene-level input gating
 */
class MenuStackRouter {
    constructor(options = {}) {
        Object.defineProperty(this, "routedModalSet", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
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
        this.routedModalSet = new Set(options.routedModals ?? DEFAULT_ROUTED_MODALS);
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
    open(modal) {
        if (!this.isRoutedModal(modal))
            return;
        const state = gameStore_1.useGameStore.getState();
        if (state.flow.isTransitioning)
            return;
        const currentModal = state.flow.modal;
        if (currentModal === modal)
            return;
        this.stack.push({ returnModal: currentModal });
        this.ensureSubscribed();
        this.ensureLocked();
        // Important: do not close the current modal first; replace it in one write.
        state.openModal(modal);
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
     * Back behavior: close the current routed modal and return to the previous modal (if any).
     */
    closeToPrevious() {
        const entry = this.stack.pop() ?? null;
        const state = gameStore_1.useGameStore.getState();
        const currentModal = state.flow.modal;
        if (!this.isRoutedModal(currentModal)) {
            this.stack = [];
            this.releaseLockIfIdle();
            return;
        }
        const returnModal = entry?.returnModal ?? null;
        if (returnModal) {
            state.openModal(returnModal);
        }
        else {
            state.closeModal();
        }
        this.releaseLockIfIdle();
    }
    /**
     * Close behavior: exit routed modals entirely (clears any return stack).
     * Useful for an explicit "Close" that should resume gameplay.
     */
    closeAll() {
        const state = gameStore_1.useGameStore.getState();
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
    destroy() {
        this.stack = [];
        this.releaseLock();
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }
    getDepth() {
        return this.stack.length;
    }
    peekReturnModal() {
        const entry = this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
        return entry?.returnModal ?? null;
    }
    isRoutedModal(modal) {
        return modal !== null && this.routedModalSet.has(modal);
    }
    ensureSubscribed() {
        if (this.unsubscribe)
            return;
        this.unsubscribe = gameStore_1.useGameStore.subscribe((next, prev) => {
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
    returnFromExternalClose() {
        const entry = this.stack.pop() ?? null;
        const state = gameStore_1.useGameStore.getState();
        const returnModal = entry?.returnModal ?? null;
        if (returnModal) {
            state.openModal(returnModal);
        }
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
        const modalSnapshot = { modal: gameStore_1.useGameStore.getState().flow.modal };
        if (this.isRoutedModal(modalSnapshot.modal))
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
}
exports.MenuStackRouter = MenuStackRouter;
exports.settingsHowToPlayRouter = new MenuStackRouter();
