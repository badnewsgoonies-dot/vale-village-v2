#!/usr/bin/env bash
set -euo pipefail

DEFAULT_FPS=60
MEDIA_DIR="analysis/media_metadata"
OUT_GS="analysis/golden_sun_djinn/frames"
OUT_FFVI="analysis/ffvi_intros/frames"

command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg not found in PATH" >&2; exit 2; }
command -v ffprobe >/dev/null 2>&1 || { echo "ffprobe not found in PATH" >&2; exit 2; }

mkdir -p "$MEDIA_DIR" "$OUT_GS" "$OUT_FFVI"

extract() {
  local video="$1" fps="$2"
  [ -f "$video" ] || { echo "Missing video: $video" >&2; return 1; }
  local name
  name=$(basename -- "$video")
  if [[ "$name" == *golden_sun_djinn* ]]; then
    outdir="$OUT_GS"
  elif [[ "$name" == *ffvi_intros* ]]; then
    outdir="$OUT_FFVI"
  else
    outdir="$MEDIA_DIR/${name%.*}_frames"
  fi
  mkdir -p "$outdir"
  echo "Extracting '$video' -> $outdir at ${fps} fps"
  ffmpeg -hide_banner -loglevel error -i "$video" -vf "fps=${fps}" "$outdir/frame_%05d.png"

  # duration and expected frame count
  dur=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$video" )
  # handle empty duration
  if [ -z "${dur}" ] || [ "${dur}" = "N/A" ]; then dur=0; fi
  expected=$(printf "%.0f" "$(python3 - <<PY
import math,sys
try:
    d=float(sys.argv[1])
    f=int(sys.argv[2])
    print(math.ceil(d*f))
except Exception:
    print(0)
PY
" "$dur" "$fps")
  actual=$(ls -1 "$outdir"/frame_*.png 2>/dev/null | wc -l || true)
  echo "duration=${dur}, expected=${expected}, actual=${actual}"
  if [ "$actual" -ne "$expected" ]; then
    echo "Warning: frame count mismatch for $video (expected $expected, got $actual)" >&2
  fi
  # write sha256 manifest
  (cd "$outdir" && sha256sum frame_*.png > frames-sha256.txt)
}

if [ $# -eq 0 ]; then
  echo "No explicit video files provided; scanning $MEDIA_DIR for common containers..."
  shopt -s nullglob || true
  for f in "$MEDIA_DIR"/*.{mp4,mkv,mov,webm}; do
    [ -e "$f" ] || continue
    extract "$f" "$DEFAULT_FPS" || true
  done
  exit 0
fi

use_native=0
if [ "$1" = "--native" ]; then
  use_native=1
  shift
fi

for v in "$@"; do
  if [ "$use_native" -eq 1 ]; then
    # get nearest integer fps from ffprobe
    fps=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 "$v" | awk -F'/' '{if ($2) printf "%d", $1/$2; else print $1}')
    fps=${fps:-$DEFAULT_FPS}
  else
    fps=$DEFAULT_FPS
  fi
  extract "$v" "$fps" || true
done
