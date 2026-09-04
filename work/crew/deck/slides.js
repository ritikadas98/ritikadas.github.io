/* CREW — case study deck.
 *
 * The shell is shared: ../../_deck/deck.css and ../../_deck/engine.js. This file
 * is the content, the cover art and one diagram.
 *
 * An opinion piece about a product I do not work on. Where a number is not
 * known, the slide says so rather than inventing one.
 *
 * *text* paints that phrase in the accent colour.
 */

const SLIDES = [

/* ---------------------------------------------------------------- cover -- */
{ kind: 'cover', art: 'firsts',
  kicker: 'Product case study · September 2026',
  title: 'One trip at a time.',
  lead: 'CREW is Swiggy’s travel concierge, and it speaks before you ask. Any travel app can sell you the flight. Almost none will tell you about a terminal you have not reached yet. That message is the product. Plenty of apps message about a flight. Almost nobody messages about the trip.',
  foot: 'Ritika Das · ritikadas.in · 2026' },

/* -------------------------------------------------------------- product -- */
{ kind: 'shot', pill: 'The product',
  title: 'The message nobody asked for',
  lead: 'Fifty-five minutes to catch a connecting flight, in an airport you have never been to, from a different terminal. You did not have to find that out.',
  img: 'images/crew-07-airport.jpg',
  alt: 'A CREW product card. CREW writes first: you land in T1 but your next flight is from T2 in 55 minutes, take the inter-terminal train, eight minutes, to Gate D. The traveller replies asking where to get coffee, and CREW answers.',
  panels: [
    ['Every travel app can sell the flight', 'Inventory and price are the two things this category competes on. You can see both before you buy. Once you have bought, they need nobody to pay attention.'],
    ['Almost none will mention the terminal', 'It arrives *before* landing, unprompted, with the train and how long it runs. Nothing about it is a booking.'],
    ['The absence is not an oversight', 'Plenty of apps send alerts. An airline will tell you *its own* gate moved. What none of them sends is the next sentence: your connection is on another carrier, from another terminal, and here is the train. They message about a flight. Nobody messages about the trip.', true]
  ],
  cap: 'One of the exchanges CREW publishes. CREW writes first, and nothing in it is a booking.' },

/* --------------------------------------------------------------- method -- */
{ kind: 'rows', pill: 'Goal, scope and assumptions', numbered: true,
  title: 'What I chose to improve, before choosing what to build',
  lead: '“Improve CREW” becomes a brief once it says for whom, and towards what. This is the brief I set myself.',
  rows: [
    ['The goal', 'Raise contribution margin per trip *without thinning the service*. Contribution margin is a trip’s revenue minus the cost of serving it. The same people should cover more trips, and each traveller should keep the same attention.'],
    ['For whom', 'The member who buys attention, not inventory: a first long-haul, a holiday a year in the planning, a honeymoon. The frequent flyer is out of scope.'],
    ['What comes in', 'The *₹999* the app asks for up front, which buys six months, and a share of the booking on top of it. The next slide sets out what is confirmed and what I am inferring.'],
    ['What I cannot price', 'The size of that share, and the internal numbers: headcount, retention, minutes per trip.']
  ] },

/* ------------------------------------------------------------- customer -- */
{ kind: 'personas', pill: 'The customer', wide: true,
  title: 'Who this is worth paying for, and who it is not',
  lead: 'CREW says who it is for: affluent urban consumers who have money but no time. The second half is the real definition, and it is not about wealth. In the exchanges CREW publishes, nobody asks the price.',
  people: [
    { win: true,
      role: 'Worth most to · the first long-haul',
      name: 'Ananya Iyer',
      photo: 'images/persona-ananya.jpg',
      photoAlt: 'Illustrated portrait of Ananya Iyer, a woman in her mid-thirties.',
      blurb: 'Thirty-four, Bengaluru. This is the holiday she has planned for a year, and her first outside Asia. She knows Bengaluru street by street. She lands in Lisbon knowing nothing. Expertise does not travel with her, and one wrong call on this trip is not recoverable. What she buys is *one fewer decision*.',
      bits: ['One trip a year', 'New ground, high stakes', 'Never asks the price'] },
    { role: 'Worth least to · the thirtieth flight',
      name: 'Vikram Shah',
      photo: 'images/persona-vikram.jpg',
      photoAlt: 'Illustrated portrait of Vikram Shah, a man in his early forties.',
      blurb: 'Forty-one, Mumbai. The same airport again, and he knows where the lounge is. He has his own visa routine, his own hotel and his own seat. To him CREW is a nicer booking engine. *A nicer booking engine is the product whose price you check.*',
      bits: ['Flies monthly', 'Own routine, end to end', 'Will check the price'] }
  ],
  src: 'Both of them fly. Only one is buying what CREW sells, and it is not the booking. Both are composites, and the portraits are illustrations.' },

/* -------------------------------------------------------- persona, jtbd -- */
{ kind: 'personajobs', pill: 'Persona and jobs to be done',
  title: 'One traveller, and three jobs a booking engine cannot take',
  role: 'Primary member · paying to stop deciding',
  name: 'Ananya Iyer',
  photo: 'images/persona-ananya.jpg',
  photoAlt: 'Illustrated portrait of Ananya Iyer, a woman in her mid-thirties.',
  blurb: 'She would rather pay for the experience than price it across five tabs. Money is only half of that. The other half is a decision she has already made: choosing is the expensive part.',
  quotes: [
    'When I land somewhere I have never been, <b>I want to be told what happens next</b>, before I have worked out that I needed to ask.',
    'When something moves — a gate, a time, the weather over the afternoon I planned — <b>I want to hear it from you first</b>, not from the airport screen.',
    'When it is the one holiday I get this year, <b>I want somebody answerable</b>, so that being wrong is not my problem to solve at six in the morning.'
  ],
  src: 'A composite, not a person I met.' },

/* ----------------------------------------------------------------- moat -- */
{ kind: 'quad', pill: 'Competitive landscape',
  title: 'The data is not the moat',
  lead: 'To send that airport message you need the trip and you need somebody who will stay with a customer through a day. Everybody has one of the two.',
  y: 'People who stay with a customer  →',
  x: 'Holds the live trip  →',
  cells: [
    { k: 'The people, without the data', names: ['A travel agent'] },
    { k: 'Both, and a reason to spend the hour', names: ['CREW'], win: true },
    { k: 'The trip and the channel, nobody answerable', names: ['A general-purpose assistant'] },
    { k: 'The data, and no way to afford the people', names: ['Booking platforms', 'Airline apps'] }
  ],
  src: 'A third condition sits underneath both axes: a relationship that makes an hour on one traveller worth spending. A platform built on volume breaks when it adds a service team.' },

/* ------------------------------------------------------------ economics -- */
{ kind: 'rows', pill: 'Unit economics', hot: 2,
  title: 'Standalone concierges died of the first two problems',
  lead: 'A standalone concierge carries three costs at once. CREW inherits an answer to two of them, and not because it is cleverer. Structure gave it that.',
  rows: [
    ['Winning the customer', 'Customer acquisition cost is what it takes to win one member. Here that means finding people who travel expensively and will hand a holiday over, one at a time. The purchase is rare, so payback runs long. *Swiggy paid for this years ago*, over food and groceries, and reads its own order history to see who spends.'],
    ['Keeping them', 'Somebody travels a few times a year. A relationship that goes quiet for five months has to be rebuilt. *It stays warm here.* Instamart and Dineout keep it warm between trips.'],
    ['Serving them', 'Cost to serve is the human minutes one trip consumes. Sitting inside Swiggy does not change this one. It grows with the number of trips, not with the size of the company. *This is the whole rest of the deck.*']
  ],
  src: 'It ended the same way every time: Ten Lifestyle inside private banks, Velocity Black inside Capital One, and American Express never sold its concierge separately at all. None lasted as a subscription bought on its own.' },

/* -------------------------------------------------------------- revenue -- */
{ kind: 'table', pill: 'What comes in',
  title: 'One line confirmed, one inferred, one cost that decides it',
  lead: 'Contribution margin is a trip’s revenue minus the cost of serving it. Acquisition and retention were paid elsewhere. That leaves the human minutes as nearly all of the cost, so the margin turns on one number.',
  head: ['Line', 'What it is', 'Status'],
  rows: [
    ['Subscription', 'The *₹999* the app asks for up front, which buys six months.', 'Confirmed'],
    ['A share of the booking', 'Skift reports the subscription is not the only revenue, and CREW advertises no convenience fee on flights while passing hotel savings to members. So we can assume the earning happens upstream, taken from the supplier rather than the traveller.', 'Inferred'],
    ['Cost to serve', 'The human minutes one trip consumes. The one cost CREW still has to solve for itself, and the one every proposal below attacks.', 'The constraint', true]
  ] },

/* --------------------------------------------------------- distribution -- */
{ kind: 'figure', pill: 'Distribution', wide: true,
  title: 'Where a CREW member comes from',
  lead: 'Order food on Swiggy and, while the timer runs, a card appears offering six months of CREW and ₹1,000 off a first hotel. Tap it and you leave for a different app, a different brand and a membership to activate. Swiggy will sell you CREW. CREW does not live there.',
  svg: 'distribution',
  src: 'Instamart and Dineout became tiles inside the Swiggy app. CREW became a door out of it. A tile is a feature of something else; a separate app with its own brand and an activation code is a membership, and joining one is a decision you cannot ask somebody to make inside a food order. Band widths show containment, not size.' },

/* ----------------------------------------------------------- constraint -- */
{ kind: 'statement', pill: 'The constraint',
  title: 'The moat is the *ceiling*.',
  lead: 'Swiggy scaled on physical dispatch, where a rider is interchangeable. A concierge is not. The job needs visa rules and what a connecting flight really takes. It also needs the harder half: staying calm, reading a mood, knowing when to stay quiet. A wrong burger costs a refund and an apology. A missed visa clause costs somebody their one holiday of the year.',
  /* The same service, reviewed twice. Both are real, both are public, and the
     distance between them is the whole slide: it is not a feature gap, it is
     whether the rare person was on that trip. */
  shots: [
    ['images/review-win.jpg',
     'A five-star CREW review headed “They come through”, describing a gift bought and delivered in another city and a fifteen-seater found at a moment’s notice.',
     '*Five stars.* One of the rare people was on this trip.'],
    ['images/review-bad.jpg',
     'A one-star CREW review headed “No credibility, incomplete tasks”, listing a missed VIP service, seats not held together, and an order never actually placed.',
     '*One star.* Same service, same month.']
  ],
  src: 'And CREW is not being built for a few hundred members. Skift, which interviewed the chief executive of Swiggy’s food business, reports a target of fifteen to twenty million consumers. A service whose best work is one person’s attention, aimed at a number of people no amount of hiring reaches. That leaves an awkward proof: you find out whether you can hand over a trip by handing one over.' },

/* --------------------------------------------------------------- levers -- */
/* What CREW has already done about this constraint, taken at face value.
 * Both levers are real and both work. Neither one gets cheaper with scale,
 * which is what makes the third lever worth building. The price cut sits here
 * too, marked as what it is: not a lever on this constraint at all. */
{ kind: 'rows', pill: 'What already holds this down',
  title: 'Two levers, both already pulled',
  lead: 'Both work. Neither of them gets cheaper as CREW grows.',
  rows: [
    ['It narrowed', 'CREW used to book restaurant tables, renew Aadhaar cards, source gifts, arrange birthday parties, find locksmiths and send out the laundry. It does none of that now. Travel was *forty to fifty per cent* of everything people asked for, and travel is all CREW does today. *There is nothing left to narrow.*'],
    ['It partnered', 'CREW now lets a member tap into local destination experts: a guide in Hoi An who has been doing it for eighteen years, a Madrid native who guides in London. These are local partners rather than staff, which is the cheaper way to do it, because nobody is paid between trips. The right call, and not a workaround — no software knows what somebody who lives there knows. But *capacity still arrives one person at a time.*'],
    ['It also cut prices, which is not a lever on this', 'Rooms ten to fifteen per cent under other platforms, paid for by supply deals. Worth having. But every booking platform negotiates rates, and *a discount does not buy back a single concierge minute.*']
  ],
  src: 'All three come from CREW’s own announcements and the coverage of them, including Skift and MediaNama. The first two are answers to the constraint before this slide. The third is an answer to a different question.' },

/* -------------------------------------------------------------- options -- */
{ kind: 'table', pill: 'Options considered',
  title: 'Four ways to move the same number',
  lead: 'Cost to serve is minutes of a scarce person. There are only four things you can do about that, and three of them cost more than they save.',
  head: ['Option', 'What it does to the minutes', 'Verdict'],
  rows: [
    ['Hire more concierges', 'This buys capacity at the same rate it buys cost, and budget was never the constraint. The job needs visa rules and the harder half: staying calm, knowing when to stay quiet. The supply of such people runs out before the money does.', 'Breaks on supply'],
    ['Raise the booking gate', 'This protects the margin on every trip served, by serving fewer trips. It defends the number by shrinking the business. The minutes themselves stay exactly where they were.', 'Wrong direction'],
    ['Take the person out', 'Make everything self-serve and the minutes fall to almost zero. So does the product. CREW sells somebody being answerable, and an app cannot be answerable at six in the morning.', 'Kills the product'],
    ['Automate the routine, keep people for judgement', 'Most messages relay a fact the airline has already published. Give those to the app. The same person then covers more trips, and every traveller keeps the same attention.', 'Chosen', true]
  ],
  src: 'One thing I would refuse to build: the phone call. A masseuse at a villa in Goa is not an API, and nobody has automated being the person who is answerable once something has gone wrong. The three tiers stop deliberately short of it.' },

/* ------------------------------------------------------------- proposal -- */
{ kind: 'shot', pill: 'The recommendation · mine, not shipped',
  title: 'The app checks the plan, all day',
  lead: 'CREW already sends these messages. On-trip assist stays with a traveller for the whole trip, and somebody there saw the terminal change and wrote before landing. What it is not is systematic: the unprompted message arrives when a concierge is attending to that trip.',
  img: 'images/crew-10-weather.jpg',
  alt: 'A CREW product card. CREW writes first to say rain is forecast over the afternoon that was planned outdoors, and offers a rewritten plan for the day.',
  panels: [
    ['The plan is a record', 'Every leg and every day already has a time against it. A few of those parts move on their own: the gate, the departure, a connecting flight that is no longer long enough, rain over an outdoor afternoon.'],
    ['The app watches them, unasked', 'All day, against the record, on every trip rather than the ones somebody is looking at.'],
    ['It finds the fix and writes the message', 'The tone is already written, in the cards CREW publishes. MediaNama asks whether the software can fix an itinerary without a person; that is the gap this closes.'],
    ['A person signs it off, in seconds', 'The concierge moves from producing the work to approving it. The traveller hears it from CREW first.', true]
  ],
  cap: 'CREW shows this moment as something a concierge does *when asked*. This is the same moment without the asking, on every trip rather than the few where it came up.',
  src: 'The record plainly exists — you cannot tell somebody their terminal changed without holding their terminal. Whether anything reads it when nobody has asked is the part I cannot see. If something already does, the rest is assembly: the gate and the delay are in the booking, and the forecast is free.' },

/* --------------------------------------------------------------- journey -- */
{ kind: 'figure', pill: 'The journey it changes', wide: true,
  title: 'One gate change, before and after',
  lead: 'The gate moves either way. The same people do the same work. What changes is the length of the window in which the traveller does not know, and who closes it — CREW, or a departures board.',
  svg: 'gatechange',
  src: 'The axis is ordered, not to scale. The claim is the order of events and the direction of the change, both of which follow from where the checking happens.' },

/* ---------------------------------------------------------------- build -- */
{ kind: 'rows', pill: 'How I would build it, in order', numbered: true, hot: 0,
  title: 'Three tiers, priced in minutes of a person',
  lead: 'The aim is to use those rare people only where judgement is needed. Every message sorts into one of three tiers, and each tier answers one of the three jobs on slide five.',
  rows: [
    ['Send it', 'Answers *told what happens next*. Facts the source itself asserts: the airline says the gate has moved, the airline says the flight is late. Relaying those is not a decision. They go out untouched, and most messages are this.'],
    ['Sign it off', 'Answers *heard it from you first*. The ones the app works out for itself: a connecting flight now too tight, an afternoon that needs rewriting. Those are inferences, and inference is where a system is wrong. The app drafts; a concierge approves.'],
    ['Give it to someone who decides', 'Answers *somebody answerable*. Everything else. A masseuse at a villa in Goa is not an API, and nobody has automated being the person who is answerable once something has gone wrong.']
  ],
  src: 'Read as cost, the tiers are a ladder of minutes: nearly none, a few, and as many as it takes. The line between the first two is the false-alarm guard — a wrong alert about a flight that was never at risk spends the trust the service runs on.' },

{ kind: 'figure', pill: 'The compounding change',
  title: 'One message is not one job',
  lead: 'A request arrives as one sentence and gets worked as one job. A couple wants a day at a vineyard outside the city. Inside that sentence sit seven questions. Six already have answers. Today all seven wait for the same person.',
  svg: 'sevenq',
  src: 'It also compounds. When a concierge solves the one question with no answer, that answer is written down against the place: what worked, and who to call when the obvious number fails. The booking was never the output. The output was a fact nobody had recorded.' },

/* ---------------------------------------------------------- measurement -- */
{ kind: 'table', pill: 'Measurement',
  title: 'Four numbers, and the test that would prove me wrong',
  lead: 'Headcount alone can buy the first number, so it only means something with the second beside it.',
  head: ['Measure', 'What it is', 'Reads'],
  rows: [
    ['The let-go rate', 'The share of trips where the customer could let go: no confirmation checked, no reply chased, no query about a bill that was supposed to be settled.', 'North star', true],
    ['Cost to serve', 'The human minutes one trip consumes. Read the two together: minutes falling while the let-go rate climbs is a service running at software margins. Let-go rate up and minutes flat is quality CREW cannot afford to keep.', 'Guardrail'],
    ['Reuse of the file', 'The share of requests answered from a fact already recorded, rather than worked out from scratch. This is the compounding one, made countable. If the file is never reused, the seventh question was not worth writing down.', 'Compounding'],
    ['Wrong-message rate', 'The share of auto-sent messages a traveller or a concierge later contradicts. This is the guardrail on the first tier. A service that cries wolf has spent the trust it was meant to protect.', 'Guardrail two'],
    ['What would prove me wrong', 'Compare members who lean on the service against those who only book and handle the rest themselves. If both come back at the same rate, the accompaniment was never the advantage, and the honest move is to unbundle it.', 'Falsifier']
  ] },

/* ----------------------------------------------------------------- close -- */
{ kind: 'cover', dark: true,
  kicker: 'The full piece',
  title: 'One Trip at a Time',
  href: 'https://ritikadas.in/writing/crew/',
  leadHtml: 'Get the ceiling right and the same people cover more trips. The service holds its quality as it grows. Someone flying this route for the first time still lands knowing which train to take. The whole argument is at <a href="https://ritikadas.in/writing/crew/" target="_blank" rel="noopener">ritikadas.in/writing/crew</a>.',
  foot: 'Ritika Das · ritikadas.in' }

];

