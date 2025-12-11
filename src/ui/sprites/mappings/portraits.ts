/**
 * Portrait Sprite Mapping
 * Maps character/speaker names to portrait sprite IDs
 */

/**
 * Maps character names to portrait sprite IDs
 * Uses available portraits from /sprites/icons/characters/ (100+ portraits available)
 */
export const PORTRAIT_MAP: Record<string, string> = {
  // Main Party Characters (both name variations) - DIRECT PATHS
  'Isaac': '/sprites/icons/characters/Isaac1.gif',
  'isaac': '/sprites/icons/characters/Isaac1.gif',
  'Garet': '/sprites/icons/characters/Garet1.gif',
  'garet': '/sprites/icons/characters/Garet1.gif',
  'Mia': '/sprites/icons/characters/Mia.gif',
  'mia': '/sprites/icons/characters/Mia.gif',
  'Ivan': '/sprites/icons/characters/Ivan.gif',
  'ivan': '/sprites/icons/characters/Ivan.gif',
  'Felix': '/sprites/icons/characters/Felix1.gif',
  'felix': '/sprites/icons/characters/Felix1.gif',
  'Jenna': '/sprites/icons/characters/Jenna1.gif',
  'jenna': '/sprites/icons/characters/Jenna1.gif',
  'Piers': '/sprites/icons/characters/Piers.gif',
  'piers': '/sprites/icons/characters/Piers.gif',
  'Sheba': '/sprites/icons/characters/Sheba.gif',
  'sheba': '/sprites/icons/characters/Sheba.gif',

  // Unit IDs to portraits - DIRECT PATHS
  'adept': '/sprites/icons/characters/Isaac1.gif',
  'war-mage': '/sprites/icons/characters/Garet1.gif',
  'mystic': '/sprites/icons/characters/Mia.gif',
  'ranger': '/sprites/icons/characters/Ivan.gif',
  'blaze': '/sprites/icons/characters/Garet1.gif',
  'karis': '/sprites/icons/characters/Ivan.gif',
  'sentinel': '/sprites/icons/characters/Felix1.gif',
  'stormcaller': '/sprites/icons/characters/Jenna1.gif',
  'tyrell': '/sprites/icons/characters/Garet1.gif',
  'tower-champion': '/sprites/icons/characters/Isaac1.gif',

  // Test units - DIRECT PATHS
  'test-warrior-1': '/sprites/icons/characters/Isaac1.gif',
  'test-warrior-2': '/sprites/icons/characters/Garet1.gif',
  'test-warrior-3': '/sprites/icons/characters/Mia.gif',
  'test-warrior-4': '/sprites/icons/characters/Ivan.gif',

  // Antagonists (available in catalog)
  'Saturos': 'saturos',
  'saturos': 'saturos',
  'Menardi': 'menardi',
  'menardi': 'menardi',
  'Alex': 'alex',
  'alex': 'alex',
  'Agatio': 'agatio',
  'agatio': 'agatio',
  'Karst': 'karst',
  'karst': 'karst',

  // Common NPCs (generic fallbacks)
  'Elder': 'elder',
  'elder': 'elder',
  'Merchant': 'armor-shopkeeper',
  'merchant': 'armor-shopkeeper',
  'Villager': 'villager',
  'villager': 'villager',

  // NPC Dialogue Characters
  'shopkeeper': 'armor-shopkeeper',
  'Shopkeeper': 'armor-shopkeeper',
  'healer': 'mia',              // Mercury healer uses Mia
  'Healer': 'mia',
  'blacksmith': 'armor-shopkeeper',
  'Blacksmith': 'armor-shopkeeper',
  'soldier': 'felix1',          // Veteran soldier uses Felix
  'Soldier': 'felix1',
  'child': 'isaac1',            // Young child uses young Isaac
  'Child': 'isaac1',
  'mysterious': 'alex',         // Mysterious stranger uses Alex
  'Mysterious': 'alex',

  // Djinn portraits
  'djinn': 'djinn-venus',
  'djinn-venus': 'djinn-venus',
  'djinn-mars': 'djinn-mars',
  'djinn-jupiter': 'djinn-jupiter',
  'djinn-mercury': 'djinn-mercury',

  // Enemy portraits (for house dialogues)
  'enemy-scout': 'saturos',     // Early enemies
  'enemy-soldier': 'saturos',
  'enemy-captain': 'agatio',    // Mid enemies
  'enemy-commander': 'karst',   // Late enemies
  'enemy-warlord': 'alex',      // Final boss

  // Emotional variants
  'isaac-angry': 'isaac1',      // Fallback to normal (no angry variant)

  // ========================================
  // New NPC Characters (Golden Sun portraits)
  // ========================================

  // Shopkeeper personalities
  'Grimwald': 'Briggs',              // Grumpy arms dealer - Briggs (gruff pirate)
  'grimwald': 'Briggs',
  'shopkeeper-grumpy': 'Briggs',
  'Tinkerbelle': 'Sheba',            // Enthusiastic inventor - Sheba (energetic)
  'tinkerbelle': 'Sheba',
  'shopkeeper-inventor': 'Sheba',
  'Goldwyn': 'Babi',                 // Shrewd merchant - Babi (cunning ruler)
  'goldwyn': 'Babi',
  'shopkeeper-shrewd': 'Babi',
  'Old Rusk': 'Donpa',               // Retired warrior - Donpa (elder warrior)
  'old rusk': 'Donpa',
  'shopkeeper-warrior': 'Donpa',
  'Whisper': 'Alex',                 // Mysterious artifact dealer - Alex (enigmatic)
  'whisper': 'Alex',
  'shopkeeper-mysterious': 'Alex',

  // Village NPCs
  'Pellias': 'Kraden',               // Anxious scholar - Kraden (scholar)
  'pellias': 'Kraden',
  'Scholar Pellias': 'Kraden',
  'scholar': 'Kraden',
  'Gord': 'Dodonpa',                 // Bitter farmer - Dodonpa (gruff villager)
  'gord': 'Dodonpa',
  'Farmer Gord': 'Dodonpa',
  'farmer': 'Dodonpa',
  'Mildred': 'Dora',                 // Optimistic baker - Dora (Isaac's mother, warm)
  'mildred': 'Dora',
  'Baker Mildred': 'Dora',
  'baker': 'Dora',
  'Dain': 'Iodem',                   // Traumatized guard - Iodem (soldier)
  'dain': 'Iodem',
  'Former Guard Dain': 'Iodem',
  'guard': 'Iodem',
  'Lyra': 'Mia',                     // Cheerful musician - Mia (gentle, artistic)
  'lyra': 'Mia',
  'Minstrel Lyra': 'Mia',
  'musician': 'Mia',
  'Elene': "Jenna's Mother",         // Worried mother - Jenna's Mother
  'elene': "Jenna's Mother",
  'Mother Elene': "Jenna's Mother",
  'mother': "Jenna's Mother",
  'Kira': 'Jenna1',                  // Defiant teenager - Jenna (fiery, young)
  'kira': 'Jenna1',
  'teenager': 'Jenna1',
  'Bartleby': "Garet's Grandfather", // Drunk storyteller - Garet's Grandfather (elder)
  'bartleby': "Garet's Grandfather",
  'Old Bartleby': "Garet's Grandfather",
  'drunk': "Garet's Grandfather",
  'Selara': 'Master Hama',           // Stern priestess - Master Hama (wise, formal)
  'selara': 'Master Hama',
  'Priestess Selara': 'Master Hama',
  'priestess': 'Master Hama',

  // Additional NPC aliases
  'Healer Mira': 'GreatHealer',      // Village healer - GreatHealer portrait
  'healer-mira': 'GreatHealer',
  'Blacksmith Torren': 'Weapon Shopkeeper', // Blacksmith - Weapon shopkeeper
  'blacksmith-torren': 'Weapon Shopkeeper',
  'Veteran Marcus': 'Felix1',        // Veteran soldier
  'veteran-marcus': 'Felix1',
  'Merchant Thalia': 'Lady Layana',  // Traveling merchant - Lady Layana
  'merchant-thalia': 'Lady Layana',
  'Young Pip': 'Young Felix',        // Hopeful child - Young Felix
  'young-pip': 'Young Felix',

  // Boss/enemy portraits
  'enemy-golem': 'Saturos',          // Stone Guardian
  'enemy-witch': 'Karst',            // Flame Witch (Pyralis)
  'enemy-assassin': 'Alex',          // Wind Assassin (Zephyra)
  'enemy-knight': 'Agatio',          // Frost Knight (Glacius)
};

/**
 * Get portrait sprite ID for a character/speaker
 * Returns fallback if character not recognized
 *
 * @param name - Character name or unit ID
 * @returns Sprite ID for the character's portrait
 */
export function getPortraitSprite(name: string): string {
  // Try exact match first
  const exactMatch = PORTRAIT_MAP[name];
  if (exactMatch) {
    return exactMatch;
  }

  // Try lowercase match
  const lowerName = name.toLowerCase();
  const lowerMatch = PORTRAIT_MAP[lowerName];
  if (lowerMatch) {
    return lowerMatch;
  }

  // Default fallback - use Isaac portrait
  return 'isaac1';
}

/**
 * Check if a character has a mapped portrait
 */
export function hasPortrait(name: string): boolean {
  return name in PORTRAIT_MAP || name.toLowerCase() in PORTRAIT_MAP;
}

/**
 * Get all mapped character names
 */
export function getMappedCharacters(): string[] {
  return Object.keys(PORTRAIT_MAP);
}
