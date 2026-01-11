"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WAR_GLOVES = exports.ADEPTS_RING = exports.GUARDIAN_RING = exports.POWER_RING = exports.HERMES_SANDALS = exports.QUICK_BOOTS = exports.HYPER_BOOTS = exports.SILVER_GREAVES = exports.STEEL_GREAVES = exports.IRON_BOOTS = exports.LEATHER_BOOTS = exports.GLORY_HELM = exports.ORACLES_CROWN = exports.MYTHRIL_CROWN = exports.SILVER_CIRCLET = exports.STEEL_HELM = exports.IRON_HELM = exports.BRONZE_HELM = exports.CLOTH_CAP = exports.LEATHER_CAP = exports.VALKYRIE_MAIL = exports.DRAGON_SCALES = exports.MYTHRIL_ARMOR = exports.SILVER_ARMOR = exports.STEEL_ARMOR = exports.IRON_ARMOR = exports.BRONZE_ARMOR = exports.LEATHER_VEST = exports.COTTON_SHIRT = exports.STAFF_OF_AGES = exports.ZODIAC_WAND = exports.CRYSTAL_ROD = exports.SHAMAN_ROD = exports.MAGIC_ROD = exports.WOODEN_STAFF = exports.DEMON_MACE = exports.HEAVY_MACE = exports.MACE = exports.TITANS_AXE = exports.GREAT_AXE = exports.BATTLE_AXE = exports.WOODEN_AXE = exports.SOL_BLADE = exports.GAIA_BLADE = exports.MYTHRIL_BLADE = exports.SILVER_BLADE = exports.STEEL_SWORD = exports.IRON_SWORD = exports.BRONZE_SWORD = exports.WOODEN_SWORD = void 0;
exports.EQUIPMENT = exports.AETHERIC_MANTLE = exports.SHADOWFLAME_STAFF = exports.ASTRAL_BLADE = exports.STORM_CIRCLET = exports.THUNDERBOLT_BOW = exports.GLACIAL_ROBES = exports.FROST_SCEPTER = exports.INFERNO_GAUNTLETS = exports.FLAME_BRANDED_AXE = exports.GAIA_HELM = exports.EARTH_WARDEN_SHIELD = exports.MYTHRIL_GAUNTLETS = exports.MYTHRIL_GREAVES = exports.MYTHRIL_LANCE = exports.MYTHRIL_STAFF = exports.MYTHRIL_AXE = exports.TOWER_MASTERS_MEDALLION = exports.TOWER_CHAMPIONS_RING = exports.TIDAL_TREADS = exports.WINDSTRIDER_BOOTS = exports.VOLCANIC_VISOR = exports.FROSTQUEEN_TIARA = exports.STORMKING_CROWN = exports.INFERNO_PLATE = exports.GLACIER_MAIL = exports.TEMPEST_ARMOR = exports.GAIA_GREATSHIELD = exports.VOLCANIC_HAMMER = exports.FROST_REAVER = exports.STORM_CLEAVER = exports.ECLIPSE_BLADE = exports.COSMOS_SHIELD = exports.IRIS_ROBE = exports.CLERIC_RING = exports.DRAGONS_EYE = exports.ELEMENTAL_STAR = exports.LUCKY_MEDAL = exports.SPIRIT_GLOVES = void 0;
// ========================================
// WEAPONS - SWORDS (Venus + Jupiter Warriors)
// ========================================
exports.WOODEN_SWORD = {
    id: 'wooden-sword',
    name: 'Wooden Sword',
    slot: 'weapon',
    tier: 'basic',
    cost: 50,
    statBonus: { atk: 5 },
    allowedElements: ['Venus', 'Jupiter'], // Adept, Sentinel, Ranger
    unlocksAbility: 'wooden-strike',
};
exports.BRONZE_SWORD = {
    id: 'bronze-sword',
    name: 'Bronze Sword',
    slot: 'weapon',
    tier: 'bronze',
    cost: 120,
    statBonus: { atk: 9 },
    allowedElements: ['Venus'], // Adept, Sentinel
    unlocksAbility: 'bronze-slash',
};
exports.IRON_SWORD = {
    id: 'iron-sword',
    name: 'Iron Sword',
    slot: 'weapon',
    tier: 'iron',
    cost: 200,
    statBonus: { atk: 14 },
    allowedElements: ['Venus'], // Adept, Sentinel
    unlocksAbility: 'iron-thrust',
};
exports.STEEL_SWORD = {
    id: 'steel-sword',
    name: 'Steel Sword',
    slot: 'weapon',
    tier: 'steel',
    cost: 500,
    statBonus: { atk: 22 },
    allowedElements: ['Venus'], // Adept, Sentinel
    unlocksAbility: 'steel-slash',
};
exports.SILVER_BLADE = {
    id: 'silver-blade',
    name: 'Silver Blade',
    slot: 'weapon',
    tier: 'silver',
    cost: 1200,
    statBonus: { atk: 32 },
    allowedElements: ['Venus'], // Adept, Sentinel
    unlocksAbility: 'silver-strike',
};
exports.MYTHRIL_BLADE = {
    id: 'mythril-blade',
    name: 'Mythril Blade',
    slot: 'weapon',
    tier: 'mythril',
    cost: 3000,
    statBonus: { atk: 45 },
    allowedElements: ['Venus'], // Adept, Sentinel
    unlocksAbility: 'mythril-edge',
};
exports.GAIA_BLADE = {
    id: 'gaia-blade',
    name: 'Gaia Blade',
    slot: 'weapon',
    tier: 'legendary',
    cost: 7500,
    statBonus: { atk: 58 },
    allowedElements: ['Venus'], // Adept, Sentinel
    unlocksAbility: 'mythril-edge', // Reuse mythril-edge for legendary tier
};
exports.SOL_BLADE = {
    id: 'sol-blade',
    name: 'Sol Blade',
    slot: 'weapon',
    tier: 'artifact',
    cost: 15000,
    statBonus: { atk: 72 },
    allowedElements: ['Venus'], // Adept, Sentinel
    unlocksAbility: 'mythril-edge', // Reuse mythril-edge for artifact tier
};
// ========================================
// WEAPONS - AXES (Mars Only)
// ========================================
exports.WOODEN_AXE = {
    id: 'wooden-axe',
    name: 'Wooden Axe',
    slot: 'weapon',
    tier: 'basic',
    cost: 60,
    statBonus: { atk: 7, spd: -1 },
    allowedElements: ['Mars'], // War Mage
};
exports.BATTLE_AXE = {
    id: 'battle-axe',
    name: 'Battle Axe',
    slot: 'weapon',
    tier: 'iron',
    cost: 280,
    statBonus: { atk: 18, spd: -2 },
    allowedElements: ['Mars'], // War Mage
    unlocksAbility: 'axe-cleave',
};
exports.GREAT_AXE = {
    id: 'great-axe',
    name: 'Great Axe',
    slot: 'weapon',
    tier: 'steel',
    cost: 800,
    statBonus: { atk: 30, spd: -3 },
    allowedElements: ['Mars'], // War Mage
    unlocksAbility: 'great-cleave',
};
exports.TITANS_AXE = {
    id: 'titans-axe',
    name: "Titan's Axe",
    slot: 'weapon',
    tier: 'legendary',
    cost: 9000,
    statBonus: { atk: 65, def: 10, spd: -2 },
    allowedElements: ['Mars'], // War Mage
    unlocksAbility: 'great-cleave', // Reuse great-cleave for legendary tier
};
// ========================================
// WEAPONS - MACES (Mars Only)
// ========================================
exports.MACE = {
    id: 'mace',
    name: 'Mace',
    slot: 'weapon',
    tier: 'bronze',
    cost: 150,
    statBonus: { atk: 11, def: 2 },
    allowedElements: ['Mars'], // War Mage
};
exports.HEAVY_MACE = {
    id: 'heavy-mace',
    name: 'Heavy Mace',
    slot: 'weapon',
    tier: 'steel',
    cost: 650,
    statBonus: { atk: 26, def: 5 },
    allowedElements: ['Mars'], // War Mage
};
exports.DEMON_MACE = {
    id: 'demon-mace',
    name: 'Demon Mace',
    slot: 'weapon',
    tier: 'mythril',
    cost: 3500,
    statBonus: { atk: 48, def: 8 },
    allowedElements: ['Mars'], // War Mage
};
// ========================================
// WEAPONS - STAVES (Mercury + Jupiter Mages)
// ========================================
exports.WOODEN_STAFF = {
    id: 'wooden-staff',
    name: 'Wooden Staff',
    slot: 'weapon',
    tier: 'basic',
    cost: 40,
    statBonus: { atk: 3, mag: 4 },
    allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller
};
exports.MAGIC_ROD = {
    id: 'magic-rod',
    name: 'Magic Rod',
    slot: 'weapon',
    tier: 'bronze',
    cost: 180,
    statBonus: { atk: 6, mag: 8 },
    allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller
    unlocksAbility: 'arcane-bolt',
};
exports.SHAMAN_ROD = {
    id: 'shaman-rod',
    name: 'Shaman Rod',
    slot: 'weapon',
    tier: 'iron',
    cost: 400,
    statBonus: { atk: 10, mag: 14 },
    allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller
};
exports.CRYSTAL_ROD = {
    id: 'crystal-rod',
    name: 'Crystal Rod',
    slot: 'weapon',
    tier: 'silver',
    cost: 1500,
    statBonus: { atk: 18, mag: 24 },
    allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller
    unlocksAbility: 'crystal-blast',
};
exports.ZODIAC_WAND = {
    id: 'zodiac-wand',
    name: 'Zodiac Wand',
    slot: 'weapon',
    tier: 'mythril',
    cost: 4000,
    statBonus: { atk: 28, mag: 38 },
    allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller
    unlocksAbility: 'zodiac-bolt',
};
exports.STAFF_OF_AGES = {
    id: 'staff-of-ages',
    name: 'Staff of Ages',
    slot: 'weapon',
    tier: 'artifact',
    cost: 18000,
    statBonus: { atk: 42, mag: 58, pp: 25 },
    allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller
    unlocksAbility: 'zodiac-bolt', // Reuse zodiac-bolt for artifact tier
};
// ========================================
// ARMOR
// ========================================
exports.COTTON_SHIRT = {
    id: 'cotton-shirt',
    name: 'Cotton Shirt',
    slot: 'armor',
    tier: 'basic',
    cost: 30,
    statBonus: { def: 3, hp: 5 },
    allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller - light mage armor
};
exports.LEATHER_VEST = {
    id: 'leather-vest',
    name: 'Leather Vest',
    slot: 'armor',
    tier: 'basic',
    cost: 80,
    statBonus: { def: 6, hp: 10 },
    allowedElements: ['Venus', 'Mars', 'Jupiter'], // Adept, Sentinel, War Mage, Ranger - medium armor
};
exports.BRONZE_ARMOR = {
    id: 'bronze-armor',
    name: 'Bronze Armor',
    slot: 'armor',
    tier: 'bronze',
    cost: 200,
    statBonus: { def: 10, hp: 15 },
    allowedElements: ['Venus'], // Adept, Sentinel - heavy armor
};
exports.IRON_ARMOR = {
    id: 'iron-armor',
    name: 'Iron Armor',
    slot: 'armor',
    tier: 'iron',
    cost: 350,
    statBonus: { def: 15, hp: 25 },
    allowedElements: ['Venus', 'Mars'], // Adept, Sentinel, War Mage - heavy/medium armor
    unlocksAbility: 'iron-bulwark',
};
exports.STEEL_ARMOR = {
    id: 'steel-armor',
    name: 'Steel Armor',
    slot: 'armor',
    tier: 'steel',
    cost: 800,
    statBonus: { def: 24, hp: 40 },
    allowedElements: ['Venus'], // Adept, Sentinel - heavy armor
    unlocksAbility: 'steel-ward',
};
exports.SILVER_ARMOR = {
    id: 'silver-armor',
    name: 'Silver Armor',
    slot: 'armor',
    tier: 'silver',
    cost: 2000,
    statBonus: { def: 35, hp: 60 },
    allowedElements: ['Venus'], // Adept, Sentinel - heavy armor
    unlocksAbility: 'silver-shield',
};
exports.MYTHRIL_ARMOR = {
    id: 'mythril-armor',
    name: 'Mythril Armor',
    slot: 'armor',
    tier: 'mythril',
    cost: 5000,
    statBonus: { def: 48, hp: 85 },
    allowedElements: ['Venus'], // Adept, Sentinel - heavy armor
    unlocksAbility: 'steel-ward', // Reuse steel-ward for mythril tier
};
exports.DRAGON_SCALES = {
    id: 'dragon-scales',
    name: 'Dragon Scales',
    slot: 'armor',
    tier: 'legendary',
    cost: 10000,
    statBonus: { def: 62, hp: 110 },
    allowedElements: ['Venus'], // Adept, Sentinel - legendary heavy armor
    unlocksAbility: 'dragon-ward',
};
exports.VALKYRIE_MAIL = {
    id: 'valkyrie-mail',
    name: 'Valkyrie Mail',
    slot: 'armor',
    tier: 'artifact',
    cost: 20000,
    statBonus: { def: 78, hp: 140 },
    allowedElements: ['Venus'], // Adept, Sentinel - artifact heavy armor
};
// ========================================
// HELMS
// ========================================
exports.LEATHER_CAP = {
    id: 'leather-cap',
    name: 'Leather Cap',
    slot: 'helm',
    tier: 'basic',
    cost: 25,
    statBonus: { def: 2 },
    allowedElements: ['Venus', 'Mars', 'Jupiter'], // Adept, Sentinel, War Mage, Ranger - medium helms
};
exports.CLOTH_CAP = {
    id: 'cloth-cap',
    name: 'Cloth Cap',
    slot: 'helm',
    tier: 'basic',
    cost: 60,
    statBonus: { def: 4 },
    allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller - light mage helms
};
exports.BRONZE_HELM = {
    id: 'bronze-helm',
    name: 'Bronze Helm',
    slot: 'helm',
    tier: 'bronze',
    cost: 140,
    statBonus: { def: 6 },
    allowedElements: ['Venus', 'Mars'], // Adept, Sentinel, War Mage - heavy helms
};
exports.IRON_HELM = {
    id: 'iron-helm',
    name: 'Iron Helm',
    slot: 'helm',
    tier: 'iron',
    cost: 220,
    statBonus: { def: 9 },
    allowedElements: ['Venus'], // Adept, Sentinel - heavy helms
    unlocksAbility: 'iron-mind',
};
exports.STEEL_HELM = {
    id: 'steel-helm',
    name: 'Steel Helm',
    slot: 'helm',
    tier: 'steel',
    cost: 500,
    statBonus: { def: 14 },
    allowedElements: ['Venus'], // Adept, Sentinel - heavy helms
    unlocksAbility: 'steel-focus',
};
exports.SILVER_CIRCLET = {
    id: 'silver-circlet',
    name: 'Silver Circlet',
    slot: 'helm',
    tier: 'silver',
    cost: 1300,
    statBonus: { def: 20, mag: 5 },
    allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller - mage circlets
};
exports.MYTHRIL_CROWN = {
    id: 'mythril-crown',
    name: 'Mythril Crown',
    slot: 'helm',
    tier: 'mythril',
    cost: 3200,
    statBonus: { def: 28, mag: 8 },
    allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller - mage crowns
    unlocksAbility: 'mythril-wisdom',
};
exports.ORACLES_CROWN = {
    id: 'oracles-crown',
    name: "Oracle's Crown",
    slot: 'helm',
    tier: 'legendary',
    cost: 8000,
    statBonus: { def: 38, mag: 14, pp: 20 },
    allowedElements: ['Jupiter'], // Stormcaller - specialized Jupiter crown
    unlocksAbility: 'oracle-vision',
};
exports.GLORY_HELM = {
    id: 'glory-helm',
    name: 'Glory Helm',
    slot: 'helm',
    tier: 'artifact',
    cost: 16000,
    statBonus: { def: 50, mag: 18, pp: 30 },
    allowedElements: ['Venus'], // Adept, Sentinel - artifact heavy helm
};
// ========================================
// BOOTS
// ========================================
exports.LEATHER_BOOTS = {
    id: 'leather-boots',
    name: 'Leather Boots',
    slot: 'boots',
    tier: 'basic',
    cost: 70,
    statBonus: { spd: 2 },
    allowedElements: ['Venus', 'Mars', 'Jupiter'], // Adept, Sentinel, War Mage, Ranger - medium boots
};
exports.IRON_BOOTS = {
    id: 'iron-boots',
    name: 'Iron Boots',
    slot: 'boots',
    tier: 'iron',
    cost: 150,
    statBonus: { spd: 3, def: 2 },
    allowedElements: ['Venus'], // Adept, Sentinel - heavy boots
};
exports.STEEL_GREAVES = {
    id: 'steel-greaves',
    name: 'Steel Greaves',
    slot: 'boots',
    tier: 'steel',
    cost: 400,
    statBonus: { spd: 5, def: 4 },
    allowedElements: ['Venus'], // Adept, Sentinel - heavy greaves
};
exports.SILVER_GREAVES = {
    id: 'silver-greaves',
    name: 'Silver Greaves',
    slot: 'boots',
    tier: 'silver',
    cost: 1100,
    statBonus: { spd: 7, def: 6 },
    allowedElements: ['Venus'], // Adept, Sentinel - heavy greaves
};
exports.HYPER_BOOTS = {
    id: 'hyper-boots',
    name: 'Hyper Boots',
    slot: 'boots',
    tier: 'mythril',
    cost: 2800,
    statBonus: { spd: 10, def: 8 },
    allowedElements: ['Jupiter'], // Ranger, Stormcaller - speed boots
    unlocksAbility: 'hyper-speed',
};
exports.QUICK_BOOTS = {
    id: 'quick-boots',
    name: 'Quick Boots',
    slot: 'boots',
    tier: 'legendary',
    cost: 6500,
    statBonus: { spd: 14, def: 10 },
    allowedElements: ['Jupiter'], // Ranger, Stormcaller - legendary speed boots
};
exports.HERMES_SANDALS = {
    id: 'hermes-sandals',
    name: "Hermes' Sandals",
    slot: 'boots',
    tier: 'artifact',
    cost: 14000,
    statBonus: { spd: 20, def: 12 },
    allowedElements: ['Jupiter'], // Ranger, Stormcaller - artifact speed boots
    alwaysFirstTurn: true,
};
// ========================================
// ACCESSORIES
// ========================================
exports.POWER_RING = {
    id: 'power-ring',
    name: 'Power Ring',
    slot: 'accessory',
    tier: 'basic',
    cost: 100,
    statBonus: { atk: 5 },
    allowedElements: ['Venus', 'Mars', 'Jupiter'], // Physical attackers - Adept, Sentinel, War Mage, Ranger
};
exports.GUARDIAN_RING = {
    id: 'guardian-ring',
    name: 'Guardian Ring',
    slot: 'accessory',
    tier: 'basic',
    cost: 120,
    statBonus: { def: 5 },
    allowedElements: ['Venus', 'Jupiter'], // Adept, Sentinel, Ranger - defensive ring
};
exports.ADEPTS_RING = {
    id: 'adepts-ring',
    name: "Adept's Ring",
    slot: 'accessory',
    tier: 'bronze',
    cost: 250,
    statBonus: { mag: 6, pp: 5 },
    allowedElements: ['Venus'], // Venus units - special ring (Adept focus but Sentinel can use too)
};
exports.WAR_GLOVES = {
    id: 'war-gloves',
    name: 'War Gloves',
    slot: 'accessory',
    tier: 'iron',
    cost: 400,
    statBonus: { atk: 10, def: 3 },
    allowedElements: ['Mars'], // War Mage - specialized Mars accessory
};
exports.SPIRIT_GLOVES = {
    id: 'spirit-gloves',
    name: 'Spirit Gloves',
    slot: 'accessory',
    tier: 'steel',
    cost: 900,
    statBonus: { mag: 12, pp: 10 },
    allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller - mage gloves
};
exports.LUCKY_MEDAL = {
    id: 'lucky-medal',
    name: 'Lucky Medal',
    slot: 'accessory',
    tier: 'silver',
    cost: 1800,
    statBonus: { spd: 5 },
    allowedElements: ['Jupiter'], // Jupiter units - speed-focused (Ranger focus but Stormcaller can use)
};
exports.ELEMENTAL_STAR = {
    id: 'elemental-star',
    name: 'Elemental Star',
    slot: 'accessory',
    tier: 'mythril',
    cost: 4500,
    statBonus: { mag: 18, pp: 20 },
    allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller - powerful mage accessory
    unlocksAbility: 'mythril-wisdom', // Reuse mythril-wisdom for mage accessory
};
exports.DRAGONS_EYE = {
    id: 'dragons-eye',
    name: "Dragon's Eye",
    slot: 'accessory',
    tier: 'legendary',
    cost: 8500,
    statBonus: { atk: 15, mag: 15, def: 10 },
    allowedElements: ['Venus', 'Jupiter'], // Adept, Sentinel, Ranger - hybrid accessory
};
exports.CLERIC_RING = {
    id: 'cleric-ring',
    name: 'Cleric Ring',
    slot: 'accessory',
    tier: 'legendary',
    cost: 9000,
    statBonus: { pp: 30, mag: 12 },
    allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller - healing ring
};
exports.IRIS_ROBE = {
    id: 'iris-robe',
    name: 'Iris Robe',
    slot: 'accessory',
    tier: 'artifact',
    cost: 12000,
    statBonus: { def: 20, mag: 20 },
    allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller - ultimate mage robe
};
exports.COSMOS_SHIELD = {
    id: 'cosmos-shield',
    name: 'Cosmos Shield',
    slot: 'accessory',
    tier: 'artifact',
    cost: 17000,
    statBonus: { def: 30, hp: 50 },
    allowedElements: ['Venus'], // Adept, Sentinel - ultimate tank accessory
    unlocksAbility: 'silver-shield', // Reuse silver-shield for artifact tier
};
exports.ECLIPSE_BLADE = {
    id: 'eclipse-blade',
    name: 'Eclipse Blade',
    slot: 'weapon',
    tier: 'artifact',
    cost: 0,
    statBonus: { atk: 80, mag: 15, spd: 5 },
    allowedElements: ['Venus', 'Mars'],
    unlocksAbility: 'mythril-edge',
    availableIn: ['tower'],
};
// ========================================
// TOWER-EXCLUSIVE EQUIPMENT (Floors 21-30)
// ========================================
// Tower Weapons - Mythril+ Tier
exports.STORM_CLEAVER = {
    id: 'storm-cleaver',
    name: 'Storm Cleaver',
    slot: 'weapon',
    tier: 'legendary',
    cost: 0, // Tower drop only
    statBonus: { atk: 55, mag: 20, spd: 8 },
    allowedElements: ['Jupiter'],
    unlocksAbility: 'storm-slash',
    availableIn: ['tower'],
};
exports.FROST_REAVER = {
    id: 'frost-reaver',
    name: 'Frost Reaver',
    slot: 'weapon',
    tier: 'legendary',
    cost: 0,
    statBonus: { atk: 52, mag: 25, def: 5 },
    allowedElements: ['Mercury'],
    unlocksAbility: 'frost-strike',
    availableIn: ['tower'],
};
exports.VOLCANIC_HAMMER = {
    id: 'volcanic-hammer',
    name: 'Volcanic Hammer',
    slot: 'weapon',
    tier: 'legendary',
    cost: 0,
    statBonus: { atk: 68, def: 15, spd: -3 },
    allowedElements: ['Mars'],
    unlocksAbility: 'volcanic-smash',
    availableIn: ['tower'],
};
exports.GAIA_GREATSHIELD = {
    id: 'gaia-greatshield',
    name: 'Gaia Greatshield',
    slot: 'accessory',
    tier: 'legendary',
    cost: 0,
    statBonus: { def: 45, hp: 80 },
    allowedElements: ['Venus'],
    availableIn: ['tower'],
};
// Tower Armor - Elemental Sets
exports.TEMPEST_ARMOR = {
    id: 'tempest-armor',
    name: 'Tempest Armor',
    slot: 'armor',
    tier: 'legendary',
    cost: 0,
    statBonus: { def: 55, spd: 12, mag: 10 },
    allowedElements: ['Jupiter'],
    availableIn: ['tower'],
};
exports.GLACIER_MAIL = {
    id: 'glacier-mail',
    name: 'Glacier Mail',
    slot: 'armor',
    tier: 'legendary',
    cost: 0,
    statBonus: { def: 58, hp: 75, mag: 8 },
    allowedElements: ['Mercury'],
    availableIn: ['tower'],
};
exports.INFERNO_PLATE = {
    id: 'inferno-plate',
    name: 'Inferno Plate',
    slot: 'armor',
    tier: 'legendary',
    cost: 0,
    statBonus: { def: 52, atk: 15, hp: 50 },
    allowedElements: ['Mars'],
    availableIn: ['tower'],
};
// Tower Helms - Element Crowns
exports.STORMKING_CROWN = {
    id: 'stormking-crown',
    name: 'Stormking Crown',
    slot: 'helm',
    tier: 'legendary',
    cost: 0,
    statBonus: { def: 42, mag: 20, pp: 25 },
    allowedElements: ['Jupiter'],
    unlocksAbility: 'storm-mastery',
    availableIn: ['tower'],
};
exports.FROSTQUEEN_TIARA = {
    id: 'frostqueen-tiara',
    name: 'Frostqueen Tiara',
    slot: 'helm',
    tier: 'legendary',
    cost: 0,
    statBonus: { def: 38, mag: 22, pp: 30 },
    allowedElements: ['Mercury'],
    unlocksAbility: 'frost-mastery',
    availableIn: ['tower'],
};
exports.VOLCANIC_VISOR = {
    id: 'volcanic-visor',
    name: 'Volcanic Visor',
    slot: 'helm',
    tier: 'legendary',
    cost: 0,
    statBonus: { def: 45, atk: 12, hp: 30 },
    allowedElements: ['Mars'],
    availableIn: ['tower'],
};
// Tower Boots - Speed Set
exports.WINDSTRIDER_BOOTS = {
    id: 'windstrider-boots',
    name: 'Windstrider Boots',
    slot: 'boots',
    tier: 'legendary',
    cost: 0,
    statBonus: { spd: 18, def: 15 },
    allowedElements: ['Jupiter'],
    alwaysFirstTurn: true,
    availableIn: ['tower'],
};
exports.TIDAL_TREADS = {
    id: 'tidal-treads',
    name: 'Tidal Treads',
    slot: 'boots',
    tier: 'legendary',
    cost: 0,
    statBonus: { spd: 12, def: 18, mag: 8 },
    allowedElements: ['Mercury'],
    availableIn: ['tower'],
};
// Tower Accessories - Milestone Rewards (Floor 25, 30)
exports.TOWER_CHAMPIONS_RING = {
    id: 'tower-champions-ring',
    name: "Tower Champion's Ring",
    slot: 'accessory',
    tier: 'artifact',
    cost: 0,
    statBonus: { atk: 20, def: 20, mag: 20, spd: 10 },
    allowedElements: ['Venus', 'Mars', 'Mercury', 'Jupiter'],
    availableIn: ['tower'],
};
exports.TOWER_MASTERS_MEDALLION = {
    id: 'tower-masters-medallion',
    name: "Tower Master's Medallion",
    slot: 'accessory',
    tier: 'artifact',
    cost: 0,
    statBonus: { atk: 25, def: 25, mag: 25, spd: 15, hp: 100, pp: 50 },
    allowedElements: ['Venus', 'Mars', 'Mercury', 'Jupiter'],
    availableIn: ['tower'],
};
// ========================================
// MYTHRIL TIER ITEMS (Late-game shop items)
// ========================================
// Mythril Weapons
exports.MYTHRIL_AXE = {
    id: 'mythril-axe',
    name: 'Mythril Axe',
    slot: 'weapon',
    tier: 'mythril',
    cost: 3200,
    statBonus: { atk: 46, spd: -2 },
    allowedElements: ['Mars'],
    unlocksAbility: 'mythril-cleave',
};
exports.MYTHRIL_STAFF = {
    id: 'mythril-staff',
    name: 'Mythril Staff',
    slot: 'weapon',
    tier: 'mythril',
    cost: 3800,
    statBonus: { atk: 26, mag: 36 },
    allowedElements: ['Mercury'],
    unlocksAbility: 'mythril-surge',
};
exports.MYTHRIL_LANCE = {
    id: 'mythril-lance',
    name: 'Mythril Lance',
    slot: 'weapon',
    tier: 'mythril',
    cost: 3100,
    statBonus: { atk: 42, spd: 3 },
    allowedElements: ['Jupiter'],
    unlocksAbility: 'mythril-pierce',
};
// Mythril Armor Pieces
exports.MYTHRIL_GREAVES = {
    id: 'mythril-greaves',
    name: 'Mythril Greaves',
    slot: 'boots',
    tier: 'mythril',
    cost: 2600,
    statBonus: { spd: 9, def: 10 },
    allowedElements: ['Venus', 'Mars'],
};
exports.MYTHRIL_GAUNTLETS = {
    id: 'mythril-gauntlets',
    name: 'Mythril Gauntlets',
    slot: 'accessory',
    tier: 'mythril',
    cost: 4200,
    statBonus: { atk: 16, def: 12 },
    allowedElements: ['Venus', 'Mars'],
    unlocksAbility: 'mythril-strike',
};
// ========================================
// ELEMENT-SPECIFIC GEAR (All 4 elements)
// ========================================
// Venus Element Gear
exports.EARTH_WARDEN_SHIELD = {
    id: 'earth-warden-shield',
    name: 'Earth Warden Shield',
    slot: 'accessory',
    tier: 'silver',
    cost: 1900,
    statBonus: { def: 18, hp: 40 },
    allowedElements: ['Venus'],
    unlocksAbility: 'earth-wall',
};
exports.GAIA_HELM = {
    id: 'gaia-helm',
    name: 'Gaia Helm',
    slot: 'helm',
    tier: 'mythril',
    cost: 3400,
    statBonus: { def: 30, hp: 25 },
    allowedElements: ['Venus'],
    unlocksAbility: 'gaia-fortitude',
};
// Mars Element Gear
exports.FLAME_BRANDED_AXE = {
    id: 'flame-branded-axe',
    name: 'Flame Branded Axe',
    slot: 'weapon',
    tier: 'silver',
    cost: 2200,
    statBonus: { atk: 38, mag: 8, spd: -1 },
    allowedElements: ['Mars'],
    unlocksAbility: 'flame-burst',
};
exports.INFERNO_GAUNTLETS = {
    id: 'inferno-gauntlets',
    name: 'Inferno Gauntlets',
    slot: 'accessory',
    tier: 'mythril',
    cost: 4000,
    statBonus: { atk: 18, mag: 10, def: 6 },
    allowedElements: ['Mars'],
    unlocksAbility: 'inferno-fist',
};
// Mercury Element Gear
exports.FROST_SCEPTER = {
    id: 'frost-scepter',
    name: 'Frost Scepter',
    slot: 'weapon',
    tier: 'silver',
    cost: 2100,
    statBonus: { atk: 20, mag: 28, pp: 10 },
    allowedElements: ['Mercury'],
    unlocksAbility: 'frost-nova',
};
exports.GLACIAL_ROBES = {
    id: 'glacial-robes',
    name: 'Glacial Robes',
    slot: 'armor',
    tier: 'mythril',
    cost: 4800,
    statBonus: { def: 40, mag: 15, hp: 60 },
    allowedElements: ['Mercury'],
};
// Jupiter Element Gear
exports.THUNDERBOLT_BOW = {
    id: 'thunderbolt-bow',
    name: 'Thunderbolt Bow',
    slot: 'weapon',
    tier: 'silver',
    cost: 2400,
    statBonus: { atk: 35, spd: 6, mag: 5 },
    allowedElements: ['Jupiter'],
    unlocksAbility: 'lightning-shot',
};
exports.STORM_CIRCLET = {
    id: 'storm-circlet',
    name: 'Storm Circlet',
    slot: 'helm',
    tier: 'mythril',
    cost: 3600,
    statBonus: { def: 26, mag: 12, spd: 4, pp: 15 },
    allowedElements: ['Jupiter'],
    unlocksAbility: 'storm-focus',
};
// ========================================
// ADDITIONAL TOWER-EXCLUSIVE ITEMS
// ========================================
exports.ASTRAL_BLADE = {
    id: 'astral-blade',
    name: 'Astral Blade',
    slot: 'weapon',
    tier: 'artifact',
    cost: 0,
    statBonus: { atk: 70, mag: 20, spd: 8, pp: 20 },
    allowedElements: ['Venus', 'Jupiter'],
    unlocksAbility: 'astral-strike',
    availableIn: ['tower'],
};
exports.SHADOWFLAME_STAFF = {
    id: 'shadowflame-staff',
    name: 'Shadowflame Staff',
    slot: 'weapon',
    tier: 'artifact',
    cost: 0,
    statBonus: { atk: 35, mag: 55, pp: 30 },
    allowedElements: ['Mars', 'Mercury'],
    unlocksAbility: 'shadowflame',
    availableIn: ['tower'],
};
exports.AETHERIC_MANTLE = {
    id: 'aetheric-mantle',
    name: 'Aetheric Mantle',
    slot: 'armor',
    tier: 'artifact',
    cost: 0,
    statBonus: { def: 70, mag: 25, hp: 120, pp: 40 },
    allowedElements: ['Mercury', 'Jupiter'],
    availableIn: ['tower'],
};
// ========================================
// EQUIPMENT REGISTRY
// ========================================
exports.EQUIPMENT = {
    // Swords
    'wooden-sword': exports.WOODEN_SWORD,
    'bronze-sword': exports.BRONZE_SWORD,
    'iron-sword': exports.IRON_SWORD,
    'steel-sword': exports.STEEL_SWORD,
    'silver-blade': exports.SILVER_BLADE,
    'mythril-blade': exports.MYTHRIL_BLADE,
    'gaia-blade': exports.GAIA_BLADE,
    'sol-blade': exports.SOL_BLADE,
    'eclipse-blade': exports.ECLIPSE_BLADE,
    // Axes
    'wooden-axe': exports.WOODEN_AXE,
    'battle-axe': exports.BATTLE_AXE,
    'great-axe': exports.GREAT_AXE,
    'titans-axe': exports.TITANS_AXE,
    // Maces
    'mace': exports.MACE,
    'heavy-mace': exports.HEAVY_MACE,
    'demon-mace': exports.DEMON_MACE,
    'mythril-axe': exports.MYTHRIL_AXE,
    // Staves
    'wooden-staff': exports.WOODEN_STAFF,
    'magic-rod': exports.MAGIC_ROD,
    'shaman-rod': exports.SHAMAN_ROD,
    'crystal-rod': exports.CRYSTAL_ROD,
    'zodiac-wand': exports.ZODIAC_WAND,
    'staff-of-ages': exports.STAFF_OF_AGES,
    'mythril-staff': exports.MYTHRIL_STAFF,
    'mythril-lance': exports.MYTHRIL_LANCE,
    // Armor
    'cotton-shirt': exports.COTTON_SHIRT,
    'leather-vest': exports.LEATHER_VEST,
    'bronze-armor': exports.BRONZE_ARMOR,
    'iron-armor': exports.IRON_ARMOR,
    'steel-armor': exports.STEEL_ARMOR,
    'silver-armor': exports.SILVER_ARMOR,
    'mythril-armor': exports.MYTHRIL_ARMOR,
    'dragon-scales': exports.DRAGON_SCALES,
    'valkyrie-mail': exports.VALKYRIE_MAIL,
    'glacial-robes': exports.GLACIAL_ROBES,
    // Helms
    'leather-cap': exports.LEATHER_CAP,
    'cloth-cap': exports.CLOTH_CAP,
    'bronze-helm': exports.BRONZE_HELM,
    'iron-helm': exports.IRON_HELM,
    'steel-helm': exports.STEEL_HELM,
    'silver-circlet': exports.SILVER_CIRCLET,
    'mythril-crown': exports.MYTHRIL_CROWN,
    'oracles-crown': exports.ORACLES_CROWN,
    'glory-helm': exports.GLORY_HELM,
    'gaia-helm': exports.GAIA_HELM,
    'storm-circlet': exports.STORM_CIRCLET,
    // Boots
    'leather-boots': exports.LEATHER_BOOTS,
    'iron-boots': exports.IRON_BOOTS,
    'steel-greaves': exports.STEEL_GREAVES,
    'silver-greaves': exports.SILVER_GREAVES,
    'hyper-boots': exports.HYPER_BOOTS,
    'quick-boots': exports.QUICK_BOOTS,
    'hermes-sandals': exports.HERMES_SANDALS,
    'mythril-greaves': exports.MYTHRIL_GREAVES,
    // Accessories
    'power-ring': exports.POWER_RING,
    'guardian-ring': exports.GUARDIAN_RING,
    'adepts-ring': exports.ADEPTS_RING,
    'war-gloves': exports.WAR_GLOVES,
    'spirit-gloves': exports.SPIRIT_GLOVES,
    'lucky-medal': exports.LUCKY_MEDAL,
    'elemental-star': exports.ELEMENTAL_STAR,
    'dragons-eye': exports.DRAGONS_EYE,
    'cleric-ring': exports.CLERIC_RING,
    'iris-robe': exports.IRIS_ROBE,
    'cosmos-shield': exports.COSMOS_SHIELD,
    'mythril-gauntlets': exports.MYTHRIL_GAUNTLETS,
    'earth-warden-shield': exports.EARTH_WARDEN_SHIELD,
    'inferno-gauntlets': exports.INFERNO_GAUNTLETS,
    // Element-specific weapons
    'flame-branded-axe': exports.FLAME_BRANDED_AXE,
    'frost-scepter': exports.FROST_SCEPTER,
    'thunderbolt-bow': exports.THUNDERBOLT_BOW,
    // Tower-exclusive items
    'storm-cleaver': exports.STORM_CLEAVER,
    'frost-reaver': exports.FROST_REAVER,
    'volcanic-hammer': exports.VOLCANIC_HAMMER,
    'gaia-greatshield': exports.GAIA_GREATSHIELD,
    'tempest-armor': exports.TEMPEST_ARMOR,
    'glacier-mail': exports.GLACIER_MAIL,
    'inferno-plate': exports.INFERNO_PLATE,
    'stormking-crown': exports.STORMKING_CROWN,
    'frostqueen-tiara': exports.FROSTQUEEN_TIARA,
    'volcanic-visor': exports.VOLCANIC_VISOR,
    'windstrider-boots': exports.WINDSTRIDER_BOOTS,
    'tidal-treads': exports.TIDAL_TREADS,
    'tower-champions-ring': exports.TOWER_CHAMPIONS_RING,
    'tower-masters-medallion': exports.TOWER_MASTERS_MEDALLION,
    'astral-blade': exports.ASTRAL_BLADE,
    'shadowflame-staff': exports.SHADOWFLAME_STAFF,
    'aetheric-mantle': exports.AETHERIC_MANTLE,
};
