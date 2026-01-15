/**
 * Game Introspection Contract (v1)
 * 
 * This interface defines the standard protocol for an Autonomous Game
 * to expose its internal state and control mechanisms to an AI Orchestrator
 * or Automated Agent.
 */

export type Vector2 = { x: number; y: number };

export type GameInput = 
  | { type: 'keydown'; key: string }
  | { type: 'keyup'; key: string }
  | { type: 'mousemove'; x: number; y: number }
  | { type: 'click'; x: number; y: number; button?: 'left' | 'right' };

export type TelemetryEvent = {
  timestamp: number;
  eventType: 'death' | 'level_complete' | 'damage_taken' | 'item_collected' | 'checkpoint' | 'error' | 'discovery';
  payload: Record<string, any>;
};

export interface IntrospectionContract {
  getMetaData(): {
    name: string;
    version: string;
    supportedFeatures: string[];
  };

  getState(): {
    timestamp: number;
    player: {
      position: Vector2;
      health: number;
      maxHealth: number;
      status: 'idle' | 'moving' | 'attacking' | 'dead';
      inventoryCount?: number;
    };
    level: {
      id: string;
      activeEnemies: number;
      isCompleted: boolean;
    };
    debug?: any;
  };

  sendInput(input: GameInput): void;

  reset(options?: { levelId?: string; seed?: number }): Promise<void>;

  onEvent(callback: (event: TelemetryEvent) => void): () => void;
}

declare global {
  interface Window {
    __GAME_INTROSPECTION__?: IntrospectionContract;
  }
}
