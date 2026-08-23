/* Savio — case study deck.
 *
 * The shell is shared: ../../_deck/deck.css and ../../_deck/engine.js. This file
 * is the content, the cover art and one diagram.
 *
 * Research figures are from the primary study: 10 interviews and 31 survey
 * responses across four countries. Cost figures are measured per verdict against
 * Gemini 2.5 Flash pricing and move when the model does.
 *
 * *text* paints that phrase in the accent colour.
 */

const SLIDES = [

/* ---------------------------------------------------------------- cover -- */
{ kind: 'cover', art: 'month',
  kicker: 'Product case study',
  title: 'Savio',
  lead: 'An AI money companion for the one question budget apps never answer. Can I afford this, right now? It reasons over your real income, commitments and goals.',
  foot: 'Ritika Das · ritikadas.in · 2026' },

/* -------------------------------------------------------------- problem -- */
{ kind: 'rows', pill: 'The problem',
  title: 'Every money app answers a question nobody asked',
  lead: 'They tell you where your salary went. That is a report on a month you cannot change any more.',
  rows: [
    ['The real question', 'Can I afford this, right now? Will it break something I have already promised?'],
    ['What people do instead', 'They work it out in their head, at the moment of deciding, with no tool open.'],
    ['What that costs', 'A guess is how a month quietly goes wrong. Nobody notices until the month is over.']
  ] },

/* ------------------------------------------------------ primary research -- */
{ kind: 'rows', pill: 'Primary research', numbered: true,
  title: 'Ten interviews, thirty-one surveys, four countries',
  lead: 'I went in expecting to build a smarter budget. The study said the budget was never the problem.',
  rows: [
    ['Interviews', '10 long conversations about money decisions people had actually made, and regretted or not.'],
    ['Survey', '31 responses across four countries, to check whether the interview findings held at any width.'],
    ['What I asked', 'Not what they track. What they do in the ninety seconds before they spend.'],
    ['What I did not do', 'Test a prototype. There was nothing to test yet, and asking people to react to a screen would have taught me about the screen.']
  ],
  src: 'Small-n by design. Ten interviews is enough to find a pattern and nowhere near enough to size a market, and the deck says so wherever a percentage appears.' },

{ kind: 'cards', pill: 'Findings', cols: 4,
  title: 'Four findings, and one of them decided the product',
  lead: 'The strongest signal was not about tracking at all.',
  cards: [
    ['*45%* do the maths in their head', 'No app, no spreadsheet, nothing open. At the moment of deciding, the tool they use is memory.'],
    ['*71%* wanted to see what a purchase does', 'Not what they spent last month. What this one will do to their savings. The strongest signal in the study.'],
    ['Four had invented a rule', 'A wait-48-hours rule, a never-above-this rule. People had already built the product, badly, in their heads.'],
    ['*5 of 6* said decisions are slow burns', 'Not checkout moments. One person deliberated over a phone for a year. This is the finding I built on.']
  ] },

/* -------------------------------------------------- competitive landscape -- */
{ kind: 'quad', pill: 'Competitive landscape',
  title: 'Everyone reports. Nobody answers.',
  lead: 'Two questions separate the field. Does it know your real numbers? And does it answer the question you actually have?',
  y: 'Answers "can I afford this"  →',
  x: 'Knows your real numbers  →',
  cells: [
    { k: 'Answers, but is guessing', names: ['A chatbot', 'A friend'] },
    { k: 'Knows the numbers, answers the question', names: ['Savio'], win: true },
    { k: 'Neither', names: ['A rule in your head'] },
    { k: 'Knows the numbers, reports the past', names: ['Budget apps', 'Bank statements', 'Spreadsheets'] }
  ] },

/* ------------------------------------------------------- persona and jtbd -- */
{ kind: 'personajobs', pill: 'Persona and jobs to be done',
  title: 'One user, and three jobs no app was doing',
  role: 'Primary user',
  name: 'Salaried, planning something',
  blurb: 'Earns monthly, has commitments already promised, and a goal being saved towards. Not in debt trouble. Not wealthy enough to stop thinking about it.',
  quotes: [
    'When I am about to spend something significant, <b>I want to know what it does to the rest of my month</b>, so I am not guessing at the worst possible moment.',
    'When an app tells me no, <b>I want it to be a rule I set myself</b>, so I do not simply ignore it the way I ignore every other alert.',
    'When the number is not one it can stand behind, <b>I want it to say so</b>, rather than make one up that sounds confident.'
  ] },

/* ------------------------------------------------- problem prioritisation -- */
{ kind: 'table', pill: 'Problem prioritisation',
  title: 'The finding scored last is the one I built on',
  lead: 'Prioritisation scored “financial decisions are slow burns” fourth of four, 18 out of 125, because it read as a quarterly problem. I disagreed with the frequency, not the finding.',
  head: ['Call', 'What it was', 'Verdict'],
  rows: [
    ['What I read', 'Financial decisions are slow burns, not checkout moments. Five of six interviews said so.', 'The finding'],
    ['What the room did', 'Scored it last of four. 18 out of 125. A quarterly problem is not worth a product.', '*18*/125'],
    ['Where I disagreed', 'Not with the problem. With the frequency. The window is long, but its book-ends are monthly.', 'Frequency'],
    ['What I ruled out', 'The checkout. A purchase that matters is made in ninety seconds and nobody opens an app inside them.', 'Cut'],
    ['What I picked', 'Payday. The day a bonus lands. The days after a purchase, when you know whether it was worth it.', 'Built', true]
  ] },

/* ------------------------------------------------------------ mvp scope -- */
{ kind: 'two', pill: 'MVP scope',
  title: 'The smallest thing that answers the question',
  lead: 'The claim is that a person can decide a real purchase from one screen, without doing arithmetic. Everything that did not test that claim waited.',
  left: ['In scope', [
    'A verdict on a specific amount, with the working shown',
    'Every figure computed in code, from the user’s own income and commitments',
    'A rule the user writes themselves, quoted back at them by name',
    'Three moments to speak: payday, a windfall, a few days after a purchase',
    'Reflection on purchases already made, labelled by the user',
    'A refusal to answer when the numbers cannot support one'
  ]],
  right: ['Out of scope, on purpose', [
    'Any intervention at the checkout, ever. The first thing I fixed and the hardest to hold',
    'Naming a fund or a stock. That is regulated advice and needs a licence I do not have',
    'Tax regimes and 80C instruments. A chartered accountant’s job',
    'Location nudging. Accurate, and it turns a companion into something that watches you',
    'Joint accounts. Two people’s money has its own consent problems',
    'Real bank connections, which need Account Aggregator and an RBI-registered partner'
  ]] },

/* ------------------------------------------------------------- solution -- */
{ kind: 'rows', pill: 'The solution', numbered: true, hot: 2,
  title: 'It waits, it grounds, and it quotes you back to yourself',
  lead: 'Three design rules, and the middle one is where the AI is allowed to work.',
  rows: [
    ['Picks its moment', 'Not a popup when you have already decided. It speaks when salary lands, when a windfall arrives, and a few days after you bought something.'],
    ['Explains, grounded', 'Code produces the numbers. The model turns them into something you would act on, drawing only on what is really yours.'],
    ['Quotes your rule', 'Not “this is over budget”, but “over the *₹3,000* impulse-wait limit you set”. A rule you wrote yourself is a rule you will accept.'],
    ['Stays quiet when unsure', 'A number it cannot stand behind does not get shown. Trust built in, rather than promised in small print.']
  ] },

{ kind: 'figure', pill: 'The rule underneath',
  title: 'The model writes the sentence. It never counts.',
  lead: 'The AI is not the weak half. It turns a correct number into something a person will actually act on, which is the whole difference between a calculation and a decision. Code does the arithmetic, because arithmetic has exactly one right answer.',
  svg: 'modelcode',
  src: 'I learned the rule by measuring it. Asked to judge which purchases had been regretted, the model called 8 of 9 when the real answer was 7 of 8. Rather than add a checker on top of it, I took the AI out of that job.' },

/* ----------------------------------------------------------------- proof -- */
{ kind: 'compare', pill: 'The evidence',
  title: 'Isn’t this just a chatbot with a finance skin?',
  lead: 'Every reviewer asks it. So the answer is a test, not a sentence. The same questions go to Savio and to a raw Gemini model, and both calls use the same underlying model, so the only variable left is the product work.',
  left: ['Raw Gemini, same model', 'No number', 'Answers from general knowledge, in one free-form blob. Will happily pick you a stock. Carries nothing between turns, and has no way to know it is inventing a number.'],
  right: ['Savio', '₹26,532', 'The real safe-to-spend, from her real state. A verdict, the trade-offs, one next step. Refuses what it is not licensed to answer, and every field is guard-verified before it is shown.'],
  src: 'Generated by scripts/run-divergence-tests.mjs against the live endpoint. One seeded persona, so it demonstrates behaviour rather than population outcomes.' },

/* ---------------------------------------------------------- user journey -- */
{ kind: 'journey', pill: 'User journey',
  title: 'One purchase, before and after',
  lead: 'The ninety seconds do not change. What changes is whether the decision was already made before them.',
  tracks: [
    ['Before', [
      ['Wants the thing', 0], ['Does the maths in her head', 0],
      ['Guesses', 1], ['Buys, or does not', 0], ['Finds out at month end', 1]
    ]],
    ['After', [
      ['Payday: sees the month', 0], ['Asks about the amount', 0],
      ['Reads one verdict and the working', 0], ['Waits 48 hours, her own rule', 2], ['Reflects, and it learns', 0]
    ]]
  ] },

/* -------------------------------------------------------------- business -- */
{ kind: 'table', pill: 'Business case',
  title: 'What it costs, and why cost is not the constraint',
  lead: 'A verdict is a third of a rupee. Three regulatory boundaries and one model deadline matter far more.',
  head: ['Line', 'Detail', 'Figure'],
  rows: [
    ['Per verdict', '6,800 tokens in, 900 out, on Gemini 2.5 Flash.', '*$0.0043*', true],
    ['Per user', 'About ten model calls a month. Ten is derived from one ritual, two reflections and five considered purchases — the five is the number to argue with.', '*₹3.6*/mo'],
    ['Biggest lever', 'The system prompt is 61% of every input and never changes. Cached at a tenth of the rate, a verdict drops to $0.0032.', '*61%*'],
    ['What closes the doors', 'Naming investments needs a SEBI licence. Tax needs a chartered accountant. Real accounts need Account Aggregator and an RBI-registered partner.', 'Subscription'],
    ['The real cap', 'At ₹4 of cost, price is not the constraint. Until account connectivity lands you type your own numbers in, and a product you maintain by hand is one you stop paying for.', 'Data entry']
  ] },

{ kind: 'cards', pill: 'Trade-offs', cols: 3,
  title: 'Three of six calls, and what each one bought',
  cards: [
    ['Timing over presence', 'The checkout was the original idea. A purchase takes ninety seconds and nobody opens an app inside one, so I gave up the moment of maximum leverage and speak at payday instead.'],
    ['Voice over vigilance', '“You’re near a Myntra. You’ve regretted four of four purchases there.” Accurate, and it turns a companion into something that watches you. Gave up the sharpest nudge available.'],
    ['One question over a dashboard', 'Stocks, funds and deposits together is a different product with different competitors. Gave up breadth to answer one thing properly.']
  ] },

/* -------------------------------------------------------------------- v2 -- */
{ kind: 'table', pill: 'What is next, and what it cannot be yet',
  title: 'One deadline, one boundary, one open question',
  lead: 'Ordered by what is forced, not by what is interesting.',
  head: ['Next', 'Why', 'When'],
  rows: [
    ['Migrate the model', 'Gemini 2.5 is deprecated from October 2026 and repriced after January. The model ID is already config; carrying thought signatures across six replayed turns is the work.', 'Jan 2027', true],
    ['Fix what beta found', 'A handful of people found what I could not. One could not work out how to leave. Another never found the Reflect tab. “Safe to spend today” sat above a whole month’s figure.', '5 real fixes'],
    ['Real money, eventually', 'Nobody manages real money with it. That is a legal boundary, not an unfinished feature: Account Aggregator and RBI-registered partners, with obligations I cannot take on alone.', 'Blocked'],
    ['The open question', 'Whether any of this changes what somebody does with their money. Beta testers on a demo are spending nothing. That needs users I am not allowed to have yet.', 'Unanswered']
  ] },

/* ----------------------------------------------------------------- close -- */
{ kind: 'cover', dark: true,
  kicker: 'Live now',
  title: 'savio.ritikadas.in',
  href: 'https://savio.ritikadas.in/',
  leadHtml: 'Runs on a seeded user with six months of history. The full build write-up is at <a href="https://ritikadas.in/work/savio/" target="_blank" rel="noopener">ritikadas.in/work/savio</a>.',
  foot: 'Ritika Das · ritikadas.in' }

];

