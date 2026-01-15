export interface EntityBlueprint {
  id: string; // e.g. "goblin_scout"
  metadata: {
    displayName: string;
    description: string;
  };
  stats: {
    maxHp: number;
    attack: number;
    speed: number; // Used for turn order calculations
  };
  behavior: {
    type: 'aggressive' | 'passive' | 'patrol';
    detectionRadius: number;
  };
}

export interface LevelBlueprint {
  id: string;
  layout: string[]; // ASCII map or grid reference
  entities: {
    blueprintId: string;
    x: number;
    y: number;
  }[];
}
