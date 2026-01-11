"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALID_TRANSITIONS = void 0;
exports.isValidTransition = isValidTransition;
exports.assertValidTransition = assertValidTransition;
exports.deriveUIPhase = deriveUIPhase;
/**
 * Valid phase transitions - enforces state machine rules
 */
exports.VALID_TRANSITIONS = {
    idle: ['planning'],
    planning: ['executing'],
    executing: ['planning', 'victory', 'defeat'],
    victory: ['idle'],
    defeat: ['idle'],
};
/**
 * Check if a phase transition is valid
 */
function isValidTransition(from, to) {
    return exports.VALID_TRANSITIONS[from].includes(to);
}
/**
 * Assert a transition is valid (throws if not)
 */
function assertValidTransition(from, to) {
    if (!isValidTransition(from, to)) {
        throw new Error(`Invalid phase transition: ${from} -> ${to}`);
    }
}
/**
 * Derive UI phase from battle state
 */
function deriveUIPhase(battlePhase) {
    if (!battlePhase)
        return 'idle';
    switch (battlePhase) {
        case 'planning': return 'planning';
        case 'executing': return 'executing';
        case 'victory': return 'victory';
        case 'defeat': return 'defeat';
        default: return 'idle';
    }
}
