import { GameState } from './driver'; 
import { LevelBlueprint, EntityBlueprint } from './content';
import { ContentValidator } from './simulator';

export class LevelLoader {
  private blueprintMap: Map<string, EntityBlueprint>;

  constructor(blueprints: EntityBlueprint[]) {
    this.blueprintMap = new Map();
    // Only load VALID content
    blueprints.forEach(bp => {
      if (ContentValidator.isEntityBalanced(bp)) {
        this.blueprintMap.set(bp.id, bp);
      } else {
        console.error(`[Loader] Rejected blueprint: ${bp.id}`);
      }
    });
  }

  public loadLevel(level: LevelBlueprint, seed: number): Partial<GameState> {
    const enemies = level.entities.map((spawn, index) => {
      const blueprint = this.blueprintMap.get(spawn.blueprintId);
      if (!blueprint) return null;

      // MAPPING: Content Blueprint -> Driver Runtime State
      return {
        id: `e_${index}_${spawn.blueprintId}`,
        type: spawn.blueprintId,
        hp: blueprint.stats.maxHp, // Runtime HP starts at Max
        position: { x: spawn.x, y: spawn.y }
      };
    }).filter(e => e !== null);

    return {
      world: {
        levelId: level.id,
        timeElapsed: 0,
        enemies: enemies as any[] // Cast to match strict Driver schema
      },
      // Player is usually hydrated from a save file or default state elsewhere
    };
  }
}
