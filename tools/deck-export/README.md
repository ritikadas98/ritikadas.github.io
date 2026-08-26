# Getting a deck out as a file

The decks under `work/<project>/deck/` are HTML. There are three ways to get one
out as a file, in order of how much you have to install.

## The short version

The two files in `assets/decks/` are made two different ways, because they are
for two different things.

**The PDF is printed, not photographed.** Its text is real text — selectable,
searchable, and sharp at any size. This is the one to attach to a LinkedIn post
or send to anybody who will read it.

```bash
python -m http.server 8899 --bind 127.0.0.1   # from the repo root, another shell

cd tools/deck-export
node topdf.mjs "http://127.0.0.1:8899/work/reddit/deck/" ../../assets/decks/reddit.pdf
```

**The .pptx is photographed**, because PowerPoint cannot draw these slides. It
is the one to upload to Google Drive: opened with Google Slides it becomes a
deck that swipes properly on a phone.

```bash
node shoot-cdp.mjs "http://127.0.0.1:8899/work/reddit/deck/" ./out
python build.py ./out ../../assets/decks/reddit.pptx "Reddit — case study — Ritika Das"
```

`shoot-cdp.mjs` is `shoot.mjs` driven through CDP against the system Chrome, so
it needs no Playwright install; `build.py` needs Pillow and python-pptx.
`topdf.mjs` needs Playwright.

**`build_pdf.py` is kept but no longer ships anything.** It packs the same
photographs into a PDF. Every page is one JPEG, so the file carries no fonts and
not one real letter — text compressed as if it were a photograph, which puts a
grey haze on every edge. That is what shipped until 26 Aug 2026. Use `topdf.mjs`.

**Do not use browser printing for the shipped PDFs.** See the warning under §1.

## 1. A PDF, with nothing installed

Open the deck in Chrome, press **Ctrl+P**, and choose **Save as PDF**.

- **Layout: Landscape.**
- **Margins: None.** Otherwise every slide gets a white border and the
  full-bleed cover stops being full bleed.
- **More settings → tick Background graphics.** Without it the dark slides print
  white and the cover disappears.

`work/_deck/deck.css` has a print block that unstacks the slides, one per page,
with the animations already finished. This is the fastest route and the right
one for emailing somebody a deck.

**The one limitation:** Chrome's paper list is A4, Letter, Legal, Tabloid. None
of them is 16:9. A slide printed to A4 landscape is squarer than the web deck,
so the content reflows to fit — readable, and correct, but not the same shape as
a projector. For a true 16:9 PDF, use the script below.

**The real limitation, found 25 Aug 2026:** printing does not just reflow, it can
break. On the Reddit cover the thread screenshot is placed absolutely, and the
print path drops it a third of a page, rasterises its shadow as a black block
across the headline, and runs the image off the bottom edge. Both shipped PDFs
had that cover for a day before anyone opened page one. Chrome print is fine for
emailing a deck to one person — look at page one first — and wrong for anything
the site links to. Those come from `build_pdf.py`.

## 1b. A PDF at a true 16:9

```bash
python -m http.server 8899 --bind 127.0.0.1   # from the repo root, in another shell

cd tools/deck-export
node topdf.mjs "http://localhost:8899/work/reddit/deck/" ../../assets/decks/reddit.pdf
```

Needs `npm install` and `npx playwright install chromium` once, the same as the
.pptx route below.

`topdf.mjs` injects its own `@page` rule before printing. Without that, deck.css
says `size:landscape` (right for Ctrl+P, where you pick the paper) while the
script asks for a 16:9 sheet, and Chrome lays the slides out for one size while
paginating onto the other. Anything sitting against a slide edge then prints
across the page break onto the next slide.

The text stays real text: selectable, searchable, and about a tenth the weight
of a PDF of photographs.

**The print path used to break the Reddit cover, and it no longer does.** Two
fixes, both in `work/_deck/deck.css`: the cover screenshot is centred with
margins rather than a transform, because Chrome rasterises a transformed subtree
separately when printing; and the print block clips each slide, because
`overflow:visible` let a layout a shade too tall spill its tail onto the next
slide. The Amazon persona card printed its last two lines across the top of the
slide after it until 26 Aug 2026.

**Still look at the pages after a rebuild.** `pypdfium2` renders them without
opening a viewer:

