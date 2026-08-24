/* Shoot a deck at an arbitrary viewport, to catch what the 1920x1080 export
   hides: a browser window is usually short, not narrow. */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const [url, out, w, h] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
const bad = [];
page.on('pageerror', e => bad.push('' + e.message));
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const n = await page.evaluate(() => document.querySelectorAll('.slide').length);
for (let i = 1; i <= n; i++) {
  await page.evaluate(k => {
    const s = [...document.querySelectorAll('.slide')];
    s.forEach((el, j) => { el.classList.toggle('on', j === k - 1); el.classList.toggle('past', j < k - 1); });
    document.body.classList.toggle('on-dark', s[k-1].classList.contains('dark') || s[k-1].classList.contains('grad'));
  }, i);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}/s${String(i).padStart(2,'0')}.png` });
}
/* Anything taller than the box it sits in is going to land on its neighbour. */
const over = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('.slide').forEach((sl, i) => {
    const b = sl.querySelector('.body');
    if (b && b.scrollHeight > b.clientHeight + 2) out.push(`slide ${i+1}: body overflows by ${b.scrollHeight - b.clientHeight}px`);
  });
  return out;
});
console.log(JSON.stringify({ slides: n, overflow: over, errors: bad }, null, 1));
await b.close();
