/* ritikadas.in — behaviour for every page on the site.
   Loaded with defer, which runs it after the HTML is parsed: the same moment the
   inline version at the end of <body> used to run, so nothing reorders.
   The theme is applied by a separate inline script in <head>, because that one
   must run before the first paint and so can never be deferred or external. */

/* ---- LIGHT / DARK THEME TOGGLE ---- */
(function(){
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  /* Shared with the article pages. This is the first block in the file, so an
     unguarded throw here would take out every script below it. */
  if (!themeBtn || !themeIcon || !themeText) return;
  
  /* Light for everybody on a first visit, whatever the device is set to. The
     site was written light and the dark palette is the alternative, so a
     phone on system-dark used to open on the version nobody designed first.
     A visitor who picks dark is remembered and keeps it; that choice is the
     only thing that turns the site dark. The stylesheet matches this — dark
     lives entirely under [data-theme="dark"] and no media query. */
  const savedTheme = localStorage.getItem('theme') || 'light';

  /* The browser paints its own chrome — the address bar on a phone — from this,
     and it cannot follow an attribute, so it is set alongside the theme.
     Values are --paper from each palette. */
  function paintBrowserChrome(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#1A171C' : '#EDE8E1');
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    paintBrowserChrome(theme);
    if (theme === 'dark') {
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Light';
    } else {
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Dark';
    }
  }
  
  applyTheme(savedTheme);
  
  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
})();


/* ---- CARD HOVER ----
   Nothing here any more. The 3D tilt went first: it skewed the body copy while
   someone was reading it, and on a page selling judgment a card that wobbles
   under the cursor is the wrong kind of clever. The lift that replaced it has
   since gone too — a card that moves under the cursor reads as a toy. Hover is
   depth only now, a deeper shadow, and it lives entirely in the stylesheet. */

/* ---- FITCHECK WIDGET ------------------------------------------------------
   A teaser, not a reimplementation. It shows the verdict and nothing else —
   no ease figures, no formula — so the interesting part is still the real demo
   and repo. What sits underneath is genuine: these are the actual products and
   the actual retailer size charts from the fixtures in the FitCheck repo, and
   the size it lands on is the size the real engine lands on.
   Verdict tiers are the product's own three (FC.14). --------------------- */
const FIT_GARMENTS = {
  jeans: {
    button: "Levi's Jeans",
    axis: 'Waist measurement',
    min: 24, max: 46, start: 30,
    /* AJIO — LEVI'S "Men Lightly Washed 513 Straight Jeans".
       Bottoms compare body-chart to body, no ease. The published chart waist
       runs 2" above the size label, which is exactly why a 30" waist needs
       size 28 — the real return this project was validated against. */
    mode: 'body',
    chart: { '28':30, '30':32, '32':34, '34':36, '36':38, '38':40, '40':42 }
  },
  tee: {
    button: 'Flying Machine Tee',
    axis: 'Chest measurement',
    min: 30, max: 52, start: 38,
    /* MYNTRA — Flying Machine drop-shoulder tee. Ships garment-flat chest only,
       no body chart, so designed ease is inferred (3" for a regular top). */
    mode: 'ease',
    ease: 3,
    chart: { 'S':39.5, 'M':41.5, 'L':45, 'XL':47, 'XXL':50.5, '3XL':51 }
  },
  blouse: {
    button: 'H&M Blouse',
    axis: 'Bust measurement',
    min: 26, max: 48, start: 34,
    /* H&M — Flounced Tie-Front Blouse. H&M's size guide lazy-loads from its own
       API, which a content script cannot fetch, so the adapter falls back to
       H&M's published static chart. These are those numbers. */
    mode: 'body', ease: 3,
    chart: { 'XXS':30, 'XS':31.5, 'S':33.75, 'M':37, 'L':40.25 }
  }
};

let currentFitGarment = 'jeans';

/* How far your measurement sits from what this size is cut for.
   0 means you land exactly on a chart value. */
function fitOffset(g, body, chartVal) {
  return g.mode === 'body'
    ? chartVal - body                 // body chart: "this size fits an X inch body"
    : (chartVal - body) - g.ease;     // garment-flat: ease you get vs ease intended
}

/* Deliberately simpler than src/lib/fit-math.ts, and tuned so the traffic light
   actually changes as you drag — the engine's own tiering resolves to green
   almost everywhere here, because a full size run nearly always contains a good
   fit. The bands still mean something real: landing on a chart value is a clean
   recommendation, sitting between two sizes is the classic "may work", and
   falling outside the run is genuinely not recommended. */
function gradeFitOffset(a) {
  if (a <= 0.75) return 'green';
  if (a <= 1.75) return 'amber';
  return 'red';
}

