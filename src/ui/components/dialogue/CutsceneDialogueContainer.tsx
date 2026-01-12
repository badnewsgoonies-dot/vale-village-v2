import { JSX } from 'preact';
import { useMemo, useCallback } from 'preact/hooks';
import { useStore } from '../../state/store';
import { DialogueBoxV3 } from './DialogueBoxV3';
import { getBackgroundPath } from '../../sprites/backgrounds';
import './CutsceneDialogueContainer.css';

export function CutsceneDialogueContainer(): JSX.Element | null {
  const { 
    currentDialogueTree, 
    currentDialogueState, 
    advanceCurrentDialogue,
    makeChoice,
    mode 
  } = useStore((s) => ({
    currentDialogueTree: s.currentDialogueTree,
    currentDialogueState: s.currentDialogueState,
    advanceCurrentDialogue: s.advanceCurrentDialogue,
    makeChoice: s.makeChoice,
    mode: s.mode
  }));

  const currentNode = useMemo(() => {
    if (!currentDialogueTree || !currentDialogueState) return null;
    return currentDialogueTree.nodes.find(n => n.id === currentDialogueState.currentNodeId) || null;
  }, [currentDialogueTree, currentDialogueState]);

  const handleBoxComplete = useCallback(() => {
    // Optional: add a slight delay or wait for user input
  }, []);

  const handleNext = useCallback(() => {
    // Only advance if there are no choices
    if (currentNode && (!currentNode.choices || currentNode.choices.length === 0)) {
      advanceCurrentDialogue();
    }
  }, [currentNode, advanceCurrentDialogue]);

  if (mode !== 'dialogue' || !currentDialogueTree || !currentDialogueState || !currentNode) {
    return null;
  }

  const hasChoices = currentNode.choices && currentNode.choices.length > 0;
  
  // Resolve background
  const bgUrl = currentNode.backgroundId ? getBackgroundPath(currentNode.backgroundId) : null;

  const getPortraitPath = (portrait: string) => {
    // If it looks like a full path, use it
    if (portrait.startsWith('/') || portrait.startsWith('http')) return portrait;
    // Otherwise try to find it in overworld sprites
    return `/sprites/overworld/protagonists/${portrait}.gif`;
  };

  return (
    <div className="cutscene-container" onClick={handleNext}>
      {bgUrl && (
        <div 
          className="cutscene-background" 
          style={{ backgroundImage: `url(${bgUrl})` }} 
        />
      )}

      <div className="cutscene-portraits">
        <div className={`portrait-wrapper side-left ${currentNode.portraitSide === 'left' ? 'active' : ''}`}>
          {currentNode.portrait && currentNode.portraitSide === 'left' && (
            <img 
              src={getPortraitPath(currentNode.portrait)} 
              className="portrait-img" 
              alt={currentNode.speaker}
              onError={(e) => { (e.target as HTMLImageElement).src = '/sprites/overworld/protagonists/Isaac.gif'; }}
            />
          )}
        </div>
        
        <div className={`portrait-wrapper side-right ${currentNode.portraitSide === 'right' ? 'active' : ''}`}>
          {currentNode.portrait && currentNode.portraitSide === 'right' && (
            <img 
              src={getPortraitPath(currentNode.portrait)} 
              className="portrait-img" 
              alt={currentNode.speaker}
              onError={(e) => { (e.target as HTMLImageElement).src = '/sprites/overworld/protagonists/Garet.gif'; }}
            />
          )}
        </div>
      </div>

      <div className="cutscene-ui">
        <DialogueBoxV3
          isOpen={true}
          text={currentNode.text}
          speaker={currentNode.speaker}
          onComplete={handleBoxComplete}
        />

        {hasChoices && (
          <div className="choice-overlay" onClick={(e) => e.stopPropagation()}>
            {currentNode.choices!.map(choice => (
              <button 
                key={choice.id}
                className="choice-button"
                onClick={() => makeChoice(choice.id)}
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
