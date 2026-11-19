/* ===== 霓虹心事 · 账号服务配置 =====
 * 所有可调参数集中在此；全部支持环境变量覆盖，方便容器/本机/测试三套环境共用一份代码。
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PORT = Number(process.env.NH_PORT || process.env.PORT || 8095);
// 默认监听 0.0.0.0：容器内需要被网关/端口代理访问；本机调试可传 NH_HOST=127.0.0.1
export const HOST = process.env.NH_HOST || '0.0.0.0';
export const DB_PATH = process.env.NH_DB || path.join(ROOT, 'server', 'data', 'game.db');
export const COOKIE_NAME = process.env.NH_COOKIE_NAME || 'nh_session';
export const SESSION_TTL_MS = Number(process.env.NH_SESSION_TTL_DAYS || 30) * 24 * 60 * 60 * 1000;
export const MAX_JSON_BYTES = Number(process.env.NH_MAX_JSON_BYTES || 2 * 1024 * 1024);
// 与前端 PhoneEngine.MAX_SAVE_BYTES 对齐（4 槽合计）
export const MAX_SAVE_BYTES = Number(process.env.NH_MAX_SAVE_BYTES || 1_500_000);
export const SECURE_COOKIE = process.env.NH_SECURE_COOKIE === '1';
// 静态文件根：默认项目根；部署到独立目录时可用 NH_SITE_ROOT 指向 dist
export const SITE_ROOT = process.env.NH_SITE_ROOT || ROOT;
export const APP_VERSION_FILE = path.join(SITE_ROOT, 'VERSION');
