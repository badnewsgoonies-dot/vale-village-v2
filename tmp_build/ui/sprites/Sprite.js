"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sprite = Sprite;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * Sprite Component
 * Renders a sprite with animation support
 */
const hooks_1 = require("preact/hooks");
const loader_1 = require("./loader");
const manifest_1 = require("./manifest");
const catalog_1 = require("./catalog");
/**
 * Sprite component with animation support
 */
function Sprite({ id, state = 'idle', frame: controlledFrame, animate = true, className, style, onLoad, onError, }) {
    const [img, setImg] = (0, hooks_1.useState)(null);
    const [internalFrame, setInternalFrame] = (0, hooks_1.useState)(0);
    const frameRef = (0, hooks_1.useRef)(0);
    const animationRef = (0, hooks_1.useRef)(null);
    // Try new catalog first, fall back to old manifest
    const def = (0, manifest_1.getSpriteDef)(id);
    // If not found in old manifest, try catalog
    if (!def) {
        const catalogEntry = id.startsWith('/')
            ? (0, catalog_1.getSpriteByPath)(id)
            : (0, catalog_1.getSpriteById)(id);
        if (catalogEntry) {
            // Use catalog sprite directly - it's a GIF, render as simple img
            // For now, just render the GIF directly (GIFs have built-in animation)
            // Future: could extract frames for frame-by-frame control
        }
    }
    const fps = def?.fps ?? 12;
    const totalFrames = typeof def?.frames === 'number' ? def.frames : 8;
    // Use controlled frame if provided, otherwise use internal frame
    const currentFrame = controlledFrame ?? internalFrame;
    // Load sprite on mount/id change
    (0, hooks_1.useEffect)(() => {
        let cancelled = false;
        (0, loader_1.loadSprite)(id)
            .then((loadedImg) => {
            if (!cancelled) {
                setImg(loadedImg);
                onLoad?.();
            }
        })
            .catch(() => {
            if (!cancelled) {
                onError?.();
            }
        });
        return () => {
            cancelled = true;
        };
    }, [id, onLoad, onError]);
    // Animation loop (if animate is true and frame is not controlled)
    (0, hooks_1.useEffect)(() => {
        if (!animate || controlledFrame !== undefined) {
            return;
        }
        const interval = 1000 / fps;
        const startTime = performance.now();
        const animateFrame = (currentTime) => {
            const elapsed = currentTime - startTime;
            const newFrame = Math.floor((elapsed / interval) % totalFrames);
            if (newFrame !== frameRef.current) {
                frameRef.current = newFrame;
                setInternalFrame(newFrame);
            }
            animationRef.current = requestAnimationFrame(animateFrame);
        };
        animationRef.current = requestAnimationFrame(animateFrame);
        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animate, controlledFrame, fps, totalFrames]);
    if (!img) {
        // Loading state - show placeholder
        return ((0, jsx_runtime_1.jsx)("div", { className: className, style: {
                width: def?.frameWidth ?? 32,
                height: def?.frameHeight ?? 32,
                backgroundColor: '#555',
                display: 'inline-block',
                ...style,
            }, "aria-label": `Loading sprite: ${id}` }));
    }
    // Calculate sprite sheet position
    const frameWidth = def?.frameWidth ?? 32;
    const frameHeight = def?.frameHeight ?? 32;
    const cols = Math.floor(img.width / frameWidth);
    const row = Math.floor(currentFrame / cols);
    const col = currentFrame % cols;
    return ((0, jsx_runtime_1.jsx)("div", { className: className, style: {
            width: frameWidth,
            height: frameHeight,
            display: 'inline-block',
            overflow: 'hidden',
            ...style,
        }, "aria-label": `Sprite: ${id}, state: ${state}, frame: ${currentFrame}`, children: (0, jsx_runtime_1.jsx)("img", { src: img.src, alt: id, style: {
                width: img.width,
                height: img.height,
                objectFit: 'none',
                transform: `translate(-${col * frameWidth}px, -${row * frameHeight}px)`,
                imageRendering: 'pixelated', // For pixel art
            }, draggable: false }) }));
}
