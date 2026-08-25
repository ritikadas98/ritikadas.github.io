/* Reddit — case study deck.
 *
 * The shell is shared: ../../_deck/deck.css and ../../_deck/engine.js. This file
 * is the content, the cover art and the phone mocks.
 *
 * Every figure here is from a named public source and dated. Reddit's own
 * numbers come from the Q2 2026 shareholder letter and Form 8-K of 30 Jul 2026.
 * Traffic figures come from SparkToro with Similarweb clickstream data. Citation
 * figures come from Ahrefs and Promptwatch, which disagree with each other, and
 * the deck says so rather than picking the convenient one.
 *
 * Nothing here is a Reddit-internal number. Where a benchmark is cross-industry
 * rather than Reddit-specific, the slide says that too.
 *
 * *text* paints that phrase in the accent colour.
 */

/* ------------------------------------------------------------ cover art -- */
const ART = {

  /* The thread that started the case study. 48K upvotes of people describing,
     unprompted, that they reach Reddit by leaving Google. It was the hero of the
     first version of this deck and it is still the best evidence in it. */
  thread: () => `<div class="threadshot">
      <div class="tsframe"><span class="tschrome"></span>
        <img src="images/reddit-thread.jpg" width="1672" height="1400" loading="eager"
             alt="An r/NoStupidQuestions thread asking whether people add the word reddit to Google searches, showing 48,000 upvotes and 2,400 comments, with replies describing the habit.">
      </div>
      <p class="tscap">r/NoStupidQuestions · 48K upvotes · 2.4K comments. Behavioural
        testimony from 2021, not current traffic data.</p>
    </div>`,

  /* Two hundred Google searches. Fifty-six reach a website, which is the other
     side of the 68.01% zero-click figure.
     The fifty-six are placed by a shuffle with a fixed seed. A modular stride
     lights the right number but lands them on a diagonal, which reads as a
     pattern; an unseeded shuffle would deal a different hand to the exported
     file than to the screen. */
  clicks: () => {
    const idx = [...Array(200).keys()];
    let seed = 7;
    for (let i = 199; i > 0; i--) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      const j = seed % (i + 1);
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    const lit = new Set(idx.slice(0, 56));
    let cells = '';
    for (let i = 0; i < 200; i++) {
      cells += `<span class="clk ${lit.has(i) ? 'out' : ''}" style="--d:${i * 5}ms"></span>`;
    }
    return `<div class="clicks">
      <div class="clkgrid">${cells}</div>
      <div class="clkkey">
        <span><i></i>72 in 100 answered inside Google</span>
        <span><i></i>28 reach a website</span>
        <span>each square is one US Google search, Jan–Apr 2026</span>
      </div>
    </div>`;
  },

  /* The cover carries both: the field of searches down the left, under the text
     it belongs to, and the thread beside it. A slide takes one art function, so
     this is the one, and it composes the two. */
  cover: () => ART.clicks() + ART.thread()
};

/* ---------------------------------------------------------- phone mocks -- */
/* Reddit's mobile web as observed Apr 2026, and the proposed treatment beside
   it. The interstitial has changed repeatedly, so this is a drawing of a
   pattern rather than a screenshot, and slide 10 says so. */
