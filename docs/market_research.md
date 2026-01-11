# Market Research: JRPG / RPG Candidates

Required deliverables: For each game include 3 mechanics (bulleted), 3 clips (early, mid, boss) with timestamps/URLs, and a short analysis paragraph for each clip. Flag missing clips with [web-lookup-blocked].

This document lists JRPG/RPG titles relevant to Vale Village v2's design profile. Each entry includes Overview, Core Mechanics, Design Takeaways, and a standardized Mechanical Breakdown (Turn Economy, Stat Progression, Exploration Flow) to allow direct comparison.

---

1) Golden Sun (Camelot / Nintendo)
- URL: https://en.wikipedia.org/wiki/Golden_Sun  [1]
- Overview: Classic late-GBA JRPG blending overworld exploration, puzzle-driven dungeons, and a party resource system (Djinn) that meaningfully alters combat roles and stats.
- Core Mechanics:
  - Elemental "Djinn" collection and configuration that modifies stats and unlocks class-like combinations.
  - Puzzle integration into dungeons that requires environmental manipulation and item/ability synergy outside combat.
  - Turn-based combat with emphasis on party roles and resource management between exploration and battles.
- Design Takeaways: Use a persistent, collectible system that influences both exploration and combat to create meaningful player choices; design puzzles that reward exploration and connect to combat mechanics. (source: [1])
- Mechanical Breakdown:
  - Turn Economy: Standard turn-based actions with strong meta-resource (Djinn) management; Djinn set/consume actions change pacing by providing temporary power shifts and summons (evidence: in-battle Djinn commands and summon windows).
  - Stat Progression: Stats are altered both by equipment and Djinn assignments (hybrid class-like progression), enabling flexible builds without rigid class locks.
  - Exploration Flow: Dungeons double as puzzles; progression gating via puzzle items/abilities encourages backtracking and revisiting areas when new Djinn/powers are acquired.

---

2) Chrono Trigger (Square / Enix)
- URL: https://en.wikipedia.org/wiki/Chrono_Trigger  [2]
- Overview: Highly regarded for pacing, encounter design, and low-friction flow between exploration and combat with visible overworld encounters and combo mechanics.
- Core Mechanics:
  - Visible enemies in the overworld reducing repetitive random-encounter friction.
  - Tech combination system where character actions can chain into powerful joint attacks.
  - Multiple endings and event-driven pacing that ties player choice to mechanical consequences.
- Design Takeaways: Favor visible encounters and seamless battle entry to maintain momentum; design simple but expressive combo systems to reward party composition and timing. (source: [2])
- Mechanical Breakdown:
  - Turn Economy: Traditional ATB-less turn system but notable for tech-combo timing — some actions combine into larger effects, encouraging planning around partner timing.
  - Stat Progression: Linear leveling with equipment choices; emphasis on learning and using techs rather than deep stat min-maxing.
  - Exploration Flow: Open traversal between eras and visible encounters keeps exploration momentum high and reduces friction from repeated random battles.

---

3) Final Fantasy VI (Square / Enix)
- URL: https://en.wikipedia.org/wiki/Final_Fantasy_VI  [3]
- Overview: Deep party systems with unique character abilities and narrative-driven mechanical shifts (e.g., ensemble set-piece battles).
- Core Mechanics:
  - Distinct character abilities that define roles (e.g., magic/tech/unique tools) and change how encounters are approached.
  - Magic/item economy and equipment choices that shape build diversity.
  - Scripted, dramatic battles that alter available mechanics and create memorable mechanical moments.
- Design Takeaways: Give characters mechanically distinct identities and create narrative beats that change or spotlight mechanics for heightened player engagement. (source: [3])
- Mechanical Breakdown:
  - Turn Economy: Classic turn-based structure; some encounters script restrictions or unique phases which temporarily change available actions and pacing.
  - Stat Progression: Leveling + equipment + magic (espers) that alter stat growth and abilities—offers long-term build variety.
  - Exploration Flow: Strong narrative beats interleave exploration and mechanical shifts (party changes, gear drops) to keep progression feeling meaningful.

---

4) Octopath Traveler (Square Enix)
- URL: https://store.steampowered.com/app/921260/Octopath_Traveler/  [4]
- Overview: Modern HD-2D JRPG emphasizing clear combat feedback, distinct job-like characters, and tactical encounters that reward exploiting weaknesses.
- Core Mechanics:
  - Break/Boost combat system that rewards exploiting enemy weaknesses to stagger and gain extra turns.
  - Distinct path actions and chapter-based progression allowing modular narrative play.
  - High emphasis on audiovisual clarity for signalling combat state and feedback.
