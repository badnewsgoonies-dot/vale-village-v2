import { ENCOUNTERS } from '@/data/definitions/encounters';

/**
 * Battle sprite mappings
 * Provides deterministic path IDs for battle unit rendering.
 *
 * The mapping only references actual GIFs that ship with the repo. Missing units
 * or enemies return `null`, allowing `BattleUnitSprite` to show a placeholder.
 */

export type BattleSpriteState = 'idle' | 'attack' | 'hit';

type SpriteStateMap = Record<BattleSpriteState, string>;

const EARLY_HOUSE_MAX = 5;
const EARLY_SPECIAL_ENCOUNTERS = new Set(['vs1-garet']);

function isEarlyEncounterId(encounterId: string): boolean {
  const match = encounterId.match(/^house-(\d+)/);
  if (match) {
    return Number(match[1]) <= EARLY_HOUSE_MAX;
  }
  return EARLY_SPECIAL_ENCOUNTERS.has(encounterId);
}

function collectEarlyEnemyIds(): string[] {
  const ids = new Set<string>();
  for (const [encounterId, encounter] of Object.entries(ENCOUNTERS)) {
    if (!isEarlyEncounterId(encounterId)) {
      continue;
    }
    encounter.enemies.forEach(enemyId => ids.add(enemyId));
  }
  return Array.from(ids).sort();
}

function makePlayerSpritePaths(character: 'Isaac' | 'Garet' | 'Ivan' | 'Mia', weapon: 'lBlade' | 'Axe' | 'Staff' | 'Mace'): SpriteStateMap {
  const base = `/sprites/battle/party/${character.toLowerCase()}/${character}_${weapon}`;
  return {
    idle: `${base}_Back.gif`,
    attack: `${base}_Attack1.gif`,
    hit: `${base}_HitBack.gif`,
  };
}

function makeSinglePose(path: string): SpriteStateMap {
  return {
    idle: path,
    attack: path,
    hit: path,
  };
}

const PLAYER_SPRITES: Record<string, SpriteStateMap> = {
  // Canonical roster
  'adept': makePlayerSpritePaths('Isaac', 'lBlade'),
  'war-mage': makePlayerSpritePaths('Garet', 'Axe'),
  'mystic': makePlayerSpritePaths('Mia', 'Staff'),
  'ranger': makePlayerSpritePaths('Ivan', 'Staff'),
  'sentinel': makePlayerSpritePaths('Isaac', 'lBlade'),
  'blaze': makePlayerSpritePaths('Garet', 'Axe'),
  'karis': makePlayerSpritePaths('Mia', 'Staff'),
  'tyrell': makePlayerSpritePaths('Garet', 'Axe'),
  'stormcaller': makePlayerSpritePaths('Ivan', 'Staff'),
  'felix': makePlayerSpritePaths('Isaac', 'lBlade'),
  'tower-champion': makePlayerSpritePaths('Isaac', 'lBlade'),

  // Development/test units map onto the starter party for visuals
  'test-warrior-1': makePlayerSpritePaths('Isaac', 'lBlade'),
  'test-warrior-2': makePlayerSpritePaths('Garet', 'Axe'),
  'test-warrior-3': makePlayerSpritePaths('Mia', 'Staff'),
  'test-warrior-4': makePlayerSpritePaths('Ivan', 'Staff'),
};

