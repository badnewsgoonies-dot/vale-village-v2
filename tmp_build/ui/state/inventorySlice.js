"use strict";
/**
 * Inventory state slice for Zustand
 * Manages player's gold and equipment inventory
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInventorySlice = void 0;
const createInventorySlice = (set) => ({
    gold: 0,
    equipment: [],
    addGold: (amount) => {
        set((state) => ({ gold: state.gold + amount }));
    },
    addEquipment: (items) => {
        // Deep clone equipment to avoid reference sharing issues with duplicates
        set((state) => ({
            equipment: [...state.equipment, ...items.map(item => ({ ...item }))]
        }));
    },
    removeEquipment: (itemId) => {
        set((state) => {
            const index = state.equipment.findIndex((item) => item.id === itemId);
            if (index === -1)
                return state; // Item not found, no change
            const newEquipment = [...state.equipment];
            newEquipment.splice(index, 1); // Remove only the first matching item
            return { equipment: newEquipment };
        });
    },
    setGold: (amount) => {
        set({ gold: amount });
    },
    setEquipment: (items) => {
        set({ equipment: items.map(item => ({ ...item })) });
    },
});
exports.createInventorySlice = createInventorySlice;
