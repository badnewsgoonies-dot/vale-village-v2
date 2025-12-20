/**
 * Unit tests for StoryService
 * Tests encounter flag mapping for Djinn rewards
 */

import { describe, it, expect } from 'vitest';
import { createStoryState } from '../../../src/core/models/story';
import { createTeam } from '../../../src/core/models/Team';
import { createUnit } from '../../../src/core/models/Unit';
import { UNIT_DEFINITIONS } from '../../../src/data/definitions/units';
import { encounterIdToFlagKey, processStoryFlagForDjinn } from '../../../src/core/services/StoryService';

describe('StoryService', () => {
  it('grants Flint when completing the first house encounter', () => {
    const story = createStoryState();
    const unit = createUnit(UNIT_DEFINITIONS.blaze);
    const team = createTeam([unit]);

    const flagKey = encounterIdToFlagKey('house-02');
    const result = processStoryFlagForDjinn(story, team, flagKey, true);

    expect(flagKey).toBe('encounter:ch1:2');
    expect(result.djinnGranted).toBe('flint');
    expect(result.story.flags[flagKey]).toBe(true);
    expect(result.team.collectedDjinn).toContain('flint');
  });
});
