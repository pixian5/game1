/* ===== 覆盖率红线门禁（v0.6.1 G3）=====
 * 解析 c8 的 lcov 报告，任一纳入统计文件行覆盖 < 阈值则失败。
 * 阈值起步 60%（现状 48%→G1/G2 直测后预计 60+，爬坡路线见 docs 阶段G）。
 */
import fs from 'node:fs';
const THRESHOLD = 60;
const lcov = fs.readFileSync('coverage/lcov.info', 'utf8');
const lines = lcov.split('\n');
let file = '', found = 0, hit = 0, failures = [];
for (const l of lines) {
  if (l.startsWith('SF:')) { file = l.slice(3); found = 0; hit = 0; }
  else if (l.startsWith('DA:')) {
    const [, c] = l.slice(3).split(',');
    if (Number(c) > 0) hit++;
    found++;
  } else if (l.startsWith('end_of_record') && file) {
    const pct = found ? (hit / found) * 100 : 100;
    const name = file.split('/').pop();
    if (pct < THRESHOLD) failures.push(`${name}: ${pct.toFixed(1)}% < ${THRESHOLD}%`);
    else console.log(`✓ ${name} ${pct.toFixed(1)}%`);
    file = '';
  }
}
if (failures.length) {
  console.error('\n覆盖率低于红线 ' + THRESHOLD + '%：');
  failures.forEach(f => console.error('  ✗ ' + f));
  process.exit(1);
}
console.log(`\n覆盖率红线通过（全部 ≥ ${THRESHOLD}%）`);
