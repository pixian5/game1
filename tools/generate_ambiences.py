#!/usr/bin/env python3
# ===== 霓虹心事 · 氛围壁纸生成器 =====
# 生成 3 张氛围纹理（雨天雾感 / 夜晚灯海 / 不安暗流），叠加在主题壁纸之上。
# 由 story/17_hints_ambiences.js 的 layerImage / layerBlend 驱动，引擎在 ambience
# 切换时把纹理合成进 --wallpaper-1（见 ui/18 的 composeWallpaper）。
# 输出 assets/ambiences/<id>.jpg（单张目标 <150KB）。
# 重新生成：python3 tools/generate_ambiences.py
import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'ambiences')
os.makedirs(OUT, exist_ok=True)

# 氛围纹理是模糊质感，用半分辨率生成（cover 放大几乎无损），换取体积下降约 4 倍
W, H = 585, 1266

PINK = (255, 95, 168)
PURPLE = (122, 92, 255)
CYAN = (57, 214, 255)
AMBER = (255, 190, 110)


def vgrad(stops):
    """垂直多段渐变：先画 1×H 渐变条再放大，避免逐像素大循环"""
    col = Image.new('RGB', (1, H))
    px = col.load()
    pos = [p for p, _ in stops]
    for y in range(H):
        t = y / (H - 1)
        i = 0
        while i < len(pos) - 2 and t > pos[i + 1]:
            i += 1
        a, b = stops[i][1], stops[i + 1][1]
        span = max(1e-6, pos[i + 1] - pos[i])
        local = min(1.0, max(0.0, (t - pos[i]) / span))
        px[0, y] = (int(a[0] + (b[0] - a[0]) * local),
                    int(a[1] + (b[1] - a[1]) * local),
                    int(a[2] + (b[2] - a[2]) * local))
    return col.resize((W, H), Image.BILINEAR)


