#!/usr/bin/env python3
# ===== 霓虹心事 · 关键场景 CG 生成器 =====
# 6 张 1024×576 霓虹剪影插画风 CG（与壁纸/照片同一程序化美术语言：多层辉光 + 剪影 + 光斑 + 噪点 + 暗角）
# 输出 assets/cg/<id>.jpg（单张目标 <300KB，check:ui 预算门禁守门）
# 重新生成：python3 tools/generate_cg.py
import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'cg')
os.makedirs(OUT, exist_ok=True)
W, H = 1024, 576


def diag_gradient(stops):
    img = Image.new('RGB', (W, H))
    px = img.load()
    seg = len(stops) - 1
    for y in range(H):
        for x in range(W):
            t = (x / W + y / H) / 2
            i = min(int(t * seg), seg - 1)
            local = t * seg - i
            a, b = stops[i][1], stops[i + 1][1]
            px[x, y] = tuple(int(a[k] + (b[k] - a[k]) * local) for k in range(3))
    return img


def glow(img, cx, cy, r, color, strength, blur=0.4):
    layer = Image.new('RGB', (W, H), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse([int(cx*W - r*W), int(cy*H - r*W), int(cx*W + r*W), int(cy*H + r*W)], fill=color)
    layer = layer.filter(ImageFilter.GaussianBlur(int(r * W * blur)))
    return Image.composite(layer, img, layer.convert('L').point(lambda v: int(v * strength)))


def silhouette(img, pts, color, blur=1.2):
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.polygon(pts, fill=color)
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    img.paste(layer, (0, 0), layer)


def person(img, cx, base_y, h, color=(8, 6, 14), blur=1.5):
    """极简人形剪影：头（圆）+ 身（梯形近似）"""
    hw = h * 0.16
    head = [(cx, base_y - h), (cx + hw*0.9, base_y - h*0.82), (cx + hw*0.7, base_y - h*0.72), (cx - hw*0.7, base_y - h*0.72), (cx - hw*0.9, base_y - h*0.82)]
    body = [(cx - hw*0.75, base_y - h*0.72), (cx + hw*0.75, base_y - h*0.72), (cx + hw*1.15, base_y), (cx - hw*1.15, base_y)]
    silhouette(img, head, color + (255,), blur)
    silhouette(img, body, color + (255,), blur)


def cityline(img, y0, color, seed=7, alpha=255, blur=0.8):
    rnd = random.Random(seed)
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x = -10
    while x < W:
        w = rnd.randint(40, 90)
        h = rnd.randint(40, 150)
        d.rectangle([x, y0 - h, x + w, H], fill=color + (alpha,))
        x += w + rnd.randint(2, 8)
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    img.paste(layer, (0, 0), layer)


def neon_window_lights(img, y0, seed=11, rows=5):
    rnd = random.Random(seed)
    d = ImageDraw.Draw(img)
    colors = [(255, 95, 168), (122, 92, 255), (57, 214, 255), (251, 191, 36)]
    for _ in range(rows * 26):
        x = rnd.randint(8, W - 14)
        y = rnd.randint(y0 + 10, H - 12)
        c = rnd.choice(colors)
        d.rectangle([x, y, x + rnd.randint(3, 6), y + rnd.randint(4, 9)], fill=c)


def rain(img, seed=5, count=380):
    rnd = random.Random(seed)
    d = ImageDraw.Draw(img, 'RGBA')
    for _ in range(count):
        x, y = rnd.randint(0, W), rnd.randint(0, H)
        ln = rnd.randint(14, 34)
        d.line([x, y, x - 4, y + ln], fill=(190, 210, 255, 70), width=1)


def vignette_grain(img, grain=7):
    mask = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(mask)
    d.ellipse([-int(W*0.2), -int(H*0.18), int(W*1.2), int(H*1.18)], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(int(W*0.24)))
    img = Image.composite(img, Image.new('RGB', (W, H), (2, 2, 6)), mask)
    px = img.load()
    for y in range(0, H, 2):
        for x in range(0, W, 2):
            r, g, b = px[x, y]
            off = (random.Random(x*31+y).randrange(-grain, grain))
            px[x, y] = (max(0, min(255, r+off)), max(0, min(255, g+off)), max(0, min(255, b+off)))
    return img


def finish(img, name):
    img = vignette_grain(img)
    p = os.path.join(OUT, f'{name}.jpg')
    img.save(p, 'JPEG', quality=84, optimize=True)
    print(f'✓ {p} ({os.path.getsize(p)//1024} KB)')


# ---------- 1. 沈砚之 · 私人画室的告白（盖了三年的画） ----------
img = diag_gradient([(0.0, (26, 10, 46)), (0.45, (48, 18, 74)), (1.0, (10, 7, 18))])
img = glow(img, 0.5, 0.32, 0.34, (122, 92, 255), 0.5)       # 月光天窗
img = glow(img, 0.5, 0.35, 0.10, (230, 220, 255), 0.75, 0.2)  # 画布上的光
# 画框与画布
silhouette(img, [(0.36*W, 0.18*H), (0.64*W, 0.18*H), (0.64*W, 0.55*H), (0.36*W, 0.55*H)], (18, 12, 30, 255), 1)
d = ImageDraw.Draw(img)
d.rectangle([int(0.38*W), int(0.20*H), int(0.62*W), int(0.53*H)], outline=(255, 130, 190), width=2)
person(img, 0.72, H*0.96, H*0.52)   # 他背对站在画前
person(img, 0.28, H*0.98, H*0.44, color=(14, 9, 24), blur=2.5)  # 她（虚一点）
finish(img, 'cg_shenyan_confess')

# ---------- 2. 陆辞 · 雨中天台（银杏与九年） ----------
img = diag_gradient([(0.0, (10, 20, 40)), (0.5, (24, 44, 66)), (1.0, (6, 10, 20))])
img = glow(img, 0.3, 0.25, 0.4, (74, 222, 128), 0.28)
cityline(img, int(0.42*H), (16, 30, 48), seed=3)
neon_window_lights(img, int(0.30*H), seed=9, rows=3)
# 银杏树冠（右侧金黄光斑群）
rnd = random.Random(21)
d = ImageDraw.Draw(img, 'RGBA')
for _ in range(160):
    x, y = rnd.randint(int(0.62*W), int(0.95*W)), rnd.randint(int(0.12*H), int(0.55*H))
    r = rnd.randint(3, 9)
    d.ellipse([x, y, x+r, y+r], fill=(251, 191, 36, rnd.randint(120, 210)))
person(img, 0.42, H*0.97, H*0.5)
person(img, 0.55, H*0.97, H*0.48, color=(12, 10, 20), blur=2)
rain(img, seed=31, count=460)
finish(img, 'cg_luci_confess')

# ---------- 3. 江屿 · 雾港后台（追光与舞台） ----------
img = diag_gradient([(0.0, (8, 6, 18)), (0.5, (20, 12, 38)), (1.0, (4, 4, 12))])
img = glow(img, 0.5, 0.75, 0.3, (122, 92, 255), 0.35)        # 观众席暗紫
# 追光锥
silhouette(img, [(0.42*W, 0), (0.58*W, 0), (0.72*W, H), (0.28*W, H)], (210, 190, 255, 60), blur=6)
person(img, 0.5, H*0.82, H*0.42, color=(10, 8, 20))           # 台上的人
# 麦克风架
d = ImageDraw.Draw(img)
d.line([int(0.52*W), int(0.62*H), int(0.52*W), int(0.80*H)], fill=(200, 200, 220), width=3)
d.ellipse([int(0.505*W), int(0.60*H), int(0.535*W), int(0.635*H)], fill=(255, 95, 168))
finish(img, 'cg_jiangyu_confess')

# ---------- 4. 真结局 · 无霓虹的清晨霓城（素颜城市） ----------
img = diag_gradient([(0.0, (150, 170, 200)), (0.55, (196, 205, 220)), (1.0, (230, 226, 218))])
cityline(img, int(0.55*H), (120, 132, 152), seed=41, alpha=200, blur=1.5)
cityline(img, int(0.70*H), (92, 102, 122), seed=43, alpha=230, blur=0.6)
d = ImageDraw.Draw(img, 'RGBA')
d.ellipse([int(0.68*W), int(0.10*H), int(0.80*W), int(0.34*H)], fill=(255, 250, 235, 235))  # 柔和晨阳
person(img, 0.36, H*0.96, H*0.46, color=(60, 66, 82), blur=1.8)
finish(img, 'cg_true_ending')

# ---------- 5. 梦魇 · 空舞台（追光白椅与掌声） ----------
img = diag_gradient([(0.0, (6, 6, 14)), (0.5, (14, 12, 30)), (1.0, (3, 3, 10))])
silhouette(img, [(0.40*W, 0), (0.60*W, 0), (0.78*W, H), (0.22*W, H)], (235, 235, 255, 46), blur=7)  # 冷追光
# 台下黑压压的头影
rnd = random.Random(77)
d = ImageDraw.Draw(img, 'RGBA')
for row in range(4):
    y = int((0.72 + row*0.07) * H)
    for i in range(16 - row*2):
        x = rnd.randint(int(0.06*W), int(0.94*W))
        r = 10 + row*4
        d.ellipse([x-r, y-r, x+r, y+r], fill=(4, 4, 10, 255))
# 空椅子
silhouette(img, [(0.47*W, 0.52*H), (0.53*W, 0.52*H), (0.55*W, 0.72*H), (0.45*W, 0.72*H)], (30, 28, 44, 255), 0.8)
d = ImageDraw.Draw(img)
d.rectangle([int(0.46*W), int(0.72*H), int(0.54*W), int(0.75*H)], fill=(20, 18, 32))
finish(img, 'cg_nightmare_stage')

# ---------- 6. 天台夜（流动的银河灯海） ----------
img = diag_gradient([(0.0, (12, 8, 30)), (0.45, (30, 14, 58)), (1.0, (6, 4, 16))])
img = glow(img, 0.7, 0.3, 0.35, (255, 95, 168), 0.35)
img = glow(img, 0.25, 0.4, 0.3, (57, 214, 255), 0.22)
# 灯河：横向流动光带
rnd = random.Random(99)
d = ImageDraw.Draw(img, 'RGBA')
for band in range(6):
    y = int((0.45 + band*0.08) * H)
    for _ in range(90):
        x = rnd.randint(0, W)
        c = rnd.choice([(255, 95, 168), (122, 92, 255), (57, 214, 255), (251, 191, 36)])
        y2 = y + rnd.randint(-8, 8)
        w2, h2 = rnd.randint(4, 12), rnd.randint(3, 9)
        d.ellipse([x, y2, x + w2, y2 + h2], fill=c + (rnd.randint(90, 190),))
person(img, 0.30, H*0.9, H*0.28, color=(8, 6, 16))
person(img, 0.44, H*0.9, H*0.26, color=(10, 8, 18), blur=2)
finish(img, 'cg_rooftop_night')

print('CG 生成完成')
