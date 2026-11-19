#!/usr/bin/env bash
# push_all.sh - 推送当前已配置的全部远端并校验一致性（不再硬编码任何平台）
set -uo pipefail
cd "$(dirname "$0")"
BRANCH="${1:-main}"
FAILED=()
REMOTES="$(git remote)"
if [ -z "$REMOTES" ]; then
  echo "当前仓库未配置任何远端，请先 git remote add <name> <url>"
  exit 1
fi
for remote in $REMOTES; do
  if ! git remote | grep -qx "$remote"; then echo "skip $remote"; continue; fi
  echo "==> push $remote"
  if git push "$remote" "$BRANCH"; then echo "    OK $remote"; else echo "    FAIL $remote"; FAILED+=("$remote"); fi
done
echo ""
echo "=== verify ==="
git fetch --all --quiet 2>/dev/null || true
LOCAL=$(git rev-parse --short HEAD)
echo "local $BRANCH: $LOCAL"
MISMATCH=0
for remote in $REMOTES; do
  git remote | grep -qx "$remote" || continue
  R=$(git rev-parse --short "$remote/$BRANCH" 2>/dev/null || echo "?")
  if [ "$R" = "$LOCAL" ]; then echo "  OK  $remote = $R"; else echo "  BAD $remote = $R"; MISMATCH=1; fi
done
if [ "${#FAILED[@]}" -gt 0 ] || [ "$MISMATCH" = "1" ]; then
  echo "PUSH FAILED: ${FAILED[*]}"
  exit 1
fi
echo "all configured remotes synced to $LOCAL"
