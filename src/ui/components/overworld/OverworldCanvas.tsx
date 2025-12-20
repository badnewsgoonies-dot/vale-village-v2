/**
 * OverworldCanvas
 * React wrapper component for the canvas-based overworld renderer
 * Handles store subscription, lifecycle management, and UI chrome
 */

import { useRef, useEffect, useCallback } from 'preact/hooks';
import { useStore } from '../../state/store';
import { useGameStore } from '../../../store/gameStore';
import { OverworldEngine, type SceneBuilding } from './engine/OverworldEngine';
import { MAPS } from '../../../data/definitions/maps';
import { getTriggerAt } from '../../../core/services/OverworldService';
import { isHouseUnlocked } from '../../../core/services/StoryService';
import { ToolboxHelpers } from '../debug/ToolboxHelpers';
import type { TilePosition } from './engine/types';
import type { OverworldSlice } from '../../state/overworldSlice';
import type { GameStore } from '../../../store/gameStore';
import type { Position } from '../../../core/models/overworld';
import './OverworldCanvas.css';

/**
 * Vale Village scene buildings - aligned to the world ground line
 * Buildings anchor at Y=420 so doors sit on the road band.
 */
const BUILDING_GROUND_Y = 420;
const TILE_SIZE = 32;
const HOUSE_START_TILE_X = 7;
const HOUSE_TILE_SPACING = 4;
const HOUSE_COUNT = 30;

type HouseProfile = { id?: string; spritePath: string; width: number; height: number };

const DEFAULT_HOUSE_PROFILES: HouseProfile[] = [
  { spritePath: '/sprites/buildings/Vale/Vale_Building1.gif', width: 90, height: 80 },
  { spritePath: '/sprites/buildings/Vale/Vale_Building2.gif', width: 90, height: 80 },
  { spritePath: '/sprites/buildings/Vale/Vale_Building3.gif', width: 100, height: 90 },
  { spritePath: '/sprites/buildings/Vale/Vale_Building4.gif', width: 90, height: 80 },
  { spritePath: '/sprites/buildings/Vale/Vale_Building5.gif', width: 100, height: 90 },
  { spritePath: '/sprites/buildings/Vale/Vale_Building6.gif', width: 95, height: 85 },
  { spritePath: '/sprites/buildings/Vale/Vale_Building7.gif', width: 90, height: 80 },
  { spritePath: '/sprites/buildings/Vale/Vale_Building8.gif', width: 100, height: 90 },
];

const SPECIAL_HOUSE_PROFILES: Record<number, HouseProfile> = {
  1: { id: 'isaacs-house', spritePath: '/sprites/buildings/Vale/Vale_Isaacs_House.gif', width: 120, height: 100 },
  2: { id: 'kradens-house', spritePath: '/sprites/buildings/Vale/Vale_Kradens_House.gif', width: 140, height: 120 },
  6: { id: 'inn', spritePath: '/sprites/buildings/Vale/Vale_Inn.gif', width: 120, height: 100 },
  10: { id: 'garets-house', spritePath: '/sprites/buildings/Vale/Vale_Garets_House.gif', width: 120, height: 100 },
  11: { id: 'jennas-house', spritePath: '/sprites/buildings/Vale/Vale_Jennas_House.gif', width: 110, height: 95 },
};

const toWorldCenterX = (tileX: number): number => tileX * TILE_SIZE + TILE_SIZE / 2;

const buildHouseBuilding = (houseNum: number): SceneBuilding => {
  const houseId = String(houseNum).padStart(2, '0');
  const tileX = HOUSE_START_TILE_X + (houseNum - 1) * HOUSE_TILE_SPACING;
  const centerX = toWorldCenterX(tileX);
  const profile = SPECIAL_HOUSE_PROFILES[houseNum]
    ?? DEFAULT_HOUSE_PROFILES[(houseNum - 1) % DEFAULT_HOUSE_PROFILES.length]
    ?? DEFAULT_HOUSE_PROFILES[0]!;

  return {
    id: profile.id ?? `house-${houseId}`,
    spritePath: profile.spritePath,
    x: centerX - profile.width / 2,
    y: BUILDING_GROUND_Y - profile.height,
    width: profile.width,
    height: profile.height,
    triggerId: `house-${houseId}-door`,
  };
};

const HOUSE_BUILDINGS: SceneBuilding[] = Array.from({ length: HOUSE_COUNT }, (_, index) => buildHouseBuilding(index + 1));

const TOWER_TILE_X = 134;
const WEAPON_SHOP_TILE_X = 2;