```python
import pypdfium2 as pdfium
doc = pdfium.PdfDocument('../../assets/decks/reddit.pdf')
doc[0].render(scale=1.2).to_pil().save('p1.png')
```

## 1c. A LinkedIn carousel

A deck and a carousel are not the same artefact. LinkedIn rasterises every
document it is given at **1080 pixels wide**. A 16:9 slide therefore arrives as
1080x608, which is a strip about a quarter of a phone screen tall, and its body
text — set at 14.5px for a 1600px frame — arrives at 9.8px. A 4:5 page arrives
as 1080x1350, which is 2.2x the area and fills the screen.

So each project gets a second, portrait shell under `work/<project>/carousel/`.
It links `_deck/deck.css` first and `_carousel/carousel.css` second, which means
every layout the deck engine can already draw works unchanged and only the page
shape and the type scale differ. The palette is copied from the deck's own
`:root` block so the two cannot drift apart in colour.

```bash
python -m http.server 8899 --bind 127.0.0.1   # from the repo root, another shell

cd tools/deck-export
node tocarousel.mjs "http://127.0.0.1:8899/work/reddit/carousel/" ../../assets/carousels/reddit.pdf
```

That writes **two** files: `reddit.pdf` at 1080x1350 and `reddit@2x.pdf` at
2160x2700. Pass `1x` or `2x` as a third argument for only one.

**Upload the 1x.** It matches what LinkedIn serves exactly, 1:1, so nothing is
resampled at any point. The 2x has to be halved to reach 1080, which softens it
slightly. Keep the 2x for printing, or for any tool that rasterises a PDF at its
nominal page size.

**2x does not make the text sharper, and cannot.** The text is vector — outlines
have no resolution — which is why the two files come out within 0.01 MB of each
other. It does not improve the photographs either: Chrome embeds an image at its
**natural** resolution, not at the size the layout draws it. The Reddit thread
screenshot is 1672x1400 on disk and 1672x1400 inside a 1080-wide PDF. The only
lever on picture quality is the source file.

**Which is why the persona card lies down in a carousel.** Every persona file is
800x800. Standing up in a single 944px-wide column the photo would be stretched
18%, on the one slide whose whole job is to show a face. `carousel.css` puts it
in a 340px band with the text beside it, which is a downscale. Crop the card,
never the picture.

**`scale` in `page.pdf()` is the wrong tool for the 2x.** It leaves the layout at
1080 and paints it onto the larger sheet, so the slide sits at 1x in the middle
of a 2x page with its right edge cut off. `tocarousel.mjs` uses CSS `zoom`
instead, which multiplies every length before layout: the same design, computed
at 2160, nothing reflowed.

## 2. A .pptx

Two steps: photograph every slide, then pack the images into a PowerPoint file.

```bash
# once
cd tools/deck-export
npm install                 # playwright
npx playwright install chromium

# every time
python -m http.server 8899 --bind 127.0.0.1   # from the repo root, in another shell

node shoot.mjs "http://localhost:8899/work/savio/deck/" ./out
python build.py ./out ../../assets/decks/savio.pptx "Savio — case study"
```

You get a 16:9 deck, one full-bleed image per slide, about 3 MB for sixteen
slides.

**The text is not editable in PowerPoint.** That is the trade. What you get back
is exactly what the web deck looks like — the gradients, the charts, the
diagrams, the fonts — rather than an approximation rebuilt in PowerPoint's own
type engine. If somebody needs to edit the words, send them the web deck and
change it there; the file is regenerated in a minute.

The shoot runs twice: once normally, then again with the navigation, the
progress bar and the keyboard hint hidden. The second pass is what lands in the
file, because page numbers and arrows belong to the web version.

## 3. Give someone the live deck

`ritikadas.in/work/<project>/deck/` works on a phone, and the case study page
embeds it. Usually better than a file.

## Notes

- Slides are shot at 1920×1080 at twice the pixel density, so 3840×2160 each.
- Images are re-encoded to JPEG at quality 92. A dark-gradient PNG at that size
  is about 2 MB; the JPEG is a fifth of that and looks the same on a projector.
- `shoot.mjs` waits 1.8s per slide. Bars grow over 900ms and the cover art
  staggers to about 1.2s, so a shorter wait catches slides mid-animation.
