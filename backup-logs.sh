#!/bin/bash
# Script to back up Claude Desktop logs and start with fresh ones

LOG_DIR="${CLAUDE_LOG_DIR:-$HOME/Library/Logs/Claude}"
BACKUP_DIR="$LOG_DIR/archive/$(date +%Y-%m-%d_%H-%M-%S)"

mkdir -p "$BACKUP_DIR"

# Copy all the current logs to the backup directory
cp "$LOG_DIR"/*.log "$BACKUP_DIR" 2>/dev/null

echo "Logs backed up to $BACKUP_DIR"
echo "To clear logs, restart Claude Desktop"
echo ""
echo "Then check if logs are fresh with:"
echo "  ls -la $LOG_DIR/mcp-server-outlook-assistant.log"
