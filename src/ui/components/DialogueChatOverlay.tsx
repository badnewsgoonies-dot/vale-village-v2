// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { useStore } from '../state/store';
import { getAvailableChoices, getCurrentNode } from '@/core/services/DialogueService';
import type { DialogueNode } from '@/core/models/dialogue';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { getPortraitSprite } from '../sprites/mappings';
import { warnIfPlaceholderSprite } from '../sprites/utils/warnIfPlaceholderSprite';
import './DialogueChatOverlay.css';

function isPlayerSpeaker(speaker: string | undefined): boolean {
  const normalized = (speaker ?? '').toLowerCase().trim();
  return normalized === 'isaac' || normalized === 'adept';
}

type TranscriptMessage = {
  id: string;
  speaker: string;
  text: string;
  isPlayer: boolean;
};

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

  const transcriptHistory = useMemo<TranscriptMessage[]>(() => {
    if (!currentDialogueTree || !currentDialogueState) return [];
    const history = currentDialogueState.history;
    if (history.length <= 1) return [];

    const playerSpeaker = team?.units?.[0]?.name || 'Isaac';

    const messages: TranscriptMessage[] = [];
    for (let index = 0; index + 1 < history.length; index++) {
      const nodeId = history[index];
      const nextNodeId = history[index + 1];
      if (nodeId === undefined || nextNodeId === undefined) continue;

      const node = nodeById.get(nodeId);
      if (!node) continue;

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

  // Typewriter effect state
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typewriterInterval = useRef<number | null>(null);
  const currentNodeKeyRef = useRef<string | null>(null);

  useEffect(() => {
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

    if (currentNodeKeyRef.current === nodeKey) return;
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

  const skipTypewriter = useCallback(() => {
    if (!isTyping || !currentNode?.text) return;
    if (typewriterInterval.current !== null) {
      window.clearInterval(typewriterInterval.current);
      typewriterInterval.current = null;
    }
    setDisplayedText(currentNode.text);
    setIsTyping(false);
  }, [currentNode?.text, isTyping]);

  const handleAdvance = useCallback(() => {
    if (isTyping) {
      skipTypewriter();
      return;
    }
    advanceCurrentDialogue();
  }, [advanceCurrentDialogue, isTyping, skipTypewriter]);

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
        if (event.repeat) return;
        event.preventDefault();
        event.stopPropagation();
        endDialogue();
        return;
      }

      const isSpaceOrEnter = event.key === ' ' || event.key === 'Enter' || event.code === 'Space' || event.code === 'Enter';

      if (isSpaceOrEnter) {
        if (event.repeat) return;
        event.preventDefault();
        event.stopPropagation();
        if (isTyping) {
          skipTypewriter();
        } else if (!hasChoices) {
          handleAdvance();
        }
        return;
      }

      const num = Number.parseInt(event.key, 10);
      if (!Number.isNaN(num) && num >= 1 && num <= availableChoices.length) {
        if (event.repeat) return;
        event.preventDefault();
        event.stopPropagation();
        if (isTyping) {
          skipTypewriter();
          return;
        }
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
    endDialogue,
    isTyping,
    handleAdvance,
    skipTypewriter,
  ]);

  if (!currentDialogueTree || !currentDialogueState || !currentNode) {
    return null;
  }

  const currentSpeaker = currentNode.speaker ?? '...';

  const content = (
    <div
      class="dialogue-chat-overlay"
      onClick={() => {
        if (!hasChoices) handleAdvance();
      }}
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
    >
      <div class="dialogue-chat-panel gs-window gs-window--layered" onClick={(e) => e.stopPropagation()} style={{ minWidth: 500, maxWidth: 800 }}>
        <div class="dialogue-chat-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,216,127,0.2)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          <div class="gs-label">{currentDialogueTree.name}</div>
          <button
            type="button"
            class="gs-button"
            onClick={() => endDialogue()}
            style={{ padding: '2px 8px', fontSize: '0.8rem' }}
          >
            ×
          </button>
        </div>

        <div class="dialogue-chat-history no-scrollbar" ref={historyRef} style={{ maxHeight: '40vh', overflowY: 'auto' }}>
          {transcriptHistory.map((message) => (
            <ChatMessage
              key={message.id}
              speaker={message.speaker}
              text={message.text}
              isPlayer={message.isPlayer}
            />
          ))}
          <ChatMessage
            key={`node:${currentNode.id}`}
            speaker={currentSpeaker}
            text={displayedText}
            isPlayer={isPlayerSpeaker(currentNode.speaker)}
            isTyping={isTyping}
          />
        </div>

        <div class="dialogue-chat-footer" style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,216,127,0.1)', paddingTop: '1rem' }}>
          {hasChoices ? (
            <div class="dialogue-chat-choices" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {availableChoices.map((choice, idx) => (
                <button
                  key={choice.id}
                  type="button"
                  class="gs-button"
                  onClick={() => makeChoice(choice.id)}
                  disabled={isTyping}
                >
                  <span class="gs-label" style={{ marginRight: '1rem' }}>{idx + 1}</span>
                  <span class="gs-value">{choice.text}</span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                class="gs-button"
                onClick={() => handleAdvance()}
                style={{ padding: '4px 16px' }}
              >
                <span class="gs-value">{isTyping ? 'Skip' : 'Next'}</span>
              </button>
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
  text,
  isTyping = false,
  speaker,
  isPlayer,
}: {
  speaker: string;
  text: string;
  isPlayer: boolean;
  isTyping?: boolean;
}) {
  const portraitId = getPortraitSprite(speaker);

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start', opacity: isTyping ? 1 : 0.8 }}>
      <div style={{ flexShrink: 0, width: 48, height: 48, background: 'rgba(0,0,0,0.3)', borderRadius: '4px', border: '1px solid rgba(255,216,127,0.2)', overflow: 'hidden' }}>
        <SimpleSprite id={portraitId} width={48} height={48} />
      </div>
      <div style={{ flex: 1 }}>
        <div class="gs-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>{speaker}</div>
        <div class="gs-value" style={{ fontSize: '1rem', lineHeight: '1.4' }}>
          {text}
          {isTyping && <span style={{ display: 'inline-block', width: 8, height: 16, background: '#FFD87F', marginLeft: 4, animation: 'pulse 0.5s infinite' }} />}
        </div>
      </div>
    </div>
  );
}
