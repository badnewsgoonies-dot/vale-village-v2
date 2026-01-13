#!/usr/bin/env python3
"""
Generate frame timing and animation duration metrics from JSON trace files.
Writes analysis/frame_metrics.json and CSVs when successful.
Exits with code 0 on success, 2 if no usable timing data found.
"""
import sys, json, glob, os, math, csv
from collections import Counter

def collect_timestamps(obj):
    ts = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            if isinstance(v, (int, float)) and any(sub in k.lower() for sub in ("time","ts","timestamp","start","end")):
                try:
                    ts.append(float(v))
                except Exception:
                    pass
            else:
                ts.extend(collect_timestamps(v))
    elif isinstance(obj, list):
        for item in obj:
            ts.extend(collect_timestamps(item))
    return ts

def collect_animation_durations(obj):
    durs = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            if isinstance(v, (int, float)) and ("anim" in k.lower() or "animation" in k.lower()) and ("dur" in k.lower() or "duration" in k.lower() or "ms" in k.lower()):
                try:
                    durs.append(float(v))
                except Exception:
                    pass
            else:
                durs.extend(collect_animation_durations(v))
    elif isinstance(obj, list):
        for item in obj:
            durs.extend(collect_animation_durations(item))
    return durs


def normalize_timestamps(timestamps):
    if not timestamps:
        return []
    mx = max(timestamps)
    # Heuristic: if timestamps look like unix ms (>1e11) treat as ms -> convert to seconds
    # if look like unix s (>1e9) treat as seconds
    if mx > 1e11:
        return [t / 1000.0 for t in timestamps]
    return timestamps


def to_ms(seconds):
    return [s * 1000.0 for s in seconds]


def histogram(values_ms):
    # Fixed buckets (ms): [0-8,8-16,16-32,32-64,64-128,128-256,256-512,512+]
    bounds = [8,16,32,64,128,256,512]
    ctr = Counter()
    for v in values_ms:
        placed = False
        for b in bounds:
            if v <= b:
                ctr[f"<= {b}ms"] += 1
                placed = True
                break
        if not placed:
            ctr[">512ms"] += 1
    total = sum(ctr.values())
    buckets = {k: {"count": ctr[k], "pct": (ctr[k]/total if total else 0)} for k in sorted(ctr.keys(), key=lambda x: (int(x.split()[1].strip('ms')) if x.startswith('<=') else 9999))}
    return buckets


def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument('--traces-dir', default='analysis/traces')
    p.add_argument('--out-json', default='analysis/frame_metrics.json')
    p.add_argument('--out-csv-prefix', default='analysis/frame_metrics')
    args = p.parse_args()

    trace_files = sorted(glob.glob(os.path.join(args.traces_dir, '*.json')))
    all_frame_deltas_ms = []
    all_animation_durations_ms = []

    for f in trace_files:
        try:
            with open(f,'r',encoding='utf-8') as fh:
                j = json.load(fh)
        except Exception:
            continue
        ts = collect_timestamps(j)
        ts = normalize_timestamps(ts)
        ts = sorted(set(ts))
        if len(ts) >= 2:
            deltas = [ (ts[i+1]-ts[i]) for i in range(len(ts)-1) ]
            all_frame_deltas_ms.extend(to_ms(deltas))
        # collect animation durations if present
        durs = collect_animation_durations(j)
        # heuristics: if durations look like seconds (<100) convert to ms, if >1000 assume ms
        for d in durs:
            if d > 1000:
                all_animation_durations_ms.append(float(d))
            elif d > 0 and d <= 100:
                all_animation_durations_ms.append(float(d)*1000.0)

    # write outputs or fail if none
    if not all_frame_deltas_ms and not all_animation_durations_ms:
        print('No timing data found in trace JSONs', file=sys.stderr)
        sys.exit(2)

    out = {
        'frame_time_ms': {'count': len(all_frame_deltas_ms), 'values_sample': all_frame_deltas_ms[:500]},
        'frame_time_histogram': histogram(all_frame_deltas_ms) if all_frame_deltas_ms else {},
        'animation_duration_ms': {'count': len(all_animation_durations_ms), 'values_sample': all_animation_durations_ms[:500]},
        'animation_duration_histogram': histogram(all_animation_durations_ms) if all_animation_durations_ms else {},
    }

    os.makedirs(os.path.dirname(args.out_json) or '.', exist_ok=True)
    with open(args.out_json,'w',encoding='utf-8') as oh:
        json.dump(out, oh, indent=2)

    # CSVs
    if all_frame_deltas_ms:
        with open(args.out_csv_prefix + '_frame_times.csv','w',newline='') as cf:
            w = csv.writer(cf)
            w.writerow(['frame_time_ms'])
            for v in all_frame_deltas_ms:
                w.writerow(["{:.3f}".format(v)])
    if all_animation_durations_ms:
        with open(args.out_csv_prefix + '_animation_durations.csv','w',newline='') as ca:
            w = csv.writer(ca)
            w.writerow(['animation_duration_ms'])
            for v in all_animation_durations_ms:
                w.writerow(["{:.3f}".format(v)])

    print(f"Wrote metrics: {args.out_json}")
    sys.exit(0)

if __name__ == '__main__':
    main()
