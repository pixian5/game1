#!/bin/sh
# ===== 在 Instabox 沙箱上运行依赖数据库的测试（本机入口）=====
# 用法：
#   npm run test:db:instabox           账号接口测试（74 项，约 15 秒）
#   npm run test:db:instabox -- all    再加「账号与云存档」浏览器端到端（约 1 分钟）
# 可用环境变量 INSTABOX_BOX 指定沙箱实例编号（默认是本项目一直用的那个）。
#
# 认证二选一：instabox login 登录，或设置环境变量 INSTABOX_API_KEY。
# 密钥不写在本脚本里（本仓库是公开的），请从用户的全局指令文件里取。
#
# 测的是远端仓库 main 分支的最新提交，所以要先提交并推送，再运行本命令。
set -eu

cd "$(dirname "$0")/.."

BOX=${INSTABOX_BOX:-m_agqxoy6u363jxgfufg2onqxbm4}
MODE=${1:-api}

command -v instabox >/dev/null 2>&1 || { echo "找不到 instabox 命令，请先安装"; exit 2; }

# 把沙箱里执行的脚本推过去，再调用它。只推这一个文件，不动沙箱上的线上站点。
PUSH_OUTPUT=$(instabox push "$BOX" deploy/instabox/run-db-tests.sh /data/home/run-db-tests.sh 2>&1) || {
  echo "$PUSH_OUTPUT" | tail -2
  case "$PUSH_OUTPUT" in
    *unauthenticated*|*session\ expired*)
      echo "认证失败：请先执行 instabox login，或设置环境变量 INSTABOX_API_KEY 后重试。" ;;
  esac
  exit 3
}

set +e
instabox exec "$BOX" --timeout 600 -- "sh /data/home/run-db-tests.sh $MODE"
exit $?
