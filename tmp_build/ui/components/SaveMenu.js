"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveMenu = SaveMenu;
const jsx_runtime_1 = require("preact/jsx-runtime");
// @ts-nocheck
/**
 * SaveMenu Component
 * Displays 3 save slots with metadata and save/load/delete actions
 * Redesigned with Golden Sun aesthetic
 */
const hooks_1 = require("preact/hooks");
const store_1 = require("../state/store");
const gameStore_1 = require("../../store/gameStore");
const SimpleSprite_1 = require("../sprites/SimpleSprite");
require("./SaveMenu.css");
/**
 * Format timestamp to readable date/time
 */
function formatTimestamp(timestamp) {
    if (!timestamp)
        return 'No save';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
/**
 * Format playtime in seconds to readable format
 */
function formatPlaytime(seconds) {
    if (!seconds)
        return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
}
function SaveMenu({ onClose }) {
    const { saveGameSlot, loadGameSlot, deleteSaveSlot, getSaveSlotMetadata: getMetadata, setMode } = (0, store_1.useStore)();
    const startTransition = (0, gameStore_1.useGameStore)((s) => s.startTransition);
    const [slots, setSlots] = (0, hooks_1.useState)([
        { exists: false },
        { exists: false },
        { exists: false },
    ]);
    const [selectedSlot, setSelectedSlot] = (0, hooks_1.useState)(null);
    const [action, setAction] = (0, hooks_1.useState)(null);
    const [isLoading, setIsLoading] = (0, hooks_1.useState)(false);
    const [error, setError] = (0, hooks_1.useState)(null);
    // Refresh slot metadata
    const refreshSlots = () => {
        setSlots([
            getMetadata(0),
            getMetadata(1),
            getMetadata(2),
        ]);
    };
    (0, hooks_1.useEffect)(() => {
        refreshSlots();
    }, []);
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
    const handleSlotClick = (slotIndex) => {
        if (action === 'save') {
            handleSave(slotIndex);
        }
        else if (action === 'load') {
            handleLoad(slotIndex);
        }
        else if (action === 'delete') {
            setSelectedSlot(slotIndex);
        }
    };
    const handleSave = async (slotIndex) => {
        setIsLoading(true);
        setError(null);
        try {
            await saveGameSlot(slotIndex);
            refreshSlots();
            setAction(null);
            setSelectedSlot(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save game');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleLoad = async (slotIndex) => {
        if (!slots[slotIndex]?.exists) {
            setError('No save file found in this slot');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await loadGameSlot(slotIndex);
            setMode('overworld');
            // Navigate to overworld after successful load
            startTransition('overworld');
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load game');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDelete = (slotIndex) => {
        if (!slots[slotIndex]?.exists) {
            return;
        }
        deleteSaveSlot(slotIndex);
        refreshSlots();
        setSelectedSlot(null);
        setAction(null);
    };
    const handleConfirmDelete = () => {
        if (selectedSlot !== null) {
            handleDelete(selectedSlot);
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { class: "save-menu-overlay", onClick: onClose, children: (0, jsx_runtime_1.jsxs)("div", { class: "save-menu-container gs-window", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { class: "save-menu-header", children: [(0, jsx_runtime_1.jsx)("h1", { class: "gs-title", children: "Save / Load Game" }), (0, jsx_runtime_1.jsx)("button", { class: "close-btn", onClick: onClose, "aria-label": "Close save menu", children: "\u00D7" })] }), error && ((0, jsx_runtime_1.jsx)("div", { class: "save-menu-error", role: "alert", children: error })), isLoading && ((0, jsx_runtime_1.jsx)("div", { class: "save-menu-loading", children: action === 'save' ? 'Saving...' : 'Loading...' })), (0, jsx_runtime_1.jsxs)("div", { class: "save-menu-actions", children: [(0, jsx_runtime_1.jsxs)("button", { class: `gs-button ${action === 'save' ? 'selected' : ''}`, onClick: () => {
                                setAction(action === 'save' ? null : 'save');
                                setSelectedSlot(null);
                            }, disabled: isLoading, children: [(0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: "save-game", width: 24, height: 24, style: { marginRight: '8px' } }), "New Save"] }), (0, jsx_runtime_1.jsxs)("button", { class: `gs-button ${action === 'load' ? 'selected' : ''}`, onClick: () => {
                                setAction(action === 'load' ? null : 'load');
                                setSelectedSlot(null);
                            }, disabled: isLoading, children: [(0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: "continue", width: 24, height: 24, style: { marginRight: '8px' } }), "Load Save"] })] }), (0, jsx_runtime_1.jsx)("div", { class: "save-slots", children: slots.map((slot, index) => ((0, jsx_runtime_1.jsxs)("div", { class: `save-slot gs-window ${selectedSlot === index ? 'selected' : ''} ${!slot.exists ? 'empty' : ''}`, onClick: () => handleSlotClick(index), style: { marginBottom: '1rem', cursor: 'pointer' }, children: [(0, jsx_runtime_1.jsxs)("div", { class: "save-slot-header", children: [(0, jsx_runtime_1.jsxs)("h2", { children: ["Slot ", index + 1] }), action === 'save' && ((0, jsx_runtime_1.jsx)("span", { class: "gs-value", children: "Click to save" })), action === 'load' && slot.exists && ((0, jsx_runtime_1.jsx)("span", { class: "gs-value", children: "Click to load" })), action === 'delete' && slot.exists && ((0, jsx_runtime_1.jsx)("span", { class: "gs-value", children: "Click to delete" }))] }), slot.exists ? ((0, jsx_runtime_1.jsx)("div", { class: "save-slot-content", children: (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: '16px', alignItems: 'flex-start' }, children: [(0, jsx_runtime_1.jsx)("div", { class: "save-slot-portrait", children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: "isaac1", width: 64, height: 64 }) }), (0, jsx_runtime_1.jsxs)("div", { class: "save-slot-meta", children: [(0, jsx_runtime_1.jsxs)("div", { class: "meta-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "gs-label", children: "Date:" }), (0, jsx_runtime_1.jsx)("span", { class: "gs-value", children: formatTimestamp(slot.timestamp) })] }), (0, jsx_runtime_1.jsxs)("div", { class: "meta-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "gs-label", children: "Playtime:" }), (0, jsx_runtime_1.jsx)("span", { class: "gs-value", children: formatPlaytime(slot.playtime) })] }), (0, jsx_runtime_1.jsxs)("div", { class: "meta-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "gs-label", children: "Team Level:" }), (0, jsx_runtime_1.jsxs)("span", { class: "gs-value", children: ["Lv. ", slot.teamLevel ?? 1] })] }), (0, jsx_runtime_1.jsxs)("div", { class: "meta-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "gs-label", children: "Gold:" }), (0, jsx_runtime_1.jsxs)("span", { class: "gs-value", children: [slot.gold ?? 0, "g"] })] }), slot.chapter && ((0, jsx_runtime_1.jsxs)("div", { class: "meta-row", children: [(0, jsx_runtime_1.jsx)("span", { class: "gs-label", children: "Chapter:" }), (0, jsx_runtime_1.jsx)("span", { class: "gs-value", children: slot.chapter })] }))] })] }) })) : ((0, jsx_runtime_1.jsx)("div", { class: "save-slot-empty", children: (0, jsx_runtime_1.jsx)("span", { children: "Empty Slot" }) }))] }, index))) }), action === 'delete' && selectedSlot !== null && slots[selectedSlot]?.exists && ((0, jsx_runtime_1.jsxs)("div", { class: "delete-confirmation gs-window", style: { background: 'rgba(100, 0, 0, 0.2)' }, children: [(0, jsx_runtime_1.jsx)("p", { children: "Are you sure you want to delete this save?" }), (0, jsx_runtime_1.jsxs)("div", { class: "confirmation-buttons", style: { display: 'flex', gap: '1rem' }, children: [(0, jsx_runtime_1.jsx)("button", { class: "gs-button selected", onClick: handleConfirmDelete, children: "Yes, Delete" }), (0, jsx_runtime_1.jsx)("button", { class: "gs-button", onClick: () => {
                                        setSelectedSlot(null);
                                        setAction(null);
                                    }, children: "Cancel" })] })] })), action !== 'delete' && ((0, jsx_runtime_1.jsx)("div", { class: "save-menu-footer", children: (0, jsx_runtime_1.jsxs)("button", { class: "gs-button", style: { borderColor: 'rgba(255, 0, 0, 0.3)' }, onClick: () => {
                            setAction('delete');
                            setSelectedSlot(null);
                        }, disabled: isLoading, children: [(0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: "erase-file", width: 24, height: 24, style: { marginRight: '8px' } }), "Delete Save"] }) }))] }) }));
}
