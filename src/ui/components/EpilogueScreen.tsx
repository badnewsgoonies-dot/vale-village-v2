/**
 * Epilogue Screen - Plays after credits
 * Shows what happens to each character after the Overseer's defeat
 */

import { JSX } from 'preact';
import { useState, useEffect } from 'preact/hooks';

interface EpilogueEntry {
  character: string;
  portrait: string;
  text: string;
}

const EPILOGUE_ENTRIES: EpilogueEntry[] = [
  {
    character: 'Isaac',
    portrait: 'isaac',
    text: 'Isaac returned to Vale as a hero. Though he missed the thrill of adventure, he found purpose in training the next generation of Adepts. On quiet evenings, he still watches the sunset from the hill overlooking the village, remembering his friends.',
  },
  {
    character: 'Sentinel',
    portrait: 'sentinel',
    text: 'Sentinel chose to remain in the liberated village, helping rebuild what the Overseer had destroyed. His earth psynergy proved invaluable for reconstruction. The villagers say the stones themselves seem happier now, placed by gentle hands instead of cruel ones.',
  },
  {
    character: 'Stormcaller',
    portrait: 'stormcaller',
    text: 'True to form, Stormcaller couldn\'t stay in one place for long. She traveled the land, seeking other villages oppressed by tyranny. Wherever storms gather, they say it\'s Stormcaller - bringing justice like lightning from a clear sky.',
  },
  {
    character: 'The Liberated Creatures',
    portrait: 'creatures',
    text: 'The beasts freed from the Overseer\'s control gradually returned to their natural habitats. Some, like the Phoenix and Leviathan, became legends once more. Others stayed near the village, guardians now instead of prisoners.',
  },
  {
    character: 'The Village',
    portrait: 'village',
    text: 'The twenty houses, once cages of suffering, became homes again. Families returned. Children played in streets that had known only silence. And in the center of town, a monument was built - not to the heroes, but to those who endured.',
  },
  {
    character: 'The Future',
    portrait: 'sunset',
    text: 'Peace returned to the land. But as old Adepts know, peace is not an ending - it\'s a beginning. New threats will rise. New heroes will answer. And when they do, they\'ll remember the tale of Isaac and his friends, who proved that courage and friendship can overcome any darkness.',
  },
];

interface EpilogueScreenProps {
  onComplete: () => void;
}

export function EpilogueScreen({ onComplete }: EpilogueScreenProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'visible' | 'out'>('in');

  // Safe access - currentIndex is always within bounds
  const currentEntry = EPILOGUE_ENTRIES[currentIndex]!;
  const isLastEntry = currentIndex === EPILOGUE_ENTRIES.length - 1;

  // Handle fade transitions
  useEffect(() => {
    if (fadeState === 'in') {
      const timer = setTimeout(() => setFadeState('visible'), 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [fadeState]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        handleAdvance();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, fadeState, onComplete]);

  const handleAdvance = () => {
    if (fadeState !== 'visible') return;

    if (isLastEntry) {
      setFadeState('out');
      setTimeout(() => onComplete(), 500);
    } else {
      setFadeState('out');
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setFadeState('in');
      }, 500);
    }
  };

  const getOpacity = (): number => {
    switch (fadeState) {
      case 'in':
        return 0;
      case 'visible':
        return 1;
      case 'out':
        return 0;
      default:
        return 0;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0a0a1a',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem',
      }}
      onClick={handleAdvance}
      role="dialog"
      aria-label="Epilogue"
      aria-modal="true"
    >
      {/* Starfield background effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at center, #1a1a3a 0%, #0a0a1a 100%)',
          opacity: 0.8,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          maxWidth: '700px',
          width: '100%',
          textAlign: 'center',
          opacity: getOpacity(),
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        {/* Character name */}
        <h2
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#ffd700',
            marginBottom: '2rem',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
          }}
        >
          {currentEntry.character}
        </h2>

        {/* Epilogue text */}
        <p
          style={{
            fontSize: '1.4rem',
            lineHeight: '2',
            color: '#e0e0e0',
            fontStyle: 'italic',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          {currentEntry.text}
        </p>

        {/* Progress indicator */}
        <div
          style={{
            marginTop: '3rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          {EPILOGUE_ENTRIES.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: idx === currentIndex ? '#ffd700' : '#444',
                transition: 'background-color 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#666',
        }}
      >
        <p>{isLastEntry ? 'Press Enter to finish' : 'Press Enter or click to continue'}</p>
        <p style={{ marginTop: '0.5rem' }}>ESC to skip</p>
      </div>
    </div>
  );
}
