# 霓虹心事 · 账号数据库备份方案

> 2026-11-24 建立。线上 Instabox 沙箱里的账号数据库（用户、会话、云存档、审计日志）
> 每天自动做一致性快照，并推送到两台自有服务器各存一份。全部环节均已实测走通，含恢复演练。

## 一、架构

```
Instabox 沙箱                                    自有服务器 uw / ue
/data/neon-heart/data/game.db  ──┐
   │ 每天 UTC 03:30（北京时间 11:30）              /srv/neon-heart-backups/
   ├─ backup_db.mjs 一致性快照  ──┼─ rsync over SSH（专用密钥，只能新增）──▶ game-YYYYMMDD-HHMMSS.db
   ├─ 完整性校验                 │                保留 90 天，超期由每日任务删除
   ├─ 本地保留最近 14 份         │
   └─ 写日志 data/backup.log     ┘
```

| 组件 | 位置 | 作用 |
|---|---|---|
| `backup.sh` | 沙箱 `/data/neon-heart/backup.sh`（仓库 `deploy/backup/backup.sh`） | 快照 → 校验 → 清理本地 → 推送 |
| `neon-heart-backup.service` / `.timer` | 沙箱 `~/.config/systemd/user/` | 每天 03:30 UTC 触发；错过后补跑 |
| 备份专用密钥 | 沙箱 `/data/neon-heart/.backup/id_ed25519` | 只用于推送备份 |
| 受限公钥 | 服务器 `~x/.ssh/authorized_keys` | `restrict` + 强制命令 `rrsync -wo -no-del -no-overwrite` |
| 每日清理任务 | 服务器 `/etc/cron.daily/neon-heart-backup-prune` | 删除 90 天前的备份 |
| 脚本留档 | 仓库 `deploy/backup/` | `backup.sh`、`server-setup.sh`、两个 systemd 单元文件 |

## 二、服务器端那把密钥的限制（已实测）

2026-11-23 从沙箱用备份密钥做了五项测试，全部被拒：

| 尝试 | 结果 |
|---|---|
| 执行命令 | 被拒（`SSH_ORIGINAL_COMMAND does not run rsync`） |
| 读回服务器上的备份 | 被拒 |
| 用「带删除的同步」清空备份目录 | 被拒，文件完好 |
| 用同名假文件覆盖已有备份 | 被忽略，服务器文件哈希未变 |
| 建立端口转发 | 被拒 |

也就是说，即使沙箱被攻破、攻击者拿到了这把密钥，也只能往备份目录**新增**文件，
不能删除、不能篡改已有备份，不能把备份读走，不能借道进入服务器。

## 三、从零搭建（可重复执行）

### 3.1 沙箱端

```bash
# 1. 生成备份专用密钥（已存在则沿用）
mkdir -p /data/neon-heart/.backup && chmod 700 /data/neon-heart/.backup
ssh-keygen -t ed25519 -N '' -C 'neon-heart-backup' -f /data/neon-heart/.backup/id_ed25519
cat /data/neon-heart/.backup/id_ed25519.pub          # 把这行公钥填进 server-setup.sh

# 2. 固定服务器的主机指纹（防止连到假冒的机器）
#    指纹必须与通过可信渠道在服务器上执行 ssh-keygen -lf /etc/ssh/ssh_host_*_key.pub 得到的结果对账
ssh-keyscan -p 22 -t ed25519,rsa uw.sbbz.tech ue.sbbz.tech > /data/neon-heart/.backup/known_hosts
chmod 600 /data/neon-heart/.backup/known_hosts
```

### 3.2 服务器端（两台各执行一次）

```bash
ssh x@<服务器> 'sh -s' < deploy/backup/server-setup.sh
```

脚本可重复执行；更新限制选项后再跑一遍即可，它会把旧的公钥配置整行替换掉。

### 3.3 沙箱端安装定时器

```bash
cp deploy/backup/backup.sh                     /data/neon-heart/backup.sh && chmod 700 /data/neon-heart/backup.sh
cp deploy/backup/neon-heart-backup.service     ~/.config/systemd/user/
cp deploy/backup/neon-heart-backup.timer       ~/.config/systemd/user/
sudo loginctl enable-linger x                  # 没有登录会话时也运行用户级定时器
systemctl --user daemon-reload
systemctl --user enable --now neon-heart-backup.timer

# 立即跑一次并查看结果
systemctl --user start neon-heart-backup.service
systemctl --user show neon-heart-backup.service -p ExecMainStatus --value     # 0 = 成功
tail /data/neon-heart/data/backup.log
```

