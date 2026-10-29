# 云端仓库关联修复 + GitHub 补推（2026-10-29 13:15 · DeepSeek-V4.1-Flash）

## 一、现象

在 IDE 里选「云端执行」，提示**此项目没有关联云端仓库**。

## 二、根因

```bash
$ git remote -v
gitcode  https://gitcode.com/laotongtian/game1.git
gitee    https://gitee.com/ibjxk/leame.git
github   https://github.com/pixian5/game1.git
$ git rev-parse --abbrev-ref main@{upstream}
fatal: no upstream configured for branch 'main'
```

两个问题同时存在：

1. **没有 `origin` 远端**——仓库当初按平台命名（`gitcode` / `gitee` / `github`），
   云端执行只认 `origin`，因此判定「未关联」。
2. **`main` 没有上游**——`git status` 不显示 ahead/behind，`git pull` 也不工作。

## 三、修复

```bash
git remote rename github origin          # 重命名比新增更干净，避免重复 fetch
git fetch origin --prune
git branch --set-upstream-to=origin/main main
```

结果：`origin` → `https://github.com/pixian5/game1.git`，`main` 跟踪 `origin/main`，
`gitee` / `gitcode` 保留（其他机器的推送习惯不变）。

## 四、合并与补推

修复时发现 **gitee / gitcode 已到 v0.7.4（4 个提交领先），GitHub 仍停在 b57c5f6**：

- `git merge --ff-only gitee/main` → 快进 b57c5f6..d93ad51，0 冲突
- `npm run test:all` → 全绿（57 回归 / 294 剧情 / 16 E2E，覆盖率红线通过）
- `git push origin main` → GitHub 同步到 v0.7.4
- 三远端最终均为 `0 0`；GitHub Actions「测试」「部署到 GitHub Pages」
  「部署自有服务器」三条流水线全部 success

## 五、经验

1. **多远端仓库要先给 GitHub 一个 `origin` 名字**。推送用 `gitee` / `gitcode` 没问题，
   但云端执行、CI 模板、IDE 的仓库识别都按 `origin` 找；命名不统一会在换工具时踩坑。
2. **云端识别仓库后仍可能要求授权**：仓库是 PUBLIC，但云端执行通常还要在 IDE 里
   走一次 GitHub 授权（OAuth / App 安装）。若修完 `origin` 仍提示未关联，先检查这一步，
   不要再去动 git 配置。
3. **多机协作的推送不等价于同步**：这台机器的 GitHub 远端落后 4 个提交而没有任何提示
   （因为 main 没有上游）。绑定 upstream 后 `git status` 才会直接显示「落后 N 个提交」。
4. 每轮开工顺序应是：`git fetch --all` → 对比三个远端 → `merge --ff-only` → 跑测试 → 推送。
