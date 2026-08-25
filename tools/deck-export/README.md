# Getting a deck out as a file

The decks under `work/<project>/deck/` are HTML. There are three ways to get one
out as a file, in order of how much you have to install.

## The short version

Both files in `assets/decks/` are made from the same photographs, so they cannot
disagree with each other or with the web deck:

```bash
python -m http.server 8899 --bind 127.0.0.1   # from the repo root, another shell

cd tools/deck-export
node shoot-cdp.mjs "http://127.0.0.1:8899/work/reddit/deck/" ./out
python build.py     ./out ../../assets/decks/reddit.pptx "Reddit — case study — Ritika Das"
python build_pdf.py ./out ../../assets/decks/reddit.pdf
```

`shoot-cdp.mjs` is `shoot.mjs` driven through CDP against the system Chrome, so
it needs no Playwright install; `build_pdf.py` needs Pillow, `build.py` needs
Pillow and python-pptx. The .pptx is the one to upload to Google Drive: opened
with Google Slides it becomes a deck that swipes properly on a phone.

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

**It shares the print path, so it shares the broken cover above.** That is the
whole reason the shipped PDFs are built from the photographs instead. Use this
one only after checking page one, and only when the text has to be selectable.

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
