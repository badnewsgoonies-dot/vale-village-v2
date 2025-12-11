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

// Legacy DOM-based tile renderer
// export { OverworldMap } from '../ui/components/OverworldMap';

// Advanced 3D canvas-based renderer with smooth movement
export { OverworldCanvas as OverworldMap } from '../ui/components/overworld/OverworldCanvas';
