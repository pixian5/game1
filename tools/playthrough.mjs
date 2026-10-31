import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const ROUTE = process.env.ROUTE || 'shenyan';
const TARGET = process.env.TARGET || '';
const STRATEGY = process.env.STRATEGY || 'first';
const OUT = process.env.OUT || '/workspace/neon-runs/' + ROUTE + (TARGET ? '-' + TARGET : '');
const BASE = process.env.BASE || 'http://127.0.0.1:4187';
const MAX_MS = Number(process.env.MAX_MS || 480000);

fs.mkdirSync(OUT, { recursive: true });
const shotIndex = [];
const log = (...a) => console.log(...a);
const sleep = ms => new Promise(r => setTimeout(r, ms));

const GOOD_WORDS = ['正面对峙', '接受', '留下', '靠近', '坚持', '说清楚', '去找', '问清楚', '追'];
const BAD_WORDS = ['默默忍受', '错过', '离开', '放手', '回避', '沉默', '不唱', '不去'];

function pickIndex(options, strategy) {
  const texts = options.map(o => String(o.text || ''));
  if (strategy === 'last') return texts.length - 1;
  if (strategy === 'good') {
    const i = texts.findIndex(t => GOOD_WORDS.some(w => t.includes(w)));
    return i >= 0 ? i : 0;
  }
  if (strategy === 'bad') {
    const i = texts.findIndex(t => BAD_WORDS.some(w => t.includes(w)));
    return i >= 0 ? i : texts.length - 1;
  }
  return 0;
}

const browser = await chromium.launch({
  executablePath: '/root/.cache/ms-playwright/chromium-1243/chrome-linux/chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'],
});
const context = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await context.newPage();
const errors = [];
const failed = [];
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 300)); });
page.on('pageerror', e => errors.push('pageerror: ' + String(e).slice(0, 300)));
page.on('requestfailed', r => failed.push(r.url() + ' :: ' + (r.failure() && r.failure().errorText)));
page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });

await page.addInitScript(() => {
  const orig = window.setTimeout;
  window.setTimeout = (fn, d, ...a) => {
    const ms = Number(d) || 0;
    return orig(fn, ms > 3000 ? ms : Math.min(ms, 15), ...a);
  };
  try { localStorage.clear(); } catch (_) {}
});

await page.goto(BASE + '/?debug=1', { waitUntil: 'load', timeout: 60000 });
await page.waitForFunction(() => window.__neonTest && window.__neonTest.engine, null, { timeout: 20000 });

const shot = async (name) => {
  const file = path.join(OUT, name + '.png');
  await page.screenshot({ path: file });
  shotIndex.push(file);
};

await page.waitForSelector('#lock-screen.active', { timeout: 15000 });
await page.evaluate(() => {
  window.__autoCall = setInterval(() => {
    if (window._currentCall) {
      const scr = document.querySelector('#incoming-call');
      if (scr && !scr.classList.contains('active')) {
        try { window.showScreen('incomingCall'); } catch (_) {}
      }
    }
    const accept = document.querySelector('[data-call="accept"]');
    if (accept && accept.offsetParent !== null) { accept.click(); return; }
    const opt = [...document.querySelectorAll('#call-script button')].find(b => b.offsetParent !== null);
    if (opt) opt.click();
  }, 350);
});
await shot('01-lock');
await page.click('#lock-screen');
await sleep(400);
await shot('02-home');

const t0 = Date.now();
let lastDay = 0;
let steps = 0, chosen = 0;
let lastChange = Date.now(), lastMark = '';
let lastFireMark = '', lastFireAt = Date.now();
let stalled = false;
let ended = false;
const timeline = [];

