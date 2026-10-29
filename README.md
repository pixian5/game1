# 霓虹心事 · 林夏的手机（neon-heart-game）

一个「模拟一部手机」的沉浸式多线互动叙事游戏。剧情不靠传统对话框推进，而是通过手机里的
消息、电话、朋友圈、群聊、相册、备忘录发生：三位男主同时找你，何时回复、回谁、回不回，
全部由你决定，已读不回会有后果。

纯前端实现（HTML / CSS / 原生 JS），**运行时零依赖、无构建步骤**。

- 当前版本：**v0.7.5**（版本唯一来源：[VERSION](VERSION)）
- 主角：林夏（策展人）｜路线：沈砚之 / 陆辞 / 江屿 / 独行线（真结局）
- 内容体量：210 个剧情事件 · 17 个结局（含 4 个隐藏）· 14 件收集品 · 15 个成就 · 3 个谜题 · 16 张塔罗 · 7 套主题（含真实壁纸）· 5 张相册照片 · 4 张角色插画头像 · 3 张氛围壁纸 · 1 张 OG 分享图 · 6 个地点

## 快速开始

**在线游玩**（自有服务器，主入口）：https://oh.sbbz.tech:9443/
备份线（GitHub Pages，push main 自动部署）：https://pixian5.github.io/game1/
抱脸 Space（Hugging Face，push main 自动部署）：https://xbzsb-neon-heart.static.hf.space/index.html
镜像仓库：gitee（https://gitee.com/ibjxk/leame.git）· github（https://github.com/pixian5/game1.git）· GitCode（https://gitcode.com/laotongtian/game1.git）

本地游玩：直接双击 `index.html`（无构建、无依赖），或：

```bash
node test_server.js     # 打开 http://127.0.0.1:4187
```

支持 PWA：在线版可「添加到主屏幕」并离线游玩。

运行全部校验与测试：

```bash
npm install                # 首次：安装测试依赖（@playwright/test / eslint）
npm run check:version      # 版本号一致性（VERSION / package.json / index.html / sw.js）
npm run check:ui           # 前端语法合并编译 + 引用完整性（index.html/sw.js 交叉核对）
npm run validate:story     # 剧情数据一致性（事件引用 / 收集品路径 / flag 读写 / 结局图鉴）
npm run lint               # ESLint 静态检查（v0.2.1 接入）
npm run test:regressions   # 引擎回归测试（46 项）
npm run test:story         # 剧情链路测试（294 项断言）
npm run test:browser       # 浏览器端到端（Playwright，12 项）
npm run test:all           # 一键跑全部
```

CI（[.github/workflows/test.yml](.github/workflows/test.yml)）在每次 push / PR 时自动执行以上全部检查；
[deploy.yml](.github/workflows/deploy.yml) 在 push main 后自动部署到 GitHub Pages。

## 当前开发进度

v0.7.5：**部署到 Hugging Face Space**——新增第三个公开入口
（`https://xbzsb-neon-heart.static.hf.space/index.html`），
静态 Space 复用 `tools/build_bundle.mjs` 的 `dist/` 产物（61 脚本合并单 bundle），
新增 Actions「部署到 Hugging Face Space」push main 自动构建上传；
用 `deploy/hf-space-README.md` 维护 Space 卡片元信息。

v0.5.5（GLM·阶段E 收官）：**英文化一期**（设置中心双语切换，主线全量双语，切换实时重译）+ **周目系统**（二周目携带收集/图鉴，专属变体事件，真结局尾声）+ **音频二阶**（五层曲式 BGM、剧情曲真实可播、场景 sting）+ **关键 CG×6** + **设置中心**（语言/音量/动效）。

v0.4.7-v0.4.6（GLM）：发布构建（线上 18.4s→3.5s）、安全响应头、CI 自动部署、资源预算门禁。
v0.4.5 及之前：

v0.4.5 完成：**自有服务器上线**——`deploy.sh` 部署清单补齐 `i18n/` 与 `privacy.html`
（v0.3.6/v0.3.7 新增，旧清单遗漏会导致线上脚本 404），
主入口 `https://oh.sbbz.tech:9443/` 由 v0.1.14 一次性更新到 v0.4.5。

上一轮（v0.4.4）：三远端同步 + 防御性转义（合并 GitCode 领先的 23 个提交；
删除死代码 `app.js`；会话预览/群名/通话/日历/记忆碎片等补转义；新增注入 E2E）。
再上一轮（v0.4.3）：缓存策略——图片按需缓存（D5）。