- Design Takeaways: Prioritize clear combat feedback and tactical systems that reward planning; use presentation to make mechanical states readable. (source: [4])
- Mechanical Breakdown:
  - Turn Economy: Break/Boost modifies turn sequencing—forcing players to open and exploit a vulnerability to gain tempo advantages.
  - Stat Progression: Job-like character roles with talent trees and equipment, encouraging clear role separation and build telegraphing.
  - Exploration Flow: Chapter-based chapters isolate narrative scope; path actions enable environmental interaction but generally keep exploration structured and readable.

---

5) Chained Echoes (Stepico Games) — modern indie
- URL: https://store.steampowered.com/app/1261310/Chained_Echoes/  [5]
- Overview: Indie JRPG inspired by SNES-era design, combining classic turn-based combat with modern QoL and concise encounter design.
- Core Mechanics:
  - Turn-based combat with layered abilities and concise menus that speed pacing.
  - Visible encounters and focused enemy design that emphasize tactical choices without bloat.
  - Gear and ability progression tuned for tight, replayable engagements.
- Design Takeaways: Useful contemporary benchmark for delivering classic JRPG mechanics with modern UX and scoped content. (source: [5])
- Mechanical Breakdown:
  - Turn Economy: Lean turn-based rounds; QoL choices (short menus, quick transitions) keep encounter pacing brisk.
  - Stat Progression: Tight progression curves and limited grinding; gear and ability progression focus on meaningful choices over grinding.
  - Exploration Flow: Visible, well-signposted encounters and compact areas encourage forward momentum and low-friction traversal.

---

6) Suikoden II (Konami) — classic comparable
- URL: https://en.wikipedia.org/wiki/Suikoden_II  [6]
- Overview: Classic JRPG notable for large recruitable rosters and base/castle systems that tie narrative progression to mechanical incentives.
- Core Mechanics:
  - Large recruitment system enabling dozens of unique recruitable characters that create roster-driven variety.
  - Turn-based combat that scales with roster composition and offers emergent strategies via selection.
  - Base/castle management and side-systems that provide long-term hooks beyond single battles.
- Design Takeaways: Recruitment and secondary systems can deepen engagement and create emergent player strategies; useful for designing meta-systems that persist across chapters. (source: [6])
- Mechanical Breakdown:
  - Turn Economy: Standard turn-based combat; roster selection creates meta-level decisions that shape repeated encounter approaches.
  - Stat Progression: Character recruitment yields many niche characters; growth is traditional but breadth of options creates varied playstyles.
  - Exploration Flow: Strong town/base meta progression encourages side-quests and recruitment during exploration, lengthening and enriching the exploration loop.

---

7) Undertale (Toby Fox) — modern indie
- URL: https://en.wikipedia.org/wiki/Undertale  [7]
- Overview: Indie narrative-driven RPG that subverts combat expectations by tying player choice directly to story outcomes and mechanical systems.
- Core Mechanics:
  - Player choice system (Mercy vs Fight) with mechanical consequences that change NPC behavior and narrative paths.
  - ACT social/interaction mechanics combined with bullet-hell dodging segments that blend player skill with narrative outcomes.
  - Meta-system where save/load and player actions persist across playthroughs and influence both combat and dialogue.
- Design Takeaways: Leverage choice-consequence mechanics and blend mechanical novelty with narrative framing to create memorable player agency; small, well-signaled systems can produce outsized emotional impact. (source: [7])
- Mechanical Breakdown:
  - Turn Economy: Turn structure is secondary to ACT interactions and timing-based dodge sequences; economy revolves around choice rather than resource optimization.
  - Stat Progression: Minimal traditional stat growth; emphasis is on player choices and their narrative mechanical consequences rather than numeric builds.
  - Exploration Flow: Narrative-driven exploration where choices and player behavior materially alter available content and NPC interactions.

---

8) Secret of Mana (Square) — classic
- URL: https://en.wikipedia.org/wiki/Secret_of_Mana  [8]
- Overview: Action-RPG from the SNES era notable for its real-time combat, ring menu, and cooperative multiplayer elements that influenced pacing and equipment design.
- Core Mechanics:
  - Real-time action combat with a radial "ring" menu for selecting weapons and spells, creating an active, timing-based feel.
  - Cooperative multiplayer and equipment upgrade systems that scale difficulty and encourage party coordination.
  - Mana-based magic tied to resource nodes and ring menu choices that bridge exploration and combat decisions.
