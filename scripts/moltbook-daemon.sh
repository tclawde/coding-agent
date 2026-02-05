#!/bin/bash
# Moltbook Interaction Daemon
# Runs moltbook-interact.sh every 4 hours
# Alternative to cron when cron daemon is not available

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INTERVAL=14400  # 4 hours in seconds
LOG_FILE="/Users/apple/.openclaw/logs/moltbook-daemon.log"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log "Moltbook Interaction Daemon started"
log "Interval: $INTERVAL seconds ($(($INTERVAL / 60)) minutes)"

# Get API key from environment or file
get_api_key() {
    if [ -n "$MOLTBOOK_API_KEY" ]; then
        echo "$MOLTBOOK_API_KEY"
    elif [ -f "$HOME/.config/moltbook/credentials.json" ]; then
        python3 -c "import json; print(json.load(open('$HOME/.config/moltbook/credentials.json')).get('api_key', ''))" 2>/dev/null
    else
        log "ERROR: No API key found. Set MOLTBOOK_API_KEY or create ~/.config/moltbook/credentials.json"
        return 1
    fi
}

# Main loop
while true; do
    API_KEY=$(get_api_key)
    if [ -n "$API_KEY" ]; then
        log "Running moltbook interaction..."
        "$SCRIPT_DIR/moltbook-interact.sh" "$API_KEY" >> /Users/apple/.openclaw/logs/moltbook-interaction.log 2>&1
        EXIT_CODE=$?
        if [ $EXIT_CODE -eq 0 ]; then
            log "Interaction completed successfully"
        else
            log "Interaction failed with exit code: $EXIT_CODE"
        fi
    else
        log "Skipping interaction: no API key"
    fi
    
    log "Sleeping for $INTERVAL seconds..."
    sleep $INTERVAL
done
