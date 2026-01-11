"use strict";
/**
 * Overworld Canvas Module
 * Exports the main component and engine utilities
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
exports.Camera = exports.OverworldEngine = exports.OverworldCanvas = void 0;
var OverworldCanvas_1 = require("./OverworldCanvas");
Object.defineProperty(exports, "OverworldCanvas", { enumerable: true, get: function () { return OverworldCanvas_1.OverworldCanvas; } });
var OverworldEngine_1 = require("./engine/OverworldEngine");
Object.defineProperty(exports, "OverworldEngine", { enumerable: true, get: function () { return OverworldEngine_1.OverworldEngine; } });
var Camera_1 = require("./engine/Camera");
Object.defineProperty(exports, "Camera", { enumerable: true, get: function () { return Camera_1.Camera; } });
__exportStar(require("./engine/types"), exports);
