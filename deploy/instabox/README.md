# Instabox 沙箱上的游戏服务托管

> 2026-11-24 建立。把 `/data/neon-heart/serve-loop.sh` 交给 systemd 用户服务托管，解决「沙箱重启后服务不会自己回来」的问题。

## 一、为什么需要它

`serve-loop.sh` 只负责「服务进程崩了自动拉起」。此前它是用 `setsid nohup` 手动启动的，
所以沙箱一旦真正重启，服务不会自动恢复。交给 systemd 之后：

- 开机自启（配合 `loginctl enable-linger x`，不需要有人登录）；
- 守护脚本本身被杀掉也会被重新拉起；
- 运行行为与之前完全一致（还是那个守护脚本在跑服务进程）。

## 二、安装

```bash
# 沙箱实例编号用 instabox ls --json 查；名字会变，编号不变
BOX=m_agqxoy6u363jxgfufg2onqxbm4
instabox push "$BOX" deploy/instabox/neon-heart.service /data/home/.config/systemd/user/neon-heart.service -p
instabox exec "$BOX" -- 'sudo loginctl enable-linger x; systemctl --user daemon-reload; systemctl --user enable --now neon-heart.service'
```

如果此前已有手动启动的 `serve-loop.sh` 在运行，切换顺序见下一节，中断只有几秒。

## 三、从手动启动切换到托管（2026-11-24 实际采用的做法）

```bash
L=$(pgrep -f "^/bin/sh /data/neon-heart/serve-loop.sh$")     # 手动启动的守护脚本
N=$(pgrep -f "^node /data/neon-heart/server/index.mjs$")     # 它拉起的服务进程
systemctl --user start neon-heart.service                     # 托管实例先启动，因端口被占它会每 2 秒重试
sleep 3
kill "$L"; kill "$N"                                          # 先杀旧守护脚本（防止它再拉起），再杀旧服务进程
# 托管实例在下一个重试周期接管
```

端口被占时服务进程的行为已实测：记录一条 `listen EADDRINUSE` 后**立即自行退出**，不会僵持。

## 四、日常操作

```bash
systemctl --user status neon-heart.service      # 状态
systemctl --user restart neon-heart.service     # 重启
journalctl --user -u neon-heart.service -n 50   # 守护脚本本身的输出
tail /tmp/neon-server-8081.log                  # 服务进程的访问日志（由 serve-loop.sh 写入）
```

重启服务仍然可以用老办法 `sudo fuser -k 8081/tcp`：服务进程被杀后守护脚本 2 秒内拉起。

## 五、实测记录（2026-11-24）

| 场景 | 结果 |
|---|---|
| 服务进程被强制杀掉 | 约 2 秒后恢复（守护脚本拉起） |
| 守护脚本本身被强制杀掉 | 约 4 秒后恢复（systemd 重新拉起整个单元） |
| 守护脚本的上级进程 | 用户级服务管理器（确认已归 systemd 托管） |
| 开机自启 | `is-enabled` 为 `enabled`，`Linger=yes` |
| 外部验收 | 版本一致、代码包哈希一致、控制台错误 0 |

**未能验证的一点**：沙箱「真正重启后自动恢复」本身没有实测——不想为了验证而重启正在服务的沙箱。
依据是标准机制：开机时用户级服务管理器启动默认目标，默认目标包含这个已启用的服务。
下次沙箱自然重启时留意一下服务是否自动回来。

## 六、回滚

```bash
systemctl --user disable --now neon-heart.service
setsid nohup /data/neon-heart/serve-loop.sh > /dev/null 2>&1 < /dev/null &
```
