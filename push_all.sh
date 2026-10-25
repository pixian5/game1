#!/usr/bin/env bash
# ===== 三远端成套推送（v0.6.5）=====
# 背景：本项目有三个远端（gitee/github/gitcode），历史上多次出现「只推了其中一个」导致
# CI 跑旧代码、备份线落后几十个提交。此脚本一次全推并在最后校验三者是否一致。
# 用法：bash push_all.sh
set -uo pipefail
cd "$(dirname "$0")"

BRANCH="${1:-main}"
FAILED=()

for remote in gitee github gitcode; do
  if ! git remote | grep -qx "$remote"; then
    echo "⚠ 跳过 $remote（未配置）"; continue
  fi
  printf '==> 推送到 %-8s ' "$remote"
  if git push "$remote" "$BRANCH" 2>&1 | tail -1; then
    echo "    ✓ $remote"
  else
    echo "    ✗ $remote 失败"
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
    echo "  ✓ $remote/$BRANCH = $R"
  else
    echo "  ✗ $remote/$BRANCH = $R（落后 $BEHIND 个提交）"
    MISMATCH=1
  fi
done

if [ ${#FAILED[@]} -gt 0 ] || [ "$MISMATCH" = "1" ]; then
  echo ""
  echo "❌ 推送未完全成功：${FAILED[*]:-（远端不一致）}"
  exit 1
fi
echo ""
echo "✅ 三远端全部同步到 $LOCAL"
