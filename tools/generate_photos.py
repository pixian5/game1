#!/usr/bin/env python3
# ===== 霓虹心事 · 相册照片生成器 =====
# 用 PIL 程序化绘制 5 张「霓虹城市」照片感素材：多层景深 + 辉光 + 光斑 + 噪点 + 暗角。
# 输出 assets/photos/<art>.jpg，供 ui/06 相册渲染（单张目标 <150KB）。
# 重新生成：/opt/homebrew/bin/python3.14 tools/generate_photos.py（需 Pillow + numpy）
import os
import math
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'photos')
os.makedirs(OUT, exist_ok=True)

S = 900
PINK = (255, 95, 168)
PURPLE = (122, 92, 255)
CYAN = (57, 214, 255)
GREEN = (74, 222, 128)
AMBER = (255, 190, 110)


def gradient(stops, w=S, h=S, diag=0.0):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    t = (xx / max(1, w - 1)) * diag + (yy / max(1, h - 1)) * (1 - diag)
    pos = np.array([p for p, _ in stops], dtype=np.float32)
    cols = np.array([c for _, c in stops], dtype=np.float32)
    out = np.empty((h, w, 3), dtype=np.float32)
    for ch in range(3):
        out[..., ch] = np.interp(t, pos, cols[:, ch])
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def glow(img, cx, cy, r, color, strength=0.8, softness=0.65):
    layer = Image.new('RGB', (S, S), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    for f, inten in ((1.0, 0.28), (0.62, 0.5), (0.30, 1.0)):
        rr = r * S * f
        c = tuple(int(v * inten) for v in color)
        d.ellipse([cx * S - rr, cy * S - rr, cx * S + rr, cy * S + rr], fill=c)
    layer = layer.filter(ImageFilter.GaussianBlur(max(1, int(r * S * softness))))
    arr = np.asarray(layer, dtype=np.float32) * strength
    layer = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    return ImageChops.screen(img, layer)


def stars(img, seed, count=150, ymax=0.55):
    rng = random.Random(seed)
    layer = Image.new('RGB', (S, S), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(count):
        x = rng.randint(0, S - 1)
        y = rng.randint(0, int(S * ymax))
        s = rng.choice([1, 1, 1, 2])
        v = rng.randint(90, 220)
        d.ellipse([x, y, x + s, y + s], fill=(v, v, min(255, v + 25)))
    layer = layer.filter(ImageFilter.GaussianBlur(0.4))
    return ImageChops.screen(img, layer)


def bokeh(img, seed, count, xr, yr, rr, palette, blur=4, ring=0.0):
    rng = random.Random(seed)
    layer = Image.new('RGB', (S, S), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(count):
        x = rng.uniform(*xr) * S
        y = rng.uniform(*yr) * S
        r = rng.uniform(*rr) * S
        inten = rng.uniform(0.16, 0.62)
        c = tuple(int(v * inten) for v in rng.choice(palette))
        d.ellipse([x - r, y - r, x + r, y + r], fill=c)
        if ring > 0:
            edge = tuple(min(255, int(v * (1 + ring * 0.3))) for v in c)
            d.ellipse([x - r * 0.94, y - r * 0.94, x + r * 0.94, y + r * 0.94],
                      outline=edge, width=max(1, int(r * 0.10)))
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    return ImageChops.screen(img, layer)


def chromatic(img, shift=1):
    arr = np.asarray(img, dtype=np.uint8)
    r = np.roll(arr[..., 0], -shift, axis=1)
    b = np.roll(arr[..., 2], shift, axis=1)
    return Image.fromarray(np.dstack([r, arr[..., 1], b]))


def film_grade(img, contrast=1.05, lift=0.014, sat=1.03):
    arr = np.asarray(img, dtype=np.float32) / 255.0
    arr = arr * (1 - lift) + lift
    arr = np.clip((arr - 0.5) * contrast + 0.5, 0, 1)
    arr = arr * arr * (3 - 2 * arr) * 0.22 + arr * 0.78
    luma = (arr @ np.array([0.299, 0.587, 0.114], dtype=np.float32))[..., None]
    arr = luma + (arr - luma) * sat
    return Image.fromarray(np.clip(arr * 255, 0, 255).astype(np.uint8))


def skyline(img, seed, base_y, hmin, hmax, body, windows, density=0.2, blur=0.0, glow_amt=0.0):
    rng = random.Random(seed)
    layer = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    gl = Image.new('RGB', (S, S), (0, 0, 0))
    gd = ImageDraw.Draw(gl)
    x = -30
    while x < S + 30:
        bw = rng.randint(int(S * 0.03), int(S * 0.09))
        bh = rng.randint(int(hmin * S), int(hmax * S))
        top = base_y - bh
        d.rectangle([x, top, x + bw, base_y], fill=body + (255,))
        if rng.random() < 0.22:
            ax = x + bw // 2
            d.rectangle([ax - 1, top - rng.randint(8, 26), ax + 1, top], fill=body + (255,))
        cols = max(1, (bw - 6) // 12)
        rows = max(1, (bh - 10) // 16)
        for row in range(rows):
            for col in range(cols):
                if rng.random() < density:
                    wx = x + 4 + col * 12
                    wy = top + 6 + row * 16
                    wc = rng.choice(windows)
                    d.rectangle([wx, wy, wx + rng.choice([2, 3, 4]), wy + rng.choice([2, 3])],
                                fill=wc + (rng.randint(100, 255),))
                    if glow_amt > 0:
                        gd.rectangle([wx - 1, wy - 1, wx + 5, wy + 5],
                                     fill=tuple(int(v * 0.32) for v in wc))
        x += bw + rng.randint(-3, 10)
    if blur > 0:
        layer = layer.filter(ImageFilter.GaussianBlur(blur))
    img = Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')
    if glow_amt > 0:
        g = gl.filter(ImageFilter.GaussianBlur(8))
        garr = np.asarray(g, dtype=np.float32) * glow_amt
        img = ImageChops.screen(img, Image.fromarray(np.clip(garr, 0, 255).astype(np.uint8)))
    return img


def light_trails(img, seed, y0, y1, count=16):
    rng = random.Random(seed)
    layer = Image.new('RGB', (S, S), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(count):
        y = rng.randint(y0, y1)
        x0 = rng.randint(-150, int(S * 0.3))
        x1 = rng.randint(int(S * 0.7), S + 150)
        w = rng.choice([1, 1, 2, 2, 3])
        inten = rng.uniform(0.3, 0.95)
        c = tuple(int(v * inten) for v in rng.choice([PINK, AMBER, CYAN, (255, 255, 255)]))
        d.line([x0, y, x1, y], fill=c, width=w)
    layer = layer.filter(ImageFilter.GaussianBlur(2.2))
    return ImageChops.screen(img, layer)


def glass_rain(img, seed, count=70):
    rng = random.Random(seed)
    layer = Image.new('RGB', (S, S), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(count):
        x = rng.randint(0, S)
        y = rng.randint(0, S)
        ln = rng.randint(10, 45)
        c = rng.choice([(40, 40, 60), (60, 40, 80), (30, 50, 70)])
        d.line([x, y, x + rng.randint(-3, 3), y + ln], fill=c, width=1)
    layer = layer.filter(ImageFilter.GaussianBlur(0.8))
    return ImageChops.add(img, layer)


def bloom(img, threshold=165, radius=14, strength=0.4):
    arr = np.asarray(img, dtype=np.float32)
    lum = arr.max(axis=2)
    m = np.clip((lum - threshold) / (255 - threshold), 0, 1) ** 1.5
    bright = arr * m[..., None]
    b = Image.fromarray(np.clip(bright, 0, 255).astype(np.uint8))
    b = b.filter(ImageFilter.GaussianBlur(radius))
    out = arr + np.asarray(b, dtype=np.float32) * strength
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def vignette(img, strength=0.55):
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
    dx = (xx - S / 2) / (S * 0.62)
    dy = (yy - S / 2) / (S * 0.62)
    d = np.sqrt(dx * dx + dy * dy)
    mask = np.clip(1 - strength * np.clip(d - 0.35, 0, None) ** 1.4, 0.12, 1)
    arr = np.asarray(img, dtype=np.float32) * mask[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def grain(img, seed, amount=5.0):
    rng = np.random.default_rng(seed)
    arr = np.asarray(img, dtype=np.float32)
    arr = arr + rng.normal(0, amount, (S, S, 1))
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def finish(img, seed, vig=0.55, grain_amt=5.0, bloom_amt=0.28, soft=0.35,
           contrast=1.05, lift=0.014, sat=1.03):
    img = bloom(img, strength=bloom_amt)
    if soft:
        img = img.filter(ImageFilter.GaussianBlur(soft))
    img = chromatic(img, 1)
    img = film_grade(img, contrast=contrast, lift=lift, sat=sat)
    img = vignette(img, vig)
    img = grain(img, seed, grain_amt)
    return img


def save(img, name):
    path = os.path.join(OUT, f'{name}.jpg')
    for q in range(86, 63, -2):
        img.save(path, 'JPEG', quality=q, optimize=True, progressive=True)
        if os.path.getsize(path) < 150 * 1024:
            break
    print(f'✓ {path} ({os.path.getsize(path) // 1024} KB, q={q})')


# ===== 1. 霓城夜景：出租车视角，高架灯流 =====
def scene_city():
    img = gradient([(0.0, (5, 3, 14)), (0.35, (14, 7, 32)), (0.55, (40, 12, 58)),
                    (0.62, (82, 24, 76)), (0.72, (10, 6, 18)), (1.0, (4, 3, 8))], diag=0.12)
    img = glow(img, 0.60, 0.60, 0.42, PINK, 0.38)
    img = glow(img, 0.25, 0.66, 0.50, CYAN, 0.20)
    img = stars(img, 101, 70, 0.45)
    img = skyline(img, 201, int(S * 0.585), 0.03, 0.10, (18, 14, 36),
                  [CYAN, (160, 150, 255), PINK], 0.16, blur=5, glow_amt=0.4)
    img = skyline(img, 202, int(S * 0.635), 0.06, 0.16, (11, 9, 24),
                  [PINK, AMBER, PURPLE], 0.22, blur=2.2, glow_amt=0.5)
    img = skyline(img, 203, int(S * 0.695), 0.05, 0.14, (6, 5, 14),
                  [PINK, CYAN, (255, 210, 150)], 0.24, blur=0.7, glow_amt=0.35)
    img = bokeh(img, 301, 150, (0.0, 1.0), (0.55, 0.72), (0.004, 0.016),
                [PINK, CYAN, AMBER, (180, 160, 255)], blur=5)
    img = bokeh(img, 302, 34, (0.0, 1.0), (0.60, 0.68), (0.014, 0.028),
                [PINK, CYAN, AMBER], blur=7)
    img = light_trails(img, 401, int(S * 0.74), int(S * 0.94), 20)
    # 车内仪表台：渐变剪影 + 纹理 + 边缘反光
    dash = gradient([(0.0, (14, 11, 20)), (0.55, (7, 6, 11)), (1.0, (2, 2, 5))])
    dmask = Image.new('L', (S, S), 0)
    ImageDraw.Draw(dmask).polygon([(0, S), (0, int(S * 0.905)), (int(S * 0.16), int(S * 0.872)),
                                   (int(S * 0.50), int(S * 0.892)), (int(S * 0.84), int(S * 0.878)),
                                   (S, int(S * 0.92)), (S, S)], fill=255)
    dmask = dmask.filter(ImageFilter.GaussianBlur(0.7))
    img = Image.composite(dash, img, dmask)
    d = ImageDraw.Draw(img, 'RGBA')
    d.line([(0, int(S * 0.905)), (int(S * 0.16), int(S * 0.872)),
            (int(S * 0.50), int(S * 0.892)), (int(S * 0.84), int(S * 0.878)),
            (S, int(S * 0.92))], fill=(88, 58, 112, 150), width=2)
    d.line([(0, int(S * 0.913)), (int(S * 0.16), int(S * 0.880)),
            (int(S * 0.50), int(S * 0.900)), (int(S * 0.84), int(S * 0.886)),
            (S, int(S * 0.928))], fill=(255, 95, 168, 38), width=3)
    # 仪表台反射的灯流
    img = light_trails(img, 402, int(S * 0.905), int(S * 0.945), 7)
    img = glass_rain(img, 501, 55)
    img = glow(img, 0.50, 0.605, 0.30, (255, 140, 170), 0.12)
    return finish(img, 601, vig=0.62, grain_amt=5.5, bloom_amt=0.34, soft=0.45,
                  contrast=1.07, lift=0.012, sat=1.06)


# ===== 2. 天台：栏杆与城市灯海 =====
def scene_rooftop():
    img = gradient([(0.0, (8, 6, 24)), (0.35, (20, 12, 48)), (0.60, (46, 20, 64)),
                    (0.71, (12, 8, 22)), (1.0, (5, 4, 10))], diag=0.05)
    img = glow(img, 0.78, 0.20, 0.30, (180, 190, 255), 0.32)
    img = glow(img, 0.30, 0.60, 0.40, PINK, 0.22)
    img = stars(img, 111, 130, 0.50)
    # 月亮（柔边 + 表面阴影）
    moon = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    md = ImageDraw.Draw(moon)
    mr = int(S * 0.038)
    mx, my = int(S * 0.79), int(S * 0.18)
    md.ellipse([mx - mr, my - mr, mx + mr, my + mr], fill=(228, 231, 255, 255))
    md.ellipse([mx - mr * 0.55, my - mr * 0.45, mx - mr * 0.05, my + mr * 0.1],
               fill=(196, 202, 236, 120))
    md.ellipse([mx + mr * 0.1, my + mr * 0.15, mx + mr * 0.55, my + mr * 0.55],
               fill=(190, 198, 232, 100))
    moon = moon.filter(ImageFilter.GaussianBlur(3.2))
    img = Image.alpha_composite(img.convert('RGBA'), moon).convert('RGB')
    img = glow(img, 0.79, 0.18, 0.10, (210, 220, 255), 0.25)
    img = skyline(img, 211, int(S * 0.63), 0.03, 0.10, (16, 13, 32),
                  [CYAN, PINK, (160, 150, 255)], 0.14, blur=5, glow_amt=0.35)
    img = skyline(img, 212, int(S * 0.67), 0.04, 0.12, (8, 7, 18),
                  [PINK, AMBER, CYAN], 0.18, blur=1.6, glow_amt=0.4)
    img = bokeh(img, 311, 190, (0.0, 1.0), (0.54, 0.68), (0.004, 0.017),
                [PINK, CYAN, AMBER, (190, 180, 255)], blur=5)
    img = bokeh(img, 316, 40, (0.0, 1.0), (0.56, 0.65), (0.018, 0.034),
                [PINK, CYAN, AMBER], blur=7)
    # 女儿墙
    layer = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rectangle([0, int(S * 0.72), S, int(S * 0.78)], fill=(12, 10, 20, 255))
    d.line([(0, int(S * 0.72)), (S, int(S * 0.72))], fill=(92, 70, 128, 180), width=2)
    img = Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')
    # 地面
    ground = gradient([(0.0, (28, 24, 36)), (0.45, (19, 16, 25)), (1.0, (6, 5, 10))])
    mask = Image.new('L', (S, S), 0)
    ImageDraw.Draw(mask).rectangle([0, int(S * 0.78), S, S], fill=255)
    img = Image.composite(ground, img, mask)
    # 混凝土纹理与污渍
    arr = np.asarray(img, dtype=np.float32)
    rng = np.random.default_rng(711)
    noise = rng.normal(0, 4.5, (S, S, 1))
    nmask = np.zeros((S, S, 1), dtype=np.float32)
    nmask[int(S * 0.72):] = 1
    arr = np.clip(arr + noise * nmask, 0, 255)
    img = Image.fromarray(arr.astype(np.uint8))
    d = ImageDraw.Draw(img, 'RGBA')
    for i in range(9):
        y = int(S * (0.80 + i * 0.021))
        d.line([(0, y), (S, y + random.Random(720 + i).randint(-3, 3))],
               fill=(70, 60, 82, random.Random(730 + i).randint(8, 20)), width=1)
    # 栏杆（前景，清晰）
    layer = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i in range(15):
        x = int(S * 0.02 + i * S * 0.068)
        d.rectangle([x, int(S * 0.50), x + int(S * 0.006), int(S * 0.79)], fill=(5, 4, 10, 255))
        d.line([(x + 1, int(S * 0.50)), (x + 1, int(S * 0.79))], fill=(70, 55, 98, 120), width=1)
    d.rectangle([0, int(S * 0.495), S, int(S * 0.515)], fill=(5, 4, 10, 255))
    d.rectangle([0, int(S * 0.635), S, int(S * 0.648)], fill=(5, 4, 10, 255))
    d.line([(0, int(S * 0.497)), (S, int(S * 0.497))], fill=(120, 95, 160, 180), width=1)
    img = Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')
    # 栏杆上的一串暖灯
    for x in (0.16, 0.38, 0.62, 0.84):
        img = glow(img, x, 0.505, 0.016, (255, 200, 130), 0.5)
    # 前景失焦绿植
    plant = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    pd = ImageDraw.Draw(plant)
    prng = random.Random(740)
    for i in range(26):
        px = int(S * (0.02 + prng.random() * 0.20))
        py = int(S * (0.72 + prng.random() * 0.28))
        pr = prng.randint(8, 26)
        pd.ellipse([px - pr, py - pr // 2, px + pr, py + pr // 2],
                   fill=(8, 14, 10, prng.randint(150, 230)))
    pd.line([(int(S * 0.10), int(S * 0.98)), (int(S * 0.08), int(S * 0.74))],
            fill=(10, 16, 12, 220), width=5)
    plant = plant.filter(ImageFilter.GaussianBlur(7))
    img = Image.alpha_composite(img.convert('RGBA'), plant).convert('RGB')
    return finish(img, 611, vig=0.58, grain_amt=5.0, bloom_amt=0.3, soft=0.4,
                  contrast=1.05, lift=0.016, sat=1.02)


# ===== 相册里的迷你照片（抽象人物/城市，不画具体五官） =====
def mini_photo(seed, kind, w=190, h=150):
    rng = random.Random(seed)
    if kind == 'portrait':
        img = gradient([(0, (22, 14, 26)), (0.55, (96, 44, 64)), (1, (16, 10, 14))], w=w, h=h, diag=0.25)
        img = glow_small(img, w * 0.82, h * 0.20, w * 0.30, PINK, 0.40)
        img = glow_small(img, w * 0.16, h * 0.38, w * 0.22, (255, 190, 120), 0.30)
        img = img.filter(ImageFilter.GaussianBlur(2.6))
        d = ImageDraw.Draw(img, 'RGBA')
        cx = int(w * rng.uniform(0.44, 0.56))
        hw = int(w * rng.uniform(0.115, 0.135))
        head_top = int(h * 0.20)
        head_bot = int(h * 0.53)
        d.ellipse([cx - hw, head_top, cx + hw, head_bot], fill=(22, 14, 18, 255))
        d.rounded_rectangle([cx - int(hw * 0.44), head_bot - 4, cx + int(hw * 0.44), head_bot + 18],
                            radius=6, fill=(20, 13, 17, 255))
        d.rounded_rectangle([cx - int(w * 0.25), int(h * 0.50), cx + int(w * 0.25), h],
                            radius=int(w * 0.11), fill=(18, 12, 16, 255))
        d.arc([cx - hw, head_top, cx + hw, head_bot], 205, 335, fill=(255, 148, 168, 210), width=2)
        d.line([(cx - int(w * 0.25), int(h * 0.62)), (cx - int(w * 0.25), h)],
               fill=(180, 110, 125, 130), width=2)
        d.line([(cx + int(w * 0.25), int(h * 0.62)), (cx + int(w * 0.25), h)],
               fill=(255, 170, 190, 90), width=1)
        img = glow_small(img, w * 0.5, h * 0.42, w * 0.32, PINK, 0.10)
    elif kind == 'city':
        img = gradient([(0, (8, 6, 20)), (0.65, (40, 14, 54)), (1, (8, 5, 14))], w=w, h=h, diag=0.1)
        d = ImageDraw.Draw(img)
        x = 0
        while x < w:
            bw = rng.randint(14, 34)
            bh = rng.randint(24, 70)
            d.rectangle([x, h - bh, x + bw, h], fill=(12, 9, 24))
            for _ in range(rng.randint(2, 6)):
                wx = x + rng.randint(2, max(2, bw - 4))
                wy = h - bh + rng.randint(2, max(2, bh - 4))
                d.point((wx, wy), fill=rng.choice([PINK, CYAN, AMBER]))
            x += bw + rng.randint(2, 8)
        img = glow_small(img, w * 0.5, h * 0.72, w * 0.5, PINK, 0.3)
    else:
        img = gradient([(0, (20, 40, 46)), (0.55, (180, 120, 60)), (1, (30, 26, 16))], w=w, h=h, diag=0.1)
        d = ImageDraw.Draw(img)
        d.polygon([(int(w * 0.2), int(h * 0.55)), (int(w * 0.5), int(h * 0.32)),
                   (int(w * 0.8), int(h * 0.55)), (int(w * 0.8), h), (int(w * 0.2), h)],
                  fill=(26, 22, 20))
        for _ in range(5):
            x, y = int(w * rng.uniform(0.24, 0.76)), int(h * rng.uniform(0.58, 0.9))
            d.rectangle([x, y, x + 6, y + 8], fill=(255, 200, 120))
        img = glow_small(img, w * 0.5, h * 0.62, w * 0.45, AMBER, 0.35)
    img = img.filter(ImageFilter.GaussianBlur(0.5))
    return img.convert('RGBA')


def glow_small(img, cx, cy, r, color, strength):
    w, h = img.size
    layer = Image.new('RGB', (w, h), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    rr = int(r)
    d.ellipse([int(cx) - rr, int(cy) - rr, int(cx) + rr, int(cy) + rr],
              fill=tuple(int(v * 0.5) for v in color))
    layer = layer.filter(ImageFilter.GaussianBlur(max(1, rr // 2)))
    arr = np.asarray(layer, dtype=np.float32) * strength
    layer = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    return ImageChops.screen(img, layer)


# ===== 3. 九年的相册：暖灯下的桌面相册 =====
def scene_album():
    img = gradient([(0.0, (18, 13, 22)), (0.45, (40, 27, 30)), (1.0, (10, 8, 12))], diag=0.2)
    img = glow(img, 0.24, 0.16, 0.45, (255, 176, 98), 0.55)
    img = glow(img, 0.94, 0.42, 0.38, PINK, 0.24)
    img = img.filter(ImageFilter.GaussianBlur(3.0))
    # 木桌
    table = gradient([(0.0, (54, 37, 30)), (0.5, (38, 26, 22)), (1.0, (16, 12, 11))])
    mask = Image.new('L', (S, S), 0)
    ImageDraw.Draw(mask).rectangle([0, int(S * 0.40), S, S], fill=255)
    img = Image.composite(table, img, mask)
    img = glow(img, 0.32, 0.46, 0.36, (255, 190, 120), 0.20)
    d = ImageDraw.Draw(img, 'RGBA')
    rng = random.Random(707)
    for i in range(30):
        y = int(S * (0.42 + i * 0.020))
        pts = [(0, y)]
        for x in range(0, S + 60, 60):
            pts.append((x, y + rng.randint(-2, 2)))
        d.line(pts, fill=(86, 60, 44, rng.randint(24, 55)), width=1)
    # 相册
    AW, AH = 660, 470
    album = Image.new('RGBA', (AW, AH), (0, 0, 0, 0))
    ad = ImageDraw.Draw(album)
    ad.rounded_rectangle([8, 8, AW - 8, AH - 8], radius=12, fill=(0, 0, 0, 150))
    ad.polygon([(26, 24), (AW // 2 - 5, 14), (AW // 2 - 5, AH - 14), (26, AH - 24)],
               fill=(226, 213, 186, 255))
    ad.polygon([(AW // 2 + 5, 14), (AW - 26, 24), (AW - 26, AH - 24), (AW // 2 + 5, AH - 14)],
               fill=(238, 227, 202, 255))
    ad.rectangle([AW // 2 - 12, 16, AW // 2 + 12, AH - 16], fill=(118, 96, 74, 85))
    ad.line([(AW // 2 - 5, 14), (AW // 2 - 5, AH - 14)], fill=(150, 130, 105, 120), width=2)
    ad.line([(30, 26), (AW // 2 - 8, 18)], fill=(255, 244, 220, 120), width=2)
    # 左页 2x2 小照片
    kinds = ['portrait', 'city', 'portrait', 'school']
    positions = [(52, 52), (196, 66), (64, 226), (204, 238)]
    for i, (k, (px, py)) in enumerate(zip(kinds, positions)):
        ph = mini_photo(800 + i, k, 128, 104)
        ph = ph.rotate(random.Random(i).uniform(-2.5, 2.5), resample=Image.BICUBIC, expand=True)
        border = Image.new('RGBA', (ph.width + 14, ph.height + 14), (246, 240, 224, 255))
        border.alpha_composite(ph, (7, 7))
        album.alpha_composite(border, (px, py))
    # 右页大照片 + 手写线条
    ph = mini_photo(810, 'portrait', 210, 170)
    ph = ph.rotate(-1.6, resample=Image.BICUBIC, expand=True)
    border = Image.new('RGBA', (ph.width + 16, ph.height + 16), (246, 240, 224, 255))
    border.alpha_composite(ph, (8, 8))
    album.alpha_composite(border, (370, 48))
    for i in range(7):
        y = 250 + i * 25
        pts = [(372, y)]
        for x in range(372, 610, 24):
            pts.append((x, y + random.Random(900 + i * 10 + x).randint(-2, 2)))
        ad.line(pts, fill=(70, 52, 48, 110), width=2)
    ad.line([(380, 232), (560, 232)], fill=(120, 80, 70, 120), width=1)
    # 纸张颗粒
    arr = np.asarray(album, dtype=np.float32)
    noise = np.random.default_rng(712).normal(0, 3.8, (AH, AW, 1))
    arr[..., :3] = np.clip(arr[..., :3] + noise, 0, 255)
    album = Image.fromarray(arr.astype(np.uint8), 'RGBA')
    album = album.rotate(-4.5, resample=Image.BICUBIC, expand=True)
    # 阴影
    shadow = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    ax = int(S * 0.5 - album.width * 0.5) + 12
    ay = int(S * 0.60 - album.height * 0.5) + 20
    sd.rounded_rectangle([ax, ay, ax + album.width, ay + album.height], radius=24, fill=(0, 0, 0, 165))
    shadow = shadow.filter(ImageFilter.GaussianBlur(24))
    img = Image.alpha_composite(img.convert('RGBA'), shadow).convert('RGB')
    album_layer = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    album_layer.alpha_composite(album, (ax, ay))
    img = Image.alpha_composite(img.convert('RGBA'), album_layer).convert('RGB')
    # 台灯光池落在相册上
    img = glow(img, 0.33, 0.36, 0.34, (255, 195, 125), 0.24)
    # 桌面散落的一张照片（前景，轻微失焦）
    loose = mini_photo(821, 'city', 160, 120)
    loose = loose.rotate(11, resample=Image.BICUBIC, expand=True)
    lb = Image.new('RGBA', (loose.width + 16, loose.height + 16), (246, 240, 224, 255))
    lb.alpha_composite(loose, (8, 8))
    lsh = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    ld = ImageDraw.Draw(lsh)
    lx, ly = int(S * 0.09), int(S * 0.70)
    ld.rounded_rectangle([lx + 8, ly + 12, lx + lb.width + 14, ly + lb.height + 18],
                         radius=6, fill=(0, 0, 0, 150))
    lsh = lsh.filter(ImageFilter.GaussianBlur(10))
    img = Image.alpha_composite(img.convert('RGBA'), lsh).convert('RGB')
    lb = lb.filter(ImageFilter.GaussianBlur(1.2))
    loose_layer = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    loose_layer.alpha_composite(lb, (lx, ly))
    img = Image.alpha_composite(img.convert('RGBA'), loose_layer).convert('RGB')
    # 右下角失焦的相机
    cam = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    cd = ImageDraw.Draw(cam)
    cbx0, cby0, cbx1, cby1 = int(S * 0.76), int(S * 0.74), int(S * 0.97), int(S * 0.91)
    cd.rounded_rectangle([cbx0, cby0, cbx1, cby1], radius=16, fill=(12, 10, 14, 255))
    cd.rectangle([cbx0 + 18, cby0 - 14, cbx0 + 62, cby0 + 2], fill=(10, 8, 12, 255))
    cd.ellipse([int(S * 0.815), int(S * 0.765), int(S * 0.925), int(S * 0.885)],
               fill=(24, 20, 26, 255), outline=(110, 80, 120, 150), width=3)
    cd.ellipse([int(S * 0.835), int(S * 0.785), int(S * 0.905), int(S * 0.865)],
               fill=(14, 12, 16, 255), outline=(150, 110, 160, 110), width=2)
    cd.ellipse([int(S * 0.855), int(S * 0.805), int(S * 0.885), int(S * 0.845)],
               fill=(40, 34, 48, 255))
    cd.line([(cbx0 + 10, cby0 + 8), (cbx1 - 10, cby0 + 8)], fill=(190, 160, 150, 120), width=2)
    cd.line([(cbx0 + 8, cby0 + 20), (cbx0 + 8, cby1 - 8)], fill=(120, 100, 120, 100), width=2)
    cam = cam.filter(ImageFilter.GaussianBlur(3.2))
    img = Image.alpha_composite(img.convert('RGBA'), cam).convert('RGB')
    img = bokeh(img, 313, 20, (0.0, 1.0), (0.02, 0.22), (0.004, 0.012),
                [AMBER, PINK], blur=4)
    return finish(img, 621, vig=0.55, grain_amt=5.5, bloom_amt=0.26, soft=0.35,
                  contrast=1.06, lift=0.018, sat=1.04)


# ===== 4. 私人画室：月光、画架、未完成的画 =====
def scene_studio():
    img = gradient([(0.0, (9, 9, 22)), (0.35, (20, 20, 44)), (0.68, (12, 10, 24)),
                    (0.72, (7, 6, 14)), (1.0, (4, 3, 8))], diag=0.18)
    arr = np.asarray(img, dtype=np.float32)
    arr = np.clip(arr + np.random.default_rng(731).normal(0, 3.2, (S, S, 1)), 0, 255)
    img = Image.fromarray(arr.astype(np.uint8))
    d = ImageDraw.Draw(img, 'RGBA')
    d.line([(int(S * 0.50), 0), (int(S * 0.50), int(S * 0.70))], fill=(56, 54, 90, 55), width=2)
    d.line([(0, int(S * 0.10)), (int(S * 0.50), int(S * 0.10))], fill=(56, 54, 90, 40), width=2)
    # 地板
    floor = gradient([(0.0, (30, 28, 44)), (0.5, (18, 16, 28)), (1.0, (6, 5, 10))])
    fmask = Image.new('L', (S, S), 0)
    ImageDraw.Draw(fmask).rectangle([0, int(S * 0.70), S, S], fill=255)
    img = Image.composite(floor, img, fmask)
    d = ImageDraw.Draw(img, 'RGBA')
    vpx, vpy = S * 0.46, S * 0.55
    for i in range(-6, 7):
        d.line([(vpx, vpy), (S * 0.5 + i * S * 0.11, S)], fill=(70, 66, 92, 22), width=1)
    d.line([(0, int(S * 0.70)), (S, int(S * 0.70))], fill=(70, 66, 92, 55), width=2)
    # 窗外夜景
    wx0, wy0, wx1, wy1 = int(S * 0.05), int(S * 0.08), int(S * 0.45), int(S * 0.58)
    pw, ph = wx1 - wx0 - 28, wy1 - wy0 - 28
    sky = gradient([(0.0, (10, 14, 34)), (0.55, (28, 36, 70)), (1.0, (70, 86, 130))],
                   w=pw, h=ph, diag=0.1)
    sky = glow_small(sky, pw * 0.70, ph * 0.26, pw * 0.20, (200, 215, 255), 0.55)
    sd = ImageDraw.Draw(sky, 'RGBA')
    srng = random.Random(741)
    for _ in range(60):
        sx, sy = srng.randint(0, pw - 1), srng.randint(0, int(ph * 0.55))
        v = srng.randint(100, 220)
        sd.point((sx, sy), fill=(v, v, min(255, v + 20), 255))
    sd.ellipse([int(pw * 0.66), int(ph * 0.20), int(pw * 0.74), int(ph * 0.28)],
               fill=(226, 232, 255, 255))
    x = 0
    while x < pw:
        bw = srng.randint(16, 44)
        bh = srng.randint(18, int(ph * 0.16))
        sd.rectangle([x, ph - bh, x + bw, ph], fill=(8, 9, 20, 255))
        for _ in range(srng.randint(1, 4)):
            sd.point((x + srng.randint(2, max(2, bw - 3)), ph - bh + srng.randint(2, max(2, bh - 3))),
                     fill=srng.choice([PINK, CYAN, AMBER]) + (255,))
        x += bw + srng.randint(2, 10)
    win = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    win.paste(sky, (wx0 + 14, wy0 + 14))
    wd = ImageDraw.Draw(win)
    wd.rectangle([wx0, wy0, wx1, wy1], outline=(12, 11, 20, 255), width=26)
    wd.rectangle([wx0 + 6, wy0 + 6, wx1 - 6, wy1 - 6], outline=(56, 54, 82, 255), width=2)
    wd.line([((wx0 + wx1) // 2, wy0), ((wx0 + wx1) // 2, wy1)], fill=(12, 11, 20, 255), width=12)
    wd.line([(wx0, (wy0 + wy1) // 2), (wx1, (wy0 + wy1) // 2)], fill=(12, 11, 20, 255), width=12)
    wd.rectangle([wx0 - 20, wy1 - 2, wx1 + 20, wy1 + 24], fill=(22, 20, 32, 255))
    wd.line([(wx0 - 20, wy1 + 2), (wx1 + 20, wy1 + 2)], fill=(130, 140, 200, 110), width=2)
    # 玻璃反光
    for i in range(4):
        rx = wx0 + 30 + i * 78
        wd.line([(rx, wy0 + 20), (rx + 34, wy1 - 20)], fill=(190, 205, 255, 16), width=8)
    img = Image.alpha_composite(img.convert('RGBA'), win).convert('RGB')
    img = glow(img, 0.25, 0.30, 0.30, (150, 175, 255), 0.26)
    # 月光光束
    light = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    ld = ImageDraw.Draw(light)
    ld.polygon([(int(S * 0.10), int(S * 0.58)), (int(S * 0.44), int(S * 0.58)),
                (int(S * 0.70), int(S * 0.96)), (int(S * 0.24), int(S * 0.96))],
               fill=(130, 155, 205, 20))
    light = light.filter(ImageFilter.GaussianBlur(22))
    img = Image.alpha_composite(img.convert('RGBA'), light).convert('RGB')
    img = bokeh(img, 316, 55, (0.08, 0.55), (0.18, 0.80), (0.002, 0.006),
                [(190, 205, 255), (255, 220, 180)], blur=2)
    # 右侧暖光灯
    img = glow(img, 0.90, 0.36, 0.20, (255, 170, 90), 0.34)
    lamp = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    lp = ImageDraw.Draw(lamp)
    lx = int(S * 0.90)
    lp.polygon([(lx - 30, int(S * 0.34)), (lx + 30, int(S * 0.34)),
                (lx + 18, int(S * 0.29)), (lx - 18, int(S * 0.29))], fill=(30, 24, 26, 255))
    lp.line([(lx, int(S * 0.34)), (lx, int(S * 0.46))], fill=(24, 20, 22, 255), width=4)
    lp.line([(lx - 25, int(S * 0.46)), (lx + 25, int(S * 0.46))], fill=(24, 20, 22, 255), width=5)
    lamp = lamp.filter(ImageFilter.GaussianBlur(1.4))
    img = Image.alpha_composite(img.convert('RGBA'), lamp).convert('RGB')
    img = glow(img, 0.90, 0.335, 0.06, (255, 205, 140), 0.55)
    # 画布
    cw, ch = int(S * 0.28), int(S * 0.34)
    canvas = gradient([(0.0, (176, 160, 146)), (0.55, (150, 126, 124)), (1.0, (120, 98, 102))],
                      w=cw, h=ch, diag=0.15)
    cd = ImageDraw.Draw(canvas, 'RGBA')
    crng = random.Random(751)
    for i in range(28):
        y = crng.randint(0, ch - 1)
        x0 = crng.randint(-20, cw // 2)
        x1 = crng.randint(cw // 2, cw + 20)
        col = crng.choice([(188, 120, 136, 70), (122, 92, 140, 60), (206, 166, 120, 55),
                           (96, 80, 108, 60), (210, 140, 110, 50)])
        cd.line([(x0, y), (x1, y + crng.randint(-10, 10))], fill=col, width=crng.randint(4, 16))
    # 未完成的人物
    ccx = int(cw * 0.52)
    cd.ellipse([ccx - int(cw * 0.16), int(ch * 0.22), ccx + int(cw * 0.16), int(ch * 0.55)],
               fill=(74, 52, 62, 230))
    cd.rounded_rectangle([ccx - int(cw * 0.26), int(ch * 0.52), ccx + int(cw * 0.26), ch],
                         radius=int(cw * 0.12), fill=(64, 44, 56, 230))
    cd.arc([ccx - int(cw * 0.16), int(ch * 0.22), ccx + int(cw * 0.16), int(ch * 0.55)],
           205, 330, fill=(238, 170, 180, 210), width=3)
    cd.line([(ccx - int(cw * 0.26), int(ch * 0.66)), (ccx - int(cw * 0.26), ch - 10)],
            fill=(212, 140, 150, 150), width=2)
    # 炭笔草稿线
    for i in range(6):
        sy = int(ch * (0.18 + i * 0.13))
        cd.line([(int(cw * 0.18), sy), (int(cw * 0.78), sy + crng.randint(-6, 6))],
                fill=(60, 46, 48, 55), width=1)
    # 画布纹理与边缘
    arr = np.asarray(canvas, dtype=np.float32)
    arr = np.clip(arr + np.random.default_rng(752).normal(0, 4.5, (ch, cw, 1)), 0, 255)
    canvas = Image.fromarray(arr.astype(np.uint8))
    canvas = canvas.rotate(-2.2, resample=Image.BICUBIC, expand=True)
    easel = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    ed = ImageDraw.Draw(easel)
    ex, ey = int(S * 0.64), int(S * 0.24)
    ed.line([(ex + 8, ey + 20), (ex - int(S * 0.09), int(S * 0.92))], fill=(46, 35, 30, 255), width=11)
    ed.line([(ex + 8, ey + 20), (ex + int(S * 0.11), int(S * 0.92))], fill=(38, 30, 26, 255), width=11)
    ed.line([(ex + 8, ey + 30), (ex + 8, int(S * 0.95))], fill=(52, 40, 34, 255), width=10)
    ed.line([(ex - int(S * 0.07), int(S * 0.74)), (ex + int(S * 0.09), int(S * 0.74))],
            fill=(62, 48, 40, 255), width=7)
    cw2, ch2 = canvas.size
    cax, cay = ex - cw2 // 2, ey - 10
    ed.rounded_rectangle([cax - 4, cay - 4, cax + cw2 + 4, cay + ch2 + 4], radius=3,
                         fill=(26, 22, 26, 255))
    shadow = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rectangle([cax + 6, cay + 8, cax + cw2 + 8, cay + ch2 + 10],
                                     fill=(0, 0, 0, 90))
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    easel.alpha_composite(shadow)
    easel.alpha_composite(canvas.convert('RGBA'), (cax, cay))
    # 画架下方的挡布
    ed.polygon([(ex - int(S * 0.10), int(S * 0.62)), (ex + int(S * 0.10), int(S * 0.62)),
                (ex + int(S * 0.13), int(S * 0.78)), (ex - int(S * 0.12), int(S * 0.78))],
               fill=(28, 24, 30, 220))
    for i in range(4):
        ed.line([(ex - int(S * 0.09) + i * int(S * 0.055), int(S * 0.63)),
                 (ex - int(S * 0.10) + i * int(S * 0.058), int(S * 0.77))],
                fill=(54, 48, 58, 120), width=2)
    img = Image.alpha_composite(img.convert('RGBA'), easel).convert('RGB')
    # 前景工作台
    table = gradient([(0.0, (44, 34, 32)), (0.45, (30, 24, 24)), (1.0, (10, 8, 10))])
    mask = Image.new('L', (S, S), 0)
    ImageDraw.Draw(mask).rectangle([0, int(S * 0.78), S, S], fill=255)
    img = Image.composite(table, img, mask)
    fg = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(fg, 'RGBA')
    d.line([(0, int(S * 0.78)), (S, int(S * 0.79))], fill=(140, 112, 110, 110), width=2)
    # 桌面木纹
    for i in range(14):
        y = int(S * (0.80 + i * 0.014))
        d.line([(0, y), (S, y + random.Random(760 + i).randint(-2, 2))],
               fill=(88, 64, 54, random.Random(770 + i).randint(20, 45)), width=1)
    # 笔筒与画笔
    jx, jy = int(S * 0.16), int(S * 0.88)
    d.rounded_rectangle([jx - 30, jy - 58, jx + 30, jy + 8], radius=9, fill=(34, 32, 40, 235))
    d.ellipse([jx - 30, jy - 66, jx + 30, jy - 50], fill=(66, 58, 62, 235))
    d.line([(jx - 24, jy - 56), (jx - 24, jy + 4)], fill=(150, 150, 170, 90), width=2)
    for i in range(7):
        bx = jx - 24 + i * 8
        top_x = bx + random.Random(970 + i).randint(-14, 14)
        top_y = jy - 150 + random.Random(980 + i).randint(-10, 20)
        d.line([(bx, jy - 60), (top_x, top_y)], fill=(120, 100, 90, 255), width=3)
        d.line([(bx, jy - 60), (bx, jy - 106)], fill=(196, 188, 196, 255), width=3)
        d.line([(top_x - 2, top_y), (top_x + 2, top_y + 16)], fill=(190, 170, 140, 220), width=4)
    # 调色盘
    pal_x0, pal_y0, pal_x1, pal_y1 = int(S * 0.62), int(S * 0.85), int(S * 0.94), int(S * 0.99)
    d.ellipse([pal_x0, pal_y0, pal_x1, pal_y1], fill=(52, 44, 44, 240))
    d.ellipse([pal_x0 + 30, pal_y0 + 26, pal_x0 + 58, pal_y0 + 50], fill=(22, 18, 20, 255))
    for i, col in enumerate([PINK, PURPLE, (230, 190, 120), (140, 200, 190), (220, 90, 90)]):
        px = pal_x0 + 54 + i * 34
        py = pal_y0 + 20 + (i % 2) * 36
        d.ellipse([px, py, px + 20, py + 13], fill=col + (220,))
        d.ellipse([px + 3, py + 2, px + 10, py + 7], fill=(255, 255, 255, 50))
    # 颜料管与抹布
    for i in range(3):
        tx = int(S * (0.70 + i * 0.055))
        ty = int(S * (0.80 + (i % 2) * 0.02))
        d.rounded_rectangle([tx, ty, tx + 54, ty + 18], radius=6, fill=(150, 140, 130, 235))
        d.rectangle([tx + 44, ty + 4, tx + 54, ty + 14], fill=(60, 56, 58, 255))
        d.line([(tx + 6, ty + 6), (tx + 40, ty + 6)], fill=(230, 220, 200, 100), width=2)
    d.polygon([(int(S * 0.36), int(S * 0.90)), (int(S * 0.50), int(S * 0.88)),
               (int(S * 0.54), int(S * 0.97)), (int(S * 0.38), int(S * 0.99))],
              fill=(120, 112, 108, 190))
    d.line([(int(S * 0.39), int(S * 0.92)), (int(S * 0.50), int(S * 0.91))],
           fill=(168, 158, 148, 130), width=2)
    fg = fg.filter(ImageFilter.GaussianBlur(1.4))
    img = Image.alpha_composite(img.convert('RGBA'), fg).convert('RGB')
    img = glow(img, 0.20, 0.84, 0.22, (255, 180, 120), 0.10)
    return finish(img, 631, vig=0.60, grain_amt=5.2, bloom_amt=0.28, soft=0.4,
                  contrast=1.07, lift=0.016, sat=1.05)


# ===== 5. 旧学校 · 银杏：黄昏校舍与金色树冠 =====
def scene_school():
    img = gradient([(0.0, (14, 30, 40)), (0.30, (46, 68, 76)), (0.52, (178, 116, 60)),
                    (0.61, (232, 160, 80)), (0.70, (62, 50, 34)), (1.0, (16, 14, 10))], diag=0.08)
    img = glow(img, 0.50, 0.60, 0.46, (255, 190, 110), 0.5)
    img = glow(img, 0.52, 0.58, 0.18, (255, 236, 190), 0.38)
    # 云层
    layer = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    cd = ImageDraw.Draw(layer)
    crng = random.Random(761)
    for i in range(9):
        cy = int(S * crng.uniform(0.12, 0.34))
        cw = int(S * crng.uniform(0.18, 0.55))
        ch = int(S * crng.uniform(0.02, 0.055))
        cx = int(S * crng.uniform(-0.1, 0.9))
        cd.ellipse([cx, cy, cx + cw, cy + ch], fill=(215, 178, 140, crng.randint(10, 26)))
    layer = layer.filter(ImageFilter.GaussianBlur(14))
    img = Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')
    # 远山
    hills = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    hd = ImageDraw.Draw(hills)
    hd.polygon([(0, int(S * 0.37)), (int(S * 0.14), int(S * 0.31)), (int(S * 0.30), int(S * 0.35)),
                (int(S * 0.48), int(S * 0.30)), (int(S * 0.68), int(S * 0.34)),
                (int(S * 0.85), int(S * 0.29)), (S, int(S * 0.33)), (S, int(S * 0.42)),
                (0, int(S * 0.42))], fill=(34, 40, 42, 150))
    hills = hills.filter(ImageFilter.GaussianBlur(6))
    img = Image.alpha_composite(img.convert('RGBA'), hills).convert('RGB')
    # 校舍
    b = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    bd = ImageDraw.Draw(b)
    bx0, bx1 = int(S * 0.16), int(S * 0.82)
    by0, by1 = int(S * 0.33), int(S * 0.68)
    mid = (bx0 + bx1) // 2
    side = int(S * 0.055)
    # 屋顶
    bd.polygon([(bx0 - 10, by0 + 34), (bx0 + 8, by0 + 18), (mid, by0),
                (bx1 - 8, by0 + 18), (bx1 + 10, by0 + 34), (bx1 - 4, by0 + 44),
                (bx0 + 4, by0 + 44)], fill=(18, 15, 16, 255))
    bd.polygon([(bx0 - 10, by0 + 34), (bx0 + 8, by0 + 18), (mid, by0),
                (bx1 - 8, by0 + 18), (bx1 + 10, by0 + 34)], fill=(34, 28, 28, 255))
    bd.line([(bx0 - 10, by0 + 34), (mid, by0), (bx1 + 10, by0 + 34)],
            fill=(84, 66, 58, 180), width=2)
    # 正立面与侧墙（简单透视）
    bd.polygon([(bx0, by0 + 44), (bx1, by0 + 44), (bx1, by1), (bx0, by1)], fill=(32, 27, 26, 255))
    bd.polygon([(bx1, by0 + 44), (bx1 + side, by0 + 62), (bx1 + side, by1 - 18), (bx1, by1)],
               fill=(18, 16, 16, 255))
    bd.line([(bx0, by0 + 44), (bx1, by0 + 44)], fill=(92, 72, 62, 150), width=2)
    bd.line([(bx1, by0 + 44), (bx1 + side, by0 + 62)], fill=(70, 56, 50, 120), width=1)
    # 烟囱
    bd.rectangle([int(S * 0.68), int(S * 0.255), int(S * 0.71), int(S * 0.33)], fill=(22, 18, 19, 255))
    bd.rectangle([int(S * 0.678), int(S * 0.250), int(S * 0.712), int(S * 0.262)], fill=(40, 32, 30, 255))
    # 窗户
    win_glow = Image.new('RGB', (S, S), (0, 0, 0))
    wgd = ImageDraw.Draw(win_glow)
    cols, rows = 7, 3
    x_step = (bx1 - bx0 - 76) / (cols - 1)
    for row in range(rows):
        for col in range(cols):
            wx = int(bx0 + 38 + col * x_step)
            wy = int(by0 + 70 + row * 62)
            lit = random.Random(1000 + row * 10 + col).random() < 0.7
            bd.rectangle([wx - 3, wy - 3, wx + 29, wy + 41], fill=(16, 14, 14, 255))
            if lit:
                bd.rectangle([wx + 2, wy + 2, wx + 24, wy + 36], fill=(255, 202, 128, 235))
                wgd.rectangle([wx + 2, wy + 2, wx + 24, wy + 36], fill=(255, 190, 110))
                bd.line([(wx + 2, wy + 19), (wx + 24, wy + 19)], fill=(120, 80, 50, 180), width=2)
                bd.line([(wx + 13, wy + 2), (wx + 13, wy + 36)], fill=(120, 80, 50, 180), width=2)
            else:
                bd.rectangle([wx + 2, wy + 2, wx + 24, wy + 36], fill=(26, 24, 28, 255))
    # 门、雨棚、台阶
    door_x0, door_x1 = int(S * 0.455), int(S * 0.545)
    bd.rectangle([door_x0, int(S * 0.53), door_x1, by1], fill=(16, 14, 14, 255))
    bd.rectangle([door_x0 + 4, int(S * 0.54), door_x1 - 4, by1], fill=(30, 24, 20, 255))
    bd.polygon([(door_x0 - 18, int(S * 0.525)), (door_x1 + 18, int(S * 0.525)),
                (door_x1 + 10, int(S * 0.515)), (door_x0 - 10, int(S * 0.515))],
               fill=(20, 17, 16, 255))
    bd.rectangle([door_x0, int(S * 0.505), door_x1, int(S * 0.516)], fill=(36, 28, 24, 255))
    for i in range(3):
        bd.rectangle([door_x0 - 16 - i * 8, by1 - 4 + i * 5, door_x1 + 16 + i * 8, by1 + i * 5],
                     fill=(46, 38, 32, 255))
    # 钟
    clock_c = (mid, int(S * 0.435))
    bd.ellipse([clock_c[0] - 24, clock_c[1] - 24, clock_c[0] + 24, clock_c[1] + 24],
               fill=(30, 26, 24, 255), outline=(150, 120, 80, 180), width=2)
    bd.line([clock_c, (clock_c[0] + 2, clock_c[1] - 15)], fill=(220, 190, 140, 220), width=2)
    bd.line([clock_c, (clock_c[0] + 12, clock_c[1] + 4)], fill=(220, 190, 140, 220), width=2)
    # 立面纹理
    arr = np.asarray(b, dtype=np.float32)
    arr[..., :3] = np.clip(arr[..., :3] + np.random.default_rng(762).normal(0, 3.5, (S, S, 1)), 0, 255)
    b = Image.fromarray(arr.astype(np.uint8), 'RGBA')
    img = Image.alpha_composite(img.convert('RGBA'), b).convert('RGB')
    win_glow = win_glow.filter(ImageFilter.GaussianBlur(9))
    warr = np.asarray(win_glow, dtype=np.float32) * 0.45
    img = ImageChops.screen(img, Image.fromarray(np.clip(warr, 0, 255).astype(np.uint8)))
    img = glow(img, 0.50, 0.62, 0.20, (255, 190, 100), 0.28)
    # 门内暖光与地面光斑
    img = glow(img, 0.50, 0.675, 0.12, (255, 200, 130), 0.30)
    # 小路
    path = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    pd = ImageDraw.Draw(path)
    pd.polygon([(int(S * 0.43), int(S * 0.68)), (int(S * 0.57), int(S * 0.68)),
                (int(S * 0.74), S), (int(S * 0.26), S)], fill=(150, 112, 70, 95))
    pd.polygon([(int(S * 0.445), int(S * 0.68)), (int(S * 0.555), int(S * 0.68)),
                (int(S * 0.70), S), (int(S * 0.30), S)], fill=(190, 146, 92, 60))
    path = path.filter(ImageFilter.GaussianBlur(7))
    img = Image.alpha_composite(img.convert('RGBA'), path).convert('RGB')
    # 银杏树
    def draw_tree(cx, canopy_y, scale, seed):
        tr = Image.new('RGBA', (S, S), (0, 0, 0, 0))
        td = ImageDraw.Draw(tr)
        tx = int(S * cx)
        trng = random.Random(seed)
        tw = max(3, int(S * 0.016 * scale))
        td.polygon([(tx - tw * 1.8, S), (tx + tw * 1.8, S),
                    (tx + tw * 0.4, int(S * (canopy_y + 0.12))),
                    (tx - tw * 0.4, int(S * (canopy_y + 0.12)))], fill=(26, 20, 16, 255))
        for i in range(8):
            by = int(S * (canopy_y + 0.16))
            bx1 = tx + int(S * 0.15 * scale * trng.uniform(-1, 1))
            by1 = by - int(S * 0.20 * scale * trng.uniform(0.5, 1.2))
            td.line([(tx, by), (bx1, by1)], fill=(30, 22, 18, 255), width=max(2, int(6 * scale)))
        for i in range(260):
            ang = trng.uniform(0, 2 * math.pi)
            rad = trng.uniform(0, 1) ** 0.55
            fx = tx + int(math.cos(ang) * rad * S * 0.20 * scale)
            fy = int(S * canopy_y) + int(math.sin(ang) * rad * S * 0.145 * scale)
            fr = trng.randint(3, max(5, int(10 * scale)))
            col = trng.choice([(232, 172, 62), (255, 200, 90), (204, 142, 52),
                               (168, 134, 70), (250, 180, 76)])
            td.ellipse([fx - fr, fy - fr, fx + fr, fy + fr],
                       fill=col + (trng.randint(90, 200),))
        tr = tr.filter(ImageFilter.GaussianBlur(1.8))
        return tr
    img = Image.alpha_composite(img.convert('RGBA'), draw_tree(0.10, 0.40, 1.15, 1100)).convert('RGB')
    img = Image.alpha_composite(img.convert('RGBA'), draw_tree(0.91, 0.42, 1.05, 1200)).convert('RGB')
    img = glow(img, 0.10, 0.42, 0.15, (255, 190, 90), 0.18)
    img = glow(img, 0.91, 0.44, 0.14, (255, 190, 90), 0.16)
    # 前景落叶与虚化树冠
    fg = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fg)
    frng = random.Random(1300)
    for i in range(150):
        lx = int(S * frng.uniform(0.0, 1.0))
        ly = int(S * frng.uniform(0.74, 1.0))
        lr = frng.randint(2, 7)
        col = frng.choice([(232, 172, 62), (255, 200, 90), (190, 130, 50), (150, 110, 48)])
        fd.ellipse([lx - lr, ly - lr // 2, lx + lr, ly + lr // 2], fill=col + (frng.randint(90, 190),))
    for corner in ((0.02, 0.02), (0.98, 0.04), (0.02, 0.98), (0.98, 0.98)):
        for i in range(45):
            lx = int(S * (corner[0] + frng.uniform(-0.12, 0.12)))
            ly = int(S * (corner[1] + frng.uniform(-0.10, 0.10)))
            lr = frng.randint(5, 16)
            col = frng.choice([(232, 172, 62), (255, 200, 90), (190, 130, 50)])
            fd.ellipse([lx - lr, ly - lr, lx + lr, ly + lr], fill=col + (frng.randint(60, 140),))
    fg = fg.filter(ImageFilter.GaussianBlur(5.5))
    img = Image.alpha_composite(img.convert('RGBA'), fg).convert('RGB')
    # 飞鸟
    bd = ImageDraw.Draw(img, 'RGBA')
    brng = random.Random(1400)
    for i in range(6):
        bx, by = int(S * brng.uniform(0.15, 0.85)), int(S * brng.uniform(0.12, 0.26))
        s = brng.randint(3, 6)
        bd.line([(bx - s, by), (bx, by - s // 2), (bx + s, by)],
                fill=(30, 34, 40, brng.randint(90, 150)), width=1)
    return finish(img, 641, vig=0.55, grain_amt=5.0, bloom_amt=0.32, soft=0.4,
                  contrast=1.06, lift=0.016, sat=1.05)


SCENES = {
    'city': scene_city,
    'rooftop': scene_rooftop,
    'album': scene_album,
    'studio': scene_studio,
    'school': scene_school,
}

for name, fn in SCENES.items():
    save(fn(), name)
print('相册照片生成完成')
