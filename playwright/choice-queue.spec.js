const {test, expect} = require('@playwright/test');

/* ===== v0.9.11 会话内选择排队：界面行为 =====
 * 背景：旧实现里同一会话后到的选择直接顶掉先到的，被顶掉那个的后续事件永远不会触发。
 * 实测分心玩家在江屿线会因此永久卡死（见 tools/choice_override_probe.mjs）。
 * 引擎层的排队逻辑由 test_regressions.js 与覆盖探测覆盖；这里验证的是界面上的两个行为：
 *   1. 回复第一个选择后，排队的第二个会自动出现，两个选择都被真正处理
 *   2. 邀约超时被系统清理时，界面上它的选项条立即收起
 */

test('会话内选择排队：回复第一个后第二个自动出现，两个都不丢（v0.9.11）', async ({page}) => {
  await page.goto('/');
  await page.locator('#lock-screen').click();
  await page.evaluate(() => {
    const e = window.__neonTest.engine;
    const conv = e.state.conversations.shenyan;
    // 保证用例独立：清掉这个会话可能已有的选择状态
    conv.pendingChoice = null;
    conv.choiceQueue = [];
    e._setPendingChoice(conv, {prompt: '排队测试一', options: [{text: '回答一', effects: {flags: {__queue_test_a: '1'}}}]});
    e._setPendingChoice(conv, {prompt: '排队测试二', options: [{text: '回答二', effects: {flags: {__queue_test_b: '1'}}}]});
    openConversation('shenyan');
  });

  // 界面显示的是先到的第一个；第二个在引擎里排队
  await expect(page.locator('#chat-prompt')).toHaveText('排队测试一');
  await expect(page.locator('#chat-options .chat-opt')).toHaveCount(1);
  await expect(page.locator('#chat-options .chat-opt')).toContainText('回答一');
  const queuedBefore = await page.evaluate(() => (window.__neonTest.engine.state.conversations.shenyan.choiceQueue || []).length);
  expect(queuedBefore).toBe(1);

  // 回复第一个
  await page.locator('#chat-options .chat-opt').click();
  // 约 0.7 秒后第二个自动出现（引擎刻意延后，避免被点击处理末尾的「收起选项条」清掉）
  await expect(page.locator('#chat-prompt')).toHaveText('排队测试二', {timeout: 5000});
  await expect(page.locator('#chat-options .chat-opt')).toContainText('回答二');
  const queuedAfter = await page.evaluate(() => (window.__neonTest.engine.state.conversations.shenyan.choiceQueue || []).length);
  expect(queuedAfter).toBe(0);

  // 回复第二个 → 没有更多排队的，选项条收起；两个选择的标记都生效，证明没有丢任何一个
  await page.locator('#chat-options .chat-opt').click();
  await expect(page.locator('#chat-input-bar')).toBeHidden();
  const result = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    return {
      a: !!e.state.flags.__queue_test_a,
      b: !!e.state.flags.__queue_test_b,
      pending: !!e.state.conversations.shenyan.pendingChoice
    };
  });
  expect(result).toEqual({a: true, b: true, pending: false});
});

test('邀约超时被错过时，界面上它的选项条立即收起（v0.9.11）', async ({page}) => {
  await page.goto('/');
  await page.locator('#lock-screen').click();
  await page.evaluate(() => {
    const e = window.__neonTest.engine;
    const conv = e.state.conversations.luci;
    conv.pendingChoice = null;
    conv.choiceQueue = [];
    // 构造「一个待回复的邀约正亮出」的状态
    e.state.firedInvitations.inv_luci_school = true;
    e.state.invitations.push({id: 'inv_luci_school', status: 'pending', ts: Date.now()});
    conv.pendingChoice = {
      prompt: '陆辞在等你回复：', isInvitation: true, invitationId: 'inv_luci_school',
      options: [
        {text: '好，我去', effects: {thenEvent: '__inv_accept_inv_luci_school'}},
        {text: '抱歉，去不了', effects: {thenEvent: '__inv_decline_inv_luci_school'}}
      ]
    };
    openConversation('luci');
  });
  await expect(page.locator('#chat-prompt')).toHaveText('陆辞在等你回复：');
  await expect(page.locator('#chat-input-bar')).toBeVisible();

  // 模拟超时：系统按「错过」结算邀约
  await page.evaluate(() => window.__neonTest.engine.resolveInvitation('inv_luci_school', 'missed'));
  // 选项条应立即收起，玩家不会去点一个已经失效的邀约
  await expect(page.locator('#chat-input-bar')).toBeHidden();
  const stillPending = await page.evaluate(() => !!window.__neonTest.engine.state.conversations.luci.pendingChoice);
  expect(stillPending).toBe(false);
});
