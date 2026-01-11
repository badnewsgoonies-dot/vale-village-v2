"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LUMEN_FAWN = void 0;
const abilities_1 = require("./abilities");
exports.LUMEN_FAWN = {
    id: "lumen-fawn",
    name: "Lumen Fawn",
    level: 1,
    element: "Venus",
    stats: {
        hp: 45,
        pp: 10,
        atk: 14,
        def: 8,
        mag: 6,
        spd: 12,
    },
    abilities: [
        { ...abilities_1.STRIKE },
        { ...abilities_1.QUAKE },
    ],
    baseXp: 12,
    baseGold: 6,
    drops: [],
};
