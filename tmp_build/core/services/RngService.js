"use strict";
/**
 * RNG Service
 * Thin wrapper around PRNG for deterministic branching
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRng = createRng;
exports.createRandomRng = createRandomRng;
exports.cloneRng = cloneRng;
exports.getRngSeed = getRngSeed;
const prng_1 = require("../random/prng");
/**
 * Create a new PRNG from seed
 */
function createRng(seed) {
    return (0, prng_1.makePRNG)(seed);
}
/**
 * Create PRNG from current time (for non-deterministic use cases)
 */
function createRandomRng() {
    return (0, prng_1.makeRandomPRNG)();
}
/**
 * Clone PRNG for branching (e.g., simulation)
 */
function cloneRng(rng) {
    return rng.clone();
}
/**
 * Get seed from PRNG (for serialization)
 */
function getRngSeed(rng) {
    return rng.getSeed();
}
