#!/usr/bin/env python3
"""Render the preview images for each article — the picture that shows up when
someone drops the URL into Slack or LinkedIn, and the hero that sits inside the
article's card on the homepage.

    python3 tools/og-card.py            # rebuild every finished article
    python3 tools/og-card.py reddit     # one article, including a held one
    python3 tools/og-card.py crew:card  # one article, one variant

Only CREW is finished. Reddit and YouTube are marked `hold` because their art still
uses a placeholder subject, so a default run skips them and assets/og/ holds no
half-finished files. Remove the flag when their screenshots land.

Three variants per article, written to assets/og/:
  <slug>-og.jpg      2400x1260  — Open Graph / Twitter / LinkedIn / Slack unfurls.
                                  A 1200x630 layout rendered at 2x: same 1.91:1
                                  aspect every platform crops to, twice the pixels.
  <slug>-square.jpg  2400x2400  — Instagram, LinkedIn image posts. Also 2x.
  <slug>-card.jpg    1000x1000  — hero inside the Product Thinking card on the
                                  homepage. Square, so the card stays as short as its
                                  own copy; built to survive cover-cropping either
                                  side of that; see card() for the safe-area maths.

Only -og.png is wired into a page's <meta> tags; the other two are placed by hand.

How it works: builds a self-contained HTML page per variant — webfonts, logos and
screenshots all inlined as data URIs — then screenshots it with headless Chrome at
the exact pixel size. Self-contained because Chrome renders the page out of a temp
location, where file:// subresource loads are unreliable.

Needs Google Chrome, plus one network round-trip the first time to fetch the three
webfaces; after that they are cached under tools/.fontcache/.
"""

import base64
import io
import mimetypes
import pathlib
import re
import subprocess
import sys
import urllib.request

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "og"
CACHE = pathlib.Path(__file__).parent / ".fontcache"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

FONT_URL = ("https://fonts.googleapis.com/css2"
            "?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700"
            "&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap")
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")


# ------------------------------------------------------------------- the copy
#
# Deliberately not scraped from the pages. A card has room for one idea, and the
# sentence that earns a click is rarely the page's opening line. Titles and hooks
# do track what the site says, so a reader who clicks lands somewhere familiar.
#
#   brand / rgb  the article's accent, matching its tag on the homepage card
#   field        four stops for the coloured ground: bloom, top, middle, deep
#   subject      what stands on that ground — a device shot, or an app tile for
#                the two studies that have no screenshots of their own
#   hold         optional. True means the article's art is not finished — usually a
#                placeholder subject — so a default run skips it and nothing lands in
#                assets/og/. Build it anyway by naming the slug.
#   quote        optional. Omit it and the field carries the subject and its name
#                and nothing else — the argument stays on the paper side, where the
#                headline and hook already make it.

