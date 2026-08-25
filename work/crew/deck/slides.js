/* CREW — case study deck.
 *
 * The shell is shared: ../../_deck/deck.css and ../../_deck/engine.js. This file
 * is the content, the cover art and one diagram.
 *
 * This is a teardown, not a project I worked on. Everything here comes from
 * outside: CREW's public product pages and app listing, Swiggy's own public
 * statements, and public reporting on the concierge businesses that came before.
 * Where a figure is not visible from outside, the slide says so rather than
 * estimating it — the ₹999 is printed in the app, the interchange is not.
 *
 * *text* paints that phrase in the accent colour.
 */

const SLIDES = [

/* ---------------------------------------------------------------- cover -- */
{ kind: 'cover', art: 'firsts',
  kicker: 'Product case study · August 2026',
  title: 'CREW speaks before you ask.',
  lead: 'Swiggy’s travel concierge. Any travel app can sell you the flight; almost none will tell you about a terminal you have not reached yet. That message is the product, and the reason competitors have not copied it is not that they never thought of it.',
  foot: 'Ritika Das · ritikadas.in · 2026' },

/* -------------------------------------------------------------- summary -- */
{ kind: 'rows', pill: 'The recommendation, first', hot: 0,
  title: 'Build the plan that watches itself, and ship it before anything else',
  lead: 'One recommendation and the three things that make it the right one. Everything after this slide is the working.',
  rows: [
    ['What to build', 'A trip plan the app checks against reality all day — the gate, the departure, a connection gone too tight, rain over an outdoor afternoon — that writes the message when one of them breaks and hands it to a person to send.'],
    ['Because the cost is the ceiling', 'Swiggy already paid for acquisition and keeps the relationship warm. *Cost to serve is the only cost CREW did not inherit an answer to*, and it scales with trips rather than with the company.'],
    ['Because it needs nothing new', 'The plan is already a record inside trip planning. The gate and the delay are already in the booking. The forecast is free, and the tone is already written in the cards CREW publishes.'],
    ['Because it is what CREW sells', 'The product is a message you did not ask for. This makes that message routine instead of exceptional — on every trip, rather than the few where somebody thought to ask.']
  ] },

/* -------------------------------------------------------------- product -- */
{ kind: 'shot', pill: 'The product',
  title: 'The message nobody asked for',
  lead: 'Fifty-five minutes to catch a connecting flight, in an airport you have never been to, from a different terminal. You did not have to find that out.',
  img: 'images/crew-07-airport.jpg',
  alt: 'A CREW product card. CREW writes first: you land in T1 but your next flight is from T2 in 55 minutes, take the inter-terminal train, eight minutes, to Gate D. The traveller replies asking where to get coffee, and CREW answers.',
  panels: [
    ['Every travel app can sell the flight', 'Inventory and price are the two things the whole category competes on. Both are visible before you buy and neither needs anyone to be paying attention afterwards.'],
    ['Almost none will mention the terminal', 'It arrives *before* landing, unprompted, with the train and how long it runs. Nothing about it is a booking.'],
    ['The absence is not an oversight', 'Every large platform holds the flight number, the connection and both terminals, for far more travellers. None of them has ever sent anyone a message about a gate.', true]
  ],
  cap: 'CREW’s own product pages. In half the exchanges shown there, CREW speaks before the customer does.' },

/* --------------------------------------------------------------- method -- */
{ kind: 'rows', pill: 'Goal, scope and assumptions', numbered: true,
  title: 'What I chose to improve, before choosing what to build',
  lead: '“Improve CREW” is not a brief until it says for whom and towards what, so this is the brief I set myself.',
  rows: [
    ['The goal', 'Raise contribution margin per trip *without thinning the service* — the same people covering more trips, rather than fewer minutes spent on each traveller.'],
    ['For whom', 'The member who is buying attention rather than inventory: first long-haul, a holiday a year in the planning, a honeymoon. Not the frequent flyer.'],
    ['What I read', 'CREW’s public product pages and app listing, Swiggy’s own public statements, and public reporting on the concierge businesses that came before it.'],
    ['What is confirmed', 'The *₹999* the app asks for up front, and commission on what gets booked. Both are visible from outside.'],
    ['What I could not see', 'Whether card interchange comes back to CREW, and every internal number: headcount, retention, minutes per trip. None of it is estimated anywhere in this deck.']
  ],
  src: 'No Swiggy or CREW data was used and none was available to me. Comparable-business outcomes come from public reporting on Ten Lifestyle, Velocity Black and American Express. My own judgement starts at the options slide and is labelled from there on.' },

/* ------------------------------------------------------------- customer -- */
{ kind: 'compare', pill: 'The customer',
  title: 'Who this is worth paying for, and who it is not',
  lead: 'Every exchange CREW publishes is missing the same thing: nobody asks the price. These are its own marketing cards, so the absence is a choice — and it says who the product is for.',
  left: ['Worth least to', 'The thirtieth flight', 'You already know where the lounge is. You have your own visa routine, your hotel, your seat. For this traveller CREW is a nicer booking engine — and a nicer booking engine is exactly the product whose price you check.', 'returns'],
  right: ['Worth most to', 'The first long-haul', 'A holiday a year in the planning. A honeymoon. Expertise does not travel with you: somebody who knows Bombay street by street lands in Lisbon knowing nothing, and one wrong call there is not recoverable.', 'leaves'],
  src: 'Both of them fly. Only one of them is buying what CREW actually sells, which is not the booking.' },

/* -------------------------------------------------------- persona, jtbd -- */
{ kind: 'personajobs', pill: 'Persona and jobs to be done',
  title: 'One traveller, and three jobs a booking engine cannot take',
  role: 'Primary member',
  name: 'Paying to stop deciding',
  blurb: 'Would rather pay for the experience than price it across five tabs. Money is only half of it; the other half is having decided that choosing is the expensive part.',
  quotes: [
    'When I land somewhere I have never been, <b>I want to be told what happens next</b>, before I have worked out that I needed to ask.',
    'When something moves — a gate, a time, the weather over the afternoon I planned — <b>I want to hear it from you first</b>, not from the airport screen.',
    'When it is the one holiday I get this year, <b>I want somebody answerable</b>, so that being wrong is not my problem to solve at six in the morning.'
  ],
  src: 'Written from CREW’s published exchanges and the absence in them, not from interviews. I had no access to CREW’s customers.' },

/* ----------------------------------------------------------------- moat -- */
{ kind: 'quad', pill: 'Competitive landscape',
  title: 'The data is not the moat',
  lead: 'To send that airport message you need the trip and you need somebody who will stay with a customer through a day. Everybody has one of the two.',
  y: 'People who stay with a customer  →',
  x: 'Holds the live trip  →',
  cells: [
    { k: 'The people, without the data', names: ['A travel agent'] },
    { k: 'Both, and a reason to spend the hour', names: ['CREW'], win: true },
    { k: 'Neither the trip nor a reason to speak first', names: ['A general-purpose assistant'] },
    { k: 'The data, and no way to afford the people', names: ['Booking platforms', 'Airline apps'] }
  ],
  src: 'A third condition sits underneath both axes: a relationship that makes spending an hour on one traveller reasonable. A platform built on volume breaks when it adds a service team.' },

/* ------------------------------------------------------------ economics -- */
{ kind: 'rows', pill: 'Unit economics', hot: 2,
  title: 'Every standalone concierge died of the first two problems',
  lead: 'A concierge on its own has three at once. CREW inherited answers to two of them, and not because it is cleverer.',
  rows: [
    ['Winning the customer', 'Finding people who travel expensively and will hand a holiday over, one at a time. The purchase is rare, so the payback runs long. *Swiggy paid for this years ago*, over food and groceries, and knows from its own order history who spends.'],
    ['Keeping them', 'Somebody travels a few times a year, and a relationship that goes quiet for five months has to be rebuilt. *It never goes quiet here* — Instamart and Dineout keep it warm between trips.'],
    ['Serving them', 'The human minutes one trip consumes. Nothing about sitting inside Swiggy inverts this, because it scales with trips rather than with the size of the company. *This is the whole rest of the deck.*']
  ],
  src: 'It ended the same way every time: Ten Lifestyle inside private banks, Velocity Black inside Capital One, and American Express never sold its concierge separately at all. None lasted as a subscription bought on its own.' },

/* -------------------------------------------------------------- revenue -- */
{ kind: 'table', pill: 'What comes in',
  title: 'Two lines confirmed, one I cannot see',
  lead: 'Contribution margin is a trip’s revenue minus the cost of serving it. Acquisition and retention were paid elsewhere, so the human minutes are nearly all of that cost — which is why the margin turns on one number.',
  head: ['Line', 'What it is', 'Status'],
  rows: [
    ['Subscription', 'The *₹999* the app asks for up front. Printed in the app, so it needs no estimating.', 'Confirmed'],
    ['Commission', 'A share of what gets booked. It scales with the trip rather than with the member, which is why the entrance argues about rates it earns a margin on.', 'Confirmed'],
    ['Card interchange', 'The co-branded card runs spend over Swiggy plastic. Whether interchange comes back to CREW is not visible from outside, so it is not in any number here.', 'Not visible'],
    ['Cost to serve', 'The human minutes one trip consumes. The only cost CREW did not inherit an answer to, and the one every proposal below attacks.', 'The constraint', true]
  ] },

/* ----------------------------------------------------------- constraint -- */
{ kind: 'statement', pill: 'The constraint',
  title: 'The moat is the *ceiling*.',
  lead: 'Swiggy scaled on physical dispatch, where a rider is interchangeable. The people who do this job are not. They need visa rules and what a connecting flight really takes — and the harder half, which is staying calm, reading a mood, knowing when not to speak. A wrong burger is a refund and an apology. A missed visa clause is somebody’s one holiday of the year.',
  src: 'Anything that scarce has to be rationed, and it is: CREW is not a tile in the Swiggy app, and the service comes with a booking big enough to pay for it. Which leaves an awkward proof — you find out whether you can hand over a trip by handing one over.' },

/* -------------------------------------------------------------- options -- */
{ kind: 'table', pill: 'Options considered · my judgement starts here',
  title: 'Four ways to move the same number',
  lead: 'Cost to serve is minutes of a scarce person. There are only four things you can do about that, and three of them cost more than they save.',
  head: ['Option', 'What it does to the minutes', 'Verdict'],
  rows: [
    ['Hire more assistants', 'Buys capacity at exactly the rate it buys cost, and the constraint was never budget. These people need visa rules and the harder half — staying calm, knowing when not to speak — so the supply runs out before the money does.', 'Breaks on supply'],
    ['Raise the booking gate', 'Protects the margin on every trip served by serving fewer of them. It defends the number by shrinking the business, and does nothing to the minutes themselves.', 'Wrong direction'],
    ['Take the person out', 'Self-serve everything and the minutes go to nearly zero — along with the product. What CREW sells is somebody being answerable, and an app cannot be answerable at six in the morning.', 'Kills the product'],
    ['Automate the routine, keep people for judgement', 'Most messages are structured data checked against a record the app already holds. Give those to the app and the same person covers more trips without any traveller getting less attention.', 'Chosen', true]
  ],
  src: 'And one thing I would refuse to build: the phone call. Nobody has automated being the person answerable once something has gone wrong, and a masseuse at a villa in Goa is not an API. The tiers on slide fourteen stop deliberately short of it.' },

/* ------------------------------------------------------------- proposal -- */
{ kind: 'shot', pill: 'The recommendation · mine, not shipped',
  title: 'A plan that watches itself',
  lead: 'It stands on trip planning, which already holds a trip as one record rather than a folder of bookings. Trip planning does what a traveller asks. This does the part nobody thought to ask for.',
  img: 'images/crew-10-weather.jpg',
  alt: 'A CREW product card. CREW writes first to say rain is forecast over the afternoon that was planned outdoors, and offers a rewritten plan for the day.',
  panels: [
    ['The plan is a record', 'Every leg and every day already has a time against it. A few of those parts move on their own: the gate, the departure, a connection that is no longer long enough, rain over an outdoor afternoon.'],
    ['The app watches them, unasked', 'All day, against the record. Nobody checks these today until it is too late to move anything.'],
    ['It finds the fix and writes the message', 'Structured data checked against a record the app already holds. The tone is already written, in the cards CREW publishes.'],
    ['A person signs it off, in seconds', 'The assistant moves from producing the work to approving it — and the traveller hears it from CREW first.', true]
  ],
  cap: 'CREW’s product pages show this moment as something an assistant does *when asked*. This is the same moment without the asking, on every trip rather than the few where it came up.',
  src: 'It asks for nothing CREW does not already have: the plan is a record inside trip planning, the gate and the delay are in the booking, and the forecast is free. Assembly, not invention.' },

/* --------------------------------------------------------------- journey -- */
{ kind: 'journey', pill: 'The journey it changes',
  title: 'One gate change, before and after',
  lead: 'The gate moves either way. What changes is who notices, how long it takes, and whether the traveller heard it from CREW or from a departures board.',
  tracks: [
    ['Today', [
      ['Trip booked', 0], ['Plan sits in a folder', 0], ['Gate moves', 1],
      ['Traveller finds out at the airport', 1], ['Assistant fixes it, an hour later', 1]
    ]],
    ['With the plan watching', [
      ['Trip booked', 0], ['Plan is a record', 0], ['App catches the change', 2],
      ['Assistant approves the message', 0], ['Traveller hears it from CREW first', 2]
    ]]
  ],
  src: 'The same five steps and the same people. The difference is that the third one happens without anybody being asked to look.' },

/* ---------------------------------------------------------------- build -- */
{ kind: 'rows', pill: 'How I would build it, in order', numbered: true, hot: 0,
  title: 'Three tiers, priced in minutes of a person',
  lead: 'The aim is to spend the rare people only where a person is genuinely needed. Every message a member gets sorts into one of three.',
  rows: [
    ['Send it', 'Not judgement calls. The plan-watching messages — structured data checked against a record the app holds — go out without anyone touching them. Most messages are this.'],
    ['Sign it off', 'Anything that changes a plan or spends money. The system finds the alternative and writes the message; an assistant reads it and approves. The person stops producing the work and starts signing it.'],
    ['Give it to someone who decides', 'Everything else. A masseuse at a villa in Goa is not an API, and nobody has automated being the person who is answerable once something has gone wrong.']
  ],
  src: 'Read as cost, the tiers are a ladder of minutes: nearly none, a few, and as many as it takes.' },

{ kind: 'figure', pill: 'The second lever',
  title: 'One message is not one job',
  lead: 'Requests arrive as a sentence and get worked as a single job. A couple wants a day at a vineyard outside the city — and inside that sentence are seven questions. Six of them have answers already. Today all seven wait for the same person.',
  svg: 'sevenq',
  src: 'And it compounds. When an assistant solves the one with no answer, it is written down against that place: what worked, and who to call when the obvious number does not. The booking was never the output — the output was a fact nobody had recorded.' },

/* ---------------------------------------------------------- measurement -- */
{ kind: 'table', pill: 'Measurement',
  title: 'Two numbers, and the test that would prove me wrong',
  lead: 'The first number can be bought with headcount, so it is worthless without the second beside it.',
  head: ['Measure', 'What it is', 'Reads'],
  rows: [
    ['The let-go rate', 'The share of trips where the customer never had to hold on: never checked a confirmation, never chased a reply, never queried a bill that was supposed to be settled.', 'North star', true],
    ['Cost to serve', 'The human minutes one trip consumes. Up and to the right on its own means nothing; falling while the let-go rate climbs is the whole thesis.', 'Guardrail'],
    ['Both together', 'Let-go rate up and minutes down is a service running at software margins. Let-go rate up and minutes flat is quality CREW cannot afford to keep.', 'The read'],
    ['Adoption, and the one to watch', 'Share of plan-watching messages sent without an edit. If assistants rewrite most of them, the app is not reading the plan properly and the tier is producing work rather than removing it.', 'Adoption'],
    ['What would prove me wrong', 'Compare members who lean on the service against those who only book and handle the rest themselves. If both come back at the same rate, the accompaniment was never the advantage, and the honest move is to unbundle it.', 'Falsifier']
  ] },

/* ----------------------------------------------------------------- close -- */
{ kind: 'cover', dark: true,
  kicker: 'The full piece',
  title: 'One Trip at a Time',
  href: 'https://ritikadas.in/writing/crew/',
  leadHtml: 'Get the ceiling right and the same people cover more trips: the service does not thin out as it grows, and someone who has never flown this route still lands knowing which train to take. The whole argument is at <a href="https://ritikadas.in/writing/crew/" target="_blank" rel="noopener">ritikadas.in/writing/crew</a>.',
  foot: 'Ritika Das · ritikadas.in' }

];

