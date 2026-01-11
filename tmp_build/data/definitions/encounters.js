"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENCOUNTERS = exports.ABANDONED_FARM = exports.MERCHANT_GUARD = exports.ROADSIDE_BANDITS = exports.TRAINING_DUMMY = exports.HOUSE_36 = exports.HOUSE_35 = exports.HOUSE_34 = exports.HOUSE_33 = exports.HOUSE_32 = exports.HOUSE_31 = exports.HOUSE_30 = exports.HOUSE_29 = exports.HOUSE_28 = exports.HOUSE_27 = exports.HOUSE_26 = exports.HOUSE_25 = exports.HOUSE_24 = exports.HOUSE_23 = exports.HOUSE_22 = exports.HOUSE_21 = exports.HOUSE_20_OVERSEER = exports.HOUSE_19 = exports.HOUSE_18 = exports.HOUSE_17 = exports.HOUSE_16 = exports.HOUSE_15 = exports.HOUSE_14 = exports.HOUSE_13 = exports.HOUSE_12 = exports.HOUSE_11 = exports.HOUSE_10 = exports.HOUSE_09 = exports.HOUSE_08 = exports.HOUSE_07 = exports.HOUSE_06 = exports.HOUSE_05 = exports.HOUSE_04 = exports.HOUSE_03 = exports.HOUSE_02 = exports.VS1_GARET_ENCOUNTER = exports.HOUSE_01_VS1 = void 0;
const createVs1Encounter = (id, name) => ({
    id,
    name,
    enemies: ['garet-enemy'], // Enemy version of War Mage
    difficulty: 'easy',
    backgroundId: 'gs1/Vale', // Vale village background for first battle
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
exports.HOUSE_01_VS1 = createVs1Encounter('house-01', "House 1: Garet's Liberation");
exports.VS1_GARET_ENCOUNTER = createVs1Encounter('vs1-garet', "VS1: Garet's Liberation");
/**
 * HOUSE 2
 * - Equipment: bronze-sword (Venus)
 * - Story Event: Mystic joins after battle (auto-recruit, not from battle reward)
 */
exports.HOUSE_02 = {
    id: 'house-02',
    name: 'House 2: The Bronze Trial',
    enemies: ['earth-scout', 'venus-wolf'],
    difficulty: 'easy',
    backgroundId: 'gs1/Sol_Sanctum', // Temple interior
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
exports.HOUSE_03 = {
    id: 'house-03',
    name: 'House 3: Iron Bonds',
    enemies: ['flame-scout', 'mars-wolf'],
    difficulty: 'easy',
    backgroundId: 'gs1/Kolima_Forest', // Forest setting
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
exports.HOUSE_04 = {
    id: 'house-04',
    name: 'House 4: Arcane Power',
    enemies: ['frost-scout', 'frost-mystic'],
    difficulty: 'easy',
    backgroundId: 'gs1/Mercury_Lighthouse', // Mercury lighthouse for frost enemies
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
exports.HOUSE_05 = {
    id: 'house-05',
    name: 'House 5: The Blazing Warrior',
    enemies: ['gale-scout', 'gale-priest'],
    difficulty: 'easy',
    backgroundId: 'gs1/Vault_Inn', // Inn setting
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
exports.HOUSE_06 = {
    id: 'house-06',
    name: 'House 6: The Steel Guardian',
    enemies: ['stone-guardian', 'ember-cleric', 'flame-scout'],
    difficulty: 'medium',
    reward: {
        xp: 120,
        gold: 32,
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
exports.HOUSE_07 = {
    id: 'house-07',
    name: 'House 7: Winds of Liberation',
    enemies: ['terra-soldier', 'venus-bear', 'earth-shaman'],
    difficulty: 'medium',
    reward: {
        xp: 150,
        gold: 40,
        djinn: 'breeze', // Jupiter T1 Djinn - SUMMONS UNLOCK!
        equipment: {
            type: 'choice',
            options: ['steel-sword', 'battle-axe', 'crystal-rod'],
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
exports.HOUSE_08 = {
    id: 'house-08',
    name: 'House 8: The Frozen Sentinel',
    enemies: ['jupiter-bear', 'wind-soldier', 'tide-enchanter'],
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
exports.HOUSE_09 = {
    id: 'house-09',
    name: 'House 9: Inferno\'s Rage',
    enemies: ['mercury-bear', 'frost-oracle', 'ice-elemental'],
    difficulty: 'medium',
    reward: {
        xp: 215,
        gold: 58,
        equipment: {
            type: 'fixed',
            itemId: 'battle-axe',
        },
    },
};
/**
 * HOUSE 10
 * - No equipment/djinn rewards (progression house)
 * - Phase-change Flame Elemental (buffs then debuffs)
 */
exports.HOUSE_10 = {
    id: 'house-10',
    name: 'House 10: The Burning Gauntlet',
    enemies: ['blaze-soldier', 'mars-bear', 'flame-elemental'],
    difficulty: 'medium',
    reward: {
        xp: 235,
        gold: 62,
        equipment: { type: 'fixed', itemId: 'silver-circlet' },
    },
};
/**
 * HOUSE 11
 * - Equipment: silver-armor (Venus)
 * - Recruit: Karis (Mercury, Versatile Scholar)
 * - Trinity Wall: Terra Warden (triple buffer + tank + healer)
 */
exports.HOUSE_11 = {
    id: 'house-11',
    name: 'House 11: The Scholar\'s Trial',
    enemies: ['stone-captain', 'rock-elemental', 'terra-warden'],
    difficulty: 'hard',
    reward: {
        xp: 255,
        gold: 68,
        equipment: {
            type: 'fixed',
            itemId: 'silver-armor',
        },
        unlockUnit: 'karis', // Recruit Karis (Mercury Versatile Scholar)
    },
};
/**
 * HOUSE 12
 * - Reward: Granite Djinn (Venus T2) only - no equipment drop per locked table
 * - MILESTONE: First T2 Djinn! (Djinn swapping strategy unlocked)
 * - Boss Gauntlet: Flame Herald (buffer + debuffer) + Phoenix (3-phase boss)
 */
exports.HOUSE_12 = {
    id: 'house-12',
    name: 'House 12: The Granite Fortress',
    enemies: ['inferno-captain', 'phoenix', 'flame-herald'],
    difficulty: 'hard',
    reward: {
        xp: 275,
        gold: 72,
        equipment: { type: 'fixed', itemId: 'valkyrie-mail' },
        djinn: 'granite', // Venus T2 Djinn - POWER SPIKE
    },
};
/**
 * HOUSE 13
 * - Equipment Choice (mid-tier weapons)
 */
exports.HOUSE_13 = {
    id: 'house-13',
    name: 'House 13: The Silver Strike',
    enemies: ['glacier-captain', 'leviathan'],
    difficulty: 'hard',
    reward: {
        xp: 295,
        gold: 76,
        equipment: {
            type: 'choice',
            options: ['silver-blade', 'great-axe', 'zodiac-wand'],
        },
    },
};
/**
 * HOUSE 14
 * - Equipment: hyper-boots (Jupiter)
 * - Recruit: Tyrell (Mars, Pure DPS)
 */
exports.HOUSE_14 = {
    id: 'house-14',
    name: 'House 14: The Speed Demon',
    enemies: ['thunder-captain', 'thunderbird'],
    difficulty: 'hard',
    reward: {
        xp: 320,
        gold: 82,
        equipment: {
            type: 'fixed',
            itemId: 'hyper-boots',
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
exports.HOUSE_15 = {
    id: 'house-15',
    name: 'House 15: The Storm Unleashed',
    enemies: ['terra-soldier', 'blaze-soldier', 'wind-soldier'],
    difficulty: 'hard',
    reward: {
        xp: 400,
        gold: 110,
        djinn: 'squall', // Jupiter T2 Djinn
        unlockUnit: 'stormcaller', // Recruit Stormcaller (Jupiter AoE Mage)
        equipment: {
            type: 'choice',
            options: ['mythril-armor', 'zodiac-wand', 'elemental-star'],
        },
    },
};
/**
 * HOUSE 16
 * - Equipment: mythril-blade (Venus)
 */
exports.HOUSE_16 = {
    id: 'house-16',
    name: 'House 16: The Mythril Edge',
    enemies: ['lightning-commander', 'storm-elemental', 'jupiter-bear'],
    difficulty: 'boss',
    reward: {
        xp: 450,
        gold: 120,
        equipment: {
            type: 'fixed',
            itemId: 'mythril-blade',
        },
    },
};
/**
 * HOUSE 17
 * - Equipment: dragon-scales (Venus armor)
 * - Recruit: Felix (Venus, Master Warrior)
 * - MILESTONE: Full roster! (10 units total)
 */
exports.HOUSE_17 = {
    id: 'house-17',
    name: 'House 17: The Master\'s Arrival',
    enemies: ['mountain-commander', 'basilisk', 'rock-elemental'],
    difficulty: 'boss',
    reward: {
        xp: 500,
        gold: 130,
        equipment: {
            type: 'fixed',
            itemId: 'dragon-scales',
        },
        unlockUnit: 'felix', // Recruit Felix (Venus Master Warrior)
    },
};
/**
 * HOUSE 18
 * - Reward: Bane Djinn (Venus T3) only - no equipment drop (locked blueprint)
 * - MILESTONE: First T3 Djinn!
 */
exports.HOUSE_18 = {
    id: 'house-18',
    name: 'House 18: The Earth\'s Bane',
    enemies: ['fire-commander', 'volcano-warlord'],
    difficulty: 'boss',
    reward: {
        xp: 550,
        gold: 140,
        equipment: { type: 'fixed', itemId: 'oracles-crown' },
        djinn: 'bane', // Venus T3 Djinn
    },
};
/**
 * HOUSE 19
 * - Equipment Choice (legendary weapons)
 */
exports.HOUSE_19 = {
    id: 'house-19',
    name: 'House 19: The Final Armament',
    enemies: ['storm-commander', 'hydra'],
    difficulty: 'boss',
    reward: {
        xp: 600,
        gold: 150,
        equipment: {
            type: 'choice',
            options: ['gaia-blade', 'titans-axe', 'staff-of-ages'],
        },
    },
};
/**
 * HOUSE 20 (FINALE)
 * - Reward: Storm Djinn (Jupiter T3)
 * - Equipment Choice (4 options!)
 * - MILESTONE: Final battle, full power achieved!
 */
exports.HOUSE_20_OVERSEER = {
    id: 'house-20',
    name: 'House 20: The Overseer Falls',
    enemies: ['overseer', 'chimera', 'tempest-warlord'],
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
exports.HOUSE_21 = {
    id: 'house-21',
    name: 'House 21: The Risen Dead',
    enemies: ['skeleton-warrior', 'ghost-wisp', 'zombie-hound'],
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
exports.HOUSE_22 = {
    id: 'house-22',
    name: 'House 22: Wings of Fury',
    enemies: ['wind-hawk', 'fire-eagle', 'storm-raven'],
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
exports.HOUSE_23 = {
    id: 'house-23',
    name: 'House 23: The Earthen Guardians',
    enemies: ['clay-golem', 'iron-golem'],
    difficulty: 'hard',
    reward: {
        xp: 750,
        gold: 185,
        djinn: 'corona', // Mars T2 Djinn (reserved for future)
        equipment: {
            type: 'fixed',
            itemId: 'dragon-scales',
        },
    },
};
/**
 * HOUSE 24 - Frostbound Depths
 * - Mercury beast specialization
 * - Ice and water themed enemies
 */
exports.HOUSE_24 = {
    id: 'house-24',
    name: 'House 24: Frozen Depths',
    enemies: ['frost-serpent', 'aqua-drake', 'ice-owl'],
    difficulty: 'hard',
    reward: {
        xp: 800,
        gold: 195,
        equipment: {
            type: 'choice',
            options: ['mythril-blade', 'zodiac-wand', 'valkyrie-mail'],
        },
    },
};
/**
 * HOUSE 25 - Tempest Heights
 * - Jupiter beast showcase
 * - Lightning and wind enemies
 */
exports.HOUSE_25 = {
    id: 'house-25',
    name: 'House 25: Storm\'s Wrath',
    enemies: ['lightning-lynx', 'cyclone-djinni', 'thunderbird'],
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
exports.HOUSE_26 = {
    id: 'house-26',
    name: 'House 26: Necromantic Rites',
    enemies: ['bone-mage', 'skeleton-warrior', 'ghost-wisp', 'zombie-hound'],
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
exports.HOUSE_27 = {
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
exports.HOUSE_28 = {
    id: 'house-28',
    name: 'House 28: Draconic Convergence',
    enemies: ['glacier-wyrm', 'tempest-dragon', 'hydra'],
    difficulty: 'boss',
    reward: {
        xp: 1000,
        gold: 250,
        djinn: 'fury', // Mars T3 Djinn (reserved for future)
        equipment: {
            type: 'choice',
            options: ['sol-blade', 'titans-axe', 'cosmos-shield'],
        },
    },
};
// ============================================================================
// CHAPTER 3: THE ELEMENTAL TRIALS (Houses 29-36)
// ============================================================================
/**
 * HOUSE 29 - Abyssal Depths
 * - Deep sea and water elementals
 * - First Chapter 3 encounter
 * - Introduces high-tier Mercury enemies
 */
exports.HOUSE_29 = {
    id: 'house-29',
    name: 'House 29: Abyssal Depths',
    enemies: ['tidal-wraith', 'neptune-warden', 'frost-serpent'],
    difficulty: 'boss',
    reward: {
        xp: 1100,
        gold: 270,
        equipment: {
            type: 'choice',
            options: ['mythril-armor', 'zodiac-wand', 'hyper-boots'],
        },
    },
};
/**
 * HOUSE 30 - Volcanic Summit
 * - Mars elite enemies
 * - Extreme fire damage
 * - Magma Colossus as main threat
 */
exports.HOUSE_30 = {
    id: 'house-30',
    name: 'House 30: Volcanic Summit',
    enemies: ['magma-colossus', 'flame-elemental', 'fire-commander'],
    difficulty: 'boss',
    reward: {
        xp: 1200,
        gold: 290,
        djinn: 'scorch', // Mars T3 Djinn
        equipment: {
            type: 'fixed',
            itemId: 'titans-axe',
        },
    },
};
/**
 * HOUSE 31 - Frozen Citadel
 * - Arctic themed encounter
 * - Permafrost and polar enemies
 * - High defense, ice-based attacks
 */
exports.HOUSE_31 = {
    id: 'house-31',
    name: 'House 31: Frozen Citadel',
    enemies: ['permafrost-golem', 'polar-guardian', 'arctic-sovereign'],
    difficulty: 'boss',
    reward: {
        xp: 1300,
        gold: 310,
        equipment: {
            type: 'choice',
            options: ['valkyrie-mail', 'oracles-crown', 'elemental-star'],
        },
    },
};
/**
 * HOUSE 32 - Stratosphere Keep
 * - Jupiter elite encounter
 * - Flying and lightning enemies
 * - High speed, devastating AoE
 */
exports.HOUSE_32 = {
    id: 'house-32',
    name: 'House 32: Stratosphere Keep',
    enemies: ['stratosphere-lord', 'thunderstorm-colossus', 'storm-titan'],
    difficulty: 'boss',
    reward: {
        xp: 1400,
        gold: 330,
        djinn: 'crystal', // Mercury T3 Djinn
        equipment: {
            type: 'fixed',
            itemId: 'staff-of-ages',
        },
    },
};
/**
 * HOUSE 33 - Chimera's Lair
 * - Multi-element mythical beasts
 * - Chimera variants
 * - Tests elemental coverage
 */
exports.HOUSE_33 = {
    id: 'house-33',
    name: "House 33: Chimera's Lair",
    enemies: ['voltage-chimera', 'chimera', 'elder-basilisk'],
    difficulty: 'boss',
    reward: {
        xp: 1500,
        gold: 350,
        equipment: {
            type: 'choice',
            options: ['gaia-blade', 'sol-blade', 'cosmos-shield'],
        },
    },
};
/**
 * HOUSE 34 - Spectral Void
 * - Undead and spectral enemies
 * - Lich as main boss
 * - Resurrection mechanics
 */
exports.HOUSE_34 = {
    id: 'house-34',
    name: 'House 34: Spectral Void',
    enemies: ['frost-lich', 'void-specter', 'bone-mage', 'ghost-wisp'],
    difficulty: 'boss',
    reward: {
        xp: 1600,
        gold: 370,
        equipment: {
            type: 'fixed',
            itemId: 'oracles-crown',
        },
    },
};
/**
 * HOUSE 35 - Elemental Convergence
 * - All four elements represented
 * - Aurora Elemental as centerpiece
 * - Elemental synergy test
 */
exports.HOUSE_35 = {
    id: 'house-35',
    name: 'House 35: Elemental Convergence',
    enemies: ['aurora-elemental', 'storm-elemental', 'flame-elemental', 'rock-elemental'],
    difficulty: 'boss',
    reward: {
        xp: 1800,
        gold: 400,
        djinn: 'serac', // Venus T4 Djinn (endgame)
        equipment: {
            type: 'choice',
            options: ['sol-blade', 'titans-axe', 'cosmos-shield'],
        },
    },
};
/**
 * HOUSE 36 - Divine Judgment (Chapter 3 Finale)
 * - Celestial themed boss encounter
 * - Ultimate challenge before endgame
 * - Zeus Avatar as final boss
 */
exports.HOUSE_36 = {
    id: 'house-36',
    name: 'House 36: Divine Judgment',
    enemies: ['zeus-avatar', 'celestial-fury', 'vortex-sentinel'],
    difficulty: 'boss',
    rules: {
        phaseChange: {
            hpPct: 0.3, // At 30% HP, Zeus Avatar becomes enraged
            addAbility: 'party-heal', // Divine restoration at low HP
        },
    },
    reward: {
        xp: 2500,
        gold: 500,
        djinn: 'eclipse', // Jupiter T4 Djinn (endgame)
        equipment: {
            type: 'choice',
            options: ['sol-blade', 'titans-axe', 'cosmos-shield'],
        },
    },
};
// ============================================================================
// BONUS ENCOUNTER - Training Mode
// ============================================================================
exports.TRAINING_DUMMY = {
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
// New small encounters added to populate world variety
exports.ROADSIDE_BANDITS = {
    id: 'roadside-bandits',
    name: 'Roadside Bandits',
    enemies: ['bandit', 'scavenger'],
    difficulty: 'easy',
    reward: {
        xp: 25,
        gold: 12,
        equipment: { type: 'none' },
    },
};
exports.MERCHANT_GUARD = {
    id: 'merchant-guard',
    name: 'Merchant Guard',
    enemies: ['merchant-guard'],
    difficulty: 'easy',
    reward: {
        xp: 40,
        gold: 20,
        equipment: { type: 'fixed', itemId: 'sol-blade' },
    },
};
exports.ABANDONED_FARM = {
    id: 'abandoned-farm',
    name: 'Abandoned Farm',
    enemies: ['wild-boar', 'carrion-bird'],
    difficulty: 'easy',
    reward: {
        xp: 30,
        gold: 15,
        equipment: { type: 'none' },
    },
};
// ============================================================================
// Export all encounters
// ============================================================================
exports.ENCOUNTERS = {
    // Act 1: Discovery (Houses 1-7)
    'house-01': exports.HOUSE_01_VS1,
    'vs1-garet': exports.VS1_GARET_ENCOUNTER,
    'house-02': exports.HOUSE_02,
    'house-03': exports.HOUSE_03,
    'house-04': exports.HOUSE_04,
    'house-05': exports.HOUSE_05,
    'house-06': exports.HOUSE_06,
    'house-07': exports.HOUSE_07,
    // Act 2: Resistance (Houses 8-14)
    'house-08': exports.HOUSE_08,
    'house-09': exports.HOUSE_09,
    'house-10': exports.HOUSE_10,
    'house-11': exports.HOUSE_11,
    'house-12': exports.HOUSE_12,
    'house-13': exports.HOUSE_13,
    'house-14': exports.HOUSE_14,
    // Act 3: Liberation (Houses 15-20)
    'house-15': exports.HOUSE_15,
    'house-16': exports.HOUSE_16,
    'house-17': exports.HOUSE_17,
    'house-18': exports.HOUSE_18,
    'house-19': exports.HOUSE_19,
    'house-20': exports.HOUSE_20_OVERSEER,
    // Chapter 2: Post-Vale Progression (Houses 21-28)
    'house-21': exports.HOUSE_21,
    'house-22': exports.HOUSE_22,
    'house-23': exports.HOUSE_23,
    'house-24': exports.HOUSE_24,
    'house-25': exports.HOUSE_25,
    'house-26': exports.HOUSE_26,
    'house-27': exports.HOUSE_27,
    'house-28': exports.HOUSE_28,
    // Chapter 3: The Elemental Trials (Houses 29-36)
    'house-29': exports.HOUSE_29,
    'house-30': exports.HOUSE_30,
    'house-31': exports.HOUSE_31,
    'house-32': exports.HOUSE_32,
    'house-33': exports.HOUSE_33,
    'house-34': exports.HOUSE_34,
    'house-35': exports.HOUSE_35,
    'house-36': exports.HOUSE_36,
    // Bonus
    'training-dummy': exports.TRAINING_DUMMY,
    'roadside-bandits': exports.ROADSIDE_BANDITS,
    'merchant-guard': exports.MERCHANT_GUARD,
    'abandoned-farm': exports.ABANDONED_FARM,
    // ENDGAME: The Ascent (Houses 37-50)
    'house-37': { id: 'house-37', name: 'House 37: Granite Guard', enemies: ['granite-warlord', 'granite-warlord'], difficulty: 'hard', backgroundId: 'gs1/Vale', reward: { xp: 3000, gold: 600, equipment: { type: 'none' } } },
    'house-38': { id: 'house-38', name: 'House 38: Magma Twins', enemies: ['volcano-warlord', 'volcano-warlord'], difficulty: 'hard', backgroundId: 'gs1/Vale', reward: { xp: 3200, gold: 650, equipment: { type: 'none' } } },
    'house-39': { id: 'house-39', name: 'House 39: Frozen Duo', enemies: ['blizzard-warlord', 'blizzard-warlord'], difficulty: 'hard', backgroundId: 'gs1/Vale', reward: { xp: 3400, gold: 700, equipment: { type: 'none' } } },
    'house-40': { id: 'house-40', name: 'House 40: Storm Gate', enemies: ['tempest-warlord', 'tempest-dragon'], difficulty: 'boss', backgroundId: 'gs1/Vale', reward: { xp: 4000, gold: 1000, equipment: { type: 'none' } } },
    'house-41': { id: 'house-41', name: 'House 41: Sky Breach', enemies: ['stratosphere-lord'], difficulty: 'hard', backgroundId: 'gs1/Vale', reward: { xp: 4200, gold: 800, equipment: { type: 'none' } } },
    'house-42': { id: 'house-42', name: 'House 42: Cloud Walker', enemies: ['storm-titan'], difficulty: 'hard', backgroundId: 'gs1/Vale', reward: { xp: 4400, gold: 850, equipment: { type: 'none' } } },
    'house-43': { id: 'house-43', name: 'House 43: Thunder Peak', enemies: ['tempest-dragon', 'storm-titan'], difficulty: 'hard', backgroundId: 'gs1/Vale', reward: { xp: 4600, gold: 900, equipment: { type: 'none' } } },
    'house-44': { id: 'house-44', name: 'House 44: Gale Force', enemies: ['stratosphere-lord', 'jupiter-vortex-sentry'], difficulty: 'hard', backgroundId: 'gs1/Vale', reward: { xp: 4800, gold: 950, equipment: { type: 'none' } } },
    'house-45': { id: 'house-45', name: 'House 45: The Eye', enemies: ['zeus-avatar'], difficulty: 'boss', backgroundId: 'gs1/Vale', reward: { xp: 5000, gold: 2000, equipment: { type: 'fixed', itemId: 'mythril-crown' } } },
    'house-46': { id: 'house-46', name: 'House 46: Chaos 1', enemies: ['granite-warlord', 'tempest-warlord'], difficulty: 'hard', backgroundId: 'gs1/Vale', reward: { xp: 5500, gold: 1100, equipment: { type: 'none' } } },
    'house-47': { id: 'house-47', name: 'House 47: Chaos 2', enemies: ['volcano-warlord', 'blizzard-warlord'], difficulty: 'hard', backgroundId: 'gs1/Vale', reward: { xp: 6000, gold: 1200, equipment: { type: 'none' } } },
    'house-48': { id: 'house-48', name: 'House 48: Chaos 3', enemies: ['tempest-dragon', 'zeus-avatar'], difficulty: 'hard', backgroundId: 'gs1/Vale', reward: { xp: 7000, gold: 1500, equipment: { type: 'none' } } },
    'house-49': { id: 'house-49', name: 'House 49: The Gatekeeper', enemies: ['celestial-fury', 'vortex-sentinel'], difficulty: 'boss', backgroundId: 'gs1/Vale', reward: { xp: 8000, gold: 2000, equipment: { type: 'none' } } },
    'house-50': { id: 'house-50', name: 'House 50: Golden Sun', enemies: ['the-golden-sun'], difficulty: 'boss', backgroundId: 'gs1/Vale', reward: { xp: 99999, gold: 99999, equipment: { type: 'fixed', itemId: 'sol-blade' } } },
};
// ============================================================================
// Djinn Distribution Summary (NEW)
// ============================================================================
/**
 * DJINN REWARDS BY HOUSE (8 Total):
 *
 * PRE-GAME: Flint (Venus T1) - Story gift
 *
 * ACT 1 (Houses 1-7):
 * - House 1:  Forge (Mars T1) - First earned Djinn!
 * - House 7:  Breeze (Jupiter T1) - SUMMONS UNLOCKED! (3 Djinn total)
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
