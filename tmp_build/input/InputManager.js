"use strict";
/* Minimal InputManager: provides a global window.__INPUT_BUFFER__ with push(cmd) and drain() */
Object.defineProperty(exports, "__esModule", { value: true });
class InputManager {
    constructor() {
        Object.defineProperty(this, "queue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    init() {
        if (typeof window === 'undefined')
            return;
        if (!window.__INPUT_BUFFER__) {
            window.__INPUT_BUFFER__ = {
                push: (cmd) => {
                    // coerce to string to be deterministic
                    this.queue.push(String(cmd));
                },
                drain: () => {
                    const out = this.queue.slice();
                    this.queue.length = 0;
                    return out;
                },
            };
        }
    }
    push(cmd) {
        this.queue.push(String(cmd));
    }
    drain() {
        const out = this.queue.slice();
        this.queue.length = 0;
        return out;
    }
    consumeNext() {
        return this.queue.shift() ?? null;
    }
    hasCommands() {
        return this.queue.length > 0;
    }
}
const inputManager = new InputManager();
// Auto-init the global buffer so external scripts can enqueue commands immediately
if (typeof window !== 'undefined') {
    inputManager.init();
}
exports.default = inputManager;