ARTICLES = {
    # The site itself. Its URL is the one that goes on a CV and a LinkedIn profile,
    # so it is pasted far more often than any single article — and until now it was
    # the only page with no preview at all. No product to photograph, so the card is
    # the positioning, set in type. See home().
    "home": {
        "kicker": "Portfolio",
        "title": "I build products people actually use",
        "hook": "Product manager and builder, Bengaluru. Three products shipped solo, "
                "plus long-form case studies on social, luxury and platforms.",
        "byline": "Ritika Das",
        "brand": "#4B4F91", "rgb": "75,79,145",
        "field": ("#7C81BE", "#4B4F91", "#343864", "#1D1F3A"),
        "icon": "assets/crew-icon.png", "icon_radius": 12,
        "subject": {"kind": "none", "src": ""},
        "variants": ("og",),
    },
    "fitcheck": {
        # The first write-up of something built rather than analysed, so the field is
        # FitCheck's own navy rather than a retailer's colour, and the subject is a
        # browser: the product lives beside a shop's page, not inside an app.
        "kicker": "Shipped product",
        "title": "The Chart Was Never the Problem",
        "hook": "Across four tabs the same letter meant four different bodies. Every "
                "page already had a size chart on it.",
        "byline": "FitCheck · Chrome extension",
        "brand": "#1E3A5F", "rgb": "30,58,95",
        "field": ("#3E6EA5", "#2C5581", "#1E3A5F", "#101F33"),
        "icon": "assets/fitcheck-icon.png", "icon_radius": 12,
        "subject": {"kind": "browser", "src": "writing/fitcheck/images/fitcheck-square-src.jpg"},
    },
    "crew": {
        "kicker": "Product teardown",
        "title": "You Can’t Hand Off What You Still Have to Hold",
        "hook": "A concierge sells one thing: the freedom to stop thinking about "
                "something. CREW’s own reviewers describe checking its work.",
        # No quote: the field is the product plate — mark, device, name — not a
        # second place to restate the argument the hook already makes.
        "byline": "CREW · Swiggy’s travel concierge",
        "brand": "#A62B22", "rgb": "166,43,34",
        "field": ("#C4392C", "#A62B22", "#7A1E18", "#45120F"),
        "icon": "assets/crew-icon.png", "icon_radius": 12,
        "subject": {"kind": "phone", "src": "writing/crew/images/crew-hero.jpg"},
    },
    "reddit": {
        # The evidence here is a desktop thread, not an app, so the subject is a
        # browser window rather than a phone. Quote dropped for the same reason as
        # the other two: with a real screenshot the field is a product plate.
        "kicker": "Product case study",
        "title": "Reddit Is a Waypoint, Not a Destination",
        "hook": "Around 62% of Reddit’s visitors arrive from Google, land on one "
                "thread, get their answer and leave.",
        "byline": "Reddit · Consumer social",
        "brand": "#FF4500", "rgb": "255,69,0",
        "field": ("#FF7A45", "#F04A00", "#A83204", "#4A1602"),
        "icon": "assets/reddit.svg", "icon_radius": 0,
        "subject": {"kind": "browser", "src": "writing/reddit/images/reddit-square-src.jpg"},
    },
    "youtube": {
        # Was held while the subject was a placeholder brand tile. It is a real
        # screenshot now — the SponsorBlock listing, 732,667 users — so it builds by
        # default. Quote dropped with it: a study with a real device shot uses the
        # product-plate layout, the way CREW does, so the three cards stay a set.
        "kicker": "Product study",
        "title": "The Demand You Can’t See",
        "title_px": {"og": 68, "square": 92},
        "hook": "Analytics only show what users do inside your app’s rules. They "
                "miss what power users install a modded app to fix.",
        "byline": "YouTube · Platform economics",
        "brand": "#FF0000", "rgb": "255,0,0",
        "field": ("#FF4A3D", "#E11B12", "#93110C", "#400604"),
        "icon": "assets/youtube.svg", "icon_radius": 0,
        "subject": {"kind": "phone", "src": "writing/youtube/images/youtube-hero.jpg"},
    },
}


# ------------------------------------------------------------------- plumbing

def fonts_css():
    """Google Fonts CSS with every woff2 inlined, so a render never depends on the
    network or on which fonts happen to be installed locally."""
    cached = CACHE / "fonts-inline.css"
    if cached.exists():
        return cached.read_text()

    req = urllib.request.Request(FONT_URL, headers={"User-Agent": UA})
    src = urllib.request.urlopen(req).read().decode()
    faces, seen = [], {}
    # Google splits each family across unicode subsets. Latin covers everything
    # these cards say; pulling all of them would quadruple the payload.
    for label, block in re.findall(r"/\*\s*([a-z\-]+)\s*\*/\s*(@font-face\s*\{[^}]*\})", src):
        if label not in ("latin", "latin-ext"):
            continue
        url = re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)
        if url not in seen:
            seen[url] = base64.b64encode(urllib.request.urlopen(url).read()).decode()
        faces.append(block.replace(url, "data:font/woff2;base64," + seen[url]))

    css = "\n".join(faces)
    CACHE.mkdir(exist_ok=True)
    cached.write_text(css)
    return css


def data_uri(rel):
    p = ROOT / rel
    mime = mimetypes.guess_type(p.name)[0] or "application/octet-stream"
    return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()


def signature_svg():
    """The 'Ritika Das' script mark, lifted out of the nav so the card and the site
    can never drift apart."""
    html = (ROOT / "index.html").read_text()
    m = re.search(r'<svg[^>]*class="brand-mark"[^>]*>.*?</svg>', html, re.S)
    if not m:
        sys.exit("brand-mark svg not found in index.html")
    return m.group(0).replace('class="brand-mark"', 'class="sig"')


