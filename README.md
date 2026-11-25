# 霓虹心事 · 林夏的手机（neon-heart-game）

一个「模拟一部手机」的沉浸式多线互动叙事游戏。剧情不靠传统对话框推进，而是通过手机里的
消息、电话、朋友圈、群聊、相册、备忘录发生：三位男主同时找你，何时回复、回谁、回不回，
全部由你决定，已读不回会有后果。

游戏本体是纯前端（HTML / CSS / 原生 JS，运行时零依赖、无构建步骤）；账号与云存档是**可选增强**，
由同仓库的 Node 22 服务提供（内置 `http` + `node:sqlite`，不引入任何运行时 npm 依赖）。

- 当前版本：**v0.9.12**（版本唯一来源：[VERSION](VERSION)）
- 主角：林夏（策展人）｜路线：沈砚之 / 陆辞 / 江屿 / 独行线（真结局）
- 内容体量：338 个剧情事件 · 17 个结局（含隐藏结局）· 19 件收集品 · 15 个成就 · 3 个谜题 · 16 张塔罗 · 7 套主题（含真实壁纸）· 5 张相册照片 · 4 张角色插画头像 · 3 张氛围壁纸 · 1 张 OG 分享图 · 6 个地点

## 快速开始

**在线入口**（版本为 2026-11-25 实测；线上以 `/api/health` 与页面标题为准）：

| 入口 | 地址 | 说明 |
|---|---|---|
| Instabox（主入口，含账号与云存档） | https://8081-agqxoy6u363jxgfufg2onqxbm4.instabox.tech | 线上 **v0.9.12**；服务已设开机自启；数据库每日在沙箱内自动快照（推送到自有服务器目前失败，见「下一步待实现」） |
| GitHub Pages | https://pixian5.github.io/game1/ | 纯静态，**v0.9.7**，需手动更新 |
| 抱脸 Space | https://xbzsb-neon-heart.static.hf.space/index.html | 纯静态，**v0.9.0**，令牌失效待重签 |
| 自有服务器 `uw` / `ue.sbbz.tech` | — | 游戏未部署；作为数据库备份接收端；**2026-11-25 起 SSH 连不上，备份推送失败** |

代码仓库：GitCode（https://gitcode.com/laotongtian/game1.git，AtomGit 是同一个仓库的另一个域名）· Gitee（https://gitee.com/ibjxk/leame）· GitHub（https://github.com/pixian5/game1）。三处已同步。

> **Git 历史已于北京时间 2026-11-24 03:50 前后改写**（清除历史提交里的凭据），此后所有提交编号都变了。
> 改写之前克隆的仓库请重新克隆，或执行 `git fetch origin && git reset --hard origin/main`；
> 不要从旧克隆强推或合并，否则会把带凭据的历史重新带回来。
> 详见 [docs/20261124-0446-Git历史清理与线上部署与备份建立-GLM-5.4.md](docs/20261124-0446-Git历史清理与线上部署与备份建立-GLM-5.4.md)。

> 这三个线上入口都**不会**随代码推送自动更新，需要手动部署。

本地游玩：直接双击 `index.html`（无构建、无依赖），或：

```bash
node test_server.js     # 打开 http://127.0.0.1:4187（纯静态，无账号接口）
```

支持 PWA：在线版可「添加到主屏幕」并离线游玩。

### 账号与云存档（可选）

同源启动静态站点 + 账号 API（默认 8095，需要 Node 22+）：

```bash
npm run serve:account                 # 前台运行，打开 http://127.0.0.1:8095
server/ctl.sh start|stop|restart|status|logs   # 后台运行/运维（PID、日志落在 server/data/）
node server/backup_db.mjs             # 生成 SQLite 一致性备份
```