/* ------------------------------------------------------------- cover art -- */
const ART = {
  /* One month, thirty days. Savio speaks on three of them: payday, the day a
     windfall lands, and a few days after a purchase. The other twenty-seven it
     says nothing, and the moment it never takes is the checkout — which is the
     one every other budgeting app is built around. The art is the argument. */
  month() {
    const speaks = new Set([0, 13, 21]);
    const cells = Array.from({ length: 30 }, (_, i) =>
      `<span class="day ${speaks.has(i) ? 'speak' : ''}" style="--d:${240 + i * 34}ms"></span>`).join('');
    return `<div class="month r" style="animation-delay:180ms">
      <div class="days" aria-hidden="true">${cells}</div>
      <div class="daykey">
        <span><i></i>27 days it says nothing</span>
        <span><i></i>3 moments it speaks</span>
        <span>and never at the checkout</span>
      </div>
    </div>`;
  }
};

/* --------------------------------------------------------------- diagrams -- */
const FIGS = {
  modelcode: `<svg viewBox="0 0 1000 372" role="img"
      aria-label="Code works out the numbers. The model writes the sentence. Both feed one verdict. The wiring that failed a test, asking the model to count, is struck through.">
    <rect class="fbox" x="30" y="20" width="390" height="196" rx="16"/>
    <text class="flab" x="58" y="54">CODE</text>
    <text class="fnum" x="58" y="94">safe to spend &#8377;26,532</text>
    <text class="fnum" x="58" y="126">after this &#8377;23,032</text>
    <text class="fcap" x="58" y="168">Works out every figure, because</text>
    <text class="fcap" x="58" y="192">arithmetic has one right answer.</text>

    <rect class="fbox" x="580" y="20" width="390" height="196" rx="16"/>
    <text class="flab" x="608" y="54">MODEL</text>
    <g class="ftext">
      <path d="M608 84h300"/><path d="M608 106h242"/><path d="M608 128h324"/></g>
    <text class="fcap" x="608" y="168">Turns a correct number into</text>
    <text class="fcap" x="608" y="192">a sentence you would act on.</text>

    <path class="fdash" d="M420 88h160"/>
    <g class="fx"><path d="M492 76l16 24"/><path d="M508 76l-16 24"/></g>
    <text class="fwarn" x="500" y="128" text-anchor="middle">IT MISCOUNTED</text>

    <path class="fline" d="M225 216v48q0 16 16 16h234"/>
    <path class="fline" d="M775 216v48q0 16-16 16H525"/>
    <circle class="facc" cx="500" cy="280" r="6"/>
    <rect class="fbrand" x="250" y="302" width="500" height="54" rx="15"/>
    <text class="fout" x="500" y="336" text-anchor="middle">One verdict. The working. Your own rule.</text>
  </svg>`
};