def field_bg(stops, bloom):
    """The coloured ground. `bloom` is where the bright spot sits — it has to fall
    inside whatever part of the frame actually gets seen, which is why the cropped
    card variant pushes it well down from where the full-bleed variants put it."""
    hi, top, mid, deep = stops
    return (f"radial-gradient(75% 55% at {bloom}, {hi} 0%, transparent 62%),"
            f"linear-gradient(158deg, {top} 0%, {mid} 52%, {deep} 100%)")


# Layout size per variant, in CSS pixels. Read by both the CSS and the Chrome window,
# so they cannot disagree.
SIZES = {"og": (1200, 630), "square": (1200, 1200), "card": (1000, 1000)}

# Device pixel ratio the screenshot is taken at, so the PNG comes out SIZES x DPR.
# The layout is unchanged — this only decides how many real pixels each CSS pixel
# gets. At 1x an unfurl looks soft the moment anything views it on a retina screen,
# and the phone screenshot (natively 1080x1590) was being resampled down to 322px
# wide and then stretched back up by the viewer. 2x renders it near native.
# The card hero stays 1x. Its slot is ~400 CSS px wide, so 1000px already gives a
# retina display more source pixels than it has device pixels — rendering it at 2x
# would only add weight to a page asset.
DPR = {"og": 2, "square": 2, "card": 1}

# Everything ships as JPEG. These are photographic — a full-bleed gradient with a
# photo or a logo on it — and PNG serves that badly: the unfurls landed near 1MB at
# 2x, over the ~600KB where WhatsApp starts silently declining to unfurl a link at
# all, and the card heroes were 600-715KB each for a slot 400px wide, which is ~2MB
# of homepage weight for three of them. JPEG at q92 with no chroma subsampling holds
# the coloured type's edges and costs a third of that.
JPEG = {"og", "square", "card"}
JPEG_QUALITY = 92

PAPER = dict(paper="#EDE8E1", ink="#211E24", ink2="#38333B", muted="#6A6369",
             hair="#D5CCC1")

