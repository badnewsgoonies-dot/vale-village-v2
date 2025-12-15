/**
 * Overworld V2 Constants
 * Single source of truth for viewport + world pixel coordinates.
 */

export const VIEWPORT_WIDTH = 960;
export const VIEWPORT_HEIGHT = 640;

export const SKY_HEIGHT = 256;

export const ROAD_Y_TOP = 420;
export const ROAD_Y_BOTTOM = 480;

/** Buildings are bottom-center anchored at this ground line. */
export const BUILDING_GROUND_Y = ROAD_Y_TOP;

/** World scroll width; exact value will be derived from layout later. */
export const DEFAULT_WORLD_WIDTH = 4000;
export const DEFAULT_WORLD_HEIGHT = VIEWPORT_HEIGHT;

export const DEFAULT_CAMERA_FOLLOW_SPEED = 0.08;
export const DEFAULT_MAX_DT_MS = 100;

/** Player movement speed (world pixels per second). */
export const PLAYER_MOVE_SPEED = 160;

/** Y band where player can walk (on/around the road). */
export const PLAYER_Y_MIN = ROAD_Y_TOP - 10;  // Can step slightly above road to enter doors
export const PLAYER_Y_MAX = ROAD_Y_BOTTOM - 10; // Stay above road bottom
