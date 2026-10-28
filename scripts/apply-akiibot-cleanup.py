"""Replay the reviewed alpha-only sprite cleanup without redrawing or resampling.

Requires Pillow. Run from the portfolio-update directory, then import with:
node scripts/prepare-akiibot.mjs --zip output/akiibot-sprites-cleaned.zip
"""
from hashlib import sha256
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json

from PIL import Image, ImageChops


def main():
    root = Path(__file__).resolve().parent.parent
    assets = root / "assets/akiibot-cleanup"
    report = json.loads((assets / "report.json").read_text())
    source = root / "public/akiibot" / report["sourceVersion"]
    output = root / "output/akiibot-sprites-cleaned.zip"
    output.parent.mkdir(exist_ok=True)
    with ZipFile(output, "w", ZIP_DEFLATED) as archive:
        for sheet in report["sheets"]:
            path = source / sheet["file"]
            if sha256(path.read_bytes()).hexdigest() != sheet["sourceSha256"]:
                raise ValueError(f"Original changed: {path.name}")
            image = Image.open(path).convert("RGBA")
            erase = Image.open(assets / "masks" / path.name).convert("L")
            if image.size != (576, 96) or erase.size != image.size:
                raise ValueError("Unexpected sheet or mask dimensions")
            if set(erase.tobytes()) - {0, 255}:
                raise ValueError("Cleanup mask must be binary")
            image.putalpha(ImageChops.subtract(image.getchannel("A"), erase))
            encoded = BytesIO()
            image.save(encoded, format="PNG")
            archive.writestr("akiibot-sprites/" + path.name, encoded.getvalue())
    print(f"Replayed nine alpha masks; original artwork retained: {output}")


if __name__ == "__main__":
    main()
