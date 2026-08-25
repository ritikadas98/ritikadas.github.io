/* The deck engine, shared by every project deck.
 *
 * A deck defines these before loading this file:
 *   SLIDES  the slide list, required
 *   ART     named cover-art builders, optional, keyed by a slide's `art`
 *   FIGS    named diagrams, optional, keyed by a slide's `svg`
 *
 * *text* in a title, lead or cell paints that phrase in the accent colour.
 */

/* ---------------------------------------------------------------- render -- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/* *text* paints that phrase in the accent colour, the way amounts are painted on
   the rest of the site. */
const mark = s => esc(s).replace(/\*(.+?)\*/g, '<em class="hi">$1</em>');
/* Job statements carry their own <b> tags, so they are trusted, not escaped. */
const raw = s => String(s);
const d = i => `style="animation-delay:${i * 60}ms"`;

function head(sl) {
  let h = '';
  if (sl.pill) h += `<span class="pill r" ${d(0)}>${esc(sl.pill)}</span>`;
  h += `<h2 class="r ${sl.wide ? 'wide' : ''}" ${d(1)}>${mark(sl.title)}</h2>`;
  if (sl.lead) h += `<p class="lead r" ${d(2)}>${mark(sl.lead)}</p>`;
  return h;
}
const foot = sl => sl.src ? `<p class="src">${esc(sl.src)}</p>` : '';
const body = inner => `<div class="body">${inner}</div>`;

