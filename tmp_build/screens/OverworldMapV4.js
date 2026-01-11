"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverworldMapV4 = void 0;
const jsx_runtime_1 = require("preact/jsx-runtime");
const hooks_1 = require("preact/hooks");
require("./OverworldMapV3.css");
// Proper Vale Village map with grid-based sprite rendering
const MAP_DATA = {
    // 20x15 grid for a decent-sized overworld
    tiles: [
        // Row 0 - top
        ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
        // Row 1
        ['grass', 'grass', 'tree', 'grass', 'grass', 'grass', 'grass', 'tree', 'grass', 'grass', 'grass', 'grass', 'grass', 'tree', 'grass', 'grass', 'grass', 'tree', 'grass', 'grass'],
        // Row 2
        ['grass', 'grass', 'grass', 'grass', 'grass', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
        // Row 3
        ['grass', 'tree', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'tree', 'grass', 'grass', 'grass'],
        // Row 4
        ['grass', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
        // Row 5
        ['grass', 'grass', 'grass', 'tree', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'tree', 'grass', 'grass', 'grass', 'grass', 'tree', 'grass'],
        // Row 6 - horizontal path
        ['grass', 'grass', 'grass', 'grass', 'grass', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'grass', 'grass', 'grass'],
        // Row 7
        ['grass', 'tree', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass'],
        // Row 8
        ['grass', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'tree', 'grass'],
        // Row 9
        ['grass', 'grass', 'grass', 'tree', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'tree', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass'],
        // Row 10
        ['grass', 'grass', 'grass', 'grass', 'grass', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'grass', 'grass', 'path', 'grass', 'grass', 'grass'],
        // Row 11
        ['grass', 'tree', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'path', 'grass', 'tree', 'grass'],
        // Row 12
        ['grass', 'grass', 'grass', 'grass', 'grass', 'tree', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'path', 'grass', 'grass', 'grass'],
        // Row 13
        ['grass', 'grass', 'grass', 'tree', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'tree', 'grass', 'path', 'grass', 'grass', 'path', 'grass', 'grass', 'tree'],
        // Row 14 - bottom
        ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
    ],
    tileSize: 48, // Good size for visibility
    sprites: {
        // grass: no longer tiled - use background image instead
        tree: '/sprites/scenery/plants/Tree1.gif',
        path: '/sprites/scenery/outdoor/sm/stone1.gif', // Use stone as path
    },
    background: '/sprites/backgrounds/gs1/Overworld.gif', // Proper GS backdrop
};
// Buildings positioned on the map (separate from tile grid)
const BUILDINGS = [
    {
        id: 'isaacs-house',
        spritePath: '/sprites/buildings/Vale/Vale_Isaacs_House.gif',
        row: 4,
        col: 8,
        width: 3, // spans 3 tiles
        height: 2, // spans 2 tiles
    },
    {
        id: 'inn',
        spritePath: '/sprites/buildings/Vale/Vale_Inn.gif',
        row: 3,
        col: 14,
        width: 3,
        height: 2,
    },
    {
        id: 'shop',
        spritePath: '/sprites/buildings/Vale/Vale_Inn.gif', // Reuse for now
        row: 8,
        col: 3,
        width: 2,
        height: 2,
    },
];
const PLAYER_START = { row: 7, col: 5 };
const OverworldMapV4 = () => {
    const bgCanvasRef = (0, hooks_1.useRef)(null);
    const buildingCanvasRef = (0, hooks_1.useRef)(null);
    const entityCanvasRef = (0, hooks_1.useRef)(null);
    const [spritesLoaded, setSpritesLoaded] = (0, hooks_1.useState)(false);
    const [loadedSprites, setLoadedSprites] = (0, hooks_1.useState)({});
    const [buildingSprites, setBuildingSprites] = (0, hooks_1.useState)({});
    const playerRef = (0, hooks_1.useRef)(PLAYER_START);
    const width = (MAP_DATA.tiles[0]?.length ?? 0) * MAP_DATA.tileSize;
    const height = MAP_DATA.tiles.length * MAP_DATA.tileSize;
    // Load tile sprites
    (0, hooks_1.useEffect)(() => {
        const sprites = {};
        const promises = Object.entries(MAP_DATA.sprites).map(([key, path]) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    sprites[key] = img;
                    resolve();
                };
                img.onerror = () => {
                    // [REMOVED] console.warn(`Failed to load tile sprite: ${path}`);
                    // Create colored placeholder
                    const canvas = document.createElement('canvas');
                    canvas.width = MAP_DATA.tileSize;
                    canvas.height = MAP_DATA.tileSize;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = key === 'grass' ? '#4a4' : key === 'tree' ? '#282' : key === 'path' ? '#864' : '#666';
                    ctx.fillRect(0, 0, MAP_DATA.tileSize, MAP_DATA.tileSize);
                    sprites[key] = canvas;
                    resolve();
                };
                img.src = path;
            });
        });
        Promise.all(promises).then(() => {
            setLoadedSprites(sprites);
            setSpritesLoaded(true);
        });
    }, []);
    // Load building sprites
    (0, hooks_1.useEffect)(() => {
        const sprites = {};
        const promises = BUILDINGS.map((building) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    sprites[building.id] = img;
                    resolve();
                };
                img.onerror = () => {
                    // [REMOVED] console.warn(`Failed to load building sprite: ${building.spritePath}`);
                    // Create placeholder
                    const canvas = document.createElement('canvas');
                    canvas.width = building.width * MAP_DATA.tileSize;
                    canvas.height = building.height * MAP_DATA.tileSize;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#888';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.strokeStyle = '#fff';
                    ctx.strokeRect(0, 0, canvas.width, canvas.height);
                    sprites[building.id] = canvas;
                    resolve();
                };
                img.src = building.spritePath;
            });
        });
        Promise.all(promises).then(() => {
            setBuildingSprites(sprites);
        });
    }, []);
    // Load background image
    const [bgImage, setBgImage] = (0, hooks_1.useState)(null);
    (0, hooks_1.useEffect)(() => {
        const img = new Image();
        img.onload = () => setBgImage(img);
        img.src = MAP_DATA.background;
    }, []);
    // Render static background layer (backdrop + terrain overlays)
    (0, hooks_1.useEffect)(() => {
        if (!spritesLoaded || !bgCanvasRef.current)
            return;
        const ctx = bgCanvasRef.current.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        // Draw backdrop image (stretched to fill, maintaining aspect ratio at bottom)
        if (bgImage) {
            // Scale to fill width, position at bottom for ground-level feel
            const scale = width / bgImage.width;
            const scaledHeight = bgImage.height * scale;
            // Draw it covering the canvas, cropped from top if needed
            const yOffset = Math.max(0, height - scaledHeight);
            ctx.drawImage(bgImage, 0, yOffset, width, scaledHeight);
        }
        else {
            // Fallback: gradient ground
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#87CEEB'); // Sky blue
            gradient.addColorStop(0.3, '#90EE90'); // Light green
            gradient.addColorStop(1, '#228B22'); // Forest green
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }
        // Only draw path and tree tiles (not grass - that's the background now)
        MAP_DATA.tiles.forEach((row, r) => {
            row.forEach((tile, c) => {
                if (tile === 'grass')
                    return; // Skip grass - backdrop handles it
                const x = c * MAP_DATA.tileSize;
                const y = r * MAP_DATA.tileSize;
                const sprite = loadedSprites[tile];
                if (sprite) {
                    ctx.drawImage(sprite, x, y, MAP_DATA.tileSize, MAP_DATA.tileSize);
                }
            });
        });
    }, [spritesLoaded, loadedSprites, bgImage, width, height]);
    // Render buildings layer
    (0, hooks_1.useEffect)(() => {
        if (!spritesLoaded || !buildingCanvasRef.current || Object.keys(buildingSprites).length === 0)
            return;
        const ctx = buildingCanvasRef.current.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        // Draw each building at its grid position
        BUILDINGS.forEach((building) => {
            const sprite = buildingSprites[building.id];
            if (sprite) {
                const x = building.col * MAP_DATA.tileSize;
                const y = building.row * MAP_DATA.tileSize;
                const w = building.width * MAP_DATA.tileSize;
                const h = building.height * MAP_DATA.tileSize;
                ctx.drawImage(sprite, x, y, w, h);
            }
        });
    }, [spritesLoaded, buildingSprites, width, height]);
    // Animate player layer
    (0, hooks_1.useEffect)(() => {
        if (!spritesLoaded || !entityCanvasRef.current)
            return;
        const canvas = entityCanvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        // Load player sprite
        const playerSprite = new Image();
        playerSprite.src = '/sprites/overworld/protagonists/Felix.gif';
        let animId;
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            // Draw player at grid position (AUTO-CALC)
            const playerX = playerRef.current.col * MAP_DATA.tileSize;
            const playerY = playerRef.current.row * MAP_DATA.tileSize;
            if (playerSprite.complete) {
                ctx.drawImage(playerSprite, playerX, playerY, MAP_DATA.tileSize, MAP_DATA.tileSize);
            }
            animId = requestAnimationFrame(animate);
        };
        playerSprite.onload = () => {
            animId = requestAnimationFrame(animate);
        };
        return () => {
            if (animId)
                cancelAnimationFrame(animId);
        };
    }, [spritesLoaded, width, height]);
    if (!spritesLoaded) {
        return ((0, jsx_runtime_1.jsx)("div", { style: { padding: '2rem', color: '#fff', textAlign: 'center' }, children: "Loading Vale Village..." }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "overworld-v3-container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "overworld-v3-stage", style: { width: `${width}px`, height: `${height}px` }, children: [(0, jsx_runtime_1.jsx)("canvas", { ref: bgCanvasRef, width: width, height: height, className: "overworld-v3-layer overworld-v3-bg" }), (0, jsx_runtime_1.jsx)("canvas", { ref: buildingCanvasRef, width: width, height: height, className: "overworld-v3-layer overworld-v3-bg", style: { zIndex: 2 } }), (0, jsx_runtime_1.jsx)("canvas", { ref: entityCanvasRef, width: width, height: height, className: "overworld-v3-layer overworld-v3-entities", style: { zIndex: 3 } })] }), (0, jsx_runtime_1.jsxs)("div", { style: { padding: '1rem', color: '#fff', textAlign: 'center' }, children: ["Vale Village - Grid Position: [", playerRef.current.row, ", ", playerRef.current.col, "]", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)("small", { children: ["Grid-based sprite rendering - ", width, "x", height, " canvas"] })] })] }));
};
exports.OverworldMapV4 = OverworldMapV4;
