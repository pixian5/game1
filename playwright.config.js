const {defineConfig} = require('@playwright/test');

module.exports = defineConfig({
  testDir: './playwright',
  timeout: 30000,
  webServer: {
    command: 'node test_server.js',
    port: 4173,
    reuseExistingServer: true
  },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
    channel: 'chrome'
  }
});
