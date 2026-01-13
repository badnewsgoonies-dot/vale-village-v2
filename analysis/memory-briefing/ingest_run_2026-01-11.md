# Ingest run 2026-01-11

Summary: Queried swarm memory and captured top-10 semantic results for "Golden Sun reference clips" and general briefing. Existing snapshots already present in this folder (briefing.txt, top10.json, mem-semantic.txt, etc.). This file records the run and the principal entries discovered.

Top-10 semantic hits (id — score — short text):

1. id=11335  score=0.8257 — [CRITICAL] V2 project is vale-village at ~/Desktop/untitled... DO NOT recreate from scratch; fix existing code.
2. id=151    score=0.7728 — Combine vector similarity with time decay: score = sim + β·exp(-Δt/τ)
3. id=157    score=0.7694 — Encode time via sinusoidal embeddings + exponential decay at retrieval
4. id=14696 score=0.7651 — Metadata capture is robust when integrated with fetch operations
5. id=93     score=0.7625 — Implement mem-search helper
6. id=14476 score=0.7604 — Sort order is critical for semantic similarity ranking
7. id=14492 score=0.7583 — Descending sort for similarity improves result quality
8. id=14727 score=0.7569 — Memory-first briefing and use of canonical sources streamline synthesis tasks
9. id=127   score=0.7550 — Use E5-large-v2 locally for embeddings
10. id=167  score=0.7547 — Four roles: Ingestor, Summarizer, Retriever, Compressor

Files referenced (already present):
- analysis/reference_manifest.md
- analysis/measurement_checklist.md
- analysis/memory-briefing/top10.json
- analysis/memory-briefing/briefing.txt

Notes / next steps:
- Extract clip timestamps from reference_manifest.md and annotate analysis/reference_manifest.md with canonical shots.
- Validate measurement checklist against one sample capture and adjust thresholds.
- No duplicate files were created; existing snapshots were preserved.

Recorded via agent on 2026-01-11T23:00:44Z.
