"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarlyGameFlowController = exports.EARLY_GAME_FLOW_IDS = exports.EARLY_GAME_FLOW_FLAGS = void 0;
exports.parseHouseNumFromHouseId = parseHouseNumFromHouseId;
exports.getHouseEnemyDialogueIdFromHouseId = getHouseEnemyDialogueIdFromHouseId;
const story_1 = require("@/core/models/story");
exports.EARLY_GAME_FLOW_FLAGS = {
    firstHouseEntrySeen: 'early_first_house_entry_seen',
    firstHouseEntryHouseNum: 'early_first_house_entry_house_num',
    djinnIntroCompleted: 'first_djinn_intro_completed',
};
exports.EARLY_GAME_FLOW_IDS = {
    djinnIntroDialogueId: 'tutorial:djinn-intro',
    npcIntroBattleEncounterId: 'house-01',
};
const isBooleanFlagTrue = (story, key) => story.flags[key] === true;
const getNumberFlag = (story, key) => {
    const value = story.flags[key];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
};
function parseHouseNumFromHouseId(houseId) {
    const match = /^house-(\d{2})$/.exec(houseId);
    if (!match?.[1])
        return null;
    const houseNum = parseInt(match[1], 10);
    return Number.isFinite(houseNum) && houseNum >= 1 ? houseNum : null;
}
function getHouseEnemyDialogueIdFromHouseId(houseId) {
    return `${houseId}-enemy`;
}
class EarlyGameFlowController {
    static isDjinnIntroCompleted(story) {
        return isBooleanFlagTrue(story, exports.EARLY_GAME_FLOW_FLAGS.djinnIntroCompleted);
    }
    static markDjinnIntroCompleted(story) {
        if (EarlyGameFlowController.isDjinnIntroCompleted(story)) {
            return { story, changed: false };
        }
        return { story: (0, story_1.setFlag)(story, exports.EARLY_GAME_FLOW_FLAGS.djinnIntroCompleted, true), changed: true };
    }
    static hasRecordedFirstHouseEntry(story) {
        return isBooleanFlagTrue(story, exports.EARLY_GAME_FLOW_FLAGS.firstHouseEntrySeen);
    }
    static getFirstHouseEntryHouseNum(story) {
        return getNumberFlag(story, exports.EARLY_GAME_FLOW_FLAGS.firstHouseEntryHouseNum);
    }
    static recordFirstHouseEntry(story, houseId) {
        const houseNum = parseHouseNumFromHouseId(houseId);
        if (houseNum === null) {
            return { story, changed: false, houseNum: null };
        }
        const hasSeen = EarlyGameFlowController.hasRecordedFirstHouseEntry(story);
        const existingNum = EarlyGameFlowController.getFirstHouseEntryHouseNum(story);
        const needsSeen = !hasSeen;
        const needsNum = existingNum === null;
        if (!needsSeen && !needsNum) {
            return { story, changed: false, houseNum: existingNum };
        }
        let next = story;
        if (needsSeen) {
            next = (0, story_1.setFlag)(next, exports.EARLY_GAME_FLOW_FLAGS.firstHouseEntrySeen, true);
        }
        if (needsNum) {
            next = (0, story_1.setFlag)(next, exports.EARLY_GAME_FLOW_FLAGS.firstHouseEntryHouseNum, houseNum);
        }
        return { story: next, changed: true, houseNum };
    }
    /**
     * Centralized gate for the "intro NPC battle" (House 1 enemy encounter).
     * Completion is tracked via the canonical encounter flag (e.g. `house-01`).
     */
    static isNpcIntroBattleCompleted(story, encounterId = exports.EARLY_GAME_FLOW_IDS.npcIntroBattleEncounterId) {
        return story.flags[encounterId] === true;
    }
    static isNpcIntroBattleEligible(story, params = {}) {
        const encounterId = params.encounterId ?? exports.EARLY_GAME_FLOW_IDS.npcIntroBattleEncounterId;
        const requireDjinnIntroCompleted = params.requireDjinnIntroCompleted ?? true;
        if (requireDjinnIntroCompleted && !EarlyGameFlowController.isDjinnIntroCompleted(story)) {
            return false;
        }
        if (EarlyGameFlowController.isNpcIntroBattleCompleted(story, encounterId)) {
            return false;
        }
        return true;
    }
    /**
     * Idempotent "attempted house entry" gate.
     * - Records the first-ever house entry attempt (for early-game tutorial sequencing).
     * - For House 1:
     *   - If Djinn intro is not complete, starts Djinn intro instead of entering.
     *   - Else if the intro NPC battle is still eligible, starts the house enemy dialogue instead of entering.
     * - Otherwise, allows entry.
     */
    static onAttemptEnterHouse(story, houseId) {
        const recorded = EarlyGameFlowController.recordFirstHouseEntry(story, houseId);
        const nextStory = recorded.story;
        if (houseId === exports.EARLY_GAME_FLOW_IDS.npcIntroBattleEncounterId) {
            if (!EarlyGameFlowController.isDjinnIntroCompleted(nextStory)) {
                return {
                    story: nextStory,
                    action: {
                        kind: 'start-dialogue',
                        dialogueId: exports.EARLY_GAME_FLOW_IDS.djinnIntroDialogueId,
                        reason: 'djinn-intro',
                    },
                };
            }
            if (EarlyGameFlowController.isNpcIntroBattleEligible(nextStory)) {
                return {
                    story: nextStory,
                    action: {
                        kind: 'start-dialogue',
                        dialogueId: getHouseEnemyDialogueIdFromHouseId(exports.EARLY_GAME_FLOW_IDS.npcIntroBattleEncounterId),
                        reason: 'npc-intro-battle',
                    },
                };
            }
        }
        return { story: nextStory, action: { kind: 'allow-entry' } };
    }
}
exports.EarlyGameFlowController = EarlyGameFlowController;
