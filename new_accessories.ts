// 43 NEW ACCESSORY ITEMS TO ADD TO equipment.ts
// Insert these AFTER export const CLEAR_BRACELET and BEFORE // SHIELDS section

export const JESTERS_ARMLET: Equipment = {
  id: 'jesters-armlet',
  name: "Jester's Armlet",
  slot: 'accessory',
  tier: 'bronze',
  cost: 240,
  statBonus: { spd: 4, mag: 4 },
  allowedElements: ['Jupiter', 'Mercury'],
};

export const AROMA_RING: Equipment = {
  id: 'aroma-ring',
  name: 'Aroma Ring',
  slot: 'accessory',
  tier: 'basic',
  cost: 150,
  statBonus: { hp: 15, pp: 5 },
  allowedElements: ['Venus', 'Mercury', 'Jupiter'],
};

export const SLEEP_RING: Equipment = {
  id: 'sleep-ring',
  name: 'Sleep Ring',
  slot: 'accessory',
  tier: 'bronze',
  cost: 280,
  statBonus: { def: 6, pp: 8 },
  allowedElements: ['Mercury', 'Jupiter'],
};

export const CASUAL_SHIRT: Equipment = {
  id: 'casual-shirt',
  name: 'Casual Shirt',
  slot: 'accessory',
  tier: 'basic',
  cost: 70,
  statBonus: { hp: 8, def: 3 },
  allowedElements: ['Venus', 'Mars', 'Mercury', 'Jupiter'],
};

export const TRAVEL_VEST: Equipment = {
  id: 'travel-vest',
  name: 'Travel Vest',
  slot: 'accessory',
  tier: 'basic',
  cost: 110,
  statBonus: { spd: 2, hp: 12 },
  allowedElements: ['Jupiter', 'Venus'],
};

export const ELVEN_SHIRT: Equipment = {
  id: 'elven-shirt',
  name: 'Elven Shirt',
  slot: 'accessory',
  tier: 'bronze',
  cost: 260,
  statBonus: { mag: 7, spd: 3 },
  allowedElements: ['Jupiter'],
};

export const HERBED_SHIRT: Equipment = {
  id: 'herbed-shirt',
  name: 'Herbed Shirt',
  slot: 'accessory',
  tier: 'iron',
  cost: 450,
  statBonus: { hp: 25, pp: 10 },
  allowedElements: ['Venus', 'Mercury'],
};

export const ADEPTS_CLOTHES: Equipment = {
  id: 'adepts-clothes',
  name: "Adept's Clothes",
  slot: 'accessory',
  tier: 'iron',
  cost: 480,
  statBonus: { mag: 9, pp: 12, def: 5 },
  allowedElements: ['Venus', 'Jupiter'],
};

export const SILVER_VEST: Equipment = {
  id: 'silver-vest',
  name: 'Silver Vest',
  slot: 'accessory',
  tier: 'silver',
  cost: 1650,
  statBonus: { def: 10, hp: 35, spd: 4 },
  allowedElements: ['Venus', 'Jupiter'],
};

export const MYTHRIL_CLOTHES: Equipment = {
  id: 'mythril-clothes',
  name: 'Mythril Clothes',
  slot: 'accessory',
  tier: 'mythril',
  cost: 3900,
  statBonus: { def: 14, mag: 11, pp: 18, hp: 40 },
  allowedElements: ['Venus', 'Jupiter'],
  elementalResist: 0.1,
};

export const GOLDEN_SHIRT: Equipment = {
  id: 'golden-shirt',
  name: 'Golden Shirt',
  slot: 'accessory',
  tier: 'silver',
  cost: 1750,
  statBonus: { def: 12, mag: 10, hp: 30 },
  allowedElements: ['Venus', 'Jupiter'],
};

export const FESTIVAL_COAT: Equipment = {
  id: 'festival-coat',
  name: 'Festival Coat',
  slot: 'accessory',
  tier: 'steel',
  cost: 820,
  statBonus: { spd: 5, mag: 8, pp: 10 },
  allowedElements: ['Jupiter'],
};

