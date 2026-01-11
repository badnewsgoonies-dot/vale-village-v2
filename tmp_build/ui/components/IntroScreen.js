"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntroScreen = IntroScreen;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
const store_1 = require("../state/store");
require("./IntroScreen.css");
function IntroScreen() {
    const setMode = (0, store_1.useStore)((s) => s.setMode);
    const setStoryFlag = (0, store_1.useStore)((s) => s.setStoryFlag);
    (0, hooks_1.useEffect)(() => {
        // Mark intro as seen
        setStoryFlag('intro_seen', true);
        const handleKeyPress = (event) => {
            // Any key press advances to overworld
            event.preventDefault();
            event.stopPropagation();
            setMode('overworld');
        };
        const handleClick = () => {
            // Click anywhere also advances
            setMode('overworld');
        };
        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('click', handleClick);
        };
    }, [setMode, setStoryFlag]);
    return ((0, jsx_runtime_1.jsx)("div", { class: "intro-screen", onClick: () => setMode('overworld'), children: (0, jsx_runtime_1.jsxs)("div", { class: "intro-screen-content", children: [(0, jsx_runtime_1.jsx)("h1", { class: "intro-screen-title", children: "Welcome to Vale Chronicles" }), (0, jsx_runtime_1.jsx)("p", { class: "intro-screen-text", children: "The village of Vale has fallen under dark influence. Twenty houses have been corrupted, their inhabitants enslaved." }), (0, jsx_runtime_1.jsx)("p", { class: "intro-screen-text", children: "As Isaac, you must liberate each house and restore peace to the land." }), (0, jsx_runtime_1.jsx)("p", { class: "intro-screen-prompt", children: "Press any key to begin your journey" })] }) }));
}
