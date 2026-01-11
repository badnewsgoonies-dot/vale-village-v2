import { UNIT_DEFINITIONS } from "./units-B-zlKtRH.js";
import { STRIKE, ICE_SHARD, QUAKE, HEAVY_STRIKE, FIREBALL, GUST, BLIND, PARALYZE_SHOCK, GUARD_BREAK, BURN_TOUCH, FREEZE_BLAST, HEAL, BOOST_DEF, PARTY_HEAL, BOOST_ATK, WEAKEN_DEF, PRECISE_JAB, CHAIN_LIGHTNING, POISON_STRIKE } from "./abilities-BqKwRqMm.js";
function calculateStatsAtLevel(unitDef, level) {
  const levelBonus = level - 1;
  return {
    hp: unitDef.baseStats.hp + levelBonus * unitDef.growthRates.hp,
    pp: unitDef.baseStats.pp + levelBonus * unitDef.growthRates.pp,
    atk: unitDef.baseStats.atk + levelBonus * unitDef.growthRates.atk,
    def: unitDef.baseStats.def + levelBonus * unitDef.growthRates.def,
    mag: unitDef.baseStats.mag + levelBonus * unitDef.growthRates.mag,
    spd: unitDef.baseStats.spd + levelBonus * unitDef.growthRates.spd
  };
}
function unitDefinitionToEnemy(unitDef, level = 2, baseXp = 60, baseGold = 19, options = {}) {
  const statsAtLevel = calculateStatsAtLevel(unitDef, level);
  const finalStats = options.stats ? { ...statsAtLevel, ...options.stats } : statsAtLevel;
  const abilitiesAtLevel = unitDef.abilities.filter(
    (ability) => level >= (ability.unlockLevel ?? 1)
  );
  const enemyAbilities = abilitiesAtLevel.length > 0 ? abilitiesAtLevel : [unitDef.abilities[0]];
  return {
    id: options.id ?? `${unitDef.id}-enemy`,
    name: unitDef.name,
    // Use same name (e.g., "Garet" not "Garet Enemy")
    level,
    element: unitDef.element,
    stats: finalStats,
    abilities: enemyAbilities,
    baseXp,
    baseGold
  };
}
const MIRE_TOAD = {
  id: "mire-toad",
  name: "Mire Toad",
  level: 2,
  element: "Mercury",
  stats: {
    hp: 60,
    pp: 15,
    atk: 18,
    def: 12,
    mag: 4,
    spd: 10
  },
  abilities: [
    { ...STRIKE },
    { ...ICE_SHARD }
  ],
  baseXp: 15,
  baseGold: 8,
  drops: []
};
const LUMEN_FAWN = {
  id: "lumen-fawn",
  name: "Lumen Fawn",
  level: 1,
  element: "Venus",
  stats: {
    hp: 45,
    pp: 10,
    atk: 14,
    def: 8,
    mag: 6,
    spd: 12
  },
  abilities: [
    { ...STRIKE },
    { ...QUAKE }
  ],
  baseXp: 12,
  baseGold: 6,
  drops: []
};
const MERCURY_SLIME = {
  id: "mercury-slime",
  name: "Mercury Slime",
  level: 1,
  element: "Mercury",
  stats: {
    hp: 40,
    pp: 8,
    atk: 4,
    def: 5,
    mag: 6,
    spd: 5
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 }
  ],
  baseXp: 12,
  baseGold: 6
};
const VENUS_WOLF = {
  id: "venus-wolf",
  name: "Earthbound Wolf",
  level: 1,
  element: "Venus",
  stats: {
    hp: 55,
    // Reverted: 275 was 5x inflated, making battles impossible
    pp: 8,
    atk: 11,
    // Reverted: 16 was too high for L1
    def: 7,
    mag: 3,
    spd: 11
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 }
  ],
  baseXp: 16,
  baseGold: 8
};
const MARS_BANDIT = {
  id: "mars-bandit",
  name: "Flame Bandit",
  level: 2,
  element: "Mars",
  stats: {
    hp: 60,
    pp: 12,
    atk: 13,
    def: 6,
    mag: 8,
    spd: 10
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 }
  ],
  baseXp: 20,
  baseGold: 12
};
const JUPITER_SPRITE = {
  id: "jupiter-sprite",
  name: "Wind Sprite",
  level: 2,
  element: "Jupiter",
  stats: {
    hp: 45,
    pp: 15,
    atk: 5,
    def: 5,
    mag: 14,
    spd: 17
  },
  abilities: [
    { ...GUST, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 }
  ],
  baseXp: 18,
  baseGold: 10
};
const VENUS_BEETLE = {
  id: "venus-beetle",
  name: "Stone Beetle",
  level: 2,
  element: "Venus",
  stats: {
    hp: 80,
    pp: 8,
    atk: 8,
    def: 15,
    mag: 3,
    spd: 6
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 }
  ],
  baseXp: 22,
  baseGold: 12
};
const MARS_WOLF = {
  id: "mars-wolf",
  name: "Flame Wolf",
  level: 2,
  element: "Mars",
  stats: {
    hp: 58,
    // Reverted: 290 was 5x inflated
    pp: 10,
    atk: 12,
    // Reverted: 18 was too high
    def: 6,
    mag: 5,
    spd: 13
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 }
  ],
  baseXp: 18,
  baseGold: 9
};
const MERCURY_WOLF = {
  id: "mercury-wolf",
  name: "Frost Wolf",
  level: 2,
  element: "Mercury",
  stats: {
    hp: 56,
    // Reverted: 280 was 5x inflated
    pp: 12,
    atk: 10,
    // Reverted: 17 was too high
    def: 7,
    mag: 6,
    spd: 14
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 }
  ],
  baseXp: 18,
  baseGold: 9
};
const FROST_MYSTIC = {
  id: "frost-mystic",
  name: "Frost Mystic",
  level: 2,
  element: "Mercury",
  stats: {
    hp: 200,
    pp: 20,
    atk: 10,
    def: 8,
    mag: 12,
    spd: 11
  },
  abilities: [
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 }
  ],
  baseXp: 22,
  baseGold: 12
};
const GALE_PRIEST = {
  id: "gale-priest",
  name: "Gale Priest",
  level: 2,
  element: "Jupiter",
  stats: {
    hp: 180,
    pp: 22,
    atk: 8,
    def: 7,
    mag: 14,
    spd: 13
  },
  abilities: [
    { ...GUST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 }
  ],
  baseXp: 24,
  baseGold: 14
};
const STONE_GUARDIAN = {
  id: "stone-guardian",
  name: "Stone Guardian",
  level: 3,
  element: "Venus",
  stats: {
    hp: 350,
    pp: 10,
    atk: 12,
    def: 20,
    mag: 5,
    spd: 6
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 }
  ],
  baseXp: 30,
  baseGold: 16
};
const EMBER_CLERIC = {
  id: "ember-cleric",
  name: "Ember Cleric",
  level: 3,
  element: "Mars",
  stats: {
    hp: 190,
    pp: 18,
    atk: 9,
    def: 8,
    mag: 11,
    spd: 10
  },
  abilities: [
    { ...FIREBALL, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 }
  ],
  baseXp: 26,
  baseGold: 14
};
const EARTH_SHAMAN = {
  id: "earth-shaman",
  name: "Earth Shaman",
  level: 4,
  element: "Venus",
  stats: {
    hp: 220,
    pp: 25,
    atk: 10,
    def: 14,
    mag: 16,
    spd: 9
  },
  abilities: [
    { ...QUAKE, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 }
  ],
  baseXp: 45,
  baseGold: 22
};
const TIDE_ENCHANTER = {
  id: "tide-enchanter",
  name: "Tide Enchanter",
  level: 4,
  element: "Mercury",
  stats: {
    hp: 240,
    pp: 30,
    atk: 11,
    def: 13,
    mag: 18,
    spd: 10
  },
  abilities: [
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 }
  ],
  baseXp: 50,
  baseGold: 24
};
const FROST_ORACLE = {
  id: "frost-oracle",
  name: "Frost Oracle",
  level: 5,
  element: "Mercury",
  stats: {
    hp: 200,
    pp: 35,
    atk: 10,
    def: 12,
    mag: 20,
    spd: 11
  },
  abilities: [
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 }
  ],
  baseXp: 55,
  baseGold: 26
};
const TERRA_WARDEN = {
  id: "terra-warden",
  name: "Terra Warden",
  level: 6,
  element: "Venus",
  stats: {
    hp: 260,
    pp: 28,
    atk: 16,
    def: 16,
    mag: 14,
    spd: 9
  },
  abilities: [
    { ...QUAKE, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 }
  ],
  baseXp: 58,
  baseGold: 28
};
const FLAME_HERALD = {
  id: "flame-herald",
  name: "Flame Herald",
  level: 7,
  element: "Mars",
  stats: {
    hp: 220,
    pp: 32,
    atk: 18,
    def: 14,
    mag: 20,
    spd: 13
  },
  abilities: [
    { ...FIREBALL, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 }
  ],
  baseXp: 70,
  baseGold: 35
};
const JUPITER_WOLF = {
  id: "jupiter-wolf",
  name: "Storm Wolf",
  level: 2,
  element: "Jupiter",
  stats: {
    hp: 52,
    // Reverted: 260 was 5x inflated
    pp: 11,
    atk: 11,
    // Reverted: 18 was too high
    def: 6,
    mag: 7,
    spd: 16
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...PRECISE_JAB, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 }
  ],
  baseXp: 18,
  baseGold: 9
};
const VENUS_BEAR = {
  id: "venus-bear",
  name: "Mountain Bear",
  level: 4,
  element: "Venus",
  stats: {
    hp: 110,
    pp: 12,
    atk: 14,
    def: 18,
    mag: 6,
    spd: 8
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 }
  ],
  baseXp: 35,
  baseGold: 18
};
const MARS_BEAR = {
  id: "mars-bear",
  name: "Inferno Bear",
  level: 4,
  element: "Mars",
  stats: {
    hp: 105,
    pp: 14,
    atk: 16,
    def: 16,
    mag: 8,
    spd: 9
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 }
  ],
  baseXp: 35,
  baseGold: 18
};
const MERCURY_BEAR = {
  id: "mercury-bear",
  name: "Glacier Bear",
  level: 4,
  element: "Mercury",
  stats: {
    hp: 115,
    pp: 13,
    atk: 13,
    def: 19,
    mag: 7,
    spd: 7
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 }
  ],
  baseXp: 35,
  baseGold: 18
};
const JUPITER_BEAR = {
  id: "jupiter-bear",
  name: "Thunder Bear",
  level: 4,
  element: "Jupiter",
  stats: {
    hp: 100,
    pp: 15,
    atk: 15,
    def: 15,
    mag: 10,
    spd: 12
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 }
  ],
  baseXp: 35,
  baseGold: 18
};
const EARTH_SCOUT = {
  id: "earth-scout",
  name: "Earth Scout",
  level: 1,
  element: "Venus",
  stats: {
    hp: 50,
    // Reverted: 250 was 5x inflated
    pp: 10,
    atk: 9,
    // Reverted: 14 was too high
    def: 8,
    mag: 5,
    spd: 8
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 }
  ],
  baseXp: 15,
  baseGold: 10
};
const FLAME_SCOUT = {
  id: "flame-scout",
  name: "Flame Scout",
  level: 1,
  element: "Mars",
  stats: {
    hp: 45,
    // Reverted: 225 was 5x inflated
    pp: 12,
    atk: 10,
    // Reverted: 15 was too high
    def: 6,
    mag: 8,
    spd: 10
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 }
  ],
  baseXp: 15,
  baseGold: 10
};
const FROST_SCOUT = {
  id: "frost-scout",
  name: "Frost Scout",
  level: 1,
  element: "Mercury",
  stats: {
    hp: 48,
    // Reverted: 240 was 5x inflated
    pp: 11,
    atk: 8,
    // Reverted: 14 was too high
    def: 7,
    mag: 7,
    spd: 9
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 }
  ],
  baseXp: 15,
  baseGold: 10
};
const GALE_SCOUT = {
  id: "gale-scout",
  name: "Gale Scout",
  level: 1,
  element: "Jupiter",
  stats: {
    hp: 42,
    // Reverted: 210 was 5x inflated
    pp: 13,
    atk: 9,
    // Reverted: 15 was too high
    def: 6,
    mag: 9,
    spd: 12
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 }
  ],
  baseXp: 15,
  baseGold: 10
};
const TERRA_SOLDIER = {
  id: "terra-soldier",
  name: "Terra Soldier",
  level: 3,
  element: "Venus",
  stats: {
    hp: 85,
    pp: 15,
    atk: 14,
    def: 13,
    mag: 7,
    spd: 9
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 }
  ],
  baseXp: 28,
  baseGold: 16
};
const BLAZE_SOLDIER = {
  id: "blaze-soldier",
  name: "Blaze Soldier",
  level: 3,
  element: "Mars",
  stats: {
    hp: 75,
    pp: 18,
    atk: 15,
    def: 10,
    mag: 12,
    spd: 11
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 }
  ],
  baseXp: 28,
  baseGold: 16
};
const TIDE_SOLDIER = {
  id: "tide-soldier",
  name: "Tide Soldier",
  level: 3,
  element: "Mercury",
  stats: {
    hp: 80,
    pp: 16,
    atk: 12,
    def: 12,
    mag: 10,
    spd: 10
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 }
  ],
  baseXp: 28,
  baseGold: 16
};
const WIND_SOLDIER = {
  id: "wind-soldier",
  name: "Wind Soldier",
  level: 3,
  element: "Jupiter",
  stats: {
    hp: 70,
    pp: 20,
    atk: 13,
    def: 9,
    mag: 13,
    spd: 14
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 }
  ],
  baseXp: 28,
  baseGold: 16
};
const STONE_CAPTAIN = {
  id: "stone-captain",
  name: "Stone Captain",
  level: 5,
  element: "Venus",
  stats: {
    hp: 130,
    pp: 20,
    atk: 18,
    def: 18,
    mag: 10,
    spd: 10
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 }
  ],
  baseXp: 50,
  baseGold: 28
};
const INFERNO_CAPTAIN = {
  id: "inferno-captain",
  name: "Inferno Captain",
  level: 5,
  element: "Mars",
  stats: {
    hp: 115,
    pp: 25,
    atk: 20,
    def: 14,
    mag: 16,
    spd: 12
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 }
  ],
  baseXp: 50,
  baseGold: 28
};
const GLACIER_CAPTAIN = {
  id: "glacier-captain",
  name: "Glacier Captain",
  level: 5,
  element: "Mercury",
  stats: {
    hp: 125,
    pp: 22,
    atk: 16,
    def: 16,
    mag: 14,
    spd: 11
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 }
  ],
  baseXp: 50,
  baseGold: 28
};
const THUNDER_CAPTAIN = {
  id: "thunder-captain",
  name: "Thunder Captain",
  level: 5,
  element: "Jupiter",
  stats: {
    hp: 110,
    pp: 28,
    atk: 17,
    def: 13,
    mag: 18,
    spd: 15
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 }
  ],
  baseXp: 50,
  baseGold: 28
};
const MOUNTAIN_COMMANDER = {
  id: "mountain-commander",
  name: "Mountain Commander",
  level: 7,
  element: "Venus",
  stats: {
    hp: 180,
    pp: 28,
    atk: 22,
    def: 24,
    mag: 14,
    spd: 11
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 }
  ],
  baseXp: 75,
  baseGold: 40
};
const FIRE_COMMANDER = {
  id: "fire-commander",
  name: "Fire Commander",
  level: 7,
  element: "Mars",
  stats: {
    hp: 160,
    pp: 35,
    atk: 24,
    def: 18,
    mag: 22,
    spd: 13
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 }
  ],
  baseXp: 75,
  baseGold: 40
};
const STORM_COMMANDER = {
  id: "storm-commander",
  name: "Storm Commander",
  level: 7,
  element: "Mercury",
  stats: {
    hp: 170,
    pp: 30,
    atk: 20,
    def: 20,
    mag: 20,
    spd: 12
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 }
  ],
  baseXp: 75,
  baseGold: 40
};
const LIGHTNING_COMMANDER = {
  id: "lightning-commander",
  name: "Lightning Commander",
  level: 7,
  element: "Jupiter",
  stats: {
    hp: 150,
    pp: 38,
    atk: 21,
    def: 16,
    mag: 24,
    spd: 18
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 }
  ],
  baseXp: 75,
  baseGold: 40
};
const GRANITE_WARLORD = {
  id: "granite-warlord",
  name: "Granite Warlord",
  level: 9,
  element: "Venus",
  stats: {
    hp: 250,
    pp: 35,
    atk: 28,
    def: 30,
    mag: 18,
    spd: 12
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 }
  ],
  baseXp: 120,
  baseGold: 60
};
const VOLCANO_WARLORD = {
  id: "volcano-warlord",
  name: "Volcano Warlord",
  level: 9,
  element: "Mars",
  stats: {
    hp: 220,
    pp: 45,
    atk: 30,
    def: 22,
    mag: 28,
    spd: 14
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 }
  ],
  baseXp: 120,
  baseGold: 60
};
const BLIZZARD_WARLORD = {
  id: "blizzard-warlord",
  name: "Blizzard Warlord",
  level: 9,
  element: "Mercury",
  stats: {
    hp: 240,
    pp: 40,
    atk: 24,
    def: 26,
    mag: 24,
    spd: 13
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 }
  ],
  baseXp: 120,
  baseGold: 60
};
const TEMPEST_WARLORD = {
  id: "tempest-warlord",
  name: "Tempest Warlord",
  level: 9,
  element: "Jupiter",
  stats: {
    hp: 210,
    pp: 50,
    atk: 26,
    def: 20,
    mag: 30,
    spd: 20
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 }
  ],
  baseXp: 120,
  baseGold: 60
};
const ROCK_ELEMENTAL = {
  id: "rock-elemental",
  name: "Rock Elemental",
  level: 6,
  element: "Venus",
  stats: {
    hp: 140,
    pp: 20,
    atk: 16,
    def: 22,
    mag: 12,
    spd: 8
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 }
  ],
  baseXp: 45,
  baseGold: 24
};
const FLAME_ELEMENTAL = {
  id: "flame-elemental",
  name: "Flame Elemental",
  level: 6,
  element: "Mars",
  stats: {
    hp: 180,
    // First phase-change boss
    pp: 35,
    atk: 14,
    def: 14,
    mag: 24,
    spd: 14
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    // Phase 1: buffs self
    { ...WEAKEN_DEF, unlockLevel: 1 }
    // Phase 2: debuffs player
  ],
  baseXp: 60,
  baseGold: 30,
  // Phase-change boss: prioritizes debuffs when below 50% HP
  phases: [
    {
      threshold: 0.5,
      // Below 50% HP
      priorityAbilities: ["weaken-def", "burn-touch"],
      // Aggressive debuffs
      statMultiplier: { atk: 1.2, spd: 1.1 }
      // 20% ATK, 10% SPD boost in rage mode
    }
  ]
};
const ICE_ELEMENTAL = {
  id: "ice-elemental",
  name: "Ice Elemental",
  level: 6,
  element: "Mercury",
  stats: {
    hp: 130,
    pp: 24,
    atk: 12,
    def: 18,
    mag: 18,
    spd: 10
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 }
    // ADDED - creates double-healer synergy with Frost Oracle
  ],
  baseXp: 45,
  baseGold: 24
};
const STORM_ELEMENTAL = {
  id: "storm-elemental",
  name: "Storm Elemental",
  level: 6,
  element: "Jupiter",
  stats: {
    hp: 115,
    pp: 30,
    atk: 13,
    def: 13,
    mag: 22,
    spd: 16
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 }
  ],
  baseXp: 45,
  baseGold: 24
};
const BASILISK = {
  id: "basilisk",
  name: "Basilisk",
  level: 8,
  element: "Venus",
  stats: {
    hp: 200,
    pp: 25,
    atk: 24,
    def: 22,
    mag: 16,
    spd: 14
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...POISON_STRIKE, unlockLevel: 1 }
  ],
  baseXp: 90,
  baseGold: 50
};
const PHOENIX = {
  id: "phoenix",
  name: "Phoenix",
  level: 8,
  element: "Mars",
  stats: {
    hp: 240,
    // Phase-change boss with rebirth mechanic
    pp: 40,
    atk: 22,
    def: 18,
    mag: 28,
    spd: 18
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },
    // Phase 2: rebirth mode
    { ...BOOST_ATK, unlockLevel: 1 }
    // Phase 2: buffs self
  ],
  baseXp: 110,
  baseGold: 60,
  // Phase-change boss: "Rebirth Mode" - prioritizes healing when near death
  phases: [
    {
      threshold: 0.5,
      // Below 50% HP - enters rebirth preparation
      priorityAbilities: ["heal", "boost-atk"]
      // Heal self, buff for comeback
    },
    {
      threshold: 0.25,
      // Below 25% HP - desperate rebirth mode
      priorityAbilities: ["party-heal", "heal"],
      // Focus entirely on healing
      statMultiplier: { mag: 1.5 }
      // 50% MAG boost for stronger heals
    }
  ]
};
const LEVIATHAN = {
  id: "leviathan",
  name: "Leviathan",
  level: 8,
  element: "Mercury",
  stats: {
    hp: 220,
    pp: 30,
    atk: 20,
    def: 24,
    mag: 22,
    spd: 12
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 }
  ],
  baseXp: 90,
  baseGold: 50
};
const THUNDERBIRD = {
  id: "thunderbird",
  name: "Thunderbird",
  level: 8,
  element: "Jupiter",
  stats: {
    hp: 170,
    pp: 40,
    atk: 21,
    def: 16,
    mag: 28,
    spd: 22
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 }
  ],
  baseXp: 90,
  baseGold: 50
};
const HYDRA = {
  id: "hydra",
  name: "Hydra",
  level: 9,
  element: "Mercury",
  stats: {
    hp: 280,
    pp: 35,
    atk: 26,
    def: 26,
    mag: 20,
    spd: 13
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...POISON_STRIKE, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 }
  ],
  baseXp: 110,
  baseGold: 55
};
const MARS_SPRITE = {
  id: "mars-sprite",
  name: "Flame Sprite",
  level: 3,
  element: "Mars",
  stats: {
    hp: 48,
    pp: 18,
    atk: 6,
    def: 6,
    mag: 15,
    spd: 16
  },
  abilities: [
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 }
  ],
  baseXp: 20,
  baseGold: 12
};
const MERCURY_SPRITE = {
  id: "mercury-sprite",
  name: "Frost Sprite",
  level: 3,
  element: "Mercury",
  stats: {
    hp: 50,
    pp: 16,
    atk: 5,
    def: 7,
    mag: 14,
    spd: 15
  },
  abilities: [
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 }
  ],
  baseXp: 20,
  baseGold: 12
};
const VENUS_SPRITE = {
  id: "venus-sprite",
  name: "Stone Sprite",
  level: 3,
  element: "Venus",
  stats: {
    hp: 55,
    pp: 14,
    atk: 6,
    def: 8,
    mag: 13,
    spd: 14
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 }
  ],
  baseXp: 20,
  baseGold: 12
};
const CHIMERA = {
  id: "chimera",
  name: "Chimera",
  level: 10,
  element: "Mars",
  stats: {
    hp: 320,
    pp: 50,
    atk: 32,
    def: 28,
    mag: 30,
    spd: 16
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...POISON_STRIKE, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 }
  ],
  baseXp: 200,
  baseGold: 100
};
const OVERSEER = {
  id: "overseer",
  name: "The Overseer",
  level: 10,
  element: "Jupiter",
  stats: {
    hp: 400,
    pp: 60,
    atk: 30,
    def: 30,
    mag: 35,
    spd: 20
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
    { ...HEAL, unlockLevel: 1 }
  ],
  baseXp: 500,
  baseGold: 250
};
const SKELETON_WARRIOR = {
  id: "skeleton-warrior",
  name: "Skeleton Warrior",
  level: 5,
  element: "Venus",
  stats: {
    hp: 45,
    pp: 10,
    atk: 18,
    def: 12,
    mag: 5,
    spd: 10
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 }
  ],
  baseXp: 42,
  baseGold: 22
};
const GHOST_WISP = {
  id: "ghost-wisp",
  name: "Ghost Wisp",
  level: 5,
  element: "Jupiter",
  stats: {
    hp: 35,
    pp: 18,
    atk: 12,
    def: 8,
    mag: 16,
    spd: 18
  },
  abilities: [
    { ...GUST, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 }
  ],
  baseXp: 40,
  baseGold: 20
};
const ZOMBIE_HOUND = {
  id: "zombie-hound",
  name: "Zombie Hound",
  level: 6,
  element: "Mars",
  stats: {
    hp: 50,
    pp: 12,
    atk: 20,
    def: 10,
    mag: 6,
    spd: 15
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 }
  ],
  baseXp: 48,
  baseGold: 25
};
const BONE_MAGE = {
  id: "bone-mage",
  name: "Bone Mage",
  level: 7,
  element: "Mercury",
  stats: {
    hp: 40,
    pp: 25,
    atk: 15,
    def: 10,
    mag: 20,
    spd: 11
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 }
  ],
  baseXp: 60,
  baseGold: 32
};
const CLAY_GOLEM = {
  id: "clay-golem",
  name: "Clay Golem",
  level: 8,
  element: "Venus",
  stats: {
    hp: 80,
    pp: 15,
    atk: 22,
    def: 20,
    mag: 8,
    spd: 6
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 }
  ],
  baseXp: 85,
  baseGold: 45
};
const IRON_GOLEM = {
  id: "iron-golem",
  name: "Iron Golem",
  level: 9,
  element: "Mars",
  stats: {
    hp: 70,
    pp: 18,
    atk: 25,
    def: 25,
    mag: 10,
    spd: 7
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 }
  ],
  baseXp: 105,
  baseGold: 55
};
const CRYSTAL_GOLEM = {
  id: "crystal-golem",
  name: "Crystal Golem",
  level: 10,
  element: "Mercury",
  stats: {
    hp: 65,
    pp: 22,
    atk: 20,
    def: 18,
    mag: 24,
    spd: 8
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 }
  ],
  baseXp: 115,
  baseGold: 58
};
const STORM_GOLEM = {
  id: "storm-golem",
  name: "Storm Golem",
  level: 10,
  element: "Jupiter",
  stats: {
    hp: 70,
    pp: 24,
    atk: 24,
    def: 16,
    mag: 22,
    spd: 9
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 }
  ],
  baseXp: 115,
  baseGold: 58
};
const FROST_SERPENT = {
  id: "frost-serpent",
  name: "Frost Serpent",
  level: 7,
  element: "Mercury",
  stats: {
    hp: 95,
    pp: 22,
    atk: 18,
    def: 14,
    mag: 20,
    spd: 16
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...POISON_STRIKE, unlockLevel: 1 }
  ],
  baseXp: 70,
  baseGold: 38
};
const AQUA_DRAKE = {
  id: "aqua-drake",
  name: "Aqua Drake",
  level: 8,
  element: "Mercury",
  stats: {
    hp: 135,
    pp: 28,
    atk: 22,
    def: 18,
    mag: 24,
    spd: 14
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 }
  ],
  baseXp: 88,
  baseGold: 46
};
const TIDAL_WRAITH = {
  id: "tidal-wraith",
  name: "Tidal Wraith",
  level: 9,
  element: "Mercury",
  stats: {
    hp: 120,
    pp: 35,
    atk: 18,
    def: 16,
    mag: 28,
    spd: 18
  },
  abilities: [
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 }
  ],
  baseXp: 95,
  baseGold: 50
};
const GLACIER_WYRM = {
  id: "glacier-wyrm",
  name: "Glacier Wyrm",
  level: 10,
  element: "Mercury",
  stats: {
    hp: 180,
    pp: 32,
    atk: 26,
    def: 22,
    mag: 26,
    spd: 13
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 }
  ],
  baseXp: 125,
  baseGold: 65
};
const STORM_RAVEN = {
  id: "storm-raven",
  name: "Storm Raven",
  level: 7,
  element: "Jupiter",
  stats: {
    hp: 75,
    pp: 25,
    atk: 16,
    def: 12,
    mag: 22,
    spd: 20
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 }
  ],
  baseXp: 68,
  baseGold: 36
};
const LIGHTNING_LYNX = {
  id: "lightning-lynx",
  name: "Lightning Lynx",
  level: 8,
  element: "Jupiter",
  stats: {
    hp: 90,
    pp: 22,
    atk: 24,
    def: 14,
    mag: 18,
    spd: 24
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...PRECISE_JAB, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 }
  ],
  baseXp: 85,
  baseGold: 44
};
const CYCLONE_DJINNI = {
  id: "cyclone-djinni",
  name: "Cyclone Djinni",
  level: 9,
  element: "Jupiter",
  stats: {
    hp: 110,
    pp: 40,
    atk: 20,
    def: 15,
    mag: 30,
    spd: 19
  },
  abilities: [
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 }
  ],
  baseXp: 100,
  baseGold: 52
};
const TEMPEST_DRAGON = {
  id: "tempest-dragon",
  name: "Tempest Dragon",
  level: 10,
  element: "Jupiter",
  stats: {
    hp: 165,
    pp: 45,
    atk: 28,
    def: 20,
    mag: 32,
    spd: 17
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 }
  ],
  baseXp: 130,
  baseGold: 68
};
const ALPHA_PHOENIX = {
  id: "alpha-phoenix",
  name: "Alpha Phoenix",
  level: 11,
  element: "Mars",
  stats: {
    hp: 280,
    pp: 50,
    atk: 32,
    def: 24,
    mag: 36,
    spd: 20
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 }
  ],
  baseXp: 180,
  baseGold: 95
};
const ELDER_BASILISK = {
  id: "elder-basilisk",
  name: "Elder Basilisk",
  level: 11,
  element: "Venus",
  stats: {
    hp: 320,
    pp: 35,
    atk: 34,
    def: 30,
    mag: 22,
    spd: 12
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...POISON_STRIKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 }
  ],
  baseXp: 185,
  baseGold: 98
};
const KRAKEN = {
  id: "kraken",
  name: "Kraken",
  level: 11,
  element: "Mercury",
  stats: {
    hp: 300,
    pp: 42,
    atk: 30,
    def: 28,
    mag: 28,
    spd: 14
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 }
  ],
  baseXp: 175,
  baseGold: 92
};
const STORM_TITAN = {
  id: "storm-titan",
  name: "Storm Titan",
  level: 12,
  element: "Jupiter",
  stats: {
    hp: 350,
    pp: 55,
    atk: 36,
    def: 26,
    mag: 38,
    spd: 16
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 }
  ],
  baseXp: 200,
  baseGold: 105
};
const VOID_SPECTER = {
  id: "void-specter",
  name: "Void Specter",
  level: 11,
  element: "Jupiter",
  stats: {
    hp: 140,
    pp: 48,
    atk: 24,
    def: 18,
    mag: 34,
    spd: 22
  },
  abilities: [
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 }
  ],
  baseXp: 145,
  baseGold: 76
};
const FROST_LICH = {
  id: "frost-lich",
  name: "Frost Lich",
  level: 11,
  element: "Mercury",
  stats: {
    hp: 155,
    pp: 55,
    atk: 22,
    def: 20,
    mag: 36,
    spd: 15
  },
  abilities: [
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 }
  ],
  baseXp: 150,
  baseGold: 78
};
const MAGMA_COLOSSUS = {
  id: "magma-colossus",
  name: "Magma Colossus",
  level: 12,
  element: "Mars",
  stats: {
    hp: 220,
    pp: 30,
    atk: 38,
    def: 32,
    mag: 20,
    spd: 8
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 },
    { ...BURN_TOUCH, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 }
  ],
  baseXp: 160,
  baseGold: 84
};
const TERRA_GUARDIAN = {
  id: "terra-guardian",
  name: "Terra Guardian",
  level: 12,
  element: "Venus",
  stats: {
    hp: 250,
    pp: 28,
    atk: 32,
    def: 36,
    mag: 18,
    spd: 9
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 }
  ],
  baseXp: 165,
  baseGold: 86
};
const WIND_HAWK = {
  id: "wind-hawk",
  name: "Wind Hawk",
  level: 4,
  element: "Jupiter",
  stats: {
    hp: 30,
    pp: 12,
    atk: 16,
    def: 6,
    mag: 12,
    spd: 20
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 }
  ],
  baseXp: 32,
  baseGold: 18
};
const FIRE_EAGLE = {
  id: "fire-eagle",
  name: "Fire Eagle",
  level: 6,
  element: "Mars",
  stats: {
    hp: 45,
    pp: 16,
    atk: 22,
    def: 10,
    mag: 18,
    spd: 17
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...FIREBALL, unlockLevel: 1 }
  ],
  baseXp: 50,
  baseGold: 26
};
const ICE_OWL = {
  id: "ice-owl",
  name: "Ice Owl",
  level: 7,
  element: "Mercury",
  stats: {
    hp: 40,
    pp: 20,
    atk: 18,
    def: 12,
    mag: 20,
    spd: 15
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 }
  ],
  baseXp: 62,
  baseGold: 34
};
const STONE_ROC = {
  id: "stone-roc",
  name: "Stone Roc",
  level: 9,
  element: "Venus",
  stats: {
    hp: 90,
    pp: 22,
    atk: 28,
    def: 18,
    mag: 14,
    spd: 12
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...QUAKE, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 }
  ],
  baseXp: 110,
  baseGold: 56
};
const ARCTIC_SOVEREIGN = {
  id: "arctic-sovereign",
  name: "Arctic Sovereign",
  level: 13,
  element: "Mercury",
  stats: {
    hp: 380,
    pp: 60,
    atk: 32,
    def: 34,
    mag: 40,
    spd: 18
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 }
  ],
  baseXp: 220,
  baseGold: 115
};
const NEPTUNE_WARDEN = {
  id: "neptune-warden",
  name: "Neptune Warden",
  level: 14,
  element: "Mercury",
  stats: {
    hp: 410,
    pp: 65,
    atk: 34,
    def: 36,
    mag: 42,
    spd: 16
  },
  abilities: [
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 }
  ],
  baseXp: 240,
  baseGold: 125
};
const ABYSSAL_EMPEROR = {
  id: "abyssal-emperor",
  name: "Abyssal Emperor",
  level: 15,
  element: "Mercury",
  stats: {
    hp: 450,
    pp: 70,
    atk: 36,
    def: 40,
    mag: 44,
    spd: 17
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...PARTY_HEAL, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 }
  ],
  baseXp: 260,
  baseGold: 135
};
const STRATOSPHERE_LORD = {
  id: "stratosphere-lord",
  name: "Stratosphere Lord",
  level: 13,
  element: "Jupiter",
  stats: {
    hp: 340,
    pp: 65,
    atk: 38,
    def: 24,
    mag: 42,
    spd: 22
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 }
  ],
  baseXp: 225,
  baseGold: 118
};
const ZEUS_AVATAR = {
  id: "zeus-avatar",
  name: "Zeus Avatar",
  level: 14,
  element: "Jupiter",
  stats: {
    hp: 370,
    pp: 70,
    atk: 40,
    def: 26,
    mag: 46,
    spd: 24
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 }
  ],
  baseXp: 245,
  baseGold: 128
};
const CELESTIAL_FURY = {
  id: "celestial-fury",
  name: "Celestial Fury",
  level: 15,
  element: "Jupiter",
  stats: {
    hp: 400,
    pp: 75,
    atk: 42,
    def: 28,
    mag: 50,
    spd: 26
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 }
  ],
  baseXp: 270,
  baseGold: 140
};
const PERMAFROST_GOLEM = {
  id: "permafrost-golem",
  name: "Permafrost Golem",
  level: 13,
  element: "Mercury",
  stats: {
    hp: 280,
    pp: 35,
    atk: 28,
    def: 38,
    mag: 26,
    spd: 10
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 }
  ],
  baseXp: 170,
  baseGold: 88
};
const TUNDRA_SERPENT = {
  id: "tundra-serpent",
  name: "Tundra Serpent",
  level: 12,
  element: "Mercury",
  stats: {
    hp: 185,
    pp: 38,
    atk: 26,
    def: 22,
    mag: 30,
    spd: 17
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...POISON_STRIKE, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 }
  ],
  baseXp: 155,
  baseGold: 82
};
const POLAR_GUARDIAN = {
  id: "polar-guardian",
  name: "Polar Guardian",
  level: 13,
  element: "Mercury",
  stats: {
    hp: 260,
    pp: 40,
    atk: 30,
    def: 32,
    mag: 28,
    spd: 14
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...HEAL, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 }
  ],
  baseXp: 165,
  baseGold: 86
};
const VOLTAGE_CHIMERA = {
  id: "voltage-chimera",
  name: "Voltage Chimera",
  level: 13,
  element: "Jupiter",
  stats: {
    hp: 200,
    pp: 50,
    atk: 32,
    def: 20,
    mag: 38,
    spd: 25
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 }
  ],
  baseXp: 175,
  baseGold: 90
};
const MONSOON_DRAKE = {
  id: "monsoon-drake",
  name: "Monsoon Drake",
  level: 12,
  element: "Jupiter",
  stats: {
    hp: 190,
    pp: 45,
    atk: 30,
    def: 18,
    mag: 36,
    spd: 23
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 }
  ],
  baseXp: 158,
  baseGold: 83
};
const AURORA_ELEMENTAL = {
  id: "aurora-elemental",
  name: "Aurora Elemental",
  level: 14,
  element: "Jupiter",
  stats: {
    hp: 170,
    pp: 55,
    atk: 26,
    def: 22,
    mag: 44,
    spd: 27
  },
  abilities: [
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BLIND, unlockLevel: 1 },
    { ...WEAKEN_DEF, unlockLevel: 1 }
  ],
  baseXp: 180,
  baseGold: 94
};
const VORTEX_SENTINEL = {
  id: "vortex-sentinel",
  name: "Vortex Sentinel",
  level: 13,
  element: "Jupiter",
  stats: {
    hp: 210,
    pp: 48,
    atk: 34,
    def: 24,
    mag: 40,
    spd: 21
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...BOOST_ATK, unlockLevel: 1 }
  ],
  baseXp: 168,
  baseGold: 87
};
const MAELSTROM_BEAST = {
  id: "maelstrom-beast",
  name: "Maelstrom Beast",
  level: 14,
  element: "Mercury",
  stats: {
    hp: 330,
    pp: 52,
    atk: 35,
    def: 30,
    mag: 38,
    spd: 19
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...ICE_SHARD, unlockLevel: 1 },
    { ...FREEZE_BLAST, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...BOOST_DEF, unlockLevel: 1 }
  ],
  baseXp: 195,
  baseGold: 102
};
const THUNDERSTORM_COLOSSUS = {
  id: "thunderstorm-colossus",
  name: "Thunderstorm Colossus",
  level: 15,
  element: "Jupiter",
  stats: {
    hp: 310,
    pp: 60,
    atk: 40,
    def: 28,
    mag: 46,
    spd: 20
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 },
    { ...GUST, unlockLevel: 1 },
    { ...CHAIN_LIGHTNING, unlockLevel: 1 },
    { ...PARALYZE_SHOCK, unlockLevel: 1 },
    { ...GUARD_BREAK, unlockLevel: 1 }
  ],
  baseXp: 210,
  baseGold: 110
};
const BANDIT_MINION = {
  id: "bandit-minion",
  name: "Bandit",
  level: 3,
  element: "Mars",
  stats: {
    hp: 48,
    pp: 0,
    atk: 13,
    def: 8,
    mag: 5,
    spd: 9
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 }
  ],
  baseXp: 18,
  baseGold: 15
};
const BANDIT_CAPTAIN = {
  id: "bandit-captain",
  name: "Bandit Captain",
  level: 4,
  element: "Mars",
  stats: {
    hp: 90,
    pp: 0,
    atk: 16,
    def: 10,
    mag: 6,
    spd: 10
  },
  abilities: [
    { ...STRIKE, unlockLevel: 1 },
    { ...HEAVY_STRIKE, unlockLevel: 1 }
  ],
  baseXp: 30,
  baseGold: 25
};
const BANDIT = {
  id: "bandit",
  name: "Road Bandit",
  level: 3,
  element: "Mars",
  stats: { hp: 50, pp: 0, atk: 12, def: 8, mag: 4, spd: 9 },
  abilities: [{ ...STRIKE, unlockLevel: 1 }],
  baseXp: 20,
  baseGold: 12
};
const SCAVENGER = {
  id: "scavenger",
  name: "Scavenger",
  level: 2,
  element: "Venus",
  stats: { hp: 38, pp: 0, atk: 8, def: 6, mag: 3, spd: 7 },
  abilities: [{ ...STRIKE, unlockLevel: 1 }],
  baseXp: 10,
  baseGold: 6
};
const MERCHANT_GUARD_ENEMY = {
  id: "merchant-guard",
  name: "Merchant Guard",
  level: 2,
  element: "Venus",
  stats: { hp: 60, pp: 0, atk: 10, def: 9, mag: 3, spd: 8 },
  abilities: [{ ...STRIKE, unlockLevel: 1 }, { ...GUARD_BREAK, unlockLevel: 1 }],
  baseXp: 22,
  baseGold: 14
};
const WILD_BOAR = {
  id: "wild-boar",
  name: "Wild Boar",
  level: 1,
  element: "Venus",
  stats: { hp: 36, pp: 0, atk: 10, def: 5, mag: 2, spd: 6 },
  abilities: [{ ...STRIKE, unlockLevel: 1 }],
  baseXp: 8,
  baseGold: 5
};
const CARRION_BIRD = {
  id: "carrion-bird",
  name: "Carrion Bird",
  level: 1,
  element: "Jupiter",
  stats: { hp: 28, pp: 0, atk: 6, def: 4, mag: 2, spd: 12 },
  abilities: [{ ...STRIKE, unlockLevel: 1 }, { ...GUST, unlockLevel: 1 }],
  baseXp: 9,
  baseGold: 4
};
const warMageDef = UNIT_DEFINITIONS["war-mage"];
let _GARET_ENEMY;
if (warMageDef) {
  _GARET_ENEMY = {
    ...unitDefinitionToEnemy(
      warMageDef,
      2,
      // Level 2 for VS1
      60,
      // Base XP
      19,
      // Base Gold
      {
        id: "garet-enemy",
        stats: {
          // VS1 tutorial fight tuning:
          // - Player starts with 1 mana circle, so they can only basic attack (plus Djinn stat bonuses).
          // - Enemies ignore mana costs, so we keep this fight physical-only (see abilities override below).
          // Goal: winnable with basic attacks, but not trivial.
          hp: 135,
          atk: 12
        }
      }
    ),
    // VS1 tutorial: restrict to basic attack only so the first fight is beatable.
    abilities: [{ ...STRIKE, unlockLevel: 1 }]
  };
} else {
  _GARET_ENEMY = {
    id: "garet-enemy",
    name: "Garet (Enemy)",
    level: 2,
    element: "Mars",
    stats: { hp: 135, pp: 0, atk: 12, def: 8, mag: 4, spd: 9 },
    abilities: [{ ...STRIKE, unlockLevel: 1 }],
    baseXp: 60,
    baseGold: 19
  };
}
const GARET_ENEMY = _GARET_ENEMY;
const sentinelDef = UNIT_DEFINITIONS["sentinel"];
let _SENTINEL_ENEMY;
if (sentinelDef) {
  _SENTINEL_ENEMY = unitDefinitionToEnemy(
    sentinelDef,
    3,
    // Level 3
    80,
    // Base XP
    25,
    // Base Gold
    { id: "sentinel-enemy" }
  );
} else {
  _SENTINEL_ENEMY = {
    id: "sentinel-enemy",
    name: "Sentinel (Enemy)",
    level: 3,
    element: "Venus",
    stats: { hp: 90, pp: 0, atk: 18, def: 12, mag: 6, spd: 9 },
    abilities: [{ ...STRIKE, unlockLevel: 1 }, { ...HEAVY_STRIKE, unlockLevel: 1 }],
    baseXp: 80,
    baseGold: 25
  };
}
const SENTINEL_ENEMY = _SENTINEL_ENEMY;
const stormcallerDef = UNIT_DEFINITIONS["stormcaller"];
let _STORMCALLER_ENEMY;
if (stormcallerDef) {
  _STORMCALLER_ENEMY = unitDefinitionToEnemy(
    stormcallerDef,
    3,
    // Level 3
    80,
    // Base XP
    25,
    // Base Gold
    { id: "stormcaller-enemy" }
  );
} else {
  _STORMCALLER_ENEMY = {
    id: "stormcaller-enemy",
    name: "Stormcaller (Enemy)",
    level: 3,
    element: "Jupiter",
    stats: { hp: 88, pp: 20, atk: 16, def: 10, mag: 14, spd: 12 },
    abilities: [{ ...GUST, unlockLevel: 1 }, { ...CHAIN_LIGHTNING, unlockLevel: 1 }],
    baseXp: 80,
    baseGold: 25
  };
}
const STORMCALLER_ENEMY = _STORMCALLER_ENEMY;
const ENEMIES = {
  // Enslaved Beasts - Redesigned Originals
  "mercury-slime": MERCURY_SLIME,
  "venus-wolf": VENUS_WOLF,
  // Legacy/test-friendly aliases
  slime: MERCURY_SLIME,
  wolf: VENUS_WOLF,
  beetle: VENUS_BEETLE,
  "mars-bandit": MARS_BANDIT,
  "jupiter-sprite": JUPITER_SPRITE,
  "venus-beetle": VENUS_BEETLE,
  // Enslaved Beasts - Wolf Pack
  "mars-wolf": MARS_WOLF,
  "mercury-wolf": MERCURY_WOLF,
  "jupiter-wolf": JUPITER_WOLF,
  // Counter-Strategy Enemies - Support Roles (NEW from enemies_v2.ts)
  "frost-mystic": FROST_MYSTIC,
  "gale-priest": GALE_PRIEST,
  "stone-guardian": STONE_GUARDIAN,
  "ember-cleric": EMBER_CLERIC,
  "earth-shaman": EARTH_SHAMAN,
  "tide-enchanter": TIDE_ENCHANTER,
  "frost-oracle": FROST_ORACLE,
  "terra-warden": TERRA_WARDEN,
  "flame-herald": FLAME_HERALD,
  // Enslaved Beasts - Bear Variants
  "venus-bear": VENUS_BEAR,
  "mars-bear": MARS_BEAR,
  "mercury-bear": MERCURY_BEAR,
  "jupiter-bear": JUPITER_BEAR,
  // Slavers - Tier 1 Scouts
  "earth-scout": EARTH_SCOUT,
  "flame-scout": FLAME_SCOUT,
  "frost-scout": FROST_SCOUT,
  "gale-scout": GALE_SCOUT,
  // Slavers - Tier 2 Soldiers
  "terra-soldier": TERRA_SOLDIER,
  "blaze-soldier": BLAZE_SOLDIER,
  "tide-soldier": TIDE_SOLDIER,
  "wind-soldier": WIND_SOLDIER,
  // Slavers - Tier 3 Captains
  "stone-captain": STONE_CAPTAIN,
  "inferno-captain": INFERNO_CAPTAIN,
  "glacier-captain": GLACIER_CAPTAIN,
  "thunder-captain": THUNDER_CAPTAIN,
  // Slavers - Tier 4 Commanders
  "mountain-commander": MOUNTAIN_COMMANDER,
  "fire-commander": FIRE_COMMANDER,
  "storm-commander": STORM_COMMANDER,
  "lightning-commander": LIGHTNING_COMMANDER,
  // Slavers - Tier 5 Warlords (Mini-Bosses)
  "granite-warlord": GRANITE_WARLORD,
  "volcano-warlord": VOLCANO_WARLORD,
  "blizzard-warlord": BLIZZARD_WARLORD,
  "tempest-warlord": TEMPEST_WARLORD,
  // Legendary Enslaved - Elementals
  "rock-elemental": ROCK_ELEMENTAL,
  "flame-elemental": FLAME_ELEMENTAL,
  "ice-elemental": ICE_ELEMENTAL,
  "storm-elemental": STORM_ELEMENTAL,
  // Legendary Enslaved - Mythical Beasts
  basilisk: BASILISK,
  phoenix: PHOENIX,
  leviathan: LEVIATHAN,
  thunderbird: THUNDERBIRD,
  hydra: HYDRA,
  // Boss Enemies
  "mars-sprite": MARS_SPRITE,
  "mercury-sprite": MERCURY_SPRITE,
  "venus-sprite": VENUS_SPRITE,
  chimera: CHIMERA,
  overseer: OVERSEER,
  // Undead Category
  "skeleton-warrior": SKELETON_WARRIOR,
  "ghost-wisp": GHOST_WISP,
  "zombie-hound": ZOMBIE_HOUND,
  "bone-mage": BONE_MAGE,
  // Golem Category
  "clay-golem": CLAY_GOLEM,
  "iron-golem": IRON_GOLEM,
  "crystal-golem": CRYSTAL_GOLEM,
  "storm-golem": STORM_GOLEM,
  // Avian Category
  "wind-hawk": WIND_HAWK,
  "fire-eagle": FIRE_EAGLE,
  "ice-owl": ICE_OWL,
  "stone-roc": STONE_ROC,
  // Mercury Beasts (Tier 3-4)
  "frost-serpent": FROST_SERPENT,
  "aqua-drake": AQUA_DRAKE,
  "tidal-wraith": TIDAL_WRAITH,
  "glacier-wyrm": GLACIER_WYRM,
  // Jupiter Beasts (Tier 3-4)
  "storm-raven": STORM_RAVEN,
  "lightning-lynx": LIGHTNING_LYNX,
  "cyclone-djinni": CYCLONE_DJINNI,
  "tempest-dragon": TEMPEST_DRAGON,
  // Boss Variants (Tier 5)
  "alpha-phoenix": ALPHA_PHOENIX,
  "elder-basilisk": ELDER_BASILISK,
  "kraken": KRAKEN,
  "storm-titan": STORM_TITAN,
  // Tier 5 Enemies
  "void-specter": VOID_SPECTER,
  "frost-lich": FROST_LICH,
  "magma-colossus": MAGMA_COLOSSUS,
  "terra-guardian": TERRA_GUARDIAN,
  // Mercury Elite Bosses (Tower Floor 15-20)
  "arctic-sovereign": ARCTIC_SOVEREIGN,
  "neptune-warden": NEPTUNE_WARDEN,
  "abyssal-emperor": ABYSSAL_EMPEROR,
  // Jupiter Elite Bosses (Tower Floor 15-20)
  "stratosphere-lord": STRATOSPHERE_LORD,
  "zeus-avatar": ZEUS_AVATAR,
  "celestial-fury": CELESTIAL_FURY,
  // Mercury Tier 5 Variants
  "permafrost-golem": PERMAFROST_GOLEM,
  "tundra-serpent": TUNDRA_SERPENT,
  "polar-guardian": POLAR_GUARDIAN,
  // Jupiter Tier 5 Variants
  "voltage-chimera": VOLTAGE_CHIMERA,
  "monsoon-drake": MONSOON_DRAKE,
  "aurora-elemental": AURORA_ELEMENTAL,
  "vortex-sentinel": VORTEX_SENTINEL,
  // Hybrid Tier 5 Bosses
  "maelstrom-beast": MAELSTROM_BEAST,
  "thunderstorm-colossus": THUNDERSTORM_COLOSSUS,
  // VS1 Demo
  "bandit-minion": BANDIT_MINION,
  "bandit-captain": BANDIT_CAPTAIN,
  "bandit": BANDIT,
  "scavenger": SCAVENGER,
  "merchant-guard": MERCHANT_GUARD_ENEMY,
  "wild-boar": WILD_BOAR,
  "carrion-bird": CARRION_BIRD,
  // Recruitable Unit Enemies
  "garet-enemy": GARET_ENEMY,
  "sentinel-enemy": SENTINEL_ENEMY,
  "stormcaller-enemy": STORMCALLER_ENEMY,
  // Injected Mercury & Jupiter themed enemies (inline definitions)
  "mercury-mistling": {
    id: "mercury-mistling",
    name: "Mistling",
    level: 3,
    element: "Mercury",
    stats: { hp: 72, pp: 14, atk: 10, def: 8, mag: 18, spd: 13 },
    abilities: [{ ...ICE_SHARD, unlockLevel: 1 }, { ...FREEZE_BLAST, unlockLevel: 1 }],
    baseXp: 34,
    baseGold: 16
  },
  "mercury-glacial-sprite": {
    id: "mercury-glacial-sprite",
    name: "Glacial Sprite",
    level: 4,
    element: "Mercury",
    stats: { hp: 88, pp: 18, atk: 9, def: 10, mag: 22, spd: 15 },
    abilities: [{ ...ICE_SHARD, unlockLevel: 1 }, { ...HEAL, unlockLevel: 1 }],
    baseXp: 42,
    baseGold: 22
  },
  "mercury-frost-hound": {
    id: "mercury-frost-hound",
    name: "Frost Hound",
    level: 5,
    element: "Mercury",
    stats: { hp: 110, pp: 12, atk: 18, def: 12, mag: 16, spd: 17 },
    abilities: [{ ...STRIKE, unlockLevel: 1 }, { ...FREEZE_BLAST, unlockLevel: 1 }],
    baseXp: 56,
    baseGold: 28
  },
  "mercury-aquifer-imp": {
    id: "mercury-aquifer-imp",
    name: "Aquifer Imp",
    level: 2,
    element: "Mercury",
    stats: { hp: 46, pp: 16, atk: 7, def: 6, mag: 14, spd: 12 },
    abilities: [{ ...ICE_SHARD, unlockLevel: 1 }],
    baseXp: 20,
    baseGold: 10
  },
  "mercury-warder": {
    id: "mercury-warder",
    name: "Warder of the Tides",
    level: 6,
    element: "Mercury",
    stats: { hp: 150, pp: 30, atk: 20, def: 18, mag: 24, spd: 11 },
    abilities: [{ ...FREEZE_BLAST, unlockLevel: 1 }, { ...HEAL, unlockLevel: 1 }],
    baseXp: 80,
    baseGold: 40
  },
  "jupiter-zephyr-imp": {
    id: "jupiter-zephyr-imp",
    name: "Zephyr Imp",
    level: 2,
    element: "Jupiter",
    stats: { hp: 44, pp: 14, atk: 8, def: 6, mag: 13, spd: 16 },
    abilities: [{ ...GUST, unlockLevel: 1 }],
    baseXp: 18,
    baseGold: 9
  },
  "jupiter-gale-moth": {
    id: "jupiter-gale-moth",
    name: "Gale Moth",
    level: 3,
    element: "Jupiter",
    stats: { hp: 60, pp: 18, atk: 10, def: 8, mag: 18, spd: 20 },
    abilities: [{ ...GUST, unlockLevel: 1 }, { ...BLIND, unlockLevel: 1 }],
    baseXp: 32,
    baseGold: 16
  },
  "jupiter-stormling": {
    id: "jupiter-stormling",
    name: "Stormling",
    level: 5,
    element: "Jupiter",
    stats: { hp: 95, pp: 24, atk: 16, def: 12, mag: 26, spd: 22 },
    abilities: [{ ...CHAIN_LIGHTNING, unlockLevel: 1 }, { ...PARALYZE_SHOCK, unlockLevel: 1 }],
    baseXp: 72,
    baseGold: 36
  },
  "jupiter-lightning-hopper": {
    id: "jupiter-lightning-hopper",
    name: "Lightning Hopper",
    level: 4,
    element: "Jupiter",
    stats: { hp: 78, pp: 20, atk: 14, def: 10, mag: 20, spd: 24 },
    abilities: [{ ...PARALYZE_SHOCK, unlockLevel: 1 }, { ...PRECISE_JAB, unlockLevel: 1 }],
    baseXp: 46,
    baseGold: 24
  },
  "jupiter-vortex-sentry": {
    id: "jupiter-vortex-sentry",
    name: "Vortex Sentry",
    level: 6,
    element: "Jupiter",
    stats: { hp: 140, pp: 30, atk: 22, def: 18, mag: 30, spd: 18 },
    abilities: [{ ...GUST, unlockLevel: 1 }, { ...CHAIN_LIGHTNING, unlockLevel: 1 }, { ...BOOST_DEF, unlockLevel: 1 }],
    baseXp: 94,
    baseGold: 48
  },
  // Restored Content
  "mire-toad": MIRE_TOAD,
  "lumen-fawn": LUMEN_FAWN,
  "the-golden-sun": {
    id: "the-golden-sun",
    name: "The Golden Sun",
    level: 20,
    element: "Jupiter",
    stats: { hp: 5e3, pp: 999, atk: 150, def: 120, mag: 200, spd: 80 },
    abilities: [{ ...CHAIN_LIGHTNING, unlockLevel: 1 }, { ...BOOST_DEF, unlockLevel: 1 }],
    baseXp: 5e4,
    baseGold: 99999
  }
};
export {
  ABYSSAL_EMPEROR,
  ALPHA_PHOENIX,
  AQUA_DRAKE,
  ARCTIC_SOVEREIGN,
  AURORA_ELEMENTAL,
  BANDIT,
  BANDIT_CAPTAIN,
  BANDIT_MINION,
  BASILISK,
  BLAZE_SOLDIER,
  BLIZZARD_WARLORD,
  BONE_MAGE,
  CARRION_BIRD,
  CELESTIAL_FURY,
  CHIMERA,
  CLAY_GOLEM,
  CRYSTAL_GOLEM,
  CYCLONE_DJINNI,
  EARTH_SCOUT,
  EARTH_SHAMAN,
  ELDER_BASILISK,
  EMBER_CLERIC,
  ENEMIES,
  FIRE_COMMANDER,
  FIRE_EAGLE,
  FLAME_ELEMENTAL,
  FLAME_HERALD,
  FLAME_SCOUT,
  FROST_LICH,
  FROST_MYSTIC,
  FROST_ORACLE,
  FROST_SCOUT,
  FROST_SERPENT,
  GALE_PRIEST,
  GALE_SCOUT,
  GARET_ENEMY,
  GHOST_WISP,
  GLACIER_CAPTAIN,
  GLACIER_WYRM,
  GRANITE_WARLORD,
  HYDRA,
  ICE_ELEMENTAL,
  ICE_OWL,
  INFERNO_CAPTAIN,
  IRON_GOLEM,
  JUPITER_BEAR,
  JUPITER_SPRITE,
  JUPITER_WOLF,
  KRAKEN,
  LEVIATHAN,
  LIGHTNING_COMMANDER,
  LIGHTNING_LYNX,
  MAELSTROM_BEAST,
  MAGMA_COLOSSUS,
  MARS_BANDIT,
  MARS_BEAR,
  MARS_SPRITE,
  MARS_WOLF,
  MERCHANT_GUARD_ENEMY,
  MERCURY_BEAR,
  MERCURY_SLIME,
  MERCURY_SPRITE,
  MERCURY_WOLF,
  MONSOON_DRAKE,
  MOUNTAIN_COMMANDER,
  NEPTUNE_WARDEN,
  OVERSEER,
  PERMAFROST_GOLEM,
  PHOENIX,
  POLAR_GUARDIAN,
  ROCK_ELEMENTAL,
  SCAVENGER,
  SENTINEL_ENEMY,
  SKELETON_WARRIOR,
  STONE_CAPTAIN,
  STONE_GUARDIAN,
  STONE_ROC,
  STORMCALLER_ENEMY,
  STORM_COMMANDER,
  STORM_ELEMENTAL,
  STORM_GOLEM,
  STORM_RAVEN,
  STORM_TITAN,
  STRATOSPHERE_LORD,
  TEMPEST_DRAGON,
  TEMPEST_WARLORD,
  TERRA_GUARDIAN,
  TERRA_SOLDIER,
  TERRA_WARDEN,
  THUNDERBIRD,
  THUNDERSTORM_COLOSSUS,
  THUNDER_CAPTAIN,
  TIDAL_WRAITH,
  TIDE_ENCHANTER,
  TIDE_SOLDIER,
  TUNDRA_SERPENT,
  VENUS_BEAR,
  VENUS_BEETLE,
  VENUS_SPRITE,
  VENUS_WOLF,
  VOID_SPECTER,
  VOLCANO_WARLORD,
  VOLTAGE_CHIMERA,
  VORTEX_SENTINEL,
  WILD_BOAR,
  WIND_HAWK,
  WIND_SOLDIER,
  ZEUS_AVATAR,
  ZOMBIE_HOUND
};
//# sourceMappingURL=enemies-D_IcxC13.js.map
