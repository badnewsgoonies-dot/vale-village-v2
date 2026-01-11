"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleSprite = SimpleSprite;
const jsx_runtime_1 = require("preact/jsx-runtime");
/**
 * SimpleSprite Component
 *
 * A flexible, easy-to-use sprite component optimized for mockups and production screens.
 *
 * Identifier semantics:
 * - If `id` starts with `/`, it is treated as a **path ID** and must correspond to an
 *   entry inside `sprite-list-generated.ts`.
 * - Otherwise it is treated as a **semantic ID** and is resolved via `getSpriteById`.
 *
 * @example
 * // Basic usage
 * <SimpleSprite id="isaac-lblade-front" width={64} height={64} />
 *
 * @example
 * // With custom styling
 * <SimpleSprite
 *   id="goblin"
 *   width={48}
 *   height={48}
 *   style={{ border: '1px solid #ccc' }}
 * />
 *
 * @example
 * // Direct path (bypasses catalog)
 * <SimpleSprite
 *   id="/sprites/battle/party/isaac/Isaac_lBlade_Front.gif"
 *   width={64}
 *   height={64}
 * />
 *
 * @example
 * // Debug mode (shows sprite info on hover)
 * <SimpleSprite
 *   id="isaac-battle-idle"
 *   width={64}
 *   height={64}
 *   debug={true}
 * />
 */
const hooks_1 = require("preact/hooks");
const catalog_1 = require("./catalog");
/**
 * Generate a colored placeholder based on sprite ID
 * Useful for debugging and fallbacks
 */
function generatePlaceholder(id, width, height) {
    // Generate a consistent color from the ID
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    const saturation = 40 + (Math.abs(hash) % 30); // 40-70%
    const lightness = 60 + (Math.abs(hash) % 20); // 60-80%
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            width,
            height,
            backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: Math.min(width, height) / 4,
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '4px',
            border: '2px dashed rgba(0,0,0,0.3)',
            boxSizing: 'border-box',
        }, title: `Placeholder: ${id}`, children: (0, jsx_runtime_1.jsx)("div", { style: { wordBreak: 'break-word', lineHeight: 1 }, children: id.length > 10 ? id.substring(0, 10) + '...' : id }) }));
}
function deriveNameFromPath(path) {
    const filename = path.split('/').pop() ?? path;
    return filename
        .replace(/\.(gif|png)$/i, '')
        .replace(/[_\-]+/g, ' ')
        .trim();
}
/**
 * Find sprite entry using flexible lookup
 */
