"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIRE_TOAD = void 0;
const abilities_1 = require("./abilities");
exports.MIRE_TOAD = {
    id: 'mire-toad',
    name: 'Mire Toad',
    level: 2,
    element: 'Mercury',
    stats: {
        hp: 60,
        pp: 15,
        atk: 18,
        def: 12,
        mag: 4,
        spd: 10,
    },
    abilities: [
        { ...abilities_1.STRIKE },
        { ...abilities_1.ICE_SHARD },
    ],
    baseXp: 15,
    baseGold: 8,
    drops: [],
};