CSS = """
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:%(W)spx;height:%(H)spx;overflow:hidden}
body{
  font-family:'Inter',sans-serif;
  background:%(paper)s;color:%(ink)s;
  -webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;
}
/* Warm wash. A flat 1200px fill of one colour reads as dead paper. */
.grain{position:absolute;inset:0;
  background:
    radial-gradient(120%% 90%% at 0%% 0%%, rgba(255,255,255,.72), transparent 58%%),
    radial-gradient(90%% 70%% at 100%% 100%%, rgba(%(rgb)s,.05), transparent 60%%);
}
.card{position:absolute;inset:0}

.kick{display:flex;align-items:center;gap:16px}
/* Lifted only when the mark is an opaque app tile. A transparent logo gets its
   shadow cast off its rectangular box, which reads as a floating white square. */
.icon.lift{box-shadow:0 1px 2px rgba(33,30,36,.14),0 6px 18px rgba(33,30,36,.16)}
.pill{
  font-family:'IBM Plex Mono',monospace;font-weight:500;
  text-transform:uppercase;letter-spacing:.15em;
  color:%(brand)s;background:rgba(%(rgb)s,.075);
  border:1px solid rgba(%(rgb)s,.28);border-radius:999px;
  padding:8px 15px 7px;line-height:1;
}
h1{
  font-family:'Bricolage Grotesque',sans-serif;font-weight:700;
  font-variation-settings:'opsz' 96;
  letter-spacing:-.026em;line-height:1.015;text-wrap:balance;
}
.hook{color:%(muted)s;font-weight:450;letter-spacing:-.004em}

.foot{display:flex;align-items:flex-end;justify-content:space-between}
.sig{height:34px;width:auto;color:%(ink)s;display:block}
.site{
  font-family:'IBM Plex Mono',monospace;font-weight:500;font-size:16px;
  letter-spacing:.05em;color:%(muted)s;
}

/* The coloured field the subject stands on. CREW's hero screenshot is near-black:
   on a dark panel the device disappears, so it needs a warm ground. */
.field{position:absolute;overflow:hidden;background:%(field)s}
.field::after{content:'';position:absolute;inset:0;
  background:radial-gradient(85%% 70%% at %(vig)s, rgba(0,0,0,.42), transparent 62%%)}
.phone{
  position:absolute;border-radius:34px;overflow:hidden;
  background:#0F0D11;border:7px solid #17141A;
  box-shadow:0 3px 8px rgba(0,0,0,.34),0 34px 78px rgba(0,0,0,.42);
}
.phone img{display:block;width:100%%;height:100%%;object-fit:cover;object-position:50%% 0%%}
/* The desktop counterpart, for a study whose evidence is a browser window rather
   than an app. Same job as the bezel: make a screenshot read as a thing on a screen
   instead of a rectangle pasted on a gradient. */
.browser{
  position:absolute;border-radius:14px;overflow:hidden;
  background:#17141A;border:1px solid rgba(255,255,255,.10);
  box-shadow:0 3px 8px rgba(0,0,0,.34),0 34px 78px rgba(0,0,0,.42);
}
.browser .chrome{display:block;height:26px;background:#17141A;
  background-image:radial-gradient(circle,#4A4550 4px,transparent 4.5px),
    radial-gradient(circle,#4A4550 4px,transparent 4.5px),
    radial-gradient(circle,#4A4550 4px,transparent 4.5px);
  background-position:14px 50%%,32px 50%%,50px 50%%;background-repeat:no-repeat}
.browser img{display:block;width:100%%;height:calc(100%% - 26px);object-fit:cover;object-position:50%% 0%%}
/* Stand-in subject for the studies with no screenshots of their own. A brand mark
   laid straight on its own brand colour vanishes, so it sits on a paper tile —
   which also keeps the logo's white knockouts intact. */
.tile{
  position:absolute;display:grid;place-items:center;background:#F7F2EC;
  box-shadow:0 4px 12px rgba(0,0,0,.20),0 28px 66px rgba(0,0,0,.34);
}
.tile img{width:60%%;height:auto;display:block}
.quote{
  position:absolute;color:#F7EFEA;
  font-family:'Bricolage Grotesque',sans-serif;font-weight:600;
  font-variation-settings:'opsz' 40;
  letter-spacing:-.014em;line-height:1.22;
}
.byline{
  position:absolute;font-family:'IBM Plex Mono',monospace;font-weight:500;
  text-transform:uppercase;letter-spacing:.16em;color:rgba(247,239,234,.62);
}
.rule{height:1px;background:%(hair)s}
"""


def page(a, w, h, body, extra, bloom, vig):
    tokens = dict(PAPER, W=w, H=h, brand=a["brand"], rgb=a["rgb"], vig=vig,
                  field=field_bg(a["field"], bloom))
    css = CSS % tokens
    return (f'<!doctype html><html><head><meta charset="utf-8">'
            f"<style>{fonts_css()}</style><style>{css}{extra}</style></head>"
            f'<body><div class="grain"></div><div class="card">{body}</div></body></html>')


def icon_img(a, px):
    lift = " lift" if a["icon_radius"] else ""
    return (f'<img class="icon{lift}" src="{data_uri(a["icon"])}" '
            f'width="{px}" height="{px}" alt="">')


def subject(a, variant):
    """The device shot, the browser window, or the brand tile — sized per variant by
    CSS class. `browser` exists because not every study's evidence lives in an app:
    Reddit's is a desktop thread, and a page screenshot inside a phone bezel would be
    both a lie and unreadable."""
    s = a["subject"]
    if s["kind"] == "phone":
        return f'<div class="phone"><img src="{data_uri(s["src"])}" alt=""></div>'
    if s["kind"] == "browser":
        return (f'<div class="browser"><span class="chrome"></span>'
                f'<img src="{data_uri(s["src"])}" alt=""></div>')
    return f'<div class="tile"><img src="{data_uri(s["src"])}" alt=""></div>'


def title_px(a, variant, default):
    return a.get("title_px", {}).get(variant, default)


# ------------------------------------------------------------------- variants

