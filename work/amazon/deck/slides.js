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
{ kind: 'cover', art: 'dots',
  kicker: 'Product case study',
  title: 'Amazon Discovery Intelligence',
  lead: 'A pipeline that reads a week of public Amazon reviews and names the one problem worth starting. For every other problem it says what evidence is missing.',
  foot: 'Ritika Das · ritikadas.in · August 2026' },

/* -------------------------------------------------------------- problem -- */
{ kind: 'rows', pill: 'The problem',
  title: 'The reading is done. The deciding is not.',
  lead: 'A product manager owns one surface and gets a few hundred complaints a week across three stores. She has one afternoon. So she skims, and skimming never tells you what you missed.',
  rows: [
    ['What happens now', 'Sort by star rating, read the loudest, pick one, build it.'],
    ['What that misses', 'The complaint that cost somebody money was short and calm. It never got picked.'],
    ['What is actually hard', 'Not reading the reviews. Choosing which single problem to start on Monday, and being able to defend that choice.']
  ] },

/* ------------------------------- primary research, and what it turned up -- */
{ kind: 'table', pill: 'Primary research',
  title: 'Four products already claim this job',
  lead: 'I went through what each one takes in and what it hands back. Reading and grouping is solved. All four stop at the same line, one step before the decision.',
  head: ['Product', 'What it does', 'Where it stops'],
  rows: [
    ['Dovetail', 'A store for customer feedback. Reads raw text and groups it into themes. Sold to Canva, Meta and NTT DOCOMO.', 'A list'],
    ['Amplitude', 'Product analytics that added feedback clustering, so themes sit beside behaviour data.', 'A list'],
    ['Atlassian', 'An agent that reads the feedback queue for its own PMs. Atlassian publishes a saving of about 40 minutes a day per PM.', 'A list'],
    ['An n8n workflow', 'A no-code visual workflow that pulls reviews and summarises them. Free and quick, and hard to change once the logic gets real.', 'A summary']
  ],
  src: 'Product surfaces and published vendor material. None of the four names a first move, an owner or a cost, and none of them refuses to rank a theme it cannot back. The 40-minute figure is Atlassian’s own published claim, not a measurement of mine.' },

/* -------------------------------------------------- competitive landscape -- */
{ kind: 'quad', pill: 'Competitive landscape',
  title: 'The gap is one step wide',
  lead: 'Two questions separate the field. Does the tool do the reading for you? And does it end with a decision, or with a list?',
  y: 'Ends with a decision  →',
  x: 'The tool does the reading  →',
  cells: [
    { k: 'Decides, but a human does the reading', names: ['A PM reading manually'] },
    { k: 'Reads everything, and decides', names: ['This'], win: true },
    { k: 'Neither', names: ['Star ratings', 'Tickets by volume'] },
    { k: 'Reads everything, hands back a list', names: ['Dovetail', 'Amplitude', 'Atlassian', 'n8n workflows'] }
  ] },

/* ------------------------------------------------------- persona and jtbd -- */
{ kind: 'personajobs', pill: 'Persona and jobs to be done',
  title: 'One user, and three jobs she cannot finish',
  role: 'Primary user',
  name: 'PM on a consumer app',
  photoAlt: 'A product manager at her desk, laptop open, an Amazon mug and bottle beside her. Generated image, not a photograph of a real person.',
  blurb: 'Owns one surface, such as Checkout or Search. A few hundred public complaints a week across three stores, and one afternoon. Reports to a lead who asks why this and not that.',
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
    'Vector search under the chat',
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
{ kind: 'week', pill: 'One live week',
  title: 'What a week produces, and where it lands',
  lead: 'The last number in the funnel is the whole product. The other four tools would have ranked all 33 and let the PM find out for herself which ones were thin.',
  steps: [
    ['Collected', '500', 'From three sources'],
    ['Sorted', '299', 'Enough substance to place'],
    ['Problems', '33', 'Across 7 parts of the app'],
    ['Ready', '1', 'Enough evidence to act on']
  ],
  max: 105,
  bars: [
    ['Account & performance', 105], ['Search & discovery', 69], ['Delivery & tracking', 61],
    ['Product detail', 22], ['Checkout & payment', 19], ['Returns & refunds', 16],
    ['Prime & subscriptions', 7]
  ],
  src: 'Live run, 18 August 2026, and the figures move every week. The bars are the 299 sorted complaints and sum to 299. By source: App Store 291, Play Store 196, Amazon product pages 13. Apple blocks requests from datacentre addresses, so App Store volume depends on where the run happens — see v2.' },

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

/* ------------------------------------------- business case and how to tell -- */
{ kind: 'table', pill: 'Business case',
  title: 'What it costs, what it saves, and how I would know',
  lead: 'An internal tool, so the case is cost against time, not revenue. The last two lines are the ones an interviewer should press on.',
  head: ['Line', 'Detail', 'Figure'],
  rows: [
    ['Cost to run', 'Cloud Run scales to zero between weekly runs. It runs once a week whoever reads it, so adding readers costs nothing.', '*₹40*/mo', true],
    ['The alternative', 'A managed Postgres database to hold seven rows a week, which is what the first design used.', '*₹1,100*/mo'],
    ['The value to beat', 'Atlassian’s published saving for its own PMs, from an agent that reads the queue and still hands back a list.', '40 min/day'],
    ['How I would know', 'Decision rate: the share of surfaced problems a PM acts on or deliberately defers. Beside it, how often the product calls a problem ready when the evidence cannot carry it.', 'The metric'],
    ['What is not proven', 'No PM has run a live week through this one yet, so the saving above is a comparable product’s published figure, not a result of mine.', '—']
  ] },

{ kind: 'cards', pill: 'Trade-offs', cols: 3,
  title: 'Three calls, and what each one bought',
  cards: [
    ['A spreadsheet over a database', 'Gave up queries and schema control. Got a store PMs already sort, filter and share, and *₹1,100* a month became *₹40*.'],
    ['Their schema over mine', 'Gave up a clean schema of my own. Kept every filter and pivot a PM had already built on the sheet, misspelled column header and all.'],
    ['The question over the archive', 'Gave up the week-by-week history view. Nobody asks what happened in week 22. They ask what is going wrong in Checkout.']
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
    ['Vector search under the chat', 'The chat is built and holds one week inside a single prompt. Vector search is what it needs once the corpus outgrows that.', 'Depth'],
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

/* ------------------------------------------------------------- cover art -- */
const ART = {
/* The cover field is 500 squares, one per review collected in the live week.
   201 stay faint because the substance filter dropped them, 299 turn solid
   because they placed in a problem, and one turns accent because it was the only
   problem with enough evidence behind it to act on. The art is the funnel. */
dots() {
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
};

/* --------------------------------------------------------------- diagrams -- */
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
