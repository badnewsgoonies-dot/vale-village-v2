"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopsSchema = exports.ShopSchema = void 0;
const zod_1 = require("zod");
/**
 * Shop Schema
 * Validates shop definitions for the game
 */
exports.ShopSchema = zod_1.z.object({
    id: zod_1.z.string().min(1).regex(/^[a-z-]+$/, 'Shop ID must be kebab-case'),
    name: zod_1.z.string().min(1),
    availableItems: zod_1.z.array(zod_1.z.string().min(1)),
    // Note: unlockCondition is a function and cannot be validated by Zod
    // It will be preserved during runtime but not validated
});
exports.ShopsSchema = zod_1.z.record(zod_1.z.string(), exports.ShopSchema);
