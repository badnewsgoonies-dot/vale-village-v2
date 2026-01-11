"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentAvailabilitySchema = void 0;
const zod_1 = require("zod");
exports.ContentAvailabilitySchema = zod_1.z.array(zod_1.z.enum(['campaign', 'tower'])).min(1);
