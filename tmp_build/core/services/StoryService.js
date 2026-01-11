"use strict";
/**
 * Story Service
 * Pure functions for story progression and gating
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAccess = canAccess;
exports.advanceChapter = advanceChapter;
exports.encounterIdToFlagKey = encounterIdToFlagKey;
exports.processEncounterCompletion = processEncounterCompletion;
exports.isHouseUnlocked = isHouseUnlocked;
exports.processStoryFlagForDjinn = processStoryFlagForDjinn;
exports.processStoryFlagForUnit = processStoryFlagForUnit;
const story_1 = require("../models/story");
const DjinnService_1 = require("./DjinnService");
const Unit_1 = require("../models/Unit");
const xp_1 = require("../algorithms/xp");
const storyFlags_1 = require("../../data/definitions/storyFlags");
const units_1 = require("../../data/definitions/units");
/**
 * Check if a requirement is met
 */
function canAccess(state, requirement) {
    if (Array.isArray(requirement)) {
        // All flags must be set
        return requirement.every(flag => (0, story_1.hasFlag)(state, flag));
    }
    return (0, story_1.hasFlag)(state, requirement);
}
/**
 * Advance to next chapter
 * Accepts either encounter ID (e.g., 'c1_boss') or flag key (e.g., 'boss:ch1')
 */
function advanceChapter(state, completedKey) {
    // Normalize to flag key
    const flagKey = encounterIdToFlagKey(completedKey);
    // Chapter 1 -> Chapter 2: Beat Chapter 1 boss
    if (flagKey === 'boss:ch1' && state.chapter === 1) {
        const newState = (0, story_1.setFlag)(state, 'boss:ch1', true);
        return {
            ok: true,
            value: {
                ...newState,
                chapter: 2,
            },
        };
    }
    // Chapter 2 -> Chapter 3: Beat Chapter 2 boss
    if (flagKey === 'boss:ch2' && state.chapter === 2) {
        const newState = (0, story_1.setFlag)(state, 'boss:ch2', true);
        return {
            ok: true,
            value: {
                ...newState,
                chapter: 3,
            },
        };
    }
    // Chapter 3 -> Credits: Beat Chapter 3 boss
    if (flagKey === 'boss:ch3' && state.chapter === 3) {
        const newState = (0, story_1.setFlag)(state, 'boss:ch3', true);
        return {
            ok: true,
            value: {
                ...newState,
                chapter: 4, // Credits chapter
            },
        };
    }
    return {
        ok: false,
        error: `No chapter transition available for ${completedKey} (${flagKey}) at chapter ${state.chapter}`,
    };
}
/**
 * Map encounter ID to flag key
 * Centralized mapping for encounter IDs to story flag keys
 */
function encounterIdToFlagKey(encounterId) {
    // House-based encounters (Chapter 1: Liberation of Vale)
    if (encounterId === 'house-20')
        return 'boss:ch1'; // Final boss
    if (encounterId.startsWith('house-')) {
        const match = encounterId.match(/^house-(\d+)$/);
        if (match) {
            const houseNum = parseInt(match[1], 10);
            return `encounter:ch1:${houseNum}`;
        }
    }
    // Legacy boss encounters
    if (encounterId === 'c1_boss')
        return 'boss:ch1';
    if (encounterId === 'c2_boss')
        return 'boss:ch2';
    if (encounterId === 'c3_boss')
        return 'boss:ch3';
    // Legacy mini-boss encounters
    if (encounterId === 'c1_mini_boss' || encounterId === 'c1_miniboss')
        return 'miniboss:ch1';
    if (encounterId === 'c2_mini_boss' || encounterId === 'c2_miniboss')
        return 'miniboss:ch2';
    if (encounterId === 'c3_mini_boss' || encounterId === 'c3_miniboss')
        return 'miniboss:ch3';
    // Legacy normal encounters (track by chapter and number)
    if (encounterId.startsWith('c1_normal_')) {
        const encounterNum = encounterId.replace('c1_normal_', '');
        return `encounter:ch1:${encounterNum}`;
    }
    if (encounterId.startsWith('c2_normal_')) {
        const encounterNum = encounterId.replace('c2_normal_', '');
        return `encounter:ch2:${encounterNum}`;
    }
    if (encounterId.startsWith('c3_normal_')) {
        const encounterNum = encounterId.replace('c3_normal_', '');
        return `encounter:ch3:${encounterNum}`;
    }
    // If already a flag key, return as-is
    if (encounterId.startsWith('boss:') || encounterId.startsWith('miniboss:') || encounterId.startsWith('encounter:')) {
        return encounterId;
    }
    // Fallback: use encounter ID as flag key
    return encounterId;
}
/**
 * Process encounter completion
 * Sets flags based on encounter ID
 * For house encounters, sets both the encounter flag and the house flag
 */
