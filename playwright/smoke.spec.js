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

test('闪回按数据渲染时间标签与标题（v0.1.6）', async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => {
    const e = window.__neonTest.engine;
    e.state.affection.shenyan = 5;
    e.state.flags.intel_shenyan_ex = true;
    e.checkFlashbacks();
  });
  await expect(page.locator('#flashback-screen')).toHaveClass(/active/);
  await expect(page.locator('#flashback-label')).toHaveText('五年前');
  await expect(page.locator('#flashback-title')).toContainText('五年前的美术馆');
});

// v0.1.13: PWA 离线能力验证——在线注册 Service Worker 后断网重载，游戏仍可进入
test('PWA 离线重载可玩（Service Worker 缓存生效）', async ({page, context}) => {
  await page.goto('/');
  // 等待 SW 激活并完成预缓存
  await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    await navigator.serviceWorker.controller ? null : new Promise(res => {
      navigator.serviceWorker.addEventListener('controllerchange', res, {once:true});
    });
    // 确保预缓存写完（install 完成即 ready，cache.addAll 已在 install 中执行）
    void reg;
  });
  // 断网后重载
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#lock-screen')).toHaveClass(/active/, {timeout: 15000});
  await expect(page.locator('#lock-time')).toBeVisible();
  // 离线状态下引擎照常初始化（主屏可达）
  await page.locator('#lock-screen').click();
  await expect(page.locator('#home-screen')).toHaveClass(/active/);
  await context.setOffline(false);
});

// v0.2.5: 相册由程序化照片替代 SVG 占位
test('相册照片全部加载并可查看大图（v0.2.5）', async ({page}) => {
  await page.goto('/');
  await page.locator('#lock-screen').click();
  await page.evaluate(() => {
    const e = window.__neonTest.engine;
    e.state.photos = Object.keys(e.story.photos).map(id => ({id, ...e.story.photos[id], unlocked:true}));
    renderAlbum();
  });
  await page.locator('#home-screen .home-dock [data-app="album"]').click();
  await expect(page.locator('#album-app')).toHaveClass(/active/);

  const imgs = page.locator('#album-grid img');
  await expect(imgs).toHaveCount(5);
  await page.waitForFunction(() =>
    [...document.querySelectorAll('#album-grid img')].every(i => i.complete && i.naturalWidth === 900)
  );
  await page.evaluate(() => { document.getElementById('notif-stack').innerHTML = ''; });

  await imgs.first().click();
  await expect(page.locator('#photo-view')).toHaveClass(/active/);
  const detail = page.locator('#photo-art img');
  await expect(detail).toHaveAttribute('src', 'assets/photos/city.jpg');
  expect(await detail.evaluate(i => i.naturalWidth)).toBe(900);

  await page.locator('.photo-close').click();
  await expect(page.locator('#album-app')).toHaveClass(/active/);
});

// v0.2.6: 4 张角色插画头像接入聊天与通讯录
test('角色头像在聊天/通讯录加载（v0.2.6）', async ({page}) => {
  await page.goto('/');
  await page.locator('#lock-screen').click();
  await page.evaluate(() => openConversation('susu'));
  await expect(page.locator('#chat-screen')).toHaveClass(/active/);
  const chatAvatar = page.locator('#chat-avatar img');
  await expect(chatAvatar).toHaveAttribute('src', 'assets/avatars/susu.jpg');
  expect(await chatAvatar.evaluate(i => i.naturalWidth)).toBe(512);

  await page.evaluate(() => { renderContacts(); showScreen('contacts'); });
  await expect(page.locator('.contact-avatar img')).toHaveCount(4);
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.contact-avatar img')].every(i => i.complete && i.naturalWidth === 512)
  );
  await page.locator('[data-contact="shenyan"]').click();
  await expect(page.locator('#char-profile-screen')).toHaveClass(/active/);
  const profileAvatar = page.locator('.char-profile-avatar img');
  await expect(profileAvatar).toHaveAttribute('src', 'assets/avatars/shenyan.jpg');
  expect(await profileAvatar.evaluate(i => i.naturalWidth)).toBe(512);

  await page.evaluate(() => {
    engine.postMoment('moment_shenyan_opening');
    renderMoments();
    showScreen('moments');
  });
  const momentAvatar = page.locator('.moment-avatar img').first();
  await expect(momentAvatar).toHaveAttribute('src', 'assets/avatars/shenyan.jpg');
  expect(await momentAvatar.evaluate(i => i.naturalWidth)).toBe(512);
});