功能：注册 / 登录 / 30 天会话 / 一次性找回码重置 / 改密（踢其它设备）/ 设备列表与单设备退出 /
昵称 / 账号数据导出 / 注销（级联清空云端数据）/ 4 槽云存档整包上传与恢复 / revision 冲突二选一 /
自动同步 / 中英双语 / 限流与安全审计。未登录或账号服务不可用时，游戏仍可完全离线游玩。

运行全部校验与测试：

```bash
npm install                        # 首次：安装测试依赖（@playwright/test / eslint），并自动启用推送前检查钩子
npm run gate                       # 本机总闸（推荐）：离线检查集 + 代码规范 + 结局可达性 + 翻译缺口 + 安全 + 离线可用性 + 英文模式首层实测，约 90 秒
npm run gate:full                  # 本机总闸完整档：上一行 + 三浏览器端到端 + 英文模式深入实测，约 4.2 分钟
npm run test:db:instabox -- all    # 依赖数据库的测试，在 Instabox 沙箱上跑：账号接口 74 项 + 账号与云存档端到端，约 30 秒
```

> **本机不跑依赖数据库的测试。** 账号接口测试与账号端到端都会启动服务进程并使用 SQLite 数据库，
> 按规定一律放到 Instabox 上：`npm run test:db:instabox`（只跑接口测试）或加 `-- all`。
> 它测的是远端 main 分支的最新提交，所以要先提交并推送再运行。
> 认证用 `instabox login` 或环境变量 `INSTABOX_API_KEY`（密钥不写在仓库里）。

> **推送前钩子**：`npm install` 之后，每次 `git push` 之前会自动执行不依赖浏览器、不依赖数据库的
> 离线检查（约 47 秒，含翻译层测试与两项文字覆盖检查），未通过则中止推送。同一提交通过一次后，往多个远端连续推送不重复跑。
> 确需跳过某一次：`SKIP_GATE=1 git push ...`，并在提交说明里写明原因。

> **英文模式**：数据里的文字在渲染处显式翻译（`optText` / `tEsc` / `window.t`）；带数字或名字的拼接文字，
> 字典里写成带占位符的模板（如 `"第{n}天的牌阵 · {r}"`），显示层会按形状自动套用。新增或改了界面文字后跑
> `npm run check:i18n-literals` 与 `npm run check:i18n-leak`；确实不是给玩家看的文字写进 `tools/i18n-literal-allow.txt`。

单项命令：

```bash
npm run check:version      # 版本号一致性（VERSION / package.json / index.html / sw.js）
npm run check:ui           # 前端语法合并编译 + 引用完整性（含 SW 不缓存 /api 的守卫）
npm run validate:story     # 剧情数据一致性（事件引用 / 收集品路径 / flag 读写 / 结局图鉴）
npm run lint               # ESLint 静态检查（v0.2.1 接入）
npm run test:regressions   # 引擎回归测试（72 项）
npm run test:story         # 剧情链路测试（294 项断言）
npm run test:route         # 路线时序测试（19 项）
npm run matrix:route       # 路线开机矩阵（4 条路线 × 3 种推进方式）
npm run probe:choice       # 选择覆盖探测：模拟「慢玩家」，出现静默丢失或卡死即失败
npm run test:browser       # 浏览器端到端（Playwright，三个浏览器共 75 项；不含账号）——一律用这条命令
                           #   直接调用 playwright test 会把账号用例带进来，在本机启动带临时数据库的服务
npm run check:endings      # 结局可达性（17 个结局）
npm run check:i18n         # 翻译缺口（字典里缺哪些键）
npm run test:i18n          # 翻译层测试（12 项：字典完整性、拼接文字自动套用、中文模式不改写）
npm run check:i18n-choices # 选项类文字覆盖（剧情里的选项、提示语、问卷题目是否都有英文）
npm run check:i18n-literals# 界面代码字面量覆盖（扫源码里全部中文字符串与拼接，逐条对照字典）
npm run check:i18n-leak    # 英文模式中文残留实测：在浏览器里打开全部应用的首层界面看还剩多少中文（带对照自检）
npm run check:i18n-leak:deep  # 同上，再逐类点进详情页与弹层；约 2 分钟，不在默认档里
                           #   也可直接测线上：BASE=https://… npm run check:i18n-leak（线上没有调试入口，只查已解锁的应用）
npm run check:security     # 安全检查（存档注入 / 跨站脚本 / 恶意图片）
npm run check:pwa          # 离线可用性
npm run test:db            # 依赖数据库：账号 API 集成测试（74 项）+ 账号与云存档浏览器端到端（1 条）
                           # ↑ 只在允许跑数据库的环境里用；在本机上请用上面的 test:db:instabox
```