function processEncounterCompletion(state, encounterId) {
    const flagKey = encounterIdToFlagKey(encounterId);
    let updatedState = (0, story_1.setFlag)(state, flagKey, true);
    // For house encounters, also set the house flag directly (e.g., 'house-02')
    // This is needed for:
    // 1. House unlocking (isHouseUnlocked checks house-XX flags)
    // 2. Story joins (STORY_FLAG_TO_UNIT uses house-XX keys)
    if (encounterId.startsWith('house-')) {
        updatedState = (0, story_1.setFlag)(updatedState, encounterId, true);
    }
    return updatedState;
}
/**
 * Check if a house encounter is unlocked
 * House 1 is always unlocked
 * House N is unlocked if House N-1 is defeated
 *
 * @param story - Current story state
 * @param houseId - House encounter ID (e.g., 'house-03')
 * @returns true if house is unlocked, false otherwise
 */
function isHouseUnlocked(story, houseId) {
    // House 1 always unlocked
    if (houseId === 'house-01')
        return true;
    // Extract house number from ID (e.g., 'house-03' → 3)
    const match = houseId.match(/^house-(\d+)$/);
    if (!match)
        return false;
    const [, houseNumRaw] = match;
    if (!houseNumRaw)
        return false;
    const houseNum = parseInt(houseNumRaw, 10);
    // House N unlocked if House N-1 defeated
    const prevHouseId = `house-${String(houseNum - 1).padStart(2, '0')}`;
    return story.flags[prevHouseId] === true;
}
/**
 * Process story flag and grant Djinn if applicable
 * Pure function - no side effects
 *
 * @param story - Current story state
 * @param team - Current team state
 * @param flagId - Story flag being set
 * @param flagValue - Value being set (only grants Djinn if true)
 * @returns Updated story and team (team unchanged if no Djinn granted)
 */
function processStoryFlagForDjinn(story, team, flagId, flagValue) {
    // Update story flag first
    const updatedStory = (0, story_1.setFlag)(story, flagId, flagValue);
    // Only grant Djinn if flag is being set to true
    if (flagValue !== true) {
        return { story: updatedStory, team, djinnGranted: null };
    }
    // Check if this flag grants a Djinn
    const djinnId = storyFlags_1.STORY_FLAG_TO_DJINN[flagId];
    if (!djinnId) {
        return { story: updatedStory, team, djinnGranted: null };
    }
    // Try to collect Djinn (pure function)
    const collectResult = (0, DjinnService_1.collectDjinn)(team, djinnId);
    if (collectResult.ok) {
        return { story: updatedStory, team: collectResult.value, djinnGranted: djinnId };
    }
    // Already collected or error - return unchanged team
    // This is safe - collectDjinn returns error if already collected, which we ignore
    return { story: updatedStory, team, djinnGranted: null };
}
/**
 * Process story flag and recruit unit if applicable
 * Pure function - no side effects
 *
 * @param story - Current story state
 * @param flagId - Story flag being set
 * @param flagValue - Value being set (only recruits unit if true)
 * @param currentLevel - Current party level (for unit creation)
 * @returns Updated story and recruited unit (null if no unit recruited)
 */
function processStoryFlagForUnit(story, flagId, flagValue, currentLevel = 1) {
    // Update story flag first
    const updatedStory = (0, story_1.setFlag)(story, flagId, flagValue);
    // Only recruit unit if flag is being set to true
    if (flagValue !== true) {
        return { story: updatedStory, recruitedUnit: null };
    }
    // Check if this flag recruits a unit
    const unitId = storyFlags_1.STORY_FLAG_TO_UNIT[flagId];
    if (!unitId) {
        return { story: updatedStory, recruitedUnit: null };
    }
    // Get unit definition
    const unitDef = units_1.UNIT_DEFINITIONS[unitId];
    if (!unitDef) {
        console.error(`Unit definition ${unitId} not found`);
        return { story: updatedStory, recruitedUnit: null };
    }
    // Create unit at current party level (level 1 for Houses 2-3)
    const xp = (0, xp_1.getXpForLevel)(currentLevel);
    const recruitedUnit = (0, Unit_1.createUnit)(unitDef, currentLevel, xp);
    return { story: updatedStory, recruitedUnit };
}
