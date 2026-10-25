// v0.2.0: 轻量起步——按运行环境分块配置，保证零基线可过，后续逐步收紧。
// 注：跨文件共享的全局（STORY/PhoneEngine 等）在运行时文件组统一声明并关闭 no-redeclare，
// 真正的重复声明由 check:ui 的合并编译拦截（那是更强的检查）。
const browser = {
  window: 'readonly', document: 'readonly', navigator: 'readonly', localStorage: 'readonly',
  setTimeout: 'readonly', clearTimeout: 'readonly', setInterval: 'readonly', clearInterval: 'readonly',
  fetch: 'readonly', caches: 'readonly', self: 'readonly', location: 'readonly',
  console: 'readonly', requestAnimationFrame: 'readonly', URL: 'readonly', crypto: 'readonly',
};
const runtimeShared = { STORY: 'readonly', PhoneEngine: 'readonly', InteractionQueue: 'readonly', SaveMigrations: 'readonly', AudioSys: 'readonly', Clock: 'writable', FakeClock: 'readonly', EventScheduler: 'readonly', SaveManager: 'readonly' };
const node = { window: 'readonly', require: 'readonly', module: 'readonly', exports: 'readonly', __dirname: 'readonly', process: 'readonly', Buffer: 'readonly', console: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly', setInterval: 'readonly', clearInterval: 'readonly' };
const rules = {
  'no-undef': 'error', 'no-dupe-keys': 'error', 'no-dupe-args': 'error', 'no-unreachable': 'error',
  'no-constant-condition': 'error', 'no-cond-assign': 'error', 'no-fallthrough': 'error', 'no-self-assign': 'error',
  'no-use-before-define': 'off', 'no-redeclare': 'off',
};

export default [
  { ignores: ['node_modules/**', 'test-results/**', 'playwright/**', 'coverage/**', 'assets/**', 'tools/*.py'] },
  // 运行时（浏览器）：story / engine* / ui / audio / pwa / sw / types
  { files: ['story/**/*.js', 'engine.js', 'engine_*.js', 'interaction_queue.js', 'save_migrations.js', 'audio.js', 'pwa.js', 'sw.js', 'types.js'],
    languageOptions: { ecmaVersion: 2024, sourceType: 'script', globals: { ...browser, ...runtimeShared } }, rules },
  // ui/ 为共享全局作用域（拆分自 IIFE），跨文件函数调用由 check:ui 合并编译 + E2E 兜底，no-undef 关闭
  { files: ['ui/**/*.js'],
    languageOptions: { ecmaVersion: 2024, sourceType: 'script', globals: { ...browser, ...runtimeShared } },
    rules: { ...rules, 'no-undef': 'off' } },
  // Node 侧：测试与校验脚本
  { files: ['test_*.js', 'validate_story.js', 'check_*.js', 'test_helper.js', 'test_server.js'],
    languageOptions: { ecmaVersion: 2024, sourceType: 'script', globals: { ...node, ...browser, ...runtimeShared } }, rules },
  
  { files: ['tools/**/*.mjs'], languageOptions: { ecmaVersion: 2024, sourceType: 'module', globals: { ...node, ...browser } }, rules: { ...rules, 'no-redeclare': 'error' } },
  // 浏览器内联脚本（page.evaluate 的字符串代码）无法静态解析其全局，关闭 no-undef
  { files: ['tools/flow_test.mjs', 'tools/soak_test.mjs'], rules: { ...rules, 'no-redeclare': 'error', 'no-undef': 'off' } },
  { files: ['tools/*.js'], languageOptions: { ecmaVersion: 2024, sourceType: 'script', globals: { ...node } }, rules: { ...rules, 'no-redeclare': 'error' } },
  { files: ['eslint.config.mjs'], languageOptions: { ecmaVersion: 2024, sourceType: 'module', globals: { ...node } }, rules: { ...rules, 'no-redeclare': 'error' } },
];
