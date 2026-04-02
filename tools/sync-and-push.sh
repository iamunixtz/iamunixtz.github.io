#!/usr/bin/env bash
# Sync with remote (pull rebase) then push. Run when you get "rejected (non-fast-forward)".
set -e
cd "$(git rev-parse --show-toplevel)"

echo ">>> Fetching and rebasing on origin/main..."
git fetch origin
git pull --rebase origin main

echo ">>> Pushing..."
git push origin main

echo "Done. Build and Deploy will run on GitHub."
