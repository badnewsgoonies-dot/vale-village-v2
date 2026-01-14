# Vale Village v2 - Juice & Polish Phase Plan
**Focus:** Feel, pacing, visual distinction - NOT new content
**Model:** claude-haiku-4.5 for workers
**Max Lanes:** 2 concurrent

## Context Files (Workers MUST read these first)
- `docs/encyclopedia/INDEX.md` - Project overview
- `docs/encyclopedia/ARCHITECTURE.md` - Code structure
- `src/ui/components/BattleActionMenu.tsx` - Current ability UI

---

## PHASE 1: Ability Visual Distinction
**Problem:** All abilities use same icon (ACTION_ICONS.abilities)
**Fix:** Use ELEMENT_ICONS and TYPE_ICONS already defined in BattleActionMenu.tsx

Files: `src/ui/components/BattleActionMenu.tsx`
- In AbilityGrid, replace `ACTION_ICONS.abilities` with element-based icon
- Add colored border/glow based on ability.element (Venus=amber, Mars=red, Mercury=blue, Jupiter=purple)
- Show ability.type as small badge (healing, damage, buff, debuff)

## PHASE 2: Reduce Starter Abilities
**Problem:** 6 abilities unlocked at level 1 is overwhelming
**Fix:** Start with 2 abilities, unlock others at levels 2-6

Files: `src/data/definitions/units.ts`
- Adept: Strike (L1), Earth Spike (L1), Stone Skin (L3), Ice Lance (L5), etc.
- War Mage: Strike (L1), Fireball (L1), others spread L2-6
- Mystic: Strike (L1), Heal (L1), others spread L2-6
- Ranger: Strike (L1), Gust (L1), others spread L2-6

## PHASE 3: Ability Menu Polish
**Problem:** Abilities are cramped 2-column grid with no hierarchy
**Fix:** Group by element, add visual separators

Files: `src/ui/components/BattleActionMenu.tsx`, `src/ui/styles/battle.css`
- Group abilities: "Venus Psynergy", "Mercury Psynergy", etc.
- Add element header with star icon before each group
- Larger touch targets, better spacing

## PHASE 4: Summon Menu Overhaul
**Problem:** Summon menu is barebones list
**Fix:** Show summon preview with power/description

Files: `src/ui/components/BattleActionMenu.tsx`
- Show summon sprite/icon when selecting djinn
- Display summon name, element, power level
- Add "Requires X Venus, Y Mars" cost display
- Animate selection feedback

## PHASE 5: Screen Transitions
**Problem:** Screens snap instantly, no breathing room
**Fix:** Add fade/slide transitions between major screens

Files: `src/ui/components/App.tsx`, `src/ui/styles/transitions.css`
- Add CSS transition classes (fade-in, slide-up)
- 200-300ms transitions between screens
- Battle start: dramatic fade to black then reveal

## PHASE 6: Battle Start Ceremony
**Problem:** Battle starts abruptly
**Fix:** Add "Battle Start" splash, enemy reveal

Files: `src/ui/components/QueueBattleView.tsx`, `src/ui/components/battle/BattlefieldV2.tsx`
- 1-second "Battle Start!" text overlay
- Enemies slide/fade in from right
- Party ready poses on left
- Short musical sting hook (interface only)

## PHASE 7: Turn Indicator Polish
**Problem:** Current turn indicator is subtle
**Fix:** Clear visual "Isaac's Turn" banner

Files: `src/ui/components/QueueBattleView.tsx`
- Add turn banner at top showing current unit name + portrait
- Pulse/glow effect on active unit
- Arrow or highlight pointing to acting unit

## PHASE 8: Djinn Panel Visibility
**Problem:** Djinn status/location unclear during battle
**Fix:** Add persistent djinn status bar

Files: `src/ui/components/battle/BattlefieldV2.tsx`, `src/ui/components/DjinnStatusBar.tsx` (new)
- Show equipped djinn as small icons below each unit
- Color code: Set (glowing), Standby (dim), Recovery (pulsing)
- Tap djinn icon for quick info

## PHASE 9: Victory/Defeat Polish
**Problem:** End screens are functional but flat
**Fix:** Add fanfare moments

Files: `src/ui/components/VictoryScreen/VictoryScreen.tsx`
- Staggered reveal: "Victory!" -> XP gains -> Loot drops
- Each reward line slides in with small delay
- Level up gets special celebration effect

## PHASE 10: Tutorial Pacing
**Problem:** No breathing in tutorial/intro
**Fix:** Add pauses, highlights, guided flow

Files: `src/data/definitions/dialogues.ts`, `src/ui/components/DialogueBox.tsx`
- Add `pause: 500` to dialogue definitions for dramatic beats
- Highlight UI elements being explained
- "Try attacking!" prompt waits for action before continuing

---

## Verification
After each phase:
1. `pnpm typecheck` must pass
2. `pnpm test` must pass
3. Manual spot-check the specific UI change
