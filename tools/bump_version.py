#!/usr/bin/env python3
# ===== 一键发版：版本号五处同步 =====
# 用法：python3 tools/bump_version.py          # 0.0.1 递增（满十进一）
#       python3 tools/bump_version.py 0.3.0    # 直接指定目标版本
# 同步范围：VERSION / package.json / package-lock.json(2处) / index.html(标题+meta+全部?v=) / sw.js CACHE_VERSION
# 完成后自动跑 check:version 验证。
import json
import re
import subprocess
import sys
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)


def bump(cur: str) -> str:
    major, minor, patch = (int(x) for x in cur.split('.'))
    patch += 1
    if patch >= 10:
        patch = 0
        minor += 1
    if minor >= 10:
        minor = 0
        major += 1
    return f'{major}.{minor}.{patch}'


def read(p):
    with open(p, encoding='utf-8') as f:
        return f.read()


def write(p, s):
    with open(p, 'w', encoding='utf-8') as f:
        f.write(s)


cur = read('VERSION').strip()
new = sys.argv[1] if len(sys.argv) > 1 else bump(cur)
assert re.fullmatch(r'\d+\.\d+\.\d+', new), f'非法版本号: {new}'
print(f'{cur} → {new}')

# 1) VERSION
write('VERSION', new)

# 2) package.json / package-lock.json
pkg = json.loads(read('package.json'))
pkg['version'] = new
write('package.json', json.dumps(pkg, ensure_ascii=False, indent=2) + '\n')
lock = json.loads(read('package-lock.json'))
lock['version'] = new
if lock.get('packages', {}).get(''):
    lock['packages']['']['version'] = new
write('package-lock.json', json.dumps(lock, ensure_ascii=False, indent=2) + '\n')

# 3) index.html：标题、meta、全部 ?v=
html = read('index.html')
html = html.replace(f'?v={cur}', f'?v={new}')
html = html.replace(f'· v{cur}<', f'· v{new}<')
html = html.replace(f'content="v{cur}"', f'content="v{new}"')
write('index.html', html)

# 4) sw.js 缓存版本
sw = read('sw.js')
sw = sw.replace(f'neon-heart-v{cur}', f'neon-heart-v{new}')
write('sw.js', sw)

# 5) 验证
r = subprocess.run(['node', 'check_version.js'], capture_output=True, text=True)
print(r.stdout.strip())
if r.returncode != 0:
    print(r.stderr.strip())
    sys.exit(1)
print(f'发版就绪：v{new}（记得 git commit + bash deploy.sh）')
