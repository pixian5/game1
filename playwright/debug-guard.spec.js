const {test, expect} = require('@playwright/test');

test('调试日志不递归、空选择不崩溃（v0.7.9）', async ({page}) => {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('/?debug=1');
  await page.waitForFunction(() => window.__neonTest);
  await page.locator('#lock-screen').click();

  await page.evaluate(() => {
    console.error('probe-error');
    window.NeonDebug.error('probe', 'x');
  });
  await page.waitForTimeout(300);

  await page.evaluate(() => openConversation('susu'));
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    window.__neonTest.engine.emit('choicePrompt', {
      convId: 'susu',
      choice: null,
      conv: window.__neonTest.engine.state.conversations.susu,
    });
  });
  await page.waitForTimeout(300);

  await page.evaluate(() => showGroupChoice('group_neon', null));
  await page.waitForTimeout(200);

  expect(errors.filter(e => /Maximum call stack|reading 'prompt'/.test(e))).toEqual([]);
});