def rectangle(a):
    """1200x630. Text column left, subject on a coloured field right. Sized so the
    headline still reads at the ~360px width Slack renders an unfurl at."""
    extra = """
    .card{display:flex}
    .col{width:772px;padding:62px 62px 54px 72px;display:flex;flex-direction:column}
    h1{font-size:%(tpx)spx;margin:38px 0 0;max-width:none}
    .hook{font-size:22px;line-height:1.46;margin-top:26px;max-width:37ch}
    .rule{margin-top:auto}
    .foot{margin-top:22px}
    .pill{font-size:13px}
    .icon{border-radius:%(ir)spx}
    .field{top:0;bottom:0;left:772px;right:0;border-left:1px solid rgba(%(rgb)s,.45)}
    .quote{font-size:26px;left:48px;top:50px;width:332px}
    .tile{width:212px;height:212px;border-radius:48px;left:108px;top:258px}
    """ % dict(tpx=title_px(a, "og", 62), ir=a["icon_radius"], rgb=a["rgb"])
    # Without a quote the device owns the field, so it is drawn larger and the name
    # sits above it as a caption. That name is now the only text here, so it gets
    # near-full contrast instead of the .62 it used when a quote led.
    extra += """
    .byline{font-size:13px;left:48px;top:54px;width:336px;line-height:1.5;
      letter-spacing:.18em;color:rgba(247,239,234,.88)}
    .phone{width:348px;height:512px;left:54px;top:142px;transform:rotate(-5deg)}
    .browser{width:396px;height:396px;left:30px;top:196px;transform:rotate(-3deg)}
    """ if not a.get("quote") else """
    .byline{font-size:12px;left:48px;top:152px;width:300px;line-height:1.5}
    .phone{width:322px;height:474px;left:66px;top:192px;transform:rotate(-5deg)}
    .browser{width:360px;height:360px;left:48px;top:238px;transform:rotate(-3deg)}
    """
    body = f"""
    <div class="col">
      <div class="kick">
        {icon_img(a, 46)}
        <div class="pill">{a['kicker']}</div>
      </div>
      <h1>{a['title']}</h1>
      <p class="hook">{a['hook']}</p>
      <div class="rule"></div>
      <div class="foot">{signature_svg()}<div class="site">ritikadas.in</div></div>
    </div>
    <div class="field">
      {f'<div class="quote">{a["quote"]}</div>' if a.get("quote") else ''}
      <div class="byline">{a['byline']}</div>
      {subject(a, 'og')}
    </div>"""
    return page(a, *SIZES["og"], body, extra, "26% 12%", "50% 118%")


def square(a):
    """1200x1200. Same parts stacked, with the subject breaking the seam between
    paper and colour so the two halves read as one image."""
    extra = """
    .top{padding:88px 88px 0}
    h1{font-size:%(tpx)spx;margin:50px 0 0;max-width:none}
    .hook{font-size:28px;line-height:1.44;margin-top:36px;max-width:30ch}
    .pill{font-size:16px;padding:10px 18px 9px}
    .icon{border-radius:%(ir)spx}
    .field{left:0;right:0;bottom:0;height:470px}
    /* Siblings of .field, not children: they have to cross the field's top edge,
       and the field clips its own overflow to keep the vignette inside the band. */
    .phone{width:434px;height:639px;right:58px;top:572px;transform:rotate(-5deg)}
    .browser{width:520px;height:520px;right:52px;top:632px;transform:rotate(-3deg)}
    .tile{width:300px;height:300px;border-radius:68px;right:130px;top:626px}
    .quote{font-size:42px;left:88px;bottom:230px;width:430px}
    .srule{position:absolute;left:88px;width:462px;bottom:150px;height:1px;
      background:rgba(247,239,234,.22)}
    .foot{position:absolute;left:88px;bottom:68px;gap:26px;align-items:center}
    .sig{height:40px;color:#F5EBE6}
    .site{color:rgba(245,235,230,.66);font-size:18px}
    """ % dict(tpx=title_px(a, "square", 88), ir=a["icon_radius"] + 3)
    # Same rule as the rectangle. With no quote the band's left column holds only a
    # name, a rule and a signature, so all three move up to sit as one group rather
    # than stranding the name at the top of an empty band.
    extra += """
    .byline{font-size:23px;left:88px;bottom:262px;letter-spacing:.16em;
      color:rgba(247,239,234,.90)}
    .srule{bottom:196px}
    .foot{bottom:96px}
    """ if not a.get("quote") else """
    .byline{font-size:15px;left:88px;bottom:186px;letter-spacing:.18em}
    """
    body = f"""
    <div class="top">
      <div class="kick">
        {icon_img(a, 60)}
        <div class="pill">{a['kicker']}</div>
      </div>
      <h1>{a['title']}</h1>
      <p class="hook">{a['hook']}</p>
    </div>
    <div class="field"></div>
    {f'<div class="quote">{a["quote"]}</div>' if a.get("quote") else ''}
    <div class="byline">{a['byline']}</div>
    <div class="srule"></div>
    {subject(a, 'square')}
    <div class="foot">{signature_svg()}<div class="site">ritikadas.in</div></div>"""
    return page(a, *SIZES["square"], body, extra, "26% 12%", "50% 118%")