## 四、日常检查

```bash
# 沙箱上：最近几次的备份结果与下次运行时间
instabox exec <实例编号> -- 'grep -v Warning /data/neon-heart/data/backup.log | tail -8; systemctl --user list-timers --all | grep neon-heart'

# 服务器上：有哪些备份、是否完好
ls -la /srv/neon-heart-backups/
python3 -c "import sqlite3; c=sqlite3.connect('file:/srv/neon-heart-backups/game-XXXX.db?mode=ro', uri=True); print(c.execute('PRAGMA integrity_check').fetchone())"
```

日志里出现 `FAIL` 就要处理：`FAIL 快照失败` 多半是磁盘满或数据库文件损坏；
`FAIL 推送到 … 失败` 先查沙箱到服务器的网络，再查服务器上的受限公钥配置。

## 五、恢复流程（2026-11-24 已演练通过）

适用场景：沙箱被销毁、数据库损坏、误删用户数据。

```bash
# 1. 从自有服务器取回指定日期的备份（也可以直接在沙箱本地 backups/ 目录里找）
ssh x@uw.sbbz.tech 'cat /srv/neon-heart-backups/game-YYYYMMDD-HHMMSS.db' > /tmp/game.db
#    并核对哈希与服务器上的一致：ssh x@uw.sbbz.tech 'sha256sum /srv/neon-heart-backups/game-….db'

# 2. 先在临时实例上验证备份可用（不要直接覆盖线上）
NH_DB=/tmp/game.db NH_PORT=18097 NH_HOST=127.0.0.1 node server/index.mjs
curl http://127.0.0.1:18097/api/health          # 期望 database: ok

# 3. 确认无误后再替换线上数据库（会中断服务几秒）
#    停服务 → 移走旧库及预写日志 → 放入备份 → 启动
```

演练记录：从 `uw` 取回备份（哈希 `a67ceb1ab12fe950…`，与服务器一致），临时实例健康检查 `database: ok`，
并在恢复出来的数据库上实际完成了一次注册与登录（用户、会话、审计三张表均有新行）。

## 六、踩过的坑

| 现象 | 原因 | 处理 |
|---|---|---|
| `backup_db.mjs` 报 `unable to open database file` | 它默认找 `server/data/game.db`，线上库的位置由 `NH_DB` 指定 | 调用时带上 `NH_DB=/data/neon-heart/data/game.db` |
| `rrsync error: unsafe arg: /` | 受限同步脚本不接受根目录写法 | 目标写成 `x@主机:.` |
| **「只写」模式仍能删除** | `rrsync -wo` 只禁止读取，不禁止删除。实测只加 `-wo` 时，一个「带删除的同步」清空了 uw 上的备份目录 | 加 `-no-del -no-overwrite` |
| 同步后服务器目录权限变成组内可写 | `-a` 会把本地目录的权限与属主套到服务器目录上 | 改用 `-rlt --no-perms --no-owner --no-group`，并在脚本里设 `umask 077` |
| 本机连不上服务器 22 端口 | 本机流量走代理隧道，代理出口到服务器这一段不通；服务器本身正常 | 绑定物理网卡直连：`ssh -b <本机局域网地址> x@<服务器真实地址>` |

## 七、已知限制

1. **沙箱暂停期间定时器不运行**，恢复后会补跑一次；沙箱被销毁则沙箱内的定时器与密钥都不复存在，
   需要按第三节重新搭建。服务器上已有的备份不受影响。
2. **备份没有做静态加密**。传输走 SSH，落盘在用户自己的服务器上，文件权限 600。
   当前库内没有真实用户；在有真实用户之前，建议评估是否加密（密钥需由用户保管，
   否则沙箱没了密钥也没了，备份就打不开）。
3. **服务器自身的登录密钥尚未更换**（见整体分析中的凭据泄露一节）。在更换之前，
   服务器上的备份对掌握旧私钥的人是可读的。目前备份内容为空库，暂无实际影响。
4. **游戏服务进程没有开机自启**：沙箱 `/data/neon-heart/serve-loop.sh` 是手动拉起的，
   沙箱真正重启后不会自动恢复。建议改成 systemd 用户服务托管（`Restart=always` + `WantedBy=default.target`），
   但需要一次短暂停机切换，并且要在维护窗口里做。
