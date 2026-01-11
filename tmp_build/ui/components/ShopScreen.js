"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopScreen = ShopScreen;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
const store_1 = require("../state/store");
const shops_1 = require("../../data/definitions/shops");
const equipment_1 = require("../../data/definitions/equipment");
const ShopService_1 = require("../../core/services/ShopService");
const starterKits_1 = require("../../data/definitions/starterKits");
const EquipmentIcon_1 = require("./EquipmentIcon");
require("./ShopScreen.css");
const contentAvailability_1 = require("../utils/contentAvailability");
function ShopScreen({ shopId, onClose }) {
    const { gold, addGold, addEquipment, team, updateTeamUnits } = (0, store_1.useStore)((s) => ({
        gold: s.gold,
        addGold: s.addGold,
        addEquipment: s.addEquipment,
        team: s.team,
        updateTeamUnits: s.updateTeamUnits,
    }));
    const storyFlags = (0, store_1.useStore)((s) => s.story.flags);
    const [error, setError] = (0, hooks_1.useState)(null);
    (0, hooks_1.useEffect)(() => {
        const handleKeyDown = (event) => {
            if (event.key !== 'Escape')
                return;
            event.preventDefault();
            event.stopPropagation();
            onClose();
        };
        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [onClose]);
    const shop = shops_1.SHOPS[shopId];
    if (!shop) {
        return ((0, jsx_runtime_1.jsx)("div", { class: "shop-screen-overlay", onClick: onClose, children: (0, jsx_runtime_1.jsxs)("div", { class: "shop-screen-container gs-window", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { class: "shop-error", children: ["Shop not found: ", shopId] }), (0, jsx_runtime_1.jsx)("button", { class: "gs-button", onClick: onClose, children: "Close" })] }) }));
    }
    // Filter available items based on unlock condition
    const isUnlocked = !shop.unlockCondition || shop.unlockCondition(storyFlags);
    const availableItems = isUnlocked
        ? (shop.availableItems
            .map((id) => equipment_1.EQUIPMENT[id])
            .filter((item) => Boolean(item))
            .filter(contentAvailability_1.isAvailableInCampaign))
        : [];
    const handleUnlock = (itemId) => {
        setError(null);
        const result = (0, ShopService_1.buyItem)(gold, itemId);
        if (!result.ok) {
            setError(result.error);
            return;
        }
        addGold(result.value.newGold - gold);
        addEquipment([result.value.item]);
    };
    const starterKitEntries = team
        ? team.units
            .map((unit) => ({
            unit,
            kit: (0, starterKits_1.getStarterKit)(unit),
        }))
            .filter(({ kit, unit }) => Boolean(kit) && !unit.storeUnlocked)
            .map(({ unit, kit }) => ({ unit, kit: kit }))
        : [];
    const unlockedUnits = team ? team.units.filter((unit) => unit.storeUnlocked) : [];
    const handleStarterKitPurchase = (unitId) => {
        if (!team)
            return;
        const unit = team.units.find(u => u.id === unitId);
        if (!unit)
            return;
        setError(null);
        const result = (0, ShopService_1.purchaseStarterKit)(unit, gold);
        if (!result.ok) {
            setError(result.error);
            return;
        }
        addGold(result.value.newGold - gold);
        addEquipment(result.value.equipment);
        const updatedUnits = team.units.map((unit) => unit.id === unitId ? { ...unit, storeUnlocked: true } : unit);
        updateTeamUnits(updatedUnits);
    };
    const handleUnitEquipmentPurchase = (unit, itemId) => {
        setError(null);
        const result = (0, ShopService_1.purchaseUnitEquipment)(unit, gold, itemId);
        if (!result.ok) {
            setError(result.error);
            return;
        }
        addGold(result.value.newGold - gold);
        addEquipment([result.value.item]);
    };
    return ((0, jsx_runtime_1.jsx)("div", { class: "shop-screen-overlay", onClick: onClose, children: (0, jsx_runtime_1.jsxs)("div", { class: "shop-screen-container gs-window", onClick: (e) => e.stopPropagation(), style: { minWidth: 800, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }, children: [(0, jsx_runtime_1.jsxs)("div", { class: "shop-header", children: [(0, jsx_runtime_1.jsx)("h1", { class: "gs-title", style: { margin: '0.5rem 0' }, children: shop.name }), (0, jsx_runtime_1.jsx)("button", { class: "close-btn", onClick: onClose, "aria-label": "Close shop", children: "\u00D7" })] }), (0, jsx_runtime_1.jsxs)("div", { class: "shop-top-bar", style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginBottom: '1rem' }, children: [(0, jsx_runtime_1.jsx)("div", { class: "shop-note", style: { fontSize: '0.85rem', color: '#a8b3c0', maxWidth: '60%' }, children: "Unlock shared, element-locked equipment for your roster." }), (0, jsx_runtime_1.jsxs)("div", { class: "shop-gold", children: [(0, jsx_runtime_1.jsx)("span", { class: "gs-label", children: "Gold:" }), (0, jsx_runtime_1.jsxs)("span", { class: "gs-value", style: { marginLeft: '0.5rem', fontSize: '1.2rem' }, children: [gold, "g"] })] })] }), error && ((0, jsx_runtime_1.jsx)("div", { class: "shop-error gs-window", style: { background: 'rgba(100, 0, 0, 0.2)', padding: '0.5rem', marginBottom: '1rem', color: '#ffb3b3', textAlign: 'center' }, children: error })), (0, jsx_runtime_1.jsxs)("div", { class: "shop-content no-scrollbar", style: { flex: 1, overflowY: 'auto', padding: '0 0.5rem' }, children: [starterKitEntries.length > 0 && ((0, jsx_runtime_1.jsxs)("section", { class: "starter-kits-section", style: { marginBottom: '2rem' }, children: [(0, jsx_runtime_1.jsx)("h2", { class: "gs-label", style: { borderBottom: '1px solid rgba(255,216,127,0.2)', paddingBottom: '0.25rem', marginBottom: '1rem' }, children: "Starter Kits" }), (0, jsx_runtime_1.jsx)("div", { class: "shop-items-grid", style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }, children: starterKitEntries.map(({ unit, kit }) => {
                                        const affordable = gold >= kit.cost;
                                        return ((0, jsx_runtime_1.jsxs)("div", { class: "shop-item-card gs-window", style: { background: 'rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }, children: [(0, jsx_runtime_1.jsxs)("div", { class: "item-details", children: [(0, jsx_runtime_1.jsx)("div", { class: "gs-value", style: { fontSize: '1.1rem' }, children: kit.name }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }, children: [(0, jsx_runtime_1.jsx)("span", { class: "gs-label", style: { fontSize: '0.7rem' }, children: unit.name }), (0, jsx_runtime_1.jsxs)("span", { class: "gs-value", style: { fontSize: '0.7rem' }, children: [kit.cost, "g"] })] })] }), (0, jsx_runtime_1.jsx)("button", { class: `gs-button ${affordable ? '' : 'disabled'}`, onClick: () => handleStarterKitPurchase(unit.id), disabled: !affordable, style: { justifyContent: 'center', padding: '0.5rem' }, children: "Purchase Kit" })] }, unit.id));
                                    }) })] })), unlockedUnits.map((unit) => {
                            const availableEquipment = Object.values(equipment_1.EQUIPMENT).filter((item) => (0, contentAvailability_1.isAvailableInCampaign)(item) && item.allowedElements.includes(unit.element));
                            if (availableEquipment.length === 0)
                                return null;
                            return ((0, jsx_runtime_1.jsxs)("section", { class: "unit-store-section", style: { marginBottom: '2rem' }, children: [(0, jsx_runtime_1.jsxs)("h2", { class: "gs-label", style: { borderBottom: '1px solid rgba(255,216,127,0.2)', paddingBottom: '0.25rem', marginBottom: '1rem' }, children: [unit.name, "'s Equipment"] }), (0, jsx_runtime_1.jsx)("div", { class: "shop-items-grid", style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }, children: availableEquipment.map((item) => {
                                            const affordable = (0, ShopService_1.canAffordItem)(gold, item.id);
                                            return ((0, jsx_runtime_1.jsxs)("div", { class: "shop-item-card gs-window", style: { background: 'rgba(0,0,0,0.15)', display: 'flex', gap: '1rem' }, children: [(0, jsx_runtime_1.jsx)(EquipmentIcon_1.EquipmentIcon, { equipment: item, size: "medium" }), (0, jsx_runtime_1.jsxs)("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }, children: [(0, jsx_runtime_1.jsx)("div", { class: "gs-value", children: item.name }), (0, jsx_runtime_1.jsxs)("div", { class: "item-price gs-label", children: [item.cost, "g"] }), (0, jsx_runtime_1.jsxs)("button", { class: `gs-button ${affordable ? '' : 'disabled'}`, onClick: () => handleUnitEquipmentPurchase(unit, item.id), disabled: !affordable, style: { fontSize: '0.8rem', padding: '0.4rem' }, children: ["Buy for ", unit.name] })] })] }, `${unit.id}-${item.id}`));
                                        }) })] }, unit.id));
                        })] }), (0, jsx_runtime_1.jsx)("div", { class: "shop-footer", style: { marginTop: '1rem', display: 'flex', justifyContent: 'center', padding: '1rem', borderTop: '1px solid rgba(255,216,127,0.1)' }, children: (0, jsx_runtime_1.jsx)("button", { class: "gs-button", onClick: onClose, style: { minWidth: 150, justifyContent: 'center' }, children: "Leave Shop" }) })] }) }));
}
