# Publishing an article on ritikadas.in

How to take a finished piece of writing and put it on this site. Written for whoever
— person or agent — does the next one. Two are queued: **Reddit** and **YouTube**.

The CREW study at `/writing/crew/` is the reference implementation. When this document
and that page disagree, the page wins. Read it before starting.

---

## 1. What this repo is

A GitHub Pages site with **no build step and no dependencies**. No `package.json`, no
framework, no bundler, nothing to install or compile. You edit files and push.

```
index.html          the one-page site (cards, sections, contact)
styles.css          every style on the site, including article pages
script.js           theme toggle, scroll reveals, card behaviour
writing/
  index.html        the list of all articles
  crew/
    index.html      the CREW article
    images/         its web-sized images
writing-drafts/     source material — gitignored, never published
CNAME               ritikadas.in
```

Article pages are hand-written HTML that link to the same `styles.css` and `script.js`
as the homepage. There is no templating layer. You copy the CREW page and change its
contents.

GitHub Pages serves `writing/crew/index.html` at the URL `/writing/crew/`. That is why
every article is a **directory containing `index.html`**, never `crew.html`.

---

## 2. An article touches exactly three places

Miss one and the piece is orphaned. In order:

| # | File | What changes |
|---|---|---|
| 1 | `writing/<slug>/index.html` | **New.** The article itself. |
| 2 | `writing/index.html` | The entry becomes a real link instead of a dimmed placeholder. |
| 3 | `index.html` | The homepage card gains a link to the article. |

`<slug>` is lowercase, one word where possible: `reddit`, `youtube`.

### 2a. Both remaining articles already have a card and a listing

Nothing needs inventing. The Reddit and YouTube cards exist on the homepage
(`data-project="reddit"`, `data-project="youtube"`), and both are already listed on
`/writing/`. Both are deliberately **inert** — no link, dimmed, marked "Being written" —
because the site's standing rule is that it never offers a click it cannot honour.

Publishing an article is therefore mostly a matter of **switching those two from inert
to live**. The copy in the card and the listing is already written and approved; do not
rewrite it while wiring up the link. If the article changes the argument enough that the
card is now wrong, say so and ask — don't silently rewrite an approved summary.

---

## 3. Step by step

### Step 1 — Create the page

```
cp -r writing/crew writing/reddit
```

Then, in `writing/reddit/index.html`, replace:

- `<title>` — the article headline, then ` — Ritika Das`
- `<meta name="description">` — one sentence, the same one used as `.art-sub`
- `.art-title`, `.art-sub`, and the four `.art-meta` cells
- the hero `<figure>` and the whole `.art-body`

Leave alone: the `<head>` links, the pre-paint theme script, the `<nav>`, the `<footer>`,
and the `<script src="../../script.js">` at the end. Relative paths (`../../`) are correct
for a page two levels deep — don't "fix" them.

### Step 2 — Make the listing live

In `writing/index.html`, the Reddit entry is currently an inert `<div>`. Turn it into a
link and drop the placeholder markers:

```html
<!-- before -->
<li class="wr-item pending">
  <div class="wr-in">
    <div class="wr-meta">
      <span class="wr-kicker">Consumer social</span>
      <span class="wr-date">April 2026</span>
      <span class="wr-flag">Being written</span>
    </div>

<!-- after -->
<li class="wr-item">
  <a class="wr-in" href="reddit/">
    <div class="wr-meta">
      <span class="wr-kicker">Consumer social</span>
      <span class="wr-date">April 2026</span>
```

Three edits: drop `pending` from the `<li>`, swap `<div class="wr-in">` for
`<a class="wr-in" href="reddit/">` (and its closing tag), and delete the
`<span class="wr-flag">` chip. The `.pending` class is what dims it.

Newest piece goes at the top of the list.

### Step 3 — Link the homepage card

In `index.html`, find `data-project="reddit"`. Inside it:

- Remove `data-nolink="1"` from the `.card-details-box` and replace it with
  `data-cursor-text="Read the Study"`, which is what makes the hover label appear.
- Wrap the headline text inside the `<h3>` in a link, leaving the icon `<img>` outside it:

```html
<h3>
  <img src="assets/reddit.svg" alt="Reddit" style="width:24px;height:24px;vertical-align:middle;margin-right:6px" loading="lazy" decoding="async" />
  <a class="card-link" href="writing/reddit/" target="_blank" rel="noopener">Reddit: a waypoint, not a destination</a>
</h3>
```

- Delete the HTML comment above the headline that explains why it isn't linked yet.
- If `Status` in the `.meta` block says anything other than `Published`, update it.