/* ------------------------------------------------------------- cover art -- */
const ART = {
  /* A field of message bubbles, most of them CREW's.
   *
   * This used to draw twelve marks with a legend reading "one mark is one
   * published exchange", six of them filled, which told a viewer that CREW had
   * published exactly twelve exchanges and opened exactly half. Neither number
   * was sourced anywhere, and the filled ones alternated every other position,
   * which is not what counted data looks like. On a deck that prints "Not
   * visible" rather than estimate, the cover was the one slide doing the
   * opposite.
   *
   * So the count is gone. The bubbles are decoration, the line underneath makes
   * the only claim worth making, and it is a claim anyone can check by reading
   * CREW publishes. */
  firsts() {
    const crew = new Set([0, 1, 3, 4, 5, 7, 8, 10, 11]);
    const cells = Array.from({ length: 12 }, (_, i) =>
      `<span class="fb ${crew.has(i) ? 'first' : ''}" style="--d:${240 + i * 46}ms"></span>`).join('');
    /* CREW's own first screen, on the right half of the cover. The cover used to
       be text on the left and nothing at all on the right. This is the thing the
       deck is about, shown before it is described — and the app's own dark
       brown is where this deck's palette came from, so it sits on the field
       rather than on top of it. */
    return `<div class="heroshot r" style="animation-delay:120ms">
      <div class="hsframe">
        <img src="images/hero.jpg" width="760" height="1119" alt="CREW's opening screen: an aircraft window with the CREW mark on the blind, and the line “Welcome to Crew, your travel concierge” above a Begin the Journey button.">
      </div>
    </div>
    <div class="firsts r" style="animation-delay:180ms">
      <div class="fgrid" aria-hidden="true">${cells}</div>
      <div class="fkey">
        <span><i></i>In most of the exchanges CREW publishes, CREW writes first.</span>
      </div>
    </div>`;
  }
};

