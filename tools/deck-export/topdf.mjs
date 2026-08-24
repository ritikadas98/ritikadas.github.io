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
await page.pdf({
  path: out, landscape: true, printBackground: true,
  width: '1600px', height: '900px',
  margin: { top: 0, bottom: 0, left: 0, right: 0 }
});
console.log(JSON.stringify({ out, problems }));
await browser.close();
