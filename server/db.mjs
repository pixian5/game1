/* ===== 霓虹心事 · 账号服务数据库（SQLite，Node 内置 node:sqlite）=====
 * 为什么用 SQLite：容器里不装 MySQL/Postgres，单文件迁移+备份最简单；
 * 数据文件默认 server/data/game.db（已 gitignore），容器重建前用 server/backup_db.sh 导出。
 */
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { DB_PATH } from './config.mjs';

export function nowIso(){ return new Date().toISOString(); }
export function uuid(){ return crypto.randomUUID(); }

export function openDb(file = DB_PATH){
  if(file !== ':memory:'){
    fs.mkdirSync(path.dirname(file), { recursive: true });
  }
  const db = new DatabaseSync(file);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA busy_timeout = 5000;');
  migrate(db);
  return db;
}

/* 表结构保持最小但完整：
 * users        账号本体（密码与找回码均为 scrypt 哈希，绝不存明文）
 * sessions     会话（只存 token 的 SHA-256，泄库也无法直接登录）
 * saves        云存档（整包 4 槽 JSON，revision 用于冲突检测）
 * audit_log    安全/操作审计（保留 90 天，定时清理）
 */
function migrate(db){
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      username_lower TEXT NOT NULL UNIQUE,
      nickname TEXT NOT NULL,
      pwd_hash TEXT NOT NULL,
      pwd_salt TEXT NOT NULL,
      recovery_hash TEXT,
      recovery_salt TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_login_at TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      last_seen_at TEXT NOT NULL,
      ua TEXT,
      ip TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

    CREATE TABLE IF NOT EXISTS saves (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      data TEXT NOT NULL,
      bytes INTEGER NOT NULL,
      revision INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL,
      client_updated_at TEXT,
      device TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      action TEXT NOT NULL,
      detail TEXT,
      ip TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_log(created_at);
  `);
}

export function createStore(db){
  const stmt = {
    insertUser: db.prepare(`INSERT INTO users
      (id, username, username_lower, nickname, pwd_hash, pwd_salt, recovery_hash, recovery_salt, created_at, updated_at, last_login_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`),
    userByLower: db.prepare('SELECT * FROM users WHERE username_lower = ?'),
    userById: db.prepare('SELECT * FROM users WHERE id = ?'),
    updateLogin: db.prepare('UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?'),
    updateProfile: db.prepare('UPDATE users SET nickname = ?, updated_at = ? WHERE id = ?'),
    updatePassword: db.prepare('UPDATE users SET pwd_hash = ?, pwd_salt = ?, updated_at = ? WHERE id = ?'),
    updateRecovery: db.prepare('UPDATE users SET recovery_hash = ?, recovery_salt = ?, updated_at = ? WHERE id = ?'),
    deleteUser: db.prepare('DELETE FROM users WHERE id = ?'),
    countUsers: db.prepare('SELECT COUNT(*) AS n FROM users'),

    insertSession: db.prepare(`INSERT INTO sessions
      (id, user_id, token_hash, created_at, expires_at, last_seen_at, ua, ip)
      VALUES (?,?,?,?,?,?,?,?)`),
    sessionByToken: db.prepare('SELECT * FROM sessions WHERE token_hash = ?'),
    touchSession: db.prepare('UPDATE sessions SET last_seen_at = ? WHERE id = ?'),
    deleteSession: db.prepare('DELETE FROM sessions WHERE id = ?'),
    deleteUserSessions: db.prepare('DELETE FROM sessions WHERE user_id = ?'),
    deleteOtherSessions: db.prepare('DELETE FROM sessions WHERE user_id = ? AND id <> ?'),
    sessionsByUser: db.prepare('SELECT * FROM sessions WHERE user_id = ? AND expires_at > ? ORDER BY last_seen_at DESC'),
    countSessions: db.prepare('SELECT COUNT(*) AS n FROM sessions WHERE user_id = ?'),
    oldestSessions: db.prepare('SELECT id FROM sessions WHERE user_id = ? ORDER BY created_at ASC LIMIT ?'),
    cleanupSessions: db.prepare('DELETE FROM sessions WHERE expires_at <= ?'),

    saveByUser: db.prepare('SELECT * FROM saves WHERE user_id = ?'),
    upsertSave: db.prepare(`INSERT INTO saves (user_id, data, bytes, revision, updated_at, client_updated_at, device)
      VALUES (?,?,?,?,?,?,?)
      ON CONFLICT(user_id) DO UPDATE SET
        data = excluded.data, bytes = excluded.bytes, revision = excluded.revision,
        updated_at = excluded.updated_at, client_updated_at = excluded.client_updated_at, device = excluded.device`),
    deleteSave: db.prepare('DELETE FROM saves WHERE user_id = ?'),

    audit: db.prepare('INSERT INTO audit_log (user_id, action, detail, ip, created_at) VALUES (?,?,?,?,?)'),
    cleanupAudit: db.prepare('DELETE FROM audit_log WHERE created_at < ?'),
    recentAudit: db.prepare('SELECT * FROM audit_log WHERE user_id = ? ORDER BY id DESC LIMIT ?'),
    deleteAuditForUser: db.prepare('DELETE FROM audit_log WHERE user_id = ?')
  };

  return {
    db,
    insertUser(user){ stmt.insertUser.run(user.id, user.username, user.usernameLower, user.nickname,
      user.pwdHash, user.pwdSalt, user.recoveryHash, user.recoverySalt, user.createdAt, user.updatedAt, null); },
    userByUsername(name){ return stmt.userByLower.get(String(name || '').trim().toLowerCase()) || null; },
    userById(id){ return stmt.userById.get(id) || null; },
    countUsers(){ return Number(stmt.countUsers.get()?.n || 0); },
    touchLogin(id, at = nowIso()){ stmt.updateLogin.run(at, at, id); },
    updateProfile(id, nickname, at = nowIso()){ stmt.updateProfile.run(nickname, at, id); },
    updatePassword(id, hash, salt, at = nowIso()){ stmt.updatePassword.run(hash, salt, at, id); },
    updateRecovery(id, hash, salt, at = nowIso()){ stmt.updateRecovery.run(hash, salt, at, id); },
    deleteUser(id){ stmt.deleteUser.run(id); },
    deleteAuditForUser(id){ stmt.deleteAuditForUser.run(id); },

    insertSession(s){ stmt.insertSession.run(s.id, s.userId, s.tokenHash, s.createdAt, s.expiresAt, s.createdAt, s.ua, s.ip); },
    sessionByToken(hash){ return stmt.sessionByToken.get(hash) || null; },
    touchSession(id, at = nowIso()){ stmt.touchSession.run(at, id); },
    deleteSession(id){ stmt.deleteSession.run(id); },
    deleteUserSessions(userId){ stmt.deleteUserSessions.run(userId); },
    deleteOtherSessions(userId, keepId){ stmt.deleteOtherSessions.run(userId, keepId); },
    sessionsByUser(userId){ return stmt.sessionsByUser.all(userId, nowIso()); },
    countSessions(userId){ return Number(stmt.countSessions.get(userId)?.n || 0); },
    oldestSessions(userId, limit){ return stmt.oldestSessions.all(userId, limit).map(r => r.id); },
    cleanupSessions(at = nowIso()){ stmt.cleanupSessions.run(at); },

    saveByUser(userId){ return stmt.saveByUser.get(userId) || null; },
    upsertSave(userId, data, bytes, revision, updatedAt, clientUpdatedAt, device){
      stmt.upsertSave.run(userId, data, bytes, revision, updatedAt, clientUpdatedAt, device);
    },
    deleteSave(userId){ stmt.deleteSave.run(userId); },

    audit(userId, action, detail, ip){ stmt.audit.run(userId || null, action, detail || null, ip || null, nowIso()); },
    cleanupAudit(days = 90){ const cutoff = new Date(Date.now() - days * 86400000).toISOString(); stmt.cleanupAudit.run(cutoff); },
    recentAudit(userId, limit = 20){ return stmt.recentAudit.all(userId, limit); }
  };
}
