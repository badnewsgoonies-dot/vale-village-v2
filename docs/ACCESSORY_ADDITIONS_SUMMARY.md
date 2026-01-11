ACCESSORY ADITIONS SUMMARY

Added games:
- Sea of Stars
- Lunar: The Silver Star

Videos:
- Canonical clips and timestamps are recorded in docs/video_inspiration.md (early, mid, boss per game).

Five critical gaps and proposed fixes (summary):
1) No weakness/break mechanic — add enemy weakness schema, break gauge, and grant extraExecutionToken on break (core/algorithms + QueueBattleService + UI gauges).
2) Combat feedback layering — introduce VISUAL_LAYERS constants and event.visualPriority to ensure telegraphs/status icons render above FX.
3) Visible overworld encounters — add EncounterEntity to maps and OverworldV2 rendering with detectionRadius and engageOnContact flag.
4) Hub/downtime system — prototype hubSlice and HubService with Training/Bonding/Assignment activities accessible from the hub screen.
5) Replay/diagnostic tooling — extend ReplayService and QueueBattleService to emit event tags and rngOffset; add ReplayViewer UI for step-debugging.

Memory recording:
- Run scripts/verify_research.py to attempt writing a record via /home/geni/swarm/memory/mem-db.sh; its output will be appended here when available.


---
Memory Recording Output:
Return code: 0
{
  "bucket": "anchor",
  "timestamp": "2026-01-11T18:49:39Z",
  "text": "Verified research docs via verify_research.py",
  "anchor_type": "R",
  "anchor_topic": "VV2",
  "anchor_choice": "success",
  "anchor_hash": "bd82ac9925f92e9c1ab6d889e27c5c660ff08ced79dc4971d76844c9043bbd24",
  "scope": "shared",
  "visibility": "public",
  "trust_level": "untrusted",
  "id": 16376,
  "deduped": false,
  "safety_result": null
}

