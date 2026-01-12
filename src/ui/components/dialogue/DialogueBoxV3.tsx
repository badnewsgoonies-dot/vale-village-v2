import { JSX } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import './DialogueBoxV3.css';

interface DialogueBoxV3Props {
  text: string;
  speaker?: string;
  onComplete?: () => void;
  typingSpeed?: number;
  isOpen: boolean;
}

export function DialogueBoxV3({
  text,
  speaker,
  onComplete,
  typingSpeed = 30,
  isOpen
}: DialogueBoxV3Props): JSX.Element {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const textIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset state when text changes
  useEffect(() => {
    if (isOpen) {
      setDisplayedText('');
      setIsTyping(true);
      setIsFinished(false);
      textIndexRef.current = 0;
      startTyping();
    } else {
      stopTyping();
    }
    
    return () => stopTyping();
  }, [text, isOpen]);

  const stopTyping = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsTyping(false);
  };

  const startTyping = () => {
    stopTyping();
    setIsTyping(true);
    tick();
  };

  const tick = () => {
    if (textIndexRef.current < text.length) {
      const nextChar = text[textIndexRef.current];
      setDisplayedText((prev) => prev + nextChar);
      textIndexRef.current++;
      
      // Variable speed or pauses could be handled here based on character
      let speed = typingSpeed;
      if (nextChar === '.' || nextChar === '!' || nextChar === '?') speed *= 10;
      if (nextChar === ',') speed *= 5;

      timerRef.current = setTimeout(tick, speed);
    } else {
      setIsTyping(false);
      setIsFinished(true);
      if (onComplete) onComplete();
    }
  };

  const handleSkip = () => {
    if (isTyping) {
      stopTyping();
      setDisplayedText(text);
      setIsFinished(true);
      if (onComplete) onComplete();
    }
  };

  return (
    <div 
      className={`dialogue-box-v3 ${isOpen ? 'open' : ''}`}
      onClick={handleSkip}
    >
      {speaker && (
        <div className="dialogue-header">
          <span className="speaker-name">{speaker}</span>
        </div>
      )}
      <div className="dialogue-text">
        {displayedText}
      </div>
      {isFinished && <div className="dialogue-cursor" />}
    </div>
  );
}