function updateFitWidget() {
  const g = FIT_GARMENTS[currentFitGarment];
  const slider = document.getElementById('fit-chest-slider');
  const box = document.getElementById('fit-result-box');
  if (!g || !slider || !box) return;

  const body = parseInt(slider.value, 10);
  const val = document.getElementById('fit-chest-val');
  if (val) val.textContent = body + ' in';
  const axis = document.getElementById('fit-axis-label');
  if (axis) axis.textContent = g.axis;

  let best = null;
  for (const [size, chartVal] of Object.entries(g.chart)) {
    const a = Math.abs(fitOffset(g, body, chartVal));
    if (!best || a < best.a) best = { size, a };
  }

  const TIERS = {
    green: ['verdict-good', 'Recommended for you'],
    amber: ['verdict-warn', 'May work for you'],
    red:   ['verdict-bad',  'Not recommended']
  };
  const tier = gradeFitOffset(best.a);
  const [cls, label] = TIERS[tier];
  const size = tier === 'red' ? '' : 'Size ' + best.size + ' \u00b7 ';
  box.innerHTML = '<span class="' + cls + '">\u25cf ' + size + label + '</span>';
}

function setFitGarment(key, btn) {
  currentFitGarment = key;
  document.querySelectorAll('#widget-fitcheck .widget-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const g = FIT_GARMENTS[key];
  const slider = document.getElementById('fit-chest-slider');
  if (slider) { slider.min = g.min; slider.max = g.max; slider.value = g.start; }
  updateFitWidget();
}

function setSavioScenario(type, btn) {
  document.querySelectorAll('#widget-savio .widget-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const box = document.getElementById('savio-result-box');
  if (!box) return;

  /* Plain-language versions of what the real app says. The product itself
     names the rule it used and shows the working; this only shows the call. */
  const CASES = {
    shoes: ['verdict-good', 'Green \u2014 go ahead',
            'Small enough that it doesn\u2019t need thinking about, and it doesn\u2019t touch anything Priya has already committed to.'],
    watch: ['verdict-warn', 'Amber \u2014 wait 48 hours',
            'Over the \u20b93,000 line she set for herself. It waits two days. If she still wants it then, she buys it.'],
    phone: ['verdict-bad', 'Red \u2014 not this month',
            'More than the whole month has left. Instead of stopping there, Savio shows what it would take to get her to yes.']
  };
  const [cls, label, why] = CASES[type] || CASES.shoes;
  box.innerHTML = '<span class="' + cls + '">\u25cf ' + label + '</span>'
                + '<div class="savio-why">' + why + '</div>';
}

function setAmazonPipeline(mode, btn) {
  document.querySelectorAll('#widget-amazon .widget-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const box = document.getElementById('amazon-result-box');
  if (!box) return;

  /* Real rows from a real run — week 23, sample dataset. The scores, signal
     counts, severities and MoSCoW tags are exactly what the pipeline produced.
     The formula that generates them is in the drawer, not here. */
  const ROWS = {
    top: ['verdict-bad',  'Delivery &amp; Tracking',   '81.6', 'Must Have',
          '19 complaints, severity 3.6, and getting worse. Top of the list, and the one to look at first.'],
    mid: ['verdict-warn', 'Checkout &amp; Payment',    '60.6', 'Should Have',
          '16 complaints, severity 3.8. Painful, but fewer people are hitting it than the ones above.'],
    low: ['verdict-good', 'Product Detail Pages',  '40.7', "Won&rsquo;t Have",
          '20 complaints, but milder ones at severity 3.5. Real, and still not worth the week.']
  };
  const [cls, name, score, moscow, why] = ROWS[mode] || ROWS.top;
  box.innerHTML =
      '<span class="' + cls + '">\u25cf ' + name + ' \u00b7 ' + score + '</span>'
    + '<div class="savio-why"><b>' + moscow + '</b>. ' + why + '</div>';
}

/* INITIALIZE ALL WIDGETS ON LOAD */
window.addEventListener('DOMContentLoaded', () => {
  /* Only the homepage has these. The article pages share this file, and the
     removed YouTube widget left a querySelector here returning null, which threw
     and killed everything after it in this listener. */
  if (document.getElementById('widget-fitcheck') || document.getElementById('fit-chest-slider')) updateFitWidget();
  const savio  = document.querySelector('#widget-savio .widget-btn.active');
  const amazon = document.querySelector('#widget-amazon .widget-btn.active');
  if (savio)  setSavioScenario('shoes', savio);
  if (amazon) setAmazonPipeline('sample', amazon);
});

/* ---- PRELOADER — REAL PROGRESS ----
   The percentage reflects work that has actually finished, not a stopwatch.
   Three real milestones each contribute a share of the bar, and the number can
   never show progress that hasn't happened. Consequence: on a fast or cached
   load the curtain lifts as soon as the page is genuinely ready, instead of
   sitting through a fixed animation.

   SAFETY: the curtain covers the whole page, so anything that stalls this script
   would leave a visitor staring at a blank panel. Exit is therefore guaranteed
   by MAX_WAIT below, which fires no matter what happens above it. See also the
   <noscript> rule in <head>, for when JS never runs at all. */
(function(){
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  const countEl = document.getElementById('preloader-count');

  let dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    preloader.classList.add('done');
  }

  /* HARD CEILING — never hold the page longer than this, whatever the network
     does. Fonts load with `display=swap`, so text is readable before they
     arrive; there is nothing worth waiting past this point for. */
  const MAX_WAIT = 2000;
  const capTimer = setTimeout(dismiss, MAX_WAIT);

  try {
    /* Milestone weights sum to 100. Fonts carry the largest share because three
       families over a slow connection are the real wait on this page. */
    let earned = 0;
    const add = w => { earned = Math.min(100, earned + w); };

    /* 1. Markup parsed. */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => add(25), { once:true });
    } else add(25);

    /* 2. Webfonts actually available. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => add(45)).catch(() => add(45));
    } else add(45);

    /* 3. Images and everything else decoded. */
    if (document.readyState === 'complete') add(30);
    else window.addEventListener('load', () => add(30), { once:true });

    /* The displayed figure eases toward what has been earned, so it reads
       smoothly — but it is clamped to `earned` and so never overstates.
       MIN_STEP stops the easing curve from crawling as it converges. */
    const MIN_STEP = 6;
    let shown = 0;
    (function tick(){
      if (dismissed) return;
      shown = Math.min(earned, shown + Math.max((earned - shown) * 0.2, MIN_STEP));
      if (earned >= 100 && shown >= 100) {
        if (countEl) countEl.textContent = '100%';
        clearTimeout(capTimer);
        setTimeout(dismiss, 100);
        return;
      }
      if (countEl) countEl.textContent = Math.floor(shown) + '%';
      requestAnimationFrame(tick);
    })();
  } catch (e) {
    dismiss();
  }
})();

