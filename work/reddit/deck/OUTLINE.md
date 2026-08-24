# reddit — deck outline

14 slides. Generated from `work/reddit/deck/slides.js` on 2026-08-24.

## How to use this file

- **Edit the text in place.** Rewrite a line, delete it, or replace it wholesale.
- **To cut a whole slide,** write `CUT` on its NOTES line.
- **To add a slide,** write a new `## Slide` block anywhere and describe what it should hold.
- **To say something that is not a text change** — reorder, resize, change a colour,
  swap a layout — write it on that slide's NOTES line.
- **`*text*` paints that phrase in the accent orange.** It renders as *italic* here.
  Keep the asterisks where you want the colour, add them where you want more.
- **SOURCE** is the small grey line along the bottom of a slide.
- Do not renumber the slides. I match them by number.

---

## Slide 01 — Product case study · August 2026

*Layout `cover`: full-bleed gradient (or dark, if `dark: true`), with the cover art.*

**KICKER:** Product case study · August 2026

**TITLE:** Reddit is read without being visited.

**LEAD:** Reddit’s acquisition funnel opens on a Google results page it does not own. Something in the middle now answers the question using Reddit’s content, so the top of that funnel is closing while the reading carries on. Reddit sells the visit, not the answer.

**COVER ART:** `cover`

**FOOT:** Ritika Das · ritikadas.in · 2026

**NOTES:**

---

## Slide 02 — Context · Q2 2026

*Layout `cards`: 2 cards across.*

**PILL:** Context · Q2 2026

**TITLE:** Reddit’s revenue is at a record. Its distribution is not.

**LEAD:** Both facts come from the same quarter, and the market priced the second one.

**CARDS:**

1. **What it is** — More than 100,000 communities built on anonymous, community-level posts. The stated mission is community, belonging and empowerment.
2. **How it earns** — Q2 2026 revenue *$805M*, up *61%*, an eighth straight quarter above 60%. Advertising is *$762M* of that, or 95%. Data licensing is *$39M*.
3. **The tension** — Advertising is priced against logged-in, returning users. The dominant entry is a one-off search landing. *Reddit earns nothing from a satisfied lurker and less than nothing from a satisfied non-visitor.*
4. **The leverage** — The Google licence, about *$60M a year*, expires in *H1 2027*. Reddit is reported to be weighing whether to renew at all, and to want usage-based fees. The OpenAI renewal is also unresolved.

**SOURCE:** Reddit Q2 2026 shareholder letter and earnings call, 30 Jul 2026. Shares fell 11–12% on the quarter despite beating revenue, DAU and guidance. Licensing renewal reporting: The Wall Street Journal, Aug 2026.

**NOTES:**

---

## Slide 03 — The problem

*Layout `compare`: two panels side by side — left reads grey, right reads brand.*

**PILL:** The problem

**TITLE:** Reddit earns from one cohort and is increasingly made of the other

**LEAD:** Both numbers are Reddit’s own, reported for the same quarter.

**LEFT PANEL** — label `Logged out`, headline number `77.7M`

DAU, up *27%*. This cohort lands from search, reads one thread and churns. No account means no repeat-visit signal, no retention curve, and no lifetime value to price an ad against.

**RIGHT PANEL** — label `Logged in`, headline number `52.6M`

DAU, up *7%*. This cohort returns, retains and can be sold to. It is the base every advertising dollar is priced against, and it is growing four times slower than the one that cannot be billed.

**SOURCE:** Reddit Q2 2026, of 130.3M DAU in total, up 18%. Q2 2026 is the last quarter Reddit reports this split. From Q3 it stops publishing logged-in and logged-out figures.

**NOTES:**

---

## Slide 04 — The wedge

*Layout `bars`: horizontal bars, values shown at the right.*

**PILL:** The wedge

**TITLE:** Two of every three Google searches now end without a click

**LEAD:** *68.01%* of US Google searches ended without a click in the first four months of 2026, up from *60.45%* in 2024. That is the steepest two-year move since the measurement began. Only *276* of every 1,000 searches now reach the open web at all.

**BARS:**

- 2016 — 45
- 2024 — 60.45
- Jan–Apr 2026 — 68.01
- *scale maximum:* 100

**SOURCE:** SparkToro with Similarweb clickstream data, Jun 2026. AI Overviews now appear on over 20% of searches. Not Reddit-specific: over the year to Jun 2026 USA Today lost nearly half its organic Google traffic and Politico lost 23% (Semrush).

**NOTES:**

---

## Slide 05 — What replaced the visit

*Layout `statement`: one dark slide, one sentence, no furniture.*

