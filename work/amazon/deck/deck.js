/* Amazon Discovery Intelligence — deck.
 *
 * Slides live here as data, not markup, so the five decks can share one renderer
 * and differ only in content and the six colour values in the stylesheet.
 *
 * Every figure is from the live run of 18 Aug 2026 and they move every week.
 * Re-pull from /digests and /runs/latest before regenerating. The four charted
 * sets reconcile: 105+69+61+22+19+16+7 = 299, and 291+196+13 = 500.
 */

const SLIDES = [

{ kind: 'cover',
  kicker: 'Shipped product · case study',
  title: 'Amazon Discovery Intelligence',
  lead: 'Reads a week of public Amazon reviews and names the one problem worth starting. For the rest, it says what evidence is missing.',
  foot: 'Ritika Das · ritikadas.in' },

{ kind: 'rows', pill: 'The problem',
  title: 'A PM cannot read every review, so they skim',
  lead: 'Skimming feels fine, because you never find out what you missed. The complaint that mattered was in there and nobody counted it.',
  rows: [
    ['Decision', 'A ranked list hands the queue back. Each problem leads with a finding, a first move and a price.'],
    ['Evidence', '299 complaints sorted into 33 problems across 7 parts of the app.'],
    ['Outcome',  'One of 33 had enough behind it to act on, and the page says so plainly.']
  ] },

{ kind: 'funnel', pill: 'One week',
  title: 'What a week actually produces',
  lead: 'The last number is the point. Most tools would have ranked all 33 and let you find out the hard way.',
  steps: [
    ['Collected', '500', 'Reviews pulled from three sources'],
    ['Sorted',    '299', 'Enough substance to place in a problem'],
    ['Problems',  '33',  'Across 7 parts of the app'],
    ['Ready',     '1',   'Enough evidence behind it to act on']
  ],
  src: 'Live run, 18 August 2026. Figures move every week.' },

{ kind: 'bars', pill: 'Where they land',
  title: 'Seven parts of the app',
  lead: 'The 299 sorted complaints, by the part of the app they are about. Account and search carry more than half between them.',
  max: 105,
  bars: [
    ['Account & performance', 105], ['Search & discovery', 69], ['Delivery & tracking', 61],
    ['Product detail', 22], ['Checkout & payment', 19], ['Returns & refunds', 16],
    ['Prime & subscriptions', 7]
  ],
  src: 'Live run, 18 August 2026.' },

{ kind: 'bars', pill: 'Where they come from',
  title: 'Three live sources, unevenly',
  lead: 'Apple carries most of it, which I did not expect. Amazon’s own product pages contribute almost nothing, because the public reviews there are mostly praise and the complaint filter drops them.',
  max: 291,
  bars: [['App Store', 291], ['Play Store', 196], ['Amazon product pages', 13]],
  src: 'Live run, 18 August 2026.' },

{ kind: 'statement', pill: 'The mistake',
  title: 'It looked at *53* complaints and wrote “only one person reported this”',
  lead: 'I had asked the model to score how strong the evidence behind a problem was. One of the things I asked it to score was how many people had raised it. Code had already counted that. Exactly.' },

{ kind: 'cards', pill: 'The rule', cols: 4,
  title: 'Never ask a model to grade what you have already counted',
  lead: 'The split is not about how clever the model is. It is about which jobs already have an exact answer sitting in the code.',
  cards: [
    ['What the model does', 'Reads messy review text and groups complaints into problems. Noticing that four hundred badly written complaints are the same problem is what a model is good at.'],
    ['What code does', 'Every count. How many people raised it, how many sources, the score, the week-over-week change. Arithmetic, which a model is not good at.'],
    ['Where I drew it wrong', 'The readiness step was asked to grade a number I had already counted exactly. It said “only one person” beside the number 53.'],
    ['The fix', 'Not a better prompt. Taking the job away. Gemini runs at 4 of the 14 steps and none of them is arithmetic.']
  ] },

{ kind: 'rows', pill: 'How it works', numbered: true, hot: 3,
  title: 'The pipeline, and who does each part',
  lead: 'Fourteen steps run every Monday. The model is called at four of them, and none of the four is arithmetic. Every number a PM sees is counted in code.',
  rows: [
    ['Collect', 'App Store, Play Store and Amazon product pages'],
    ['Filter',  'A substance bar drops “good app” and emoji-only, in any language'],
    ['Group',   'The model reads and clusters complaints into problems'],
    ['Count',   'Code does every figure: people, sources, score, week-over-week'],
    ['Gate',    'Refuses to rank a problem it cannot back, and names what is missing'],
    ['Deliver', 'A digest that leads with one first move, an owner and a price']
  ] },

{ kind: 'compare', pill: 'The insight',
  title: 'Severity measures loudness, not cost',
  lead: 'Someone who cannot find a product writes a furious review. Someone charged twice writes a short, tired one.',
  left:  ['Ranked on tone alone', '3.2', 'The upset score on the week’s costliest problem. Unremarkable. 23 complaints that cost people money sit across 7 problems, most of them below problems that only irritated people.'],
  right: ['Two scores, not one', '44', 'Complaints on the problem that came top. 13 packages lost or sent to the wrong address, 2 charged for items that never arrived. The two scores disagree often enough to earn the second look.'] },

{ kind: 'cards', pill: 'Trade-offs', cols: 3,
  title: 'Three calls, and what each one bought',
  lead: 'Each gave something up, and each bought something worth more.',
  cards: [
    ['A spreadsheet over a database', 'Gave up queries and schema control. Got a store PMs already sort, filter and share — and *₹1,100* a month became *₹40*.'],
    ['Their schema over mine', 'Gave up a clean schema of my own. Kept every filter and pivot a PM had already built on the sheet, misspelled header and all.'],
    ['The question over the archive', 'Gave up the week-by-week history view. Nobody asks what happened in week 22. They ask what is going wrong in Checkout.']
  ] },

{ kind: 'cards', pill: 'The evidence', cols: 4,
  title: 'What the evidence supports',
  lead: 'No product manager has run a week through this one yet. That is not the same as having no evidence.',
  cards: [
    ['The category is proven', 'Atlassian says its PMs save about 40 minutes a day to an agent reading their feedback queue. Dovetail and Amplitude sell the same clustering to Canva, Meta and NTT DOCOMO.'],
    ['Where this one differs', 'All of them stop at a ranked list, and the PM still has to open it and decide. This names the first move, the owner and the price.'],
    ['What that predicts', 'On the same inputs it should land in the same range, and take back the hour a ranked list hands straight back. Inference, not a measured result.'],
    ['What would settle it', 'Whether the named first move gets taken. The digest already carries a feedback link, so that number is one week of real use away.']
  ] },

{ kind: 'cover', dark: true,
  kicker: 'Live',
  title: 'amazon.ritikadas.in',
  lead: 'Runs Mondays at 09:00, scales to zero between runs, about ₹40 a month. Write-up at ritikadas.in/work/amazon',
  foot: 'Ritika Das · ritikadas.in' }

];