export const NINJA_GARB: Equipment = {
  id: 'ninja-garb',
  name: 'Ninja Garb',
  slot: 'accessory',
  tier: 'steel',
  cost: 980,
  statBonus: { spd: 8, atk: 6, def: 4 },
  allowedElements: ['Jupiter'],
};

export const STORM_GEAR: Equipment = {
  id: 'storm-gear',
  name: 'Storm Gear',
  slot: 'accessory',
  tier: 'mythril',
  cost: 4250,
  statBonus: { mag: 16, spd: 6, pp: 20 },
  allowedElements: ['Jupiter'],
  elementalResist: 0.15,
};

export const FUR_COAT: Equipment = {
  id: 'fur-coat',
  name: 'Fur Coat',
  slot: 'accessory',
  tier: 'bronze',
  cost: 290,
  statBonus: { hp: 20, def: 6 },
  allowedElements: ['Venus', 'Mars'],
};

export const KIMONO: Equipment = {
  id: 'kimono',
  name: 'Kimono',
  slot: 'accessory',
  tier: 'iron',
  cost: 510,
  statBonus: { mag: 10, def: 7, pp: 8 },
  allowedElements: ['Mercury', 'Jupiter'],
};

export const FLORAL_DRESS: Equipment = {
  id: 'floral-dress',
  name: 'Floral Dress',
  slot: 'accessory',
  tier: 'steel',
  cost: 760,
  statBonus: { mag: 11, pp: 14, hp: 20 },
  allowedElements: ['Mercury', 'Venus'],
};

export const FAERY_VEST: Equipment = {
  id: 'faery-vest',
  name: 'Faery Vest',
  slot: 'accessory',
  tier: 'silver',
  cost: 1890,
  statBonus: { mag: 13, spd: 7, pp: 16 },
  allowedElements: ['Jupiter'],
};

export const DIVINE_CAMISOLE: Equipment = {
  id: 'divine-camisole',
  name: 'Divine Camisole',
  slot: 'accessory',
  tier: 'legendary',
  cost: 7600,
  statBonus: { mag: 18, pp: 25, def: 14, hp: 50 },
  allowedElements: ['Mercury', 'Jupiter'],
  elementalResist: 0.2,
};

export const ERINYES_TUNIC: Equipment = {
  id: 'erinyes-tunic',
  name: 'Erinyes Tunic',
  slot: 'accessory',
  tier: 'legendary',
  cost: 8100,
  statBonus: { atk: 14, spd: 10, def: 12 },
  allowedElements: ['Jupiter'],
  elementalResist: 0.15,
};

export const FULL_METAL_VEST: Equipment = {
  id: 'full-metal-vest',
  name: 'Full Metal Vest',
  slot: 'accessory',
  tier: 'mythril',
  cost: 4400,
  statBonus: { def: 18, atk: 10, hp: 35 },
  allowedElements: ['Mars', 'Venus'],
};

export const TRITONS_WARD: Equipment = {
  id: 'tritons-ward',
  name: "Triton's Ward",
  slot: 'accessory',
  tier: 'legendary',
  cost: 8300,
  statBonus: { mag: 20, pp: 28, def: 16, hp: 55 },
  allowedElements: ['Mercury'],
  elementalResist: 0.25,
};

export const CIRCLET: Equipment = {
  id: 'circlet',
  name: 'Circlet',
  slot: 'accessory',
  tier: 'bronze',
  cost: 270,
  statBonus: { mag: 6, pp: 6 },
  allowedElements: ['Mercury', 'Jupiter'],
};

export const PLATINUM_CIRCLET: Equipment = {
  id: 'platinum-circlet',
  name: 'Platinum Circlet',
  slot: 'accessory',
  tier: 'silver',
  cost: 1820,
  statBonus: { mag: 12, pp: 14, def: 8 },
  allowedElements: ['Mercury', 'Jupiter'],
};

export const ASTRAL_CIRCLET: Equipment = {
  id: 'astral-circlet',
  name: 'Astral Circlet',
  slot: 'accessory',
  tier: 'mythril',
  cost: 4150,
  statBonus: { mag: 17, pp: 22, spd: 5 },
  allowedElements: ['Jupiter'],
  elementalResist: 0.12,
};

