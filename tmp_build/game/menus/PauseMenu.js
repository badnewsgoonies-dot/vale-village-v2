"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pauseMenuController = exports.PauseMenuController = void 0;
const gameStore_1 = require("@/store/gameStore");
const InputLock_1 = require("@/input/InputLock");
const MenuStackRouter_1 = require("@/game/menus/MenuStackRouter");
const isRoutedModal = (modal) => modal === 'settings' || modal === 'help';
const isPauseDomainModal = (modal) => modal === 'pause' || isRoutedModal(modal);
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
class PauseMenuController {
    constructor() {
        Object.defineProperty(this, "inputConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "pauseLockHandle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "unsubscribe", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    configureInputLock(sceneKey, setInputEnabled, options) {
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
        InputLock_1.inputLock.registerScene(sceneKey, this.inputConfig.register);
        MenuStackRouter_1.settingsHowToPlayRouter.configureInputLock(sceneKey, setInputEnabled, options);
    }
    open() {
        const state = gameStore_1.useGameStore.getState();
        if (state.flow.isTransitioning)
            return;
        if (state.flow.modal === 'pause')
            return;
        this.ensureSubscribed();
        this.ensurePauseLocked();
        state.openModal('pause');
    }
    toggle() {
        const modal = gameStore_1.useGameStore.getState().flow.modal;
        if (modal === 'pause') {
            this.resume();
            return;
        }
        this.open();
    }
    openSettings() {
        this.ensureSubscribed();
        this.ensurePauseLocked();
        MenuStackRouter_1.settingsHowToPlayRouter.openSettings();
    }
    openHowToPlay() {
        this.ensureSubscribed();
        this.ensurePauseLocked();
        MenuStackRouter_1.settingsHowToPlayRouter.openHowToPlay();
    }
    /**
     * Close handler intended for Settings/How-To-Play "Close" / "Back" buttons.
     * Uses MenuStackRouter to avoid dropping to `modal: null` in between screens.
     */
    closeRouted() {
        MenuStackRouter_1.settingsHowToPlayRouter.close();
        this.maybeReleasePauseLock();
    }
    /**
     * Closes whichever pause-domain modal is currently active.
     * - Settings/Help: routes back to Pause when possible
     * - Pause: resumes gameplay
     */
    closeActive() {
        const modal = gameStore_1.useGameStore.getState().flow.modal;
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
    resume() {
        MenuStackRouter_1.settingsHowToPlayRouter.closeAll();
        const state = gameStore_1.useGameStore.getState();
        const modal = state.flow.modal;
        if (isPauseDomainModal(modal)) {
            state.closeModal();
        }
        this.maybeReleasePauseLock(true);
    }
    destroy() {
        this.releasePauseLock();
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }
    ensureSubscribed() {
        if (this.unsubscribe)
            return;
        this.unsubscribe = gameStore_1.useGameStore.subscribe((next, prev) => {
            if (!this.pauseLockHandle)
                return;
            const modal = next.flow.modal;
            const prevModal = prev?.flow.modal ?? null;
            // If we briefly hit `modal: null` while a MenuStackRouter return stack exists,
            // keep the pause lock until routing completes.
            if (modal === null && MenuStackRouter_1.settingsHowToPlayRouter.getDepth() > 0) {
                return;
            }
            // Release the pause lock when exiting all menus (i.e. back to gameplay).
            if (prevModal !== null && modal === null) {
                this.maybeReleasePauseLock(true);
            }
        });
    }
    ensurePauseLocked() {
        if (this.pauseLockHandle)
            return;
        if (!this.inputConfig)
            return;
        InputLock_1.inputLock.registerScene(this.inputConfig.sceneKey, this.inputConfig.register);
        this.pauseLockHandle = InputLock_1.inputLock.lock(this.inputConfig.sceneKey);
    }
    maybeReleasePauseLock(force) {
        if (!this.pauseLockHandle)
            return;
        const modal = gameStore_1.useGameStore.getState().flow.modal;
        if (!force && modal !== null)
            return;
        if (MenuStackRouter_1.settingsHowToPlayRouter.getDepth() > 0)
            return;
        this.releasePauseLock();
    }
    releasePauseLock() {
        if (!this.pauseLockHandle)
            return;
        const handle = this.pauseLockHandle;
        this.pauseLockHandle = null;
        handle.release();
    }
}
exports.PauseMenuController = PauseMenuController;
exports.pauseMenuController = new PauseMenuController();
