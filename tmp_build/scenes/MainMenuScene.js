"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainMenuScene = void 0;
const gameStore_1 = require("../store/gameStore");
const DEFAULT_MODAL_LOCK_MS = 120;
const DEFAULT_SCREEN_LOCK_MS = 350;
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
/**
 * MainMenuScene
 *
 * Centralizes main-menu navigation so all button clicks flow through a single
 * transition handler that temporarily disables input during overlay/screen changes.
 */
class MainMenuScene {
    constructor(options = {}) {
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: options
        });
        Object.defineProperty(this, "inputLocked", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "activeRequestId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "pendingFrameId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "pendingUnlock", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "openModal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "startTransition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const state = gameStore_1.useGameStore.getState();
        this.openModal = state.openModal;
        this.startTransition = state.startTransition;
    }
    destroy() {
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
    handleNavigation(target, event) {
        event?.preventDefault?.();
        event?.stopPropagation?.();
        if (this.inputLocked)
            return;
        const { flow } = gameStore_1.useGameStore.getState();
        if (flow.isTransitioning)
            return;
        if (target.kind === 'modal' && flow.modal !== null)
            return;
        const requestId = ++this.activeRequestId;
        this.lockInput();
        if (this.pendingFrameId !== null) {
            cancelScheduledFrame(this.pendingFrameId);
            this.pendingFrameId = null;
        }
        this.pendingFrameId = scheduleNextFrame(() => {
            this.pendingFrameId = null;
            if (requestId !== this.activeRequestId)
                return;
            if (target.kind === 'modal') {
                this.openModal(target.modal);
                this.unlockAfter(this.options.modalLockMs ?? DEFAULT_MODAL_LOCK_MS, requestId);
            }
            else {
                this.startTransition(target.screen);
                this.unlockAfter(this.options.screenLockMs ?? DEFAULT_SCREEN_LOCK_MS, requestId);
            }
        });
    }
    onSettingsPressed(event) {
        this.handleNavigation({ kind: 'modal', modal: 'settings' }, event);
    }
    onHowToPlayPressed(event) {
        this.handleNavigation({ kind: 'modal', modal: 'help' }, event);
    }
    lockInput() {
        this.inputLocked = true;
        this.options.setInputEnabled?.(false);
        if (this.pendingUnlock !== null) {
            clearTimeout(this.pendingUnlock);
            this.pendingUnlock = null;
        }
    }
    unlockAfter(delayMs, requestId) {
        this.pendingUnlock = setTimeout(() => {
            if (requestId !== this.activeRequestId)
                return;
            this.pendingUnlock = null;
            this.inputLocked = false;
            this.options.setInputEnabled?.(true);
        }, Math.max(0, delayMs));
    }
}
exports.MainMenuScene = MainMenuScene;