def card(a):
    """1000x1000 — the hero inside the homepage card. All field, no paper: it sits
    on a cream card, so a cream image would have no edge.

    Square, and it took three passes to get here. The frame began at 1000x1400 (0.71),
    sized for a written card carrying four PDEO rows. Once a published card was cut to
    a title and a two-line lead — about 280px of text — a 525px image was setting the
    card's height on its own and leaving a dead quarter under the button.

    Cropping the old frame was never the fix: the phone spans nearly its whole height,
    so any vertical trim cuts the device. The height came out of the empty band above
    the phone instead, which opened 24% down and now opens at 13%. The margins shrank;
    the product never did.

    Square is what finally contains it. A portrait frame renders at a fixed slot width,
    so its height is whatever the ratio dictates — always taller than the copy beside
    it. At 1:1 the art is 376px in a 376px column and the card comes to 434px, set by
    its own content rather than by a picture. **This is also why trimming the sides of
    a portrait frame made it taller, not smaller**: a narrower frame at a fixed width
    is a taller one.

    Geometry is still set by how object-fit:cover will treat it. Slot height comes
    from the card's own copy, so the aspect varies and cover crops whichever axis is
    surplus:

        slot 1.00 (400x400)  nominal, matches this frame — nothing is cropped
        slot 0.55 (400x730)  height binds; 137px comes off each side
        slot 1.40 (400x286)  width binds; 143px comes off top and bottom

    Hence the 110px side inset on every piece of text, and the phone kept to 60% of the
    width: both stay clear of the worst-case horizontal trim, so nothing clips mid-word
    or loses the device's edge. Vertically the byline and signature are the pieces that
    yield first, which is why neither carries meaning the quote doesn't already.

    The bloom also sits at 32% rather than the 12% the full-bleed variants use — up
    there it fell outside the crop entirely, leaving a gradient with no visible
    source."""
    has_quote = bool(a.get("quote"))
    extra = """
    .field{inset:0}
    .byline{font-size:19px;left:110px;top:44px;letter-spacing:.19em;
      color:rgba(247,239,234,.88)}
    .rule{position:absolute;left:110px;right:110px;top:94px;
      background:rgba(247,239,234,.22)}
    .phone{width:604px;height:888px;left:198px;top:126px;transform:rotate(-4deg)}
    .browser{width:720px;height:720px;left:140px;top:194px;transform:rotate(-3deg)}
    .tile{width:390px;height:390px;border-radius:90px;left:305px;top:300px}
    .quote{font-size:52px;left:110px;top:600px;width:640px}
    .foot{position:absolute;left:110px;bottom:70px;gap:24px;align-items:center;
      justify-content:flex-start}
    .sig{height:34px;color:#F5EBE6}
    .site{color:rgba(245,235,230,.66);font-size:17px}
    """
    body = f"""
    <div class="field"></div>
    <div class="byline">{a['byline']}</div>
    <div class="rule"></div>
    {subject(a, 'card')}
    {f'<div class="quote">{a["quote"]}</div>' if has_quote else ''}
    {f'<div class="foot">{signature_svg()}<div class="site">ritikadas.in</div></div>'
       if has_quote else ''}"""
    return page(a, *SIZES["card"], body, extra, "32% 32%", "50% 104%")


