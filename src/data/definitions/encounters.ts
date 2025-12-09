/**
 * Encounter definitions - Liberation of Vale Village (Houses 1-20)
 * These will be validated against EncounterSchema at startup
 *
 * Chapter 1: 20 Houses - The Liberation Arc
 * - Act 1: Discovery (Houses 1-7)
 * - Act 2: Resistance (Houses 8-14)
 * - Act 3: Liberation (Houses 15-20)
 *
 * LOCKED PROGRESSION: Rewards in this file must stay aligned with HOUSES_1-20_COMPLETE_PROGRESSION.md.
 * Any future changes must first update the locked spreadsheet before touching these definitions.
 *
 * SUMMARY:
 * - Pre-game: Isaac + Flint Djinn (story gift)
 * - House 1 (VS1): Garet recruit + Forge Djinn (no equipment)
 * - Houses 2-3: Mystic and Ranger story joins
 * - Houses 5, 8, 11, 14, 15, 17: New recruits (Blaze, Sentinel, Karis, Tyrell, Stormcaller, Felix)
 * - Djinn: Forge (H1), Breeze (H7), Fizz (H8), Granite (H12), Squall (H15), Bane (H18), Storm (H20)
 */
import type { Encounter } from '../schemas/EncounterSchema';

const createVs1Encounter = (id: string, name: string): Encounter => ({
  id,
  name,
  enemies: ['garet-enemy'], // Enemy version of War Mage
  difficulty: 'easy',
  reward: {
    xp: 60,
    gold: 20,
    equipment: { type: 'fixed', itemId: 'leather-cap' }, // Starter helm drop for House 1
    djinn: 'forge', // Mars T1 Djinn
    unlockUnit: 'war-mage', // Recruit Garet
  },
});

// ============================================================================
// ACT 1: DISCOVERY (Houses 1-7)
// ============================================================================

/**
 * HOUSE 1 (VS1 Tutorial)
 * - First battle, introduces combat
 * - Recruit: Garet (War Mage, Mars)
 * - Reward: Forge Djinn (Mars T1) without any equipment (locked blueprint)
 * - Milestone: First unit recruitment from battle!
 */
export const HOUSE_01_VS1: Encounter = createVs1Encounter('house-01', "House 1: Garet's Liberation");
export const VS1_GARET_ENCOUNTER: Encounter = createVs1Encounter('vs1-garet', "VS1: Garet's Liberation");

/**
 * HOUSE 2
 * - Equipment: bronze-sword (Venus)
 * - Story Event: Mystic joins after battle (auto-recruit, not from battle reward)
 */
export const HOUSE_02: Encounter = {
  id: 'house-02',
  name: 'House 2: The Bronze Trial',
  enemies: ['earth-scout', 'venus-wolf', 'venus-sprite'],
  difficulty: 'easy',
  reward: {
    xp: 70,
    gold: 22,
    equipment: {
      type: 'fixed',
      itemId: 'bronze-sword',
    },
  },
};

/**
 * HOUSE 3
 * - Equipment: iron-armor (Venus/Mars shared)
 * - Story Event: Ranger joins after battle (auto-recruit, not from battle reward)
 */
export const HOUSE_03: Encounter = {
  id: 'house-03',
  name: 'House 3: Iron Bonds',
  enemies: ['flame-scout', 'mars-wolf', 'mars-sprite'],
  difficulty: 'easy',
  reward: {
    xp: 80,
    gold: 24,
    equipment: {
      type: 'fixed',
      itemId: 'iron-armor',
    },
  },
};

/**
 * HOUSE 4
 * - Equipment: magic-rod (Mercury/Jupiter shared)
 * - First Healer: Frost Mystic (Mercury healer)
 */
export const HOUSE_04: Encounter = {
  id: 'house-04',
  name: 'House 4: Arcane Power',
  enemies: ['frost-scout', 'frost-mystic', 'mercury-sprite', 'aqua-drake'],
  difficulty: 'easy',
  reward: {
    xp: 90,
    gold: 26,
    equipment: {
      type: 'fixed',
      itemId: 'magic-rod',
    },
  },
};

/**
 * HOUSE 5
 * - Recruit: Blaze (Mars, Balanced Warrior)
 * - First recruitable Mars unit (shares equipment with Garet)
 * - Reward: Blaze is the upgrade – no equipment drop per blueprint
 * - Second Healer: Gale Priest (Jupiter healer + debuff)
 */
