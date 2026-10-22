#!/usr/bin/env python3
# ===== 霓虹心事 · 角色头像生成器 =====
# 用 PIL 程序化绘制 4 张 512×512 插画头像：沈砚之 / 陆辞 / 江屿 / 苏苏。
# 输出 assets/avatars/<id>.jpg，供聊天、通知、通讯录等界面使用（单张目标 <100KB）。
# 重新生成：/opt/homebrew/bin/python3.14 tools/generate_avatars.py（需 Pillow + numpy）
import os
import math
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'avatars')
os.makedirs(OUT, exist_ok=True)

S = 512
SS = 3
W = S * SS


def u(v):
    return int(round(v * SS))


def box(x0, y0, x1, y1):
    return [u(x0), u(y0), u(x1), u(y1)]


def pts(points):
    return [(u(x), u(y)) for x, y in points]


def face_points(cx, top, w, h, jaw, n=240):
    points = []
    for i in range(n):
        a = 2 * math.pi * i / n - math.pi / 2
        x, y = math.cos(a), math.sin(a)
        if y > 0:
            x *= 1 - (1 - jaw) * (y ** 1.5)
        else:
            x *= 0.94 + 0.06 * (1 + y)
        points.append((cx + w / 2 * x, top + h / 2 + h / 2 * y))
    return points


def rgba(c, a=255):
    return (c[0], c[1], c[2], a)


