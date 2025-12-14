import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { useStore } from '../state/store';
import { getAvailableChoices, getCurrentNode } from '@/core/services/DialogueService';
import type { DialogueNode } from '@/core/models/dialogue';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { getPortraitSprite } from '../sprites/mappings';
import { warnIfPlaceholderSprite } from '../sprites/utils/warnIfPlaceholderSprite';
import './DialogueChatOverlay.css';

function isPlayerSpeaker(speaker: string | undefined): boolean {
  return (speaker ?? '').toLowerCase() === 'isaac';
}

export function DialogueChatOverlay() {
  const {
    currentDialogueTree,
    currentDialogueState,
    makeChoice,
    advanceCurrentDialogue,
    endDialogue,
    story,
    gold,
    equipment,
    team,
  } = useStore((state) => ({
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

  const nodeById = useMemo(() => {
    const map = new Map<string, DialogueNode>();
    for (const node of currentDialogueTree?.nodes ?? []) {
      map.set(node.id, node);
    }
    return map;
  }, [currentDialogueTree]);

  const historyNodes = useMemo(() => {
    if (!currentDialogueTree || !currentDialogueState) return [];
    const nodes: DialogueNode[] = [];
    for (const nodeId of currentDialogueState.history) {
      const node = nodeById.get(nodeId);
      if (node) nodes.push(node);
    }
    return nodes;
  }, [currentDialogueTree, currentDialogueState, nodeById]);

  const currentNode =
    currentDialogueTree && currentDialogueState
      ? getCurrentNode(currentDialogueTree, currentDialogueState) ?? null
      : null;

  const availableChoices = currentNode
    ? getAvailableChoices(currentNode, {
        flags: (story.flags || {}) as Record<string, boolean>,
        inventory: {
          items: equipment.map((item) => item.id),
        },
        gold,
        level: team?.units?.[0]?.level || 1,
      })
    : [];
  const hasChoices = availableChoices.length > 0;

  // Typewriter effect state (applies only to current node)
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typewriterInterval = useRef<number | null>(null);
  const currentNodeIdRef = useRef<string | null>(null);

  useEffect(() => {
    const nodeId = currentDialogueState?.currentNodeId ?? null;
    const text = currentNode?.text ?? '';
    if (!nodeId || !text) {
      currentNodeIdRef.current = nodeId;
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    if (currentNodeIdRef.current === nodeId) return;
    currentNodeIdRef.current = nodeId;

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
  }, [currentDialogueState?.currentNodeId, currentNode?.text]);

  const skipTypewriter = () => {
    if (!isTyping || !currentNode?.text) return;
    if (typewriterInterval.current !== null) {
      window.clearInterval(typewriterInterval.current);
      typewriterInterval.current = null;
    }
    setDisplayedText(currentNode.text);
    setIsTyping(false);
  };

  const handleAdvance = () => {
    if (isTyping) {
      skipTypewriter();
      return;
    }
    advanceCurrentDialogue();
  };

  // Keep the chat scrolled to the latest message.
  const historyRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const container = historyRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [currentDialogueState?.currentNodeId, displayedText]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!currentDialogueTree || !currentDialogueState) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        endDialogue();
        return;
      }

      // Space or Enter: skip typewriter if typing, otherwise advance (only if no choices).
      if (!hasChoices && (event.key === ' ' || event.key === 'Enter' || event.code === 'Space' || event.code === 'Enter')) {
        event.preventDefault();
        event.stopPropagation();
        handleAdvance();
        return;
      }

      // Number keys for choices.
      const num = Number.parseInt(event.key, 10);
      if (!Number.isNaN(num) && num >= 1 && num <= availableChoices.length) {
        event.preventDefault();
        event.stopPropagation();
        const selected = availableChoices[num - 1];
        if (selected) makeChoice(selected.id);
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
    advanceCurrentDialogue,
    endDialogue,
    isTyping,
  ]);

  if (!currentDialogueTree || !currentDialogueState || !currentNode) {
    return null;
  }

  const pastNodes = historyNodes.slice(0, Math.max(0, historyNodes.length - 1));

  const content = (
    <div
      class="dialogue-chat-overlay"
      onClick={() => {
        if (!hasChoices) handleAdvance();
      }}
    >
      <div class="dialogue-chat-panel" onClick={(e) => e.stopPropagation()}>
        <div class="dialogue-chat-header">
          <div class="dialogue-chat-title">{currentDialogueTree.name}</div>
          <button
            type="button"
            class="dialogue-chat-close"
            onClick={() => endDialogue()}
            aria-label="Close dialogue"
            title="Close (Esc)"
          >
            ×
          </button>
        </div>

        <div class="dialogue-chat-history" ref={historyRef}>
          {pastNodes.map((node) => (
            <ChatMessage key={node.id} node={node} text={node.text} />
          ))}
          <ChatMessage key={currentNode.id} node={currentNode} text={displayedText} isTyping={isTyping} />
        </div>

        <div class="dialogue-chat-footer">
          {hasChoices ? (
            <div class="dialogue-chat-choices">
              {availableChoices.map((choice, idx) => (
                <button
                  key={choice.id}
                  type="button"
                  class="dialogue-chat-choice"
                  onClick={() => makeChoice(choice.id)}
                >
                  <span class="dialogue-chat-choice-index">{idx + 1}</span>
                  <span class="dialogue-chat-choice-text">{choice.text}</span>
                </button>
              ))}
            </div>
          ) : (
            <div class={`dialogue-chat-hint ${isTyping ? 'is-typing' : ''}`}>
              <button
                type="button"
                class="dialogue-chat-next"
                onClick={() => handleAdvance()}
              >
                {isTyping ? 'Skip' : 'Next'}
              </button>
              <span class="dialogue-chat-hotkey">{isTyping ? 'Space/Enter: Skip' : 'Space/Enter: Next'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  return createPortal(content, document.body);
}

function ChatMessage({
  node,
  text,
  isTyping = false,
}: {
  node: DialogueNode;
  text: string;
  isTyping?: boolean;
}) {
  const speaker = node.speaker ?? '...';
  const portraitId = getPortraitSprite(speaker);
  warnIfPlaceholderSprite('DialogueChatOverlay', portraitId);
  const isPlayer = isPlayerSpeaker(node.speaker);

  return (
    <div class={`dialogue-chat-message ${isPlayer ? 'is-player' : 'is-npc'}`}>
      <div class="dialogue-chat-avatar">
        <SimpleSprite id={portraitId} width={42} height={42} style={{ borderRadius: '50%', imageRendering: 'pixelated' }} />
      </div>
      <div class="dialogue-chat-bubble">
        <div class="dialogue-chat-speaker">{speaker}</div>
        <div class="dialogue-chat-text">
          {text}
          {isTyping && <span class="dialogue-chat-cursor" aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
}

