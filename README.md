# 霓虹心事 · 林夏的手机（neon-heart-game）

一个「模拟一部手机」的沉浸式多线互动叙事游戏。剧情不靠传统对话框推进，而是通过手机里的
消息、电话、朋友圈、群聊、相册、备忘录发生：三位男主同时找你，何时回复、回谁、回不回，
全部由你决定，已读不回会有后果。

纯前端实现（HTML / CSS / 原生 JS），**运行时零依赖、无构建步骤**。

- 当前版本：**v0.1.13**（版本唯一来源：[VERSION](VERSION)）
- 主角：林夏（策展人）｜路线：沈砚之 / 陆辞 / 江屿 / 独行线（真结局）
- 内容体量：173 个剧情事件 · 17 个结局（含 4 个隐藏）· 14 件收集品 · 15 个成就 · 3 个谜题 · 16 张塔罗 · 7 套主题（含真实壁纸）· 6 个地点

## 快速开始

**在线游玩**（GitHub Pages，自动跟随 main 部署）：https://pixian5.github.io/game1/

本地游玩：直接双击 `index.html`（无构建、无依赖），或：

```bash
node test_server.js     # 打开 http://127.0.0.1:4187
```

支持 PWA：在线版可「添加到主屏幕」并离线游玩。

运行全部校验与测试：

```bash
npm install                # 首次：安装测试依赖（@playwright/test）
npm run check:version      # 版本号一致性（VERSION / package.json / index.html / sw.js）
npm run check:ui           # 前端语法合并编译 + 引用完整性（index.html/sw.js 交叉核对）
npm run validate:story     # 剧情数据一致性（事件引用 / 收集品路径 / flag 读写 / 结局图鉴）
npm run test:regressions   # 引擎回归测试（19 项）
npm run test:story         # 剧情链路测试（294 项断言）
npm run test:browser       # 浏览器端到端（Playwright，4 项）
npm run test:all           # 一键跑全部
```

CI（[.github/workflows/test.yml](.github/workflows/test.yml)）在每次 push / PR 时自动执行以上全部检查；
[deploy.yml](.github/workflows/deploy.yml) 在 push main 后自动部署到 GitHub Pages。

## 当前开发进度

v0.1.7 完成：**三大文件模块化拆分**（story.js→story/ 19 个文件、engine.js→核心+4 混入、
app.js→ui/ 22 个文件，拆分经快照深度比对验证）；**4 条死 flag 清零**（凌晨来电/幽灵消息/
每日天气/隐藏结局备用条件，校验器 0 错误 0 警告）；收集品重复发放去重；存档内存缓存优化；
新增 WebAudio 音效系统与主题环境音；6 套程序化主题壁纸；PWA（manifest + Service Worker
离线可玩）；GitHub Pages 上线；测试端口改 4187 避开本机冲突。全部测试通过。

👉 详细进度：[docs/20261011-0222-当前开发进度-GLM.md](docs/20261011-0222-当前开发进度-GLM.md)
👉 技术细节：[docs/20261011-0222-v0.1.7-全面修复与模块化拆分-GLM.md](docs/20261011-0222-v0.1.7-全面修复与模块化拆分-GLM.md)

## 下一步待实现

优先：数值闭环推进（好感/塔罗对结局判定）、照片 AI 生图接入（待图像 API）、
`story/18_patches.js` 收编、音频丰富度。另有需拍板项（文档命名、素材去留、是否要桌面版）。

👉 详细清单：[docs/20261011-0222-下一步待实现-GLM.md](docs/20261011-0222-下一步待实现-GLM.md)

## 目录结构

| 路径 | 作用 |
|---|---|
| `index.html` | 手机外壳与全部屏幕（App）结构 + 脚本加载清单 |
| `story/` | **剧情数据层**（18 个文件）：事件 / 朋友圈 / 结局 / 收集品 / 约会 / 梦魇等按板块分域（纯数据，改剧情不用动逻辑） |
| `engine.js` | 引擎核心：状态机、时间系统、事件调度、定时器管理 |
| `engine_social.js` / `engine_content.js` / `engine_progress.js` / `engine_save.js` | 引擎混入：消息通话群聊 / 内容玩法 / 成长系统 / 存档 |
| `ui/` | **UI 层**（22 个文件）：30+ 个 App 屏幕的渲染与交互，按功能分区 |
| `audio.js` | WebAudio 音效系统（消息/来电/按键音效 + 主题环境音） |
| `style.css` | 视觉样式（手机 UI、各 App、动画） |
| `interaction_queue.js` | 交互队列（并发来电/偶遇/选择的排队与读档恢复） |
| `save_migrations.js` | 存档版本迁移 |
| `manifest.json` / `sw.js` / `pwa.js` | PWA：应用清单 / 离线缓存 / 注册 |
| `assets/` | 壁纸（`tools/generate_wallpapers.py` 生成）与图标（`tools/generate_icons.py` 生成） |
| `tools/` | 资产生成脚本（Python + PIL，可重跑再生成） |
| `validate_story.js` | 剧情数据一致性校验器（CI 使用） |
| `check_version.js` | 版本号一致性校验（CI 使用，含 sw.js 缓存版本） |
| `check_ui.js` | 前端语法与引用完整性校验（CI 使用，v0.1.8 新增） |
| `test_helper.js` | 测试共享：源码文件清单动态生成（拆文件后测试自动跟进） |
| `test_server.js` | 本地静态服务器（开发/测试用，端口 4187） |
| `test_regressions.js` / `test_story.js` | 引擎回归 / 剧情链路自动化测试（Node） |
| `playwright/` | 浏览器端到端测试 |
| [文档索引.md](文档索引.md) | **docs/ 全部文档的作用索引** |

## 文档索引

全部文档（进度/规划/玩法设计/版本修复记录/AI 建议历史）的作用一览：
👉 [文档索引.md](文档索引.md)

## 版本管理

- `VERSION` 是唯一版本源；每次修改 **+0.0.1**（每一位满十进一）
- 修改后必须同步 `package.json` / `package-lock.json` / `index.html`（标题、meta、所有 `?v=` 缓存参数）/**`sw.js` 的 `CACHE_VERSION`**，并运行 `npm run check:version`（CI 会拦截不一致）
- 每个版本的问题/经验记录写入 `docs/`（命名：`年月日时分-标题-模型名.md`）

## 开发约定

- 这是开发测试版：重构无需考虑旧存档兼容与旧数据，但必须先备份/可回溯
- 提交信息使用中文；每轮修改完成后提交并推送（gitee 与 github 双远端）
- 每次修改后必须跑通 `npm run test:all` 才能停下
- 新增剧情数据 → 写进 `story/` 对应板块文件（不要在 `18_patches.js` 叠补丁），先跑 `npm run validate:story`
- 新增源码文件 → `story/`、`engine_*.js` 会被测试清单自动包含；`ui/`、`audio.js`、`pwa.js` 需手动加入 `index.html` 与 `sw.js` 的 PRECACHE
