/**
 * Comprehensive Equipment System
 * Based on Golden Sun progression: basic → bronze → iron → steel → silver → mythril → legendary → artifact
 * 
 * REFACTORED: Element-based equipment restrictions (not unit-specific)
 * - Venus units (Adept, Sentinel) share swords and heavy armor
 * - Mars units (War Mage) use axes/maces exclusively
 * - Mercury units (Mystic) use staves and light armor
 * - Jupiter units (Ranger, Stormcaller) use mixed weapons and light armor
 */
import type { Equipment } from '../schemas/EquipmentSchema';

// ========================================
// WEAPONS - SWORDS (Venus + Jupiter Warriors)
// ========================================
export const WOODEN_SWORD: Equipment = {
  id: 'wooden-sword',
  name: 'Wooden Sword',
  slot: 'weapon',
  tier: 'basic',
  cost: 50,
  statBonus: { atk: 5 },
  allowedElements: ['Venus', 'Jupiter'], // Adept, Sentinel, Ranger
  unlocksAbility: 'wooden-strike',
};

export const BRONZE_SWORD: Equipment = {
  id: 'bronze-sword',
  name: 'Bronze Sword',
  slot: 'weapon',
  tier: 'bronze',
  cost: 120,
  statBonus: { atk: 9 },
  allowedElements: ['Venus'], // Adept, Sentinel
  unlocksAbility: 'bronze-slash',
};

export const IRON_SWORD: Equipment = {
  id: 'iron-sword',
  name: 'Iron Sword',
  slot: 'weapon',
  tier: 'iron',
  cost: 200,
  statBonus: { atk: 14 },
  allowedElements: ['Venus'], // Adept, Sentinel
  unlocksAbility: 'iron-thrust',
};

export const STEEL_SWORD: Equipment = {
  id: 'steel-sword',
  name: 'Steel Sword',
  slot: 'weapon',
  tier: 'steel',
  cost: 500,
  statBonus: { atk: 22 },
  allowedElements: ['Venus'], // Adept, Sentinel
  unlocksAbility: 'steel-slash',
};

export const SILVER_BLADE: Equipment = {
  id: 'silver-blade',
  name: 'Silver Blade',
  slot: 'weapon',
  tier: 'silver',
  cost: 1200,
  statBonus: { atk: 32 },
  allowedElements: ['Venus'], // Adept, Sentinel
  unlocksAbility: 'silver-strike',
};

export const MYTHRIL_BLADE: Equipment = {
  id: 'mythril-blade',
  name: 'Mythril Blade',
  slot: 'weapon',
  tier: 'mythril',
  cost: 3000,
  statBonus: { atk: 45 },
  allowedElements: ['Venus'], // Adept, Sentinel
  unlocksAbility: 'mythril-edge',
};

export const GAIA_BLADE: Equipment = {
  id: 'gaia-blade',
  name: 'Gaia Blade',
  slot: 'weapon',
  tier: 'legendary',
  cost: 7500,
  statBonus: { atk: 58 },
  allowedElements: ['Venus'], // Adept, Sentinel
  unlocksAbility: 'mythril-edge', // Reuse mythril-edge for legendary tier
};

