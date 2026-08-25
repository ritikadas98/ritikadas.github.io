# -*- coding: utf-8 -*-
"""Pack a folder of slide images into a 16:9 PDF.

    python build_pdf.py <image-dir> <out.pdf>

The companion to build.py: same pictures, same order, a PDF instead of a .pptx.
Pages measure exactly 13.333in x 7.5in, so the file is a true 16:9 deck and not
a deck letterboxed onto A4.

Why this rather than printing the deck from the browser: Chrome's print path
reflows a slide it never laid out, and on a cover with an absolutely placed
screenshot it fails outright — the shadow rasterises as a black block over the
headline and the screenshot runs off the page. Both PDFs in assets/decks were
wrong that way before this script existed. Photographing the slide and packing
the photograph cannot drift from what the web deck shows, which is the same
trade build.py already makes.

The cost is a PDF of pictures: the text is not selectable or searchable. If that
matters more than the cover being right, print from Chrome per the README and
check page one before sending it.
"""
import glob
import os
import sys

from PIL import Image

PAGE_W_IN = 13.333          # 16:9 at 7.5in tall
RASTER_W = 2560             # retina-sharp on a laptop, sane as a download
JPEG_QUALITY = 88


def build(img_dir, out_path):
    shots = sorted(glob.glob(os.path.join(img_dir, 'slide-*.png')))
    if not shots:
        sys.exit('no slide-*.png found in %s' % img_dir)

    pages = []
    for shot in shots:
        with Image.open(shot) as im:
            im = im.convert('RGB')
            pages.append(im.resize((RASTER_W, round(RASTER_W * im.height / im.width)),
                                   Image.LANCZOS))

    os.makedirs(os.path.dirname(out_path) or '.', exist_ok=True)
    pages[0].save(out_path, save_all=True, append_images=pages[1:],
                  resolution=RASTER_W / PAGE_W_IN, quality=JPEG_QUALITY, optimize=True)
    size = os.path.getsize(out_path) / (1024 * 1024)
    print('%s — %d pages, %.1f MB' % (out_path, len(pages), size))


if __name__ == '__main__':
    if len(sys.argv) < 3:
        sys.exit('usage: python build_pdf.py <image-dir> <out.pdf>')
    build(sys.argv[1], sys.argv[2])
