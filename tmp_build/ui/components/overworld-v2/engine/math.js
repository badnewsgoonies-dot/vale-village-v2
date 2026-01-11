"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lerp = lerp;
exports.clamp = clamp;
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
