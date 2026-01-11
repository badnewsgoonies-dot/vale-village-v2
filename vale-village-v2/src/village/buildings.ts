import { BUILDING_GROUND_Y, VIEWPORT_WIDTH } from './constants';

export type BuildingKind = 'house' | 'tower' | 'shop';

export interface VillageBuilding {
  id: string;
  kind: BuildingKind;
  /** Bottom-center anchored world position (world pixels). */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Direct sprite asset path under `/public`. */
  spritePath: string;
  /** Door offset from the building anchor (world pixels). */
  doorOffsetX?: number;
  doorOffsetY?: number;
  /** Optional interior map id (wired in Phase 4). */
  interiorMapId?: string;
  /** Optional shop id (for shop buildings). */
  shopId?: string;
}

const SPRITE_SIZE: Record<string, { width: number; height: number }> = {
  '/sprites/buildings/Vale/Vale_Sanctum.gif': { width: 100, height: 120 },
  '/sprites/buildings/Vale/Vale_Isaacs_House.gif': { width: 120, height: 100 },
  '/sprites/buildings/Vale/Vale_Kradens_House.gif': { width: 140, height: 120 },
  '/sprites/buildings/Vale/Vale_Garets_House.gif': { width: 120, height: 100 },
  '/sprites/buildings/Vale/Vale_Jennas_House.gif': { width: 110, height: 95 },
  '/sprites/buildings/Vale/Vale_WepArm_Shop.gif': { width: 100, height: 90 },
  '/sprites/buildings/Vale/Vale_Inn.gif': { width: 120, height: 100 },
  '/sprites/buildings/Vale/Vale_Building1.gif': { width: 90, height: 80 },
  '/sprites/buildings/Vale/Vale_Building2.gif': { width: 90, height: 80 },
  '/sprites/buildings/Vale/Vale_Building3.gif': { width: 100, height: 90 },
  '/sprites/buildings/Vale/Vale_Building4.gif': { width: 90, height: 80 },
  '/sprites/buildings/Vale/Vale_Building5.gif': { width: 100, height: 90 },
  '/sprites/buildings/Vale/Vale_Building6.gif': { width: 95, height: 85 },
  '/sprites/buildings/Vale/Vale_Building7.gif': { width: 90, height: 80 },
  '/sprites/buildings/Vale/Vale_Building8.gif': { width: 100, height: 90 },
  // Flint intro house sprite (used to host Djinn/Flint introduction inside House 01)
  '/sprites/buildings/Vale/Vale_Flint_House.gif': { width: 100, height: 100 },
};

const HOUSE_SPRITES: string[] = [
  // Place the Flint intro sprite first so house-01 will pick it by default
  '/sprites/buildings/Vale/Vale_Flint_House.gif',
  '/sprites/buildings/Vale/Vale_Isaacs_House.gif',
  '/sprites/buildings/Vale/Vale_Kradens_House.gif',
  '/sprites/buildings/Vale/Vale_Building1.gif',
  '/sprites/buildings/Vale/Vale_Building2.gif',
  '/sprites/buildings/Vale/Vale_Building3.gif',
  '/sprites/buildings/Vale/Vale_Building4.gif',
  '/sprites/buildings/Vale/Vale_Building5.gif',
  '/sprites/buildings/Vale/Vale_Building6.gif',
  '/sprites/buildings/Vale/Vale_Building7.gif',
  '/sprites/buildings/Vale/Vale_Building8.gif',
  '/sprites/buildings/Vale/Vale_Garets_House.gif',
  '/sprites/buildings/Vale/Vale_Jennas_House.gif',
  '/sprites/buildings/Vale/Vale_WepArm_Shop.gif',
  '/sprites/buildings/Vale/Vale_Inn.gif',
];

const TOWER_SPRITE_PATH = '/sprites/buildings/Vale/Vale_Sanctum.gif';
const TOWER_SIZE = SPRITE_SIZE[TOWER_SPRITE_PATH] ?? { width: 100, height: 120 };

const ARMORY_SPRITE_PATH = '/sprites/buildings/Vale/Vale_WepArm_Shop.gif';
const ARMORY_SIZE = SPRITE_SIZE[ARMORY_SPRITE_PATH] ?? { width: 100, height: 90 };

export const BATTLE_TOWER: VillageBuilding = {
  id: 'battle-tower',
  kind: 'tower',
  x: 100,
  y: BUILDING_GROUND_Y,
  width: TOWER_SIZE.width,
  height: TOWER_SIZE.height,
  spritePath: TOWER_SPRITE_PATH,
  doorOffsetX: 0,
  doorOffsetY: 0,
};

export const VALE_ARMORY: VillageBuilding = {
  id: 'shop-vale-armory',
  kind: 'shop',
  x: 240,
  y: BUILDING_GROUND_Y,
  width: ARMORY_SIZE.width,
  height: ARMORY_SIZE.height,
  spritePath: ARMORY_SPRITE_PATH,
  doorOffsetX: 0,
  doorOffsetY: 0,
  shopId: 'vale-armory',
};

export const HOUSES: VillageBuilding[] = Array.from({ length: 30 }, (_, i) => {
  const houseNumber = i + 1;
  const spritePath = HOUSE_SPRITES[i % HOUSE_SPRITES.length]!;
  const size = SPRITE_SIZE[spritePath] ?? { width: 96, height: 96 };

  return {
    id: `house-${String(houseNumber).padStart(2, '0')}`,
    kind: 'house',
    x: 360 + i * 120,
    y: BUILDING_GROUND_Y,
    width: size.width,
    height: size.height,
    spritePath,
    doorOffsetX: 0,
    doorOffsetY: 0,
    interiorMapId: `house-${String(houseNumber).padStart(2, '0')}-interior`,
  };
});
