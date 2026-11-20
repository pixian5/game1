# 霓虹心事 · 林夏的手机（neon-heart-game）

一个「模拟一部手机」的沉浸式多线互动叙事游戏。剧情不靠传统对话框推进，而是通过手机里的
消息、电话、朋友圈、群聊、相册、备忘录发生：三位男主同时找你，何时回复、回谁、回不回，
全部由你决定，已读不回会有后果。

游戏本体是纯前端（HTML / CSS / 原生 JS，运行时零依赖、无构建步骤）；账号与云存档是**可选增强**，
由同仓库的 Node 22 服务提供（内置 `http` + `node:sqlite`，不引入任何运行时 npm 依赖）。

- 当前版本：**v0.9.9**（版本唯一来源：[VERSION](VERSION)）
- 主角：林夏（策展人）｜路线：沈砚之 / 陆辞 / 江屿 / 独行线（真结局）
- 内容体量：338 个剧情事件 · 17 个结局（含隐藏结局）· 19 件收集品 · 15 个成就 · 3 个谜题 · 16 张塔罗 · 7 套主题（含真实壁纸）· 5 张相册照片 · 4 张角色插画头像 · 3 张氛围壁纸 · 1 张 OG 分享图 · 6 个地点

## 快速开始

**在线游玩**（自有服务器，主入口）：https://oh.sbbz.tech:9443/
备份线（GitHub Pages，push main 自动部署）：https://pixian5.github.io/game1/
抱脸 Space（Hugging Face，push main 自动部署）：https://xbzsb-neon-heart.static.hf.space/index.html
Instabox 持久入口（主，含账号 API）：https://8081-agqxoy6u363jxgfufg2onqxbm4.instabox.tech
镜像仓库：github（https://github.com/pixian5/game1.git）· GitCode（https://gitcode.com/laotongtian/game1.git）

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
npm install                # 首次：安装测试依赖（@playwright/test / eslint）
npm run check:version      # 版本号一致性（VERSION / package.json / index.html / sw.js）
npm run check:ui           # 前端语法合并编译 + 引用完整性（含 SW 不缓存 /api 的守卫）
npm run validate:story     # 剧情数据一致性（事件引用 / 收集品路径 / flag 读写 / 结局图鉴）
npm run lint               # ESLint 静态检查（v0.2.1 接入）
npm run test:regressions   # 引擎回归测试（63 项）
npm run test:story         # 剧情链路测试（294 项断言）
npm run test:account-api   # 账号 API 集成测试（51 项，自带临时 SQLite）
npm run test:account       # 账号与云存档浏览器 E2E（Playwright，1 条全流程）
npm run test:browser       # 其余浏览器端到端（Playwright，20 项）
npm run test:all           # 一键跑全部（含账号 API + 账号 E2E）
```

> 说明：GitHub Actions 工作流已按用户要求删除，上述检查需在本地手动执行
> （`npm run test:all` 一次跑完）。容器内若没有 Playwright 默认内核，可显式指定：
> `PW_CHANNEL=none PW_EXECUTABLE_PATH=$HOME/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome npm run test:account`。

## 当前开发进度

v0.9.10：**账号系统安全复核 + P0 崩溃缺陷修复**——逐文件复核 v0.9.9 账号后端
（scrypt 参数符合 OWASP 建议、恒定时间比较、预编译 SQL 无注入、CSRF 双闸、限流完善），
发现并修复 `server/index.mjs` 的 `decodeURIComponent` 未捕获异常：
`curl /%` 一个请求即可让整个账号服务进程崩溃（远程拒绝服务）。
该缺陷线上已修复：Instabox 已部署 v0.9.10，`/%` 返回 400 且进程存活（已实测）。
修复：解码 try/catch 返回 400 + 进程级异常兜底 + 3 条回归用例（账号 API 测试 51→54）。

v0.9.9：**完整账号系统 + 云存档同步**——注册/登录/会话保持/找回码重置/改密/设备管理/
导出/注销；4 槽整包云存档、revision 冲突二选一、自动同步；中英双语账号 UI；隐私说明同步改写。

v0.9.7：**路线时序修复**——选线前路线事件被吞（P0，`pendingRouteEvents` 补发队列 +
存档迁移 v3→v4）、剧情加载器正则漏 `01b/01c/01d`（事件 270→338）、隐藏结局阈值 15→19。

👉 详细进度：[docs/20261120-0354-当前开发进度-GLM-5.3-Flash.md](docs/20261120-0354-当前开发进度-GLM-5.3-Flash.md)
👉 安全复核：[docs/20261120-0354-安全复核与崩溃缺陷修复-GLM-5.3-Flash.md](docs/20261120-0354-安全复核与崩溃缺陷修复-GLM-5.3-Flash.md)
👉 账号技术记录：[docs/20261120-0333-账号系统与云存档-CodeArts.md](docs/20261120-0333-账号系统与云存档-CodeArts.md)

## 下一步待实现

**部署收口**：Instabox 已完成 v0.9.10 部署——持久目录 `/data/neon-heart`、单入口 8081
（`serve-loop.sh` 守护，进程退出 4 秒内自动重启）；9090 已按方案 B 停用。
剩余：抱脸 Space 令牌重签（现 401 失效）；新自有服务器 `uw/ue.sbbz.tech`
的 2424 端口 SSH 握手被远端关闭，等就绪后部署。

**云存档持久化**：数据库已迁移到持久盘 `/data/neon-heart/data/game.db`（`/dev/vdb` 20G），
沙箱重启不丢；但沙箱整体销毁仍会丢，需定期用 `server/backup_db.mjs` 备份到仓库外。

**D2 可达性待拍板**：day11-21 共 32 条事件结构性不可达（结局链无日期门槛，
重排内容无效），两条路：结局窗口延到 day12+，或接受并清理。需决策。

👉 详细清单：[docs/20261120-0354-下一步待实现-GLM-5.3-Flash.md](docs/20261120-0354-下一步待实现-GLM-5.3-Flash.md)
👉 完整执行方案（阶段/任务/验收/里程碑）：[docs/20261120-0345-完整下一步开发方案-豆包.md](docs/20261120-0345-完整下一步开发方案-豆包.md)

## 目录结构

| 路径 | 作用 |
|---|---|
| `index.html` | 手机外壳与全部屏幕（App）结构 + 脚本加载清单 |
| `story/` | **剧情数据层**（20 个数据文件 + `index.mjs`）：事件 / 朋友圈 / 结局 / 收集品 / 约会 / 梦魇等按板块分域（纯数据，改剧情不用动逻辑） |
| `engine.js` | 引擎核心：状态机、时间系统、事件调度、定时器管理 |
| `engine_social.js` / `engine_content.js` / `engine_progress.js` / `engine_save.js` | 引擎混入：消息通话群聊 / 内容玩法 / 成长系统 / 存档 |
| `ui/` | **UI 层**（26 个文件）：30+ 个 App 屏幕的渲染与交互；`25_account.js` 为账号/云存档界面 |
| `audio.js` | WebAudio 音效系统（消息/来电/按键音效 + 主题环境音） |
| `style.css` | 视觉样式（手机 UI、各 App、动画） |
| `interaction_queue.js` | 交互队列（并发来电/偶遇/选择的排队与读档恢复） |
| `save_migrations.js` | 存档版本迁移 |
| `server/` | **可选账号服务**（Node 22）：`index.mjs` 静态+API 入口、`api.mjs` 路由、`auth.mjs` 密码/会话、`db.mjs` SQLite、`ctl.sh` 运维、`test_api.mjs` 51 项集成测试 |
| `manifest.json` / `sw.js` / `pwa.js` | PWA：应用清单 / 离线缓存 / 注册（`/api` 明确排除缓存） |
| `assets/` | 壁纸（`tools/generate_wallpapers.py` 生成）、相册照片（`tools/generate_photos.py` 生成）、角色头像（`tools/generate_avatars.py` 生成）、氛围壁纸（`tools/generate_ambiences.py` 生成）、OG 分享图（`tools/generate_og.py` 生成）与图标（`tools/generate_icons.py` 生成） |
| `tools/` | 资产生成脚本（`generate_wallpapers.py` / `generate_photos.py` / `generate_avatars.py` / `generate_ambiences.py` / `generate_og.py` / `generate_icons.py`，Python + PIL）与一键发版脚本（`bump_version.py`） |
| `eslint.config.mjs` | ESLint 分环境配置（浏览器/Node/ui 分域，v0.2.1 接入） |
| `deploy.sh` | 一键部署（自动构建 bundle 后 rsync dist/） |
| `tools/build_bundle.mjs` | 发布构建：全部脚本合并单 bundle（开发零构建不变） |
| `validate_story.js` | 剧情数据一致性校验器（CI 使用） |
| `check_version.js` | 版本号一致性校验（CI 使用，含 sw.js 缓存版本） |
| `check_ui.js` | 前端语法与引用完整性校验（CI 使用，v0.1.8 新增） |
| `test_helper.js` | 测试共享：源码文件清单动态生成（拆文件后测试自动跟进） |
| `test_server.js` | 本地静态服务器（开发/测试用，端口 4187） |
| `test_regressions.js` / `test_story.js` | 引擎回归 / 剧情链路自动化测试（Node） |
| `playwright/` | 浏览器端到端测试；`account.spec.js` 为账号+云存档全流程 |
| [文档索引.md](文档索引.md) | **docs/ 全部文档的作用索引** |

## 文档索引

全部文档（进度/规划/玩法设计/版本修复记录/AI 建议历史）的作用一览：
👉 [文档索引.md](文档索引.md)

## 版本管理

- `VERSION` 是唯一版本源；每次修改 **+0.0.1**（每一位满十进一）
- 发版：`python3 tools/bump_version.py` 一键同步 `VERSION / package.json /
  package-lock.json / index.html（标题、meta、所有 `?v=` 缓存参数）/ sw.js 的
  `CACHE_VERSION`，随后 `npm run check:version` 验证（CI 会拦截不一致）