export const HOUSE_05: Encounter = {
  id: 'house-05',
  name: 'House 5: The Blazing Warrior',
  enemies: ['gale-scout', 'gale-priest'],
  difficulty: 'easy',
  reward: {
    xp: 100,
    gold: 28,
    equipment: { type: 'fixed', itemId: 'iron-sword' },
    unlockUnit: 'blaze', // Recruit Blaze (Mars Balanced Warrior)
  },
};

/**
 * HOUSE 6
 * - Equipment: steel-helm (Venus)
 * - Tank + Healer Duo: Stone Guardian (Venus tank) + Ember Cleric (Mars healer)
 */
export const HOUSE_06: Encounter = {
  id: 'house-06',
  name: 'House 6: The Steel Guardian',
  enemies: ['stone-guardian', 'ember-cleric', 'flame-scout', 'storm-raven'],
  difficulty: 'medium',
  reward: {
    xp: 120,
    gold: 32,
    djinn: 'gust', // Jupiter T1 Djinn
    equipment: {
      type: 'fixed',
      itemId: 'steel-helm',
    },
  },
};

/**
 * HOUSE 7
 * - Reward: Breeze Djinn (Jupiter T1)
 * - Equipment Choice (steel-sword vs battle-axe per locked blueprint)
 * - MILESTONE: 3rd Djinn = SUMMONS UNLOCKED! (Flint + Forge + Breeze)
 * - Earth Shaman (Venus buffer + healer) forces summons usage
 */
export const HOUSE_07: Encounter = {
  id: 'house-07',
  name: 'House 7: Winds of Liberation',
  enemies: ['terra-soldier', 'venus-bear', 'earth-shaman', 'jupiter-sprite', 'wind-hawk', 'glacier-wyrm'],
  difficulty: 'medium',
  reward: {
    xp: 150,
    gold: 40,
    djinn: 'breeze', // Jupiter T1 Djinn - SUMMONS UNLOCK!
    equipment: {
      type: 'choice',
      options: ['steel-sword', 'battle-axe', 'adepts-ring'],
    },
  },
};

// ============================================================================
// ACT 2: RESISTANCE (Houses 8-14)
// ============================================================================

/**
 * HOUSE 8
 * - Reward: Fizz Djinn (Mercury T1) + Sentinel recruit (Venus Support Buffer)
 * - Milestone: Complete T1 Djinn set (4 elements) with no equipment drop
 * - Tide Enchanter (Mercury buffer + healer) creates counter-element test
 */
export const HOUSE_08: Encounter = {
  id: 'house-08',
  name: 'House 8: The Frozen Sentinel',
  enemies: ['ice-owl', 'wind-soldier', 'tide-enchanter', 'frost-serpent'],
  difficulty: 'medium',
  reward: {
    xp: 200,
    gold: 55,
    equipment: { type: 'fixed', itemId: 'steel-armor' },
    djinn: 'fizz', // Mercury T1 Djinn
    unlockUnit: 'sentinel', // Recruit Sentinel (Venus Support Buffer)
  },
};

/**
 * HOUSE 9
 * - Equipment: battle-axe (Mars)
 * - Double Healer Hell: Frost Oracle (party healer) + Ice Elemental (self heal)
 */
export const HOUSE_09: Encounter = {
  id: 'house-09',
  name: 'House 9: Inferno\'s Rage',
  enemies: ['mercury-bear', 'frost-oracle', 'ice-elemental', 'fire-eagle', 'permafrost-golem'],
  difficulty: 'medium',
  reward: {
    xp: 215,
    gold: 58,
    equipment: {
      type: 'fixed',
      itemId: 'spirit-gloves',
    },
  },
};

/**
 * HOUSE 10
 * - Quick-boots vs silver-circlet reward choice (mobility milestone)
 * - Phase-change Flame Elemental (buffs then debuffs)
 */
export const HOUSE_10: Encounter = {
  id: 'house-10',
  name: 'House 10: The Burning Gauntlet',
  enemies: ['blaze-soldier', 'flame-elemental', 'wind-hawk', 'tundra-serpent'],
  difficulty: 'medium',
  reward: {
    xp: 235,
    gold: 62,
    equipment: {
      type: 'choice',
      options: ['silver-circlet', 'quick-boots', 'silver-blade'],
    },
  },
};

