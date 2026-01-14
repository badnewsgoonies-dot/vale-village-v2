/**
 * InteriorFurnitureLayer
 * Renders Y-sorted furniture with drop shadows for indoor scenes
 * Creates depth through Y-position sorting and shadow rendering
 */

import type { Layer, Camera, WorldPosition } from '../engine/types';

interface FurnitureItem {
  id: string;
  type: 'table' | 'chair' | 'bed' | 'bookshelf' | 'chest' | 'fireplace' | 'rug' | 'plant' | 'lamp';
  x: number;      // Relative to room
  y: number;      // Relative to room (for Y-sorting)
  width: number;
  height: number;
  spriteId?: string;
}

interface InteriorConfig {
  roomX: number;
  roomY: number;
  roomWidth: number;
  roomHeight: number;
}

type CollisionRect = { x: number; y: number; width: number; height: number };
type Collider = { halfWidth: number; halfHeight: number };

/**
 * House-specific furniture layouts
 * Each function receives roomWidth and roomHeight and returns a furniture array
 */
const HOUSE_FURNITURE_LAYOUTS: Record<number, (w: number, h: number) => FurnitureItem[]> = {
  // House 1: Isaac's home - Cozy family dwelling
  1: (w, h) => [
    { id: 'bed-1', type: 'bed', x: 20, y: 30, width: 50, height: 80 },
    { id: 'table-1', type: 'table', x: w - 80, y: 40, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w - 90, y: 60, width: 20, height: 30 },
    { id: 'chair-2', type: 'chair', x: w - 50, y: 60, width: 20, height: 30 },
    { id: 'bookshelf-1', type: 'bookshelf', x: w / 2 - 20, y: 20, width: 40, height: 70 },
    { id: 'chest-1', type: 'chest', x: 90, y: 30, width: 40, height: 30 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 50, y: h / 2 - 20, width: 100, height: 60 },
  ],

  // House 2: Mystic's study - Lots of books and plants
  2: (w, h) => [
    { id: 'bookshelf-1', type: 'bookshelf', x: 20, y: 20, width: 40, height: 70 },
    { id: 'bookshelf-2', type: 'bookshelf', x: w - 60, y: 20, width: 40, height: 70 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 10, y: h / 2 - 50, width: 20, height: 30 },
    { id: 'plant-1', type: 'plant', x: 80, y: 30, width: 25, height: 35 },
    { id: 'plant-2', type: 'plant', x: w - 105, y: 30, width: 25, height: 35 },
    { id: 'lamp-1', type: 'lamp', x: w / 2 + 40, y: h / 2 - 15, width: 20, height: 45 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 45, y: h / 2 - 25, width: 90, height: 70 },
  ],

  // House 3: Ranger's quarters - Minimal, chest focused
  3: (w, h) => [
    { id: 'bed-1', type: 'bed', x: w - 70, y: 30, width: 50, height: 80 },
    { id: 'chest-1', type: 'chest', x: 20, y: 40, width: 40, height: 30 },
    { id: 'chest-2', type: 'chest', x: 70, y: 40, width: 40, height: 30 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 10, y: h / 2 - 50, width: 20, height: 30 },
    { id: 'plant-1', type: 'plant', x: w / 2 - 60, y: 30, width: 25, height: 35 },
  ],

  // House 4: Simple dwelling
  4: (w, h) => [
    { id: 'bed-1', type: 'bed', x: 20, y: 40, width: 50, height: 80 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 50, y: h / 2, width: 20, height: 30 },
    { id: 'chair-2', type: 'chair', x: w / 2 + 30, y: h / 2, width: 20, height: 30 },
    { id: 'fireplace-1', type: 'fireplace', x: w - 60, y: 20, width: 50, height: 70 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 50, y: h / 2 - 30, width: 100, height: 60 },
  ],

  // House 5: Blaze's workshop - Fireplace centered
  5: (w, h) => [
    { id: 'fireplace-1', type: 'fireplace', x: w / 2 - 25, y: 20, width: 50, height: 70 },
    { id: 'table-1', type: 'table', x: 20, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: 90, y: h / 2, width: 20, height: 30 },
    { id: 'chest-1', type: 'chest', x: w - 80, y: 40, width: 40, height: 30 },
    { id: 'chest-2', type: 'chest', x: w - 80, y: 80, width: 40, height: 30 },
    { id: 'bed-1', type: 'bed', x: w - 70, y: h - 100, width: 50, height: 80 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 40, y: h / 2 + 10, width: 80, height: 50 },
  ],

  // House 6: Scholar's home - Multiple bookshelves
  6: (w, h) => [
    { id: 'bookshelf-1', type: 'bookshelf', x: 20, y: 20, width: 40, height: 70 },
    { id: 'bookshelf-2', type: 'bookshelf', x: 70, y: 20, width: 40, height: 70 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 10, y: h / 2 - 50, width: 20, height: 30 },
    { id: 'bed-1', type: 'bed', x: w - 70, y: 30, width: 50, height: 80 },
    { id: 'lamp-1', type: 'lamp', x: w / 2 + 35, y: h / 2 - 15, width: 20, height: 45 },
    { id: 'chest-1', type: 'chest', x: w / 2 - 20, y: h - 50, width: 40, height: 30 },
  ],

  // House 7: Elegant home - Lamps and rugs
  7: (w, h) => [
    { id: 'bed-1', type: 'bed', x: 20, y: 30, width: 50, height: 80 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 50, y: h / 2, width: 20, height: 30 },
    { id: 'chair-2', type: 'chair', x: w / 2 + 30, y: h / 2, width: 20, height: 30 },
    { id: 'lamp-1', type: 'lamp', x: 90, y: 35, width: 20, height: 45 },
    { id: 'lamp-2', type: 'lamp', x: w - 110, y: 35, width: 20, height: 45 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 50, y: h / 2 - 30, width: 100, height: 60 },
    { id: 'plant-1', type: 'plant', x: w - 70, y: 30, width: 25, height: 35 },
  ],

  // House 8: Sentinel's barracks - Military style
  8: (w, h) => [
    { id: 'bed-1', type: 'bed', x: 20, y: 30, width: 50, height: 80 },
    { id: 'bed-2', type: 'bed', x: w - 70, y: 30, width: 50, height: 80 },
    { id: 'chest-1', type: 'chest', x: 20, y: h - 50, width: 40, height: 30 },
    { id: 'chest-2', type: 'chest', x: w - 60, y: h - 50, width: 40, height: 30 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 10, y: h / 2 - 50, width: 20, height: 30 },
  ],

  // House 9: Garden enthusiast - Many plants
  9: (w, h) => [
    { id: 'plant-1', type: 'plant', x: 20, y: 30, width: 25, height: 35 },
    { id: 'plant-2', type: 'plant', x: 60, y: 30, width: 25, height: 35 },
    { id: 'plant-3', type: 'plant', x: w - 85, y: 30, width: 25, height: 35 },
    { id: 'plant-4', type: 'plant', x: w - 45, y: 30, width: 25, height: 35 },
    { id: 'bed-1', type: 'bed', x: 20, y: h - 100, width: 50, height: 80 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 10, y: h / 2 - 50, width: 20, height: 30 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 45, y: h / 2 - 25, width: 90, height: 70 },
  ],

  // House 10: Cozy cottage - Centered fireplace
  10: (w, h) => [
    { id: 'fireplace-1', type: 'fireplace', x: w - 60, y: 20, width: 50, height: 70 },
    { id: 'bed-1', type: 'bed', x: 20, y: 30, width: 50, height: 80 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 50, y: h / 2, width: 20, height: 30 },
    { id: 'chair-2', type: 'chair', x: w / 2 + 30, y: h / 2, width: 20, height: 30 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 50, y: h / 2 - 30, width: 100, height: 60 },
    { id: 'chest-1', type: 'chest', x: 90, y: 30, width: 40, height: 30 },
  ],

  // House 11: Karis' workspace - Tool chest and table
  11: (w, h) => [
    { id: 'table-1', type: 'table', x: 20, y: 40, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: 30, y: 90, width: 20, height: 30 },
    { id: 'chest-1', type: 'chest', x: 20, y: h - 50, width: 40, height: 30 },
    { id: 'chest-2', type: 'chest', x: 70, y: h - 50, width: 40, height: 30 },
    { id: 'bed-1', type: 'bed', x: w - 70, y: 30, width: 50, height: 80 },
    { id: 'bookshelf-1', type: 'bookshelf', x: w / 2 - 20, y: 20, width: 40, height: 70 },
    { id: 'lamp-1', type: 'lamp', x: 90, y: 45, width: 20, height: 45 },
  ],

  // House 12: Collector's home - Many chests
  12: (w, h) => [
    { id: 'chest-1', type: 'chest', x: 20, y: 30, width: 40, height: 30 },
    { id: 'chest-2', type: 'chest', x: 70, y: 30, width: 40, height: 30 },
    { id: 'chest-3', type: 'chest', x: 120, y: 30, width: 40, height: 30 },
    { id: 'bed-1', type: 'bed', x: w - 70, y: 30, width: 50, height: 80 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h - 60, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 10, y: h - 90, width: 20, height: 30 },
    { id: 'rug-1', type: 'rug', x: 20, y: h / 2 - 20, width: 80, height: 50 },
  ],

  // House 13: Hermit's dwelling - Sparse
  13: (w, h) => [
    { id: 'bed-1', type: 'bed', x: 20, y: 30, width: 50, height: 80 },
    { id: 'table-1', type: 'table', x: w - 80, y: 40, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w - 70, y: 90, width: 20, height: 30 },
    { id: 'chest-1', type: 'chest', x: w / 2 - 20, y: h - 50, width: 40, height: 30 },
    { id: 'plant-1', type: 'plant', x: 90, y: 35, width: 25, height: 35 },
  ],

  // House 14: Tyrell's inn - Two beds
  14: (w, h) => [
    { id: 'bed-1', type: 'bed', x: 20, y: 30, width: 50, height: 80 },
    { id: 'bed-2', type: 'bed', x: 20, y: h - 100, width: 50, height: 80 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 50, y: h / 2, width: 20, height: 30 },
    { id: 'chair-2', type: 'chair', x: w / 2 + 30, y: h / 2, width: 20, height: 30 },
    { id: 'chest-1', type: 'chest', x: w - 60, y: 40, width: 40, height: 30 },
    { id: 'lamp-1', type: 'lamp', x: w - 65, y: h - 65, width: 20, height: 45 },
  ],

  // House 15: Stormcaller's sanctuary - Magical atmosphere
  15: (w, h) => [
    { id: 'bookshelf-1', type: 'bookshelf', x: 20, y: 20, width: 40, height: 70 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 10, y: h / 2 - 50, width: 20, height: 30 },
    { id: 'lamp-1', type: 'lamp', x: w / 2 - 60, y: h / 2 - 15, width: 20, height: 45 },
    { id: 'lamp-2', type: 'lamp', x: w / 2 + 40, y: h / 2 - 15, width: 20, height: 45 },
    { id: 'bed-1', type: 'bed', x: w - 70, y: 30, width: 50, height: 80 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 50, y: h / 2 - 30, width: 100, height: 60 },
    { id: 'plant-1', type: 'plant', x: 80, y: 30, width: 25, height: 35 },
  ],

  // House 16: Artisan's studio
  16: (w, h) => [
    { id: 'table-1', type: 'table', x: 20, y: 40, width: 60, height: 40 },
    { id: 'table-2', type: 'table', x: w - 80, y: 40, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: 30, y: 90, width: 20, height: 30 },
    { id: 'chair-2', type: 'chair', x: w - 70, y: 90, width: 20, height: 30 },
    { id: 'bed-1', type: 'bed', x: w / 2 - 25, y: h - 100, width: 50, height: 80 },
    { id: 'chest-1', type: 'chest', x: w / 2 - 20, y: 30, width: 40, height: 30 },
    { id: 'lamp-1', type: 'lamp', x: 90, y: 45, width: 20, height: 45 },
  ],

  // House 17: Felix's quarters - Organized
  17: (w, h) => [
    { id: 'bed-1', type: 'bed', x: 20, y: 40, width: 50, height: 80 },
    { id: 'bookshelf-1', type: 'bookshelf', x: w - 60, y: 20, width: 40, height: 70 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 50, y: h / 2, width: 20, height: 30 },
    { id: 'chair-2', type: 'chair', x: w / 2 + 30, y: h / 2, width: 20, height: 30 },
    { id: 'chest-1', type: 'chest', x: 90, y: 40, width: 40, height: 30 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 50, y: h / 2 - 30, width: 100, height: 60 },
  ],

  // House 18: Merchant's storage
  18: (w, h) => [
    { id: 'chest-1', type: 'chest', x: 20, y: 30, width: 40, height: 30 },
    { id: 'chest-2', type: 'chest', x: 20, y: 70, width: 40, height: 30 },
    { id: 'chest-3', type: 'chest', x: w - 60, y: 30, width: 40, height: 30 },
    { id: 'chest-4', type: 'chest', x: w - 60, y: 70, width: 40, height: 30 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 10, y: h / 2 - 50, width: 20, height: 30 },
    { id: 'bed-1', type: 'bed', x: w / 2 - 25, y: h - 100, width: 50, height: 80 },
  ],

  // House 19: Librarian's home
  19: (w, h) => [
    { id: 'bookshelf-1', type: 'bookshelf', x: 20, y: 20, width: 40, height: 70 },
    { id: 'bookshelf-2', type: 'bookshelf', x: 70, y: 20, width: 40, height: 70 },
    { id: 'bookshelf-3', type: 'bookshelf', x: w - 60, y: 20, width: 40, height: 70 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 10, y: h / 2 - 50, width: 20, height: 30 },
    { id: 'bed-1', type: 'bed', x: w / 2 - 25, y: h - 100, width: 50, height: 80 },
    { id: 'lamp-1', type: 'lamp', x: w / 2 + 35, y: h / 2 - 15, width: 20, height: 45 },
  ],

  // House 20: Overseer's hall - Grand
  20: (w, h) => [
    { id: 'fireplace-1', type: 'fireplace', x: w / 2 - 25, y: 20, width: 50, height: 70 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 50, y: h / 2, width: 20, height: 30 },
    { id: 'chair-2', type: 'chair', x: w / 2 + 30, y: h / 2, width: 20, height: 30 },
    { id: 'bed-1', type: 'bed', x: 20, y: h - 100, width: 50, height: 80 },
    { id: 'bookshelf-1', type: 'bookshelf', x: 20, y: 20, width: 40, height: 70 },
    { id: 'bookshelf-2', type: 'bookshelf', x: w - 60, y: 20, width: 40, height: 70 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 50, y: h / 2 - 30, width: 100, height: 60 },
    { id: 'lamp-1', type: 'lamp', x: w / 2 - 60, y: h / 2 - 15, width: 20, height: 45 },
    { id: 'lamp-2', type: 'lamp', x: w / 2 + 40, y: h / 2 - 15, width: 20, height: 45 },
  ],

  // House 21: Herbalist's nook
  21: (w, h) => [
    { id: 'bed-1', type: 'bed', x: w - 70, y: 40, width: 50, height: 80 },
    { id: 'table-1', type: 'table', x: 20, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: 90, y: h / 2, width: 20, height: 30 },
    { id: 'plant-1', type: 'plant', x: 20, y: 20, width: 25, height: 35 },
    { id: 'plant-2', type: 'plant', x: w - 50, y: 20, width: 25, height: 35 },
    { id: 'chest-1', type: 'chest', x: w / 2 - 20, y: h - 60, width: 40, height: 30 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 45, y: h / 2 - 25, width: 90, height: 60 },
  ],

  // House 22: Scholar's archive
  22: (w, h) => [
    { id: 'bookshelf-1', type: 'bookshelf', x: 20, y: 20, width: 40, height: 70 },
    { id: 'bookshelf-2', type: 'bookshelf', x: 70, y: 20, width: 40, height: 70 },
    { id: 'bookshelf-3', type: 'bookshelf', x: w - 60, y: 20, width: 40, height: 70 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 10, y: h / 2 - 50, width: 20, height: 30 },
    { id: 'lamp-1', type: 'lamp', x: w / 2 + 45, y: h / 2 - 15, width: 20, height: 45 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 40, y: h / 2 - 25, width: 80, height: 60 },
  ],

  // House 23: Traveler's rest
  23: (w, h) => [
    { id: 'bed-1', type: 'bed', x: 20, y: h - 100, width: 50, height: 80 },
    { id: 'chest-1', type: 'chest', x: w - 60, y: 30, width: 40, height: 30 },
    { id: 'chest-2', type: 'chest', x: w - 60, y: 70, width: 40, height: 30 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: 40, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 10, y: 70, width: 20, height: 30 },
    { id: 'plant-1', type: 'plant', x: 80, y: 30, width: 25, height: 35 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 35, y: h / 2 - 20, width: 70, height: 50 },
  ],

  // House 24: Twin bunks
  24: (w, h) => [
    { id: 'bed-1', type: 'bed', x: 20, y: 40, width: 50, height: 80 },
    { id: 'bed-2', type: 'bed', x: w - 70, y: 40, width: 50, height: 80 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 50, y: h / 2, width: 20, height: 30 },
    { id: 'chair-2', type: 'chair', x: w / 2 + 30, y: h / 2, width: 20, height: 30 },
    { id: 'bookshelf-1', type: 'bookshelf', x: w / 2 - 20, y: 20, width: 40, height: 70 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 50, y: h / 2 - 30, width: 100, height: 60 },
  ],

  // House 25: Hearth home
  25: (w, h) => [
    { id: 'fireplace-1', type: 'fireplace', x: 20, y: 20, width: 50, height: 70 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h - 70, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 50, y: h - 40, width: 20, height: 30 },
    { id: 'chair-2', type: 'chair', x: w / 2 + 30, y: h - 40, width: 20, height: 30 },
    { id: 'bed-1', type: 'bed', x: w - 70, y: h - 100, width: 50, height: 80 },
    { id: 'chest-1', type: 'chest', x: 90, y: h - 60, width: 40, height: 30 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 40, y: h / 2 - 20, width: 80, height: 50 },
  ],

  // House 26: Workshop
  26: (w, h) => [
    { id: 'table-1', type: 'table', x: 20, y: 40, width: 60, height: 40 },
    { id: 'table-2', type: 'table', x: w - 80, y: 40, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: 30, y: 90, width: 20, height: 30 },
    { id: 'bookshelf-1', type: 'bookshelf', x: w / 2 - 20, y: 20, width: 40, height: 70 },
    { id: 'chest-1', type: 'chest', x: w / 2 - 20, y: h - 60, width: 40, height: 30 },
    { id: 'lamp-1', type: 'lamp', x: 90, y: 45, width: 20, height: 45 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 45, y: h / 2 - 25, width: 90, height: 60 },
  ],

  // House 27: Garden room
  27: (w, h) => [
    { id: 'bed-1', type: 'bed', x: 20, y: h - 100, width: 50, height: 80 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 10, y: h / 2 - 50, width: 20, height: 30 },
    { id: 'plant-1', type: 'plant', x: 20, y: 20, width: 25, height: 35 },
    { id: 'plant-2', type: 'plant', x: w - 50, y: 20, width: 25, height: 35 },
    { id: 'plant-3', type: 'plant', x: w - 50, y: h - 70, width: 25, height: 35 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 45, y: h / 2 - 25, width: 90, height: 60 },
  ],

  // House 28: Collector's trove
  28: (w, h) => [
    { id: 'chest-1', type: 'chest', x: 20, y: 30, width: 40, height: 30 },
    { id: 'chest-2', type: 'chest', x: 20, y: 70, width: 40, height: 30 },
    { id: 'chest-3', type: 'chest', x: w - 60, y: 30, width: 40, height: 30 },
    { id: 'bookshelf-1', type: 'bookshelf', x: w - 60, y: 70, width: 40, height: 70 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'lamp-1', type: 'lamp', x: w / 2 + 40, y: h / 2 - 15, width: 20, height: 45 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 40, y: h / 2 - 20, width: 80, height: 50 },
  ],

  // House 29: Quiet quarters
  29: (w, h) => [
    { id: 'bed-1', type: 'bed', x: w - 70, y: h - 100, width: 50, height: 80 },
    { id: 'lamp-1', type: 'lamp', x: w - 50, y: 40, width: 20, height: 45 },
    { id: 'plant-1', type: 'plant', x: 20, y: 30, width: 25, height: 35 },
    { id: 'chest-1', type: 'chest', x: 90, y: h - 60, width: 40, height: 30 },
    { id: 'table-1', type: 'table', x: w / 2 - 30, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 10, y: h / 2, width: 20, height: 30 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 35, y: h / 2 - 20, width: 70, height: 50 },
  ],

  // House 30: Council hall
  30: (w, h) => [
    { id: 'fireplace-1', type: 'fireplace', x: w / 2 - 25, y: 20, width: 50, height: 70 },
    { id: 'table-1', type: 'table', x: w / 2 - 80, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'table-2', type: 'table', x: w / 2 + 20, y: h / 2 - 20, width: 60, height: 40 },
    { id: 'chair-1', type: 'chair', x: w / 2 - 100, y: h / 2, width: 20, height: 30 },
    { id: 'chair-2', type: 'chair', x: w / 2 + 80, y: h / 2, width: 20, height: 30 },
    { id: 'bookshelf-1', type: 'bookshelf', x: 20, y: 20, width: 40, height: 70 },
    { id: 'bookshelf-2', type: 'bookshelf', x: w - 60, y: 20, width: 40, height: 70 },
    { id: 'lamp-1', type: 'lamp', x: w / 2 - 10, y: h / 2 - 60, width: 20, height: 45 },
    { id: 'rug-1', type: 'rug', x: w / 2 - 60, y: h / 2 - 30, width: 120, height: 70 },
  ],
};

