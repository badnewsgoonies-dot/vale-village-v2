"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpilogueScreen = EpilogueScreen;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
const EPILOGUE_ENTRIES = [
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
function EpilogueScreen({ onComplete }) {
    const [currentIndex, setCurrentIndex] = (0, hooks_1.useState)(0);
    const [fadeState, setFadeState] = (0, hooks_1.useState)('in');
    // Safe access - currentIndex is always within bounds
    const currentEntry = EPILOGUE_ENTRIES[currentIndex];
    const isLastEntry = currentIndex === EPILOGUE_ENTRIES.length - 1;
    // Handle fade transitions
    (0, hooks_1.useEffect)(() => {
        if (fadeState === 'in') {
            const timer = setTimeout(() => setFadeState('visible'), 500);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [fadeState]);
    // Keyboard handler
    (0, hooks_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
                e.preventDefault();
                e.stopPropagation();
                handleAdvance();
            }
            else if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                onComplete();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, fadeState, onComplete]);
    const handleAdvance = () => {
        if (fadeState !== 'visible')
            return;
        if (isLastEntry) {
            setFadeState('out');
            setTimeout(() => onComplete(), 500);
        }
        else {
            setFadeState('out');
            setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
                setFadeState('in');
            }, 500);
        }
    };
    const getOpacity = () => {
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
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
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
        }, onClick: handleAdvance, role: "dialog", "aria-label": "Epilogue", "aria-modal": "true", children: [(0, jsx_runtime_1.jsx)("div", { style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(ellipse at center, #1a1a3a 0%, #0a0a1a 100%)',
                    opacity: 0.8,
                } }), (0, jsx_runtime_1.jsxs)("div", { style: {
                    position: 'relative',
                    maxWidth: '700px',
                    width: '100%',
                    textAlign: 'center',
                    opacity: getOpacity(),
                    transition: 'opacity 0.5s ease-in-out',
                }, children: [(0, jsx_runtime_1.jsx)("h2", { style: {
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            color: '#ffd700',
                            marginBottom: '2rem',
                            textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                        }, children: currentEntry.character }), (0, jsx_runtime_1.jsx)("p", { style: {
                            fontSize: '1.4rem',
                            lineHeight: '2',
                            color: '#e0e0e0',
                            fontStyle: 'italic',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                        }, children: currentEntry.text }), (0, jsx_runtime_1.jsx)("div", { style: {
                            marginTop: '3rem',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '0.5rem',
                        }, children: EPILOGUE_ENTRIES.map((_, idx) => ((0, jsx_runtime_1.jsx)("div", { style: {
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: idx === currentIndex ? '#ffd700' : '#444',
                                transition: 'background-color 0.3s ease',
                            } }, idx))) })] }), (0, jsx_runtime_1.jsxs)("div", { style: {
                    position: 'absolute',
                    bottom: '2rem',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    color: '#666',
                }, children: [(0, jsx_runtime_1.jsx)("p", { children: isLastEntry ? 'Press Enter to finish' : 'Press Enter or click to continue' }), (0, jsx_runtime_1.jsx)("p", { style: { marginTop: '0.5rem' }, children: "ESC to skip" })] })] }));
}
