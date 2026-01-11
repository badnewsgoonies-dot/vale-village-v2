"use strict";
/**
 * Encounter Service
 * Handles loading encounters and converting them to battle state
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEncounter = loadEncounter;
exports.createBattleFromEncounter = createBattleFromEncounter;
exports.getChapter1Encounters = getChapter1Encounters;
exports.isBossEncounter = isBossEncounter;
exports.rollForRandomEncounter = rollForRandomEncounter;
exports.selectRandomEncounter = selectRandomEncounter;
exports.processRandomEncounter = processRandomEncounter;
const enemies_1 = require("../../data/definitions/enemies");
const encounters_1 = require("../../data/definitions/encounters");
const enemyToUnit_1 = require("../utils/enemyToUnit");
const BattleService_1 = require("./BattleService");
function getEncounterEnemyStatMultiplier(difficulty) {
    switch (difficulty) {
        case 'easy':
            return 0.9;
        case 'hard':
            return 1.1;
        case 'boss':
            return 1.2;
        case 'medium':
        default:
            return 1.0;
    }
}
function mapEncounterDifficultyToBattleTier(difficulty) {
    switch (difficulty) {
        case 'boss':
            return 'boss';
        case 'hard':
            return 'elite';
        case 'easy':
        case 'medium':
        default:
            return 'normal';
    }
}
function scaleStats(stats, multiplier) {
    const scale = (value) => Math.max(1, Math.round(value * multiplier));
    return {
        hp: scale(stats.hp),
        pp: scale(stats.pp),
        atk: scale(stats.atk),
        def: scale(stats.def),
        mag: scale(stats.mag),
        spd: scale(stats.spd),
    };
}
function scaleEnemyUnitForEncounter(unit, difficulty) {
    const multiplier = getEncounterEnemyStatMultiplier(difficulty);
    if (multiplier === 1.0) {
        return unit;
    }
    const scaledBaseStats = scaleStats(unit.baseStats, multiplier);
    const maxHp = scaledBaseStats.hp + (unit.level - 1) * unit.growthRates.hp;
    return {
        ...unit,
        baseStats: scaledBaseStats,
        currentHp: maxHp,
    };
}
/**
 * Load an encounter by ID
 * Returns the encounter definition or null if not found
 */
function loadEncounter(encounterId) {
    return encounters_1.ENCOUNTERS[encounterId] || null;
}
/**
 * Create battle state from an encounter
 * Converts encounter enemy IDs to Unit instances and initializes battle
 */
function createBattleFromEncounter(encounterId, playerTeam, rng) {
    const encounter = loadEncounter(encounterId);
    if (!encounter) {
        return null;
    }
    // Convert enemy IDs to Unit instances with unique IDs
    const enemyUnits = encounter.enemies
        .map((enemyId, index) => {
        const enemyDef = enemies_1.ENEMIES[enemyId];
        if (!enemyDef) {
            console.error(`Enemy not found: ${enemyId}`);
            return null;
        }
        const enemy = (0, enemyToUnit_1.enemyToUnit)(enemyDef);
        // Give each enemy a unique ID (e.g., wolf_0, wolf_1)
        return { ...enemy, id: `${enemy.id}_${index}` };
    })
        .filter((u) => u !== null);
    if (enemyUnits.length === 0) {
        console.error(`No valid enemies found for encounter: ${encounterId}`);
        return null;
    }
    const scaledEnemyUnits = enemyUnits.map((unit) => scaleEnemyUnitForEncounter(unit, encounter.difficulty));
    // Create battle state with encounter metadata
    const battleResult = (0, BattleService_1.startBattle)(playerTeam, scaledEnemyUnits, rng);
    if (!battleResult.ok) {
        console.error(`Failed to start battle: ${battleResult.error}`);
        return null;
    }
    // Add encounter metadata
    const battleWithMeta = {
        ...battleResult.value,
        encounterId: encounter.id, // Legacy field
        meta: {
            encounterId: encounter.id,
            difficulty: mapEncounterDifficultyToBattleTier(encounter.difficulty),
        },
        isBossBattle: encounter.difficulty === 'boss',
        leaderSpriteId: encounter.leaderSpriteId,
        backgroundId: encounter.backgroundId,
    };
    return { battle: battleWithMeta, encounter };
}
/**
 * Get the next encounter in a chapter sequence
 * For now, returns hardcoded Chapter 1 sequence
 */
function getChapter1Encounters() {
    const baseOrder = [
        'c1_normal_1',
        'c1_normal_2',
        'c1_normal_3',
        'c1_mini_boss',
        'c1_boss',
    ];
    // Include any additional Chapter 1 encounters declared in ENCOUNTERS (c1_ prefix),
    // preserving the preferred base order and appending any extras in sorted order.
    const discovered = Object.keys(encounters_1.ENCOUNTERS)
        .filter((id) => id.startsWith('c1_'))
        .sort();
    const merged = [
        ...baseOrder,
        ...discovered.filter((id) => !baseOrder.includes(id)),
    ];
    return merged;
}
/**
 * Check if an encounter is a boss encounter
 */
function isBossEncounter(encounterId) {
    const encounter = loadEncounter(encounterId);
    return encounter?.id.includes('boss') ?? false;
}
/**
 * Roll for a random encounter based on map encounter rate
 * Returns true if an encounter should trigger
 */
function rollForRandomEncounter(encounterRate, rng) {
    if (encounterRate <= 0)
        return false;
    const roll = rng.next();
    return roll < encounterRate;
}
/**
 * Select a random encounter from a pool of encounter IDs
 * Returns null if pool is empty or invalid
 */
function selectRandomEncounter(encounterPool, rng) {
    if (!encounterPool || encounterPool.length === 0) {
        return null;
    }
    const index = Math.floor(rng.next() * encounterPool.length);
    const encounterId = encounterPool[index];
    return encounterId ?? null;
}
/**
 * Process random encounter logic for a map
 * Returns encounter ID if one triggers, null otherwise
 */
function processRandomEncounter(mapEncounterRate, mapEncounterPool, rng) {
    if (!mapEncounterRate || !mapEncounterPool) {
        return null;
    }
    if (!rollForRandomEncounter(mapEncounterRate, rng)) {
        return null;
    }
    return selectRandomEncounter(mapEncounterPool, rng);
}