const ICONS = {
  stack: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
      <rect x="2.5" y="4" width="19" height="4" rx="2"/>
      <rect x="2.5" y="10" width="14" height="4" rx="2"/>
      <rect x="2.5" y="16" width="17" height="4" rx="2"/></svg>`,
  skim: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
      <circle cx="10.2" cy="10.2" r="6.4"/><path d="M15 15l6 6"/>
      <path d="M7.4 9.2h5.6M7.4 11.8h3.4"/></svg>`,
  quiet: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.7" stroke-linejoin="round" aria-hidden="true">
      <path d="M2.6 4.6h12.2v7.6H7.2L4.2 15v-2.8H2.6z"/>
      <path d="M17 13.2h4.4v4.4h-2.1L17.6 19v-1.4H17z" stroke-dasharray="2.4 2"/></svg>`,
  one: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3"/>
      <path d="M8.2 12.4l2.8 2.8 5-5.6"/></svg>`,
  network: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="5" r="2.6"/><circle cx="5" cy="18" r="2.6"/><circle cx="19" cy="18" r="2.6"/>
      <path d="M10.6 7.2L6.4 15.6M13.4 7.2l4.2 8.4M7.6 18h8.8"/></svg>`,
  money: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 17.5l5.4-5.6 3.6 3.2 4.2-5.4 4.8 4"/><path d="M15.6 4.9H21v5.3"/></svg>`,
  warn: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 3.6l9 15.8H3z"/><path d="M12 9.6v4.2M12 16.8v.1"/></svg>`,
  target: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r=".9"/></svg>`,
  clock: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.6"/><path d="M12 6.8V12l3.4 2.2"/></svg>`,
  leaves: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="9.2" cy="7" r="3.3"/>
      <path d="M3.4 20c0-3.4 2.6-5.8 5.8-5.8 1 0 2 .24 2.8.66"/>
      <path d="M15.4 16.6h5.6M18.6 13.8l2.8 2.8-2.8 2.8"/></svg>`,
  returns: `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="9.2" cy="7" r="3.3"/>
      <path d="M3.4 20c0-3.4 2.6-5.8 5.8-5.8 1 0 2 .24 2.8.66"/>
      <path d="M21 16.6h-5.6M17.8 13.8L15 16.6l2.8 2.8"/></svg>`
};

const FACE = `<svg class="pface" viewBox="0 0 200 210" role="img"
    aria-label="Drawn portrait of the persona: a product manager wearing glasses.">
  <circle class="halo" cx="100" cy="96" r="82"/>
  <path class="shirt" d="M100 150c-26 0-48 16-54 38-1 4 2 7 6 7h96c4 0 7-3 6-7-6-22-28-38-54-38z"/>
  <path class="collar" d="M84 154l16 18 16-18"/>
  <rect class="sk" x="88" y="118" width="24" height="30" rx="12"/>
  <ellipse class="sk" cx="68" cy="92" rx="7" ry="9"/>
  <ellipse class="sk" cx="132" cy="92" rx="7" ry="9"/>
  <ellipse class="sk" cx="100" cy="86" rx="32" ry="38"/>
  <path class="hr" d="M63 124V86a37 37 0 0 1 74 0v38h-13V88a24 24 0 0 0-48 0v36z"/>
  <circle cx="89" cy="90" r="2.6" fill="#1F2937"/><circle cx="111" cy="90" r="2.6" fill="#1F2937"/>
  <path class="ft" d="M93 106c4 4 10 4 14 0"/>
  <g class="gl">
    <rect x="76" y="80" width="20" height="17" rx="7"/>
    <rect x="104" y="80" width="20" height="17" rx="7"/>
    <path d="M96 87h8M76 86l-8 3M124 86l8 3"/>
  </g>
</svg>`;

const RENDER = {

  cover: sl => (sl.kicker ? `<span class="pill r" ${d(0)}>${esc(sl.kicker)}</span>` : '')
    + `<h1 class="r" ${d(1)}>${sl.href
         ? `<a href="${esc(sl.href)}" target="_blank" rel="noopener">${esc(sl.title)}</a>`
         : esc(sl.title)}</h1>
       <p class="lead r" ${d(2)}>${sl.leadHtml ? raw(sl.leadHtml) : esc(sl.lead)}</p>`
    + (sl.art && typeof ART !== 'undefined' && ART[sl.art] ? ART[sl.art]() : '')
    + `<p class="src">${esc(sl.foot)}</p>`,

  statement: sl => (sl.pill ? `<span class="pill r" ${d(0)}>${esc(sl.pill)}</span>` : '')
    + `<h2 class="big-say r" ${d(1)}>${mark(sl.title)}</h2>
       <p class="lead r" ${d(3)}>${mark(sl.lead)}</p>` + foot(sl),

  rows: sl => head(sl) + body(`<div class="rows">` + sl.rows.map((r, i) =>
      `<div class="row r ${sl.numbered ? '' : 'plain'} ${sl.hot === i ? 'hot' : ''}" ${d(i + 3)}>
         ${sl.numbered ? `<span class="n">${String(i + 1).padStart(2, '0')}</span>` : ''}
         <span class="t"><b>${esc(r[0])}</b><span>${mark(r[1])}</span></span>
       </div>`).join('') + `</div>`) + foot(sl),

  cards: sl => head(sl) + body(`<div class="grid g${sl.cols || 2}">` + sl.cards.map((c, i) =>
      `<div class="card r" ${d(i + 3)}>${c[2] && ICONS[c[2]] ? ICONS[c[2]] : ''}
         <h3>${mark(c[0])}</h3><p>${mark(c[1])}</p></div>`).join('')
      + `</div>`) + foot(sl),

  funnel: sl => head(sl) + body(`<div class="funnel">` + sl.steps.map((s, i) =>
      `<div class="step r" ${d(i + 3)}><span class="k">${esc(s[0])}</span>
         <div class="big">${esc(s[1])}</div><p>${esc(s[2])}</p></div>`).join('')
      + `</div>`) + foot(sl),

  bars: sl => head(sl) + body(
      (sl.barlab ? `<p class="barlab r" ${d(2)}>${mark(sl.barlab)}</p>` : '')
      + `<div class="bars">` + sl.bars.map((b, i) =>
      `<div class="bar r" ${d(i + 3)}><span>${esc(b[0])}</span>
         <span class="track"><span class="fill" style="--w:${(b[1] / sl.max * 100).toFixed(1)}%"></span></span>
         <span class="v">${esc(b[1])}${esc(sl.unit || '')}</span></div>`).join('') + `</div>`) + foot(sl),

  /* A fourth item on a panel names an icon from ICONS. */
  compare: sl => head(sl) + body(`<div class="split2">` +
      [['was', sl.left], ['now', sl.right]].map(([cls, p], i) =>
      `<div class="panel ${cls} r" ${d(i + 3)}>
         ${p[3] && ICONS[p[3]] ? ICONS[p[3]] : ''}
         <span class="k">${esc(p[0])}</span>
         <div class="big">${esc(p[1])}</div><p>${mark(p[2])}</p></div>`).join('')
      + `</div>`) + foot(sl),

  quad: sl => head(sl) + body(`<div class="quadwrap">
      <div class="qy">${esc(sl.y)}</div>
      <div class="quad">` + sl.cells.map((c, i) =>
      `<div class="qc r ${c.win ? 'win' : ''}" ${d(i + 3)}>
         <span class="qk">${esc(c.k)}</span>
         <span class="qn">${c.names.map(n => `<b>${esc(n)}</b>`).join('')}</span>
       </div>`).join('') + `</div>
      <div class="qx">${esc(sl.x)}</div>
    </div>`) + foot(sl),

  personajobs: sl => head(sl) + body(`<div class="pj">
      <div class="pcard r" ${d(3)}>
        ${sl.photo
          ? `<img class="pphoto" src="${esc(sl.photo)}" width="800" height="800"
                  alt="${esc(sl.photoAlt || sl.name)}" onerror="this.outerHTML=FACE">`
          : FACE}
        <div class="pmeta">
          <span class="prole">${esc(sl.role)}</span>
          <span class="pname">${esc(sl.name)}</span>
          <p>${esc(sl.blurb)}</p>
        </div>
      </div>
      <div class="quotes">` + sl.quotes.map((q, i) =>
      `<div class="quote r" ${d(i + 4)}>${raw(q)}</div>`).join('') + `</div>
    </div>`) + foot(sl),

  quotes: sl => head(sl) + body(`<div class="quotes">` + sl.quotes.map((q, i) =>
      `<div class="quote r" ${d(i + 3)}>${raw(q)}</div>`).join('') + `</div>`) + foot(sl),

  two: sl => head(sl) + body(`<div class="two">` +
      [['in', sl.left], ['out', sl.right]].map(([cls, col], i) =>
      `<div class="tcol ${cls} r" ${d(i + 3)}><h3>${esc(col[0])}</h3>
         <ul>${col[1].map(li => `<li>${mark(li)}</li>`).join('')}</ul>
       </div>`).join('') + `</div>`) + foot(sl),

  table: sl => head(sl) + body(`<div class="tbl">
      <div class="trow head"><span>${sl.head.map(esc).join('</span><span>')}</span></div>`
      + sl.rows.map((r, i) =>
      `<div class="trow r ${r[3] ? 'win' : ''}" ${d(i + 3)}>
         <b>${esc(r[0])}</b><span class="td">${mark(r[1])}</span>
         <span class="tv">${mark(r[2])}</span>
       </div>`).join('') + `</div>`) + foot(sl),

  week: sl => head(sl) + body(`<div class="wk">
      <div class="funnel vert">` + sl.steps.map((t, i) =>
      `<div class="step r" ${d(i + 3)}><span class="k">${esc(t[0])}</span>
         <div class="big">${esc(t[1])}</div><p>${esc(t[2])}</p></div>`).join('') + `</div>
      <div class="bars">` + sl.bars.map((b, i) =>
      `<div class="bar r" ${d(i + 4)}><span>${esc(b[0])}</span>
         <span class="track"><span class="fill" style="--w:${(b[1] / sl.max * 100).toFixed(1)}%"></span></span>
         <span class="v">${esc(b[1])}</span></div>`).join('') + `</div>
    </div>`) + foot(sl),

  /* A device mock beside the panels that explain it. `mock` names one screen from
     MOCKS; `mocks` names two, for a before-and-after. A solution slide has to show
     the thing, and no other kind puts a picture and its argument on one page. */
  mock: sl => head(sl) + body(`<div class="mock">
      <div class="mkstage${sl.mocks ? ' duo' : ''}">` +
      (sl.mocks || [[sl.mock, sl.cap, sl.mkk]]).map(([m, cap, k], i) =>
      `<figure class="mkphone r" ${d(i + 3)}>
         ${k ? `<span class="mkk">${esc(k)}</span>` : ''}
         <div class="mkscreen">${(typeof MOCKS !== 'undefined' && MOCKS[m]) || ''}</div>
         ${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}
       </figure>`).join('') + `</div>
      <div class="mkside">` + sl.panels.map((p, i) =>
      `<div class="mkpanel r ${p[2] ? 'hot' : ''}" ${d(i + 4)}>
         <h3>${esc(p[0])}</h3><p>${mark(p[1])}</p>
       </div>`).join('') + `</div>
    </div>`) + foot(sl),

  /* A real screenshot beside the panels that read it. `mock` draws a screen this
     repo built; this one shows a screen somebody else shipped, which is what a
     teardown has as evidence. `img` is a path, `alt` describes it, `cap` is the
     line under the frame that says where it came from. */
  shot: sl => head(sl) + body(`<div class="shot">
      <figure class="shotframe r" ${d(3)}>
        <img src="${esc(sl.img)}" alt="${esc(sl.alt || '')}" loading="lazy" decoding="async">
      </figure>
      <div class="shotside">` + sl.panels.map((p, i) =>
      `<div class="mkpanel r ${p[2] ? 'hot' : ''}" ${d(i + 4)}>
         <h3>${esc(p[0])}</h3><p>${mark(p[1])}</p>
       </div>`).join('')
      + (sl.cap ? `<p class="shotcap r" ${d(sl.panels.length + 4)}>${mark(sl.cap)}</p>` : '')
      + `</div>
    </div>`) + foot(sl),

  figure: sl => head(sl) + body(`<div class="fig r" ${d(3)}>${(typeof FIGS !== 'undefined' && FIGS[sl.svg]) || ''}</div>`) + foot(sl),

  journey: sl => head(sl) + body(`<div class="journey">` + sl.tracks.map(([name, steps], t) =>
      `<div class="jrow ${t === 0 ? 'was' : 'now'}">
         <span class="tname">${esc(name)}</span>
         <div class="tsteps">` + steps.map(([label, tone], i) =>
      `<div class="tstep r ${tone === 1 ? 'bad' : ''}${tone === 2 ? 'good' : ''}" ${d(i + 3 + t * 2)}>${esc(label)}</div>`)
      .join('') + `</div>
       </div>`).join('') + `</div>`) + foot(sl)
};

const stage = document.getElementById('stage');
stage.innerHTML = SLIDES.map(sl => {
  const cls = sl.kind === 'cover' && !sl.dark ? 'grad'
            : sl.kind === 'cover' ? 'dark mid'
            : sl.kind === 'statement' ? 'dark mid' : '';
  return `<section class="slide ${cls}">${RENDER[sl.kind](sl)}</section>`;
}).join('');

/* -------------------------------------------------------------- navigate -- */
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

/* Tap the right or left third to move, but never on the nav buttons. */
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
