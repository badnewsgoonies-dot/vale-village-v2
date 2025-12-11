/**
 * Sprite Manifest
 * Registry of all sprite definitions
 * Auto-generated and manually curated entries
 *
 * Last updated: 2025-12-10
 */

import type { SpriteDef } from './types';

/**
 * Helper: generate a simple sprite def from a direct asset path.
 * Useful for GIFs living in /public/sprites without explicit registry entries.
 */
const makeDirectSprite = (src: string): SpriteDef => ({
  src,
  frames: 1,
});

/**
 * Overworld player directional sprites mapped by unit id.
 * Falls back to "down" if a specific facing is missing.
 */
const PLAYER_OVERWORLD_SPRITES: Record<
  string,
  { down: string; up?: string; left?: string; right?: string }
> = {
  // Venus element
  adept: {
    down: '/sprites/overworld/Isaac_Walk.gif',
    up: '/sprites/overworld/Isaac_Back.gif',
    left: '/sprites/overworld/Isaac_Walk_Left.gif',
    right: '/sprites/overworld/Isaac_Walk_Right.gif',
  },
  sentinel: {
    down: '/sprites/overworld/Piers.gif',
  },
  felix: {
    down: '/sprites/overworld/Felix_Walk.gif',
    up: '/sprites/overworld/Felix_Back.gif',
    left: '/sprites/overworld/Felix_W.gif',
    right: '/sprites/overworld/Felix_E.gif',
  },

  // Mars element
  'war-mage': {
    down: '/sprites/overworld/Garet.gif',
    up: '/sprites/overworld/Garet_Back.gif',
    left: '/sprites/overworld/Garet_Left.gif',
    right: '/sprites/overworld/Garet_Right.gif',
  },
  blaze: {
    down: '/sprites/overworld/Jenna_Walk.gif',
    up: '/sprites/overworld/Jenna_Back.gif',
    left: '/sprites/overworld/Jenna_Left.gif',
    right: '/sprites/overworld/Jenna_Right.gif',
  },
  tyrell: {
    down: '/sprites/overworld/Young_Garet_Walk_Down.gif',
    up: '/sprites/overworld/Young_Garet_Up.gif',
    left: '/sprites/overworld/Young_Garet_Walk_Right.gif', // Mirror for left
    right: '/sprites/overworld/Young_Garet_Walk_Right.gif',
  },

  // Mercury element
  mystic: {
    down: '/sprites/overworld/Mia.gif',
    up: '/sprites/overworld/Mia_Back.gif',
    left: '/sprites/overworld/Mia_Left.gif',
    right: '/sprites/overworld/Mia_Right.gif',
  },
  karis: {
    down: '/sprites/overworld/Ivan.gif',
    up: '/sprites/overworld/Ivan_Back.gif',
    left: '/sprites/overworld/Ivan_Left.gif',
    right: '/sprites/overworld/Ivan_Right.gif',
  },

  // Jupiter element
  ranger: {
    down: '/sprites/overworld/Ivan.gif',
    up: '/sprites/overworld/Ivan_Back.gif',
    left: '/sprites/overworld/Ivan_Left.gif',
    right: '/sprites/overworld/Ivan_Right.gif',
  },
  stormcaller: {
    down: '/sprites/overworld/Sheba.gif',
  },
};

/**
 * Battle sprite mappings - maps unit IDs to battle sprite directories
 */
const BATTLE_SPRITE_DIRS: Record<string, string> = {
  adept: '/sprites/battle/party/isaac',
  'war-mage': '/sprites/battle/party/garet',
  mystic: '/sprites/battle/party/mia',
  ranger: '/sprites/battle/party/ivan',
  sentinel: '/sprites/battle/party/piers',
  stormcaller: '/sprites/battle/party/sheba',
  blaze: '/sprites/battle/party/jenna',
  karis: '/sprites/battle/party/ivan',
  tyrell: '/sprites/battle/party/young',
  felix: '/sprites/battle/party/felix',
};

/**
 * Sprite manifest
 * Maps sprite IDs to definitions
 */