/**
 * HOUSE 11
 * - Equipment: silver-armor (Venus)
 * - Recruit: Karis (Mercury, Versatile Scholar)
 * - Trinity Wall: Terra Warden (triple buffer + tank + healer)
 */
export const HOUSE_11: Encounter = {
  id: 'house-11',
  name: 'House 11: The Scholar\'s Trial',
  enemies: ['stone-captain', 'rock-elemental', 'terra-warden', 'sentinel-enemy'],
  difficulty: 'hard',
  reward: {
    xp: 255,
    gold: 68,
    equipment: {
      type: 'choice',
      options: ['silver-armor', 'glory-helm', 'silver-circlet'],
    },
    unlockUnit: 'karis', // Recruit Karis (Mercury Versatile Scholar)
  },
};

/**
 * HOUSE 12
 * - Reward: Granite Djinn (Venus T2) plus defensive reward choice
 * - MILESTONE: First T2 Djinn! (Djinn swapping strategy unlocked)
 * - Boss Gauntlet: Flame Herald (buffer + debuffer) + Phoenix (3-phase boss)
 */
export const HOUSE_12: Encounter = {
  id: 'house-12',
  name: 'House 12: The Granite Fortress',
  enemies: ['inferno-captain', 'phoenix', 'flame-herald', 'clay-golem', 'tundra-serpent'],
  difficulty: 'hard',
  reward: {
    xp: 275,
    gold: 72,
    equipment: {
      type: 'choice',
      options: ['valkyrie-mail', 'power-ring', 'guardian-ring'],
    },
    djinn: 'granite', // Venus T2 Djinn - POWER SPIKE
  },
};

/**
 * HOUSE 13
 * - Equipment Choice (mid-tier weapons plus armor/robes)
 */
export const HOUSE_13: Encounter = {
  id: 'house-13',
  name: 'House 13: The Silver Strike',
  enemies: ['glacier-captain', 'leviathan', 'stormcaller-enemy', 'permafrost-golem'],
  difficulty: 'hard',
  reward: {
    xp: 295,
    gold: 76,
    equipment: {
      type: 'choice',
      options: ['silver-blade', 'great-axe', 'lucky-medal'],
    },
  },
};

/**
 * HOUSE 14
 * - Equipment: hyper-boots (Jupiter)
 * - Recruit: Tyrell (Mars, Pure DPS)
 */
export const HOUSE_14: Encounter = {
  id: 'house-14',
  name: 'House 14: The Speed Demon',
  enemies: ['thunder-captain', 'thunderbird', 'storm-golem'],
  difficulty: 'hard',
  reward: {
    xp: 320,
    gold: 82,
    djinn: 'bolt',
    equipment: {
      type: 'choice',
      options: ['hyper-boots', 'guardian-ring', 'lucky-medal'],
    },
    unlockUnit: 'tyrell', // Recruit Tyrell (Mars Pure DPS)
  },
};

// ============================================================================
// ACT 3: LIBERATION (Houses 15-20)
// ============================================================================

/**
 * HOUSE 15
 * - Reward: Squall Djinn (Jupiter T2) + Stormcaller recruit
 * - Equipment Choice
 * - MILESTONE: 8 MANA/ROUND! (Stormcaller contributes 3 mana)
 */
export const HOUSE_15: Encounter = {
  id: 'house-15',
  name: 'House 15: The Storm Unleashed',
  enemies: ['terra-soldier', 'blaze-soldier', 'wind-soldier', 'iron-golem'],
  difficulty: 'hard',
  reward: {
    xp: 400,
    gold: 110,
    djinn: 'squall', // Jupiter T2 Djinn
    unlockUnit: 'stormcaller', // Recruit Stormcaller (Jupiter AoE Mage)
    equipment: {
      type: 'choice',
      options: ['mythril-armor', 'war-gloves', 'elemental-star'],
    },
  },
};

/**
 * HOUSE 16
 * - Equipment: mythril-blade (Venus)
 */
export const HOUSE_16: Encounter = {
  id: 'house-16',
  name: 'House 16: The Mythril Edge',
  enemies: ['lightning-commander', 'storm-elemental', 'jupiter-bear', 'crystal-golem'],
  difficulty: 'boss',
  reward: {
    xp: 450,
    gold: 120,
    equipment: {
      type: 'choice',
      options: ['mythril-blade', 'hermes-sandals', 'hyper-boots'],
    },
  },
};

/**
 * HOUSE 17
 * - Equipment: dragon-scales (Venus armor)
 * - Recruit: Felix (Venus, Master Warrior)
 * - MILESTONE: Full roster! (10 units total)
 */
