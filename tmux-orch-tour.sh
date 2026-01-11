#!/usr/bin/env bash
# tmux-orch-tour.sh - 2x2 "tour" workstation for vale-village-v2
#
# Panes:
#   0) Vite dev server (game link)
#   1) tsc --watch (typecheck)
#   2) vitest --watch (unit tests)
#   3) Playwright gameplay tour runner + shell
#
# Usage:
#   ./tmux-orch-tour.sh              # create session and attach (if in a TTY)
#   ./tmux-orch-tour.sh --detach     # create session and exit
#   SESSION=vv2-tour ./tmux-orch-tour.sh --detach
#
# Game link (default): http://127.0.0.1:5173/

set -euo pipefail

SESSION="${SESSION:-vv2-tour}"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

DETACH=false
GUI=false

for arg in "$@"; do
  case "$arg" in
    --detach) DETACH=true ;;
    gui) GUI=true ;;
  esac
done

tmux kill-session -t "$SESSION" 2>/dev/null || true

tmux new-session -d -s "$SESSION" -c "$PROJECT_DIR" -n "tour"

# Pane 0: dev server
tmux send-keys -t "$SESSION:0.0" 'pnpm dev --host 0.0.0.0 --port 5173 --strictPort' Enter

# Pane 1: typecheck watch
tmux split-window -h -t "$SESSION:0.0" -c "$PROJECT_DIR"
tmux send-keys -t "$SESSION:0.1" 'pnpm exec tsc --noEmit --watch' Enter

# Pane 2: unit tests watch
tmux select-pane -t "$SESSION:0.0"
tmux split-window -v -t "$SESSION:0.0" -c "$PROJECT_DIR"
tmux send-keys -t "$SESSION:0.2" 'pnpm test:watch' Enter

# Pane 3: gameplay tour runner, then leave a shell open
tmux select-pane -t "$SESSION:0.1"
tmux split-window -v -t "$SESSION:0.1" -c "$PROJECT_DIR"
tmux send-keys -t "$SESSION:0.3" \
  'bash -lc '"'"'pnpm exec playwright test tests/e2e/gameplay-tour.spec.ts --project=chromium --reporter=line; echo; echo "Playwright finished. Re-run: pnpm exec playwright test tests/e2e/gameplay-tour.spec.ts --project=chromium"; exec bash'"'"'' Enter

tmux select-layout -t "$SESSION" tiled
tmux set -t "$SESSION" -g mouse on
tmux select-pane -t "$SESSION:0.0"

if $DETACH; then
  echo "tmux session '$SESSION' started. Attach with: tmux attach -t $SESSION"
  echo "Game link: http://127.0.0.1:5173/"
  exit 0
fi

if $GUI || [[ ! -t 0 ]]; then
  if command -v gnome-terminal &>/dev/null; then
    gnome-terminal --title="VV2 tour tmux" --geometry=200x55 -- tmux attach -t "$SESSION"
  elif command -v konsole &>/dev/null; then
    konsole --title "VV2 tour tmux" -e tmux attach -t "$SESSION"
  elif command -v kitty &>/dev/null; then
    kitty --title "VV2 tour tmux" tmux attach -t "$SESSION"
  elif command -v alacritty &>/dev/null; then
    alacritty --title "VV2 tour tmux" -e tmux attach -t "$SESSION"
  elif command -v xfce4-terminal &>/dev/null; then
    xfce4-terminal --title="VV2 tour tmux" --geometry=200x55 -e "tmux attach -t $SESSION"
  else
    echo "tmux session '$SESSION' started. Attach with: tmux attach -t $SESSION"
    echo "Game link: http://127.0.0.1:5173/"
    exit 0
  fi
else
  tmux attach -t "$SESSION"
fi

