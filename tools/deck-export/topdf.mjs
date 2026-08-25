/* Print a deck to PDF at a true 16:9 page, which Chrome's own dialog cannot do:
 * its paper list stops at A4, Letter and friends, none of which is 16:9.
 *
 *   node topdf.mjs "http://localhost:8899/work/reddit/deck/" ../../assets/decks/reddit.pdf
 *
 * The text stays real text — selectable, searchable, and a tenth the weight of
 * the .pptx, which is fourteen photographs. Use this for anything a person will
 * read. Use build.py for anything that has to open in PowerPoint.
 */
import { chromium } from 'playwright';

const [url, out] = process.argv.slice(2);
const W = 1600, H = 900;   // 16:9, the shape the deck is designed in
if (!url || !out) { console.error('usage: node topdf.mjs <deck-url> <out.pdf>'); process.exit(1); }

const browser = await chromium.launch();
const page = await browser.newPage();
const problems = [];
page.on('pageerror', e => problems.push('' + e.message));
await page.goto(url, { waitUntil: 'networkidle' });
/* The cover art staggers to about 1.2s and the bars grow over 900ms. The print
   block finishes them, but the fonts still have to land. */
await page.waitForTimeout(1500);
await page.emulateMedia({ media: 'print' });

/* deck.css declares `@page{size:landscape}`, which means "landscape of whatever
   paper is selected" and is the right instruction for someone pressing Ctrl+P.
   It is the wrong one here: Chrome then lays the slides out for A4 while
   paginating onto the 16:9 sheet asked for below, and anything placed against
   a slide edge — the cover's thread screenshot — lands past the page boundary
   and bleeds onto the next page. Naming the same size in both places is the
   whole fix; preferCSSPageSize makes the CSS the authority. */
await page.addStyleTag({ content: `@page{size:${W}px ${H}px;margin:0}` });
await page.pdf({
  path: out, printBackground: true, preferCSSPageSize: true,
  width: `${W}px`, height: `${H}px`,
  margin: { top: 0, bottom: 0, left: 0, right: 0 }
});
console.log(JSON.stringify({ out, problems }));
await browser.close();
