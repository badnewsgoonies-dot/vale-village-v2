"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModal = void 0;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
const gameStore_1 = require("../store/gameStore");
const store_1 = require("../ui/state/store");
require("./modals.css");
const InventoryModal = ({ onClose }) => {
    const { gold: legacyGold, equipment: legacyEquipment } = (0, store_1.useStore)((s) => ({
        gold: s.gold,
        equipment: s.equipment,
    }));
    const { inventoryItems, currency } = (0, gameStore_1.useGameStore)((s) => ({
        inventoryItems: s.playerData.inventory.items,
        currency: s.playerData.currency,
    }));
    const items = (0, hooks_1.useMemo)(() => {
        if (inventoryItems.length > 0) {
            return inventoryItems.map((item) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                slot: item.slot ?? 'item',
                statBonus: item.statBonus ?? {},
            }));
        }
        return legacyEquipment.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: 1,
            slot: item.slot ?? 'item',
            statBonus: item.statBonus ?? {},
        }));
    }, [inventoryItems, legacyEquipment]);
    const gold = inventoryItems.length > 0 ? currency : legacyGold;
    const [selectedItemId, setSelectedItemId] = (0, hooks_1.useState)(null);
    const selectedItem = items.find((item) => item.id === selectedItemId);
    return ((0, jsx_runtime_1.jsx)("div", { class: "modal-overlay", onClick: onClose, children: (0, jsx_runtime_1.jsxs)("div", { class: "modal modal--inventory gs-window", onClick: (e) => e.stopPropagation(), style: { minWidth: 600, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }, children: [(0, jsx_runtime_1.jsxs)("div", { class: "modal-header", children: [(0, jsx_runtime_1.jsx)("h2", { class: "gs-title", style: { marginBottom: '1rem' }, children: "Inventory" }), (0, jsx_runtime_1.jsx)("button", { class: "close-btn", onClick: onClose, "aria-label": "Close inventory", children: "\u00D7" })] }), (0, jsx_runtime_1.jsxs)("div", { class: "modal-content", style: { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }, children: [(0, jsx_runtime_1.jsxs)("div", { class: "inventory-stats", style: { display: 'flex', gap: '2rem', marginBottom: '1.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }, children: [(0, jsx_runtime_1.jsxs)("div", { class: "stat-item", children: [(0, jsx_runtime_1.jsx)("span", { class: "gs-label", children: "Gold:" }), (0, jsx_runtime_1.jsx)("span", { class: "gs-value", style: { marginLeft: '0.5rem' }, children: gold.toLocaleString() })] }), (0, jsx_runtime_1.jsxs)("div", { class: "stat-item", children: [(0, jsx_runtime_1.jsx)("span", { class: "gs-label", children: "Total Items:" }), (0, jsx_runtime_1.jsx)("span", { class: "gs-value", style: { marginLeft: '0.5rem' }, children: items.length })] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "inventory-content", style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flex: 1, overflow: 'hidden' }, children: [(0, jsx_runtime_1.jsx)("div", { class: "equipment-list no-scrollbar", style: { overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }, children: items.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { class: "empty-message", style: { textAlign: 'center', opacity: 0.5, marginTop: '2rem' }, children: "No equipment in inventory" })) : (items.map((item) => {
                                        const isSelected = selectedItemId === item.id;
                                        return ((0, jsx_runtime_1.jsxs)("button", { class: `gs-button ${isSelected ? 'selected' : ''}`, onClick: () => setSelectedItemId(item.id), children: [(0, jsx_runtime_1.jsx)("div", { class: "item-icon", children: item.slot === 'weapon' ? '⚔️' : '🛡️' }), (0, jsx_runtime_1.jsx)("div", { class: "item-info", children: (0, jsx_runtime_1.jsx)("div", { class: "item-name", children: item.name }) })] }, item.id));
                                    })) }), (0, jsx_runtime_1.jsx)("div", { class: "item-details gs-window", style: { background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,216,127,0.1)' }, children: selectedItem ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h3", { class: "gs-value", style: { fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,216,127,0.2)', paddingBottom: '0.5rem' }, children: selectedItem.name }), (0, jsx_runtime_1.jsxs)("div", { class: "detail-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "gs-label", children: "Type:" }), (0, jsx_runtime_1.jsx)("span", { class: "gs-value", style: { marginLeft: '0.5rem' }, children: selectedItem.slot ?? 'item' })] }), (0, jsx_runtime_1.jsxs)("div", { class: "detail-row", style: { marginTop: '1rem' }, children: [(0, jsx_runtime_1.jsx)("span", { class: "gs-label", children: "Stat Modifiers:" }), (0, jsx_runtime_1.jsxs)("div", { class: "detail-bonuses", style: { marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }, children: [(selectedItem.statBonus?.atk ?? 0) !== 0 && (0, jsx_runtime_1.jsxs)("div", { class: "gs-value", children: ["Attack: ", selectedItem.statBonus.atk > 0 ? '+' : '', selectedItem.statBonus.atk] }), (selectedItem.statBonus?.def ?? 0) !== 0 && (0, jsx_runtime_1.jsxs)("div", { class: "gs-value", children: ["Defense: ", selectedItem.statBonus.def > 0 ? '+' : '', selectedItem.statBonus.def] }), (selectedItem.statBonus?.mag ?? 0) !== 0 && (0, jsx_runtime_1.jsxs)("div", { class: "gs-value", children: ["Magic: ", selectedItem.statBonus.mag > 0 ? '+' : '', selectedItem.statBonus.mag] }), (selectedItem.statBonus?.spd ?? 0) !== 0 && (0, jsx_runtime_1.jsxs)("div", { class: "gs-value", children: ["Speed: ", selectedItem.statBonus.spd > 0 ? '+' : '', selectedItem.statBonus.spd] }), (selectedItem.statBonus?.hp ?? 0) !== 0 && (0, jsx_runtime_1.jsxs)("div", { class: "gs-value", children: ["HP: ", selectedItem.statBonus.hp > 0 ? '+' : '', selectedItem.statBonus.hp] })] })] })] })) : ((0, jsx_runtime_1.jsx)("div", { style: { textAlign: 'center', opacity: 0.5, marginTop: '4rem' }, children: "Select an item to view details" })) })] }), (0, jsx_runtime_1.jsx)("div", { class: "inventory-footer", style: { marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }, children: (0, jsx_runtime_1.jsx)("button", { class: "gs-button", onClick: onClose, style: { minWidth: 120, justifyContent: 'center' }, children: "Close" }) })] })] }) }));
};
exports.InventoryModal = InventoryModal;
