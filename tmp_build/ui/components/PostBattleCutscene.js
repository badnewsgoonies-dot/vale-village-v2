"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostBattleCutscene = PostBattleCutscene;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * PostBattleCutscene Component
 * Simplified version - shows generic victory/defeat message
 * Future: Add NPC-specific dialogue when NPC system exists
 */
const hooks_1 = require("preact/hooks");
require("./PostBattleCutscene.css");
function PostBattleCutscene({ victory, onComplete }) {
    const [currentMessageIndex, setCurrentMessageIndex] = (0, hooks_1.useState)(0);
    // Generic messages (no NPC system yet)
    const messages = victory
        ? [
            'You are victorious!',
            'The enemies have been defeated!',
            'Your skills have improved from this battle.',
        ]
        : [
            'Your party has been defeated...',
            'You must retreat and recover.',
        ];
    const currentMessage = messages[currentMessageIndex];
    const isLastMessage = currentMessageIndex === messages.length - 1;
    // Auto-advance after delay or wait for player input
    const handleAdvance = () => {
        if (isLastMessage) {
            onComplete();
        }
        else {
            setCurrentMessageIndex(prev => prev + 1);
        }
    };
    // Keyboard controls
    (0, hooks_1.useEffect)(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                handleAdvance();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentMessageIndex, isLastMessage, onComplete]);
    return ((0, jsx_runtime_1.jsx)("div", { className: `post-battle-cutscene ${victory ? 'victory' : 'defeat'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "cutscene-container", children: [(0, jsx_runtime_1.jsx)("div", { className: "cutscene-background", children: victory && ((0, jsx_runtime_1.jsx)("div", { className: "victory-particles" })) }), (0, jsx_runtime_1.jsxs)("div", { className: "cutscene-message-box", children: [(0, jsx_runtime_1.jsx)("div", { className: "cutscene-header", children: (0, jsx_runtime_1.jsx)("h2", { children: victory ? 'VICTORY' : 'DEFEAT' }) }), (0, jsx_runtime_1.jsx)("div", { className: "cutscene-content", children: (0, jsx_runtime_1.jsx)("p", { className: "cutscene-text", children: currentMessage }) }), (0, jsx_runtime_1.jsxs)("div", { className: "cutscene-footer", children: [(0, jsx_runtime_1.jsx)("div", { className: "progress-indicator", children: messages.map((_, index) => ((0, jsx_runtime_1.jsx)("span", { className: `progress-dot ${index === currentMessageIndex ? 'active' : ''} ${index < currentMessageIndex ? 'completed' : ''}` }, index))) }), (0, jsx_runtime_1.jsx)("button", { onClick: handleAdvance, className: "cutscene-button", "aria-label": isLastMessage ? 'Continue to rewards' : 'Next message', children: isLastMessage ? (victory ? 'CLAIM REWARDS' : 'RETURN') : 'CONTINUE' })] }), (0, jsx_runtime_1.jsx)("div", { className: "cutscene-hint", children: "Tap or press [ENTER] to continue" })] })] }) }));
}