def soft_glow(img, cx, cy, r, color, strength=0.6):
    """径向柔光斑（大模糊），用于雾气/光晕"""
    layer = Image.new('RGB', (W, H), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    rx, ry = int(r * W), int(r * W)
    d.ellipse([int(cx * W) - rx, int(cy * H) - ry,
               int(cx * W) + rx, int(cy * H) + ry], fill=color)
    layer = layer.filter(ImageFilter.GaussianBlur(max(1, int(r * W * 0.5))))
    arr = layer.point(lambda v: int(v * strength))
    return ImageChops.screen(img, arr)


def add_rain(img, count=520, seed=11):
    """斜向雨丝（亮线），screen 叠加"""
    layer = Image.new('RGB', (W, H), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    rng = random.Random(seed)
    for _ in range(count):
        x = rng.randint(int(-W * 0.25), W)
        y = rng.randint(0, H)
        ln = rng.randint(int(H * 0.015), int(H * 0.075))
        x2, y2 = x - ln * 0.22, y + ln
        v = rng.randint(150, 235)
        d.line([x, y, x2, y2], fill=(v, v, min(255, v + 15)),
               width=rng.choice([1, 1, 1, 2]))
    layer = layer.filter(ImageFilter.GaussianBlur(0.5))
    return ImageChops.screen(img, layer)


def add_bokeh(img, count, seed, palette, xr=(0.04, 0.96), yr=(0.45, 0.93),
              rr=(0.005, 0.028), blur=6, ring=False):
    """灯海光点（散景），screen 叠加"""
    layer = Image.new('RGB', (W, H), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    rng = random.Random(seed)
    for _ in range(count):
        x = rng.uniform(*xr) * W
        y = rng.uniform(*yr) * H
        r = rng.uniform(*rr) * W
        c = rng.choice(palette)
        inten = rng.uniform(0.45, 1.0)
        col = tuple(int(v * inten) for v in c)
        d.ellipse([x - r, y - r, x + r, y + r], fill=col)
        if ring:
            d.ellipse([x - r, y - r, x + r, y + r], outline=col, width=2)
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    return ImageChops.screen(img, layer)


def add_stars(img, count, seed, ymax=0.42):
    layer = Image.new('RGB', (W, H), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    rng = random.Random(seed)
    for _ in range(count):
        x, y = rng.randint(0, W - 1), rng.randint(0, int(H * ymax))
        s = rng.choice([1, 1, 1, 2])
        v = rng.randint(90, 210)
        d.ellipse([x, y, x + s, y + s], fill=(v, v, min(255, v + 25)))
    layer = layer.filter(ImageFilter.GaussianBlur(0.5))
    return ImageChops.screen(img, layer)


def add_undertow(img, seed=7, bands=6):
    """不安暗流：扭曲的暗色波浪带（模糊后压暗），用于叠加出流动的阴郁质感"""
    layer = Image.new('RGB', (W, H), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    rng = random.Random(seed)
    for i in range(bands):
        base_y = rng.uniform(0.08, 0.92) * H
        amp = rng.uniform(0.02, 0.07) * H
        freq = rng.uniform(1.2, 3.2)
        phase = rng.uniform(0, math.tau)
        pts = [(x, base_y + math.sin(x / W * freq * math.tau + phase) * amp)
               for x in range(0, W + 1, 6)]
        v = rng.randint(35, 90)
        d.line(pts, fill=(v, int(v * 0.8), v), width=rng.randint(6, 22))
    layer = layer.filter(ImageFilter.GaussianBlur(int(W * 0.02)))
    return Image.blend(img, ImageChops.subtract(img, layer), 0.5)


def add_vignette(img, strength=0.85):
    mask = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(mask)
    d.ellipse([-int(W * 0.25), -int(H * 0.15), int(W * 1.25), int(H * 1.15)], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=int(W * 0.28)))
    dark = Image.new('RGB', (W, H), (2, 2, 6))
    out = Image.composite(img, dark, mask)
    return Image.blend(img, out, strength)


def add_grain(img, amount=6, seed=3):
    noise = Image.effect_noise((W, H), 26).convert('L')
    base = img.load()
    npx = noise.load()
    for y in range(0, H, 2):
        for x in range(0, W, 2):
            r, g, b = base[x, y]
            off = (npx[x, y] - 128) // amount
            base[x, y] = (max(0, min(255, r + off)),
                          max(0, min(255, g + off)),
                          max(0, min(255, b + off)))
    return img


# ===== 雨天雾感：中灰偏亮的冷色雾底 + 雨丝，供 soft-light 叠加（提亮并加湿冷） =====
def build_rainy():
    img = vgrad([(0.0, (96, 110, 132)), (0.45, (128, 142, 162)),
                 (0.75, (108, 122, 142)), (1.0, (74, 86, 104))])
    img = soft_glow(img, 0.30, 0.22, 0.55, (150, 168, 190), 0.45)
    img = soft_glow(img, 0.72, 0.58, 0.50, (120, 138, 162), 0.40)
    img = soft_glow(img, 0.50, 0.88, 0.45, (100, 118, 142), 0.35)
    img = add_rain(img)
    img = add_vignette(img, 0.7)
    img = add_grain(img, 5)
    return img


# ===== 夜晚灯海：近黑底 + 城市散景光点 + 天际线灯带，供 screen 叠加（点亮灯点） =====
def build_night():
    img = vgrad([(0.0, (8, 9, 22)), (0.5, (16, 16, 34)), (1.0, (5, 5, 14))])
    img = add_stars(img, 240, seed=21, ymax=0.40)
    img = add_bokeh(img, 150, 31, [PINK, PURPLE, CYAN, AMBER],
                    yr=(0.42, 0.90), rr=(0.004, 0.024), blur=7)
    img = add_bokeh(img, 60, 32, [AMBER, (255, 150, 90), CYAN],
                    yr=(0.60, 0.80), rr=(0.006, 0.032), blur=9, ring=True)
    # 地平线灯带（城市轮廓切线）
    band = Image.new('RGB', (W, H), (0, 0, 0))
    bd = ImageDraw.Draw(band)
    rng = random.Random(33)
    base = int(H * 0.80)
    x = 0
    while x < W:
        w = rng.randint(20, 70)
        h = rng.randint(10, int(H * 0.06))
        bd.rectangle([x, base - h, x + w, base], fill=(30, 30, 60))
        x += w + rng.randint(6, 24)
    band = band.filter(ImageFilter.GaussianBlur(int(W * 0.004)))
    img = ImageChops.screen(img, band.point(lambda v: v))
    img = add_vignette(img, 0.8)
    img = add_grain(img, 4)
    return img


# ===== 不安暗流：暗紫红中低灰底 + 扭曲暗纹 + 噪点，供 soft-light 叠加（压暗偏紫红） =====
def build_anxious():
    img = vgrad([(0.0, (92, 66, 96)), (0.4, (110, 72, 104)),
                 (0.75, (84, 58, 88)), (1.0, (56, 38, 62))])
    img = soft_glow(img, 0.35, 0.30, 0.5, (150, 90, 130), 0.35)
    img = soft_glow(img, 0.68, 0.72, 0.5, (80, 50, 90), 0.4)
    img = add_undertow(img)
    img = add_vignette(img, 0.9)
    img = add_grain(img, 7)
    return img


BUILDERS = {
    'rainy': build_rainy,
    'night': build_night,
    'anxious': build_anxious,
}

for amb_id, builder in BUILDERS.items():
    img = builder()
    img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
    path = os.path.join(OUT, f'{amb_id}.jpg')
    img.save(path, 'JPEG', quality=82, optimize=True)
    print(f'✓ {path} ({os.path.getsize(path)//1024} KB)')
print('氛围壁纸生成完成')