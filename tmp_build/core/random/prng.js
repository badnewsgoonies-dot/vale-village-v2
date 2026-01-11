"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XorShiftPRNG = void 0;
exports.makePRNG = makePRNG;
exports.prngFromSnapshot = prngFromSnapshot;
exports.makeRandomPRNG = makeRandomPRNG;
exports.deriveSeed = deriveSeed;
/**
 * Seeded PRNG interface for deterministic randomness
 */
const constants_1 = require("../constants");
/**
 * XorShift PRNG implementation
 * Fast, deterministic, good quality
 */
class XorShiftPRNG {
    constructor(seed) {
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "initialSeed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "draws", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Validate seed is non-negative
        if (seed < 0) {
            throw new Error(`PRNG seed must be non-negative, got: ${seed}`);
        }
        // Use 1 as default if seed is 0 (0 would cause issues with XorShift)
        this.initialSeed = seed || 1;
        this.state = this.initialSeed;
        this.draws = 0;
        // Warm up the generator
        for (let i = 0; i < constants_1.PRNG_WARMUP_ITERATIONS; i++) {
            this.stepInternal();
        }
    }
    /**
     * Internal XorShift32 step that updates the state and returns the raw u32.
     */
    stepInternal() {
        // XorShift32 algorithm
        this.state ^= this.state << 13;
        this.state ^= this.state >>> 17;
        this.state ^= this.state << 5;
        return this.state >>> 0;
    }
    /**
     * Returns next random number in [0, 1).
     */
    next() {
        const value = this.stepInternal();
        this.draws += 1;
        // Convert to [0, 1) range using 2^32 as denominator
        return value / 4294967296;
    }
    /**
     * Returns the raw 32-bit unsigned integer from the generator.
     * Useful for hashing or deriving additional values.
     */
    nextU32() {
        const value = this.stepInternal();
        this.draws += 1;
        return value;
    }
    clone() {
        const cloned = new XorShiftPRNG(this.initialSeed);
        cloned.state = this.state;
        cloned.draws = this.draws;
        return cloned;
    }
    getSeed() {
        return this.initialSeed;
    }
    getDrawCount() {
        return this.draws;
    }
    snapshot() {
        return {
            state: this.state >>> 0,
            initialSeed: this.initialSeed >>> 0,
            draws: this.draws >>> 0,
        };
    }
    /**
     * Reconstruct a PRNG from a serialized snapshot.
     *
     * This will perform the same warmup as the constructor and then
     * restore the internal state and draw count, so subsequent calls
     * to `next()` produce the same sequence as the original instance.
     */
    static fromSerialized(snapshot) {
        const prng = new XorShiftPRNG(snapshot.initialSeed);
        prng.state = snapshot.state >>> 0;
        prng.draws = snapshot.draws >>> 0;
        return prng;
    }
}
exports.XorShiftPRNG = XorShiftPRNG;
/**
 * Create a new PRNG from seed
 * @param seed - Non-negative integer seed (0 is converted to 1)
 * @throws Error if seed is negative
 */
function makePRNG(seed) {
    if (seed < 0) {
        throw new Error(`PRNG seed must be non-negative, got: ${seed}`);
    }
    return new XorShiftPRNG(seed);
}
/**
 * Recreate a PRNG instance from a serialized snapshot.
 */
function prngFromSnapshot(snapshot) {
    return XorShiftPRNG.fromSerialized(snapshot);
}
/**
 * Create PRNG from current time (for non-deterministic use cases).
 *
 * NOTE: This should be used only in UI/infra layers. Core deterministic
 * logic should receive a seeded PRNG created via `makePRNG` instead.
 */
function makeRandomPRNG() {
    // Use crypto when available for better entropy, fallback to Date.now()
    let seed = Date.now() >>> 0;
    try {
        if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
            seed = crypto.getRandomValues(new Uint32Array(1))[0] >>> 0;
        }
        else if (typeof require === 'function') {
            // Node environment
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const nodeCrypto = require('crypto');
            seed = nodeCrypto.randomBytes(4).readUInt32BE(0) >>> 0;
        }
    }
    catch (_) { }
    return new XorShiftPRNG(seed);
}
/**
 * Deterministically derive a new seed from a parent seed and a label.
 * Uses a simple FNV-1a 32-bit hash.
 */
function deriveSeed(parentSeed, label) {
    // FNV-1a 32-bit offset basis
    let h = (0x811c9dc5 ^ (parentSeed >>> 0)) >>> 0;
    for (let i = 0; i < label.length; i++) {
        h ^= label.charCodeAt(i);
        h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
}
