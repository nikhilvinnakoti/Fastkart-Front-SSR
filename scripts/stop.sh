#!/bin/bash

# Kill any process running on SSR port (example 4000 or 3000)
PORT=4000  # (whatever SSR server uses)
PID=$(lsof -ti tcp:$PORT)

if [ -n "$PID" ]; then
  kill -9 $PID
fi
