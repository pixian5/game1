#!/usr/bin/env bash
# ===== 霓虹心事 · 一键部署到自有服务器 =====
# 目标：https://oh.sbbz.tech:9443 （nginx 静态托管，证书 acme.sh DNS-01 自动续期）
# 服务器：root@oh.sbbz.tech（SSH 端口 2424；本机代理会劫持 DNS，需用真实 IP 连接）
# 用法：bash deploy.sh   （部署前请先跑通 npm run test:all）
set -euo pipefail
cd "$(dirname "$0")"

HOST="root@oh.sbbz.tech"
PORT="2424"
# 本机 DNS 可能被代理软件劫持为 fake-ip，用 DoH 解析真实公网 IP
REAL_IP=$(curl -s "https://dns.alidns.com/resolve?name=oh.sbbz.tech&type=A" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print([a['data'] for a in d.get('Answer',[]) if a['type']==1][0])")
SSH_OPTS=(-i "$HOME/.ssh/game1_deploy" -p "$PORT" -o StrictHostKeyChecking=no -o ConnectTimeout=10)
[ -f "$HOME/.ssh/game1_deploy" ] || SSH_OPTS=(-i /Users/x/ed25519 -p "$PORT" -o StrictHostKeyChecking=no -o ConnectTimeout=10)
TARGET="$HOST"
if [ "$(dig +short oh.sbbz.tech | head -1)" != "$REAL_IP" ]; then
  TARGET="root@$REAL_IP"   # DNS 被劫持时直连真实 IP
fi
echo "==> 部署目标: $TARGET (端口 $PORT)"

VERSION=$(cat VERSION)
echo "==> 版本 v$VERSION"

# v0.4.7: 发布构建——52 脚本合并为单 bundle（线上首载 18s→目标 <3s），从 dist/ 部署
node tools/build_bundle.mjs

# 部署清单（v0.4.7 起从 dist/ 部署：bundle 合并产物 + 静态资产，与 dist/sw.js 预缓存一致）
rsync -az --delete \
  --rsync-path="mkdir -p /var/www/neon-heart && rsync" \
  -e "ssh ${SSH_OPTS[*]}" \
  index.html bundle.js sw.js style.css manifest.json privacy.html robots.txt sitemap.xml \
  i18n assets \
  "$TARGET:/var/www/neon-heart/"

echo "==> 验证"
ssh "${SSH_OPTS[@]}" "$TARGET" "curl -sk https://127.0.0.1:9443/ | grep -o '<title>[^<]*</title>'"
echo "==> 部署完成: https://oh.sbbz.tech:9443/"
