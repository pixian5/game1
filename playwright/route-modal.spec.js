const {test, expect} = require('@playwright/test');

// v0.9.1: 路线选择弹窗必须挂在 #phone 顶层，任何 App 停留时都可见。
// 旧实现挂 #home-screen，玩家不在主屏时弹窗 offsetParent 为 null，会卡住主线。
test('路线选择弹窗在任何屏幕都可见（v0.9.1）', async ({page}) => {
  await page.goto('/?debug=1');
  await page.waitForFunction(() => window.__neonTest && window.__neonTest.engine, null, {timeout: 20000});
  await page.waitForSelector('#lock-screen.active', {timeout: 15000});
  await page.click('#lock-screen');
  await page.waitForSelector('#home-screen.active', {timeout: 15000});

  // 先进入「消息」App，模拟玩家不在主屏
  await page.evaluate(() => {
    try { window.openApp('messages'); } catch (_) {}
  });
  await page.waitForTimeout(400);

  // 直接派发路线选择
  await page.evaluate(() => {
    window.__neonTest.engine.emit('routeChoiceReady', window.__neonTest.engine.story.routeChoice);
  });
  await page.waitForSelector('#route-choice-modal', {timeout: 5000});

  const info = await page.evaluate(() => {
    const modal = document.getElementById('route-choice-modal');
    return {
      visible: !!modal && modal.offsetParent !== null,
      parentId: modal?.parentElement?.id || '',
      options: [...modal.querySelectorAll('[data-route]')].filter(b => b.offsetParent !== null).length,
      role: modal.getAttribute('role'),
    };
  });

  expect(info.visible).toBe(true);
  expect(info.parentId).toBe('phone');
  expect(info.options).toBe(4);
  expect(info.role).toBe('dialog');

  // 选择一条路线后弹窗应移除
  await page.click('#route-choice-modal [data-route="shenyan"]');
  await expect(page.locator('#route-choice-modal')).toHaveCount(0);
  const route = await page.evaluate(() => window.__neonTest.engine.state.route);
  expect(route).toBe('shenyan');
});
