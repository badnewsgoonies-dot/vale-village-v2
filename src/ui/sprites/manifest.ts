/**
 * Sprite Manifest
 * Registry of all sprite definitions
 * Placeholder entries for VS-0 entities
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
  adept: {
    down: '/sprites/overworld/Isaac_Walk.gif',
    up: '/sprites/overworld/Isaac_Back.gif',
    left: '/sprites/overworld/Isaac_Walk_Left.gif',
    right: '/sprites/overworld/Isaac_Walk_Right.gif',
  },
  'war-mage': {
    down: '/sprites/overworld/Garet.gif',
    up: '/sprites/overworld/Garet_Back.gif',
    left: '/sprites/overworld/Garet_Left.gif',
    right: '/sprites/overworld/Garet_Right.gif',
  },
  mystic: {
    down: '/sprites/overworld/Mia.gif',
    up: '/sprites/overworld/Mia_Back.gif',
    left: '/sprites/overworld/Mia_Left.gif',
    right: '/sprites/overworld/Mia_Right.gif',
  },
  ranger: {
    down: '/sprites/overworld/Ivan.gif',
    up: '/sprites/overworld/Ivan_Back.gif',
    left: '/sprites/overworld/Ivan_Left.gif',
    right: '/sprites/overworld/Ivan_Right.gif',
  },
  sentinel: {
    down: '/sprites/overworld/Piers.gif',
  },
  stormcaller: {
    down: '/sprites/overworld/Sheba.gif',
  },
  blaze: {
    down: '/sprites/overworld/Jenna_Walk.gif',
    up: '/sprites/overworld/Jenna_Back.gif',
    left: '/sprites/overworld/Jenna_Left.gif',
    right: '/sprites/overworld/Jenna_Right.gif',
  },
  karis: {
    down: '/sprites/overworld/Ivan.gif',
    up: '/sprites/overworld/Ivan_Back.gif',
    left: '/sprites/overworld/Ivan_Left.gif',
    right: '/sprites/overworld/Ivan_Right.gif',
  },
  tyrell: {
    down: '/sprites/overworld/Young_Garet_Walk_Down.gif',
    up: '/sprites/overworld/Young_Garet_Up.gif',
    left: '/sprites/overworld/Young_Garet_Walk_Right.gif',
    right: '/sprites/overworld/Young_Garet_Walk_Right.gif',
  },
  felix: {
    down: '/sprites/overworld/Felix_Walk.gif',
    up: '/sprites/overworld/Felix_Back.gif',
    left: '/sprites/overworld/Felix_W.gif',
    right: '/sprites/overworld/Felix_E.gif',
  },
};

/**
 * Sprite manifest
 * Maps sprite IDs to definitions
 */
export const SPRITES: Record<string, SpriteDef> = {
  // Player Units (6 GP units)
  'unit:adept': {
    src: '/sprites/placeholders/adept.png',
    frames: 8,
    fps: 12,
    frameWidth: 32,
    frameHeight: 32,
  },
  'unit:war-mage': {
    src: '/sprites/placeholders/war_mage.png',
    frames: 8,
    fps: 12,
    frameWidth: 32,
    frameHeight: 32,
  },
  'unit:mystic': {
    src: '/sprites/placeholders/mystic.png',
    frames: 8,
    fps: 12,
    frameWidth: 32,
    frameHeight: 32,
  },
  'unit:ranger': {
    src: '/sprites/placeholders/ranger.png',
    frames: 8,
    fps: 12,
    frameWidth: 32,
    frameHeight: 32,
  },
  'unit:sentinel': {
    src: '/sprites/placeholders/sentinel.png',
    frames: 8,
    fps: 12,
    frameWidth: 32,
    frameHeight: 32,
  },
  'unit:stormcaller': {
    src: '/sprites/placeholders/stormcaller.png',
    frames: 8,
    fps: 12,
    frameWidth: 32,
    frameHeight: 32,
  },

  // Enemies (8 GP enemies)
  'enemy:slime': {
    src: '/sprites/placeholders/slime.png',
    frames: 6,
    fps: 10,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:wolf': {
    src: '/sprites/placeholders/wolf.png',
    frames: 6,
    fps: 10,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:bandit': {
    src: '/sprites/placeholders/bandit.png',
    frames: 6,
    fps: 10,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:sprite': {
    src: '/sprites/placeholders/sprite.png',
    frames: 6,
    fps: 10,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:beetle': {
    src: '/sprites/placeholders/beetle.png',
    frames: 6,
    fps: 10,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:gladiator': {
    src: '/sprites/placeholders/gladiator.png',
    frames: 8,
    fps: 12,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:elemental_guardian': {
    src: '/sprites/placeholders/elemental_guardian.png',
    frames: 8,
    fps: 12,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:guardian_shard_fire': {
    src: '/sprites/placeholders/guardian_shard_fire.png',
    frames: 4,
    fps: 8,
    frameWidth: 32,
    frameHeight: 32,
  },
  'enemy:guardian_shard_water': {
    src: '/sprites/placeholders/guardian_shard_water.png',
    frames: 4,
    fps: 8,
    frameWidth: 32,
    frameHeight: 32,
  },
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
 * Get sprite definition by ID
 */
export function getSpriteDef(id: string): SpriteDef | null {
  // 1) Player overworld sprites
  const player = resolvePlayerSprite(id);
  if (player) return player;

  // 2) Direct asset paths (e.g., /sprites/overworld/Felix.gif)
  if (id.startsWith('/sprites/')) {
    return makeDirectSprite(id);
  }

  // 3) Manifest entries
  return SPRITES[id] ?? null;
}

/**
 * Check if sprite exists in manifest or can be resolved dynamically
 */
export function hasSprite(id: string): boolean {
  return Boolean(resolvePlayerSprite(id) || id.startsWith('/sprites/') || SPRITES[id]);
}