while (Date.now() - t0 < MAX_MS) {
  steps++;
  const s = await page.evaluate(() => {
    const e = window.__neonTest.engine;
    const active = document.querySelector('.screen.active')?.id || '';
    const vis = sel => { const el = document.querySelector(sel); return !!el && el.offsetParent !== null; };
    let pending = null;
    for (const [cid, c] of Object.entries(e.state.conversations || {})) {
      if (c.pendingChoice) {
        pending = { cid, prompt: c.pendingChoice.prompt, opts: c.pendingChoice.options.map(o => ({ text: o.text, hint: o.hint })) };
        break;
      }
    }
    let groupPending = null;
    for (const [gid, g] of Object.entries(e.state.groups || {})) {
      if (g.pendingChoice) { groupPending = { gid, opts: g.pendingChoice.options.map(o => ({ text: o.text })) }; break; }
    }
    return {
      active, day: e.state.day, minute: e.state.minute, route: e.state.route,
      ending: active === 'ending-screen' || !!e.state.ended,
      routeModal: !!document.getElementById('route-choice-modal'),
      narratorModal: !!document.getElementById('narrator-choice-modal'),
      call: vis('#call-actions'),
      inCall: !!window._currentCall,
      dream: vis('#dream-screen'),
      activeDream: e.state.activeDream || null,
      nightmare: vis('#nightmare-screen'),
      encounter: vis('#encounter-screen'),
      date: vis('#date-scene-screen'),
      narrator: vis('#narrator-screen'),
      flashback: active === 'flashback-screen',
      pending, groupPending,
      narratorPending: (() => {
        const p = e.getPendingInteractions().find(i => i.type === 'narrator_choice');
        return p ? { prompt: p.choice.prompt, opts: p.choice.options.map(o => ({ text: o.text, hint: o.hint })) } : null;
      })(),
      callOpts: [...document.querySelectorAll('#call-script button')].filter(b => b.offsetParent !== null).length,
      fired: Object.keys(e.state.firedEvents).length,
      msgs: Object.values(e.state.conversations).reduce((a, c) => a + c.messages.length, 0),
      achievements: Object.keys(e.state.achievements || {}).length,
      collected: (e.state.collected || []).length,
    };
  });

  if (s.day !== lastDay) {
    lastDay = s.day;
    timeline.push({ day: s.day, fired: s.fired, msgs: s.msgs, route: s.route, at: Math.round((Date.now() - t0) / 1000) });
    if (s.day <= 3 || s.day === 21) await shot('day' + String(s.day).padStart(2, '0'));
  }

  const mark = s.day + '|' + s.fired + '|' + s.msgs + '|' + s.active;
  if (mark !== lastMark) { lastMark = mark; lastChange = Date.now(); }

  const fireMark = s.day + '|' + s.fired;
  if (fireMark !== lastFireMark) { lastFireMark = fireMark; lastFireAt = Date.now(); }
  if (Date.now() - lastFireAt > 45000 || (!s.route && s.day >= 21)) { stalled = true; break; }

  if (steps % 20 === 0) {
    fs.appendFileSync('/tmp/pt-progress.log', JSON.stringify({
      t: Math.round((Date.now() - t0) / 1000), steps, day: s.day, active: s.active,
      route: s.route, fired: s.fired, msgs: s.msgs, chosen,
      pending: s.pending && s.pending.cid, group: s.groupPending && s.groupPending.gid,
      modal: s.routeModal, callOpts: s.callOpts, idle: Math.round((Date.now() - lastChange) / 1000),
    }) + '\n');
  }

  if (s.ending) { ended = true; break; }

  if (s.inCall) {
    if (s.call) {
      await shot('call');
      await page.evaluate(() => document.querySelector('[data-call="accept"]')?.click());
      await sleep(400);
    } else if (s.callOpts > 0) {
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('#call-script button')].find(b => b.offsetParent !== null);
        if (btn) btn.click();
      });
      await sleep(250);
    } else {
      await sleep(350);
    }
    continue;
  }

  if (s.routeModal) {
    await shot('route-choice');
    await page.click(`#route-choice-modal [data-route="${ROUTE}"]`);
    await sleep(200);
    continue;
  }
  if (s.narratorModal || s.narratorPending) {
    await shot('narrator-choice');
    const idx = s.narratorPending ? pickIndex(s.narratorPending.opts, STRATEGY) : 0;
    const how = await page.evaluate(idx => {
      const btn = document.querySelector(`#narrator-choice-modal [data-narrator-choice="${idx}"]`);
      if (btn) { btn.click(); return 'ui'; }
      const e = window.__neonTest.engine;
      const p = e.getPendingInteractions().find(i => i.type === 'narrator_choice');
      if (p) {
        const opt = p.choice.options[Math.min(idx, p.choice.options.length - 1)];
        e.sendMessage('narrator', opt.text, opt.effects);
        return 'api';
      }
      return 'none';
    }, idx);
    if (how === 'api') fs.appendFileSync('/tmp/pt-defects.log', JSON.stringify({ at: new Date().toISOString(), issue: 'narrator_choice 挂起但无弹窗，已用引擎兜底', prompt: s.narratorPending.prompt, day: s.day }) + '\n');
    chosen++;
    await sleep(180);
    continue;
  }
  if (s.call) {
    await shot('call');
    await page.evaluate(() => document.querySelector('[data-call="accept"]')?.click());
    await sleep(200);
    continue;
  }
  if (s.callOpts > 0) {
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('#call-script button')].find(b => b.offsetParent !== null);
      if (btn) btn.click();
    });
    await sleep(150);
    continue;
  }
  if (s.dream) {
    await shot('dream');
    await page.evaluate(() => document.querySelector('#dream-options .dream-opt')?.click());
    await sleep(150);
    continue;
  }
  if (s.activeDream) {
    await page.evaluate(id => window.__neonTest.engine.resolveDream(id, 0), s.activeDream);
    fs.appendFileSync('/tmp/pt-defects.log', JSON.stringify({ at: new Date().toISOString(), issue: '梦境挂起但无可见 UI，已用引擎兜底', dream: s.activeDream, day: s.day }) + '\n');
    chosen++;
    await sleep(200);
    continue;
  }
  if (s.nightmare) {
    await shot('nightmare');
    await page.evaluate(() => document.querySelector('#nightmare-screen .dream-opt')?.click());
    await sleep(150);
    continue;
  }
  if (s.encounter) {
    await shot('encounter');
    await page.evaluate(() => document.querySelector('#encounter-options .dream-opt')?.click());
    await sleep(150);
    continue;
  }
  if (s.date) {
    await shot('date');
    await page.evaluate(() => {
      const b = document.querySelector('#date-scene-content [data-action="finish-date"]');
      if (b) b.click(); else document.querySelector('#date-scene-content [data-action="close-date"]')?.click();
    });
    await sleep(150);
    continue;
  }
  if (s.flashback) {
    await shot('flashback');
    await page.evaluate(() => document.querySelector('#flashback-options .dream-opt')?.click());
    await sleep(150);
    continue;
  }
  if (s.narrator) {
    await page.evaluate(() => document.querySelector('#narrator-screen .chat-opt')?.click());
    await sleep(150);
    continue;
  }
  if (s.pending) {
    await page.evaluate(cid => { try { window.openConversation(cid); } catch (_) {} }, s.pending.cid);
    await sleep(120);
    if (chosen < 5) await shot('choice-' + (chosen + 1));
    const idx = pickIndex(s.pending.opts, STRATEGY);
    const clicked = await page.evaluate(({ cid, idx }) => {
      const chat = document.querySelector('#chat-screen');
      if (!chat || !chat.classList.contains('active')) return false;
      if (document.querySelector('#chat-input-bar')?.hidden) return false;
      const btns = [...document.querySelectorAll('#chat-options .chat-opt')].filter(b => b.offsetParent !== null);
      if (btns.length) { btns[Math.min(idx, btns.length - 1)].click(); return true; }
      return false;
    }, { cid: s.pending.cid, idx });
    if (!clicked) {
      await page.evaluate(({ cid, idx }) => {
        const e = window.__neonTest.engine;
        const c = e.state.conversations[cid];
        if (c && c.pendingChoice) {
          const opt = c.pendingChoice.options[Math.min(idx, c.pendingChoice.options.length - 1)];
          e.sendMessage(cid, opt.text, e.normalizeOptionEffects(opt));
          c.pendingChoice = null;
        }
      }, { cid: s.pending.cid, idx });
    }
    chosen++;
    await sleep(180);
    continue;
  }
  if (s.groupPending) {
    await page.evaluate(gid => { try { window.openGroupChat(gid); } catch (_) {} }, s.groupPending.gid);
    await sleep(150);
    if (chosen < 8) await shot('group-choice');
    const idx = pickIndex(s.groupPending.opts, STRATEGY);
    const clicked = await page.evaluate(idx => {
      const btns = [...document.querySelectorAll('#group-chat-options .chat-opt')].filter(b => b.offsetParent !== null);
      if (btns.length) { btns[Math.min(idx, btns.length - 1)].click(); return true; }
      return false;
    }, idx);
    if (!clicked) {
      await page.evaluate(({ gid, idx }) => {
        const e = window.__neonTest.engine;
        const g = e.state.groups[gid];
        if (g && g.pendingChoice) {
          const opt = g.pendingChoice.options[Math.min(idx, g.pendingChoice.options.length - 1)];
          e.sendGroupMessage(gid, opt.text, e.normalizeOptionEffects(opt));
          g.pendingChoice = null;
        }
      }, { gid: s.groupPending.gid, idx });
    }
    chosen++;
    await sleep(180);
    continue;
  }

  if (Date.now() - lastChange > 1800) {
    await page.evaluate(() => { try { window.__neonTest.engine.advanceTime(240); } catch (_) {} });
    lastChange = Date.now();
  }
  await sleep(100);
}

