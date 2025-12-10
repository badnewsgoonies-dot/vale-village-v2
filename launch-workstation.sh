#!/bin/bash
# launch-workstation.sh - Launch full autonomous multi-agent workstation
#
# Usage: ./launch-workstation.sh
#
# This script:
# 1. Opens VS Code with vale-village-v2
# 2. Starts the dev server (pnpm dev)
# 3. Opens 4 AI agent terminals (Claude, Codex, Copilot, Gemini)
# 4. Opens browser preview at localhost:5173

set -e

PROJECT_DIR="/home/geni/Documents/vale-village-v2"
MEMORY_DIR="/home/geni/swarm/memory"

echo "=== Multi-Agent Workstation Launcher ==="
echo ""

# Ensure memory API is running for cross-agent communication
echo "[1/4] Starting memory API server..."
curl -s http://localhost:8765/health >/dev/null 2>&1 || {
    cd "$MEMORY_DIR"
    python3 ./mem-server.py --port 8765 --host 0.0.0.0 &
    sleep 2
    echo "  Memory API started on :8765"
}

# Open VS Code
echo "[2/4] Opening VS Code..."
code "$PROJECT_DIR"

# Wait for VS Code to initialize
sleep 3

# Run the multi-agent task (Ctrl+Shift+B or via CLI)
echo "[3/4] Launching agents via VS Code task..."
echo "  Press Ctrl+Shift+B in VS Code to run 'Launch Multi-Agent Workstation'"
echo "  Or run: code --folder-uri file://$PROJECT_DIR --goto"

# Open browser preview
echo "[4/4] Opening browser preview..."
sleep 2

# Use VS Code's Simple Browser or external browser
# VS Code command: simpleBrowser.show http://localhost:5173
xdg-open "http://localhost:5173" 2>/dev/null &

echo ""
echo "=== Workstation Ready ==="
echo ""
echo "Terminals:"
echo "  - Claude:  AI coding assistant"
echo "  - Codex:   OpenAI code model"
echo "  - Copilot: GitHub AI assistant"
echo "  - Gemini:  Google AI model"
echo ""
echo "Browser: http://localhost:5173"
echo "Memory:  http://localhost:8765/briefing"
echo ""
echo "Shortcuts:"
echo "  Ctrl+Shift+B  - Run multi-agent task"
echo "  Ctrl+\`        - Toggle terminal"
echo "  Ctrl+Shift+5  - Split terminal"
echo "  Alt+Left/Right - Navigate terminal panes"
echo ""
