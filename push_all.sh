#!/usr/bin/env bash
# ===== 三远端成套推送（v0.6.7 修正版）=====
# 一次推送 gitee/github/gitcode 三个远端，推送后校验三者与本地一致，不一致即报错退出。
# 用法：bash push_all.sh [分支名，默认 main]
set -uo pipefail
cd "$(dirname "$0")"

BRANCH="${1:-main}"
FAILED=()

for remote in gitee github gitcode; do
  if ! git remote | grep -qx "$remote"; then
    echo "跳过 $remote（未配置）"
    continue
  fi
  echo "==> 推送到 $remote"
  if git push "$remote" "$BRANCH"; then
    echo "    OK $remote"
  else
    echo "    FAIL $remote"
    FAILED+=("$remote")
  fi
done

echo ""
echo "=== 一致性校验 ==="
git fetch --all --quiet 2>/dev/null || true
LOCAL=$(git rev-parse --short HEAD)
echo "本地 $BRANCH: $LOCAL"
MISMATCH=0
for remote in gitee github gitcode; do
  git remote | grep -qx "$remote" || continue
  R=$(git rev-parse --short "$remote/$BRANCH" 2>/dev/null || echo "?")
  BEHIND=$(git rev-list --count "$remote/$BRANCH..$BRANCH" 2>/dev/null || echo "?")
  if [ "$R" = "$LOCAL" ] && [ "$BEHIND" = "0" ]; then
    echo "  OK  $remote/$BRANCH = $R"
  else
    echo "  BAD $remote/$BRANCH = $R（落后 $BEHIND 个提交）"
    MISMATCH=1
  fi
done

if [ "${#FAILED[@]}" -gt 0 ] || [ "$MISMATCH" = "1" ]; then
  echo ""
  echo "推送未完全成功：${FAILED[*]:-（远端不一致）}"
  exit 1
fi
echo ""
echo "三远端全部同步到 $LOCAL"
