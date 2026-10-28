"""Compose official logo and existing product captures; no generated imagery."""
import base64
import json
import subprocess
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
INK, MUTED, BRAND, STROKE = '#1d1d1f', '#6e6e73', '#5647de', '#eaeaf0'


def text(x, y, value, size=30, fill=INK, weight=400):
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" font-weight="{weight}">{escape(value)}</text>'


def shot(index, x, y, width, height, crop=None):
    encoded = base64.b64encode((REPO / f'src/assets/product-screen-{index}.jpg').read_bytes()).decode()
    view = crop or '0 0 1600 1000'
    return f'''<rect x="{x-1}" y="{y-1}" width="{width+2}" height="{height+2}" rx="18" fill="white" stroke="{STROKE}" stroke-width="2"/>
    <svg x="{x}" y="{y}" width="{width}" height="{height}" viewBox="{view}" overflow="hidden" preserveAspectRatio="xMidYMid meet">
    <image width="1600" height="1000" xlink:href="data:image/jpeg;base64,{encoded}"/>
    </svg>'''


def render():
    logo = (REPO / 'public/favicon.svg').read_text()
    logo = logo.replace('viewBox="0 0 160 160"', 'x="64" y="65" width="64" height="64" viewBox="0 0 160 160"')
    for i, item in enumerate(json.loads((ROOT / 'copy.json').read_text()), 1):
        parts = [f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="1600" viewBox="0 0 1200 1600"><rect width="1200" height="1600" fill="#fdfdfe"/><g font-family="-apple-system, BlinkMacSystemFont, PingFang SC, Helvetica Neue, sans-serif">', logo]
        parts += [text(142, 112, 'Vease App', 38, weight=600), text(1118, 108, f'0{i}', 22, MUTED)]
        parts += [f'<path d="M64 157H1136" stroke="{STROKE}"/>', text(64, 219, item['eyebrow'], 25, BRAND, 500)]
        for j, line in enumerate(item['headline']):
            parts.append(text(600 if i == 1 else 64, 316 + 88*j, line, 74, weight=700).replace('<text ', '<text text-anchor="middle" ', 1) if i == 1 else text(64, 316 + 88*j, line, 74, weight=700))
        parts.append(text(600 if i == 1 else 66, 461, item['subtitle'], 28, MUTED).replace('<text ', '<text text-anchor="middle" ', 1) if i == 1 else text(66, 461, item['subtitle'], 28, MUTED))
        if i == 1:
            parts.append(shot(2, 64, 520, 1072, 670))
            for x, label, description in [(64, '01  导入素材', '从一个文件夹开始'), (436, '02  AI 帮你剪', '先整理，再看一版'), (808, '03  你来确认', '预览、调整、导出')]:
                parts += [f'<path d="M{x} 1280h328" stroke="{STROKE}"/>', text(x, 1338, label, 29, weight=600), text(x, 1388, description, 24, MUTED)]
        elif i == 2:
            parts.append('<rect x="40" y="495" width="1120" height="960" rx="24" fill="#f5f5fa"/>')
            parts.append(shot(1, 64, 520, 1072, 844, '270 140 890 700'))
            parts.append(text(66, 1420, item['note'], 26, MUTED))
        elif i == 3:
            parts.append(shot(2, 64, 520, 1072, 768, '278 145 865 620'))
            parts += [f'<rect x="64" y="1340" width="1072" height="100" rx="16" fill="#f5f5fa" stroke="{STROKE}"/>', text(96, 1401, '“' + item['note'] + '”', 31, BRAND, 500)]
        else:
            parts.append(shot(1, 64, 520, 1072, 670))
            parts += [text(64, 1270, '整理镜头', 34, weight=600), text(470, 1270, '决定故事', 34, weight=600), text(876, 1270, '预览导出', 34, weight=600), f'<path d="M280 1258h120m-12-8 12 8-12 8M686 1258h120m-12-8 12 8-12 8" stroke="{BRAND}" fill="none" stroke-width="2"/>', text(64, 1370, item['note'], 29, MUTED)]
        parts += [f'<path d="M64 1480H1136" stroke="{STROKE}"/>', text(64, 1530, 'macOS · Apple Silicon · 邀请内测中', 23, MUTED), text(912, 1530, '示例项目界面', 23, MUTED), '</g></svg>']
        svg = ROOT / (item['name'] + '.svg')
        svg.write_text('\n'.join(parts))
        subprocess.run(['rsvg-convert', str(svg), '-o', str(svg.with_suffix('.png'))], check=True)


if __name__ == '__main__':
    render()
