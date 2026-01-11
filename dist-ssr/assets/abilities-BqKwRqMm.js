const STRIKE = {
  id: "strike",
  name: "Strike",
  type: "physical",
  manaCost: 0,
  basePower: 0,
  // Uses unit's ATK
  targets: "single-enemy",
  unlockLevel: 1,
  description: "Basic physical attack",
  aiHints: {
    priority: 1,
    target: "weakest",
    avoidOverkill: false
  }
};
const HEAVY_STRIKE = {
  id: "heavy-strike",
  name: "Heavy Strike",
  type: "physical",
  manaCost: 0,
  basePower: 15,
  targets: "single-enemy",
  unlockLevel: 2,
  description: "Powerful physical strike",
  aiHints: {
    priority: 2,
    target: "weakest",
    avoidOverkill: true
  }
};
const GUARD_BREAK = {
  id: "guard-break",
  name: "Guard Break",
  type: "physical",
  manaCost: 0,
  basePower: 18,
  targets: "single-enemy",
  unlockLevel: 2,
  description: "Strikes through defenses, reducing enemy DEF",
  buffEffect: {
    def: -6
  },
  duration: 2,
  aiHints: {
    priority: 2.5,
    target: "highestDef",
    avoidOverkill: false
  }
};
const PRECISE_JAB = {
  id: "precise-jab",
  name: "Precise Jab",
  type: "physical",
  manaCost: 0,
  basePower: 12,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "High accuracy physical attack",
  aiHints: {
    priority: 1.5,
    target: "weakest",
    avoidOverkill: true
  }
};
const FIREBALL = {
  id: "fireball",
  name: "Fireball",
  type: "psynergy",
  element: "Mars",
  manaCost: 2,
  basePower: 35,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "Fire elemental attack",
  aiHints: {
    priority: 2,
    target: "lowestRes",
    avoidOverkill: false
  }
};
const ICE_SHARD = {
  id: "ice-shard",
  name: "Ice Shard",
  type: "psynergy",
  element: "Mercury",
  manaCost: 2,
  basePower: 32,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "Ice elemental attack",
  aiHints: {
    priority: 2,
    target: "lowestRes",
    avoidOverkill: false
  }
};
const QUAKE = {
  id: "quake",
  name: "Quake",
  type: "psynergy",
  element: "Venus",
  manaCost: 3,
  basePower: 30,
  targets: "all-enemies",
  unlockLevel: 2,
  description: "Earth elemental attack hitting all enemies",
  aiHints: {
    priority: 2.5,
    target: "random",
    avoidOverkill: false
  }
};
const GUST = {
  id: "gust",
  name: "Gust",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 2,
  basePower: 30,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "Wind elemental attack",
  aiHints: {
    priority: 1.5,
    target: "weakest",
    avoidOverkill: false
  }
};
const CHAIN_LIGHTNING = {
  id: "chain-lightning",
  name: "Chain Lightning",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 4,
  basePower: 25,
  targets: "all-enemies",
  unlockLevel: 3,
  description: "Lightning that chains between all enemies",
  chainDamage: true,
  aiHints: {
    priority: 3,
    target: "random",
    avoidOverkill: false
  }
};
const HEAL = {
  id: "heal",
  name: "Heal",
  type: "healing",
  manaCost: 2,
  basePower: 40,
  targets: "single-ally",
  unlockLevel: 1,
  description: "Restores HP to a single ally",
  aiHints: {
    priority: 2.5,
    target: "healerFirst",
    avoidOverkill: false
  }
};
const PARTY_HEAL = {
  id: "party-heal",
  name: "Party Heal",
  type: "healing",
  manaCost: 4,
  basePower: 25,
  targets: "all-allies",
  unlockLevel: 2,
  description: "Restores HP to all allies",
  aiHints: {
    priority: 3,
    target: "random",
    avoidOverkill: false
  }
};
const BOOST_ATK = {
  id: "boost-atk",
  name: "Boost Attack",
  type: "buff",
  manaCost: 2,
  basePower: 0,
  targets: "single-ally",
  unlockLevel: 1,
  description: "Increases ally ATK",
  buffEffect: {
    atk: 8
  },
  duration: 3,
  aiHints: {
    priority: 1.5,
    target: "random",
    opener: true
  }
};
const BOOST_DEF = {
  id: "boost-def",
  name: "Boost Defense",
  type: "buff",
  manaCost: 2,
  basePower: 0,
  targets: "single-ally",
  unlockLevel: 1,
  description: "Increases ally DEF",
  buffEffect: {
    def: 8
  },
  duration: 3,
  aiHints: {
    priority: 1.5,
    target: "random",
    opener: true
  }
};
const WEAKEN_DEF = {
  id: "weaken-def",
  name: "Weaken Defense",
  type: "debuff",
  manaCost: 2,
  basePower: 0,
  targets: "single-enemy",
  unlockLevel: 2,
  description: "Reduces enemy DEF",
  buffEffect: {
    def: -6
  },
  duration: 2,
  aiHints: {
    priority: 2,
    target: "lowestRes",
    avoidOverkill: false
  }
};
const BLIND = {
  id: "blind",
  name: "Blind",
  type: "debuff",
  manaCost: 2,
  basePower: 0,
  targets: "single-enemy",
  unlockLevel: 2,
  description: "Reduces enemy speed",
  buffEffect: {
    spd: -3
  },
  duration: 2,
  aiHints: {
    priority: 2,
    target: "random",
    avoidOverkill: false
  }
};
const POISON_STRIKE = {
  id: "poison-strike",
  name: "Poison Strike",
  type: "physical",
  manaCost: 1,
  basePower: 10,
  targets: "single-enemy",
  unlockLevel: 2,
  description: "Physical attack that poisons the target",
  statusEffect: {
    type: "poison",
    duration: 3
  },
  aiHints: {
    priority: 2,
    target: "weakest",
    avoidOverkill: false
  }
};
const BURN_TOUCH = {
  id: "burn-touch",
  name: "Burn Touch",
  type: "psynergy",
  element: "Mars",
  manaCost: 2,
  basePower: 25,
  targets: "single-enemy",
  unlockLevel: 2,
  description: "Fire psynergy that burns the target",
  statusEffect: {
    type: "burn",
    duration: 3
  },
  aiHints: {
    priority: 2,
    target: "weakest",
    avoidOverkill: false
  }
};
const FREEZE_BLAST = {
  id: "freeze-blast",
  name: "Freeze Blast",
  type: "psynergy",
  element: "Mercury",
  manaCost: 2,
  basePower: 20,
  targets: "single-enemy",
  unlockLevel: 3,
  description: "Ice psynergy that freezes the target",
  statusEffect: {
    type: "freeze",
    duration: 2
  },
  aiHints: {
    priority: 2.5,
    target: "weakest",
    avoidOverkill: false
  }
};
const PARALYZE_SHOCK = {
  id: "paralyze-shock",
  name: "Paralyze Shock",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 2,
  basePower: 15,
  targets: "single-enemy",
  unlockLevel: 3,
  description: "Lightning psynergy that paralyzes the target",
  statusEffect: {
    type: "paralyze",
    duration: 2
  },
  aiHints: {
    priority: 2,
    target: "healerFirst",
    avoidOverkill: false
  }
};
const FLARE = {
  id: "flare",
  name: "Flare",
  type: "psynergy",
  element: "Mars",
  manaCost: 5,
  basePower: 30,
  targets: "all-enemies",
  unlockLevel: 3,
  description: "Fire elemental attack hitting all enemies",
  aiHints: {
    priority: 2.5,
    target: "random",
    avoidOverkill: false
  }
};
const CURE = {
  id: "cure",
  name: "Cure",
  type: "healing",
  element: "Mercury",
  manaCost: 4,
  basePower: 40,
  targets: "single-ally",
  unlockLevel: 2,
  description: "Restores HP to a single ally",
  aiHints: {
    priority: 2.5,
    target: "healerFirst",
    avoidOverkill: false
  }
};
const GUARD = {
  id: "guard",
  name: "Guard",
  type: "buff",
  manaCost: 3,
  basePower: 0,
  targets: "single-ally",
  unlockLevel: 2,
  description: "Increases ally DEF temporarily",
  buffEffect: {
    def: 8
  },
  duration: 3,
  aiHints: {
    priority: 1.5,
    target: "random",
    opener: true
  }
};
const EARTH_SPIKE = {
  id: "earth-spike",
  name: "Earth Spike",
  type: "psynergy",
  element: "Venus",
  manaCost: 0,
  basePower: 46,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "Powerful earth spike - Djinn Unleash ability",
  aiHints: {
    priority: 3,
    target: "weakest",
    avoidOverkill: false
  }
};
const FIRE_BURST = {
  id: "fire-burst",
  name: "Fire Burst",
  type: "psynergy",
  element: "Mars",
  manaCost: 0,
  basePower: 46,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "Explosive fire burst - Djinn Unleash ability",
  aiHints: {
    priority: 3,
    target: "weakest",
    avoidOverkill: false
  }
};
const WOODEN_STRIKE = {
  id: "wooden-strike",
  name: "Wooden Strike",
  type: "physical",
  manaCost: 0,
  basePower: 8,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A basic strike with a wooden blade. Simple but reliable.",
  aiHints: { priority: 1, target: "weakest", avoidOverkill: false }
};
const BRONZE_SLASH = {
  id: "bronze-slash",
  name: "Bronze Slash",
  type: "physical",
  element: "Venus",
  manaCost: 0,
  basePower: 12,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A sharp slash with a bronze blade. Earth-imbued strike.",
  aiHints: { priority: 1.2, target: "weakest", avoidOverkill: false }
};
const IRON_BULWARK = {
  id: "iron-bulwark",
  name: "Iron Bulwark",
  type: "buff",
  manaCost: 1,
  basePower: 0,
  targets: "self",
  unlockLevel: 1,
  description: "Fortify yourself with iron defense. Increases DEF.",
  buffEffect: { def: 6 },
  duration: 3,
  aiHints: { priority: 1.5, target: "random", opener: true }
};
const ARCANE_BOLT = {
  id: "arcane-bolt",
  name: "Arcane Bolt",
  type: "psynergy",
  manaCost: 1,
  basePower: 20,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A bolt of pure magical energy from your rod.",
  aiHints: { priority: 1.5, target: "weakest", avoidOverkill: false }
};
const IRON_THRUST = {
  id: "iron-thrust",
  name: "Iron Thrust",
  type: "physical",
  element: "Venus",
  manaCost: 0,
  basePower: 18,
  targets: "single-enemy",
  ignoreDefensePercent: 0.2,
  unlockLevel: 1,
  description: "A precise thrust that pierces defenses.",
  aiHints: { priority: 1.8, target: "highestDef", avoidOverkill: false }
};
const STEEL_FOCUS = {
  id: "steel-focus",
  name: "Steel Focus",
  type: "buff",
  manaCost: 1,
  basePower: 0,
  targets: "self",
  unlockLevel: 1,
  description: "Focus your mind like steel. Increases ATK.",
  buffEffect: { atk: 5 },
  duration: 3,
  aiHints: { priority: 1.3, target: "random", opener: true }
};
const STEEL_WARD = {
  id: "steel-ward",
  name: "Steel Ward",
  type: "buff",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 1,
  description: "Protect yourself with steel. Grants damage reduction.",
  damageReductionPercent: 0.15,
  duration: 3,
  aiHints: { priority: 1.8, target: "random", opener: true }
};
const AXE_CLEAVE = {
  id: "axe-cleave",
  name: "Axe Cleave",
  type: "physical",
  element: "Mars",
  manaCost: 1,
  basePower: 22,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A powerful cleaving strike with your battle axe.",
  aiHints: { priority: 2, target: "weakest", avoidOverkill: false }
};
const IRON_MIND = {
  id: "iron-mind",
  name: "Iron Mind",
  type: "buff",
  manaCost: 1,
  basePower: 0,
  targets: "self",
  unlockLevel: 1,
  description: "Steel your mind against status effects.",
  grantImmunity: {
    all: false,
    types: ["poison", "burn", "freeze", "paralyze"],
    duration: 2
  },
  aiHints: { priority: 2, target: "random", opener: false }
};
const SILVER_SHIELD = {
  id: "silver-shield",
  name: "Silver Shield",
  type: "buff",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 1,
  description: "Create a shimmering silver shield. Grants shield charges.",
  shieldCharges: 2,
  aiHints: { priority: 2.2, target: "random", opener: true }
};
const MYTHRIL_WISDOM = {
  id: "mythril-wisdom",
  name: "Mythril Wisdom",
  type: "buff",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 1,
  description: "Channel mythril wisdom. Increases MAG significantly.",
  buffEffect: { mag: 8 },
  duration: 4,
  aiHints: { priority: 2, target: "random", opener: true }
};
const HYPER_SPEED = {
  id: "hyper-speed",
  name: "Hyper Speed",
  type: "buff",
  manaCost: 1,
  basePower: 0,
  targets: "self",
  unlockLevel: 1,
  description: "Activate hyper speed. Increases SPD dramatically.",
  buffEffect: { spd: 8 },
  duration: 3,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const MYTHRIL_EDGE = {
  id: "mythril-edge",
  name: "Mythril Edge",
  type: "physical",
  element: "Venus",
  manaCost: 2,
  basePower: 35,
  targets: "single-enemy",
  ignoreDefensePercent: 0.3,
  unlockLevel: 1,
  description: "A devastating strike with mythril precision.",
  aiHints: { priority: 2.8, target: "highestDef", avoidOverkill: false }
};
const DRAGON_WARD = {
  id: "dragon-ward",
  name: "Dragon Ward",
  type: "buff",
  manaCost: 3,
  basePower: 0,
  targets: "self",
  unlockLevel: 1,
  description: "Channel dragon scales' power. Grants elemental resistance.",
  duration: 4,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const ORACLE_VISION = {
  id: "oracle-vision",
  name: "Oracle Vision",
  type: "buff",
  manaCost: 2,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 1,
  description: "Share oracle wisdom with all allies. Increases MAG.",
  buffEffect: { mag: 6 },
  duration: 3,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const STEEL_SLASH = {
  id: "steel-slash",
  name: "Steel Slash",
  type: "physical",
  element: "Venus",
  manaCost: 1,
  basePower: 25,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A powerful slash with a steel blade. Earth-imbued strike.",
  aiHints: { priority: 2, target: "weakest", avoidOverkill: false }
};
const CRYSTAL_BLAST = {
  id: "crystal-blast",
  name: "Crystal Blast",
  type: "psynergy",
  manaCost: 2,
  basePower: 28,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A burst of crystal energy from your rod.",
  aiHints: { priority: 2, target: "weakest", avoidOverkill: false }
};
const SILVER_STRIKE = {
  id: "silver-strike",
  name: "Silver Strike",
  type: "physical",
  element: "Venus",
  manaCost: 1,
  basePower: 30,
  targets: "single-enemy",
  ignoreDefensePercent: 0.25,
  unlockLevel: 1,
  description: "A precise silver strike that pierces defenses.",
  aiHints: { priority: 2.2, target: "highestDef", avoidOverkill: false }
};
const GREAT_CLEAVE = {
  id: "great-cleave",
  name: "Great Cleave",
  type: "physical",
  element: "Mars",
  manaCost: 2,
  basePower: 32,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A devastating cleaving strike with your great axe.",
  aiHints: { priority: 2.3, target: "weakest", avoidOverkill: false }
};
const ZODIAC_BOLT = {
  id: "zodiac-bolt",
  name: "Zodiac Bolt",
  type: "psynergy",
  manaCost: 3,
  basePower: 40,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A powerful bolt of zodiac energy.",
  aiHints: { priority: 2.5, target: "weakest", avoidOverkill: false }
};
const STORM_SLASH = {
  id: "storm-slash",
  name: "Storm Slash",
  type: "physical",
  element: "Jupiter",
  manaCost: 1,
  basePower: 28,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A lightning-fast slash imbued with storm energy.",
  aiHints: { priority: 2.2, target: "weakest", avoidOverkill: false }
};
const FROST_STRIKE = {
  id: "frost-strike",
  name: "Frost Strike",
  type: "physical",
  element: "Mercury",
  manaCost: 1,
  basePower: 26,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A chilling strike that may slow the enemy.",
  statusEffect: { type: "freeze", duration: 1, chance: 0.2 },
  aiHints: { priority: 2.1, target: "weakest", avoidOverkill: false }
};
const VOLCANIC_SMASH = {
  id: "volcanic-smash",
  name: "Volcanic Smash",
  type: "physical",
  element: "Mars",
  manaCost: 1,
  basePower: 30,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A devastating smash with volcanic fury.",
  statusEffect: { type: "burn", duration: 2, chance: 0.25 },
  aiHints: { priority: 2.3, target: "weakest", avoidOverkill: false }
};
const STORM_MASTERY = {
  id: "storm-mastery",
  name: "Storm Mastery",
  type: "buff",
  element: "Jupiter",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 1,
  description: "Channel storm energy to boost SPD and ATK.",
  buffEffect: { spd: 8, atk: 5 },
  duration: 3,
  aiHints: { priority: 2, target: "random", opener: true }
};
const FROST_MASTERY = {
  id: "frost-mastery",
  name: "Frost Mastery",
  type: "buff",
  element: "Mercury",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 1,
  description: "Channel frost energy to boost MAG and DEF.",
  buffEffect: { mag: 8, def: 5 },
  duration: 3,
  aiHints: { priority: 2, target: "random", opener: true }
};
const MYTHRIL_CLEAVE = {
  id: "mythril-cleave",
  name: "Mythril Cleave",
  type: "physical",
  manaCost: 2,
  basePower: 45,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A powerful cleave with mythril weaponry.",
  aiHints: { priority: 2.5, target: "weakest", avoidOverkill: false }
};
const MYTHRIL_SURGE = {
  id: "mythril-surge",
  name: "Mythril Surge",
  type: "psynergy",
  manaCost: 2,
  basePower: 42,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "Channel magic through mythril for a surge of power.",
  aiHints: { priority: 2.5, target: "weakest", avoidOverkill: false }
};
const MYTHRIL_PIERCE = {
  id: "mythril-pierce",
  name: "Mythril Pierce",
  type: "physical",
  manaCost: 2,
  basePower: 35,
  targets: "single-enemy",
  ignoreDefensePercent: 0.35,
  unlockLevel: 1,
  description: "A precise strike that pierces through armor.",
  aiHints: { priority: 2.4, target: "highestDef", avoidOverkill: false }
};
const MYTHRIL_STRIKE = {
  id: "mythril-strike",
  name: "Mythril Strike",
  type: "physical",
  manaCost: 1,
  basePower: 38,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A swift strike with mythril weaponry.",
  aiHints: { priority: 2.3, target: "weakest", avoidOverkill: false }
};
const EARTH_WALL = {
  id: "earth-wall",
  name: "Earth Wall",
  type: "buff",
  element: "Venus",
  manaCost: 2,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 1,
  description: "Raise an earth wall to protect all allies.",
  damageReductionPercent: 0.2,
  duration: 2,
  aiHints: { priority: 2.2, target: "random", opener: true }
};
const GAIA_FORTITUDE = {
  id: "gaia-fortitude",
  name: "Gaia Fortitude",
  type: "buff",
  element: "Venus",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 1,
  description: "Draw upon Gaia's power to fortify yourself.",
  buffEffect: { def: 12 },
  damageReductionPercent: 0.15,
  duration: 3,
  aiHints: { priority: 2.3, target: "random", opener: true }
};
const FLAME_BURST = {
  id: "flame-burst",
  name: "Flame Burst",
  type: "psynergy",
  element: "Mars",
  manaCost: 2,
  basePower: 35,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A burst of flame from Mars element equipment.",
  aiHints: { priority: 2.2, target: "weakest", avoidOverkill: false }
};
const INFERNO_FIST = {
  id: "inferno-fist",
  name: "Inferno Fist",
  type: "physical",
  element: "Mars",
  manaCost: 2,
  basePower: 38,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A fiery punch that burns on impact.",
  statusEffect: { type: "burn", duration: 2, chance: 0.35 },
  aiHints: { priority: 2.4, target: "weakest", avoidOverkill: false }
};
const FROST_NOVA = {
  id: "frost-nova",
  name: "Frost Nova",
  type: "psynergy",
  element: "Mercury",
  manaCost: 3,
  basePower: 28,
  targets: "all-enemies",
  unlockLevel: 1,
  description: "An expanding nova of frost energy.",
  statusEffect: { type: "freeze", duration: 1, chance: 0.3 },
  aiHints: { priority: 2.5, target: "random", avoidOverkill: false }
};
const LIGHTNING_SHOT = {
  id: "lightning-shot",
  name: "Lightning Shot",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 2,
  basePower: 32,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A rapid bolt of lightning at high speed.",
  aiHints: { priority: 2.3, target: "weakest", avoidOverkill: false }
};
const STORM_FOCUS = {
  id: "storm-focus",
  name: "Storm Focus",
  type: "buff",
  element: "Jupiter",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 1,
  description: "Focus the storm within to boost all combat stats.",
  buffEffect: { atk: 6, mag: 6, spd: 4 },
  duration: 3,
  aiHints: { priority: 2.2, target: "random", opener: true }
};
const ASTRAL_STRIKE = {
  id: "astral-strike",
  name: "Astral Strike",
  type: "physical",
  manaCost: 3,
  basePower: 55,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "A devastating strike channeling astral power.",
  ignoreDefensePercent: 0.25,
  aiHints: { priority: 2.8, target: "weakest", avoidOverkill: false }
};
const SHADOWFLAME = {
  id: "shadowflame",
  name: "Shadowflame",
  type: "psynergy",
  element: "Mars",
  manaCost: 3,
  basePower: 50,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "Dark fire that burns both body and soul.",
  statusEffect: { type: "burn", duration: 3, chance: 0.4 },
  aiHints: { priority: 2.7, target: "weakest", avoidOverkill: false }
};
const EARTH_SPIKE_DAMAGE = {
  id: "earth-spike-damage",
  name: "Earth Spike",
  type: "psynergy",
  element: "Venus",
  manaCost: 3,
  basePower: 35,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "Powerful earth spike that deals heavy damage",
  aiHints: { priority: 2.5, target: "weakest", avoidOverkill: false }
};
const STONE_SKIN_UTILITY = {
  id: "stone-skin",
  name: "Stone Skin",
  type: "buff",
  element: "Venus",
  manaCost: 2,
  basePower: 0,
  targets: "single-ally",
  unlockLevel: 1,
  description: "Harden skin like stone, increasing DEF significantly",
  buffEffect: { def: 10 },
  duration: 3,
  aiHints: { priority: 2, target: "random", opener: true }
};
const FLAME_BURST_DAMAGE = {
  id: "flame-burst-damage",
  name: "Flame Burst",
  type: "psynergy",
  element: "Mars",
  manaCost: 3,
  basePower: 38,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "Explosive burst of flame dealing heavy damage",
  aiHints: { priority: 2.5, target: "weakest", avoidOverkill: false }
};
const FIRE_WARD_UTILITY = {
  id: "fire-ward",
  name: "Fire Ward",
  type: "buff",
  element: "Mars",
  manaCost: 2,
  basePower: 0,
  targets: "single-ally",
  unlockLevel: 1,
  description: "Ward yourself with fire, increasing ATK significantly",
  buffEffect: { atk: 10 },
  duration: 3,
  aiHints: { priority: 2, target: "random", opener: true }
};
const ICE_LANCE_DAMAGE = {
  id: "ice-lance-damage",
  name: "Ice Lance",
  type: "psynergy",
  element: "Mercury",
  manaCost: 3,
  basePower: 36,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "Piercing lance of ice dealing heavy damage",
  aiHints: { priority: 2.5, target: "weakest", avoidOverkill: false }
};
const AQUA_HEAL_UTILITY = {
  id: "aqua-heal",
  name: "Aqua Heal",
  type: "healing",
  element: "Mercury",
  manaCost: 3,
  basePower: 50,
  targets: "single-ally",
  unlockLevel: 1,
  description: "Restore HP with healing waters",
  aiHints: { priority: 3, target: "healerFirst", avoidOverkill: false }
};
const GALE_FORCE_DAMAGE = {
  id: "gale-force-damage",
  name: "Gale Force",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 3,
  basePower: 34,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "Powerful gale dealing heavy damage",
  aiHints: { priority: 2.5, target: "weakest", avoidOverkill: false }
};
const WIND_BARRIER_UTILITY = {
  id: "wind-barrier",
  name: "Wind Barrier",
  type: "buff",
  element: "Jupiter",
  manaCost: 2,
  basePower: 0,
  targets: "single-ally",
  unlockLevel: 1,
  description: "Create a barrier of wind, increasing SPD significantly",
  buffEffect: { spd: 8 },
  duration: 3,
  aiHints: { priority: 2, target: "random", opener: true }
};
const FOCUS_STRIKE_NEUTRAL = {
  id: "focus-strike-neutral",
  name: "Focus Strike",
  type: "physical",
  manaCost: 0,
  basePower: 20,
  targets: "single-enemy",
  unlockLevel: 1,
  description: "Focused physical strike with neutral element",
  aiHints: { priority: 1.8, target: "weakest", avoidOverkill: false }
};
const FORTIFY = {
  id: "fortify",
  name: "Fortify",
  type: "buff",
  element: "Venus",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 7,
  description: "Earth strengthens your resolve. Grants shield charges and DEF boost.",
  shieldCharges: 2,
  buffEffect: { def: 5 },
  duration: 3,
  aiHints: { priority: 2, target: "random", opener: true }
};
const TREMOR = {
  id: "tremor",
  name: "Tremor",
  type: "psynergy",
  element: "Venus",
  manaCost: 3,
  basePower: 28,
  targets: "all-enemies",
  unlockLevel: 8,
  description: "Shake the earth beneath all enemies.",
  aiHints: { priority: 2.5, target: "random", avoidOverkill: false }
};
const GUARDIAN_STANCE = {
  id: "guardian-stance",
  name: "Guardian Stance",
  type: "buff",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 9,
  description: "Reduce incoming damage significantly.",
  damageReductionPercent: 0.25,
  duration: 4,
  aiHints: { priority: 2.2, target: "random", opener: true }
};
const ROCK_BREAKER = {
  id: "rock-breaker",
  name: "Rock Breaker",
  type: "physical",
  element: "Venus",
  manaCost: 1,
  basePower: 18,
  targets: "single-enemy",
  unlockLevel: 10,
  description: "Strike twice with earth-shattering force.",
  hitCount: 2,
  aiHints: { priority: 2, target: "weakest", avoidOverkill: false }
};
const EARTHQUAKE = {
  id: "earthquake",
  name: "Earthquake",
  type: "psynergy",
  element: "Venus",
  manaCost: 4,
  basePower: 35,
  targets: "all-enemies",
  unlockLevel: 11,
  description: "Devastating earthquake hits all enemies.",
  splashDamagePercent: 1,
  aiHints: { priority: 2.8, target: "random", avoidOverkill: false }
};
const STONE_WALL = {
  id: "stone-wall",
  name: "Stone Wall",
  type: "buff",
  element: "Venus",
  manaCost: 3,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 12,
  description: "Raise a wall of stone, protecting all allies.",
  buffEffect: { def: 6 },
  duration: 3,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const UNBREAKABLE = {
  id: "unbreakable",
  name: "Unbreakable",
  type: "buff",
  manaCost: 3,
  basePower: 0,
  targets: "self",
  unlockLevel: 13,
  description: "Become nearly invulnerable for a short time.",
  damageReductionPercent: 0.4,
  shieldCharges: 3,
  duration: 3,
  aiHints: { priority: 2.8, target: "random", opener: true }
};
const TITAN_GRIP = {
  id: "titan-grip",
  name: "Titan Grip",
  type: "physical",
  element: "Venus",
  manaCost: 2,
  basePower: 40,
  targets: "single-enemy",
  unlockLevel: 14,
  description: "Crushing blow that ignores half of enemy defenses.",
  ignoreDefensePercent: 0.5,
  aiHints: { priority: 2.8, target: "highestDef", avoidOverkill: false }
};
const GAIA_SHIELD = {
  id: "gaia-shield",
  name: "Gaia Shield",
  type: "buff",
  element: "Venus",
  manaCost: 4,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 15,
  description: "Earth's protection shields the entire party.",
  shieldCharges: 3,
  duration: 4,
  aiHints: { priority: 3, target: "random", opener: true }
};
const PETRIFY_STRIKE = {
  id: "petrify-strike",
  name: "Petrify Strike",
  type: "physical",
  element: "Venus",
  manaCost: 2,
  basePower: 25,
  targets: "single-enemy",
  unlockLevel: 16,
  description: "Attack that may freeze enemies in stone.",
  statusEffect: { type: "freeze", duration: 2, chance: 0.5 },
  aiHints: { priority: 2.5, target: "weakest", avoidOverkill: false }
};
const MOUNTAIN_ENDURANCE = {
  id: "mountain-endurance",
  name: "Mountain's Endurance",
  type: "buff",
  manaCost: 3,
  basePower: 0,
  targets: "self",
  unlockLevel: 17,
  description: "Channel the mountain's endurance. Heal over time and immunity.",
  healOverTime: { amount: 15, duration: 3 },
  grantImmunity: { all: true, duration: 2 },
  aiHints: { priority: 2.8, target: "random", opener: false }
};
const LANDSLIDE = {
  id: "landslide",
  name: "Landslide",
  type: "psynergy",
  element: "Venus",
  manaCost: 5,
  basePower: 50,
  targets: "all-enemies",
  unlockLevel: 18,
  description: "Massive landslide buries all enemies.",
  splashDamagePercent: 1,
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const EARTH_BLESSING = {
  id: "earth-blessing",
  name: "Earth's Blessing",
  type: "healing",
  element: "Venus",
  manaCost: 4,
  basePower: 60,
  targets: "all-allies",
  unlockLevel: 19,
  description: "Earth's power restores the entire party.",
  aiHints: { priority: 3, target: "healerFirst", avoidOverkill: false }
};
const GAIA_REBIRTH = {
  id: "gaia-rebirth",
  name: "Gaia Rebirth",
  type: "healing",
  element: "Venus",
  manaCost: 5,
  basePower: 80,
  targets: "all-allies",
  unlockLevel: 20,
  description: "Channel Gaia's power to heal all allies and revive fallen.",
  revive: true,
  reviveHPPercent: 0.5,
  removeStatusEffects: { type: "negative" },
  aiHints: { priority: 3, target: "healerFirst", avoidOverkill: false }
};
const IGNITE = {
  id: "ignite",
  name: "Ignite",
  type: "psynergy",
  element: "Mars",
  manaCost: 2,
  basePower: 25,
  targets: "single-enemy",
  unlockLevel: 7,
  description: "Set enemy ablaze with persistent flames.",
  statusEffect: { type: "burn", duration: 3, chance: 0.8 },
  aiHints: { priority: 2.2, target: "weakest", avoidOverkill: false }
};
const FLAME_WALL = {
  id: "flame-wall",
  name: "Flame Wall",
  type: "buff",
  element: "Mars",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 8,
  description: "Surround yourself with flames, granting fire resistance.",
  duration: 4,
  aiHints: { priority: 2, target: "random", opener: true }
};
const INFERNO_SLASH = {
  id: "inferno-slash",
  name: "Inferno Slash",
  type: "physical",
  element: "Mars",
  manaCost: 1,
  basePower: 22,
  targets: "single-enemy",
  unlockLevel: 9,
  description: "Fire-infused blade strike.",
  aiHints: { priority: 2, target: "weakest", avoidOverkill: false }
};
const BLAZING_FURY = {
  id: "blazing-fury",
  name: "Blazing Fury",
  type: "psynergy",
  element: "Mars",
  manaCost: 3,
  basePower: 20,
  targets: "single-enemy",
  unlockLevel: 10,
  description: "Rapid-fire explosions hit the target.",
  hitCount: 3,
  aiHints: { priority: 2.5, target: "weakest", avoidOverkill: false }
};
const PYROCLASM = {
  id: "pyroclasm",
  name: "Pyroclasm",
  type: "psynergy",
  element: "Mars",
  manaCost: 4,
  basePower: 40,
  targets: "all-enemies",
  unlockLevel: 11,
  description: "Volcanic eruption engulfs all enemies.",
  aiHints: { priority: 2.8, target: "random", avoidOverkill: false }
};
const FIRE_AURA = {
  id: "fire-aura",
  name: "Fire Aura",
  type: "buff",
  element: "Mars",
  manaCost: 3,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 12,
  description: "Grant fire power to all allies.",
  buffEffect: { atk: 7, mag: 7 },
  duration: 3,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const METEOR_STRIKE = {
  id: "meteor-strike",
  name: "Meteor Strike",
  type: "psynergy",
  element: "Mars",
  manaCost: 4,
  basePower: 45,
  targets: "single-enemy",
  unlockLevel: 13,
  description: "Call down a meteor on a single target.",
  splashDamagePercent: 0.4,
  aiHints: { priority: 2.8, target: "weakest", avoidOverkill: false }
};
const PHOENIX_FLAMES = {
  id: "phoenix-flames",
  name: "Phoenix Flames",
  type: "healing",
  element: "Mars",
  manaCost: 3,
  basePower: 40,
  targets: "single-ally",
  unlockLevel: 14,
  description: "Healing flames of the phoenix.",
  removeStatusEffects: { type: "byType", statuses: ["burn", "poison"] },
  aiHints: { priority: 2.5, target: "healerFirst", avoidOverkill: false }
};
const MAGMA_BURST = {
  id: "magma-burst",
  name: "Magma Burst",
  type: "psynergy",
  element: "Mars",
  manaCost: 5,
  basePower: 55,
  targets: "single-enemy",
  unlockLevel: 15,
  description: "Devastating magma explosion.",
  statusEffect: { type: "burn", duration: 3, chance: 1 },
  aiHints: { priority: 3, target: "weakest", avoidOverkill: false }
};
const FLAME_SHIELD = {
  id: "flame-shield",
  name: "Flame Shield",
  type: "buff",
  element: "Mars",
  manaCost: 3,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 16,
  description: "Fiery barrier protects all allies from status.",
  grantImmunity: { all: false, types: ["freeze", "poison"], duration: 3 },
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const SUPERNOVA = {
  id: "supernova",
  name: "Supernova",
  type: "psynergy",
  element: "Mars",
  manaCost: 5,
  basePower: 48,
  targets: "all-enemies",
  unlockLevel: 17,
  description: "Explosive nova hits all enemies with burn.",
  statusEffect: { type: "burn", duration: 2, chance: 0.6 },
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const INFERNAL_RAGE = {
  id: "infernal-rage",
  name: "Infernal Rage",
  type: "buff",
  manaCost: 4,
  basePower: 0,
  targets: "self",
  unlockLevel: 18,
  description: "Channel pure rage into power.",
  buffEffect: { atk: 15, mag: 15 },
  duration: 3,
  aiHints: { priority: 2.8, target: "random", opener: true }
};
const DRAGON_BREATH = {
  id: "dragon-breath",
  name: "Dragon Breath",
  type: "psynergy",
  element: "Mars",
  manaCost: 5,
  basePower: 60,
  targets: "all-enemies",
  unlockLevel: 19,
  description: "Breathe dragon fire across all enemies.",
  chainDamage: true,
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const RAGNAROK_FLAMES = {
  id: "ragnarok-flames",
  name: "Ragnarok Flames",
  type: "psynergy",
  element: "Mars",
  manaCost: 5,
  basePower: 70,
  targets: "all-enemies",
  unlockLevel: 20,
  description: "Apocalyptic flames consume all enemies.",
  splashDamagePercent: 1,
  statusEffect: { type: "burn", duration: 3, chance: 1 },
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const CLEANSE = {
  id: "cleanse",
  name: "Cleanse",
  type: "healing",
  element: "Mercury",
  manaCost: 2,
  basePower: 0,
  targets: "single-ally",
  unlockLevel: 7,
  description: "Purifying waters remove negative effects.",
  removeStatusEffects: { type: "negative" },
  aiHints: { priority: 2.5, target: "healerFirst", avoidOverkill: false }
};
const FROST_WAVE = {
  id: "frost-wave",
  name: "Frost Wave",
  type: "psynergy",
  element: "Mercury",
  manaCost: 3,
  basePower: 30,
  targets: "all-enemies",
  unlockLevel: 8,
  description: "Wave of frost hits all enemies.",
  aiHints: { priority: 2.5, target: "random", avoidOverkill: false }
};
const REGEN = {
  id: "regen",
  name: "Regen",
  type: "healing",
  element: "Mercury",
  manaCost: 2,
  basePower: 20,
  targets: "single-ally",
  unlockLevel: 9,
  description: "Grant regeneration over time.",
  healOverTime: { amount: 12, duration: 3 },
  aiHints: { priority: 2, target: "healerFirst", avoidOverkill: false }
};
const DIAMOND_DUST = {
  id: "diamond-dust",
  name: "Diamond Dust",
  type: "psynergy",
  element: "Mercury",
  manaCost: 3,
  basePower: 25,
  targets: "all-enemies",
  unlockLevel: 10,
  description: "Freezing ice crystals that may freeze enemies.",
  statusEffect: { type: "freeze", duration: 2, chance: 0.4 },
  aiHints: { priority: 2.5, target: "random", avoidOverkill: false }
};
const MASS_REGEN = {
  id: "mass-regen",
  name: "Mass Regen",
  type: "healing",
  element: "Mercury",
  manaCost: 4,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 11,
  description: "Grant regeneration to entire party.",
  healOverTime: { amount: 10, duration: 3 },
  aiHints: { priority: 2.8, target: "healerFirst", avoidOverkill: false }
};
const GLACIAL_SHIELD = {
  id: "glacial-shield",
  name: "Glacial Shield",
  type: "buff",
  element: "Mercury",
  manaCost: 3,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 12,
  description: "Ice barrier protects all allies.",
  shieldCharges: 2,
  duration: 3,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const DEEP_FREEZE = {
  id: "deep-freeze",
  name: "Deep Freeze",
  type: "psynergy",
  element: "Mercury",
  manaCost: 4,
  basePower: 35,
  targets: "single-enemy",
  unlockLevel: 13,
  description: "Encase enemy in solid ice.",
  statusEffect: { type: "freeze", duration: 3, chance: 0.8 },
  aiHints: { priority: 2.8, target: "weakest", avoidOverkill: false }
};
const SANCTUARY = {
  id: "sanctuary",
  name: "Sanctuary",
  type: "buff",
  manaCost: 4,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 14,
  description: "Create sanctuary granting immunity and damage reduction.",
  grantImmunity: { all: true, duration: 2 },
  damageReductionPercent: 0.2,
  duration: 3,
  aiHints: { priority: 3, target: "random", opener: true }
};
const BLIZZARD = {
  id: "blizzard",
  name: "Blizzard",
  type: "psynergy",
  element: "Mercury",
  manaCost: 5,
  basePower: 45,
  targets: "all-enemies",
  unlockLevel: 15,
  description: "Massive blizzard engulfs battlefield.",
  chainDamage: true,
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const RESTORATION = {
  id: "restoration",
  name: "Restoration",
  type: "healing",
  element: "Mercury",
  manaCost: 4,
  basePower: 70,
  targets: "single-ally",
  unlockLevel: 16,
  description: "Complete restoration of ally.",
  removeStatusEffects: { type: "all" },
  aiHints: { priority: 3, target: "healerFirst", avoidOverkill: false }
};
const FROZEN_TOMB = {
  id: "frozen-tomb",
  name: "Frozen Tomb",
  type: "psynergy",
  element: "Mercury",
  manaCost: 4,
  basePower: 30,
  targets: "single-enemy",
  unlockLevel: 17,
  description: "Trap enemy in frozen tomb for extended duration.",
  statusEffect: { type: "freeze", duration: 4, chance: 1 },
  aiHints: { priority: 2.8, target: "weakest", avoidOverkill: false }
};
const AQUA_BARRIER = {
  id: "aqua-barrier",
  name: "Aqua Barrier",
  type: "buff",
  element: "Mercury",
  manaCost: 5,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 18,
  description: "Ultimate water barrier shields and heals party.",
  shieldCharges: 4,
  healOverTime: { amount: 15, duration: 3 },
  aiHints: { priority: 3, target: "random", opener: true }
};
const ABSOLUTE_ZERO = {
  id: "absolute-zero",
  name: "Absolute Zero",
  type: "psynergy",
  element: "Mercury",
  manaCost: 5,
  basePower: 60,
  targets: "all-enemies",
  unlockLevel: 19,
  description: "Freeze all enemies at absolute zero temperature.",
  statusEffect: { type: "freeze", duration: 2, chance: 0.7 },
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const LEVIATHAN_GRACE = {
  id: "leviathan-grace",
  name: "Leviathan's Grace",
  type: "healing",
  element: "Mercury",
  manaCost: 5,
  basePower: 100,
  targets: "all-allies",
  unlockLevel: 20,
  description: "Channel Leviathan's power for complete party restoration.",
  revive: true,
  reviveHPPercent: 0.75,
  removeStatusEffects: { type: "all" },
  healOverTime: { amount: 20, duration: 3 },
  aiHints: { priority: 3, target: "healerFirst", avoidOverkill: false }
};
const SWIFT_STRIKE = {
  id: "swift-strike",
  name: "Swift Strike",
  type: "physical",
  element: "Jupiter",
  manaCost: 1,
  basePower: 12,
  targets: "single-enemy",
  unlockLevel: 7,
  description: "Lightning-fast double strike.",
  hitCount: 2,
  aiHints: { priority: 2, target: "weakest", avoidOverkill: false }
};
const SHOCK_BOLT = {
  id: "shock-bolt",
  name: "Shock Bolt",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 3,
  basePower: 30,
  targets: "single-enemy",
  unlockLevel: 8,
  description: "Lightning bolt that may paralyze.",
  statusEffect: { type: "paralyze", duration: 2, chance: 0.5 },
  aiHints: { priority: 2.5, target: "weakest", avoidOverkill: false }
};
const TEMPEST = {
  id: "tempest",
  name: "Tempest",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 3,
  basePower: 28,
  targets: "all-enemies",
  unlockLevel: 9,
  description: "Violent tempest strikes all enemies.",
  aiHints: { priority: 2.5, target: "random", avoidOverkill: false }
};
const HURRICANE_SLASH = {
  id: "hurricane-slash",
  name: "Hurricane Slash",
  type: "physical",
  element: "Jupiter",
  manaCost: 2,
  basePower: 25,
  targets: "single-enemy",
  unlockLevel: 10,
  description: "Wind-infused slash that penetrates defenses.",
  ignoreDefensePercent: 0.3,
  aiHints: { priority: 2.5, target: "highestDef", avoidOverkill: false }
};
const PLASMA_SHOT = {
  id: "plasma-shot",
  name: "Plasma Shot",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 4,
  basePower: 18,
  targets: "single-enemy",
  unlockLevel: 11,
  description: "Rapid plasma bolts.",
  hitCount: 3,
  aiHints: { priority: 2.8, target: "weakest", avoidOverkill: false }
};
const CYCLONE = {
  id: "cyclone",
  name: "Cyclone",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 4,
  basePower: 35,
  targets: "all-enemies",
  unlockLevel: 12,
  description: "Devastating cyclone tears through enemies.",
  splashDamagePercent: 1,
  aiHints: { priority: 2.8, target: "random", avoidOverkill: false }
};
const THUNDER_GOD_FURY = {
  id: "thunder-god-fury",
  name: "Thunder God's Fury",
  type: "physical",
  element: "Jupiter",
  manaCost: 3,
  basePower: 16,
  targets: "single-enemy",
  unlockLevel: 13,
  description: "Unleash a barrage of lightning strikes.",
  hitCount: 4,
  aiHints: { priority: 2.8, target: "weakest", avoidOverkill: false }
};
const STORM_BLESSING = {
  id: "storm-blessing",
  name: "Storm Blessing",
  type: "buff",
  element: "Jupiter",
  manaCost: 3,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 14,
  description: "Grant the party speed and evasion.",
  buffEffect: { spd: 10 },
  duration: 4,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const JUDGMENT_BOLT = {
  id: "judgment-bolt",
  name: "Judgment Bolt",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 5,
  basePower: 55,
  targets: "single-enemy",
  unlockLevel: 15,
  description: "Divine lightning strikes with massive power.",
  ignoreDefensePercent: 0.4,
  aiHints: { priority: 3, target: "weakest", avoidOverkill: false }
};
const STATIC_FIELD = {
  id: "static-field",
  name: "Static Field",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 4,
  basePower: 25,
  targets: "all-enemies",
  unlockLevel: 16,
  description: "Electric field paralyzes all enemies.",
  statusEffect: { type: "paralyze", duration: 2, chance: 0.6 },
  aiHints: { priority: 2.8, target: "random", avoidOverkill: false }
};
const WIND_WALKER = {
  id: "wind-walker",
  name: "Wind Walker",
  type: "buff",
  manaCost: 3,
  basePower: 0,
  targets: "self",
  unlockLevel: 17,
  description: "Become one with the wind, dodging and striking.",
  buffEffect: { spd: 15, atk: 10 },
  damageReductionPercent: 0.25,
  duration: 3,
  aiHints: { priority: 2.8, target: "random", opener: true }
};
const MAELSTROM = {
  id: "maelstrom",
  name: "Maelstrom",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 5,
  basePower: 50,
  targets: "all-enemies",
  unlockLevel: 18,
  description: "Massive storm of wind and lightning.",
  chainDamage: true,
  statusEffect: { type: "paralyze", duration: 2, chance: 0.4 },
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const ZEUS_WRATH = {
  id: "zeus-wrath",
  name: "Zeus's Wrath",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 5,
  basePower: 25,
  targets: "all-enemies",
  unlockLevel: 19,
  description: "God of thunder unleashes wrath.",
  hitCount: 3,
  chainDamage: true,
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const STORM_SOVEREIGN = {
  id: "storm-sovereign",
  name: "Storm Sovereign",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 5,
  basePower: 65,
  targets: "all-enemies",
  unlockLevel: 20,
  description: "Become the storm itself, devastating all enemies.",
  hitCount: 2,
  chainDamage: true,
  splashDamagePercent: 1,
  statusEffect: { type: "paralyze", duration: 3, chance: 0.8 },
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const TAUNT = {
  id: "taunt",
  name: "Taunt",
  type: "debuff",
  manaCost: 1,
  basePower: 0,
  targets: "single-enemy",
  unlockLevel: 4,
  description: "Provoke enemy, reducing their accuracy.",
  debuffEffect: { atk: -5 },
  duration: 2,
  aiHints: { priority: 1.5, target: "random", avoidOverkill: false }
};
const SHIELD_BASH = {
  id: "shield-bash",
  name: "Shield Bash",
  type: "physical",
  element: "Venus",
  manaCost: 0,
  basePower: 16,
  targets: "single-enemy",
  unlockLevel: 5,
  description: "Bash with shield, dealing damage and stunning.",
  statusEffect: { type: "stun", duration: 1, chance: 0.4 },
  aiHints: { priority: 2, target: "weakest", avoidOverkill: false }
};
const IRON_WALL = {
  id: "iron-wall",
  name: "Iron Wall",
  type: "buff",
  element: "Venus",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 6,
  description: "Become an immovable wall.",
  buffEffect: { def: 12 },
  duration: 4,
  aiHints: { priority: 2, target: "random", opener: true }
};
const COUNTER_STANCE = {
  id: "counter-stance",
  name: "Counter Stance",
  type: "buff",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 7,
  description: "Prepare to counter attacks.",
  damageReductionPercent: 0.2,
  duration: 3,
  aiHints: { priority: 2, target: "random", opener: true }
};
const TREMOR_STRIKE = {
  id: "tremor-strike",
  name: "Tremor Strike",
  type: "physical",
  element: "Venus",
  manaCost: 1,
  basePower: 20,
  targets: "single-enemy",
  unlockLevel: 8,
  description: "Ground-shaking strike hits hard.",
  aiHints: { priority: 2, target: "weakest", avoidOverkill: false }
};
const FORTIFIED_GUARD = {
  id: "fortified-guard",
  name: "Fortified Guard",
  type: "buff",
  manaCost: 3,
  basePower: 0,
  targets: "self",
  unlockLevel: 9,
  description: "Ultimate defensive stance.",
  shieldCharges: 3,
  buffEffect: { def: 8 },
  duration: 3,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const BULWARK = {
  id: "bulwark",
  name: "Bulwark",
  type: "buff",
  element: "Venus",
  manaCost: 3,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 10,
  description: "Raise defenses for entire party.",
  buffEffect: { def: 6 },
  duration: 3,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const CRUSHING_BLOW = {
  id: "crushing-blow",
  name: "Crushing Blow",
  type: "physical",
  element: "Venus",
  manaCost: 2,
  basePower: 35,
  targets: "single-enemy",
  unlockLevel: 11,
  description: "Overwhelming force crushes defenses.",
  ignoreDefensePercent: 0.4,
  aiHints: { priority: 2.5, target: "highestDef", avoidOverkill: false }
};
const EARTHEN_ARMOR = {
  id: "earthen-armor",
  name: "Earthen Armor",
  type: "buff",
  element: "Venus",
  manaCost: 3,
  basePower: 0,
  targets: "self",
  unlockLevel: 12,
  description: "Cover yourself in earthen plates.",
  damageReductionPercent: 0.35,
  duration: 4,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const SHOCKWAVE = {
  id: "shockwave",
  name: "Shockwave",
  type: "psynergy",
  element: "Venus",
  manaCost: 4,
  basePower: 32,
  targets: "all-enemies",
  unlockLevel: 13,
  description: "Send shockwave through ground.",
  splashDamagePercent: 1,
  aiHints: { priority: 2.8, target: "random", avoidOverkill: false }
};
const GUARDIAN_RESOLVE = {
  id: "guardian-resolve",
  name: "Guardian's Resolve",
  type: "buff",
  manaCost: 4,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 14,
  description: "Inspire party with unwavering resolve.",
  buffEffect: { def: 7 },
  duration: 3,
  aiHints: { priority: 2.8, target: "random", opener: true }
};
const TITAN_GRIP_SENTINEL = {
  id: "titan-grip-sentinel",
  name: "Titan's Grip",
  type: "physical",
  element: "Venus",
  manaCost: 3,
  basePower: 45,
  targets: "single-enemy",
  unlockLevel: 15,
  description: "Grip with titan strength, ignoring defenses.",
  ignoreDefensePercent: 0.6,
  aiHints: { priority: 2.8, target: "highestDef", avoidOverkill: false }
};
const STONE_FORTRESS = {
  id: "stone-fortress",
  name: "Stone Fortress",
  type: "buff",
  element: "Venus",
  manaCost: 4,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 16,
  description: "Turn party into fortified position.",
  shieldCharges: 3,
  damageReductionPercent: 0.25,
  duration: 4,
  aiHints: { priority: 3, target: "random", opener: true }
};
const AVALANCHE = {
  id: "avalanche",
  name: "Avalanche",
  type: "psynergy",
  element: "Venus",
  manaCost: 5,
  basePower: 50,
  targets: "all-enemies",
  unlockLevel: 17,
  description: "Massive avalanche buries enemies.",
  splashDamagePercent: 1,
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const IMMORTAL_BULWARK = {
  id: "immortal-bulwark",
  name: "Immortal Bulwark",
  type: "buff",
  manaCost: 5,
  basePower: 0,
  targets: "self",
  unlockLevel: 18,
  description: "Become nearly invincible.",
  damageReductionPercent: 0.5,
  shieldCharges: 5,
  grantImmunity: { all: true, duration: 2 },
  aiHints: { priority: 3, target: "random", opener: true }
};
const EARTH_SPLITTER = {
  id: "earth-splitter",
  name: "Earth Splitter",
  type: "physical",
  element: "Venus",
  manaCost: 4,
  basePower: 55,
  targets: "single-enemy",
  unlockLevel: 19,
  description: "Split the earth with devastating force.",
  ignoreDefensePercent: 0.7,
  splashDamagePercent: 0.3,
  aiHints: { priority: 3, target: "highestDef", avoidOverkill: false }
};
const ATLAS_STAND = {
  id: "atlas-stand",
  name: "Atlas's Stand",
  type: "buff",
  element: "Venus",
  manaCost: 5,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 20,
  description: "Channel Atlas, protecting party completely.",
  shieldCharges: 6,
  buffEffect: { def: 15 },
  damageReductionPercent: 0.4,
  grantImmunity: { all: false, types: ["stun", "paralyze", "freeze"], duration: 3 },
  duration: 4,
  aiHints: { priority: 3, target: "random", opener: true }
};
const THUNDER_CLAP = {
  id: "thunder-clap",
  name: "Thunder Clap",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 2,
  basePower: 20,
  targets: "all-enemies",
  unlockLevel: 4,
  description: "Loud thunder damages and disorients.",
  debuffEffect: { spd: -5 },
  duration: 2,
  aiHints: { priority: 2, target: "random", avoidOverkill: false }
};
const STORM_CALL = {
  id: "storm-call",
  name: "Storm Call",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 3,
  basePower: 25,
  targets: "all-enemies",
  unlockLevel: 5,
  description: "Call down storm on all enemies.",
  aiHints: { priority: 2, target: "random", avoidOverkill: false }
};
const STATIC_CHARGE = {
  id: "static-charge",
  name: "Static Charge",
  type: "buff",
  element: "Jupiter",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 6,
  description: "Build static electricity, boosting MAG.",
  buffEffect: { mag: 10 },
  duration: 3,
  aiHints: { priority: 2, target: "random", opener: true }
};
const LIGHTNING_ARC = {
  id: "lightning-arc",
  name: "Lightning Arc",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 3,
  basePower: 35,
  targets: "single-enemy",
  unlockLevel: 7,
  description: "Concentrated lightning arc.",
  aiHints: { priority: 2.5, target: "weakest", avoidOverkill: false }
};
const SHOCK_PULSE = {
  id: "shock-pulse",
  name: "Shock Pulse",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 3,
  basePower: 22,
  targets: "all-enemies",
  unlockLevel: 8,
  description: "Electric pulse paralyzes enemies.",
  statusEffect: { type: "paralyze", duration: 2, chance: 0.5 },
  aiHints: { priority: 2.5, target: "random", avoidOverkill: false }
};
const WIND_MASTERY = {
  id: "wind-mastery",
  name: "Wind Mastery",
  type: "buff",
  element: "Jupiter",
  manaCost: 3,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 9,
  description: "Grant wind mastery to party.",
  buffEffect: { spd: 8, mag: 5 },
  duration: 3,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const THUNDER_STORM = {
  id: "thunder-storm",
  name: "Thunder Storm",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 4,
  basePower: 38,
  targets: "all-enemies",
  unlockLevel: 10,
  description: "Massive thunderstorm engulfs battlefield.",
  chainDamage: true,
  aiHints: { priority: 2.8, target: "random", avoidOverkill: false }
};
const ELECTRIC_OVERLOAD = {
  id: "electric-overload",
  name: "Electric Overload",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 4,
  basePower: 20,
  targets: "all-enemies",
  unlockLevel: 11,
  description: "Multiple lightning strikes hit all enemies.",
  hitCount: 2,
  aiHints: { priority: 2.8, target: "random", avoidOverkill: false }
};
const STORM_SHIELD = {
  id: "storm-shield",
  name: "Storm Shield",
  type: "buff",
  element: "Jupiter",
  manaCost: 3,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 12,
  description: "Wind barrier protects and speeds party.",
  shieldCharges: 2,
  buffEffect: { spd: 6 },
  duration: 3,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const BOLT_BARRAGE = {
  id: "bolt-barrage",
  name: "Bolt Barrage",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 5,
  basePower: 18,
  targets: "all-enemies",
  unlockLevel: 13,
  description: "Barrage of lightning bolts.",
  hitCount: 3,
  chainDamage: true,
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const HURRICANE_FORCE = {
  id: "hurricane-force",
  name: "Hurricane Force",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 5,
  basePower: 45,
  targets: "all-enemies",
  unlockLevel: 14,
  description: "Hurricane winds devastate enemies.",
  splashDamagePercent: 1,
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const THOR_HAMMER = {
  id: "thor-hammer",
  name: "Thor's Hammer",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 5,
  basePower: 50,
  targets: "single-enemy",
  unlockLevel: 15,
  description: "Call down Thor's hammer with massive force.",
  ignoreDefensePercent: 0.4,
  splashDamagePercent: 0.5,
  aiHints: { priority: 3, target: "weakest", avoidOverkill: false }
};
const LIGHTNING_SANCTUARY = {
  id: "lightning-sanctuary",
  name: "Lightning Sanctuary",
  type: "buff",
  element: "Jupiter",
  manaCost: 4,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 16,
  description: "Electric field protects party.",
  grantImmunity: { all: false, types: ["paralyze", "stun"], duration: 3 },
  duration: 4,
  aiHints: { priority: 2.8, target: "random", opener: true }
};
const APOCALYPTIC_STORM = {
  id: "apocalyptic-storm",
  name: "Apocalyptic Storm",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 5,
  basePower: 55,
  targets: "all-enemies",
  unlockLevel: 17,
  description: "Ultimate storm devastates all.",
  chainDamage: true,
  splashDamagePercent: 1,
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const GOD_THUNDER = {
  id: "god-thunder",
  name: "God Thunder",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 5,
  basePower: 25,
  targets: "all-enemies",
  unlockLevel: 18,
  description: "Divine thunder strikes repeatedly.",
  hitCount: 4,
  chainDamage: true,
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const WORLD_STORM = {
  id: "world-storm",
  name: "World Storm",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 5,
  basePower: 60,
  targets: "all-enemies",
  unlockLevel: 19,
  description: "Storm that engulfs the world.",
  chainDamage: true,
  splashDamagePercent: 1,
  statusEffect: { type: "paralyze", duration: 2, chance: 0.6 },
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const TEMPEST_TYRANT = {
  id: "tempest-tyrant",
  name: "Tempest Tyrant",
  type: "psynergy",
  element: "Jupiter",
  manaCost: 5,
  basePower: 70,
  targets: "all-enemies",
  unlockLevel: 20,
  description: "Become the tyrant of storms, obliterating all.",
  hitCount: 2,
  chainDamage: true,
  splashDamagePercent: 1,
  statusEffect: { type: "stun", duration: 2, chance: 0.7 },
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const FLAME_BLADE = {
  id: "flame-blade",
  name: "Flame Blade",
  type: "physical",
  element: "Mars",
  manaCost: 1,
  basePower: 20,
  targets: "single-enemy",
  unlockLevel: 4,
  description: "Fire-imbued blade strike.",
  aiHints: { priority: 2, target: "weakest", avoidOverkill: false }
};
const BATTLE_CRY = {
  id: "battle-cry",
  name: "Battle Cry",
  type: "buff",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 5,
  description: "Roar increases ATK significantly.",
  buffEffect: { atk: 10 },
  duration: 3,
  aiHints: { priority: 2, target: "random", opener: true }
};
const INFERNO_STRIKE = {
  id: "inferno-strike",
  name: "Inferno Strike",
  type: "physical",
  element: "Mars",
  manaCost: 2,
  basePower: 16,
  targets: "single-enemy",
  unlockLevel: 6,
  description: "Rapid fire strikes.",
  hitCount: 2,
  aiHints: { priority: 2, target: "weakest", avoidOverkill: false }
};
const PYROBLAST = {
  id: "pyroblast",
  name: "Pyroblast",
  type: "psynergy",
  element: "Mars",
  manaCost: 3,
  basePower: 35,
  targets: "single-enemy",
  unlockLevel: 7,
  description: "Concentrated fire blast.",
  aiHints: { priority: 2.5, target: "weakest", avoidOverkill: false }
};
const WARRIOR_FLAME = {
  id: "warrior-flame",
  name: "Warrior's Flame",
  type: "buff",
  element: "Mars",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 8,
  description: "Inner fire enhances combat prowess.",
  buffEffect: { atk: 8, mag: 8 },
  duration: 3,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const MOLTEN_SLASH = {
  id: "molten-slash",
  name: "Molten Slash",
  type: "physical",
  element: "Mars",
  manaCost: 2,
  basePower: 28,
  targets: "single-enemy",
  unlockLevel: 9,
  description: "Superheated blade melts through defenses.",
  ignoreDefensePercent: 0.3,
  statusEffect: { type: "burn", duration: 2, chance: 0.4 },
  aiHints: { priority: 2.5, target: "highestDef", avoidOverkill: false }
};
const FIRE_NOVA = {
  id: "fire-nova",
  name: "Fire Nova",
  type: "psynergy",
  element: "Mars",
  manaCost: 4,
  basePower: 30,
  targets: "all-enemies",
  unlockLevel: 10,
  description: "Explosive nova hits all enemies.",
  aiHints: { priority: 2.8, target: "random", avoidOverkill: false }
};
const BLAZING_ASSAULT = {
  id: "blazing-assault",
  name: "Blazing Assault",
  type: "physical",
  element: "Mars",
  manaCost: 3,
  basePower: 18,
  targets: "single-enemy",
  unlockLevel: 11,
  description: "Relentless flaming assault.",
  hitCount: 3,
  aiHints: { priority: 2.8, target: "weakest", avoidOverkill: false }
};
const MAGMA_WAVE = {
  id: "magma-wave",
  name: "Magma Wave",
  type: "psynergy",
  element: "Mars",
  manaCost: 4,
  basePower: 40,
  targets: "all-enemies",
  unlockLevel: 12,
  description: "Wave of magma burns all.",
  statusEffect: { type: "burn", duration: 2, chance: 0.5 },
  aiHints: { priority: 2.8, target: "random", avoidOverkill: false }
};
const BERSERKER_RAGE = {
  id: "berserker-rage",
  name: "Berserker Rage",
  type: "buff",
  manaCost: 3,
  basePower: 0,
  targets: "self",
  unlockLevel: 13,
  description: "Enter berserker state.",
  buffEffect: { atk: 15, spd: 10 },
  damageReductionPercent: 0.15,
  duration: 3,
  aiHints: { priority: 2.8, target: "random", opener: true }
};
const CRIMSON_FURY = {
  id: "crimson-fury",
  name: "Crimson Fury",
  type: "physical",
  element: "Mars",
  manaCost: 4,
  basePower: 20,
  targets: "single-enemy",
  unlockLevel: 14,
  description: "Fury unleashed in multiple strikes.",
  hitCount: 4,
  aiHints: { priority: 2.8, target: "weakest", avoidOverkill: false }
};
const METEOR_CRASH = {
  id: "meteor-crash",
  name: "Meteor Crash",
  type: "psynergy",
  element: "Mars",
  manaCost: 5,
  basePower: 55,
  targets: "single-enemy",
  unlockLevel: 15,
  description: "Call down burning meteor.",
  ignoreDefensePercent: 0.4,
  splashDamagePercent: 0.4,
  aiHints: { priority: 3, target: "weakest", avoidOverkill: false }
};
const PHOENIX_AURA = {
  id: "phoenix-aura",
  name: "Phoenix Aura",
  type: "buff",
  element: "Mars",
  manaCost: 4,
  basePower: 0,
  targets: "self",
  unlockLevel: 16,
  description: "Channel phoenix power.",
  buffEffect: { atk: 12, mag: 12, def: 8 },
  healOverTime: { amount: 12, duration: 3 },
  aiHints: { priority: 3, target: "random", opener: true }
};
const SOLAR_FLARE = {
  id: "solar-flare",
  name: "Solar Flare",
  type: "psynergy",
  element: "Mars",
  manaCost: 5,
  basePower: 50,
  targets: "all-enemies",
  unlockLevel: 17,
  description: "Solar flare burns all enemies.",
  statusEffect: { type: "burn", duration: 3, chance: 0.8 },
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const ULTIMATE_WARRIOR = {
  id: "ultimate-warrior",
  name: "Ultimate Warrior",
  type: "buff",
  manaCost: 5,
  basePower: 0,
  targets: "self",
  unlockLevel: 18,
  description: "Reach peak warrior form.",
  buffEffect: { atk: 18, def: 10, spd: 12 },
  damageReductionPercent: 0.25,
  duration: 4,
  aiHints: { priority: 3, target: "random", opener: true }
};
const INFERNO_BARRAGE = {
  id: "inferno-barrage",
  name: "Inferno Barrage",
  type: "physical",
  element: "Mars",
  manaCost: 5,
  basePower: 22,
  targets: "all-enemies",
  unlockLevel: 19,
  description: "Barrage of flaming strikes hits all.",
  hitCount: 3,
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const SUPERNOVA_STRIKE = {
  id: "supernova-strike",
  name: "Supernova Strike",
  type: "physical",
  element: "Mars",
  manaCost: 5,
  basePower: 65,
  targets: "all-enemies",
  unlockLevel: 20,
  description: "Channel a supernova into devastating strike.",
  hitCount: 2,
  ignoreDefensePercent: 0.5,
  splashDamagePercent: 1,
  statusEffect: { type: "burn", duration: 3, chance: 1 },
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const FROST_SHIELD = {
  id: "frost-shield",
  name: "Frost Shield",
  type: "buff",
  element: "Mercury",
  manaCost: 2,
  basePower: 0,
  targets: "single-ally",
  unlockLevel: 5,
  description: "Ice barrier protects ally.",
  shieldCharges: 2,
  duration: 3,
  aiHints: { priority: 2, target: "random", opener: true }
};
const PURIFY = {
  id: "purify",
  name: "Purify",
  type: "healing",
  element: "Mercury",
  manaCost: 2,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 6,
  description: "Cleanse party of poison and burn.",
  removeStatusEffects: { type: "byType", statuses: ["poison", "burn"] },
  aiHints: { priority: 2.5, target: "healerFirst", avoidOverkill: false }
};
const ICE_SPEAR = {
  id: "ice-spear",
  name: "Ice Spear",
  type: "psynergy",
  element: "Mercury",
  manaCost: 3,
  basePower: 35,
  targets: "single-enemy",
  unlockLevel: 7,
  description: "Sharp spear of ice pierces target.",
  aiHints: { priority: 2.5, target: "weakest", avoidOverkill: false }
};
const SCHOLAR_WISDOM = {
  id: "scholar-wisdom",
  name: "Scholar's Wisdom",
  type: "buff",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 8,
  description: "Channel scholarly knowledge.",
  buffEffect: { mag: 12 },
  duration: 3,
  aiHints: { priority: 2, target: "random", opener: true }
};
const GLACIAL_WAVE = {
  id: "glacial-wave",
  name: "Glacial Wave",
  type: "psynergy",
  element: "Mercury",
  manaCost: 4,
  basePower: 32,
  targets: "all-enemies",
  unlockLevel: 9,
  description: "Freezing wave hits all enemies.",
  aiHints: { priority: 2.8, target: "random", avoidOverkill: false }
};
const RENEWAL = {
  id: "renewal",
  name: "Renewal",
  type: "healing",
  element: "Mercury",
  manaCost: 3,
  basePower: 25,
  targets: "all-allies",
  unlockLevel: 10,
  description: "Renewing waters grant regeneration.",
  healOverTime: { amount: 10, duration: 3 },
  aiHints: { priority: 2.5, target: "healerFirst", avoidOverkill: false }
};
const FROZEN_SPIKES = {
  id: "frozen-spikes",
  name: "Frozen Spikes",
  type: "psynergy",
  element: "Mercury",
  manaCost: 4,
  basePower: 20,
  targets: "single-enemy",
  unlockLevel: 11,
  description: "Multiple ice spikes pierce target.",
  hitCount: 3,
  aiHints: { priority: 2.8, target: "weakest", avoidOverkill: false }
};
const CRYSTAL_BARRIER = {
  id: "crystal-barrier",
  name: "Crystal Barrier",
  type: "buff",
  element: "Mercury",
  manaCost: 3,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 12,
  description: "Crystal barrier protects entire party.",
  shieldCharges: 2,
  buffEffect: { def: 6 },
  duration: 3,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const ICE_STORM = {
  id: "ice-storm",
  name: "Ice Storm",
  type: "psynergy",
  element: "Mercury",
  manaCost: 5,
  basePower: 45,
  targets: "all-enemies",
  unlockLevel: 13,
  description: "Devastating ice storm.",
  statusEffect: { type: "freeze", duration: 2, chance: 0.5 },
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const MASS_RESTORATION = {
  id: "mass-restoration",
  name: "Mass Restoration",
  type: "healing",
  element: "Mercury",
  manaCost: 5,
  basePower: 60,
  targets: "all-allies",
  unlockLevel: 14,
  description: "Complete party restoration.",
  removeStatusEffects: { type: "negative" },
  aiHints: { priority: 3, target: "healerFirst", avoidOverkill: false }
};
const FROZEN_TOMB_KARIS = {
  id: "frozen-tomb-karis",
  name: "Frozen Tomb",
  type: "psynergy",
  element: "Mercury",
  manaCost: 4,
  basePower: 35,
  targets: "single-enemy",
  unlockLevel: 15,
  description: "Trap enemy in ice for extended time.",
  statusEffect: { type: "freeze", duration: 4, chance: 0.9 },
  aiHints: { priority: 2.8, target: "weakest", avoidOverkill: false }
};
const SCHOLAR_SANCTUARY = {
  id: "scholar-sanctuary",
  name: "Scholar's Sanctuary",
  type: "buff",
  element: "Mercury",
  manaCost: 4,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 16,
  description: "Create protective sanctuary.",
  buffEffect: { mag: 8, def: 8 },
  grantImmunity: { all: false, types: ["freeze", "stun"], duration: 2 },
  duration: 3,
  aiHints: { priority: 3, target: "random", opener: true }
};
const BLIZZARD_CASCADE = {
  id: "blizzard-cascade",
  name: "Blizzard Cascade",
  type: "psynergy",
  element: "Mercury",
  manaCost: 5,
  basePower: 55,
  targets: "all-enemies",
  unlockLevel: 17,
  description: "Cascading blizzard overwhelms enemies.",
  chainDamage: true,
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const DIVINE_RENEWAL = {
  id: "divine-renewal",
  name: "Divine Renewal",
  type: "healing",
  element: "Mercury",
  manaCost: 5,
  basePower: 80,
  targets: "all-allies",
  unlockLevel: 18,
  description: "Divine healing restores party.",
  healOverTime: { amount: 15, duration: 3 },
  removeStatusEffects: { type: "all" },
  aiHints: { priority: 3, target: "healerFirst", avoidOverkill: false }
};
const ABSOLUTE_ZERO_KARIS = {
  id: "absolute-zero-karis",
  name: "Absolute Zero",
  type: "psynergy",
  element: "Mercury",
  manaCost: 5,
  basePower: 65,
  targets: "all-enemies",
  unlockLevel: 19,
  description: "Ultimate freeze at absolute zero.",
  statusEffect: { type: "freeze", duration: 3, chance: 0.8 },
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const AQUA_RESURRECTION = {
  id: "aqua-resurrection",
  name: "Aqua Resurrection",
  type: "healing",
  element: "Mercury",
  manaCost: 5,
  basePower: 100,
  targets: "all-allies",
  unlockLevel: 20,
  description: "Channel ocean's power for complete resurrection.",
  revive: true,
  reviveHPPercent: 0.8,
  removeStatusEffects: { type: "all" },
  healOverTime: { amount: 20, duration: 4 },
  aiHints: { priority: 3, target: "healerFirst", avoidOverkill: false }
};
const RAPID_STRIKES = {
  id: "rapid-strikes",
  name: "Rapid Strikes",
  type: "physical",
  manaCost: 0,
  basePower: 10,
  targets: "single-enemy",
  unlockLevel: 5,
  description: "Lightning-fast triple strike.",
  hitCount: 3,
  aiHints: { priority: 2, target: "weakest", avoidOverkill: false }
};
const FLAME_JAB = {
  id: "flame-jab",
  name: "Flame Jab",
  type: "physical",
  element: "Mars",
  manaCost: 1,
  basePower: 18,
  targets: "single-enemy",
  unlockLevel: 6,
  description: "Precise fire-imbued jab.",
  aiHints: { priority: 2, target: "weakest", avoidOverkill: false }
};
const ASSASSINATE = {
  id: "assassinate",
  name: "Assassinate",
  type: "physical",
  manaCost: 2,
  basePower: 30,
  targets: "single-enemy",
  unlockLevel: 7,
  description: "Precise strike targeting vital points.",
  ignoreDefensePercent: 0.4,
  aiHints: { priority: 2.5, target: "weakest", avoidOverkill: false }
};
const COMBAT_FOCUS = {
  id: "combat-focus",
  name: "Combat Focus",
  type: "buff",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 8,
  description: "Focus increases damage output.",
  buffEffect: { atk: 12, spd: 8 },
  duration: 3,
  aiHints: { priority: 2, target: "random", opener: true }
};
const FLURRY = {
  id: "flurry",
  name: "Flurry",
  type: "physical",
  element: "Mars",
  manaCost: 2,
  basePower: 14,
  targets: "single-enemy",
  unlockLevel: 9,
  description: "Rapid flurry of burning strikes.",
  hitCount: 4,
  aiHints: { priority: 2.5, target: "weakest", avoidOverkill: false }
};
const INFERNO_ASSAULT = {
  id: "inferno-assault",
  name: "Inferno Assault",
  type: "psynergy",
  element: "Mars",
  manaCost: 3,
  basePower: 40,
  targets: "single-enemy",
  unlockLevel: 10,
  description: "Concentrated fire assault.",
  aiHints: { priority: 2.8, target: "weakest", avoidOverkill: false }
};
const PRECISION_STRIKE = {
  id: "precision-strike",
  name: "Precision Strike",
  type: "physical",
  manaCost: 2,
  basePower: 35,
  targets: "single-enemy",
  unlockLevel: 11,
  description: "Perfect strike ignoring armor.",
  ignoreDefensePercent: 0.5,
  aiHints: { priority: 2.8, target: "highestDef", avoidOverkill: false }
};
const BLOOD_RUSH = {
  id: "blood-rush",
  name: "Blood Rush",
  type: "buff",
  manaCost: 3,
  basePower: 0,
  targets: "self",
  unlockLevel: 12,
  description: "Adrenaline rush maximizes offense.",
  buffEffect: { atk: 15, spd: 12 },
  duration: 3,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const DEATH_STRIKE = {
  id: "death-strike",
  name: "Death Strike",
  type: "physical",
  manaCost: 3,
  basePower: 18,
  targets: "single-enemy",
  unlockLevel: 13,
  description: "Deadly combination of strikes.",
  hitCount: 5,
  aiHints: { priority: 2.8, target: "weakest", avoidOverkill: false }
};
const FLAME_TORNADO = {
  id: "flame-tornado",
  name: "Flame Tornado",
  type: "psynergy",
  element: "Mars",
  manaCost: 4,
  basePower: 45,
  targets: "single-enemy",
  unlockLevel: 14,
  description: "Spinning tornado of flames.",
  ignoreDefensePercent: 0.3,
  aiHints: { priority: 2.8, target: "weakest", avoidOverkill: false }
};
const PERFECT_FORM = {
  id: "perfect-form",
  name: "Perfect Form",
  type: "buff",
  manaCost: 4,
  basePower: 0,
  targets: "self",
  unlockLevel: 15,
  description: "Reach perfect combat form.",
  buffEffect: { atk: 18, spd: 15 },
  duration: 4,
  aiHints: { priority: 3, target: "random", opener: true }
};
const OBLITERATE = {
  id: "obliterate",
  name: "Obliterate",
  type: "physical",
  element: "Mars",
  manaCost: 4,
  basePower: 55,
  targets: "single-enemy",
  unlockLevel: 16,
  description: "Overwhelming force obliterates target.",
  ignoreDefensePercent: 0.6,
  aiHints: { priority: 3, target: "weakest", avoidOverkill: false }
};
const UNSTOPPABLE_FORCE = {
  id: "unstoppable-force",
  name: "Unstoppable Force",
  type: "physical",
  manaCost: 4,
  basePower: 20,
  targets: "single-enemy",
  unlockLevel: 17,
  description: "Unstoppable barrage of strikes.",
  hitCount: 6,
  aiHints: { priority: 3, target: "weakest", avoidOverkill: false }
};
const SUPREME_FOCUS = {
  id: "supreme-focus",
  name: "Supreme Focus",
  type: "buff",
  manaCost: 5,
  basePower: 0,
  targets: "self",
  unlockLevel: 18,
  description: "Achieve supreme combat focus.",
  buffEffect: { atk: 20, spd: 18, mag: 10 },
  damageReductionPercent: 0.2,
  duration: 4,
  aiHints: { priority: 3, target: "random", opener: true }
};
const ANNIHILATION = {
  id: "annihilation",
  name: "Annihilation",
  type: "physical",
  element: "Mars",
  manaCost: 5,
  basePower: 70,
  targets: "single-enemy",
  unlockLevel: 19,
  description: "Pure destructive force.",
  ignoreDefensePercent: 0.7,
  aiHints: { priority: 3, target: "weakest", avoidOverkill: false }
};
const ONE_THOUSAND_CUTS = {
  id: "one-thousand-cuts",
  name: "One Thousand Cuts",
  type: "physical",
  element: "Mars",
  manaCost: 5,
  basePower: 25,
  targets: "single-enemy",
  unlockLevel: 20,
  description: "Legendary technique striking multiple times at blinding speed.",
  hitCount: 8,
  ignoreDefensePercent: 0.5,
  statusEffect: { type: "burn", duration: 3, chance: 1 },
  aiHints: { priority: 3, target: "weakest", avoidOverkill: false }
};
const EARTH_STRIKE = {
  id: "earth-strike",
  name: "Earth Strike",
  type: "physical",
  element: "Venus",
  manaCost: 1,
  basePower: 22,
  targets: "single-enemy",
  unlockLevel: 5,
  description: "Earth-empowered strike.",
  aiHints: { priority: 2, target: "weakest", avoidOverkill: false }
};
const WARRIOR_RESOLVE = {
  id: "warrior-resolve",
  name: "Warrior's Resolve",
  type: "buff",
  manaCost: 2,
  basePower: 0,
  targets: "self",
  unlockLevel: 6,
  description: "Strengthen resolve for battle.",
  buffEffect: { atk: 10, def: 8 },
  duration: 3,
  aiHints: { priority: 2, target: "random", opener: true }
};
const SUNDER_ARMOR = {
  id: "sunder-armor",
  name: "Sunder Armor",
  type: "physical",
  element: "Venus",
  manaCost: 2,
  basePower: 25,
  targets: "single-enemy",
  unlockLevel: 7,
  description: "Shatter enemy armor.",
  debuffEffect: { def: -10 },
  duration: 3,
  aiHints: { priority: 2.5, target: "highestDef", avoidOverkill: false }
};
const STONE_FIST = {
  id: "stone-fist",
  name: "Stone Fist",
  type: "physical",
  element: "Venus",
  manaCost: 2,
  basePower: 16,
  targets: "single-enemy",
  unlockLevel: 8,
  description: "Hardened fists strike twice.",
  hitCount: 2,
  aiHints: { priority: 2, target: "weakest", avoidOverkill: false }
};
const EARTH_SHAKER = {
  id: "earth-shaker",
  name: "Earth Shaker",
  type: "psynergy",
  element: "Venus",
  manaCost: 4,
  basePower: 38,
  targets: "all-enemies",
  unlockLevel: 9,
  description: "Massive earthquake shakes battlefield.",
  aiHints: { priority: 2.8, target: "random", avoidOverkill: false }
};
const BATTLE_MASTER = {
  id: "battle-master",
  name: "Battle Master",
  type: "buff",
  manaCost: 3,
  basePower: 0,
  targets: "self",
  unlockLevel: 10,
  description: "Channel years of experience.",
  buffEffect: { atk: 12, def: 10, spd: 8 },
  duration: 3,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const CRUSHING_IMPACT = {
  id: "crushing-impact",
  name: "Crushing Impact",
  type: "physical",
  element: "Venus",
  manaCost: 3,
  basePower: 40,
  targets: "single-enemy",
  unlockLevel: 11,
  description: "Devastating impact crushes defenses.",
  ignoreDefensePercent: 0.4,
  aiHints: { priority: 2.8, target: "highestDef", avoidOverkill: false }
};
const MOUNTAIN_STRENGTH = {
  id: "mountain-strength",
  name: "Mountain's Strength",
  type: "buff",
  element: "Venus",
  manaCost: 3,
  basePower: 0,
  targets: "self",
  unlockLevel: 12,
  description: "Channel the mountain's strength.",
  buffEffect: { atk: 15, def: 12 },
  damageReductionPercent: 0.2,
  duration: 4,
  aiHints: { priority: 2.5, target: "random", opener: true }
};
const RAGNAROK_STRIKE = {
  id: "ragnarok-strike",
  name: "Ragnarok Strike",
  type: "physical",
  element: "Venus",
  manaCost: 4,
  basePower: 50,
  targets: "single-enemy",
  unlockLevel: 13,
  description: "Legendary strike of massive power.",
  ignoreDefensePercent: 0.5,
  aiHints: { priority: 2.8, target: "weakest", avoidOverkill: false }
};
const TERRA_SHIELD = {
  id: "terra-shield",
  name: "Terra Shield",
  type: "buff",
  element: "Venus",
  manaCost: 4,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 14,
  description: "Earth's protection shields party.",
  buffEffect: { def: 10 },
  shieldCharges: 3,
  duration: 3,
  aiHints: { priority: 2.8, target: "random", opener: true }
};
const GRAND_IMPACT = {
  id: "grand-impact",
  name: "Grand Impact",
  type: "physical",
  element: "Venus",
  manaCost: 4,
  basePower: 25,
  targets: "single-enemy",
  unlockLevel: 15,
  description: "Multiple earth-shattering strikes.",
  hitCount: 3,
  aiHints: { priority: 3, target: "weakest", avoidOverkill: false }
};
const LEGENDARY_WARRIOR = {
  id: "legendary-warrior",
  name: "Legendary Warrior",
  type: "buff",
  manaCost: 5,
  basePower: 0,
  targets: "self",
  unlockLevel: 16,
  description: "Achieve legendary status.",
  buffEffect: { atk: 18, def: 15 },
  damageReductionPercent: 0.3,
  duration: 4,
  aiHints: { priority: 3, target: "random", opener: true }
};
const TITAN_FALL = {
  id: "titan-fall",
  name: "Titan Fall",
  type: "physical",
  element: "Venus",
  manaCost: 5,
  basePower: 60,
  targets: "single-enemy",
  unlockLevel: 17,
  description: "Fall upon enemy with titan's force.",
  ignoreDefensePercent: 0.6,
  splashDamagePercent: 0.4,
  aiHints: { priority: 3, target: "weakest", avoidOverkill: false }
};
const EARTH_JUDGMENT = {
  id: "earth-judgment",
  name: "Earth's Judgment",
  type: "psynergy",
  element: "Venus",
  manaCost: 5,
  basePower: 55,
  targets: "all-enemies",
  unlockLevel: 18,
  description: "Earth judges all enemies.",
  splashDamagePercent: 1,
  aiHints: { priority: 3, target: "random", avoidOverkill: false }
};
const MASTER_AURA = {
  id: "master-aura",
  name: "Master's Aura",
  type: "buff",
  manaCost: 5,
  basePower: 0,
  targets: "all-allies",
  unlockLevel: 19,
  description: "Share master's aura with party.",
  buffEffect: { atk: 12, def: 12, spd: 10 },
  duration: 4,
  aiHints: { priority: 3, target: "random", opener: true }
};
const GAIA_BLADE = {
  id: "gaia-blade",
  name: "Gaia Blade",
  type: "physical",
  element: "Venus",
  manaCost: 5,
  basePower: 75,
  targets: "single-enemy",
  unlockLevel: 20,
  description: "Channel Gaia's full power into ultimate strike.",
  hitCount: 2,
  ignoreDefensePercent: 0.7,
  splashDamagePercent: 0.6,
  debuffEffect: { def: -15, atk: -10 },
  duration: 3,
  aiHints: { priority: 3, target: "weakest", avoidOverkill: false }
};
const ABILITIES = {
  // Physical
  strike: STRIKE,
  attack: STRIKE,
  "heavy-strike": HEAVY_STRIKE,
  "guard-break": GUARD_BREAK,
  "precise-jab": PRECISE_JAB,
  "poison-strike": POISON_STRIKE,
  // Psynergy
  fireball: FIREBALL,
  "ice-shard": ICE_SHARD,
  quake: QUAKE,
  gust: GUST,
  "chain-lightning": CHAIN_LIGHTNING,
  "burn-touch": BURN_TOUCH,
  "freeze-blast": FREEZE_BLAST,
  "paralyze-shock": PARALYZE_SHOCK,
  // Healing
  heal: HEAL,
  "party-heal": PARTY_HEAL,
  // Buffs
  "boost-atk": BOOST_ATK,
  "boost-def": BOOST_DEF,
  // Debuffs
  "weaken-def": WEAKEN_DEF,
  blind: BLIND,
  // VS1 Demo
  flare: FLARE,
  cure: CURE,
  guard: GUARD,
  "earth-spike": EARTH_SPIKE,
  "fire-burst": FIRE_BURST,
  // Equipment Abilities (20 Total)
  "wooden-strike": WOODEN_STRIKE,
  "bronze-slash": BRONZE_SLASH,
  "iron-bulwark": IRON_BULWARK,
  "arcane-bolt": ARCANE_BOLT,
  "iron-thrust": IRON_THRUST,
  "steel-focus": STEEL_FOCUS,
  "steel-ward": STEEL_WARD,
  "axe-cleave": AXE_CLEAVE,
  "iron-mind": IRON_MIND,
  "silver-shield": SILVER_SHIELD,
  "mythril-wisdom": MYTHRIL_WISDOM,
  "hyper-speed": HYPER_SPEED,
  "mythril-edge": MYTHRIL_EDGE,
  "dragon-ward": DRAGON_WARD,
  "oracle-vision": ORACLE_VISION,
  // Choice Equipment Abilities
  "steel-slash": STEEL_SLASH,
  "crystal-blast": CRYSTAL_BLAST,
  "silver-strike": SILVER_STRIKE,
  "great-cleave": GREAT_CLEAVE,
  "zodiac-bolt": ZODIAC_BOLT,
  // Equipment-Specific Abilities (Tower & Elemental Equipment)
  "storm-slash": STORM_SLASH,
  "frost-strike": FROST_STRIKE,
  "volcanic-smash": VOLCANIC_SMASH,
  "storm-mastery": STORM_MASTERY,
  "frost-mastery": FROST_MASTERY,
  "mythril-cleave": MYTHRIL_CLEAVE,
  "mythril-surge": MYTHRIL_SURGE,
  "mythril-pierce": MYTHRIL_PIERCE,
  "mythril-strike": MYTHRIL_STRIKE,
  "earth-wall": EARTH_WALL,
  "gaia-fortitude": GAIA_FORTITUDE,
  "flame-burst": FLAME_BURST,
  "inferno-fist": INFERNO_FIST,
  "frost-nova": FROST_NOVA,
  "lightning-shot": LIGHTNING_SHOT,
  "storm-focus": STORM_FOCUS,
  "astral-strike": ASTRAL_STRIKE,
  "shadowflame": SHADOWFLAME,
  // Balanced Ability Sets
  "earth-spike-damage": EARTH_SPIKE_DAMAGE,
  "stone-skin": STONE_SKIN_UTILITY,
  "flame-burst-damage": FLAME_BURST_DAMAGE,
  "fire-ward": FIRE_WARD_UTILITY,
  "ice-lance-damage": ICE_LANCE_DAMAGE,
  "aqua-heal": AQUA_HEAL_UTILITY,
  "gale-force-damage": GALE_FORCE_DAMAGE,
  "wind-barrier": WIND_BARRIER_UTILITY,
  "focus-strike-neutral": FOCUS_STRIKE_NEUTRAL,
  // Level Progression Abilities (145 new)
  // Adept
  "fortify": FORTIFY,
  "tremor": TREMOR,
  "guardian-stance": GUARDIAN_STANCE,
  "rock-breaker": ROCK_BREAKER,
  "earthquake": EARTHQUAKE,
  "stone-wall": STONE_WALL,
  "unbreakable": UNBREAKABLE,
  "titan-grip": TITAN_GRIP,
  "gaia-shield": GAIA_SHIELD,
  "petrify-strike": PETRIFY_STRIKE,
  "mountain-endurance": MOUNTAIN_ENDURANCE,
  "landslide": LANDSLIDE,
  "earth-blessing": EARTH_BLESSING,
  "gaia-rebirth": GAIA_REBIRTH,
  // War Mage
  "ignite": IGNITE,
  "flame-wall": FLAME_WALL,
  "inferno-slash": INFERNO_SLASH,
  "blazing-fury": BLAZING_FURY,
  "pyroclasm": PYROCLASM,
  "fire-aura": FIRE_AURA,
  "meteor-strike": METEOR_STRIKE,
  "phoenix-flames": PHOENIX_FLAMES,
  "magma-burst": MAGMA_BURST,
  "flame-shield": FLAME_SHIELD,
  "supernova": SUPERNOVA,
  "infernal-rage": INFERNAL_RAGE,
  "dragon-breath": DRAGON_BREATH,
  "ragnarok-flames": RAGNAROK_FLAMES,
  // Mystic
  "cleanse": CLEANSE,
  "frost-wave": FROST_WAVE,
  "regen": REGEN,
  "diamond-dust": DIAMOND_DUST,
  "mass-regen": MASS_REGEN,
  "glacial-shield": GLACIAL_SHIELD,
  "deep-freeze": DEEP_FREEZE,
  "sanctuary": SANCTUARY,
  "blizzard": BLIZZARD,
  "restoration": RESTORATION,
  "frozen-tomb": FROZEN_TOMB,
  "aqua-barrier": AQUA_BARRIER,
  "absolute-zero": ABSOLUTE_ZERO,
  "leviathan-grace": LEVIATHAN_GRACE,
  // Ranger
  "swift-strike": SWIFT_STRIKE,
  "shock-bolt": SHOCK_BOLT,
  "tempest": TEMPEST,
  "hurricane-slash": HURRICANE_SLASH,
  "plasma-shot": PLASMA_SHOT,
  "cyclone": CYCLONE,
  "thunder-god-fury": THUNDER_GOD_FURY,
  "storm-blessing": STORM_BLESSING,
  "judgment-bolt": JUDGMENT_BOLT,
  "static-field": STATIC_FIELD,
  "wind-walker": WIND_WALKER,
  "maelstrom": MAELSTROM,
  "zeus-wrath": ZEUS_WRATH,
  "storm-sovereign": STORM_SOVEREIGN,
  // Sentinel
  "taunt": TAUNT,
  "shield-bash": SHIELD_BASH,
  "iron-wall": IRON_WALL,
  "counter-stance": COUNTER_STANCE,
  "tremor-strike": TREMOR_STRIKE,
  "fortified-guard": FORTIFIED_GUARD,
  "bulwark": BULWARK,
  "crushing-blow": CRUSHING_BLOW,
  "earthen-armor": EARTHEN_ARMOR,
  "shockwave": SHOCKWAVE,
  "guardian-resolve": GUARDIAN_RESOLVE,
  "titan-grip-sentinel": TITAN_GRIP_SENTINEL,
  "stone-fortress": STONE_FORTRESS,
  "avalanche": AVALANCHE,
  "immortal-bulwark": IMMORTAL_BULWARK,
  "earth-splitter": EARTH_SPLITTER,
  "atlas-stand": ATLAS_STAND,
  // Stormcaller
  "thunder-clap": THUNDER_CLAP,
  "storm-call": STORM_CALL,
  "static-charge": STATIC_CHARGE,
  "lightning-arc": LIGHTNING_ARC,
  "shock-pulse": SHOCK_PULSE,
  "wind-mastery": WIND_MASTERY,
  "thunder-storm": THUNDER_STORM,
  "electric-overload": ELECTRIC_OVERLOAD,
  "storm-shield": STORM_SHIELD,
  "bolt-barrage": BOLT_BARRAGE,
  "hurricane-force": HURRICANE_FORCE,
  "thor-hammer": THOR_HAMMER,
  "lightning-sanctuary": LIGHTNING_SANCTUARY,
  "apocalyptic-storm": APOCALYPTIC_STORM,
  "god-thunder": GOD_THUNDER,
  "world-storm": WORLD_STORM,
  "tempest-tyrant": TEMPEST_TYRANT,
  // Blaze
  "flame-blade": FLAME_BLADE,
  "battle-cry": BATTLE_CRY,
  "inferno-strike": INFERNO_STRIKE,
  "pyroblast": PYROBLAST,
  "warrior-flame": WARRIOR_FLAME,
  "molten-slash": MOLTEN_SLASH,
  "fire-nova": FIRE_NOVA,
  "blazing-assault": BLAZING_ASSAULT,
  "magma-wave": MAGMA_WAVE,
  "berserker-rage": BERSERKER_RAGE,
  "crimson-fury": CRIMSON_FURY,
  "meteor-crash": METEOR_CRASH,
  "phoenix-aura": PHOENIX_AURA,
  "solar-flare": SOLAR_FLARE,
  "ultimate-warrior": ULTIMATE_WARRIOR,
  "inferno-barrage": INFERNO_BARRAGE,
  "supernova-strike": SUPERNOVA_STRIKE,
  // Karis
  "frost-shield": FROST_SHIELD,
  "purify": PURIFY,
  "ice-spear": ICE_SPEAR,
  "scholar-wisdom": SCHOLAR_WISDOM,
  "glacial-wave": GLACIAL_WAVE,
  "renewal": RENEWAL,
  "frozen-spikes": FROZEN_SPIKES,
  "crystal-barrier": CRYSTAL_BARRIER,
  "ice-storm": ICE_STORM,
  "mass-restoration": MASS_RESTORATION,
  "frozen-tomb-karis": FROZEN_TOMB_KARIS,
  "scholar-sanctuary": SCHOLAR_SANCTUARY,
  "blizzard-cascade": BLIZZARD_CASCADE,
  "divine-renewal": DIVINE_RENEWAL,
  "absolute-zero-karis": ABSOLUTE_ZERO_KARIS,
  "aqua-resurrection": AQUA_RESURRECTION,
  // Tyrell
  "rapid-strikes": RAPID_STRIKES,
  "flame-jab": FLAME_JAB,
  "assassinate": ASSASSINATE,
  "combat-focus": COMBAT_FOCUS,
  "flurry": FLURRY,
  "inferno-assault": INFERNO_ASSAULT,
  "precision-strike": PRECISION_STRIKE,
  "blood-rush": BLOOD_RUSH,
  "death-strike": DEATH_STRIKE,
  "flame-tornado": FLAME_TORNADO,
  "perfect-form": PERFECT_FORM,
  "obliterate": OBLITERATE,
  "unstoppable-force": UNSTOPPABLE_FORCE,
  "supreme-focus": SUPREME_FOCUS,
  "annihilation": ANNIHILATION,
  "one-thousand-cuts": ONE_THOUSAND_CUTS,
  // Felix
  "earth-strike": EARTH_STRIKE,
  "warrior-resolve": WARRIOR_RESOLVE,
  "sunder-armor": SUNDER_ARMOR,
  "stone-fist": STONE_FIST,
  "earth-shaker": EARTH_SHAKER,
  "battle-master": BATTLE_MASTER,
  "crushing-impact": CRUSHING_IMPACT,
  "mountain-strength": MOUNTAIN_STRENGTH,
  "ragnarok-strike": RAGNAROK_STRIKE,
  "terra-shield": TERRA_SHIELD,
  "grand-impact": GRAND_IMPACT,
  "legendary-warrior": LEGENDARY_WARRIOR,
  "titan-fall": TITAN_FALL,
  "earth-judgment": EARTH_JUDGMENT,
  "master-aura": MASTER_AURA,
  "gaia-blade": GAIA_BLADE
};
export {
  ABILITIES,
  ABSOLUTE_ZERO,
  ABSOLUTE_ZERO_KARIS,
  ANNIHILATION,
  APOCALYPTIC_STORM,
  AQUA_BARRIER,
  AQUA_HEAL_UTILITY,
  AQUA_RESURRECTION,
  ARCANE_BOLT,
  ASSASSINATE,
  ASTRAL_STRIKE,
  ATLAS_STAND,
  AVALANCHE,
  AXE_CLEAVE,
  BATTLE_CRY,
  BATTLE_MASTER,
  BERSERKER_RAGE,
  BLAZING_ASSAULT,
  BLAZING_FURY,
  BLIND,
  BLIZZARD,
  BLIZZARD_CASCADE,
  BLOOD_RUSH,
  BOLT_BARRAGE,
  BOOST_ATK,
  BOOST_DEF,
  BRONZE_SLASH,
  BULWARK,
  BURN_TOUCH,
  CHAIN_LIGHTNING,
  CLEANSE,
  COMBAT_FOCUS,
  COUNTER_STANCE,
  CRIMSON_FURY,
  CRUSHING_BLOW,
  CRUSHING_IMPACT,
  CRYSTAL_BARRIER,
  CRYSTAL_BLAST,
  CURE,
  CYCLONE,
  DEATH_STRIKE,
  DEEP_FREEZE,
  DIAMOND_DUST,
  DIVINE_RENEWAL,
  DRAGON_BREATH,
  DRAGON_WARD,
  EARTHEN_ARMOR,
  EARTHQUAKE,
  EARTH_BLESSING,
  EARTH_JUDGMENT,
  EARTH_SHAKER,
  EARTH_SPIKE,
  EARTH_SPIKE_DAMAGE,
  EARTH_SPLITTER,
  EARTH_STRIKE,
  EARTH_WALL,
  ELECTRIC_OVERLOAD,
  FIREBALL,
  FIRE_AURA,
  FIRE_BURST,
  FIRE_NOVA,
  FIRE_WARD_UTILITY,
  FLAME_BLADE,
  FLAME_BURST,
  FLAME_BURST_DAMAGE,
  FLAME_JAB,
  FLAME_SHIELD,
  FLAME_TORNADO,
  FLAME_WALL,
  FLARE,
  FLURRY,
  FOCUS_STRIKE_NEUTRAL,
  FORTIFIED_GUARD,
  FORTIFY,
  FREEZE_BLAST,
  FROST_MASTERY,
  FROST_NOVA,
  FROST_SHIELD,
  FROST_STRIKE,
  FROST_WAVE,
  FROZEN_SPIKES,
  FROZEN_TOMB,
  FROZEN_TOMB_KARIS,
  GAIA_BLADE,
  GAIA_FORTITUDE,
  GAIA_REBIRTH,
  GAIA_SHIELD,
  GALE_FORCE_DAMAGE,
  GLACIAL_SHIELD,
  GLACIAL_WAVE,
  GOD_THUNDER,
  GRAND_IMPACT,
  GREAT_CLEAVE,
  GUARD,
  GUARDIAN_RESOLVE,
  GUARDIAN_STANCE,
  GUARD_BREAK,
  GUST,
  HEAL,
  HEAVY_STRIKE,
  HURRICANE_FORCE,
  HURRICANE_SLASH,
  HYPER_SPEED,
  ICE_LANCE_DAMAGE,
  ICE_SHARD,
  ICE_SPEAR,
  ICE_STORM,
  IGNITE,
  IMMORTAL_BULWARK,
  INFERNAL_RAGE,
  INFERNO_ASSAULT,
  INFERNO_BARRAGE,
  INFERNO_FIST,
  INFERNO_SLASH,
  INFERNO_STRIKE,
  IRON_BULWARK,
  IRON_MIND,
  IRON_THRUST,
  IRON_WALL,
  JUDGMENT_BOLT,
  LANDSLIDE,
  LEGENDARY_WARRIOR,
  LEVIATHAN_GRACE,
  LIGHTNING_ARC,
  LIGHTNING_SANCTUARY,
  LIGHTNING_SHOT,
  MAELSTROM,
  MAGMA_BURST,
  MAGMA_WAVE,
  MASS_REGEN,
  MASS_RESTORATION,
  MASTER_AURA,
  METEOR_CRASH,
  METEOR_STRIKE,
  MOLTEN_SLASH,
  MOUNTAIN_ENDURANCE,
  MOUNTAIN_STRENGTH,
  MYTHRIL_CLEAVE,
  MYTHRIL_EDGE,
  MYTHRIL_PIERCE,
  MYTHRIL_STRIKE,
  MYTHRIL_SURGE,
  MYTHRIL_WISDOM,
  OBLITERATE,
  ONE_THOUSAND_CUTS,
  ORACLE_VISION,
  PARALYZE_SHOCK,
  PARTY_HEAL,
  PERFECT_FORM,
  PETRIFY_STRIKE,
  PHOENIX_AURA,
  PHOENIX_FLAMES,
  PLASMA_SHOT,
  POISON_STRIKE,
  PRECISE_JAB,
  PRECISION_STRIKE,
  PURIFY,
  PYROBLAST,
  PYROCLASM,
  QUAKE,
  RAGNAROK_FLAMES,
  RAGNAROK_STRIKE,
  RAPID_STRIKES,
  REGEN,
  RENEWAL,
  RESTORATION,
  ROCK_BREAKER,
  SANCTUARY,
  SCHOLAR_SANCTUARY,
  SCHOLAR_WISDOM,
  SHADOWFLAME,
  SHIELD_BASH,
  SHOCKWAVE,
  SHOCK_BOLT,
  SHOCK_PULSE,
  SILVER_SHIELD,
  SILVER_STRIKE,
  SOLAR_FLARE,
  STATIC_CHARGE,
  STATIC_FIELD,
  STEEL_FOCUS,
  STEEL_SLASH,
  STEEL_WARD,
  STONE_FIST,
  STONE_FORTRESS,
  STONE_SKIN_UTILITY,
  STONE_WALL,
  STORM_BLESSING,
  STORM_CALL,
  STORM_FOCUS,
  STORM_MASTERY,
  STORM_SHIELD,
  STORM_SLASH,
  STORM_SOVEREIGN,
  STRIKE,
  SUNDER_ARMOR,
  SUPERNOVA,
  SUPERNOVA_STRIKE,
  SUPREME_FOCUS,
  SWIFT_STRIKE,
  TAUNT,
  TEMPEST,
  TEMPEST_TYRANT,
  TERRA_SHIELD,
  THOR_HAMMER,
  THUNDER_CLAP,
  THUNDER_GOD_FURY,
  THUNDER_STORM,
  TITAN_FALL,
  TITAN_GRIP,
  TITAN_GRIP_SENTINEL,
  TREMOR,
  TREMOR_STRIKE,
  ULTIMATE_WARRIOR,
  UNBREAKABLE,
  UNSTOPPABLE_FORCE,
  VOLCANIC_SMASH,
  WARRIOR_FLAME,
  WARRIOR_RESOLVE,
  WEAKEN_DEF,
  WIND_BARRIER_UTILITY,
  WIND_MASTERY,
  WIND_WALKER,
  WOODEN_STRIKE,
  WORLD_STORM,
  ZEUS_WRATH,
  ZODIAC_BOLT
};
//# sourceMappingURL=abilities-BqKwRqMm.js.map
