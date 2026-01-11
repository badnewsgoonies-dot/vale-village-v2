"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionBar = ActionBar;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * Action bar component
 * Displays available abilities and handles action selection
 */
const hooks_1 = require("preact/hooks");
const Unit_1 = require("../../core/models/Unit");
const mana_1 = require("../../core/algorithms/mana");
const store_1 = require("../state/store");
function ActionBar({ disabled = false }) {
    const { battle, queueUnitAction, clearUnitAction, executeQueuedRound, lastError } = (0, store_1.useStore)((s) => ({
        battle: s.battle,
        queueUnitAction: s.queueUnitAction,
        clearUnitAction: s.clearUnitAction,
        executeQueuedRound: s.executeQueuedRound,
        lastError: s.lastError,
    }));
    const [selectedAbility, setSelectedAbility] = (0, hooks_1.useState)(null);
    const [selectedTargets, setSelectedTargets] = (0, hooks_1.useState)([]);
    const currentUnitIndex = battle?.currentQueueIndex ?? 0;
    const currentUnit = battle?.playerTeam.units?.[currentUnitIndex] ?? null;
    const abilityMap = (0, hooks_1.useMemo)(() => {
        const map = new Map();
        if (currentUnit) {
            for (const ability of currentUnit.abilities) {
                map.set(ability.id, ability);
            }
        }
        return map;
    }, [currentUnit]);
    const selectedAbilityDef = selectedAbility ? abilityMap.get(selectedAbility) ?? null : null;
    const targetType = selectedAbilityDef?.targets ?? 'single-enemy';
    (0, hooks_1.useEffect)(() => {
        if (!battle || !currentUnit)
            return;
        if (targetType === 'self') {
            setSelectedTargets([currentUnit.id]);
            return;
        }
        if (targetType === 'all-allies') {
            setSelectedTargets(battle.playerTeam.units.filter((unit) => !(0, Unit_1.isUnitKO)(unit)).map((unit) => unit.id));
            return;
        }
        if (targetType === 'all-enemies') {
            setSelectedTargets(battle.enemies.filter((unit) => !(0, Unit_1.isUnitKO)(unit)).map((unit) => unit.id));
            return;
        }
        // For single-target or multi-target abilities, keep existing selections if still valid
        setSelectedTargets((prev) => prev.filter((targetId) => {
            const allUnits = [...battle.playerTeam.units, ...battle.enemies];
            return allUnits.some((unit) => unit.id === targetId && !(0, Unit_1.isUnitKO)(unit));
        }));
    }, [battle, currentUnit, targetType]);
    if (!battle || disabled) {
        return ((0, jsx_runtime_1.jsx)("div", { style: { padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', marginTop: '1rem' }, children: (0, jsx_runtime_1.jsx)("p", { children: "Battle controls unavailable." }) }));
    }
    if (!currentUnit) {
        return ((0, jsx_runtime_1.jsx)("div", { style: { padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', marginTop: '1rem' }, children: (0, jsx_runtime_1.jsx)("p", { children: "No active unit available for action selection." }) }));
    }
    const availableAbilities = (0, hooks_1.useMemo)(() => {
        if (!currentUnit)
            return [];
        return currentUnit.abilities.filter((ability) => currentUnit.unlockedAbilityIds?.includes(ability.id));
    }, [currentUnit]);
    const targetPool = (0, hooks_1.useMemo)(() => {
        if (!battle)
            return [];
        if (targetType === 'single-ally' || targetType === 'all-allies' || targetType === 'self') {
            return battle.playerTeam.units.filter((unit) => !(0, Unit_1.isUnitKO)(unit));
        }
        return battle.enemies.filter((unit) => !(0, Unit_1.isUnitKO)(unit));
    }, [battle, targetType]);
    const queuedAction = battle?.queuedActions?.[currentUnitIndex] ?? null;
    const refund = queuedAction?.unitId === currentUnit?.id ? queuedAction.manaCost : 0;
    const effectiveRemainingMana = (battle?.remainingMana ?? 0) + refund;
    const handleAbilitySelect = (abilityId) => {
        const ability = abilityId ? abilityMap.get(abilityId) : null;
        setSelectedAbility(abilityId);
        if (!ability) {
            setSelectedTargets([]);
            return;
        }
        if (ability.targets === 'self') {
            setSelectedTargets([currentUnit.id]);
            return;
        }
        if (ability.targets === 'all-allies') {
            setSelectedTargets(battle.playerTeam.units.filter((unit) => !(0, Unit_1.isUnitKO)(unit)).map((unit) => unit.id));
            return;
        }
        if (ability.targets === 'all-enemies') {
            setSelectedTargets(battle.enemies.filter((unit) => !(0, Unit_1.isUnitKO)(unit)).map((unit) => unit.id));
            return;
        }
        setSelectedTargets([]);
    };
    const handleTargetSelect = (targetId) => {
        const ability = selectedAbilityDef;
        const allowedTarget = targetPool.some((unit) => unit.id === targetId);
        if (!allowedTarget)
            return;
        const targetMode = ability?.targets ?? 'single-enemy';
        if (targetMode === 'self') {
            setSelectedTargets([currentUnit.id]);
            return;
        }
        if (targetMode === 'single-enemy' || targetMode === 'single-ally') {
            setSelectedTargets([targetId]);
        }
        else {
            if (selectedTargets.includes(targetId)) {
                setSelectedTargets(selectedTargets.filter(id => id !== targetId));
            }
            else {
                setSelectedTargets([...selectedTargets, targetId]);
            }
        }
    };
    const handleExecute = () => {
        if (!battle || battle.phase !== 'planning')
            return;
        const ability = selectedAbility ? abilityMap.get(selectedAbility) : undefined;
        const abilityTargets = selectedAbilityDef?.targets ?? 'single-enemy';
        const requiresSelection = abilityTargets !== 'self' && abilityTargets !== 'all-allies' && abilityTargets !== 'all-enemies';
        if (requiresSelection && selectedTargets.length === 0)
            return;
        const queued = queueUnitAction(currentUnitIndex, selectedAbility ?? null, selectedTargets, ability);
        if (queued) {
            setSelectedAbility(null);
            setSelectedTargets([]);
        }
    };
    const handleEndTurn = () => {
        if (!battle || battle.phase !== 'planning')
            return;
        executeQueuedRound();
    };
    const requiresSelection = targetType !== 'self' && targetType !== 'all-allies' && targetType !== 'all-enemies';
    const targetSelectionMissing = requiresSelection && selectedTargets.length === 0;
    const queueComplete = battle?.queuedActions?.every((action) => action !== null) ?? false;
    return ((0, jsx_runtime_1.jsxs)("div", { style: { padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', marginTop: '1rem' }, children: [(0, jsx_runtime_1.jsxs)("h3", { style: { margin: '0 0 1rem 0' }, children: ["Actions for ", currentUnit.name] }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }, children: availableAbilities.map((ability) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => handleAbilitySelect(ability.id), style: {
                        padding: '0.5rem 1rem',
                        backgroundColor: selectedAbility === ability.id ? '#007bff' : '#fff',
                        color: selectedAbility === ability.id ? '#fff' : '#333',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }, disabled: !(0, mana_1.canAffordAction)(effectiveRemainingMana, (0, mana_1.getAbilityManaCost)(ability.id, ability)), children: [ability.name, " (", ability.manaCost, " MP)"] }, ability.id))) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleAbilitySelect(null), style: {
                    padding: '0.5rem 1rem',
                    backgroundColor: selectedAbility === null ? '#007bff' : '#fff',
                    color: selectedAbility === null ? '#fff' : '#333',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                }, children: "Basic Attack (0 MP)" }), (selectedAbility !== null || targetType !== 'self') && ((0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '1rem' }, children: [(0, jsx_runtime_1.jsx)("p", { style: { margin: '0 0 0.5rem 0' }, children: "Select target:" }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }, children: targetPool.map((unit) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => handleTargetSelect(unit.id), style: {
                                padding: '0.5rem 1rem',
                                backgroundColor: selectedTargets.includes(unit.id) ? '#28a745' : '#fff',
                                color: selectedTargets.includes(unit.id) ? '#fff' : '#333',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }, children: unit.name }, unit.id))) })] })), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: '0.5rem' }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleExecute, disabled: targetSelectionMissing || battle.phase !== 'planning', style: {
                            padding: '0.5rem 1rem',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: !targetSelectionMissing && battle.phase === 'planning' ? 'pointer' : 'not-allowed',
                            opacity: !targetSelectionMissing && battle.phase === 'planning' ? 1 : 0.5,
                        }, children: "Execute" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleEndTurn, disabled: !queueComplete || battle.phase !== 'planning', style: {
                            padding: '0.5rem 1rem',
                            backgroundColor: '#6c757d',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: queueComplete && battle.phase === 'planning' ? 'pointer' : 'not-allowed',
                            opacity: queueComplete && battle.phase === 'planning' ? 1 : 0.5,
                        }, children: "End Turn" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                            clearUnitAction(currentUnitIndex);
                            setSelectedAbility(null);
                            setSelectedTargets([]);
                        }, style: {
                            padding: '0.5rem 1rem',
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }, children: "Clear Action" })] }), (0, jsx_runtime_1.jsxs)("p", { style: { marginTop: '1rem', fontSize: '0.9em', color: '#666' }, children: ["Remaining Mana: ", battle.remainingMana] }), queuedAction && ((0, jsx_runtime_1.jsxs)("p", { style: { marginTop: '0.25rem', fontSize: '0.9em', color: '#333' }, children: ["Queued: ", queuedAction.abilityId ?? 'Basic attack', " \u2192 ", queuedAction.targetIds.join(', ')] })), lastError && ((0, jsx_runtime_1.jsx)("p", { style: { marginTop: '0.5rem', fontSize: '0.9em', color: '#b30000' }, children: lastError }))] }));
}
