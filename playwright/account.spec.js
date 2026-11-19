const { test, expect } = require('@playwright/test');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

/* 账号界面端到端：单独拉起账号服务（临时库），覆盖注册→找回码→上传→恢复→登出→找回→改昵称→注销 */
const PORT = Number(process.env.NH_E2E_PORT || 4190);
const BASE = `http://127.0.0.1:${PORT}`;
const ROOT = path.resolve(__dirname, '..');
let child = null;
let childLog = '';
let tmpDir = null;

function probeHealth(){
  return new Promise(resolve => {
    const req = http.get(`${BASE}/api/health`, { timeout: 1500 }, res => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}
async function waitHealth(){
  for(let i = 0; i < 80; i++){
    if(await probeHealth()) return;
    await new Promise(r => setTimeout(r, 150));
  }
  throw new Error('account server did not start');
}

test.describe('账号与云存档', () => {
  test.beforeAll(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nh-e2e-'));
    child = spawn(process.execPath, ['--no-warnings', 'server/index.mjs'], {
      cwd: ROOT,
      env: { ...process.env, NH_PORT: String(PORT), NH_DB: path.join(tmpDir, 'e2e.db'), NH_HOST: '127.0.0.1' },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    child.stdout.on('data', d => { childLog += d; });
    child.stderr.on('data', d => { childLog += d; });
    try {
      await waitHealth();
    } catch(e){
      throw new Error(e.message + '\n--- child log ---\n' + childLog);
    }
  });

  test.afterAll(async () => {
    if(child){ child.kill('SIGTERM'); await new Promise(r => setTimeout(r, 200)); }
    if(tmpDir){ try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch(_) {} }
  });

  test('注册 / 云存档 / 恢复 / 找回 / 注销 全流程', async ({ page }) => {
    test.setTimeout(90000);
    const username = `e2e_${Date.now().toString(36)}`;
    const password = 'abc12345';
    const newPassword = 'xyz12345';
    let recoveryCode = '';

    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.locator('#lock-screen').click();
    await page.evaluate(() => openApp('settings'));
    await expect(page.locator('#account-root')).toBeVisible();

    await test.step('注册并展示一次性找回码', async () => {
      await page.locator('[data-acct-action="tab-register"]').click();
      await page.fill('form[data-acct-form="register"] input[name="username"]', username);
      await page.fill('form[data-acct-form="register"] input[name="nickname"]', '端到端');
      await page.fill('form[data-acct-form="register"] input[name="password"]', password);
      await page.fill('form[data-acct-form="register"] input[name="confirm"]', password);
      await page.locator('form[data-acct-form="register"] button[type="submit"]').click();
      await expect(page.locator('#acct-recovery-code')).toBeVisible();
      recoveryCode = (await page.locator('#acct-recovery-code').innerText()).trim();
      expect(recoveryCode).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
      await page.locator('[data-acct-action="finish-register"]').click();
      await expect(page.locator('#account-root .acct-head')).toContainText('@' + username);
    });

    await test.step('本机存档上传到云端', async () => {
      await page.evaluate(() => { window.__neonTest.engine.save('slot1'); });
      await page.locator('[data-acct-action="upload"]').click();
      await expect(page.locator('#account-root')).toContainText('已上传到云端');
      await expect(page.locator('#account-root')).toContainText('rev 1');
    });

    await test.step('刷新后会话保持', async () => {
      // 必须先让 Service Worker 接管，否则测不出「/api 被 cache-first 缓存」的登录态丢失回归
      await page.waitForFunction(() => !!(navigator.serviceWorker && navigator.serviceWorker.controller), null, { timeout: 10000 });
      await page.reload({ waitUntil: 'networkidle' });
      await page.locator('#lock-screen').click();
      await page.evaluate(() => openApp('settings'));
      await expect(page.locator('#account-root .acct-head')).toContainText('@' + username);
      await expect(page.locator('#account-root')).toContainText('rev 1');
    });

    await test.step('云端恢复覆盖本机（含删除多余槽）', async () => {
      await page.evaluate(() => { window.__neonTest.engine.save('slot2'); });
      expect((await page.evaluate(() => Object.keys(window.__neonTest.engine.getAllSaves()))).includes('slot2')).toBeTruthy();
      await page.locator('[data-acct-action="download"]').click();
      await page.locator('[data-acct-action="download-confirm"]').click();
      await expect(page.locator('#account-root')).toContainText('已用云端存档覆盖本机');
      const slots = await page.evaluate(() => Object.keys(window.__neonTest.engine.getAllSaves()));
      expect(slots.includes('slot2')).toBeFalsy();
      expect(slots.includes('slot1')).toBeTruthy();
    });

    await test.step('退出后用找回码重置密码', async () => {
      await page.locator('[data-acct-action="logout"]').click();
      await expect(page.locator('#account-root')).toContainText('已退出登录');
      await page.locator('[data-acct-action="tab-recover"]').click();
      await page.fill('form[data-acct-form="recover"] input[name="username"]', username);
      await page.fill('form[data-acct-form="recover"] input[name="recoveryCode"]', recoveryCode);
      await page.fill('form[data-acct-form="recover"] input[name="newPassword"]', newPassword);
      await page.fill('form[data-acct-form="recover"] input[name="confirm"]', newPassword);
      await page.locator('form[data-acct-form="recover"] button[type="submit"]').click();
      await expect(page.locator('#account-root')).toContainText('密码已重置，请用新密码登录');
    });

    await test.step('新密码登录并改昵称', async () => {
      await page.fill('form[data-acct-form="login"] input[name="username"]', username);
      await page.fill('form[data-acct-form="login"] input[name="password"]', newPassword);
      await page.locator('form[data-acct-form="login"] button[type="submit"]').click();
      await expect(page.locator('#account-root .acct-head')).toContainText('@' + username);
      await page.fill('form[data-acct-form="nickname"] input[name="nickname"]', '改名成功');
      await page.locator('form[data-acct-form="nickname"] button[type="submit"]').click();
      await expect(page.locator('#account-root')).toContainText('昵称已更新');
      await expect(page.locator('#account-root .acct-name')).toContainText('改名成功');
    });

    await test.step('注销账号', async () => {
      await page.locator('form[data-acct-form="delete"] input[name="ack"]').check();
      await page.fill('form[data-acct-form="delete"] input[name="password"]', newPassword);
      await page.locator('form[data-acct-form="delete"] button[type="submit"]').click();
      await expect(page.locator('#account-root')).toContainText('账号已注销，本机存档仍保留');
      await expect(page.locator('#account-root')).toContainText('登录后可在不同设备同步');
    });
  });
});
