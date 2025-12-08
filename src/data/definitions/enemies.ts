/**
 * Enemy definitions - Liberation of Vale Village
 * These will be validated against EnemySchema at startup
 *
 * Chapter 1: 50 unique enemies
 * - Enslaved Beasts (redesigned originals + new variants): 12 types
 * - Slavers (elemental specialists): 20 types
 * - Legendary Enslaved (elite): 9 types
 * - Boss Enemies: 9 types
 *
 * ALL ENEMIES ARE ELEMENTAL (Venus/Mars/Mercury/Jupiter)
 * NO NEUTRAL ELEMENT
 */
import type { Enemy } from '../schemas/EnemySchema';
import { unitDefinitionToEnemy } from '../../core/utils/unitToEnemy';
import { UNIT_DEFINITIONS } from './units';
import {
  STRIKE,
  HEAVY_STRIKE,
  GUARD_BREAK,
  GUST,
  BLIND,
  FIREBALL,
  ICE_SHARD,
  QUAKE,
  BOOST_ATK,
  BOOST_DEF,
  POISON_STRIKE,
  BURN_TOUCH,
  FREEZE_BLAST,
  PARALYZE_SHOCK,
  PRECISE_JAB,
  CHAIN_LIGHTNING,
  WEAKEN_DEF,
  HEAL,
  PARTY_HEAL,
} from './abilities';

// ============================================================================
// ENSLAVED BEASTS - Tier 1 (Redesigned Originals)
// ============================================================================

export const MERCURY_SLIME: Enemy = {
  id: 'mercury-slime',
  name: 'Mercury Slime',
  level: 1,
  element: 'Mercury',
  stats: {
    hp: 40,
    pp: 8,
    atk: 4,
    def: 5,
    mag: 6,
    spd: 5,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
  ],
  baseXp: 12,
  baseGold: 6,
};

export const VENUS_WOLF: Enemy = {
  id: 'venus-wolf',
  name: 'Earthbound Wolf',
  level: 1,
  element: 'Venus',
  stats: {
    hp: 275, // Increased from 55 (5x) for longer battles (target: 10-20 turns)
    pp: 8,
    atk: 16, // Increased from 11 to encourage defensive play
    def: 7,
    mag: 3,
    spd: 11,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
  ],
  baseXp: 16,
  baseGold: 8,
};

export const MARS_BANDIT: Enemy = {
  id: 'mars-bandit',
  name: 'Flame Bandit',
  level: 2,
  element: 'Mars',
  stats: {
    hp: 60,
    pp: 12,
    atk: 13,
    def: 6,
    mag: 8,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
  ],
  baseXp: 20,
  baseGold: 12,
};

