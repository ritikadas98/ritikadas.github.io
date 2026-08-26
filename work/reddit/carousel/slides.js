/* Reddit — LinkedIn carousel, 16:9.
 *
 * The shell is shared with the deck: ../../_deck/deck.css and engine.js, plus
 * ../../_carousel/carousel-wide.css for the page size and the type scale.
 *
 * ---- why this file exists at all ----
 *
 * LinkedIn renders every document it is given at 1080 pixels wide, so a 16:9
 * page lands at 1080x608. Measured against a teardown deck that reads well
 * there, the shape was identical to ours and the density was worse. The only
 * thing that differed was type size relative to the frame. Median character
 * height as LinkedIn serves it: that deck 7.6px, our 16:9 deck 5.9px, this
 * file about 20px.
 *
 * So this is not a shorter deck. It is the same argument at feed pace. A slide
 * in the 16:9 deck runs to a median of 173 words, written to be read sitting
 * down. A slide here holds 20 to 35, because it is read standing up, on a
 * phone, between two other posts — and because 608px of height at this type
 * size does not hold more.
 *
 * Every figure keeps its source. The portfolio goes to named hiring managers
 * and an unsourced number is a defect. What comes out is the connective prose,
 * which the case study at ritikadas.in/writing/reddit/ already carries.
 *
 * *text* paints that phrase in the accent colour.
 */