export const HOUSE_17: Encounter = {
  id: 'house-17',
  name: 'House 17: The Master\'s Arrival',
  enemies: ['mountain-commander', 'basilisk', 'rock-elemental'],
  difficulty: 'boss',
  reward: {
    xp: 500,
    gold: 130,
    equipment: {
      type: 'choice',
      options: ['dragon-scales', 'gaia-helm', 'storm-circlet'],
    },
    unlockUnit: 'felix', // Recruit Felix (Venus Master Warrior)
  },
};

/**
 * HOUSE 18
 * - Reward: Bane Djinn (Venus T3) plus defensive gear choice
 * - MILESTONE: First T3 Djinn!
 */
export const HOUSE_18: Encounter = {
  id: 'house-18',
  name: 'House 18: The Earth\'s Bane',
  enemies: ['fire-commander', 'volcano-warlord', 'elder-basilisk'],
  difficulty: 'boss',
  reward: {
    xp: 550,
    gold: 140,
    equipment: {
      type: 'choice',
      options: ['oracles-crown', 'dragon-scales', 'glacial-robes'],
    },
    djinn: 'bane', // Venus T3 Djinn
  },
};

/**
 * HOUSE 19
 * - Equipment Choice (legendary weapons)
 */
export const HOUSE_19: Encounter = {
  id: 'house-19',
  name: 'House 19: The Final Armament',
  enemies: ['storm-commander', 'granite-warlord', 'blizzard-warlord', 'hydra', 'leviathan'],
  difficulty: 'boss',
  reward: {
    xp: 600,
    gold: 150,
    equipment: {
      type: 'choice',
      options: ['gaia-blade', 'titans-axe', 'dragons-eye'],
    },
  },
};

/**
 * HOUSE 20 (FINALE)
 * - Reward: Storm Djinn (Jupiter T3)
 * - Equipment Choice (3 options)
 * - MILESTONE: Final battle, full power achieved!
 */
export const HOUSE_20_OVERSEER: Encounter = {
  id: 'house-20',
  name: 'House 20: The Overseer Falls',
  enemies: ['overseer', 'chimera', 'tempest-warlord', 'volcano-warlord', 'tempest-dragon'],
  difficulty: 'boss',
  rules: {
    phaseChange: {
      hpPct: 0.5, // At 50% HP, Overseer gets enraged
      addAbility: 'party-heal', // Overseer can heal at 50%
    },
  },
  reward: {
    xp: 1500,
    gold: 300,
    djinn: 'storm', // Jupiter T3 Djinn - FINAL DJINN!
    equipment: {
      type: 'choice',
      options: ['sol-blade', 'titans-axe', 'cosmos-shield'],
    },
  },
};

// ============================================================================
// CHAPTER 2: POST-VALE PROGRESSION (Houses 21-28)
// ============================================================================

/**
 * HOUSE 21 - Undead Incursion
 * - First Chapter 2 encounter
 * - Introduces Undead enemy category
 * - Moderate difficulty to ease into post-Vale content
 */
export const HOUSE_21: Encounter = {
  id: 'house-21',
  name: 'House 21: The Risen Dead',
  enemies: ['skeleton-warrior', 'ghost-wisp', 'zombie-hound', 'tidal-wraith'],
  difficulty: 'medium',
  reward: {
    xp: 650,
    gold: 160,
    equipment: {
      type: 'choice',
      options: ['silver-blade', 'steel-armor', 'crystal-rod'],
    },
  },
};

/**
 * HOUSE 22 - Aerial Assault
 * - Wind and Fire avian enemies
 * - High speed, lower defense theme
 */
export const HOUSE_22: Encounter = {
  id: 'house-22',
  name: 'House 22: Wings of Fury',
  enemies: ['wind-hawk', 'fire-eagle', 'storm-raven', 'tidal-wraith'],
  difficulty: 'medium',
  reward: {
    xp: 700,
    gold: 170,
    equipment: {
      type: 'fixed',
      itemId: 'hyper-boots',
    },
  },
};

/**
 * HOUSE 23 - Golem Fortress
 * - Heavy defense and HP
 * - Clay and Iron golems
 * - First Djinn reward in Chapter 2
 */
