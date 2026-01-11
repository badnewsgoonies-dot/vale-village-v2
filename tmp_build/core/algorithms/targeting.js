"use strict";
/**
 * Targeting algorithms
 * Resolve target sets for abilities
 * Pure functions, deterministic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTargets = resolveTargets;
exports.filterValidTargets = filterValidTargets;
exports.getValidTargets = getValidTargets;
const Unit_1 = require("../models/Unit");
/**
 * Resolve targets for an ability
 * Returns array of units matching the ability's target type
 */
function resolveTargets(ability, caster, playerUnits, enemyUnits) {
    const isPlayerUnit = playerUnits.some(u => u.id === caster.id);
    const canTargetKO = Boolean(ability.revivesFallen || ability.revive);
    switch (ability.targets) {
        case 'single-enemy':
            return isPlayerUnit
                ? enemyUnits.filter(u => canTargetKO || !(0, Unit_1.isUnitKO)(u))
                : playerUnits.filter(u => canTargetKO || !(0, Unit_1.isUnitKO)(u));
        case 'all-enemies':
            return isPlayerUnit
                ? enemyUnits.filter(u => canTargetKO || !(0, Unit_1.isUnitKO)(u))
                : playerUnits.filter(u => canTargetKO || !(0, Unit_1.isUnitKO)(u));
        case 'single-ally':
            return isPlayerUnit
                ? playerUnits.filter(u => canTargetKO || !(0, Unit_1.isUnitKO)(u))
                : enemyUnits.filter(u => canTargetKO || !(0, Unit_1.isUnitKO)(u));
        case 'all-allies':
            return isPlayerUnit
                ? playerUnits.filter(u => canTargetKO || !(0, Unit_1.isUnitKO)(u))
                : enemyUnits.filter(u => canTargetKO || !(0, Unit_1.isUnitKO)(u));
        case 'self':
            return [caster];
        default:
            return [];
    }
}
/**
 * Filter targets by validity (e.g., healing only works on alive units)
 */
function filterValidTargets(targets, ability) {
    const canTargetKO = Boolean(ability.revivesFallen || ability.revive);
    if (ability.type === 'healing' && !canTargetKO) {
        // Healing only works on alive units (unless it revives)
        return targets.filter(u => !(0, Unit_1.isUnitKO)(u));
    }
    // If it's not a revival ability, it generally shouldn't target KO'd units
    if (!canTargetKO) {
        return targets.filter(u => !(0, Unit_1.isUnitKO)(u));
    }
    // Other abilities can target KO'd units (for revival)
    return targets;
}
/**
 * Get valid targets for UI selection
 * Simplified version for UI components that need to show selectable targets
 * @param ability - Ability (null for basic attack)
 * @param caster - Unit casting the ability
 * @param playerTeam - Player team
 * @param enemies - Enemy units
 * @returns Array of valid target units for selection
 */
function getValidTargets(ability, caster, playerTeam, enemies) {
    const isPlayerUnit = playerTeam.units.some(u => u.id === caster.id);
    const allies = isPlayerUnit ? playerTeam.units : enemies;
    const foes = isPlayerUnit ? enemies : playerTeam.units;
    if (!ability) {
        // Basic attack targets foes
        return foes.filter(u => !(0, Unit_1.isUnitKO)(u));
    }
    const canTargetKO = Boolean(ability.revivesFallen || ability.revive);
    // When ability can target KO'd units (revival), make those units selectable
    // by clearing UI-level isKo flags so UI layers that rely on that flag allow clicks.
    // This mutates unit objects deliberately to keep UI & core in sync for selection.
    if (canTargetKO) {
        for (const u of [...allies, ...foes]) {
            if (u?.isKo) {
                u.isKo = false;
            }
        }
    }
    switch (ability.targets) {
        case 'single-enemy':
        case 'all-enemies':
            return foes.filter(u => canTargetKO || !(0, Unit_1.isUnitKO)(u));
        case 'single-ally':
        case 'all-allies':
            return allies.filter(u => canTargetKO || !(0, Unit_1.isUnitKO)(u));
        case 'self':
            return [caster];
        default:
            return [];
    }
}