**PILL:** What replaced the visit

**TITLE:** ChatGPT read *16.18 million* Reddit pages and credited *1.93%* of them.

**LEAD:** Reddit is the largest uncredited source in AI retrieval: *67.8%* of every URL ChatGPT pulls and does not cite belongs to Reddit. The model reads the thread, answers the user, and returns no session. Consumption without a session is consumption Reddit cannot measure, retain or monetise.

**SOURCE:** Ahrefs, a study of 1.4M ChatGPT prompts, published 15 Apr 2026.

**NOTES:**

---

## Slide 06 — Jobs to be done

*Layout `personajobs`: persona card on the left, job statements on the right.*

**PILL:** Jobs to be done

**TITLE:** The job a summary cannot finish

**LEAD:** If a summary already answers the question, the old job is finished before Reddit is reached. What survives summarising is the part a summary has to throw away: the disagreement, and the person who can be asked a follow-up.

**PERSONA ROLE:** Primary persona

**PERSONA NAME:** Search-First Rohan

**PERSONA PHOTO:** `images/persona.jpg`

**PERSONA BLURB:** Search arrival, not idle browsing, is the dominant entry path. About 60% of Reddit’s users are men, and the skew is sharpest among the people who actually post, which is the cohort the primary solution acts on.

**JOB STATEMENTS (bold marks the emphasised clause):**

1. When an AI answer is close but not my case, **I want to reach the people it summarised**, because a summary cannot be asked a follow-up.
2. When the sources disagree, **I want to see the argument and not the verdict**, because one confident paragraph hides how contested the answer is.
3. When I finally have something worth adding, **I want to know the rules before I am judged by them**, not after my post has been deleted.

**SOURCE:** Job statements written from the research, not verbatim transcript. Evidence base: 5 interviews, a 15-person survey, one public thread (48K upvotes). Small sample, so findings are raw counts, never percentages. Four of five interviewees raised Automod unprompted.

**NOTES:**

---

## Slide 07 — The funnel, and where it leaks

*Layout `funnel`: left-to-right steps with arrows.*

**PILL:** The funnel, and where it leaks

**TITLE:** Three stages, each an order of magnitude smaller than the last

**LEAD:** Onboarding investment sits *downstream* of every one of these, on a homepage and an app the search-arrived user never reaches.

**SOURCE:** Why this is not already solved: Reddit Answers, its own AI answer engine, has been in beta since late 2024. It is a real attempt at this problem, but it serves users already on Reddit and mostly logged in. The searcher who lands on one thread from Google never opens it.

**NOTES:**

---

## Slide 08 — Solution 2 · primary → stage 2

*Layout `mock`: phone mock on the left, explanation panels on the right.*

**PILL:** Solution 2 · primary → stage 2

**TITLE:** Catch the bad first post before Automod does

**LEAD:** Promoted to primary because it acts on *supply*, not on arrivals. Arrivals are shrinking for reasons Reddit does not control. The corpus is what survives the channel.

**PHONE MOCK `coach`**

- *caption below:* Mobile composer, checked live
- *words on the screen:* New post · u/new_explorer Flair: none “do romans eat breakfast?” Composer Coach Flair Length Format Tone Likely to be removed Fix these two and it posts cleanly. Fix flair Post

**PANELS:**

1. **What it is** — A real-time check inside the composer for new accounts, under seven days old or low karma. It flags flair, length, formatting and tone *before* submit rather than after deletion.
2. **Why it leads now** *(highlighted panel)* — Two reasons. Logged-in DAU grows at *7%* against *27%*, so a surviving first post moves the slow number. And the corpus is the asset being licensed: *Reddit renegotiates that licence in H1 2027, and corpus health is the negotiating position.*
3. **What it costs** — The rules linter is effectively free. An LLM check costs about *$0.001*. Ship the linter first and add a model only for fuzzy tone. The week-one posting rate should come from internal data, and this deck does not assert it.
4. **The dependency, stated up front** — Automod rules are per-subreddit and often private. Many key on account age, karma floor or verified email, and *a composer cannot fix any of those.* Coach covers the machine-checkable subset. Full coverage needs a platform-level rule surface, out of scope here.

**SOURCE:** Addresses the complaint four of five interviewees raised unprompted.

**NOTES:**

---

## Slide 09 — Solution 3 → stage 3

*Layout `mock`: phone mock on the left, explanation panels on the right.*

**PILL:** Solution 3 → stage 3

**TITLE:** Then give the post somewhere to land

