import type { Equipment } from '../../../core/models/Equipment';

const EQUIPMENT_ICON_OVERRIDES: Record<string, string> = {
  // Swords
  'wooden-sword': '/sprites/icons/items/long-swords/Long_Sword.gif',
  'bronze-sword': '/sprites/icons/items/long-swords/Broad_Sword.gif',
  'iron-sword': '/sprites/icons/items/long-swords/Great_Sword.gif',
  'steel-sword': '/sprites/icons/items/long-swords/Rune_Blade.gif',
  'silver-blade': '/sprites/icons/items/long-swords/Silver_Blade.gif',
  'mythril-blade': '/sprites/icons/items/long-swords/Mythril_Blade.gif',
  'gaia-blade': '/sprites/icons/items/long-swords/Gaia_Blade.gif',
  'sol-blade': '/sprites/icons/items/long-swords/Sol_Blade.gif',
  'eclipse-blade': '/sprites/icons/items/long-swords/Darksword.gif',
  'radiant-rapier': '/sprites/icons/items/light-blades/Battle_Rapier.gif',
  'astral-blade': '/sprites/icons/items/long-swords/Soul_Brand.gif',
  'storm-cleaver': '/sprites/icons/items/long-swords/Storm_Brand.gif',
  'frost-reaver': '/sprites/icons/items/long-swords/Arctic_Blade.gif',
  'thunderbolt-bow': '/sprites/icons/items/long-swords/Lightning_Sword.gif',
  'night-dagger': '/sprites/icons/items/long-swords/Robbers_Blade.gif',

  // Axes
  'wooden-axe': '/sprites/icons/items/axes/Broad_Axe.gif',
  'battle-axe': '/sprites/icons/items/axes/Battle_Axe.gif',
  'great-axe': '/sprites/icons/items/axes/Great_Axe.gif',
  'titans-axe': '/sprites/icons/items/axes/Giant_Axe.gif',
  'mythril-axe': '/sprites/icons/items/axes/Mighty_Axe.gif',
  'flame-branded-axe': '/sprites/icons/items/axes/Burning_Axe.gif',

  // Maces / Hammers
  mace: '/sprites/icons/items/maces/Mace.gif',
  'heavy-mace': '/sprites/icons/items/maces/Heavy_Mace.gif',
  'demon-mace': '/sprites/icons/items/maces/Demon_Mace.gif',
  'volcanic-hammer': '/sprites/icons/items/maces/Comet_Mace.gif',

  // Staves
  'wooden-staff': '/sprites/icons/items/staves/Wooden_Stick.gif',
  'magic-rod': '/sprites/icons/items/staves/Magic_Rod.gif',
  'shaman-rod': '/sprites/icons/items/staves/Shamans_Rod.gif',
  'crystal-rod': '/sprites/icons/items/staves/Crystal_Rod.gif',
  'zodiac-wand': '/sprites/icons/items/staves/Zodiac_Wand.gif',
  'staff-of-ages': '/sprites/icons/items/staves/Staff_of_Anubis.gif',
  'mythril-staff': '/sprites/icons/items/staves/Psynergy_Rod.gif',
  'mythril-lance': '/sprites/icons/items/light-blades/Battle_Rapier.gif',
  'frost-scepter': '/sprites/icons/items/staves/Frost_Wand.gif',
  'shadowflame-staff': '/sprites/icons/items/staves/Demonic_Staff.gif',

  // Armor / clothing / robes
  'cotton-shirt': '/sprites/icons/items/clothing/Cotton_Shirt.gif',
  'leather-vest': '/sprites/icons/items/clothing/Travel_Vest.gif',
  'bronze-armor': '/sprites/icons/items/armor/Chain_Mail.gif',
  'iron-armor': '/sprites/icons/items/armor/Plate_Mail.gif',
  'steel-armor': '/sprites/icons/items/armor/Steel_Armor.gif',
  'silver-armor': '/sprites/icons/items/armor/Spirit_Armor.gif',
  'mythril-armor': '/sprites/icons/items/armor/Planet_Armor.gif',
  'dragon-scales': '/sprites/icons/items/armor/Dragon_Scales.gif',
  'valkyrie-mail': '/sprites/icons/items/armor/Valkyrie_Mail.gif',
  'glacial-robes': '/sprites/icons/items/robes/Dragon_Robe.gif',
  'aetheric-mantle': '/sprites/icons/items/robes/Feathered_Robe.gif',
  'stormplate-armor': '/sprites/icons/items/armor/Ixion_Mail.gif',
  'thunderplate-armor': '/sprites/icons/items/armor/Ixion_Mail.gif',
  'frostplate-armor': '/sprites/icons/items/armor/Chronos_Mail.gif',
  'volcanic-plate-armor': '/sprites/icons/items/armor/Demon_Mail.gif',
  'terra-guard-armor': '/sprites/icons/items/armor/Plate_Mail.gif',
  'skywarden-mail': '/sprites/icons/items/armor/Ixion_Mail.gif',
  'oceanic-mail': '/sprites/icons/items/armor/Chronos_Mail.gif',
  'pyro-mail': '/sprites/icons/items/armor/Demon_Mail.gif',
  'lunar-armor': '/sprites/icons/items/armor/Planet_Armor.gif',
  'solar-armor': '/sprites/icons/items/armor/Valkyrie_Mail.gif',
  'tempest-armor': '/sprites/icons/items/armor/Ixion_Mail.gif',
  'glacier-mail': '/sprites/icons/items/armor/Chronos_Mail.gif',
  'inferno-plate': '/sprites/icons/items/armor/Demon_Mail.gif',
  'iris-robe': '/sprites/icons/items/robes/Iris_Robe.gif',

  // Helms / crowns / circlets
  'leather-cap': '/sprites/icons/items/hats/Leather_Cap.gif',
  'cloth-cap': '/sprites/icons/items/hats/Mail_Cap.gif',
  'bronze-helm': '/sprites/icons/items/helmets/Bronze_Helm.gif',
  'iron-helm': '/sprites/icons/items/helmets/Iron_Helm.gif',
  'steel-helm': '/sprites/icons/items/helmets/Steel_Helm.gif',
  'silver-circlet': '/sprites/icons/items/circlets/Silver_Circlet.gif',
  'mythril-crown': '/sprites/icons/items/circlets/Mythril_Circlet.gif',
  'storm-circlet': '/sprites/icons/items/circlets/Clarity_Circlet.gif',
  'oracles-crown': '/sprites/icons/items/crowns/Jeweled_Crown.gif',
  'glory-helm': '/sprites/icons/items/helmets/Gloria_Helm.gif',
  'gaia-helm': '/sprites/icons/items/helmets/Adepts_Helm.gif',
  'stormking-crown': '/sprites/icons/items/crowns/Thunder_Crown.gif',
  'frostqueen-tiara': '/sprites/icons/items/circlets/Glittering_Tiara.gif',
  'volcanic-visor': '/sprites/icons/items/helmets/Dragon_Helm.gif',

  // Boots
  'leather-boots': '/sprites/icons/items/boots/Leather_Boots.gif',
  'iron-boots': '/sprites/icons/items/boots/Knights_Greave.gif',
  'steel-greaves': '/sprites/icons/items/boots/Safety_Boots.gif',
  'silver-greaves': '/sprites/icons/items/boots/Silver_Greave.gif',
  'hyper-boots': '/sprites/icons/items/boots/Hyper_Boots.gif',
  'quick-boots': '/sprites/icons/items/boots/Quick_Boots.gif',
  'hermes-sandals': '/sprites/icons/items/boots/Ninja_Sandals.gif',
  'mythril-greaves': '/sprites/icons/items/boots/Golden_Boots.gif',
  'windstrider-boots': '/sprites/icons/items/boots/Dragon_Boots.gif',
  'tidal-treads': '/sprites/icons/items/boots/Turtle_Boots.gif',

  // Accessories
  'power-ring': '/sprites/icons/items/rings/War_Ring.gif',
  'guardian-ring': '/sprites/icons/items/rings/Guardian_Ring.gif',
  'adepts-ring': '/sprites/icons/items/rings/Adept_Ring.gif',
  'war-gloves': '/sprites/icons/items/gloves/War_Gloves.gif',
  'spirit-gloves': '/sprites/icons/items/gloves/Spirit_Gloves.gif',
  'lucky-medal': '/sprites/icons/items/single-use/other/Lucky_Medal.gif',
  'elemental-star': '/sprites/icons/items/forgeable/Star_Dust.gif',
  'dragons-eye': '/sprites/icons/items/single-use/important/Dragons_Eye.gif',
  'cleric-ring': '/sprites/icons/items/rings/Clerics_Ring.gif',
  'cosmos-shield': '/sprites/icons/items/shields/Cosmos_Shield.gif',
  'mythril-gauntlets': '/sprites/icons/items/gloves/Gauntlets.gif',
  'earth-warden-shield': '/sprites/icons/items/shields/Earth_Shield.gif',
  'inferno-gauntlets': '/sprites/icons/items/gloves/Riot_Gloves.gif',
  'gaia-greatshield': '/sprites/icons/items/shields/Terra_Shield.gif',
  'tower-champions-ring': '/sprites/icons/items/rings/Golden_Ring.gif',
  'tower-masters-medallion': '/sprites/icons/items/rings/Unicorn_Ring.gif',
};

