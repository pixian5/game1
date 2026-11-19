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
// v0.9.7：旧正则 /^[\d]{2}_.*\.js$/ 漏掉 01b_day45 / 01c_day67 / 01d_day814（两位数字+字母+下划线），
// 导致 L1 测试只看得到 270/338 条事件，v0.9.5 新增的 day4–7 线内剧情完全不在测试视野里。
const storyFiles = fs.readdirSync(__dirname).filter(f => /^\d{2}[a-z]?_.*\.js$/.test(f)).sort();
for (const f of storyFiles) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), sb, { filename: 'story/' + f });
}
// 完整性守卫：story 目录下所有「数字开头」的脚本都必须被加载，新增板块改名时立刻报错而不是静默降级
const allStoryFiles = fs.readdirSync(__dirname).filter(f => /^\d{2}.*\.js$/.test(f));
const missed = allStoryFiles.filter(f => !storyFiles.includes(f));
if (missed.length) {
  throw new Error('剧情脚本加载不完整，漏掉：' + missed.join(', '));
}
export const STORY = sb.window.STORY;
