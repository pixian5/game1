// 巡检脚本统一的浏览器启动入口。
// 背景：v0.7.6 的 5 个巡检脚本硬编码 executablePath=/root/.cache/ms-playwright/chromium-1243/...，
// 该路径随 Playwright 版本与机器变化，换环境即 "executable doesn't exist" 崩溃。
// 这里改为按优先级自动选择，任何环境都能跑：
//   PW_EXECUTABLE_PATH（显式路径）> PW_CHANNEL（显式通道）> 系统 Chrome > Playwright 自带 Chromium。
import { chromium } from '@playwright/test';

export async function launchBrowser(options = {}) {
  const opts = {
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    ...options,
  };
  if (process.env.PW_EXECUTABLE_PATH) {
    return chromium.launch({ ...opts, executablePath: process.env.PW_EXECUTABLE_PATH });
  }
  if (process.env.PW_CHANNEL && process.env.PW_CHANNEL !== 'none') {
    return chromium.launch({ ...opts, channel: process.env.PW_CHANNEL });
  }
  try {
    return await chromium.launch({ ...opts, channel: 'chrome' });
  } catch (err) {
    // 没有系统 Chrome 的环境（如 CI 只装自带 Chromium）自动回退，不再因路径写死而失败
    return chromium.launch(opts);
  }
}