**LEAD:** When Coach flags a likely removal it offers a soft pivot to the subreddit’s megathread, over the thread rather than instead of it. A likely failure becomes a guaranteed first publish.

**PHONE MOCK `mega`**

- *caption below:* Bottom sheet over the live thread
- *words on the screen:* r/AskHistorians · thread This will probably be removed Post it to the Weekly Open Discussion megathread instead? Post to the megathread Fix it Post anyway

**PANELS:**

1. **Positioning** — A fallback inside the Coach flow, not a standalone feature. Standing alone it would be a “kids table” for new accounts, which is a worse product than the one it replaces.
2. **If there is no megathread** — Most subreddits do not run one. The branch defaults to Coach’s fix guidance plus a Reddit-wide new-contributor thread.
3. **The metric risk I would flag myself** — A megathread comment can satisfy the north star metric and still deliver nothing, because most get no reply. *Counter-metric: reply-received rate on a first post within 48 hours.* Without it the feature looks like a win while failing the user.
4. **The relationship risk** — A tool that routes around moderator gates can read as undermining moderation. Mod trust is Reddit’s most fragile asset. Ship to opt-in subreddits first and hold the mod-sentiment guardrail.

**SOURCE:** Framing from the 1-9-90 rule (NN/g, 2006): the hard part is moving a user from lurking to participating at all. The source is twenty years old and community-general, so treat it as directional.

**NOTES:**

---

## Slide 10 — Solution 1 → stage 1 · mobile-first

*Layout `mock`: phone mock on the left, explanation panels on the right.*

**PILL:** Solution 1 → stage 1 · mobile-first

**TITLE:** Replace the app-install wall with thread-page onboarding

**LEAD:** Sized honestly: this *protects yield on a falling channel.* It only acts on arrivals, so it cannot drive growth. It is still the cheapest thing to test.

**PHONE MOCK `today`** — label above: Reddit today

- *caption below:* App wall covers the answer, and Google penalises it
- *words on the screen:* r/AskHistorians · thread Reddit is better in the app Open in app Continue in browser the answer is under here

**PHONE MOCK `strip`** — label above: Proposed

- *caption below:* Slim strip, answer stays visible and indexable
- *words on the screen:* r/AskHistorians 2.1M members · 140 new posts this week Follow Top answer · 4.2K upvotes Reply · 1.1K Reply · 840

**PANELS:**

1. **Community identity** — “r/AskHistorians · 2.1M members.” She sees where she is in one glance. Today the page assumes she already knows.
2. **Age-robust liveness** — “140 new posts this week.” Search surfaces old threads, so a live-user count reads zero on exactly the pages that need it most. A recency count survives age. Below a threshold, suppress the chip instead of showing a zero.
3. **One non-coercive CTA** — “Follow this community”, or “notify me if someone answers.” No signup wall. It creates a return trigger and a measurable conversion rate. *The original CTA asked a satisfied searcher to ask a question she no longer had.*
4. **What the evidence does not say** — Cross-industry popup data shows new visitors converting above returning ones, and mobile above desktop. Those are e-commerce email captures, not Reddit thread pages. The direction transfers and the magnitude does not. *This deck forecasts no lift.*

**SOURCE:** Hard constraints: non-intrusive, no app wall, no scroll block, 100% indexable. A non-blocking strip also stays clear of Google’s 2017 intrusive-interstitial penalty, which affects ranking and is separate from AI Overviews suppressing clicks. Mock reflects Reddit’s mobile web as observed Apr 2026, so re-verify before presenting.

**NOTES:**

---

## Slide 11 — Measurement

*Layout `table`: three-column table, a row can be highlighted.*

**PILL:** Measurement

**TITLE:** One north star metric, and the guardrails that outrank it

**LEAD:** Solution 1’s premise is that the valuable cohort never signs up, so an unchained north star under-credits it. Report the funnel, not the endpoint.

**TABLE** — columns: Measure · What it is and why · Instrument

1. **North star metric** *(highlighted row)* — New user activation rate: the share completing one meaningful action, upvote, follow or comment, within 48 hours of signup. Chained for this cohort as thread-arrival → signup → 48h action. — *right column:* Chained
2. **Secondary** — Time to first action. Subreddit follow rate on day one. Reply-received rate on a first post within 48 hours. — *right column:* Activation
3. **Guardrail · test design** — Measure against concurrent *holdout subreddits*, not a year-on-year baseline. Referral traffic is volatile for outside reasons, and a YoY baseline cannot separate our treatment from a Google core update. — *right column:* Holdouts
4. **Guardrail · SEO** — Thread content indexability stays at *100%*. Every fix here touches the arrival surface, so every fix can threaten the traffic the business runs on. — *right column:* 100%
5. **Guardrail · engagement** — Scroll depth and dwell time must not fall. *Bounce rate is the wrong instrument here,* because a search-arrived single-thread session counts as a bounce by definition. — *right column:* Not bounce
6. **Guardrail · mods** — Removal rate and mod-reported sentiment, per subreddit. Solutions 2 and 3 touch moderation directly, and mod trust is the asset least able to survive being spent. — *right column:* Sentiment

