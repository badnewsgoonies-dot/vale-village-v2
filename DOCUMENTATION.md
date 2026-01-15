Documentation index — Vale Village v2

Contributing
- Branch from main and create a topic branch named feature/your-thing or fix/issue-123.
- Run tests locally (pnpm test) and typecheck (pnpm typecheck) before opening a PR.
- Include a clear description, testing notes, and link to any related issues in the PR.

Memory usage
- The project uses a swarm memory to record decisions, lessons, and results. Follow CLAUDE.md for the canonical memory commands and patterns.
- Typical memory actions:
  - Record decisions: mem-db.sh write type=d topic=VV2 text="Decided X because Y" choice=X
  - Record lessons: mem-db.sh write type=L topic=VV2 text="Lesson: ..."

Notes on testing
- A minimal Playwright E2E boot test was added at tests/e2e/boot-purple-page.spec.ts to assert the application bootstraps and exposes window.gameStore; this helps catch regressions that cause a blank page at startup.



This file points to the primary documentation for the Vale Village v2 project and provides a concise quickstart.

Quickstart
- cd Documents/vale-village-v2
- npm install (or pnpm install)
- npm run dev (or the project-specific dev script in package.json)

Primary docs
- See docs/ for design documents, balance analysis, migration guide, and screenshots.
- Recommended starting reads: docs/v2-migration-guide.md and docs/OVERWORLD_REBUILD_PLAN.md

Notes
- A short README.md exists at the project root for a minimal overview.

Prompt tuning and bridge loading
- VALE-9000 system prompt file: prompts/vale9000_system_prompt.txt (contains agent persona and operational rules).
- Prompt tuning: iterate on prompts/vale9000_system_prompt.txt and run targeted unit tests; keep prompt sizes reasonable (<4000 tokens) and preserve explicit constraints.
- Bridge loading: use the neural bridge to load or reload the prompt; example:
  python3 tools/neural_bridge.py --load-prompt prompts/vale9000_system_prompt.txt
  Verify the bridge handshake response before issuing commands.
- Safety: ensure the bridge runs in an isolated environment and that God Mode requires an explicit APPROVAL_TOKEN; log approvals to memory.

## Contribution and Memory Usage
- Session startup: run `python3 /home/geni/swarm/memory/mem-briefing.py` to get the current briefing.
- Semantic search: use `python3 /home/geni/swarm/memory/mem-semantic.py "<topic>" --limit 10` to find related memory entries.
- Record decisions: `/home/geni/swarm/memory/mem-db.sh write type=d topic=VV2 text="Decided X because Y" choice=X`
- Record lessons and results similarly with type=L and type=R.

## Contribution guidelines
- Create feature branches and open PRs with clear descriptions and tests.
- Use pnpm scripts for install, typecheck, build, and tests (e.g., `pnpm install`, `pnpm typecheck`, `pnpm test`).
- Avoid magic numbers: introduce named constants in `src/core/constants.ts` and reference them in code.

