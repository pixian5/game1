const {test, expect} = require('@playwright/test');

test('限时回复切换会话不重置（v0.8.1）', async ({page}) => {
  await page.goto('/');
  await page.locator('#lock-screen').click();
  await page.evaluate(() => {
    const e = window.__neonTest.engine;
    e.state.conversations.shenyan.pendingChoice = {
      prompt: '限时测试',
      timeout: 8,
      options: [{text: '选项 A'}, {text: '选项 B'}],
      dueAt: Date.now() + 8000,
    };
    openConversation('shenyan');
  });
  await page.waitForTimeout(900);
  const first = await page.evaluate(() => parseInt(document.getElementById('chat-timeout-text').textContent, 10));

  await page.evaluate(() => openConversation('susu'));
  await page.waitForTimeout(1600);
  await page.evaluate(() => openConversation('shenyan'));
  await page.waitForTimeout(800);
  const second = await page.evaluate(() => parseInt(document.getElementById('chat-timeout-text').textContent, 10));

  expect(Number.isFinite(first)).toBe(true);
  expect(second).toBeLessThan(first);

  await page.waitForTimeout(7000);
  const pending = await page.evaluate(() => !!window.__neonTest.engine.state.conversations.shenyan.pendingChoice);
  expect(pending).toBe(false);
});