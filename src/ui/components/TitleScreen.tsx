/**
 * Title Screen Component
 * Entry screen showing game title with animated character sprites
 */

import { useEffect } from 'preact/hooks';
import { useGameStore } from '../../store/gameStore';
import './TitleScreen.css';

// Character sprites for the title screen parade
const TITLE_CHARACTERS = [
  { name: 'Isaac', sprite: '/sprites/overworld/protagonists/Isaac_Walk.gif', delay: 0 },
  { name: 'Garet', sprite: '/sprites/overworld/protagonists/Garet_Right.gif', delay: 0.8 },
  { name: 'Ivan', sprite: '/sprites/overworld/protagonists/Ivan_Right.gif', delay: 1.6 },
  { name: 'Mia', sprite: '/sprites/overworld/protagonists/Mia_Right.gif', delay: 2.4 },
];

export function TitleScreen() {
  const setScreen = useGameStore((s) => s.setScreen);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Any key press advances to main menu
      event.preventDefault();
      event.stopPropagation();
      setScreen('menu');
    };

    const handleClick = () => {
      // Click anywhere also advances
      setScreen('menu');
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [setScreen]);

  return (
    <div class="title-screen" onClick={() => setScreen('menu')}>
      <div class="title-screen-content">
        <h1 class="title-screen-logo">Vale Chronicles</h1>
        <p class="title-screen-subtitle">Press any key to continue</p>
      </div>

      {/* Animated character parade at bottom */}
      <div class="title-screen-parade">
        {TITLE_CHARACTERS.map((char) => (
          <div
            key={char.name}
            class="title-screen-character"
            style={{ animationDelay: `${char.delay}s` }}
          >
            <img
              src={char.sprite}
              alt={char.name}
              class="title-screen-sprite"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