- 每个版本的问题/经验记录写入 `docs/`（命名：`年月日时分-标题-模型名.md`）

## 开发约定

- 这是开发测试版：重构无需考虑旧存档兼容与旧数据，但必须先备份/可回溯
- 提交信息使用中文；**仓库当前未配置任何远端**，推送目标由当轮用户指定。
  需要推送时用 `bash push_all.sh` 遍历当前已配置远端并校验一致性，不要只推单个远端而漏掉其它已配置远端。
- 每次修改后必须跑通 `npm run test:all` 才能停下
- 新增剧情数据 → 写进 `story/` 对应板块文件（不要在 `18_patches.js` 叠补丁），先跑 `npm run validate:story`
- 新增源码文件 → `story/`、`engine_*.js` 会被测试清单自动包含；`ui/`、`audio.js`、`pwa.js` 需手动加入 `index.html` 与 `sw.js` 的 PRECACHE

## 经验手册

`docs/` 里的文档是历史记录，**不一定是对的**（含中途被推翻的方案与互相矛盾的结论）。
根目录 [经验/](经验/README.md) 把 148 份文档的结论去重提炼成八类做法手册，
供接手者快速避坑：

👉 [经验/README.md](经验/README.md) —
架构约定 / 剧情内容 / 双语 i18n / 存档安全 / 测试验证 / 部署运维 / 容器沙箱 / 协作流程
