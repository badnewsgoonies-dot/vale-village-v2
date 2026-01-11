"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarterKitsSchema = exports.StarterKitSchema = void 0;
const zod_1 = require("zod");
const UnitSchema_1 = require("./UnitSchema");
/**
 * Starter Kit Schema
 * Validates starter kit definitions for each element
 */
exports.StarterKitSchema = zod_1.z.object({
    element: UnitSchema_1.ElementSchema,
    name: zod_1.z.string().min(1),
    cost: zod_1.z.number().int().min(0),
    equipment: zod_1.z.object({
        weapon: zod_1.z.string().min(1),
        armor: zod_1.z.string().min(1),
        helm: zod_1.z.string().min(1),
        boots: zod_1.z.string().min(1),
        accessory: zod_1.z.string().min(1),
    }),
});
exports.StarterKitsSchema = zod_1.z.record(UnitSchema_1.ElementSchema, exports.StarterKitSchema);