export const SPRITES: Record<string, SpriteDef> = {
  // ========================================
  // Player Units - Placeholder icons for UI
  // ========================================
  'unit:adept': {
    src: '/sprites/placeholders/adept.png',
    frames: 1,
    frameWidth: 32,
    frameHeight: 32,
  },
  'unit:war-mage': {
    src: '/sprites/placeholders/war_mage.png',
    frames: 1,
    frameWidth: 32,
    frameHeight: 32,
  },
  'unit:mystic': {
    src: '/sprites/placeholders/mystic.png',
    frames: 1,
    frameWidth: 32,
    frameHeight: 32,
  },
  'unit:ranger': {
    src: '/sprites/placeholders/ranger.png',
    frames: 1,
    frameWidth: 32,
    frameHeight: 32,
  },
  'unit:sentinel': {
    src: '/sprites/placeholders/sentinel.png',
    frames: 1,
    frameWidth: 32,
    frameHeight: 32,
  },
  'unit:stormcaller': {
    src: '/sprites/placeholders/stormcaller.png',
    frames: 1,
    frameWidth: 32,
    frameHeight: 32,
  },

  // ========================================
  // Enemies - Placeholder icons for UI
  // ========================================
  'enemy:slime': {
    src: '/sprites/placeholders/slime.png',
    frames: 1,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:wolf': {
    src: '/sprites/placeholders/wolf.png',
    frames: 1,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:bandit': {
    src: '/sprites/placeholders/bandit.png',
    frames: 1,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:sprite': {
    src: '/sprites/placeholders/sprite.png',
    frames: 1,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:beetle': {
    src: '/sprites/placeholders/beetle.png',
    frames: 1,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:gladiator': {
    src: '/sprites/placeholders/gladiator.png',
    frames: 1,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:elemental_guardian': {
    src: '/sprites/placeholders/elemental_guardian.png',
    frames: 1,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:guardian_shard_fire': {
    src: '/sprites/placeholders/guardian_shard_fire.png',
    frames: 1,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:guardian_shard_water': {
    src: '/sprites/placeholders/guardian_shard_water.png',
    frames: 1,
    frameWidth: 32,
    frameHeight: 32,
  },

  // ========================================
  // Djinn sprites (battle view)
  // ========================================
  'djinn:venus': makeDirectSprite('/sprites/battle/djinn/Venus_Djinn_Back.gif'),
  'djinn:mars': makeDirectSprite('/sprites/battle/djinn/Mars_Djinn_Back.gif'),
  'djinn:mercury': makeDirectSprite('/sprites/battle/djinn/Mercury_Djinn_Back.gif'),
  'djinn:jupiter': makeDirectSprite('/sprites/battle/djinn/Jupiter_Djinn_Back.gif'),

  // ========================================
  // Boss sprites
  // ========================================
  'boss:kraken': makeDirectSprite('/sprites/battle/bosses/Kraken.gif'),
  'boss:manticore': makeDirectSprite('/sprites/battle/bosses/Manticore.gif'),
  'boss:phoenix': makeDirectSprite('/sprites/battle/bosses/Navampa.gif'),
  'boss:sentinel': makeDirectSprite('/sprites/battle/bosses/Sentinel.gif'),
  'boss:poseidon': makeDirectSprite('/sprites/battle/bosses/Poseidon.gif'),
  'boss:doom-dragon': makeDirectSprite('/sprites/battle/bosses/Doom_Dragon.gif'),
};

/**
 * Resolve a player overworld sprite id of form `player-{unitId}-{facing}`
 */
function resolvePlayerSprite(id: string): SpriteDef | null {
  const match = id.match(/^player-(.+)-(up|down|left|right)$/);
  if (!match) return null;

  const unitId = match[1] ?? 'adept';
  const facing = (match[2] as 'up' | 'down' | 'left' | 'right') ?? 'down';
  const mapping = PLAYER_OVERWORLD_SPRITES[unitId] ?? PLAYER_OVERWORLD_SPRITES['adept'];
  if (!mapping) return null;

  const src =
    (facing === 'up' && mapping.up) ||
    (facing === 'left' && mapping.left) ||
    (facing === 'right' && mapping.right) ||
    mapping.down;

  if (!src) return null;

  return makeDirectSprite(src);
}

/**
 * Resolve a battle sprite for a unit
 * Format: `battle-{unitId}-{state}` where state is idle|attack|hurt|cast|downed
 */
function resolveBattleSprite(id: string): SpriteDef | null {
  const match = id.match(/^battle-(.+)-(idle|attack|hurt|cast|downed)$/);
  if (!match) return null;

  const unitId = match[1] ?? 'adept';
  const state = match[2] ?? 'idle';
  const dir = BATTLE_SPRITE_DIRS[unitId];
  if (!dir) return null;

  // Map state to file suffix - using lSword variant as default
  const charName = dir.split('/').pop() ?? 'isaac';
  const capitalName = charName.charAt(0).toUpperCase() + charName.slice(1);

  const stateToFile: Record<string, string> = {
    idle: `${capitalName}_lSword_Front.gif`,
    attack: `${capitalName}_lSword_Attack1.gif`,
    hurt: `${capitalName}_lSword_HitFront.gif`,
    cast: `${capitalName}_lSword_CastFront1.gif`,
    downed: `${capitalName}_lSword_DownedFront.gif`,
  };

  const fileName = stateToFile[state];
  if (!fileName) return null;

  return makeDirectSprite(`${dir}/${fileName}`);
}

/**
 * Get sprite definition by ID
 */
export function getSpriteDef(id: string): SpriteDef | null {
  // 1) Player overworld sprites
  const player = resolvePlayerSprite(id);
  if (player) return player;

  // 2) Battle sprites
  const battle = resolveBattleSprite(id);
  if (battle) return battle;

  // 3) Direct asset paths (e.g., /sprites/overworld/Felix.gif)
  if (id.startsWith('/sprites/')) {
    return makeDirectSprite(id);
  }

  // 4) Manifest entries
  return SPRITES[id] ?? null;
}

/**
 * Check if sprite exists in manifest or can be resolved dynamically
 */
export function hasSprite(id: string): boolean {
  return Boolean(
    resolvePlayerSprite(id) ||
    resolveBattleSprite(id) ||
    id.startsWith('/sprites/') ||
    SPRITES[id]
  );
}

/**
 * Get all registered sprite IDs (static entries only)
 */
export function getAllSpriteIds(): string[] {
  return Object.keys(SPRITES);
}

/**
 * Get overworld sprite for a unit by ID and facing
 */
export function getOverworldSprite(unitId: string, facing: 'up' | 'down' | 'left' | 'right' = 'down'): string {
  const mapping = PLAYER_OVERWORLD_SPRITES[unitId] ?? PLAYER_OVERWORLD_SPRITES['adept'];
  if (!mapping) return '/sprites/overworld/Isaac_Walk.gif';

  return (
    (facing === 'up' && mapping.up) ||
    (facing === 'left' && mapping.left) ||
    (facing === 'right' && mapping.right) ||
    mapping.down
  );
}
