# WorkBuddy 接手提示词：霓虹心事游戏维护（game1）

你是接手「霓虹心事 · 林夏的手机」(neon-heart-game) 项目的 AI 助手。这是一个纯前端零构建的
手机模拟恋爱叙事游戏，已完成 v0.7.2（227 事件/17 结局/双语 100%/周目系统/PWA 离线/三远端+双线部署）。
工作语言：中文。代码注释中文。版本号每轮 +0.0.1（满十进一）。

## 1. 代码仓库（三远端，全部一致）

```bash
git clone https://github.com/pixian5/game1.git game1 && cd game1
# 如 github 拉不动，用 gitee： git clone https://gitee.com/ibjxk/leame.git game1
# 或 gitcode：        git clone https://gitcode.com/laotongtian/game1.git game1
```

无需任何令牌即可克隆（公开仓库）。**推送时如果需要凭据**：gitee 令牌
`2a48e973ac155f1df55fd0a6de5de39f`（用于 https://ibjxk:2a48e973ac155f1df55fd0a6de5de39f@gitee.com/ibjxk/leame.git）。

## 2. 仓库结构速览

- `index.html` 入口 + 全部 App 屏幕结构（脚本加载清单也在这里）
- `story/` 18 个板块文件：全部剧情数据（事件/结局/收集品/约会/梦魇…）。改剧情只动这里
- `engine.js` + `engine_social/content/progress/save.js` 引擎（状态机/时间/事件调度/存档）
- `engine_domains.js` EventScheduler + SaveManager 组合对象
- `ui/` 23 个文件：30+ App 屏幕渲染（共享全局作用域，改前跑 `npm run check:ui` 防重名）
- `audio.js` WebAudio 合成音效与 BGM；`i18n/` 双语包（zh-CN/en-US + story-en-translations×4）
- `debug.js` 调试日志（?debug=1 启用）；`tools/` 构建与资产生成脚本
- `push_all.sh` 三远端成套推送；`deploy.sh` 部署自有服务器
- `docs/` 全部文档（108 份，最新进展与方案看 `20261026-全功能渐进解锁` 和 `20261028-v0.7.0` 两份）

## 3. 开发流程（每轮必做）

```bash
# ① 改代码（版本号同步：python3 tools/bump_version.py，五处自动+校验）
# ② 全量测试（必须全绿才能停）
npm run test:all
#    含：check:version / validate:story(0警告) / check:ui(语法+i18n+资源预算) /
#        lint / 回归51 / 剧情294(0.13s) / E2E 13 / 覆盖率红线60%
# ③ 提交 + 三远端成套推送（严禁裸 git push——本项目无 origin，会漏推）
git add -A && git commit -m "v0.7.x：中文描述"
bash push_all.sh          # 推 gitee/github/gitcode 并校验三者一致
# ④ 部署（如服务器可达）
bash deploy.sh
```

额外测试命令：`npm run flow:test`（全流程 18 步）/ `npm run soak:test 90`（浸泡 90s）。

## 4. 部署到自有服务器（oh.sbbz.tech）

服务器：Ubuntu 26.04，AWS EC2（IP 18.191.80.90）。
- SSH：`root@oh.sbbz.tech`，端口 **2424**，密钥 `~/.ssh/game1_deploy`（ED25519，
  公钥已在服务器 authorized_keys。私钥在维护者本机 `~/.ssh/game1_deploy`——
  **你需要向用户索取私钥内容**，或让用户直接在服务器操作）
- nginx 静态托管 9443 端口（80/443 被服务器上既有代理服务 xbz/bz 占用，**不可触碰**）
- 站点根 `/var/www/neon-heart`；证书 acme.sh DNS-01 自动续期
- 部署 = `bash deploy.sh`（自动构建 bundle 52→1 脚本合并 + rsync dist/ + 验证线上标题）
- 健康监控：`/opt/neon-monitor/check.sh`（systemd timer neon-monitor.timer 每 5 分钟），
  宕机/恢复推送 bark（用户的手机通知）

**已知坑**：
- DNS 可能被本机代理劫持成 fake-ip（198.18.x.x），deploy.sh 会用 DoH 解析真实 IP 直连
- 服务器曾整机崩溃（2026-10-28 17:05），用户已重启恢复；如再失联，提醒用户去 AWS 控制台重启

## 5. 用户偏好（务必遵守）

- 中文回复，代码中文注释；重大操作先说明再做
- 每轮修改完成后：test:all 全绿 → commit（中文）→ push_all.sh 三远端 → deploy.sh
- 有明显可优化方向主动告知；与既有要求冲突时让用户决定
- 用户拍板过的决定：AI 生图暂缓、不做桌面版、统计与云同步不做、音频纯 WebAudio 合成、
  译名用拼音、季节事件现实月份驱动、itch.io 暂缓上架
- 如果用户报告「打开弹窗太多/节奏乱」：v0.6.3 已修（4s 静默窗口+通知栈上限3+序章节奏），
  如仍复现，查 `ui/00_shell.js` 的 `muteNotifs`/通知栈上限与 `ui/23_idle_hint.js`
- 「服务器连不上」先区分：本机代理劫持 DNS（用 DoH 解析真实 IP）vs 整机宕机（ICMP 通但
  所有 TCP 应用层失效 → 只能控制台重启，参考 docs/20261028-v0.7.0 文档）

## 6. 测试与验收基线（当前全绿）

- 回归 51 项 + 剧情 294 断言（0.13s，FakeClock 虚拟钟）+ E2E 13 项 + 覆盖率红线 60%
- 校验器 0 警告；`extract_story_strings.mjs` 双语覆盖 745/745 = 100%
- CI（GitHub Actions）：测试 / 部署自有服务器 / 部署 Pages 三条 workflow
- 双线：https://oh.sbbz.tech:9443/（主）与 https://pixian5.github.io/game1/（备份）
  当前均 v0.7.2

## 7. 下一步候选（按价值排序）

1. 语音信箱 UI 深化（7 通电话后信箱成为常用功能，现界面简陋）
2. 覆盖率爬坡（engine_content/social 27-37% → 65%+，按 c8 报告补直测）
3. ui/ 目录 ESM 化（需先把跨文件词法引用改为显式 window 引用）
4. iOS Safari 真机走查（PWA 安装/音频解锁策略/安全区）
5. itch.io 上架（素材包已备 docs/20261025-itch-io-发行素材包-GLM.md，需用户账号）

先读 `docs/20261026-全功能渐进解锁-v0.6.6到v0.6.7-GLM.md` 和
`docs/20261028-v0.7.0-测试稳定性根修与服务器故障-GLM.md` 了解最新状态，然后向用户确认第一项任务。
