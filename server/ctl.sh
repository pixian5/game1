#!/usr/bin/env bash
# 霓虹心事账号服务：启动 / 停止 / 重启 / 状态 / 日志
# 用法：server/ctl.sh start|stop|restart|status|logs
# 可用环境变量：NH_PORT NH_HOST NH_DB NH_DATA_DIR NODE_BIN
# 设计目标：单机容器可直接用，不依赖 systemd；PID/日志/数据库全部落在 server/data/（已 gitignore）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="${NH_DATA_DIR:-$ROOT/server/data}"
PID_FILE="$DATA_DIR/server.pid"
LOG_FILE="$DATA_DIR/server.log"
PORT="${NH_PORT:-8095}"
HOST="${NH_HOST:-0.0.0.0}"
DB_PATH="${NH_DB:-$DATA_DIR/game.db}"
NODE_BIN="${NODE_BIN:-node}"

mkdir -p "$DATA_DIR"

health(){
  curl -fsS -m 2 "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1
}

read_pid(){
  [ -f "$PID_FILE" ] || return 1
  local pid
  pid="$(cat "$PID_FILE" 2>/dev/null || true)"
  case "$pid" in
    ''|*[!0-9]*) return 1 ;;
  esac
  kill -0 "$pid" 2>/dev/null || return 1
  printf '%s' "$pid"
}

start(){
  local pid
  if pid="$(read_pid)"; then
    echo "[account] 已在运行：pid=$pid port=$PORT"
    return 0
  fi
  if health; then
    echo "[account] 端口 ${PORT} 已有健康服务，但 PID 文件不存在；请先确认占用进程，未自动接管。" >&2
    return 1
  fi
  echo "[account] 启动：port=$PORT host=$HOST db=$DB_PATH"
  NH_PORT="$PORT" NH_HOST="$HOST" NH_DB="$DB_PATH" \
    nohup "$NODE_BIN" "$ROOT/server/index.mjs" >> "$LOG_FILE" 2>&1 &
  local child=$!
  echo "$child" > "$PID_FILE"
  for _ in $(seq 1 40); do
    if health; then
      echo "[account] 启动成功：pid=$child log=$LOG_FILE"
      return 0
    fi
    kill -0 "$child" 2>/dev/null || break
    sleep 0.25
  done
  echo "[account] 启动失败，最近日志：" >&2
  tail -n 30 "$LOG_FILE" >&2 || true
  stop || true
  return 1
}

stop(){
  local pid
  if ! pid="$(read_pid)"; then
    rm -f "$PID_FILE"
    echo "[account] 未在运行"
    return 0
  fi
  echo "[account] 停止：pid=$pid"
  kill "$pid" 2>/dev/null || true
  for _ in $(seq 1 20); do
    kill -0 "$pid" 2>/dev/null || break
    sleep 0.25
  done
  if kill -0 "$pid" 2>/dev/null; then
    echo "[account] 优雅退出超时，强制结束 pid=$pid"
    kill -9 "$pid" 2>/dev/null || true
  fi
  rm -f "$PID_FILE"
  echo "[account] 已停止"
}

status(){
  local pid
  if pid="$(read_pid)"; then
    echo "[account] 运行中：pid=$pid port=$PORT"
  else
    echo "[account] 未运行（PID 文件 $PID_FILE 不存在或进程已退出）"
    return 3
  fi
  if health; then
    echo "[account] 健康检查：OK"
    curl -fsS -m 2 "http://127.0.0.1:${PORT}/api/health"
    echo
  else
    echo "[account] 健康检查：失败" >&2
    return 4
  fi
}

case "${1:-}" in
  start) start ;;
  stop) stop ;;
  restart) stop; start ;;
  status) status ;;
  logs) tail -n 100 -f "$LOG_FILE" ;;
  *) echo "用法：$0 start|stop|restart|status|logs" >&2; exit 2 ;;
esac
