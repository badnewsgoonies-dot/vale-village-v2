"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HYDRA = exports.THUNDERBIRD = exports.LEVIATHAN = exports.PHOENIX = exports.BASILISK = exports.STORM_ELEMENTAL = exports.ICE_ELEMENTAL = exports.FLAME_ELEMENTAL = exports.ROCK_ELEMENTAL = exports.TEMPEST_WARLORD = exports.BLIZZARD_WARLORD = exports.VOLCANO_WARLORD = exports.GRANITE_WARLORD = exports.LIGHTNING_COMMANDER = exports.STORM_COMMANDER = exports.FIRE_COMMANDER = exports.MOUNTAIN_COMMANDER = exports.THUNDER_CAPTAIN = exports.GLACIER_CAPTAIN = exports.INFERNO_CAPTAIN = exports.STONE_CAPTAIN = exports.WIND_SOLDIER = exports.TIDE_SOLDIER = exports.BLAZE_SOLDIER = exports.TERRA_SOLDIER = exports.GALE_SCOUT = exports.FROST_SCOUT = exports.FLAME_SCOUT = exports.EARTH_SCOUT = exports.JUPITER_BEAR = exports.MERCURY_BEAR = exports.MARS_BEAR = exports.VENUS_BEAR = exports.JUPITER_WOLF = exports.FLAME_HERALD = exports.TERRA_WARDEN = exports.FROST_ORACLE = exports.TIDE_ENCHANTER = exports.EARTH_SHAMAN = exports.EMBER_CLERIC = exports.STONE_GUARDIAN = exports.GALE_PRIEST = exports.FROST_MYSTIC = exports.MERCURY_WOLF = exports.MARS_WOLF = exports.VENUS_BEETLE = exports.JUPITER_SPRITE = exports.MARS_BANDIT = exports.VENUS_WOLF = exports.MERCURY_SLIME = void 0;
exports.BANDIT_CAPTAIN = exports.BANDIT_MINION = exports.THUNDERSTORM_COLOSSUS = exports.MAELSTROM_BEAST = exports.VORTEX_SENTINEL = exports.AURORA_ELEMENTAL = exports.MONSOON_DRAKE = exports.VOLTAGE_CHIMERA = exports.POLAR_GUARDIAN = exports.TUNDRA_SERPENT = exports.PERMAFROST_GOLEM = exports.CELESTIAL_FURY = exports.ZEUS_AVATAR = exports.STRATOSPHERE_LORD = exports.ABYSSAL_EMPEROR = exports.NEPTUNE_WARDEN = exports.ARCTIC_SOVEREIGN = exports.STONE_ROC = exports.ICE_OWL = exports.FIRE_EAGLE = exports.WIND_HAWK = exports.TERRA_GUARDIAN = exports.MAGMA_COLOSSUS = exports.FROST_LICH = exports.VOID_SPECTER = exports.STORM_TITAN = exports.KRAKEN = exports.ELDER_BASILISK = exports.ALPHA_PHOENIX = exports.TEMPEST_DRAGON = exports.CYCLONE_DJINNI = exports.LIGHTNING_LYNX = exports.STORM_RAVEN = exports.GLACIER_WYRM = exports.TIDAL_WRAITH = exports.AQUA_DRAKE = exports.FROST_SERPENT = exports.STORM_GOLEM = exports.CRYSTAL_GOLEM = exports.IRON_GOLEM = exports.CLAY_GOLEM = exports.BONE_MAGE = exports.ZOMBIE_HOUND = exports.GHOST_WISP = exports.SKELETON_WARRIOR = exports.OVERSEER = exports.CHIMERA = exports.VENUS_SPRITE = exports.MERCURY_SPRITE = exports.MARS_SPRITE = void 0;
exports.ENEMIES = exports.STORMCALLER_ENEMY = exports.SENTINEL_ENEMY = exports.GARET_ENEMY = exports.CARRION_BIRD = exports.WILD_BOAR = exports.MERCHANT_GUARD_ENEMY = exports.SCAVENGER = exports.BANDIT = void 0;
const unitToEnemy_1 = require("../../core/utils/unitToEnemy");
const units_1 = require("./units");
const mireToad_1 = require("./mireToad");
const lumenFawn_1 = require("./lumenFawn");
const abilities_1 = require("./abilities");
// ============================================================================
// ENSLAVED BEASTS - Tier 1 (Redesigned Originals)
// ============================================================================
exports.MERCURY_SLIME = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
    ],
    baseXp: 12,
    baseGold: 6,
};
exports.VENUS_WOLF = {
    id: 'venus-wolf',
    name: 'Earthbound Wolf',
    level: 1,
    element: 'Venus',
    stats: {
        hp: 55, // Reverted: 275 was 5x inflated, making battles impossible
        pp: 8,
        atk: 11, // Reverted: 16 was too high for L1
        def: 7,
        mag: 3,
        spd: 11,
    },
    abilities: [
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
    ],
    baseXp: 16,
    baseGold: 8,
};
exports.MARS_BANDIT = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
    ],
    baseXp: 20,
    baseGold: 12,
};
exports.JUPITER_SPRITE = {
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
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.BLIND, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
    ],
    baseXp: 18,
    baseGold: 10,
};
exports.VENUS_BEETLE = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUARD_BREAK, unlockLevel: 1 },
    ],
    baseXp: 22,
    baseGold: 12,
};
// ============================================================================
// ENSLAVED BEASTS - Extended Wolf Pack
// ============================================================================
exports.MARS_WOLF = {
    id: 'mars-wolf',
    name: 'Flame Wolf',
    level: 2,
    element: 'Mars',
    stats: {
        hp: 58, // Reverted: 290 was 5x inflated
        pp: 10,
        atk: 12, // Reverted: 18 was too high
        def: 6,
        mag: 5,
        spd: 13,
    },
    abilities: [
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.BURN_TOUCH, unlockLevel: 1 },
    ],
    baseXp: 18,
    baseGold: 9,
};
exports.MERCURY_WOLF = {
    id: 'mercury-wolf',
    name: 'Frost Wolf',
    level: 2,
    element: 'Mercury',
    stats: {
        hp: 56, // Reverted: 280 was 5x inflated
        pp: 12,
        atk: 10, // Reverted: 17 was too high
        def: 7,
        mag: 6,
        spd: 14,
    },
    abilities: [
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
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
exports.FROST_MYSTIC = {
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
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
    ],
    baseXp: 22,
    baseGold: 12,
};
/**
 * GALE PRIEST - Second Healer (House 5)
 * Role: Healer with debuff (BLIND)
 */
exports.GALE_PRIEST = {
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
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
        { ...abilities_1.BLIND, unlockLevel: 1 },
    ],
    baseXp: 24,
    baseGold: 14,
};
/**
 * STONE GUARDIAN - Tank (House 6)
 * Role: High DEF tank that buffs itself
 */