const VALE_VILLAGE_SCENE_BUILDINGS: SceneBuilding[] = [
  {
    id: 'battle-tower',
    spritePath: '/sprites/buildings/Vale/Vale_Sanctum.gif',
    x: toWorldCenterX(TOWER_TILE_X) - 50,
    y: BUILDING_GROUND_Y - 120,
    width: 100,
    height: 120,
    triggerId: 'tower-entrance',
  },
  {
    id: 'weapon-shop',
    spritePath: '/sprites/buildings/Vale/Vale_WepArm_Shop.gif',
    x: toWorldCenterX(WEAPON_SHOP_TILE_X) - 50,
    y: BUILDING_GROUND_Y - 90,
    width: 100,
    height: 90,
    triggerId: 'shop-weapons',
  },
  ...HOUSE_BUILDINGS,
];

interface OverworldCanvasProps {
  width?: number;
  height?: number;
}

export function OverworldCanvas({
  width = 960,
  height = 640
}: OverworldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<OverworldEngine | null>(null);
  const lastTileRef = useRef<TilePosition | null>(null);

  // Subscribe to overworld store
  const currentMapId = useStore((s: OverworldSlice) => s.currentMapId);
  const playerPosition = useStore((s: OverworldSlice) => s.playerPosition);
  const facing = useStore((s: OverworldSlice) => s.facing);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const team = useStore((s: any) => s.team);
  const movePlayer = useStore((s: OverworldSlice) => s.movePlayer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const story = useStore((s: any) => s.story);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTrigger = useStore((s: any) => s.handleTrigger);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const teleportPlayer = useStore((s: any) => s.teleportPlayer);

  // Subscribe to game flow store
  const screen = useGameStore((s: GameStore) => s.flow.screen);
  const modal = useGameStore((s: GameStore) => s.flow.modal);
  const openModal = useGameStore((s: GameStore) => s.openModal);
  const startTransition = useGameStore((s: GameStore) => s.startTransition);

  // Check if we should be active
  const isActive = screen === 'overworld' && modal === null;

  // Get current map data
  const map = MAPS[currentMapId];

  // Initialize engine on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new OverworldEngine(canvas, {
      canvasWidth: width,
      canvasHeight: height,
    });
    engineRef.current = engine;

    // Start the engine
    engine.start();

    // Set up collision checker using store's map data
    engine.setCollisionCheck((tile: TilePosition) => {
      const mapData = MAPS[currentMapId];
      if (!mapData) return false;

      const { x, y } = tile;
      if (x < 0 || x >= mapData.width || y < 0 || y >= mapData.height) {
        return false;
      }

      const row = mapData.tiles[y];
      if (!row) return false;

      const tileData = row[x];
      return tileData?.walkable ?? false;
    });

    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, [width, height, currentMapId]);

  // Update engine when map changes
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const mapData = MAPS[currentMapId];
    if (mapData) {
      engine.setMap(mapData);

      // Detect interior maps (have '-interior' suffix) and switch scene type
      const isInterior = currentMapId.includes('-interior');
      const targetSceneType = isInterior ? 'interior' : 'overworld';

      // Use smooth transition when switching between overworld and interior
      const currentSceneType = engine.getCurrentSceneType();
      if (currentSceneType !== targetSceneType) {
        engine.transitionToScene(targetSceneType);
      } else {
        // Same scene type, just update instantly (e.g., different interior rooms)
        engine.setSceneType(targetSceneType);
      }

      // Set scene buildings for vale-village (pseudo-3D layout)
      if (currentMapId === 'vale-village') {
        engine.setSceneBuildings(VALE_VILLAGE_SCENE_BUILDINGS);
      } else {
        // Clear scene buildings for other maps (use tile-based layout)
        engine.setSceneBuildings([]);
      }
    }
  }, [currentMapId]);

  // Update engine when player position changes (from store)
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.setPlayerPosition(playerPosition);
    lastTileRef.current = { ...playerPosition };
  }, [playerPosition]);

  // Update engine when facing changes
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.setPlayerFacing(facing);
  }, [facing]);

  // Update player unit when team changes
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const unitId = team?.units[0]?.id || 'adept';
    engine.setPlayerUnit(unitId);
  }, [team]);

  // Pause/resume engine based on screen state
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (isActive) {
      engine.resume();
    } else {
      engine.pause();
    }
  }, [isActive]);

  // Handle interaction with NPCs/triggers
  const handleInteraction = useCallback(() => {
    if (!map) return;

    const engine = engineRef.current;

    // First check SceneBuildings (for canvas-based pseudo-3D layout)
    if (engine) {
      const nearbyBuilding = engine['entityLayer']?.getNearbyBuilding?.();
      if (nearbyBuilding && nearbyBuilding.triggerId) {
        // Find the trigger in map data by ID
        const sceneTrigger = map.triggers.find(t => t.id === nearbyBuilding.triggerId);
        if (sceneTrigger) {
          handleTrigger(sceneTrigger);
          return;
        }
      }
    }

    // Fallback to tile-based triggers for backwards compatibility
    // Get facing position for interaction check
    const delta: Record<'up' | 'down' | 'left' | 'right', Position> = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };
    const facingPos = {
      x: playerPosition.x + delta[facing].x,
      y: playerPosition.y + delta[facing].y,
    };

    // Check for trigger at current position first
    let trigger = getTriggerAt(map, playerPosition);

    // If no trigger at current position, check adjacent position
    if (!trigger) {
      trigger = getTriggerAt(map, facingPos);
    }

    if (!trigger) return;

    // Filter battle triggers by story state
    let shouldTrigger = true;
    if (trigger.type === 'battle') {
      const encounterId = (trigger.data as { encounterId?: string }).encounterId;
      if (encounterId) {
        if (story.flags[encounterId] === true) {
          shouldTrigger = false;
        } else if (!isHouseUnlocked(story, encounterId)) {
          shouldTrigger = false;
        }
      }
    }

    if (shouldTrigger) {
      handleTrigger(trigger);
    }
  }, [map, playerPosition, facing, story, handleTrigger]);

  // Sync engine position back to store when tile changes
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !isActive) return;

    const syncInterval = setInterval(() => {
      const currentTile = engine.getPlayerTilePosition();
      const lastTile = lastTileRef.current;

      // Check if we've entered a new tile
      if (lastTile && (currentTile.x !== lastTile.x || currentTile.y !== lastTile.y)) {
        // Calculate movement direction
        let direction: 'up' | 'down' | 'left' | 'right' = 'down';
        const dx = currentTile.x - lastTile.x;
        const dy = currentTile.y - lastTile.y;

        if (Math.abs(dx) > Math.abs(dy)) {
          direction = dx > 0 ? 'right' : 'left';
        } else {
          direction = dy > 0 ? 'down' : 'up';
        }

        // Dispatch to store (this triggers collision checks and trigger handling)
        movePlayer(direction);
        lastTileRef.current = currentTile;
      }
    }, 100); // Check every 100ms

    return () => clearInterval(syncInterval);
  }, [isActive, movePlayer]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const engine = engineRef.current;
    if (!engine || !isActive) return;

    // Don't handle if typing in an input
    if ((e.target as HTMLElement).tagName === 'INPUT') return;

    const key = e.key;

    // Handle movement and interaction keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(key)) {
      e.preventDefault();
      engine.handleKeyDown(key);
    }

    // Handle interaction (Space/Enter)
    if (key === ' ' || key === 'Enter') {
      e.preventDefault();
      handleInteraction();
    }

    // Handle ESC for pause menu
    if (key === 'Escape') {
      e.preventDefault();
      openModal('pause');
    }

    // Toggle debug mode with backtick
    if (key === '`') {
      engine.setDebugMode(true);
    }
  }, [isActive, handleInteraction, openModal]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.handleKeyUp(e.key);

    if (e.key === '`') {
      engine.setDebugMode(false);
    }
  }, []);

  // Attach keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Calculate encounter rate display
  const encounterRatePercent = map?.encounterRate ? Math.round(map.encounterRate * 100) : 0;
  const hasRandomEncounters = map?.encounterRate && map?.encounterPool && map.encounterPool.length > 0;

  return (
    <div class="overworld-shell">
      {/* Location Banner */}
      <div class="location-banner">
        <div class="location-title">{map?.name ?? 'Unknown'}</div>
        <div class="location-meta">
          {hasRandomEncounters && (
            <span class="location-chip">Encounters {encounterRatePercent}%</span>
          )}
          <span class="location-chip location-chip--ghost">ESC for pause menu</span>
        </div>
      </div>

      {/* Toolbox Helpers */}
      <ToolboxHelpers
        title="Overworld"
        actions={[
          {
            id: 'pause',
            label: 'Pause Menu',
            tooltip: 'Open pause (Esc)',
            onClick: () => openModal('pause'),
          },
          {
            id: 'help',
            label: 'How to Play',
            tooltip: 'Open how-to-play modal',
            onClick: () => openModal('help'),
          },
          {
            id: 'tower',
            label: 'Jump to Tower',
            tooltip: 'Jump to Battle Tower hub',
            onClick: () => startTransition('tower'),
          },
          {
            id: 'reset',
            label: 'Reset Position',
            tooltip: 'Teleport to Vale spawn',
            onClick: () => teleportPlayer('vale-village', MAPS['vale-village']?.spawnPoint ?? playerPosition),
          },
        ]}
        position="top-right"
      />

      {/* Canvas Stage */}
      <div class="overworld-stage">
        <div class="overworld-canvas-container">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            class="overworld-canvas"
          />
          {/* Sprite overlay for animated GIFs (Phase 3) */}
          <div class="sprite-overlay" />
        </div>
      </div>
    </div>
  );
}
