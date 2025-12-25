# Gemini Instructions

## Memory System
After completing any task, use `memory_write` to record:
- **Lessons (t=L)**: What you learned, patterns discovered, mistakes to avoid
- **Results (t=R)**: Task outcomes (success/failure), what was changed
- **Decisions (t=d)**: Important choices made and why

Example:
```
memory_write(t="L", topic="vale-village-v2", text="Fixed revival targeting by adding canTargetKO flag")
memory_write(t="R", topic="vale-village-v2", text="BUG-011 complete: 3 files modified", choice="success")
```

## Before Starting Tasks
Use `memory_query` or `memory_semantic` to check for prior lessons on the topic.