export const JUPITER_SPRITE: Enemy = {
  id: 'jupiter-sprite',
  name: 'Wind Sprite',
  level: 2,
  element: 'Jupiter',
  stats: {
    hp: 45,
    pp: 15,
    atk: 5,
    def: 5,
    mag: 14,
    spd: 17,
  },
  abilities: [
    { ...GUST, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
  ],
  baseXp: 18,
  baseGold: 10,
};

export const VENUS_BEETLE: Enemy = {
  id: 'venus-beetle',
  name: 'Stone Beetle',
  level: 2,
  element: 'Venus',
  stats: {
    hp: 80,
    pp: 8,
    atk: 8,
    def: 15,
    mag: 3,
    spd: 6,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
  ],
  baseXp: 22,
  baseGold: 12,
};

// ============================================================================
// ENSLAVED BEASTS - Extended Wolf Pack
// ============================================================================

export const MARS_WOLF: Enemy = {
  id: 'mars-wolf',
  name: 'Flame Wolf',
  level: 2,
  element: 'Mars',
  stats: {
    hp: 290, // Increased from 58 (5x) for longer battles (target: 10-20 turns)
    pp: 10,
    atk: 18, // Increased from 12 to encourage defensive play
    def: 6,
    mag: 5,
    spd: 13,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
  ],
  baseXp: 18,
  baseGold: 9,
};

export const MERCURY_WOLF: Enemy = {
  id: 'mercury-wolf',
  name: 'Frost Wolf',
  level: 2,
  element: 'Mercury',
  stats: {
    hp: 280, // Increased from 56 (5x) for longer battles (target: 10-20 turns)
    pp: 12,
    atk: 17, // Increased from 10 to encourage defensive play
    def: 7,
    mag: 6,
    spd: 14,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
  ],
  baseXp: 18,
  baseGold: 9,
};

// ============================================================================
// COUNTER-STRATEGY ENEMIES - Support Roles (NEW from enemies_v2.ts)
// ============================================================================

/**
 * FROST MYSTIC - First Healer (House 4)
 * Role: Low-HP healer that forces focus-fire priority
 */
export const FROST_MYSTIC: Enemy = {
  id: 'frost-mystic',
  name: 'Frost Mystic',
  level: 2,
  element: 'Mercury',
  stats: {
    hp: 200,
    pp: 20,
    atk: 10,
    def: 8,
    mag: 12,
    spd: 11,
  },
  abilities: [
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 22,
  baseGold: 12,
};

/**
 * GALE PRIEST - Second Healer (House 5)
 * Role: Healer with debuff (BLIND)
 */
export const GALE_PRIEST: Enemy = {
  id: 'gale-priest',
  name: 'Gale Priest',
  level: 2,
  element: 'Jupiter',
  stats: {
    hp: 180,
    pp: 22,
    atk: 8,
    def: 7,
    mag: 14,
    spd: 13,
  },
  abilities: [
    { ...GUST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
  ],
  baseXp: 24,
  baseGold: 14,
};

/**
 * STONE GUARDIAN - Tank (House 6)
 * Role: High DEF tank that buffs itself
 */
export const STONE_GUARDIAN: Enemy = {
  id: 'stone-guardian',
  name: 'Stone Guardian',
  level: 3,
  element: 'Venus',
  stats: {
    hp: 350,
    pp: 10,
    atk: 12,
    def: 20,
    mag: 5,
    spd: 6,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
  ],
  baseXp: 30,
  baseGold: 16,
};

/**
 * EMBER CLERIC - Healer for Tank (House 6)
 * Role: Heals Stone Guardian, creating tank+healer duo
 */
export const EMBER_CLERIC: Enemy = {
  id: 'ember-cleric',
  name: 'Ember Cleric',
  level: 3,
  element: 'Mars',
  stats: {
    hp: 190,
    pp: 18,
    atk: 9,
    def: 8,
    mag: 11,
    spd: 10,
  },
  abilities: [
    { ...FIREBALL, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 26,
  baseGold: 14,
};

/**
 * EARTH SHAMAN - Buffer + Healer (House 7)
 * Role: Buffs + heals allies, AoE damage
 */
export const EARTH_SHAMAN: Enemy = {
  id: 'earth-shaman',
  name: 'Earth Shaman',
  level: 4,
  element: 'Venus',
  stats: {
    hp: 220,
    pp: 25,
    atk: 10,
    def: 14,
    mag: 16,
    spd: 9,
  },
  abilities: [
    { ...QUAKE, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 45,
  baseGold: 22,
};

/**
 * TIDE ENCHANTER - Buffer + Healer (House 8)
 * Role: Buffs + heals Jupiter Bear
 */
export const TIDE_ENCHANTER: Enemy = {
  id: 'tide-enchanter',
  name: 'Tide Enchanter',
  level: 4,
  element: 'Mercury',
  stats: {
    hp: 240,
    pp: 30,
    atk: 11,
    def: 13,
    mag: 18,
    spd: 10,
  },
  abilities: [
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 50,
  baseGold: 24,
};

/**
 * FROST ORACLE - Party Healer (House 9)
 * Role: Party-wide healing creates endurance battle
 */
export const FROST_ORACLE: Enemy = {
  id: 'frost-oracle',
  name: 'Frost Oracle',
  level: 5,
  element: 'Mercury',
  stats: {
    hp: 200,
    pp: 35,
    atk: 10,
    def: 12,
    mag: 20,
    spd: 11,
  },
  abilities: [
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },
  ],
  baseXp: 55,
  baseGold: 26,
};

/**
 * TERRA WARDEN - Buffer + Tank + Healer (House 11)
 * Role: Buffs both allies' ATK/DEF + heals
 */
export const TERRA_WARDEN: Enemy = {
  id: 'terra-warden',
  name: 'Terra Warden',
  level: 6,
  element: 'Venus',
  stats: {
    hp: 260,
    pp: 28,
    atk: 16,
    def: 16,
    mag: 14,
    spd: 9,
  },
  abilities: [
    { ...QUAKE, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 58,
  baseGold: 28,
};

/**
 * FLAME HERALD - Buffer + Debuffer (House 12)
 * Role: Buffs Phoenix ATK, debuffs player DEF
 */
export const FLAME_HERALD: Enemy = {
  id: 'flame-herald',
  name: 'Flame Herald',
  level: 7,
  element: 'Mars',
  stats: {
    hp: 220,
    pp: 32,
    atk: 18,
    def: 14,
    mag: 20,
    spd: 13,
  },
  abilities: [
    { ...FIREBALL, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
  ],
  baseXp: 70,
  baseGold: 35,
};

export const JUPITER_WOLF: Enemy = {
  id: 'jupiter-wolf',
  name: 'Storm Wolf',
  level: 2,
  element: 'Jupiter',
  stats: {
    hp: 260, // Increased from 52 (5x) for longer battles (target: 10-20 turns)
    pp: 11,
    atk: 18, // Increased from 11 to encourage defensive play
    def: 6,
    mag: 7,
    spd: 16,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...PRECISE_JAB, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
  ],
  baseXp: 18,
  baseGold: 9,
};

// ============================================================================
// ENSLAVED BEASTS - Bear Variants
// ============================================================================

export const VENUS_BEAR: Enemy = {
  id: 'venus-bear',
  name: 'Mountain Bear',
  level: 4,
  element: 'Venus',
  stats: {
    hp: 110,
    pp: 12,
    atk: 14,
    def: 18,
    mag: 6,
    spd: 8,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
  ],
  baseXp: 35,
  baseGold: 18,
};

export const MARS_BEAR: Enemy = {
  id: 'mars-bear',
  name: 'Inferno Bear',
  level: 4,
  element: 'Mars',
  stats: {
    hp: 105,
    pp: 14,
    atk: 16,
    def: 16,
    mag: 8,
    spd: 9,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
  ],
  baseXp: 35,
  baseGold: 18,
};

export const MERCURY_BEAR: Enemy = {
  id: 'mercury-bear',
  name: 'Glacier Bear',
  level: 4,
  element: 'Mercury',
  stats: {
    hp: 115,
    pp: 13,
    atk: 13,
    def: 19,
    mag: 7,
    spd: 7,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
  ],
  baseXp: 35,
  baseGold: 18,
};

export const JUPITER_BEAR: Enemy = {
  id: 'jupiter-bear',
  name: 'Thunder Bear',
  level: 4,
  element: 'Jupiter',
  stats: {
    hp: 100,
    pp: 15,
    atk: 15,
    def: 15,
    mag: 10,
    spd: 12,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
  ],
  baseXp: 35,
  baseGold: 18,
};

// ============================================================================
// SLAVERS - Tier 1 Scouts (Level 1-2)
// ============================================================================

export const EARTH_SCOUT: Enemy = {
  id: 'earth-scout',
  name: 'Earth Scout',
  level: 1,
  element: 'Venus',
  stats: {
    hp: 250, // Increased from 50 (5x) for longer battles (target: 10-20 turns)
    pp: 10,
    atk: 14, // Increased from 9 to encourage defensive play
    def: 8,
    mag: 5,
    spd: 8,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
  ],
  baseXp: 15,
  baseGold: 10,
};

export const FLAME_SCOUT: Enemy = {
  id: 'flame-scout',
  name: 'Flame Scout',
  level: 1,
  element: 'Mars',
  stats: {
    hp: 225, // Increased from 45 (5x) for longer battles (target: 10-20 turns)
    pp: 12,
    atk: 15, // Increased from 10 to encourage defensive play
    def: 6,
    mag: 8,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
  ],
  baseXp: 15,
  baseGold: 10,
};

export const FROST_SCOUT: Enemy = {
  id: 'frost-scout',
  name: 'Frost Scout',
  level: 1,
  element: 'Mercury',
  stats: {
    hp: 240, // Increased from 48 (5x) for longer battles (target: 10-20 turns)
    pp: 11,
    atk: 14, // Increased from 8 to encourage defensive play
    def: 7,
    mag: 7,
    spd: 9,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
  ],
  baseXp: 15,
  baseGold: 10,
};

export const GALE_SCOUT: Enemy = {
  id: 'gale-scout',
  name: 'Gale Scout',
  level: 1,
  element: 'Jupiter',
  stats: {
    hp: 210, // Increased from 42 (5x) for longer battles (target: 10-20 turns)
    pp: 13,
    atk: 15, // Increased from 9 to encourage defensive play
    def: 6,
    mag: 9,
    spd: 12,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
  ],
  baseXp: 15,
  baseGold: 10,
};

// ============================================================================
// SLAVERS - Tier 2 Soldiers (Level 3-4)
// ============================================================================

export const TERRA_SOLDIER: Enemy = {
  id: 'terra-soldier',
  name: 'Terra Soldier',
  level: 3,
  element: 'Venus',
  stats: {
    hp: 85,
    pp: 15,
    atk: 14,
    def: 13,
    mag: 7,
    spd: 9,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
  ],
  baseXp: 28,
  baseGold: 16,
};

export const BLAZE_SOLDIER: Enemy = {
  id: 'blaze-soldier',
  name: 'Blaze Soldier',
  level: 3,
  element: 'Mars',
  stats: {
    hp: 75,
    pp: 18,
    atk: 15,
    def: 10,
    mag: 12,
    spd: 11,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
  ],
  baseXp: 28,
  baseGold: 16,
};

export const TIDE_SOLDIER: Enemy = {
  id: 'tide-soldier',
  name: 'Tide Soldier',
  level: 3,
  element: 'Mercury',
  stats: {
    hp: 80,
    pp: 16,
    atk: 12,
    def: 12,
    mag: 10,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
  ],
  baseXp: 28,
  baseGold: 16,
};

export const WIND_SOLDIER: Enemy = {
  id: 'wind-soldier',
  name: 'Wind Soldier',
  level: 3,
  element: 'Jupiter',
  stats: {
    hp: 70,
    pp: 20,
    atk: 13,
    def: 9,
    mag: 13,
    spd: 14,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
  ],
  baseXp: 28,
  baseGold: 16,
};

// ============================================================================
// SLAVERS - Tier 3 Captains (Level 5-6)
// ============================================================================

export const STONE_CAPTAIN: Enemy = {
  id: 'stone-captain',
  name: 'Stone Captain',
  level: 5,
  element: 'Venus',
  stats: {
    hp: 130,
    pp: 20,
    atk: 18,
    def: 18,
    mag: 10,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
  ],
  baseXp: 50,
  baseGold: 28,
};

export const INFERNO_CAPTAIN: Enemy = {
  id: 'inferno-captain',
  name: 'Inferno Captain',
  level: 5,
  element: 'Mars',
  stats: {
    hp: 115,
    pp: 25,
    atk: 20,
    def: 14,
    mag: 16,
    spd: 12,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
  ],
  baseXp: 50,
  baseGold: 28,
};

export const GLACIER_CAPTAIN: Enemy = {
  id: 'glacier-captain',
  name: 'Glacier Captain',
  level: 5,
  element: 'Mercury',
  stats: {
    hp: 125,
    pp: 22,
    atk: 16,
    def: 16,
    mag: 14,
    spd: 11,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 50,
  baseGold: 28,
};

export const THUNDER_CAPTAIN: Enemy = {
  id: 'thunder-captain',
  name: 'Thunder Captain',
  level: 5,
  element: 'Jupiter',
  stats: {
    hp: 110,
    pp: 28,
    atk: 17,
    def: 13,
    mag: 18,
    spd: 15,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
  ],
  baseXp: 50,
  baseGold: 28,
};

// ============================================================================
// SLAVERS - Tier 4 Commanders (Level 7-8)
// ============================================================================

export const MOUNTAIN_COMMANDER: Enemy = {
  id: 'mountain-commander',
  name: 'Mountain Commander',
  level: 7,
  element: 'Venus',
  stats: {
    hp: 180,
    pp: 28,
    atk: 22,
    def: 24,
    mag: 14,
    spd: 11,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
  ],
  baseXp: 75,
  baseGold: 40,
};

export const FIRE_COMMANDER: Enemy = {
  id: 'fire-commander',
  name: 'Fire Commander',
  level: 7,
  element: 'Mars',
  stats: {
    hp: 160,
    pp: 35,
    atk: 24,
    def: 18,
    mag: 22,
    spd: 13,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
  ],
  baseXp: 75,
  baseGold: 40,
};

export const STORM_COMMANDER: Enemy = {
  id: 'storm-commander',
  name: 'Storm Commander',
  level: 7,
  element: 'Mercury',
  stats: {
    hp: 170,
    pp: 30,
    atk: 20,
    def: 20,
    mag: 20,
    spd: 12,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
  ],
  baseXp: 75,
  baseGold: 40,
};

export const LIGHTNING_COMMANDER: Enemy = {
  id: 'lightning-commander',
  name: 'Lightning Commander',
  level: 7,
  element: 'Jupiter',
  stats: {
    hp: 150,
    pp: 38,
    atk: 21,
    def: 16,
    mag: 24,
    spd: 18,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
  ],
  baseXp: 75,
  baseGold: 40,
};

// ============================================================================
// SLAVERS - Tier 5 Warlords (Level 9-10) - Mini-Bosses
// ============================================================================

export const GRANITE_WARLORD: Enemy = {
  id: 'granite-warlord',
  name: 'Granite Warlord',
  level: 9,
  element: 'Venus',
  stats: {
    hp: 250,
    pp: 35,
    atk: 28,
    def: 30,
    mag: 18,
    spd: 12,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 120,
  baseGold: 60,
};

export const VOLCANO_WARLORD: Enemy = {
  id: 'volcano-warlord',
  name: 'Volcano Warlord',
  level: 9,
  element: 'Mars',
  stats: {
    hp: 220,
    pp: 45,
    atk: 30,
    def: 22,
    mag: 28,
    spd: 14,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
  ],
  baseXp: 120,
  baseGold: 60,
};

export const BLIZZARD_WARLORD: Enemy = {
  id: 'blizzard-warlord',
  name: 'Blizzard Warlord',
  level: 9,
  element: 'Mercury',
  stats: {
    hp: 240,
    pp: 40,
    atk: 24,
    def: 26,
    mag: 24,
    spd: 13,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
  ],
  baseXp: 120,
  baseGold: 60,
};

export const TEMPEST_WARLORD: Enemy = {
  id: 'tempest-warlord',
  name: 'Tempest Warlord',
  level: 9,
  element: 'Jupiter',
  stats: {
    hp: 210,
    pp: 50,
    atk: 26,
    def: 20,
    mag: 30,
    spd: 20,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
  ],
  baseXp: 120,
  baseGold: 60,
};

// ============================================================================
// LEGENDARY ENSLAVED - Elemental Pure Forms
// ============================================================================

export const ROCK_ELEMENTAL: Enemy = {
  id: 'rock-elemental',
  name: 'Rock Elemental',
  level: 6,
  element: 'Venus',
  stats: {
    hp: 140,
    pp: 20,
    atk: 16,
    def: 22,
    mag: 12,
    spd: 8,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
  ],
  baseXp: 45,
  baseGold: 24,
};

export const FLAME_ELEMENTAL: Enemy = {
  id: 'flame-elemental',
  name: 'Flame Elemental',
  level: 6,
  element: 'Mars',
  stats: {
    hp: 180,   // CHANGED from 120 - first phase-change boss
    pp: 35,    // CHANGED from 28
    atk: 14,
    def: 14,
    mag: 24,   // CHANGED from 20
    spd: 14,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },    // ADDED - Phase 1: buffs self
    { ...WEAKEN_DEF, unlockLevel: 1 },   // ADDED - Phase 2: debuffs player
  ],
  baseXp: 60,   // CHANGED from 45
  baseGold: 30, // CHANGED from 24
};

export const ICE_ELEMENTAL: Enemy = {
  id: 'ice-elemental',
  name: 'Ice Elemental',
  level: 6,
  element: 'Mercury',
  stats: {
    hp: 130,
    pp: 24,
    atk: 12,
    def: 18,
    mag: 18,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 }, // ADDED - creates double-healer synergy with Frost Oracle
  ],
  baseXp: 45,
  baseGold: 24,
};

export const STORM_ELEMENTAL: Enemy = {
  id: 'storm-elemental',
  name: 'Storm Elemental',
  level: 6,
  element: 'Jupiter',
  stats: {
    hp: 115,
    pp: 30,
    atk: 13,
    def: 13,
    mag: 22,
    spd: 16,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
  ],
  baseXp: 45,
  baseGold: 24,
};

// ============================================================================
// LEGENDARY ENSLAVED - Mythical Beasts
// ============================================================================

export const BASILISK: Enemy = {
  id: 'basilisk',
  name: 'Basilisk',
  level: 8,
  element: 'Venus',
  stats: {
    hp: 200,
    pp: 25,
    atk: 24,
    def: 22,
    mag: 16,
    spd: 14,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...POISON_STRIKE, unlockLevel: 1 },
  ],
  baseXp: 90,
  baseGold: 50,
};

export const PHOENIX: Enemy = {
  id: 'phoenix',
  name: 'Phoenix',
  level: 8,
  element: 'Mars',
  stats: {
    hp: 240,   // CHANGED from 180 - phase-change boss with rebirth mechanic
    pp: 40,    // CHANGED from 35
    atk: 22,
    def: 18,
    mag: 28,   // CHANGED from 26
    spd: 18,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },   // ADDED - Phase 2: rebirth mode
    { ...BOOST_ATK, unlockLevel: 1 },    // ADDED - Phase 2: buffs self
  ],
  baseXp: 110,  // CHANGED from 90
  baseGold: 60, // CHANGED from 50
};

export const LEVIATHAN: Enemy = {
  id: 'leviathan',
  name: 'Leviathan',
  level: 8,
  element: 'Mercury',
  stats: {
    hp: 220,
    pp: 30,
    atk: 20,
    def: 24,
    mag: 22,
    spd: 12,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
  ],
  baseXp: 90,
  baseGold: 50,
};

export const THUNDERBIRD: Enemy = {
  id: 'thunderbird',
  name: 'Thunderbird',
  level: 8,
  element: 'Jupiter',
  stats: {
    hp: 170,
    pp: 40,
    atk: 21,
    def: 16,
    mag: 28,
    spd: 22,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
  ],
  baseXp: 90,
  baseGold: 50,
};

export const HYDRA: Enemy = {
  id: 'hydra',
  name: 'Hydra',
  level: 9,
  element: 'Mercury',
  stats: {
    hp: 280,
    pp: 35,
    atk: 26,
    def: 26,
    mag: 20,
    spd: 13,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...POISON_STRIKE, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 110,
  baseGold: 55,
};

// ============================================================================
// BOSS ENEMIES - Special Encounters
// ============================================================================

export const MARS_SPRITE: Enemy = {
  id: 'mars-sprite',
  name: 'Flame Sprite',
  level: 3,
  element: 'Mars',
  stats: {
    hp: 48,
    pp: 18,
    atk: 6,
    def: 6,
    mag: 15,
    spd: 16,
  },
  abilities: [
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
  ],
  baseXp: 20,
  baseGold: 12,
};

export const MERCURY_SPRITE: Enemy = {
  id: 'mercury-sprite',
  name: 'Frost Sprite',
  level: 3,
  element: 'Mercury',
  stats: {
    hp: 50,
    pp: 16,
    atk: 5,
    def: 7,
    mag: 14,
    spd: 15,
  },
  abilities: [
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
  ],
  baseXp: 20,
  baseGold: 12,
};

export const VENUS_SPRITE: Enemy = {
  id: 'venus-sprite',
  name: 'Stone Sprite',
  level: 3,
  element: 'Venus',
  stats: {
    hp: 55,
    pp: 14,
    atk: 6,
    def: 8,
    mag: 13,
    spd: 14,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
  ],
  baseXp: 20,
  baseGold: 12,
};

export const CHIMERA: Enemy = {
  id: 'chimera',
  name: 'Chimera',
  level: 10,
  element: 'Mars',
  stats: {
    hp: 320,
    pp: 50,
    atk: 32,
    def: 28,
    mag: 30,
    spd: 16,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...POISON_STRIKE, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
  ],
  baseXp: 200,
  baseGold: 100,
};

// ============================================================================
// CHAPTER BOSS - Overseer (Final Boss)
// ============================================================================

export const OVERSEER: Enemy = {
  id: 'overseer',
  name: 'The Overseer',
  level: 10,
  element: 'Jupiter',
  stats: {
    hp: 400,
    pp: 60,
    atk: 30,
    def: 30,
    mag: 35,
    spd: 20,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 500,
  baseGold: 250,
};

// ============================================================================
// UNDEAD CATEGORY - Reanimated Creatures
// ============================================================================

export const SKELETON_WARRIOR: Enemy = {
  id: 'skeleton-warrior',
  name: 'Skeleton Warrior',
  level: 5,
  element: 'Venus',
  stats: {
    hp: 45,
    pp: 10,
    atk: 18,
    def: 12,
    mag: 5,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
  ],
  baseXp: 42,
  baseGold: 22,
};

export const GHOST_WISP: Enemy = {
  id: 'ghost-wisp',
  name: 'Ghost Wisp',
  level: 5,
  element: 'Jupiter',
  stats: {
    hp: 35,
    pp: 18,
    atk: 12,
    def: 8,
    mag: 16,
    spd: 18,
  },
  abilities: [
    { ...GUST, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
  ],
  baseXp: 40,
  baseGold: 20,
};

export const ZOMBIE_HOUND: Enemy = {
  id: 'zombie-hound',
  name: 'Zombie Hound',
  level: 6,
  element: 'Mars',
  stats: {
    hp: 50,
    pp: 12,
    atk: 20,
    def: 10,
    mag: 6,
    spd: 15,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
  ],
  baseXp: 48,
  baseGold: 25,
};

export const BONE_MAGE: Enemy = {
  id: 'bone-mage',
  name: 'Bone Mage',
  level: 7,
  element: 'Mercury',
  stats: {
    hp: 40,
    pp: 25,
    atk: 15,
    def: 10,
    mag: 20,
    spd: 11,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
  ],
  baseXp: 60,
  baseGold: 32,
};

// ============================================================================
// GOLEM CATEGORY - Animated Constructs
// ============================================================================

export const CLAY_GOLEM: Enemy = {
  id: 'clay-golem',
  name: 'Clay Golem',
  level: 8,
  element: 'Venus',
  stats: {
    hp: 80,
    pp: 15,
    atk: 22,
    def: 20,
    mag: 8,
    spd: 6,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
  ],
  baseXp: 85,
  baseGold: 45,
};

export const IRON_GOLEM: Enemy = {
  id: 'iron-golem',
  name: 'Iron Golem',
  level: 9,
  element: 'Mars',
  stats: {
    hp: 70,
    pp: 18,
    atk: 25,
    def: 25,
    mag: 10,
    spd: 7,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
  ],
  baseXp: 105,
  baseGold: 55,
};

export const CRYSTAL_GOLEM: Enemy = {
  id: 'crystal-golem',
  name: 'Crystal Golem',
  level: 10,
  element: 'Mercury',
  stats: {
    hp: 65,
    pp: 22,
    atk: 20,
    def: 18,
    mag: 24,
    spd: 8,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
  ],
  baseXp: 115,
  baseGold: 58,
};

export const STORM_GOLEM: Enemy = {
  id: 'storm-golem',
  name: 'Storm Golem',
  level: 10,
  element: 'Jupiter',
  stats: {
    hp: 70,
    pp: 24,
    atk: 24,
    def: 16,
    mag: 22,
    spd: 9,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
  ],
  baseXp: 115,
  baseGold: 58,
};

// ============================================================================
// MERCURY BEASTS - Tier 3-4 (Mercury/Water themed)
// ============================================================================

export const FROST_SERPENT: Enemy = {
  id: 'frost-serpent',
  name: 'Frost Serpent',
  level: 7,
  element: 'Mercury',
  stats: {
    hp: 95,
    pp: 22,
    atk: 18,
    def: 14,
    mag: 20,
    spd: 16,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...POISON_STRIKE, unlockLevel: 1 },
  ],
  baseXp: 70,
  baseGold: 38,
};

export const AQUA_DRAKE: Enemy = {
  id: 'aqua-drake',
  name: 'Aqua Drake',
  level: 8,
  element: 'Mercury',
  stats: {
    hp: 135,
    pp: 28,
    atk: 22,
    def: 18,
    mag: 24,
    spd: 14,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
  ],
  baseXp: 88,
  baseGold: 46,
};

export const TIDAL_WRAITH: Enemy = {
  id: 'tidal-wraith',
  name: 'Tidal Wraith',
  level: 9,
  element: 'Mercury',
  stats: {
    hp: 120,
    pp: 35,
    atk: 18,
    def: 16,
    mag: 28,
    spd: 18,
  },
  abilities: [
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
  ],
  baseXp: 95,
  baseGold: 50,
};

export const GLACIER_WYRM: Enemy = {
  id: 'glacier-wyrm',
  name: 'Glacier Wyrm',
  level: 10,
  element: 'Mercury',
  stats: {
    hp: 180,
    pp: 32,
    atk: 26,
    def: 22,
    mag: 26,
    spd: 13,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
  ],
  baseXp: 125,
  baseGold: 65,
};

// ============================================================================
// JUPITER BEASTS - Tier 3-4 (Wind/Lightning themed)
// ============================================================================

export const STORM_RAVEN: Enemy = {
  id: 'storm-raven',
  name: 'Storm Raven',
  level: 7,
  element: 'Jupiter',
  stats: {
    hp: 75,
    pp: 25,
    atk: 16,
    def: 12,
    mag: 22,
    spd: 20,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
  ],
  baseXp: 68,
  baseGold: 36,
};

export const LIGHTNING_LYNX: Enemy = {
  id: 'lightning-lynx',
  name: 'Lightning Lynx',
  level: 8,
  element: 'Jupiter',
  stats: {
    hp: 90,
    pp: 22,
    atk: 24,
    def: 14,
    mag: 18,
    spd: 24,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...PRECISE_JAB, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
  ],
  baseXp: 85,
  baseGold: 44,
};

export const CYCLONE_DJINNI: Enemy = {
  id: 'cyclone-djinni',
  name: 'Cyclone Djinni',
  level: 9,
  element: 'Jupiter',
  stats: {
    hp: 110,
    pp: 40,
    atk: 20,
    def: 15,
    mag: 30,
    spd: 19,
  },
  abilities: [
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
  ],
  baseXp: 100,
  baseGold: 52,
};

export const TEMPEST_DRAGON: Enemy = {
  id: 'tempest-dragon',
  name: 'Tempest Dragon',
  level: 10,
  element: 'Jupiter',
  stats: {
    hp: 165,
    pp: 45,
    atk: 28,
    def: 20,
    mag: 32,
    spd: 17,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
  ],
  baseXp: 130,
  baseGold: 68,
};

// ============================================================================
// BOSS VARIANTS - Elite versions for tower floors 15-20
// ============================================================================

export const ALPHA_PHOENIX: Enemy = {
  id: 'alpha-phoenix',
  name: 'Alpha Phoenix',
  level: 11,
  element: 'Mars',
  stats: {
    hp: 280,
    pp: 50,
    atk: 32,
    def: 24,
    mag: 36,
    spd: 20,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
  ],
  baseXp: 180,
  baseGold: 95,
};

export const ELDER_BASILISK: Enemy = {
  id: 'elder-basilisk',
  name: 'Elder Basilisk',
  level: 11,
  element: 'Venus',
  stats: {
    hp: 320,
    pp: 35,
    atk: 34,
    def: 30,
    mag: 22,
    spd: 12,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...POISON_STRIKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
  ],
  baseXp: 185,
  baseGold: 98,
};

export const KRAKEN: Enemy = {
  id: 'kraken',
  name: 'Kraken',
  level: 11,
  element: 'Mercury',
  stats: {
    hp: 300,
    pp: 42,
    atk: 30,
    def: 28,
    mag: 28,
    spd: 14,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 175,
  baseGold: 92,
};

export const STORM_TITAN: Enemy = {
  id: 'storm-titan',
  name: 'Storm Titan',
  level: 12,
  element: 'Jupiter',
  stats: {
    hp: 350,
    pp: 55,
    atk: 36,
    def: 26,
    mag: 38,
    spd: 16,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
  ],
  baseXp: 200,
  baseGold: 105,
};

// ============================================================================
// TIER 5 ENEMIES - Tower Floor 15-20 Monsters
// ============================================================================

export const VOID_SPECTER: Enemy = {
  id: 'void-specter',
  name: 'Void Specter',
  level: 11,
  element: 'Jupiter',
  stats: {
    hp: 140,
    pp: 48,
    atk: 24,
    def: 18,
    mag: 34,
    spd: 22,
  },
  abilities: [
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
  ],
  baseXp: 145,
  baseGold: 76,
};

export const FROST_LICH: Enemy = {
  id: 'frost-lich',
  name: 'Frost Lich',
  level: 11,
  element: 'Mercury',
  stats: {
    hp: 155,
    pp: 55,
    atk: 22,
    def: 20,
    mag: 36,
    spd: 15,
  },
  abilities: [
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
  ],
  baseXp: 150,
  baseGold: 78,
};

export const MAGMA_COLOSSUS: Enemy = {
  id: 'magma-colossus',
  name: 'Magma Colossus',
  level: 12,
  element: 'Mars',
  stats: {
    hp: 220,
    pp: 30,
    atk: 38,
    def: 32,
    mag: 20,
    spd: 8,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
  ],
  baseXp: 160,
  baseGold: 84,
};

export const TERRA_GUARDIAN: Enemy = {
  id: 'terra-guardian',
  name: 'Terra Guardian',
  level: 12,
  element: 'Venus',
  stats: {
    hp: 250,
    pp: 28,
    atk: 32,
    def: 36,
    mag: 18,
    spd: 9,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
  ],
  baseXp: 165,
  baseGold: 86,
};

// ============================================================================
// AVIAN CATEGORY - Flying Creatures
// ============================================================================

export const WIND_HAWK: Enemy = {
  id: 'wind-hawk',
  name: 'Wind Hawk',
  level: 4,
  element: 'Jupiter',
  stats: {
    hp: 30,
    pp: 12,
    atk: 16,
    def: 6,
    mag: 12,
    spd: 20,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
  ],
  baseXp: 32,
  baseGold: 18,
};

export const FIRE_EAGLE: Enemy = {
  id: 'fire-eagle',
  name: 'Fire Eagle',
  level: 6,
  element: 'Mars',
  stats: {
    hp: 45,
    pp: 16,
    atk: 22,
    def: 10,
    mag: 18,
    spd: 17,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
  ],
  baseXp: 50,
  baseGold: 26,
};

export const ICE_OWL: Enemy = {
  id: 'ice-owl',
  name: 'Ice Owl',
  level: 7,
  element: 'Mercury',
  stats: {
    hp: 40,
    pp: 20,
    atk: 18,
    def: 12,
    mag: 20,
    spd: 15,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
  ],
  baseXp: 62,
  baseGold: 34,
};

export const STONE_ROC: Enemy = {
  id: 'stone-roc',
  name: 'Stone Roc',
  level: 9,
  element: 'Venus',
  stats: {
    hp: 90,
    pp: 22,
    atk: 28,
    def: 18,
    mag: 14,
    spd: 12,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
  ],
  baseXp: 110,
  baseGold: 56,
};

// ============================================================================
// MERCURY ELITE BOSSES - Tower Floor 15-20
// ============================================================================

export const ARCTIC_SOVEREIGN: Enemy = {
  id: 'arctic-sovereign',
  name: 'Arctic Sovereign',
  level: 13,
  element: 'Mercury',
  stats: {
    hp: 380,
    pp: 60,
    atk: 32,
    def: 34,
    mag: 40,
    spd: 18,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
  ],
  baseXp: 220,
  baseGold: 115,
};

export const NEPTUNE_WARDEN: Enemy = {
  id: 'neptune-warden',
  name: 'Neptune Warden',
  level: 14,
  element: 'Mercury',
  stats: {
    hp: 410,
    pp: 65,
    atk: 34,
    def: 36,
    mag: 42,
    spd: 16,
  },
  abilities: [
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
  ],
  baseXp: 240,
  baseGold: 125,
};

export const ABYSSAL_EMPEROR: Enemy = {
  id: 'abyssal-emperor',
  name: 'Abyssal Emperor',
  level: 15,
  element: 'Mercury',
  stats: {
    hp: 450,
    pp: 70,
    atk: 36,
    def: 40,
    mag: 44,
    spd: 17,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
  ],
  baseXp: 260,
  baseGold: 135,
};

// ============================================================================
// JUPITER ELITE BOSSES - Tower Floor 15-20
// ============================================================================

export const STRATOSPHERE_LORD: Enemy = {
  id: 'stratosphere-lord',
  name: 'Stratosphere Lord',
  level: 13,
  element: 'Jupiter',
  stats: {
    hp: 340,
    pp: 65,
    atk: 38,
    def: 24,
    mag: 42,
    spd: 22,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
  ],
  baseXp: 225,
  baseGold: 118,
};

export const ZEUS_AVATAR: Enemy = {
  id: 'zeus-avatar',
  name: 'Zeus Avatar',
  level: 14,
  element: 'Jupiter',
  stats: {
    hp: 370,
    pp: 70,
    atk: 40,
    def: 26,
    mag: 46,
    spd: 24,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
  ],
  baseXp: 245,
  baseGold: 128,
};

export const CELESTIAL_FURY: Enemy = {
  id: 'celestial-fury',
  name: 'Celestial Fury',
  level: 15,
  element: 'Jupiter',
  stats: {
    hp: 400,
    pp: 75,
    atk: 42,
    def: 28,
    mag: 50,
    spd: 26,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
  ],
  baseXp: 270,
  baseGold: 140,
};

// ============================================================================
// MERCURY TIER 5 VARIANTS - Advanced Water/Ice Enemies
// ============================================================================

export const PERMAFROST_GOLEM: Enemy = {
  id: 'permafrost-golem',
  name: 'Permafrost Golem',
  level: 13,
  element: 'Mercury',
  stats: {
    hp: 280,
    pp: 35,
    atk: 28,
    def: 38,
    mag: 26,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
  ],
  baseXp: 170,
  baseGold: 88,
};

export const TUNDRA_SERPENT: Enemy = {
  id: 'tundra-serpent',
  name: 'Tundra Serpent',
  level: 12,
  element: 'Mercury',
  stats: {
    hp: 185,
    pp: 38,
    atk: 26,
    def: 22,
    mag: 30,
    spd: 17,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...POISON_STRIKE, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
  ],
  baseXp: 155,
  baseGold: 82,
};

export const POLAR_GUARDIAN: Enemy = {
  id: 'polar-guardian',
  name: 'Polar Guardian',
  level: 13,
  element: 'Mercury',
  stats: {
    hp: 260,
    pp: 40,
    atk: 30,
    def: 32,
    mag: 28,
    spd: 14,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
  ],
  baseXp: 165,
  baseGold: 86,
};

// ============================================================================
// JUPITER TIER 5 VARIANTS - Advanced Wind/Lightning Enemies
// ============================================================================

export const VOLTAGE_CHIMERA: Enemy = {
  id: 'voltage-chimera',
  name: 'Voltage Chimera',
  level: 13,
  element: 'Jupiter',
  stats: {
    hp: 200,
    pp: 50,
    atk: 32,
    def: 20,
    mag: 38,
    spd: 25,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
  ],
  baseXp: 175,
  baseGold: 90,
};

export const MONSOON_DRAKE: Enemy = {
  id: 'monsoon-drake',
  name: 'Monsoon Drake',
  level: 12,
  element: 'Jupiter',
  stats: {
    hp: 190,
    pp: 45,
    atk: 30,
    def: 18,
    mag: 36,
    spd: 23,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
  ],
  baseXp: 158,
  baseGold: 83,
};

export const AURORA_ELEMENTAL: Enemy = {
  id: 'aurora-elemental',
  name: 'Aurora Elemental',
  level: 14,
  element: 'Jupiter',
  stats: {
    hp: 170,
    pp: 55,
    atk: 26,
    def: 22,
    mag: 44,
    spd: 27,
  },
  abilities: [
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
  ],
  baseXp: 180,
  baseGold: 94,
};

export const VORTEX_SENTINEL: Enemy = {
  id: 'vortex-sentinel',
  name: 'Vortex Sentinel',
  level: 13,
  element: 'Jupiter',
  stats: {
    hp: 210,
    pp: 48,
    atk: 34,
    def: 24,
    mag: 40,
    spd: 21,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
  ],
  baseXp: 168,
  baseGold: 87,
};

// ============================================================================
// HYBRID TIER 5 BOSSES - Multi-Element Threats
// ============================================================================

export const MAELSTROM_BEAST: Enemy = {
  id: 'maelstrom-beast',
  name: 'Maelstrom Beast',
  level: 14,
  element: 'Mercury',
  stats: {
    hp: 330,
    pp: 52,
    atk: 35,
    def: 30,
    mag: 38,
    spd: 19,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
  ],
  baseXp: 195,
  baseGold: 102,
};

export const THUNDERSTORM_COLOSSUS: Enemy = {
  id: 'thunderstorm-colossus',
  name: 'Thunderstorm Colossus',
  level: 15,
  element: 'Jupiter',
  stats: {
    hp: 310,
    pp: 60,
    atk: 40,
    def: 28,
    mag: 46,
    spd: 20,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
  ],
  baseXp: 210,
  baseGold: 110,
};

// ============================================================================
// VS1 Demo Enemies
// ============================================================================

export const BANDIT_MINION: Enemy = {
  id: 'bandit-minion',
  name: 'Bandit',
  level: 3,
  element: 'Mars',
  stats: {
    hp: 48,
    pp: 0,
    atk: 13,
    def: 8,
    mag: 5,
    spd: 9,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
  ],
  baseXp: 18,
  baseGold: 15,
};

export const BANDIT_CAPTAIN: Enemy = {
  id: 'bandit-captain',
  name: 'Bandit Captain',
  level: 4,
  element: 'Mars',
  stats: {
    hp: 90,
    pp: 0,
    atk: 16,
    def: 10,
    mag: 6,
    spd: 10,
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
  ],
  baseXp: 30,
  baseGold: 25,
};

// ============================================================================
// Recruitable Unit Enemies (generated from unit definitions)
// ============================================================================

// VS1: Garet (War Mage) - Level 2
const warMageDef = UNIT_DEFINITIONS['war-mage'];
if (!warMageDef) throw new Error('war-mage unit definition not found');
export const GARET_ENEMY = unitDefinitionToEnemy(
  warMageDef,
  2, // Level 2 for VS1
  60, // Base XP
  19, // Base Gold
  { 
    id: 'garet-enemy',
    stats: {
      // Increase HP significantly for longer battles (target: 10-20 turns)
      hp: (warMageDef.baseStats.hp + (1 * warMageDef.growthRates.hp)) * 3, // 3x HP (still tanky but within VS1 expectation)
      // Increase attack to encourage defensive play
      atk: warMageDef.baseStats.atk + (1 * warMageDef.growthRates.atk) + 4, // +4 ATK
    }
  }
);

// Sentinel - Level 3 (example for future encounters)
const sentinelDef = UNIT_DEFINITIONS['sentinel'];
if (!sentinelDef) throw new Error('sentinel unit definition not found');
export const SENTINEL_ENEMY = unitDefinitionToEnemy(
  sentinelDef,
  3, // Level 3
  80, // Base XP
  25, // Base Gold
  { id: 'sentinel-enemy' }
);

// Stormcaller - Level 3 (example for future encounters)
const stormcallerDef = UNIT_DEFINITIONS['stormcaller'];
if (!stormcallerDef) throw new Error('stormcaller unit definition not found');
export const STORMCALLER_ENEMY = unitDefinitionToEnemy(
  stormcallerDef,
  3, // Level 3
  80, // Base XP
  25, // Base Gold
  { id: 'stormcaller-enemy' }
);

// Note: Starter units (adept, mystic, ranger) can also have enemy versions
// if needed for story battles, but they're not typically recruited.
// Uncomment if needed:
// export const ADEPT_ENEMY = unitDefinitionToEnemy(UNIT_DEFINITIONS['adept'], 1, 50, 15);
// export const MYSTIC_ENEMY = unitDefinitionToEnemy(UNIT_DEFINITIONS['mystic'], 1, 50, 15);
// export const RANGER_ENEMY = unitDefinitionToEnemy(UNIT_DEFINITIONS['ranger'], 1, 50, 15);

// ============================================================================
// Export all enemies
// ============================================================================

export const ENEMIES: Record<string, Enemy> = {
  // Enslaved Beasts - Redesigned Originals
  'mercury-slime': MERCURY_SLIME,
  'venus-wolf': VENUS_WOLF,
  // Legacy/test-friendly aliases
  slime: MERCURY_SLIME,
  wolf: VENUS_WOLF,
  beetle: VENUS_BEETLE,
  'mars-bandit': MARS_BANDIT,
  'jupiter-sprite': JUPITER_SPRITE,
  'venus-beetle': VENUS_BEETLE,

  // Enslaved Beasts - Wolf Pack
  'mars-wolf': MARS_WOLF,
  'mercury-wolf': MERCURY_WOLF,
  'jupiter-wolf': JUPITER_WOLF,

  // Counter-Strategy Enemies - Support Roles (NEW from enemies_v2.ts)
  'frost-mystic': FROST_MYSTIC,
  'gale-priest': GALE_PRIEST,
  'stone-guardian': STONE_GUARDIAN,
  'ember-cleric': EMBER_CLERIC,
  'earth-shaman': EARTH_SHAMAN,
  'tide-enchanter': TIDE_ENCHANTER,
  'frost-oracle': FROST_ORACLE,
  'terra-warden': TERRA_WARDEN,
  'flame-herald': FLAME_HERALD,

  // Enslaved Beasts - Bear Variants
  'venus-bear': VENUS_BEAR,
  'mars-bear': MARS_BEAR,
  'mercury-bear': MERCURY_BEAR,
  'jupiter-bear': JUPITER_BEAR,

  // Slavers - Tier 1 Scouts
  'earth-scout': EARTH_SCOUT,
  'flame-scout': FLAME_SCOUT,
  'frost-scout': FROST_SCOUT,
  'gale-scout': GALE_SCOUT,

  // Slavers - Tier 2 Soldiers
  'terra-soldier': TERRA_SOLDIER,
  'blaze-soldier': BLAZE_SOLDIER,
  'tide-soldier': TIDE_SOLDIER,
  'wind-soldier': WIND_SOLDIER,

  // Slavers - Tier 3 Captains
  'stone-captain': STONE_CAPTAIN,
  'inferno-captain': INFERNO_CAPTAIN,
  'glacier-captain': GLACIER_CAPTAIN,
  'thunder-captain': THUNDER_CAPTAIN,

  // Slavers - Tier 4 Commanders
  'mountain-commander': MOUNTAIN_COMMANDER,
  'fire-commander': FIRE_COMMANDER,
  'storm-commander': STORM_COMMANDER,
  'lightning-commander': LIGHTNING_COMMANDER,

  // Slavers - Tier 5 Warlords (Mini-Bosses)
  'granite-warlord': GRANITE_WARLORD,
  'volcano-warlord': VOLCANO_WARLORD,
  'blizzard-warlord': BLIZZARD_WARLORD,
  'tempest-warlord': TEMPEST_WARLORD,

  // Legendary Enslaved - Elementals
  'rock-elemental': ROCK_ELEMENTAL,
  'flame-elemental': FLAME_ELEMENTAL,
  'ice-elemental': ICE_ELEMENTAL,
  'storm-elemental': STORM_ELEMENTAL,

  // Legendary Enslaved - Mythical Beasts
  basilisk: BASILISK,
  phoenix: PHOENIX,
  leviathan: LEVIATHAN,
  thunderbird: THUNDERBIRD,
  hydra: HYDRA,

  // Boss Enemies
  'mars-sprite': MARS_SPRITE,
  'mercury-sprite': MERCURY_SPRITE,
  'venus-sprite': VENUS_SPRITE,
  chimera: CHIMERA,
  overseer: OVERSEER,

  // Undead Category
  'skeleton-warrior': SKELETON_WARRIOR,
  'ghost-wisp': GHOST_WISP,
  'zombie-hound': ZOMBIE_HOUND,
  'bone-mage': BONE_MAGE,

  // Golem Category
  'clay-golem': CLAY_GOLEM,
  'iron-golem': IRON_GOLEM,
  'crystal-golem': CRYSTAL_GOLEM,
  'storm-golem': STORM_GOLEM,

  // Avian Category
  'wind-hawk': WIND_HAWK,
  'fire-eagle': FIRE_EAGLE,
  'ice-owl': ICE_OWL,
  'stone-roc': STONE_ROC,

  // Mercury Beasts (Tier 3-4)
  'frost-serpent': FROST_SERPENT,
  'aqua-drake': AQUA_DRAKE,
  'tidal-wraith': TIDAL_WRAITH,
  'glacier-wyrm': GLACIER_WYRM,

  // Jupiter Beasts (Tier 3-4)
  'storm-raven': STORM_RAVEN,
  'lightning-lynx': LIGHTNING_LYNX,
  'cyclone-djinni': CYCLONE_DJINNI,
  'tempest-dragon': TEMPEST_DRAGON,

  // Boss Variants (Tier 5)
  'alpha-phoenix': ALPHA_PHOENIX,
  'elder-basilisk': ELDER_BASILISK,
  'kraken': KRAKEN,
  'storm-titan': STORM_TITAN,

  // Tier 5 Enemies
  'void-specter': VOID_SPECTER,
  'frost-lich': FROST_LICH,
  'magma-colossus': MAGMA_COLOSSUS,
  'terra-guardian': TERRA_GUARDIAN,

  // Mercury Elite Bosses (Tower Floor 15-20)
  'arctic-sovereign': ARCTIC_SOVEREIGN,
  'neptune-warden': NEPTUNE_WARDEN,
  'abyssal-emperor': ABYSSAL_EMPEROR,

  // Jupiter Elite Bosses (Tower Floor 15-20)
  'stratosphere-lord': STRATOSPHERE_LORD,
  'zeus-avatar': ZEUS_AVATAR,
  'celestial-fury': CELESTIAL_FURY,

  // Mercury Tier 5 Variants
  'permafrost-golem': PERMAFROST_GOLEM,
  'tundra-serpent': TUNDRA_SERPENT,
  'polar-guardian': POLAR_GUARDIAN,

  // Jupiter Tier 5 Variants
  'voltage-chimera': VOLTAGE_CHIMERA,
  'monsoon-drake': MONSOON_DRAKE,
  'aurora-elemental': AURORA_ELEMENTAL,
  'vortex-sentinel': VORTEX_SENTINEL,

  // Hybrid Tier 5 Bosses
  'maelstrom-beast': MAELSTROM_BEAST,
  'thunderstorm-colossus': THUNDERSTORM_COLOSSUS,

  // VS1 Demo
  'bandit-minion': BANDIT_MINION,
  'bandit-captain': BANDIT_CAPTAIN,

  // Recruitable Unit Enemies
  'garet-enemy': GARET_ENEMY,
  'sentinel-enemy': SENTINEL_ENEMY,
  'stormcaller-enemy': STORMCALLER_ENEMY,
};
