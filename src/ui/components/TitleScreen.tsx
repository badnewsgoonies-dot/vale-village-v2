/**
 * Title Screen Component
 * Entry screen showing game title
 */

import { useEffect } from 'preact/hooks';
import { useStore } from '../state/store';
import './TitleScreen.css';

export function TitleScreen() {
  const setMode = useStore((s) => s.setMode);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Any key press advances to main menu
      event.preventDefault();
      event.stopPropagation();
      setMode('main-menu');
    };

    const handleClick = () => {
      // Click anywhere also advances
      setMode('main-menu');
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [setMode]);

  return (
    <div class="title-screen" onClick={() => setMode('main-menu')}>
      <div class="title-screen-content">
        <h1 class="title-screen-logo">Vale Chronicles</h1>
        <p class="title-screen-subtitle">Press any key to continue</p>
      </div>
    </div>
  );
}