export class InteriorFurnitureLayer implements Layer {
  zIndex = 1;

  private furniture: FurnitureItem[] = [];
  private playerPos: WorldPosition = { x: 0, y: 0 };
  private playerFacing: 'up' | 'down' | 'left' | 'right' = 'down';
  private renderPlayer: boolean = true;

  private config: InteriorConfig = {
    roomX: 320,
    roomY: 250,
    roomWidth: 320,
    roomHeight: 240,
  };

  setRoomConfig(config: InteriorConfig): void {
    this.config = config;
  }

  /**
   * Control whether this layer renders the (placeholder) player sprite.
   * OverworldV2 provides its own PlayerLayer, so it disables this to avoid double-rendering.
   */
  setRenderPlayer(renderPlayer: boolean): void {
    this.renderPlayer = renderPlayer;
  }

  /**
   * Collision helper for top-down movement:
   * Treats non-rug furniture as solid "footprints" and blocks the player's feet collider.
   */
  isBlocked(worldX: number, worldY: number, collider: Collider = { halfWidth: 10, halfHeight: 7 }): boolean {
    const playerRect: CollisionRect = {
      x: worldX - collider.halfWidth,
      y: worldY - collider.halfHeight,
      width: collider.halfWidth * 2,
      height: collider.halfHeight * 2,
    };

    for (const rect of this.getObstacleRectsWorld()) {
      if (rectsIntersect(playerRect, rect)) return true;
    }
    return false;
  }

