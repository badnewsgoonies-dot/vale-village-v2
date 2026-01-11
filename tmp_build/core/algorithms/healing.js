"use strict";
/**
 * Healing algorithms
 * Pure utilities for restoring unit HP/status
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoHealUnits = autoHealUnits;
const Unit_1 = require("../models/Unit");
/**
 * Auto-heal all units after battle
 * Restores HP to max and clears status effects (pure)
 */
function autoHealUnits(units) {
    return units.map(unit => {
        const maxHp = (0, Unit_1.calculateMaxHp)(unit);
        return {
            ...unit,
            currentHp: maxHp,
            statusEffects: [],
        };
    });
}
