"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainMenu = MainMenu;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * Main Menu Component
 * Redesigned with Golden Sun aesthetic
 */
const hooks_1 = require("preact/hooks");
const gameStore_1 = require("../../store/gameStore");
const store_1 = require("../../ui/state/store");
const units_1 = require("../../data/definitions/units");
const Unit_1 = require("../../core/models/Unit");
const Team_1 = require("../../core/models/Team");
const DjinnService_1 = require("../../core/services/DjinnService");
require("./MainMenu.css");
// Character sprites flanking the menu
const MENU_CHARACTERS = {
    left: [
        { name: 'Isaac', sprite: '/sprites/overworld/protagonists/Isaac.gif' },
        { name: 'Garet', sprite: '/sprites/overworld/protagonists/Garet.gif' },
    ],
    right: [
        { name: 'Ivan', sprite: '/sprites/overworld/protagonists/Ivan.gif' },
        { name: 'Mia', sprite: '/sprites/overworld/protagonists/Mia.gif' },
    ],
};
function MainMenu() {
    const startTransition = (0, gameStore_1.useGameStore)((s) => s.startTransition);
    const openCompendium = (0, gameStore_1.useGameStore)((s) => s.openCompendium);
    const openModal = (0, gameStore_1.useGameStore)((s) => s.openModal);
    const activeModal = (0, gameStore_1.useGameStore)((s) => s.flow.modal);
    const openCompendiumFlow = (0, store_1.useStore)((s) => s.openCompendium);
    const setTeam = (0, store_1.useStore)((s) => s.setTeam);
    const addUnitToRoster = (0, store_1.useStore)((s) => s.addUnitToRoster);
    const openTowerFromMainMenu = (0, store_1.useStore)((s) => s.openTowerFromMainMenu);
    const openShopFromMainMenu = (0, store_1.useStore)((s) => s.openShopFromMainMenu);
    const hasSaveSlot = (0, store_1.useStore)((s) => s.hasSaveSlot);
    const setMode = (0, store_1.useStore)((s) => s.setMode);
    const [selectedIndex, setSelectedIndex] = (0, hooks_1.useState)(0);
    const [hasSaveFile, setHasSaveFile] = (0, hooks_1.useState)(false);
    // Check for existing save files on mount
    (0, hooks_1.useEffect)(() => {
        // Check if any of the 3 save slots have data
        const hasAnySave = hasSaveSlot(0) || hasSaveSlot(1) || hasSaveSlot(2);
        setHasSaveFile(hasAnySave);
    }, [hasSaveSlot]);
    (0, hooks_1.useEffect)(() => {
        setMode('main-menu');
    }, [setMode]);
    const menuOptions = [
        { id: 'new-game', label: 'New Game', enabled: true },
        { id: 'continue', label: 'Continue', enabled: hasSaveFile },
        { id: 'shop', label: 'Shop', enabled: true },
        { id: 'settings', label: 'Settings', enabled: true },
        { id: 'compendium', label: 'Compendium', enabled: true },
        { id: 'how-to-play', label: 'How to Play', enabled: true },
        { id: 'battle-tower', label: 'Battle Tower (Beta)', enabled: true },
    ];
    const enabledOptions = menuOptions.filter(opt => opt.enabled);
    // Ensure selectedIndex is within bounds
    const safeSelectedIndex = Math.min(selectedIndex, enabledOptions.length - 1);
    // Avoid stale key-handler closures by reading the latest selection from refs.
    const enabledOptionsRef = (0, hooks_1.useRef)(enabledOptions);
    enabledOptionsRef.current = enabledOptions;
    const selectedIndexRef = (0, hooks_1.useRef)(selectedIndex);
    selectedIndexRef.current = selectedIndex;
    const activeModalRef = (0, hooks_1.useRef)(activeModal);
    activeModalRef.current = activeModal;
    (0, hooks_1.useEffect)(() => {
        // Reset selected index when enabled options change
        if (selectedIndex >= enabledOptions.length) {
            setSelectedIndex(0);
        }
    }, [enabledOptions.length, selectedIndex]);
    (0, hooks_1.useEffect)(() => {
        const handleKeyPress = (event) => {
            // Don't steal input while a modal is open.
            if (activeModalRef.current !== null)
                return;
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault();
                event.stopPropagation();
                if (event.key === 'ArrowUp') {
                    setSelectedIndex((prev) => {
                        const options = enabledOptionsRef.current;
                        const newIndex = prev > 0 ? prev - 1 : Math.max(0, options.length - 1);
                        selectedIndexRef.current = newIndex;
                        return newIndex;
                    });
                }
                else {
                    setSelectedIndex((prev) => {
                        const options = enabledOptionsRef.current;
                        const newIndex = prev < options.length - 1 ? prev + 1 : 0;
                        selectedIndexRef.current = newIndex;
                        return newIndex;
                    });
                }
                return;
            }
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                const options = enabledOptionsRef.current;
                const index = Math.min(selectedIndexRef.current, Math.max(0, options.length - 1));
                const selected = options[index] || options[0];
                if (selected) {
                    handleSelectOption(selected.id);
                }
                return;
            }
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                startTransition('title');
                return;
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [startTransition]);
    const createStarterTeamWithFlint = () => {
        const isaac = (0, Unit_1.createUnit)(units_1.ADEPT, 1, 0);
        addUnitToRoster(isaac);
        let starterTeam = (0, Team_1.createTeam)([isaac]);
        const collectResult = (0, DjinnService_1.collectDjinn)(starterTeam, 'flint');
        if (collectResult.ok) {
            const equipResult = (0, DjinnService_1.equipDjinn)(collectResult.value, 'flint');
            starterTeam = equipResult.ok ? equipResult.value : collectResult.value;
        }
        setTeam(starterTeam);
    };
    const handleSelectOption = (optionId) => {
        if (optionId === 'new-game') {
            createStarterTeamWithFlint();
            setMode('overworld');
            startTransition('overworld'); // Start new game -> go to overworld
        }
        else if (optionId === 'continue') {
            if (hasSaveFile) {
                // Open save menu modal to let user choose which slot to load
                openModal('save');
            }
        }
        else if (optionId === 'shop') {
            openShopFromMainMenu();
            startTransition('shop');
        }
        else if (optionId === 'compendium') {
            openCompendiumFlow();
            openCompendium();
        }
        else if (optionId === 'settings') {
            openModal('settings');
        }
        else if (optionId === 'how-to-play') {
            openModal('help');
        }
        else if (optionId === 'battle-tower') {
            // Initialize team if none exists (for Battle Tower quick access)
            const store = store_1.useStore.getState();
            if (!store.team || store.team.units.length === 0) {
                createStarterTeamWithFlint();
            }
            // Enter the actual tower system with proper progression
            openTowerFromMainMenu();
            startTransition('tower');
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { class: "main-menu", children: [(0, jsx_runtime_1.jsx)("div", { class: "main-menu-characters main-menu-characters--left", children: MENU_CHARACTERS.left.map((char, i) => ((0, jsx_runtime_1.jsx)("img", { src: char.sprite, alt: char.name, class: "main-menu-sprite", style: { animationDelay: `${i * 0.3}s` } }, char.name))) }), (0, jsx_runtime_1.jsxs)("div", { class: "main-menu-content gs-window", children: [(0, jsx_runtime_1.jsx)("h1", { class: "gs-title", children: "Vale Chronicles" }), (0, jsx_runtime_1.jsx)("div", { class: "main-menu-options", children: menuOptions.map((option) => {
                            const isEnabled = option.enabled;
                            const enabledIndex = enabledOptions.findIndex(opt => opt.id === option.id);
                            const isSelected = enabledIndex === safeSelectedIndex && isEnabled;
                            return ((0, jsx_runtime_1.jsx)("button", { class: `gs-button ${isSelected ? 'selected' : ''} ${!isEnabled ? 'disabled' : ''}`, onClick: () => isEnabled && handleSelectOption(option.id), disabled: !isEnabled, children: option.label }, option.id));
                        }) })] }), (0, jsx_runtime_1.jsx)("div", { class: "main-menu-characters main-menu-characters--right", children: MENU_CHARACTERS.right.map((char, i) => ((0, jsx_runtime_1.jsx)("img", { src: char.sprite, alt: char.name, class: "main-menu-sprite", style: { animationDelay: `${i * 0.3}s` } }, char.name))) })] }));
}
