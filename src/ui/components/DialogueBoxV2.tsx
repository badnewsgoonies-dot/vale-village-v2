import { useEffect, useState, useRef } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { useStore } from '../state/store';
import { getCurrentNode, getAvailableChoices } from '@/core/services/DialogueService';
import { SimpleSprite } from '../sprites/SimpleSprite';
import { getPortraitSprite } from '../sprites/mappings';
import { warnIfPlaceholderSprite } from '../sprites/utils/warnIfPlaceholderSprite';
import './DialogueBoxV2.css';

export function DialogueBoxV2() {
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

  const currentNode =
    currentDialogueTree && currentDialogueState
      ? getCurrentNode(currentDialogueTree, currentDialogueState)
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
  const typewriterInterval = useRef<NodeJS.Timeout | null>(null);
  const currentTextRef = useRef('');

  // Typewriter effect
  useEffect(() => {
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
      if (typewriterInterval.current) {
        clearInterval(typewriterInterval.current);
      }

      let index = 0;
      const typewriterSpeed = 50; // milliseconds per character

      typewriterInterval.current = setInterval(() => {
        if (index < currentNode.text.length) {
          setDisplayedText(currentNode.text.substring(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          if (typewriterInterval.current) {
            clearInterval(typewriterInterval.current);
            typewriterInterval.current = null;
          }
        }
      }, typewriterSpeed);
    }

    return () => {
      if (typewriterInterval.current) {
        clearInterval(typewriterInterval.current);
        typewriterInterval.current = null;
      }
    };
  }, [currentNode?.text]);

  const skipTypewriter = () => {
    if (isTyping && currentNode?.text) {
      if (typewriterInterval.current) {
        clearInterval(typewriterInterval.current);
        typewriterInterval.current = null;
      }
      setDisplayedText(currentNode.text);
      setIsTyping(false);
    }
  };

  const handleAdvance = () => {
    if (isTyping) {
      skipTypewriter();
    } else {
      advanceCurrentDialogue();
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle if dialogue is active
      if (!currentDialogueTree || !currentDialogueState) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        endDialogue();
        return;
      }

      // Space or Enter: skip typewriter if typing, otherwise advance
      if (!hasChoices && (event.key === ' ' || event.key === 'Enter' || event.code === 'Space' || event.code === 'Enter')) {
        event.preventDefault();
        event.stopPropagation();

        handleAdvance();
        return;
      }

      // Number keys for choices
      const num = parseInt(event.key, 10);
      if (!Number.isNaN(num) && num >= 1 && num <= availableChoices.length) {
        event.preventDefault();
        event.stopPropagation();
        const selected = availableChoices[num - 1];
        if (selected) {
          makeChoice(selected.id);
        }
      }
    };

    // Use capture phase to get events before other handlers
    window.addEventListener('keydown', handleKeyPress, true);
    return () => window.removeEventListener('keydown', handleKeyPress, true);
  }, [currentDialogueTree, currentDialogueState, availableChoices, hasChoices, advanceCurrentDialogue, makeChoice, endDialogue, isTyping, handleAdvance]);

  if (!currentDialogueTree || !currentDialogueState) {
    return null;
  }

  if (!currentNode) {
    return null;
  }

  const handleClick = (e: MouseEvent) => {
    // Don't advance if clicking on buttons or choices
    if (hasChoices || (e.target as HTMLElement).closest('.dialogue-choice-v2')) {
      return;
    }

    handleAdvance();
  };

  const dialogueContent = (
    <div
      class="dialogue-overlay-v2"
      onClick={handleClick}
      style={{
        cursor: hasChoices ? 'default' : 'pointer',
      }}
    >
      <div class="dialogue-box-v2">
        <div class="dialogue-panel-v2">
          {/* Corner ornaments */}
          <div class="corner-ornament-v2 top-left"></div>
          <div class="corner-ornament-v2 top-right"></div>
          <div class="corner-ornament-v2 bottom-left"></div>
          <div class="corner-ornament-v2 bottom-right"></div>

          {/* Portrait section */}
          {currentNode.speaker && (
            <div class="portrait-section-v2">
              <div class="speaker-name-v2">{currentNode.speaker}</div>
              <div class="portrait-frame-v2">
                <div class="portrait-inner-v2">
                  {(() => {
                    const portraitId = getPortraitSprite(currentNode.speaker);
                    warnIfPlaceholderSprite('DialogueBoxV2', portraitId);
                    return (
                      <SimpleSprite
                        id={portraitId}
                        width={84}
                        height={84}
                        style={{ borderRadius: '50%', imageRendering: 'pixelated' }}
                      />
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Text content area */}
          <div class="dialogue-content-v2">
            <div class="dialogue-text-v2">
              {displayedText}
              {isTyping && <span class="cursor-v2"></span>}
            </div>

            {/* Choices */}
            {hasChoices && (
              <div class="dialogue-choices-v2">
                {availableChoices.map((choice, idx) => {
                  // Cycle through element colors: mercury, venus, mars, jupiter
                  const elements = ['mercury', 'venus', 'mars', 'jupiter'];
                  const elementClass = elements[idx % elements.length];
                  return (
                    <button
                      key={choice.id}
                      class={`choice-button-v2 ${elementClass}`}
                      data-number={idx + 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        makeChoice(choice.id);
                      }}
                    >
                      {choice.text}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Continue indicator with explicit next button */}
          {!hasChoices && (
            <div class={`continue-indicator-v2 ${isTyping ? 'is-typing' : ''}`}>
              <button
                type="button"
                class="dialogue-next-button-v2"
                onClick={(event) => {
                  event.stopPropagation();
                  handleAdvance();
                }}
              >
                <span class="next-label-v2">{isTyping ? 'Skip' : 'Next'}</span>
                <span class="next-icon-v2" aria-hidden="true">▶</span>
              </button>
              <span class="dialogue-hotkey-v2">PRESS SPACE</span>
              {!isTyping && <div class="arrow-sprite-v2"></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Use Preact portal to render at document.body level
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  return createPortal(dialogueContent, document.body);
}