export const HOUSE_23: Encounter = {
  id: 'house-23',
  name: 'House 23: The Earthen Guardians',
  enemies: ['clay-golem', 'iron-golem', 'frost-lich'],
  difficulty: 'hard',
  reward: {
    xp: 750,
    gold: 185,
    djinn: 'corona', // Mars T2 Djinn (reserved for future)
    equipment: {
      type: 'choice',
      options: ['dragon-scales', 'storm-circlet', 'oracles-crown'],
    },
  },
};

/**
 * HOUSE 24 - Frostbound Depths
 * - Mercury beast specialization
 * - Ice and water themed enemies
 */
export const HOUSE_24: Encounter = {
  id: 'house-24',
  name: 'House 24: Frozen Depths',
  enemies: ['frost-serpent', 'aqua-drake', 'ice-owl', 'frost-lich', 'kraken'],
  difficulty: 'hard',
  reward: {
    xp: 800,
    gold: 195,
    djinn: 'chill',
    equipment: {
      type: 'choice',
      options: ['mythril-blade', 'zodiac-wand', 'glacial-robes'],
    },
  },
};

/**
 * HOUSE 25 - Tempest Heights
 * - Jupiter beast showcase
 * - Lightning and wind enemies
 */
export const HOUSE_25: Encounter = {
  id: 'house-25',
  name: 'House 25: Storm\'s Wrath',
  enemies: ['lightning-lynx', 'cyclone-djinni', 'thunderbird', 'storm-titan'],
  difficulty: 'hard',
  reward: {
    xp: 850,
    gold: 205,
    djinn: 'tonic', // Mercury T2 Djinn (reserved for future)
    equipment: {
      type: 'fixed',
      itemId: 'elemental-star',
    },
  },
};

/**
 * HOUSE 26 - Undead Necromancer
 * - Advanced undead encounter
 * - Bone Mage as mini-boss
 */
export const HOUSE_26: Encounter = {
  id: 'house-26',
  name: 'House 26: Necromantic Rites',
  enemies: ['bone-mage', 'skeleton-warrior', 'ghost-wisp', 'zombie-hound', 'void-specter'],
  difficulty: 'boss',
  reward: {
    xp: 900,
    gold: 220,
    equipment: {
      type: 'choice',
      options: ['oracles-crown', 'staff-of-ages', 'cosmos-shield'],
    },
  },
};

/**
 * HOUSE 27 - Crystalline Menace
 * - Mixed golem types
 * - High-tier constructs
 */
export const HOUSE_27: Encounter = {
  id: 'house-27',
  name: 'House 27: Crystal Convergence',
  enemies: ['crystal-golem', 'storm-golem', 'iron-golem'],
  difficulty: 'boss',
  reward: {
    xp: 950,
    gold: 235,
    equipment: {
      type: 'fixed',
      itemId: 'gaia-blade',
    },
  },
};

/**
 * HOUSE 28 - Elemental Dragons
 * - Mythical beast showcase
 * - Wyrm and Dragon enemies
 * - Chapter 2 finale encounter
 */
export const HOUSE_28: Encounter = {
  id: 'house-28',
  name: 'House 28: Draconic Convergence',
  enemies: ['glacier-wyrm', 'tempest-dragon', 'hydra', 'alpha-phoenix'],
  difficulty: 'boss',
  reward: {
    xp: 1000,
    gold: 250,
    djinn: 'fury', // Mars T3 Djinn (reserved for future)
    equipment: {
      type: 'choice',
      options: ['sol-blade', 'titans-axe', 'staff-of-ages'],
    },
  },
};

/**
 * HOUSE 29 - Void Armada
 * - Boss-tier mix of sea, storm, and arcane threats
 */
export const HOUSE_29: Encounter = {
  id: 'house-29',
  name: 'House 29: Void Armada',
  enemies: ['kraken', 'storm-titan', 'void-specter'],
  difficulty: 'boss',
  reward: {
    xp: 1100,
    gold: 260,
    equipment: {
      type: 'choice',
      options: ['cosmos-shield', 'aetheric-mantle', 'gaia-helm'],
    },
  },
};

/**
 * HOUSE 30 - Zeus's Judgment
 * - Final artifact drops before tower finale
 */
export const HOUSE_30: Encounter = {
  id: 'house-30',
  name: 'House 30: Zeus\'s Judgment',
  enemies: ['tempest-dragon', 'alpha-phoenix', 'storm-titan'],
  difficulty: 'boss',
  reward: {
    xp: 1250,
    gold: 300,
    equipment: {
      type: 'choice',
      options: ['astral-blade', 'shadowflame-staff', 'aetheric-mantle'],
    },
  },
};