const ENEMY_SPRITES: Record<string, SpriteStateMap> = {
  // Test goblins + tutorial encounters
  'enemy-1': makeSinglePose('/sprites/battle/enemies/Goblin.gif'),
  'enemy-2': makeSinglePose('/sprites/battle/enemies/Alec_Goblin.gif'),
  'garet-enemy': makeSinglePose('/sprites/battle/enemies/Brigand.gif'),
  'war-mage': makeSinglePose('/sprites/battle/enemies/Brigand.gif'),

  // Houses 2-5 (Act 1 focus)
  'earth-scout': makeSinglePose('/sprites/battle/enemies/Goblin.gif'),
  'venus-wolf': makeSinglePose('/sprites/battle/enemies/Wild_Wolf.gif'),
  'venus-beetle': makeSinglePose('/sprites/battle/enemies/Punch_Ant.gif'),
  'flame-scout': makeSinglePose('/sprites/battle/enemies/Hobgoblin.gif'),
  'mars-wolf': makeSinglePose('/sprites/battle/enemies/Dire_Wolf.gif'),
  'frost-scout': makeSinglePose('/sprites/battle/enemies/Mini-Goblin.gif'),
  'mercury-wolf': makeSinglePose('/sprites/battle/enemies/Wolfkin.gif'),
  'gale-scout': makeSinglePose('/sprites/battle/enemies/Alec_Goblin.gif'),
  'jupiter-wolf': makeSinglePose('/sprites/battle/enemies/Wolfkin_Cub.gif'),
  'terra-soldier': makeSinglePose('/sprites/battle/enemies/Stone_Soldier.gif'),
  'venus-bear': makeSinglePose('/sprites/battle/enemies/Grizzly.gif'),
  'wind-soldier': makeSinglePose('/sprites/battle/enemies/Tornado_Lizard.gif'),
  'jupiter-bear': makeSinglePose('/sprites/battle/enemies/Grizzly.gif'),
  'tide-soldier': makeSinglePose('/sprites/battle/enemies/Merman.gif'),
  'mercury-bear': makeSinglePose('/sprites/battle/enemies/Grizzly.gif'),
  'ice-elemental': makeSinglePose('/sprites/battle/enemies/Ice_Gargoyle.gif'),
  'blaze-soldier': makeSinglePose('/sprites/battle/enemies/Salamander.gif'),
  'mars-bear': makeSinglePose('/sprites/battle/enemies/Grizzly.gif'),
  'flame-elemental': makeSinglePose('/sprites/battle/enemies/Fire_Worm.gif'),
  'stone-captain': makeSinglePose('/sprites/battle/enemies/Living_Statue.gif'),
  'rock-elemental': makeSinglePose('/sprites/battle/enemies/Earth_Golem.gif'),
  'inferno-captain': makeSinglePose('/sprites/battle/enemies/Grand_Chimera.gif'),
  'phoenix': makeSinglePose('/sprites/battle/enemies/Phoenix.gif'),
  'glacier-captain': makeSinglePose('/sprites/battle/enemies/Ice_Gargoyle.gif'),
  'blizzard-warlord': makeSinglePose('/sprites/battle/enemies/Ice_Gargoyle.gif'),
  'leviathan': makeSinglePose('/sprites/battle/enemies/Man_o_War.gif'),
  'thunder-captain': makeSinglePose('/sprites/battle/enemies/Thunder_Lizard.gif'),
  'thunderbird': makeSinglePose('/sprites/battle/enemies/Roc.gif'),
  'lightning-commander': makeSinglePose('/sprites/battle/enemies/Thunder_Lizard.gif'),
  'storm-elemental': makeSinglePose('/sprites/battle/enemies/Tornado_Lizard.gif'),
  'mountain-commander': makeSinglePose('/sprites/battle/enemies/Grand_Golem.gif'),
  'granite-warlord': makeSinglePose('/sprites/battle/enemies/Grand_Golem.gif'),
  'basilisk': makeSinglePose('/sprites/battle/enemies/Lizard_King.gif'),
  'fire-commander': makeSinglePose('/sprites/battle/enemies/Red_Demon.gif'),
  'volcano-warlord': makeSinglePose('/sprites/battle/enemies/Grand_Chimera.gif'),
  'storm-commander': makeSinglePose('/sprites/battle/enemies/Tornado_Lizard.gif'),
  'hydra': makeSinglePose('/sprites/battle/enemies/Hydra.gif'),
  'overseer': makeSinglePose('/sprites/battle/enemies/Chimera.gif'),
  'chimera': makeSinglePose('/sprites/battle/enemies/Chimera.gif'),
  'tempest-warlord': makeSinglePose('/sprites/battle/enemies/Thunder_Lizard.gif'),

  // Existing misc mappings
  'bandit-minion': makeSinglePose('/sprites/battle/enemies/Thief.gif'),
  'bandit-captain': makeSinglePose('/sprites/battle/enemies/Brigand.gif'),
  'sentinel-enemy': makeSinglePose('/sprites/battle/enemies/Living_Armor.gif'),
  'stormcaller-enemy': makeSinglePose('/sprites/battle/enemies/Ghost_Mage.gif'),
  'mercury-slime': makeSinglePose('/sprites/battle/enemies/Slime.gif'),
  'mars-bandit': makeSinglePose('/sprites/battle/enemies/Brigand.gif'),
  'mars-sprite': makeSinglePose('/sprites/battle/enemies/Spirit.gif'),
  'mercury-sprite': makeSinglePose('/sprites/battle/enemies/Will_Head.gif'),
  'venus-sprite': makeSinglePose('/sprites/battle/enemies/Faery.gif'),
  'jupiter-sprite': makeSinglePose('/sprites/battle/enemies/Pixie.gif'),

  // Counter-Strategy Support Enemies
  'frost-mystic': makeSinglePose('/sprites/battle/enemies/Gnome_Mage.gif'),
  'gale-priest': makeSinglePose('/sprites/battle/enemies/Gnome_Wizard.gif'),
  'stone-guardian': makeSinglePose('/sprites/battle/enemies/Golem.gif'),
  'ember-cleric': makeSinglePose('/sprites/battle/enemies/Gnome.gif'),
  'earth-shaman': makeSinglePose('/sprites/battle/enemies/Mole_Mage.gif'),
  'tide-enchanter': makeSinglePose('/sprites/battle/enemies/Siren.gif'),
  'frost-oracle': makeSinglePose('/sprites/battle/enemies/Lich.gif'),
  'terra-warden': makeSinglePose('/sprites/battle/enemies/Living_Armor.gif'),
  'flame-herald': makeSinglePose('/sprites/battle/enemies/Mad_Demon.gif'),

  // Undead Category
  'skeleton-warrior': makeSinglePose('/sprites/battle/enemies/Skeleton.gif'),
  'ghost-wisp': makeSinglePose('/sprites/battle/enemies/Willowisp.gif'),
  'zombie-hound': makeSinglePose('/sprites/battle/enemies/Dread_Hound.gif'),
  'bone-mage': makeSinglePose('/sprites/battle/enemies/Bone_Fighter.gif'),

  // Golem Category
  'clay-golem': makeSinglePose('/sprites/battle/enemies/Clay_Gargoyle.gif'),
  'iron-golem': makeSinglePose('/sprites/battle/enemies/Golem.gif'),
  'crystal-golem': makeSinglePose('/sprites/battle/enemies/Ice_Gargoyle.gif'),
  'storm-golem': makeSinglePose('/sprites/battle/enemies/Gargoyle.gif'),

  // Avian Category
  'wind-hawk': makeSinglePose('/sprites/battle/enemies/Harpy.gif'),
  'fire-eagle': makeSinglePose('/sprites/battle/enemies/Wild_Gryphon.gif'),
  'ice-owl': makeSinglePose('/sprites/battle/enemies/Wonder_Bird.gif'),
  'stone-roc': makeSinglePose('/sprites/battle/enemies/Roc.gif'),

  // Mercury Beasts (Tier 3-4)
  'frost-serpent': makeSinglePose('/sprites/battle/enemies/Chimera_Worm.gif'),
  'aqua-drake': makeSinglePose('/sprites/battle/enemies/Sky_Dragon.gif'),
  'tidal-wraith': makeSinglePose('/sprites/battle/enemies/Ghost.gif'),
  'glacier-wyrm': makeSinglePose('/sprites/battle/enemies/Wyvern.gif'),

  // Jupiter Beasts (Tier 3-4)
  'storm-raven': makeSinglePose('/sprites/battle/enemies/Harridan.gif'),
  'lightning-lynx': makeSinglePose('/sprites/battle/enemies/Cerebus.gif'),
  'cyclone-djinni': makeSinglePose('/sprites/battle/enemies/Horned_Ghost.gif'),
  'tempest-dragon': makeSinglePose('/sprites/battle/enemies/Cruel_Dragon.gif'),

  // Boss Variants (Tier 5)
  'alpha-phoenix': makeSinglePose('/sprites/battle/enemies/Phoenix.gif'),
  'elder-basilisk': makeSinglePose('/sprites/battle/enemies/Earth_Lizard.gif'),
  'kraken': makeSinglePose('/sprites/battle/enemies/Calamar.gif'),
  'storm-titan': makeSinglePose('/sprites/battle/enemies/Minotaurus.gif'),

  // Tier 5 Enemies
  'void-specter': makeSinglePose('/sprites/battle/enemies/Ghost_Army.gif'),
  'frost-lich': makeSinglePose('/sprites/battle/enemies/Lich_2.gif'),
  'magma-colossus': makeSinglePose('/sprites/battle/enemies/Grand_Golem.gif'),
  'terra-guardian': makeSinglePose('/sprites/battle/enemies/Minos_Warrior.gif'),

  // Mercury Elite Bosses (Tower Floor 15-20)
  'arctic-sovereign': makeSinglePose('/sprites/battle/enemies/Druj.gif'),
  'neptune-warden': makeSinglePose('/sprites/battle/enemies/Gillman.gif'),
  'abyssal-emperor': makeSinglePose('/sprites/battle/enemies/Turtle_Dragon.gif'),

  // Jupiter Elite Bosses (Tower Floor 15-20)
  'stratosphere-lord': makeSinglePose('/sprites/battle/enemies/Magicore.gif'),
  'zeus-avatar': makeSinglePose('/sprites/battle/enemies/Manticore_King.gif'),
  'celestial-fury': makeSinglePose('/sprites/battle/enemies/Sky_Dragon.gif'),

  // Mercury Tier 5 Variants
  'permafrost-golem': makeSinglePose('/sprites/battle/enemies/Ice_Gargoyle.gif'),
  'tundra-serpent': makeSinglePose('/sprites/battle/enemies/Angle_Worm.gif'),
  'polar-guardian': makeSinglePose('/sprites/battle/enemies/Living_Statue.gif'),

  // Jupiter Tier 5 Variants
  'voltage-chimera': makeSinglePose('/sprites/battle/enemies/Chimera_Mage.gif'),
  'monsoon-drake': makeSinglePose('/sprites/battle/enemies/Wyvern_Chick.gif'),
  'aurora-elemental': makeSinglePose('/sprites/battle/enemies/Virago.gif'),
  'vortex-sentinel': makeSinglePose('/sprites/battle/enemies/Living_Armor.gif'),

  // Hybrid Tier 5 Bosses
  'maelstrom-beast': makeSinglePose('/sprites/battle/enemies/Slime_Beast.gif'),
  'thunderstorm-colossus': makeSinglePose('/sprites/battle/enemies/Bombander.gif'),

  // Legacy aliases (point to same sprites as canonical IDs)
  'slime': makeSinglePose('/sprites/battle/enemies/Slime.gif'),
  'wolf': makeSinglePose('/sprites/battle/enemies/Wild_Wolf.gif'),
  'beetle': makeSinglePose('/sprites/battle/enemies/Punch_Ant.gif'),
};

