"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for Stats validation
 */
exports.StatsSchema = zod_1.z.object({
    hp: zod_1.z.number().int().min(0),
    pp: zod_1.z.number().int().min(0),
    atk: zod_1.z.number().int().min(0),
    def: zod_1.z.number().int().min(0),
    mag: zod_1.z.number().int().min(0),
    spd: zod_1.z.number().int().min(0),
});
