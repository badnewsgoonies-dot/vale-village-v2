"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopEquipScreen = ShopEquipScreen;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
const store_1 = require("../state/store");
const shops_1 = require("../../data/definitions/shops");
const equipment_1 = require("../../data/definitions/equipment");
const ShopService_1 = require("../../core/services/ShopService");
const starterKits_1 = require("../../data/definitions/starterKits");
const EquipmentIcon_1 = require("./EquipmentIcon");
const Unit_1 = require("../../core/models/Unit");
const Equipment_1 = require("../../core/models/Equipment");
const stats_1 = require("../../core/algorithms/stats");
require("./ShopEquipScreen.css");
const contentAvailability_1 = require("../utils/contentAvailability");
const EQUIPMENT_SLOTS = ['weapon', 'armor', 'helm', 'boots', 'accessory'];
const SLOT_ICONS = {
    weapon: '⚔️',
    armor: '🛡️',
    helm: '⛑️',
    boots: '👢',
    accessory: '💎',
};
function ShopEquipScreen({ shopId, onClose }) {
    const { gold, addGold, addEquipment, removeEquipment, team, updateTeamUnits, equipment: inventory } = (0, store_1.useStore)((s) => ({
        gold: s.gold,
        addGold: s.addGold,
        addEquipment: s.addEquipment,
        removeEquipment: s.removeEquipment,
        team: s.team,
        updateTeamUnits: s.updateTeamUnits,
        equipment: s.equipment,
    }));
    const storyFlags = (0, store_1.useStore)((s) => s.story.flags);
    const [activeTab, setActiveTab] = (0, hooks_1.useState)('shop');
    const [selectedUnitId, setSelectedUnitId] = (0, hooks_1.useState)(team?.units[0]?.id ?? null);
    const [selectedSlot, setSelectedSlot] = (0, hooks_1.useState)(null);
    const [error, setError] = (0, hooks_1.useState)(null);
    const selectedUnit = team?.units.find((u) => u.id === selectedUnitId) ?? null;
    // Shop tab logic
    const shop = shopId ? shops_1.SHOPS[shopId] : null;
    const isShopUnlocked = !shop || !shop.unlockCondition || shop.unlockCondition(storyFlags);
    const availableItems = shop && isShopUnlocked
        ? (shop.availableItems
            .map((id) => equipment_1.EQUIPMENT[id])
            .filter((item) => Boolean(item))
            .filter(contentAvailability_1.isAvailableInCampaign))
        : [];
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
    const handleStarterKitPurchase = (unitId) => {
        if (!team)
            return;
        const unit = team.units.find((u) => u.id === unitId);
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
    // Equipment tab logic
    const handleEquip = (equipment) => {
        if (!selectedUnit || !selectedSlot)
            return;
        // If there's already an item in this slot, return it to inventory first
        const currentItem = selectedUnit.equipment[selectedSlot];
        if (currentItem) {
            addEquipment([currentItem]);
        }
        // Remove the new item from inventory
        removeEquipment(equipment.id);
        // Equip the new item
        const newEquipment = { ...selectedUnit.equipment, [selectedSlot]: equipment };
        const updatedUnit = (0, Unit_1.updateUnit)(selectedUnit, { equipment: newEquipment });
        const updatedUnits = team.units.map((u) => (u.id === selectedUnit.id ? updatedUnit : u));
        updateTeamUnits(updatedUnits);
        setSelectedSlot(null);
    };
    const handleUnequip = (slot) => {
        if (!selectedUnit)
            return;
        // Get the item being unequipped
        const itemToUnequip = selectedUnit.equipment[slot];
        // Update unit equipment (set slot to null)
        const newEquipment = { ...selectedUnit.equipment, [slot]: null };
        const updatedUnit = (0, Unit_1.updateUnit)(selectedUnit, { equipment: newEquipment });
        // Return item to inventory if it exists
        if (itemToUnequip) {
            addEquipment([itemToUnequip]);
        }
        const updatedUnits = team.units.map((u) => (u.id === selectedUnit.id ? updatedUnit : u));
        updateTeamUnits(updatedUnits);
    };
    const availableEquipmentForSlot = selectedUnit && selectedSlot
        ? inventory.filter((item) => item.slot === selectedSlot &&
            (item.allowedElements.length === 0 || item.allowedElements.includes(selectedUnit.element)))
        : [];
    const equipmentBonuses = selectedUnit ? (0, Equipment_1.calculateEquipmentBonuses)(selectedUnit.equipment) : {};
    const levelBonuses = selectedUnit ? (0, stats_1.calculateLevelBonuses)(selectedUnit) : {};
    const previewStats = selectedUnit ? {
        atk: selectedUnit.baseStats.atk + (levelBonuses.atk || 0) + (equipmentBonuses.atk || 0),
        def: selectedUnit.baseStats.def + (levelBonuses.def || 0) + (equipmentBonuses.def || 0),
        mag: selectedUnit.baseStats.mag + (levelBonuses.mag || 0) + (equipmentBonuses.mag || 0),
        spd: selectedUnit.baseStats.spd + (levelBonuses.spd || 0) + (equipmentBonuses.spd || 0),
    } : null;
    return ((0, jsx_runtime_1.jsx)("div", { class: "shop-equip-overlay", onClick: onClose, children: (0, jsx_runtime_1.jsxs)("div", { class: "shop-equip-container", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { class: "shop-equip-header", children: [(0, jsx_runtime_1.jsx)("h1", { children: shop ? shop.name : 'Shop & Equipment' }), (0, jsx_runtime_1.jsx)("button", { class: "close-btn", onClick: onClose, "aria-label": "Close", children: "\u00D7" })] }), (0, jsx_runtime_1.jsxs)("div", { class: "shop-equip-gold", children: [(0, jsx_runtime_1.jsx)("span", { class: "gold-label", children: "Gold:" }), (0, jsx_runtime_1.jsxs)("span", { class: "gold-value", children: [gold, "g"] })] }), (0, jsx_runtime_1.jsx)("div", { class: "shop-equip-note", style: { fontSize: '0.8rem', color: '#a9b1c8', padding: '0 1rem', marginBottom: '0.5rem' }, children: "Equipment in your inventory is shared across the roster and locked to elements. Use the Pre-Battle screen to finalize which pieces each unit actually carries into combat." }), error && ((0, jsx_runtime_1.jsx)("div", { class: "shop-equip-error", role: "alert", children: error })), (0, jsx_runtime_1.jsxs)("div", { class: "shop-equip-tabs", children: [(0, jsx_runtime_1.jsx)("button", { class: `tab-btn ${activeTab === 'shop' ? 'active' : ''}`, onClick: () => setActiveTab('shop'), children: "Shop" }), (0, jsx_runtime_1.jsx)("button", { class: `tab-btn ${activeTab === 'equip' ? 'active' : ''}`, onClick: () => setActiveTab('equip'), children: "Equipment" })] }), (0, jsx_runtime_1.jsxs)("div", { class: "shop-equip-content", children: [activeTab === 'shop' && ((0, jsx_runtime_1.jsx)("div", { class: "shop-tab-content", children: !shop ? ((0, jsx_runtime_1.jsx)("div", { class: "shop-empty", children: "No shop available" })) : !isShopUnlocked ? ((0, jsx_runtime_1.jsx)("div", { class: "shop-locked", children: "This shop is not yet available." })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [starterKitEntries.length > 0 && ((0, jsx_runtime_1.jsxs)("section", { class: "starter-kits-section", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Starter Kits" }), (0, jsx_runtime_1.jsx)("div", { class: "shop-items-grid", children: starterKitEntries.map(({ unit, kit }) => {
                                                    const affordable = gold >= kit.cost;
                                                    return ((0, jsx_runtime_1.jsxs)("div", { class: `shop-item-card ${!affordable ? 'unaffordable' : ''}`, children: [(0, jsx_runtime_1.jsxs)("div", { class: "item-details", children: [(0, jsx_runtime_1.jsx)("div", { class: "item-name", children: kit.name }), (0, jsx_runtime_1.jsxs)("div", { class: "item-stats", children: [(0, jsx_runtime_1.jsx)("span", { class: "stat-badge", children: unit.name }), (0, jsx_runtime_1.jsxs)("span", { class: "stat-badge", children: [kit.cost, "g"] })] })] }), (0, jsx_runtime_1.jsx)("button", { class: "buy-btn", onClick: () => handleStarterKitPurchase(unit.id), disabled: !affordable, children: "Purchase Starter Kit" })] }, unit.id));
                                                }) })] })), unlockedUnits.map((unit) => {
                                        // Filter equipment by element type (not unit-specific)
                                        const availableEquipment = Object.values(equipment_1.EQUIPMENT).filter((item) => (0, contentAvailability_1.isAvailableInCampaign)(item) && item.allowedElements.includes(unit.element));
                                        return ((0, jsx_runtime_1.jsxs)("section", { class: "unit-store-section", children: [(0, jsx_runtime_1.jsxs)("h2", { children: [unit.name, "'s Equipment (", unit.element, ")"] }), availableEquipment.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { class: "shop-empty", children: "No equipment available yet." })) : ((0, jsx_runtime_1.jsx)("div", { class: "shop-items-grid", children: availableEquipment.map((item) => {
                                                        const affordable = (0, ShopService_1.canAffordItem)(gold, item.id);
                                                        return ((0, jsx_runtime_1.jsxs)("div", { class: `shop-item-card ${!affordable ? 'unaffordable' : ''}`, children: [(0, jsx_runtime_1.jsx)("div", { class: "item-icon", children: (0, jsx_runtime_1.jsx)(EquipmentIcon_1.EquipmentIcon, { equipment: item }) }), (0, jsx_runtime_1.jsxs)("div", { class: "item-details", children: [(0, jsx_runtime_1.jsx)("div", { class: "item-name", children: item.name }), (0, jsx_runtime_1.jsx)("div", { class: "item-stats", children: Object.entries(item.statBonus).map(([stat, value]) => ((0, jsx_runtime_1.jsxs)("span", { class: "stat-badge", children: ["+", value, " ", stat.toUpperCase()] }, stat))) }), (0, jsx_runtime_1.jsxs)("div", { class: "item-price", children: [item.cost, "g"] })] }), (0, jsx_runtime_1.jsxs)("button", { class: "buy-btn", onClick: () => handleUnitEquipmentPurchase(unit, item.id), disabled: !affordable, children: ["Purchase for ", unit.name] })] }, `${unit.id}-${item.id}`));
                                                    }) }))] }, unit.id));
                                    }), availableItems.length > 0 && ((0, jsx_runtime_1.jsxs)("section", { class: "shop-general-section", children: [(0, jsx_runtime_1.jsx)("h2", { children: "General Equipment" }), (0, jsx_runtime_1.jsx)("div", { class: "shop-items-grid", children: availableItems.map((item) => {
                                                    const affordable = (0, ShopService_1.canAffordItem)(gold, item.id);
                                                    return ((0, jsx_runtime_1.jsxs)("div", { class: `shop-item-card ${!affordable ? 'unaffordable' : ''}`, children: [(0, jsx_runtime_1.jsx)("div", { class: "item-icon", children: (0, jsx_runtime_1.jsx)(EquipmentIcon_1.EquipmentIcon, { equipment: item }) }), (0, jsx_runtime_1.jsxs)("div", { class: "item-details", children: [(0, jsx_runtime_1.jsx)("div", { class: "item-name", children: item.name }), (0, jsx_runtime_1.jsx)("div", { class: "item-stats", children: Object.entries(item.statBonus).map(([stat, value]) => ((0, jsx_runtime_1.jsxs)("span", { class: "stat-badge", children: ["+", value, " ", stat.toUpperCase()] }, stat))) }), (0, jsx_runtime_1.jsxs)("div", { class: "item-price", children: [item.cost, "g"] })] }), (0, jsx_runtime_1.jsx)("button", { class: "buy-btn", onClick: () => handleUnlock(item.id), disabled: !affordable, children: "Unlock Equipment" })] }, item.id));
                                                }) })] })), starterKitEntries.length === 0 && unlockedUnits.length === 0 && availableItems.length === 0 && ((0, jsx_runtime_1.jsx)("div", { class: "shop-empty", children: "No items available." }))] })) })), activeTab === 'equip' && ((0, jsx_runtime_1.jsxs)("div", { class: "equip-tab-content", children: [(0, jsx_runtime_1.jsx)("div", { class: "equipment-tab-note", style: { fontSize: '0.8rem', color: '#9ea6b7', marginBottom: '0.5rem', textAlign: 'center' }, children: "This view shows each unit's preferred loadout. The Pre-Battle screen is still the final say for actual gear per battle." }), !team || team.units.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { class: "shop-empty", children: "No units available." })) : ((0, jsx_runtime_1.jsxs)("div", { class: "equip-layout", children: [(0, jsx_runtime_1.jsxs)("div", { class: "unit-selector-panel", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Select Unit" }), (0, jsx_runtime_1.jsx)("div", { class: "unit-list", children: team.units.map((unit) => ((0, jsx_runtime_1.jsx)("div", { class: `unit-card ${selectedUnitId === unit.id ? 'selected' : ''}`, onClick: () => {
                                                            setSelectedUnitId(unit.id);
                                                            setSelectedSlot(null);
                                                        }, children: (0, jsx_runtime_1.jsxs)("div", { class: "unit-info", children: [(0, jsx_runtime_1.jsx)("div", { class: "unit-name", children: unit.name }), (0, jsx_runtime_1.jsxs)("div", { class: "unit-level", children: ["Lv. ", unit.level] })] }) }, unit.id))) })] }), selectedUnit && ((0, jsx_runtime_1.jsxs)("div", { class: "equipment-management-panel", children: [(0, jsx_runtime_1.jsxs)("div", { class: "equipment-slots-section", children: [(0, jsx_runtime_1.jsxs)("h2", { children: [selectedUnit.name, "'s Equipment"] }), (0, jsx_runtime_1.jsx)("div", { class: "equipment-grid", children: EQUIPMENT_SLOTS.map((slot) => {
                                                                const eq = selectedUnit.equipment[slot];
                                                                const isSelected = selectedSlot === slot;
                                                                return ((0, jsx_runtime_1.jsxs)("div", { class: `equipment-slot ${slot} ${isSelected ? 'selected' : ''}`, onClick: () => setSelectedSlot(isSelected ? null : slot), children: [(0, jsx_runtime_1.jsxs)("div", { class: "equipment-slot-header", children: [(0, jsx_runtime_1.jsx)("span", { class: "equipment-label", children: slot.toUpperCase() }), (0, jsx_runtime_1.jsx)("span", { class: "equipment-slot-icon", children: SLOT_ICONS[slot] })] }), eq ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { class: "equipment-value", children: eq.name }), (0, jsx_runtime_1.jsxs)("div", { class: "equipment-bonuses", children: [eq.statBonus.atk && ((0, jsx_runtime_1.jsxs)("span", { class: "bonus-badge", children: ["+", eq.statBonus.atk, " ATK"] })), eq.statBonus.def && ((0, jsx_runtime_1.jsxs)("span", { class: "bonus-badge", children: ["+", eq.statBonus.def, " DEF"] })), eq.statBonus.mag && ((0, jsx_runtime_1.jsxs)("span", { class: "bonus-badge", children: ["+", eq.statBonus.mag, " MAG"] })), eq.statBonus.spd && ((0, jsx_runtime_1.jsxs)("span", { class: "bonus-badge", children: ["+", eq.statBonus.spd, " SPD"] }))] }), isSelected && ((0, jsx_runtime_1.jsx)("button", { class: "unequip-btn", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        handleUnequip(slot);
                                                                                        setSelectedSlot(null);
                                                                                    }, children: "Unequip" }))] })) : ((0, jsx_runtime_1.jsx)("div", { class: "equipment-value empty", children: "[None]" }))] }, slot));
                                                            }) }), previewStats && ((0, jsx_runtime_1.jsxs)("div", { class: "stat-preview", children: [(0, jsx_runtime_1.jsx)("div", { class: "stat-preview-title", children: "STAT PREVIEW" }), (0, jsx_runtime_1.jsxs)("div", { class: "stat-preview-values", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["ATK: ", previewStats.atk, equipmentBonuses.atk ? ` (+${equipmentBonuses.atk})` : ''] }), (0, jsx_runtime_1.jsxs)("span", { children: ["DEF: ", previewStats.def, equipmentBonuses.def ? ` (+${equipmentBonuses.def})` : ''] }), (0, jsx_runtime_1.jsxs)("span", { children: ["MAG: ", previewStats.mag, equipmentBonuses.mag ? ` (+${equipmentBonuses.mag})` : ''] }), (0, jsx_runtime_1.jsxs)("span", { children: ["SPD: ", previewStats.spd, equipmentBonuses.spd ? ` (+${equipmentBonuses.spd})` : ''] })] })] }))] }), (0, jsx_runtime_1.jsx)("div", { class: "equipment-inventory-section", children: selectedSlot ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { class: "slot-indicator", children: ["Equipping to: ", (0, jsx_runtime_1.jsx)("strong", { children: selectedSlot.toUpperCase() })] }), availableEquipmentForSlot.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { class: "inventory-empty", children: ["No ", selectedSlot, " available in inventory"] })) : ((0, jsx_runtime_1.jsx)("div", { class: "inventory-grid", children: availableEquipmentForSlot.map((item) => ((0, jsx_runtime_1.jsxs)("div", { class: "inventory-item", onClick: () => handleEquip(item), children: [(0, jsx_runtime_1.jsx)("div", { class: "inventory-item-icon", children: (0, jsx_runtime_1.jsx)(EquipmentIcon_1.EquipmentIcon, { equipment: item }) }), (0, jsx_runtime_1.jsx)("div", { class: "inventory-item-name", children: item.name }), (0, jsx_runtime_1.jsxs)("div", { class: "inventory-item-stats", children: [item.statBonus.atk && `+${item.statBonus.atk} ATK `, item.statBonus.def && `+${item.statBonus.def} DEF `, item.statBonus.mag && `+${item.statBonus.mag} MAG `, item.statBonus.spd && `+${item.statBonus.spd} SPD `] })] }, item.id))) }))] })) : ((0, jsx_runtime_1.jsx)("div", { class: "slot-prompt", children: "Select an equipment slot to view available items" })) })] }))] }))] }))] })] }) }));
}
