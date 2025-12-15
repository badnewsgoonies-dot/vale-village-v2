import { clamp } from './math';

/** `PlayerLayer` draws a bottom-center anchored sprite of this width by default. */
export const DEFAULT_PLAYER_WIDTH = 32;
export const DEFAULT_PLAYER_HALF_WIDTH = DEFAULT_PLAYER_WIDTH / 2;

/**
 * Clamp a bottom-center anchored sprite within horizontal world bounds,
 * keeping the full sprite visible when the camera is clamped at the edges.
 */
export function clampPlayerXToWorldBounds(
  playerX: number,
  worldWidth: number,
  halfWidth: number = DEFAULT_PLAYER_HALF_WIDTH
): number {
  return clamp(playerX, halfWidth, worldWidth - halfWidth);
}

