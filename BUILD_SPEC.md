# Ritika Das — Portfolio Website · Complete Build Specification

**Audience for this document:** an autonomous coding agent (e.g. Claude Code / Antigravity) building and maintaining the site end to end. Everything needed to build without further questions is here. Where a value is a placeholder the owner must supply (real copy, links, screenshots), it is marked `[[FILL: …]]`. Do not invent facts marked FILL.

**Companion reference:** the low-fidelity wireframe image `wire3.png` (Option B) shows layout/IA intent only. **NOTE:** both `wire3.png` and any earlier `index.html` build predate decisions made after them — (1) the per-card **equalizer was replaced by live interactive 1:1 GitHub micro-widgets** (§5), (2) several **renames + copy simplifications** (hero line, "Work Experience", "Open to product roles", "by Claude", 4th YouTube card), (3) exact **Muted Indigo `#4B4F91` palette restoration** with zone-scoped 80% translucent custom cursor, and (4) **Brand SVG Icon System** in original brand colors for written case studies (§6). Where the wireframe or an old build shows a bar-chart equalizer or old names, **this spec overrides them.** This spec is authoritative.

**Global note on copy:** every piece of copy in this spec should be treated as a *starting point to simplify further if needed* — the top language rule (§0) governs. When in doubt, make it shorter and plainer.

---

## 0. What this site is

A personal portfolio for **Ritika Das**, transitioning into Product Management. It exists to convince recruiters and hiring managers at **early-stage consumer startups** that she thinks like a PM and should be interviewed.

**Positioning (governs every decision):** a **generalist PM who builds**. Not an AI specialist, not an enterprise/consulting profile, not a designer or developer portfolio. AI appears only as the domain some projects happen to occupy — never as identity.

**Desired feeling:** quiet confidence · premium through restraint · intelligent · calm · human · sharp and composed · divergent from the generic white PM-portfolio template — without being loud, flashy, over-designed, or trend-chasing.

**One optimization metric (the north star for every tradeoff):**
> **Reduce the number of decisions a recruiter has to make to understand her.**
> They shouldn't have to decide where to click, infer a section's meaning from a clever title, or read long paragraphs to grasp a project's value. When structure is obvious, their mental energy goes to evaluating her *thinking*.

**Performance target:** a recruiter understands the site in ~90 seconds. Every section must introduce genuinely new evidence, not repeat what another already demonstrated.

**LANGUAGE RULE (applies to ALL copy on the site — high priority):** simplify everything so it reads in one pass. Short sentences. Plain words over clever ones. No sentence should require re-reading to parse. Reviewers repeatedly flagged earlier copy as "too hard to understand in one read" — that is the #1 thing to fix. Confident and direct, not dense or literary. Where existing copy in §6 is wordy, shorten it. **Sell through clarity and range, not through hype** — never "best in the world" claims (they read junior), but do state achievements plainly and confidently. "10 installs, 70% came back in a week" is the register: honest, specific, and it sells itself.

---

## 1. Primary User Journey & Page Architecture

Single-page scroll with high-speed anchor navigation + deep-dive detail modal drawers (§11).

```
┌────────────────────────────────────────────────────────────────────────┐
│  NAVBAR (Sticky, transparent blur, brand signature logo + mode switch) │
├────────────────────────────────────────────────────────────────────────┤
│  1. HERO — Elevator pitch + 2 CTAs ("See the work ↗", "Résumé ↗")      │
│  2. MARQUEE TICKER — Infinite scrolling capability keywords            │
│  3. ABOUT — 3-perspective audience switcher (Recruiter/Founder/Lead)   │
│  4. FRAMING BAND — "How I work across the whole job"                   │
│  5. SHIPPED PRODUCTS — 3 Built Projects with 1:1 Live Micro-Widgets     │
│     - FitCheck (v0.7.0 Ease Engine)                                    │
│     - Savio (Deterministic Finance Trust Gate)                        │
│     - Amazon Discovery Intelligence (13-Step Ingestion Pipeline)      │
│  6. PRODUCT THINKING — Written Case Studies with Original Brand SVGs   │
│     - Reddit (Snoo `#FF4500` Icon)                                    │
│     - YouTube (Play `#FF0000` Icon & 3-Sided Market Filter)            │
│  7. PM CAPABILITIES — Strategic Competency Grid (No CS Dev Jargon)    │
│  8. WORK EXPERIENCE — Technical Project Manager (Enterprise Delivery)  │
│  9. CONTACT — Clean CTA ("Email me ↗", "LinkedIn ↗", "GitHub ↗")      │
│ 10. FOOTER — Copyright + Maintainer Note                               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Design Tokens & Palette System (LOCKED)

