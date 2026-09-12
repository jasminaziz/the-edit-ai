"""Draw every raster icon from public/favicon.svg. Never deployed.

Run from the repo root:  python3 assets-src/render-icons.py
Needs Google Chrome and Pillow (pip install pillow).

Why a script: until 12 Sep 2026 the .ico frames and the PNGs came from
different renderers, so the 16px PNG fused its capsules into one blob, the
32 and 64 were drawn without anti-aliasing, and no two files of the same
size matched. Here every size is Chrome's own render of the one SVG.

Writes into public/:
  favicon.ico           16, 32 and 48 frames
  apple-touch-icon.png  180, mark inset to 84% so it clears the iOS corner
                        mask; full-bleed cobalt, because iOS paints
                        transparency black
  favicon-192.png       manifest icon ("any")
  favicon-512.png       manifest icon ("any")
  favicon-512-maskable.png  mark inset to 74%, inside Android's 80% safe circle
"""
import io, re, struct, subprocess, tempfile, pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
MARK = re.sub(r"<svg[^>]*>|</svg>|<!--.*?-->", "", (PUBLIC / "favicon.svg").read_text(), flags=re.S)


def render(px, inset=1.0):
    body = MARK
    if inset != 1.0:  # shrink the mark onto a full-bleed cobalt square
        t = 16 * (1 - inset)
        body = f'<rect width="32" height="32" fill="#2D35C9"/><g transform="translate({t} {t}) scale({inset})">{MARK}</g>'
    html = f'<html><body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="{px}" height="{px}" style="display:block">{body}</svg></body></html>'
    with tempfile.TemporaryDirectory() as d:
        page, shot = pathlib.Path(d, "i.html"), pathlib.Path(d, "i.png")
        page.write_text(html)
        # Headless Chrome will not lay out below 500px, so render at 0,0 in a
        # 500px window and crop.
        w = max(500, px)
        subprocess.run([CHROME, "--headless=new", "--hide-scrollbars", "--force-device-scale-factor=1",
                        f"--window-size={w},{w}", f"--screenshot={shot}", page.as_uri()],
                       check=True, capture_output=True)
        return Image.open(shot).convert("RGBA").crop((0, 0, px, px))


def write_ico(frames, path):
    # PNG-compressed frames; the header is written by hand so each frame is
    # exactly the render above, not Pillow's own resample of one image.
    blobs = []
    for im in frames:
        b = io.BytesIO(); im.save(b, "PNG"); blobs.append(b.getvalue())
    out = struct.pack("<HHH", 0, 1, len(frames))
    offset = 6 + 16 * len(frames)
    for im, blob in zip(frames, blobs):
        out += struct.pack("<BBBBHHII", im.width % 256, im.height % 256, 0, 0, 1, 32, len(blob), offset)
        offset += len(blob)
    path.write_bytes(out + b"".join(blobs))


write_ico([render(16), render(32), render(48)], PUBLIC / "favicon.ico")
render(180, 0.84).save(PUBLIC / "apple-touch-icon.png")
render(192).save(PUBLIC / "favicon-192.png")
render(512).save(PUBLIC / "favicon-512.png")
render(512, 0.74).save(PUBLIC / "favicon-512-maskable.png")
print("icons written to", PUBLIC)
