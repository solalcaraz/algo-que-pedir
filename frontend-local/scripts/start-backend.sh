#!/bin/bash
set -e

BACKEND_DIR="../algo-que-pedir-backend-2025-grupo2"
PORT=9000
REPO_URL="https://github.com/algo3-unsam/algo-que-pedir-backend-2025-grupo2.git"

if [ ! -d "$BACKEND_DIR/.git" ]; then
  echo "📥 Cloning repository into $BACKEND_DIR..."
  mkdir -p "$(dirname "$BACKEND_DIR")"
  git clone "$REPO_URL" "$BACKEND_DIR"
else
  echo "📡 Pulling latest changes in $BACKEND_DIR..."
  (cd "$BACKEND_DIR" && git pull && cd ..)
fi

cd "$BACKEND_DIR"
./gradlew bootRun -Pserver.port=$PORT --no-daemon

# no hay que tratar de levantar en el mismo comando back y front
# porque se va a quedar colgado una vez que levanta Springboot