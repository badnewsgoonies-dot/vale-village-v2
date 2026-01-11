"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogueChatOverlay = DialogueChatOverlay;
const jsx_runtime_1 = require("preact/jsx-runtime");
// @ts-nocheck
const hooks_1 = require("preact/hooks");
const compat_1 = require("preact/compat");
const store_1 = require("../state/store");
const DialogueService_1 = require("@/core/services/DialogueService");
const SimpleSprite_1 = require("../sprites/SimpleSprite");
const mappings_1 = require("../sprites/mappings");
require("./DialogueChatOverlay.css");
function isPlayerSpeaker(speaker) {
    const normalized = (speaker ?? '').toLowerCase().trim();
    return normalized === 'isaac' || normalized === 'adept';
}
function DialogueChatOverlay() {
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
    const nodeById = (0, hooks_1.useMemo)(() => {
        const map = new Map();
        for (const node of currentDialogueTree?.nodes ?? []) {
            map.set(node.id, node);
        }
        return map;
    }, [currentDialogueTree]);
    const transcriptHistory = (0, hooks_1.useMemo)(() => {
        if (!currentDialogueTree || !currentDialogueState)
            return [];
        const history = currentDialogueState.history;
        if (history.length <= 1)
            return [];
        const playerSpeaker = team?.units?.[0]?.name || 'Isaac';
        const messages = [];
        for (let index = 0; index + 1 < history.length; index++) {
            const nodeId = history[index];
            const nextNodeId = history[index + 1];
            if (nodeId === undefined || nextNodeId === undefined)
                continue;
            const node = nodeById.get(nodeId);
            if (!node)
                continue;
            messages.push({
                id: `node:${nodeId}`,
                speaker: node.speaker ?? '...',
                text: node.text ?? '',
                isPlayer: isPlayerSpeaker(node.speaker),
            });
            const chosenChoice = node.choices?.find((choice) => choice.nextNodeId === nextNodeId);
            if (chosenChoice) {
                messages.push({
                    id: `choice:${nodeId}:${chosenChoice.id}`,
                    speaker: playerSpeaker,
                    text: chosenChoice.text,
                    isPlayer: true,
                });
            }
        }
        return messages;
    }, [currentDialogueTree, currentDialogueState, nodeById, team?.units]);
    const currentNode = currentDialogueTree && currentDialogueState
        ? (0, DialogueService_1.getCurrentNode)(currentDialogueTree, currentDialogueState) ?? null
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
    const currentNodeKeyRef = (0, hooks_1.useRef)(null);
    (0, hooks_1.useEffect)(() => {
        const treeId = currentDialogueState?.treeId ?? null;
        const nodeId = currentDialogueState?.currentNodeId ?? null;
        const text = currentNode?.text ?? '';
        const nodeKey = treeId && nodeId ? `${treeId}:${nodeId}` : null;
        if (!nodeId || !text) {
            currentNodeKeyRef.current = nodeKey;
            setDisplayedText('');
            setIsTyping(false);
            return;
        }
        if (currentNodeKeyRef.current === nodeKey)
            return;
        currentNodeKeyRef.current = nodeKey;
        setDisplayedText('');
        setIsTyping(true);
        if (typewriterInterval.current !== null) {
            window.clearInterval(typewriterInterval.current);
            typewriterInterval.current = null;
        }
        let index = 0;
        const speedMs = 22;
        typewriterInterval.current = window.setInterval(() => {
            index = Math.min(text.length, index + 1);
            setDisplayedText(text.slice(0, index));
            if (index >= text.length) {
                setIsTyping(false);
                if (typewriterInterval.current !== null) {
                    window.clearInterval(typewriterInterval.current);
                    typewriterInterval.current = null;
                }
            }
        }, speedMs);
        return () => {
            if (typewriterInterval.current !== null) {
                window.clearInterval(typewriterInterval.current);
                typewriterInterval.current = null;
            }
        };
    }, [currentDialogueState?.treeId, currentDialogueState?.currentNodeId, currentNode?.text]);
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
    const historyRef = (0, hooks_1.useRef)(null);
    (0, hooks_1.useEffect)(() => {
        const container = historyRef.current;
        if (!container)
            return;
        container.scrollTop = container.scrollHeight;
    }, [currentDialogueState?.currentNodeId, displayedText]);
    (0, hooks_1.useEffect)(() => {
        const handleKeyPress = (event) => {
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
            const num = Number.parseInt(event.key, 10);
            if (!Number.isNaN(num) && num >= 1 && num <= availableChoices.length) {
                if (event.repeat)
                    return;
                event.preventDefault();
                event.stopPropagation();
                if (isTyping) {
                    skipTypewriter();
                    return;
                }
                const selected = availableChoices[num - 1];
                if (selected)
                    makeChoice(selected.id);
            }
        };
        window.addEventListener('keydown', handleKeyPress, true);
        return () => window.removeEventListener('keydown', handleKeyPress, true);
    }, [
        currentDialogueTree,
        currentDialogueState,
        availableChoices,
        hasChoices,
        makeChoice,
        endDialogue,
        isTyping,
        handleAdvance,
        skipTypewriter,
    ]);
    if (!currentDialogueTree || !currentDialogueState || !currentNode) {
        return null;
    }
    const currentSpeaker = currentNode.speaker ?? '...';
    const content = ((0, jsx_runtime_1.jsx)("div", { class: "dialogue-chat-overlay", onClick: () => {
            if (!hasChoices)
                handleAdvance();
        }, style: { background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }, children: (0, jsx_runtime_1.jsxs)("div", { class: "dialogue-chat-panel gs-window", onClick: (e) => e.stopPropagation(), style: { minWidth: 500, maxWidth: 800 }, children: [(0, jsx_runtime_1.jsxs)("div", { class: "dialogue-chat-header", style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,216,127,0.2)', paddingBottom: '0.5rem', marginBottom: '1rem' }, children: [(0, jsx_runtime_1.jsx)("div", { class: "gs-label", children: currentDialogueTree.name }), (0, jsx_runtime_1.jsx)("button", { type: "button", class: "gs-button", onClick: () => endDialogue(), style: { padding: '2px 8px', fontSize: '0.8rem' }, children: "\u00D7" })] }), (0, jsx_runtime_1.jsxs)("div", { class: "dialogue-chat-history no-scrollbar", ref: historyRef, style: { maxHeight: '40vh', overflowY: 'auto' }, children: [transcriptHistory.map((message) => ((0, jsx_runtime_1.jsx)(ChatMessage, { speaker: message.speaker, text: message.text, isPlayer: message.isPlayer }, message.id))), (0, jsx_runtime_1.jsx)(ChatMessage, { speaker: currentSpeaker, text: displayedText, isPlayer: isPlayerSpeaker(currentNode.speaker), isTyping: isTyping }, `node:${currentNode.id}`)] }), (0, jsx_runtime_1.jsx)("div", { class: "dialogue-chat-footer", style: { marginTop: '1rem', borderTop: '1px solid rgba(255,216,127,0.1)', paddingTop: '1rem' }, children: hasChoices ? ((0, jsx_runtime_1.jsx)("div", { class: "dialogue-chat-choices", style: { display: 'flex', flexDirection: 'column', gap: '0.5rem' }, children: availableChoices.map((choice, idx) => ((0, jsx_runtime_1.jsxs)("button", { type: "button", class: "gs-button", onClick: () => makeChoice(choice.id), disabled: isTyping, children: [(0, jsx_runtime_1.jsx)("span", { class: "gs-label", style: { marginRight: '1rem' }, children: idx + 1 }), (0, jsx_runtime_1.jsx)("span", { class: "gs-value", children: choice.text })] }, choice.id))) })) : ((0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', justifyContent: 'flex-end' }, children: (0, jsx_runtime_1.jsx)("button", { type: "button", class: "gs-button", onClick: () => handleAdvance(), style: { padding: '4px 16px' }, children: (0, jsx_runtime_1.jsx)("span", { class: "gs-value", children: isTyping ? 'Skip' : 'Next' }) }) })) })] }) }));
    if (typeof document === 'undefined' || !document.body) {
        return null;
    }
    return (0, compat_1.createPortal)(content, document.body);
}
function ChatMessage({ text, isTyping = false, speaker, isPlayer, }) {
    const portraitId = (0, mappings_1.getPortraitSprite)(speaker);
    return ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start', opacity: isTyping ? 1 : 0.8 }, children: [(0, jsx_runtime_1.jsx)("div", { style: { flexShrink: 0, width: 48, height: 48, background: 'rgba(0,0,0,0.3)', borderRadius: '4px', border: '1px solid rgba(255,216,127,0.2)', overflow: 'hidden' }, children: (0, jsx_runtime_1.jsx)(SimpleSprite_1.SimpleSprite, { id: portraitId, width: 48, height: 48 }) }), (0, jsx_runtime_1.jsxs)("div", { style: { flex: 1 }, children: [(0, jsx_runtime_1.jsx)("div", { class: "gs-label", style: { fontSize: '0.75rem', marginBottom: '0.25rem' }, children: speaker }), (0, jsx_runtime_1.jsxs)("div", { class: "gs-value", style: { fontSize: '1rem', lineHeight: '1.4' }, children: [text, isTyping && (0, jsx_runtime_1.jsx)("span", { style: { display: 'inline-block', width: 8, height: 16, background: '#FFD87F', marginLeft: 4, animation: 'pulse 0.5s infinite' } })] })] })] }));
}
