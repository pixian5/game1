#!/bin/sh
# ===== 霓虹心事 · 账号数据库每日备份（在 Instabox 沙箱上执行）=====
# 流程：SQLite 一致性快照 → 完整性校验 → 本地只留最近 14 份 → 推送到两台自有服务器
# 触发：systemd 用户定时器 neon-heart-backup.timer，每天 03:30（UTC）；也可手动执行。
# 安装位置：/data/neon-heart/backup.sh（仓库留档：deploy/backup/backup.sh）
#
# 为什么不用 cp 直接复制 game.db：数据库处于预写日志模式，运行中最新的写入还在
# game.db-wal 里，直接复制主文件得到的可能是不一致甚至缺数据的快照。
# backup_db.mjs 用的是 SQLite 的 VACUUM INTO，得到的是一致性快照。
set -u

SITE=/data/neon-heart
DATA=$SITE/data
BACKUPS=$DATA/backups
KEY=$SITE/.backup/id_ed25519
KNOWN_HOSTS=$SITE/.backup/known_hosts
LOG=$DATA/backup.log
KEEP_LOCAL=14
TARGETS="uw.sbbz.tech ue.sbbz.tech"
SSH_OPTS="ssh -i $KEY -o UserKnownHostsFile=$KNOWN_HOSTS -o StrictHostKeyChecking=yes -o BatchMode=yes -o ConnectTimeout=20 -p 22"

log(){ echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') $*" >> "$LOG"; }
# 新生成的快照文件只有本人可读（备份里含用户密码哈希与存档数据）
umask 077


mkdir -p "$BACKUPS"
# 日志太长时只保留最后 200 行，避免无限增长
if [ -f "$LOG" ] && [ "$(wc -l < "$LOG")" -gt 400 ]; then
  tail -n 200 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi

STAMP=$(date -u +%Y%m%d-%H%M%S)
OUT=$BACKUPS/game-$STAMP.db
rc=0

# 1. 一致性快照
if NH_DB=$DATA/game.db node "$SITE/server/backup_db.mjs" "$OUT" >> "$LOG" 2>&1; then
  log "OK 快照 $OUT（$(wc -c < "$OUT" | tr -d ' ') 字节）"
else
  log "FAIL 快照失败"
  rm -f "$OUT"
  exit 1
fi

# 2. 完整性校验：坏文件不上传
CHECK=$(node -e "const {DatabaseSync}=require('node:sqlite'); const db=new DatabaseSync(process.argv[1],{readOnly:true}); console.log(db.prepare('PRAGMA integrity_check').get().integrity_check); console.log(db.prepare('SELECT COUNT(*) n FROM users').get().n);" "$OUT" 2>/dev/null | tr '\n' ' ')
case "$CHECK" in
  "ok "*) log "OK 校验通过（完整性 ok，用户数 ${CHECK#ok }）" ;;
  *) log "FAIL 校验未通过（$CHECK），丢弃本次快照"; rm -f "$OUT"; exit 1 ;;
esac

# 3. 本地只留最近 14 份
ls -1t "$BACKUPS"/game-*.db 2>/dev/null | tail -n +$((KEEP_LOCAL + 1)) | while read -r old; do rm -f "$old"; done

# 4. 推送到两台自有服务器（服务器端这把密钥只能往备份目录写入）
# 目标路径必须写成「.」：受限同步脚本 rrsync 把「/」判定为不安全参数并拒绝。
# 同步参数不用 -a：-a 会把本目录的权限与属主套到服务器的备份目录上
# （2026-11-23 实测把服务器目录从「仅本人可读写」改成了「组内可写」）。
# 用 -rlt 并且关闭权限/属主同步：新文件按源文件权限（600）落盘，目录属性保持不变。
# 服务器端已设为「只能新增」：已有文件不会被覆盖，也不会被删除。
for host in $TARGETS; do
  if rsync -rlt --no-perms --no-owner --no-group --timeout=120 -e "$SSH_OPTS" "$BACKUPS/" "x@$host:." >> "$LOG" 2>&1; then
    log "OK 已推送到 $host"
  else
    log "FAIL 推送到 $host 失败"
    rc=1
  fi
done

exit $rc
