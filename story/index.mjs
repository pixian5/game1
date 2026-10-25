/* ===== 霓虹心事 · 剧情数据 ESM 入口（v0.5.6 F2.1，测试侧专用）=====
 * 浏览器端：18 个传统 script 标签按序执行（词法全局共享，见 index.html）。
 * Node 测试侧：本入口以 vm 按同一顺序加载全部板块，导出聚合 STORY——
 * 与浏览器加载语义一致（同一全局对象上逐文件扩展），后续可渐进迁移为原生 ESM。
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sb = { window: {}, console, Date, Math, JSON, Object, Array, String, Number, Boolean, Set, Map, setTimeout, clearTimeout, setInterval, clearInterval };
sb.globalThis = sb;
vm.createContext(sb);
for (const f of fs.readdirSync(__dirname).filter(f => /^[\d]{2}_.*\.js$/.test(f)).sort()) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), sb, { filename: 'story/' + f });
}
export const STORY = sb.window.STORY;
