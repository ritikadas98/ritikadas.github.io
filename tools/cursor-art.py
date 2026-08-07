"""Generates the cursor images used by `cursor: url(...)` in styles.css.

Run from the repo root:  python tools/cursor-art.py

Writes four PNGs into assets/cursor/. Two shapes x two themes, each at 1x and 2x:

    ring-light.png / ring-light@2x.png     interactive elements, light theme
    ring-dark.png  / ring-dark@2x.png      interactive elements, dark theme

WHY A FILE AND NOT AN SVG DATA URI
SVG cursors are unreliable in Safari and are silently dropped in some versions,
which would leave the fallback keyword showing on those browsers only. PNG is the
one format every engine accepts for `cursor:`.

WHY TWO THEMES
A cursor image is static bitmap art. It cannot take `currentColor` or a CSS
variable the way the masked signature does, so the accent has to be baked in and
the swap has to happen in the stylesheet with a second `cursor:` declaration.

WHY 24px AND NOT LARGER
Chrome ignores any cursor over 128x128 device pixels, and anything much bigger
than the native hand starts to obscure what it is pointing at. 24 CSS px sits
just above the ~20px system hand.

The hotspot is dead centre, (12, 12) at 1x. That pair of numbers is in the CSS
and MUST match SIZE // 2 below, or the click lands somewhere other than where the
ring is drawn -- which is the exact failure this whole approach exists to avoid.
"""

from pathlib import Path

from PIL import Image, ImageDraw

SIZE = 24          # CSS pixels
SS = 8             # supersample factor; drawn at 8x then reduced, for clean edges
STROKE = 1.6       # ring thickness, CSS px
DOT_R = 1.9        # centre dot radius, CSS px -- this is what you actually aim with
INSET = 1.0        # keeps the ring's outer edge off the bitmap boundary

# Same values as --accent in styles.css, light and dark.
COLOURS = {"light": (75, 79, 145), "dark": (130, 136, 196)}

OUT = Path("assets/cursor")


def ring(rgb, scale):
    """One cursor bitmap: a hairline ring with a solid dot at its centre.

    The dot matters. A bare ring marks an area, and a visitor has to guess which
    part of it clicks; a dot marks a point, and it sits exactly on the hotspot.
    """
    px = SIZE * scale
    big = px * SS
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    unit = scale * SS                      # device pixels per CSS pixel
    inset = INSET * unit
    d.ellipse(
        [inset, inset, big - inset, big - inset],
        outline=rgb + (255,),
        width=max(1, round(STROKE * unit)),
    )

    c, r = big / 2, DOT_R * unit
    d.ellipse([c - r, c - r, c + r, c + r], fill=rgb + (255,))

    return img.resize((px, px), Image.LANCZOS)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for theme, rgb in COLOURS.items():
        for scale, suffix in ((1, ""), (2, "@2x")):
            path = OUT / f"ring-{theme}{suffix}.png"
            ring(rgb, scale).save(path, optimize=True)
            print(f"{path}  {SIZE * scale}x{SIZE * scale}  {path.stat().st_size} bytes")
    print(f"\nhotspot for styles.css: {SIZE // 2} {SIZE // 2}")


if __name__ == "__main__":
    main()