/* The script-driven custom cursor that used to live here is gone. It drew a ring at
   a lerped position — about five frames behind the real pointer — and hid the real
   one with `cursor:none`, so you aimed with a marker that was never where the click
   would land. Smoothing is the whole point of that effect and also the whole problem
   with it: any lag at all breaks pointing, and with the lag removed there is nothing
   left that a script needs to draw.

   The ring still exists. It is now `cursor: url(...)` art at the bottom of
   styles.css, composited by the browser at the OS level and therefore always exactly
   on its hotspot. If you want to change how the cursor looks, change it there and
   rerun tools/cursor-art.py — do not bring the pointer back under JS control. */


/* ---- YOUR CALL ----
   Six product decisions, each one lifted from the decision log in its own repo:
   fitchecker/docs/PM_DECISIONS.md, Savio/PM_DECISIONS.md and
   amazon-discovery-intel-repo/DECISIONS.md.

   The question is put to the reader in general terms, because a visitor who has
   not read the project page cannot answer a question about the project. The
   product is named afterwards, in the reveal, along with what she had, what she
   added on top of it, and the result that would have told her the second part
   was wrong.

   No score. A tally told an experienced PM they were wrong, which is a claim
   none of these decisions can support: every one was made on partial data.

   Guarded on the deck element like every other block in this file: /writing/
   shares this script and has no deck on it. */