const MOCKS = {

  today: `
    <div class="mkrow"><span class="mkmeta">r/AskHistorians · thread</span></div>
    <span class="mkl w"></span><span class="mkl m"></span>
    <div class="mkwall">
      <b>Reddit is better in the app</b>
      <span class="mkbtn">Open in app</span>
      <span style="opacity:.55">Continue in browser</span>
      <span class="mkburied">the answer is under here</span>
    </div>`,

  strip: `
    <div class="mkstrip">
      <span><b>r/AskHistorians</b><span class="mkmeta">2.1M members · 140 new posts this week</span></span>
      <span class="mkbtn">Follow</span>
    </div>
    <span class="mkmeta">Top answer · 4.2K upvotes</span>
    <span class="mkl w"></span><span class="mkl w"></span><span class="mkl m"></span>
    <span class="mkl w"></span><span class="mkl s"></span>
    <span class="mkmeta" style="margin-top:.5em">Reply · 1.1K</span>
    <span class="mkl w"></span><span class="mkl m"></span><span class="mkl w"></span>
    <span class="mkl s"></span>
    <span class="mkmeta" style="margin-top:.5em">Reply · 840</span>
    <span class="mkl w"></span><span class="mkl m"></span><span class="mkl s"></span>`,

  coach: `
    <div class="mkrow"><span class="mkmeta">New post · u/new_explorer</span></div>
    <div class="mkrow"><span class="mkmeta">Flair:</span><span style="color:var(--accent);font-weight:600">none</span></div>
    <div class="mkcard">“do romans eat breakfast?”</div>
    <div class="mkcard" style="border-color:var(--accent)">
      <b style="color:var(--brand)">Composer Coach</b>
      <div class="mkchk">
        <span><i class="no"></i>Flair</span><span><i class="no"></i>Length</span>
        <span><i></i>Format</span><span><i></i>Tone</span>
      </div>
      <div class="mkflag">Likely to be removed</div>
    </div>
    <span class="mkmeta" style="margin-top:.5em">Fix these two and it posts cleanly.</span>
    <div class="mkrow" style="margin-top:auto;gap:.4em">
      <span class="mkbtn ghost">Fix flair</span><span class="mkbtn">Post</span>
    </div>`,

  /* The scrim is the point: a bottom sheet interrupts a screen that is still
     there behind it, which is what makes it a soft landing and not a wall. */
  mega: `
    <div class="mkrow"><span class="mkmeta">r/AskHistorians · thread</span></div>
    <span class="mkl w"></span><span class="mkl m"></span><span class="mkl s"></span>
    <span class="mkl w"></span><span class="mkl m"></span><span class="mkl w"></span>
    <span class="mkl s"></span><span class="mkl m"></span>
    <span class="mkscrim"></span>
    <div class="mksheet">
      <b>This will probably be removed</b>
      <span class="mkmeta">Post it to the Weekly Open Discussion megathread instead?</span>
      <span class="mkbtn">Post to the megathread</span>
      <div class="mkrow" style="gap:.4em">
        <span class="mkbtn ghost">Fix it</span><span class="mkbtn ghost">Post anyway</span>
      </div>
    </div>`
};

/* --------------------------------------------------------------- figure -- */
/* The funnel, drawn as a flow rather than three boxes with arrows between them.
 *
 * Every stage carries its own number and its own provenance. Two of the five
 * are Reddit's reported figures, two come from published research and are
 * labelled directional, and the last is not measured by anyone, which is the
 * point of the slide.
 *
 * The band widths are NOT to scale. Each stage is roughly an order of magnitude
 * smaller than the one before it, so a true-to-value taper would render the last
 * three stages as a hairline. The caption says so.
 */
