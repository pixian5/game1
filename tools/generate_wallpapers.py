#!/usr/bin/env python3
# ===== 霓虹心事 · 壁纸生成器 =====
# 用 PIL 程序化绘制 6 套主题壁纸（多层辉光 + 噪点 + 暗角），输出 assets/wallpapers/<id>.jpg
# 重新生成：python3 tools/generate_wallpapers.py
import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'wallpapers')
os.makedirs(OUT, exist_ok=True)

W, H = 1170, 2532  # iPhone 分辨率级别的竖屏

# 每主题：底色渐变（上->下）、辉光斑点（cx, cy, r, 颜色, 强度）、霓虹垂直光带（cx, 宽, 颜色, 强度）
THEMES = {
    'default': {
        'stops': [(0.0, (26, 10, 46)), (0.4, (42, 15, 74)), (1.0, (10, 7, 18))],
        'glows': [(0.25, 0.18, 0.55, (255, 95, 168), 0.55),
                  (0.75, 0.42, 0.45, (122, 92, 255), 0.5),
                  (0.45, 0.78, 0.5, (57, 214, 255), 0.28)],
        'bands': [(0.10, 0.045, (255, 95, 168), 0.5), (0.90, 0.04, (57, 214, 255), 0.42)],
    },
    'starry': {
        'stops': [(0.0, (10, 10, 42)), (0.5, (26, 26, 74)), (1.0, (5, 5, 24))],
        'glows': [(0.30, 0.20, 0.5, (122, 92, 255), 0.55),
                  (0.70, 0.60, 0.5, (90, 42, 74), 0.5),
                  (0.50, 0.90, 0.45, (58, 42, 106), 0.35)],
        'stars': 260,
        'bands': [(0.22, 0.04, (122, 92, 255), 0.4)],
    },
    'sea': {
        'stops': [(0.0, (10, 42, 58)), (0.4, (26, 74, 90)), (1.0, (5, 15, 24))],
        'glows': [(0.50, 0.30, 0.55, (74, 222, 128), 0.4),
                  (0.30, 0.62, 0.5, (57, 214, 255), 0.42),
                  (0.72, 0.88, 0.45, (26, 74, 90), 0.4)],
        'bands': [(0.86, 0.045, (74, 222, 128), 0.4)],
    },
    'sunset': {
        'stops': [(0.0, (42, 26, 10)), (0.3, (106, 58, 26)), (0.7, (251, 191, 36)), (1.0, (255, 95, 168))],
        'glows': [(0.50, 0.66, 0.5, (255, 200, 90), 0.55),
                  (0.28, 0.30, 0.45, (106, 58, 26), 0.45)],
        'bands': [(0.72, 0.04, (255, 200, 90), 0.5)],
    },
    'ink': {
        'stops': [(0.0, (26, 26, 26)), (0.5, (58, 58, 58)), (1.0, (10, 10, 10))],
        'glows': [(0.35, 0.25, 0.5, (229, 229, 229), 0.22),
                  (0.65, 0.70, 0.55, (120, 120, 130), 0.25)],
    },
    'rose': {
        'stops': [(0.0, (42, 10, 26)), (0.4, (90, 26, 58)), (1.0, (10, 5, 16))],
        'glows': [(0.30, 0.22, 0.5, (255, 95, 168), 0.5),
                  (0.70, 0.55, 0.5, (180, 40, 100), 0.45),
                  (0.45, 0.85, 0.45, (90, 26, 58), 0.4)],
        'bands': [(0.32, 0.045, (255, 95, 168), 0.42)],
    },
}


def diag_gradient(stops):
    """对角线多段渐变"""
    img = Image.new('RGB', (W, H))
    px = img.load()
    c0, c1 = stops[0][1], stops[-1][1]
    seg = len(stops) - 1
    for y in range(H):
        for x in range(0, W, 1):
            t = (x / W + y / H) / 2  # 对角进度
            seg_i = min(int(t * seg), seg - 1)
            local = t * seg - seg_i
            a, b = stops[seg_i][1], stops[seg_i + 1][1]
            r = int(a[0] + (b[0] - a[0]) * local)
            g = int(a[1] + (b[1] - a[1]) * local)
            bl = int(a[2] + (b[2] - a[2]) * local)
            px[x, y] = (r, g, bl)
    return img


def add_glow(img, cx, cy, r, color, strength):
    """径向辉光斑点：小图高斯模糊后叠加"""
    layer = Image.new('RGB', (W, H), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    rx, ry = int(r * W), int(r * W)
    d.ellipse([int(cx * W) - rx, int(cy * H) - ry, int(cx * W) + rx, int(cy * H) + ry],
              fill=color)
    layer = layer.filter(ImageFilter.GaussianBlur(radius=int(r * W * 0.45)))
    return Image.blend(img, Image.composite(layer, img, layer.convert('L').point(lambda v: int(v * strength))), 0.9)


def add_lightband(img, cx, width, color, strength):
    """v0.2.4: 霓虹垂直光带——全高 soft 光柱，加强"霓虹城市"主题感"""
    layer = Image.new('RGB', (W, H), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    half = int(width * W)
    cx_px = int(cx * W)
    d.rectangle([cx_px - half, 0, cx_px + half, H], fill=color)
    layer = layer.filter(ImageFilter.GaussianBlur(radius=int(W * width * 0.9)))
    return Image.blend(img, Image.composite(layer, img, layer.convert('L').point(lambda v: int(v * strength))), 0.9)


def add_vignette(img):
    mask = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(mask)
    d.ellipse([-int(W * 0.25), -int(H * 0.15), int(W * 1.25), int(H * 1.15)], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=int(W * 0.28)))
    dark = Image.new('RGB', (W, H), (2, 2, 6))
    return Image.composite(img, dark, mask)


def add_grain(img, amount=6):
    noise = Image.effect_noise((W, H), 28).convert('L')
    base = img.load()
    npx = noise.load()
    for y in range(0, H, 2):
        for x in range(0, W, 2):
            r, g, b = base[x, y]
            off = (npx[x, y] - 128) // amount
            base[x, y] = (max(0, min(255, r + off)), max(0, min(255, g + off)), max(0, min(255, b + off)))
    return img


def add_stars(img, count):
    d = ImageDraw.Draw(img)
    rnd = random.Random(42)
    for _ in range(count):
        x, y = rnd.randint(0, W - 1), rnd.randint(0, int(H * 0.7))
        s = rnd.choice([1, 1, 1, 2])
        a = rnd.randint(120, 220)
        d.ellipse([x, y, x + s, y + s], fill=(a, a, a + min(35, 255 - a)))
    return img


for theme_id, cfg in THEMES.items():
    img = diag_gradient(cfg['stops'])
    for cx, cy, r, color, strength in cfg['glows']:
        img = add_glow(img, cx, cy, r, color, strength)
    for band in cfg.get('bands', []):
        img = add_lightband(img, *band)
    if cfg.get('stars'):
        img = add_stars(img, cfg['stars'])
    img = add_vignette(img)
    img = add_grain(img)
    img = img.filter(ImageFilter.GaussianBlur(radius=0.6))
    path = os.path.join(OUT, f'{theme_id}.jpg')
    img.save(path, 'JPEG', quality=82, optimize=True)
    print(f'✓ {path} ({os.path.getsize(path)//1024} KB)')
print('壁纸生成完成')
