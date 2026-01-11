"use strict";
/**
 * Sprite Components
 * Export all sprite-related components
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundSprite = exports.SimpleSprite = exports.Sprite = void 0;
var Sprite_1 = require("./Sprite");
Object.defineProperty(exports, "Sprite", { enumerable: true, get: function () { return Sprite_1.Sprite; } });
var SimpleSprite_1 = require("./SimpleSprite");
Object.defineProperty(exports, "SimpleSprite", { enumerable: true, get: function () { return SimpleSprite_1.SimpleSprite; } });
var BackgroundSprite_1 = require("./BackgroundSprite");
Object.defineProperty(exports, "BackgroundSprite", { enumerable: true, get: function () { return BackgroundSprite_1.BackgroundSprite; } });
__exportStar(require("./catalog"), exports);
__exportStar(require("./types"), exports);
