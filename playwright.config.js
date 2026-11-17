const {defineConfig} = require('@playwright/test');

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
      use: {
        baseURL: 'http://127.0.0.1:4187',
        headless: true,
        channel: 'chrome'
      }
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
