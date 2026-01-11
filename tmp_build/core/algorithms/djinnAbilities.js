"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElementCompatibility = getElementCompatibility;
exports.calculateDjinnBonusesForUnit = calculateDjinnBonusesForUnit;
exports.getDjinnGrantedAbilitiesForUnit = getDjinnGrantedAbilitiesForUnit;
exports.mergeDjinnAbilitiesIntoUnit = mergeDjinnAbilitiesIntoUnit;
exports.getDjinnAbilityMetadataForUnit = getDjinnAbilityMetadataForUnit;
exports.getLockedDjinnAbilityMetadataForUnit = getLockedDjinnAbilityMetadataForUnit;
const djinn_1 = require("./djinn");
const djinn_2 = require("../../data/definitions/djinn");
const djinnAbilities_1 = require("../../data/definitions/djinnAbilities");
/**
 * Element Opposition Pairs (Tetra System)
 * - Venus ↔ Jupiter (Earth opposes Wind)
 * - Mars ↔ Mercury (Fire opposes Water)
 *
 * Counter Djinn give stat DEBUFF but grant STRONGER abilities (2 skills)
 * Same element gives stat BONUS and 2 skills
 * Neutral (adjacent) gives small bonus and 1 skill
 */
const COUNTER_PAIRS = {
    Venus: 'Jupiter', // Earth opposes Wind
    Jupiter: 'Venus', // Wind opposes Earth
    Mars: 'Mercury', // Fire opposes Water
    Mercury: 'Mars', // Water opposes Fire
    Neutral: 'Neutral',
};
function getElementCompatibility(unitElement, djinnElement) {
    if (unitElement === djinnElement) {
        return 'same';
    }
    if (COUNTER_PAIRS[unitElement] === djinnElement) {
        return 'counter';
    }
    return 'neutral';
}
function calculateDjinnBonusesForUnit(unit, team) {
    const setDjinnIds = (0, djinn_1.getSetDjinnIds)(team);
    const totals = {};
    for (const djinnId of setDjinnIds) {
        const djinnElement = getDjinnElementFromId(djinnId);
        if (!djinnElement) {
            continue;
        }
        const compatibility = getElementCompatibility(unit.element, djinnElement);
        const addStat = (key, value) => {
            totals[key] = (totals[key] || 0) + value;
        };
        switch (compatibility) {
            case 'same':
                addStat('atk', 4);
                addStat('def', 3);
                break;
            case 'counter':
                addStat('atk', -3);
                addStat('def', -2);
                break;
            case 'neutral':
                addStat('atk', 2);
                addStat('def', 2);
                break;
        }
    }
    return totals;
}
function getDjinnElementFromId(djinnId) {
    return djinn_2.DJINN[djinnId]?.element ?? null;
}
/**
 * Get Standby Djinn IDs from team (Djinn that have been activated)
 */
function getStandbyDjinnIds(team) {
    return team.equippedDjinn.filter(djinnId => {
        const tracker = team.djinnTrackers[djinnId];
        return tracker?.state === 'Standby';
    });
}
function getDjinnGrantedAbilitiesForUnit(unit, team) {
    const setDjinnIds = (0, djinn_1.getSetDjinnIds)(team);
    const standbyDjinnIds = getStandbyDjinnIds(team);
    const granted = [];
    // Same & Neutral elements: Grant abilities when Djinn is SET
    for (const djinnId of setDjinnIds) {
        const djinn = djinn_2.DJINN[djinnId];
        if (!djinn)
            continue;
        const compatibility = getElementCompatibility(unit.element, djinn.element);
        const abilityGroup = djinn.grantedAbilities[unit.id];
        if (!abilityGroup)
            continue;
        // Counter abilities are granted on STANDBY, not SET
        if (compatibility === 'counter')
            continue;
        let abilitiesToGrant = [];
        switch (compatibility) {
            case 'same':
                // Same element: 2 abilities when SET
                abilitiesToGrant = abilityGroup.same.slice(0, 2);
                break;
            case 'neutral':
                // Neutral (adjacent) element: 1 ability when SET
                abilitiesToGrant = abilityGroup.neutral.slice(0, 1);
                break;
        }
        granted.push(...abilitiesToGrant);
    }
    // Counter elements: Grant STRONGER abilities when Djinn is STANDBY (used)
    // This creates strategic depth - use the Djinn to unlock counter abilities!
    for (const djinnId of standbyDjinnIds) {
        const djinn = djinn_2.DJINN[djinnId];
        if (!djinn)
            continue;
        const compatibility = getElementCompatibility(unit.element, djinn.element);
        const abilityGroup = djinn.grantedAbilities[unit.id];
        if (!abilityGroup)
            continue;
        // Only counter abilities unlock on Standby
        if (compatibility !== 'counter')
            continue;
        // Counter element: 2 STRONGER abilities when STANDBY
        const abilitiesToGrant = abilityGroup.counter.slice(0, 2);
        granted.push(...abilitiesToGrant);
    }
    return [...new Set(granted)];
}
function mergeDjinnAbilitiesIntoUnit(unit, team) {
    const abilityIds = getDjinnGrantedAbilitiesForUnit(unit, team);
    const existingIds = new Set(unit.abilities.map((ability) => ability.id));
    const baseAbilities = unit.abilities.filter(ability => !djinnAbilities_1.DJINN_ABILITIES[ability.id] || abilityIds.includes(ability.id));
    const baseUnlocked = unit.unlockedAbilityIds.filter(id => !djinnAbilities_1.DJINN_ABILITIES[id] || abilityIds.includes(id));
    const djinnAbilities = abilityIds
        .map((id) => djinnAbilities_1.DJINN_ABILITIES[id])
        .filter((ability) => ability !== undefined)
        .filter((ability) => !existingIds.has(ability.id));
    const mergedAbilities = [...baseAbilities, ...djinnAbilities];
    const mergedUnlocked = Array.from(new Set([...baseUnlocked, ...abilityIds]));
    return {
        ...unit,
        abilities: mergedAbilities,
        unlockedAbilityIds: mergedUnlocked,
    };
}
function getDjinnAbilityMetadataForUnit(unit, team, djinnIds) {
    const targetDjinn = djinnIds ?? team.equippedDjinn;
    const seen = new Set();
    const metadata = [];
    for (const djinnId of targetDjinn) {
        const djinn = djinn_2.DJINN[djinnId];
        if (!djinn)
            continue;
        const abilityGroup = djinn.grantedAbilities[unit.id];
        if (!abilityGroup)
            continue;
        const compatibility = getElementCompatibility(unit.element, djinn.element);
        const abilityList = compatibility === 'same'
            ? abilityGroup.same
            : compatibility === 'counter'
                ? abilityGroup.counter
                : abilityGroup.neutral;
        for (const abilityId of abilityList) {
            if (seen.has(abilityId))
                continue;
            seen.add(abilityId);
            metadata.push({
                abilityId,
                djinnId,
                compatibility,
            });
        }
    }
    return metadata;
}
function getLockedDjinnAbilityMetadataForUnit(unit, team) {
    const granted = new Set(getDjinnGrantedAbilitiesForUnit(unit, team));
    return getDjinnAbilityMetadataForUnit(unit, team).filter((meta) => !granted.has(meta.abilityId));
}
