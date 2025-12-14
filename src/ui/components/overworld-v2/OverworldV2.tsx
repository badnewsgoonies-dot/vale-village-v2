/**
 * OverworldV2
 * Clean-slate overworld renderer with player movement and interior transitions.
 */

import { useEffect, useRef, useCallback, useState } from 'preact/hooks';
import { useStore } from '../../state/store';
import { OverworldEngineV2 } from './engine/OverworldEngineV2';
import { SkyLayer } from './layers/SkyLayer';
import { BackgroundLayer } from './layers/BackgroundLayer';
import { RoadLayer } from './layers/RoadLayer';
import { VillageLayer } from './layers/VillageLayer';
import { PlayerLayer } from './layers/PlayerLayer';
import { InteriorFloorLayer } from '../overworld/layers/InteriorFloorLayer';
import { InteriorFurnitureLayer } from '../overworld/layers/InteriorFurnitureLayer';
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH, ROAD_Y_TOP, ROAD_Y_BOTTOM } from './data/constants';
import { VILLAGE_WORLD_WIDTH, VILLAGE_BUILDINGS } from './data/villageLayout';
import { clamp } from './engine/math';
import type { OverworldSlice } from '../../state/overworldSlice';
import type { Layer } from './engine/types';
import '../overworld/OverworldCanvas.css';

/** Movement speed in world pixels per second */
const PLAYER_SPEED = 160;

/** Y-axis movement band (player can step slightly above road to enter doors) */
const PLAYER_Y_MIN = ROAD_Y_TOP - 10;  // Can step up to doors
const PLAYER_Y_MAX = ROAD_Y_BOTTOM - 10; // Stay above road bottom

/** Interior room configuration */
const INTERIOR_ROOM_WIDTH = 320;
const INTERIOR_ROOM_HEIGHT = 240;
const INTERIOR_ROOM_X = (VIEWPORT_WIDTH - INTERIOR_ROOM_WIDTH) / 2;
const INTERIOR_ROOM_Y = (VIEWPORT_HEIGHT - INTERIOR_ROOM_HEIGHT) / 2 + 50;

/** Interior player speed (slower indoors) */
const INTERIOR_PLAYER_SPEED = 120;

/** Exit trigger zone (bottom center of room) */
const EXIT_ZONE_WIDTH = 60;
const EXIT_ZONE_HEIGHT = 30;

interface OverworldV2Props {
  width?: number;
  height?: number;
}

type SceneType = 'overworld' | 'interior';

