import type { Equipment } from '../../../core/models/Equipment';

/**
 * Heuristic mapper from equipment metadata to icon sprite path.
 * The art pack uses Pascal_Snake_Case filenames under
 * /public/sprites/icons/items/<category>/.
 */
export function getEquipmentSpriteId(equipment: Equipment): string | null {
  const name = equipment.name ?? equipment.id;
  const lowerName = name.toLowerCase();

  // Explicit overrides where the default heuristic might miss
  const explicit: Record<string, string> = {
    'gaia-blade': '/sprites/icons/items/long-swords/Gaia_Blade.gif',
    'sol-blade': '/sprites/icons/items/long-swords/Sol_Blade.gif',
    'battle-axe': '/sprites/icons/items/axes/Battle_Axe.gif',
    'great-axe': '/sprites/icons/items/axes/Great_Axe.gif',
    'titans-axe': '/sprites/icons/items/axes/Giant_Axe.gif',
    'zodiac-wand': '/sprites/icons/items/staves/Zodiac_Wand.gif',
    'staff-of-ages': '/sprites/icons/items/staves/Staff_of_Ages.gif',
    'crystal-rod': '/sprites/icons/items/staves/Crystal_Rod.gif',
    'magic-rod': '/sprites/icons/items/staves/Magic_Rod.gif',
    'shaman-rod': '/sprites/icons/items/staves/Shamans_Rod.gif',
    'hyper-boots': '/sprites/icons/items/boots/Hyper_Boots.gif',
    'quick-boots': '/sprites/icons/items/boots/Quick_Boots.gif',
    'hermes-sandals': '/sprites/icons/items/boots/Ninja_Sandals.gif',
    'power-ring': '/sprites/icons/items/rings/Power_Ring.gif',
    'guardian-ring': '/sprites/icons/items/rings/Guardian_Ring.gif',
    'adepts-ring': '/sprites/icons/items/rings/Adepts_Ring.gif',
    'cleric-ring': '/sprites/icons/items/rings/Clerics_Ring.gif',
    'dragons-eye': '/sprites/icons/items/rings/Dragons_Eye.gif',
    'cosmos-shield': '/sprites/icons/items/shields/Cosmos_Shield.gif',
    'oracles-crown': '/sprites/icons/items/helmets/Oracles_Crown.gif',
    'storm-circlet': '/sprites/icons/items/circlets/Clarity_Circlet.gif',
    'glacial-robes': '/sprites/icons/items/robes/Dragon_Robe.gif',
    'aetheric-mantle': '/sprites/icons/items/robes/Feathered_Robe.gif',
    'astral-blade': '/sprites/icons/items/long-swords/Astral_Blade.gif',
    'shadowflame-staff': '/sprites/icons/items/staves/Demonic_Staff.gif',
  };
  const explicitHit = explicit[equipment.id];
  if (explicitHit) return explicitHit;

  // Choose category directory
  let category = 'long-swords';
  if (lowerName.match(/axe/)) category = 'axes';
  else if (lowerName.match(/blade|sword|bow/)) category = 'long-swords';
  else if (lowerName.match(/staff|rod|wand|scepter/)) category = 'staves';
  else if (lowerName.match(/mace|hammer/)) category = 'maces';
  else if (lowerName.match(/shield/)) category = 'shields';
  else if (lowerName.match(/greave|boot|sandal|tread/)) category = 'boots';
  else if (lowerName.match(/helm|crown|visor/)) category = 'helmets';
  else if (lowerName.match(/circlet|tiara/)) category = 'circlets';
  else if (lowerName.match(/glove|gauntlet/)) category = 'gloves';
  else if (lowerName.match(/ring|medal|star|eye|bracelet|band/)) category = 'rings';
  else if (lowerName.match(/robe|mantle|dress/)) category = 'robes';
  else if (lowerName.match(/armor|mail|plate|vest|shirt|mantle/)) category = 'armor';
  else if (lowerName.match(/hat|hood|cap/)) category = 'hats';
  else if (lowerName.match(/clothing/)) category = 'clothing';

  // Convert display name to Pascal_Snake_Case (e.g., "Silver Blade" -> Silver_Blade)
  const fileName = name
    .replace(/['’]/g, '')
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('_');

  return `/sprites/icons/items/${category}/${fileName}.gif`;
}
