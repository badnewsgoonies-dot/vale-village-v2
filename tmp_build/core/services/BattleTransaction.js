"use strict";
/**
 * BattleTransaction - Simple transaction support for battle state
 * Allows rollback of state changes when operations fail
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleTransaction = void 0;
/**
 * Transaction class for managing battle state changes
 * Provides commit/rollback functionality
 */
class BattleTransaction {
    constructor() {
        Object.defineProperty(this, "snapshot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    /**
     * Begin a new transaction by saving current state
     * @param state - The current battle state to snapshot
     */
    begin(state) {
        // State is immutable, so we can safely store a reference
        this.snapshot = state;
    }
    /**
     * Rollback to the saved state
     * @returns The original state or null if no transaction
     */
    rollback() {
        return this.snapshot;
    }
    /**
     * Commit the transaction by clearing the snapshot
     * Called when operation succeeds
     */
    commit() {
        this.snapshot = null;
    }
    /**
     * Check if a transaction is active
     */
    hasSnapshot() {
        return this.snapshot !== null;
    }
}
exports.BattleTransaction = BattleTransaction;