- Design Takeaways: Consider blending active combat inputs with menu-based tactical choices to keep fights engaging; cooperative or emergent party interactions can add depth without complex systems. (source: [8])
- Mechanical Breakdown:
  - Turn Economy: Real-time action removes turns; pacing depends on player reaction and cooldowns rather than discrete turns.
  - Stat Progression: Equipment and weapon upgrades form the primary progression; magic tied to limited resources encourages strategic use.
  - Exploration Flow: Active exploration with mana nodes and environmental interactions supports a loop of discovery and resource management.

---

9) Cosmic Star Heroine (Zeboyd Games) — modern indie comparator
- URL: https://zeboyd.com/cosmic-star-heroine/  [9]
- Overview: Indie homage to classic console JRPGs with streamlined combat, stylish presentation, and focused encounter design.
- Core Mechanics:
  - Fast-paced turn-based combat with emphasis on short, punchy encounters and strong QoL (speed-ups, concise menus).
  - Distinct character roles with complementary skills and tech chains.
  - Short, directed dungeons and encounter design that prioritize momentum.
- Design Takeaways / Contrast Notes: Compared to Vale Village's intended depth, Cosmic Star Heroine demonstrates how polishing pacing and QoL can modernize a classic formula without diluting tactical choices; useful model for scoped content and tight encounter loops.
- Mechanical Breakdown:
  - Turn Economy: Lean turn-based rounds designed to avoid tedium; quick animations and menu flow keep tempo high.
  - Stat Progression: Simple growth curves with emphasis on skill/gear choices rather than long grind cycles.
  - Exploration Flow: Short, focused areas with clear goals reduce aimless backtracking and emphasize forward momentum.

---

10) Dragon Quest V (Enix) — classic comparator
- URL: https://en.wikipedia.org/wiki/Dragon_Quest_V  [10]
- Overview: Classic JRPG with life-story progression, party changes, and (in some versions) monster recruitment—emphasizes long-form narrative and player choices across generations.
- Core Mechanics:
  - Narrative-linked progression (life events affecting party/composition) and episodic pacing.
  - Monster recruitment (in later/localized versions) and party composition choices.
  - Equipment/skill progression tied to story milestones.
- Design Takeaways / Contrast Notes: Dragon Quest V's multi-generational narrative and recruitment systems show how long-form hooks and emergent roster options can increase player investment; contrasts with Vale Village by favoring long arcs over tightly-scoped encounter loops.
- Mechanical Breakdown:
  - Turn Economy: Traditional turn-based combat with an emphasis on party composition and longevity across long sequences.
  - Stat Progression: Leveling and equipment dominate progression; story events periodically reshape the player's available options.
  - Exploration Flow: Story-driven exploration with milestone gating and strong narrative incentives to revisit or progress rather than free-form exploration.

---

11) Fire Emblem: Three Houses (Intelligent Systems / Nintendo)
- URL: https://en.wikipedia.org/wiki/Fire_Emblem:_Three_Houses  [11]
- Overview: Tactical JRPG blending turn-based grid combat with social sim elements, where party relationships and in-game mentorship directly influence combat effectiveness and narrative outcomes.
- Core Mechanics:
  - Grid-based tactical positioning and turn-based combat with weapon/class progression tied to teaching and skill tutoring.
  - Social/relationship system where bonds with characters unlock combat bonuses, team strategies, and exclusive story branches.
  - Academy hub system providing resource management (time allocation to teaching, training, dormitory interactions) with mechanical payoffs in battle.
- Design Takeaways: Multi-system integration—tactical combat, progression, and relationship mechanics—can create emergent playstyles and high replayability; hub/downtime systems deepen character investment and provide mechanical hooks beyond combat. (source: [11])
- Mechanical Breakdown:
  - Turn Economy: Grid-based tactical positioning creates spatial resource planning; turn order and positioning create emergent micro-strategies around unit placement and support chains.
  - Stat Progression: Hybrid progression combining weapon ranks, class advancement, and relationship-unlocked abilities; teaching mechanics let players shape unit builds toward team synergy.
  - Exploration Flow: Academy hub alternates with tactical chapters; downtime activities (teaching, exploration of castle grounds) provide agency and mini-progression hooks that feed into battle preparation.

