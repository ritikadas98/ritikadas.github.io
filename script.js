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
  
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme') || (systemPrefersDark ? 'dark' : 'light');
  
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
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
   The 3D tilt is gone. It skewed the body copy while someone was reading it, which
   works against the one thing the card is asking them to do — and on a page selling
   judgment, a card that wobbles under the cursor is the wrong kind of clever.
   The hover is now a 3px lift in CSS: same "this is interactive" signal, no
   distortion, no per-frame work on mousemove, and it inherits the reduced-motion
   handling the stylesheet already does. */

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

/* ---- SCOPED CURSOR SCRIPT (DESKTOP ONLY) ---- */
(function(){
  if (!window.matchMedia('(hover: hover)').matches) return;
  const cursor = document.getElementById('cursor');
  const label = document.getElementById('cursor-label');
  if(!cursor) return;
  /* The custom cursor was drawn without ever hiding the real one, so two pointers
     were on screen at once — and because this one lags on purpose for smoothness,
     they were never in the same place. Reads as a glitch rather than a flourish.
     The class is set from here, not in the markup, so the native pointer is only
     hidden once we know the custom one is actually running. */
  document.documentElement.classList.add('has-custom-cursor');
  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
  
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY; cursor.classList.add('active');
  });
  
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.2; cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  
  /* The label pill that used to name a destination on hover is gone. It was
     desktop-and-mouse only, so most visitors never saw it, and the cards now say
     where they go in plain text — which everyone can read. */

  document.querySelectorAll('a, button, input, .side-dot, .widget-btn, .mini-widget-box, .card-drawer-row, .arr, h3, h3 .arr').forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      e.stopPropagation();
      cursor.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
    });
  });
})();

/* ---- AUDIENCE SWITCHER ---- */
(function(){
  /* This file is shared with the article pages under /writing/, which have no
     audience switcher. Dereferencing a missing element throws, and the throw
     would take out every script below it in this file. */
  const tabsWrap = document.getElementById('audience-tabs');
  if (!tabsWrap) return;
  const tabs = tabsWrap.querySelectorAll('.aud-tab');
  const bgText = document.getElementById('about-bg-text');
  const prodText = document.getElementById('about-prod-text');
  const prinText = document.getElementById('about-prin-text');
  /* All four perspectives rewritten for one-pass reading: short declarative
     lines, no bullets, ~9 words per sentence or fewer, jargon stripped, every
     number and specific kept. `ln` spans render as separate line-groups. */
  const L = (...lines) => lines.map(t => `<span class="ln">${t}</span>`).join('');
  const COPIES = {
    all: {
      bg:   L("I came to product from technical delivery. SAP consulting first. Then a project of my own, when the lead seat opened up mid-project.",
              "It taught me to own the gap between what's promised and what ships."),
      prod: L("Three products, built and shipped solo. Eight months, start to finish.",
              "Commerce, personal finance, and PM tooling. Plus case studies on products already built."),
      prin: L("I know what to check, when to stop, and what not to build.",
              "I write down the reasoning before I start. Including the calls I later reversed.")
    },
    recruiter: {
      bg:   L("Three years running enterprise SAP delivery.",
              "I stepped into the lead seat when it opened."),
      prod: L("A Chrome extension, a personal finance app, and an agentic AI pipeline.",
              "All three shipped solo in eight months.",
              "FitCheck: 70% came back in week one, zero uninstalls."),
      prin: L("Every number here comes with its sample size.",
              "Ten users is ten users. I won't inflate it.")
    },
    founder: {
      bg:   L("I write the spec, then I build it.",
              "Prototypes, database schemas, AI integration. Then I test it with real users."),
      prod: L("Three products, live, built alone.",
              "A Chrome extension. A web app. An agentic AI pipeline.",
              "From first spec to live deployment."),
      prin: L("Ship early. Then protect what could break trust.",
              "I use AI where it's strongest: language, synthesis, and speed.",
              "Code handles the maths. That pairing is why the numbers hold.")
    },
    'pm-lead': {
      bg:   L("I moved from delivery to product under pressure.",
              "The lead seat opened mid-project. I took it."),
      prod: L("Each product has one hard call in it.",
              "Matching the tool to the job. AI for language, arithmetic where the answer is already exact.",
              "And a finance app that stays quiet rather than guess."),
      prin: L("I write down what I expect before I build.",
              "I record why I abstained. And which calls I reversed.")
    }
  };
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active')); tab.classList.add('active');
      const copy = COPIES[tab.dataset.aud] || COPIES.all;
      [bgText, prodText, prinText].forEach(el => el.style.opacity = 0);
      setTimeout(() => { bgText.innerHTML = copy.bg; prodText.innerHTML = copy.prod; prinText.innerHTML = copy.prin; [bgText, prodText, prinText].forEach(el => el.style.opacity = 1); }, 200);
    });
  });
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
  a.appendChild(pool.firstElementChild);        // panel 0 = the widget
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