export const SOL_BLADE: Equipment = {
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
export const WOODEN_AXE: Equipment = {
  id: 'wooden-axe',
  name: 'Wooden Axe',
  slot: 'weapon',
  tier: 'basic',
  cost: 60,
  statBonus: { atk: 7, spd: -1 },
  allowedElements: ['Mars'], // War Mage
};

export const BATTLE_AXE: Equipment = {
  id: 'battle-axe',
  name: 'Battle Axe',
  slot: 'weapon',
  tier: 'iron',
  cost: 280,
  statBonus: { atk: 18, spd: -2 },
  allowedElements: ['Mars'], // War Mage
  unlocksAbility: 'axe-cleave',
};

export const GREAT_AXE: Equipment = {
  id: 'great-axe',
  name: 'Great Axe',
  slot: 'weapon',
  tier: 'steel',
  cost: 800,
  statBonus: { atk: 30, spd: -3 },
  allowedElements: ['Mars'], // War Mage
  unlocksAbility: 'great-cleave',
};

export const TITANS_AXE: Equipment = {
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
export const MACE: Equipment = {
  id: 'mace',
  name: 'Mace',
  slot: 'weapon',
  tier: 'bronze',
  cost: 150,
  statBonus: { atk: 11, def: 2 },
  allowedElements: ['Mars'], // War Mage
};

export const HEAVY_MACE: Equipment = {
  id: 'heavy-mace',
  name: 'Heavy Mace',
  slot: 'weapon',
  tier: 'steel',
  cost: 650,
  statBonus: { atk: 26, def: 5 },
  allowedElements: ['Mars'], // War Mage
};

export const DEMON_MACE: Equipment = {
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
export const WOODEN_STAFF: Equipment = {
  id: 'wooden-staff',
  name: 'Wooden Staff',
  slot: 'weapon',
  tier: 'basic',
  cost: 40,
  statBonus: { atk: 3, mag: 4 },
  allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller
};

export const MAGIC_ROD: Equipment = {
  id: 'magic-rod',
  name: 'Magic Rod',
  slot: 'weapon',
  tier: 'bronze',
  cost: 180,
  statBonus: { atk: 6, mag: 8 },
  allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller
  unlocksAbility: 'arcane-bolt',
};

export const SHAMAN_ROD: Equipment = {
  id: 'shaman-rod',
  name: 'Shaman Rod',
  slot: 'weapon',
  tier: 'iron',
  cost: 400,
  statBonus: { atk: 10, mag: 14 },
  allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller
};

export const CRYSTAL_ROD: Equipment = {
  id: 'crystal-rod',
  name: 'Crystal Rod',
  slot: 'weapon',
  tier: 'silver',
  cost: 1500,
  statBonus: { atk: 18, mag: 24 },
  allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller
  unlocksAbility: 'crystal-blast',
};

export const ZODIAC_WAND: Equipment = {
  id: 'zodiac-wand',
  name: 'Zodiac Wand',
  slot: 'weapon',
  tier: 'mythril',
  cost: 4000,
  statBonus: { atk: 28, mag: 38 },
  allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller
  unlocksAbility: 'zodiac-bolt',
};

export const STAFF_OF_AGES: Equipment = {
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
export const COTTON_SHIRT: Equipment = {
  id: 'cotton-shirt',
  name: 'Cotton Shirt',
  slot: 'armor',
  tier: 'basic',
  cost: 30,
  statBonus: { def: 3, hp: 5 },
  allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller - light mage armor
};

export const LEATHER_VEST: Equipment = {
  id: 'leather-vest',
  name: 'Leather Vest',
  slot: 'armor',
  tier: 'basic',
  cost: 80,
  statBonus: { def: 6, hp: 10 },
  allowedElements: ['Venus', 'Mars', 'Jupiter'], // Adept, Sentinel, War Mage, Ranger - medium armor
};

export const BRONZE_ARMOR: Equipment = {
  id: 'bronze-armor',
  name: 'Bronze Armor',
  slot: 'armor',
  tier: 'bronze',
  cost: 200,
  statBonus: { def: 10, hp: 15 },
  allowedElements: ['Venus'], // Adept, Sentinel - heavy armor
};

export const IRON_ARMOR: Equipment = {
  id: 'iron-armor',
  name: 'Iron Armor',
  slot: 'armor',
  tier: 'iron',
  cost: 350,
  statBonus: { def: 15, hp: 25 },
  allowedElements: ['Venus', 'Mars'], // Adept, Sentinel, War Mage - heavy/medium armor
  unlocksAbility: 'iron-bulwark',
};

export const STEEL_ARMOR: Equipment = {
  id: 'steel-armor',
  name: 'Steel Armor',
  slot: 'armor',
  tier: 'steel',
  cost: 800,
  statBonus: { def: 24, hp: 40 },
  allowedElements: ['Venus'], // Adept, Sentinel - heavy armor
  unlocksAbility: 'steel-ward',
};

export const SILVER_ARMOR: Equipment = {
  id: 'silver-armor',
  name: 'Silver Armor',
  slot: 'armor',
  tier: 'silver',
  cost: 2000,
  statBonus: { def: 35, hp: 60 },
  allowedElements: ['Venus'], // Adept, Sentinel - heavy armor
  unlocksAbility: 'silver-shield',
};

export const MYTHRIL_ARMOR: Equipment = {
  id: 'mythril-armor',
  name: 'Mythril Armor',
  slot: 'armor',
  tier: 'mythril',
  cost: 5000,
  statBonus: { def: 48, hp: 85 },
  allowedElements: ['Venus'], // Adept, Sentinel - heavy armor
  unlocksAbility: 'steel-ward', // Reuse steel-ward for mythril tier
};

export const DRAGON_SCALES: Equipment = {
  id: 'dragon-scales',
  name: 'Dragon Scales',
  slot: 'armor',
  tier: 'legendary',
  cost: 10000,
  statBonus: { def: 62, hp: 110 },
  allowedElements: ['Venus'], // Adept, Sentinel - legendary heavy armor
  elementalResist: 0.25,
  unlocksAbility: 'dragon-ward',
};

export const VALKYRIE_MAIL: Equipment = {
  id: 'valkyrie-mail',
  name: 'Valkyrie Mail',
  slot: 'armor',
  tier: 'artifact',
  cost: 20000,
  statBonus: { def: 78, hp: 140 },
  allowedElements: ['Venus'], // Adept, Sentinel - artifact heavy armor
  elementalResist: 0.3,
};

// ========================================
// HELMS
// ========================================
export const LEATHER_CAP: Equipment = {
  id: 'leather-cap',
  name: 'Leather Cap',
  slot: 'helm',
  tier: 'basic',
  cost: 25,
  statBonus: { def: 2 },
  allowedElements: ['Venus', 'Mars', 'Jupiter'], // Adept, Sentinel, War Mage, Ranger - medium helms
};

export const CLOTH_CAP: Equipment = {
  id: 'cloth-cap',
  name: 'Cloth Cap',
  slot: 'helm',
  tier: 'basic',
  cost: 60,
  statBonus: { def: 4 },
  allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller - light mage helms
};

export const BRONZE_HELM: Equipment = {
  id: 'bronze-helm',
  name: 'Bronze Helm',
  slot: 'helm',
  tier: 'bronze',
  cost: 140,
  statBonus: { def: 6 },
  allowedElements: ['Venus', 'Mars'], // Adept, Sentinel, War Mage - heavy helms
};

export const IRON_HELM: Equipment = {
  id: 'iron-helm',
  name: 'Iron Helm',
  slot: 'helm',
  tier: 'iron',
  cost: 220,
  statBonus: { def: 9 },
  allowedElements: ['Venus'], // Adept, Sentinel - heavy helms
  unlocksAbility: 'iron-mind',
};

export const STEEL_HELM: Equipment = {
  id: 'steel-helm',
  name: 'Steel Helm',
  slot: 'helm',
  tier: 'steel',
  cost: 500,
  statBonus: { def: 14 },
  allowedElements: ['Venus'], // Adept, Sentinel - heavy helms
  unlocksAbility: 'steel-focus',
};

export const SILVER_CIRCLET: Equipment = {
  id: 'silver-circlet',
  name: 'Silver Circlet',
  slot: 'helm',
  tier: 'silver',
  cost: 1300,
  statBonus: { def: 20, mag: 5 },
  allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller - mage circlets
};

export const MYTHRIL_CROWN: Equipment = {
  id: 'mythril-crown',
  name: 'Mythril Crown',
  slot: 'helm',
  tier: 'mythril',
  cost: 3200,
  statBonus: { def: 28, mag: 8 },
  allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller - mage crowns
  unlocksAbility: 'mythril-wisdom',
};

export const ORACLES_CROWN: Equipment = {
  id: 'oracles-crown',
  name: "Oracle's Crown",
  slot: 'helm',
  tier: 'legendary',
  cost: 8000,
  statBonus: { def: 38, mag: 14, pp: 20 },
  allowedElements: ['Jupiter'], // Stormcaller - specialized Jupiter crown
  unlocksAbility: 'oracle-vision',
};

export const GLORY_HELM: Equipment = {
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
export const LEATHER_BOOTS: Equipment = {
  id: 'leather-boots',
  name: 'Leather Boots',
  slot: 'boots',
  tier: 'basic',
  cost: 70,
  statBonus: { spd: 2 },
  allowedElements: ['Venus', 'Mars', 'Jupiter'], // Adept, Sentinel, War Mage, Ranger - medium boots
};

export const IRON_BOOTS: Equipment = {
  id: 'iron-boots',
  name: 'Iron Boots',
  slot: 'boots',
  tier: 'iron',
  cost: 150,
  statBonus: { spd: 3, def: 2 },
  allowedElements: ['Venus'], // Adept, Sentinel - heavy boots
};

export const STEEL_GREAVES: Equipment = {
  id: 'steel-greaves',
  name: 'Steel Greaves',
  slot: 'boots',
  tier: 'steel',
  cost: 400,
  statBonus: { spd: 5, def: 4 },
  allowedElements: ['Venus'], // Adept, Sentinel - heavy greaves
};

export const SILVER_GREAVES: Equipment = {
  id: 'silver-greaves',
  name: 'Silver Greaves',
  slot: 'boots',
  tier: 'silver',
  cost: 1100,
  statBonus: { spd: 7, def: 6 },
  allowedElements: ['Venus'], // Adept, Sentinel - heavy greaves
};

export const HYPER_BOOTS: Equipment = {
  id: 'hyper-boots',
  name: 'Hyper Boots',
  slot: 'boots',
  tier: 'mythril',
  cost: 2800,
  statBonus: { spd: 10, def: 8 },
  allowedElements: ['Jupiter'], // Ranger, Stormcaller - speed boots
  unlocksAbility: 'hyper-speed',
};

export const QUICK_BOOTS: Equipment = {
  id: 'quick-boots',
  name: 'Quick Boots',
  slot: 'boots',
  tier: 'legendary',
  cost: 6500,
  statBonus: { spd: 14, def: 10 },
  allowedElements: ['Jupiter'], // Ranger, Stormcaller - legendary speed boots
};

export const HERMES_SANDALS: Equipment = {
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
export const POWER_RING: Equipment = {
  id: 'power-ring',
  name: 'Power Ring',
  slot: 'accessory',
  tier: 'basic',
  cost: 100,
  statBonus: { atk: 5 },
  allowedElements: ['Venus', 'Mars', 'Jupiter'], // Physical attackers - Adept, Sentinel, War Mage, Ranger
};

export const GUARDIAN_RING: Equipment = {
  id: 'guardian-ring',
  name: 'Guardian Ring',
  slot: 'accessory',
  tier: 'basic',
  cost: 120,
  statBonus: { def: 5 },
  allowedElements: ['Venus', 'Jupiter'], // Adept, Sentinel, Ranger - defensive ring
};

export const ADEPTS_RING: Equipment = {
  id: 'adepts-ring',
  name: "Adept's Ring",
  slot: 'accessory',
  tier: 'bronze',
  cost: 250,
  statBonus: { mag: 6, pp: 5 },
  allowedElements: ['Venus'], // Venus units - special ring (Adept focus but Sentinel can use too)
};

export const WAR_GLOVES: Equipment = {
  id: 'war-gloves',
  name: 'War Gloves',
  slot: 'accessory',
  tier: 'iron',
  cost: 400,
  statBonus: { atk: 10, def: 3 },
  allowedElements: ['Mars'], // War Mage - specialized Mars accessory
};

export const SPIRIT_GLOVES: Equipment = {
  id: 'spirit-gloves',
  name: 'Spirit Gloves',
  slot: 'accessory',
  tier: 'steel',
  cost: 900,
  statBonus: { mag: 12, pp: 10 },
  allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller - mage gloves
};

export const LUCKY_MEDAL: Equipment = {
  id: 'lucky-medal',
  name: 'Lucky Medal',
  slot: 'accessory',
  tier: 'silver',
  cost: 1800,
  statBonus: { spd: 5 },
  allowedElements: ['Jupiter'], // Jupiter units - speed-focused (Ranger focus but Stormcaller can use)
};

export const ELEMENTAL_STAR: Equipment = {
  id: 'elemental-star',
  name: 'Elemental Star',
  slot: 'accessory',
  tier: 'mythril',
  cost: 4500,
  statBonus: { mag: 18, pp: 20 },
  allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller - powerful mage accessory
  elementalResist: 0.15,
  unlocksAbility: 'mythril-wisdom', // Reuse mythril-wisdom for mage accessory
};

export const DRAGONS_EYE: Equipment = {
  id: 'dragons-eye',
  name: "Dragon's Eye",
  slot: 'accessory',
  tier: 'legendary',
  cost: 8500,
  statBonus: { atk: 15, mag: 15, def: 10 },
  allowedElements: ['Venus', 'Jupiter'], // Adept, Sentinel, Ranger - hybrid accessory
};

export const CLERIC_RING: Equipment = {
  id: 'cleric-ring',
  name: 'Cleric Ring',
  slot: 'accessory',
  tier: 'legendary',
  cost: 9000,
  statBonus: { pp: 30, mag: 12 },
  allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller - healing ring
};

export const IRIS_ROBE: Equipment = {
  id: 'iris-robe',
  name: 'Iris Robe',
  slot: 'accessory',
  tier: 'artifact',
  cost: 12000,
  statBonus: { def: 20, mag: 20 },
  allowedElements: ['Mercury', 'Jupiter'], // Mystic, Stormcaller - ultimate mage robe
  elementalResist: 0.2,
};

export const COSMOS_SHIELD: Equipment = {
  id: 'cosmos-shield',
  name: 'Cosmos Shield',
  slot: 'accessory',
  tier: 'artifact',
  cost: 17000,
  statBonus: { def: 30, hp: 50 },
  allowedElements: ['Venus'], // Adept, Sentinel - ultimate tank accessory
  elementalResist: 0.25,
  unlocksAbility: 'silver-shield', // Reuse silver-shield for artifact tier
};

export const ECLIPSE_BLADE: Equipment = {
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
export const STORM_CLEAVER: Equipment = {
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

export const FROST_REAVER: Equipment = {
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

export const VOLCANIC_HAMMER: Equipment = {
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

export const GAIA_GREATSHIELD: Equipment = {
  id: 'gaia-greatshield',
  name: 'Gaia Greatshield',
  slot: 'accessory',
  tier: 'legendary',
  cost: 0,
  statBonus: { def: 45, hp: 80 },
  allowedElements: ['Venus'],
  elementalResist: 0.3,
  availableIn: ['tower'],
};

// Tower Armor - Elemental Sets
export const TEMPEST_ARMOR: Equipment = {
  id: 'tempest-armor',
  name: 'Tempest Armor',
  slot: 'armor',
  tier: 'legendary',
  cost: 0,
  statBonus: { def: 55, spd: 12, mag: 10 },
  allowedElements: ['Jupiter'],
  elementalResist: 0.2,
  availableIn: ['tower'],
};

export const GLACIER_MAIL: Equipment = {
  id: 'glacier-mail',
  name: 'Glacier Mail',
  slot: 'armor',
  tier: 'legendary',
  cost: 0,
  statBonus: { def: 58, hp: 75, mag: 8 },
  allowedElements: ['Mercury'],
  elementalResist: 0.25,
  availableIn: ['tower'],
};

export const INFERNO_PLATE: Equipment = {
  id: 'inferno-plate',
  name: 'Inferno Plate',
  slot: 'armor',
  tier: 'legendary',
  cost: 0,
  statBonus: { def: 52, atk: 15, hp: 50 },
  allowedElements: ['Mars'],
  elementalResist: 0.2,
  availableIn: ['tower'],
};

// Tower Helms - Element Crowns
export const STORMKING_CROWN: Equipment = {
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

export const FROSTQUEEN_TIARA: Equipment = {
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

export const VOLCANIC_VISOR: Equipment = {
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
export const WINDSTRIDER_BOOTS: Equipment = {
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

export const TIDAL_TREADS: Equipment = {
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
export const TOWER_CHAMPIONS_RING: Equipment = {
  id: 'tower-champions-ring',
  name: "Tower Champion's Ring",
  slot: 'accessory',
  tier: 'artifact',
  cost: 0,
  statBonus: { atk: 20, def: 20, mag: 20, spd: 10 },
  allowedElements: ['Venus', 'Mars', 'Mercury', 'Jupiter'],
  elementalResist: 0.15,
  availableIn: ['tower'],
};

export const TOWER_MASTERS_MEDALLION: Equipment = {
  id: 'tower-masters-medallion',
  name: "Tower Master's Medallion",
  slot: 'accessory',
  tier: 'artifact',
  cost: 0,
  statBonus: { atk: 25, def: 25, mag: 25, spd: 15, hp: 100, pp: 50 },
  allowedElements: ['Venus', 'Mars', 'Mercury', 'Jupiter'],
  elementalResist: 0.25,
  availableIn: ['tower'],
};

// ========================================
// MYTHRIL TIER ITEMS (Late-game shop items)
// ========================================

// Mythril Weapons
export const MYTHRIL_AXE: Equipment = {
  id: 'mythril-axe',
  name: 'Mythril Axe',
  slot: 'weapon',
  tier: 'mythril',
  cost: 3200,
  statBonus: { atk: 46, spd: -2 },
  allowedElements: ['Mars'],
  unlocksAbility: 'mythril-cleave',
};

export const MYTHRIL_STAFF: Equipment = {
  id: 'mythril-staff',
  name: 'Mythril Staff',
  slot: 'weapon',
  tier: 'mythril',
  cost: 3800,
  statBonus: { atk: 26, mag: 36 },
  allowedElements: ['Mercury'],
  unlocksAbility: 'mythril-surge',
};

export const MYTHRIL_LANCE: Equipment = {
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
export const MYTHRIL_GREAVES: Equipment = {
  id: 'mythril-greaves',
  name: 'Mythril Greaves',
  slot: 'boots',
  tier: 'mythril',
  cost: 2600,
  statBonus: { spd: 9, def: 10 },
  allowedElements: ['Venus', 'Mars'],
};

export const MYTHRIL_GAUNTLETS: Equipment = {
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
export const EARTH_WARDEN_SHIELD: Equipment = {
  id: 'earth-warden-shield',
  name: 'Earth Warden Shield',
  slot: 'accessory',
  tier: 'silver',
  cost: 1900,
  statBonus: { def: 18, hp: 40 },
  allowedElements: ['Venus'],
  elementalResist: 0.2,
  unlocksAbility: 'earth-wall',
};

export const GAIA_HELM: Equipment = {
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
export const FLAME_BRANDED_AXE: Equipment = {
  id: 'flame-branded-axe',
  name: 'Flame Branded Axe',
  slot: 'weapon',
  tier: 'silver',
  cost: 2200,
  statBonus: { atk: 38, mag: 8, spd: -1 },
  allowedElements: ['Mars'],
  unlocksAbility: 'flame-burst',
};

export const INFERNO_GAUNTLETS: Equipment = {
  id: 'inferno-gauntlets',
  name: 'Inferno Gauntlets',
  slot: 'accessory',
  tier: 'mythril',
  cost: 4000,
  statBonus: { atk: 18, mag: 10, def: 6 },
  allowedElements: ['Mars'],
  elementalResist: 0.15,
  unlocksAbility: 'inferno-fist',
};

// Mercury Element Gear
export const FROST_SCEPTER: Equipment = {
  id: 'frost-scepter',
  name: 'Frost Scepter',
  slot: 'weapon',
  tier: 'silver',
  cost: 2100,
  statBonus: { atk: 20, mag: 28, pp: 10 },
  allowedElements: ['Mercury'],
  unlocksAbility: 'frost-nova',
};

export const GLACIAL_ROBES: Equipment = {
  id: 'glacial-robes',
  name: 'Glacial Robes',
  slot: 'armor',
  tier: 'mythril',
  cost: 4800,
  statBonus: { def: 40, mag: 15, hp: 60 },
  allowedElements: ['Mercury'],
  elementalResist: 0.2,
};

// Jupiter Element Gear
export const THUNDERBOLT_BOW: Equipment = {
  id: 'thunderbolt-bow',
  name: 'Thunderbolt Bow',
  slot: 'weapon',
  tier: 'silver',
  cost: 2400,
  statBonus: { atk: 35, spd: 6, mag: 5 },
  allowedElements: ['Jupiter'],
  unlocksAbility: 'lightning-shot',
};

export const STORM_CIRCLET: Equipment = {
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

export const ASTRAL_BLADE: Equipment = {
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

export const SHADOWFLAME_STAFF: Equipment = {
  id: 'shadowflame-staff',
  name: 'Shadowflame Staff',
  slot: 'weapon',
  tier: 'artifact',
  cost: 0,
  statBonus: { atk: 35, mag: 55, pp: 30 },
  allowedElements: ['Mars', 'Mercury'],
  elementalResist: 0.2,
  unlocksAbility: 'shadowflame',
  availableIn: ['tower'],
};

export const AETHERIC_MANTLE: Equipment = {
  id: 'aetheric-mantle',
  name: 'Aetheric Mantle',
  slot: 'armor',
  tier: 'artifact',
  cost: 0,
  statBonus: { def: 70, mag: 25, hp: 120, pp: 40 },
  allowedElements: ['Mercury', 'Jupiter'],
  elementalResist: 0.3,
  availableIn: ['tower'],
};

// ========================================
// EQUIPMENT REGISTRY
// ========================================
export const EQUIPMENT: Record<string, Equipment> = {
  // Swords
  'wooden-sword': WOODEN_SWORD,
  'bronze-sword': BRONZE_SWORD,
  'iron-sword': IRON_SWORD,
  'steel-sword': STEEL_SWORD,
  'silver-blade': SILVER_BLADE,
  'mythril-blade': MYTHRIL_BLADE,
  'gaia-blade': GAIA_BLADE,
  'sol-blade': SOL_BLADE,
  'eclipse-blade': ECLIPSE_BLADE,

  // Axes
  'wooden-axe': WOODEN_AXE,
  'battle-axe': BATTLE_AXE,
  'great-axe': GREAT_AXE,
  'titans-axe': TITANS_AXE,

  // Maces
  'mace': MACE,
  'heavy-mace': HEAVY_MACE,
  'demon-mace': DEMON_MACE,
  'mythril-axe': MYTHRIL_AXE,

  // Staves
  'wooden-staff': WOODEN_STAFF,
  'magic-rod': MAGIC_ROD,
  'shaman-rod': SHAMAN_ROD,
  'crystal-rod': CRYSTAL_ROD,
  'zodiac-wand': ZODIAC_WAND,
  'staff-of-ages': STAFF_OF_AGES,
  'mythril-staff': MYTHRIL_STAFF,
  'mythril-lance': MYTHRIL_LANCE,

  // Armor
  'cotton-shirt': COTTON_SHIRT,
  'leather-vest': LEATHER_VEST,
  'bronze-armor': BRONZE_ARMOR,
  'iron-armor': IRON_ARMOR,
  'steel-armor': STEEL_ARMOR,
  'silver-armor': SILVER_ARMOR,
  'mythril-armor': MYTHRIL_ARMOR,
  'dragon-scales': DRAGON_SCALES,
  'valkyrie-mail': VALKYRIE_MAIL,
  'glacial-robes': GLACIAL_ROBES,

  // Helms
  'leather-cap': LEATHER_CAP,
  'cloth-cap': CLOTH_CAP,
  'bronze-helm': BRONZE_HELM,
  'iron-helm': IRON_HELM,
  'steel-helm': STEEL_HELM,
  'silver-circlet': SILVER_CIRCLET,
  'mythril-crown': MYTHRIL_CROWN,
  'oracles-crown': ORACLES_CROWN,
  'glory-helm': GLORY_HELM,
  'gaia-helm': GAIA_HELM,
  'storm-circlet': STORM_CIRCLET,

  // Boots
  'leather-boots': LEATHER_BOOTS,
  'iron-boots': IRON_BOOTS,
  'steel-greaves': STEEL_GREAVES,
  'silver-greaves': SILVER_GREAVES,
  'hyper-boots': HYPER_BOOTS,
  'quick-boots': QUICK_BOOTS,
  'hermes-sandals': HERMES_SANDALS,
  'mythril-greaves': MYTHRIL_GREAVES,

  // Accessories
  'power-ring': POWER_RING,
  'guardian-ring': GUARDIAN_RING,
  'adepts-ring': ADEPTS_RING,
  'war-gloves': WAR_GLOVES,
  'spirit-gloves': SPIRIT_GLOVES,
  'lucky-medal': LUCKY_MEDAL,
  'elemental-star': ELEMENTAL_STAR,
  'dragons-eye': DRAGONS_EYE,
  'cleric-ring': CLERIC_RING,
  'iris-robe': IRIS_ROBE,
  'cosmos-shield': COSMOS_SHIELD,
  'mythril-gauntlets': MYTHRIL_GAUNTLETS,
  'earth-warden-shield': EARTH_WARDEN_SHIELD,
  'inferno-gauntlets': INFERNO_GAUNTLETS,

  // Element-specific weapons
  'flame-branded-axe': FLAME_BRANDED_AXE,
  'frost-scepter': FROST_SCEPTER,
  'thunderbolt-bow': THUNDERBOLT_BOW,

  // Tower-exclusive items
  'storm-cleaver': STORM_CLEAVER,
  'frost-reaver': FROST_REAVER,
  'volcanic-hammer': VOLCANIC_HAMMER,
  'gaia-greatshield': GAIA_GREATSHIELD,
  'tempest-armor': TEMPEST_ARMOR,
  'glacier-mail': GLACIER_MAIL,
  'inferno-plate': INFERNO_PLATE,
  'stormking-crown': STORMKING_CROWN,
  'frostqueen-tiara': FROSTQUEEN_TIARA,
  'volcanic-visor': VOLCANIC_VISOR,
  'windstrider-boots': WINDSTRIDER_BOOTS,
  'tidal-treads': TIDAL_TREADS,
  'tower-champions-ring': TOWER_CHAMPIONS_RING,
  'tower-masters-medallion': TOWER_MASTERS_MEDALLION,
  'astral-blade': ASTRAL_BLADE,
  'shadowflame-staff': SHADOWFLAME_STAFF,
  'aetheric-mantle': AETHERIC_MANTLE,
};
