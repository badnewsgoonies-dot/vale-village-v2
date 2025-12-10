# Balance Simulation Scenarios

This document outlines various test scenarios for the deterministic battle simulator CLI. Each scenario describes an encounter, a player team template, and an expected win rate band, serving as a baseline for balance tuning and regression testing.

## Scenarios

### 1. Early Game Progression (House 1-3)

These scenarios test the very beginning of the game, focusing on tutorial encounters and early unit/Djinn acquisition. Players should have a very high win rate as they learn the mechanics.

*   **Scenario ID:** `early-game-h1`
    *   **Encounter ID:** `house-01` (VS1: Garet's Liberation)
    *   **Player Team Template:**
        *   Isaac (Adept, Venus) - Lv 1, Basic Equipment (Iron Sword, Leather Armor, Leather Cap), Flint Djinn (Set)
        *   Garet (War Mage, Mars) - Lv 1, Basic Equipment (Iron Axe, Leather Armor, Leather Cap), Forge Djinn (Set)
    *   **Expected Win Rate Band:** 95-100% (Tutorial, very easy)

*   **Scenario ID:** `early-game-h2`
    *   **Encounter ID:** `house-02` (The Bronze Trial)
    *   **Player Team Template:**
        *   Isaac (Adept, Venus) - Lv 2, Basic Equipment, Flint Djinn (Set)
        *   Garet (War Mage, Mars) - Lv 2, Basic Equipment, Forge Djinn (Set)
        *   Mystic (Mercury, Healer) - Lv 1, Basic Equipment (staff, robes)
    *   **Expected Win Rate Band:** 90-95% (Easy, introducing more units)

*   **Scenario ID:** `early-game-h3`
    *   **Encounter ID:** `house-03` (Iron Bonds)
    *   **Player Team Template:**
        *   Isaac (Adept, Venus) - Lv 3, Basic Equipment, Flint Djinn (Set)
        *   Garet (War Mage, Mars) - Lv 3, Basic Equipment, Forge Djinn (Set)
        *   Mystic (Mercury, Healer) - Lv 2, Basic Equipment
        *   Ranger (Jupiter, Rogue Assassin) - Lv 1, Basic Equipment (bow, leather armor)
    *   **Expected Win Rate Band:** 85-90% (Easy, full starting party)

### 2. Mid Game Progression (House 10-15)

These scenarios test mid-game challenges, including more complex enemy compositions, phase-change bosses, and the introduction of Tier 2 Djinn. Player strategy should start to matter more.

*   **Scenario ID:** `mid-game-h10`
    *   **Encounter ID:** `house-10` (The Burning Gauntlet - Flame Elemental phase boss)
    *   **Player Team Template:**
        *   Isaac (Adept, Venus) - Lv 8, Mid-tier Equipment, Flint, Granite Djinn (Set)
        *   Garet (War Mage, Mars) - Lv 8, Mid-tier Equipment, Forge, Corona Djinn (Set)
        *   Mystic (Mercury, Healer) - Lv 7, Mid-tier Equipment, Fizz, Tonic Djinn (Set)
        *   Ranger (Jupiter, Rogue Assassin) - Lv 7, Mid-tier Equipment, Breeze, Squall Djinn (Set)
        *   Blaze (Mars, Balanced Warrior) - Lv 6, Mid-tier Equipment
        *   Sentinel (Venus, Support Buffer) - Lv 6, Mid-tier Equipment
        *   Karis (Mercury, Versatile Scholar) - Lv 5, Mid-tier Equipment
    *   **Expected Win Rate Band:** 65-75% (Medium, requires adaptation to boss mechanics)

*   **Scenario ID:** `mid-game-h12-boss`
    *   **Encounter ID:** `house-12` (The Granite Fortress - Phoenix boss)
    *   **Player Team Template:**
        *   Isaac (Adept, Venus) - Lv 10, Mid-High Equipment, Flint, Granite Djinn (Set)
        *   Garet (War Mage, Mars) - Lv 10, Mid-High Equipment, Forge, Corona Djinn (Set)
        *   Mystic (Mercury, Healer) - Lv 9, Mid-High Equipment, Fizz, Tonic Djinn (Set)
        *   Ranger (Jupiter, Rogue Assassin) - Lv 9, Mid-High Equipment, Breeze, Squall Djinn (Set)
        *   Full roster (all 7 units recruited by H12)
    *   **Expected Win Rate Band:** 55-65% (Hard, significant challenge requiring Djinn strategy)

### 3. Late Game Progression (House 20+)

These scenarios test the endgame, featuring highly difficult boss encounters and requiring optimal team composition and Djinn management.

*   **Scenario ID:** `late-game-h20-finale`
    *   **Encounter ID:** `house-20` (The Overseer Falls - Final boss)
    *   **Player Team Template:**
        *   Full Roster (all 10 units), Lv 18-20, Best-in-Slot Equipment, All Djinn (Set)
    *   **Expected Win Rate Band:** 40-55% (Very Hard, demanding strategic play)

*   **Scenario ID:** `late-game-h28-ch2finale`
    *   **Encounter ID:** `house-28` (Draconic Convergence - Chapter 2 Finale)
    *   **Player Team Template:**
        *   Full Roster (all 10 units), Lv 25+, Best-in-Slot Equipment, All Djinn (Set)
    *   **Expected Win Rate Band:** 35-50% (Extreme, requires mastery of game mechanics)

### 4. Tower Floors Checkpoints

These scenarios represent specific checkpoints within the Endless Tower, testing player endurance and adaptability against varied enemy types.

*   **Scenario ID:** `tower-f05`
    *   **Encounter ID:** `tower-floor-05` (Placeholder: Mix of early-mid game enemies)
    *   **Player Team Template:**
        *   Core Party (Isaac, Garet, Mystic, Ranger), Lv 5, Basic-Mid Equipment, 4 Djinn (Set)
    *   **Expected Win Rate Band:** 70-80% (Moderate, first challenge in tower)

*   **Scenario ID:** `tower-f10`
    *   **Encounter ID:** `tower-floor-10` (Placeholder: Mid-game enemy types, potentially mini-boss)
    *   **Player Team Template:**
        *   Full Roster (all 7 units), Lv 10, Mid-tier Equipment, 6 Djinn (Set)
    *   **Expected Win Rate Band:** 55-65% (Challenging, endurance test)

*   **Scenario ID:** `tower-f15`
    *   **Encounter ID:** `tower-floor-15` (Placeholder: Late-game enemies, boss-level encounter)
    *   **Player Team Template:**
        *   Full Roster (all 10 units), Lv 15, High-tier Equipment, 8 Djinn (Set)
    *   **Expected Win Rate Band:** 45-55% (Very Hard, significant tactical demand)

---

**Note:** The `tower-floor-XX` encounter IDs are placeholders and assume the existence of corresponding encounters in `towerFloors.ts` (which was not available in the current audit scope). Player team templates are descriptive and assume the CLI will convert them to concrete unit instances. Expected win rate bands are initial estimates.