/**
 * Heuristic mapper from equipment metadata to icon sprite path.
 * The art pack uses Pascal_Snake_Case filenames under
 * /public/sprites/icons/items/<category>/.
 */
export function getEquipmentSpriteId(equipment: Equipment): string | null {
  const explicitHit = EQUIPMENT_ICON_OVERRIDES[equipment.id];
  if (explicitHit) return explicitHit;

  const name = equipment.name ?? equipment.id;
  const lowerName = name.toLowerCase();

  // Choose category directory (best-effort for new/custom items)
  let category: string;
  switch (equipment.slot) {
    case 'weapon': {
      if (lowerName.match(/axe/)) category = 'axes';
      else if (lowerName.match(/staff|rod|wand|scepter/)) category = 'staves';
      else if (lowerName.match(/mace|hammer/)) category = 'maces';
      else category = 'long-swords';
      break;
    }
    case 'armor': {
      if (lowerName.match(/robe|dress/)) category = 'robes';
      else if (lowerName.match(/shirt|vest|clothes|coat|tunic|garb|camisole/)) category = 'clothing';
      else category = 'armor';
      break;
    }
    case 'helm': {
      if (lowerName.match(/circlet|tiara/)) category = 'circlets';
      else if (lowerName.match(/crown/)) category = 'crowns';
      else if (lowerName.match(/cap|hat|hood/)) category = 'hats';
      else category = 'helmets';
      break;
    }
    case 'boots': {
      category = 'boots';
      break;
    }
    case 'accessory': {
      if (lowerName.match(/robe|mantle|dress/)) category = 'robes';
      else if (lowerName.match(/shield/)) category = 'shields';
      else if (lowerName.match(/glove|gauntlet/)) category = 'gloves';
      else if (lowerName.match(/bracelet|armlet/)) category = 'bracelets';
      else category = 'rings';
      break;
    }
    default: {
      category = 'other';
      break;
    }
  }

  // Convert display name to Pascal_Snake_Case (e.g., "Silver Blade" -> Silver_Blade)
  const fileName = name
    .replace(/['’]/g, '')
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('_');

  // Fallback: many custom/new weapon names don't have dedicated icons in the art pack.
  // Map unmapped weapons to a generic existing rapier/blade icon so tests and UI have a sensible default.
  if (equipment.slot === 'weapon') {
    return `/sprites/icons/items/light-blades/Mystery_Blade.gif`;
  }

  return `/sprites/icons/items/${category}/${fileName}.gif`;
}