---

12) Persona 5 (Atlus)
- URL: https://en.wikipedia.org/wiki/Persona_5  [12]
- Overview: Modern JRPG layering social sim (calendar system, confidant relationships), dungeon crawling, and turn-based tactical combat within a stylish urban setting and cohesive thematic presentation.
- Core Mechanics:
  - Social Link / Confidant system where calendar-based relationship progression unlocks combat bonuses, exclusive abilities, and narrative branches.
  - Elemental weakness exploitation and turn economy where exploiting weaknesses grants extra turns and can trigger powerful combo attacks.
  - Persona fusion and inheritance system offering deep customization and emergent team composition strategies.
- Design Takeaways: Calendar / time-gating systems paired with relationship hooks create long-term narrative engagement; elemental/weakness systems are robust engagement loops that reward tactical planning and party composition choices. (source: [12])
- Mechanical Breakdown:
  - Turn Economy: Turn-based with major modification: exploiting elemental weaknesses grants bonus turns; chaining weakness exploits into all-out attacks creates climactic moments and incentivizes strategic positioning.
  - Stat Progression: Persona fusion enables deep build customization; character leveling + persona level + ability inheritance creates exponential build variety and encourages experimentation.
  - Exploration Flow: Calendar time-gating enforces pacing and creates emergent decisions (spend time on confidants, dungeon prep, or side activities); interleaves social links with dungeon phases, binding narrative to mechanical progression.

---

## Summary & Comparative Analysis

These fourteen candidates represent diverse mechanical and narrative approaches across eras and platforms:

### Additional Comparables Added

13) Sea of Stars (Sabotage Studio) — modern indie
- URL: https://en.wikipedia.org/wiki/Sea_of_Stars  [13]
- Overview: Modern turn-based JRPG inspired by classic era design, with fluid presentation, visible encounters, and modern UX conveniences.
- Core Mechanics:
  - Momentum and timed-input elements layered on top of turn-based rounds to increase engagement.
  - Item/node-based skill progression that allows limited customization without overwhelming choices.
  - Environmental puzzle integration with exploration-forward design and visible enemies.
- Design Takeaways: Balances classic turn-based feel with modern responsiveness and readable feedback; good model for integrating QoL without losing tactical depth. (source: [13])
- Mechanical Breakdown:
  - Turn Economy: Turn-based with rhythmic/timed input and momentum bonuses that reward reactive timing and sequencing.
  - Stat Progression: Node/skill path progression plus equipment; growth is meaningful but curated to avoid grind.
  - Exploration Flow: Interconnected overworld with visible encounters and puzzle gating encourages revisits when new abilities are available.

---

14) Lunar: The Silver Star (Game Arts / Working Designs) — classic
- URL: https://en.wikipedia.org/wiki/Lunar:_The_Silver_Star  [14]
- Overview: Classic 16-bit JRPG with strong narrative focus, character-driven scenes, and traditional turn-based combat with scripted moments.
- Core Mechanics:
  - Traditional turn-based combat with emphasis on scripted events that alter or spotlight mechanics during key story beats.
  - Character-driven progression and equipment growth that supports narrative arcs.
  - Exploration mixed with event triggers and towns that drive story progression.
- Design Takeaways: Classic narrative-driven pacing demonstrates how scripted mechanical shifts can heighten emotional beats; useful for designing set-piece encounters that teach or change rules temporarily. (source: [14])
- Mechanical Breakdown:
  - Turn Economy: Traditional turns with occasional scripted phases that change available actions or pacing to emphasize story.
  - Stat Progression: Leveling and equipment with story-linked rewards; character growth is tied closely to narrative milestones.
  - Exploration Flow: Event-driven exploration where story beats unlock new areas and shift the player's available mechanical options.

---

### Categories by Design Focus

**Direct Mechanical Inspiration:**
- Golden Sun (resource party systems & Djinn mechanics)
- Chrono Trigger (pacing, visible encounters, tech combos)
- Final Fantasy VI (narrative-mechanical integration, ensemble shifts)

**Modern Tactical Clarity & Systems:**
- Octopath Traveler (Break/Boost weakness exploitation)
- Fire Emblem: Three Houses (grid tactics, social integration, hub downtime)
- Persona 5 (weakness exploit loops, calendar systems, confidant progression)