👉 详细进度：[docs/20261024-1535-当前开发进度-DeepSeek-V4.1-Flash.md](docs/20261024-1535-当前开发进度-DeepSeek-V4.1-Flash.md)
👉 本轮技术细节：[docs/20261029-1640-v0.7.5-部署到抱脸Space-DeepSeek-V4.1-Flash.md](docs/20261029-1640-v0.7.5-部署到抱脸Space-DeepSeek-V4.1-Flash.md)
👉 仓库基建：[docs/20261029-1315-云端仓库关联修复与GitHub补推-DeepSeek-V4.1-Flash.md](docs/20261029-1315-云端仓库关联修复与GitHub补推-DeepSeek-V4.1-Flash.md)

## 下一步待实现

**全功能渐进解锁（v0.6.6-v0.6.7）**：开局只开放 12 个核心 App + 1 个地点，其余按剧情/天数
逐步解锁（亮起动画 + 「新 App 上线」通知）；地图未解锁地点显示为「？？？」；空窗期有出行引导。

阶段 G 已收官（v0.6.2）：电话之夜（call 1→7 通，含语音信箱全链）/ 曲库 2→6 首 / 引擎覆盖率
48.6%→76.9%（CI 60% 红线）/ 双语 736/736 全量 100%。

阶段 F 已收官（v0.6.0）：英化 100% / 假时钟 900 倍提速 / 引擎拆职责 / 周目中段变体与导演视角 /
现实季节事件×4 + 节日收集品×3 / itch.io 素材包。候选方向见收官文档。

（以下为上一轮历史清单）

**阶段 F「精品化与长线」已规划**：英化二期补全 276 条 / T 轨道技术债（ES Modules→假时钟→拆职责）/ 周目深化 / 季节事件包。

**阶段 E「沉浸与出海」已规划**（E1 设置中心 → E2 音频二阶 → E3 周目系统 → E4 英文化一期 → E5 关键场景 CG → E6 可选统计与云同步），
含事实核查、验收标准与三个待拍板决策点（音频合成 vs 曲库 / 译名表 / 统计与云同步）。

👉 方案全文：[docs/20261025-0140-下一步开发方案-阶段E沉浸出海-GLM.md](docs/20261025-0140-下一步开发方案-阶段E沉浸出海-GLM.md）
（以下为上一轮历史清单）


候选：P1 工程收尾（CSP 收尾 / 资源预算门禁 / 头像缩略图 / lint 收紧）、P2 内容与体验
（D4 内容扩张、D3 i18n 完成、A2 音频回访）、P3 启动性能与 SEO。总体方向见计划文档。

👉 详细清单：[docs/20261024-1535-下一步待实现-DeepSeek-V4.1-Flash.md](docs/20261024-1535-下一步待实现-DeepSeek-V4.1-Flash.md)

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
| `assets/` | 壁纸（`tools/generate_wallpapers.py` 生成）、相册照片（`tools/generate_photos.py` 生成）、角色头像（`tools/generate_avatars.py` 生成）、氛围壁纸（`tools/generate_ambiences.py` 生成）、OG 分享图（`tools/generate_og.py` 生成）与图标（`tools/generate_icons.py` 生成） |
| `tools/` | 资产生成脚本（`generate_wallpapers.py` / `generate_photos.py` / `generate_avatars.py` / `generate_ambiences.py` / `generate_og.py` / `generate_icons.py`，Python + PIL）与一键发版脚本（`bump_version.py`） |
| `eslint.config.mjs` | ESLint 分环境配置（浏览器/Node/ui 分域，v0.2.1 接入） |
| `deploy.sh` | 一键部署（自动构建 bundle 后 rsync dist/） |
| `tools/build_bundle.mjs` | 发布构建：52 脚本合并单 bundle（开发零构建不变） |
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
- 发版：`python3 tools/bump_version.py` 一键同步 `VERSION / package.json /
  package-lock.json / index.html（标题、meta、所有 `?v=` 缓存参数）/ sw.js 的
  `CACHE_VERSION`，随后 `npm run check:version` 验证（CI 会拦截不一致）
- 每个版本的问题/经验记录写入 `docs/`（命名：`年月日时分-标题-模型名.md`）

## 开发约定

- 这是开发测试版：重构无需考虑旧存档兼容与旧数据，但必须先备份/可回溯
- 提交信息使用中文；**每轮修改完成后必须三远端成套推送**（gitee / github / gitcode）：
  用 `bash push_all.sh`（自动全推并校验三者一致）。**不要用裸 `git push`**——
  本项目没有 `origin`，无参数 push 会失败或只推部分远端，历史上曾导致 gitee 落后 29 个提交
- 每次修改后必须跑通 `npm run test:all` 才能停下
- 新增剧情数据 → 写进 `story/` 对应板块文件（不要在 `18_patches.js` 叠补丁），先跑 `npm run validate:story`
- 新增源码文件 → `story/`、`engine_*.js` 会被测试清单自动包含；`ui/`、`audio.js`、`pwa.js` 需手动加入 `index.html` 与 `sw.js` 的 PRECACHE