exports.STONE_GUARDIAN = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUARD_BREAK, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
    ],
    baseXp: 30,
    baseGold: 16,
};
/**
 * EMBER CLERIC - Healer for Tank (House 6)
 * Role: Heals Stone Guardian, creating tank+healer duo
 */
exports.EMBER_CLERIC = {
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
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
    ],
    baseXp: 26,
    baseGold: 14,
};
/**
 * EARTH SHAMAN - Buffer + Healer (House 7)
 * Role: Buffs + heals allies, AoE damage
 */
exports.EARTH_SHAMAN = {
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
        { ...abilities_1.QUAKE, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
    ],
    baseXp: 45,
    baseGold: 22,
};
/**
 * TIDE ENCHANTER - Buffer + Healer (House 8)
 * Role: Buffs + heals Jupiter Bear
 */
exports.TIDE_ENCHANTER = {
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
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
    ],
    baseXp: 50,
    baseGold: 24,
};
/**
 * FROST ORACLE - Party Healer (House 9)
 * Role: Party-wide healing creates endurance battle
 */
exports.FROST_ORACLE = {
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
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
        { ...abilities_1.PARTY_HEAL, unlockLevel: 1 },
    ],
    baseXp: 55,
    baseGold: 26,
};
/**
 * TERRA WARDEN - Buffer + Tank + Healer (House 11)
 * Role: Buffs both allies' ATK/DEF + heals
 */
exports.TERRA_WARDEN = {
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
        { ...abilities_1.QUAKE, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
    ],
    baseXp: 58,
    baseGold: 28,
};
/**
 * FLAME HERALD - Buffer + Debuffer (House 12)
 * Role: Buffs Phoenix ATK, debuffs player DEF
 */
