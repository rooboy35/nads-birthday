"""Build a genuine QR with Nads' face, cap and beard; verify the rendered files.

Optional authoring dependencies: pip install -r scripts/requirements-qr.txt
The website itself has no Python or third-party runtime dependency.
"""
from pathlib import Path
from io import BytesIO
from html import escape
import base64
import math
import json
import segno
import zxingcpp
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts' / 'qr'
OUT.mkdir(parents=True, exist_ok=True)
URL = 'https://cheery-salamander-a64a94.netlify.app/'
INK, PAPER, RED, GOLD = '#24231f', '#fff5d9', '#e64530', '#f9ce41'
qr = segno.make_qr(URL, error='h')
matrix = tuple(qr.matrix)
n, scale, border = len(matrix), 24, 4
size = (n + border * 2) * scale

# Use the supplied real photo. Only this derived portrait is composited; originals stay intact.
original = Image.open(ROOT / 'public/images/nads-reference-3.jpg').convert('RGB')
w, h = original.size
portrait = ImageOps.fit(original.crop((int(w*.19), int(h*.14), int(w*.85), int(h*.87))), (216,216), centering=(.5,.47))
buffer = BytesIO()
portrait.save(buffer, format='JPEG', quality=94)
portrait_data = base64.b64encode(buffer.getvalue()).decode('ascii')


def code_art():
    image = Image.new('RGB', (size, size), 'white')
    draw = ImageDraw.Draw(image)
    svg = [f'<rect width="{size}" height="{size}" fill="white"/>']
    finder_origins = ((0,0), (n-7,0), (0,n-7))
    for y, row in enumerate(matrix):
        for x, dark in enumerate(row):
            if not dark or any(fx <= x < fx+7 and fy <= y < fy+7 for fx,fy in finder_origins):
                continue
            px, py = (x+border)*scale, (y+border)*scale
            draw.rounded_rectangle((px,py,px+scale-1,py+scale-1), radius=3, fill=INK)
            svg.append(f'<rect x="{px}" y="{py}" width="{scale}" height="{scale}" rx="3" fill="{INK}"/>')
    for x,y in finder_origins:
        px,py = (x+border)*scale,(y+border)*scale
        for inset, modules, colour, radius in [(0,7,INK,28),(1,5,'white',18),(2,3,INK,12)]:
            p,q = px+inset*scale,py+inset*scale
            side = modules*scale
            draw.rounded_rectangle((p,q,p+side-1,q+side-1), radius=radius, fill=colour)
            svg.append(f'<rect x="{p}" y="{q}" width="{side}" height="{side}" rx="{radius}" fill="{colour}"/>')
    centre = size//2
    radius = 122
    draw.ellipse((centre-radius,centre-radius,centre+radius,centre+radius), fill='white')
    mask = Image.new('L', portrait.size)
    ImageDraw.Draw(mask).ellipse((0,0,215,215), fill=255)
    image.paste(portrait, (centre-108,centre-108), mask)
    draw.ellipse((centre-109,centre-109,centre+109,centre+109), outline=GOLD, width=5)
    svg.extend([
        f'<circle cx="{centre}" cy="{centre}" r="122" fill="white"/>',
        f'<defs><clipPath id="portrait"><circle cx="{centre}" cy="{centre}" r="108"/></clipPath></defs>',
        f'<image x="{centre-108}" y="{centre-108}" width="216" height="216" href="data:image/jpeg;base64,{portrait_data}" clip-path="url(#portrait)"/>',
        f'<circle cx="{centre}" cy="{centre}" r="109" fill="none" stroke="{GOLD}" stroke-width="5"/>'
    ])
    return image, ''.join(svg)


def svg_document(width, height, content):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}"><title>Nads’ birthday QR code</title><desc>Scan to open {escape(URL)}. Actual Nads portrait; high error correction and four-module quiet zone.</desc>{content}</svg>'


plain, code_svg = code_art()
plain.save(OUT/'nads-qr-code.png', dpi=(300,300))
(OUT/'nads-qr-code.svg').write_text(svg_document(size,size,code_svg))