/* --------------------------------------------------------------- diagrams -- */
const FIGS = {
  /* Where a CREW member comes from.
   *
   * The piece draws this as four nested frames. Opened out into a taper it says
   * the same thing and says it faster: each stage is wholly contained by the one
   * before it, and nothing was bought at any step.
   *
   * It is deliberately NOT the Reddit funnel. That one carries a hard figure at
   * every stage — 130.3M, 77.7M, 52.6M — because Reddit reports them. CREW
   * reports none of these, and this deck estimates nothing, so the bands carry
   * stage NAMES and the gaps carry the thing that narrows them. The taper is a
   * claim about containment, which is public, not about size, which is not.
   *
   * Band heights are chosen to read as a narrowing and are not to scale. The
   * source line says so.
   */
  /* One gate change, both tracks on one axis.
   *
   * The old version of this slide drew two rows of five equal boxes and coloured
   * them. Equal boxes say the steps are the same, which they are — the argument
   * was never that a step drops out. The argument is WHEN the traveller learns,
   * and equal boxes cannot show a when. The colour carried it instead, with no
   * legend, so the reader had to decode peach against red to find the point.
   *
   * Here the two tracks share one axis and the point is a distance. The shaded
   * band is the window where the gate has moved and the traveller does not know.
   * Today that window runs to the airport. With the plan it closes almost at
   * once. Same band, same meaning, drawn at the two lengths.
   *
   * The axis is ordered, not to scale. Nobody publishes these durations and this
   * deck does not estimate them, so the axis carries no units. The source line
   * says so.
   */
  gatechange: (() => {
    const W = 1500, H = 590, X0 = 250, X1 = 1440, SPAN = X1 - X0;
    const x = f => X0 + SPAN * f;
    const BH = 48;                                   // band height
    const rows = [
      { name: ['Today'], y: 138,
        /* the traveller finds out for themselves, at the airport */
        band: 0.62, inside: 'nobody is looking',
        dots: [0, 0.62, 0.86],
        /* The 0.62 pair is set to END, tucked left of its guide: centred on the
           guide, the dashed line ran straight through the words. */
        below: [[0.62, 'Traveller finds out at the airport', 'from a departures board', 'end'],
                [0.86, 'A concierge fixes it, an hour later', null, 'middle']] },
      { name: ['With the plan', 'watching'], y: 330,
        band: 0.19, inside: null,
        dots: [0, 0.06, 0.13, 0.19],
        after: 'App catches it · a concierge approves',
        afterHi: 'the traveller hears it from CREW' }
    ];
    let out = '';

    /* Both windows are hatched, in the same hatch, because they mean the same
       thing. Only the length differs, and the length is the argument. */
    out += `<defs><pattern id="ghatch" width="9" height="9" patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"><rect width="9" height="9" class="ghbg"/>
      <line x1="0" y1="0" x2="0" y2="9" class="ghln"/></pattern></defs>`;

    rows.forEach(r => {
      const cy = r.y + BH / 2;
      out += `<rect class="gband" x="${x(0)}" y="${r.y}" width="${x(r.band) - x(0)}" height="${BH}" rx="9"/>`;
      if (r.inside) out += `<text class="gin" x="${(x(0) + x(r.band)) / 2}" y="${cy + 5}">${r.inside}</text>`;
      r.name.forEach((line, k) =>
        out += `<text class="gname" x="0" y="${cy - 4 + k * 20}">${line}</text>`);
      r.dots.forEach(f => out += `<circle class="gdot" cx="${x(f)}" cy="${cy}" r="7"/>`);
      out += `<text class="gtop" x="${x(0)}" y="${r.y - 16}">Gate moves</text>`;
      (r.below || []).forEach(([f, label, sub, anchor]) => {
        const tx = anchor === 'end' ? x(f) - 14 : x(f);
        const a = ` text-anchor="${anchor || 'middle'}"`;
        out += `<text class="gbelow" x="${tx}" y="${r.y + BH + 30}"${a}>${label}</text>`;
        if (sub) out += `<text class="gsub" x="${tx}" y="${r.y + BH + 54}"${a}>${sub}</text>`;
      });
      if (r.after) {
        out += `<text class="gafter" x="${x(r.band) + 22}" y="${cy + 5}">${r.after} · </text>`;
        out += `<text class="gafterhi" x="${x(r.band) + 22}" y="${cy + 34}">${r.afterHi}</text>`;
      }
    });

    /* The measure. Two dashed guides dropped from where each window closes, and
       a span between them — this is the thing the slide is actually claiming,
       and until it was drawn the reader had to eyeball two grey bars. */
    [0.19, 0.62].forEach(f =>
      out += `<path class="gguide" d="M${x(f)} 124V462"/>`);
    out += `<path class="gspan" d="M${x(0.19)} 470H${x(0.62)}"/>`;
    out += `<path class="gspan" d="M${x(0.19) + 11} 463l-11 7 11 7"/>`;
    out += `<path class="gspan" d="M${x(0.62) - 11} 463l11 7-11 7"/>`;
    out += `<text class="gspanlab" x="${(x(0.19) + x(0.62)) / 2}" y="456">the window this closes</text>`;

    /* the axis */
    out += `<path class="gaxis" d="M${X0} 522H${X1 - 10}"/>`;
    out += `<path class="gaxis" d="M${X1 - 20} 515l10 7-10 7"/>`;
    out += `<text class="gaxlab" x="${X0}" y="552">TIME AFTER THE GATE MOVES</text>`;
    out += `<rect class="gband" x="${X1 - 320}" y="540" width="26" height="13" rx="4"/>`;
    out += `<text class="gkey" x="${X1 - 286}" y="551">the traveller does not know yet</text>`;

    return `<svg viewBox="0 0 ${W} ${H}" role="img"
      aria-label="One gate change on two tracks sharing a time axis. Today, the gate moves and a long shaded window follows in which nobody is looking; the traveller finds out at the airport, and a concierge fixes it an hour later. With the plan watching, the same window closes almost immediately: the app catches the change, a concierge approves the message, and the traveller hears it from CREW. The axis is ordered, not to scale.">${out}</svg>`;
  })(),

  distribution: (() => {
    /* MARGIN keeps the first and last stage NAMES on the canvas. The columns are
       narrow and the names are wide, so a column at x=0 puts half of "Everyone
       who orders dinner" off the left edge — which is exactly what the first cut
       of this diagram did. The bands live inside the margin; the type may use
       it. */
    const W = 1500, H = 620, TOP = 190, BOT = 190, MARGIN = 180;
    const stages = [
      { n: ['Everyone who', 'orders dinner'],   h: 1.00, note: 'Swiggy’s food and grocery base' },
      { n: ['The ones it can', 'already see spend'], h: 0.60, note: 'Order history, basket size, Dineout' },
      { n: ['The ones shown', 'the offer'],     h: 0.30, note: 'A card on the order screen' },
      { n: ['CREW'],                            h: 0.13, note: 'Not a tile in the Swiggy app' }
    ];
    /* What does the narrowing at each step. These are the gates, and all three
       are public: Swiggy's own order data, the card and the invitation, and the
       size of booking the service is sold with. */
    const gates = ['what Swiggy already sees', 'who gets shown the offer', 'taking it up'];
    const inner = W - MARGIN * 2;
    const colW = 90, gapW = (inner - stages.length * colW) / (stages.length - 1);
    const X = i => MARGIN + i * (colW + gapW);
    const band = H - TOP - BOT;
    const y = f => TOP + band * (1 - f) / 2;
    let out = '';

    /* the tapering bands, drawn first so the columns sit over them */
    for (let i = 0; i < stages.length - 1; i++) {
      const x1 = X(i) + colW, x2 = X(i + 1);
      const a = stages[i], b = stages[i + 1], cx = (x1 + x2) / 2;
      out += `<path class="fband" d="
        M${x1} ${y(a.h)} C${cx} ${y(a.h)} ${cx} ${y(b.h)} ${x2} ${y(b.h)}
        L${x2} ${y(b.h) + band * b.h} C${cx} ${y(b.h) + band * b.h} ${cx} ${y(a.h) + band * a.h} ${x1} ${y(a.h) + band * a.h} Z"/>`;
      out += `<text class="fgate" x="${cx}" y="${TOP + band / 2 + 5}">${gates[i]}</text>`;
    }
    /* the columns, with the stage name above and its provenance below */
    stages.forEach((s, i) => {
      const x = X(i), cx = x + colW / 2;
      out += `<rect class="fcol" x="${x}" y="${y(s.h)}" width="${colW}" height="${band * s.h}" rx="4"/>`;
      /* a one-line name sits on the lower of the two lines, so every stage's
         name ends at the same baseline just above the bands */
      const off = s.n.length === 1 ? 1 : 0;
      s.n.forEach((line, k) =>
        out += `<text class="fnm" x="${cx}" y="${TOP - 66 + (k + off) * 34}">${line}</text>`);
      out += `<text class="fnote" x="${cx}" y="${H - BOT + 50}">${s.note}</text>`;
    });
    /* the one claim the diagram is making */
    out += `<text class="fspine" x="${W / 2}" y="${H - 16}">nobody was bought at any step</text>`;

    return `<svg viewBox="0 0 ${W} ${H}" role="img"
      aria-label="A funnel showing where a CREW member comes from. Everyone who orders dinner narrows, by what Swiggy already sees, to the ones it can already see spend; then, by whatever decides who is shown the offer, to the ones who see it; then, by taking it up, to CREW. Nobody was bought at any step.">${out}</svg>`;
  })(),

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
    <!-- Set from x=146, the left edge of the two boxes below it, so the label
         lines up with what it labels. At x=86 it started under the quote box
         and the spine, which runs down at x=104, passed straight through the
         word SEVEN. -->
    <text class="flab" x="146" y="134">SEVEN QUESTIONS INSIDE ONE SENTENCE</text>

    <!-- h28, not h20: the boxes start at x=146 and a connector that stops at
         138 leaves a visible gap between the line and the thing it points at. -->
    <path class="fline" d="M104 96v104q0 14 14 14h28"/>
    <path class="fdash" d="M104 214v122q0 14 14 14h28"/>

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