def home(a):
    """1200x630 for the site's own link preview. No panel and no subject: there is no
    single product to show, and a portfolio's preview should read as a name and a
    claim, not as a fourth case study. Paper edge to edge, one hairline, the
    signature — the quietest card of the four, which is the point."""
    extra = """
    .card{background:%(paper)s}
    .home-in{position:absolute;left:96px;right:96px;top:88px;bottom:88px;
      display:flex;flex-direction:column}
    .home-kicker{font-family:'IBM Plex Mono',monospace;font-size:17px;font-weight:500;
      letter-spacing:.19em;text-transform:uppercase;color:%(brand)s}
    .home-title{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;
      font-size:76px;line-height:1.04;letter-spacing:-.032em;color:%(ink)s;
      margin-top:34px;max-width:19ch}
    .home-hook{font-family:Inter,sans-serif;font-weight:450;font-size:23px;
      line-height:1.5;color:%(muted)s;margin-top:26px;max-width:44ch}
    .home-foot{margin-top:auto;padding-top:26px;border-top:1px solid %(hair)s;
      display:flex;align-items:center;justify-content:space-between}
    .home-sig{height:44px;color:%(ink)s}
    .home-site{font-family:'IBM Plex Mono',monospace;font-size:19px;color:%(muted)s}
    """ % dict(paper=PAPER["paper"], ink=PAPER["ink"], muted=PAPER["muted"],
               hair=PAPER["hair"], brand=a["brand"])
    body = f'''
    <div class="home-in">
      <div class="home-kicker">{a['kicker']}</div>
      <div class="home-title">{a['title']}</div>
      <div class="home-hook">{a['hook']}</div>
      <div class="home-foot">{signature_svg().replace('class="brand-mark"', 'class="home-sig"')}
        <div class="home-site">ritikadas.in</div></div>
    </div>'''
    return page(a, *SIZES["og"], body, extra, "26% 12%", "50% 118%")


VARIANTS = {"og": rectangle, "square": square, "card": card}


def main():
    jobs = []
    for arg in sys.argv[1:]:
        slug, _, variant = arg.partition(":")
        if slug not in ARTICLES:
            sys.exit(f"unknown article '{slug}'. known: {', '.join(ARTICLES)}")
        if variant and variant not in VARIANTS:
            sys.exit(f"unknown variant '{variant}'. known: {', '.join(VARIANTS)}")
        jobs += [(slug, v) for v in ([variant] if variant else
                                     ARTICLES[slug].get("variants", VARIANTS))]
    if not jobs:
        held = [s for s in ARTICLES if ARTICLES[s].get("hold")]
        jobs = [(s, v) for s in ARTICLES if not ARTICLES[s].get("hold")
                for v in ARTICLES[s].get("variants", VARIANTS)]
        # Never skip silently — a quiet omission reads as "there was nothing to do".
        for slug in held:
            print(f"skipped {slug}: art is on hold (placeholder subject). "
                  f"build anyway with `og-card.py {slug}`")

    if not pathlib.Path(CHROME).exists():
        sys.exit(f"Google Chrome not found at {CHROME}")
    OUT.mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(exist_ok=True)

    for slug, variant in jobs:
        fn, (w, h), dpr = VARIANTS[variant], SIZES[variant], DPR[variant]
        if slug == "home":
            fn = home
        html = CACHE / f"{slug}-{variant}.html"
        html.write_text(fn(ARTICLES[slug]))
        shot = CACHE / f"{slug}-{variant}.png" if variant in JPEG \
            else OUT / f"{slug}-{variant}.png"
        subprocess.run([
            CHROME, "--headless", "--disable-gpu", "--hide-scrollbars",
            "--force-color-profile=srgb",
            f"--window-size={w},{h}", f"--force-device-scale-factor={dpr}",
            f"--screenshot={shot}",
            "--virtual-time-budget=4000", html.as_uri(),
        ], check=True, capture_output=True)
        out = shot
        if variant in JPEG:
            out = OUT / f"{slug}-{variant}.jpg"
            Image.open(shot).convert("RGB").save(
                out, "JPEG", quality=JPEG_QUALITY, subsampling=0,
                optimize=True, progressive=True)
        kb = out.stat().st_size // 1024
        print(f"{out.relative_to(ROOT)}  {w * dpr}x{h * dpr}"
              f"{f' ({dpr}x)' if dpr != 1 else ''}  {kb} KB")


if __name__ == "__main__":
    main()