```css
:root {
  /* Surfaces (Warm Neutral) */
  --paper:        #EDE8E1;   /* Page background — warm putty */
  --paper-alt:    #E7E1D8;   /* Alternating band background */
  --surface:      #F6F2EB;   /* Card surface */
  --surface-2:    #FBF8F2;   /* Elevated card surface */
  --soft-band:    #F6F5F2;   /* Section band */

  /* Ink */
  --ink:          #211E24;   /* Primary text */
  --ink-2:        #38333B;   /* Secondary text */
  --muted:        #6A6369;   /* Muted text */
  --faint:        #948C90;   /* Labels, captions */

  /* Accent — Muted Indigo (Build Spec Exact Token) */
  --accent:       #4B4F91;   /* Primary accent */
  --accent-soft:  #7C81BE;   /* Soft accent hover */
  --accent-wash:  #E5E2EE;   /* Soft wash tint */

  /* Lines */
  --hairline:        #DBD3C9;
  --hairline-strong: #CFC6BA;

  /* Shadows & Geometry */
  --shadow:       0 1px 2px rgba(33,30,36,.04), 0 10px 34px rgba(33,30,36,.07);
  --shadow-lift:  0 2px 6px rgba(33,30,36,.06), 0 22px 54px rgba(33,30,36,.12);
  --r-sm: 9px; --r: 14px; --r-lg: 18px;

  /* Typography */
  --display: 'Bricolage Grotesque', sans-serif;
  --body:    'Inter', sans-serif;
  --mono:    'IBM Plex Mono', monospace;
  --wrap:    1080px;
  --measure: 58ch;
}
```

---

## 3. Dynamic Zone-Scoped Custom Cursor

- Text fill badge (`TRY VERDICT`, `TEST TRUST`, `RUN PIPELINE`, `READ STUDY`) scoped **exclusively to `.card-details-box`** with **80% opacity (`rgba(75, 79, 145, 0.80)`)** and backdrop blur.
- Instantly reverts to clean circular ring cursor over interactive widgets (`.mini-widget-box`), buttons, sliders, links, and link title arrows (`↗` / `h3`).

---

## 4. Authentic Live Micro-Widgets (1:1 with GitHub Repos)

- **FitCheck (v0.7.0)**: Ease math sidepanel engine across Myntra, AJIO Levi's, and H&M Blazer (+6" oversized cut / abstain safety).
- **Savio**: Seeded state (Priya Sharma ₹12k surplus). Red Signal releases **Constructive Guidance Card** (identifies driver merchants, cites impulse threshold, 4-step path; no silent withholding).
- **Amazon Discovery**: 13-step pipeline with Sample vs Live Play Store toggle, RICE formula, MoSCoW tags, RAG citations.

---

## 5. Written Case Studies & Brand SVG System (§6)

**Rule for Adding New Written Case Studies:**
Every written case study product MUST include its official SVG logo in its **original brand color**:
1. **Section Header Badge (`#cases`)**: Include the brand SVG icon (`20-22px`) inside the header pill badge beside `Product Thinking`.
2. **Card Title (`h3`)**: Prepend the brand SVG icon (`24-26px`) directly in front of the project title.
3. **Card Tag Tint (`.tag.paper`)**: Apply custom brand color text, border, and translucent background tint (e.g. Reddit `#FF4500`, YouTube `#FF0000`).

### 6.1 Reddit Case Study
- **Brand SVG:** `assets/reddit.svg` (Reddit Orangered `#FF4500`).
- **Tag:** `● Reddit Study` (`color: #FF4500`).

### 6.2 YouTube Shadow R&D Lab Case Study
- **Brand SVG:** `assets/youtube.svg` (YouTube Red `#FF0000`).
- **Tag:** `● YouTube Study` (`color: #FF0000`).
- **Copy:** Simplified 1-pass readability (*"Analytics only show what users do inside your app's rules..."*).

---

## 6. PM Capabilities & Strategic Competencies Grid (§5)

- `Product Strategy & Research`
- `Growth & Platform Economics`
- `AI & Technical Prototyping` (`LLM Integration & Orchestration`, `Rapid Full-Stack Prototyping`, `Deterministic AI & Grounding`, `Browser Extension Surfaces`)

---

## 7. Verification & Quality Assurance Checklist

- [x] **Brand SVG System**: Reddit (`#FF4500`) and YouTube (`#FF0000`) icons added to section header badge and card titles.
- [x] **1-Pass Readability**: All copy simplified into short, punchy sentences.
- [x] **Zone-Scoped Cursor**: 80% translucent pill on details box; circular ring on widgets & arrows.
- [x] **Authentic Widgets**: 1:1 logic with GitHub repos; Savio Red Signal releases constructive guidance card.
