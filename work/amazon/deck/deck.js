/* Amazon Discovery Intelligence — case study deck.
 *
 * Slides are data, not markup, so the five project decks share one renderer and
 * differ only in content plus the six palette values in the stylesheet.
 *
 * Numbers come from the live run of 18 Aug 2026 and they move every week.
 * Re-pull from /digests and /runs/latest before regenerating. The charted sets
 * reconcile: 105+69+61+22+19+16+7 = 299, and 291+196+13 = 500.
 *
 * *text* paints that phrase in the accent colour.
 */

const SLIDES = [

/* ---------------------------------------------------------------- cover -- */
{ kind: 'cover', art: true,
  kicker: 'Product case study',
  title: 'Amazon Discovery Intelligence',
  lead: 'A pipeline that reads a week of public Amazon reviews and names the one problem worth starting. For every other problem it says what evidence is missing.',
  foot: 'Ritika Das · ritikadas.in · August 2026' },

/* -------------------------------------------------------------- problem -- */
{ kind: 'rows', pill: 'The problem',
  title: 'The reading is done. The deciding is not.',
  lead: 'A product manager owns one surface and gets a few hundred complaints a week across three stores. They have one afternoon. So they skim, and skimming never tells you what you missed.',
  rows: [
    ['What happens now', 'Sort by star rating, read the loudest, pick one, build it.'],
    ['What that misses', 'The complaint that cost somebody money was short and calm. It never got picked.'],
    ['What is actually hard', 'Not reading the reviews. Choosing which single problem to start on Monday, and being able to defend that choice.']
  ] },

/* ------------------------------------------------------ primary research -- */
{ kind: 'rows', pill: 'Primary research', numbered: true,
  title: 'I studied the products that already do this',
  lead: 'Four products claim this job. I went through what each one takes in, what it hands back, and the exact point where it stops and gives the work to the user.',
  rows: [
    ['Dovetail', 'A store for customer feedback. Reads raw text, groups it into themes. Sold to Canva, Meta and NTT DOCOMO.'],
    ['Amplitude', 'Product analytics that added feedback clustering. Themes sit next to behaviour data.'],
    ['Atlassian', 'An agent that reads the feedback queue for its own PMs. Atlassian publishes a saving of about 40 minutes a day per PM.'],
    ['An n8n workflow', 'A no-code visual workflow that pulls reviews and summarises them. Free, quick to build, and hard to change once the logic gets real.']
  ],
  src: 'Product surfaces and published vendor material. The 40-minute figure is Atlassian’s own published claim, not a measurement of mine.' },

{ kind: 'cards', pill: 'Findings', cols: 4,
  title: 'All four stop at the same line',
  lead: 'Reading and grouping is solved. Nobody crosses the line into the decision.',
  cards: [
    ['Grouping is a solved problem', 'Every one of the four reads messy text and groups it into themes. That part works, and it is the part a language model is genuinely good at.'],
    ['They all hand back a list', 'The output is a ranked list of themes. The PM still has to open it, read it, and decide. The hour the tool saved is handed straight back.'],
    ['None of them names a move', 'No first action, no owner, no rough cost. Those are the three things you need before a problem can go into a sprint.'],
    ['None of them refuses', 'A theme with 3 complaints and a theme with 300 look the same on the list. Nothing tells you which one the evidence cannot carry.']
  ] },

/* -------------------------------------------------- competitive landscape -- */
{ kind: 'quad', pill: 'Competitive landscape',
  title: 'The gap is one step wide',
  lead: 'Two questions separate the field. Does it read the raw feedback for you? And does it end with a decision, or with a list?',
  y: 'Ends with a decision  →',
  x: 'The tool does the reading  →',
  cells: [
    { k: 'Decides, but a human does the reading', names: ['A PM reading manually'] },
    { k: 'Reads everything, and decides', names: ['This'], win: true },
    { k: 'Neither', names: ['Star ratings', 'Tickets by volume'] },
    { k: 'Reads everything, hands back a list', names: ['Dovetail', 'Amplitude', 'Atlassian', 'n8n workflows'] }
  ] },

/* -------------------------------------------------------------- persona -- */
{ kind: 'persona', pill: 'Persona',
  title: 'One user, and she is out of afternoons',
  role: 'Primary user',
  name: 'PM on a consumer app',
  photoAlt: 'A product manager at her desk, laptop open, an Amazon mug and bottle beside her. Generated image, not a photograph of a real person.',
  blurb: 'Owns one surface, such as Checkout or Search. Reports to a lead who asks why this and not that.',
  bits: [
    ['Her week', 'A few hundred public complaints across App Store, Play Store and the product pages. One afternoon to make sense of them.', 'stack'],
    ['What she does today', 'Skims, sorts by star rating, picks the complaint that sounded angriest.', 'skim'],
    ['Where it breaks', 'The expensive problems are quiet. A customer charged twice writes a short, tired review and never gets picked.', 'quiet'],
    ['What she needs', 'One problem, the first move on it, who owns it, and the evidence underneath, so she can defend the choice in a standup.', 'one']
  ] },

/* ----------------------------------------------------------------- jtbd -- */
{ kind: 'quotes', pill: 'Jobs to be done',
  title: 'Three jobs, in her words',
  lead: 'Each one is a job the four existing products leave unfinished.',
  quotes: [
    'When a week of complaints lands, <b>I want to know which single problem to start on</b>, so I can spend the afternoon building instead of reading.',
    'When I pick a problem, <b>I want the evidence underneath it in one place</b>, so I can defend the choice to my lead without opening the reviews again.',
    'When the evidence is thin, <b>I want to be told that plainly</b>, so I do not confidently build the wrong thing.'
  ] },

/* ------------------------------------------------- problem prioritisation -- */
{ kind: 'table', pill: 'Problem prioritisation',
  title: 'What I chose to build, and what I dropped',
  lead: 'Five candidates. I scored each on whether it closed a job above, and on whether anyone had already closed it.',
  head: ['Candidate', 'Reasoning', 'Call'],
  rows: [
    ['Group reviews better', 'The four existing products already do this well. Rebuilding it adds nothing.', 'Dropped'],
    ['Name the first move', 'The step every one of them stops before. Closes job one and job two together.', 'Built', true],
    ['Refuse to rank thin evidence', 'Closes job three. Nothing on the market does it, and it is what stops confident nonsense.', 'Built', true],
    ['Chat over the review corpus', 'Answers questions about the week and cites the reviews behind each answer. Support for the decision, not the decision itself.', 'Built', true],
    ['Week-by-week history view', 'Nobody asks what happened in week 22. They ask what is going wrong in Checkout now.', 'Dropped']
  ] },

/* ------------------------------------------------------------ mvp scope -- */
{ kind: 'two', pill: 'MVP scope',
  title: 'The smallest thing that tests the claim',
  lead: 'The claim is that a PM can act on the output without opening a single review. Anything that did not test that claim waited.',
  left: ['In scope', [
    'Three live public sources: App Store, Play Store, Amazon product pages',
    'A substance filter that drops “good app” and emoji-only, in any language',
    'Grouping into named problems by a language model',
    'Every count done in code: people, sources, score, change on last week',
    'RICE and MoSCoW ranking, plus a second score for what the problem cost',
    'A readiness gate that refuses to rank what it cannot back',
    'One first move, an owner and a rough cost on every problem',
    'A weekly run, a Google Sheet, an email digest and a dashboard',
    'A chat over the week that cites the reviews behind every answer'
  ]],
  right: ['Out of scope, on purpose', [
    'Sign-in. Every endpoint is open today, and that is a known gap',
    'A paid reviews API, which would unblock iOS and critical reviews',
    'Reddit as a fourth source',
    'Vector search over the corpus',
    'A browsable archive of past weeks',
    'Writing the chosen move back into Jira',
    'More than one product at a time'
  ]] },

/* ------------------------------------------------------------- solution -- */
{ kind: 'rows', pill: 'The solution', numbered: true, hot: 3,
  title: 'Fourteen steps. The model is called at four of them.',
  lead: 'None of the four model calls does arithmetic. Every number a PM reads is counted in code, where it cannot drift.',
  rows: [
    ['Collect', 'App Store, Play Store and Amazon product pages, once a week'],
    ['Filter', 'A substance bar drops praise, noise and emoji-only, in any language'],
    ['Group', 'The model reads and clusters complaints into named problems'],
    ['Count', 'Code does every figure: people, sources, score, change on last week'],
    ['Gate', 'Refuses to rank a problem it cannot back, and names what is missing'],
    ['Deliver', 'A digest that leads with one first move, an owner and a price']
  ] },

{ kind: 'figure', pill: 'The rule underneath',
  title: 'Never ask a model to grade what you have already counted',
  lead: 'The model is not the weak half. It reads a thousand badly written complaints and sees that four hundred are one problem, which is something I cannot do. Code does the arithmetic, which has exactly one right answer. Give each of them the job it is good at, and together they do more than either does alone.',
  svg: 'modelcode',
  src: 'I learned the rule the expensive way. I asked the model to grade a count code had already made exactly. It looked at 53 complaints and wrote “only one person reported this”, and the page rendered that beside the number 53.' },

/* ----------------------------------------------------------------- proof -- */
{ kind: 'funnel', pill: 'One live week',
  title: 'What a week produces',
  lead: 'The last number is the whole product. The other four tools would have ranked all 33 and let the PM find out for herself which ones were thin.',
  steps: [
    ['Collected', '500', 'Reviews pulled from three sources'],
    ['Sorted', '299', 'Enough substance to place in a problem'],
    ['Problems', '33', 'Across 7 parts of the app'],
    ['Ready', '1', 'Enough evidence behind it to act on']
  ],
  src: 'Live run, 18 August 2026. Figures move every week.' },

{ kind: 'bars', pill: 'Findings, one week', max: 105,
  title: 'Seven parts of the app',
  lead: 'The 299 sorted complaints, by the part of the app they are about. Account and search carry more than half between them.',
  bars: [
    ['Account & performance', 105], ['Search & discovery', 69], ['Delivery & tracking', 61],
    ['Product detail', 22], ['Checkout & payment', 19], ['Returns & refunds', 16],
    ['Prime & subscriptions', 7]
  ],
  src: 'Live run, 18 August 2026. Sums to 299.' },

{ kind: 'bars', pill: 'Sources, one week', max: 291,
  title: 'Three sources, very unevenly',
  lead: 'Amazon’s own product pages contribute almost nothing. The public reviews there are mostly praise, and the substance filter drops them. Apple is the largest source, when it answers at all.',
  bars: [['App Store', 291], ['Play Store', 196], ['Amazon product pages', 13]],
  src: 'Live run, 18 August 2026. Apple blocks requests from datacentre addresses, so App Store volume depends on where the run happens. A paid reviews API removes that dependency — see v2.' },

{ kind: 'compare', pill: 'The finding that changed the product',
  title: 'Severity measures loudness, not cost',
  lead: 'Someone who cannot find a product writes a furious review. Someone charged twice writes a short, tired one. Ranking on tone alone buries the money.',
  left: ['Ranked on tone alone', '3.2', 'The upset score on the week’s costliest problem. Unremarkable. The 23 complaints that cost people money sit across 7 problems, most of them below problems that only irritated people.'],
  right: ['Two scores, not one', '44', 'People on the problem that came top. 13 packages lost or sent to the wrong address, 2 charged for items that never arrived. The two scores disagree often enough to earn the second look.'] },

/* ---------------------------------------------------------- user journey -- */
{ kind: 'journey', pill: 'User journey',
  title: 'One Monday afternoon, before and after',
  lead: 'It does not save her the reading. It saves her the deciding, which is the part she could not defend.',
  tracks: [
    ['Before', [
      ['Opens three stores', 0], ['Skims a few hundred reviews', 0],
      ['Sorts by star rating', 0], ['Picks the loudest', 1],
      ['Cannot say why, in standup', 1]
    ]],
    ['After', [
      ['Opens one digest', 0], ['Reads one problem', 0],
      ['Sees the counts behind it', 0], ['Takes the named first move', 2],
      ['Logs what she deferred, and why', 0]
    ]]
  ] },

/* -------------------------------------------------------------- business -- */
{ kind: 'table', pill: 'Business case',
  title: 'What it costs, and what it has to be worth',
  lead: 'This is an internal tool, so the case is cost against time, not revenue.',
  head: ['Line', 'Detail', 'Figure'],
  rows: [
    ['Cost to run', 'Cloud Run scales to zero between weekly runs. Model calls and a Google Sheet are the only recurring spend.', '*₹40*/mo', true],
    ['The alternative', 'A managed Postgres database to hold seven rows a week, which is what the first design used.', '*₹1,100*/mo'],
    ['Cost per reader', 'The pipeline runs once a week whoever reads it. Adding readers costs nothing. Adding products multiplies only the model calls.', '₹0'],
    ['The value to beat', 'Atlassian’s published saving for its own PMs, from an agent that reads the queue and still hands back a list.', '40 min/day'],
    ['What is not proven', 'No PM has run a live week through this one yet. The saving above is a comparable product’s published figure, not a result of mine.', '—']
  ] },

{ kind: 'cards', pill: 'Trade-offs', cols: 3,
  title: 'Three calls, and what each one bought',
  cards: [
    ['A spreadsheet over a database', 'Gave up queries and schema control. Got a store PMs already sort, filter and share, and *₹1,100* a month became *₹40*.'],
    ['Their schema over mine', 'Gave up a clean schema of my own. Kept every filter and pivot a PM had already built on the sheet, misspelled column header and all.'],
    ['The question over the archive', 'Gave up the week-by-week history view. Nobody asks what happened in week 22. They ask what is going wrong in Checkout.']
  ] },

{ kind: 'rows', pill: 'Measurement',
  title: 'How I would know it works',
  lead: 'One number, and the number that stops the first one from lying.',
  rows: [
    ['Decision rate', 'The share of surfaced problems a PM either acts on or deliberately defers. It tests the only claim the product makes.'],
    ['The guardrail', 'How often it calls a problem ready when the evidence cannot carry it. Watching the first number alone is how a team ships confident nonsense.'],
    ['Already instrumented', 'Deferrals are logged with the week they happened in, so “why did we skip returns in August” has an answer in November.']
  ] },

/* -------------------------------------------------------------------- v2 -- */
{ kind: 'table', pill: 'V2 planning',
  title: 'What ships next, in order',
  lead: 'Ordered by what unblocks the most, not by what is most interesting to build.',
  head: ['Next', 'Why it is next', 'Unblocks'],
  rows: [
    ['A paid reviews API', 'Apple blocks datacentre addresses, so a scheduled run can come back with nothing from iOS. Critical reviews are also behind a sign-in.', 'Volume', true],
    ['Sign-in', 'Every endpoint is publicly callable today. This has to close before anyone else uses it.', 'Real users'],
    ['Reddit as a fourth source', 'Platform complaints live there and never reach a store review.', 'Coverage'],
    ['Vector search under the chat', 'The chat is built and it holds one week inside a single prompt. Vector search is what it needs once the corpus outgrows that.', 'Depth'],
    ['Track whether the move gets taken', 'The digest already carries a feedback link. This turns the decision rate from a plan into a number.', 'The proof']
  ] },

/* ----------------------------------------------------------------- close -- */
{ kind: 'cover', dark: true,
  kicker: 'Live now',
  title: 'amazon.ritikadas.in',
  href: 'https://amazon.ritikadas.in',
  leadHtml: 'Runs every Monday at 09:00, scales to zero between runs, about ₹40 a month. The full build write-up is at <a href="https://ritikadas.in/work/amazon/" target="_blank" rel="noopener">ritikadas.in/work/amazon</a>.',
  foot: 'Ritika Das · ritikadas.in' }

];

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

