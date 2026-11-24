#!/bin/sh
# ===== 在 Instabox 沙箱上运行依赖数据库的测试 =====
# 由本机的 tools/instabox_db_tests.sh 推送过来并调用；也可以在沙箱里直接执行。
#
# 为什么要有这个脚本：用户规定本机不启动数据库、不部署任何环境，
# 需要数据库或真实运行环境时一律放到 Instabox。下面两个测试都会启动账号服务进程
# 并使用 SQLite 数据库，所以不能在本机跑。
#
# 用法：sh run-db-tests.sh [api|all]
#   api（默认）账号接口测试：54 项，Node + SQLite，不需要安装任何依赖，约 10 秒
#   all        再加「账号与云存档」浏览器端到端：需要 npm install 装测试依赖，约 1 分钟
#
# 测的是远端仓库 main 分支最新提交的内容（重新克隆），所以要先提交并推送。
set -eu

MODE=${1:-api}
DIR=${NH_TEST_DIR:-/data/home/game1-dbtests}
REPO=${NH_REPO:-https://gitcode.com/laotongtian/game1.git}

rm -rf "$DIR"
git clone -q --depth 1 "$REPO" "$DIR"
cd "$DIR"
echo "代码：版本 $(cat VERSION)，提交 $(git rev-parse --short HEAD)"

echo "== 账号接口测试（Node + SQLite，自带临时数据库）=="
rc=0
node server/test_api.mjs > "$DIR/.api-test.log" 2>&1 || rc=$?
grep -v "ExperimentalWarning\|trace-warnings" "$DIR/.api-test.log" | tail -3
if [ "$rc" != 0 ]; then
  echo "账号接口测试失败，完整输出："
  grep -v "ExperimentalWarning\|trace-warnings" "$DIR/.api-test.log" | tail -40
  exit $rc
fi
[ "$MODE" = all ] || exit 0

echo "== 安装测试依赖（只装在这个克隆目录里，不动系统环境）=="
npm install --no-audit --no-fund --silent 2>&1 | tail -3

echo "== 账号与云存档浏览器端到端 =="
set +e
npx playwright test playwright/account.spec.js --project=chromium 2>&1 | tail -8
exit $?