(function(){
  const deckHost = document.getElementById('gm-q');
  if (!deckHost) return;

  const CARDS = [
    /* `topic` and `note` head the card, and name the kind of decision rather
       than the product, so the question can be answered cold. `mine` opens the
       reveal and is where the product finally appears.

       Two forks per product. The sides run a,b,b,a,a,b so her answer does not
       sit on one side in a pattern anyone could read as rigged. */

    { topic:'Who you build for', note:'reach against depth',
      q:'You can serve the biggest group of users, or the smaller group with the sharpest version of the problem. Which one does v1 go to?',
      qnote:'The small group is a fraction of the market. The big one is most of it.',
      a:'The smaller group, where the problem bites hardest',
      b:'The bigger group, where the traffic already is',
      hers:'a',
      mine:'FitCheck. I aimed the extension at people shopping on a laptop.',
      knew:'Mobile is roughly 60% of fashion traffic in India, and a browser extension cannot reach any of it.',
      assumed:'Fit doubt peaks on considered buys, and those get studied on a big screen with tabs open.',
      wrong:'Desktop sessions turning out as quick and single-tab as mobile ones. Then the wedge holds nobody worth serving.' },

    { topic:'What you hand them', note:'accuracy against a read',
      q:'The data your user needs is already on the screen, and they still get the decision wrong. Do you make the data better, or change the way it is read?',
      qnote:'Better data is easy to measure. A better read is not.',
      a:'Make the data better. Give them the exact numbers.',
      b:'Change the read. Same data, shown so they can act on it.',
      hers:'b',
      mine:'FitCheck. I show a tinted silhouette that reads snug, regular or loose.',
      knew:'Every product page already carries a size chart. Accuracy was not the thing missing.',
      assumed:'People cannot turn 36 inches into how a cut will sit on them. They want a read, not a sum.',
      wrong:'Shoppers glancing at the silhouette and going back to the chart anyway. Then the gap was arithmetic after all.' },

    { topic:'When you speak', note:'in the moment against after it',
      q:'You can step in while someone is deciding, or wait until they can see the whole picture. When do you help?',
      qnote:'One is the obvious moment. The other is the one they still open in month three.',
      a:'While they are deciding, when it can still change the outcome',
      b:'Afterwards, when the whole picture is in front of them',
      hers:'b',
      mine:'Savio. It speaks at the end of the month, not at the checkout.',
      knew:'Apps that ping at the moment of purchase get muted. That is the churn story across the category.',
      assumed:'By the time the app pings, the person has already decided. The nudge arrives after the commitment.',
      wrong:'A month of reflection changing nothing in the month that follows. Then the timing was mine and not theirs.' },

    { topic:'When they fall short', note:'recovery against a clean slate',
      q:'A user misses the target your product set with them. Do you offer a way to make it up, or clear the slate and start again?',
      qnote:'Both are honest. Only one of them gets opened again.',
      a:'Clear the slate, and say plainly what happened',
      b:'Offer a plan to make up the shortfall',
      hers:'a',
      mine:'Savio. A month that closes short is stated, and the next one starts clean.',
      knew:'Short months are normal at &#8377;40K to &#8377;1.2L a month. That is the segment, not an edge case.',
      assumed:'A payback screen reads as punishment, and people stop opening the app instead of paying it back.',
      wrong:'Users finishing a payback plan and coming back the next month. Then shame was a working mechanic and I cut it for nothing.' },

    { topic:'What you ask for', note:'evidence against momentum',
      q:'Your product finds a real problem but cannot size it. Do you tell the team what to fix, or what to go and measure?',
      qnote:'One is the answer they wanted. The other is the one your evidence can carry.',
      a:'What to measure. Name the number that would settle it.',
      b:'What to fix. Name the change so they can start on Monday.',
      hers:'a',
      mine:'Amazon Discovery. Each weekly digest ends with a number to go and get.',
      knew:'Reviews can establish that something is wrong. They cannot establish how often it happens.',
      assumed:'A PM will run a one-day query this week and defer a sprint. The smaller ask is the one that moves.',
      wrong:'PMs skipping the query and acting only when told what to build. Then I handed them homework instead of a decision.' },

    { topic:'What a report covers', note:'current against complete',
      q:'Your weekly report can cover the week that just ended, or the week in progress. Which one do you send?',
      qnote:'The finished week is already a few days old. The week in progress is not finished.',
      a:'The week in progress, so the number is as current as it can be',
      b:'The week that ended, so the number is whole',
      hers:'b',
      mine:'Amazon Discovery. The digest reports the last week that has finished.',
      knew:'The pipeline runs at 09:00 on Monday. The newest week it could name is nine hours old and nearly empty.',
      assumed:'A reader checks the week on the label against a calendar, and one label they can disprove costs trust in every number under it.',
      wrong:'Readers wanting a running total more than a week they could verify. Then the older label was the wrong trade.' }
  ];

  const $ = id => document.getElementById(id);
  let i = 0, answered = false;

  $('gm-pips').innerHTML = CARDS.map(() => '<i></i>').join('');

  function render(){
    const c = CARDS[i];
    answered = false;
    $('gm-src').innerHTML = c.topic;
    $('gm-srcnote').innerHTML = c.note;
    $('gm-q').innerHTML = c.q;
    $('gm-qnote').innerHTML = c.qnote;
    $('gm-a').querySelector('.gm-txt').innerHTML = c.a;
    $('gm-b').querySelector('.gm-txt').innerHTML = c.b;
    ['gm-a','gm-b'].forEach(k => { $(k).className = 'gm-opt'; $(k).disabled = false; });
    $('gm-reveal').className = 'gm-reveal';
    $('gm-prog').innerHTML = 'Fork ' + (i+1) + ' of ' + CARDS.length;
    $('gm-next').innerHTML = (i === CARDS.length - 1)
      ? 'Last one <span class="arr">&rarr;</span>'
      : 'Next <span class="arr">&rarr;</span>';
  }

  function pick(choice){
    if (answered) return;
    answered = true;
    const c = CARDS[i], same = (choice === c.hers);
    const mine = choice === 'a' ? $('gm-a') : $('gm-b');
    const hers = c.hers === 'a' ? $('gm-a') : $('gm-b');
    hers.classList.add('hers');
    mine.classList.add('yours');
    $('gm-a').disabled = true; $('gm-b').disabled = true;
    $('gm-verdict').innerHTML = same ? 'Same call' : 'We differ here';
    /* The product is named first, because this is the reader's first sight of
       it. Then the evidence, the guess laid on top of it, and the result that
       would have killed the guess. */
    $('gm-why').innerHTML =
      '<span class="gm-ln gm-mine">' + c.mine + '</span>' +
      '<span class="gm-ln"><b>What I knew.</b> ' + c.knew + '</span>' +
      '<span class="gm-ln"><b>What I assumed.</b> ' + c.assumed + '</span>' +
      '<span class="gm-ln"><b>What would have proved me wrong.</b> ' + c.wrong + '</span>';
    $('gm-reveal').className = 'gm-reveal on';
    $('gm-pips').children[i].className = 'on';
    /* On a phone the card is taller than the screen, so the reveal opens below
       the fold and the tap reads as nothing happening. Desktop already shows it,
       hence the width test rather than an unconditional scroll. */
    if (window.matchMedia('(max-width:860px)').matches) {
      const calm = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
      $('gm-reveal').scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'nearest' });
    }
  }

  function finish(){
    $('gm-play').style.display = 'none';
    $('gm-score').className = 'gm-score on';
    $('gm-prog').innerHTML = 'Done';
    /* Hiding the play state collapses the card from tall to short, which leaves
       the reader scrolled past the closing card, on a phone especially. Centre
       it again so the last thing they were reading is still on screen. */
    const calm = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    deckHost.closest('.game').scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' });
  }

  $('gm-a').addEventListener('click', () => pick('a'));
  $('gm-b').addEventListener('click', () => pick('b'));
  $('gm-next').addEventListener('click', () => {
    if (!answered) return;
    if (i === CARDS.length - 1) { finish(); return; }
    i++; render();
  });
  $('gm-again').addEventListener('click', () => {
    i = 0;
    $('gm-score').className = 'gm-score';
    $('gm-play').style.display = 'flex';
    Array.prototype.forEach.call($('gm-pips').children, p => p.className = '');
    render();
  });

  render();
})();


