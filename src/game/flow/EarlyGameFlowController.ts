import type { StoryState } from '@/core/models/story';
import { setFlag } from '@/core/models/story';

export const EARLY_GAME_FLOW_FLAGS = {
  firstHouseEntrySeen: 'early_first_house_entry_seen',
  firstHouseEntryHouseNum: 'early_first_house_entry_house_num',
  djinnIntroCompleted: 'first_djinn_intro_completed',
} as const;

export const EARLY_GAME_FLOW_IDS = {
  djinnIntroDialogueId: 'tutorial:djinn-intro',
  npcIntroBattleEncounterId: 'house-01',
} as const;

export type EarlyGameHouseEntryAction =
  | { kind: 'allow-entry' }
  | { kind: 'start-dialogue'; dialogueId: string; reason: 'djinn-intro' | 'npc-intro-battle' };

export type FirstHouseEntryResult = {
  story: StoryState;
  changed: boolean;
  houseNum: number | null;
};

const isBooleanFlagTrue = (story: StoryState, key: string): boolean => story.flags[key] === true;

const getNumberFlag = (story: StoryState, key: string): number | null => {
  const value = story.flags[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
};

export function parseHouseNumFromHouseId(houseId: string): number | null {
  const match = /^house-(\d{2})$/.exec(houseId);
  if (!match?.[1]) return null;
  const houseNum = parseInt(match[1], 10);
  return Number.isFinite(houseNum) && houseNum >= 1 ? houseNum : null;
}

export function getHouseEnemyDialogueIdFromHouseId(houseId: string): string {
  return `${houseId}-enemy`;
}

export class EarlyGameFlowController {
  static isDjinnIntroCompleted(story: StoryState): boolean {
    return isBooleanFlagTrue(story, EARLY_GAME_FLOW_FLAGS.djinnIntroCompleted);
  }

  static markDjinnIntroCompleted(story: StoryState): { story: StoryState; changed: boolean } {
    if (EarlyGameFlowController.isDjinnIntroCompleted(story)) {
      return { story, changed: false };
    }
    return { story: setFlag(story, EARLY_GAME_FLOW_FLAGS.djinnIntroCompleted, true), changed: true };
  }

  static hasRecordedFirstHouseEntry(story: StoryState): boolean {
    return isBooleanFlagTrue(story, EARLY_GAME_FLOW_FLAGS.firstHouseEntrySeen);
  }

  static getFirstHouseEntryHouseNum(story: StoryState): number | null {
    return getNumberFlag(story, EARLY_GAME_FLOW_FLAGS.firstHouseEntryHouseNum);
  }

  static recordFirstHouseEntry(story: StoryState, houseId: string): FirstHouseEntryResult {
    const houseNum = parseHouseNumFromHouseId(houseId);
    if (houseNum === null) {
      return { story, changed: false, houseNum: null };
    }

    const hasSeen = EarlyGameFlowController.hasRecordedFirstHouseEntry(story);
    const existingNum = EarlyGameFlowController.getFirstHouseEntryHouseNum(story);
    const needsSeen = !hasSeen;
    const needsNum = existingNum === null;

    if (!needsSeen && !needsNum) {
      return { story, changed: false, houseNum: existingNum };
    }

    let next = story;
    if (needsSeen) {
      next = setFlag(next, EARLY_GAME_FLOW_FLAGS.firstHouseEntrySeen, true);
    }
    if (needsNum) {
      next = setFlag(next, EARLY_GAME_FLOW_FLAGS.firstHouseEntryHouseNum, houseNum);
    }
    return { story: next, changed: true, houseNum };
  }

  /**
   * Centralized gate for the "intro NPC battle" (House 1 enemy encounter).
   * Completion is tracked via the canonical encounter flag (e.g. `house-01`).
   */
  static isNpcIntroBattleCompleted(story: StoryState, encounterId: string = EARLY_GAME_FLOW_IDS.npcIntroBattleEncounterId): boolean {
    return story.flags[encounterId] === true;
  }

  static isNpcIntroBattleEligible(
    story: StoryState,
    params: {
      encounterId?: string;
      requireDjinnIntroCompleted?: boolean;
    } = {}
  ): boolean {
    const encounterId = params.encounterId ?? EARLY_GAME_FLOW_IDS.npcIntroBattleEncounterId;
    const requireDjinnIntroCompleted = params.requireDjinnIntroCompleted ?? true;

    if (requireDjinnIntroCompleted && !EarlyGameFlowController.isDjinnIntroCompleted(story)) {
      return false;
    }

    if (EarlyGameFlowController.isNpcIntroBattleCompleted(story, encounterId)) {
      return false;
    }

    return true;
  }

  /**
   * Idempotent "attempted house entry" gate.
   * - Records the first-ever house entry attempt (for early-game tutorial sequencing).
   * - For House 1:
   *   - If Djinn intro is not complete, starts Djinn intro instead of entering.
   *   - Else if the intro NPC battle is still eligible, starts the house enemy dialogue instead of entering.
   * - Otherwise, allows entry.
   */
  static onAttemptEnterHouse(story: StoryState, houseId: string): { story: StoryState; action: EarlyGameHouseEntryAction } {
    const recorded = EarlyGameFlowController.recordFirstHouseEntry(story, houseId);
    const nextStory = recorded.story;

    if (houseId === EARLY_GAME_FLOW_IDS.npcIntroBattleEncounterId) {
      if (!EarlyGameFlowController.isDjinnIntroCompleted(nextStory)) {
        return {
          story: nextStory,
          action: {
            kind: 'start-dialogue',
            dialogueId: EARLY_GAME_FLOW_IDS.djinnIntroDialogueId,
            reason: 'djinn-intro',
          },
        };
      }

      if (EarlyGameFlowController.isNpcIntroBattleEligible(nextStory)) {
        return {
          story: nextStory,
          action: {
            kind: 'start-dialogue',
            dialogueId: getHouseEnemyDialogueIdFromHouseId(EARLY_GAME_FLOW_IDS.npcIntroBattleEncounterId),
            reason: 'npc-intro-battle',
          },
        };
      }
    }

    return { story: nextStory, action: { kind: 'allow-entry' } };
  }
}