// ============================================================================
// BONUS ENCOUNTER - Training Mode
// ============================================================================

export const TRAINING_DUMMY: Encounter = {
  id: 'training-dummy',
  name: 'Training Arena',
  enemies: ['mercury-slime'],
  difficulty: 'easy',
  reward: {
    xp: 10,
    gold: 0,
    equipment: { type: 'none' },
  },
};

// ============================================================================
// Export all encounters
// ============================================================================

export const ENCOUNTERS: Record<string, Encounter> = {
  // Act 1: Discovery (Houses 1-7)
  'house-01': HOUSE_01_VS1,
  'vs1-garet': VS1_GARET_ENCOUNTER,
  'house-02': HOUSE_02,
  'house-03': HOUSE_03,
  'house-04': HOUSE_04,
  'house-05': HOUSE_05,
  'house-06': HOUSE_06,
  'house-07': HOUSE_07,

  // Act 2: Resistance (Houses 8-14)
  'house-08': HOUSE_08,
  'house-09': HOUSE_09,
  'house-10': HOUSE_10,
  'house-11': HOUSE_11,
  'house-12': HOUSE_12,
  'house-13': HOUSE_13,
  'house-14': HOUSE_14,

  // Act 3: Liberation (Houses 15-20)
  'house-15': HOUSE_15,
  'house-16': HOUSE_16,
  'house-17': HOUSE_17,
  'house-18': HOUSE_18,
  'house-19': HOUSE_19,
  'house-20': HOUSE_20_OVERSEER,

  // Chapter 2: Post-Vale Progression (Houses 21-30)
  'house-21': HOUSE_21,
  'house-22': HOUSE_22,
  'house-23': HOUSE_23,
  'house-24': HOUSE_24,
  'house-25': HOUSE_25,
  'house-26': HOUSE_26,
  'house-27': HOUSE_27,
  'house-28': HOUSE_28,
  'house-29': HOUSE_29,
  'house-30': HOUSE_30,

  // Bonus
  'training-dummy': TRAINING_DUMMY,
};

// ============================================================================
// Djinn Distribution Summary (NEW)
// ============================================================================

/**
 * DJINN REWARDS BY HOUSE (9 Total):
 *
 * PRE-GAME: Flint (Venus T1) - Story gift
 *
 * ACT 1 (Houses 1-7):
 * - House 1:  Forge (Mars T1) - First earned Djinn!
 * - House 6:  Gust (Jupiter T1) - Early wind support
 * - House 7:  Breeze (Jupiter T1) - SUMMONS UNLOCKED! (3+ Djinn total)
 *
 * ACT 2 (Houses 8-14):
 * - House 8:  Fizz (Mercury T1) - Complete T1 set (all 4 elements)
 * - House 12: Granite (Venus T2) - POWER SPIKE (first T2 Djinn)
 *
 * ACT 3 (Houses 15-20):
 * - House 15: Squall (Jupiter T2) - MANA SPIKE (8 mana/round with Stormcaller)
 * - House 18: Bane (Venus T3) - First T3 Djinn
 * - House 20: Storm (Jupiter T3) - FINALE
 *
 * RESERVED FOR FUTURE (Houses 21-40):
 * - Corona (Mars T2)
 * - Tonic (Mercury T2)
 * - Fury (Mars T3)
 * - Crystal (Mercury T3)
 */

/**
 * RECRUITMENT SCHEDULE (10 Total Units):
 *
 * PRE-GAME:
 * - Isaac (Adept, Venus) - Starter
 *
 * HOUSE 1 (VS1):
 * - Garet (War Mage, Mars) - First battle recruit!
 *
 * STORY JOINS (auto-recruit after battle):
 * - House 2: Mystic (Mercury, Healer)
 * - House 3: Ranger (Jupiter, Rogue Assassin)
 *
 * BATTLE RECRUITS:
 * - House 5:  Blaze (Mars, Balanced Warrior)
 * - House 8:  Sentinel (Venus, Support Buffer)
 * - House 11: Karis (Mercury, Versatile Scholar)
 * - House 14: Tyrell (Mars, Pure DPS)
 * - House 15: Stormcaller (Jupiter, AoE Fire Mage) - MANA SPIKE!
 * - House 17: Felix (Venus, Master Warrior) - FULL ROSTER!
 */