> 说明：GitHub Actions 工作流已按用户要求删除，上述检查在本地执行，由推送前钩子强制。
> 后四项检查需要本地服务器在 4187 端口：单独运行时先执行 `node test_server.js`；
> 走总闸时脚本会代为启动并在结束后关闭。容器内若没有 Playwright 默认内核，可显式指定：
> `PW_CHANNEL=none PW_EXECUTABLE_PATH=$HOME/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`。
> 线上验收用 `node tools/live-check.mjs`（通过 `BASE=<地址>/index.html` 指定目标）。

## 当前开发进度

v0.9.12：**英文模式补全、残留实测工具、安全响应头**——
此前「双语 100%」只是字典覆盖率：在浏览器里实测，英文模式下 31 个应用里 20 个显示中文，点进详情页后还有几十种。
本轮界面字典从 539 条补到 794 条，新增第 9 至 12 号译包；显示层对拼接文字（「第13天的牌阵 · 逆位」这类）按字典模板自动套用，
并带误套防护。新增两道检查：**界面代码字面量覆盖**（直接扫源码，2407 条 + 28 种拼接形状全部有英文）与
**中文残留实测**（首层、深入、线上三种模式，带对照自检）。实测结果：31 个应用、深入点击 261 次，0 残留。
账号服务所有响应带上五个安全响应头（防嵌套、内容安全策略、权限策略）。
顺带修正：主角姓名长度按语言区分（中文 6 个字、其他 12 个字符）；星期改用完整词；首页占位日期与实际一致。
质量基线：翻译层 12/12、回归 72/72、剧情 294/294、路线时序 19/19、矩阵 12/12、端到端 75/75、账号接口 74/74。

v0.9.11（2026-11-24 续）：**Git 历史清理、上线、数据库备份、自动化检查**——
分支历史里的凭据已清除并强推四个远端（GitHub 四天来首次同步），192 个提交逐个核对内容无误；
当时托管平台上旧的含私钥提交仍可按编号拉取（已在再续一轮通过重建仓库清除）。
v0.9.11 已部署到 Instabox（线上代码包哈希与本地构建一致）。
数据库每日自动快照并推送到两台自有服务器，服务器端密钥「只能新增」五项限制实测有效，恢复演练通过。
新增总闸 `npm run gate` / `gate:full` 与推送前钩子。

v0.9.11：**会话内选择改为排队，修复「回复慢就卡死」**——引擎投递带选择的消息时会直接覆盖
会话里未回复的选择，旧选择的后续事件永远不派发。实测修复前隔 2 个游戏小时才回复的玩家在江屿线卡死，
隔 24 小时才回复的玩家四条线全部卡死（20 次运行 40 次丢失、6 次到不了结局）；修复后同一组运行 0 丢失、0 卡死。
邀约是有时限的支线，永远排在普通选择之后，不堵主线；队列字段已加入存档白名单。
质量基线：剧情 294/294、回归 70/70、路线时序 19/19、矩阵 12/12、覆盖探测 16 次运行全过、
账号接口 54/54（v0.9.12 起 74 项）、端到端 69/69 + 账号 1/1、引擎覆盖率全部在 60% 红线以上。