/* The cover field is 500 squares, one per review collected in the live week.
   201 stay faint because the substance filter dropped them, 299 turn solid
   because they placed in a problem, and one turns accent because it was the only
   problem with enough evidence behind it to act on. The art is the funnel. */
function dots() {
  let seed = 20260818;                     // fixed, so the field never reshuffles
  const rand = () => (seed = (seed * 1103515 + 12345) % 2147483648) / 2147483648;
  const state = Array(500).fill('sorted');
  let dropped = 0;
  while (dropped < 201) {
    const i = Math.floor(rand() * 500);
    if (state[i] === 'sorted') { state[i] = ''; dropped++; }
  }
  state[4 * 50 + 33] = 'one';              // fifth row, right of centre
  const cells = state.map((c, i) =>
    `<span class="dot ${c}" style="--d:${240 + (i % 50) * 17 + Math.floor(i / 50) * 9}ms"></span>`).join('');
  return `<div class="dotwrap r" ${d(3)}>
      <div class="dots" aria-hidden="true">${cells}</div>
      <div class="dotkey">
        <span><i></i>201 dropped by the filter</span>
        <span><i></i>299 placed in a problem</span>
        <span><i></i>1 ready to act on</span>
      </div>
    </div>`;
}


/* Small line drawings for the persona blocks. Each one is the block's sentence
   as a picture, so an empty card carries something before the reader starts. */
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
      <path d="M8.2 12.4l2.8 2.8 5-5.6"/></svg>`
};

/* The model-and-code diagram. Two lanes doing different jobs, joining into one
   output, with the wiring I got wrong marked and struck through. */
const FIGS = {
  modelcode: `<svg viewBox="0 0 1000 372" role="img"
      aria-label="The model reads and groups. Code counts. Both feed one decision. The wiring I got wrong, asking the model to grade a count, is struck through.">
    <rect class="fbox" x="30" y="20" width="390" height="196" rx="16"/>
    <text class="flab" x="58" y="54">MODEL</text>
    <g class="ftext">
      <path d="M58 84h300"/><path d="M58 106h242"/><path d="M58 128h324"/></g>
    <text class="fcap" x="58" y="168">Reads a thousand messy complaints</text>
    <text class="fcap" x="58" y="192">and sees that four hundred are one.</text>

    <rect class="fbox" x="580" y="20" width="390" height="196" rx="16"/>
    <text class="flab" x="608" y="54">CODE</text>
    <text class="fnum" x="608" y="94">500 &#8594; 299 &#8594; 33 &#8594; 1</text>
    <text class="fnum" x="608" y="126">105 69 61 22 19 16 7</text>
    <text class="fcap" x="608" y="168">Counts every figure exactly,</text>
    <text class="fcap" x="608" y="192">because arithmetic has one answer</text>

    <path class="fdash" d="M420 88h160"/>
    <g class="fx"><path d="M492 76l16 24"/><path d="M508 76l-16 24"/></g>
    <text class="fwarn" x="500" y="128" text-anchor="middle">NOT THIS WAY</text>

    <path class="fline" d="M225 216v48q0 16 16 16h234"/>
    <path class="fline" d="M775 216v48q0 16-16 16H525"/>
    <circle class="facc" cx="500" cy="280" r="6"/>
    <rect class="fbrand" x="250" y="302" width="500" height="54" rx="15"/>
    <text class="fout" x="500" y="336" text-anchor="middle">One problem. One first move. One owner.</text>
  </svg>`
};


/* A drawn portrait for the persona card. Faceless stock art says nothing; a
   photograph of a real person would be a real person who never agreed to be
   here. This is a drawing, in the deck's palette. */
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
    + (sl.art ? dots() : '')
    + `<p class="src">${esc(sl.foot)}</p>`,

  statement: sl => (sl.pill ? `<span class="pill r" ${d(0)}>${esc(sl.pill)}</span>` : '')
    + `<h2 class="big-say r" ${d(1)}>${mark(sl.title)}</h2>
       <p class="lead r" ${d(3)}>${mark(sl.lead)}</p>`,

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

  persona: sl => head(sl) + body(`<div class="persona">
      <div class="pcard r" ${d(3)}>
        <img class="pphoto" src="images/persona.jpg" width="800" height="800"
             alt="${esc(sl.photoAlt || sl.name)}"
             onerror="this.outerHTML=FACE">
        <div class="pmeta">
          <span class="prole">${esc(sl.role)}</span>
          <span class="pname">${esc(sl.name)}</span>
          <p>${esc(sl.blurb)}</p>
        </div>
      </div>
      <div class="pgrid">` + sl.bits.map((b, i) =>
      `<div class="pbit r" ${d(i + 4)}>${ICONS[b[2]] || ''}
         <span class="k">${esc(b[0])}</span><p>${mark(b[1])}</p></div>`)
      .join('') + `</div>
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

  figure: sl => head(sl) + body(`<div class="fig r" ${d(3)}>${FIGS[sl.svg]}</div>`) + foot(sl),

  journey: sl => head(sl) + body(`<div class="journey">` + sl.tracks.map(([name, steps], t) =>
      `<div class="track ${t === 0 ? 'was' : 'now'}">
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
