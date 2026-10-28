"""Build editable SVG posters and publishable PNGs from generated backgrounds."""
import base64
import json
import subprocess
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent


def render():
    for item in json.loads((ROOT / "copy.json").read_text()):
        name = item["name"]
        background = ROOT / "backgrounds" / f"{name}.png"
        encoded = base64.b64encode(background.read_bytes()).decode()
        color = item["color"]
        headline = "\n".join(
            f'<tspan x="88" dy="{0 if i == 0 else 105}">{escape(line)}</tspan>'
            for i, line in enumerate(item["headline"])
        )
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="1600" viewBox="0 0 1200 1600">
  <title>{escape(item['headline'][0])} · Vease App</title>
  <image width="1200" height="1600" preserveAspectRatio="xMidYMid slice" xlink:href="data:image/png;base64,{encoded}"/>
  <g id="editable-copy" fill="{color}" font-family="PingFang SC, Hiragino Sans GB, sans-serif">
    <text id="brand" x="88" y="115" font-size="38" font-weight="600" letter-spacing="1">Vease App</text>
    <text id="headline" x="88" y="255" font-size="86" font-weight="700" letter-spacing="-2">{headline}</text>
    <text id="subtitle" x="92" y="440" font-size="28">{escape(item['subtitle'])}</text>
    <rect x="68" y="1485" width="490" height="62" rx="31" fill="{'#12132c' if name == '03-neon-cinema' else '#ffffff'}" fill-opacity="0.88"/>
    <text id="availability" x="88" y="1525" font-size="23">macOS · Apple Silicon · 邀请内测中</text>
  </g>
</svg>'''
        path = ROOT / f"{name}.svg"
        path.write_text(svg)
        subprocess.run(["rsvg-convert", str(path), "-o", str(ROOT / f"{name}.png")], check=True)


if __name__ == "__main__":
    render()
