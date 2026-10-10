#!/usr/bin/env python3
# ===== 霓虹心事 · PWA 图标生成 =====
# 绘制「霓虹心形」图标：深色渐变底 + 粉紫霓虹心 + 辉光，输出 assets/icons/ 多尺寸 PNG
# 重新生成：python3 tools/generate_icons.py
import os
import math
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'icons')
os.makedirs(OUT, exist_ok=True)

S = 1024


def heart_points(cx, cy, size, steps=240):
    """心形参数曲线（经典隐式方程的参数化近似）"""
    pts = []
    for i in range(steps):
        t = i / steps * 2 * math.pi
        x = 16 * math.sin(t) ** 3
        y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * cos3(t) - cos4(t)
        pts.append((cx + x * size, cy - y * size))
    return pts


def cos3(t):
    return math.cos(3 * t)


def cos4(t):
    return math.cos(4 * t)


# 背景：对角深色渐变 + 双色辉光
bg = Image.new('RGB', (S, S))
px = bg.load()
for y in range(S):
    for x in range(S):
        t = (x / S + y / S) / 2
        r = int(26 + (58 - 26) * t)
        g = int(10 + (20 - 10) * t)
        b = int(46 + (74 - 46) * t)
        px[x, y] = (r, g, b)

glow1 = Image.new('RGB', (S, S), (0, 0, 0))
d = ImageDraw.Draw(glow1)
d.ellipse([S * 0.05, S * 0.1, S * 0.75, S * 0.8], fill=(122, 40, 90))
glow1 = glow1.filter(ImageFilter.GaussianBlur(180))
bg = Image.blend(bg, Image.composite(glow1, bg, glow1.convert('L')), 0.75)

glow2 = Image.new('RGB', (S, S), (0, 0, 0))
d = ImageDraw.Draw(glow2)
d.ellipse([S * 0.45, S * 0.4, S * 1.0, S * 0.95], fill=(60, 40, 130))
glow2 = glow2.filter(ImageFilter.GaussianBlur(170))
bg = Image.blend(bg, Image.composite(glow2, bg, glow2.convert('L')), 0.75)

cx, cy = S / 2, S * 0.49
size = S * 0.029

# 多层辉光心（由大到小、透明度递增模拟霓虹灯管）
for r_frac, width, color in [(1.9, 60, (255, 95, 168)), (1.45, 42, (255, 95, 168)), (1.0, 22, (255, 160, 210))]:
    glow = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    pts = heart_points(cx, cy, size * r_frac)
    gd.line(pts + [pts[0]], fill=color + (140,), width=width, joint='curve')
    glow = glow.filter(ImageFilter.GaussianBlur(width // 2))
    bg.paste(glow, (0, 0), glow)

# 主心形线条（霓虹灯管）
main = Image.new('RGBA', (S, S), (0, 0, 0, 0))
md = ImageDraw.Draw(main)
pts = heart_points(cx, cy, size)
md.line(pts + [pts[0]], fill=(255, 130, 190, 255), width=26, joint='curve')
main = main.filter(ImageFilter.GaussianBlur(1.2))
bg.paste(main, (0, 0), main)

# 心内渐隐光晕
inner = Image.new('RGBA', (S, S), (0, 0, 0, 0))
idr = ImageDraw.Draw(inner)
idr.polygon(heart_points(cx, cy, size * 0.92), fill=(255, 95, 168, 60))
inner = inner.filter(ImageFilter.GaussianBlur(50))
bg.paste(inner, (0, 0), inner)

master_path = os.path.join(OUT, 'icon-1024.png')
bg.save(master_path, 'PNG')

for size in [512, 192, 180]:
    img = bg.resize((size, size), Image.LANCZOS)
    p = os.path.join(OUT, f'icon-{size}.png')
    img.save(p, 'PNG', optimize=True)
    print(f'✓ {p}')
print('图标生成完成')
