"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TowerHubScreen = TowerHubScreen;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
const gameStore_1 = require("../../store/gameStore");
require("./TowerHubScreen.css");
const store_1 = require("../state/store");
const towerConfig_1 = require("@/core/config/towerConfig");
const towerRewards_1 = require("@/data/definitions/towerRewards");
const dialogues_1 = require("@/data/definitions/dialogues");
const stats_1 = require("@/core/algorithms/stats");
const djinn_1 = require("@/data/definitions/djinn");
const equipment_1 = require("@/data/definitions/equipment");
const units_1 = require("@/data/definitions/units");
const PartyManagementScreen_1 = require("./PartyManagementScreen");
const ShopEquipScreen_1 = require("./ShopEquipScreen");
const DjinnCollectionScreen_1 = require("./DjinnCollectionScreen");
// Helper for touch-friendly button props
function touchButton(handler) {
    return {
        onClick: handler,
        onTouchEnd: (e) => {
            e.preventDefault();
            handler();
        },
    };
}
function TowerHubScreen() {
    const startTransition = (0, gameStore_1.useGameStore)((s) => s.startTransition);
    const { towerRun, towerStatus, towerRecord, getCurrentTowerFloor, startTowerRun, beginTowerFloorBattle, applyTowerRest, quitTowerRun, exitTowerMode, towerEntryContext, team, mode, startDialogueTree, } = (0, store_1.useStore)((state) => ({
        towerRun: state.towerRun,
        towerStatus: state.towerStatus,
        towerRecord: state.towerRecord,
        getCurrentTowerFloor: state.getCurrentTowerFloor,
        startTowerRun: state.startTowerRun,
        beginTowerFloorBattle: state.beginTowerFloorBattle,
        applyTowerRest: state.applyTowerRest,
        quitTowerRun: state.quitTowerRun,
        exitTowerMode: state.exitTowerMode,
        towerEntryContext: state.towerEntryContext,
        team: state.team,
        mode: state.mode,
        startDialogueTree: state.startDialogueTree,
    }));
    const handleExitTower = () => {
        const context = towerEntryContext;
        exitTowerMode();
        startTransition(context?.type === 'overworld' ? 'overworld' : 'menu');
    };
    const handleTalkToGuide = () => {
        const guide = dialogues_1.DIALOGUES['tutorial:tower-guide'];
        if (guide) {
            startDialogueTree(guide);
        }
    };
    // Sync V1 store mode to V2 gameStore screen (for battle transitions from tower)
    (0, hooks_1.useEffect)(() => {
        if (mode === 'team-select') {
            startTransition('team-select');
        }
        else if (mode === 'battle') {
            startTransition('battle');
        }
        else if (mode === 'rewards') {
            startTransition('rewards');
        }
    }, [mode, startTransition]);
    const currentFloor = getCurrentTowerFloor();
    const isRestFloor = currentFloor?.type === 'rest';
    const isCompleted = towerStatus === 'completed';
    const upcomingReward = (0, hooks_1.useMemo)(() => getNextReward(towerRun, towerRecord.highestFloorEver), [towerRun, towerRecord.highestFloorEver]);
    const partySummary = (0, hooks_1.useMemo)(() => buildPartySummary(team), [team]);
    const djinnStatus = (0, hooks_1.useMemo)(() => buildDjinnStatus(team), [team]);
    const [confirmAction, setConfirmAction] = (0, hooks_1.useState)(null);
    const [loadoutPanel, setLoadoutPanel] = (0, hooks_1.useState)(null);
    const handleStartRun = () => {
        if (towerStatus === 'idle' || !towerRun) {
            startTowerRun({ difficulty: 'normal' });
            return;
        }
        setConfirmAction('restart');
    };
    const handleConfirmAction = () => {
        if (confirmAction === 'quit') {
            quitTowerRun();
        }
        else if (confirmAction === 'restart') {
            startTowerRun({ difficulty: towerRun?.difficulty ?? 'normal' });
        }
        setConfirmAction(null);
    };
    const handleQuitRun = () => {
        setConfirmAction('quit');
    };
    const closeLoadoutPanel = () => setLoadoutPanel(null);
    if (towerStatus === 'idle' || !towerRun) {
        return ((0, jsx_runtime_1.jsxs)("div", { class: "tower-hub", children: [(0, jsx_runtime_1.jsxs)("section", { class: "tower-card intro", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Battle Tower" }), (0, jsx_runtime_1.jsx)("p", { children: "Step into an optional gauntlet built on the queue battle engine. Use your current campaign party, keep HP and Djinn states between fights, and earn XP + gold to catch up when the main story gets tough (encounter equipment drops are disabled). Beat your personal-best floor to claim milestone rewards like Djinn, recruits, and equipment." }), (0, jsx_runtime_1.jsxs)("div", { class: "tower-actions", children: [(0, jsx_runtime_1.jsx)("button", { class: "primary", ...touchButton(handleStartRun), children: "Start Tower Run" }), (0, jsx_runtime_1.jsx)("button", { class: "ghost", ...touchButton(handleTalkToGuide), children: "Talk to Guide" }), (0, jsx_runtime_1.jsx)("button", { ...touchButton(handleExitTower), children: towerEntryContext?.type === 'overworld' ? 'Return to Vale' : 'Back to Menu' })] })] }), (0, jsx_runtime_1.jsx)(TowerRecords, { towerRecord: towerRecord })] }));
    }
    const stats = towerRun.stats;
    return ((0, jsx_runtime_1.jsxs)("div", { class: "tower-hub", children: [(0, jsx_runtime_1.jsxs)("section", { class: "tower-card status", children: [(0, jsx_runtime_1.jsxs)("header", { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { class: "label", children: "Difficulty" }), (0, jsx_runtime_1.jsx)("p", { class: "value", children: towerRun.difficulty })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { class: "label", children: "Highest Floor" }), (0, jsx_runtime_1.jsx)("p", { class: "value", children: stats.highestFloor })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { class: "label", children: "Battles Won" }), (0, jsx_runtime_1.jsx)("p", { class: "value", children: stats.victories })] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "timeline", children: [(0, jsx_runtime_1.jsx)("p", { class: "label", children: "Current Floor" }), renderFloor(currentFloor)] }), (0, jsx_runtime_1.jsxs)("div", { class: "next-reward", "data-testid": "tower-next-reward", children: [(0, jsx_runtime_1.jsx)("p", { class: "label", children: "Next Reward Floor" }), upcomingReward ? ((0, jsx_runtime_1.jsxs)("div", { class: "reward-row", children: [(0, jsx_runtime_1.jsx)("span", { class: `floor-pill reward`, children: `Floor ${upcomingReward.floorNumber}` }), (0, jsx_runtime_1.jsx)("span", { children: describeRewardBundle(upcomingReward.rewards) })] })) : ((0, jsx_runtime_1.jsx)("span", { class: "value", children: "All milestone rewards claimed" }))] })] }), (0, jsx_runtime_1.jsx)("section", { class: "tower-card actions", children: isCompleted ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Run Complete" }), (0, jsx_runtime_1.jsx)("p", { children: towerRun.isFailed
                                ? 'The party fell, but their record stands in the archive.'
                                : 'You cleared every defined floor for this phase.' }), (0, jsx_runtime_1.jsxs)("div", { class: "tower-actions", children: [(0, jsx_runtime_1.jsx)("button", { class: "primary", ...touchButton(handleStartRun), children: "Start New Run" }), (0, jsx_runtime_1.jsx)("button", { class: "ghost", ...touchButton(handleTalkToGuide), children: "Talk to Guide" }), (0, jsx_runtime_1.jsx)("button", { ...touchButton(handleExitTower), children: towerEntryContext?.type === 'overworld' ? 'Return to Vale' : 'Back to Menu' })] })] })) : isRestFloor ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Rest Floor" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Restore ", Math.round(REST_HEAL * 100), "% HP and reset Djinn before the next stretch."] }), (0, jsx_runtime_1.jsxs)("div", { class: "tower-actions", children: [(0, jsx_runtime_1.jsx)("button", { class: "primary", ...touchButton(applyTowerRest), children: "Take Rest" }), (0, jsx_runtime_1.jsx)("button", { ...touchButton(beginTowerFloorBattle), children: "Skip Rest" }), (0, jsx_runtime_1.jsx)("button", { class: "ghost", ...touchButton(handleTalkToGuide), children: "Talk to Guide" }), (0, jsx_runtime_1.jsx)("button", { class: "ghost", ...touchButton(handleQuitRun), children: "Quit Run" })] }), (0, jsx_runtime_1.jsxs)("div", { class: "tower-loadout-actions", children: [(0, jsx_runtime_1.jsx)("span", { children: "Adjust loadouts:" }), (0, jsx_runtime_1.jsxs)("div", { class: "tower-rest-buttons", children: [(0, jsx_runtime_1.jsx)("button", { ...touchButton(() => setLoadoutPanel('party')), children: "Party" }), (0, jsx_runtime_1.jsx)("button", { ...touchButton(() => setLoadoutPanel('equipment')), children: "Equipment" }), (0, jsx_runtime_1.jsx)("button", { ...touchButton(() => setLoadoutPanel('djinn')), children: "Djinn" })] })] })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h2", { children: currentFloor ? `Floor ${currentFloor.floorNumber}` : 'All Floors Cleared' }), (0, jsx_runtime_1.jsx)("p", { children: currentFloor
                                ? `Encounter: ${currentFloor.encounterId}`
                                : 'There are no more encounters defined for this build.' }), (0, jsx_runtime_1.jsxs)("div", { class: "tower-actions", children: [(0, jsx_runtime_1.jsx)("button", { class: "primary", disabled: !currentFloor || isRestFloor, ...touchButton(beginTowerFloorBattle), children: "Begin Battle" }), (0, jsx_runtime_1.jsx)("button", { class: "ghost", ...touchButton(handleQuitRun), children: "Quit Run" }), (0, jsx_runtime_1.jsx)("button", { class: "ghost", ...touchButton(handleTalkToGuide), children: "Talk to Guide" }), (0, jsx_runtime_1.jsx)("button", { ...touchButton(handleExitTower), children: towerEntryContext?.type === 'overworld' ? 'Return to Vale' : 'Back to Menu' })] })] })) }), (0, jsx_runtime_1.jsxs)("section", { class: "tower-card stats", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Run Stats" }), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("span", { children: "Turns Taken" }), (0, jsx_runtime_1.jsx)("span", { children: stats.turnsTaken })] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("span", { children: "Total Damage Dealt" }), (0, jsx_runtime_1.jsx)("span", { children: stats.totalDamageDealt })] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("span", { children: "Total Damage Taken" }), (0, jsx_runtime_1.jsx)("span", { children: stats.totalDamageTaken })] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("span", { children: "Retreats" }), (0, jsx_runtime_1.jsx)("span", { children: stats.retreats })] })] })] }), (0, jsx_runtime_1.jsxs)("section", { class: "tower-card party", "data-testid": "tower-party-summary", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Party Status" }), partySummary.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { class: "value", children: "No party data available." })) : ((0, jsx_runtime_1.jsx)("div", { class: "party-grid", children: partySummary.map((unit) => ((0, jsx_runtime_1.jsxs)("div", { class: "party-unit", children: [(0, jsx_runtime_1.jsxs)("div", { class: "unit-header", children: [(0, jsx_runtime_1.jsx)("span", { children: unit.name }), (0, jsx_runtime_1.jsxs)("span", { children: [unit.currentHp, " / ", unit.maxHp] })] }), (0, jsx_runtime_1.jsx)("div", { class: "hp-bar", children: (0, jsx_runtime_1.jsx)("div", { style: { width: `${unit.hpPercent}%` } }) }), unit.djinn.length > 0 && ((0, jsx_runtime_1.jsx)("div", { class: "djinn-badges", children: unit.djinn.map((djinnId) => {
                                        const tracker = djinnStatus[djinnId];
                                        return ((0, jsx_runtime_1.jsxs)("span", { class: `djinn-pill state-${tracker?.state ?? 'Set'}`, children: [tracker?.name ?? djinnId, " \u00B7 ", tracker?.state ?? 'Set'] }, djinnId));
                                    }) }))] }, unit.id))) }))] }), (0, jsx_runtime_1.jsx)(TowerRecords, { towerRecord: towerRecord }), confirmAction && ((0, jsx_runtime_1.jsx)("div", { class: "tower-modal", role: "dialog", "aria-modal": "true", children: (0, jsx_runtime_1.jsxs)("div", { class: "tower-modal-content", children: [(0, jsx_runtime_1.jsx)("p", { children: confirmAction === 'quit'
                                ? 'Are you sure? This will end the current Tower run.'
                                : 'Start a new run? Your existing Tower progress will be lost.' }), (0, jsx_runtime_1.jsxs)("div", { class: "tower-modal-actions", children: [(0, jsx_runtime_1.jsx)("button", { class: "primary", ...touchButton(handleConfirmAction), children: confirmAction === 'quit' ? 'Confirm Quit' : 'Start New Run' }), (0, jsx_runtime_1.jsx)("button", { ...touchButton(() => setConfirmAction(null)), children: "Cancel" })] })] }) })), loadoutPanel === 'party' && (0, jsx_runtime_1.jsx)(PartyManagementScreen_1.PartyManagementScreen, { onClose: closeLoadoutPanel }), loadoutPanel === 'equipment' && (0, jsx_runtime_1.jsx)(ShopEquipScreen_1.ShopEquipScreen, { shopId: "vale-armory", onClose: closeLoadoutPanel }), loadoutPanel === 'djinn' && (0, jsx_runtime_1.jsx)(DjinnCollectionScreen_1.DjinnCollectionScreen, { onClose: closeLoadoutPanel })] }));
}
const REST_HEAL = towerConfig_1.DEFAULT_TOWER_CONFIG.healFractionAtRest;
function renderFloor(floor) {
    if (!floor) {
        return (0, jsx_runtime_1.jsx)("p", { class: "value", children: "No remaining floors" });
    }
    const badgeClass = floor.type === 'boss' ? 'boss' : floor.type === 'rest' ? 'rest' : 'normal';
    const badgeLabel = floor.type === 'boss' ? 'Boss' : floor.type === 'rest' ? 'Rest' : 'Battle';
    return ((0, jsx_runtime_1.jsxs)("div", { class: "floor-display", "data-testid": "tower-current-floor", children: [(0, jsx_runtime_1.jsx)("span", { class: `floor-pill ${badgeClass}`, children: badgeLabel }), floor.type === 'rest' ? ((0, jsx_runtime_1.jsxs)("p", { class: "value rest", children: ["Floor ", floor.floorNumber, " \u00B7 Heal & Regroup"] })) : ((0, jsx_runtime_1.jsxs)("p", { class: `value ${badgeClass}`, children: ["Floor ", floor.floorNumber, " \u00B7 ", floor.encounterId] }))] }));
}
function describeRewardBundle(rewards) {
    return rewards
        .map((reward) => {
        switch (reward.type) {
            case 'equipment':
                return `Equipment: ${reward.ids.map((id) => equipment_1.EQUIPMENT[id]?.name ?? id).join(', ')}`;
            case 'djinn':
                return `Djinn: ${reward.ids.map((id) => djinn_1.DJINN[id]?.name ?? id).join(', ')}`;
            case 'recruit':
                return `Recruit: ${reward.ids.map((id) => units_1.UNIT_DEFINITIONS[id]?.name ?? id).join(', ')}`;
            default:
                return reward.ids.join(', ');
        }
    })
        .join(' · ');
}
function getNextReward(run, highestFloorEver) {
    const pivotFloor = (() => {
        if (!run)
            return 1;
        const currentEntry = run.history[run.floorIndex];
        return (currentEntry?.floorNumber ??
            ((run.history[run.history.length - 1]?.floorNumber ?? 0) + (run.isCompleted ? 0 : 1)));
    })();
    const minFloor = Math.max(pivotFloor, highestFloorEver + 1);
    return towerRewards_1.TOWER_REWARDS.find((reward) => reward.floorNumber >= minFloor) ?? null;
}
function buildPartySummary(team) {
    if (!team) {
        return [];
    }
    return team.units.map((unit) => {
        const { hp: maxHp } = (0, stats_1.calculateEffectiveStats)(unit, team);
        const percent = maxHp > 0 ? Math.round((Math.max(unit.currentHp, 0) / maxHp) * 100) : 0;
        return {
            id: unit.id,
            name: unit.name,
            currentHp: unit.currentHp,
            maxHp,
            hpPercent: Math.max(0, Math.min(100, percent)),
            djinn: unit.djinn,
        };
    });
}
function buildDjinnStatus(team) {
    if (!team) {
        return {};
    }
    const entries = {};
    for (const [djinnId, tracker] of Object.entries(team.djinnTrackers)) {
        entries[djinnId] = {
            name: djinn_1.DJINN[djinnId]?.name ?? djinnId,
            state: tracker.state,
        };
    }
    return entries;
}
function TowerRecords({ towerRecord }) {
    return ((0, jsx_runtime_1.jsxs)("section", { class: "tower-card record", "data-testid": "tower-record-panel", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Tower Record" }), (0, jsx_runtime_1.jsxs)("div", { class: "record-grid", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { class: "label", children: "Highest Floor Ever" }), (0, jsx_runtime_1.jsx)("span", { class: "value", children: towerRecord.highestFloorEver })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { class: "label", children: "Total Runs" }), (0, jsx_runtime_1.jsx)("span", { class: "value", children: towerRecord.totalRuns })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { class: "label", children: "Best Run (Turns)" }), (0, jsx_runtime_1.jsx)("span", { class: "value", children: towerRecord.bestRunTurns ?? '—' })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { class: "label", children: "Best Run (Damage)" }), (0, jsx_runtime_1.jsx)("span", { class: "value", children: towerRecord.bestRunDamageDealt ?? '—' })] })] })] }));
}
