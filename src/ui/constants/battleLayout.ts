// Centralized battle layout and animation constants
// Keep numbers descriptive and unit-tested where possible

export const BATTLE_WIDTH = 1280;
export const BATTLE_HEIGHT = 720;
export const BATTLE_PADDING_X = 12;
export const BATTLE_PADDING_Y = 8;
export const BATTLE_GAP = 4;

export const TOP_HUD_HEIGHT = 80;
export const TOP_ROW_HEIGHT = 220;
export const BOTTOM_ROW_HEIGHT = 210;

export const TURN_ORDER_UNIT_SIZE = 40;
export const UNIT_CARD_SPRITE_SIZE = 36;
export const BATTLE_UNIT_SIZE = 48;

export const SPRITE_SIZE_SMALL = 32;
export const SPRITE_SIZE_MEDIUM = 48;
export const SPRITE_SIZE_LARGE = 64;

export const ACTION_SLOT_MIN_HEIGHT = 52;
export const ACTION_QUEUE_COLUMNS = 4;

export const MANA_ORB_SIZE = 10;

// Animation timing (ms) - keep these in sync with src/ui/constants/animationTiming.ts
export const UNIT_SHAKE_MS = 300;
export const UNIT_DAMAGE_SHAKE_MS = 240;
export const DAMAGE_FLOAT_MS = 1000;
export const PSYNERGY_BURST_MS = 900;

export const BATTLE_LOG_MAX_HEIGHT = 110;

// Z-index ordering used throughout battle UI. Preserve relative ordering when refactoring.
export const Z_INDEX = {
  BACKGROUND: 0,
  SPRITES: 10,
  HUD: 40,
  BATTLE_LOG: 45,
  BOTTOM_BAR: 50,
  MODE_LABEL: 55,
  TARGET_MODAL: 60,
  RESOLVING_CARD: 80,
  FX_CARD: 90,
} as const;

export type ZIndexName = keyof typeof Z_INDEX;

export default {
  BATTLE_WIDTH,
  BATTLE_HEIGHT,
  BATTLE_PADDING_X,
  BATTLE_PADDING_Y,
  BATTLE_GAP,
  TOP_HUD_HEIGHT,
  TOP_ROW_HEIGHT,
  BOTTOM_ROW_HEIGHT,
  TURN_ORDER_UNIT_SIZE,
  UNIT_CARD_SPRITE_SIZE,
  BATTLE_UNIT_SIZE,
  SPRITE_SIZE_SMALL,
  SPRITE_SIZE_MEDIUM,
  SPRITE_SIZE_LARGE,
  ACTION_SLOT_MIN_HEIGHT,
  ACTION_QUEUE_COLUMNS,
  MANA_ORB_SIZE,
  UNIT_SHAKE_MS,
  UNIT_DAMAGE_SHAKE_MS,
  DAMAGE_FLOAT_MS,
  PSYNERGY_BURST_MS,
  BATTLE_LOG_MAX_HEIGHT,
  Z_INDEX,
};
