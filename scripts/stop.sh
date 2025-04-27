#!/bin/bash

# =========================
# Setup logging
# =========================
LOG_FILE="/tmp/stop-script.log"

# Create a function to log with timestamps
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $1" | tee -a "$LOG_FILE"
}

log "===== Starting stop.sh script ====="

# =========================
# Check if lsof is installed
# =========================
if ! command -v lsof &> /dev/null
then
    log "lsof could not be found. Installing it now..."
    sudo yum install -y lsof
    if ! command -v lsof &> /dev/null
    then
        log "lsof installation failed. Please install manually."
        exit 1
    fi
else
    log "lsof is already installed."
fi

# =========================
# Kill process on SSR port
# =========================
PORT=4000  # Adjust this if your SSR server uses a different port

log "Checking for process on port $PORT..."
PID=$(lsof -ti tcp:$PORT)

if [ -n "$PID" ]; then
    log "Found process $PID on port $PORT. Killing it..."
    kill -9 $PID
    log "Process $PID killed."
else
    log "No process found on port $PORT."
fi

# ========================
# Try stopping via PM2 (optional)
# =========================
log "Attempting to stop SSR server using PM2..."

if command -v pm2 &> /dev/null
then
    pm2 stop serve:ssr || true
    pm2 delete serve:ssr || true
    log "PM2 stop and delete commands issued."
else
    log "PM2 not found. Skipping