v0.9.11（2026-11-24 再续）：**仓库重建、服务开机自启、检查分流**——
GitCode 与 Gitee 上的仓库已重建（先改名旧仓库、再用原名新建、推送干净历史、验证后才删除旧的），
含凭据的旧提交在四个远端都已无法按编号拉取，并用有效提交做了对照测试。
游戏服务改由 systemd 用户服务托管，进程被杀约 2 秒恢复、守护脚本被杀约 4 秒恢复。
按「本机不跑数据库」的规定，把依赖数据库的测试分流到 Instabox：`npm run test:db:instabox -- all`。

v0.9.10：账号服务「一个畸形请求即崩溃」缺陷修复。v0.9.9：完整账号系统 + 云存档同步。

👉 详细进度：[docs/20261125-2335-当前开发进度-GLM-5.4.md](docs/20261125-2335-当前开发进度-GLM-5.4.md)
👉 操作记录（英文模式 / 实测工具 / 安全响应头 / 上线 / 备份失败的发现）：
[docs/20261125-2335-v0.9.12-英文模式补全与残留实测工具-GLM-5.4.md](docs/20261125-2335-v0.9.12-英文模式补全与残留实测工具-GLM-5.4.md)
👉 上一份进度：[docs/20261124-1245-当前开发进度-GLM-5.4.md](docs/20261124-1245-当前开发进度-GLM-5.4.md)
👉 操作记录（仓库重建 / 服务托管 / 检查分流）：[docs/20261124-1245-仓库重建清除平台旧提交与服务托管-GLM-5.4.md](docs/20261124-1245-仓库重建清除平台旧提交与服务托管-GLM-5.4.md)
👉 操作记录（历史清理 / 上线 / 备份）：[docs/20261124-0446-Git历史清理与线上部署与备份建立-GLM-5.4.md](docs/20261124-0446-Git历史清理与线上部署与备份建立-GLM-5.4.md)
👉 游戏服务托管：[deploy/instabox/README.md](deploy/instabox/README.md)
👉 整体分析（含各维度实测数据）：[docs/20261124-0315-整体分析与下一步开发建议-GLM-5.4.md](docs/20261124-0315-整体分析与下一步开发建议-GLM-5.4.md)
👉 备份方案（搭建 / 检查 / 恢复）：[deploy/backup/README.md](deploy/backup/README.md)

## 下一步待实现

**只能由用户完成**：
1. **修复数据库异地备份**：2026-11-25 起沙箱连不上 `uw`、`ue` 的 SSH（22、2424 端口都超时），本机直连也连不上，
   但服务器在线（沙箱能连上 443）。沙箱本地快照正常、库里目前 0 个用户，不紧急，但要在有真实用户之前修好。
   需要检查服务器的网络安全组或系统防火墙对 SSH 来源的限制。
2. **更换全部已泄露的密钥**（服务器 SSH 密钥对、Cloudflare、GitHub、Gitee、GitCode、抱脸令牌）。
   含凭据的旧提交已从四个远端清除，但它们此前已公开 6 到 25 天，清除代替不了更换。

**内容（下一版的主体）**：剧情保底长度 12 天，按「路线主线照常开始、只把最终结局压后」实施
（打开现有原型开关会让玩家选完线后干等 5 天，所以不直接开）；处理 10 条永远触达不到的事件；补独行线。

**双语（收尾）**：剧情中后期才出现的界面（通话中、约会、偶遇、结局、旁白弹窗）还没有纳入实测；
应用图标名称（PWA 清单）与链接预览信息仍是中文；本轮新增约 850 条译文只核对了「有没有」，没有逐条润色。

**运维**：备份失败时推送提醒（建议，待决定）；强制安全传输 HSTS（待确认）；
密钥更换之后把游戏部署到自有服务器（方案定为 Cloudflare Tunnel）；
沙箱真正重启后服务自动恢复这一点，等一次自然的重启机会确认。