if (ended) { await sleep(600); await shot('ending'); }

const report = await page.evaluate(() => {
  const e = window.__neonTest.engine;
  const D = window.NeonDebug;
  return {
    title: document.title,
    day: e.state.day, minute: e.state.minute, route: e.state.route, ended: !!e.state.ended,
    endingTitle: document.getElementById('ending-title')?.textContent || '',
    endingText: document.getElementById('ending-text')?.textContent || '',
    endingTag: document.getElementById('ending-tag')?.textContent || '',
    endingSeen: Object.keys(e.state.endingSeen || {}),
    gallerySeen: Object.keys(e.state.endingGallerySeen || {}),
    achievements: Object.keys(e.state.achievements || {}),
    collected: e.state.collected || [],
    affection: e.state.affection,
    personality: e.state.personality,
    flags: e.state.flags,
    pendingInteractions: (e.state.pendingInteractions || []).map(i => i.type + ':' + (i.eventId || i.id)),
    scheduledEvents: e._scheduledEvents ? [...e._scheduledEvents] : [],
    pendingEventDispatches: (e.state.pendingEventDispatches || []).slice(-20),
    pendingTimeAdvances: (e.state.pendingTimeAdvances || []).slice(-10),
    timers: e._timers ? e._timers.size : -1,
    convState: Object.fromEntries(Object.entries(e.state.conversations).map(([k, c]) => [k, { msgs: c.messages.length, pending: !!c.pendingChoice }])),
    groupsState: Object.fromEntries(Object.entries(e.state.groups || {}).map(([k, g]) => [k, { msgs: g.messages.length, pending: !!g.pendingChoice }])),
    firedKeys: Object.keys(e.state.firedEvents || {}),
    debugIssues: D ? D.issues().map(i => `${i.at} [${i.level}] ${i.tag}: ${i.msg}`) : [],
    debugTotal: D ? D.entries().length : 0,
    screen: document.querySelector('.screen.active')?.id,
  };
});

const result = { route: ROUTE, target: TARGET, strategy: STRATEGY, ended, stalled, steps, chosen, timeline, shots: shotIndex, errors, failed, report };
fs.writeFileSync(path.join(OUT, 'result.json'), JSON.stringify(result, null, 2));
log(JSON.stringify({
  route: ROUTE, target: TARGET, strategy: STRATEGY, ended, day: report.day,
  routeReached: report.route, ending: report.endingTitle, endingSeen: report.endingSeen,
  achievements: report.achievements.length, collected: report.collected.length,
  steps, chosen, errors: errors.slice(0, 10), failed: failed.slice(0, 10),
  debugIssues: report.debugIssues.slice(0, 30),
}, null, 2));
await browser.close();
process.exit(ended ? 0 : 2);