def gradient(stops, diag=0.0):
    yy, xx = np.mgrid[0:W, 0:W].astype(np.float32)
    t = (xx / (W - 1)) * diag + (yy / (W - 1)) * (1 - diag)
    pos = np.array([p for p, _ in stops], dtype=np.float32)
    cols = np.array([c for _, c in stops], dtype=np.float32)
    out = np.empty((W, W, 3), dtype=np.float32)
    for ch in range(3):
        out[..., ch] = np.interp(t, pos, cols[:, ch])
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def add_glow(img, cx, cy, r, color, strength=0.5):
    yy, xx = np.mgrid[0:W, 0:W].astype(np.float32)
    d = np.sqrt((xx - cx * SS) ** 2 + (yy - cy * SS) ** 2) / (r * SS)
    g = np.exp(-(d ** 2) * 2.4)
    arr = np.asarray(img, dtype=np.float32)
    arr += g[..., None] * np.array(color, dtype=np.float32) * strength
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def add_bokeh(img, seed, count, palette, xr=(0.02, 0.98), yr=(0.02, 0.85),
              rr=(0.012, 0.05), blur=14):
    rng = random.Random(seed)
    layer = Image.new('RGB', (W, W), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(count):
        x = rng.uniform(*xr) * W
        y = rng.uniform(*yr) * W
        r = rng.uniform(*rr) * W
        c = tuple(int(v * rng.uniform(0.10, 0.36)) for v in rng.choice(palette))
        d.ellipse([x - r, y - r, x + r, y + r], fill=c)
    # 细小高光点，增加景深层次
    for _ in range(count * 2):
        x = rng.uniform(*xr) * W
        y = rng.uniform(*yr) * W
        r = rng.uniform(0.002, 0.007) * W
        c = tuple(int(v * rng.uniform(0.25, 0.65)) for v in rng.choice(palette))
        d.ellipse([x - r, y - r, x + r, y + r], fill=c)
    layer = layer.filter(ImageFilter.GaussianBlur(u(blur / SS)))
    return ImageChops.screen(img, layer)


def add_light_leak(img, seed, color, count=5):
    rng = random.Random(seed)
    layer = Image.new('RGB', (W, W), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(count):
        y = rng.uniform(0.1, 0.9) * W
        x0 = rng.uniform(-0.3, 0.2) * W
        ln = rng.uniform(0.5, 1.3) * W
        inten = rng.uniform(0.15, 0.4)
        d.line([x0, y, x0 + ln, y - rng.uniform(0.05, 0.4) * W],
               fill=tuple(int(v * inten) for v in color), width=u(rng.uniform(1, 4) / SS))
    layer = layer.filter(ImageFilter.GaussianBlur(u(14)))
    return ImageChops.screen(img, layer)


def soft_shadow(layer, ellipse, color, blur=18, alpha=70):
    sh = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    ImageDraw.Draw(sh).ellipse(ellipse, fill=rgba(color, alpha))
    sh = sh.filter(ImageFilter.GaussianBlur(u(blur)))
    return Image.alpha_composite(layer, sh)


def draw_hair_back(layer, job):
    d = ImageDraw.Draw(layer)
    hair = job['hair']
    style = job['style']
    if style == 'shenyan':
        d.ellipse(box(136, 94, 376, 362), fill=rgba(hair))
        d.polygon(pts([(142, 210), (134, 300), (158, 332), (188, 316),
                       (182, 256), (172, 210)]), fill=rgba(hair))
        d.polygon(pts([(370, 210), (378, 300), (354, 332), (324, 316),
                       (330, 256), (340, 210)]), fill=rgba(hair))
    elif style == 'luci':
        d.ellipse(box(136, 100, 376, 360), fill=rgba(hair))
        d.polygon(pts([(140, 220), (128, 300), (158, 326), (174, 260)]), fill=rgba(hair))
        d.polygon(pts([(372, 220), (384, 300), (354, 326), (338, 260)]), fill=rgba(hair))
    elif style == 'jiangyu':
        d.ellipse(box(132, 92, 380, 382), fill=rgba(hair))
        d.polygon(pts([(142, 240), (128, 330), (158, 372), (198, 352),
                       (186, 290), (174, 236)]), fill=rgba(hair))
        d.polygon(pts([(370, 240), (384, 330), (354, 372), (314, 352),
                       (326, 290), (338, 236)]), fill=rgba(hair))
        d.polygon(pts([(150, 320), (144, 360), (166, 390), (184, 370), (172, 340)]),
                  fill=rgba(hair))
        d.polygon(pts([(362, 320), (368, 360), (346, 390), (328, 370), (340, 340)]),
                  fill=rgba(hair))
    else:  # susu bob
        d.ellipse(box(118, 104, 394, 430), fill=rgba(hair))
        d.rounded_rectangle(box(122, 210, 390, 420), radius=u(74), fill=rgba(hair))
    return layer


def draw_torso(layer, job):
    d = ImageDraw.Draw(layer)
    pale = job['jacket']
    hi = job['jacket_hi']
    skin = job['skin']
    style = job['style']
    shoulders = [(64, 512), (82, 480), (132, 452), (196, 438), (256, 434),
                 (316, 438), (380, 452), (430, 480), (448, 512)]
    d.polygon(pts(shoulders), fill=rgba(pale))
    d.polygon(pts([(64, 512), (82, 480), (132, 452), (180, 442), (170, 512)]),
              fill=rgba(tuple(int(v * 0.82) for v in pale)))
    d.polygon(pts([(448, 512), (430, 480), (380, 452), (332, 442), (342, 512)]),
              fill=rgba(tuple(int(v * 0.82) for v in pale)))
    if style == 'shenyan':
        # 高领 + 大衣翻领
        d.rounded_rectangle(box(204, 392, 308, 470), radius=u(22), fill=rgba((24, 23, 36)))
        d.polygon(pts([(196, 438), (256, 470), (316, 438), (300, 512), (212, 512)]),
                  fill=rgba((34, 33, 52)))
        d.polygon(pts([(196, 438), (238, 458), (220, 512), (170, 512)]),
                  fill=rgba((44, 42, 64)))
        d.polygon(pts([(316, 438), (274, 458), (292, 512), (342, 512)]),
                  fill=rgba((44, 42, 64)))
        d.line(pts([(212, 444), (202, 500)]), fill=rgba(hi), width=u(2))
        d.line(pts([(300, 444), (310, 500)]), fill=rgba(hi), width=u(2))
        d.ellipse(box(300, 464, 312, 476), fill=rgba((210, 208, 228)), outline=rgba(hi), width=u(1))
    elif style == 'luci':
        # 夹克 + 白 T + 相机背带
        d.polygon(pts([(198, 424), (256, 452), (314, 424), (300, 512), (212, 512)]),
                  fill=rgba((214, 208, 196)))
        d.polygon(pts([(190, 424), (244, 450), (226, 512), (166, 512)]),
                  fill=rgba(tuple(int(v * 1.12) for v in pale)))
        d.polygon(pts([(322, 424), (268, 450), (286, 512), (346, 512)]),
                  fill=rgba(tuple(int(v * 1.12) for v in pale)))
        d.line(pts([(186, 444), (244, 506)]), fill=rgba((58, 40, 30)), width=u(9))
        d.line(pts([(326, 444), (268, 506)]), fill=rgba((58, 40, 30)), width=u(9))
        d.line(pts([(186, 444), (244, 506)]), fill=rgba((110, 88, 62)), width=u(2))
        d.line(pts([(326, 444), (268, 506)]), fill=rgba((110, 88, 62)), width=u(2))
    elif style == 'jiangyu':
        # 黑衬衫敞开 + 内搭 + 银链
        d.polygon(pts([(218, 422), (294, 422), (286, 512), (226, 512)]),
                  fill=rgba((52, 50, 58)))
        d.polygon(pts([(190, 424), (248, 452), (226, 512), (162, 512)]),
                  fill=rgba((22, 20, 28)))
        d.polygon(pts([(322, 424), (264, 452), (286, 512), (350, 512)]),
                  fill=rgba((22, 20, 28)))
        d.line(pts([(222, 420), (256, 446), (290, 420)]), fill=rgba((182, 184, 196)), width=u(2))
        d.ellipse(box(252, 442, 260, 450), fill=rgba((196, 198, 208)))
    else:  # susu 连帽衫
        d.polygon(pts([(196, 428), (256, 462), (316, 428), (306, 512), (206, 512)]),
                  fill=rgba((238, 230, 210)))
        d.polygon(pts([(184, 430), (238, 456), (222, 512), (162, 512)]),
                  fill=rgba(tuple(int(v * 1.08) for v in pale)))
        d.polygon(pts([(328, 430), (274, 456), (290, 512), (350, 512)]),
                  fill=rgba(tuple(int(v * 1.08) for v in pale)))
        d.line(pts([(228, 446), (222, 500)]), fill=rgba((248, 236, 208)), width=u(4))
        d.line(pts([(284, 446), (290, 500)]), fill=rgba((248, 236, 208)), width=u(4))
        d.ellipse(box(216, 496, 228, 504), fill=rgba(hi))
        d.ellipse(box(284, 496, 296, 504), fill=rgba(hi))
    folds = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    fd = ImageDraw.Draw(folds)
    fd.line(pts([(158, 474), (194, 454), (214, 440)]),
            fill=rgba(tuple(int(v * 0.78) for v in pale), 80), width=u(3), joint='curve')
    fd.line(pts([(354, 474), (318, 454), (298, 440)]),
            fill=rgba(tuple(min(255, int(v * 1.16)) for v in pale), 65), width=u(3), joint='curve')
    fd.line(pts([(220, 512), (232, 486), (240, 470)]),
            fill=rgba((18, 16, 24), 60), width=u(2.4), joint='curve')
    folds = folds.filter(ImageFilter.GaussianBlur(u(3)))
    return Image.alpha_composite(layer, folds)


def draw_neck(layer, job):
    d = ImageDraw.Draw(layer)
    skin = job['skin']
    shadow = job['skin_shadow']
    d.rounded_rectangle(box(220, 372, 292, 452), radius=u(18), fill=rgba(skin))
    d.rounded_rectangle(box(240, 368, 272, 400), radius=u(10),
                        fill=rgba(tuple(int(v * 0.9) for v in skin)))
    sh = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    ImageDraw.Draw(sh).ellipse(box(222, 386, 292, 448), fill=rgba(shadow, 90))
    sh = sh.filter(ImageFilter.GaussianBlur(u(12)))
    return Image.alpha_composite(layer, sh)


def draw_face(layer, job):
    d = ImageDraw.Draw(layer)
    skin = job['skin']
    shadow = job['skin_shadow']
    cx = 256
    top = job['face_top']
    fw = job['face_w']
    fh = job['face_h']
    jaw = job['jaw']
    outline = face_points(cx, top, fw, fh, jaw)
    d.polygon(pts(outline), fill=rgba(skin))
    mask = Image.new('L', (W, W), 0)
    ImageDraw.Draw(mask).polygon(pts(outline), fill=255)
    # 面部阴影：右侧、下颌、眼窝
    shade = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shade)
    sd.ellipse(box(cx + fw * 0.04, top + fh * 0.12, cx + fw * 0.62, top + fh * 0.95),
               fill=rgba(shadow, 64))
    sd.ellipse(box(cx - fw * 0.38, top + fh * 0.74, cx + fw * 0.30, top + fh * 1.04),
               fill=rgba(shadow, 70))
    sd.ellipse(box(cx - fw * 0.52, top + fh * 0.35, cx - fw * 0.16, top + fh * 0.62),
               fill=rgba(shadow, 26))
    sd.ellipse(box(cx + fw * 0.16, top + fh * 0.35, cx + fw * 0.52, top + fh * 0.62),
               fill=rgba(shadow, 32))
    shade = shade.filter(ImageFilter.GaussianBlur(u(20)))
    layer = Image.composite(Image.alpha_composite(layer, shade), layer, mask)
    # 高光：额头、脸颊、鼻梁
    light = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    ld = ImageDraw.Draw(light)
    warm = tuple(min(255, int(v * 1.08)) for v in skin)
    ld.ellipse(box(cx - fw * 0.30, top + fh * 0.10, cx + fw * 0.04, top + fh * 0.34),
               fill=rgba(warm, 48))
    ld.ellipse(box(cx - fw * 0.42, top + fh * 0.50, cx - fw * 0.12, top + fh * 0.66),
               fill=rgba(warm, 34))
    ld.line(pts([(cx - 4, top + fh * 0.50), (cx - 6, top + fh * 0.58)]),
            fill=rgba(warm, 40), width=u(3), joint='curve')
    light = light.filter(ImageFilter.GaussianBlur(u(12)))
    layer = Image.composite(Image.alpha_composite(layer, light), layer, mask)
    return layer


def draw_eye(d, cx, cy, ew, eh, iris, lash=True, look=0):
    pts_eye = [(cx - ew / 2, cy), (cx - ew * 0.22, cy - eh / 2),
               (cx + ew * 0.22, cy - eh / 2), (cx + ew / 2, cy),
               (cx + ew * 0.22, cy + eh / 2), (cx - ew * 0.22, cy + eh / 2)]
    d.polygon(pts(pts_eye), fill=rgba((242, 238, 232)))
    ix = cx + look
    r = eh * 0.62
    d.ellipse(box(ix - r, cy - r, ix + r, cy + r), fill=rgba(iris))
    d.ellipse(box(ix - r * 0.46, cy - r * 0.46, ix + r * 0.46, cy + r * 0.46),
              fill=rgba((18, 14, 22)))
    d.ellipse(box(ix - r * 0.55, cy - r * 0.62, ix - r * 0.10, cy - r * 0.18),
              fill=rgba((255, 255, 255), 235))
    if lash:
        d.line(pts([(cx - ew / 2, cy), (cx - ew * 0.22, cy - eh / 2),
                    (cx + ew * 0.22, cy - eh / 2), (cx + ew / 2, cy)]),
               fill=rgba((28, 20, 28)), width=u(2.4))


def draw_features(layer, job):
    d = ImageDraw.Draw(layer)
    cx = 256
    style = job['style']
    skin = job['skin']
    shadow = job['skin_shadow']
    hair = job['hair']
    eye_y = job['eye_y']
    eye_off = job['eye_off']
    # 眉毛
    bw = 15 if style != 'susu' else 13
    for side in (-1, 1):
        ex = cx + side * eye_off
        if style == 'luci':
            brow = [(ex - bw, eye_y - 21), (ex, eye_y - 28), (ex + bw, eye_y - 22)]
        elif style == 'jiangyu':
            brow = [(ex - bw, eye_y - 25), (ex + 2, eye_y - 29), (ex + bw, eye_y - 19)]
        elif style == 'susu':
            brow = [(ex - bw, eye_y - 22), (ex, eye_y - 26), (ex + bw, eye_y - 21)]
        else:
            brow = [(ex - bw, eye_y - 23), (ex, eye_y - 26), (ex + bw, eye_y - 23)]
        d.line(pts(brow), fill=rgba(tuple(int(v * 0.9) for v in hair), 225),
               width=u(4.2 if style != 'susu' else 3.6), joint='curve')
    # 眼睛
    ew = 38 if style != 'susu' else 40
    eh = 13 if style in ('shenyan', 'luci') else (16 if style == 'jiangyu' else 20)
    for side in (-1, 1):
        draw_eye(d, cx + side * eye_off, eye_y, ew, eh, job['iris'],
                 look=side * 2)
    # 眼影（江屿）
    if style == 'jiangyu':
        sh = Image.new('RGBA', (W, W), (0, 0, 0, 0))
        sd = ImageDraw.Draw(sh)
        for side in (-1, 1):
            sd.ellipse(box(cx + side * eye_off - 22, eye_y - 16,
                           cx + side * eye_off + 22, eye_y + 4),
                       fill=rgba((92, 62, 92), 52))
        sh = sh.filter(ImageFilter.GaussianBlur(u(8)))
        layer = Image.alpha_composite(layer, sh)
        d = ImageDraw.Draw(layer)
    # 鼻子
    d.line(pts([(cx + 1, eye_y + 20), (cx - 2, eye_y + 36)]),
           fill=rgba(shadow, 78), width=u(2), joint='curve')
    d.line(pts([(cx - 6, eye_y + 38), (cx + 5, eye_y + 38)]),
           fill=rgba(shadow, 45), width=u(1.6))
    # 嘴唇
    mouth_y = eye_y + 66
    if style == 'susu':
        d.polygon(pts([(cx - 22, mouth_y), (cx - 8, mouth_y - 5), (cx, mouth_y - 2),
                       (cx + 8, mouth_y - 5), (cx + 22, mouth_y),
                       (cx + 10, mouth_y + 12), (cx, mouth_y + 14),
                       (cx - 10, mouth_y + 12)]), fill=rgba(job['lip']))
        d.polygon(pts([(cx - 14, mouth_y + 1), (cx, mouth_y + 2), (cx + 14, mouth_y + 1),
                       (cx + 8, mouth_y + 7), (cx - 8, mouth_y + 7)]),
                  fill=rgba((250, 244, 236)))
    else:
        d.line(pts([(cx - 20, mouth_y), (cx - 6, mouth_y - 4), (cx + 6, mouth_y - 4),
                    (cx + 20, mouth_y)]), fill=rgba(job['lip']), width=u(4), joint='curve')
        d.line(pts([(cx - 14, mouth_y + 5), (cx, mouth_y + 7), (cx + 14, mouth_y + 5)]),
               fill=rgba(tuple(int(v * 0.82) for v in job['lip'])), width=u(2.4), joint='curve')
        if style == 'luci':
            d.line(pts([(cx + 16, mouth_y - 2), (cx + 22, mouth_y - 6)]),
                   fill=rgba(shadow, 90), width=u(1.6))
    # 腮红
    blush = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    bd = ImageDraw.Draw(blush)
    for side in (-1, 1):
        bd.ellipse(box(cx + side * 84 - 28, eye_y + 28, cx + side * 84 + 28, eye_y + 54),
                   fill=rgba((214, 108, 118), 34 if style != 'susu' else 60))
    blush = blush.filter(ImageFilter.GaussianBlur(u(14)))
    return Image.alpha_composite(layer, blush)


def draw_hair_front(layer, job):
    d = ImageDraw.Draw(layer)
    hair = job['hair']
    hi = job['hair_hi']
    style = job['style']
    if style == 'shenyan':
        d.polygon(pts([(224, 104), (282, 110), (332, 148), (364, 210),
                       (330, 222), (292, 186), (256, 148), (228, 126)]), fill=rgba(hair))
        d.polygon(pts([(224, 104), (202, 148), (174, 192), (160, 188),
                       (170, 152), (198, 118)]), fill=rgba(hair))
        d.polygon(pts([(158, 196), (170, 244), (178, 262), (174, 232)]), fill=rgba(hair))
        d.polygon(pts([(354, 196), (342, 244), (334, 262), (338, 232)]), fill=rgba(hair))
        d.line(pts([(238, 114), (280, 140), (322, 180)]), fill=rgba(hi), width=u(2.6), joint='curve')
        d.line(pts([(218, 118), (194, 154), (172, 186)]), fill=rgba(hi), width=u(2), joint='curve')
        d.line(pts([(344, 210), (334, 262), (330, 288)]), fill=rgba(hi), width=u(1.8), joint='curve')
    elif style == 'luci':
        d.polygon(pts([(150, 210), (162, 160), (196, 118), (252, 100),
                       (308, 112), (350, 152), (366, 212)]), fill=rgba(hair))
        spikes = [(150, 210), (172, 244), (186, 214), (206, 252), (222, 220),
                  (242, 256), (260, 222), (280, 252), (298, 218), (320, 248),
                  (336, 212), (366, 212), (350, 160), (308, 112), (252, 100),
                  (196, 118), (162, 160)]
        d.polygon(pts(spikes), fill=rgba(hair))
        for sx, sy, ex, ey in [(176, 214, 196, 172), (214, 220, 236, 174),
                               (258, 224, 276, 176), (306, 218, 322, 174)]:
            d.line(pts([(sx, sy), (ex, ey)]), fill=rgba(hi), width=u(1.8))
        d.line(pts([(168, 200), (190, 150), (220, 124)]), fill=rgba(hi), width=u(2.4), joint='curve')
    elif style == 'jiangyu':
        d.polygon(pts([(204, 132), (252, 142), (292, 188), (280, 226),
                       (242, 210), (210, 172)]), fill=rgba(hair))
        d.polygon(pts([(248, 116), (300, 136), (340, 186), (344, 238),
                       (316, 230), (286, 190), (258, 154)]), fill=rgba(hair))
        d.polygon(pts([(152, 228), (168, 286), (188, 312), (176, 256)]), fill=rgba(hair))
        d.polygon(pts([(362, 226), (344, 286), (326, 310), (338, 254)]), fill=rgba(hair))
        d.line(pts([(252, 124), (300, 152), (336, 198)]), fill=rgba(hi), width=u(2.4), joint='curve')
        d.line(pts([(222, 146), (204, 186), (184, 232)]), fill=rgba(hi), width=u(1.8), joint='curve')
        d.line(pts([(282, 158), (312, 200), (330, 240)]), fill=rgba(hi), width=u(1.6), joint='curve')
    else:  # susu 齐刘海
        d.polygon(pts([(146, 206), (154, 152), (194, 114), (256, 102),
                       (318, 114), (358, 152), (366, 206)]), fill=rgba(hair))
        d.pieslice(box(148, 118, 364, 300), 180, 360, fill=rgba(hair))
        d.polygon(pts([(156, 188), (190, 182), (224, 190), (256, 184),
                       (288, 190), (322, 182), (356, 188), (350, 228),
                       (320, 242), (290, 232), (256, 240), (222, 232),
                       (192, 242), (162, 228)]), fill=rgba(hair))
        d.polygon(pts([(146, 208), (156, 314), (180, 384), (164, 296)]), fill=rgba(hair))
        d.polygon(pts([(366, 208), (356, 314), (332, 384), (348, 296)]), fill=rgba(hair))
        d.line(pts([(186, 130), (232, 120), (282, 124)]), fill=rgba(hi), width=u(3.2), joint='curve')
        d.line(pts([(170, 204), (232, 198), (288, 202)]), fill=rgba(hi), width=u(1.5), joint='curve')
        d.line(pts([(206, 196), (200, 218), (204, 234)]), fill=rgba(hair), width=u(2))
        d.line(pts([(300, 194), (306, 216), (302, 232)]), fill=rgba(hair), width=u(2))
        # 发夹
        d.rounded_rectangle(box(320, 174, 340, 182), radius=u(4), fill=rgba((248, 206, 104)))
        d.rounded_rectangle(box(314, 188, 334, 196), radius=u(4), fill=rgba((248, 206, 104)))
    return layer


def draw_accessories(layer, job):
    d = ImageDraw.Draw(layer)
    style = job['style']
    cx = 256
    if style == 'shenyan':
        frame = rgba((214, 210, 232), 220)
        for side in (-1, 1):
            ex = cx + side * 42
            d.ellipse(box(ex - 28, job['eye_y'] - 20, ex + 28, job['eye_y'] + 20),
                      outline=frame, width=u(2))
        d.line(pts([(cx - 14, job['eye_y'] - 2), (cx + 14, job['eye_y'] - 2)]),
               fill=frame, width=u(1.8))
        d.line(pts([(cx - 70, job['eye_y'] - 4), (cx - 108, job['eye_y'] - 12)]),
               fill=frame, width=u(2))
        d.line(pts([(cx + 70, job['eye_y'] - 4), (cx + 108, job['eye_y'] - 12)]),
               fill=frame, width=u(2))
    elif style == 'luci':
        # 胸前相机
        d.line(pts([(196, 440), (222, 474)]), fill=rgba((54, 38, 28)), width=u(9))
        d.line(pts([(316, 440), (290, 474)]), fill=rgba((54, 38, 28)), width=u(9))
        d.line(pts([(196, 440), (222, 474)]), fill=rgba((112, 90, 64)), width=u(2))
        d.line(pts([(316, 440), (290, 474)]), fill=rgba((112, 90, 64)), width=u(2))
        d.rounded_rectangle(box(198, 458, 314, 512), radius=u(12), fill=rgba((42, 42, 48)))
        d.rounded_rectangle(box(198, 458, 314, 476), radius=u(7), fill=rgba((174, 176, 182)))
        d.rounded_rectangle(box(204, 462, 214, 472), radius=u(3), fill=rgba((58, 58, 64)))
        d.rounded_rectangle(box(298, 459, 310, 469), radius=u(3), fill=rgba((232, 218, 190)))
        d.ellipse(box(222, 472, 290, 512), fill=rgba((26, 26, 32)))
        d.ellipse(box(230, 480, 282, 512), fill=rgba((96, 102, 112)))
        d.ellipse(box(240, 490, 272, 512), fill=rgba((20, 24, 30)))
        d.ellipse(box(246, 484, 258, 496), fill=rgba((206, 216, 226)))
    elif style == 'jiangyu':
        # 耳环 + 项链
        for ex in (146, 366):
            d.ellipse(box(ex - 8, 300, ex + 8, 320), fill=rgba(job['skin']))
        d.ellipse(box(138, 304, 152, 320), outline=rgba((206, 208, 218)), width=u(2.2))
        d.ellipse(box(363, 310, 370, 317), fill=rgba((206, 208, 218)))
        d.line(pts([(224, 420), (256, 446), (288, 420)]),
               fill=rgba((198, 200, 212)), width=u(2))
        d.ellipse(box(251, 442, 261, 452), fill=rgba((208, 210, 222)))
    else:
        # 耳朵 + 金色耳环
        for ex in (140, 372):
            d.ellipse(box(ex - 10, 298, ex + 10, 324), fill=rgba(job['skin']))
            d.ellipse(box(ex - 4, 304, ex + 2, 318), fill=rgba(job['skin_shadow'], 45))
            d.ellipse(box(ex - 9, 304, ex + 9, 322), outline=rgba((250, 202, 92)), width=u(3))
    return layer


def add_rim_light(layer, job):
    accent = job['accent']
    style = job['style']
    rim = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    rd = ImageDraw.Draw(rim)
    if style == 'susu':
        rd.line(pts([(358, 160), (380, 250), (370, 350)]), fill=rgba(accent, 70), width=u(4))
    else:
        rd.line(pts([(348, 140), (376, 230), (368, 330), (344, 382)]),
                fill=rgba(accent, 72), width=u(4), joint='curve')
    rd.line(pts([(370, 438), (396, 478), (408, 512)]), fill=rgba(accent, 55), width=u(3))
    rim = rim.filter(ImageFilter.GaussianBlur(u(6)))
    return Image.alpha_composite(layer, rim)


def add_motif(img, job):
    style = job['style']
    accent = job['accent']
    layer = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    if style == 'shenyan':
        # 美术馆画框
        d.rectangle(box(38, 62, 148, 300), outline=rgba((176, 146, 92), 55), width=u(2))
        d.rectangle(box(50, 74, 136, 288), outline=rgba((176, 146, 92), 38), width=u(1))
        d.rectangle(box(348, 92, 474, 250), outline=rgba((176, 146, 92), 32), width=u(1))
    elif style == 'luci':
        # 胶卷齿孔
        for y in (28, 88, 148, 208, 268, 328):
            d.rounded_rectangle(box(20, y, 40, y + 26), radius=u(4),
                                fill=rgba((160, 140, 96), 26))
    elif style == 'jiangyu':
        # 舞台麦架与聚光
        d.line(pts([(404, 52), (394, 512)]), fill=rgba(accent, 46), width=u(3))
        d.ellipse(box(390, 34, 420, 64), outline=rgba(accent, 60), width=u(2))
        d.polygon(pts([(330, 0), (460, 0), (510, 512), (280, 512)]),
                  fill=rgba(accent, 12))
    else:
        # 聊天气泡
        d.rounded_rectangle(box(52, 54, 172, 124), radius=u(18),
                            outline=rgba((248, 206, 104), 58), width=u(2))
        d.polygon(pts([(92, 122), (108, 152), (124, 122)]),
                  fill=rgba((248, 206, 104), 58))
        d.ellipse(box(86, 86, 96, 96), fill=rgba((248, 206, 104), 70))
        d.ellipse(box(110, 86, 120, 96), fill=rgba((248, 206, 104), 70))
        d.ellipse(box(134, 86, 144, 96), fill=rgba((248, 206, 104), 70))
    layer = layer.filter(ImageFilter.GaussianBlur(u(1.2)))
    return Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')


def bottom_fade(img, strength=0.42):
    yy = np.arange(W, dtype=np.float32)[:, None, None] / W
    f = np.clip((yy - 0.52) / 0.48, 0, 1) ** 1.4 * strength
    arr = np.asarray(img, dtype=np.float32) * (1 - f)
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def bloom(img, threshold=180, radius=8, strength=0.32):
    arr = np.asarray(img, dtype=np.float32)
    lum = arr.max(axis=2)
    m = np.clip((lum - threshold) / (255 - threshold), 0, 1) ** 1.5
    b = Image.fromarray(np.clip(arr * m[..., None], 0, 255).astype(np.uint8))
    b = b.filter(ImageFilter.GaussianBlur(radius))
    return Image.fromarray(np.clip(arr + np.asarray(b, dtype=np.float32) * strength,
                                   0, 255).astype(np.uint8))


def film_grade(img, contrast=1.06, lift=0.012, sat=1.02):
    arr = np.asarray(img, dtype=np.float32) / 255.0
    arr = arr * (1 - lift) + lift
    arr = np.clip((arr - 0.5) * contrast + 0.5, 0, 1)
    arr = arr * arr * (3 - 2 * arr) * 0.22 + arr * 0.78
    luma = (arr @ np.array([0.299, 0.587, 0.114], dtype=np.float32))[..., None]
    arr = luma + (arr - luma) * sat
    return Image.fromarray(np.clip(arr * 255, 0, 255).astype(np.uint8))


def vignette(img, strength=0.42):
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
    dx = (xx - S / 2) / (S * 0.66)
    dy = (yy - S / 2) / (S * 0.66)
    d = np.sqrt(dx * dx + dy * dy)
    mask = np.clip(1 - strength * np.clip(d - 0.4, 0, None) ** 1.4, 0.2, 1)
    arr = np.asarray(img, dtype=np.float32) * mask[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def grain(img, seed, amount=3.0):
    rng = np.random.default_rng(seed)
    arr = np.asarray(img, dtype=np.float32)
    arr = arr + rng.normal(0, amount, (S, S, 1))
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


def finish(img, seed):
    img = img.resize((S, S), Image.LANCZOS)
    img = bloom(img, strength=0.24)
    img = img.filter(ImageFilter.GaussianBlur(0.25))
    img = film_grade(img)
    img = vignette(img)
    img = grain(img, seed, 2.6)
    return img


def save(img, name):
    path = os.path.join(OUT, f'{name}.jpg')
    for q in range(90, 77, -2):
        img.save(path, 'JPEG', quality=q, optimize=True, progressive=True)
        if os.path.getsize(path) < 100 * 1024:
            break
    print(f'✓ {path} ({os.path.getsize(path) // 1024} KB, q={q})')


JOBS = {
    'shenyan': dict(
        style='shenyan', name='沈砚之',
        bg1=(12, 10, 28), bg2=(44, 24, 68), glow=(122, 92, 255),
        accent=(122, 92, 255), bokeh=[(122, 92, 255), (57, 214, 255), (255, 95, 168)],
        hair=(30, 26, 42), hair_hi=(92, 76, 124), skin=(229, 196, 178),
        skin_shadow=(174, 130, 128), jacket=(28, 27, 44), jacket_hi=(66, 62, 96),
        lip=(168, 96, 108), iris=(118, 92, 150),
        face_top=118, face_w=216, face_h=292, jaw=0.40, eye_y=258, eye_off=43,
    ),
    'luci': dict(
        style='luci', name='陆辞',
        bg1=(8, 22, 20), bg2=(20, 54, 42), glow=(74, 222, 128),
        accent=(74, 222, 128), bokeh=[(74, 222, 128), (255, 190, 110), (57, 214, 255)],
        hair=(32, 27, 24), hair_hi=(98, 82, 62), skin=(203, 156, 122),
        skin_shadow=(148, 102, 78), jacket=(45, 54, 44), jacket_hi=(92, 106, 82),
        lip=(160, 92, 82), iris=(112, 78, 42),
        face_top=122, face_w=220, face_h=286, jaw=0.44, eye_y=260, eye_off=44,
    ),
    'jiangyu': dict(
        style='jiangyu', name='江屿',
        bg1=(24, 10, 28), bg2=(62, 28, 64), glow=(192, 132, 252),
        accent=(192, 132, 252), bokeh=[(192, 132, 252), (255, 95, 168), (255, 190, 110)],
        hair=(48, 34, 52), hair_hi=(116, 88, 122), skin=(219, 174, 146),
        skin_shadow=(160, 112, 100), jacket=(24, 22, 32), jacket_hi=(64, 54, 72),
        lip=(172, 94, 108), iris=(126, 96, 62),
        face_top=116, face_w=220, face_h=292, jaw=0.40, eye_y=256, eye_off=44,
    ),
    'susu': dict(
        style='susu', name='苏苏',
        bg1=(38, 24, 8), bg2=(78, 48, 14), glow=(251, 191, 36),
        accent=(251, 191, 36), bokeh=[(251, 191, 36), (255, 95, 168), (255, 190, 110)],
        hair=(92, 54, 32), hair_hi=(156, 102, 56), skin=(238, 194, 166),
        skin_shadow=(182, 130, 110), jacket=(196, 142, 52), jacket_hi=(234, 182, 88),
        lip=(198, 88, 92), iris=(92, 58, 32),
        face_top=128, face_w=228, face_h=278, jaw=0.42, eye_y=266, eye_off=45,
    ),
}


def make(job, seed):
    img = gradient([(0.0, job['bg1']), (0.55, job['bg2']),
                    (1.0, tuple(int(v * 0.55) for v in job['bg2']))], diag=0.18)
    img = add_glow(img, 256, 260, 240, job['glow'], 0.34)
    img = add_glow(img, 104, 86, 250, job['glow'], 0.14)
    img = add_bokeh(img, seed, 30, job['bokeh'])
    img = add_light_leak(img, seed + 1, job['glow'])
    img = add_motif(img, job)
    layer = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    layer = draw_hair_back(layer, job)
    layer = draw_neck(layer, job)
    layer = draw_torso(layer, job)
    layer = draw_face(layer, job)
    layer = draw_features(layer, job)
    layer = draw_hair_front(layer, job)
    layer = draw_accessories(layer, job)
    layer = add_rim_light(layer, job)
    img = Image.alpha_composite(img.convert('RGBA'), layer).convert('RGB')
    img = bottom_fade(img)
    return finish(img, seed)


if __name__ == '__main__':
    for i, (name, job) in enumerate(JOBS.items()):
        save(make(job, 700 + i * 17), name)