👉 详细清单：[docs/20261125-2335-下一步待实现-GLM-5.4.md](docs/20261125-2335-下一步待实现-GLM-5.4.md)

## 目录结构

| 路径 | 作用 |
|---|---|
| `index.html` | 手机外壳与全部屏幕（App）结构 + 脚本加载清单 |
| `story/` | **剧情数据层**（21 个数据文件 + `index.mjs`）：事件 / 朋友圈 / 结局 / 收集品 / 约会 / 梦魇等按板块分域（纯数据，改剧情不用动逻辑） |
| `engine.js` | 引擎核心：状态机、时间系统、事件调度、定时器管理 |
| `engine_social.js` / `engine_content.js` / `engine_progress.js` / `engine_save.js` | 引擎混入：消息通话群聊 / 内容玩法 / 成长系统 / 存档 |
| `ui/` | **UI 层**（26 个文件）：30+ 个 App 屏幕的渲染与交互；`00_shell.js` 含显示层翻译兜底；`25_account.js` 为账号/云存档界面 |
| `audio.js` | WebAudio 音效系统（消息/来电/按键音效 + 主题环境音） |
| `style.css` | 视觉样式（手机 UI、各 App、动画） |
| `interaction_queue.js` | 交互队列（并发来电/偶遇/选择的排队与读档恢复） |
| `save_migrations.js` | 存档版本迁移 |
| `server/` | **可选账号服务**（Node 22）：`index.mjs` 静态+API 入口、`api.mjs` 路由、`auth.mjs` 密码/会话、`db.mjs` SQLite、`ctl.sh` 运维、`test_api.mjs` 74 项集成测试（入口 `index.mjs` 带安全响应头） |
| `manifest.json` / `sw.js` / `pwa.js` | PWA：应用清单 / 离线缓存 / 注册（`/api` 明确排除缓存） |
| `assets/` | 壁纸（`tools/generate_wallpapers.py` 生成）、相册照片（`tools/generate_photos.py` 生成）、角色头像（`tools/generate_avatars.py` 生成）、氛围壁纸（`tools/generate_ambiences.py` 生成）、OG 分享图（`tools/generate_og.py` 生成）与图标（`tools/generate_icons.py` 生成） |
| `tools/` | 资产生成脚本（`generate_*.py`，Python + PIL）、一键升版本脚本（`bump_version.py`）、测试与探测脚本（`choice_override_probe.mjs` 模拟慢玩家、`verify-endings.mjs`、`security-check.mjs`、`pwa-check.mjs`、`live-check.mjs` 等）、双语检查（`i18n-literal-coverage.mjs` 字面量覆盖、`i18n-choice-coverage.mjs` 选项类覆盖、`i18n-leak-scan.mjs` 中文残留实测、`i18n-literal-allow.txt` 例外清单）、总闸（`run_gate.mjs`） |
| `deploy/backup/` | **数据库备份方案**：沙箱端备份脚本、服务器端初始化脚本、两个 systemd 单元、搭建/检查/恢复说明 |
| `deploy/instabox/` | **Instabox 上的游戏服务托管**：systemd 用户服务单元、说明文档、在沙箱上跑数据库测试的脚本 |
| `tools/instabox_db_tests.sh` | 本机入口：把依赖数据库的测试放到 Instabox 上跑（`npm run test:db:instabox`） |
| `.githooks/pre-push` | 推送前检查钩子（`npm install` 时自动启用） |
| `eslint.config.mjs` | ESLint 分环境配置（浏览器/Node/ui 分域，v0.2.1 接入） |
| `deploy.sh` | 一键部署（自动构建 bundle 后 rsync dist/） |
| `tools/build_bundle.mjs` | 发布构建：全部脚本合并单 bundle（开发零构建不变） |
| `validate_story.js` | 剧情数据一致性校验器（总闸与推送前钩子使用） |
| `check_version.js` | 版本号一致性校验（总闸与推送前钩子使用，含 sw.js 缓存版本） |
| `check_ui.js` | 前端语法与引用完整性校验（总闸与推送前钩子使用，v0.1.8 新增） |
| `test_helper.js` | 测试共享：源码文件清单动态生成（拆文件后测试自动跟进） |
| `test_server.js` | 本地静态服务器（开发/测试用，端口 4187） |
| `test_regressions.js` / `test_story.js` | 引擎回归 / 剧情链路自动化测试（Node） |
| `test_i18n.js` | 翻译层测试（Node）：字典完整性、拼接文字自动套用、中文模式不改写 |
| `playwright/` | 浏览器端到端测试；`account.spec.js` 为账号+云存档全流程（依赖数据库）；`i18n-english.spec.js` 为英文模式无中文、中文模式不受影响 |
| [文档索引.md](文档索引.md) | **docs/ 全部文档的作用索引** |