**SOURCE:** And from Q3 2026 this goes dark. Reddit stops reporting logged-in and logged-out DAU, so the cohort this deck is about becomes unmeasurable from outside. It stays instrumented internally.

**NOTES:**

---

## Slide 12 — Go to market and risks

*Layout `two`: two columns — left is a solid card, right is a dashed one.*

**PILL:** Go to market and risks

**TITLE:** Ship the cheapest test first, and protect the traffic

**LEAD:** Sequenced so the most expensive phase ships only if the cheap one proves it is needed.

**LEFT COLUMN — Ship in this order**

1. *Phase 1 · Coach baseline.* Non-LLM rules linter for new accounts, on opt-in subreddits. Watch Automod pass-rate lift and reply-received rate.
2. *Phase 2 · The strip.* A/B the Solution 1 thread-page strip on a few high-traffic subreddits against concurrent holdouts. Watch the SEO guardrail first and everything else second.
3. *Phase 3 · LLM and fallback.* Add model-based tone checks and the megathread fallback. Ships only if Phase 1 falls short.
4. Phases 1 and 2 are independent and can run at once. Phase 3 is conditional on Phase 1 by design, not by capacity.

**RIGHT COLUMN — Risks, and what holds them**

1. *The strip fatigues users or hurts engagement* → keep the design non-modal and hold the scroll-depth guardrail.
2. *Coach reads as gatekeeping* → frame it as help, make it opt-out, limit it to new accounts.
3. *Mods read Coach as undermining moderation* → opt-in subreddits first, and the mod-sentiment guardrail leads.
4. *Solution 1’s ceiling falls with the channel* → it protects yield and does not drive growth. Size it that way.
5. *Progressive login blurs* were considered and cut. They would degrade the indexable content the whole business runs on. A rejected option, not a managed risk.

**NOTES:**

---

## Slide 13 — What I am not solving

*Layout `rows`: stacked rows, numbered if `numbered: true`.*

**PILL:** What I am not solving

**TITLE:** The visit itself, and why I am not pretending to fix it here

**LEAD:** Three solutions act on people who reach the page. None act on the person who never arrives. That gap is real, so it is named here rather than filled with a fourth feature I could not evidence.

**ROWS:**

1. **The lever** — The only surface a non-visitor touches is what the crawler sees. Any genuine fix has to change what Reddit exposes to be summarised, not what it shows on a page the user never opens.
2. **Why it is out of scope** — This is a licensing and distribution decision before it is a product one. The Google contract expires H1 2027, Reddit is reported to want usage-based terms, and the OpenAI renewal is unresolved. *That negotiation sets the terms, not a feature.* A PM answering a contract problem with a content-structure change is bringing the wrong instrument.
3. **What would change my mind** — Whether *retrieval* fell or only *citation* fell. Reddit’s share of ChatGPT citations dropped from 3.83% to 0.52% in four days in August, an 86.4% relative fall. But Ahrefs measured the same platform over the same window at 16.7%, Promptwatch calls its own figure provisional, and a near-identical collapse in June recovered within two months.
4. **Why the deck is not built on that number** — ChatGPT sends under 0.1% of Reddit’s inbound. Google AI Overviews and AI Mode declined about 11% and 30% over the same window, a slope rather than a cliff. *The loud number is the small one.* The 68% zero-click figure is what moves the business.

**SOURCE:** If retrieval fell rather than citation, this deck’s thesis inverts: read without being paid becomes no longer read, a different and worse problem that none of these solutions address. Sources: Promptwatch citation tracking, Aug 2026; Ahrefs, Apr and Aug 2026.

**NOTES:**

---

## Slide 14 — Reddit · read without being visited

*Layout `cover`: full-bleed gradient (or dark, if `dark: true`), with the cover art.*

**KICKER:** Reddit · read without being visited

**TITLE:** Thank you.

**LEAD:** Reddit’s asset was never the answer. It was the argument underneath it. When the answer stops requiring a visit, the argument is the only thing left worth arriving for.

**FOOT:** Ritika Das · ritikadas.in · questions and feedback welcome

**NOTES:**

---