  private getObstacleRectsWorld(): CollisionRect[] {
    const { roomX, roomY } = this.config;
    const rects: CollisionRect[] = [];

    for (const item of this.furniture) {
      if (item.type === 'rug') continue;

      const local = getFurnitureFootprint(item);
      if (!local) continue;

      rects.push({
        x: roomX + local.x,
        y: roomY + local.y,
        width: local.width,
        height: local.height,
      });
    }

    return rects;
  }

  /**
   * Set furniture layout for current room
   */
  setFurniture(items: FurnitureItem[]): void {
    this.furniture = items;
  }

  /**
   * Generate default furniture for a house interior
   */
  generateDefaultFurniture(): void {
    const { roomWidth, roomHeight } = this.config;

    this.furniture = [
      // Table in center
      { id: 'table-1', type: 'table', x: roomWidth / 2 - 30, y: roomHeight / 2 - 20, width: 60, height: 40 },
      // Chairs around table
      { id: 'chair-1', type: 'chair', x: roomWidth / 2 - 50, y: roomHeight / 2, width: 20, height: 30 },
      { id: 'chair-2', type: 'chair', x: roomWidth / 2 + 30, y: roomHeight / 2, width: 20, height: 30 },
      // Bed in corner
      { id: 'bed-1', type: 'bed', x: 20, y: 40, width: 50, height: 80 },
      // Bookshelf against wall
      { id: 'bookshelf-1', type: 'bookshelf', x: roomWidth - 50, y: 20, width: 40, height: 70 },
      // Chest
      { id: 'chest-1', type: 'chest', x: 100, y: roomHeight - 50, width: 40, height: 30 },
      // Rug (no shadow, flat)
      { id: 'rug-1', type: 'rug', x: roomWidth / 2 - 50, y: roomHeight / 2 - 30, width: 100, height: 60 },
    ];
  }

