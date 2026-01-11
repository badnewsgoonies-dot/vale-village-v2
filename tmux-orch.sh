#!/usr/bin/env bash
# tmux-orch.sh - 2x2 dev workstation for vale-village-v2
#
# Usage:
#   ./tmux-orch.sh            # create session and attach (if in a TTY)
#   ./tmux-orch.sh --detach   # create session and exit
#   ./tmux-orch.sh gui        # open in a new GUI terminal (best effort)
#
# Panes:
#   0) pnpm dev
#   1) tsc --watch
#   2) vitest --watch
#   3) shell (for commands)

set -euo pipefail

SESSION="vv2"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

DETACH=false
GUI=false

for arg in "$@"; do
  case "$arg" in
    --detach) DETACH=true ;;
    gui) GUI=true ;;
  esac
done

# Kill existing session (best effort)
tmux kill-session -t "$SESSION" 2>/dev/null || true

tmux new-session -d -s "$SESSION" -c "$PROJECT_DIR" -n "dev"

# Pane 0: dev server
tmux send-keys -t "$SESSION:0.0" 'pnpm dev' Enter

# Pane 1: typecheck watch
tmux split-window -h -t "$SESSION:0.0" -c "$PROJECT_DIR"
tmux send-keys -t "$SESSION:0.1" 'pnpm exec tsc --noEmit --watch' Enter

# Pane 2: unit tests watch
tmux select-pane -t "$SESSION:0.0"
tmux split-window -v -t "$SESSION:0.0" -c "$PROJECT_DIR"
tmux send-keys -t "$SESSION:0.2" 'pnpm test:watch' Enter

# Pane 3: shell
tmux select-pane -t "$SESSION:0.1"
tmux split-window -v -t "$SESSION:0.1" -c "$PROJECT_DIR"
tmux send-keys -t "$SESSION:0.3" 'bash' Enter
tmux send-keys -t "$SESSION:0.3" 'echo "Try: pnpm test:e2e --headed tests/e2e/gameplay-tour.spec.ts"' Enter

tmux select-layout -t "$SESSION" tiled
tmux set -t "$SESSION" -g mouse on
tmux select-pane -t "$SESSION:0.0"

if $DETACH; then
  echo "tmux session '$SESSION' started. Attach with: tmux attach -t $SESSION"
  exit 0
fi

if $GUI || [[ ! -t 0 ]]; then
  if command -v gnome-terminal &>/dev/null; then
    gnome-terminal --title="VV2 tmux" --geometry=200x55 -- tmux attach -t "$SESSION"
  elif command -v konsole &>/dev/null; then
    konsole --title "VV2 tmux" -e tmux attach -t "$SESSION"
  elif command -v kitty &>/dev/null; then
    kitty --title "VV2 tmux" tmux attach -t "$SESSION"
  elif command -v alacritty &>/dev/null; then
    alacritty --title "VV2 tmux" -e tmux attach -t "$SESSION"
  elif command -v xfce4-terminal &>/dev/null; then
    xfce4-terminal --title="VV2 tmux" --geometry=200x55 -e "tmux attach -t $SESSION"
  else
    echo "tmux session '$SESSION' started. Attach with: tmux attach -t $SESSION"
    exit 0
  fi
else
  tmux attach -t "$SESSION"
fi