const SLIDES = [

/* ---------------------------------------------------------------- 01 -- */
/* No cover art. The deck's cover composes a 200-square field beside a desktop
   thread screenshot, and at this size neither would be readable. A carousel's
   first slide has one job: earn the second swipe. */
{ kind: 'cover',
  kicker: 'Product case study · August 2026',
  title: 'Reddit is read without being visited.',
  lead: 'Its funnel opens on a Google page it does not own. Something in the middle now answers using Reddit’s content. Reddit sells the visit, not the answer.',
  foot: 'Ritika Das · ritikadas.in' },

/* ---------------------------------------------------------------- 02 -- */
{ kind: 'compare', pill: 'The problem',
  title: 'Reddit earns from one cohort and is made of the other',
  lead: 'Both numbers are Reddit’s own, one quarter, Q2 2026.',
  left: ['Logged out', '77.7M', 'Daily actives, up *27%*. Lands from search, reads one thread, leaves. Nothing to price an ad against.', 'leaves'],
  right: ['Logged in', '52.6M', 'Daily actives, up *7%*. Every advertising dollar is priced here, and it grows four times slower.', 'returns'],
  src: '[Reddit Q2 2026 shareholder letter](https://investor.redditinc.com/), 30 Jul 2026. The last quarter Reddit reports this split.' },

/* ---------------------------------------------------------------- 03 -- */
{ kind: 'bars', pill: 'The wedge', max: 100, unit: '%',
  title: 'The arrival channel is squeezed at both ends',
  lead: 'Google answers inside the results page, so *the click never happens*. AI assistants answer without citing, so *the visit never happens either*.',
  barlab: 'US Google searches ending with no click to any website',
  bars: [
    ['2016', 45],
    ['2024', 60.45],
    ['Jan–Apr 2026', 68.01]
  ],
  src: 'Google-wide, not Reddit’s own: [SparkToro with Similarweb clickstream data](https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/), Jun 2026. About 60% of Reddit’s daily actives arrive through this channel.' },

/* ---------------------------------------------------------------- 04 -- */
{ kind: 'statement', pill: 'What replaced the visit',
  title: 'ChatGPT read *16.18 million* Reddit pages and credited *1.93%* of them.',
  lead: 'The model reads the thread, answers the user, and returns no session. Consumption Reddit cannot measure, retain or monetise.',
  src: 'Ahrefs, a study of 1.4M ChatGPT prompts, 15 Apr 2026.' },

/* ---------------------------------------------------------------- 05 -- */
/* The photo lives at ../deck/images/. One file, two shapes: the carousel is a
   second frame around the same case study, not a second copy of its assets. */
{ kind: 'personajobs', pill: 'Jobs to be done',
  title: 'The job a summary cannot finish',
  lead: 'What survives summarising is the disagreement, and someone to ask.',
  role: 'Primary persona',
  name: 'Search-First Rohan',
  photo: '../deck/images/persona.jpg',
  photoAlt: 'Portrait of the primary persona, a man in his late twenties looking at a phone. Generated image, not a photograph of a real person.',
  blurb: 'Arrives from search. Reads one thread and leaves.',
  quotes: [
    'When an AI answer is close but not my case, <b>I want to reach the people it summarised</b>.',
    'When the sources disagree, <b>I want the argument, not the verdict</b>.',
    'When I finally post, <b>I want the rules before I am judged by them</b>.'
  ],
  src: 'Written from the research, not verbatim transcript. 5 interviews, a 15-person survey, one public thread (48K upvotes). Small sample, so raw counts.' },

/* ---------------------------------------------------------------- 06 -- */
{ kind: 'rows', pill: 'The funnel', numbered: true,
  title: 'Every stage is smaller, and the last one is not measured',
  lead: 'Reddit reports the first two. Research covers the next two. Nobody reports the last.',
  rows: [
    ['130.3M daily actives', 'Of which *77.7M* are logged out.'],
    ['52.6M logged in', 'The only cohort an advertiser can be sold.'],
    ['~10% post anything', 'The 1-9-90 rule, twenty years old, so directional.'],
    ['Gets a reply', '*Nobody measures this.* Where a win can look like a win and not be one.']
  ],
  src: 'Stages 1–2: [Reddit Q2 2026](https://investor.redditinc.com/). Posting rate: the 1-9-90 rule (NN/g, 2006). Removals: Jhaver et al., ACM CSCW 2019, n=907.' },

/* ---------------------------------------------------------------- 07 -- */
{ kind: 'cards', pill: 'Solution 1 · the arrival surface', cols: 2, wide: true,
  title: 'Replace the app-install wall with thread-page onboarding',
  lead: 'Sized honestly: this *protects yield on a falling channel*. It acts only on arrivals, so it cannot drive growth.',
  cards: [
    ['Community identity', '“r/AskHistorians · 2.1M members.” She sees where she is in one glance.'],
    ['Age-robust liveness', '“140 new posts this week.” A live-user count reads zero on the pages that need it most.'],
    ['One non-coercive CTA', '*The old CTA asked a satisfied searcher to ask a question she no longer had.*'],
    ['What it does not claim', 'The supporting popup data is e-commerce, not Reddit. *This forecasts no lift.*']
  ],
  src: 'Hard constraints: non-intrusive, no app wall, no scroll block, 100% indexable. A non-blocking strip also stays clear of Google’s 2017 intrusive-interstitial ranking penalty.' },

/* ---------------------------------------------------------------- 08 -- */
{ kind: 'cards', pill: 'Solution 2 · promoted to primary', cols: 2, wide: true,
  title: 'Catch the bad first post before Automod does',
  lead: 'Promoted because it acts on *supply*, not arrivals. Arrivals are shrinking for reasons Reddit does not control.',
  cards: [
    ['What it is', 'A real-time check in the composer for new accounts. Flags flair, length and tone *before* submit.'],
    ['Why it leads', 'The posts are the asset Reddit licenses, and *that licence is renegotiated in H1 2027*.'],
    ['What it costs', 'The rules linter is effectively free. An LLM check is about *$0.001*. Ship the linter first.'],
    ['The dependency, stated', 'Automod rules are per-subreddit and often private. *A composer cannot fix that.*']
  ],
  src: 'Addresses the complaint four of five interviewees raised unprompted.' },

/* ---------------------------------------------------------------- 09 -- */
{ kind: 'rows', pill: 'Measurement',
  title: 'One north star, and the guardrails that outrank it',
  lead: 'The valuable cohort never signs up, so an unchained north star under-credits it.',
  rows: [
    ['North star', 'One meaningful action within 48 hours of signup.'],
    ['Test design', 'Concurrent *holdout subreddits*. A year-on-year line cannot separate us from a Google update.'],
    ['SEO', 'Indexability stays at *100%*. Every fix touches the surface the business runs on.'],
    ['Engagement', '*Bounce is the wrong instrument.* A single-thread search session is a bounce by definition.']
  ],
  src: 'From Q3 2026 Reddit stops reporting the logged-in and logged-out split, so this cohort becomes unmeasurable from outside. It stays instrumented internally.' },

/* ---------------------------------------------------------------- 10 -- */
{ kind: 'rows', pill: 'What I am not solving', numbered: true,
  title: 'The visit itself, and why I am not pretending to fix it',
  lead: 'Three solutions act on people who reach the page. None act on the person who never arrives.',
  rows: [
    ['Out of scope', 'The Google licence expires *H1 2027*. *That negotiation sets the terms, not a feature.*'],
    ['What changes my mind', 'Whether *retrieval* fell or only *citation* fell. Trackers disagree widely.'],
    ['Not built on it', 'ChatGPT sends under *0.1%* of inbound. *The loud number is the small one.*'],
    ['Why product', 'Licensing earned *$39M* against *$762M* from ads. *The visit is what pays.*']
  ],
  src: 'If retrieval fell rather than citation, the thesis inverts. Sources: Promptwatch, Aug 2026; Ahrefs, Apr and Aug 2026.' },

/* ---------------------------------------------------------------- 11 -- */
{ kind: 'cover', dark: true,
  kicker: 'Reddit · read without being visited',
  title: 'The argument is the asset.',
  lead: 'Reddit’s asset was never the answer. It was the argument underneath it. When the answer stops requiring a visit, the argument is the only thing left worth arriving for.',
  foot: 'Full case study at ritikadas.in/writing/reddit · Ritika Das' }

];
