const {defineConfig} = require('@playwright/test');

// 浏览器可选：PW_CHANNEL=chrome|msedge|none，PW_EXECUTABLE_PATH 指定自定义内核
const CHANNEL = process.env.PW_CHANNEL || 'chrome';
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
