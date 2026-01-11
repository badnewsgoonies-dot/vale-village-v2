"use strict";
/**
 * Story Model
 * Tracks chapter progression and story flags
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStoryState = createStoryState;
exports.setFlag = setFlag;
exports.getFlag = getFlag;
exports.hasFlag = hasFlag;
exports.incrementFlag = incrementFlag;
/**
 * Create initial story state
 */
function createStoryState(chapter = 1) {
    return {
        chapter,
        flags: {},
    };
}
/**
 * Set a story flag
 */
function setFlag(state, flag, value = true) {
    return {
        ...state,
        flags: {
            ...state.flags,
            [flag]: value,
        },
    };
}
/**
 * Get a story flag value
 */
function getFlag(state, flag) {
    return state.flags[flag];
}
/**
 * Check if a flag is set (truthy)
 */
function hasFlag(state, flag) {
    return Boolean(state.flags[flag]);
}
/**
 * Increment a numeric flag
 */
function incrementFlag(state, flag, amount = 1) {
    const current = typeof state.flags[flag] === 'number' ? state.flags[flag] : 0;
    return setFlag(state, flag, current + amount);
}