/* ---- WIDGET FLIP ----
   Always turns the same way. The panel that should be showing after the turn
   is moved into whichever slot will be facing forward, so three panels (or
   thirty) work with two physical faces and no unwinding. */
function flipWidget(key) {
  const wrap = document.getElementById('flip-' + key);
  if (!wrap) return;
  const inner = wrap.querySelector('.widget-flip-inner');
  const pool  = wrap.querySelector('.flip-pool');
  const slots = [wrap.querySelector('.flip-slot-a'), wrap.querySelector('.flip-slot-b')];
  const panels = Array.from(wrap.querySelectorAll('.flip-panel'))
                      .sort((p, q) => (+p.dataset.idx) - (+q.dataset.idx));
  if (panels.length < 2) return;

  const from = inner.offsetHeight;
  const turn = parseInt(wrap.dataset.turn || '0', 10) + 1;
  const into = slots[turn % 2];
  const outOf = slots[(turn + 1) % 2];

  while (into.firstElementChild) pool.appendChild(into.firstElementChild);
  into.appendChild(panels[turn % panels.length]);
  into.classList.add('in-flow');
  outOf.classList.remove('in-flow');

  wrap.dataset.turn = String(turn);
  inner.style.setProperty('--turn', String(turn));

  const to = inner.offsetHeight;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || from === to) {
    inner.style.height = '';
  } else {
    inner.style.height = from + 'px';
    requestAnimationFrame(() => { inner.style.height = to + 'px'; });
    setTimeout(() => { inner.style.height = ''; }, 620);
  }

  /* Panels parked in the pool are display:none, so they leave the tab order
     on their own — but the slot facing away is still rendered. */
  outOf.inert = true;  outOf.setAttribute('aria-hidden', 'true');
  into.inert  = false; into.setAttribute('aria-hidden', 'false');

  const btn = into.querySelector('.flip-btn');
  if (btn) btn.focus({ preventScroll: true });
}

document.querySelectorAll('.widget-flip').forEach(wrap => {
  const pool = wrap.querySelector('.flip-pool');
  if (!pool) return;
  Array.from(pool.children).forEach((p, i) => { p.dataset.idx = String(i); });
  wrap.dataset.turn = '0';
  const a = wrap.querySelector('.flip-slot-a');
  a.appendChild(pool.firstElementChild);        // panel 0 = the lead screenshot
  wrap.querySelector('.flip-slot-b').inert = true;
});

/* ---- INLINE SPEC TOGGLE ---- */
function toggleSpec(btn) {
  const card = btn.closest('.card');
  const drawer = card.querySelector('.spec-drawer');
  btn.classList.toggle('open'); drawer.classList.toggle('open');
}
function switchSpecTab(btn, tabName) {
  const drawer = btn.closest('.spec-drawer');
  drawer.querySelectorAll('.spec-tab-btn').forEach(b => b.classList.remove('active'));
  drawer.querySelectorAll('.spec-tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  drawer.querySelector(`.spec-tab-content[data-tab="${tabName}"]`).classList.add('active');
}

/* ---- MOBILE MENU ---- */
(function(){
  const btn  = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!btn || !menu) return;

  function setOpen(open){
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  btn.addEventListener('click', () => setOpen(!menu.classList.contains('open')));

  /* Tapping a section should navigate AND dismiss the menu. */
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) { setOpen(false); btn.focus(); }
  });

  /* Rotating to landscape can cross the breakpoint while the menu is open. */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 640 && menu.classList.contains('open')) setOpen(false);
  }, {passive:true});
})();

