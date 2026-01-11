"use strict";
/**
 * InteriorFurnitureLayer
 * Renders Y-sorted furniture with drop shadows for indoor scenes
 * Creates depth through Y-position sorting and shadow rendering
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteriorFurnitureLayer = void 0;
/**
 * House-specific furniture layouts
 * Each function receives roomWidth and roomHeight and returns a furniture array
 */
const HOUSE_FURNITURE_LAYOUTS = {
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
class InteriorFurnitureLayer {
    constructor() {
        Object.defineProperty(this, "zIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "furniture", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "playerPos", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { x: 0, y: 0 }
        });
        Object.defineProperty(this, "playerFacing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'down'
        });
        Object.defineProperty(this, "renderPlayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                roomX: 320,
                roomY: 250,
                roomWidth: 320,
                roomHeight: 240,
            }
        });
    }
    setRoomConfig(config) {
        this.config = config;
    }
    /**
     * Control whether this layer renders the (placeholder) player sprite.
     * OverworldV2 provides its own PlayerLayer, so it disables this to avoid double-rendering.
     */
    setRenderPlayer(renderPlayer) {
        this.renderPlayer = renderPlayer;
    }
    /**
     * Collision helper for top-down movement:
     * Treats non-rug furniture as solid "footprints" and blocks the player's feet collider.
     */
    isBlocked(worldX, worldY, collider = { halfWidth: 10, halfHeight: 7 }) {
        const playerRect = {
            x: worldX - collider.halfWidth,
            y: worldY - collider.halfHeight,
            width: collider.halfWidth * 2,
            height: collider.halfHeight * 2,
        };
        for (const rect of this.getObstacleRectsWorld()) {
            if (rectsIntersect(playerRect, rect))
                return true;
        }
        return false;
    }
    getObstacleRectsWorld() {
        const { roomX, roomY } = this.config;
        const rects = [];
        for (const item of this.furniture) {
            if (item.type === 'rug')
                continue;
            const local = getFurnitureFootprint(item);
            if (!local)
                continue;
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
    setFurniture(items) {
        this.furniture = items;
    }
    /**
     * Generate default furniture for a house interior
     */
    generateDefaultFurniture() {
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
    generateHouseFurniture(houseNum) {
        const { roomWidth, roomHeight } = this.config;
        const layout = HOUSE_FURNITURE_LAYOUTS[houseNum];
        if (layout) {
            this.furniture = layout(roomWidth, roomHeight);
        }
        else {
            // Fall back to default for houses beyond defined layouts
            this.generateDefaultFurniture();
        }
    }
    setPlayerPosition(pos, facing) {
        // Convert world position to room-relative position
        this.playerPos = {
            x: pos.x - this.config.roomX,
            y: pos.y - this.config.roomY,
        };
        this.playerFacing = facing;
    }
    render(ctx, _camera) {
        const { roomX, roomY } = this.config;
        // Combine furniture and player for Y-sorting
        const renderables = [];
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
                this.drawPlayer(ctx, roomX, roomY);
                continue;
            }
            this.drawFurniture(ctx, item, roomX, roomY);
        }
        // Draw exit door marker at bottom center
        this.drawExitMarker(ctx, roomX, roomY);
    }
    drawFurniture(ctx, item, roomX, roomY) {
        const x = roomX + item.x;
        const y = roomY + item.y;
        // Skip shadow for flat items like rugs
        if (item.type !== 'rug') {
            // Draw drop shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(x + item.width / 2, y + item.height + 4, item.width * 0.4, 6, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        // Draw furniture placeholder based on type
        this.drawFurniturePlaceholder(ctx, item, x, y);
    }
    drawFurniturePlaceholder(ctx, item, x, y) {
        ctx.save();
        switch (item.type) {
            case 'table':
                // Table top
                ctx.fillStyle = '#6B4423';
                ctx.fillRect(x, y, item.width, item.height);
                // Legs
                ctx.fillStyle = '#4a3010';
                ctx.fillRect(x + 5, y + item.height - 5, 6, 8);
                ctx.fillRect(x + item.width - 11, y + item.height - 5, 6, 8);
                break;
            case 'chair':
                // Seat
                ctx.fillStyle = '#7B5B3A';
                ctx.fillRect(x, y + 10, item.width, 12);
                // Back
                ctx.fillStyle = '#6B4B2A';
                ctx.fillRect(x + 2, y, item.width - 4, 12);
                // Legs
                ctx.fillStyle = '#4a3010';
                ctx.fillRect(x + 2, y + 22, 4, 10);
                ctx.fillRect(x + item.width - 6, y + 22, 4, 10);
                break;
            case 'bed':
                // Frame
                ctx.fillStyle = '#5a4a3a';
                ctx.fillRect(x, y, item.width, item.height);
                // Mattress
                ctx.fillStyle = '#e8e0d8';
                ctx.fillRect(x + 4, y + 4, item.width - 8, item.height - 20);
                // Pillow
                ctx.fillStyle = '#f0f0e8';
                ctx.fillRect(x + 6, y + 6, item.width - 12, 20);
                // Blanket
                ctx.fillStyle = '#8a6050';
                ctx.fillRect(x + 4, y + 30, item.width - 8, item.height - 46);
                break;
            case 'bookshelf':
                // Frame
                ctx.fillStyle = '#5a3a2a';
                ctx.fillRect(x, y, item.width, item.height);
                // Shelves
                ctx.fillStyle = '#7a5a4a';
                for (let sy = 15; sy < item.height - 10; sy += 20) {
                    ctx.fillRect(x + 3, y + sy, item.width - 6, 4);
                }
                // Books (colored spines)
                const bookColors = ['#c04040', '#4060c0', '#40a040', '#a0a040', '#8040a0'];
                for (let sy = 4; sy < item.height - 20; sy += 20) {
                    for (let bx = 0; bx < 5; bx++) {
                        const color = bookColors[(sy + bx) % bookColors.length] ?? '#c04040';
                        ctx.fillStyle = color;
                        ctx.fillRect(x + 5 + bx * 7, y + sy, 6, 14);
                    }
                }
                break;
            case 'chest':
                // Body
                ctx.fillStyle = '#6a4a30';
                ctx.fillRect(x, y + 8, item.width, item.height - 8);
                // Lid
                ctx.fillStyle = '#7a5a40';
                ctx.fillRect(x, y, item.width, 12);
                // Metal trim
                ctx.fillStyle = '#a0a0a0';
                ctx.fillRect(x + item.width / 2 - 6, y + 4, 12, 20);
                break;
            case 'rug':
                // Decorative rug pattern
                ctx.fillStyle = '#804040';
                ctx.fillRect(x, y, item.width, item.height);
                // Border
                ctx.strokeStyle = '#c08040';
                ctx.lineWidth = 3;
                ctx.strokeRect(x + 5, y + 5, item.width - 10, item.height - 10);
                // Center pattern
                ctx.fillStyle = '#c08040';
                ctx.beginPath();
                ctx.arc(x + item.width / 2, y + item.height / 2, 15, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'plant':
                // Pot
                ctx.fillStyle = '#8a5a4a';
                ctx.fillRect(x + item.width / 4, y + item.height - 15, item.width / 2, 15);
                // Plant
                ctx.fillStyle = '#3a8a3a';
                ctx.beginPath();
                ctx.arc(x + item.width / 2, y + item.height / 2, item.width / 3, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'lamp':
                // Base
                ctx.fillStyle = '#a0a0a0';
                ctx.fillRect(x + item.width / 2 - 8, y + item.height - 10, 16, 10);
                // Pole
                ctx.fillStyle = '#808080';
                ctx.fillRect(x + item.width / 2 - 2, y + 15, 4, item.height - 25);
                // Shade
                ctx.fillStyle = '#e8d8c0';
                ctx.beginPath();
                ctx.moveTo(x, y + 15);
                ctx.lineTo(x + item.width, y + 15);
                ctx.lineTo(x + item.width - 5, y);
                ctx.lineTo(x + 5, y);
                ctx.closePath();
                ctx.fill();
                break;
            case 'fireplace':
                // Stone frame
                ctx.fillStyle = '#6a6a6a';
                ctx.fillRect(x, y, item.width, item.height);
                // Opening
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(x + 8, y + 15, item.width - 16, item.height - 15);
                // Fire glow
                ctx.fillStyle = 'rgba(255, 100, 50, 0.6)';
                ctx.beginPath();
                ctx.arc(x + item.width / 2, y + item.height - 10, 15, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
        ctx.restore();
    }
    drawPlayer(ctx, roomX, roomY) {
        const x = roomX + this.playerPos.x;
        const y = roomY + this.playerPos.y;
        const width = 28;
        const height = 40;
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x, y + 3, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Player body
        ctx.fillStyle = '#3498db';
        ctx.fillRect(x - width / 2, y - height, width, height);
        // Head
        ctx.fillStyle = '#f5d5c8';
        ctx.fillRect(x - width / 2 + 4, y - height + 2, width - 8, 12);
        // Direction indicator
        ctx.fillStyle = '#fff';
        let ix = x, iy = y - height / 2;
        switch (this.playerFacing) {
            case 'up':
                iy = y - height - 4;
                break;
            case 'down':
                iy = y + 4;
                break;
            case 'left':
                ix = x - width / 2 - 4;
                break;
            case 'right':
                ix = x + width / 2 + 4;
                break;
        }
        ctx.beginPath();
        ctx.arc(ix, iy, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    drawExitMarker(ctx, roomX, roomY) {
        const { roomWidth, roomHeight } = this.config;
        const exitX = roomX + roomWidth / 2;
        const exitY = roomY + roomHeight + 10;
        // Pulsing animation
        const pulse = Math.sin(Date.now() * 0.004) * 0.2 + 0.8;
        // Exit glow
        const gradient = ctx.createRadialGradient(exitX, exitY, 0, exitX, exitY, 30);
        gradient.addColorStop(0, `rgba(100, 200, 255, ${0.4 * pulse})`);
        gradient.addColorStop(1, 'rgba(100, 200, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(exitX, exitY, 30, 0, Math.PI * 2);
        ctx.fill();
        // Exit text
        ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('EXIT', exitX, exitY + 4);
    }
}
exports.InteriorFurnitureLayer = InteriorFurnitureLayer;
function rectsIntersect(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
function getFurnitureFootprint(item) {
    // Rugs are decorative and intentionally non-blocking.
    if (item.type === 'rug')
        return null;
    const insetX = Math.max(2, Math.round(item.width * 0.08));
    // Use type-specific heuristics so the player can still "approach" objects from the front
    // without clipping through their visible base.
    const params = {
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