export function OverworldV2({ width = VIEWPORT_WIDTH, height = VIEWPORT_HEIGHT }: OverworldV2Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<OverworldEngineV2 | null>(null);
  const playerLayerRef = useRef<PlayerLayer | null>(null);
  const villageLayerRef = useRef<VillageLayer | null>(null);
  const interiorFloorRef = useRef<InteriorFloorLayer | null>(null);
  const interiorFurnitureRef = useRef<InteriorFurnitureLayer | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const lastUpdateRef = useRef<number>(0);

  // Track scene state
  const sceneTypeRef = useRef<SceneType>('overworld');
  const savedOverworldXRef = useRef<number>(200);  // Save X position when entering interior
  const currentHouseNumRef = useRef<number>(1);

  // Transition state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionAlphaRef = useRef<number>(0);
  const transitionTargetRef = useRef<SceneType | null>(null);

  // Store subscriptions
  const currentMapId = useStore((s: OverworldSlice) => s.currentMapId);
  const teleportPlayer = useStore((s: OverworldSlice) => s.teleportPlayer);
  const enterTowerFromOverworld = useStore((s) => s.enterTowerFromOverworld);

  // Detect scene type from map ID
  const getSceneTypeFromMapId = useCallback((mapId: string): SceneType => {
    return mapId.includes('-interior') ? 'interior' : 'overworld';
  }, []);

  // Extract house number from map ID (e.g., "house-05-interior" -> 5)
  const getHouseNumberFromMapId = useCallback((mapId: string): number => {
    const match = mapId.match(/house-(\d+)/);
    return match && match[1] ? parseInt(match[1], 10) : 1;
  }, []);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' ', 'Enter'].includes(e.key)) {
      e.preventDefault();
      keysRef.current.add(e.key);
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current.delete(e.key);
  }, []);

  // Create overworld layers
  const createOverworldLayers = useCallback((): Layer[] => {
    const villageLayer = new VillageLayer();
    villageLayerRef.current = villageLayer;

    const playerLayer = new PlayerLayer({
      x: savedOverworldXRef.current,
      y: 450,
      facing: 'right',
      unitId: 'adept',
    });
    playerLayerRef.current = playerLayer;

    villageLayer.setPlayerPosition(savedOverworldXRef.current, 450);

    return [
      new SkyLayer(),
      new BackgroundLayer(),
      new RoadLayer(),
      villageLayer,
      playerLayer,
    ];
  }, []);

  // Create interior layers
  const createInteriorLayers = useCallback((houseNum: number): Layer[] => {
    const floorLayer = new InteriorFloorLayer();
    floorLayer.setRoomSize(INTERIOR_ROOM_WIDTH, INTERIOR_ROOM_HEIGHT);
    interiorFloorRef.current = floorLayer;

    const furnitureLayer = new InteriorFurnitureLayer();
    furnitureLayer.setRoomConfig({
      roomX: INTERIOR_ROOM_X,
      roomY: INTERIOR_ROOM_Y,
      roomWidth: INTERIOR_ROOM_WIDTH,
      roomHeight: INTERIOR_ROOM_HEIGHT,
    });
    furnitureLayer.generateHouseFurniture(houseNum);
    interiorFurnitureRef.current = furnitureLayer;

    // Create player layer for interior (centered at entrance)
    const playerLayer = new PlayerLayer({
      x: INTERIOR_ROOM_X + INTERIOR_ROOM_WIDTH / 2,
      y: INTERIOR_ROOM_Y + INTERIOR_ROOM_HEIGHT - 30,
      facing: 'up',
      unitId: 'adept',
    });
    playerLayerRef.current = playerLayer;

    return [floorLayer, furnitureLayer, playerLayer];
  }, []);

  // Switch scene type with fade transition
  const transitionToScene = useCallback((targetScene: SceneType, houseNum: number = 1) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    transitionTargetRef.current = targetScene;
    currentHouseNumRef.current = houseNum;

    // Fade out
    const fadeOut = () => {
      transitionAlphaRef.current += 0.05;
      if (transitionAlphaRef.current >= 1) {
        // Switch layers at peak darkness
        const engine = engineRef.current;
        if (engine) {
          sceneTypeRef.current = targetScene;

          if (targetScene === 'interior') {
            engine.setLayers(createInteriorLayers(houseNum));
            // Reset camera for interior (no scrolling)
            engine.getCamera().setTarget(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2);
            engine.getCamera().snapToTarget();
          } else {
            engine.setLayers(createOverworldLayers());
            // Restore camera to player position
            const pos = playerLayerRef.current?.getPosition();
            if (pos) {
              engine.getCamera().setTarget(pos.x, pos.y);
              engine.getCamera().snapToTarget();
            }
          }
        }

        // Fade in
        requestAnimationFrame(fadeIn);
      } else {
        requestAnimationFrame(fadeOut);
      }
    };

    const fadeIn = () => {
      transitionAlphaRef.current -= 0.05;
      if (transitionAlphaRef.current <= 0) {
        transitionAlphaRef.current = 0;
        transitionTargetRef.current = null;
        setIsTransitioning(false);
      } else {
        requestAnimationFrame(fadeIn);
      }
    };

    requestAnimationFrame(fadeOut);
  }, [isTransitioning, createOverworldLayers, createInteriorLayers]);

  // Handle entering a building
  const enterBuilding = useCallback((buildingId: string) => {
    const building = VILLAGE_BUILDINGS.find(b => b.id === buildingId);
    if (!building) return;

    // Save current X position for return
    const playerPos = playerLayerRef.current?.getPosition();
    if (playerPos) {
      savedOverworldXRef.current = playerPos.x;
    }

    // Handle tower entry separately - triggers tower game mode
    if (building.kind === 'tower') {
      enterTowerFromOverworld({
        mapId: 'vale-village',
        position: { x: Math.floor(playerPos?.x ?? 100) / 32, y: 14 },
      });
      return;
    }

    // Get house number (e.g., "house-05" -> 5)
    const houseNum = getHouseNumberFromMapId(building.id);

    // Transition to interior
    transitionToScene('interior', houseNum);

    // Update store (optional, for save/load)
    if (building.interiorMapId) {
      teleportPlayer(building.interiorMapId, { x: 5, y: 7 });
    }
  }, [transitionToScene, getHouseNumberFromMapId, teleportPlayer, enterTowerFromOverworld]);

  // Handle exiting interior
  const exitInterior = useCallback(() => {
    // Transition back to overworld
    transitionToScene('overworld');

    // Update store
    teleportPlayer('vale-village', { x: Math.floor(savedOverworldXRef.current / 32), y: 14 });
  }, [transitionToScene, teleportPlayer]);

  // Check if player is in exit zone
  const isInExitZone = useCallback((): boolean => {
    const player = playerLayerRef.current;
    if (!player) return false;

    const pos = player.getPosition();
    const exitCenterX = INTERIOR_ROOM_X + INTERIOR_ROOM_WIDTH / 2;
    const exitY = INTERIOR_ROOM_Y + INTERIOR_ROOM_HEIGHT;

    return (
      Math.abs(pos.x - exitCenterX) < EXIT_ZONE_WIDTH / 2 &&
      pos.y > exitY - EXIT_ZONE_HEIGHT
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new OverworldEngineV2(canvas, {
      viewportWidth: width,
      viewportHeight: height,
      worldWidth: VILLAGE_WORLD_WIDTH,
    });

    // Start with overworld layers
    engine.setLayers(createOverworldLayers());

    // Set camera to follow player position
    const playerPos = playerLayerRef.current?.getPosition();
    if (playerPos) {
      engine.getCamera().setTarget(playerPos.x, playerPos.y);
      engine.getCamera().snapToTarget();
    }

    engine.start();
    engineRef.current = engine;

    // Add keyboard listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Movement update loop
    lastUpdateRef.current = performance.now();
    const movementLoop = () => {
      const now = performance.now();
      const dt = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      const player = playerLayerRef.current;
      const village = villageLayerRef.current;
      const eng = engineRef.current;
      if (!player || !eng || isTransitioning) return;

      const keys = keysRef.current;
      const isOverworld = sceneTypeRef.current === 'overworld';

      // Handle SPACE/Enter for interactions
      if (keys.has(' ') || keys.has('Enter')) {
        keys.delete(' ');
        keys.delete('Enter');

        if (isOverworld) {
          // Check for nearby door
          const nearestDoor = village?.getNearestDoor();
          if (nearestDoor) {
            enterBuilding(nearestDoor.id);
            return;
          }
        }
      }

      let dx = 0;
      let dy = 0;

      // Read input
      if (keys.has('ArrowLeft') || keys.has('a')) dx -= 1;
      if (keys.has('ArrowRight') || keys.has('d')) dx += 1;
      if (keys.has('ArrowUp') || keys.has('w')) dy -= 1;
      if (keys.has('ArrowDown') || keys.has('s')) dy += 1;

      const isMoving = dx !== 0 || dy !== 0;
      player.setPlayerState({ isMoving });

      if (isMoving) {
        // Normalize diagonal movement
        const len = Math.sqrt(dx * dx + dy * dy);
        dx /= len;
        dy /= len;

        const pos = player.getPosition();
        const speed = isOverworld ? PLAYER_SPEED : INTERIOR_PLAYER_SPEED;

        let newX: number;
        let newY: number;

        if (isOverworld) {
          // Overworld bounds
          newX = clamp(pos.x + dx * speed * dt, 0, VILLAGE_WORLD_WIDTH - 50);
          newY = clamp(pos.y + dy * speed * dt, PLAYER_Y_MIN, PLAYER_Y_MAX);
        } else {
          // Interior bounds
          newX = clamp(
            pos.x + dx * speed * dt,
            INTERIOR_ROOM_X + 20,
            INTERIOR_ROOM_X + INTERIOR_ROOM_WIDTH - 20
          );
          newY = clamp(
            pos.y + dy * speed * dt,
            INTERIOR_ROOM_Y + 20,
            INTERIOR_ROOM_Y + INTERIOR_ROOM_HEIGHT + 10  // Allow slight overshoot for exit
          );
        }

        player.setPlayerState({ x: newX, y: newY });

        // Update facing direction
        if (dx > 0) {
          player.setPlayerState({ facing: 'right' });
        } else if (dx < 0) {
          player.setPlayerState({ facing: 'left' });
        } else if (dy < 0) {
          player.setPlayerState({ facing: 'up' });
        } else if (dy > 0) {
          player.setPlayerState({ facing: 'down' });
        }

        if (isOverworld) {
          // Update camera target
          eng.getCamera().setTarget(newX, newY);
          // Update village layer for door proximity
          village?.setPlayerPosition(newX, newY);
        } else {
          // Update interior furniture layer with player position
          const furniture = interiorFurnitureRef.current;
          const state = player.getPlayerState();
          furniture?.setPlayerPosition({ x: newX, y: newY }, state.facing);

          // Check for exit trigger
          if (isInExitZone() && dy > 0) {
            exitInterior();
          }
        }
      }
    };

    const movementInterval = setInterval(movementLoop, 16);

    // Render transition overlay
    const renderOverlay = () => {
      if (transitionAlphaRef.current > 0) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = `rgba(0, 0, 0, ${transitionAlphaRef.current})`;
          ctx.fillRect(0, 0, width, height);
        }
      }
      requestAnimationFrame(renderOverlay);
    };
    requestAnimationFrame(renderOverlay);

    return () => {
      engine.stop();
      engineRef.current = null;
      playerLayerRef.current = null;
      villageLayerRef.current = null;
      interiorFloorRef.current = null;
      interiorFurnitureRef.current = null;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(movementInterval);
    };
  }, [width, height, handleKeyDown, handleKeyUp, createOverworldLayers, enterBuilding, exitInterior, isInExitZone, isTransitioning]);

  // React to map changes from store (e.g., from save/load)
  useEffect(() => {
    const targetScene = getSceneTypeFromMapId(currentMapId);
    if (targetScene !== sceneTypeRef.current && !isTransitioning) {
      const houseNum = getHouseNumberFromMapId(currentMapId);
      transitionToScene(targetScene, houseNum);
    }
  }, [currentMapId, getSceneTypeFromMapId, getHouseNumberFromMapId, transitionToScene, isTransitioning]);

  const sceneName = sceneTypeRef.current === 'interior'
    ? `House ${currentHouseNumRef.current} Interior`
    : 'Vale Village (V2)';

  return (
    <div class="overworld-shell">
      <div class="location-banner">
        <div class="location-title">{sceneName}</div>
        <div class="location-meta">
          <span class="location-chip location-chip--ghost">
            {sceneTypeRef.current === 'interior' ? 'Walk to EXIT to leave' : 'SPACE to enter buildings'}
          </span>
        </div>
      </div>

      <div class="overworld-stage">
        <div class="overworld-canvas-container">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            class="overworld-canvas"
          />
        </div>
      </div>
    </div>
  );
}
