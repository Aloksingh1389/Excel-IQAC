#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR/frontend" || exit 1

echo "========================================================"
echo "  IQAC Institutional Quality Management System Portal"
echo "========================================================"
echo ""

if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing dependencies..."
    npm install
fi

echo ""
echo "[INFO] Starting Development Server..."
echo "[INFO] Opening http://localhost:5173 ..."
echo ""

npm run dev -- --open
