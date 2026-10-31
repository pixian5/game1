const {test, expect} = require('@playwright/test');

test('旁白选择在聊天屏时仍可见（v0.7.6）', async ({page}) => {
  await page.goto('/');
  await page.locator('#lock-screen').click();
  await page.evaluate(() => openConversation('susu'));
  await page.waitForTimeout(250);
  await page.evaluate(() => window.__neonTest.engine.scheduleEvent('week1_review'));

  const modal = page.locator('#narrator-choice-modal');
  await expect(modal).toBeVisible({timeout: 5000});
  await expect(modal.locator('[data-narrator-choice]').first()).toBeVisible();

  await modal.locator('[data-narrator-choice]').first().click();
  await expect(modal).toHaveCount(0);
  const pending = await page.evaluate(() =>
    window.__neonTest.engine.getPendingInteractions().filter(i => i.type === 'narrator_choice').length
  );
  expect(pending).toBe(0);
});