W,H = 1600,2150
poster = Image.new('RGB',(W,H),PAPER)
draw = ImageDraw.Draw(poster)
svg = [f'<rect width="{W}" height="{H}" fill="{PAPER}"/>']


def polygon(points, fill):
    draw.polygon(points, fill=fill)
    svg.append(f'<polygon points="{" ".join(f"{x},{y}" for x,y in points)}" fill="{fill}"/>')


def text(label, y, pixels, colour=INK, font='Impact', family="Impact, 'Arial Black', sans-serif"):
    font_path = '/System/Library/Fonts/Supplemental/Impact.ttf' if font=='Impact' else '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
    face = ImageFont.truetype(font_path,pixels)
    box = draw.textbbox((0,0),label,font=face)
    x = (W-(box[2]-box[0]))/2
    draw.text((x,y-box[1]),label,font=face,fill=colour)
    svg.append(f'<text x="800" y="{y}" dominant-baseline="text-before-edge" text-anchor="middle" font-family="{family}" font-size="{pixels}" fill="{colour}">{escape(label)}</text>')


text("NADS’ BIRTHDAY / ADULT SUPERVISION REQUIRED",65,27,font='Arial')

# A cap and beard OUTSIDE the QR's white quiet zone: styling never reshapes the data.
cap = [(390+410*(1-math.cos(t)),365-205*math.sin(t)) for t in [i*math.pi/80 for i in range(81)]]
polygon(cap,INK)
draw.ellipse((278,330,1330,416),fill=INK)
svg.append(f'<ellipse cx="804" cy="373" rx="526" ry="43" fill="{INK}"/>')
text('NADS',222,88,PAPER)

qx,qy = (W-size)//2,420
poster.paste(plain,(qx,qy))
svg.append(f'<g transform="translate({qx},{qy})">{code_svg}</g>')
beard_top = qy+size+7
beard = [(qx+25,beard_top),(qx+size-25,beard_top),(qx+size-115,beard_top+80),(qx+size-190,beard_top+115),(1010,beard_top+142),(938,beard_top+126),(800,beard_top+210),(665,beard_top+127),(590,beard_top+146),(qx+182,beard_top+120),(qx+100,beard_top+77)]
polygon(beard,INK)
for x in [625,785,945]:
    polygon([(x,beard_top+22),(x+8,beard_top+78),(x+17,beard_top+27)],'#49463e')
text('SCAN THE BIG',1855,63)
text('BEARDED BABY.',1928,95,RED)
text('3% MATURITY. 100% FUCKING LEGEND.',2060,25,font='Arial')
poster.save(OUT/'nads-birthday-qr.png',dpi=(300,300),optimize=True)
(OUT/'nads-birthday-qr.svg').write_text(svg_document(W,H,''.join(svg)))

# Decode final composited artwork, not just the untouched source matrix.
cases = {'code-full':plain,'poster-full':poster}
for width in (800,480,320):
    cases[f'poster-{width}px'] = poster.resize((width,round(H*width/W)),Image.Resampling.LANCZOS)
cases['poster-grayscale'] = poster.convert('L')
cases['poster-rotated-12deg'] = poster.rotate(12,expand=True,fillcolor='white')
cases['poster-light-blur'] = poster.filter(ImageFilter.GaussianBlur(1.1))
report = {'url':URL,'qr_designator':qr.designator,'error_correction':qr.error,'quiet_zone_modules':border,'files':[],'checks':{}}
for name,img in cases.items():
    decoded = [barcode.text for barcode in zxingcpp.read_barcodes(img)]
    assert URL in decoded, f'{name} failed to decode: {decoded}'
    report['checks'][name] = 'decoded exact URL'
for name in ('nads-qr-code.png','nads-qr-code.svg','nads-birthday-qr.png','nads-birthday-qr.svg'):
    report['files'].append({'name':name,'bytes':(OUT/name).stat().st_size})
(OUT/'verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
