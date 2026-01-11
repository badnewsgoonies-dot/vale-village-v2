"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentSection = EquipmentSection;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
const Equipment_1 = require("@/core/models/Equipment");
const stats_1 = require("@/core/algorithms/stats");
const EquipmentIcon_1 = require("./EquipmentIcon");
const EQUIPMENT_SLOTS = ['weapon', 'armor', 'helm', 'boots', 'accessory'];
function EquipmentSection({ unit, selectedSlot, onSelectSlot, equipmentLoadout, inventory, onEquip, onUnequip, }) {
    const [activeTab, setActiveTab] = (0, hooks_1.useState)('weapon');
    const [dragState, setDragState] = (0, hooks_1.useState)({ item: null, sourceSlot: null });
    const [dragOverSlot, setDragOverSlot] = (0, hooks_1.useState)(null);
    // Drag handlers for inventory items
    const handleDragStart = (0, hooks_1.useCallback)((e, item, sourceSlot = null) => {
        if (!e.dataTransfer)
            return;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.id);
        setDragState({ item, sourceSlot });
    }, []);
    const handleDragEnd = (0, hooks_1.useCallback)(() => {
        setDragState({ item: null, sourceSlot: null });
        setDragOverSlot(null);
    }, []);
    // Drop handlers for equipment slots
    const handleDragOver = (0, hooks_1.useCallback)((e, slot) => {
        e.preventDefault();
        if (!e.dataTransfer)
            return;
        // Only allow drop if dragged item matches slot type
        if (dragState.item && dragState.item.slot === slot) {
            e.dataTransfer.dropEffect = 'move';
            setDragOverSlot(slot);
        }
        else {
            e.dataTransfer.dropEffect = 'none';
        }
    }, [dragState.item]);
    const handleDragLeave = (0, hooks_1.useCallback)(() => {
        setDragOverSlot(null);
    }, []);
    const handleDrop = (0, hooks_1.useCallback)((e, slot) => {
        e.preventDefault();
        if (dragState.item && dragState.item.slot === slot) {
            // If dragging from another slot, unequip first
            if (dragState.sourceSlot && dragState.sourceSlot !== slot) {
                onUnequip(dragState.sourceSlot);
            }
            onEquip(slot, dragState.item);
        }
        setDragState({ item: null, sourceSlot: null });
        setDragOverSlot(null);
    }, [dragState, onEquip, onUnequip]);
    // Sync activeTab with selectedSlot
    (0, hooks_1.useEffect)(() => {
        if (selectedSlot) {
            setActiveTab(selectedSlot);
        }
    }, [selectedSlot]);
    // Get available equipment for current slot
    const availableEquipment = inventory.filter((item) => item.slot === activeTab && (item.allowedElements.length === 0 || item.allowedElements.includes(unit.element)));
    const handleEquip = (equipment) => {
        onEquip(activeTab, equipment);
        onSelectSlot(null);
    };
    const handleUnequip = (slot) => {
        onUnequip(slot);
        onSelectSlot(null);
    };
    const selectedEquipment = selectedSlot ? equipmentLoadout[selectedSlot] ?? null : null;
    const equipmentBonuses = (0, Equipment_1.calculateEquipmentBonuses)(equipmentLoadout);
    const levelBonuses = (0, stats_1.calculateLevelBonuses)(unit);
    // Calculate preview stats (base + level + equipment)
    const previewStats = {
        atk: unit.baseStats.atk + (levelBonuses.atk || 0) + (equipmentBonuses.atk || 0),
        def: unit.baseStats.def + (levelBonuses.def || 0) + (equipmentBonuses.def || 0),
        mag: unit.baseStats.mag + (levelBonuses.mag || 0) + (equipmentBonuses.mag || 0),
        spd: unit.baseStats.spd + (levelBonuses.spd || 0) + (equipmentBonuses.spd || 0),
    };
    return ((0, jsx_runtime_1.jsxs)("div", { class: "section-card equipment-section", children: [(0, jsx_runtime_1.jsxs)("div", { class: "equipment-panel", children: [(0, jsx_runtime_1.jsxs)("div", { class: "section-title", children: ["EQUIPMENT (", unit.name, ")"] }), (0, jsx_runtime_1.jsx)("div", { class: "equipment-grid compact", children: EQUIPMENT_SLOTS.map((slot) => {
                            const eq = equipmentLoadout[slot];
                            const isSelected = selectedSlot === slot;
                            const isDragOver = dragOverSlot === slot;
                            const canDrop = dragState.item?.slot === slot;
                            return ((0, jsx_runtime_1.jsxs)("div", { class: `equipment-slot ${slot} ${isSelected ? 'selected' : ''} ${isDragOver ? 'drag-over' : ''} ${canDrop ? 'can-drop' : ''}`, onClick: () => onSelectSlot(isSelected ? null : slot), onDragOver: (e) => handleDragOver(e, slot), onDragLeave: handleDragLeave, onDrop: (e) => handleDrop(e, slot), children: [(0, jsx_runtime_1.jsx)("div", { class: "equipment-label", children: slot.toUpperCase() }), eq ? ((0, jsx_runtime_1.jsxs)("div", { draggable: true, onDragStart: (e) => handleDragStart(e, eq, slot), onDragEnd: handleDragEnd, style: { cursor: 'grab' }, children: [(0, jsx_runtime_1.jsxs)("div", { class: "equipment-slot-row", children: [(0, jsx_runtime_1.jsx)(EquipmentIcon_1.EquipmentIcon, { equipment: eq, size: "medium", className: "equipment-slot-icon" }), (0, jsx_runtime_1.jsx)("div", { class: "equipment-value", children: eq.name })] }), (0, jsx_runtime_1.jsxs)("div", { class: "equipment-bonus-row", children: [eq.statBonus.atk && (0, jsx_runtime_1.jsxs)("span", { children: ["+", eq.statBonus.atk, " ATK"] }), eq.statBonus.def && (0, jsx_runtime_1.jsxs)("span", { children: ["+", eq.statBonus.def, " DEF"] }), eq.statBonus.spd && (0, jsx_runtime_1.jsxs)("span", { children: ["+", eq.statBonus.spd, " SPD"] })] })] })) : ((0, jsx_runtime_1.jsx)("div", { class: "equipment-value", style: { color: '#666' }, children: isDragOver && canDrop ? '[ Drop Here ]' : '[None]' }))] }, slot));
                        }) }), (0, jsx_runtime_1.jsxs)("div", { class: "stat-preview", children: ["ATK ", previewStats.atk, equipmentBonuses.atk ? ` (+${equipmentBonuses.atk})` : '', " \u00B7 DEF ", previewStats.def, equipmentBonuses.def ? ` (+${equipmentBonuses.def})` : '', " \u00B7 MAG ", previewStats.mag, equipmentBonuses.mag ? ` (+${equipmentBonuses.mag})` : '', " \u00B7 SPD ", previewStats.spd, equipmentBonuses.spd ? ` (+${equipmentBonuses.spd})` : ''] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "equipment-compendium", children: [(0, jsx_runtime_1.jsxs)("div", { class: "compendium-header", children: [(0, jsx_runtime_1.jsx)("div", { class: `compendium-banner ${selectedSlot ? '' : 'muted'}`, children: selectedSlot ? `Equipping to: ${selectedSlot.toUpperCase()}` : 'Select a slot to view equipment' }), selectedSlot && selectedEquipment && ((0, jsx_runtime_1.jsx)("button", { type: "button", class: "unequip-button", onClick: () => handleUnequip(selectedSlot), children: "Unequip" }))] }), (0, jsx_runtime_1.jsx)("div", { class: "compendium-tabs compact", children: EQUIPMENT_SLOTS.map((slot) => ((0, jsx_runtime_1.jsx)("button", { class: `compendium-tab ${activeTab === slot ? 'active' : ''}`, onClick: () => setActiveTab(slot), children: slot }, slot))) }), (0, jsx_runtime_1.jsx)("div", { class: "compendium-content compact-grid", children: availableEquipment.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { class: "item-name", style: { color: '#666', textAlign: 'center', padding: '1rem' }, children: ["No ", activeTab, " available"] })) : (availableEquipment.map((item) => ((0, jsx_runtime_1.jsxs)("button", { class: `compendium-item compact ${dragState.item?.id === item.id ? 'dragging' : ''}`, onClick: () => handleEquip(item), draggable: true, onDragStart: (e) => handleDragStart(e, item), onDragEnd: handleDragEnd, style: { cursor: 'grab' }, children: [(0, jsx_runtime_1.jsx)(EquipmentIcon_1.EquipmentIcon, { equipment: item, size: "medium", className: "item-icon" }), (0, jsx_runtime_1.jsx)("div", { class: "item-name", children: item.name })] }, item.id)))) })] })] }));
}