/* ------------------------------------------------------------- cover art -- */
const ART = {
  /* Twelve exchanges from CREW's product pages, and in half of them CREW opens
     the conversation rather than answering one. Every deck's cover counts the
     thing its argument turns on: for Savio it was the days it stays quiet, and
     here it is who spoke first. The count of twelve is the grid, not a claim —
     the claim is the half, and the legend says which is which. */
  firsts() {
    const first = new Set([0, 2, 4, 6, 8, 10]);
    const cells = Array.from({ length: 12 }, (_, i) =>
      `<span class="fb ${first.has(i) ? 'first' : ''}" style="--d:${240 + i * 46}ms"></span>`).join('');
    return `<div class="firsts r" style="animation-delay:180ms">
      <div class="fgrid" aria-hidden="true">${cells}</div>
      <div class="fkey">
        <span><i></i>the customer asks first</span>
        <span><i></i>CREW speaks first</span>
        <span>one mark is one published exchange</span>
      </div>
    </div>`;
  }
};

/* --------------------------------------------------------------- diagrams -- */
const FIGS = {
  /* One sentence, seven questions. Six are lookups the app can answer; the
     seventh is the one that needs somebody to pick up a phone — and once it is
     answered it becomes a fact in the file, so the next member gets it free. */
  /* The spine runs down the left margin and stubs into each box, so no connector
     crosses a box it is not pointing at. Solid to the six the app can answer,
     dashed to the one it cannot, and a solid line out of that one into the file —
     because the answer to the hard question is the thing worth keeping. */
  sevenq: `<svg viewBox="0 0 1000 420" role="img"
      aria-label="One request splits into seven questions. Six are answered by the app: is it open, what time, what to wear, is there lunch, how do they get there, who books the car. The seventh, getting onto a tasting that is always full, goes to a person, and that answer is written into the file against the place, so the next member gets it without asking.">
    <rect class="fbrand" x="86" y="20" width="330" height="76" rx="16"/>
    <text class="fout" x="251" y="55" text-anchor="middle">“A day at a vineyard</text>
    <text class="fout" x="251" y="79" text-anchor="middle">outside the city”</text>
    <text class="flab" x="86" y="128">SEVEN QUESTIONS INSIDE ONE SENTENCE</text>

    <path class="fline" d="M104 96v104q0 14 14 14h20"/>
    <path class="fdash" d="M104 214v122q0 14 14 14h20"/>

    <rect class="fbox" x="146" y="152" width="404" height="124" rx="14"/>
    <text class="flab" x="172" y="184">THE APP ANSWERS</text>
    <text class="fcap" x="172" y="218">Is it open · What time · What to wear</text>
    <text class="fcap" x="172" y="248">Is there lunch · How they get there</text>
    <text class="fnum" x="524" y="186" text-anchor="end">6</text>

    <rect class="fbox" x="146" y="308" width="404" height="88" rx="14"/>
    <text class="flab" x="172" y="340">A PERSON ANSWERS</text>
    <text class="fcap" x="172" y="374">The tasting that is always full</text>
    <text class="fnum" x="524" y="342" text-anchor="end">1</text>

    <path class="fline" d="M550 352h58q14 0 14-14v-52q0-14 14-14h32"/>
    <circle class="facc" cx="672" cy="272" r="7"/>
    <rect class="fbrand" x="686" y="236" width="284" height="76" rx="16"/>
    <text class="fout" x="828" y="270" text-anchor="middle">Written into the file</text>
    <text class="fout" x="828" y="294" text-anchor="middle">against that place</text>
    <text class="fwarn" x="828" y="342" text-anchor="middle">A PERSON ANSWERS IT ONCE</text>
    <text class="fcap" x="828" y="376" text-anchor="middle">Everyone after gets it free.</text>
  </svg>`
};