// v0.2.7: 氛围纹理（雨天/夜晚/不安）随 ambience 合成进壁纸层（M1.3）
test('氛围壁纸随 ambience 切换（v0.2.7）', async ({page}) => {
  await page.goto('/');
  await page.waitForFunction(() => window.__neonTest && window.__neonTest.engine);

  const probe = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    e.state.flags = e.state.flags || {};
    const apply = () => {
      e.emit('ambienceChange', e.getCurrentAmbience());
      return {
        id: e.getCurrentAmbience()?.id || null,
        wp: document.body.style.getPropertyValue('--wallpaper-1'),
        blend: document.body.style.getPropertyValue('--wallpaper-blend'),
      };
    };
    // 先排除优先级更高的条件干扰
    e.state.flags._weather = 'sunny';
    e.state.mood = 'normal';
    e.state.todayFortune = null;

    e.state.minute = 21 * 60;            // 夜晚
    const night = apply();
    e.state.flags._weather = 'rainy';    // 雨天（优先于夜晚）
    const rainy = apply();
    e.state.flags._weather = 'sunny';
    e.state.mood = 'anxious';            // 不安（最高优先级）
    const anxious = apply();
    return {night, rainy, anxious};
  });

  expect(probe.night.id).toBe('night');
  expect(probe.night.wp).toContain('assets/ambiences/night.jpg');
  expect(probe.night.blend).toContain('soft-light');

  expect(probe.rainy.id).toBe('rainy');
  expect(probe.rainy.wp).toContain('assets/ambiences/rainy.jpg');

  expect(probe.anxious.id).toBe('anxious');
  expect(probe.anxious.wp).toContain('assets/ambiences/anxious.jpg');

  // 背景层真正带上了氛围图
  await expect(page.locator('.lock-bg')).toHaveCSS('background-image', /ambiences\/anxious\.jpg/);
});

// v0.3.7: 隐私与数据说明页（PWA / 合规）
test('隐私说明页可访问且声明关键信息（v0.3.7）', async ({page}) => {
  await page.goto('/privacy.html');
  await expect(page).toHaveTitle(/隐私/);
  const body = page.locator('body');
  await expect(body).toContainText('localStorage');
  await expect(body).toContainText('不包含');
  await expect(body).toContainText('不经过任何第三方');
  await expect(page.locator('a[href="./index.html"]')).toBeVisible();
});

// v0.4.0: 键盘可玩基础（D1.1 无障碍）
test('键盘可解锁并返回（v0.4.0）', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('#lock-screen')).toHaveClass(/active/);
  await page.keyboard.press('Enter');
  await expect(page.locator('#home-screen')).toHaveClass(/active/);
  // 打开消息 App，按 Esc 返回主屏
  await page.locator('#app-grid [data-app="messages"]').click();
  await expect(page.locator('#messages-app')).toHaveClass(/active/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#home-screen')).toHaveClass(/active/);
});

// v0.4.1: 语义与 ARIA（D1.2 无障碍）
test('主要控件具备可访问名与语义（v0.4.1）', async ({page}) => {
  await page.goto('/');
  await page.locator('#lock-screen').click();
  await page.locator('#app-grid [data-app="messages"]').click();
  // 返回键有可访问名
  await expect(page.getByRole('button', {name:'返回'}).first()).toBeVisible();
  // 消息记录容器为 log（可被读屏播报）
  await expect(page.locator('#chat-body')).toHaveAttribute('role', 'log');
  await expect(page.locator('#chat-body')).toHaveAttribute('aria-live', 'polite');
  // 会话列表为 list 语义
  await expect(page.locator('#conv-list')).toHaveAttribute('role', 'list');
});
