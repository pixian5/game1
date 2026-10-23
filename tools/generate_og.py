#!/usr/bin/env python3
# ===== 霓虹心事 · OG 分享图生成器 =====
# 绘制 1200×630 的社交分享卡片（Open Graph / Twitter Card）：霓虹渐变底 + 辉光 +
# 中文标题 + 霓虹心图形。输出 assets/og-cover.jpg。
# 重新生成：python3 tools/generate_og.py
import os
import math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets')
os.makedirs(OUT, exist_ok=True)

W, H = 1200, 630

PINK = (255, 95, 168)
PINK_LIGHT = (255, 160, 210)
PURPLE = (122, 92, 255)

# 字体候选（Linux Noto/文泉驿 → macOS PingFang），face index 见括号
FONT_CANDIDATES = [
    ('/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc', 2, 'bold'),
    ('/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc', 2, 'regular'),
    ('/usr/share/fonts/wqy-zenhei/wqy-zenhei.ttc', 0, 'bold'),
    ('/usr/share/fonts/wqy-zenhei/wqy-zenhei.ttc', 0, 'regular'),
    ('/System/Library/Fonts/PingFang.ttc', 0, 'bold'),
    ('/System/Library/Fonts/PingFang.ttc', 0, 'regular'),
]


def load_font(size, kind):
    """按需要字重挑选可用的 CJK 字体"""
    for path, index, fkind in FONT_CANDIDATES:
        if fkind != kind or not os.path.exists(path):
            continue
        try:
            return ImageFont.truetype(path, size, index=index)
        except Exception:
            continue
    return ImageFont.load_default()


def heart_points(cx, cy, size, steps=260):
    pts = []
    for i in range(steps):
        t = i / steps * 2 * math.pi
        x = 16 * math.sin(t) ** 3
        y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
        pts.append((cx + x * size, cy - y * size))
    return pts


# ===== 背景：对角渐变 + 双色辉光 =====
bg = Image.new('RGB', (W, H))
px = bg.load()
for y in range(H):
    for x in range(W):
        t = (x / W + y / H) / 2
        r = int(24 + (10 - 24) * t)
        g = int(10 + (7 - 10) * t)
        b = int(44 + (18 - 44) * t)
        px[x, y] = (r, g, b)

glow1 = Image.new('RGB', (W, H), (0, 0, 0))
ImageDraw.Draw(glow1).ellipse([-W * 0.1, -H * 0.4, W * 0.55, H * 0.9], fill=(110, 30, 90))
glow1 = glow1.filter(ImageFilter.GaussianBlur(160))
bg = Image.blend(bg, Image.composite(glow1, bg, glow1.convert('L')), 0.7)

glow2 = Image.new('RGB', (W, H), (0, 0, 0))
ImageDraw.Draw(glow2).ellipse([W * 0.6, H * 0.2, W * 1.2, H * 1.3], fill=(58, 40, 130))
glow2 = glow2.filter(ImageFilter.GaussianBlur(170))
bg = Image.blend(bg, Image.composite(glow2, bg, glow2.convert('L')), 0.7)

# 右侧隐约的手机圆角轮廓
phone = Image.new('RGBA', (W, H), (0, 0, 0, 0))
ImageDraw.Draw(phone).rounded_rectangle([880, 70, 1150, 560], radius=48,
                                        outline=(255, 255, 255, 26), width=4)
bg = Image.alpha_composite(bg.convert('RGBA'), phone).convert('RGB')

# ===== 右侧霓虹心（复刻图标风格） =====
cx, cy, size = 1015, 300, 5.2
for r_frac, width, color in [(1.9, 34, PINK), (1.4, 22, PINK), (1.0, 12, PINK_LIGHT)]:
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    pts = heart_points(cx, cy, size * r_frac)
    ImageDraw.Draw(layer).line(pts + [pts[0]], fill=color + (150,), width=width, joint='curve')
    layer = layer.filter(ImageFilter.GaussianBlur(width // 2))
    bg = Image.alpha_composite(bg.convert('RGBA'), layer).convert('RGB')

main = Image.new('RGBA', (W, H), (0, 0, 0, 0))
pts = heart_points(cx, cy, size)
ImageDraw.Draw(main).line(pts + [pts[0]], fill=(255, 130, 190, 255), width=14, joint='curve')
main = main.filter(ImageFilter.GaussianBlur(1.0))
bg = Image.alpha_composite(bg.convert('RGBA'), main).convert('RGB')

# ===== 左侧文字 =====
draw = ImageDraw.Draw(bg)

f_title = load_font(112, 'bold')
f_sub = load_font(58, 'bold')
f_desc = load_font(30, 'regular')
f_role = load_font(29, 'regular')
f_meta = load_font(24, 'regular')

# 顶部小标签
draw.text((84, 74), '互动叙事 · 模拟手机', font=f_meta, fill=(180, 150, 220))

# 主标题（带轻微辉光）
title = '霓虹心事'
glow_t = Image.new('RGBA', (W, H), (0, 0, 0, 0))
ImageDraw.Draw(glow_t).text((84, 150), title, font=f_title, fill=(255, 95, 168, 180))
glow_t = glow_t.filter(ImageFilter.GaussianBlur(16))
bg = Image.alpha_composite(bg.convert('RGBA'), glow_t).convert('RGB')
draw = ImageDraw.Draw(bg)
draw.text((84, 150), title, font=f_title, fill=(255, 255, 255))

draw.text((88, 296), '林夏的手机', font=f_sub, fill=PINK_LIGHT)

# 分隔线
draw.line([(88, 386), (470, 386)], fill=(255, 95, 168, 160), width=3)

draw.text((88, 414), '「模拟一部手机」的沉浸式多线互动叙事', font=f_desc, fill=(214, 204, 232))
draw.text((88, 470), '沈砚之 · 陆辞 · 江屿 · 独行线', font=f_role, fill=(176, 156, 214))
draw.text((88, 536), '196 事件 · 17 结局 · 3 位男主 + 独行线', font=f_meta, fill=(150, 132, 186))

# ===== 细噪点，避免纯色渐变的色带 =====
noise = Image.effect_noise((W, H), 8).convert('L')
bp = bg.load()
np_ = noise.load()
for y in range(0, H, 2):
    for x in range(0, W, 2):
        r, g, b = bp[x, y]
        o = (np_[x, y] - 128) // 12
        bp[x, y] = (max(0, min(255, r + o)), max(0, min(255, g + o)), max(0, min(255, b + o)))

path = os.path.join(OUT, 'og-cover.jpg')
bg.save(path, 'JPEG', quality=86, optimize=True)
print(f'✓ {path} ({os.path.getsize(path)//1024} KB)')
print('OG 分享图生成完成')