/* ---- SIDE NAV SCROLLSPY ----
   The dots had styling for an "active" state but nothing ever moved it, so the
   first dot stayed lit permanently. The rootMargin shrinks the observation band
   to a thin strip across the middle of the viewport, so whichever section is
   under that strip is the one marked active. */
(function(){
  const dots = Array.from(document.querySelectorAll('.side-dot'));
  if (!dots.length) return;

  const targets = new Map();
  dots.forEach(dot => {
    const id = (dot.getAttribute('href') || '').slice(1);
    const el = id && document.getElementById(id);
    if (el) targets.set(el, dot);
  });
  if (!targets.size) return;

  function setActive(dot) {
    dots.forEach(d => { d.classList.remove('active'); d.removeAttribute('aria-current'); });
    dot.classList.add('active');
    dot.setAttribute('aria-current', 'true');
  }

  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const dot = targets.get(en.target);
      if (dot && !dot.classList.contains('active')) setActive(dot);
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  targets.forEach((dot, el) => spy.observe(el));
})();



/* ---- NAV SCROLLED ---- */
const nav=document.getElementById('nav');
if (nav) {
  const onScroll=()=>nav.classList.toggle('scrolled',window.scrollY>8);
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});
}

/* ---- REVEAL OBSERVER (OPTIMIZED FAST REVEAL WITHOUT LAYOUT REPAINTS) ---- */
const io=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{ if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);} });
},{threshold:.08});
document.querySelectorAll('.reveal').forEach(e=>io.observe(e));

/* The elevator pitch is sized as "one screen minus the nav". The nav is sticky,
   so its height is real layout, and it changes with breakpoint and webfont. Read
   it rather than hardcode it, or the marquee drifts out of the fold again. */
(function(){
  const nav = document.getElementById('nav');
  if (!nav) return;
  const sync = () => document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  sync();
  addEventListener('resize', sync, {passive:true});
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
})();

/* ---- FOOTER YEAR ----
   It was hardcoded as 2026 in five separate files, which means five places to
   forget. Rewritten from the clock instead, so it can never read as abandoned. */
(function(){
  const y = new Date().getFullYear();
  document.querySelectorAll('.foot-in span').forEach(el => {
    el.textContent = el.textContent.replace(/\b20\d{2}\b/, y);
  });
})();

/* ---- READING PROGRESS ----
   Article pages only. Measures the article body rather than the document, so
   the bar reaches 100% when the argument ends and not when the footer does. */
(function () {
  const body = document.querySelector('.art-body');
  if (!body) return;

  const bar = document.createElement('div');
  bar.className = 'read-progress';
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-label', 'Reading progress');
  bar.setAttribute('aria-valuemin', '0');
  bar.setAttribute('aria-valuemax', '100');
  document.body.appendChild(bar);

  let ticking = false, last = -1;

  function draw() {
    ticking = false;
    const r = body.getBoundingClientRect();
    const top = r.top + window.scrollY;
    /* The last viewport of the article is already on screen when you reach the
       end of the scrollable range, so the denominator stops a screen short —
       otherwise the bar can never fill. */
    const span = Math.max(1, body.offsetHeight - window.innerHeight);
    const pct = Math.min(100, Math.max(0, ((window.scrollY - top) / span) * 100));
    const rounded = Math.round(pct);
    if (rounded === last) return;
    last = rounded;
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', String(rounded));
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(draw); }
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  draw();
})();

/* ---- IMAGE LIGHTBOX ----
   Opens a figure image at full size. Uses a native <dialog> so the focus trap,
   Escape handling and top-layer stacking come from the platform rather than
   from me getting them subtly wrong. */
(function () {
  const imgs = document.querySelectorAll(
    '.art-body figure img, .art-hero img, .art-hero-wide img, .fig-body img, .fig-row img, .wk-side-fig img'
  );
  if (!imgs.length) return;

  const dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.innerHTML =
    '<button type="button" class="lb-close" aria-label="Close image">&#10005;</button>' +
    '<p class="lb-hint">Esc to close</p>' +
    '<div class="lb-scroll"><figure class="lb-fig"><img alt=""><figcaption class="lb-cap"></figcaption></figure></div>';
  document.body.appendChild(dlg);

  const full = dlg.querySelector('.lb-fig img');
  const cap = dlg.querySelector('.lb-cap');
  const scroll = dlg.querySelector('.lb-scroll');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let opener = null;

  function open(img) {
    opener = img;
    full.src = img.currentSrc || img.src;
    full.alt = img.alt || '';
    const fc = img.closest('figure') && img.closest('figure').querySelector('figcaption');
    cap.textContent = fc ? fc.textContent.trim() : '';
    cap.hidden = !cap.textContent;

    const from = img.getBoundingClientRect();
    dlg.showModal();
    scroll.scrollTop = 0;

    /* FLIP: the panel is already where it belongs, so animate the difference
       from where the thumbnail was. Cheap, and it keeps the two images
       visually connected instead of one replacing the other. */
    if (!reduce.matches) {
      const to = full.getBoundingClientRect();
      if (to.width && to.height) {
        const sx = from.width / to.width, sy = from.height / to.height;
        const dx = (from.left + from.width / 2) - (to.left + to.width / 2);
        const dy = (from.top + from.height / 2) - (to.top + to.height / 2);
        full.animate(
          [{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.4 },
           { transform: 'none', opacity: 1 }],
          { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' }
        );
      }
    }
  }

  imgs.forEach(img => {
    img.classList.add('zoomable');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label',
      'Expand image' + (img.alt ? ': ' + img.alt : ''));
    /* The badge goes on the tightest frame around the image: .device and
       .browser already clip and round, so it lands on the screenshot itself
       rather than floating beside it. */
    const frame = img.closest('.device, .browser') || img.parentElement;
    if (frame) frame.classList.add('has-zoom');
    img.addEventListener('click', () => open(img));
    img.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); }
    });
  });

  dlg.querySelector('.lb-close').addEventListener('click', () => dlg.close());
  /* Clicking the backdrop closes. The figure stops the event so a click on the
     image itself — or a drag while pinch-zoomed — doesn't count as a miss. */
  dlg.addEventListener('click', e => { if (!e.target.closest('.lb-fig')) dlg.close(); });
  dlg.addEventListener('close', () => {
    full.removeAttribute('src');
    if (opener) { opener.focus({ preventScroll: true }); opener = null; }
  });
})();