Compare against the CREW card (`data-project="crew"`) — it is the live example of all
of the above.

---

## 4. The page skeleton

```html
<article>
  <header class="art-head">
    <div class="art-wrap">
      <a href="../" class="art-back">&larr; All writing</a>
      <h1 class="art-title">The headline</h1>
      <p class="art-sub">One sentence saying what this is.</p>
      <figure class="fig-phone art-hero">
        <img src="images/hero.jpg" alt="…" width="1080" height="1827" decoding="async" />
      </figure>
      <div class="art-meta">
        <div class="am-cell"><div class="am-k">Role</div><div class="am-v">…</div></div>
        <div class="am-cell"><div class="am-k">Type</div><div class="am-v">…</div></div>
        <div class="am-cell"><div class="am-k">Timeframe</div><div class="am-v">…</div></div>
        <div class="am-cell"><div class="am-k">Method</div><div class="am-v">…</div></div>
      </div>
    </div>
  </header>
  <div class="art-wrap">
    <div class="art-body">
      <!-- the piece -->
    </div>
  </div>
</article>
```

The back link goes to `../` — the writing index — not to the homepage card.

**The order matters: headline, one-line summary, hero image, then the meta strip.**
The reader meets the piece before its paperwork, and the strip's hairline rules then
act as the divider into the body. Do not put the meta strip above the hero.

### The meta strip

**Every value must fit on one line.** Four cells sit side by side, so each has roughly
a quarter of the width. A value that wraps to three lines turns a footnote into a block
that competes with the title for attention, and pushes the article itself below the fold.
Three or four words per cell. Check it rendered — don't assume.

- **Role** — `Product analysis`, not `Product analysis (self-directed)`
- **Type** — `Product teardown`
- **Timeframe** — `March–July 2026`
- **Method** — `Public listings, reviews, my own use`

The **Method** cell names the evidence sources and nothing else. Don't repeat the dates
there — the Timeframe cell next to it already carries them. State provenance once,
plainly, and move on: don't restate it later in the body, and don't add lines insisting
on what the analysis *didn't* use. Saying it twice reads as protesting, and invites the
reader to wonder why it needs defending. The body can carry a short "A note on method"
section for the caveats that genuinely need saying.

---

## 5. What you can use inside `.art-body`

The stylesheet already handles these. Don't add new CSS unless a piece genuinely needs
something that doesn't exist — and if it does, add it to `styles.css` near the other
article rules, with a comment saying why.

| Markup | Renders as |
|---|---|
| `<h2>` | Section heading |
| `<p>` | Body paragraph, 17px on a ~80ch measure |
| `<em>` `<strong>` | Emphasis |
| `<a href>` | Accent-coloured link. External ones get `target="_blank" rel="noopener noreferrer"` |
| `<blockquote class="pull">` | Large pull quote with an accent rule down the left |
| `<figure class="fig-phone">` | A single portrait phone screenshot, centred, max 330px |
| `<figure class="fig-wide">` | A landscape figure that breaks out **wider than the text** |
| `<div class="fig-row">` | Three portrait screenshots side by side — see §6 |
| `<div class="table-scroll"><table>` | A table that breaks out wide and scrolls sideways on small screens |
| `<figcaption>` | Caption under any figure |

The governing idea: **narrow text, wide evidence.** Prose stays on a comfortable
reading measure; screenshots and tables break out past it.

Always give `<img>` a `width` and `height` so the page doesn't jump around while
images load, and `loading="lazy"` on everything except the hero.

Write real alt text — a sentence describing what the image shows. It is the caption's
job to make an argument and alt text's job to describe.

---

## 6. Images

### Where they live

```
writing-drafts/<slug>/images/   originals, full resolution, gitignored
writing/<slug>/images/          web versions, committed
```

Keep originals out of the repo and web copies in it. Re-derive web copies from the
originals whenever a crop needs changing — never re-compress an already-compressed
web copy, which stacks a second round of loss onto it.

### Sizes that work

| Kind | Width | Format |
|---|---|---|
| Phone screenshot | 1080px | JPG, quality 82, progressive |
| Landscape figure (review card, chart) | ~1200px | JPG, quality 82, progressive |

```python
from PIL import Image
im = Image.open(src).convert('RGB').crop((0, top, 1080, top + H))
im.save(dst, 'JPEG', quality=82, optimize=True, progressive=True)
```

### The rule that matters for `fig-row`

**Every image in a `fig-row` must be cut to the same pixel dimensions.**

Phone screenshots start life identical — one screen size — and only become mismatched
when each is hand-trimmed to its own content. Three different heights side by side put
the three captions on three different lines, and the row reads as an accident. This
happened on the CREW page and had to be redone.

