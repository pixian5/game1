const {defineConfig} = require('@playwright/test');

// 浏览器可选：PW_CHANNEL=chrome|msedge|none，PW_EXECUTABLE_PATH 指定自定义内核
// v0.9.12：默认从真实安装的谷歌浏览器（chrome）改为框架自带的内核（none）。原因（2026-11-25 实测）：
//   两个工作进程各自启动一个真实浏览器实例、又几乎同时收尾时，进程会卡死不退出（要等 300 秒被强制结束，
//   整组用例被判失败）。同一套用例用自带内核 46 秒跑完；真实浏览器单进程顺序执行也正常，只有并发收尾才卡。
//   之前没暴露，只是因为各进程结束时间刚好错开。自带内核版本固定、结果可复现，也不会去动正在使用的浏览器。
//   想用电脑上的真实浏览器：PW_CHANNEL=chrome npm run test:browser
const CHANNEL = process.env.PW_CHANNEL || 'none';
const chromiumUse = { baseURL: 'http://127.0.0.1:4187', headless: true };
if (CHANNEL !== 'none') chromiumUse.channel = CHANNEL;
if (process.env.PW_EXECUTABLE_PATH) {
  chromiumUse.channel = undefined;
  chromiumUse.launchOptions = { executablePath: process.env.PW_EXECUTABLE_PATH, args: ['--no-sandbox', '--disable-dev-shm-usage'] };
}

module.exports = defineConfig({
  testDir: './playwright',
  timeout: 30000,
  webServer: {
    command: 'node test_server.js',
    port: 4187,
    reuseExistingServer: true
  },
  projects: [
    {
      name: 'chromium',
      use: chromiumUse
    },
    {
      name: 'firefox',
      use: {
        baseURL: 'http://127.0.0.1:4187',
        headless: true
      }
    },
    {
      name: 'webkit',
      use: {
        baseURL: 'http://127.0.0.1:4187',
        headless: true
      }
    }
  ]
});
