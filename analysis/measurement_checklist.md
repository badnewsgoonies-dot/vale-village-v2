Measurement checklist: visual & gameplay metrics to capture

Visual metrics
- Frame timings: capture per-frame timestamps and compute ms/frame and FPS distribution (target windows: battle, overworld, menu).
- Animation lengths: record start/end frames and duration (ms and frames) for each key animation (idle->run, ability cast, hit reaction).
- Camera offsets: log camera center offsets (px) relative to player for key shots; include interpolation curves if present.
- Particle density & lifetime: count particles on-screen during ability FX and measure average lifetime (ms).
- Screen transitions: measure fade/dissolve durations and SFX alignment (ms)

Gameplay / UX metrics
- Input-to-action latency: time between input event and visible response (ms) for menus and battle commands.
- Menu traversal timing: time to open/close menus, navigate 1->n items, and confirm actions (ms per step).
- Ability timings: cast wind-up, active, and recovery windows (ms); whether gameplay cancels exist.
- SFX timing alignment: delta between visual event (frame) and SFX playback (ms).
- Camera shake intensity & duration: measure pixel displacement over time (max, RMS, duration).

Data format suggestions
- Store metrics as JSON: {"clip_id":..., "metric":..., "value":..., "units":"ms"}
- For animation captures include: {"name","start_frame","end_frame","duration_ms","notes"}

Next: instrument watch_vision or manual capture to populate these metrics and append JSON artifacts to analysis/video_metrics/.
