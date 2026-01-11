#!/usr/bin/env python3
"""Lightweight analyzer for Golden Sun 'djinn' capture.

Writes analysis/golden_sun_djinn/analysis.json and summary.txt.
If no frames or Pillow isn't available, writes a conservative fallback with numeric fields.
"""
import os
import json
import math

REPO_ROOT = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
FRAMES_DIR = os.path.join(REPO_ROOT, 'analysis', 'golden_sun_djinn', 'frames')
OUT_JSON = os.path.join(REPO_ROOT, 'analysis', 'golden_sun_djinn', 'analysis.json')
OUT_SUM = os.path.join(REPO_ROOT, 'analysis', 'golden_sun_djinn', 'summary.txt')

try:
    from PIL import Image, ImageChops
except Exception:
    Image = None

# Analysis constants (no magic numbers)
DEFAULT_FPS = 60
DEFAULT_TEXT_SPEED_CPS = 15.0
SMOOTH_WINDOW = 3
MEDIAN_MULTIPLIER = 2.0
TEXT_POST_SPIN_DELAY_SEC = 0.05
TEXT_DURATION_SEC = 1.2


def numeric(v):
    try:
        if isinstance(v, (int, float)):
            return v
        return float(v)
    except Exception:
        return 0


def analyze_frames(frames):
    # naive defaults
    fps = DEFAULT_FPS
    start_frame = 0
    end_frame = max(0, len(frames)-1)
    djinn_spin_start = 0
    djinn_spin_end = 0
    spin_duration = 0
    text_start = 0
    text_end = 0
    text_speed_cps = DEFAULT_TEXT_SPEED_CPS  # chars per sec

    if Image is None or len(frames) < 2:
        return dict(start_frame=start_frame, end_frame=end_frame, fps=fps,
                    djinn_spin_start_frame=djinn_spin_start, djinn_spin_end_frame=djinn_spin_end,
                    spin_duration_frames=spin_duration,
                    text_scroll_start_frame=text_start, text_scroll_end_frame=text_end,
                    text_scroll_speed_chars_per_sec=text_speed_cps,
                    sound_to_visual_sync_ms=0)

    # compute per-frame grayscale-difference energy
    energies = []
    prev = None
    for fn in frames:
        try:
            im = Image.open(os.path.join(FRAMES_DIR, fn)).convert('L')
        except Exception:
            continue
        if prev is None:
            prev = im
            energies.append(0.0)
            continue
        diff = ImageChops.difference(im, prev)
        # histogram energy
        h = diff.histogram()
        # sum of value*count normalized
        energy = sum(v * i for i, v in enumerate(h))
        energies.append(energy)
        prev = im

    if len(energies) < 2:
        return dict(start_frame=start_frame, end_frame=end_frame, fps=fps,
                    djinn_spin_start_frame=djinn_spin_start, djinn_spin_end_frame=djinn_spin_end,
                    spin_duration_frames=spin_duration,
                    text_scroll_start_frame=text_start, text_scroll_end_frame=text_end,
                    text_scroll_speed_chars_per_sec=text_speed_cps,
                    sound_to_visual_sync_ms=0)

    # smooth energies
    sm = []
    W = SMOOTH_WINDOW
    for i in range(len(energies)):
        lo = max(0, i-W)
        hi = min(len(energies), i+W+1)
        sm.append(sum(energies[lo:hi]) / (hi-lo))

    median = sorted(sm)[len(sm)//2]
    thr = max(1.0, median * MEDIAN_MULTIPLIER)

    # find regions above threshold
    above = [i for i,v in enumerate(sm) if v > thr]
    if above:
        djinn_spin_start = max(0, above[0]-1)
        djinn_spin_end = min(len(frames)-1, above[-1]+1)
        spin_duration = djinn_spin_end - djinn_spin_start
        text_start = djinn_spin_end + int(fps * TEXT_POST_SPIN_DELAY_SEC)
        text_end = text_start + int(fps * TEXT_DURATION_SEC)
    else:
        djinn_spin_start = 0
        djinn_spin_end = 0
        spin_duration = 0
        text_start = 0
        text_end = 0

    return dict(start_frame=start_frame, end_frame=end_frame, fps=fps,
                djinn_spin_start_frame=djinn_spin_start, djinn_spin_end_frame=djinn_spin_end,
                spin_duration_frames=spin_duration,
                text_scroll_start_frame=text_start, text_scroll_end_frame=text_end,
                text_scroll_speed_chars_per_sec=text_speed_cps,
                sound_to_visual_sync_ms=0)


if __name__ == '__main__':
    try:
        frames = sorted([f for f in os.listdir(FRAMES_DIR) if os.path.isfile(os.path.join(FRAMES_DIR, f))])
    except Exception:
        frames = []

    result = analyze_frames(frames)

    # ensure numeric types
    for k in list(result.keys()):
        if isinstance(result[k], (int, float)):
            continue
        result[k] = numeric(result[k])

    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    with open(OUT_JSON, 'w') as fh:
        json.dump(result, fh, indent=2)

    # summary
    lines = [
        f"Frames found: {len(frames)}",
        f"Spin frames: {result['djinn_spin_start_frame']} - {result['djinn_spin_end_frame']} ({result['spin_duration_frames']} frames)",
        f"Text scroll: {result['text_scroll_start_frame']} - {result['text_scroll_end_frame']} @ {result['text_scroll_speed_chars_per_sec']} chars/sec",
        "Notes: Analysis used simple per-frame histogram energy; when Pillow not available or no frames present this produced conservative defaults."
    ]
    with open(OUT_SUM, 'w') as fh:
        fh.write('\n'.join(lines))

    print('Wrote', OUT_JSON, OUT_SUM)
