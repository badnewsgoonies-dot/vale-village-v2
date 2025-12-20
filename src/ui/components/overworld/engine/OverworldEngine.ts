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
import { RoadLayer } from '../layers/RoadLayer';
import { TerrainLayer } from '../layers/TerrainLayer';
import { EntityLayer, type SceneBuilding } from '../layers/EntityLayer';
import { InteriorFloorLayer } from '../layers/InteriorFloorLayer';
import { InteriorFurnitureLayer } from '../layers/InteriorFurnitureLayer';
import { ProximitySystem } from '../systems/ProximitySystem';
import { SceneTransition } from '../systems/SceneTransition';
import { TimeOfDay } from '../systems/TimeOfDay';
import type { SceneType } from '../systems/SceneTransition';

// Re-export SceneBuilding for external use
export type { SceneBuilding } from '../layers/EntityLayer';

// --- Animation Types ---

/** Animated tree with sway effect */
interface AnimatedTree {
  img: HTMLImageElement | null;
  x: number;
  y: number;
  w: number;
  h: number;
  sway: number;
  loaded: boolean;
}

/** NPC with path animation */
interface AnimatedNPC {
  id: string;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  path: Array<{ x: number; y: number }>;
  pathIndex: number;
  targetX: number;
  targetY: number;
  spriteId: string;
}

/** Particle for weather/ambient effects */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'rain' | 'snow' | 'leaf';
  lifetime: number;
  rotation?: number;
  size?: number;
  length?: number;
}