/* ---------- render ---------- */
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
/* *text* in a title paints that word in the accent colour. */
const mark = s => esc(s).replace(/\*(.+?)\*/g, '<em class="hi">$1</em>');
const d = (i, s) => `style="animation-delay:${(i * 60 + (s || 0))}ms"`;

function head(sl, i) {
  let h = '';
  if (sl.pill) h += `<span class="pill r" ${d(0)}>${esc(sl.pill)}</span>`;
  h += `<h2 class="r ${sl.wide ? 'wide' : ''}" ${d(1)}>${esc(sl.title)}</h2>`;
  if (sl.lead) h += `<p class="lead r" ${d(2)}>${esc(sl.lead)}</p>`;
  return h;
}
const foot = sl => sl.src ? `<p class="src">${esc(sl.src)}</p>` : '';
const body = inner => `<div class="body">${inner}</div>`;

const RENDER = {
  cover: sl => (sl.kicker ? `<span class="pill r" ${d(0)}>${esc(sl.kicker)}</span>` : '')
      + `<h1 class="r" ${d(1)}>${esc(sl.title)}</h1>
      <p class="lead r" ${d(2)}>${esc(sl.lead)}</p>
      <p class="src">${esc(sl.foot)}</p>`,

  statement: sl => (sl.pill ? `<span class="pill r" ${d(0)}>${esc(sl.pill)}</span>` : '')
      + `<h2 class="big-say r" ${d(1)}>${mark(sl.title)}</h2>
      <p class="lead r" ${d(3)}>${esc(sl.lead)}</p>`,

  rows: sl => head(sl) + body(`<div class="rows">` + sl.rows.map((r, i) =>
      `<div class="row r ${sl.numbered ? '' : 'plain'} ${sl.hot === i ? 'hot' : ''}" ${d(i + 3)}>
         ${sl.numbered ? `<span class="n">${String(i + 1).padStart(2, '0')}</span>` : ''}
         <span class="t"><b>${esc(r[0])}</b><span>${mark(r[1])}</span></span>
       </div>`).join('') + `</div>`) + foot(sl),

  cards: sl => head(sl) + body(`<div class="grid g${sl.cols || 2}">` + sl.cards.map((c, i) =>
      `<div class="card r" ${d(i + 3)}><h3>${esc(c[0])}</h3><p>${mark(c[1])}</p></div>`).join('')
      + `</div>`) + foot(sl),

  funnel: sl => head(sl) + body(`<div class="funnel">` + sl.steps.map((s, i) =>
      `<div class="step r" ${d(i + 3)}><span class="k">${esc(s[0])}</span>
         <div class="big">${esc(s[1])}</div><p>${esc(s[2])}</p></div>`).join('')
      + `</div>`) + foot(sl),

  bars: sl => head(sl) + body(`<div class="bars">` + sl.bars.map((b, i) =>
      `<div class="bar r" ${d(i + 3)}><span>${esc(b[0])}</span>
         <span class="track"><span class="fill" style="--w:${(b[1] / sl.max * 100).toFixed(1)}%"></span></span>
         <span class="v">${esc(b[1])}</span></div>`).join('') + `</div>`) + foot(sl),

  compare: sl => head(sl) + body(`<div class="split2">` +
      [['was', sl.left], ['now', sl.right]].map(([cls, p], i) =>
      `<div class="panel ${cls} r" ${d(i + 3)}><span class="k">${esc(p[0])}</span>
         <div class="big">${esc(p[1])}</div><p>${mark(p[2])}</p></div>`).join('')
      + `</div>`) + foot(sl)
};

