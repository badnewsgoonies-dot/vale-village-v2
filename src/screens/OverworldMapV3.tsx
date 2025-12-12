import { FunctionComponent } from 'preact';
import { useRef, useEffect, useState } from 'preact/hooks';
import './OverworldMapV3.css';

// Simple grid-based map - NO manual X/Y positioning
const MAP_DATA = {
  tiles: [
    ['grass', 'grass', 'tree', 'grass', 'grass'],
    ['grass', 'path', 'path', 'path', 'grass'],
    ['tree', 'path', 'inn', 'path', 'tree'],
    ['grass', 'path', 'path', 'path', 'grass'],
    ['grass', 'grass', 'tree', 'grass', 'grass'],
  ],
  tileSize: 64, // Larger tiles for visibility
  sprites: {
    grass: '/sprites/scenery/outdoor/sm/Floating_Grass.gif',
    tree: '/sprites/scenery/plants/Tree1.gif',
    path: '/sprites/scenery/outdoor/sm/door1.gif', // Placeholder
    inn: '/sprites/buildings/Madra/Madra_Potionshop.gif',
  },
};

const PLAYER_START = { row: 2, col: 2 };

export const OverworldMapV3: FunctionComponent = () => {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const entityCanvasRef = useRef<HTMLCanvasElement>(null);
  const [spritesLoaded, setSpritesLoaded] = useState(false);
  const [loadedSprites, setLoadedSprites] = useState<Record<string, HTMLImageElement>>({});
  const playerRef = useRef(PLAYER_START);

  const width = (MAP_DATA.tiles[0]?.length ?? 0) * MAP_DATA.tileSize;
  const height = MAP_DATA.tiles.length * MAP_DATA.tileSize;

  // Load all sprites
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
          console.warn(`Failed to load sprite: ${path}`);
          // Create placeholder
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

  // Render static background layer ONCE
  useEffect(() => {
    if (!spritesLoaded || !bgCanvasRef.current) return;

    const ctx = bgCanvasRef.current.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    // Grid-based rendering - auto-calculate positions
    MAP_DATA.tiles.forEach((row, r) => {
      row.forEach((tile, c) => {
        const x = c * MAP_DATA.tileSize; // AUTO-CALC
        const y = r * MAP_DATA.tileSize; // AUTO-CALC
        const sprite = loadedSprites[tile];
        if (sprite) {
          ctx.drawImage(sprite, x, y, MAP_DATA.tileSize, MAP_DATA.tileSize);
        }
      });
    });
  }, [spritesLoaded, loadedSprites]);

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
        Loading sprites...
      </div>
    );
  }

  return (
    <div className="overworld-v3-container">
      <div className="overworld-v3-stage" style={{ width: `${width}px`, height: `${height}px` }}>
        <canvas
          ref={bgCanvasRef}
          width={width}
          height={height}
          className="overworld-v3-layer overworld-v3-bg"
        />
        <canvas
          ref={entityCanvasRef}
          width={width}
          height={height}
          className="overworld-v3-layer overworld-v3-entities"
        />
      </div>
      <div style={{ padding: '1rem', color: '#fff', textAlign: 'center' }}>
        Grid-based rendering: tiles[{playerRef.current.row}][{playerRef.current.col}]
        <br />
        <small>NO manual X/Y coordinates - all positions auto-calculated!</small>
      </div>
    </div>
  );
};
