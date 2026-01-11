"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogueBoxV2 = DialogueBoxV2;
const jsx_runtime_1 = require("preact/jsx-runtime");
// @ts-nocheck
const hooks_1 = require("preact/hooks");
const compat_1 = require("preact/compat");
const store_1 = require("../state/store");
const DialogueService_1 = require("@/core/services/DialogueService");
const SimpleSprite_1 = require("../sprites/SimpleSprite");
const mappings_1 = require("../sprites/mappings");
const warnIfPlaceholderSprite_1 = require("../sprites/utils/warnIfPlaceholderSprite");
require("./DialogueBoxV2.css");
function DialogueBoxV2() {
    const { currentDialogueTree, currentDialogueState, makeChoice, advanceCurrentDialogue, endDialogue, story, gold, equipment, team, } = (0, store_1.useStore)((state) => ({
        currentDialogueTree: state.currentDialogueTree,
        currentDialogueState: state.currentDialogueState,
        makeChoice: state.makeChoice,
        advanceCurrentDialogue: state.advanceCurrentDialogue,
        endDialogue: state.endDialogue,
        story: state.story,
        gold: state.gold,
        equipment: state.equipment,
        team: state.team,
    }));
    const currentNode = currentDialogueTree && currentDialogueState
        ? (0, DialogueService_1.getCurrentNode)(currentDialogueTree, currentDialogueState)
        : null;
    const availableChoices = currentNode
        ? (0, DialogueService_1.getAvailableChoices)(currentNode, {
            flags: (story.flags || {}),
            inventory: {
                items: equipment.map((item) => item.id),
            },
            gold,
            level: team?.units?.[0]?.level || 1,
        })
        : [];
    const hasChoices = availableChoices.length > 0;
    // Typewriter effect state
    const [displayedText, setDisplayedText] = (0, hooks_1.useState)('');
    const [isTyping, setIsTyping] = (0, hooks_1.useState)(false);
    const typewriterInterval = (0, hooks_1.useRef)(null);
    const currentTextRef = (0, hooks_1.useRef)('');
    // Typewriter effect
    (0, hooks_1.useEffect)(() => {
        if (!currentNode?.text) {
            setDisplayedText('');
            setIsTyping(false);
            return;
        }
        // Check if text has changed
        if (currentTextRef.current !== currentNode.text) {
            currentTextRef.current = currentNode.text;
            setDisplayedText('');
            setIsTyping(true);
            // Clear any existing interval
            if (typewriterInterval.current !== null) {
                window.clearInterval(typewriterInterval.current);
                typewriterInterval.current = null;
            }
            let index = 0;
            const typewriterSpeed = 50; // milliseconds per character
            typewriterInterval.current = window.setInterval(() => {
                if (index < currentNode.text.length) {
                    setDisplayedText(currentNode.text.substring(0, index + 1));
                    index++;
                }
                else {
                    setIsTyping(false);
                    if (typewriterInterval.current !== null) {
                        window.clearInterval(typewriterInterval.current);
                        typewriterInterval.current = null;
                    }
                }
            }, typewriterSpeed);
        }
        return () => {
            if (typewriterInterval.current !== null) {
                window.clearInterval(typewriterInterval.current);
                typewriterInterval.current = null;
            }
        };
    }, [currentNode?.text]);
    const skipTypewriter = (0, hooks_1.useCallback)(() => {
        if (!isTyping || !currentNode?.text)
            return;
        if (typewriterInterval.current !== null) {
            window.clearInterval(typewriterInterval.current);
            typewriterInterval.current = null;
        }
        setDisplayedText(currentNode.text);
        setIsTyping(false);
    }, [currentNode?.text, isTyping]);
    const handleAdvance = (0, hooks_1.useCallback)(() => {
        if (isTyping) {
            skipTypewriter();
            return;
        }
        advanceCurrentDialogue();
    }, [advanceCurrentDialogue, isTyping, skipTypewriter]);
    (0, hooks_1.useEffect)(() => {
        const handleKeyPress = (event) => {
            // Only handle if dialogue is active
            if (!currentDialogueTree || !currentDialogueState)
                return;
            if (event.key === 'Escape') {
                if (event.repeat)
                    return;
                event.preventDefault();
                event.stopPropagation();
                endDialogue();
                return;
            }
            const isSpaceOrEnter = event.key === ' ' || event.key === 'Enter' || event.code === 'Space' || event.code === 'Enter';
            // Space/Enter: skip typewriter if typing (even when choices exist); otherwise advance when no choices.
            if (isSpaceOrEnter) {
                if (event.repeat)
                    return;
                event.preventDefault();
                event.stopPropagation();
                if (isTyping) {
                    skipTypewriter();
                }
                else if (!hasChoices) {
                    handleAdvance();
                }
                return;
            }
            // Number keys for choices
            const num = parseInt(event.key, 10);
            if (!Number.isNaN(num) && num >= 1 && num <= availableChoices.length) {
                if (event.repeat)
                    return;
                event.preventDefault();
                event.stopPropagation();
                const selected = availableChoices[num - 1];
                if (!selected)
                    return;
                if (isTyping) {
                    skipTypewriter();
                    return;
                }
                makeChoice(selected.id);
            }
        };
        // Use capture phase to get events before other handlers
        window.addEventListener('keydown', handleKeyPress, true);
        return () => window.removeEventListener('keydown', handleKeyPress, true);
    }, [currentDialogueTree, currentDialogueState, availableChoices, hasChoices, makeChoice, endDialogue, isTyping, handleAdvance, skipTypewriter]);
    if (!currentDialogueTree || !currentDialogueState) {
        return null;
    }
    if (!currentNode) {
        return null;
    }
    const handleClick = (e) => {
        // Don't advance if clicking on buttons or choices
        if (hasChoices || e.target.closest('.dialogue-choice-v2')) {
            return;
        }
        handleAdvance();
    };
    const handleTouchEnd = (e) => {
        // Prevent click event from also firing
        e.preventDefault();
        handleClick(e);
    };
    const dialogueContent = ((0, jsx_runtime_1.jsx)("div", { class: "dialogue-overlay-v2", onClick: handleClick, onTouchEnd: handleTouchEnd, style: {
            cursor: hasChoices ? 'default' : 'pointer',
        }, children: (0, jsx_runtime_1.jsx)("div", { class: "dialogue-box-v2", children: (0, jsx_runtime_1.jsxs)("div", { class: "dialogue-panel-v2", children: [(0, jsx_runtime_1.jsx)("div", { class: "corner-ornament-v2 top-left" }), (0, jsx_runtime_1.jsx)("div", { class: "corner-ornament-v2 top-right" }), (0, jsx_runtime_1.jsx)("div", { class: "corner-ornament-v2 bottom-left" }), (0, jsx_runtime_1.jsx)("div", { class: "corner-ornament-v2 bottom-right" }), currentNode.speaker && ((0, jsx_runtime_1.jsxs)("div", { class: "portrait-section-v2", children: [(0, jsx_runtime_1.jsx)("div", { class: "speaker-name-v2", children: currentNode.speaker }), (0, jsx_runtime_1.jsx)("div", { class: "portrait-frame-v2", children: (0, jsx_runtime_1.jsx)("div", { class: "portrait-inner-v2", children: (() => {
                                        const portraitId = (0, mappings_1.getPortraitSprite)(currentNode.speaker);
                                        (0, warnIfPlaceholderSprite_1.warnIfPlaceholderSprite)('DialogueBoxV2', portraitId);
                                        return ((0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: portraitId, width: 84, height: 84, style: { borderRadius: '50%', imageRendering: 'pixelated' } }));
                                    })() }) })] })), (0, jsx_runtime_1.jsxs)("div", { class: "dialogue-content-v2", children: [(0, jsx_runtime_1.jsxs)("div", { class: "dialogue-text-v2", children: [displayedText, isTyping && (0, jsx_runtime_1.jsx)("span", { class: "cursor-v2" })] }), hasChoices && ((0, jsx_runtime_1.jsx)("div", { class: "dialogue-choices-v2", children: availableChoices.map((choice, idx) => {
                                    // Cycle through element colors: mercury, venus, mars, jupiter
                                    const elements = ['mercury', 'venus', 'mars', 'jupiter'];
                                    const elementClass = elements[idx % elements.length];
                                    return ((0, jsx_runtime_1.jsx)("button", { class: `choice-button-v2 ${elementClass}`, "data-number": idx + 1, onClick: (e) => {
                                            e.stopPropagation();
                                            makeChoice(choice.id);
                                        }, children: choice.text }, choice.id));
                                }) }))] }), !hasChoices && ((0, jsx_runtime_1.jsxs)("div", { class: `continue-indicator-v2 ${isTyping ? 'is-typing' : ''}`, children: [(0, jsx_runtime_1.jsxs)("button", { type: "button", class: "dialogue-next-button-v2", onClick: (event) => {
                                    event.stopPropagation();
                                    handleAdvance();
                                }, children: [(0, jsx_runtime_1.jsx)("span", { class: "next-label-v2", children: isTyping ? 'Skip' : 'Next' }), (0, jsx_runtime_1.jsx)("span", { class: "next-icon-v2", "aria-hidden": "true", children: "\u25B6" })] }), (0, jsx_runtime_1.jsx)("span", { class: "dialogue-hotkey-v2", children: "TAP TO CONTINUE" }), !isTyping && (0, jsx_runtime_1.jsx)("div", { class: "arrow-sprite-v2" })] }))] }) }) }));
    // Use Preact portal to render at document.body level
    if (typeof document === 'undefined' || !document.body) {
        return null;
    }
    return (0, compat_1.createPortal)(dialogueContent, document.body);
}