/** Weather types */
type WeatherType = 'clear' | 'rain' | 'snow';

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

  // --- Animation State ---

  // Animated trees with sway effect
  private trees: AnimatedTree[] = [];

  // NPCs with path animation
  private animatedNPCs: AnimatedNPC[] = [];

  // Particle system
  private particles: Particle[] = [];
  private weather: WeatherType = 'clear';
  private particlesEnabled: boolean = true;
  private readonly MAX_PARTICLES = 500;

  // Animation time (seconds, for smooth animations)
  private time: number = 0;

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
    this.terrainLayer = new TerrainLayer(256, this.config.canvasHeight); // Start at 4/10 (256px)
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

    // Sync room config between floor and furniture layers
    const roomBounds = this.interiorFloorLayer.getRoomBounds();
    this.interiorFurnitureLayer.setRoomConfig({
      roomX: roomBounds.x,
      roomY: roomBounds.y,
      roomWidth: roomBounds.width,
      roomHeight: roomBounds.height,
    });

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
    this.terrainLayer.setCanvasSize(this.config.canvasWidth, this.config.canvasHeight);
    this.entityLayer.setTileSize(this.config.tileSize);

    // Set up canvas for pixel art rendering
    this.ctx.imageSmoothingEnabled = false;

    // Initialize animated trees
    this.initializeTrees();
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

    // Update furniture layout for house interiors
    const houseMatch = map.id.match(/^house-(\d+)-interior$/);
    if (houseMatch?.[1]) {
      const houseNum = parseInt(houseMatch[1], 10);
      this.interiorFurnitureLayer.generateHouseFurniture(houseNum);
    }
  }

  /**
   * Set scene buildings for pseudo-3D layout
   * Buildings at varied Y positions create depth illusion (higher Y = closer to viewer)
   */
  setSceneBuildings(buildings: SceneBuilding[]): void {
    this.entityLayer.setSceneBuildings(buildings);
    this.terrainLayer.setSceneMode(buildings.length > 0);
  }

  /**
   * Get nearby building (for interaction)
   */
  getNearbyBuilding(): SceneBuilding | null {
    return this.entityLayer.getNearbyBuilding();
  }

  /**
   * Check if in scene mode
   */
  isSceneMode(): boolean {
    return this.entityLayer.isSceneMode();
  }

  /**
   * Set player position (from Zustand store - tile coordinates)
   * Converts to world coordinates for smooth movement
   */
  setPlayerPosition(pos: Position): void {
    const worldPos = tileToWorld(pos, this.config.tileSize);

    const isInitial = this.playerPos.x === 0 && this.playerPos.y === 0;
    const dx = worldPos.x - this.playerPos.x;
    const dy = worldPos.y - this.playerPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const teleportSnapDistance = this.config.tileSize * 2;
    const shouldSnap = isInitial || dist > teleportSnapDistance;

    // If this is the initial position or a teleport, snap immediately.
    // Regular movement is owned by the engine (store sync is tile-based), so avoid per-tile snapping.
    if (shouldSnap) {
      this.playerPos = { ...worldPos };
      const cameraTargetY = this.entityLayer.isSceneMode()
        ? this.camera.viewportHeight / 2
        : worldPos.y;
      this.camera.setTarget(worldPos.x, cameraTargetY);
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
   * Note: Will be rejected if a transition is in progress
   */
  setSceneType(type: 'overworld' | 'interior'): void {
    // Guard: Don't switch scene type during active transition
    if (this.sceneTransition.isTransitioning()) {
      console.warn('Cannot setSceneType during active transition');
      return;
    }

    this._sceneType = type;
    this.currentSceneType = type;
    this.layers = type === 'overworld' ? this.overworldLayers : this.interiorLayers;
    this.sceneTransition.setScene(type);

    // Configure camera and position for interior scenes
    if (type === 'interior') {
      const bounds = this.interiorFloorLayer.getRoomBounds();
      if (!bounds) {
        console.error('getRoomBounds returned null - cannot configure interior');
        return;
      }

      // Set player at entrance if not already in interior
      if (this.playerPos.x === 0 && this.playerPos.y === 0) {
        this.playerPos = {
          x: bounds.x + bounds.width / 2,
          y: bounds.y + bounds.height - 40,
        };
      }

      // Center camera on room
      this.camera.setTarget(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
      this.camera.snapToTarget();
    }
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

          // Center camera on room for interior scenes (no camera follow)
          this.camera.setTarget(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
          this.camera.snapToTarget();
        } else if (type === 'overworld' && this.savedOverworldPos) {
          // Restore saved overworld position
          this.playerPos = { ...this.savedOverworldPos };
          this.savedOverworldPos = null;

          // Resume camera following player
          this.camera.setTarget(this.playerPos.x, this.playerPos.y);
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

  // --- Animation Initialization ---

  /**
   * Initialize animated trees with sway effect
   * Trees are rendered in renderTrees() method called from main render loop
   */
  private initializeTrees(): void {
    const treeSprites = [
      { src: '/sprites/scenery/plants/Tree1.gif', x: 80, y: 330, w: 60, h: 80, sway: 0 },
      { src: '/sprites/scenery/plants/Tree3.gif', x: 720, y: 290, w: 70, h: 90, sway: 0.5 },
      { src: '/sprites/scenery/plants/Small_Tree2.gif', x: 200, y: 490, w: 50, h: 60, sway: 1.2 },
      { src: '/sprites/scenery/plants/Tree5.gif', x: 850, y: 450, w: 60, h: 80, sway: 0.8 },
      { src: '/sprites/scenery/plants/Tree2.gif', x: 450, y: 310, w: 70, h: 90, sway: 1.5 },
    ];

    // Store trees for future rendering implementation
    void (this.trees = treeSprites.map((t) => {
      const img = new Image();
      img.src = t.src;
      const tree: AnimatedTree = {
        img: null,
        x: t.x,
        y: t.y,
        w: t.w,
        h: t.h,
        sway: t.sway,
        loaded: false,
      };
      img.onload = () => {
        tree.img = img;
        tree.loaded = true;
      };
      return tree;
    }));
  }

  /**
   * Initialize NPCs with path animation
   */
  initializeAnimatedNPCs(npcs: Array<{ id: string; x: number; y: number; spriteId: string; path: Array<{ x: number; y: number }> }>): void {
    this.animatedNPCs = npcs.map((npc) => ({
      id: npc.id,
      x: npc.x,
      y: npc.y,
      baseX: npc.x,
      baseY: npc.y,
      path: npc.path.length > 0 ? npc.path : [{ x: 0, y: 0 }],
      pathIndex: 0,
      targetX: npc.x + (npc.path[0]?.x ?? 0),
      targetY: npc.y + (npc.path[0]?.y ?? 0),
      spriteId: npc.spriteId,
    }));
  }

  // --- Weather Controls ---

  /**
   * Set weather type (clear, rain, snow)
   */
  setWeather(weather: WeatherType): void {
    this.weather = weather;
  }

  /**
   * Toggle particles enabled
   */
  setParticlesEnabled(enabled: boolean): void {
    this.particlesEnabled = enabled;
  }

  /**
   * Get current weather type
   */
  getWeather(): WeatherType {
    return this.weather;
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
    // Clamp dt to prevent physics explosions on lag spikes or tab-switch
    // Max 100ms (10 FPS minimum), min 0ms (no negative time)
    const rawDt = now - this.lastFrameTime;
    const dt = Math.max(0, Math.min(rawDt, 100));
    this.lastFrameTime = now;

    this.update(dt);
    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    // Update animation time (convert ms to seconds)
    this.time += dt * 0.001;

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

    // Update camera - only follow player in overworld mode
    if (this.currentSceneType === 'overworld') {
      if (this.entityLayer.isSceneMode()) {
        // Scene mode uses art-directed screen-space Y for buildings; keep camera vertical scroll locked.
        this.camera.setTarget(this.playerPos.x, this.camera.viewportHeight / 2);
      } else {
        this.camera.setTarget(this.playerPos.x, this.playerPos.y);
      }
      this.camera.update(dt);
    } else {
      // Interior mode - keep camera centered on room
      const bounds = this.interiorFloorLayer.getRoomBounds();
      this.camera.setTarget(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
      this.camera.update(dt);
    }

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
      if (this.input.interact) {
        // First check SceneBuildings (EntityLayer proximity)
        const nearbyBuilding = this.entityLayer.getNearbyBuilding();
        if (nearbyBuilding) {
          this.input.interact = false; // Consume input
          this.enterBuilding(); // Will use nearbyBuilding.triggerId
        }
        // Then check ProximitySystem for tile-based triggers
        else if (this.proximitySystem.canInteract()) {
          const zone = this.proximitySystem.getNearestZone();
          if (zone && (zone.type === 'door' || zone.type === 'trigger')) {
            this.input.interact = false; // Consume input
            this.enterBuilding();
          }
        }
      }

      // Update NPC path animation
      this.updateNPCPaths();

      // Update particle system
      this.updateParticles();
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

  /**
   * Update NPC path animation
   */
  private updateNPCPaths(): void {
    const NPC_SPEED = 0.5; // pixels per frame

    for (const npc of this.animatedNPCs) {
      const dx = npc.targetX - npc.x;
      const dy = npc.targetY - npc.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 2) {
        // Reached waypoint, advance to next
        npc.pathIndex = (npc.pathIndex + 1) % npc.path.length;
        const waypoint = npc.path[npc.pathIndex];
        if (waypoint) {
          npc.targetX = npc.baseX + waypoint.x;
          npc.targetY = npc.baseY + waypoint.y;
        }
      } else {
        // Move toward target
        npc.x += (dx / dist) * NPC_SPEED;
        npc.y += (dy / dist) * NPC_SPEED;
      }
    }
  }

  /**
   * Update particle system
   */
  private updateParticles(): void {
    if (!this.particlesEnabled) return;

    // Spawn new particles based on weather
    this.spawnParticles();

    // Update existing particles
    this.particles = this.particles.filter((p) => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Update lifetime
      p.lifetime -= 0.001;

      // Update rotation for leaves
      if (p.type === 'leaf' && p.rotation !== undefined) {
        p.rotation += 0.02;
        p.vx += (Math.random() - 0.5) * 0.1;
      }

      // Keep particle if still visible and alive
      return p.y < this.config.canvasHeight && p.lifetime > 0;
    });

    // Limit particle count
    if (this.particles.length > this.MAX_PARTICLES) {
      this.particles = this.particles.slice(-this.MAX_PARTICLES);
    }
  }

  /**
   * Spawn new particles based on weather type
   */
  private spawnParticles(): void {
    if (this.weather === 'rain' && Math.random() < 0.3) {
      this.particles.push({
        x: Math.random() * this.config.canvasWidth,
        y: -10,
        vx: -1,
        vy: 5 + Math.random() * 3,
        type: 'rain',
        lifetime: 1,
        length: 10 + Math.random() * 5,
      });
    } else if (this.weather === 'snow' && Math.random() < 0.15) {
      this.particles.push({
        x: Math.random() * this.config.canvasWidth,
        y: -10,
        vx: Math.random() * 0.5 - 0.25,
        vy: 0.5 + Math.random(),
        type: 'snow',
        lifetime: 1,
        size: 2 + Math.random() * 2,
      });
    } else if (this.weather === 'clear' && Math.random() < 0.02) {
      this.particles.push({
        x: Math.random() * this.config.canvasWidth,
        y: -10,
        vx: Math.random() * 2 - 1,
        vy: 0.5 + Math.random() * 0.5,
        type: 'leaf',
        lifetime: 1,
        size: 3 + Math.random() * 3,
        rotation: Math.random() * Math.PI * 2,
      });
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

    // In scene mode, compensate for stretched aspect ratio
    // World is 4032×240, canvas is 960×640
    // Y movement appears ~11x faster on screen, so scale it down
    if (this.entityLayer.isSceneMode()) {
      const worldAspect = (this.mapData?.width ?? 84) * this.config.tileSize /
                          ((this.mapData?.height ?? 5) * this.config.tileSize);
      const canvasAspect = this.config.canvasWidth / this.config.canvasHeight;
      const yScale = canvasAspect / worldAspect; // ~0.089
      dy *= yScale;
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

    // Render proximity markers (overworld only, skip in scene mode)
    if (this.currentSceneType === 'overworld') {
      // Render animated trees with sway
      this.renderTrees();

      // Skip tile-based proximity markers in scene mode (EntityLayer handles it)
      if (!this.entityLayer.isSceneMode()) {
        this.proximitySystem.render(this.ctx, this.camera);
      }

      // Render particles
      this.renderParticles();

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
        const screenX = x - this.camera.getRenderX();
        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, this.canvas.height);
        ctx.stroke();
      }

      for (let y = startY; y <= bounds.bottom; y += this.config.tileSize) {
        const screenY = y - this.camera.getRenderY();
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

    const tile = worldToTile(this.playerPos, this.config.tileSize);
    const isSceneMode = this.entityLayer.isSceneMode();
    const cameraRenderX = this.camera.getRenderX();
    const cameraRenderY = this.camera.getRenderY();

    const worldWidthPx = this.mapData ? this.mapData.width * this.config.tileSize : null;
    const worldHeightPx = this.mapData ? this.mapData.height * this.config.tileSize : null;

    const lines: string[] = [
      `Scene: ${this.currentSceneType}${isSceneMode ? ' (sceneMode)' : ''}`,
      `Player W: (${this.playerPos.x.toFixed(1)}, ${this.playerPos.y.toFixed(1)})`,
      `Tile: (${tile.x}, ${tile.y})  Facing: ${this.playerFacing}`,
      `Camera W: (${this.camera.x.toFixed(2)}, ${this.camera.y.toFixed(2)})`,
      `Camera R: (${cameraRenderX}, ${cameraRenderY})`,
    ];

    if (isSceneMode && worldHeightPx && worldHeightPx > 0) {
      const playerSceneY = (this.playerPos.y / worldHeightPx) * this.config.canvasHeight;
      const sceneScaleY = this.config.canvasHeight / worldHeightPx;
      lines.push(`Player S: y=${playerSceneY.toFixed(1)}  scaleY=${sceneScaleY.toFixed(3)}`);

      if (worldWidthPx && worldWidthPx > 0) {
        const worldAspect = worldWidthPx / worldHeightPx;
        const canvasAspect = this.config.canvasWidth / this.config.canvasHeight;
        const inputYScale = canvasAspect / worldAspect;
        lines.push(`Input yScale: ${inputYScale.toFixed(3)}`);
      }
    }

    if (worldWidthPx && worldHeightPx) {
      lines.push(`World: ${worldWidthPx}×${worldHeightPx}px  (tile=${this.config.tileSize})`);
    }

    const paddingX = 10;
    const paddingY = 10;
    const lineHeight = 16;
    const boxWidth = 360;
    const boxHeight = paddingY * 2 + lines.length * lineHeight;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, boxWidth, boxHeight);

    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';

    let y = 10 + paddingY + 12;
    for (const line of lines) {
      ctx.fillText(line, 10 + paddingX, y);
      y += lineHeight;
    }
  }

  /**
   * Render animated trees with sway effect
   */
  private renderTrees(): void {
    const ctx = this.ctx;

    for (const tree of this.trees) {
      // Calculate sway offset
      const swayOffset = Math.sin(this.time * 0.5 + tree.sway) * 3;

      // Get screen position
      const screenPos = this.camera.worldToScreen(tree.x, tree.y);

      // Draw shadow
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(
        screenPos.x + tree.w * 0.5,
        screenPos.y + tree.h + 5,
        tree.w * 0.6,
        8,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();

      // Draw tree with sway
      ctx.save();
      ctx.translate(screenPos.x + tree.w * 0.5 + swayOffset, screenPos.y);

      if (tree.loaded && tree.img) {
        ctx.drawImage(tree.img, -tree.w * 0.5, 0, tree.w, tree.h);
      } else {
        // Fallback placeholder tree
        ctx.fillStyle = '#6a5840';
        ctx.fillRect(-4, tree.h * 0.6, 8, tree.h * 0.4);
        ctx.fillStyle = '#5a7850';
        ctx.beginPath();
        ctx.arc(0, tree.h * 0.3, tree.w * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  /**
   * Render particles (rain, snow, leaves)
   */
  private renderParticles(): void {
    const ctx = this.ctx;

    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.lifetime;

      if (p.type === 'rain') {
        // Draw rain as blue line
        ctx.strokeStyle = '#5090d8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 2, p.y - p.vy);
        ctx.stroke();
      } else if (p.type === 'snow') {
        // Draw snow as white circle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size ?? 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'leaf') {
        // Draw leaf as green square with rotation
        ctx.fillStyle = '#7aa880';
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation ?? 0);
        const size = p.size ?? 4;
        ctx.fillRect(-size / 2, -size / 2, size, size);
      }

      ctx.restore();
    }
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

  getCurrentSceneType(): SceneType {
    return this.currentSceneType;
  }
}
