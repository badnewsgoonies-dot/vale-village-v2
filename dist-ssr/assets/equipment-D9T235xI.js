const WOODEN_SWORD = {
  id: "wooden-sword",
  name: "Wooden Sword",
  slot: "weapon",
  tier: "basic",
  cost: 50,
  statBonus: { atk: 5 },
  allowedElements: ["Venus", "Jupiter"],
  // Adept, Sentinel, Ranger
  unlocksAbility: "wooden-strike"
};
const BRONZE_SWORD = {
  id: "bronze-sword",
  name: "Bronze Sword",
  slot: "weapon",
  tier: "bronze",
  cost: 120,
  statBonus: { atk: 9 },
  allowedElements: ["Venus"],
  // Adept, Sentinel
  unlocksAbility: "bronze-slash"
};
const IRON_SWORD = {
  id: "iron-sword",
  name: "Iron Sword",
  slot: "weapon",
  tier: "iron",
  cost: 200,
  statBonus: { atk: 14 },
  allowedElements: ["Venus"],
  // Adept, Sentinel
  unlocksAbility: "iron-thrust"
};
const STEEL_SWORD = {
  id: "steel-sword",
  name: "Steel Sword",
  slot: "weapon",
  tier: "steel",
  cost: 500,
  statBonus: { atk: 22 },
  allowedElements: ["Venus"],
  // Adept, Sentinel
  unlocksAbility: "steel-slash"
};
const SILVER_BLADE = {
  id: "silver-blade",
  name: "Silver Blade",
  slot: "weapon",
  tier: "silver",
  cost: 1200,
  statBonus: { atk: 32 },
  allowedElements: ["Venus"],
  // Adept, Sentinel
  unlocksAbility: "silver-strike"
};
const MYTHRIL_BLADE = {
  id: "mythril-blade",
  name: "Mythril Blade",
  slot: "weapon",
  tier: "mythril",
  cost: 3e3,
  statBonus: { atk: 45 },
  allowedElements: ["Venus"],
  // Adept, Sentinel
  unlocksAbility: "mythril-edge"
};
const GAIA_BLADE = {
  id: "gaia-blade",
  name: "Gaia Blade",
  slot: "weapon",
  tier: "legendary",
  cost: 7500,
  statBonus: { atk: 58 },
  allowedElements: ["Venus"],
  // Adept, Sentinel
  unlocksAbility: "mythril-edge"
  // Reuse mythril-edge for legendary tier
};
const SOL_BLADE = {
  id: "sol-blade",
  name: "Sol Blade",
  slot: "weapon",
  tier: "artifact",
  cost: 15e3,
  statBonus: { atk: 72 },
  allowedElements: ["Venus"],
  // Adept, Sentinel
  unlocksAbility: "mythril-edge"
  // Reuse mythril-edge for artifact tier
};
const WOODEN_AXE = {
  id: "wooden-axe",
  name: "Wooden Axe",
  slot: "weapon",
  tier: "basic",
  cost: 60,
  statBonus: { atk: 7, spd: -1 },
  allowedElements: ["Mars"]
  // War Mage
};
const BATTLE_AXE = {
  id: "battle-axe",
  name: "Battle Axe",
  slot: "weapon",
  tier: "iron",
  cost: 280,
  statBonus: { atk: 18, spd: -2 },
  allowedElements: ["Mars"],
  // War Mage
  unlocksAbility: "axe-cleave"
};
const GREAT_AXE = {
  id: "great-axe",
  name: "Great Axe",
  slot: "weapon",
  tier: "steel",
  cost: 800,
  statBonus: { atk: 30, spd: -3 },
  allowedElements: ["Mars"],
  // War Mage
  unlocksAbility: "great-cleave"
};
const TITANS_AXE = {
  id: "titans-axe",
  name: "Titan's Axe",
  slot: "weapon",
  tier: "legendary",
  cost: 9e3,
  statBonus: { atk: 65, def: 10, spd: -2 },
  allowedElements: ["Mars"],
  // War Mage
  unlocksAbility: "great-cleave"
  // Reuse great-cleave for legendary tier
};
const MACE = {
  id: "mace",
  name: "Mace",
  slot: "weapon",
  tier: "bronze",
  cost: 150,
  statBonus: { atk: 11, def: 2 },
  allowedElements: ["Mars"]
  // War Mage
};
const HEAVY_MACE = {
  id: "heavy-mace",
  name: "Heavy Mace",
  slot: "weapon",
  tier: "steel",
  cost: 650,
  statBonus: { atk: 26, def: 5 },
  allowedElements: ["Mars"]
  // War Mage
};
const DEMON_MACE = {
  id: "demon-mace",
  name: "Demon Mace",
  slot: "weapon",
  tier: "mythril",
  cost: 3500,
  statBonus: { atk: 48, def: 8 },
  allowedElements: ["Mars"]
  // War Mage
};
const WOODEN_STAFF = {
  id: "wooden-staff",
  name: "Wooden Staff",
  slot: "weapon",
  tier: "basic",
  cost: 40,
  statBonus: { atk: 3, mag: 4 },
  allowedElements: ["Mercury", "Jupiter"]
  // Mystic, Stormcaller
};
const MAGIC_ROD = {
  id: "magic-rod",
  name: "Magic Rod",
  slot: "weapon",
  tier: "bronze",
  cost: 180,
  statBonus: { atk: 6, mag: 8 },
  allowedElements: ["Mercury", "Jupiter"],
  // Mystic, Stormcaller
  unlocksAbility: "arcane-bolt"
};
const SHAMAN_ROD = {
  id: "shaman-rod",
  name: "Shaman Rod",
  slot: "weapon",
  tier: "iron",
  cost: 400,
  statBonus: { atk: 10, mag: 14 },
  allowedElements: ["Mercury", "Jupiter"]
  // Mystic, Stormcaller
};
const CRYSTAL_ROD = {
  id: "crystal-rod",
  name: "Crystal Rod",
  slot: "weapon",
  tier: "silver",
  cost: 1500,
  statBonus: { atk: 18, mag: 24 },
  allowedElements: ["Mercury", "Jupiter"],
  // Mystic, Stormcaller
  unlocksAbility: "crystal-blast"
};
const ZODIAC_WAND = {
  id: "zodiac-wand",
  name: "Zodiac Wand",
  slot: "weapon",
  tier: "mythril",
  cost: 4e3,
  statBonus: { atk: 28, mag: 38 },
  allowedElements: ["Mercury", "Jupiter"],
  // Mystic, Stormcaller
  unlocksAbility: "zodiac-bolt"
};
const STAFF_OF_AGES = {
  id: "staff-of-ages",
  name: "Staff of Ages",
  slot: "weapon",
  tier: "artifact",
  cost: 18e3,
  statBonus: { atk: 42, mag: 58, pp: 25 },
  allowedElements: ["Mercury", "Jupiter"],
  // Mystic, Stormcaller
  unlocksAbility: "zodiac-bolt"
  // Reuse zodiac-bolt for artifact tier
};
const COTTON_SHIRT = {
  id: "cotton-shirt",
  name: "Cotton Shirt",
  slot: "armor",
  tier: "basic",
  cost: 30,
  statBonus: { def: 3, hp: 5 },
  allowedElements: ["Mercury", "Jupiter"]
  // Mystic, Stormcaller - light mage armor
};
const LEATHER_VEST = {
  id: "leather-vest",
  name: "Leather Vest",
  slot: "armor",
  tier: "basic",
  cost: 80,
  statBonus: { def: 6, hp: 10 },
  allowedElements: ["Venus", "Mars", "Jupiter"]
  // Adept, Sentinel, War Mage, Ranger - medium armor
};
const BRONZE_ARMOR = {
  id: "bronze-armor",
  name: "Bronze Armor",
  slot: "armor",
  tier: "bronze",
  cost: 200,
  statBonus: { def: 10, hp: 15 },
  allowedElements: ["Venus"]
  // Adept, Sentinel - heavy armor
};
const IRON_ARMOR = {
  id: "iron-armor",
  name: "Iron Armor",
  slot: "armor",
  tier: "iron",
  cost: 350,
  statBonus: { def: 15, hp: 25 },
  allowedElements: ["Venus", "Mars"],
  // Adept, Sentinel, War Mage - heavy/medium armor
  unlocksAbility: "iron-bulwark"
};
const STEEL_ARMOR = {
  id: "steel-armor",
  name: "Steel Armor",
  slot: "armor",
  tier: "steel",
  cost: 800,
  statBonus: { def: 24, hp: 40 },
  allowedElements: ["Venus"],
  // Adept, Sentinel - heavy armor
  unlocksAbility: "steel-ward"
};
const SILVER_ARMOR = {
  id: "silver-armor",
  name: "Silver Armor",
  slot: "armor",
  tier: "silver",
  cost: 2e3,
  statBonus: { def: 35, hp: 60 },
  allowedElements: ["Venus"],
  // Adept, Sentinel - heavy armor
  unlocksAbility: "silver-shield"
};
const MYTHRIL_ARMOR = {
  id: "mythril-armor",
  name: "Mythril Armor",
  slot: "armor",
  tier: "mythril",
  cost: 5e3,
  statBonus: { def: 48, hp: 85 },
  allowedElements: ["Venus"],
  // Adept, Sentinel - heavy armor
  unlocksAbility: "steel-ward"
  // Reuse steel-ward for mythril tier
};
const DRAGON_SCALES = {
  id: "dragon-scales",
  name: "Dragon Scales",
  slot: "armor",
  tier: "legendary",
  cost: 1e4,
  statBonus: { def: 62, hp: 110 },
  allowedElements: ["Venus"],
  // Adept, Sentinel - legendary heavy armor
  unlocksAbility: "dragon-ward"
};
const VALKYRIE_MAIL = {
  id: "valkyrie-mail",
  name: "Valkyrie Mail",
  slot: "armor",
  tier: "artifact",
  cost: 2e4,
  statBonus: { def: 78, hp: 140 },
  allowedElements: ["Venus"]
  // Adept, Sentinel - artifact heavy armor
};
const LEATHER_CAP = {
  id: "leather-cap",
  name: "Leather Cap",
  slot: "helm",
  tier: "basic",
  cost: 25,
  statBonus: { def: 2 },
  allowedElements: ["Venus", "Mars", "Jupiter"]
  // Adept, Sentinel, War Mage, Ranger - medium helms
};
const CLOTH_CAP = {
  id: "cloth-cap",
  name: "Cloth Cap",
  slot: "helm",
  tier: "basic",
  cost: 60,
  statBonus: { def: 4 },
  allowedElements: ["Mercury", "Jupiter"]
  // Mystic, Stormcaller - light mage helms
};
const BRONZE_HELM = {
  id: "bronze-helm",
  name: "Bronze Helm",
  slot: "helm",
  tier: "bronze",
  cost: 140,
  statBonus: { def: 6 },
  allowedElements: ["Venus", "Mars"]
  // Adept, Sentinel, War Mage - heavy helms
};
const IRON_HELM = {
  id: "iron-helm",
  name: "Iron Helm",
  slot: "helm",
  tier: "iron",
  cost: 220,
  statBonus: { def: 9 },
  allowedElements: ["Venus"],
  // Adept, Sentinel - heavy helms
  unlocksAbility: "iron-mind"
};
const STEEL_HELM = {
  id: "steel-helm",
  name: "Steel Helm",
  slot: "helm",
  tier: "steel",
  cost: 500,
  statBonus: { def: 14 },
  allowedElements: ["Venus"],
  // Adept, Sentinel - heavy helms
  unlocksAbility: "steel-focus"
};
const SILVER_CIRCLET = {
  id: "silver-circlet",
  name: "Silver Circlet",
  slot: "helm",
  tier: "silver",
  cost: 1300,
  statBonus: { def: 20, mag: 5 },
  allowedElements: ["Mercury", "Jupiter"]
  // Mystic, Stormcaller - mage circlets
};
const MYTHRIL_CROWN = {
  id: "mythril-crown",
  name: "Mythril Crown",
  slot: "helm",
  tier: "mythril",
  cost: 3200,
  statBonus: { def: 28, mag: 8 },
  allowedElements: ["Mercury", "Jupiter"],
  // Mystic, Stormcaller - mage crowns
  unlocksAbility: "mythril-wisdom"
};
const ORACLES_CROWN = {
  id: "oracles-crown",
  name: "Oracle's Crown",
  slot: "helm",
  tier: "legendary",
  cost: 8e3,
  statBonus: { def: 38, mag: 14, pp: 20 },
  allowedElements: ["Jupiter"],
  // Stormcaller - specialized Jupiter crown
  unlocksAbility: "oracle-vision"
};
const GLORY_HELM = {
  id: "glory-helm",
  name: "Glory Helm",
  slot: "helm",
  tier: "artifact",
  cost: 16e3,
  statBonus: { def: 50, mag: 18, pp: 30 },
  allowedElements: ["Venus"]
  // Adept, Sentinel - artifact heavy helm
};
const LEATHER_BOOTS = {
  id: "leather-boots",
  name: "Leather Boots",
  slot: "boots",
  tier: "basic",
  cost: 70,
  statBonus: { spd: 2 },
  allowedElements: ["Venus", "Mars", "Jupiter"]
  // Adept, Sentinel, War Mage, Ranger - medium boots
};
const IRON_BOOTS = {
  id: "iron-boots",
  name: "Iron Boots",
  slot: "boots",
  tier: "iron",
  cost: 150,
  statBonus: { spd: 3, def: 2 },
  allowedElements: ["Venus"]
  // Adept, Sentinel - heavy boots
};
const STEEL_GREAVES = {
  id: "steel-greaves",
  name: "Steel Greaves",
  slot: "boots",
  tier: "steel",
  cost: 400,
  statBonus: { spd: 5, def: 4 },
  allowedElements: ["Venus"]
  // Adept, Sentinel - heavy greaves
};
const SILVER_GREAVES = {
  id: "silver-greaves",
  name: "Silver Greaves",
  slot: "boots",
  tier: "silver",
  cost: 1100,
  statBonus: { spd: 7, def: 6 },
  allowedElements: ["Venus"]
  // Adept, Sentinel - heavy greaves
};
const HYPER_BOOTS = {
  id: "hyper-boots",
  name: "Hyper Boots",
  slot: "boots",
  tier: "mythril",
  cost: 2800,
  statBonus: { spd: 10, def: 8 },
  allowedElements: ["Jupiter"],
  // Ranger, Stormcaller - speed boots
  unlocksAbility: "hyper-speed"
};
const QUICK_BOOTS = {
  id: "quick-boots",
  name: "Quick Boots",
  slot: "boots",
  tier: "legendary",
  cost: 6500,
  statBonus: { spd: 14, def: 10 },
  allowedElements: ["Jupiter"]
  // Ranger, Stormcaller - legendary speed boots
};
const HERMES_SANDALS = {
  id: "hermes-sandals",
  name: "Hermes' Sandals",
  slot: "boots",
  tier: "artifact",
  cost: 14e3,
  statBonus: { spd: 20, def: 12 },
  allowedElements: ["Jupiter"],
  // Ranger, Stormcaller - artifact speed boots
  alwaysFirstTurn: true
};
const POWER_RING = {
  id: "power-ring",
  name: "Power Ring",
  slot: "accessory",
  tier: "basic",
  cost: 100,
  statBonus: { atk: 5 },
  allowedElements: ["Venus", "Mars", "Jupiter"]
  // Physical attackers - Adept, Sentinel, War Mage, Ranger
};
const GUARDIAN_RING = {
  id: "guardian-ring",
  name: "Guardian Ring",
  slot: "accessory",
  tier: "basic",
  cost: 120,
  statBonus: { def: 5 },
  allowedElements: ["Venus", "Jupiter"]
  // Adept, Sentinel, Ranger - defensive ring
};
const ADEPTS_RING = {
  id: "adepts-ring",
  name: "Adept's Ring",
  slot: "accessory",
  tier: "bronze",
  cost: 250,
  statBonus: { mag: 6, pp: 5 },
  allowedElements: ["Venus"]
  // Venus units - special ring (Adept focus but Sentinel can use too)
};
const WAR_GLOVES = {
  id: "war-gloves",
  name: "War Gloves",
  slot: "accessory",
  tier: "iron",
  cost: 400,
  statBonus: { atk: 10, def: 3 },
  allowedElements: ["Mars"]
  // War Mage - specialized Mars accessory
};
const SPIRIT_GLOVES = {
  id: "spirit-gloves",
  name: "Spirit Gloves",
  slot: "accessory",
  tier: "steel",
  cost: 900,
  statBonus: { mag: 12, pp: 10 },
  allowedElements: ["Mercury", "Jupiter"]
  // Mystic, Stormcaller - mage gloves
};
const LUCKY_MEDAL = {
  id: "lucky-medal",
  name: "Lucky Medal",
  slot: "accessory",
  tier: "silver",
  cost: 1800,
  statBonus: { spd: 5 },
  allowedElements: ["Jupiter"]
  // Jupiter units - speed-focused (Ranger focus but Stormcaller can use)
};
const ELEMENTAL_STAR = {
  id: "elemental-star",
  name: "Elemental Star",
  slot: "accessory",
  tier: "mythril",
  cost: 4500,
  statBonus: { mag: 18, pp: 20 },
  allowedElements: ["Mercury", "Jupiter"],
  // Mystic, Stormcaller - powerful mage accessory
  unlocksAbility: "mythril-wisdom"
  // Reuse mythril-wisdom for mage accessory
};
const DRAGONS_EYE = {
  id: "dragons-eye",
  name: "Dragon's Eye",
  slot: "accessory",
  tier: "legendary",
  cost: 8500,
  statBonus: { atk: 15, mag: 15, def: 10 },
  allowedElements: ["Venus", "Jupiter"]
  // Adept, Sentinel, Ranger - hybrid accessory
};
const CLERIC_RING = {
  id: "cleric-ring",
  name: "Cleric Ring",
  slot: "accessory",
  tier: "legendary",
  cost: 9e3,
  statBonus: { pp: 30, mag: 12 },
  allowedElements: ["Mercury", "Jupiter"]
  // Mystic, Stormcaller - healing ring
};
const IRIS_ROBE = {
  id: "iris-robe",
  name: "Iris Robe",
  slot: "accessory",
  tier: "artifact",
  cost: 12e3,
  statBonus: { def: 20, mag: 20 },
  allowedElements: ["Mercury", "Jupiter"]
  // Mystic, Stormcaller - ultimate mage robe
};
const COSMOS_SHIELD = {
  id: "cosmos-shield",
  name: "Cosmos Shield",
  slot: "accessory",
  tier: "artifact",
  cost: 17e3,
  statBonus: { def: 30, hp: 50 },
  allowedElements: ["Venus"],
  // Adept, Sentinel - ultimate tank accessory
  unlocksAbility: "silver-shield"
  // Reuse silver-shield for artifact tier
};
const ECLIPSE_BLADE = {
  id: "eclipse-blade",
  name: "Eclipse Blade",
  slot: "weapon",
  tier: "artifact",
  cost: 0,
  statBonus: { atk: 80, mag: 15, spd: 5 },
  allowedElements: ["Venus", "Mars"],
  unlocksAbility: "mythril-edge",
  availableIn: ["tower"]
};
const STORM_CLEAVER = {
  id: "storm-cleaver",
  name: "Storm Cleaver",
  slot: "weapon",
  tier: "legendary",
  cost: 0,
  // Tower drop only
  statBonus: { atk: 55, mag: 20, spd: 8 },
  allowedElements: ["Jupiter"],
  unlocksAbility: "storm-slash",
  availableIn: ["tower"]
};
const FROST_REAVER = {
  id: "frost-reaver",
  name: "Frost Reaver",
  slot: "weapon",
  tier: "legendary",
  cost: 0,
  statBonus: { atk: 52, mag: 25, def: 5 },
  allowedElements: ["Mercury"],
  unlocksAbility: "frost-strike",
  availableIn: ["tower"]
};
const VOLCANIC_HAMMER = {
  id: "volcanic-hammer",
  name: "Volcanic Hammer",
  slot: "weapon",
  tier: "legendary",
  cost: 0,
  statBonus: { atk: 68, def: 15, spd: -3 },
  allowedElements: ["Mars"],
  unlocksAbility: "volcanic-smash",
  availableIn: ["tower"]
};
const GAIA_GREATSHIELD = {
  id: "gaia-greatshield",
  name: "Gaia Greatshield",
  slot: "accessory",
  tier: "legendary",
  cost: 0,
  statBonus: { def: 45, hp: 80 },
  allowedElements: ["Venus"],
  availableIn: ["tower"]
};
const TEMPEST_ARMOR = {
  id: "tempest-armor",
  name: "Tempest Armor",
  slot: "armor",
  tier: "legendary",
  cost: 0,
  statBonus: { def: 55, spd: 12, mag: 10 },
  allowedElements: ["Jupiter"],
  availableIn: ["tower"]
};
const GLACIER_MAIL = {
  id: "glacier-mail",
  name: "Glacier Mail",
  slot: "armor",
  tier: "legendary",
  cost: 0,
  statBonus: { def: 58, hp: 75, mag: 8 },
  allowedElements: ["Mercury"],
  availableIn: ["tower"]
};
const INFERNO_PLATE = {
  id: "inferno-plate",
  name: "Inferno Plate",
  slot: "armor",
  tier: "legendary",
  cost: 0,
  statBonus: { def: 52, atk: 15, hp: 50 },
  allowedElements: ["Mars"],
  availableIn: ["tower"]
};
const STORMKING_CROWN = {
  id: "stormking-crown",
  name: "Stormking Crown",
  slot: "helm",
  tier: "legendary",
  cost: 0,
  statBonus: { def: 42, mag: 20, pp: 25 },
  allowedElements: ["Jupiter"],
  unlocksAbility: "storm-mastery",
  availableIn: ["tower"]
};
const FROSTQUEEN_TIARA = {
  id: "frostqueen-tiara",
  name: "Frostqueen Tiara",
  slot: "helm",
  tier: "legendary",
  cost: 0,
  statBonus: { def: 38, mag: 22, pp: 30 },
  allowedElements: ["Mercury"],
  unlocksAbility: "frost-mastery",
  availableIn: ["tower"]
};
const VOLCANIC_VISOR = {
  id: "volcanic-visor",
  name: "Volcanic Visor",
  slot: "helm",
  tier: "legendary",
  cost: 0,
  statBonus: { def: 45, atk: 12, hp: 30 },
  allowedElements: ["Mars"],
  availableIn: ["tower"]
};
const WINDSTRIDER_BOOTS = {
  id: "windstrider-boots",
  name: "Windstrider Boots",
  slot: "boots",
  tier: "legendary",
  cost: 0,
  statBonus: { spd: 18, def: 15 },
  allowedElements: ["Jupiter"],
  alwaysFirstTurn: true,
  availableIn: ["tower"]
};
const TIDAL_TREADS = {
  id: "tidal-treads",
  name: "Tidal Treads",
  slot: "boots",
  tier: "legendary",
  cost: 0,
  statBonus: { spd: 12, def: 18, mag: 8 },
  allowedElements: ["Mercury"],
  availableIn: ["tower"]
};
const TOWER_CHAMPIONS_RING = {
  id: "tower-champions-ring",
  name: "Tower Champion's Ring",
  slot: "accessory",
  tier: "artifact",
  cost: 0,
  statBonus: { atk: 20, def: 20, mag: 20, spd: 10 },
  allowedElements: ["Venus", "Mars", "Mercury", "Jupiter"],
  availableIn: ["tower"]
};
const TOWER_MASTERS_MEDALLION = {
  id: "tower-masters-medallion",
  name: "Tower Master's Medallion",
  slot: "accessory",
  tier: "artifact",
  cost: 0,
  statBonus: { atk: 25, def: 25, mag: 25, spd: 15, hp: 100, pp: 50 },
  allowedElements: ["Venus", "Mars", "Mercury", "Jupiter"],
  availableIn: ["tower"]
};
const MYTHRIL_AXE = {
  id: "mythril-axe",
  name: "Mythril Axe",
  slot: "weapon",
  tier: "mythril",
  cost: 3200,
  statBonus: { atk: 46, spd: -2 },
  allowedElements: ["Mars"],
  unlocksAbility: "mythril-cleave"
};
const MYTHRIL_STAFF = {
  id: "mythril-staff",
  name: "Mythril Staff",
  slot: "weapon",
  tier: "mythril",
  cost: 3800,
  statBonus: { atk: 26, mag: 36 },
  allowedElements: ["Mercury"],
  unlocksAbility: "mythril-surge"
};
const MYTHRIL_LANCE = {
  id: "mythril-lance",
  name: "Mythril Lance",
  slot: "weapon",
  tier: "mythril",
  cost: 3100,
  statBonus: { atk: 42, spd: 3 },
  allowedElements: ["Jupiter"],
  unlocksAbility: "mythril-pierce"
};
const MYTHRIL_GREAVES = {
  id: "mythril-greaves",
  name: "Mythril Greaves",
  slot: "boots",
  tier: "mythril",
  cost: 2600,
  statBonus: { spd: 9, def: 10 },
  allowedElements: ["Venus", "Mars"]
};
const MYTHRIL_GAUNTLETS = {
  id: "mythril-gauntlets",
  name: "Mythril Gauntlets",
  slot: "accessory",
  tier: "mythril",
  cost: 4200,
  statBonus: { atk: 16, def: 12 },
  allowedElements: ["Venus", "Mars"],
  unlocksAbility: "mythril-strike"
};
const EARTH_WARDEN_SHIELD = {
  id: "earth-warden-shield",
  name: "Earth Warden Shield",
  slot: "accessory",
  tier: "silver",
  cost: 1900,
  statBonus: { def: 18, hp: 40 },
  allowedElements: ["Venus"],
  unlocksAbility: "earth-wall"
};
const GAIA_HELM = {
  id: "gaia-helm",
  name: "Gaia Helm",
  slot: "helm",
  tier: "mythril",
  cost: 3400,
  statBonus: { def: 30, hp: 25 },
  allowedElements: ["Venus"],
  unlocksAbility: "gaia-fortitude"
};
const FLAME_BRANDED_AXE = {
  id: "flame-branded-axe",
  name: "Flame Branded Axe",
  slot: "weapon",
  tier: "silver",
  cost: 2200,
  statBonus: { atk: 38, mag: 8, spd: -1 },
  allowedElements: ["Mars"],
  unlocksAbility: "flame-burst"
};
const INFERNO_GAUNTLETS = {
  id: "inferno-gauntlets",
  name: "Inferno Gauntlets",
  slot: "accessory",
  tier: "mythril",
  cost: 4e3,
  statBonus: { atk: 18, mag: 10, def: 6 },
  allowedElements: ["Mars"],
  unlocksAbility: "inferno-fist"
};
const FROST_SCEPTER = {
  id: "frost-scepter",
  name: "Frost Scepter",
  slot: "weapon",
  tier: "silver",
  cost: 2100,
  statBonus: { atk: 20, mag: 28, pp: 10 },
  allowedElements: ["Mercury"],
  unlocksAbility: "frost-nova"
};
const GLACIAL_ROBES = {
  id: "glacial-robes",
  name: "Glacial Robes",
  slot: "armor",
  tier: "mythril",
  cost: 4800,
  statBonus: { def: 40, mag: 15, hp: 60 },
  allowedElements: ["Mercury"]
};
const THUNDERBOLT_BOW = {
  id: "thunderbolt-bow",
  name: "Thunderbolt Bow",
  slot: "weapon",
  tier: "silver",
  cost: 2400,
  statBonus: { atk: 35, spd: 6, mag: 5 },
  allowedElements: ["Jupiter"],
  unlocksAbility: "lightning-shot"
};
const STORM_CIRCLET = {
  id: "storm-circlet",
  name: "Storm Circlet",
  slot: "helm",
  tier: "mythril",
  cost: 3600,
  statBonus: { def: 26, mag: 12, spd: 4, pp: 15 },
  allowedElements: ["Jupiter"],
  unlocksAbility: "storm-focus"
};
const ASTRAL_BLADE = {
  id: "astral-blade",
  name: "Astral Blade",
  slot: "weapon",
  tier: "artifact",
  cost: 0,
  statBonus: { atk: 70, mag: 20, spd: 8, pp: 20 },
  allowedElements: ["Venus", "Jupiter"],
  unlocksAbility: "astral-strike",
  availableIn: ["tower"]
};
const SHADOWFLAME_STAFF = {
  id: "shadowflame-staff",
  name: "Shadowflame Staff",
  slot: "weapon",
  tier: "artifact",
  cost: 0,
  statBonus: { atk: 35, mag: 55, pp: 30 },
  allowedElements: ["Mars", "Mercury"],
  unlocksAbility: "shadowflame",
  availableIn: ["tower"]
};
const AETHERIC_MANTLE = {
  id: "aetheric-mantle",
  name: "Aetheric Mantle",
  slot: "armor",
  tier: "artifact",
  cost: 0,
  statBonus: { def: 70, mag: 25, hp: 120, pp: 40 },
  allowedElements: ["Mercury", "Jupiter"],
  availableIn: ["tower"]
};
const EQUIPMENT = {
  // Swords
  "wooden-sword": WOODEN_SWORD,
  "bronze-sword": BRONZE_SWORD,
  "iron-sword": IRON_SWORD,
  "steel-sword": STEEL_SWORD,
  "silver-blade": SILVER_BLADE,
  "mythril-blade": MYTHRIL_BLADE,
  "gaia-blade": GAIA_BLADE,
  "sol-blade": SOL_BLADE,
  "eclipse-blade": ECLIPSE_BLADE,
  // Axes
  "wooden-axe": WOODEN_AXE,
  "battle-axe": BATTLE_AXE,
  "great-axe": GREAT_AXE,
  "titans-axe": TITANS_AXE,
  // Maces
  "mace": MACE,
  "heavy-mace": HEAVY_MACE,
  "demon-mace": DEMON_MACE,
  "mythril-axe": MYTHRIL_AXE,
  // Staves
  "wooden-staff": WOODEN_STAFF,
  "magic-rod": MAGIC_ROD,
  "shaman-rod": SHAMAN_ROD,
  "crystal-rod": CRYSTAL_ROD,
  "zodiac-wand": ZODIAC_WAND,
  "staff-of-ages": STAFF_OF_AGES,
  "mythril-staff": MYTHRIL_STAFF,
  "mythril-lance": MYTHRIL_LANCE,
  // Armor
  "cotton-shirt": COTTON_SHIRT,
  "leather-vest": LEATHER_VEST,
  "bronze-armor": BRONZE_ARMOR,
  "iron-armor": IRON_ARMOR,
  "steel-armor": STEEL_ARMOR,
  "silver-armor": SILVER_ARMOR,
  "mythril-armor": MYTHRIL_ARMOR,
  "dragon-scales": DRAGON_SCALES,
  "valkyrie-mail": VALKYRIE_MAIL,
  "glacial-robes": GLACIAL_ROBES,
  // Helms
  "leather-cap": LEATHER_CAP,
  "cloth-cap": CLOTH_CAP,
  "bronze-helm": BRONZE_HELM,
  "iron-helm": IRON_HELM,
  "steel-helm": STEEL_HELM,
  "silver-circlet": SILVER_CIRCLET,
  "mythril-crown": MYTHRIL_CROWN,
  "oracles-crown": ORACLES_CROWN,
  "glory-helm": GLORY_HELM,
  "gaia-helm": GAIA_HELM,
  "storm-circlet": STORM_CIRCLET,
  // Boots
  "leather-boots": LEATHER_BOOTS,
  "iron-boots": IRON_BOOTS,
  "steel-greaves": STEEL_GREAVES,
  "silver-greaves": SILVER_GREAVES,
  "hyper-boots": HYPER_BOOTS,
  "quick-boots": QUICK_BOOTS,
  "hermes-sandals": HERMES_SANDALS,
  "mythril-greaves": MYTHRIL_GREAVES,
  // Accessories
  "power-ring": POWER_RING,
  "guardian-ring": GUARDIAN_RING,
  "adepts-ring": ADEPTS_RING,
  "war-gloves": WAR_GLOVES,
  "spirit-gloves": SPIRIT_GLOVES,
  "lucky-medal": LUCKY_MEDAL,
  "elemental-star": ELEMENTAL_STAR,
  "dragons-eye": DRAGONS_EYE,
  "cleric-ring": CLERIC_RING,
  "iris-robe": IRIS_ROBE,
  "cosmos-shield": COSMOS_SHIELD,
  "mythril-gauntlets": MYTHRIL_GAUNTLETS,
  "earth-warden-shield": EARTH_WARDEN_SHIELD,
  "inferno-gauntlets": INFERNO_GAUNTLETS,
  // Element-specific weapons
  "flame-branded-axe": FLAME_BRANDED_AXE,
  "frost-scepter": FROST_SCEPTER,
  "thunderbolt-bow": THUNDERBOLT_BOW,
  // Tower-exclusive items
  "storm-cleaver": STORM_CLEAVER,
  "frost-reaver": FROST_REAVER,
  "volcanic-hammer": VOLCANIC_HAMMER,
  "gaia-greatshield": GAIA_GREATSHIELD,
  "tempest-armor": TEMPEST_ARMOR,
  "glacier-mail": GLACIER_MAIL,
  "inferno-plate": INFERNO_PLATE,
  "stormking-crown": STORMKING_CROWN,
  "frostqueen-tiara": FROSTQUEEN_TIARA,
  "volcanic-visor": VOLCANIC_VISOR,
  "windstrider-boots": WINDSTRIDER_BOOTS,
  "tidal-treads": TIDAL_TREADS,
  "tower-champions-ring": TOWER_CHAMPIONS_RING,
  "tower-masters-medallion": TOWER_MASTERS_MEDALLION,
  "astral-blade": ASTRAL_BLADE,
  "shadowflame-staff": SHADOWFLAME_STAFF,
  "aetheric-mantle": AETHERIC_MANTLE
};
export {
  ADEPTS_RING,
  AETHERIC_MANTLE,
  ASTRAL_BLADE,
  BATTLE_AXE,
  BRONZE_ARMOR,
  BRONZE_HELM,
  BRONZE_SWORD,
  CLERIC_RING,
  CLOTH_CAP,
  COSMOS_SHIELD,
  COTTON_SHIRT,
  CRYSTAL_ROD,
  DEMON_MACE,
  DRAGONS_EYE,
  DRAGON_SCALES,
  EARTH_WARDEN_SHIELD,
  ECLIPSE_BLADE,
  ELEMENTAL_STAR,
  EQUIPMENT,
  FLAME_BRANDED_AXE,
  FROSTQUEEN_TIARA,
  FROST_REAVER,
  FROST_SCEPTER,
  GAIA_BLADE,
  GAIA_GREATSHIELD,
  GAIA_HELM,
  GLACIAL_ROBES,
  GLACIER_MAIL,
  GLORY_HELM,
  GREAT_AXE,
  GUARDIAN_RING,
  HEAVY_MACE,
  HERMES_SANDALS,
  HYPER_BOOTS,
  INFERNO_GAUNTLETS,
  INFERNO_PLATE,
  IRIS_ROBE,
  IRON_ARMOR,
  IRON_BOOTS,
  IRON_HELM,
  IRON_SWORD,
  LEATHER_BOOTS,
  LEATHER_CAP,
  LEATHER_VEST,
  LUCKY_MEDAL,
  MACE,
  MAGIC_ROD,
  MYTHRIL_ARMOR,
  MYTHRIL_AXE,
  MYTHRIL_BLADE,
  MYTHRIL_CROWN,
  MYTHRIL_GAUNTLETS,
  MYTHRIL_GREAVES,
  MYTHRIL_LANCE,
  MYTHRIL_STAFF,
  ORACLES_CROWN,
  POWER_RING,
  QUICK_BOOTS,
  SHADOWFLAME_STAFF,
  SHAMAN_ROD,
  SILVER_ARMOR,
  SILVER_BLADE,
  SILVER_CIRCLET,
  SILVER_GREAVES,
  SOL_BLADE,
  SPIRIT_GLOVES,
  STAFF_OF_AGES,
  STEEL_ARMOR,
  STEEL_GREAVES,
  STEEL_HELM,
  STEEL_SWORD,
  STORMKING_CROWN,
  STORM_CIRCLET,
  STORM_CLEAVER,
  TEMPEST_ARMOR,
  THUNDERBOLT_BOW,
  TIDAL_TREADS,
  TITANS_AXE,
  TOWER_CHAMPIONS_RING,
  TOWER_MASTERS_MEDALLION,
  VALKYRIE_MAIL,
  VOLCANIC_HAMMER,
  VOLCANIC_VISOR,
  WAR_GLOVES,
  WINDSTRIDER_BOOTS,
  WOODEN_AXE,
  WOODEN_STAFF,
  WOODEN_SWORD,
  ZODIAC_WAND
};
//# sourceMappingURL=equipment-D9T235xI.js.map
