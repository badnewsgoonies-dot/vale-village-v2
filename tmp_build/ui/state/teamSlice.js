"use strict";
/**
 * Team state slice for Zustand
 * Manages player team composition and Djinn
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeamSlice = void 0;
const Team_1 = require("../../core/models/Team");
const units_1 = require("../../data/definitions/units");
const Unit_1 = require("../../core/models/Unit");
const createTeamSlice = (set, get) => ({
    team: null,
    roster: [], // Empty roster initially
    setTeam: (team) => {
        set((state) => {
            // Ensure roster contains all team units (add/update as needed)
            const updatedRoster = [...state.roster];
            team.units.forEach(unit => {
                const existingIndex = updatedRoster.findIndex(u => u.id === unit.id);
                if (existingIndex >= 0) {
                    // Update existing unit in roster
                    updatedRoster[existingIndex] = unit;
                }
                else {
                    // Add new unit to roster (if not at max)
                    if (updatedRoster.length < 10) {
                        updatedRoster.push(unit);
                    }
                }
            });
            return {
                team,
                roster: updatedRoster,
            };
        });
    },
    setRoster: (units) => set({ roster: units }),
    addUnitToRoster: (unit) => set((state) => {
        // Check if unit already exists
        if (state.roster.some(u => u.id === unit.id)) {
            // Update existing unit
            return {
                roster: state.roster.map(u => u.id === unit.id ? unit : u),
            };
        }
        // Add new unit (max 10)
        if (state.roster.length >= 10) {
            // [REMOVED] console.warn('Roster full (10 units max), cannot add unit');
            return state;
        }
        return {
            roster: [...state.roster, unit],
        };
    }),
    getUnitFromRoster: (unitId) => {
        return get().roster.find(u => u.id === unitId);
    },
    updateTeam: (updates) => set((state) => {
        if (!state.team)
            return state;
        return {
            team: {
                ...state.team,
                ...updates,
            },
        };
    }),
    updateTeamUnits: (units) => set((state) => {
        if (!state.team)
            return state;
        const updatedTeam = (0, Team_1.updateTeam)(state.team, { units });
        // Sync roster with updated units (prevents stale data)
        const updatedRoster = [...state.roster];
        units.forEach(unit => {
            const existingIndex = updatedRoster.findIndex(u => u.id === unit.id);
            if (existingIndex >= 0) {
                // Update existing unit in roster
                updatedRoster[existingIndex] = unit;
            }
            else {
                // Add new unit to roster (if not at max)
                // This handles edge cases where a unit is added directly
                if (updatedRoster.length < 10) {
                    updatedRoster.push(unit);
                }
            }
        });
        return {
            team: updatedTeam,
            roster: updatedRoster,
        };
    }),
    swapPartyMember: (partyIndex, unitId) => set((state) => {
        if (!state.team)
            return state;
        // Get unit from roster (preferred) or create from definition (fallback)
        let newUnit = state.roster.find(u => u.id === unitId);
        if (!newUnit) {
            // Fallback: create from definition (for backward compatibility)
            const unitDef = units_1.UNIT_DEFINITIONS[unitId];
            if (!unitDef) {
                console.error(`Unit ${unitId} not found in roster or definitions`);
                return state;
            }
            const oldUnit = state.team.units[partyIndex];
            newUnit = oldUnit
                ? (0, Unit_1.createUnit)(unitDef, oldUnit.level, oldUnit.xp)
                : (0, Unit_1.createUnit)(unitDef, 1, 0);
            // Add to roster if not already there (will be handled by setTeam below)
            // Note: setTeam() will ensure roster contains all team units
        }
        const newUnits = [...state.team.units];
        // Handle append vs replace for variable team sizes
        if (partyIndex >= newUnits.length) {
            // Append if index is beyond current team size
            newUnits.push(newUnit);
        }
        else {
            // Replace existing unit
            newUnits[partyIndex] = newUnit;
        }
        // No padding, no slice - allow 1-4 units naturally
        const finalUnits = newUnits;
        const updatedTeam = (0, Team_1.updateTeam)(state.team, {
            units: finalUnits,
        });
        // Ensure roster contains all team units (add/update as needed)
        const updatedRoster = [...state.roster];
        updatedTeam.units.forEach(unit => {
            const existingIndex = updatedRoster.findIndex(u => u.id === unit.id);
            if (existingIndex >= 0) {
                // Update existing unit in roster
                updatedRoster[existingIndex] = unit;
            }
            else {
                // Add new unit to roster (if not at max)
                if (updatedRoster.length < 10) {
                    updatedRoster.push(unit);
                }
            }
        });
        return {
            team: updatedTeam,
            roster: updatedRoster,
        };
    }),
});
exports.createTeamSlice = createTeamSlice;