/* ── Résumé click, counted as an event ─────────────────────────────────────────
   The résumé lives on Google Drive, so the visit itself is invisible to us: the
   click is the only signal that someone went looking for it, and it is the
   strongest intent signal on the page short of using the contact form.
   goatcounter.count() is the documented manual API; the guards mean a blocked or
   still-loading counter can never break the link. */
(() => {
  const link = document.querySelector('.hero-actions a[href*="drive.google.com"]');
  if (!link) return;
  link.addEventListener('click', () => {
    try {
      window.goatcounter?.count?.({
        path:  'resume-click',
        title: 'Résumé button',
        event: true,
      });
    } catch (e) { /* counting must never get in the way of opening the résumé */ }
  });
})();

/* ── Leaving a work page for the thing itself, counted as an event ─────────────
   Page views already say someone opened a case study. They do not say whether
   anyone went on to the product, which is the only reason the page exists.

   Add to Chrome is the one that matters most. The Web Store dashboard reports
   installs but not clicks, so without this there is no way to tell "nobody
   clicked" from "plenty clicked and didn't install" — two problems with opposite
   fixes.

   Labelled by destination rather than by CSS class, because the classes no longer
   mean the same thing on every page: src-live is Add to Chrome on FitCheck and
   the demo on the other two. The host is unambiguous. Delegated from the document
   so it survives the buttons being moved again.

   These links open in a new tab, so the page is never torn down mid-request and
   a plain count() has time to land — no sendBeacon needed. */
(() => {
  const DESTINATIONS = [
    ['chromewebstore.google.com', 'add-to-chrome'],
    ['github.com',                'source'],
  ];

  document.addEventListener('click', (e) => {
    const link = e.target.closest('.card-src a[href^="http"]');
    if (!link) return;

    let host;
    try { host = new URL(link.href).hostname; } catch { return; }

    // Anything on a ritikadas.in subdomain is one of the three live demos.
    const match = DESTINATIONS.find(([h]) => host === h || host.endsWith('.' + h));
    const action = match ? match[1]
                 : /(^|\.)ritikadas\.in$/.test(host) && host !== 'ritikadas.in' ? 'demo'
                 : null;
    if (!action) return;

    // /work/fitcheck/ → fitcheck. Falls back to the host so a stray link still
    // records something rather than being silently dropped.
    const project = location.pathname.match(/\/work\/([^/]+)\//)?.[1] || host;

    try {
      window.goatcounter?.count?.({
        path:  `${project}-${action}`,
        title: `${project}: ${action}`,
        event: true,
      });
    } catch (err) { /* counting must never get in the way of the click */ }
  });
})();

/* ── FIRST PAINT ───────────────────────────────────────────────────────────
   Releases the signature draw and the marquee once the preloader is out of
   the way, so neither plays behind the curtain. */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* `lit` releases the marquee and the signature. Held until the preloader is
     out of the way so the sequence is not playing behind a curtain. */
  const light = () => document.documentElement.classList.add('lit');
  const pre = document.getElementById('preloader');
  if (!pre || reduce) { light(); return; }
  const watch = new MutationObserver(() => {
    if (pre.classList.contains('done')) { light(); watch.disconnect(); }
  });
  watch.observe(pre, { attributes: true, attributeFilter: ['class'] });
  setTimeout(light, 2400);   /* never wait past the preloader's own ceiling */
})();



