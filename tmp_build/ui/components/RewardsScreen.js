"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardsScreen = RewardsScreen;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
const BattleUnitSprite_1 = require("./BattleUnitSprite");
const SimpleSprite_1 = require("../sprites/SimpleSprite");
const mappings_1 = require("../sprites/mappings");
const EquipmentIcon_1 = require("./EquipmentIcon");
const EquipmentChoicePicker_1 = require("./EquipmentChoicePicker");
require("./RewardsScreen.css");
const djinn_1 = require("../../data/definitions/djinn");
const abilities_1 = require("../../data/definitions/abilities");
const djinnAbilities_1 = require("../../data/definitions/djinnAbilities");
/** Sparkle effect component for victory celebration */
function VictorySparkles() {
    return ((0, jsx_runtime_1.jsx)("div", { class: "victory-sparkles", "aria-hidden": "true", children: [...Array(12)].map((_, i) => ((0, jsx_runtime_1.jsx)("div", { class: "sparkle", style: { '--delay': `${i * 0.25}s`, '--left': `${5 + i * 8}%` } }, i))) }));
}
function isDefined(value) {
    return value !== undefined && value !== null;
}
function resolveAbility(abilityId) {
    return abilities_1.ABILITIES[abilityId] ?? djinnAbilities_1.DJINN_ABILITIES[abilityId] ?? null;
}
function RewardsScreen({ rewards, team, newDjinnIds, bonusEquipment, bonusRecruits, onContinue, onSelectEquipment, }) {
    const partySize = rewards.rewards.partySize;
    const xpTotal = rewards.rewards.totalXp;
    const xpPerUnit = rewards.rewards.xpPerUnit;
    const xpRemainder = partySize > 0 ? xpTotal - xpPerUnit * partySize : 0;
    const koUnitsStillGainXp = partySize > 0 && rewards.rewards.survivorCount !== partySize;
    // Get surviving party members for the victory display
    const partyMembers = (0, hooks_1.useMemo)(() => {
        return team.units.filter(u => u.currentHp > 0).slice(0, 4);
    }, [team.units]);
    // Look up units for level-ups
    const levelUpUnits = rewards.levelUps
        .map(levelUp => {
        const unit = team.units.find(u => u.id === levelUp.unitId);
        if (!unit) {
            if (import.meta.env.DEV) {
                // TODO: Add proper error logging for missing unit
                // console.warn(`Unit not found for level-up: ${levelUp.unitId}`);
            }
            return null;
        }
        return {
            unit,
            oldLevel: levelUp.oldLevel,
            newLevel: levelUp.newLevel,
            statGains: levelUp.statGains,
            unlockedAbilities: levelUp.newAbilitiesUnlocked,
        };
    })
        .filter((entry) => entry !== null);
    const hasPendingChoice = rewards.equipmentChoice && !rewards.choiceSelected;
    const obtainedEquipment = rewards.choiceSelected
        ? [rewards.choiceSelected]
        : rewards.fixedEquipment
            ? [rewards.fixedEquipment]
            : [];
    const towerBonusEquipment = bonusEquipment ?? [];
    const towerBonusRecruits = bonusRecruits ?? [];
    const newlyCollectedDjinn = (0, hooks_1.useMemo)(() => (newDjinnIds ?? []).map((djinnId) => djinn_1.DJINN[djinnId]).filter(isDefined), [newDjinnIds]);
    // Keyboard handler
    (0, hooks_1.useEffect)(() => {
        const handleKeyDown = (event) => {
            // Handle equipment choice selection (1-9)
            if (hasPendingChoice && rewards.equipmentChoice) {
                const num = parseInt(event.key, 10);
                if (!Number.isNaN(num) && num >= 1 && num <= rewards.equipmentChoice.length) {
                    event.preventDefault();
                    event.stopPropagation();
                    const selected = rewards.equipmentChoice[num - 1];
                    if (selected) {
                        onSelectEquipment(selected);
                    }
                    return;
                }
            }
            // Handle continue (Enter/Space)
            if (!hasPendingChoice || rewards.choiceSelected) {
                if (event.key === 'Enter' || event.key === ' ' || event.code === 'Enter' || event.code === 'Space') {
                    event.preventDefault();
                    event.stopPropagation();
                    onContinue();
                    return;
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown, true); // Use capture phase
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [hasPendingChoice, rewards.equipmentChoice, rewards.choiceSelected, onContinue, onSelectEquipment]);
    return ((0, jsx_runtime_1.jsxs)("div", { class: "rewards-screen rewards-screen--golden-sun", children: [(0, jsx_runtime_1.jsx)(VictorySparkles, {}), (0, jsx_runtime_1.jsxs)("div", { class: "rewards-container", children: [(0, jsx_runtime_1.jsxs)("div", { class: "victory-banner", role: "banner", children: [(0, jsx_runtime_1.jsx)("h1", { children: "VICTORY!" }), (0, jsx_runtime_1.jsx)("div", { class: "victory-sub", children: "All enemies defeated!" })] }), (0, jsx_runtime_1.jsx)("div", { class: "party-display", "aria-label": "Victorious party members", children: partyMembers.map((unit, index) => ((0, jsx_runtime_1.jsxs)("div", { class: "party-member", style: { '--index': index }, children: [(0, jsx_runtime_1.jsx)("div", { class: "party-sprite", children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: (0, mappings_1.getPortraitSprite)(unit.id), width: 64, height: 64 }) }), (0, jsx_runtime_1.jsx)("div", { class: "party-name", children: unit.name })] }, unit.id))) }), (0, jsx_runtime_1.jsxs)("div", { class: "rewards-grid", children: [(0, jsx_runtime_1.jsxs)("div", { class: "reward-card", role: "article", "aria-label": `${xpPerUnit} experience points gained per party member`, children: [(0, jsx_runtime_1.jsx)("div", { class: "reward-icon", "aria-hidden": "true", children: "XP" }), (0, jsx_runtime_1.jsxs)("div", { class: "reward-details", children: [(0, jsx_runtime_1.jsx)("div", { class: "reward-label", children: "Experience" }), (0, jsx_runtime_1.jsxs)("div", { class: "reward-value highlight", children: ["+", xpPerUnit, " XP", partySize > 1 ? ' each' : ''] }), partySize > 1 && ((0, jsx_runtime_1.jsxs)("div", { class: "reward-subtext", children: ["Total +", xpTotal, " XP \u00B7 split among ", partySize, xpRemainder > 0 ? ' (rounded down)' : '', koUnitsStillGainXp ? " · KO'd members still gain XP" : ''] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "reward-card", role: "article", "aria-label": `${rewards.goldEarned} gold coins gained`, children: [(0, jsx_runtime_1.jsx)("div", { class: "reward-icon", "aria-hidden": "true", children: "G" }), (0, jsx_runtime_1.jsxs)("div", { class: "reward-details", children: [(0, jsx_runtime_1.jsx)("div", { class: "reward-label", children: "Gold" }), (0, jsx_runtime_1.jsxs)("div", { class: "reward-value highlight", children: ["+", rewards.goldEarned, " G"] })] })] })] }), hasPendingChoice && ((0, jsx_runtime_1.jsx)(EquipmentChoicePicker_1.EquipmentChoicePicker, { options: rewards.equipmentChoice, onSelect: onSelectEquipment })), obtainedEquipment.length > 0 && ((0, jsx_runtime_1.jsxs)("section", { class: "items-panel", "aria-label": "Equipment obtained", children: [(0, jsx_runtime_1.jsx)("h2", { children: "EQUIPMENT OBTAINED" }), (0, jsx_runtime_1.jsx)("div", { class: "items-grid", children: obtainedEquipment.map(item => ((0, jsx_runtime_1.jsxs)("div", { class: "item-card", children: [(0, jsx_runtime_1.jsx)(EquipmentIcon_1.EquipmentIcon, { equipment: item, size: "small", className: "item-icon" }), (0, jsx_runtime_1.jsx)("div", { class: "item-name", children: item.name }), (0, jsx_runtime_1.jsx)("div", { class: "item-quantity", children: "x1" })] }, item.id))) })] })), towerBonusEquipment.length > 0 && ((0, jsx_runtime_1.jsxs)("section", { class: "items-panel", "aria-label": "Battle Tower milestone equipment", children: [(0, jsx_runtime_1.jsx)("h2", { children: "TOWER MILESTONE REWARDS" }), (0, jsx_runtime_1.jsx)("div", { class: "items-grid", children: towerBonusEquipment.map((item) => ((0, jsx_runtime_1.jsxs)("div", { class: "item-card", children: [(0, jsx_runtime_1.jsx)(EquipmentIcon_1.EquipmentIcon, { equipment: item, size: "small", className: "item-icon" }), (0, jsx_runtime_1.jsx)("div", { class: "item-name", children: item.name }), (0, jsx_runtime_1.jsx)("div", { class: "item-quantity", children: "x1" })] }, item.id))) })] })), towerBonusRecruits.length > 0 && ((0, jsx_runtime_1.jsxs)("section", { class: "items-panel", "aria-label": "Battle Tower milestone recruits", children: [(0, jsx_runtime_1.jsx)("h2", { children: "TOWER RECRUITS" }), (0, jsx_runtime_1.jsx)("div", { class: "items-grid", children: towerBonusRecruits.map((unit) => ((0, jsx_runtime_1.jsxs)("div", { class: "item-card", children: [(0, jsx_runtime_1.jsx)("div", { class: "item-icon", children: (0, jsx_runtime_1.jsx)(BattleUnitSprite_1.BattleUnitSprite, { unitId: unit.id, state: "idle", size: "small" }) }), (0, jsx_runtime_1.jsx)("div", { class: "item-name", children: unit.name }), (0, jsx_runtime_1.jsxs)("div", { class: "item-quantity", children: ["Lv ", unit.level] })] }, unit.id))) })] })), rewards.recruitedUnit && ((0, jsx_runtime_1.jsxs)("section", { class: "recruitment-panel", role: "alert", "aria-label": `Recruited ${rewards.recruitedUnit.name}`, children: [(0, jsx_runtime_1.jsx)("h2", { children: "NEW RECRUIT!" }), (0, jsx_runtime_1.jsxs)("div", { class: "recruitment-unit", children: [(0, jsx_runtime_1.jsx)("div", { class: "recruitment-sprite", children: (0, jsx_runtime_1.jsx)(BattleUnitSprite_1.BattleUnitSprite, { unitId: rewards.recruitedUnit.id, state: "idle", size: "medium" }) }), (0, jsx_runtime_1.jsxs)("div", { class: "recruitment-details", children: [(0, jsx_runtime_1.jsx)("div", { class: "recruitment-name", children: rewards.recruitedUnit.name }), (0, jsx_runtime_1.jsxs)("div", { class: "recruitment-level", children: ["Level ", rewards.recruitedUnit.level] }), (0, jsx_runtime_1.jsx)("div", { class: "recruitment-element", children: rewards.recruitedUnit.element }), (0, jsx_runtime_1.jsx)("div", { class: "recruitment-message", children: "has joined your roster!" }), (0, jsx_runtime_1.jsx)("div", { class: "recruitment-hint", style: { fontSize: '0.9rem', color: '#ffd700', marginTop: '0.5rem', fontStyle: 'italic' }, children: "Tip: Go to Menu \u2192 Team to manage your new ally." })] })] })] })), newlyCollectedDjinn.length > 0 && ((0, jsx_runtime_1.jsxs)("section", { class: "djinn-panel", role: "alert", "aria-label": "Djinn acquired", children: [(0, jsx_runtime_1.jsx)("h2", { children: "DJINN ACQUIRED" }), (0, jsx_runtime_1.jsxs)("div", { class: "djinn-acquisition", children: [newlyCollectedDjinn.map((djinn) => ((0, jsx_runtime_1.jsxs)("div", { class: "djinn-acquired-row", children: [(0, jsx_runtime_1.jsx)("div", { class: "djinn-name", children: djinn.name }), (0, jsx_runtime_1.jsx)("div", { class: "djinn-element", children: djinn.element })] }, djinn.id))), (0, jsx_runtime_1.jsx)("div", { class: "djinn-message", children: "Added to your collection." }), (0, jsx_runtime_1.jsx)("div", { class: "djinn-hint", children: "Tip: Pause (Esc) \u2192 Djinn Collection (D) to equip." })] })] })), levelUpUnits.length > 0 && ((0, jsx_runtime_1.jsxs)("section", { class: "level-up-panel", role: "alert", "aria-label": `${levelUpUnits.length} units leveled up`, children: [(0, jsx_runtime_1.jsx)("h2", { children: "LEVEL UP!" }), (0, jsx_runtime_1.jsx)("div", { class: "level-up-units", children: levelUpUnits.map((levelUp, index) => ((0, jsx_runtime_1.jsxs)("div", { class: "level-up-unit", style: { animationDelay: `${0.6 + index * 0.1}s` }, children: [(0, jsx_runtime_1.jsx)("div", { class: "level-up-sprite", children: (0, jsx_runtime_1.jsx)(BattleUnitSprite_1.BattleUnitSprite, { unitId: levelUp.unit.id, state: "idle", size: "medium" }) }), (0, jsx_runtime_1.jsx)("div", { class: "level-up-name", children: levelUp.unit.name }), (0, jsx_runtime_1.jsxs)("div", { class: "level-up-arrow", children: ["Lv ", levelUp.oldLevel, " -> Lv ", levelUp.newLevel] }), (0, jsx_runtime_1.jsxs)("div", { class: "level-up-stats", children: [levelUp.statGains.hp > 0 && (0, jsx_runtime_1.jsxs)("span", { children: ["+", levelUp.statGains.hp, " HP"] }), levelUp.statGains.atk > 0 && (0, jsx_runtime_1.jsxs)("span", { children: ["+", levelUp.statGains.atk, " ATK"] }), levelUp.statGains.def > 0 && (0, jsx_runtime_1.jsxs)("span", { children: ["+", levelUp.statGains.def, " DEF"] }), levelUp.statGains.mag > 0 && (0, jsx_runtime_1.jsxs)("span", { children: ["+", levelUp.statGains.mag, " MAG"] }), levelUp.statGains.spd > 0 && (0, jsx_runtime_1.jsxs)("span", { children: ["+", levelUp.statGains.spd, " SPD"] })] }), levelUp.unlockedAbilities.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { class: "level-up-abilities", children: [(0, jsx_runtime_1.jsx)("div", { class: "level-up-abilities-title", children: "Unlocked" }), (0, jsx_runtime_1.jsx)("div", { class: "level-up-ability-list", role: "list", children: levelUp.unlockedAbilities.map((abilityId) => {
                                                        const ability = resolveAbility(abilityId);
                                                        const label = ability?.name ?? abilityId;
                                                        const meta = [];
                                                        if (ability?.type)
                                                            meta.push(ability.type);
                                                        if (ability?.element)
                                                            meta.push(ability.element);
                                                        const manaCost = ability?.manaCost ?? 0;
                                                        if (manaCost > 0)
                                                            meta.push(`${manaCost} Mana`);
                                                        return ((0, jsx_runtime_1.jsxs)("div", { class: "level-up-ability-item", role: "listitem", children: [(0, jsx_runtime_1.jsx)("div", { class: "level-up-ability-name", children: label }), meta.length > 0 && ((0, jsx_runtime_1.jsx)("div", { class: "level-up-ability-meta", children: meta.join(' • ') })), ability?.description && ((0, jsx_runtime_1.jsx)("div", { class: "level-up-ability-desc", children: ability.description }))] }, abilityId));
                                                    }) }), (0, jsx_runtime_1.jsx)("div", { class: "level-up-abilities-hint", children: "Use in battle: Actions \u2192 PSYNERGY" })] }))] }, levelUp.unit.id))) })] })), (0, jsx_runtime_1.jsx)("div", { class: "continue-container", children: (0, jsx_runtime_1.jsx)("button", { onClick: onContinue, class: "continue-btn", "aria-label": "Continue to next screen", disabled: hasPendingChoice && !rewards.choiceSelected, style: {
                                opacity: hasPendingChoice && !rewards.choiceSelected ? 0.5 : 1,
                                cursor: hasPendingChoice && !rewards.choiceSelected ? 'not-allowed' : 'pointer',
                            }, children: hasPendingChoice && !rewards.choiceSelected ? 'SELECT EQUIPMENT FIRST' : 'CONTINUE' }) })] })] }));
}