const FIGS = {
  funnel: (() => {
    const W = 1500, H = 470, TOP = 96, BOT = 108;
    const stages = [
      { k: 'Daily actives',      v: '130.3M', h: 1.00, note: 'Reddit Q2 2026' },
      { k: 'Logged out',         v: '77.7M',  h: 0.74, note: 'Reddit Q2 2026' },
      { k: 'Has an account',     v: '52.6M',  h: 0.52, note: 'Reddit Q2 2026' },
      { k: 'Posts anything',     v: '~10%',   h: 0.30, note: '1-9-90, directional' },
      { k: 'First post survives',v: '~80%',   h: 0.20, note: '1 in 5 removed' },
      { k: 'Gets a reply',       v: 'n/a',    h: 0.10, note: 'nobody measures this', dim: true }
    ];
    const steps = ['59.6% of DAU', '40.4% of DAU', '1-9-90 rule', '1 in 5 removed', 'unmeasured'];
    /* Narrow columns, wide gaps: the conversion label between two stages has to
       fit in the gap, and it is the widest thing on the diagram. */
    const colW = 104, gapW = (W - stages.length * colW) / (stages.length - 1);
    const band = H - TOP - BOT;
    const y = f => TOP + band * (1 - f) / 2;
    let out = '';

    /* the tapering bands, drawn first so the columns sit over them */
    for (let i = 0; i < stages.length - 1; i++) {
      const x1 = i * (colW + gapW) + colW, x2 = x1 + gapW;
      const a = stages[i], b = stages[i + 1];
      const cx = (x1 + x2) / 2;
      out += `<path class="fband ${b.dim ? 'dim' : ''}" d="
        M${x1} ${y(a.h)} C${cx} ${y(a.h)} ${cx} ${y(b.h)} ${x2} ${y(b.h)}
        L${x2} ${y(b.h) + band * b.h} C${cx} ${y(b.h) + band * b.h} ${cx} ${y(a.h) + band * a.h} ${x1} ${y(a.h) + band * a.h} Z"/>`;
      out += `<text class="fstep" x="${cx}" y="${TOP + band / 2 - 6}">${steps[i]}</text>`;
    }
    /* the columns */
    stages.forEach((s, i) => {
      const x = i * (colW + gapW);
      /* A label is set from the left edge of its column, which runs the last one
         off the end of the frame. That one is set from the right edge instead. */
      const last = i === stages.length - 1;
      const tx = last ? x + colW : x;
      const anc = last ? ' text-anchor="end"' : '';
      out += `<rect class="fcol ${s.dim ? 'dim' : ''}" x="${x}" y="${y(s.h)}" width="${colW}" height="${band * s.h}" rx="3"/>`;
      out += `<text class="fk" x="${tx}" y="${TOP - 44}"${anc}>${s.k}</text>`;
      out += `<text class="fv ${s.dim ? 'dim' : ''}" x="${tx}" y="${TOP - 8}"${anc}>${s.v}</text>`;
      out += `<text class="fnote" x="${tx}" y="${H - BOT + 34}"${anc}>${s.note}</text>`;
    });
    return `<svg viewBox="0 0 ${W} ${H}" role="img"
      aria-label="A funnel from 130.3M daily actives to a final stage nobody measures: 77.7M logged out, 52.6M with an account, about 10% who post anything, about 80% of first posts surviving removal, and an unmeasured reply rate.">${out}</svg>`;
  })()
};

