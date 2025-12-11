/**
 * Battle background definitions and utilities
 * Maps background IDs to sprite paths
 */

/** Default background when none is specified */
export const DEFAULT_BACKGROUND = 'gs1/Kolima_Forest';

/**
 * Available battle backgrounds organized by game
 * Keys are background IDs in format 'gs1/Name' or 'gs2/Name'
 * Values are the actual file paths
 */
export const BATTLE_BACKGROUNDS: Record<string, string> = {
  // Golden Sun 1 Backgrounds
  'gs1/Altin_Peak': '/sprites/backgrounds/gs1/Altin_Peak.gif',
  'gs1/Altmillar_Cave': '/sprites/backgrounds/gs1/Altmillar_Cave.gif',
  'gs1/Babi_Lighthouse': '/sprites/backgrounds/gs1/Babi_Lighthouse.gif',
  'gs1/Cave': '/sprites/backgrounds/gs1/Cave.gif',
  'gs1/Colosso': '/sprites/backgrounds/gs1/Colosso.gif',
  'gs1/Crossbone_Isle_Cave': '/sprites/backgrounds/gs1/Crossbone_Isle_Cave.gif',
  'gs1/Dark_Sky': '/sprites/backgrounds/gs1/Dark_Sky.gif',
  'gs1/Deadbeards_Ship': "/sprites/backgrounds/gs1/Deadbeard's_Ship.gif",
  'gs1/Desert': '/sprites/backgrounds/gs1/Desert.gif',
  'gs1/Final_Battle': '/sprites/backgrounds/gs1/Final_Battle.gif',
  'gs1/Fuchin_Cave': '/sprites/backgrounds/gs1/Fuchin_Cave.gif',
  'gs1/Kolima_Forest': '/sprites/backgrounds/gs1/Kolima_Forest.gif',
  'gs1/Lamakan_Desert': '/sprites/backgrounds/gs1/Lamakan_Desert.gif',
  'gs1/Mercury_Lighthouse': '/sprites/backgrounds/gs1/Mercury_Lighthouse.gif',
  'gs1/Meteor': '/sprites/backgrounds/gs1/Meteor.gif',
  'gs1/Mogall_Forest': '/sprites/backgrounds/gs1/Mogall_Forest.gif',
  'gs1/Overworld': '/sprites/backgrounds/gs1/Overworld.gif',
  'gs1/Sky': '/sprites/backgrounds/gs1/Sky.gif',
  'gs1/Sol_Sanctum': '/sprites/backgrounds/gs1/Sol_Sanctum.gif',
  'gs1/Suhalla_Desert': '/sprites/backgrounds/gs1/Suhalla_Desert.gif',
  'gs1/Suhalla_Gate': '/sprites/backgrounds/gs1/Suhalla_Gate.gif',
  'gs1/Tolbi_Ship_Above': '/sprites/backgrounds/gs1/Tolbi_Bound_Ship_Abovedeck.gif',
  'gs1/Tolbi_Ship_Below': '/sprites/backgrounds/gs1/Tolbi_Bound_Ship_Belowdecks.gif',
  'gs1/Tret_Tree': '/sprites/backgrounds/gs1/Tret_Tree.gif',
  'gs1/Tret_Tree_Branches': '/sprites/backgrounds/gs1/Tret_Tree_Branches.gif',
  'gs1/Tunnel_Ruins': '/sprites/backgrounds/gs1/Tunnel_Ruins.gif',
  'gs1/Vale': '/sprites/backgrounds/gs1/Vale.gif',
  'gs1/Vault_Inn': '/sprites/backgrounds/gs1/Vault_Inn.gif',
  'gs1/Venus_Lighthouse': '/sprites/backgrounds/gs1/Venus_Lighthouse.gif',
  'gs1/Venus_Lighthouse_Aerie': '/sprites/backgrounds/gs1/Venus_Lighthouse_Aerie.gif',
  'gs1/VL_Final_Battle': '/sprites/backgrounds/gs1/VL_Final_Battle.gif',
  'gs1/World_Map': '/sprites/backgrounds/gs1/World_Map.gif',
  'gs1/World_Map_Forest': '/sprites/backgrounds/gs1/World_Map_Forest.gif',
  'gs1/World_Map_Shore': '/sprites/backgrounds/gs1/World_Map_Shore.gif',
  'gs1/World_Map_Snow': '/sprites/backgrounds/gs1/World_Map_Snow.gif',

  // Golden Sun 2 Backgrounds
  'gs2/Airs_Rock_Inside': '/sprites/backgrounds/gs2/Airs_Rock_Inside.gif',
  'gs2/Airs_Rock_Outside': '/sprites/backgrounds/gs2/Airs_Rock_Outside.gif',
  'gs2/Anemos_Inner_Sanctum': '/sprites/backgrounds/gs2/Anemos_Inner_Sanctum.gif',
  'gs2/Ankohl_Ruins': '/sprites/backgrounds/gs2/Ankohl_Ruins.gif',
  'gs2/Aqua_Rock_Inside': '/sprites/backgrounds/gs2/Aqua_Rock_Inside.gif',
  'gs2/Aqua_Rock_Outside': '/sprites/backgrounds/gs2/Aqua_Rock_Outside.gif',
  'gs2/Catastrophe': '/sprites/backgrounds/gs2/Catastrophe.gif',
  'gs2/Cave': '/sprites/backgrounds/gs2/Cave.gif',
  'gs2/Cave2': '/sprites/backgrounds/gs2/Cave2.gif',
  'gs2/Cliffs': '/sprites/backgrounds/gs2/Cliffs.gif',
  'gs2/Eclipse': '/sprites/backgrounds/gs2/Eclipse.gif',
  'gs2/Gaia_Rock_Inside': '/sprites/backgrounds/gs2/Gaia_Rock_Inside.gif',
  'gs2/Gaia_Rock_Outside': '/sprites/backgrounds/gs2/Gaia_Rock_Outside.gif',
  'gs2/Great_Gabomba_Statue': '/sprites/backgrounds/gs2/Great_Gabomba_Statue.gif',
  'gs2/Iris': '/sprites/backgrounds/gs2/Iris.gif',
  'gs2/Iris2': '/sprites/backgrounds/gs2/Iris2.gif',
  'gs2/Islet_Cave': '/sprites/backgrounds/gs2/Islet_Cave.gif',
  'gs2/Jupiter_Lighthouse': '/sprites/backgrounds/gs2/Jupiter_Lighthouse.gif',
  'gs2/Jupiter_Lighthouse_Aerie': '/sprites/backgrounds/gs2/Jupiter_Lighthouse_Aerie.gif',
  'gs2/Kibombo_Mountains': '/sprites/backgrounds/gs2/Kibombo_Mountains.gif',
  'gs2/Lemurian_Ship': '/sprites/backgrounds/gs2/Lemurian_Ship.gif',
  'gs2/Magma_Rock': '/sprites/backgrounds/gs2/Magma_Rock.gif',
  'gs2/Map': '/sprites/backgrounds/gs2/Map.gif',
  'gs2/Mars_Lighthouse': '/sprites/backgrounds/gs2/Mars_Lighthouse.gif',
  'gs2/Mars_Lighthouse_Aerie': '/sprites/backgrounds/gs2/Mars_Lighthouse_Aerie.gif',
  'gs2/Prox': '/sprites/backgrounds/gs2/Prox.gif',
  'gs2/Sea_of_Time': '/sprites/backgrounds/gs2/Sea_of_Time.gif',
  'gs2/Tundaria_Tower': '/sprites/backgrounds/gs2/Tundaria_Tower.gif',
  'gs2/World_Map': '/sprites/backgrounds/gs2/World_Map.gif',
  'gs2/World_Map_Desert': '/sprites/backgrounds/gs2/World_Map_Desert.gif',
  'gs2/World_Map_Shore': '/sprites/backgrounds/gs2/World_Map_Shore.gif',
  'gs2/Yampi_Desert': '/sprites/backgrounds/gs2/Yampi_Desert.gif',
} as const;

