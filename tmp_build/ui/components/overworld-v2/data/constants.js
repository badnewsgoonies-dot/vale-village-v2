"use strict";
/**
 * Overworld V2 Constants
 * Single source of truth for viewport + world pixel coordinates.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAYER_Y_MAX = exports.PLAYER_Y_MIN = exports.PLAYER_MOVE_SPEED = exports.DEFAULT_MAX_DT_MS = exports.DEFAULT_CAMERA_FOLLOW_SPEED = exports.DEFAULT_WORLD_HEIGHT = exports.DEFAULT_WORLD_WIDTH = exports.BUILDING_GROUND_Y = exports.ROAD_Y_BOTTOM = exports.ROAD_Y_TOP = exports.SKY_HEIGHT = exports.VIEWPORT_HEIGHT = exports.VIEWPORT_WIDTH = void 0;
exports.VIEWPORT_WIDTH = 960;
exports.VIEWPORT_HEIGHT = 640;
exports.SKY_HEIGHT = 256;
exports.ROAD_Y_TOP = 460;
exports.ROAD_Y_BOTTOM = 520;
/** Buildings are bottom-center anchored at this ground line. */
exports.BUILDING_GROUND_Y = exports.ROAD_Y_TOP;
/** World scroll width; exact value will be derived from layout later. */
exports.DEFAULT_WORLD_WIDTH = 4000;
exports.DEFAULT_WORLD_HEIGHT = exports.VIEWPORT_HEIGHT;
exports.DEFAULT_CAMERA_FOLLOW_SPEED = 0.08;
exports.DEFAULT_MAX_DT_MS = 100;
/** Player movement speed (world pixels per second). */
exports.PLAYER_MOVE_SPEED = 160;
/** Y band where player can walk (on/around the road). */
exports.PLAYER_Y_MIN = exports.ROAD_Y_TOP; // Restrict north movement to road top edge
exports.PLAYER_Y_MAX = exports.ROAD_Y_BOTTOM - 10; // Stay above road bottom
