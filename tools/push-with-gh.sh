#!/usr/bin/env bash
# Push to GitHub using gh for authentication (no plain git credentials).
# Run from repo root: bash tools/push-with-gh.sh

set -e
cd "$(git rev-parse --show-toplevel)"

# Use gh as git credential helper so the push uses your gh login
gh auth setup-git

# Push current branch to origin
git push origin main

echo "Done. GitHub Pages will rebuild shortly."
