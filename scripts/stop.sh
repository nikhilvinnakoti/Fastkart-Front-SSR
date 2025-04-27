#!/bin/bash

# Check if lsof is installed
if ! command -v lsof &> /dev/null
then
    echo "lsof could not be found, installing it now..."
    sudo yum install -y lsof  # Use sudo if necessary, or install using apt on Ubuntu/Debian
    if ! command -v lsof &> /dev/null
    then
        echo "lsof installation failed. Please install lsof manually."
        exit 1
    fi
fi

# Kill any process running on SSR port (example 4000 or 3000)
PORT=4000  # (adjust port based on your SSR server)

# Find the PID of the process using the port
PID=$(lsof -ti tcp:$PORT)

# If a process is found, kill it
if [ -n "$PID" ]; then
    echo "Killing process $PID on port $PORT..."
    kill -9 $PID
else
    echo "No process found on port $PORT."
fi

# Optionally, gracefully stop using PM2 if you're managing your app with PM2
echo "Attempting to stop SSR server using PM2..."
pm2 stop serve:ssr || true  # Stop the SSR app gracefully with PM2
pm2 delete serve:ssr || true  # Delete the app from PM2 process list (optional)