  /**
   * Generate furniture layout for a specific house
   */
  generateHouseFurniture(houseNum: number): void {
    const { roomWidth, roomHeight } = this.config;

    const layout = HOUSE_FURNITURE_LAYOUTS[houseNum];

    if (layout) {
      this.furniture = layout(roomWidth, roomHeight);
    } else {
      // Fall back to default for houses beyond defined layouts
      this.generateDefaultFurniture();
    }
  }

  setPlayerPosition(pos: WorldPosition, facing: 'up' | 'down' | 'left' | 'right'): void {
    // Convert world position to room-relative position
    this.playerPos = {
      x: pos.x - this.config.roomX,
      y: pos.y - this.config.roomY,
    };
    this.playerFacing = facing;
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera): void {
    const { roomX, roomY } = this.config;

    // Combine furniture and player for Y-sorting
    const renderables: Array<{ item: FurnitureItem | 'player'; y: number }> = [];

    for (const item of this.furniture) {
      renderables.push({ item, y: item.y + item.height });
    }

    // Add player
    if (this.renderPlayer) {
      renderables.push({ item: 'player', y: this.playerPos.y });
    }

    // Sort by Y (bottom of item)
    renderables.sort((a, b) => a.y - b.y);

    // Render each item
    for (const { item } of renderables) {
      if (item === 'player') {
        this.drawPlayer(ctx, camera, roomX, roomY);
        continue;
      }
      this.drawFurniture(ctx, camera, item, roomX, roomY);
    }

    // Draw exit door marker at bottom center
    this.drawExitMarker(ctx, camera, roomX, roomY);
  }

