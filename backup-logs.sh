#!/bin/bash
# Script to back up Claude Desktop logs and start with fresh ones

# Create a timestamped directory for the backup
BACKUP_DIR="/Users/ryaker/Library/Logs/Claude/archive/$(date +%Y-%m-%d_%H-%M-%S)"
mkdir -p "$BACKUP_DIR"

# Copy all the current logs to the backup directory
cp /Users/ryaker/Library/Logs/Claude/*.log "$BACKUP_DIR"

echo "Logs backed up to $BACKUP_DIR"
echo "To clear logs, restart Claude Desktop"
echo ""
echo "Then check if logs are fresh with:"
echo "  ls -la /Users/ryaker/Library/Logs/Claude/mcp-server-outlook-assistant.log"
