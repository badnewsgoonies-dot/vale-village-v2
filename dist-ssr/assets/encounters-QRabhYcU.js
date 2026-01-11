const createVs1Encounter = (id, name) => ({
  id,
  name,
  enemies: ["garet-enemy"],
  // Enemy version of War Mage
  difficulty: "easy",
  backgroundId: "gs1/Vale",
  // Vale village background for first battle
  reward: {
    xp: 60,
    gold: 20,
    equipment: { type: "fixed", itemId: "leather-cap" },
    // Starter helm drop for House 1
    djinn: "forge",
    // Mars T1 Djinn
    unlockUnit: "war-mage"
    // Recruit Garet
  }
});
const HOUSE_01_VS1 = createVs1Encounter("house-01", "House 1: Garet's Liberation");
const VS1_GARET_ENCOUNTER = createVs1Encounter("vs1-garet", "VS1: Garet's Liberation");
const HOUSE_02 = {
  id: "house-02",
  name: "House 2: The Bronze Trial",
  enemies: ["earth-scout", "venus-wolf"],
  difficulty: "easy",
  backgroundId: "gs1/Sol_Sanctum",
  // Temple interior
  reward: {
    xp: 70,
    gold: 22,
    equipment: {
      type: "fixed",
      itemId: "bronze-sword"
    }
  }
};
const HOUSE_03 = {
  id: "house-03",
  name: "House 3: Iron Bonds",
  enemies: ["flame-scout", "mars-wolf"],
  difficulty: "easy",
  backgroundId: "gs1/Kolima_Forest",
  // Forest setting
  reward: {
    xp: 80,
    gold: 24,
    equipment: {
      type: "fixed",
      itemId: "iron-armor"
    }
  }
};
const HOUSE_04 = {
  id: "house-04",
  name: "House 4: Arcane Power",
  enemies: ["frost-scout", "frost-mystic"],
  difficulty: "easy",
  backgroundId: "gs1/Mercury_Lighthouse",
  // Mercury lighthouse for frost enemies
  reward: {
    xp: 90,
    gold: 26,
    equipment: {
      type: "fixed",
      itemId: "magic-rod"
    }
  }
};
const HOUSE_05 = {
  id: "house-05",
  name: "House 5: The Blazing Warrior",
  enemies: ["gale-scout", "gale-priest"],
  difficulty: "easy",
  backgroundId: "gs1/Vault_Inn",
  // Inn setting
  reward: {
    xp: 100,
    gold: 28,
    equipment: { type: "fixed", itemId: "iron-sword" },
    unlockUnit: "blaze"
    // Recruit Blaze (Mars Balanced Warrior)
  }
};
const HOUSE_06 = {
  id: "house-06",
  name: "House 6: The Steel Guardian",
  enemies: ["stone-guardian", "ember-cleric", "flame-scout"],
  difficulty: "medium",
  reward: {
    xp: 120,
    gold: 32,
    equipment: {
      type: "fixed",
      itemId: "steel-helm"
    }
  }
};
const HOUSE_07 = {
  id: "house-07",
  name: "House 7: Winds of Liberation",
  enemies: ["terra-soldier", "venus-bear", "earth-shaman"],
  difficulty: "medium",
  reward: {
    xp: 150,
    gold: 40,
    djinn: "breeze",
    // Jupiter T1 Djinn - SUMMONS UNLOCK!
    equipment: {
      type: "choice",
      options: ["steel-sword", "battle-axe", "crystal-rod"]
    }
  }
};
const HOUSE_08 = {
  id: "house-08",
  name: "House 8: The Frozen Sentinel",
  enemies: ["jupiter-bear", "wind-soldier", "tide-enchanter"],
  difficulty: "medium",
  reward: {
    xp: 200,
    gold: 55,
    equipment: { type: "fixed", itemId: "steel-armor" },
    djinn: "fizz",
    // Mercury T1 Djinn
    unlockUnit: "sentinel"
    // Recruit Sentinel (Venus Support Buffer)
  }
};
const HOUSE_09 = {
  id: "house-09",
  name: "House 9: Inferno's Rage",
  enemies: ["mercury-bear", "frost-oracle", "ice-elemental"],
  difficulty: "medium",
  reward: {
    xp: 215,
    gold: 58,
    equipment: {
      type: "fixed",
      itemId: "battle-axe"
    }
  }
};
const HOUSE_10 = {
  id: "house-10",
  name: "House 10: The Burning Gauntlet",
  enemies: ["blaze-soldier", "mars-bear", "flame-elemental"],
  difficulty: "medium",
  reward: {
    xp: 235,
    gold: 62,
    equipment: { type: "fixed", itemId: "silver-circlet" }
  }
};
const HOUSE_11 = {
  id: "house-11",
  name: "House 11: The Scholar's Trial",
  enemies: ["stone-captain", "rock-elemental", "terra-warden"],
  difficulty: "hard",
  reward: {
    xp: 255,
    gold: 68,
    equipment: {
      type: "fixed",
      itemId: "silver-armor"
    },
    unlockUnit: "karis"
    // Recruit Karis (Mercury Versatile Scholar)
  }
};
const HOUSE_12 = {
  id: "house-12",
  name: "House 12: The Granite Fortress",
  enemies: ["inferno-captain", "phoenix", "flame-herald"],
  difficulty: "hard",
  reward: {
    xp: 275,
    gold: 72,
    equipment: { type: "fixed", itemId: "valkyrie-mail" },
    djinn: "granite"
    // Venus T2 Djinn - POWER SPIKE
  }
};
const HOUSE_13 = {
  id: "house-13",
  name: "House 13: The Silver Strike",
  enemies: ["glacier-captain", "leviathan"],
  difficulty: "hard",
  reward: {
    xp: 295,
    gold: 76,
    equipment: {
      type: "choice",
      options: ["silver-blade", "great-axe", "zodiac-wand"]
    }
  }
};
const HOUSE_14 = {
  id: "house-14",
  name: "House 14: The Speed Demon",
  enemies: ["thunder-captain", "thunderbird"],
  difficulty: "hard",
  reward: {
    xp: 320,
    gold: 82,
    equipment: {
      type: "fixed",
      itemId: "hyper-boots"
    },
    unlockUnit: "tyrell"
    // Recruit Tyrell (Mars Pure DPS)
  }
};
const HOUSE_15 = {
  id: "house-15",
  name: "House 15: The Storm Unleashed",
  enemies: ["terra-soldier", "blaze-soldier", "wind-soldier"],
  difficulty: "hard",
  reward: {
    xp: 400,
    gold: 110,
    djinn: "squall",
    // Jupiter T2 Djinn
    unlockUnit: "stormcaller",
    // Recruit Stormcaller (Jupiter AoE Mage)
    equipment: {
      type: "choice",
      options: ["mythril-armor", "zodiac-wand", "elemental-star"]
    }
  }
};
const HOUSE_16 = {
  id: "house-16",
  name: "House 16: The Mythril Edge",
  enemies: ["lightning-commander", "storm-elemental", "jupiter-bear"],
  difficulty: "boss",
  reward: {
    xp: 450,
    gold: 120,
    equipment: {
      type: "fixed",
      itemId: "mythril-blade"
    }
  }
};
const HOUSE_17 = {
  id: "house-17",
  name: "House 17: The Master's Arrival",
  enemies: ["mountain-commander", "basilisk", "rock-elemental"],
  difficulty: "boss",
  reward: {
    xp: 500,
    gold: 130,
    equipment: {
      type: "fixed",
      itemId: "dragon-scales"
    },
    unlockUnit: "felix"
    // Recruit Felix (Venus Master Warrior)
  }
};
const HOUSE_18 = {
  id: "house-18",
  name: "House 18: The Earth's Bane",
  enemies: ["fire-commander", "volcano-warlord"],
  difficulty: "boss",
  reward: {
    xp: 550,
    gold: 140,
    equipment: { type: "fixed", itemId: "oracles-crown" },
    djinn: "bane"
    // Venus T3 Djinn
  }
};
const HOUSE_19 = {
  id: "house-19",
  name: "House 19: The Final Armament",
  enemies: ["storm-commander", "hydra"],
  difficulty: "boss",
  reward: {
    xp: 600,
    gold: 150,
    equipment: {
      type: "choice",
      options: ["gaia-blade", "titans-axe", "staff-of-ages"]
    }
  }
};
const HOUSE_20_OVERSEER = {
  id: "house-20",
  name: "House 20: The Overseer Falls",
  enemies: ["overseer", "chimera", "tempest-warlord"],
  difficulty: "boss",
  rules: {
    phaseChange: {
      hpPct: 0.5,
      // At 50% HP, Overseer gets enraged
      addAbility: "party-heal"
      // Overseer can heal at 50%
    }
  },
  reward: {
    xp: 1500,
    gold: 300,
    djinn: "storm",
    // Jupiter T3 Djinn - FINAL DJINN!
    equipment: {
      type: "choice",
      options: ["sol-blade", "titans-axe", "cosmos-shield"]
    }
  }
};
const HOUSE_21 = {
  id: "house-21",
  name: "House 21: The Risen Dead",
  enemies: ["skeleton-warrior", "ghost-wisp", "zombie-hound"],
  difficulty: "medium",
  reward: {
    xp: 650,
    gold: 160,
    equipment: {
      type: "choice",
      options: ["silver-blade", "steel-armor", "crystal-rod"]
    }
  }
};
const HOUSE_22 = {
  id: "house-22",
  name: "House 22: Wings of Fury",
  enemies: ["wind-hawk", "fire-eagle", "storm-raven"],
  difficulty: "medium",
  reward: {
    xp: 700,
    gold: 170,
    equipment: {
      type: "fixed",
      itemId: "hyper-boots"
    }
  }
};
const HOUSE_23 = {
  id: "house-23",
  name: "House 23: The Earthen Guardians",
  enemies: ["clay-golem", "iron-golem"],
  difficulty: "hard",
  reward: {
    xp: 750,
    gold: 185,
    djinn: "corona",
    // Mars T2 Djinn (reserved for future)
    equipment: {
      type: "fixed",
      itemId: "dragon-scales"
    }
  }
};
const HOUSE_24 = {
  id: "house-24",
  name: "House 24: Frozen Depths",
  enemies: ["frost-serpent", "aqua-drake", "ice-owl"],
  difficulty: "hard",
  reward: {
    xp: 800,
    gold: 195,
    equipment: {
      type: "choice",
      options: ["mythril-blade", "zodiac-wand", "valkyrie-mail"]
    }
  }
};
const HOUSE_25 = {
  id: "house-25",
  name: "House 25: Storm's Wrath",
  enemies: ["lightning-lynx", "cyclone-djinni", "thunderbird"],
  difficulty: "hard",
  reward: {
    xp: 850,
    gold: 205,
    djinn: "tonic",
    // Mercury T2 Djinn (reserved for future)
    equipment: {
      type: "fixed",
      itemId: "elemental-star"
    }
  }
};
const HOUSE_26 = {
  id: "house-26",
  name: "House 26: Necromantic Rites",
  enemies: ["bone-mage", "skeleton-warrior", "ghost-wisp", "zombie-hound"],
  difficulty: "boss",
  reward: {
    xp: 900,
    gold: 220,
    equipment: {
      type: "choice",
      options: ["oracles-crown", "staff-of-ages", "cosmos-shield"]
    }
  }
};
const HOUSE_27 = {
  id: "house-27",
  name: "House 27: Crystal Convergence",
  enemies: ["crystal-golem", "storm-golem", "iron-golem"],
  difficulty: "boss",
  reward: {
    xp: 950,
    gold: 235,
    equipment: {
      type: "fixed",
      itemId: "gaia-blade"
    }
  }
};
const HOUSE_28 = {
  id: "house-28",
  name: "House 28: Draconic Convergence",
  enemies: ["glacier-wyrm", "tempest-dragon", "hydra"],
  difficulty: "boss",
  reward: {
    xp: 1e3,
    gold: 250,
    djinn: "fury",
    // Mars T3 Djinn (reserved for future)
    equipment: {
      type: "choice",
      options: ["sol-blade", "titans-axe", "cosmos-shield"]
    }
  }
};
const HOUSE_29 = {
  id: "house-29",
  name: "House 29: Abyssal Depths",
  enemies: ["tidal-wraith", "neptune-warden", "frost-serpent"],
  difficulty: "boss",
  reward: {
    xp: 1100,
    gold: 270,
    equipment: {
      type: "choice",
      options: ["mythril-armor", "zodiac-wand", "hyper-boots"]
    }
  }
};
const HOUSE_30 = {
  id: "house-30",
  name: "House 30: Volcanic Summit",
  enemies: ["magma-colossus", "flame-elemental", "fire-commander"],
  difficulty: "boss",
  reward: {
    xp: 1200,
    gold: 290,
    djinn: "scorch",
    // Mars T3 Djinn
    equipment: {
      type: "fixed",
      itemId: "titans-axe"
    }
  }
};
const HOUSE_31 = {
  id: "house-31",
  name: "House 31: Frozen Citadel",
  enemies: ["permafrost-golem", "polar-guardian", "arctic-sovereign"],
  difficulty: "boss",
  reward: {
    xp: 1300,
    gold: 310,
    equipment: {
      type: "choice",
      options: ["valkyrie-mail", "oracles-crown", "elemental-star"]
    }
  }
};
const HOUSE_32 = {
  id: "house-32",
  name: "House 32: Stratosphere Keep",
  enemies: ["stratosphere-lord", "thunderstorm-colossus", "storm-titan"],
  difficulty: "boss",
  reward: {
    xp: 1400,
    gold: 330,
    djinn: "crystal",
    // Mercury T3 Djinn
    equipment: {
      type: "fixed",
      itemId: "staff-of-ages"
    }
  }
};
const HOUSE_33 = {
  id: "house-33",
  name: "House 33: Chimera's Lair",
  enemies: ["voltage-chimera", "chimera", "elder-basilisk"],
  difficulty: "boss",
  reward: {
    xp: 1500,
    gold: 350,
    equipment: {
      type: "choice",
      options: ["gaia-blade", "sol-blade", "cosmos-shield"]
    }
  }
};
const HOUSE_34 = {
  id: "house-34",
  name: "House 34: Spectral Void",
  enemies: ["frost-lich", "void-specter", "bone-mage", "ghost-wisp"],
  difficulty: "boss",
  reward: {
    xp: 1600,
    gold: 370,
    equipment: {
      type: "fixed",
      itemId: "oracles-crown"
    }
  }
};
const HOUSE_35 = {
  id: "house-35",
  name: "House 35: Elemental Convergence",
  enemies: ["aurora-elemental", "storm-elemental", "flame-elemental", "rock-elemental"],
  difficulty: "boss",
  reward: {
    xp: 1800,
    gold: 400,
    djinn: "serac",
    // Venus T4 Djinn (endgame)
    equipment: {
      type: "choice",
      options: ["sol-blade", "titans-axe", "cosmos-shield"]
    }
  }
};
const HOUSE_36 = {
  id: "house-36",
  name: "House 36: Divine Judgment",
  enemies: ["zeus-avatar", "celestial-fury", "vortex-sentinel"],
  difficulty: "boss",
  rules: {
    phaseChange: {
      hpPct: 0.3,
      // At 30% HP, Zeus Avatar becomes enraged
      addAbility: "party-heal"
      // Divine restoration at low HP
    }
  },
  reward: {
    xp: 2500,
    gold: 500,
    djinn: "eclipse",
    // Jupiter T4 Djinn (endgame)
    equipment: {
      type: "choice",
      options: ["sol-blade", "titans-axe", "cosmos-shield"]
    }
  }
};
const TRAINING_DUMMY = {
  id: "training-dummy",
  name: "Training Arena",
  enemies: ["mercury-slime"],
  difficulty: "easy",
  reward: {
    xp: 10,
    gold: 0,
    equipment: { type: "none" }
  }
};
const ROADSIDE_BANDITS = {
  id: "roadside-bandits",
  name: "Roadside Bandits",
  enemies: ["bandit", "scavenger"],
  difficulty: "easy",
  reward: {
    xp: 25,
    gold: 12,
    equipment: { type: "none" }
  }
};
const MERCHANT_GUARD = {
  id: "merchant-guard",
  name: "Merchant Guard",
  enemies: ["merchant-guard"],
  difficulty: "easy",
  reward: {
    xp: 40,
    gold: 20,
    equipment: { type: "fixed", itemId: "sol-blade" }
  }
};
const ABANDONED_FARM = {
  id: "abandoned-farm",
  name: "Abandoned Farm",
  enemies: ["wild-boar", "carrion-bird"],
  difficulty: "easy",
  reward: {
    xp: 30,
    gold: 15,
    equipment: { type: "none" }
  }
};
const ENCOUNTERS = {
  // Act 1: Discovery (Houses 1-7)
  "house-01": HOUSE_01_VS1,
  "vs1-garet": VS1_GARET_ENCOUNTER,
  "house-02": HOUSE_02,
  "house-03": HOUSE_03,
  "house-04": HOUSE_04,
  "house-05": HOUSE_05,
  "house-06": HOUSE_06,
  "house-07": HOUSE_07,
  // Act 2: Resistance (Houses 8-14)
  "house-08": HOUSE_08,
  "house-09": HOUSE_09,
  "house-10": HOUSE_10,
  "house-11": HOUSE_11,
  "house-12": HOUSE_12,
  "house-13": HOUSE_13,
  "house-14": HOUSE_14,
  // Act 3: Liberation (Houses 15-20)
  "house-15": HOUSE_15,
  "house-16": HOUSE_16,
  "house-17": HOUSE_17,
  "house-18": HOUSE_18,
  "house-19": HOUSE_19,
  "house-20": HOUSE_20_OVERSEER,
  // Chapter 2: Post-Vale Progression (Houses 21-28)
  "house-21": HOUSE_21,
  "house-22": HOUSE_22,
  "house-23": HOUSE_23,
  "house-24": HOUSE_24,
  "house-25": HOUSE_25,
  "house-26": HOUSE_26,
  "house-27": HOUSE_27,
  "house-28": HOUSE_28,
  // Chapter 3: The Elemental Trials (Houses 29-36)
  "house-29": HOUSE_29,
  "house-30": HOUSE_30,
  "house-31": HOUSE_31,
  "house-32": HOUSE_32,
  "house-33": HOUSE_33,
  "house-34": HOUSE_34,
  "house-35": HOUSE_35,
  "house-36": HOUSE_36,
  // Bonus
  "training-dummy": TRAINING_DUMMY,
  "roadside-bandits": ROADSIDE_BANDITS,
  "merchant-guard": MERCHANT_GUARD,
  "abandoned-farm": ABANDONED_FARM,
  // ENDGAME: The Ascent (Houses 37-50)
  "house-37": { id: "house-37", name: "House 37: Granite Guard", enemies: ["granite-warlord", "granite-warlord"], difficulty: "hard", backgroundId: "gs1/Vale", reward: { xp: 3e3, gold: 600, equipment: { type: "none" } } },
  "house-38": { id: "house-38", name: "House 38: Magma Twins", enemies: ["volcano-warlord", "volcano-warlord"], difficulty: "hard", backgroundId: "gs1/Vale", reward: { xp: 3200, gold: 650, equipment: { type: "none" } } },
  "house-39": { id: "house-39", name: "House 39: Frozen Duo", enemies: ["blizzard-warlord", "blizzard-warlord"], difficulty: "hard", backgroundId: "gs1/Vale", reward: { xp: 3400, gold: 700, equipment: { type: "none" } } },
  "house-40": { id: "house-40", name: "House 40: Storm Gate", enemies: ["tempest-warlord", "tempest-dragon"], difficulty: "boss", backgroundId: "gs1/Vale", reward: { xp: 4e3, gold: 1e3, equipment: { type: "none" } } },
  "house-41": { id: "house-41", name: "House 41: Sky Breach", enemies: ["stratosphere-lord"], difficulty: "hard", backgroundId: "gs1/Vale", reward: { xp: 4200, gold: 800, equipment: { type: "none" } } },
  "house-42": { id: "house-42", name: "House 42: Cloud Walker", enemies: ["storm-titan"], difficulty: "hard", backgroundId: "gs1/Vale", reward: { xp: 4400, gold: 850, equipment: { type: "none" } } },
  "house-43": { id: "house-43", name: "House 43: Thunder Peak", enemies: ["tempest-dragon", "storm-titan"], difficulty: "hard", backgroundId: "gs1/Vale", reward: { xp: 4600, gold: 900, equipment: { type: "none" } } },
  "house-44": { id: "house-44", name: "House 44: Gale Force", enemies: ["stratosphere-lord", "jupiter-vortex-sentry"], difficulty: "hard", backgroundId: "gs1/Vale", reward: { xp: 4800, gold: 950, equipment: { type: "none" } } },
  "house-45": { id: "house-45", name: "House 45: The Eye", enemies: ["zeus-avatar"], difficulty: "boss", backgroundId: "gs1/Vale", reward: { xp: 5e3, gold: 2e3, equipment: { type: "fixed", itemId: "mythril-crown" } } },
  "house-46": { id: "house-46", name: "House 46: Chaos 1", enemies: ["granite-warlord", "tempest-warlord"], difficulty: "hard", backgroundId: "gs1/Vale", reward: { xp: 5500, gold: 1100, equipment: { type: "none" } } },
  "house-47": { id: "house-47", name: "House 47: Chaos 2", enemies: ["volcano-warlord", "blizzard-warlord"], difficulty: "hard", backgroundId: "gs1/Vale", reward: { xp: 6e3, gold: 1200, equipment: { type: "none" } } },
  "house-48": { id: "house-48", name: "House 48: Chaos 3", enemies: ["tempest-dragon", "zeus-avatar"], difficulty: "hard", backgroundId: "gs1/Vale", reward: { xp: 7e3, gold: 1500, equipment: { type: "none" } } },
  "house-49": { id: "house-49", name: "House 49: The Gatekeeper", enemies: ["celestial-fury", "vortex-sentinel"], difficulty: "boss", backgroundId: "gs1/Vale", reward: { xp: 8e3, gold: 2e3, equipment: { type: "none" } } },
  "house-50": { id: "house-50", name: "House 50: Golden Sun", enemies: ["the-golden-sun"], difficulty: "boss", backgroundId: "gs1/Vale", reward: { xp: 99999, gold: 99999, equipment: { type: "fixed", itemId: "sol-blade" } } }
};
export {
  ABANDONED_FARM,
  ENCOUNTERS,
  HOUSE_01_VS1,
  HOUSE_02,
  HOUSE_03,
  HOUSE_04,
  HOUSE_05,
  HOUSE_06,
  HOUSE_07,
  HOUSE_08,
  HOUSE_09,
  HOUSE_10,
  HOUSE_11,
  HOUSE_12,
  HOUSE_13,
  HOUSE_14,
  HOUSE_15,
  HOUSE_16,
  HOUSE_17,
  HOUSE_18,
  HOUSE_19,
  HOUSE_20_OVERSEER,
  HOUSE_21,
  HOUSE_22,
  HOUSE_23,
  HOUSE_24,
  HOUSE_25,
  HOUSE_26,
  HOUSE_27,
  HOUSE_28,
  HOUSE_29,
  HOUSE_30,
  HOUSE_31,
  HOUSE_32,
  HOUSE_33,
  HOUSE_34,
  HOUSE_35,
  HOUSE_36,
  MERCHANT_GUARD,
  ROADSIDE_BANDITS,
  TRAINING_DUMMY,
  VS1_GARET_ENCOUNTER
};
//# sourceMappingURL=encounters-QRabhYcU.js.map
