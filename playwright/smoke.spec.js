const {test, expect} = require('@playwright/test');

test('首页锁屏和主屏可达', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('#lock-screen')).toHaveClass(/active/);
  await expect(page.locator('#lock-time')).toBeVisible();
  await page.locator('#lock-screen').click();
  await expect(page.locator('#home-screen')).toHaveClass(/active/);
  await expect(page.locator('#app-grid')).toBeVisible();
});

test('队列交互可在浏览器本地存档后恢复', async ({page}) => {
  await page.goto('/');
  const result = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    const routeId = Object.entries(e.story.events).find(([, evt]) => evt.type === 'route_choice')[0];
    e.scheduleEvent(routeId);
    e.save('slot1');
    return {pending: e.getPendingInteractions(), raw: localStorage.getItem('neon_phone_saves')};
  });
  expect(result.pending[0].type).toBe('route_choice');
  expect(result.raw).toContain('pendingInteractions');

  await page.reload();
  await page.locator('#lock-screen').click();
  await expect(page.locator('#route-choice-modal')).toBeVisible();
});

test('关闭偶遇会清理待处理交互', async ({page}) => {
  await page.goto('/');
  const visible = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    const eventId = 'inv_shenyan_studio_scene';
    e.scheduleEvent(eventId);
    const encounter = e.getPendingEncounter();
    window.__neonTest.showEncounter(encounter);
    window.__neonTest.closeEncounter();
    return {pending: e.getPendingInteractions(), screen: document.querySelector('#map-app').classList.contains('active')};
  });
  expect(visible.pending.some(item => item.type === 'encounter')).toBe(false);
  expect(visible.screen).toBe(true);
});
