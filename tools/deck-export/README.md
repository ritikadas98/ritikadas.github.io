# Getting a deck out as a file

The decks under `work/<project>/deck/` are HTML. There are three ways to get one
out as a file, in order of how much you have to install.

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

## 1b. A PDF at a true 16:9

```bash
python -m http.server 8899 --bind 127.0.0.1   # from the repo root, in another shell

cd tools/deck-export
node topdf.mjs "http://localhost:8899/work/reddit/deck/" ../../assets/decks/reddit.pdf
```

Needs `npm install` and `npx playwright install chromium` once, the same as the
.pptx route below.

The text stays real text: selectable, searchable, and about a tenth the weight
of the .pptx, which is fourteen photographs. Prefer this for anything a person
will read. Use the .pptx only when the file has to open in PowerPoint.

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
