#!/bin/bash

LOG_FILE="/tmp/install-script.log"

log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $1" | tee -a "$LOG_FILE"
}

log "=== Running install.sh ==="

cd /home/ec2-user/fastkart/frontend || {
  log "Failed to cd into /home/ec2-user/fastkart/frontend"
  exit 1
}

log "Installing Node.js dependencies..."
npm install >> "$LOG_FILE" 2>&1

log "npm install completed."
