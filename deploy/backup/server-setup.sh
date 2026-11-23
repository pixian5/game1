#!/bin/sh
# ===== 霓虹心事 · 备份接收端初始化（在自有服务器上以普通用户 x 执行）=====
# 用法（从管理员电脑执行）：ssh x@<服务器> 'sh -s' < deploy/backup/server-setup.sh
# 作用：
#   1. 建备份目录 /srv/neon-heart-backups（仅 x 可读写）
#   2. 安装沙箱推送备份用的公钥：restrict + 强制命令 rrsync，只能往备份目录写入，
#      不能登录、不能执行其它命令、不能端口转发
#   3. 加每日清理任务：删除 90 天前的备份文件
# 可重复执行（已存在的内容不会重复添加）。
set -eu

BACKUP_DIR=/srv/neon-heart-backups
# 沙箱 /data/neon-heart/.backup/id_ed25519 的公钥
BACKUP_PUB='ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIL+rJb8d8xvsnyEFGh5lZ2RLhkBzWlk8OnoTppDqRQHJ neon-heart-backup'
RRSYNC=/usr/bin/rrsync
KEEP_DAYS=90

command -v "$RRSYNC" >/dev/null 2>&1 || { echo "缺少 $RRSYNC（需要安装 rsync）"; exit 1; }

# 1. 备份目录
sudo -n mkdir -p "$BACKUP_DIR"
sudo -n chown "$(id -un):$(id -gn)" "$BACKUP_DIR"
sudo -n chmod 700 "$BACKUP_DIR"

# 2. 受限公钥
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
touch "$HOME/.ssh/authorized_keys"
chmod 600 "$HOME/.ssh/authorized_keys"
# rrsync 选项（实测得出，缺一不可）：
#   -wo           只写：禁止读回服务器上的文件
#   -no-del       禁止删除。注意「只写」模式本身并不禁止删除——2026-11-23 实测，
#                 只加 -wo 时沙箱用「带删除的同步」可以清空整个备份目录
#   -no-overwrite 禁止覆盖已有文件。三者合起来 = 只能新增，不能改、不能删
RRSYNC_OPTS="-wo -no-del -no-overwrite"
KEY_LINE="restrict,command=\"$RRSYNC $RRSYNC_OPTS $BACKUP_DIR\" $BACKUP_PUB"
# 已有旧版本的配置行时整行替换，保证重复执行后总是最新配置
if grep -q 'neon-heart-backup$' "$HOME/.ssh/authorized_keys"; then
  if grep -qF "$KEY_LINE" "$HOME/.ssh/authorized_keys"; then
    echo "公钥已是最新配置，不重复添加"
  else
    sed -i '/neon-heart-backup$/d' "$HOME/.ssh/authorized_keys"
    echo "$KEY_LINE" >> "$HOME/.ssh/authorized_keys"
    echo "已把旧的公钥配置更新为最新限制"
  fi
else
  echo "$KEY_LINE" >> "$HOME/.ssh/authorized_keys"
  echo "已添加受限公钥"
fi

# 3. 每日清理
PRUNE=/etc/cron.daily/neon-heart-backup-prune
printf '%s\n' \
  '#!/bin/sh' \
  "# 霓虹心事数据库备份清理：删除 ${KEEP_DAYS} 天前的备份文件（由 deploy/backup/server-setup.sh 生成）" \
  "find $BACKUP_DIR -maxdepth 1 -type f -name 'game-*.db' -mtime +${KEEP_DAYS} -delete" \
  | sudo -n tee "$PRUNE" >/dev/null
sudo -n chmod 755 "$PRUNE"

echo "完成：$(hostname) 备份目录 $BACKUP_DIR，公钥 $(grep -c 'neon-heart-backup' "$HOME/.ssh/authorized_keys") 条，清理任务 $PRUNE"