const stage = document.getElementById('stage');
stage.innerHTML = SLIDES.map(sl => {
  const cls = sl.kind === 'cover' && !sl.dark ? 'grad mid'
            : sl.kind === 'cover' ? 'dark mid'
            : sl.kind === 'statement' ? 'dark mid' : '';
  return `<section class="slide ${cls}">${RENDER[sl.kind](sl)}</section>`;
}).join('');

/* ---------- navigate ---------- */
const slides = [...document.querySelectorAll('.slide')];
const bar = document.getElementById('bar');
const count = document.getElementById('count');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
let at = 0;

function show(n, moved) {
  at = Math.max(0, Math.min(slides.length - 1, n));
  slides.forEach((s, i) => {
    s.classList.toggle('on', i === at);
    s.classList.toggle('past', i < at);
  });
  bar.style.width = ((at + 1) / slides.length * 100) + '%';
  count.textContent = (at + 1) + ' / ' + slides.length;
  prev.disabled = at === 0;
  next.disabled = at === slides.length - 1;
  const s = slides[at];
  document.body.classList.toggle('on-dark', s.classList.contains('dark') || s.classList.contains('grad'));
  if (moved) document.body.classList.add('moved');
  const h = '#' + (at + 1);
  if (location.hash !== h) history.replaceState(null, '', h);
}

const go = n => show(n, true);
next.addEventListener('click', () => go(at + 1));
prev.addEventListener('click', () => go(at - 1));

addEventListener('keydown', e => {
  const k = e.key;
  if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); go(at + 1); }
  else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); go(at - 1); }
  else if (k === 'Home') { e.preventDefault(); go(0); }
  else if (k === 'End') { e.preventDefault(); go(slides.length - 1); }
});

/* Tap the right or left third to move, but not on the nav buttons. */
stage.addEventListener('click', e => {
  if (e.target.closest('#nav')) return;
  const x = e.clientX / innerWidth;
  if (x > 0.66) go(at + 1); else if (x < 0.34) go(at - 1);
});

let x0 = null;
stage.addEventListener('touchstart', e => { x0 = e.changedTouches[0].clientX; }, { passive: true });
stage.addEventListener('touchend', e => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 48) go(at + (dx < 0 ? 1 : -1));
  x0 = null;
}, { passive: true });

show(Math.max(0, (parseInt(location.hash.slice(1), 10) || 1) - 1), false);
