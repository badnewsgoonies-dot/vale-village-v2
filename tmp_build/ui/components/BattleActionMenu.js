"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleActionMenu = BattleActionMenu;
const jsx_runtime_1 = require("preact/jsx-runtime");
// @ts-nocheck
const hooks_1 = require("preact/hooks");
const mana_1 = require("../../core/algorithms/mana");
const djinnAbilities_1 = require("../../data/definitions/djinnAbilities");
const djinnAbilities_2 = require("../../core/algorithms/djinnAbilities");
const djinn_1 = require("../../core/algorithms/djinn");
const store_1 = require("../state/store");
const djinn_2 = require("../../data/definitions/djinn");
const ACTION_ICONS = {
    attack: '/sprites/icons/buttons/Attack.gif',
    abilities: '/sprites/icons/buttons/Psynergy.gif',
    djinn: '/sprites/icons/buttons/Djinni.gif',
    summon: '/sprites/icons/buttons/Summon.gif',
    defend: '/sprites/icons/buttons/Defend.gif',
};
// Element star icons (fallback by element)
const ELEMENT_ICONS = {
    Venus: '/sprites/icons/misc/Venus_Star.gif',
    Mars: '/sprites/icons/misc/Mars_Star.gif',
    Mercury: '/sprites/icons/misc/Mercury_Star.gif',
    Jupiter: '/sprites/icons/misc/Jupiter_Star.gif',
    Neutral: '/sprites/icons/buttons/Attack.gif',
    neutral: '/sprites/icons/buttons/Psynergy.gif',
};
// Ability type icons (fallback by type)
const TYPE_ICONS = {
    physical: '/sprites/icons/buttons/Attack.gif',
    healing: '/sprites/icons/misc/Mercury_Star.gif',
    buff: '/sprites/icons/misc/Stat-Up.gif',
    debuff: '/sprites/icons/misc/Stat-Down.gif',
    summon: '/sprites/icons/buttons/Summon.gif',
    psynergy: '/sprites/icons/buttons/Psynergy.gif',
};
// Target type icons/labels
const TARGET_LABELS = {
    'single-enemy': { icon: 'T', label: '1' },
    'all-enemies': { icon: 'A', label: 'ALL' },
    'single-ally': { icon: '+', label: '1' },
    'all-allies': { icon: '++', label: 'ALL' },
    self: { icon: '*', label: 'SELF' },
};
function SectionHeader({ title }) {
    return ((0, jsx_runtime_1.jsx)("div", { class: "gs-label", style: { marginBottom: 8, fontSize: '0.7rem' }, children: title }));
}
function AbilityGrid({ abilities, selectedAbilityId, battle, lockedAbilityIds, currentUnit, onSelect, onPreview, }) {
    const currentQueuedAction = battle.queuedActions[battle.currentQueueIndex];
    const refundAmount = currentQueuedAction?.unitId === currentUnit.id
        ? currentQueuedAction.manaCost
        : 0;
    const effectiveRemainingMana = battle.remainingMana + refundAmount;
    return ((0, jsx_runtime_1.jsx)("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, maxHeight: 240, overflowY: 'auto', padding: '2px' }, children: abilities.map((ability) => {
            const manaCost = (0, mana_1.getAbilityManaCost)(ability.id, ability);
            const canAfford = (0, mana_1.canAffordAction)(effectiveRemainingMana, manaCost);
            const isLocked = lockedAbilityIds.includes(ability.id);
            const isSelected = selectedAbilityId === ability.id;
            const abilityType = ability.type || 'psynergy';
            return ((0, jsx_runtime_1.jsxs)("button", { class: `gs-button ${isSelected ? 'selected' : ''} ${(!canAfford || isLocked) ? 'disabled' : ''}`, onMouseEnter: () => onPreview?.(ability), onClick: () => canAfford && !isLocked && onSelect(ability.id, ability), style: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '6px 8px',
                    minHeight: 60,
                    gap: 2
                }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: 4, width: '100%' }, children: [(0, jsx_runtime_1.jsx)("img", { src: ACTION_ICONS.abilities, alt: "", width: 14, height: 14, style: { imageRendering: 'pixelated' } }), (0, jsx_runtime_1.jsx)("span", { class: "gs-value", style: { fontSize: '0.75rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, children: ability.name }), (0, jsx_runtime_1.jsx)("span", { style: { fontSize: '0.65rem', opacity: 0.8 }, children: manaCost })] }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: '0.6rem', opacity: 0.6 }, children: abilityType })] }, ability.id));
        }) }));
}
function BattleActionMenu({ battle, currentUnit, selectedAbilityId, mode, onModeChange, onSelectAbility, }) {
    const queueDjinnActivation = (0, store_1.useStore)((s) => s.queueDjinnActivation);
    const setSummonScreenOpen = (0, store_1.useStore)((s) => s.setSummonScreenOpen);
    const [selectedDjinnIds, setSelectedDjinnIds] = (0, hooks_1.useState)([]);
    const [previewAbility, setPreviewAbility] = (0, hooks_1.useState)(null);
    const lockedAbilityIds = (0, hooks_1.useMemo)(() => currentUnit ? (0, djinnAbilities_2.getLockedDjinnAbilityMetadataForUnit)(currentUnit, battle.playerTeam).map((m) => m.abilityId) : [], [currentUnit, battle.playerTeam]);
    const setDjinnIds = (0, hooks_1.useMemo)(() => (0, djinn_1.getSetDjinnIds)(battle.playerTeam), [battle.playerTeam]);
    if (!currentUnit)
        return null;
    const unlocked = currentUnit.abilities.filter((a) => currentUnit.unlockedAbilityIds.includes(a.id));
    const djinnAbilities = unlocked.filter((a) => djinnAbilities_1.DJINN_ABILITIES[a.id]);
    const regularAbilities = unlocked.filter((a) => !djinnAbilities_1.DJINN_ABILITIES[a.id]);
    if (mode === 'abilities') {
        return ((0, jsx_runtime_1.jsxs)("div", { class: "gs-window", style: { width: 360, padding: 12 }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 }, children: [(0, jsx_runtime_1.jsx)(SectionHeader, { title: "PSYNERGY" }), (0, jsx_runtime_1.jsx)("button", { class: "gs-button", onClick: () => onModeChange('root'), style: { padding: '2px 8px', fontSize: '0.7rem' }, children: "BACK" })] }), previewAbility && ((0, jsx_runtime_1.jsxs)("div", { class: "gs-window", style: { background: 'rgba(0,0,0,0.2)', marginBottom: 10, padding: 8, fontSize: '0.75rem' }, children: [(0, jsx_runtime_1.jsx)("div", { class: "gs-value", children: previewAbility.name }), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 4, opacity: 0.8 }, children: previewAbility.description })] })), (0, jsx_runtime_1.jsx)(AbilityGrid, { abilities: [...regularAbilities, ...djinnAbilities], selectedAbilityId: selectedAbilityId, battle: battle, lockedAbilityIds: lockedAbilityIds, currentUnit: currentUnit, onSelect: onSelectAbility, onPreview: setPreviewAbility })] }));
    }
    if (mode === 'summon') {
        return ((0, jsx_runtime_1.jsxs)("div", { class: "gs-window", style: { width: 300, padding: 12 }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 }, children: [(0, jsx_runtime_1.jsx)(SectionHeader, { title: "SUMMON" }), (0, jsx_runtime_1.jsx)("button", { class: "gs-button", onClick: () => onModeChange('root'), style: { padding: '2px 8px', fontSize: '0.7rem' }, children: "BACK" })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', flexDirection: 'column', gap: 6 }, children: [setDjinnIds.map(id => {
                            const djinn = djinn_2.DJINN[id];
                            const isSelected = selectedDjinnIds.includes(id);
                            return ((0, jsx_runtime_1.jsxs)("button", { class: `gs-button ${isSelected ? 'selected' : ''}`, onClick: () => setSelectedDjinnIds(prev => isSelected ? prev.filter(d => d !== id) : [...prev, id].slice(0, 3)), children: [(0, jsx_runtime_1.jsx)("img", { src: `/sprites/icons/misc/${djinn.element}_Star.gif`, width: 16, height: 16 }), (0, jsx_runtime_1.jsx)("span", { style: { flex: 1 }, children: djinn.name })] }, id));
                        }), (0, jsx_runtime_1.jsxs)("button", { class: `gs-button ${selectedDjinnIds.length > 0 ? 'selected' : 'disabled'}`, disabled: selectedDjinnIds.length === 0, onClick: () => {
                                selectedDjinnIds.forEach(id => queueDjinnActivation(id));
                                setSummonScreenOpen(false);
                                onModeChange('root');
                            }, style: { justifyContent: 'center', marginTop: 8 }, children: ["SUMMON (", selectedDjinnIds.length, ")"] })] })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { class: "gs-window", style: { width: 180, padding: 12 }, children: [(0, jsx_runtime_1.jsx)(SectionHeader, { title: "ACTIONS" }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 }, children: [(0, jsx_runtime_1.jsxs)("button", { class: "gs-button", onClick: () => onModeChange('abilities'), children: [(0, jsx_runtime_1.jsx)("img", { src: ACTION_ICONS.abilities, width: 20, height: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "PSYNERGY" })] }), (0, jsx_runtime_1.jsxs)("button", { class: `gs-button ${setDjinnIds.length > 0 ? '' : 'disabled'}`, onClick: () => onModeChange('summon'), disabled: setDjinnIds.length === 0, children: [(0, jsx_runtime_1.jsx)("img", { src: ACTION_ICONS.summon, width: 20, height: 20 }), (0, jsx_runtime_1.jsx)("span", { children: "SUMMON" })] })] })] }));
}