/** List of background IDs suitable for tower floor rotation */
export const TOWER_BACKGROUNDS: readonly string[] = [
  // Mix of indoor and outdoor, varied themes
  'gs1/Vale',                    // Floor 1 - Starting village
  'gs1/Sol_Sanctum',             // Floor 2 - Temple interior
  'gs1/Kolima_Forest',           // Floor 3 - Forest
  'gs1/Mercury_Lighthouse',      // Floor 5 - Lighthouse
  'gs1/Vault_Inn',               // Floors 6-7 - Inn setting
  'gs1/Cave',                    // Floor 8 - Cave
  'gs1/Tret_Tree',               // Floor 9 - Tree
  'gs1/Venus_Lighthouse',        // Floor 10 - Lighthouse (boss)
  'gs2/Cave',                    // Floor 11 - Cave variant
  'gs2/Gaia_Rock_Inside',        // Floor 12 - Rock interior
  'gs2/Airs_Rock_Inside',        // Floor 13 - Air theme
  'gs2/Jupiter_Lighthouse',      // Floor 15 - Jupiter theme (boss)
  'gs2/Aqua_Rock_Inside',        // Floor 17 - Water theme
  'gs2/Magma_Rock',              // Floor 19 - Fire theme
  'gs2/Mars_Lighthouse',         // Floor 20 - Final boss
  'gs2/Mars_Lighthouse_Aerie',   // Floor 25 - Aerie boss
  'gs1/Venus_Lighthouse_Aerie',  // Floor 30 - Ultimate boss
] as const;

const DEFAULT_BG_PATH = '/sprites/backgrounds/gs1/Kolima_Forest.gif';

/**
 * Get background sprite path from background ID
 * Returns default background if ID not found
 */
export function getBackgroundPath(backgroundId: string | undefined): string {
  if (!backgroundId) {
    return BATTLE_BACKGROUNDS[DEFAULT_BACKGROUND] ?? DEFAULT_BG_PATH;
  }
  return BATTLE_BACKGROUNDS[backgroundId] ?? BATTLE_BACKGROUNDS[DEFAULT_BACKGROUND] ?? DEFAULT_BG_PATH;
}

/**
 * Get a background ID for a tower floor number
 * Cycles through TOWER_BACKGROUNDS based on floor
 */
export function getTowerFloorBackground(floorNumber: number): string {
  // Skip rest floors (4, 8, 12, etc.) - they don't need backgrounds
  // Map floor numbers to background indices
  const index = (floorNumber - 1) % TOWER_BACKGROUNDS.length;
  return TOWER_BACKGROUNDS[index] ?? DEFAULT_BACKGROUND;
}
