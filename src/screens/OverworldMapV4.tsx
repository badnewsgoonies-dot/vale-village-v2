import { FunctionComponent } from 'preact';
import { useRef, useEffect, useState } from 'preact/hooks';
import './OverworldMapV3.css';

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
    grass: '/sprites/scenery/outdoor/sm/Floating_Grass.gif',
    tree: '/sprites/scenery/plants/Tree1.gif',
    path: '/sprites/scenery/outdoor/sm/stone1.gif', // Use stone as path
  },
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

export const OverworldMapV4: FunctionComponent = () => {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const buildingCanvasRef = useRef<HTMLCanvasElement>(null);
  const entityCanvasRef = useRef<HTMLCanvasElement>(null);
  const [spritesLoaded, setSpritesLoaded] = useState(false);
  const [loadedSprites, setLoadedSprites] = useState<Record<string, HTMLImageElement>>({});
  const [buildingSprites, setBuildingSprites] = useState<Record<string, HTMLImageElement>>({});
  const playerRef = useRef(PLAYER_START);

  const width = (MAP_DATA.tiles[0]?.length ?? 0) * MAP_DATA.tileSize;
  const height = MAP_DATA.tiles.length * MAP_DATA.tileSize;

  // Load tile sprites
  useEffect(() => {
    const sprites: Record<string, HTMLImageElement> = {};
    const promises = Object.entries(MAP_DATA.sprites).map(([key, path]) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          sprites[key] = img;
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load tile sprite: ${path}`);
          // Create colored placeholder
          const canvas = document.createElement('canvas');
          canvas.width = MAP_DATA.tileSize;
          canvas.height = MAP_DATA.tileSize;
          const ctx = canvas.getContext('2d')!;
          ctx.fillStyle = key === 'grass' ? '#4a4' : key === 'tree' ? '#282' : key === 'path' ? '#864' : '#666';
          ctx.fillRect(0, 0, MAP_DATA.tileSize, MAP_DATA.tileSize);
          sprites[key] = canvas as any;
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
  useEffect(() => {
    const sprites: Record<string, HTMLImageElement> = {};
    const promises = BUILDINGS.map((building) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          sprites[building.id] = img;
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load building sprite: ${building.spritePath}`);
          // Create placeholder
          const canvas = document.createElement('canvas');
          canvas.width = building.width * MAP_DATA.tileSize;
          canvas.height = building.height * MAP_DATA.tileSize;
          const ctx = canvas.getContext('2d')!;
          ctx.fillStyle = '#888';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = '#fff';
          ctx.strokeRect(0, 0, canvas.width, canvas.height);
          sprites[building.id] = canvas as any;
          resolve();
        };
        img.src = building.spritePath;
      });
    });

    Promise.all(promises).then(() => {
      setBuildingSprites(sprites);
    });
  }, []);

  // Render static background layer (terrain tiles)
  useEffect(() => {
    if (!spritesLoaded || !bgCanvasRef.current) return;

    const ctx = bgCanvasRef.current.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Grid-based rendering - auto-calculate positions
    MAP_DATA.tiles.forEach((row, r) => {
      row.forEach((tile, c) => {
        const x = c * MAP_DATA.tileSize; // AUTO-CALC X
        const y = r * MAP_DATA.tileSize; // AUTO-CALC Y
        const sprite = loadedSprites[tile];
        if (sprite) {
          ctx.drawImage(sprite, x, y, MAP_DATA.tileSize, MAP_DATA.tileSize);
        }
      });
    });
  }, [spritesLoaded, loadedSprites, width, height]);

  // Render buildings layer
  useEffect(() => {
    if (!spritesLoaded || !buildingCanvasRef.current || Object.keys(buildingSprites).length === 0) return;

    const ctx = buildingCanvasRef.current.getContext('2d')!;
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
  useEffect(() => {
    if (!spritesLoaded || !entityCanvasRef.current) return;

    const canvas = entityCanvasRef.current;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    // Load player sprite
    const playerSprite = new Image();
    playerSprite.src = '/sprites/overworld/protagonists/Felix.gif';

    let animId: number;
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
      if (animId) cancelAnimationFrame(animId);
    };
  }, [spritesLoaded, width, height]);

  if (!spritesLoaded) {
    return (
      <div style={{ padding: '2rem', color: '#fff', textAlign: 'center' }}>
        Loading Vale Village...
      </div>
    );
  }

  return (
    <div className="overworld-v3-container">
      <div className="overworld-v3-stage" style={{ width: `${width}px`, height: `${height}px` }}>
        {/* Layer 1: Terrain tiles */}
        <canvas
          ref={bgCanvasRef}
          width={width}
          height={height}
          className="overworld-v3-layer overworld-v3-bg"
        />
        {/* Layer 2: Buildings */}
        <canvas
          ref={buildingCanvasRef}
          width={width}
          height={height}
          className="overworld-v3-layer overworld-v3-bg"
          style={{ zIndex: 2 }}
        />
        {/* Layer 3: Player/entities */}
        <canvas
          ref={entityCanvasRef}
          width={width}
          height={height}
          className="overworld-v3-layer overworld-v3-entities"
          style={{ zIndex: 3 }}
        />
      </div>
      <div style={{ padding: '1rem', color: '#fff', textAlign: 'center' }}>
        Vale Village - Grid Position: [{playerRef.current.row}, {playerRef.current.col}]
        <br />
        <small>Grid-based sprite rendering - {width}x{height} canvas</small>
      </div>
    </div>
  );
};
