"use strict";
/**
 * Dev Mode Service
 * Pure functions for development mode features (house jumping, state manipulation)
 *
 * IMPORTANT: This service is for DEVELOPMENT ONLY and should not be used in production gameplay
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHousesMetadata = getAllHousesMetadata;
exports.jumpToHouse = jumpToHouse;
const story_1 = require("../models/story");
const DjinnService_1 = require("./DjinnService");
const Unit_1 = require("../models/Unit");
const encounters_1 = require("../../data/definitions/encounters");
const storyFlags_1 = require("../../data/definitions/storyFlags");
const units_1 = require("../../data/definitions/units");
/**
 * Get metadata for all 20 houses
 */
function getAllHousesMetadata() {
    const houses = [];
    for (let i = 1; i <= 20; i++) {
        const houseId = `house-${String(i).padStart(2, '0')}`;
        const encounter = encounters_1.ENCOUNTERS[houseId];
        if (!encounter) {
            // [REMOVED] console.warn(`House ${houseId} not found in ENCOUNTERS`);
            continue;
        }
        // Determine act
        let act;
        if (i <= 7)
            act = 1;
        else if (i <= 14)
            act = 2;
        else
            act = 3;
        // Check for story join unit
        const storyJoinUnit = storyFlags_1.STORY_FLAG_TO_UNIT[houseId];
        houses.push({
            id: houseId,
            displayName: `House ${String(i).padStart(2, '0')}`,
            act,
            rewards: {
                unit: encounter.reward.unlockUnit,
                storyJoinUnit,
                djinn: encounter.reward.djinn,
                xp: encounter.reward.xp,
                gold: encounter.reward.gold,
            },
            isSpike: i === 8 || i === 15,
            isFinalBoss: i === 20,
        });
    }
    return houses;
}
/**
 * Jump to a specific house by granting all previous rewards
 * Pure function - returns new state objects
 *
 * @param story - Current story state
 * @param team - Current team
 * @param roster - Current roster
 * @param targetHouseId - House to jump to (e.g., 'house-05')
 * @returns Updated story, team, and roster with all previous houses completed
 */
function jumpToHouse(story, team, roster, targetHouseId) {
    // Extract house number
    const match = targetHouseId.match(/^house-(\d+)$/);
    if (!match || !match[1]) {
        console.error(`Invalid house ID: ${targetHouseId}`);
        return { story, team, roster };
    }
    const targetHouseNum = parseInt(match[1], 10);
    // Start with fresh state
    let updatedStory = story;
    let updatedTeam = team;
    const updatedRoster = [...roster];
    // Collect Djinn IDs that should be granted
    const djinnToCollect = [];
    // Units to recruit (both battle and story join)
    const unitsToRecruit = [];
    // Loop through all houses before the target house
    for (let i = 1; i < targetHouseNum; i++) {
        const houseId = `house-${String(i).padStart(2, '0')}`;
        const encounter = encounters_1.ENCOUNTERS[houseId];
        if (!encounter)
            continue;
        // Set house completion flag
        updatedStory = (0, story_1.setFlag)(updatedStory, houseId, true);
        // Collect Djinn reward (if any)
        if (encounter.reward.djinn) {
            djinnToCollect.push(encounter.reward.djinn);
        }
        // Recruit battle reward unit (if any)
        if (encounter.reward.unlockUnit) {
            const unitDef = units_1.UNIT_DEFINITIONS[encounter.reward.unlockUnit];
            if (unitDef) {
                // Create unit at appropriate level (level 1 for now, can adjust later)
                const unit = (0, Unit_1.createUnit)(unitDef, 1, 0);
                unitsToRecruit.push(unit);
            }
        }
        // Recruit story join unit (if any)
        const storyJoinUnitId = storyFlags_1.STORY_FLAG_TO_UNIT[houseId];
        if (storyJoinUnitId) {
            const unitDef = units_1.UNIT_DEFINITIONS[storyJoinUnitId];
            if (unitDef) {
                const unit = (0, Unit_1.createUnit)(unitDef, 1, 0);
                unitsToRecruit.push(unit);
            }
        }
    }
    // Apply Djinn collection
    for (const djinnId of djinnToCollect) {
        const collectResult = (0, DjinnService_1.collectDjinn)(updatedTeam, djinnId);
        if (collectResult.ok) {
            updatedTeam = collectResult.value;
        }
    }
    // Add units to roster (deduplicate by ID)
    const rosterIds = new Set(updatedRoster.map(u => u.id));
    for (const unit of unitsToRecruit) {
        if (!rosterIds.has(unit.id)) {
            updatedRoster.push(unit);
            rosterIds.add(unit.id);
        }
    }
    return {
        story: updatedStory,
        team: updatedTeam,
        roster: updatedRoster,
    };
}
