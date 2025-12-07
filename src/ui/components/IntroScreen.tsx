/**
 * Intro Screen Component
 * Placeholder welcome screen before starting the game
 */

import { JSX } from 'preact';
import { useEffect } from 'preact/hooks';
import { useStore } from '../state/store';
import './IntroScreen.css';

export function IntroScreen(): JSX.Element {
  const setMode = useStore((s) => s.setMode);
  const setStoryFlag = useStore((s) => s.setStoryFlag);

  useEffect(() => {
    // Mark intro as seen
    setStoryFlag('intro_seen', true);

    const handleKeyPress = (event: KeyboardEvent) => {
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

  return (
    <div class="intro-screen" onClick={() => setMode('overworld')}>
      <div class="intro-screen-content">
        <h1 class="intro-screen-title">Welcome to Vale Chronicles</h1>
        <p class="intro-screen-text">
          The village of Vale has fallen under dark influence.
          Twenty houses have been corrupted, their inhabitants enslaved.
        </p>
        <p class="intro-screen-text">
          As Isaac, you must liberate each house and restore peace to the land.
        </p>
        <p class="intro-screen-prompt">Press any key to begin your journey</p>
      </div>
    </div>
  );
}
