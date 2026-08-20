"""Amazon Discovery Intelligence — case study deck.

Content is lifted from work/amazon/index.html so the deck and the page cannot
drift. Live figures are from the run of 18 Aug 2026; re-pull from /digests before
regenerating, because they move every week.
"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from engine import Deck

d = Deck(brand="#1F2937", field=("#4A5A6B", "#2C3A47", "#1F2937", "#0E141B"), accent="#FF9900")

d.cover("Shipped product · agentic AI pipeline", "Amazon Discovery Intelligence",
        "Reads a week of public Amazon reviews and names the one problem worth "
        "starting. For the rest, it says what evidence is missing.",
        "Ritika Das · ritikadas.in")

d.split("The problem", "A PM cannot read every review, so they skim.",
        "Skimming feels fine, because you never find out what you missed. The complaint that "
        "mattered was in there and nobody counted it.",
        [("Decision", "A ranked list hands the queue back. Each problem leads with a finding, a first move and a price."),
         ("Evidence", "299 complaints sorted into 33 problems across 7 parts of the app."),
         ("Outcome", "One of 33 had enough behind it to act on, and the page says so.")])

d.statement("The part I did not expect",
            "It looked at 53 complaints and wrote \u201conly one person reported this\u201d.",
            "I had asked the model to score how strong the evidence was. One of the things I asked "
            "it to score was how many people had raised it. Code had already counted that. Exactly.")

d.cards("The rule", "Never ask a model to grade what you have already counted", None,
        [("What the model does", "Reads messy review text and groups complaints into problems. Reading a "
                                 "thousand badly written complaints and noticing four hundred are the same "
                                 "problem is what a model is good at."),
         ("What code does", "Every count. How many people raised a problem, how many sources it came from, "
                            "the score, the week-over-week change. Arithmetic, which a model is not good at."),
         ("Where I drew it wrong", "The readiness step was asked to grade a number I had already counted "
                                   "exactly. It said \u201conly one person\u201d beside the number 53."),
         ("The fix", "Not a better prompt. Taking the job away. Gemini runs at 4 of the 14 steps and none "
                     "of them is arithmetic.")])

d.spine("How it works", "Fourteen steps, four of them AI",
        "Every number a PM sees is counted in code. That split is the thing I got wrong first.",
        [("Collect", "App Store, Play Store and Amazon product pages, three live sources"),
         ("Filter", "A substance bar drops \u201cgood app\u201d and emoji-only, language-agnostic"),
         ("Group", "The model reads and clusters complaints into problems"),
         ("Count", "Code does every figure: people, sources, score, week-over-week"),
         ("Gate", "Refuses to rank a problem it cannot back, and names what is missing"),
         ("Deliver", "A digest that leads with one first move, an owner and a price")],
        highlight=3)

d.compare("The insight", "Severity measures loudness, not cost", 
          "A customer who cannot find a product writes a furious review. A customer charged twice "
          "writes a short, tired one.",
          ("Ranked on tone alone", ["3.2 upset score", "The week's costliest problem reads as unremarkable.",
                                    "23 complaints that cost money sit across 7 problems, most below "
                                    "problems that only irritated people."]),
          ("Two scores, not one", ["44 complaints", "13 packages lost or sent to the wrong address, 2 charged "
                                   "for items that never arrived.", "They disagree often enough to earn the "
                                   "second glance."]))

d.table("Trade-offs", "Three calls, and what each one bought",
        "Each gave something up, and each bought something worth more.",
        ["Trade", "What it gave up", "What it bought"],
        [["A spreadsheet over a database", "Queries and schema control",
          "A store PMs already sort, filter and share. \u20b91,100 a month became \u20b940."],
         ["Their schema over mine", "A clean schema of my own",
          "Every filter and pivot a PM had already built on the sheet, misspelled header and all."],
         ["The question over the archive", "The week-by-week history view",
          "Nobody asks what happened in week 22. They ask what is going wrong in Checkout."]],
        [2.6, 2.4, 5.0])

d.cards("The evidence", "What the evidence supports",
        "No product manager has run a week through this one yet. That is not the same as having no evidence.",
        [("The category is proven", "Atlassian says its PMs save about 40 minutes a day to an agent reading "
                                    "their feedback queue. Dovetail and Amplitude sell the same clustering to "
                                    "Canva, Meta and NTT DOCOMO."),
         ("Where this one differs", "All of them stop at a ranked list, and the PM still has to open it and "
                                    "decide. This names the first move, the owner and the price \u2014 the step "
                                    "after the one they automate."),
         ("What that predicts", "On the same inputs it should land in the same range, and take back the hour a "
                                "ranked list hands straight back. Inference from comparable products, not a "
                                "measured result from this one."),
         ("What would settle it", "Whether the named first move gets taken. The digest already carries a "
                                  "feedback link, so that number is one week of real use away.")])

d.statement("Live", "amazon.ritikadas.in",
            "Runs Mondays at 09:00 on a schedule, scales to zero between runs, about \u20b940 a month. "
            "Write-up at ritikadas.in/work/amazon")

out = pathlib.Path(__file__).parents[2] / "assets" / "decks" / "amazon-deck.pptx"
out.parent.mkdir(parents=True, exist_ok=True)
print(d.save(str(out)))
