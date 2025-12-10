#!/bin/bash
# agents.sh - Launch 4 AI agents in a 2x2 tmux grid
#
# Usage: ./agents.sh        (from terminal)
#        ./agents.sh gui    (opens new terminal window)

SESSION="agents"
DIR="/home/geni/swarm/memory"

# Kill existing session
tmux kill-session -t "$SESSION" 2>/dev/null

# Create 4-pane vertical layout:
#  ┌───────┬───────┬───────┬───────┐
#  │claude │ codex │copilot│gemini │
#  └───────┴───────┴───────┴───────┘

tmux new-session -d -s "$SESSION" -c "$DIR" -n "agents"

# Pane 0: Claude
tmux send-keys -t "$SESSION:0.0" 'claude' Enter

# Split right -> Pane 1: Codex
tmux split-window -h -t "$SESSION:0.0" -c "$DIR"
tmux send-keys -t "$SESSION:0.1" 'codex' Enter

# Split right -> Pane 2: Copilot
tmux split-window -h -t "$SESSION:0.1" -c "$DIR"
tmux send-keys -t "$SESSION:0.2" 'gh copilot' Enter

# Split right -> Pane 3: Gemini
tmux split-window -h -t "$SESSION:0.2" -c "$DIR"
tmux send-keys -t "$SESSION:0.3" 'gemini' Enter

# Even out the panes horizontally
tmux select-layout -t "$SESSION" even-horizontal

# Enable mouse - click to select pane, scroll, resize
tmux set -t "$SESSION" -g mouse on

# Focus on Claude pane
tmux select-pane -t "$SESSION:0.0"

# Attach or open in new window
if [[ "$1" == "gui" ]] || [[ ! -t 0 ]]; then
    # Open in new terminal window
    if command -v gnome-terminal &>/dev/null; then
        gnome-terminal --title="AI Agents" --geometry=200x50 -- tmux attach -t "$SESSION"
    elif command -v konsole &>/dev/null; then
        konsole --title "AI Agents" -e tmux attach -t "$SESSION"
    elif command -v kitty &>/dev/null; then
        kitty --title "AI Agents" tmux attach -t "$SESSION"
    elif command -v alacritty &>/dev/null; then
        alacritty --title "AI Agents" -e tmux attach -t "$SESSION"
    elif command -v xfce4-terminal &>/dev/null; then
        xfce4-terminal --title="AI Agents" --geometry=200x50 -e "tmux attach -t $SESSION"
    else
        echo "No GUI terminal found. Run: tmux attach -t $SESSION"
        exit 1
    fi
else
    # Already in terminal, just attach
    tmux attach -t "$SESSION"
fi
