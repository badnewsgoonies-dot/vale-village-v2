"use strict";
/**
 * Story state slice for Zustand
 * Manages story progression and flags
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStorySlice = void 0;
const story_1 = require("../../core/models/story");
const StoryService_1 = require("../../core/services/StoryService");
const createStorySlice = (_set, get) => ({
    story: (0, story_1.createStoryState)(1),
    showCredits: false,
    setShowCredits: (show) => _set({ showCredits: show }),
    setStoryState: (storyState) => {
        _set({ story: storyState });
    },
    setStoryFlag: (key, value) => {
        const story = get().story;
        const team = get().team;
        // Process story flag (includes Djinn granting)
        if (team) {
            const result = (0, StoryService_1.processStoryFlagForDjinn)(story, team, key, value);
            // Update story state
            _set({ story: result.story });
            // Update team if Djinn was granted
            if (result.djinnGranted) {
                get().updateTeam(result.team);
            }
        }
        else {
            // No team available, just update story
            const updatedStory = (0, story_1.setFlag)(story, key, value);
            _set({ story: updatedStory });
        }
    },
    getStoryFlag: (key) => {
        return get().story.flags[key];
    },
    onBattleEvents: (events) => {
        let st = get().story;
        const team = get().team;
        for (const e of events) {
            if (e.type === 'encounter-finished' && e.outcome === 'PLAYER_VICTORY') {
                st = (0, StoryService_1.processEncounterCompletion)(st, e.encounterId);
                // Convert encounter ID to flag key for chapter advancement
                const flagKey = (0, StoryService_1.encounterIdToFlagKey)(e.encounterId);
                // Process story flag for Djinn (if team available)
                if (team) {
                    const djinnResult = (0, StoryService_1.processStoryFlagForDjinn)(st, team, flagKey, true);
                    st = djinnResult.story;
                    // Update team if Djinn was granted
                    if (djinnResult.djinnGranted) {
                        get().updateTeam(djinnResult.team);
                    }
                }
                // Process story flag for Unit recruitment (story joins)
                // For house encounters, use the house ID directly (e.g., 'house-02') instead of flagKey
                // because STORY_FLAG_TO_UNIT uses house-XX keys
                const storyJoinFlagKey = e.encounterId.startsWith('house-') ? e.encounterId : flagKey;
                const avgLevel = team ? Math.max(1, Math.floor(team.units.reduce((sum, u) => sum + u.level, 0) / team.units.length)) : 1;
                const unitResult = (0, StoryService_1.processStoryFlagForUnit)(st, storyJoinFlagKey, true, avgLevel);
                st = unitResult.story;
                // Add recruited unit to roster if applicable
                if (unitResult.recruitedUnit) {
                    get().addUnitToRoster(unitResult.recruitedUnit);
                }
                const adv = (0, StoryService_1.advanceChapter)(st, flagKey);
                if (adv.ok) {
                    st = adv.value;
                }
                // Trigger credits screen when Chapter 3 boss is defeated
                if (flagKey === 'boss:ch3' && st.chapter === 4) {
                    _set({ story: st, showCredits: true });
                    return; // Early return to avoid double set
                }
            }
        }
        _set({ story: st });
    },
});
exports.createStorySlice = createStorySlice;
