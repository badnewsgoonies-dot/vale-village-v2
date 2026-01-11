"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleScreen = TitleScreen;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * Title Screen Component
 * Entry screen showing game title with animated character sprites
 */
const hooks_1 = require("preact/hooks");
const gameStore_1 = require("../../store/gameStore");
const store_1 = require("../state/store");
require("./TitleScreen.css");
// Character sprites for the title screen parade
const TITLE_CHARACTERS = [
    { name: 'Isaac', sprite: '/sprites/overworld/protagonists/Isaac_Walk.gif', delay: 0 },
    { name: 'Garet', sprite: '/sprites/overworld/protagonists/Garet_Right.gif', delay: 0.8 },
    { name: 'Ivan', sprite: '/sprites/overworld/protagonists/Ivan_Right.gif', delay: 1.6 },
    { name: 'Mia', sprite: '/sprites/overworld/protagonists/Mia_Right.gif', delay: 2.4 },
];
function TitleScreen() {
    const startTransition = (0, gameStore_1.useGameStore)((s) => s.startTransition);
    const setMode = (0, store_1.useStore)((s) => s.setMode);
    (0, hooks_1.useEffect)(() => {
        setMode('title-screen');
    }, [setMode]);
    (0, hooks_1.useEffect)(() => {
        const handleKeyPress = (event) => {
            // Any key press advances to main menu
            event.preventDefault();
            event.stopPropagation();
            startTransition('menu');
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [startTransition]);
    const handleInteraction = (e) => {
        e.preventDefault();
        startTransition('menu');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { class: "title-screen", onClick: handleInteraction, onTouchStart: handleInteraction, children: [(0, jsx_runtime_1.jsxs)("div", { class: "title-screen-content", children: [(0, jsx_runtime_1.jsx)("h1", { class: "title-screen-logo", children: "Vale Chronicles" }), (0, jsx_runtime_1.jsx)("p", { class: "title-screen-subtitle", children: "Tap to continue" })] }), (0, jsx_runtime_1.jsx)("div", { class: "title-screen-parade", children: TITLE_CHARACTERS.map((char) => ((0, jsx_runtime_1.jsx)("div", { class: "title-screen-character", style: { animationDelay: `${char.delay}s` }, children: (0, jsx_runtime_1.jsx)("img", { src: char.sprite, alt: char.name, class: "title-screen-sprite" }) }, char.name))) })] }));
}
