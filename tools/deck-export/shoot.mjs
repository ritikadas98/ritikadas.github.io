/* Screenshot every slide of an HTML deck, one PNG per slide.
 *
 *   node shoot.mjs <deck-url> <out-dir>
 *
 * Shot at 1920x1080 so the frame is exactly 16:9, at twice the pixel density so
 * the text survives a projector. The wait before each shot is deliberate: slides
 * animate in, bars grow over 900ms, and the cover's art staggers to about 1.2s.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const url = process.argv[2];
const out = process.argv[3];
if (!url || !out) {
  console.error('usage: node shoot.mjs <deck-url> <out-dir>');
  process.exit(1);
}
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 2,
});

const problems = [];
page.on('pageerror', (e) => problems.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') problems.push('console: ' + m.text()); });

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
if (!total) { console.error('no slides found at ' + url); process.exit(1); }

for (let i = 1; i <= total; i++) {
  if (i > 1) await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${out}/slide-${String(i).padStart(2, '0')}.png` });
}

// The chrome belongs to the web version. A pptx has its own page numbers and its
// own way of moving, so the last shot is taken again without any of it.
await page.evaluate(() => {
  for (const id of ['nav', 'hint', 'bar']) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }
});
for (let i = 1; i <= total; i++) {
  await page.evaluate((n) => { location.hash = '#' + n; }, i);
  await page.evaluate((n) => {
    const slides = [...document.querySelectorAll('.slide')];
    slides.forEach((s, k) => {
      s.classList.toggle('on', k === n - 1);
      s.classList.toggle('past', k < n - 1);
    });
    document.body.classList.toggle('on-dark',
      slides[n - 1].classList.contains('dark') || slides[n - 1].classList.contains('grad'));
  }, i);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${out}/slide-${String(i).padStart(2, '0')}.png` });
}

console.log(JSON.stringify({ slides: total, out, problems }));
await browser.close();