function findSprite(id) {
    // Method 1: Direct path (starts with /)
    if (id.startsWith('/')) {
        const entry = (0, catalog_1.getSpriteByPath)(id);
        if (entry) {
            return { entry, method: 'path' };
        }
        // Path exists in /public but isn't listed in the generated catalog yet (e.g., new assets).
        // Allow direct loads and rely on <img onError> for fallback.
        return {
            entry: {
                name: deriveNameFromPath(id),
                path: id,
                category: 'path',
                subcategory: null,
            },
            method: 'path-direct',
        };
    }
    // Method 2: Catalog lookup (flexible ID matching)
    const entry = (0, catalog_1.getSpriteById)(id);
    if (entry) {
        return { entry, method: 'catalog' };
    }
    return { entry: null, method: 'none' };
}
function SimpleSprite({ id, width, height, style, className, debug = false, fallback, alt, imageRendering = 'pixelated', objectFit = 'contain', onLoad, onError, }) {
    const [spriteEntry, setSpriteEntry] = (0, hooks_1.useState)(null);
    const [loadError, setLoadError] = (0, hooks_1.useState)(null);
    const [isLoaded, setIsLoaded] = (0, hooks_1.useState)(false);
    const [showDebugInfo, setShowDebugInfo] = (0, hooks_1.useState)(false);
    const catalogSuggestion = `searchSprites('${id.split('-')[0] ?? id}')`;
    // Lookup sprite on mount/id change
    (0, hooks_1.useEffect)(() => {
        const result = findSprite(id);
        setSpriteEntry(result);
        setLoadError(null);
        setIsLoaded(false);
        if (debug && result.entry) {
            // Debug: sprite found (details removed)
        }
        else if (debug && !result.entry) {
            // Debug: sprite not found
        }
    }, [id, debug]);
    // Handle image load
    const handleLoad = () => {
        setIsLoaded(true);
        setLoadError(null);
        onLoad?.();
    };
    const handleError = () => {
        const error = spriteEntry?.entry
            ? `Failed to load sprite at ${spriteEntry.entry.path} (method: ${spriteEntry.method})`
            : `Sprite not found for id "${id}" (method: ${spriteEntry?.method ?? 'none'})`;
        setLoadError(error);
        setIsLoaded(false);
        onError?.(error);
        if (debug) {
            console.error(`[SimpleSprite] Load error:`, error);
        }
    };
    // Determine sprite path
    const spritePath = spriteEntry?.entry?.path || null;
    // Show fallback if no sprite found or error loading
    if (!spritePath || loadError) {
        if (fallback) {
            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: fallback });
        }
        return ((0, jsx_runtime_1.jsxs)("div", { className: className, style: {
                width,
                height,
                ...style,
            }, onMouseEnter: () => debug && setShowDebugInfo(true), onMouseLeave: () => debug && setShowDebugInfo(false), children: [generatePlaceholder(id, width, height), debug && showDebugInfo && ((0, jsx_runtime_1.jsxs)("div", { style: {
                        position: 'absolute',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        color: '#fff',
                        padding: '8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        zIndex: 1000,
                        marginTop: '4px',
                        maxWidth: '300px',
                    }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Sprite ID:" }), " ", id] }), spriteEntry && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Lookup Method:" }), " ", spriteEntry.method] })), loadError && ((0, jsx_runtime_1.jsxs)("div", { style: { color: '#ff6b6b' }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Error:" }), " ", loadError] })), !spritePath && ((0, jsx_runtime_1.jsxs)("div", { style: { color: '#ffd93d' }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "Tip:" }), " Sprite not found in catalog. Try:", (0, jsx_runtime_1.jsxs)("ul", { style: { margin: '4px 0', paddingLeft: '20px' }, children: [(0, jsx_runtime_1.jsxs)("li", { children: ["Using direct path: ", (0, jsx_runtime_1.jsx)("code", { children: "/sprites/..." })] }), (0, jsx_runtime_1.jsxs)("li", { children: ["Checking catalog: ", (0, jsx_runtime_1.jsx)("code", { children: catalogSuggestion })] })] })] }))] }))] }));
    }
    // Render sprite
    return ((0, jsx_runtime_1.jsxs)("div", { className: className, style: {
            width,
            height,
            position: 'relative',
            display: 'inline-block',
            ...style,
        }, onMouseEnter: () => debug && setShowDebugInfo(true), onMouseLeave: () => debug && setShowDebugInfo(false), children: [(0, jsx_runtime_1.jsx)("img", { src: spritePath, alt: alt || spriteEntry?.entry?.name || id, width: width, height: height, style: {
                    width: '100%',
                    height: '100%',
                    objectFit,
                    imageRendering: imageRendering,
                    display: 'block',
                }, onLoad: handleLoad, onError: handleError }), debug && showDebugInfo && spriteEntry && spriteEntry.entry && ((0, jsx_runtime_1.jsxs)("div", { style: {
                    position: 'absolute',
                    bottom: '100%',
                    left: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    color: '#fff',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    zIndex: 1000,
                    marginBottom: '4px',
                    maxWidth: '300px',
                    whiteSpace: 'nowrap',
                }, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Name:" }), " ", spriteEntry.entry.name] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Path:" }), " ", spriteEntry.entry.path] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Category:" }), " ", spriteEntry.entry.category] }), spriteEntry.entry.subcategory && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Subcategory:" }), " ", spriteEntry.entry.subcategory] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Lookup:" }), " ", spriteEntry.method] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Status:" }), " ", isLoaded ? '✅ Loaded' : '⏳ Loading...'] })] }))] }));
}
