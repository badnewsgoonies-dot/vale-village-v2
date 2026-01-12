/**
 * Overworld V2 Constants
 * Single source of truth for viewport + world pixel coordinates.
 */

export const VIEWPORT_WIDTH = 960;
export const VIEWPORT_HEIGHT = 640;

export const SKY_HEIGHT = 256;
export const MOUNTAIN_BASE_Y = SKY_HEIGHT;

export const ROAD_Y_TOP = 460;
export const ROAD_Y_BOTTOM = 520;

/** Buildings are bottom-center anchored at this ground line. */
export const BUILDING_GROUND_Y = ROAD_Y_TOP;

/** World scroll width; exact value will be derived from layout later. */
export const DEFAULT_WORLD_WIDTH = 4000;
export const DEFAULT_WORLD_HEIGHT = VIEWPORT_HEIGHT;

/** Scenery world width (mountains, sky) */
export const WORLD_WIDTH_SCENERY = 6000;

export const CLOUD_COUNT = 8;

/** Tree distribution and animation */
export const TREE_SPACING = 220;
export const TREE_BASE_Y_OFFSET = 120; // Offset above BUILDING_GROUND_Y
export const TREE_Y_JITTER = 30;
export const TREE_SWAY_SPEED = 900;
export const TREE_SWAY_AMOUNT = 1.2;

export const DEFAULT_CAMERA_FOLLOW_SPEED = 0.08;
export const DEFAULT_MAX_DT_MS = 100;

/** Player movement speed (world pixels per second). */
export const PLAYER_MOVE_SPEED = 160;

/** Interior room configuration */
export const INTERIOR_ROOM_WIDTH = 320;
export const INTERIOR_ROOM_HEIGHT = 240;
export const INTERIOR_ROOM_X = (VIEWPORT_WIDTH - INTERIOR_ROOM_WIDTH) / 2;
export const INTERIOR_ROOM_Y = (VIEWPORT_HEIGHT - INTERIOR_ROOM_HEIGHT) / 2 + 50;

/** Tower Lobby configuration (5x larger) */
export const TOWER_LOBBY_WIDTH = 1600;
export const TOWER_LOBBY_HEIGHT = 1200;
// Center the large room in the world space (conceptually)
// We'll let the camera scroll, so we can position it similarly or at 0,0
export const TOWER_LOBBY_X = (VIEWPORT_WIDTH - TOWER_LOBBY_WIDTH) / 2; // Will be negative relative to viewport, but okay for world space
export const TOWER_LOBBY_Y = 100; // Padding from top

/** Interior player speed (slower indoors) */
export const INTERIOR_PLAYER_SPEED = 120;

/** Exit trigger zone (bottom center of room) */
export const EXIT_ZONE_WIDTH = 60;
export const EXIT_ZONE_HEIGHT = 30;
export const INTERIOR_ENEMY_OFFSET_Y = 70;
export const INTERIOR_NPC_TRIGGER_RADIUS = 40;

/** Y band where player can walk (on/around the road). */
export const PLAYER_Y_MIN = ROAD_Y_TOP; // Restrict north movement to road top edge
export const PLAYER_Y_MAX = ROAD_Y_BOTTOM - 10; // Stay above road bottom
