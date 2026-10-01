"""
Compose store-listing screenshots (1280x800) from the raw popup screenshots.

Each input is centered on a plain brand-teal background with a soft shadow.
Inputs are the README screenshots in images/; outputs go to release/screenshots/
(gitignored). Requires Pillow (`pip install pillow`); not part of the npm build.

Usage: python scripts/store-screenshots.py [input.png ...]
"""

import sys
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "release" / "screenshots"
DEFAULT_INPUTS = [ROOT / "images" / "b-b-e-entry.png", ROOT / "images" / "b-b-e-otp.png"]

CANVAS = (1280, 800)
BACKGROUND = (31, 165, 160)  # Buttercup teal
MAX_HEIGHT = 680  # leaves ~60px above and below the popup
SHADOW_OFFSET = (0, 14)
SHADOW_BLUR = 22
SHADOW_ALPHA = 90


def compose(source: Path) -> Path:
    shot = Image.open(source).convert("RGBA")
    scale = MAX_HEIGHT / shot.height
    shot = shot.resize((round(shot.width * scale), MAX_HEIGHT), Image.LANCZOS)

    canvas = Image.new("RGBA", CANVAS, BACKGROUND + (255,))
    x = (CANVAS[0] - shot.width) // 2
    y = (CANVAS[1] - shot.height) // 2

    shadow = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    shadow.paste((0, 0, 0, SHADOW_ALPHA), (x + SHADOW_OFFSET[0], y + SHADOW_OFFSET[1], x + shot.width + SHADOW_OFFSET[0], y + shot.height + SHADOW_OFFSET[1]))
    shadow = shadow.filter(ImageFilter.GaussianBlur(SHADOW_BLUR))

    canvas = Image.alpha_composite(canvas, shadow)
    canvas.alpha_composite(shot, (x, y))

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    target = OUT_DIR / f"{source.stem}-1280x800.png"
    canvas.convert("RGB").save(target, optimize=True)
    return target


if __name__ == "__main__":
    inputs = [Path(arg) for arg in sys.argv[1:]] or DEFAULT_INPUTS
    for source in inputs:
        print(compose(source))
