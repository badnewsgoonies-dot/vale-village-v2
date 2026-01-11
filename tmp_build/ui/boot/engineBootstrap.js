"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bootstrapEngine;
const InputManager_1 = require("../../input/InputManager");
const GameLoop_1 = require("../../core/GameLoop");
function bootstrapEngine() {
    InputManager_1.default.init();
    const loop = new GameLoop_1.default();
    if (typeof window !== "undefined") {
        // expose for debugging and testing
        window.__GAME_LOOP__ = loop;
    }
    loop.start();
    return loop;
}
// Auto-bootstrap in browser environments so external scripts can push to window.__INPUT_BUFFER__ immediately
if (typeof window !== "undefined") {
    bootstrapEngine();
}
