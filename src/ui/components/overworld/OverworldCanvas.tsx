/**
 * OverworldCanvas
 * React wrapper component for the canvas-based overworld renderer
 * Handles store subscription and lifecycle management
 */

import { useRef, useEffect, useCallback } from 'preact/hooks';
import { useStore } from '../../state/store';
import { useGameStore } from '../../../store/gameStore';
import { OverworldEngine } from './engine/OverworldEngine';
import { MAPS } from '../../../data/definitions/maps';
import type { TilePosition } from './engine/types';
import type { OverworldSlice } from '../../state/overworldSlice';
import type { GameStore } from '../../../store/gameStore';
import './OverworldCanvas.css';

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

  // Subscribe to game flow store
  const screen = useGameStore((s: GameStore) => s.flow.screen);
  const modal = useGameStore((s: GameStore) => s.flow.modal);

  // Check if we should be active
  const isActive = screen === 'overworld' && modal === null;

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
      const map = MAPS[currentMapId];
      if (!map) return false;

      const { x, y } = tile;
      if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
        return false;
      }

      const row = map.tiles[y];
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

    const map = MAPS[currentMapId];
    if (map) {
      engine.setMap(map);
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
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', ' ', 'Enter'].includes(key)) {
      e.preventDefault();
      engine.handleKeyDown(key);
    }

    // Toggle debug mode with backtick
    if (key === '`') {
      engine.setDebugMode(true);
    }
  }, [isActive]);

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

  return (
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
  );
}
