"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditsScreen = CreditsScreen;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
const zod_1 = require("zod");
const credits_json_1 = require("../../data/credits.json");
// Zod schema for credits data validation
const CreditsSectionSchema = zod_1.z.object({
    title: zod_1.z.string(),
    entries: zod_1.z.array(zod_1.z.string()),
});
const CreditsDataSchema = zod_1.z.object({
    sections: zod_1.z.array(CreditsSectionSchema),
    options: zod_1.z.object({
        scrollSpeed: zod_1.z.number().positive(),
        music: zod_1.z.string().nullable(),
    }),
});
// Validate credits data at module load
const creditsDataResult = CreditsDataSchema.safeParse(credits_json_1.default);
if (!creditsDataResult.success) {
    throw new Error(`Invalid credits data: ${creditsDataResult.error.message}`);
}
const creditsData = creditsDataResult.data;
function CreditsScreen({ onExit }) {
    const [scrollPosition, setScrollPosition] = (0, hooks_1.useState)(0);
    const [isPaused, setIsPaused] = (0, hooks_1.useState)(false);
    const containerRef = (0, hooks_1.useRef)(null);
    const animationRef = (0, hooks_1.useRef)(null);
    const scrollSpeed = creditsData.options.scrollSpeed || 40;
    // Auto-scroll animation
    (0, hooks_1.useEffect)(() => {
        if (isPaused)
            return;
        const animate = () => {
            setScrollPosition((prev) => {
                const container = containerRef.current;
                if (!container)
                    return prev;
                const maxScroll = container.scrollHeight - container.clientHeight;
                if (prev >= maxScroll) {
                    // Reached end - stop or loop
                    return prev;
                }
                return prev + scrollSpeed / 60; // 60fps
            });
            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPaused, scrollSpeed]);
    // Update scroll position
    (0, hooks_1.useEffect)(() => {
        const container = containerRef.current;
        if (container) {
            container.scrollTop = scrollPosition;
        }
    }, [scrollPosition]);
    // Keyboard handlers
    (0, hooks_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                onExit();
            }
            else if (e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                setIsPaused((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onExit]);
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000',
            color: '#fff',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
        }, role: "dialog", "aria-label": "Credits", "aria-modal": "true", children: [(0, jsx_runtime_1.jsx)("div", { ref: containerRef, style: {
                    flex: 1,
                    overflow: 'auto',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                        maxWidth: '600px',
                        width: '100%',
                        paddingTop: '100vh', // Start below viewport
                        paddingBottom: '100vh', // End below viewport
                    }, children: [(0, jsx_runtime_1.jsx)("h1", { style: {
                                fontSize: '3rem',
                                textAlign: 'center',
                                marginBottom: '3rem',
                                fontWeight: 'bold',
                            }, children: "Credits" }), creditsData.sections.map((section, idx) => ((0, jsx_runtime_1.jsxs)("div", { style: {
                                marginBottom: '4rem',
                                textAlign: 'center',
                            }, children: [(0, jsx_runtime_1.jsx)("h2", { style: {
                                        fontSize: '2rem',
                                        marginBottom: '1.5rem',
                                        fontWeight: 'bold',
                                        color: '#ffd700',
                                    }, children: section.title }), section.entries.map((entry, entryIdx) => ((0, jsx_runtime_1.jsx)("p", { style: {
                                        fontSize: '1.25rem',
                                        marginBottom: '0.75rem',
                                        lineHeight: '1.6',
                                    }, children: entry }, entryIdx)))] }, idx))), (0, jsx_runtime_1.jsx)("div", { style: {
                                marginTop: '4rem',
                                textAlign: 'center',
                                fontSize: '1.5rem',
                            }, children: (0, jsx_runtime_1.jsx)("p", { children: "Thank you for playing!" }) })] }) }), (0, jsx_runtime_1.jsx)("div", { style: {
                    position: 'absolute',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    color: '#888',
                }, children: (0, jsx_runtime_1.jsx)("p", { children: "Press ESC or Enter to exit | Space to pause/resume" }) })] }));
}