/* ---- STICKY SECTION HEADINGS ----
   A sticky element cannot report that it is stuck, so a 1px sentinel sits just
   above each heading and an observer watches it cross the line the nav sits on.
   Cheaper and steadier than measuring positions on every scroll frame. */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const heads = document.querySelectorAll('.sec-head');
  if (!heads.length) return;
  const navH = parseInt(getComputedStyle(document.documentElement)
                 .getPropertyValue('--nav-h')) || 73;
  heads.forEach(head => {
    if (getComputedStyle(head).position !== 'sticky') return;   /* short screens keep it static */

    /* Measure what the collapse costs, and hand it straight back as margin. The section
       then measures the same pinned or not, so the page never gets shorter under the
       reader. That is what the last section could not survive: it pinned, the page lost
       74px, the page bottom returned that scroll, and it unpinned itself. With the height
       held steady every section pins the same way, however short it is. Measured rather
       than hardcoded, because the number moves with breakpoint and webfont. */
    const measure = () => {
      const was = head.classList.contains('stuck');
      head.classList.remove('stuck');
      const base = parseFloat(getComputedStyle(head).marginBottom) || 0;
      const open = head.offsetHeight;
      head.classList.add('stuck');
      const shut = head.offsetHeight;
      head.classList.toggle('stuck', was);
      head.style.setProperty('--stuck-pad', (base + Math.max(open - shut, 0)) + 'px');
    };
    measure();
    addEventListener('resize', measure, { passive: true });
    addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

    const sentinel = document.createElement('div');
    sentinel.className = 'stick-sentinel';
    head.parentNode.insertBefore(sentinel, head);
    new IntersectionObserver(([entry]) => {
      head.classList.toggle('stuck', !entry.isIntersecting && entry.boundingClientRect.top < navH);
    }, { rootMargin: `-${navH + 1}px 0px 0px 0px`, threshold: 0 }).observe(sentinel);
  });
})();


/* ── REVEAL FAIL-SAFE ───────────────────────────────────────────────────────
   The CSS above covers JavaScript being OFF. This covers the worse case: it is
   ON, but script.js threw before it reached the observer at line 593. The
   <noscript> rule cannot help there, because scripting is enabled.

   So after 2.5 seconds anything still hidden is simply shown. If the observer
   is working it has long since done its job and this finds nothing. If it is
   not, the page is readable instead of blank. */
setTimeout(function(){
  var hidden = document.querySelectorAll('.reveal:not(.in)');
  for(var i = 0; i < hidden.length; i++) hidden[i].classList.add('in');
}, 2500);

/* ── PRELOADER, TWO CHANGES ─────────────────────────────────────────────────
   The curtain in script.js:231 is worth keeping: the display faces are large,
   and without it the first paint is unstyled type that reflows when the fonts
   land. Two things about it are not worth keeping.

   1. REPEAT VISITS. A recruiter who comes back to re-read a study, or to show a
      colleague, paid for the brand moment the first time. Paying again buys
      nothing. Skipped for a day after the first visit.

   2. THE CEILING. script.js sets MAX_WAIT to 2000ms. That is a stall guard, not
      a target, and it applied to everyone. Brought down to 1200ms, which still
      covers the font swap.

   Neither is done by editing script.js — that file is shared by nine pages. The
   curtain is dismissed from outside by adding the same `done` class its own
   dismiss() adds, which is idempotent. script.js's own 2000ms timer still fires
   later and finds the work already done.

   script.js is `defer`, so it has already attached its MutationObserver by
   DOMContentLoaded. That observer is what releases `lit` and the hero with it,
   so adding `done` here releases the page rather than just hiding a panel. */
(function(){
  var KEY = 'rd-preloader-seen', DAY = 86400000, seen = false;
  try{
    var last = +localStorage.getItem(KEY) || 0;
    seen = (Date.now() - last) < DAY;
    localStorage.setItem(KEY, Date.now());
  }catch(e){ /* private mode: treat every visit as the first */ }

  if(seen) document.documentElement.classList.add('preload-skip');

  document.addEventListener('DOMContentLoaded', function(){
    var pre = document.getElementById('preloader');
    if(!pre) return;
    if(seen){
      pre.classList.add('done');
      /* Belt and braces. The observer should catch the line above, but `lit` is
         what releases the hero, and a repeat visitor waiting 2.4s for the
         fallback timer would defeat the point of skipping. */
      document.documentElement.classList.add('lit');
      return;
    }
    setTimeout(function(){ pre.classList.add('done'); }, 1200);
  });
})();

/* ── WHOLE CARD CLICKABLE, TEXT STILL SELECTABLE ────────────────────────────
   The overlay that used to make the whole card a link sat above the words, so
   you could not select any text on a card. It now sits below them, and this
   restores the click: anywhere on the card opens it, unless you were selecting
   text or clicked a real link. */
document.querySelectorAll('.work-card').forEach(function(card){
  var link = card.querySelector('.card-link');
  if (!link) return;
  card.addEventListener('click', function(e){
    if (e.target.closest('a, button')) return;          // a real link won already
    if (window.getSelection().toString()) return;        // they were selecting
    if (e.metaKey || e.ctrlKey) window.open(link.href, '_blank', 'noopener');
    else link.click();
  });
});