  private drawFurniture(ctx: CanvasRenderingContext2D, camera: Camera, item: FurnitureItem, roomX: number, roomY: number): void {
    const worldX = roomX + item.x;
    const worldY = roomY + item.y;
    const { x, y } = (camera as any).worldToScreenSnapped(worldX, worldY);
    const z = (camera as any).zoom;

    // Skip shadow for flat items like rugs
    if (item.type !== 'rug') {
      // Draw drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(
        x + (item.width * z) / 2,
        y + item.height * z + 4 * z,
        item.width * 0.4 * z,
        6 * z,
        0, 0, Math.PI * 2
      );
      ctx.fill();
    }

    // Draw furniture placeholder based on type
    this.drawFurniturePlaceholder(ctx, item, x, y, z);
  }

  private drawFurniturePlaceholder(ctx: CanvasRenderingContext2D, item: FurnitureItem, x: number, y: number, z: number): void {
    ctx.save();
    const w = item.width * z;
    const h = item.height * z;

    switch (item.type) {
      case 'table':
        // Table top
        ctx.fillStyle = '#6B4423';
        ctx.fillRect(x, y, w, h);
        // Legs
        ctx.fillStyle = '#4a3010';
        ctx.fillRect(x + 5 * z, y + h - 5 * z, 6 * z, 8 * z);
        ctx.fillRect(x + w - 11 * z, y + h - 5 * z, 6 * z, 8 * z);
        break;

      case 'chair':
        // Seat
        ctx.fillStyle = '#7B5B3A';
        ctx.fillRect(x, y + 10 * z, w, 12 * z);
        // Back
        ctx.fillStyle = '#6B4B2A';
        ctx.fillRect(x + 2 * z, y, w - 4 * z, 12 * z);
        // Legs
        ctx.fillStyle = '#4a3010';
        ctx.fillRect(x + 2 * z, y + 22 * z, 4 * z, 10 * z);
        ctx.fillRect(x + w - 6 * z, y + 22 * z, 4 * z, 10 * z);
        break;

      case 'bed':
        // Frame
        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(x, y, w, h);
        // Mattress
        ctx.fillStyle = '#e8e0d8';
        ctx.fillRect(x + 4 * z, y + 4 * z, w - 8 * z, h - 20 * z);
        // Pillow
        ctx.fillStyle = '#f0f0e8';
        ctx.fillRect(x + 6 * z, y + 6 * z, w - 12 * z, 20 * z);
        // Blanket
        ctx.fillStyle = '#8a6050';
        ctx.fillRect(x + 4 * z, y + 30 * z, w - 8 * z, h - 46 * z);
        break;

      case 'bookshelf':
        // Frame
        ctx.fillStyle = '#5a3a2a';
        ctx.fillRect(x, y, w, h);
        // Shelves
        ctx.fillStyle = '#7a5a4a';
        for (let sy = 15; sy < item.height - 10; sy += 20) {
          ctx.fillRect(x + 3 * z, y + sy * z, w - 6 * z, 4 * z);
        }
        // Books (colored spines)
        const bookColors = ['#c04040', '#4060c0', '#40a040', '#a0a040', '#8040a0'];
        for (let sy = 4; sy < item.height - 20; sy += 20) {
          for (let bx = 0; bx < 5; bx++) {
            const color = bookColors[(sy + bx) % bookColors.length] ?? '#c04040';
            ctx.fillStyle = color;
            ctx.fillRect(x + (5 + bx * 7) * z, y + sy * z, 6 * z, 14 * z);
          }
        }
        break;

      case 'chest':
        // Body
        ctx.fillStyle = '#6a4a30';
        ctx.fillRect(x, y + 8 * z, w, h - 8 * z);
        // Lid
        ctx.fillStyle = '#7a5a40';
        ctx.fillRect(x, y, w, 12 * z);
        // Metal trim
        ctx.fillStyle = '#a0a0a0';
        ctx.fillRect(x + w / 2 - 6 * z, y + 4 * z, 12 * z, 20 * z);
        break;

      case 'rug':
        // Decorative rug pattern
        ctx.fillStyle = '#804040';
        ctx.fillRect(x, y, w, h);
        // Border
        ctx.strokeStyle = '#c08040';
        ctx.lineWidth = 3 * z;
        ctx.strokeRect(x + 5 * z, y + 5 * z, w - 10 * z, h - 10 * z);
        // Center pattern
        ctx.fillStyle = '#c08040';
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, 15 * z, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'plant':
        // Pot
        ctx.fillStyle = '#8a5a4a';
        ctx.fillRect(x + w / 4, y + h - 15 * z, w / 2, 15 * z);
        // Plant
        ctx.fillStyle = '#3a8a3a';
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, w / 3, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'lamp':
        // Base
        ctx.fillStyle = '#a0a0a0';
        ctx.fillRect(x + w / 2 - 8 * z, y + h - 10 * z, 16 * z, 10 * z);
        // Pole
        ctx.fillStyle = '#808080';
        ctx.fillRect(x + w / 2 - 2 * z, y + 15 * z, 4 * z, h - 25 * z);
        // Shade
        ctx.fillStyle = '#e8d8c0';
        ctx.beginPath();
        ctx.moveTo(x, y + 15 * z);
        ctx.lineTo(x + w, y + 15 * z);
        ctx.lineTo(x + w - 5 * z, y);
        ctx.lineTo(x + 5 * z, y);
        ctx.closePath();
        ctx.fill();
        break;

      case 'fireplace':
        // Stone frame
        ctx.fillStyle = '#6a6a6a';
        ctx.fillRect(x, y, w, h);
        // Opening
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(x + 8 * z, y + 15 * z, w - 16 * z, h - 15 * z);
        // Fire glow
        ctx.fillStyle = 'rgba(255, 100, 50, 0.6)';
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h - 10 * z, 15 * z, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  private drawPlayer(ctx: CanvasRenderingContext2D, camera: Camera, roomX: number, roomY: number): void {
    const worldX = roomX + this.playerPos.x;
    const worldY = roomY + this.playerPos.y;
    const { x, y } = (camera as any).worldToScreenSnapped(worldX, worldY);
    const z = (camera as any).zoom;
    
    const width = 28 * z;
    const height = 40 * z;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + 3 * z, 12 * z, 5 * z, 0, 0, Math.PI * 2);
    ctx.fill();

    // Player body
    ctx.fillStyle = '#3498db';
    ctx.fillRect(x - width / 2, y - height, width, height);

    // Head
    ctx.fillStyle = '#f5d5c8';
    ctx.fillRect(x - width / 2 + 4 * z, y - height + 2 * z, width - 8 * z, 12 * z);

    // Direction indicator
    ctx.fillStyle = '#fff';
    let ix = x, iy = y - height / 2;
    switch (this.playerFacing) {
      case 'up': iy = y - height - 4 * z; break;
      case 'down': iy = y + 4 * z; break;
      case 'left': ix = x - width / 2 - 4 * z; break;
      case 'right': ix = x + width / 2 + 4 * z; break;
    }
    ctx.beginPath();
    ctx.arc(ix, iy, 3 * z, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawExitMarker(ctx: CanvasRenderingContext2D, camera: Camera, roomX: number, roomY: number): void {
    const { roomWidth, roomHeight } = this.config;
    const worldX = roomX + roomWidth / 2;
    const worldY = roomY + roomHeight + 10;
    const { x: exitX, y: exitY } = (camera as any).worldToScreenSnapped(worldX, worldY);
    const z = (camera as any).zoom;

    // Pulsing animation
    const pulse = Math.sin(Date.now() * 0.004) * 0.2 + 0.8;

    // Exit glow
    const gradient = ctx.createRadialGradient(exitX, exitY, 0, exitX, exitY, 30 * z);
    gradient.addColorStop(0, `rgba(100, 200, 255, ${0.4 * pulse})`);
    gradient.addColorStop(1, 'rgba(100, 200, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(exitX, exitY, 30 * z, 0, Math.PI * 2);
    ctx.fill();

    // Exit text
    ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
    const fontSize = Math.max(8, Math.round(11 * z));
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('EXIT', exitX, exitY + 4 * z);
  }
}

function rectsIntersect(a: CollisionRect, b: CollisionRect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function getFurnitureFootprint(item: FurnitureItem): CollisionRect | null {
  // Rugs are decorative and intentionally non-blocking.
  if (item.type === 'rug') return null;

  const insetX = Math.max(2, Math.round(item.width * 0.08));

  // Use type-specific heuristics so the player can still "approach" objects from the front
  // without clipping through their visible base.
  const params: Record<FurnitureItem['type'], { top: number; height: number }> = {
    table: { top: 0.45, height: 0.55 },
    chair: { top: 0.35, height: 0.65 },
    bed: { top: 0.30, height: 0.70 },
    bookshelf: { top: 0.65, height: 0.35 },
    chest: { top: 0.50, height: 0.50 },
    fireplace: { top: 0.60, height: 0.40 },
    plant: { top: 0.45, height: 0.55 },
    lamp: { top: 0.50, height: 0.50 },
    rug: { top: 0.0, height: 0.0 },
  };

  const p = params[item.type] ?? { top: 0.55, height: 0.45 };
  const y = item.y + item.height * p.top;
  const maxH = item.y + item.height - y;
  const h = Math.max(2, Math.min(item.height * p.height, maxH));

  const width = Math.max(4, item.width - insetX * 2);
  return {
    x: item.x + insetX,
    y,
    width,
    height: h,
  };
}
