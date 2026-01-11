"use strict";
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
exports.OverworldEngineV2 = exports.Camera = void 0;
var Camera_1 = require("./Camera");
Object.defineProperty(exports, "Camera", { enumerable: true, get: function () { return Camera_1.Camera; } });
var OverworldEngineV2_1 = require("./OverworldEngineV2");
Object.defineProperty(exports, "OverworldEngineV2", { enumerable: true, get: function () { return OverworldEngineV2_1.OverworldEngineV2; } });
__exportStar(require("./types"), exports);