/* --------------------------------------------------------------- slides -- */
const SLIDES = [

/* ---------------------------------------------------------------- 01 -- */
{ kind: 'cover', art: 'cover',
  kicker: 'Product case study · August 2026',
  title: 'Reddit is read without being visited.',
  lead: 'Reddit’s acquisition funnel opens on a Google results page it does not own. Something in the middle now answers the question using Reddit’s content, so the top of that funnel is closing while the reading carries on. Reddit sells the visit, not the answer.',
  foot: 'Ritika Das · ritikadas.in · 2026' },

/* ---------------------------------------------------------------- 02 -- */
{ kind: 'cards', pill: 'Context · Q2 2026', cols: 2, wide: true,
  title: 'Reddit’s revenue is at a record. Its distribution is not.',
  lead: 'Both facts come from the same quarter, and the market priced the second one.',
  cards: [
    ['What it is', 'More than 100,000 communities built on anonymous, community-level posts. The stated mission is community, belonging and empowerment.', 'network'],
    ['How it earns', 'Q2 2026 revenue *$805M*, up *61%*, an eighth straight quarter above 60%. Advertising is *$762M* of that, or 95%. Data licensing is *$39M*.', 'money'],
    ['The tension', 'Advertising is priced against logged-in, returning users. The dominant entry is a one-off search landing. *Reddit earns nothing from a satisfied lurker and less than nothing from a satisfied non-visitor.*', 'warn'],
    ['The leverage', 'The Google licence, about *$60M a year*, expires in *H1 2027*. Reddit is reported to be weighing whether to renew at all, and to want usage-based fees. The OpenAI renewal is also unresolved.', 'target']
  ],
  src: '[Reddit Q2 2026 shareholder letter](https://investor.redditinc.com/) and earnings call, 30 Jul 2026. Shares fell 11–12% on the quarter despite beating revenue, DAU and guidance. Licensing renewal reporting: The Wall Street Journal, Aug 2026.' },

/* ---------------------------------------------------------------- 03 -- */
{ kind: 'compare', pill: 'The problem', wide: true,
  title: 'Reddit earns from one cohort and is increasingly made of the other',
  lead: 'Both numbers are Reddit’s own, reported for the same quarter.',
  left: ['Logged out', '77.7M', 'DAU, up *27%*. Lands from search, reads one thread, leaves. No account, so no repeat-visit signal, no retention curve, and no lifetime value to price an ad against.', 'leaves'],
  right: ['Logged in', '52.6M', 'DAU, up *7%*. Returns, retains, and can be sold to. Every advertising dollar is priced against this cohort. It grows four times slower than the one Reddit cannot bill.', 'returns'],
  src: '[Reddit Q2 2026](https://investor.redditinc.com/), of 130.3M DAU in total, up 18%. Q2 2026 is the last quarter Reddit reports this split. From Q3 it stops publishing logged-in and logged-out figures.' },

/* ---------------------------------------------------------------- 04 -- */
{ kind: 'bars', pill: 'The wedge', max: 100, unit: '%', wide: true,
  title: 'Reddit’s arrival channel is squeezed at both ends',
  lead: 'About *60%* of Reddit’s daily actives arrive logged out, and search is how most of them get there. Two different things are now squeezing that channel. *Google answers inside the results page, so the click never happens. AI assistants read the thread and answer without citing it, so the visit never happens either.* Huffman called Reddit’s search referrals *“choppy”* on the Q2 call.',
  barlab: 'Share of US Google searches ending with no click to any website',
  bars: [
    ['2016', 45],
    ['2024', 60.45],
    ['Jan–Apr 2026', 68.01]
  ],
  src: 'The zero-click figures are Google-wide, not Reddit’s own: [SparkToro with Similarweb clickstream data](https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/), Jun 2026. They are on this slide because this is the channel Reddit’s logged-out majority arrives through. AI Overviews now appear on over 20% of searches. Every publisher on this channel is exposed: over the year to Jun 2026 USA Today lost nearly half its organic Google traffic and Politico lost 23% (Semrush). Huffman quotes: Reddit Q2 2026 earnings call, 30 Jul 2026.' },

/* ---------------------------------------------------------------- 05 -- */
{ kind: 'statement', pill: 'What replaced the visit',
  title: 'ChatGPT read *16.18 million* Reddit pages and credited *1.93%* of them.',
  lead: 'Reddit is the largest uncredited source in AI retrieval: *67.8%* of every URL ChatGPT pulls and does not cite belongs to Reddit. The model reads the thread, answers the user, and returns no session. Consumption without a session is consumption Reddit cannot measure, retain or monetise.',
  src: 'Ahrefs, a study of 1.4M ChatGPT prompts, published 15 Apr 2026.' },

/* ---------------------------------------------------------------- 06 -- */
{ kind: 'personajobs', pill: 'Jobs to be done', wide: true,
  title: 'The job a summary cannot finish',
  lead: 'If a summary already answers the question, the old job is finished before Reddit is reached. What survives summarising is the part a summary has to throw away: the disagreement, and the person who can be asked a follow-up.',
  role: 'Primary persona',
  name: 'Search-First Rohan',
  photo: 'images/persona.jpg',
  photoAlt: 'Portrait of the primary persona, a man in his late twenties looking at a phone. Generated image, not a photograph of a real person.',
  blurb: 'Search arrival, not idle browsing, is the dominant entry path. About 60% of Reddit’s users are men, and the skew is sharpest among the people who actually post, which is the cohort the primary solution acts on.',
  quotes: [
    'When an AI answer is close but not my case, <b>I want to reach the people it summarised</b>, because a summary cannot be asked a follow-up.',
    'When the sources disagree, <b>I want to see the argument and not the verdict</b>, because one confident paragraph hides how contested the answer is.',
    'When I finally have something worth adding, <b>I want to know the rules before I am judged by them</b>, not after my post has been deleted.'
  ],
  src: 'Job statements written from the research, not verbatim transcript. Evidence base: 5 interviews, a 15-person survey, one public thread (48K upvotes). Small sample, so findings are raw counts, never percentages. Four of five interviewees raised Automod unprompted.' },

/* ---------------------------------------------------------------- 07 -- */
{ kind: 'figure', pill: 'The funnel', svg: 'funnel', wide: true,
  title: 'Every stage is smaller than the last, and the last one is not measured',
  lead: 'Reddit reports the first three. The next two come from published research. Nobody reports the last, which is where Solution 3 can look like a win and not be one.',
  src: 'Band widths are not to scale: each stage is roughly an order of magnitude smaller than the one before, and a true taper would draw the tail as a hairline. Stages 1–3: [Reddit Q2 2026](https://investor.redditinc.com/). “Posts anything”: the 1-9-90 rule (NN/g, 2006), twenty years old and community-general, so directional only. “First post survives”: about a fifth of Reddit posts are removed, and 37% of the users whose post was removed did not understand why (Jhaver et al., ACM CSCW 2019, n=907). Reddit removed a little over 3% of all new content in H1 2024, of which 66.5% was spam.'
},

/* ---------------------------------------------------------------- 08 -- */
{ kind: 'mock', pill: 'Solution 2 · primary → stage 2', mock: 'coach', wide: true,
  cap: 'Mobile composer, checked live',
  title: 'Catch the bad first post before Automod does',
  lead: 'Promoted to primary because it acts on *supply*, not on arrivals. Arrivals are shrinking for reasons Reddit does not control. The corpus is what survives the channel.',
  panels: [
    ['What it is', 'A real-time check inside the composer for new accounts, under seven days old or low karma. It flags flair, length, formatting and tone *before* submit rather than after deletion.'],
    ['Why it leads now', 'Logged-in DAU grows at *7%*. Logged-out grows at *27%*. A first post that survives is how the slow number moves. The posts are also the asset Reddit licenses, and *that licence is renegotiated in H1 2027.*', true],
    ['What it costs', 'The rules linter is effectively free. An LLM check costs about *$0.001*. Ship the linter first and add a model only for fuzzy tone. The week-one posting rate should come from internal data, and this deck does not assert it.'],
    ['The dependency, stated up front', 'Automod rules are per-subreddit and often private. Many key on account age, karma floor or verified email, and *a composer cannot fix any of those.* Coach covers the machine-checkable subset. Full coverage needs a platform-level rule surface, out of scope here.']
  ],
  src: 'Addresses the complaint four of five interviewees raised unprompted.' },

/* ---------------------------------------------------------------- 09 -- */
{ kind: 'mock', pill: 'Solution 3 → stage 3', mock: 'mega', wide: true,
  cap: 'Bottom sheet over the live thread',
  title: 'Then give the post somewhere to land',
  lead: 'When Coach flags a likely removal, it offers the subreddit’s megathread instead. The sheet opens over the thread and does not block the post. A likely failure becomes a first post that publishes.',
  panels: [
    ['Positioning', 'This sits inside the Coach flow. On its own it becomes a “kids table” for new accounts, which is worse than what it replaces.'],
    ['If there is no megathread', 'Most subreddits do not run one. Those fall back to Coach’s fix guidance and a Reddit-wide new-contributor thread.'],
    ['The metric risk', 'Most megathread comments get no reply. The north star metric would still count them, so the number goes up and the user gets nothing. *So I would also track the reply-received rate on a first post within 48 hours.*'],
    ['The relationship risk', 'Moderators may read this as routing around their rules. Their trust is Reddit’s most fragile asset. Ship to opt-in subreddits first and watch the mod-sentiment guardrail.']
  ],
  src: 'Framing from the 1-9-90 rule (NN/g, 2006): the hard part is moving a user from lurking to participating at all. The source is twenty years old and community-general, so treat it as directional.' },

/* ---------------------------------------------------------------- 10 -- */
{ kind: 'mock', pill: 'Solution 1 → stage 1 · mobile-first', wide: true,
  mocks: [['today', 'App wall covers the answer, and Google penalises it', 'Reddit today'],
          ['strip', 'Slim strip, answer stays visible and indexable', 'Proposed']],
  title: 'Replace the app-install wall with thread-page onboarding',
  lead: 'Sized honestly: this *protects yield on a falling channel.* It only acts on arrivals, so it cannot drive growth. It is still the cheapest thing to test.',
  panels: [
    ['Community identity', '“r/AskHistorians · 2.1M members.” She sees where she is in one glance. Today the page assumes she already knows.'],
    ['Age-robust liveness', '“140 new posts this week.” Search surfaces old threads, so a live-user count reads zero on exactly the pages that need it most. A recency count survives age. Below a threshold, suppress the chip instead of showing a zero.'],
    ['One non-coercive CTA', '“Follow this community”, or “notify me if someone answers.” No signup wall. It creates a return trigger and a measurable conversion rate. *The original CTA asked a satisfied searcher to ask a question she no longer had.*'],
    ['What the evidence does not say', 'Cross-industry popup data shows new visitors converting above returning ones, and mobile above desktop. Those are e-commerce email captures, not Reddit thread pages. The direction transfers and the magnitude does not. *This deck forecasts no lift.*']
  ],
  src: 'Hard constraints: non-intrusive, no app wall, no scroll block, 100% indexable. A non-blocking strip also stays clear of Google’s 2017 intrusive-interstitial penalty, which affects ranking and is separate from AI Overviews suppressing clicks. Mock reflects Reddit’s mobile web as observed Apr 2026, so re-verify before presenting.' },

/* ---------------------------------------------------------------- 11 -- */
{ kind: 'table', pill: 'Measurement', wide: true,
  title: 'One north star metric, and the guardrails that outrank it',
  lead: 'Solution 1’s premise is that the valuable cohort never signs up, so an unchained north star under-credits it. Report the funnel, not the endpoint.',
  head: ['Measure', 'What it is and why', 'Instrument'],
  rows: [
    ['North star metric', 'New user activation rate: the share completing one meaningful action, upvote, follow or comment, within 48 hours of signup. Chained for this cohort as thread-arrival → signup → 48h action.', 'Chained', true],
    ['Secondary', 'Time to first action. Subreddit follow rate on day one. Reply-received rate on a first post within 48 hours.', 'Activation'],
    ['Guardrail · test design', 'Measure against concurrent *holdout subreddits*, not a year-on-year baseline. Referral traffic is volatile for outside reasons, and a YoY baseline cannot separate our treatment from a Google core update.', 'Holdouts'],
    ['Guardrail · SEO', 'Thread content indexability stays at *100%*. Every fix here touches the arrival surface, so every fix can threaten the traffic the business runs on.', '100%'],
    ['Guardrail · engagement', 'Scroll depth and dwell time must not fall. *Bounce rate is the wrong instrument here,* because a search-arrived single-thread session counts as a bounce by definition.', 'Not bounce'],
    ['Guardrail · mods', 'Removal rate and mod-reported sentiment, per subreddit. Solutions 2 and 3 touch moderation directly, and mod trust is the asset least able to survive being spent.', 'Sentiment']
  ],
  src: 'And from Q3 2026 this goes dark. Reddit stops reporting logged-in and logged-out DAU, so the cohort this deck is about becomes unmeasurable from outside. It stays instrumented internally.' },

/* ---------------------------------------------------------------- 12 -- */
{ kind: 'two', pill: 'Go to market and risks', wide: true,
  title: 'Ship the cheapest test first, and protect the traffic',
  lead: 'Sequenced so the most expensive phase ships only if the cheap one proves it is needed.',
  left: ['Ship in this order', [
    '*Phase 1 · Coach baseline.* Non-LLM rules linter for new accounts, on opt-in subreddits. Watch Automod pass-rate lift and reply-received rate.',
    '*Phase 2 · The strip.* A/B the Solution 1 thread-page strip on a few high-traffic subreddits against concurrent holdouts. Watch the SEO guardrail first and everything else second.',
    '*Phase 3 · LLM and fallback.* Add model-based tone checks and the megathread fallback. Ships only if Phase 1 falls short.',
    'Phases 1 and 2 are independent and can run at once. Phase 3 is conditional on Phase 1 by design, not by capacity.'
  ]],
  right: ['Risks, and what holds them', [
    '*The strip fatigues users or hurts engagement* → keep the design non-modal and hold the scroll-depth guardrail.',
    '*Coach reads as gatekeeping* → frame it as help, make it opt-out, limit it to new accounts.',
    '*Mods read Coach as undermining moderation* → opt-in subreddits first, and the mod-sentiment guardrail leads.',
    '*Solution 1’s ceiling falls with the channel* → it protects yield and does not drive growth. Size it that way.',
    '*Progressive login blurs* were considered and cut. They would degrade the indexable content the whole business runs on. A rejected option, not a managed risk.'
  ]] },

/* ---------------------------------------------------------------- 13 -- */
{ kind: 'rows', pill: 'What I am not solving', numbered: true, wide: true,
  title: 'The visit itself, and why I am not pretending to fix it here',
  lead: 'Three solutions act on people who reach the page. None act on the person who never arrives. That gap is real, so it is named here rather than filled with a fourth feature I could not evidence.',
  rows: [
    ['The lever', 'The only surface a non-visitor touches is what the crawler sees. Any genuine fix has to change what Reddit exposes to be summarised, not what it shows on a page the user never opens.'],
    ['Why it is out of scope', 'This is a licensing and distribution decision before it is a product one. The Google contract expires H1 2027, Reddit is reported to want usage-based terms, and the OpenAI renewal is unresolved. *That negotiation sets the terms, not a feature.* A PM answering a contract problem with a content-structure change is bringing the wrong instrument.'],
    ['What would change my mind', 'Whether *retrieval* fell or only *citation* fell. Reddit’s share of ChatGPT citations dropped from 3.83% to 0.52% in four days in August, an 86.4% relative fall. But Ahrefs measured the same platform over the same window at 16.7%, Promptwatch calls its own figure provisional, and a near-identical collapse in June recovered within two months.'],
    ['Why the deck is not built on that number', 'ChatGPT sends under 0.1% of Reddit’s inbound. Google AI Overviews and AI Mode declined about 11% and 30% over the same window, a slope rather than a cliff. *The loud number is the small one.* The 68% zero-click figure is what moves the business.'],
    ['Why product work is still the work', 'Licensing is not the escape hatch. It earned *$39M* last quarter against *$762M* from advertising. Double it and it still would not cover a falling ad line. *The visit is what pays.*']
  ],
  src: 'If retrieval fell rather than citation, this deck’s thesis inverts: read without being paid becomes no longer read, a different and worse problem that none of these solutions address. Sources: Promptwatch citation tracking, Aug 2026; Ahrefs, Apr and Aug 2026.' },

/* ---------------------------------------------------------------- 14 -- */
{ kind: 'cover', dark: true,
  kicker: 'Reddit · read without being visited',
  title: 'Thank you.',
  lead: 'Reddit’s asset was never the answer. It was the argument underneath it. When the answer stops requiring a visit, the argument is the only thing left worth arriving for.',
  foot: 'Ritika Das · ritikadas.in · questions and feedback welcome' }

];
