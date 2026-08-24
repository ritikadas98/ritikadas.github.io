/* Dump a deck's slides.js as a markdown outline, for reading and marking up.
 *
 *   node tools/deck-outline.mjs work/reddit/deck/slides.js > work/reddit/deck/OUTLINE.md
 *
 * The point is a file somebody can edit in prose and hand back. The generator is
 * deterministic, so the way to find what changed is to regenerate a clean copy
 * and diff it against the edited one — no round-trip parser, which would break
 * the moment a slide gained a field.
 *
 * Every editable string in the deck appears here exactly once, under a label
 * that names where it lives. Nothing is summarised or truncated.
 */
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';

const file = process.argv[2];
if (!file) { console.error('usage: node deck-outline.mjs <slides.js>'); process.exit(1); }

/* slides.js declares consts at the top level, which a vm script keeps to itself.
   The appended line is the only way to get them back out. */
const ctx = createContext({ console });
runInContext(
  readFileSync(file, 'utf8') +
  '\n;globalThis.__deck={SLIDES,ART:typeof ART!=="undefined"?ART:null,' +
  'MOCKS:typeof MOCKS!=="undefined"?MOCKS:null};',
  ctx
);
const { SLIDES, MOCKS } = ctx.__deck;

/* A phone screen is markup. What a reader needs to check is the words in it. */
const words = h => String(h).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const out = [];
const w = s => out.push(s);
const field = (k, v) => { if (v === undefined || v === null || v === '') return; w(`**${k}:** ${v}`); w(''); };
const list = (k, items) => {
  if (!items || !items.length) return;
  w(`**${k}:**`); w('');
  items.forEach((t, i) => w(`${i + 1}. ${t}`));
  w('');
};

const LAYOUT = {
  cover: 'full-bleed gradient (or dark, if `dark: true`), with the cover art',
  statement: 'one dark slide, one sentence, no furniture',
  cards: n => `${n || 2} cards across`,
  compare: 'two panels side by side — left reads grey, right reads brand',
  bars: 'horizontal bars, values shown at the right',
  rows: 'stacked rows, numbered if `numbered: true`',
  two: 'two columns — left is a solid card, right is a dashed one',
  table: 'three-column table, a row can be highlighted',
  personajobs: 'persona card on the left, job statements on the right',
  mock: 'phone mock on the left, explanation panels on the right',
  funnel: 'left-to-right steps with arrows',
  quad: 'two-by-two positioning matrix',
  journey: 'before and after tracks',
  quotes: 'stacked quote cards',
  figure: 'one diagram'
};

const deck = file.split(/[\\/]/).slice(-3, -2)[0] || 'deck';
w(`# ${deck} — deck outline`);
w('');
w(`${SLIDES.length} slides. Generated from \`${file.replace(/\\/g, '/')}\` on ${new Date().toISOString().slice(0, 10)}.`);
w('');
w('## How to use this file');
w('');
w('- **Edit the text in place.** Rewrite a line, delete it, or replace it wholesale.');
w('- **To cut a whole slide,** write `CUT` on its NOTES line.');
w('- **To add a slide,** write a new `## Slide` block anywhere and describe what it should hold.');
w('- **To say something that is not a text change** — reorder, resize, change a colour,');
w('  swap a layout — write it on that slide\'s NOTES line.');
w('- **`*text*` paints that phrase in the accent orange.** It renders as *italic* here.');
w('  Keep the asterisks where you want the colour, add them where you want more.');
w('- **SOURCE** is the small grey line along the bottom of a slide.');
w('- Do not renumber the slides. I match them by number.');
w('');
w('---');
w('');

SLIDES.forEach((sl, i) => {
  const n = String(i + 1).padStart(2, '0');
  const lay = typeof LAYOUT[sl.kind] === 'function' ? LAYOUT[sl.kind](sl.cols) : LAYOUT[sl.kind];
  w(`## Slide ${n} — ${sl.pill || sl.kicker || sl.kind}`);
  w('');
  w(`*Layout \`${sl.kind}\`: ${lay || 'custom'}.*`);
  w('');

  field('KICKER', sl.kicker);
  field('PILL', sl.pill);
  field('TITLE', sl.title);
  field('LEAD', sl.lead);

  if (sl.cards) { w('**CARDS:**'); w(''); sl.cards.forEach(([h, b], k) => { w(`${k + 1}. **${h}** — ${b}`); }); w(''); }
  if (sl.rows && sl.kind === 'rows') { w('**ROWS:**'); w(''); sl.rows.forEach(([h, b], k) => w(`${k + 1}. **${h}** — ${b}`)); w(''); }
  if (sl.rows && sl.kind === 'table') {
    w(`**TABLE** — columns: ${sl.head.join(' · ')}`); w('');
    sl.rows.forEach(([a, b, c, win], k) =>
      w(`${k + 1}. **${a}**${win ? ' *(highlighted row)*' : ''} — ${b} — *right column:* ${c}`));
    w('');
  }
  if (sl.bars) { w('**BARS:**'); w(''); sl.bars.forEach(([l, v]) => w(`- ${l} — ${v}`)); w(`- *scale maximum:* ${sl.max}`); w(''); }
  if (sl.kind === 'compare') {
    ['left', 'right'].forEach(side => {
      const [k, big, p] = sl[side];
      w(`**${side.toUpperCase()} PANEL** — label \`${k}\`, headline number \`${big}\``); w(''); w(p); w('');
    });
  }
  if (sl.kind === 'two') {
    ['left', 'right'].forEach(side => {
      const [h, items] = sl[side];
      w(`**${side.toUpperCase()} COLUMN — ${h}**`); w('');
      items.forEach((t, k) => w(`${k + 1}. ${t}`)); w('');
    });
  }
  if (sl.kind === 'personajobs') {
    field('PERSONA ROLE', sl.role);
    field('PERSONA NAME', sl.name);
    field('PERSONA PHOTO', `\`${sl.photo || 'none — falls back to a drawn portrait'}\``);
    field('PERSONA BLURB', sl.blurb);
    list('JOB STATEMENTS (bold marks the emphasised clause)',
      sl.quotes.map(q => q.replace(/<\/?b>/g, '**')));
  }
  if (sl.kind === 'mock') {
    (sl.mocks || [[sl.mock, sl.cap, sl.mkk]]).forEach(([m, cap, k]) => {
      w(`**PHONE MOCK \`${m}\`**${k ? ` — label above: ${k}` : ''}`); w('');
      w(`- *caption below:* ${cap || '(none)'}`);
      w(`- *words on the screen:* ${words(MOCKS[m])}`);
      w('');
    });
    w('**PANELS:**'); w('');
    sl.panels.forEach(([h, b, hot], k) => w(`${k + 1}. **${h}**${hot ? ' *(highlighted panel)*' : ''} — ${b}`));
    w('');
  }
  if (sl.art) field('COVER ART', `\`${sl.art}\``);
  field('FOOT', sl.foot);
  field('SOURCE', sl.src);

  w('**NOTES:**');
  w('');
  w('---');
  w('');
});

process.stdout.write(out.join('\n'));
