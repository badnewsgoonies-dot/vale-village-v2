"use strict";
/**
 * InputSystem
 * Tracks keyboard state and touch joystick for movement and interaction.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputSystem = void 0;
const KEY_MAP = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
    KeyA: 'left',
    KeyD: 'right',
    KeyW: 'up',
    KeyS: 'down',
    Space: 'action',
    Enter: 'action',
};
class InputSystem {
    constructor() {
        Object.defineProperty(this, "heldKeys", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "justPressed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "justReleased", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        // Touch joystick state
        Object.defineProperty(this, "touchHorizontal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "touchVertical", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "touchAction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "boundKeyDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "boundKeyUp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.boundKeyDown = this.handleKeyDown.bind(this);
        this.boundKeyUp = this.handleKeyUp.bind(this);
    }
    /** Attach to window keyboard events */
    attach() {
        window.addEventListener('keydown', this.boundKeyDown);
        window.addEventListener('keyup', this.boundKeyUp);
    }
    /** Detach from window keyboard events */
    detach() {
        window.removeEventListener('keydown', this.boundKeyDown);
        window.removeEventListener('keyup', this.boundKeyUp);
        this.heldKeys.clear();
        this.justPressed.clear();
        this.justReleased.clear();
        this.touchHorizontal = 0;
        this.touchVertical = 0;
        this.touchAction = false;
    }
    handleKeyDown(e) {
        const key = KEY_MAP[e.code];
        if (!key)
            return;
        // Prevent default for game keys (stops page scrolling)
        e.preventDefault();
        if (!this.heldKeys.has(key)) {
            this.justPressed.add(key);
        }
        this.heldKeys.add(key);
    }
    handleKeyUp(e) {
        const key = KEY_MAP[e.code];
        if (!key)
            return;
        e.preventDefault();
        if (this.heldKeys.has(key)) {
            this.justReleased.add(key);
        }
        this.heldKeys.delete(key);
    }
    /** Set touch joystick input (called from VirtualJoystick component) */
    setTouchInput(horizontal, vertical) {
        this.touchHorizontal = horizontal;
        this.touchVertical = vertical;
    }
    /** Set touch action button state */
    setTouchAction(pressed) {
        if (pressed && !this.touchAction) {
            this.justPressed.add('action');
        }
        this.touchAction = pressed;
    }
    /** Call at end of each frame to clear one-shot states */
    endFrame() {
        this.justPressed.clear();
        this.justReleased.clear();
    }
    /** Check if a key is currently held down */
    isHeld(key) {
        if (key === 'action' && this.touchAction)
            return true;
        return this.heldKeys.has(key);
    }
    /** Check if a key was just pressed this frame */
    wasJustPressed(key) {
        return this.justPressed.has(key);
    }
    /** Check if a key was just released this frame */
    wasJustReleased(key) {
        return this.justReleased.has(key);
    }
    /** Get horizontal input (-1 = left, 0 = none, 1 = right) */
    getHorizontal() {
        // Touch input takes priority if active
        if (this.touchHorizontal !== 0) {
            return this.touchHorizontal;
        }
        let h = 0;
        if (this.heldKeys.has('left'))
            h -= 1;
        if (this.heldKeys.has('right'))
            h += 1;
        return h;
    }
    /** Get vertical input (-1 = up, 0 = none, 1 = down) */
    getVertical() {
        // Touch input takes priority if active
        if (this.touchVertical !== 0) {
            return this.touchVertical;
        }
        let v = 0;
        if (this.heldKeys.has('up'))
            v -= 1;
        if (this.heldKeys.has('down'))
            v += 1;
        return v;
    }
    /** Check if any movement input is active (keyboard or touch) */
    isMoving() {
        return (this.touchHorizontal !== 0 ||
            this.touchVertical !== 0 ||
            this.heldKeys.has('left') ||
            this.heldKeys.has('right') ||
            this.heldKeys.has('up') ||
            this.heldKeys.has('down'));
    }
}
exports.InputSystem = InputSystem;