export const BRILLIANT_CIRCLET: Equipment = {
  id: 'brilliant-circlet',
  name: 'Brilliant Circlet',
  slot: 'accessory',
  tier: 'legendary',
  cost: 7900,
  statBonus: { mag: 19, pp: 26, def: 12 },
  allowedElements: ['Mercury', 'Jupiter'],
  elementalResist: 0.18,
};

export const CLARITY_CIRCLET: Equipment = {
  id: 'clarity-circlet',
  name: 'Clarity Circlet',
  slot: 'accessory',
  tier: 'silver',
  cost: 1700,
  statBonus: { mag: 11, pp: 15 },
  allowedElements: ['Mercury', 'Jupiter'],
};

export const PSYCHIC_CIRCLET: Equipment = {
  id: 'psychic-circlet',
  name: 'Psychic Circlet',
  slot: 'accessory',
  tier: 'mythril',
  cost: 3950,
  statBonus: { mag: 16, pp: 20, spd: 4 },
  allowedElements: ['Jupiter', 'Mercury'],
};

export const PURE_CIRCLET: Equipment = {
  id: 'pure-circlet',
  name: 'Pure Circlet',
  slot: 'accessory',
  tier: 'steel',
  cost: 880,
  statBonus: { mag: 10, pp: 12, def: 5 },
  allowedElements: ['Mercury', 'Jupiter'],
};

export const DEMON_CIRCLET: Equipment = {
  id: 'demon-circlet',
  name: 'Demon Circlet',
  slot: 'accessory',
  tier: 'mythril',
  cost: 4050,
  statBonus: { mag: 15, atk: 8, pp: 18 },
  allowedElements: ['Mars', 'Jupiter'],
};

export const GLITTERING_TIARA: Equipment = {
  id: 'glittering-tiara',
  name: 'Glittering Tiara',
  slot: 'accessory',
  tier: 'silver',
  cost: 1950,
  statBonus: { mag: 13, pp: 17, def: 9 },
  allowedElements: ['Mercury', 'Jupiter'],
  elementalResist: 0.1,
};

export const BERSERKER_BAND: Equipment = {
  id: 'berserker-band',
  name: 'Berserker Band',
  slot: 'accessory',
  tier: 'steel',
  cost: 920,
  statBonus: { atk: 12, def: 6 },
  allowedElements: ['Mars', 'Venus'],
};

export const LEATHER_GLOVES: Equipment = {
  id: 'leather-gloves',
  name: 'Leather Gloves',
  slot: 'accessory',
  tier: 'basic',
  cost: 95,
  statBonus: { atk: 4, def: 2 },
  allowedElements: ['Venus', 'Mars', 'Jupiter'],
};

export const PADDED_GLOVES: Equipment = {
  id: 'padded-gloves',
  name: 'Padded Gloves',
  slot: 'accessory',
  tier: 'bronze',
  cost: 210,
  statBonus: { def: 5, hp: 12 },
  allowedElements: ['Venus', 'Mars'],
};

export const BATTLE_GLOVES: Equipment = {
  id: 'battle-gloves',
  name: 'Battle Gloves',
  slot: 'accessory',
  tier: 'iron',
  cost: 460,
  statBonus: { atk: 9, def: 5 },
  allowedElements: ['Mars', 'Venus'],
};

export const VAMBRACE: Equipment = {
  id: 'vambrace',
  name: 'Vambrace',
  slot: 'accessory',
  tier: 'steel',
  cost: 870,
  statBonus: { atk: 11, def: 8 },
  allowedElements: ['Venus', 'Mars'],
};

export const GAUNTLETS: Equipment = {
  id: 'gauntlets',
  name: 'Gauntlets',
  slot: 'accessory',
  tier: 'steel',
  cost: 940,
  statBonus: { atk: 13, def: 9 },
  allowedElements: ['Venus', 'Mars'],
};

export const CRAFTED_GLOVES: Equipment = {
  id: 'crafted-gloves',
  name: 'Crafted Gloves',
  slot: 'accessory',
  tier: 'silver',
  cost: 1720,
  statBonus: { atk: 12, mag: 8, def: 6 },
  allowedElements: ['Venus', 'Jupiter'],
};