exports.FLAME_HERALD = {
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
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 },
        { ...abilities_1.WEAKEN_DEF, unlockLevel: 1 },
    ],
    baseXp: 70,
    baseGold: 35,
};
exports.JUPITER_WOLF = {
    id: 'jupiter-wolf',
    name: 'Storm Wolf',
    level: 2,
    element: 'Jupiter',
    stats: {
        hp: 52, // Reverted: 260 was 5x inflated
        pp: 11,
        atk: 11, // Reverted: 18 was too high
        def: 6,
        mag: 7,
        spd: 16,
    },
    abilities: [
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.PRECISE_JAB, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
    ],
    baseXp: 18,
    baseGold: 9,
};
// ============================================================================
// ENSLAVED BEASTS - Bear Variants
// ============================================================================
exports.VENUS_BEAR = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.QUAKE, unlockLevel: 1 },
    ],
    baseXp: 35,
    baseGold: 18,
};
exports.MARS_BEAR = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
    ],
    baseXp: 35,
    baseGold: 18,
};
exports.MERCURY_BEAR = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
    ],
    baseXp: 35,
    baseGold: 18,
};
exports.JUPITER_BEAR = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
    ],
    baseXp: 35,
    baseGold: 18,
};
// ============================================================================
// SLAVERS - Tier 1 Scouts (Level 1-2)
// ============================================================================
exports.EARTH_SCOUT = {
    id: 'earth-scout',
    name: 'Earth Scout',
    level: 1,
    element: 'Venus',
    stats: {
        hp: 50, // Reverted: 250 was 5x inflated
        pp: 10,
        atk: 9, // Reverted: 14 was too high
        def: 8,
        mag: 5,
        spd: 8,
    },
    abilities: [
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUARD_BREAK, unlockLevel: 1 },
    ],
    baseXp: 15,
    baseGold: 10,
};
exports.FLAME_SCOUT = {
    id: 'flame-scout',
    name: 'Flame Scout',
    level: 1,
    element: 'Mars',
    stats: {
        hp: 45, // Reverted: 225 was 5x inflated
        pp: 12,
        atk: 10, // Reverted: 15 was too high
        def: 6,
        mag: 8,
        spd: 10,
    },
    abilities: [
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
    ],
    baseXp: 15,
    baseGold: 10,
};
exports.FROST_SCOUT = {
    id: 'frost-scout',
    name: 'Frost Scout',
    level: 1,
    element: 'Mercury',
    stats: {
        hp: 48, // Reverted: 240 was 5x inflated
        pp: 11,
        atk: 8, // Reverted: 14 was too high
        def: 7,
        mag: 7,
        spd: 9,
    },
    abilities: [
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
    ],
    baseXp: 15,
    baseGold: 10,
};
exports.GALE_SCOUT = {
    id: 'gale-scout',
    name: 'Gale Scout',
    level: 1,
    element: 'Jupiter',
    stats: {
        hp: 42, // Reverted: 210 was 5x inflated
        pp: 13,
        atk: 9, // Reverted: 15 was too high
        def: 6,
        mag: 9,
        spd: 12,
    },
    abilities: [
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
    ],
    baseXp: 15,
    baseGold: 10,
};
// ============================================================================
// SLAVERS - Tier 2 Soldiers (Level 3-4)
// ============================================================================
exports.TERRA_SOLDIER = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.QUAKE, unlockLevel: 1 },
    ],
    baseXp: 28,
    baseGold: 16,
};
exports.BLAZE_SOLDIER = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
        { ...abilities_1.BURN_TOUCH, unlockLevel: 1 },
    ],
    baseXp: 28,
    baseGold: 16,
};
exports.TIDE_SOLDIER = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
    ],
    baseXp: 28,
    baseGold: 16,
};
exports.WIND_SOLDIER = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.BLIND, unlockLevel: 1 },
    ],
    baseXp: 28,
    baseGold: 16,
};
// ============================================================================
// SLAVERS - Tier 3 Captains (Level 5-6)
// ============================================================================
exports.STONE_CAPTAIN = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.QUAKE, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
    ],
    baseXp: 50,
    baseGold: 28,
};
exports.INFERNO_CAPTAIN = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
        { ...abilities_1.BURN_TOUCH, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 },
    ],
    baseXp: 50,
    baseGold: 28,
};
exports.GLACIER_CAPTAIN = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
    ],
    baseXp: 50,
    baseGold: 28,
};
exports.THUNDER_CAPTAIN = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
        { ...abilities_1.BLIND, unlockLevel: 1 },
    ],
    baseXp: 50,
    baseGold: 28,
};
// ============================================================================
// SLAVERS - Tier 4 Commanders (Level 7-8)
// ============================================================================
exports.MOUNTAIN_COMMANDER = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.QUAKE, unlockLevel: 1 },
        { ...abilities_1.GUARD_BREAK, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
    ],
    baseXp: 75,
    baseGold: 40,
};
exports.FIRE_COMMANDER = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
        { ...abilities_1.BURN_TOUCH, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 },
        { ...abilities_1.WEAKEN_DEF, unlockLevel: 1 },
    ],
    baseXp: 75,
    baseGold: 40,
};
exports.STORM_COMMANDER = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
    ],
    baseXp: 75,
    baseGold: 40,
};
exports.LIGHTNING_COMMANDER = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
        { ...abilities_1.BLIND, unlockLevel: 1 },
    ],
    baseXp: 75,
    baseGold: 40,
};
// ============================================================================
// SLAVERS - Tier 5 Warlords (Level 9-10) - Mini-Bosses
// ============================================================================
exports.GRANITE_WARLORD = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.QUAKE, unlockLevel: 1 },
        { ...abilities_1.GUARD_BREAK, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
    ],
    baseXp: 120,
    baseGold: 60,
};
exports.VOLCANO_WARLORD = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
        { ...abilities_1.BURN_TOUCH, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 },
        { ...abilities_1.WEAKEN_DEF, unlockLevel: 1 },
        { ...abilities_1.GUARD_BREAK, unlockLevel: 1 },
    ],
    baseXp: 120,
    baseGold: 60,
};
exports.BLIZZARD_WARLORD = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
        { ...abilities_1.PARTY_HEAL, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
    ],
    baseXp: 120,
    baseGold: 60,
};
exports.TEMPEST_WARLORD = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
        { ...abilities_1.BLIND, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 },
    ],
    baseXp: 120,
    baseGold: 60,
};
// ============================================================================
// LEGENDARY ENSLAVED - Elemental Pure Forms
// ============================================================================
exports.ROCK_ELEMENTAL = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.QUAKE, unlockLevel: 1 },
        { ...abilities_1.GUARD_BREAK, unlockLevel: 1 },
    ],
    baseXp: 45,
    baseGold: 24,
};
exports.FLAME_ELEMENTAL = {
    id: 'flame-elemental',
    name: 'Flame Elemental',
    level: 6,
    element: 'Mars',
    stats: {
        hp: 180, // First phase-change boss
        pp: 35,
        atk: 14,
        def: 14,
        mag: 24,
        spd: 14,
    },
    abilities: [
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
        { ...abilities_1.BURN_TOUCH, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 }, // Phase 1: buffs self
        { ...abilities_1.WEAKEN_DEF, unlockLevel: 1 }, // Phase 2: debuffs player
    ],
    baseXp: 60,
    baseGold: 30,
    // Phase-change boss: prioritizes debuffs when below 50% HP
    phases: [
        {
            threshold: 0.5, // Below 50% HP
            priorityAbilities: ['weaken-def', 'burn-touch'], // Aggressive debuffs
            statMultiplier: { atk: 1.2, spd: 1.1 }, // 20% ATK, 10% SPD boost in rage mode
        },
    ],
};
exports.ICE_ELEMENTAL = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 }, // ADDED - creates double-healer synergy with Frost Oracle
    ],
    baseXp: 45,
    baseGold: 24,
};
exports.STORM_ELEMENTAL = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
    ],
    baseXp: 45,
    baseGold: 24,
};
// ============================================================================
// LEGENDARY ENSLAVED - Mythical Beasts
// ============================================================================
exports.BASILISK = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.QUAKE, unlockLevel: 1 },
        { ...abilities_1.POISON_STRIKE, unlockLevel: 1 },
    ],
    baseXp: 90,
    baseGold: 50,
};
exports.PHOENIX = {
    id: 'phoenix',
    name: 'Phoenix',
    level: 8,
    element: 'Mars',
    stats: {
        hp: 240, // Phase-change boss with rebirth mechanic
        pp: 40,
        atk: 22,
        def: 18,
        mag: 28,
        spd: 18,
    },
    abilities: [
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
        { ...abilities_1.BURN_TOUCH, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
        { ...abilities_1.PARTY_HEAL, unlockLevel: 1 }, // Phase 2: rebirth mode
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 }, // Phase 2: buffs self
    ],
    baseXp: 110,
    baseGold: 60,
    // Phase-change boss: "Rebirth Mode" - prioritizes healing when near death
    phases: [
        {
            threshold: 0.5, // Below 50% HP - enters rebirth preparation
            priorityAbilities: ['heal', 'boost-atk'], // Heal self, buff for comeback
        },
        {
            threshold: 0.25, // Below 25% HP - desperate rebirth mode
            priorityAbilities: ['party-heal', 'heal'], // Focus entirely on healing
            statMultiplier: { mag: 1.5 }, // 50% MAG boost for stronger heals
        },
    ],
};
exports.LEVIATHAN = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
    ],
    baseXp: 90,
    baseGold: 50,
};
exports.THUNDERBIRD = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
    ],
    baseXp: 90,
    baseGold: 50,
};
exports.HYDRA = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.POISON_STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
    ],
    baseXp: 110,
    baseGold: 55,
};
// ============================================================================
// BOSS ENEMIES - Special Encounters
// ============================================================================
exports.MARS_SPRITE = {
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
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
        { ...abilities_1.BURN_TOUCH, unlockLevel: 1 },
    ],
    baseXp: 20,
    baseGold: 12,
};
exports.MERCURY_SPRITE = {
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
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
    ],
    baseXp: 20,
    baseGold: 12,
};
exports.VENUS_SPRITE = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.QUAKE, unlockLevel: 1 },
    ],
    baseXp: 20,
    baseGold: 12,
};
exports.CHIMERA = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
        { ...abilities_1.BURN_TOUCH, unlockLevel: 1 },
        { ...abilities_1.POISON_STRIKE, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 },
    ],
    baseXp: 200,
    baseGold: 100,
};
// ============================================================================
// CHAPTER BOSS - Overseer (Final Boss)
// ============================================================================
exports.OVERSEER = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.QUAKE, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
    ],
    baseXp: 500,
    baseGold: 250,
};
// ============================================================================
// UNDEAD CATEGORY - Reanimated Creatures
// ============================================================================
exports.SKELETON_WARRIOR = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
    ],
    baseXp: 42,
    baseGold: 22,
};
exports.GHOST_WISP = {
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
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
    ],
    baseXp: 40,
    baseGold: 20,
};
exports.ZOMBIE_HOUND = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.BURN_TOUCH, unlockLevel: 1 },
    ],
    baseXp: 48,
    baseGold: 25,
};
exports.BONE_MAGE = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
    ],
    baseXp: 60,
    baseGold: 32,
};
// ============================================================================
// GOLEM CATEGORY - Animated Constructs
// ============================================================================
exports.CLAY_GOLEM = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.QUAKE, unlockLevel: 1 },
    ],
    baseXp: 85,
    baseGold: 45,
};
exports.IRON_GOLEM = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
    ],
    baseXp: 105,
    baseGold: 55,
};
exports.CRYSTAL_GOLEM = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
    ],
    baseXp: 115,
    baseGold: 58,
};
exports.STORM_GOLEM = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
    ],
    baseXp: 115,
    baseGold: 58,
};
// ============================================================================
// MERCURY BEASTS - Tier 3-4 (Mercury/Water themed)
// ============================================================================
exports.FROST_SERPENT = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
        { ...abilities_1.POISON_STRIKE, unlockLevel: 1 },
    ],
    baseXp: 70,
    baseGold: 38,
};
exports.AQUA_DRAKE = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
    ],
    baseXp: 88,
    baseGold: 46,
};
exports.TIDAL_WRAITH = {
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
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
        { ...abilities_1.WEAKEN_DEF, unlockLevel: 1 },
    ],
    baseXp: 95,
    baseGold: 50,
};
exports.GLACIER_WYRM = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
    ],
    baseXp: 125,
    baseGold: 65,
};
// ============================================================================
// JUPITER BEASTS - Tier 3-4 (Wind/Lightning themed)
// ============================================================================
exports.STORM_RAVEN = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
    ],
    baseXp: 68,
    baseGold: 36,
};
exports.LIGHTNING_LYNX = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.PRECISE_JAB, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
    ],
    baseXp: 85,
    baseGold: 44,
};
exports.CYCLONE_DJINNI = {
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
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
        { ...abilities_1.BLIND, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 },
    ],
    baseXp: 100,
    baseGold: 52,
};
exports.TEMPEST_DRAGON = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
    ],
    baseXp: 130,
    baseGold: 68,
};
// ============================================================================
// BOSS VARIANTS - Elite versions for tower floors 15-20
// ============================================================================
exports.ALPHA_PHOENIX = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
        { ...abilities_1.BURN_TOUCH, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
        { ...abilities_1.PARTY_HEAL, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 },
    ],
    baseXp: 180,
    baseGold: 95,
};
exports.ELDER_BASILISK = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.QUAKE, unlockLevel: 1 },
        { ...abilities_1.POISON_STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUARD_BREAK, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
    ],
    baseXp: 185,
    baseGold: 98,
};
exports.KRAKEN = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
        { ...abilities_1.WEAKEN_DEF, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
    ],
    baseXp: 175,
    baseGold: 92,
};
exports.STORM_TITAN = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 },
    ],
    baseXp: 200,
    baseGold: 105,
};
// ============================================================================
// TIER 5 ENEMIES - Tower Floor 15-20 Monsters
// ============================================================================
exports.VOID_SPECTER = {
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
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
        { ...abilities_1.BLIND, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
        { ...abilities_1.WEAKEN_DEF, unlockLevel: 1 },
    ],
    baseXp: 145,
    baseGold: 76,
};
exports.FROST_LICH = {
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
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
        { ...abilities_1.PARTY_HEAL, unlockLevel: 1 },
        { ...abilities_1.WEAKEN_DEF, unlockLevel: 1 },
    ],
    baseXp: 150,
    baseGold: 78,
};
exports.MAGMA_COLOSSUS = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
        { ...abilities_1.BURN_TOUCH, unlockLevel: 1 },
        { ...abilities_1.GUARD_BREAK, unlockLevel: 1 },
    ],
    baseXp: 160,
    baseGold: 84,
};
exports.TERRA_GUARDIAN = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.QUAKE, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
    ],
    baseXp: 165,
    baseGold: 86,
};
// ============================================================================
// AVIAN CATEGORY - Flying Creatures
// ============================================================================
exports.WIND_HAWK = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
    ],
    baseXp: 32,
    baseGold: 18,
};
exports.FIRE_EAGLE = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.FIREBALL, unlockLevel: 1 },
    ],
    baseXp: 50,
    baseGold: 26,
};
exports.ICE_OWL = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
    ],
    baseXp: 62,
    baseGold: 34,
};
exports.STONE_ROC = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.QUAKE, unlockLevel: 1 },
        { ...abilities_1.GUARD_BREAK, unlockLevel: 1 },
    ],
    baseXp: 110,
    baseGold: 56,
};
// ============================================================================
// MERCURY ELITE BOSSES - Tower Floor 15-20
// ============================================================================
exports.ARCTIC_SOVEREIGN = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
        { ...abilities_1.PARTY_HEAL, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
        { ...abilities_1.WEAKEN_DEF, unlockLevel: 1 },
    ],
    baseXp: 220,
    baseGold: 115,
};
exports.NEPTUNE_WARDEN = {
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
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
        { ...abilities_1.PARTY_HEAL, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
    ],
    baseXp: 240,
    baseGold: 125,
};
exports.ABYSSAL_EMPEROR = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
        { ...abilities_1.PARTY_HEAL, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
        { ...abilities_1.WEAKEN_DEF, unlockLevel: 1 },
    ],
    baseXp: 260,
    baseGold: 135,
};
// ============================================================================
// JUPITER ELITE BOSSES - Tower Floor 15-20
// ============================================================================
exports.STRATOSPHERE_LORD = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
        { ...abilities_1.BLIND, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 },
    ],
    baseXp: 225,
    baseGold: 118,
};
exports.ZEUS_AVATAR = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 },
    ],
    baseXp: 245,
    baseGold: 128,
};
exports.CELESTIAL_FURY = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
        { ...abilities_1.BLIND, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 },
        { ...abilities_1.WEAKEN_DEF, unlockLevel: 1 },
    ],
    baseXp: 270,
    baseGold: 140,
};
// ============================================================================
// MERCURY TIER 5 VARIANTS - Advanced Water/Ice Enemies
// ============================================================================
exports.PERMAFROST_GOLEM = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
    ],
    baseXp: 170,
    baseGold: 88,
};
exports.TUNDRA_SERPENT = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
        { ...abilities_1.POISON_STRIKE, unlockLevel: 1 },
        { ...abilities_1.WEAKEN_DEF, unlockLevel: 1 },
    ],
    baseXp: 155,
    baseGold: 82,
};
exports.POLAR_GUARDIAN = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.HEAL, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
    ],
    baseXp: 165,
    baseGold: 86,
};
// ============================================================================
// JUPITER TIER 5 VARIANTS - Advanced Wind/Lightning Enemies
// ============================================================================
exports.VOLTAGE_CHIMERA = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 },
    ],
    baseXp: 175,
    baseGold: 90,
};
exports.MONSOON_DRAKE = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
        { ...abilities_1.BLIND, unlockLevel: 1 },
    ],
    baseXp: 158,
    baseGold: 83,
};
exports.AURORA_ELEMENTAL = {
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
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
        { ...abilities_1.BLIND, unlockLevel: 1 },
        { ...abilities_1.WEAKEN_DEF, unlockLevel: 1 },
    ],
    baseXp: 180,
    baseGold: 94,
};
exports.VORTEX_SENTINEL = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
        { ...abilities_1.BOOST_ATK, unlockLevel: 1 },
    ],
    baseXp: 168,
    baseGold: 87,
};
// ============================================================================
// HYBRID TIER 5 BOSSES - Multi-Element Threats
// ============================================================================
exports.MAELSTROM_BEAST = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.ICE_SHARD, unlockLevel: 1 },
        { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.BOOST_DEF, unlockLevel: 1 },
    ],
    baseXp: 195,
    baseGold: 102,
};
exports.THUNDERSTORM_COLOSSUS = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
        { ...abilities_1.GUST, unlockLevel: 1 },
        { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 },
        { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 },
        { ...abilities_1.GUARD_BREAK, unlockLevel: 1 },
    ],
    baseXp: 210,
    baseGold: 110,
};
// ============================================================================
// VS1 Demo Enemies
// ============================================================================
exports.BANDIT_MINION = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
    ],
    baseXp: 18,
    baseGold: 15,
};
exports.BANDIT_CAPTAIN = {
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
        { ...abilities_1.STRIKE, unlockLevel: 1 },
        { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 },
    ],
    baseXp: 30,
    baseGold: 25,
};
// Lightweight aliases / small world enemies (missing from previous import)
exports.BANDIT = {
    id: 'bandit',
    name: 'Road Bandit',
    level: 3,
    element: 'Mars',
    stats: { hp: 50, pp: 0, atk: 12, def: 8, mag: 4, spd: 9 },
    abilities: [{ ...abilities_1.STRIKE, unlockLevel: 1 }],
    baseXp: 20,
    baseGold: 12,
};
exports.SCAVENGER = {
    id: 'scavenger',
    name: 'Scavenger',
    level: 2,
    element: 'Venus',
    stats: { hp: 38, pp: 0, atk: 8, def: 6, mag: 3, spd: 7 },
    abilities: [{ ...abilities_1.STRIKE, unlockLevel: 1 }],
    baseXp: 10,
    baseGold: 6,
};
exports.MERCHANT_GUARD_ENEMY = {
    id: 'merchant-guard',
    name: 'Merchant Guard',
    level: 2,
    element: 'Venus',
    stats: { hp: 60, pp: 0, atk: 10, def: 9, mag: 3, spd: 8 },
    abilities: [{ ...abilities_1.STRIKE, unlockLevel: 1 }, { ...abilities_1.GUARD_BREAK, unlockLevel: 1 }],
    baseXp: 22,
    baseGold: 14,
};
exports.WILD_BOAR = {
    id: 'wild-boar',
    name: 'Wild Boar',
    level: 1,
    element: 'Venus',
    stats: { hp: 36, pp: 0, atk: 10, def: 5, mag: 2, spd: 6 },
    abilities: [{ ...abilities_1.STRIKE, unlockLevel: 1 }],
    baseXp: 8,
    baseGold: 5,
};
exports.CARRION_BIRD = {
    id: 'carrion-bird',
    name: 'Carrion Bird',
    level: 1,
    element: 'Jupiter',
    stats: { hp: 28, pp: 0, atk: 6, def: 4, mag: 2, spd: 12 },
    abilities: [{ ...abilities_1.STRIKE, unlockLevel: 1 }, { ...abilities_1.GUST, unlockLevel: 1 }],
    baseXp: 9,
    baseGold: 4,
};
// ============================================================================
// Recruitable Unit Enemies (generated from unit definitions)
// ============================================================================
// VS1: Garet (War Mage) - Level 2
const warMageDef = units_1.UNIT_DEFINITIONS['war-mage'];
let _GARET_ENEMY;
if (warMageDef) {
    _GARET_ENEMY = {
        ...(0, unitToEnemy_1.unitDefinitionToEnemy)(warMageDef, 2, // Level 2 for VS1
        60, // Base XP
        19, // Base Gold
        {
            id: 'garet-enemy',
            stats: {
                // VS1 tutorial fight tuning:
                // - Player starts with 1 mana circle, so they can only basic attack (plus Djinn stat bonuses).
                // - Enemies ignore mana costs, so we keep this fight physical-only (see abilities override below).
                // Goal: winnable with basic attacks, but not trivial.
                hp: 135,
                atk: 12,
            },
        }),
        // VS1 tutorial: restrict to basic attack only so the first fight is beatable.
        abilities: [{ ...abilities_1.STRIKE, unlockLevel: 1 }],
    };
}
else {
    // Fallback minimal enemy so module load doesn't throw in environments where UNIT_DEFINITIONS
    // may not be present (tests or partial builds). Keeps behavior predictable.
    _GARET_ENEMY = {
        id: 'garet-enemy',
        name: 'Garet (Enemy)',
        level: 2,
        element: 'Mars',
        stats: { hp: 135, pp: 0, atk: 12, def: 8, mag: 4, spd: 9 },
        abilities: [{ ...abilities_1.STRIKE, unlockLevel: 1 }],
        baseXp: 60,
        baseGold: 19,
    };
}
exports.GARET_ENEMY = _GARET_ENEMY;
// Sentinel - Level 3 (example for future encounters)
const sentinelDef = units_1.UNIT_DEFINITIONS['sentinel'];
let _SENTINEL_ENEMY;
if (sentinelDef) {
    _SENTINEL_ENEMY = (0, unitToEnemy_1.unitDefinitionToEnemy)(sentinelDef, 3, // Level 3
    80, // Base XP
    25, // Base Gold
    { id: 'sentinel-enemy' });
}
else {
    _SENTINEL_ENEMY = {
        id: 'sentinel-enemy',
        name: 'Sentinel (Enemy)',
        level: 3,
        element: 'Venus',
        stats: { hp: 90, pp: 0, atk: 18, def: 12, mag: 6, spd: 9 },
        abilities: [{ ...abilities_1.STRIKE, unlockLevel: 1 }, { ...abilities_1.HEAVY_STRIKE, unlockLevel: 1 }],
        baseXp: 80,
        baseGold: 25,
    };
}
exports.SENTINEL_ENEMY = _SENTINEL_ENEMY;
// Stormcaller - Level 3 (example for future encounters)
const stormcallerDef = units_1.UNIT_DEFINITIONS['stormcaller'];
let _STORMCALLER_ENEMY;
if (stormcallerDef) {
    _STORMCALLER_ENEMY = (0, unitToEnemy_1.unitDefinitionToEnemy)(stormcallerDef, 3, // Level 3
    80, // Base XP
    25, // Base Gold
    { id: 'stormcaller-enemy' });
}
else {
    _STORMCALLER_ENEMY = {
        id: 'stormcaller-enemy',
        name: 'Stormcaller (Enemy)',
        level: 3,
        element: 'Jupiter',
        stats: { hp: 88, pp: 20, atk: 16, def: 10, mag: 14, spd: 12 },
        abilities: [{ ...abilities_1.GUST, unlockLevel: 1 }, { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 }],
        baseXp: 80,
        baseGold: 25,
    };
}
exports.STORMCALLER_ENEMY = _STORMCALLER_ENEMY;
// Note: Starter units (adept, mystic, ranger) can also have enemy versions
// if needed for story battles, but they're not typically recruited.
// Uncomment if needed:
// export const ADEPT_ENEMY = unitDefinitionToEnemy(UNIT_DEFINITIONS['adept'], 1, 50, 15);
// export const MYSTIC_ENEMY = unitDefinitionToEnemy(UNIT_DEFINITIONS['mystic'], 1, 50, 15);
// export const RANGER_ENEMY = unitDefinitionToEnemy(UNIT_DEFINITIONS['ranger'], 1, 50, 15);
// ============================================================================
// Export all enemies
// ============================================================================
exports.ENEMIES = {
    // Enslaved Beasts - Redesigned Originals
    'mercury-slime': exports.MERCURY_SLIME,
    'venus-wolf': exports.VENUS_WOLF,
    // Legacy/test-friendly aliases
    slime: exports.MERCURY_SLIME,
    wolf: exports.VENUS_WOLF,
    beetle: exports.VENUS_BEETLE,
    'mars-bandit': exports.MARS_BANDIT,
    'jupiter-sprite': exports.JUPITER_SPRITE,
    'venus-beetle': exports.VENUS_BEETLE,
    // Enslaved Beasts - Wolf Pack
    'mars-wolf': exports.MARS_WOLF,
    'mercury-wolf': exports.MERCURY_WOLF,
    'jupiter-wolf': exports.JUPITER_WOLF,
    // Counter-Strategy Enemies - Support Roles (NEW from enemies_v2.ts)
    'frost-mystic': exports.FROST_MYSTIC,
    'gale-priest': exports.GALE_PRIEST,
    'stone-guardian': exports.STONE_GUARDIAN,
    'ember-cleric': exports.EMBER_CLERIC,
    'earth-shaman': exports.EARTH_SHAMAN,
    'tide-enchanter': exports.TIDE_ENCHANTER,
    'frost-oracle': exports.FROST_ORACLE,
    'terra-warden': exports.TERRA_WARDEN,
    'flame-herald': exports.FLAME_HERALD,
    // Enslaved Beasts - Bear Variants
    'venus-bear': exports.VENUS_BEAR,
    'mars-bear': exports.MARS_BEAR,
    'mercury-bear': exports.MERCURY_BEAR,
    'jupiter-bear': exports.JUPITER_BEAR,
    // Slavers - Tier 1 Scouts
    'earth-scout': exports.EARTH_SCOUT,
    'flame-scout': exports.FLAME_SCOUT,
    'frost-scout': exports.FROST_SCOUT,
    'gale-scout': exports.GALE_SCOUT,
    // Slavers - Tier 2 Soldiers
    'terra-soldier': exports.TERRA_SOLDIER,
    'blaze-soldier': exports.BLAZE_SOLDIER,
    'tide-soldier': exports.TIDE_SOLDIER,
    'wind-soldier': exports.WIND_SOLDIER,
    // Slavers - Tier 3 Captains
    'stone-captain': exports.STONE_CAPTAIN,
    'inferno-captain': exports.INFERNO_CAPTAIN,
    'glacier-captain': exports.GLACIER_CAPTAIN,
    'thunder-captain': exports.THUNDER_CAPTAIN,
    // Slavers - Tier 4 Commanders
    'mountain-commander': exports.MOUNTAIN_COMMANDER,
    'fire-commander': exports.FIRE_COMMANDER,
    'storm-commander': exports.STORM_COMMANDER,
    'lightning-commander': exports.LIGHTNING_COMMANDER,
    // Slavers - Tier 5 Warlords (Mini-Bosses)
    'granite-warlord': exports.GRANITE_WARLORD,
    'volcano-warlord': exports.VOLCANO_WARLORD,
    'blizzard-warlord': exports.BLIZZARD_WARLORD,
    'tempest-warlord': exports.TEMPEST_WARLORD,
    // Legendary Enslaved - Elementals
    'rock-elemental': exports.ROCK_ELEMENTAL,
    'flame-elemental': exports.FLAME_ELEMENTAL,
    'ice-elemental': exports.ICE_ELEMENTAL,
    'storm-elemental': exports.STORM_ELEMENTAL,
    // Legendary Enslaved - Mythical Beasts
    basilisk: exports.BASILISK,
    phoenix: exports.PHOENIX,
    leviathan: exports.LEVIATHAN,
    thunderbird: exports.THUNDERBIRD,
    hydra: exports.HYDRA,
    // Boss Enemies
    'mars-sprite': exports.MARS_SPRITE,
    'mercury-sprite': exports.MERCURY_SPRITE,
    'venus-sprite': exports.VENUS_SPRITE,
    chimera: exports.CHIMERA,
    overseer: exports.OVERSEER,
    // Undead Category
    'skeleton-warrior': exports.SKELETON_WARRIOR,
    'ghost-wisp': exports.GHOST_WISP,
    'zombie-hound': exports.ZOMBIE_HOUND,
    'bone-mage': exports.BONE_MAGE,
    // Golem Category
    'clay-golem': exports.CLAY_GOLEM,
    'iron-golem': exports.IRON_GOLEM,
    'crystal-golem': exports.CRYSTAL_GOLEM,
    'storm-golem': exports.STORM_GOLEM,
    // Avian Category
    'wind-hawk': exports.WIND_HAWK,
    'fire-eagle': exports.FIRE_EAGLE,
    'ice-owl': exports.ICE_OWL,
    'stone-roc': exports.STONE_ROC,
    // Mercury Beasts (Tier 3-4)
    'frost-serpent': exports.FROST_SERPENT,
    'aqua-drake': exports.AQUA_DRAKE,
    'tidal-wraith': exports.TIDAL_WRAITH,
    'glacier-wyrm': exports.GLACIER_WYRM,
    // Jupiter Beasts (Tier 3-4)
    'storm-raven': exports.STORM_RAVEN,
    'lightning-lynx': exports.LIGHTNING_LYNX,
    'cyclone-djinni': exports.CYCLONE_DJINNI,
    'tempest-dragon': exports.TEMPEST_DRAGON,
    // Boss Variants (Tier 5)
    'alpha-phoenix': exports.ALPHA_PHOENIX,
    'elder-basilisk': exports.ELDER_BASILISK,
    'kraken': exports.KRAKEN,
    'storm-titan': exports.STORM_TITAN,
    // Tier 5 Enemies
    'void-specter': exports.VOID_SPECTER,
    'frost-lich': exports.FROST_LICH,
    'magma-colossus': exports.MAGMA_COLOSSUS,
    'terra-guardian': exports.TERRA_GUARDIAN,
    // Mercury Elite Bosses (Tower Floor 15-20)
    'arctic-sovereign': exports.ARCTIC_SOVEREIGN,
    'neptune-warden': exports.NEPTUNE_WARDEN,
    'abyssal-emperor': exports.ABYSSAL_EMPEROR,
    // Jupiter Elite Bosses (Tower Floor 15-20)
    'stratosphere-lord': exports.STRATOSPHERE_LORD,
    'zeus-avatar': exports.ZEUS_AVATAR,
    'celestial-fury': exports.CELESTIAL_FURY,
    // Mercury Tier 5 Variants
    'permafrost-golem': exports.PERMAFROST_GOLEM,
    'tundra-serpent': exports.TUNDRA_SERPENT,
    'polar-guardian': exports.POLAR_GUARDIAN,
    // Jupiter Tier 5 Variants
    'voltage-chimera': exports.VOLTAGE_CHIMERA,
    'monsoon-drake': exports.MONSOON_DRAKE,
    'aurora-elemental': exports.AURORA_ELEMENTAL,
    'vortex-sentinel': exports.VORTEX_SENTINEL,
    // Hybrid Tier 5 Bosses
    'maelstrom-beast': exports.MAELSTROM_BEAST,
    'thunderstorm-colossus': exports.THUNDERSTORM_COLOSSUS,
    // VS1 Demo
    'bandit-minion': exports.BANDIT_MINION,
    'bandit-captain': exports.BANDIT_CAPTAIN,
    'bandit': exports.BANDIT,
    'scavenger': exports.SCAVENGER,
    'merchant-guard': exports.MERCHANT_GUARD_ENEMY,
    'wild-boar': exports.WILD_BOAR,
    'carrion-bird': exports.CARRION_BIRD,
    // Recruitable Unit Enemies
    'garet-enemy': exports.GARET_ENEMY,
    'sentinel-enemy': exports.SENTINEL_ENEMY,
    'stormcaller-enemy': exports.STORMCALLER_ENEMY,
    // Injected Mercury & Jupiter themed enemies (inline definitions)
    'mercury-mistling': {
        id: 'mercury-mistling',
        name: 'Mistling',
        level: 3,
        element: 'Mercury',
        stats: { hp: 72, pp: 14, atk: 10, def: 8, mag: 18, spd: 13 },
        abilities: [{ ...abilities_1.ICE_SHARD, unlockLevel: 1 }, { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 }],
        baseXp: 34,
        baseGold: 16,
    },
    'mercury-glacial-sprite': {
        id: 'mercury-glacial-sprite',
        name: 'Glacial Sprite',
        level: 4,
        element: 'Mercury',
        stats: { hp: 88, pp: 18, atk: 9, def: 10, mag: 22, spd: 15 },
        abilities: [{ ...abilities_1.ICE_SHARD, unlockLevel: 1 }, { ...abilities_1.HEAL, unlockLevel: 1 }],
        baseXp: 42,
        baseGold: 22,
    },
    'mercury-frost-hound': {
        id: 'mercury-frost-hound',
        name: 'Frost Hound',
        level: 5,
        element: 'Mercury',
        stats: { hp: 110, pp: 12, atk: 18, def: 12, mag: 16, spd: 17 },
        abilities: [{ ...abilities_1.STRIKE, unlockLevel: 1 }, { ...abilities_1.FREEZE_BLAST, unlockLevel: 1 }],
        baseXp: 56,
        baseGold: 28,
    },
    'mercury-aquifer-imp': {
        id: 'mercury-aquifer-imp',
        name: 'Aquifer Imp',
        level: 2,
        element: 'Mercury',
        stats: { hp: 46, pp: 16, atk: 7, def: 6, mag: 14, spd: 12 },
        abilities: [{ ...abilities_1.ICE_SHARD, unlockLevel: 1 }],
        baseXp: 20,
        baseGold: 10,
    },
    'mercury-warder': {
        id: 'mercury-warder',
        name: 'Warder of the Tides',
        level: 6,
        element: 'Mercury',
        stats: { hp: 150, pp: 30, atk: 20, def: 18, mag: 24, spd: 11 },
        abilities: [{ ...abilities_1.FREEZE_BLAST, unlockLevel: 1 }, { ...abilities_1.HEAL, unlockLevel: 1 }],
        baseXp: 80,
        baseGold: 40,
    },
    'jupiter-zephyr-imp': {
        id: 'jupiter-zephyr-imp',
        name: 'Zephyr Imp',
        level: 2,
        element: 'Jupiter',
        stats: { hp: 44, pp: 14, atk: 8, def: 6, mag: 13, spd: 16 },
        abilities: [{ ...abilities_1.GUST, unlockLevel: 1 }],
        baseXp: 18,
        baseGold: 9,
    },
    'jupiter-gale-moth': {
        id: 'jupiter-gale-moth',
        name: 'Gale Moth',
        level: 3,
        element: 'Jupiter',
        stats: { hp: 60, pp: 18, atk: 10, def: 8, mag: 18, spd: 20 },
        abilities: [{ ...abilities_1.GUST, unlockLevel: 1 }, { ...abilities_1.BLIND, unlockLevel: 1 }],
        baseXp: 32,
        baseGold: 16,
    },
    'jupiter-stormling': {
        id: 'jupiter-stormling',
        name: 'Stormling',
        level: 5,
        element: 'Jupiter',
        stats: { hp: 95, pp: 24, atk: 16, def: 12, mag: 26, spd: 22 },
        abilities: [{ ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 }, { ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 }],
        baseXp: 72,
        baseGold: 36,
    },
    'jupiter-lightning-hopper': {
        id: 'jupiter-lightning-hopper',
        name: 'Lightning Hopper',
        level: 4,
        element: 'Jupiter',
        stats: { hp: 78, pp: 20, atk: 14, def: 10, mag: 20, spd: 24 },
        abilities: [{ ...abilities_1.PARALYZE_SHOCK, unlockLevel: 1 }, { ...abilities_1.PRECISE_JAB, unlockLevel: 1 }],
        baseXp: 46,
        baseGold: 24,
    },
    'jupiter-vortex-sentry': {
        id: 'jupiter-vortex-sentry',
        name: 'Vortex Sentry',
        level: 6,
        element: 'Jupiter',
        stats: { hp: 140, pp: 30, atk: 22, def: 18, mag: 30, spd: 18 },
        abilities: [{ ...abilities_1.GUST, unlockLevel: 1 }, { ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 }, { ...abilities_1.BOOST_DEF, unlockLevel: 1 }],
        baseXp: 94,
        baseGold: 48,
    },
    // Restored Content
    "mire-toad": mireToad_1.MIRE_TOAD,
    "lumen-fawn": lumenFawn_1.LUMEN_FAWN,
    'the-golden-sun': {
        id: 'the-golden-sun',
        name: 'The Golden Sun',
        level: 20,
        element: 'Jupiter',
        stats: { hp: 5000, pp: 999, atk: 150, def: 120, mag: 200, spd: 80 },
        abilities: [{ ...abilities_1.CHAIN_LIGHTNING, unlockLevel: 1 }, { ...abilities_1.BOOST_DEF, unlockLevel: 1 }],
        baseXp: 50000,
        baseGold: 99999,
    },
};
