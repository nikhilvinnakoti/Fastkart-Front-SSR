#!/bin/bash

LOG_FILE="/tmp/start-script.log"

log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $1" | tee -a "$LOG_FILE"
}

log "=== Running start.sh ==="

cd /home/ec2-user/fastkart/frontend || {
  log "Failed to cd into /home/ec2-user/fastkart/frontend"
  exit 1
}

log "Starting SSR server..."
npm run serve:ssr >> "$LOG_FILE" 2>&1 &

log "SSR server started."