**Contemporary Indie Benchmarks:**
- Chained Echoes (QoL modernization, tight encounter design)
- Cosmic Star Heroine (polished pacing, character skill chains)
- Undertale (choice-consequence mechanics, player agency)

**Classic Roster, Meta-Systems & Alternative UX:**
- Suikoden II (recruitment depth, base management)
- Dragon Quest V (long-form narrative, party composition shifts)
- Secret of Mana (action-RPG alternatives, cooperative mechanics)

### Common Threads for Vale Village v2 Design

1. **Party Composition** as primary strategic lever (all titles use active party selection as core mechanic; composition changes create emergent tactics).
2. **Tactical Pacing** driven by visible encounters, clear feedback, streamlined menus (Chrono Trigger, Octopath, Chained Echoes).
3. **Progression Loops** that blend equipment, leveling, and unique mechanics:
   - Djinn in Golden Sun
   - Break/Boost in Octopath
   - Confidants / Social Links in Persona 5
   - House system & teaching in Fire Emblem: Three Houses
4. **Narrative Integration** where mechanical shifts coincide with story beats (FFVI, Persona 5, Fire Emblem: Three Houses).
5. **Resource Management** (Djinn, Mana, Time/Calendar, Social Links, Grid Positioning) creates secondary decision loops beyond single encounters.
6. **Hub / Downtime Systems** (Fire Emblem: Three Houses, Persona 5) extend engagement and allow players agency in preparation and character bonding.

### Design Recommendations

- **Adopt Octopath-style clarity** in signaling mechanical state (weakness, buffs, turn order).
- **Consider calendar/time-gating** (Persona 5, Fire Emblem: Three Houses) to enforce pacing and create emergent decisions.
- **Integrate relationship/bond mechanics** with mechanical benefits (Fire Emblem: Three Houses social links unlock team abilities).
- **Test weakness-exploit turns** (Persona 5, Octopath) as a high-engagement tactical loop.
- **Implement hub downtime** (Fire Emblem: Three Houses) to deepen character investment while maintaining progression pacing.

## Next Actions

- Cross-reference individual game mechanics with Vale Village v2's core systems (party selection, tower encounters, progression pacing).
- Add source mapping to docs/market_research_sources.md for traceability and further reading.
- Consider prototype testing of favorite design patterns (e.g., Persona 5's weakness-exploit turn economy, Fire Emblem: Three Houses's hub downtime integration).
- Reference memory entries where applicable for decision traceability.

---



## Validator (automated check)

Run the following in the repo root to verify each game entry contains exactly three Mechanical Breakdown headings and that the two new entries exist:

```bash
# Count number of enumerated game entries (lines like "1) Game Title")
NUM_GAMES=$(grep -E "^[0-9]+\) " docs/market_research.md | wc -l)
# Count occurrences of each standardized breakdown heading
NUM_TURN=$(grep -c "Turn Economy" docs/market_research.md || true)
NUM_STAT=$(grep -c "Stat Progression" docs/market_research.md || true)
NUM_EXP=$(grep -c "Exploration Flow" docs/market_research.md || true)

# Each game should have exactly one of each breakdown heading
if [ "$NUM_GAMES" -gt 0 ] && [ "$NUM_TURN" -eq "$NUM_GAMES" ] && [ "$NUM_STAT" -eq "$NUM_GAMES" ] && [ "$NUM_EXP" -eq "$NUM_GAMES" ]; then
  echo "MECHANICAL_BREAKDOWNS_OK: $NUM_GAMES games × 3 breakdowns each"
else
  echo "MECHANICAL_BREAKDOWNS_INVALID: games:$NUM_GAMES Turn:$NUM_TURN Stat:$NUM_STAT Exploration:$NUM_EXP"
  exit 1
fi

# Confirm the two required new comparables exist
grep -q "Sea of Stars" docs/market_research.md || { echo "MISSING: Sea of Stars"; exit 2; }
grep -q "Lunar: The Silver Star" docs/market_research.md || { echo "MISSING: Lunar: The Silver Star"; exit 2; }

echo "VALIDATION OK"
```

This validator derives the number of games from the enumerated headings and asserts each required breakdown heading appears exactly once per game; it then confirms the presence of the two new comparables (Sea of Stars and Lunar: The Silver Star). Integrate this check into CI as a lightweight Definition-of-Done gate.

---

References:
[13] https://en.wikipedia.org/wiki/Sea_of_Stars
[14] https://en.wikipedia.org/wiki/Lunar:_The_Silver_Star

