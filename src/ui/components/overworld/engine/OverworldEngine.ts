/**
 * Overworld Engine
 * Main game loop and orchestrator for the canvas-based overworld renderer
 * Handles smooth movement, camera updates, and layer rendering
 */

import { Camera } from './Camera';
import {
  type Direction,
  type WorldPosition,
  type TilePosition,
  type InputState,
  type Layer,
  type EngineConfig,
  DEFAULT_ENGINE_CONFIG,
  tileToWorld,
  worldToTile,
  clamp,
} from './types';
import type { GameMap, Position } from '../../../../data/schemas/mapSchema';
import { SkyLayer } from '../layers/SkyLayer';
import { BackgroundLayer } from '../layers/BackgroundLayer';
import { TerrainLayer } from '../layers/TerrainLayer';
import { EntityLayer } from '../layers/EntityLayer';
import { InteriorFloorLayer } from '../layers/InteriorFloorLayer';
import { InteriorFurnitureLayer } from '../layers/InteriorFurnitureLayer';
import { ProximitySystem } from '../systems/ProximitySystem';
import { SceneTransition } from '../systems/SceneTransition';
import { TimeOfDay } from '../systems/TimeOfDay';
import type { SceneType } from '../systems/SceneTransition';

export class OverworldEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private camera: Camera;
  private config: EngineConfig;

  // Game loop state
  private running: boolean = false;
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;

  // Overworld layers
  private overworldLayers: Layer[] = [];
  private skyLayer: SkyLayer;
  private backgroundLayer: BackgroundLayer;
  private terrainLayer: TerrainLayer;
  private entityLayer: EntityLayer;

  // Interior layers
  private interiorLayers: Layer[] = [];
  private interiorFloorLayer: InteriorFloorLayer;
  private interiorFurnitureLayer: InteriorFurnitureLayer;

  // Active layers (switches between overworld/interior)
  private layers: Layer[] = [];

  // Systems
  private proximitySystem: ProximitySystem;
  private sceneTransition: SceneTransition;
  private timeOfDay: TimeOfDay;
  private currentSceneType: SceneType = 'overworld';

  // Player state (world pixel coordinates for smooth movement)
  private playerPos: WorldPosition = { x: 0, y: 0 };
  private playerFacing: Direction = 'down';
  private savedOverworldPos: WorldPosition | null = null; // Saved when entering interior
  // @ts-expect-error Used in Phase 3 for sprite selection
  private _playerUnitId: string = 'adept';
  private playerSpeed: number;

  // Input state for continuous movement
  private input: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    interact: false,
  };

  // Map data
  private mapData: GameMap | null = null;
  // @ts-expect-error Used in Phase 4 for interior rendering
  private _sceneType: 'overworld' | 'interior' = 'overworld';

  // Collision callback (provided by React component)
  private onCollisionCheck: ((pos: TilePosition) => boolean) | null = null;
  // @ts-expect-error Used in Phase 3 for interaction prompts
  private _onInteraction: (() => void) | null = null;

  // Debug mode
  private debugMode: boolean = false;

  constructor(canvas: HTMLCanvasElement, config: Partial<EngineConfig> = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D rendering context');
    }
    this.ctx = ctx;

    // Merge config with defaults
    this.config = { ...DEFAULT_ENGINE_CONFIG, ...config };
    this.playerSpeed = this.config.playerSpeed;

    // Initialize camera
    this.camera = new Camera(
      this.config.canvasWidth,
      this.config.canvasHeight,
      this.config.cameraFollowSpeed
    );

    // Initialize overworld layers
    this.skyLayer = new SkyLayer();
    this.backgroundLayer = new BackgroundLayer();
    this.terrainLayer = new TerrainLayer(300, this.config.canvasHeight);
    this.entityLayer = new EntityLayer();

    this.overworldLayers = [
      this.skyLayer,
      this.backgroundLayer,
      this.terrainLayer,
      this.entityLayer,
    ];

    // Initialize interior layers
    this.interiorFloorLayer = new InteriorFloorLayer();
    this.interiorFurnitureLayer = new InteriorFurnitureLayer();
    this.interiorFurnitureLayer.generateDefaultFurniture();

    this.interiorLayers = [
      this.interiorFloorLayer,
      this.interiorFurnitureLayer,
    ];

    // Start with overworld layers
    this.layers = this.overworldLayers;

    // Initialize systems
    this.proximitySystem = new ProximitySystem();
    this.proximitySystem.setTileSize(this.config.tileSize);

    this.sceneTransition = new SceneTransition();
    this.timeOfDay = new TimeOfDay();
    this.timeOfDay.setHour(10); // Start at 10 AM

    // Set tile size on layers that need it
    this.terrainLayer.setTileSize(this.config.tileSize);
    this.entityLayer.setTileSize(this.config.tileSize);

    // Set up canvas for pixel art rendering
    this.ctx.imageSmoothingEnabled = false;
  }

  // --- Lifecycle Methods ---

  /**
   * Start the game loop
   */
  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastFrameTime = performance.now();
    this.loop();
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Pause rendering (game loop continues but no updates)
   */
  pause(): void {
    this.running = false;
  }

  /**
   * Resume rendering
   */
  resume(): void {
    if (!this.running) {
      this.running = true;
      this.lastFrameTime = performance.now();
      this.loop();
    }
  }

  // --- State Setters (called by React component) ---

  /**
   * Set the current map data
   */
  setMap(map: GameMap): void {
    this.mapData = map;
    // Set world bounds based on map size
    const worldWidth = map.width * this.config.tileSize;
    const worldHeight = map.height * this.config.tileSize;
    this.camera.setWorldBounds(worldWidth, worldHeight);

    // Pass map data to layers and systems
    this.terrainLayer.setMap(map);
    this.entityLayer.setMapData(map);
    this.proximitySystem.setMapData(map);
  }

  /**
   * Set player position (from Zustand store - tile coordinates)
   * Converts to world coordinates for smooth movement
   */
  setPlayerPosition(pos: Position): void {
    const worldPos = tileToWorld(pos, this.config.tileSize);

    // If this is the initial position or teleport, snap immediately
    if (this.playerPos.x === 0 && this.playerPos.y === 0) {
      this.playerPos = { ...worldPos };
      this.camera.setTarget(worldPos.x, worldPos.y);
      this.camera.snapToTarget();
    }
    // Note: For smooth movement, the engine handles position updates internally
    // Store position syncs are for teleports/map changes only
  }

  /**
   * Set player facing direction
   */
  setPlayerFacing(dir: Direction): void {
    this.playerFacing = dir;
  }

  /**
   * Set player unit ID (for sprite selection)
   */
  setPlayerUnit(unitId: string): void {
    this._playerUnitId = unitId;
  }

  /**
   * Set scene type (overworld vs interior) - instant switch
   */
  setSceneType(type: 'overworld' | 'interior'): void {
    this._sceneType = type;
    this.currentSceneType = type;
    this.layers = type === 'overworld' ? this.overworldLayers : this.interiorLayers;
    this.sceneTransition.setScene(type);
  }

  /**
   * Transition to a new scene with fade effect
   */
  transitionToScene(type: SceneType, onComplete?: () => void): void {
    if (this.sceneTransition.isTransitioning()) return;

    // Save position when leaving overworld
    if (this.currentSceneType === 'overworld' && type === 'interior') {
      this.savedOverworldPos = { ...this.playerPos };
    }

    this.sceneTransition.startTransition(
      type,
      () => {
        // Scene change callback - switch layers
        this.currentSceneType = type;
        this._sceneType = type;
        this.layers = type === 'overworld' ? this.overworldLayers : this.interiorLayers;

        if (type === 'interior') {
          // Set player position at interior entrance (bottom center)
          const bounds = this.interiorFloorLayer.getRoomBounds();
          this.playerPos = {
            x: bounds.x + bounds.width / 2,
            y: bounds.y + bounds.height - 40,
          };
        } else if (type === 'overworld' && this.savedOverworldPos) {
          // Restore saved overworld position
          this.playerPos = { ...this.savedOverworldPos };
          this.savedOverworldPos = null;
        }
      },
      onComplete
    );
  }

  /**
   * Enter a building (transition to interior)
   */
  enterBuilding(): void {
    this.transitionToScene('interior');
  }

  /**
   * Exit building (transition to overworld)
   */
  exitBuilding(): void {
    this.transitionToScene('overworld');
  }

  // --- Time of Day Controls ---

  /**
   * Set time of day by hour (0-24)
   */
  setTimeOfDayHour(hour: number): void {
    this.timeOfDay.setHour(hour);
  }

  /**
   * Start/resume day-night cycle
   */
  startDayNightCycle(): void {
    this.timeOfDay.resume();
  }

  /**
   * Pause day-night cycle
   */
  pauseDayNightCycle(): void {
    this.timeOfDay.pause();
  }

  /**
   * Get current time info
   */
  getTimeInfo(): { hour: number; period: string; isNight: boolean } {
    return {
      hour: this.timeOfDay.getValue() * 24,
      period: this.timeOfDay.getPeriodName(),
      isNight: this.timeOfDay.isNight(),
    };
  }

  /**
   * Set collision check callback
   */
  setCollisionCheck(fn: (pos: TilePosition) => boolean): void {
    this.onCollisionCheck = fn;
  }

  /**
   * Set interaction callback
   */
  setInteractionCallback(fn: () => void): void {
    this._onInteraction = fn;
  }

  /**
   * Add a layer to the render stack
   */
  addLayer(layer: Layer): void {
    this.layers.push(layer);
    this.layers.sort((a, b) => a.zIndex - b.zIndex);
  }

  /**
   * Toggle debug mode
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  // --- Input Handling ---

  /**
   * Update input state (called from React component's key handlers)
   */
  setInput(input: Partial<InputState>): void {
    Object.assign(this.input, input);
  }

  /**
   * Handle key down event
   */
  handleKeyDown(key: string): void {
    switch (key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.input.up = true;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.input.down = true;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.input.left = true;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.input.right = true;
        break;
      case ' ':
      case 'Enter':
        this.input.interact = true;
        break;
    }
  }

  /**
   * Handle key up event
   */
  handleKeyUp(key: string): void {
    switch (key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.input.up = false;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.input.down = false;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.input.left = false;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.input.right = false;
        break;
      case ' ':
      case 'Enter':
        this.input.interact = false;
        break;
    }
  }

  // --- Game Loop ---

  private loop = (): void => {
    if (!this.running) return;

    const now = performance.now();
    const dt = now - this.lastFrameTime;
    this.lastFrameTime = now;

    this.update(dt);
    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    // Update systems
    this.sceneTransition.update(dt);
    this.timeOfDay.update(dt);

    // Pass time to layers that support it
    const timeValue = this.timeOfDay.getValue();
    this.skyLayer.setTimeOfDay(timeValue);
    this.entityLayer.setTimeOfDay(timeValue);

    // Don't process input during transitions
    if (!this.sceneTransition.isTransitioning()) {
      // Update player movement
      this.updatePlayerMovement(dt);
    }

    // Update camera to follow player
    this.camera.setTarget(this.playerPos.x, this.playerPos.y);
    this.camera.update(dt);

    // Sync player position based on current scene
    if (this.currentSceneType === 'overworld') {
      this.entityLayer.setPlayerPosition(
        this.playerPos,
        this.playerFacing,
        this._playerUnitId
      );

      // Update proximity system (overworld only)
      this.proximitySystem.update(dt);
      this.proximitySystem.checkProximity(this.playerPos);

      // Check for interaction input (SPACE/Enter)
      if (this.input.interact && this.proximitySystem.canInteract()) {
        const zone = this.proximitySystem.getNearestZone();
        if (zone && (zone.type === 'door' || zone.type === 'trigger')) {
          this.input.interact = false; // Consume input
          this.enterBuilding();
        }
      }
    } else {
      // Interior scene - sync to furniture layer
      this.interiorFurnitureLayer.setPlayerPosition(
        this.playerPos,
        this.playerFacing
      );
    }

    // Update layers
    for (const layer of this.layers) {
      layer.update?.(dt);
    }
  }

  private updatePlayerMovement(dt: number): void {
    // Calculate movement direction from input
    let dx = 0;
    let dy = 0;

    if (this.input.up) dy -= 1;
    if (this.input.down) dy += 1;
    if (this.input.left) dx -= 1;
    if (this.input.right) dx += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
    }

    // Update facing direction
    if (dx !== 0 || dy !== 0) {
      if (Math.abs(dx) > Math.abs(dy)) {
        this.playerFacing = dx > 0 ? 'right' : 'left';
      } else {
        this.playerFacing = dy > 0 ? 'down' : 'up';
      }
    }

    // Calculate new position
    const moveAmount = this.playerSpeed * (dt / 1000);
    const newX = this.playerPos.x + dx * moveAmount;
    const newY = this.playerPos.y + dy * moveAmount;

    // Different collision handling for overworld vs interior
    if (this.currentSceneType === 'interior') {
      // Interior: clamp to room bounds
      const bounds = this.interiorFloorLayer.getRoomBounds();
      const padding = 16; // Keep player away from walls

      this.playerPos.x = clamp(newX, bounds.x + padding, bounds.x + bounds.width - padding);
      this.playerPos.y = clamp(newY, bounds.y + padding, bounds.y + bounds.height - padding);

      // Check for exit zone (bottom center of room)
      const exitX = bounds.x + bounds.width / 2;
      const exitY = bounds.y + bounds.height;
      const distToExit = Math.sqrt(
        Math.pow(this.playerPos.x - exitX, 2) +
        Math.pow(this.playerPos.y - exitY, 2)
      );

      // If near exit and pressing down, trigger exit
      if (distToExit < 40 && this.input.down && !this.sceneTransition.isTransitioning()) {
        this.exitBuilding();
      }
    } else {
      // Overworld: check tile collision
      const newTile = worldToTile({ x: newX, y: newY }, this.config.tileSize);
      const canMove = this.checkCollision(newTile);

      if (canMove) {
        // Clamp to world bounds
        if (this.mapData) {
          const worldWidth = this.mapData.width * this.config.tileSize;
          const worldHeight = this.mapData.height * this.config.tileSize;
          const halfTile = this.config.tileSize / 2;

          this.playerPos.x = clamp(newX, halfTile, worldWidth - halfTile);
          this.playerPos.y = clamp(newY, halfTile, worldHeight - halfTile);
        } else {
          this.playerPos.x = newX;
          this.playerPos.y = newY;
        }
      }
    }
  }

  private checkCollision(tile: TilePosition): boolean {
    // Use callback if provided
    if (this.onCollisionCheck) {
      return this.onCollisionCheck(tile);
    }

    // Default: check map tile walkability
    if (!this.mapData) return true;

    const { x, y } = tile;
    if (x < 0 || x >= this.mapData.width || y < 0 || y >= this.mapData.height) {
      return false;
    }

    const row = this.mapData.tiles[y];
    if (!row) return false;

    const tileData = row[x];
    return tileData?.walkable ?? false;
  }

  // --- Rendering ---

  private render(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render layers
    for (const layer of this.layers) {
      layer.render(this.ctx, this.camera);
    }

    // Draw placeholder graphics if no layers
    if (this.layers.length === 0) {
      this.renderPlaceholder();
    }

    // Render proximity markers (overworld only)
    if (this.currentSceneType === 'overworld') {
      this.proximitySystem.render(this.ctx, this.camera);

      // Render ambient lighting overlay (night/dusk tint)
      const ambient = this.timeOfDay.getAmbientLighting();
      if (ambient.alpha > 0) {
        this.ctx.fillStyle = ambient.color;
        this.ctx.globalAlpha = ambient.alpha;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalAlpha = 1;
      }
    }

    // Render scene transition overlay (on top of everything)
    this.sceneTransition.render(this.ctx);

    // Debug overlay
    if (this.debugMode) {
      this.renderDebug();
    }
  }

  /**
   * Render placeholder graphics (Phase 1 - before visual layers)
   */
  private renderPlaceholder(): void {
    const ctx = this.ctx;

    // Sky background
    const skyGradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height * 0.5);
    skyGradient.addColorStop(0, '#5a8aa8');
    skyGradient.addColorStop(1, '#8ab8d0');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.5);

    // Ground
    ctx.fillStyle = '#4a7a4a';
    ctx.fillRect(0, this.canvas.height * 0.5, this.canvas.width, this.canvas.height * 0.5);

    // Grid (if map loaded)
    if (this.mapData && this.debugMode) {
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;

      const bounds = this.camera.getVisibleBounds();
      const startX = Math.floor(bounds.left / this.config.tileSize) * this.config.tileSize;
      const startY = Math.floor(bounds.top / this.config.tileSize) * this.config.tileSize;

      for (let x = startX; x <= bounds.right; x += this.config.tileSize) {
        const screenX = x - this.camera.x;
        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, this.canvas.height);
        ctx.stroke();
      }

      for (let y = startY; y <= bounds.bottom; y += this.config.tileSize) {
        const screenY = y - this.camera.y;
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(this.canvas.width, screenY);
        ctx.stroke();
      }
    }

    // Player placeholder (colored rectangle)
    const playerScreen = this.camera.worldToScreen(this.playerPos.x, this.playerPos.y);
    const playerSize = 28;
    const playerHeight = 36;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(
      playerScreen.x,
      playerScreen.y + 2,
      playerSize * 0.4,
      5,
      0, 0, Math.PI * 2
    );
    ctx.fill();

    // Player body
    ctx.fillStyle = '#3498db';
    ctx.fillRect(
      playerScreen.x - playerSize / 2,
      playerScreen.y - playerHeight,
      playerSize,
      playerHeight
    );

    // Direction indicator
    ctx.fillStyle = '#fff';
    const indicatorSize = 6;
    let indicatorX = playerScreen.x;
    let indicatorY = playerScreen.y - playerHeight / 2;

    switch (this.playerFacing) {
      case 'up':
        indicatorY = playerScreen.y - playerHeight - indicatorSize;
        break;
      case 'down':
        indicatorY = playerScreen.y + indicatorSize;
        break;
      case 'left':
        indicatorX = playerScreen.x - playerSize / 2 - indicatorSize;
        indicatorY = playerScreen.y - playerHeight / 2;
        break;
      case 'right':
        indicatorX = playerScreen.x + playerSize / 2 + indicatorSize;
        indicatorY = playerScreen.y - playerHeight / 2;
        break;
    }

    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, indicatorSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Render debug overlay
   */
  private renderDebug(): void {
    const ctx = this.ctx;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 100);

    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';

    const tile = worldToTile(this.playerPos, this.config.tileSize);

    ctx.fillText(`Player: (${this.playerPos.x.toFixed(1)}, ${this.playerPos.y.toFixed(1)})`, 20, 30);
    ctx.fillText(`Tile: (${tile.x}, ${tile.y})`, 20, 50);
    ctx.fillText(`Facing: ${this.playerFacing}`, 20, 70);
    ctx.fillText(`Camera: (${this.camera.x.toFixed(1)}, ${this.camera.y.toFixed(1)})`, 20, 90);
  }

  // --- Public Getters ---

  getPlayerPosition(): WorldPosition {
    return { ...this.playerPos };
  }

  getPlayerTilePosition(): TilePosition {
    return worldToTile(this.playerPos, this.config.tileSize);
  }

  getPlayerFacing(): Direction {
    return this.playerFacing;
  }

  getCamera(): Camera {
    return this.camera;
  }

  isRunning(): boolean {
    return this.running;
  }
}