export const AURA_GLOVES: Equipment = {
  id: 'aura-gloves',
  name: 'Aura Gloves',
  slot: 'accessory',
  tier: 'silver',
  cost: 1880,
  statBonus: { mag: 14, pp: 16, def: 7 },
  allowedElements: ['Mercury', 'Jupiter'],
};

export const AERIAL_GLOVES: Equipment = {
  id: 'aerial-gloves',
  name: 'Aerial Gloves',
  slot: 'accessory',
  tier: 'mythril',
  cost: 3850,
  statBonus: { spd: 9, mag: 12, atk: 8 },
  allowedElements: ['Jupiter'],
  elementalResist: 0.1,
};

export const RIOT_GLOVES: Equipment = {
  id: 'riot-gloves',
  name: 'Riot Gloves',
  slot: 'accessory',
  tier: 'mythril',
  cost: 4100,
  statBonus: { atk: 17, def: 11 },
  allowedElements: ['Mars', 'Venus'],
};

export const TITAN_GLOVES: Equipment = {
  id: 'titan-gloves',
  name: 'Titan Gloves',
  slot: 'accessory',
  tier: 'legendary',
  cost: 7700,
  statBonus: { atk: 20, def: 14, hp: 45 },
  allowedElements: ['Mars', 'Venus'],
  elementalResist: 0.15,
};

export const BIG_BANG_GLOVES: Equipment = {
  id: 'big-bang-gloves',
  name: 'Big Bang Gloves',
  slot: 'accessory',
  tier: 'artifact',
  cost: 15000,
  statBonus: { atk: 25, mag: 20, def: 18, hp: 60 },
  allowedElements: ['Mars', 'Venus', 'Jupiter'],
  elementalResist: 0.2,
  unlocksAbility: 'big-bang-strike',
};

// REGISTRY ADDITIONS (add to EQUIPMENT object at bottom):
/*
  'jesters-armlet': JESTERS_ARMLET,
  'aroma-ring': AROMA_RING,
  'sleep-ring': SLEEP_RING,
  'casual-shirt': CASUAL_SHIRT,
  'travel-vest': TRAVEL_VEST,
  'elven-shirt': ELVEN_SHIRT,
  'herbed-shirt': HERBED_SHIRT,
  'adepts-clothes': ADEPTS_CLOTHES,
  'silver-vest': SILVER_VEST,
  'mythril-clothes': MYTHRIL_CLOTHES,
  'golden-shirt': GOLDEN_SHIRT,
  'festival-coat': FESTIVAL_COAT,
  'ninja-garb': NINJA_GARB,
  'storm-gear': STORM_GEAR,
  'fur-coat': FUR_COAT,
  'kimono': KIMONO,
  'floral-dress': FLORAL_DRESS,
  'faery-vest': FAERY_VEST,
  'divine-camisole': DIVINE_CAMISOLE,
  'erinyes-tunic': ERINYES_TUNIC,
  'full-metal-vest': FULL_METAL_VEST,
  'tritons-ward': TRITONS_WARD,
  'circlet': CIRCLET,
  'platinum-circlet': PLATINUM_CIRCLET,
  'astral-circlet': ASTRAL_CIRCLET,
  'brilliant-circlet': BRILLIANT_CIRCLET,
  'clarity-circlet': CLARITY_CIRCLET,
  'psychic-circlet': PSYCHIC_CIRCLET,
  'pure-circlet': PURE_CIRCLET,
  'demon-circlet': DEMON_CIRCLET,
  'glittering-tiara': GLITTERING_TIARA,
  'berserker-band': BERSERKER_BAND,
  'leather-gloves': LEATHER_GLOVES,
  'padded-gloves': PADDED_GLOVES,
  'battle-gloves': BATTLE_GLOVES,
  'vambrace': VAMBRACE,
  'gauntlets': GAUNTLETS,
  'crafted-gloves': CRAFTED_GLOVES,
  'aura-gloves': AURA_GLOVES,
  'aerial-gloves': AERIAL_GLOVES,
  'riot-gloves': RIOT_GLOVES,
  'titan-gloves': TITAN_GLOVES,
  'big-bang-gloves': BIG_BANG_GLOVES,
*/
