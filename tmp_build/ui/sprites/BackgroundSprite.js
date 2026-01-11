"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundSprite = BackgroundSprite;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * BackgroundSprite Component
 *
 * Specialized component for rendering battle/overworld backgrounds.
 * Supports random selection, category filtering, and full-screen backgrounds.
 *
 * @example
 * // Random background from category
 * <BackgroundSprite id="random" category="backgrounds-gs1" />
 *
 * @example
 * // Specific background
 * <BackgroundSprite id="vale-forest" />
 *
 * @example
 * // Full-screen background
 * <BackgroundSprite
 *   id="random"
 *   category="backgrounds-gs1"
 *   style={{ position: 'absolute', width: '100%', height: '100%' }}
 * />
 */
const hooks_1 = require("preact/hooks");
const catalog_1 = require("./catalog");
/**
 * Find background sprite entry
 */
function findBackgroundSprite(id, category) {
    // Random selection
    if (id.toLowerCase() === 'random') {
        if (!category) {
            // [REMOVED] console.warn('[BackgroundSprite] Random selection requires category prop');
            return { entry: null, method: 'none' };
        }
        const sprites = (0, catalog_1.getSpritesByCategory)(category);
        if (sprites.length === 0) {
            // [REMOVED] console.warn(`[BackgroundSprite] No sprites found in category: ${category}`);
            return { entry: null, method: 'none' };
        }
        const randomSprite = (0, catalog_1.getRandomSprite)(category);
        return { entry: randomSprite, method: 'random' };
    }
    // Direct path
    if (id.startsWith('/')) {
        const entry = (0, catalog_1.getSpriteByPath)(id);
        return { entry, method: 'path' };
    }
    // Catalog lookup
    const entry = (0, catalog_1.getSpriteById)(id);
    if (entry) {
        return { entry, method: 'catalog' };
    }
    return { entry: null, method: 'none' };
}
function BackgroundSprite({ id, category, style, className, sizeMode = 'cover', position = 'center center', repeat = 'no-repeat', debug = false, onLoad, onError, }) {
    const [spriteEntry, setSpriteEntry] = (0, hooks_1.useState)(null);
    const [loadError, setLoadError] = (0, hooks_1.useState)(null);
    const [isLoaded, setIsLoaded] = (0, hooks_1.useState)(false);
    const [showDebugInfo, setShowDebugInfo] = (0, hooks_1.useState)(false);
    // Lookup sprite (memoized for random to prevent re-rolling on every render)
    const lookupResult = (0, hooks_1.useMemo)(() => {
        return findBackgroundSprite(id, category);
    }, [id, category]);
    (0, hooks_1.useEffect)(() => {
        setSpriteEntry(lookupResult);
        setLoadError(null);
        setIsLoaded(false);
        if (debug && lookupResult.entry) {
            // Debug: background found (details removed to avoid build-time object literals)
        }
        else if (debug && !lookupResult.entry) {
            // Debug: background not found
        }
    }, [lookupResult, debug, id, category]);
    // Handle image load
    const handleLoad = () => {
        setIsLoaded(true);
        setLoadError(null);
        onLoad?.();
    };
    const handleError = () => {
        const error = spriteEntry?.entry
            ? `Failed to load: ${spriteEntry.entry.path}`
            : `Background not found: ${id}`;
        setLoadError(error);
        setIsLoaded(false);
        onError?.(error);
        if (debug) {
            console.error(`[BackgroundSprite] Load error:`, error);
        }
    };
    // Determine background path
    const backgroundPath = spriteEntry?.entry?.path || null;
    // Fallback if no background found
    if (!backgroundPath || loadError) {
        return ((0, jsx_runtime_1.jsx)("div", { className: className, style: {
                backgroundColor: '#1a1a2e',
                backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                ...style,
            }, onMouseEnter: () => debug && setShowDebugInfo(true), onMouseLeave: () => debug && setShowDebugInfo(false), title: loadError || `Background not found: ${id}`, children: debug && showDebugInfo && ((0, jsx_runtime_1.jsxs)("div", { style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    color: '#fff',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    zIndex: 1000,
                }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Background ID:" }), " ", id] }), category && (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Category:" }), " ", category] }), spriteEntry && (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Lookup Method:" }), " ", spriteEntry.method] }), loadError && ((0, jsx_runtime_1.jsxs)("div", { style: { color: '#ff6b6b' }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Error:" }), " ", loadError] }))] })) }));
    }
    // Render background
    return ((0, jsx_runtime_1.jsxs)("div", { className: className, style: {
            backgroundImage: `url(${backgroundPath})`,
            backgroundSize: sizeMode,
            backgroundPosition: position,
            backgroundRepeat: repeat,
            width: '100%',
            height: '100%',
            ...style,
        }, onMouseEnter: () => debug && setShowDebugInfo(true), onMouseLeave: () => debug && setShowDebugInfo(false), children: [(0, jsx_runtime_1.jsx)("img", { src: backgroundPath, alt: spriteEntry?.entry?.name || id, style: { display: 'none' }, onLoad: handleLoad, onError: handleError }), debug && showDebugInfo && spriteEntry && spriteEntry.entry && ((0, jsx_runtime_1.jsxs)("div", { style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    color: '#fff',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    zIndex: 1000,
                    maxWidth: '300px',
                }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Name:" }), " ", spriteEntry.entry.name] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Path:" }), " ", spriteEntry.entry.path] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Category:" }), " ", spriteEntry.entry.category] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Lookup:" }), " ", spriteEntry.method] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Status:" }), " ", isLoaded ? '✅ Loaded' : '⏳ Loading...'] })] }))] }));
}
