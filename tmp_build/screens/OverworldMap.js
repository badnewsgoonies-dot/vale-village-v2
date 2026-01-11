"use strict";
/**
 * OverworldMap Screen
 *
 * Exports the overworld component for the game.
 * Currently uses the legacy DOM-based renderer.
 *
 * To switch to the canvas-based renderer with smooth movement:
 * 1. Comment out the legacy export
 * 2. Uncomment the canvas export
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverworldMap = void 0;
// Legacy DOM-based tile renderer
// export { OverworldMap } from '../ui/components/OverworldMap';
// Advanced 3D canvas-based renderer with smooth movement
var OverworldV2_1 = require("../ui/components/overworld-v2/OverworldV2");
Object.defineProperty(exports, "OverworldMap", { enumerable: true, get: function () { return OverworldV2_1.OverworldV2; } });
// Legacy canvas renderer (backup - uncomment to revert)
// export { OverworldCanvas as OverworldMap } from '../ui/components/overworld/OverworldCanvas';
