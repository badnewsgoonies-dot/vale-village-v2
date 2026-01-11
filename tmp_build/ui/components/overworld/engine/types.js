"use strict";
/**
 * Engine Types
 * Core type definitions for the canvas overworld engine
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ENGINE_CONFIG = void 0;
exports.tileToWorld = tileToWorld;
exports.worldToTile = worldToTile;
exports.lerp = lerp;
exports.clamp = clamp;
/** Default engine configuration */
exports.DEFAULT_ENGINE_CONFIG = {
    canvasWidth: 960,
    canvasHeight: 640,
    tileSize: 32,
    playerSpeed: 160, // 5 tiles per second
    cameraFollowSpeed: 0.08, // Smooth follow
};
/** Convert tile position to world position */
function tileToWorld(tile, tileSize = 32) {
    return {
        x: tile.x * tileSize + tileSize / 2,
        y: tile.y * tileSize + tileSize / 2,
    };
}
/** Convert world position to tile position */
function worldToTile(world, tileSize = 32) {
    return {
        x: Math.floor(world.x / tileSize),
        y: Math.floor(world.y / tileSize),
    };
}
/** Linear interpolation */
function lerp(a, b, t) {
    return a + (b - a) * t;
}
/** Clamp value between min and max */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
