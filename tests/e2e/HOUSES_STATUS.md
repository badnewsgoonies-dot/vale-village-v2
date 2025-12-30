HOUSES STATUS (1-6)

- House 1:
  - Dialogue: VS1 pre/post scenes present
  - Encounter: HOUSE_01_VS1 (VS1) present
  - Recruit: war-mage (Garet) — battle recruit

- House 2:
  - Dialogue: pre/post/relief dialogues present
  - Encounter: HOUSE_02 present
  - Recruit: mystic — story auto-recruit after battle

- House 3:
  - Dialogue: HOUSE_03 pre-battle & recruitment dialogues present
  - Encounter: HOUSE_03 present (reward now includes unlockUnit: 'ranger')
  - Recruit: ranger — completed (unlockUnit wired)

- House 4:
  - Dialogue: HOUSE_04 dialogues present
  - Encounter: HOUSE_04 present
  - Recruit: none (no unlockUnit; introduces frost mystic healer)

- House 5:
  - Dialogue: HOUSE_05 dialogues present
  - Encounter: HOUSE_05 present
  - Recruit: blaze — battle recruit (unlockUnit present)

- House 6:
  - Dialogue: house-06 post-battle dialogue present
  - Encounter: HOUSE_06 present (reward now includes unlockUnit: 'stone-guardian')
  - Recruit: stone-guardian — verified by tests/e2e/house-06-recruit.spec.ts

Notes:
- Implementation updates: Added unlockUnit fields to HOUSE_03 and HOUSE_06 in src/data/definitions/encounters.ts to wire recruitment rewards in line with Houses 1 and 5 patterns.
- Tests: A Playwright test asserts HOUSE_06.reward.unlockUnit === 'stone-guardian'.