So: pick one height that fits the content of every image in the row, then choose each
image's crop window individually so nothing important is lost. Vertical position varies
per image; the output size does not.

Images stacked separately (`fig-phone`, `fig-wide`) can be any height — the rule applies
only when they sit in a row.

---

## 7. Voice

The site's single measure is how few decisions a reader has to make to understand it.
The most common criticism of the writing is that it needs a second read. That is a
problem of **sentence architecture, not vocabulary** — the words are already plain.
Do not simplify word choice; it strips the precision that makes the writing sound
senior and fixes nothing.

1. **One idea per sentence.** Where an em-dash interrupts mid-sentence, use a full stop.
2. **Ceiling of about 15 words per sentence; aim for an average near 9.**
3. **No semicolons.** A semicolon is two sentences pretending to be one.
4. **Lead with the concrete thing,** not the abstract category.
5. **Never use a specialist term three times in one sentence.**
6. **Keep every number and every specific.** Precision is the biggest asset here.
7. Usually the fix is **more sentences using the same words**, not fewer words.

Register is **plain and restrained**. Professional, premium through restraint. Not
confessional, not personal.

### On AI

Two halves, and the second is the one that gets missed.

**Where AI is genuinely used**, frame it as expertise in deploying it — not as
restrictions placed on it. "I use AI where it's strongest: language, synthesis, speed.
Code handles the maths" — not "I never let AI write numbers." Prefer current, truthful
vocabulary: an *agentic AI pipeline*, not *a cloud pipeline*.

**Where AI is not used, say nothing about it at all.** Neither defend nor promote.
Raising the subject in order to say you didn't use it still centres it, and invites the
question of why it needs justifying. Delete the subject instead.

The differentiator is that the AI work here is *verifiable*, not that AI is good. The
strongest position is "I ship AI that works."

---

## 8. Check it before shipping

**Preview over a local server, never by opening the file directly.** Opened as a file,
any link ending in a slash shows a folder listing instead of the page, and the site
looks broken when it isn't.

```
python3 -m http.server 8765
```

Then `http://127.0.0.1:8765/`.

Walk the whole path a reader takes:

- Homepage → the card's headline link → the article
- Homepage → "All writing →" → `/writing/` → the article
- Article → "← All writing" → back to `/writing/`
- Every image loads; no broken `src`
- Both themes — use the toggle in the nav
- A phone width (~390px): no sideways scrolling, and the `fig-row` collapses to one column

Headless screenshots are worth taking, with two cautions learned the hard way. Cards
and sections start invisible until the scroll observer fires, so a single tall capture
comes out blank — force the revealed state, or scroll the element into view first.
And Chrome's `--screenshot` with `--window-size` renders at desktop width and crops,
which fakes a mobile overflow bug that isn't there. Use CDP with
`Emulation.setDeviceMetricsOverride` for any real mobile check.

---

## 9. Ship it

Commits must be authored as Ritika Das. The repo already has this set locally —
confirm before committing:

```
git config user.name     # Ritika Das
git config user.email    # 168818346+ritikadas98@users.noreply.github.com
```

**A plain `git push` will fail** with `Permission to ritikadas98/… denied to <someone>`.
Nothing is wrong with the account's access. This machine's global git config rewrites
every `https://github.com/…` remote into an SSH one, and the SSH key on it belongs to a
different account. Bypass the rewrite and use the `gh` credentials:

```
GIT_CONFIG_GLOBAL=/dev/null git -c credential.helper='!gh auth git-credential' \
  push https://github.com/ritikadas98/ritikadas.github.io.git HEAD:main
```

The error message names a person and says "denied", which reads like revoked access.
It isn't. `ritikadas98` is the owner and the only collaborator with write access.

Commit messages here explain **why**, not what — the diff already says what. Look at
`git log` for the house style.

---

## 10. Don't

- **Don't publish `BUILD_SPEC.md` or `PORTFOLIO_WORKLOG.md`.** Both are private working
  documents, both are gitignored, and the repo is public. Never `git add -f` either one.
  Any new internal planning document goes into `.gitignore` in the same commit that
  creates it.
- **Don't commit `writing-drafts/`.** Full-resolution originals and working text.
- **Don't add a build step, a framework, or a dependency.** The whole site is three
  files plus assets, and it stays that way.
- **Don't put a link on something that isn't ready.** Inert and clearly marked beats a
  click that goes nowhere.
- **Don't change the hero headline** on the homepage — "I build products people
  *actually use*…" is fixed by the owner's instruction.
- **Don't rewrite approved card copy** while wiring up a link. Ask first.
