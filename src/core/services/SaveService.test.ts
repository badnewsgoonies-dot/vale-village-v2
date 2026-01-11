import { describe, it, expect, beforeEach } from "vitest";
import { getSaveSlotMetadata } from "./SaveService";

describe("SaveService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("reads chapter from save slot metadata", () => {
    const wrapper = {
      version: "1.0.0",
      timestamp: Date.now(),
      checksum: "fake",
      data: {
        version: "1.0.0",
        timestamp: Date.now(),
        chapter: 3,
        playerData: {
          unitsCollected: [{ level: 5 }],
          activeParty: ["u1"],
          inventory: [],
          gold: 0,
          djinnCollected: [],
          recruitmentFlags: {},
          storyFlags: {},
        },
        overworldState: {
          playerPosition: { x: 0, y: 0 },
          currentScene: "start",
          npcStates: {}
        },
        stats: {
          battlesWon: 0,
          battlesLost: 0,
          totalDamageDealt: 0,
          totalHealingDone: 0,
          playtime: 0
        }
      }
    };

    localStorage.setItem("vale_chronicles_v2_save_slot_0", JSON.stringify(wrapper));
    const meta = getSaveSlotMetadata(0);
    expect(meta.chapter).toBe(3);
  });
});
