"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLoop = void 0;
// Milliseconds fallback for environments without RAF (approx 60 FPS)
const FRAME_TIMEOUT_MS = 16;
class GameLoop {
    constructor() {
        Object.defineProperty(this, "running", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "rafId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    start() {
        if (this.running)
            return;
        this.running = true;
        const loop = () => {
            this.tick();
            this.rafId = (typeof requestAnimationFrame !== "undefined") ? requestAnimationFrame(loop) : setTimeout(loop, FRAME_TIMEOUT_MS);
        };
        this.rafId = (typeof requestAnimationFrame !== "undefined") ? requestAnimationFrame(loop) : setTimeout(loop, FRAME_TIMEOUT_MS);
    }
    stop() {
        if (!this.running)
            return;
        this.running = false;
        if (this.rafId != null) {
            if (typeof cancelAnimationFrame !== "undefined")
                cancelAnimationFrame(this.rafId);
            else
                clearTimeout(this.rafId);
        }
        this.rafId = null;
    }
    tick() {
        // deterministically consume commands queued on the global input buffer each tick
        if (typeof window === "undefined")
            return;
        const incoming = window.__INPUT_BUFFER__ ? window.__INPUT_BUFFER__.drain() : [];
        for (const cmd of incoming) {
            this.processCommand(cmd);
        }
        // Game update logic would go here
    }
    processCommand(cmd) {
        // Minimal deterministic handler: log for smoke tests and future wiring
        // eslint-disable-next-line no-console
        console.info("[GameLoop] processed command:", String(cmd));
    }
}
exports.GameLoop = GameLoop;
exports.default = GameLoop;