export const EARLY_GAME_ENEMY_IDS = collectEarlyEnemyIds();
export const EARLY_HOUSE_THRESHOLD = EARLY_HOUSE_MAX;

/**
 * Resolve a player unit battle sprite.
 */
export function getPlayerBattleSprite(unitId: string, state: BattleSpriteState): string | null {
  const spriteMap = PLAYER_SPRITES[unitId];
  if (!spriteMap) {
    return null;
  }
  return spriteMap[state] ?? null;
}

/**
 * Resolve an enemy battle sprite.
 */
export function getEnemyBattleSprite(enemyId: string, state: BattleSpriteState): string | null {
  const spriteMap = ENEMY_SPRITES[enemyId];
  if (!spriteMap) {
    return null;
  }
  return spriteMap[state] ?? null;
}

/**
 * Resolve an enemy battle sprite with optional NPC override for leaders.
 * If overrideSpriteId is provided and has a mapping, use that instead.
 */
export function getEnemyBattleSpriteWithOverride(
  enemyId: string,
  state: BattleSpriteState,
  overrideSpriteId?: string
): string | null {
  if (overrideSpriteId) {
    const overrideMap = ENEMY_SPRITES[overrideSpriteId];
    if (overrideMap) {
      return overrideMap[state] ?? null;
    }
  }
  return getEnemyBattleSprite(enemyId, state);
}

/**
 * Inspectable ids for tests / tooling.
 */
export const KNOWN_PLAYER_BATTLE_UNITS = Object.keys(PLAYER_SPRITES);
export const KNOWN_ENEMY_BATTLE_UNITS = Object.keys(ENEMY_SPRITES);