## 文档索引

全部文档（进度/规划/玩法设计/版本修复记录/AI 建议历史）的作用一览：
👉 [文档索引.md](文档索引.md)

## 版本管理

- `VERSION` 是唯一版本源；每次修改 **+0.0.1**（每一位满十进一）
- 发版：`python3 tools/bump_version.py` 一键同步 `VERSION / package.json /
  package-lock.json / index.html（标题、meta、所有 `?v=` 缓存参数）/ sw.js 的
  `CACHE_VERSION`，随后 `npm run check:version` 验证（云端流水线已删除，靠总闸与推送前钩子的第一步拦截）
- 每个版本的问题/经验记录写入 `docs/`（命名：`年月日时分-标题-模型名.md`）

## 开发约定

- 这是开发测试版：重构无需考虑旧存档兼容与旧数据，但必须先备份/可回溯
- 提交信息使用中文。远端共四个：`gitcode`（主）、`atomgit`（与 GitCode 是同一个仓库的另一个域名，
  本地保存的凭据已失效，推 GitCode 即等于推它）、`gitee`、`origin`（GitHub）。
  用 `bash push_all.sh` 遍历全部远端并校验一致性，不要只推单个远端而漏掉其它。
- **Git 历史已于 2026-11-24 改写**，不要从改写前的旧克隆强推或合并
- **含令牌、私钥、授权码的文件绝不入库**（历史上因此泄露过一次）。提交前检查：
  `git diff --cached --name-only | grep -iE "deploy-handoff|credential|\.env"` 必须为空
- 每次修改后必须跑通 `npm run gate:full`（至少 `npm run gate`）才能停下；
  推送前钩子会自动执行不依赖浏览器也不依赖数据库的部分
- 跑三浏览器端到端一律用 `npm run test:browser`（自带排除账号用例的参数）；需要电脑上的真实浏览器时加 `PW_CHANNEL=chrome`
- **本机不启动数据库、不启动 Docker、不部署任何环境**：依赖数据库的测试
  （账号接口测试、账号与云存档端到端）一律在 Instabox 上跑：`npm run test:db:instabox -- all`；
  需要真实运行环境时同样放到 Instabox
- 新增剧情数据 → 写进 `story/` 对应板块文件（不要在 `18_patches.js` 叠补丁），先跑 `npm run validate:story`
- 新增源码文件 → `story/`、`engine_*.js` 会被测试清单自动包含；`ui/`、`audio.js`、`pwa.js` 需手动加入 `index.html` 与 `sw.js` 的 PRECACHE

## 经验手册

`docs/` 里的文档是历史记录，**不一定是对的**（含中途被推翻的方案与互相矛盾的结论）。
根目录 [经验/](经验/README.md) 把 `docs/` 下全部文档的结论去重提炼成做法手册，
供接手者快速避坑：

👉 [经验/README.md](经验/README.md) —
架构约定 / 剧情内容 / 双语 i18n / 存档安全 / 测试验证 / 部署运维 / 容器沙箱 / 协作流程
