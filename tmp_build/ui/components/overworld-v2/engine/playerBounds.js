"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PLAYER_HALF_WIDTH = exports.DEFAULT_PLAYER_WIDTH = void 0;
exports.clampPlayerXToWorldBounds = clampPlayerXToWorldBounds;
const math_1 = require("./math");
/** `PlayerLayer` draws a bottom-center anchored sprite of this width by default. */
exports.DEFAULT_PLAYER_WIDTH = 32;
exports.DEFAULT_PLAYER_HALF_WIDTH = exports.DEFAULT_PLAYER_WIDTH / 2;
/**
 * Clamp a bottom-center anchored sprite within horizontal world bounds,
 * keeping the full sprite visible when the camera is clamped at the edges.
 */
function clampPlayerXToWorldBounds(playerX, worldWidth, halfWidth = exports.DEFAULT_PLAYER_HALF_WIDTH) {
    return (0, math_1.clamp)(playerX, halfWidth, worldWidth - halfWidth);
}
