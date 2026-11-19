/* 账号数据库备份：用 SQLite 的 VACUUM INTO 生成一致性快照（含 WAL 已提交数据）。
 * 用法：node server/backup_db.mjs [输出路径]
 * 默认输出：server/data/backups/game-YYYYMMDD-HHMMSS.db
 */
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { DB_PATH, ROOT } from './config.mjs';

const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-');
const out = process.argv[2] || path.join(ROOT, 'server', 'data', 'backups', `game-${stamp}.db`);
fs.mkdirSync(path.dirname(out), { recursive: true });
if (fs.existsSync(out)) {
  console.error(`[backup] 目标已存在，拒绝覆盖：${out}`);
  process.exit(1);
}
if (!fs.existsSync(DB_PATH)) {
  console.error(`[backup] 数据库不存在：${DB_PATH}`);
  process.exit(1);
}
const db = new DatabaseSync(DB_PATH);
try {
  // 单引号转义，避免路径中的特殊字符破坏 SQL
  db.exec(`VACUUM INTO '${out.replace(/'/g, "''")}'`);
} finally {
  db.close();
}
const bytes = fs.statSync(out).size;
console.log(`[backup] ${DB_PATH} -> ${out} (${bytes} bytes)`);
