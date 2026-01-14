# Vale Village v2 - Expansion Phase Plan (1-50)
**Model:** claude-haiku-4.5 for workers
**Max Lanes:** 2 concurrent
**Encyclopedia:** docs/encyclopedia/ (MUST READ FIRST)

## Context Files (Workers MUST read these first)
- `docs/encyclopedia/INDEX.md` - Project overview
- `docs/encyclopedia/ARCHITECTURE.md` - Code structure  
- `docs/encyclopedia/PATTERNS.md` - Coding patterns
- `GAME_MECHANICS.md` - Game balance rules

---

## PHASE 1-5: Fix Existing Issues
1. Fix TypeScript errors in src/ui/sprites/Sprite.tsx (JSX types)
2. Fix battleSprites.ts implicit any type
3. Fix module import errors in tests
4. Fix ambient-zustand.ts integration
5. Run full test suite - ensure passing

## PHASE 6-15: Content Expansion - Enemies
6. Add 10 new enemy types with unique abilities
7. Create enemy sprite mappings for new enemies
8. Implement enemy AI patterns (aggressive, defensive, support)
9. Add enemy status resistances per type
10. Create mini-boss variants of existing enemies
11. Add elemental enemy weaknesses/resistances
12. Implement enemy group compositions
13. Add special attack patterns
14. Create enemy loot tables
15. Test all new enemies in battle

## PHASE 16-25: Content Expansion - Abilities & Items
16. Add 15 new player abilities across elements
17. Create ability combo system
18. Add ultimate abilities per character class
19. Implement buff/debuff stacking rules
20. Add 20 new equipment pieces
21. Create equipment set bonuses
22. Implement accessory effects
23. Add consumable items with battle effects
24. Create rare drop equipment
25. Test ability and item balance

## PHASE 26-35: Tower Mode Expansion
26. Add 5 new tower floor types
27. Create tower-specific enemy encounters
28. Implement tower progression rewards
29. Add tower challenge modifiers
30. Create tower boss encounters
31. Implement tower leaderboard scoring
32. Add tower daily/weekly challenges
33. Create tower achievement system
34. Implement tower save points
35. Test tower mode end-to-end

## PHASE 36-45: UI & Polish
36. Improve battle animations
37. Add particle effects for abilities
38. Create victory/defeat screens polish
39. Add sound effect triggers (interface only)
40. Improve menu transitions
41. Add tutorial tooltips
42. Create loading screen tips
43. Improve mobile touch controls
44. Add accessibility features
45. Polish overworld navigation

## PHASE 46-50: Integration & Testing
46. Full regression test suite
47. Performance optimization pass
48. Memory leak audit
49. Cross-browser compatibility check
50. Final build and documentation update

