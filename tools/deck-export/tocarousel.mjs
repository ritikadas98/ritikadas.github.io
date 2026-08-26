/* Print a carousel to PDF at 4:5, the shape LinkedIn actually serves.
 *
 *   node tocarousel.mjs "http://localhost:8899/work/reddit/carousel/" ../../assets/carousels/reddit.pdf
 *
 * Writes two files: <out>.pdf at 1080x1350 and <out>@2x.pdf at 2160x2700.
 * Pass `1x` or `2x` as a third argument to write only one of them.
 *
 * ---- which one to upload ----
 *
 * LinkedIn rasterises every document at 1080 wide. The 1x file hits that
 * exactly, 1:1, with no resampling at any point. The 2x file has to be halved
 * to get there, which softens it very slightly.
 *
 * So 1x is the one to upload and 2x is the one to print or to hand to a tool
 * that rasterises at the page's nominal size. Both are here because that is a
 * claim worth testing against the real feed rather than believing.
 *
 * ---- what 2x does not do ----
 *
 * It does not make the text sharper. The text is vector — outlines have no
 * resolution — which is why both files come out the same size on disk. It does
 * not improve the photographs either: Chrome embeds an image at its natural
 * resolution, not at the size the layout draws it, so the Reddit thread shot is
 * 1672x1400 in the PDF exactly as it is on disk, inside a 1080-wide page. The
 * only lever on picture quality is the source file.
 */
import { chromium } from 'playwright';

const [url, out, shape] = process.argv.slice(2);
if (!url || !out) {
  console.error('usage: node tocarousel.mjs <carousel-url> <out.pdf> [tall|wide]');
  process.exit(1);
}

/* The layout frame. carousel.css is written in flat pixels against this width,
 * so the page must always be LAID OUT at 1080 whatever size it is PRINTED at. */
/* Two shapes. Portrait is 4:5, which fills a phone. Landscape is 16:9, the
 * shape the deck is in, at exactly the size LinkedIn serves it. Pass `wide`
 * as the third argument for 16:9; the default stays portrait. */
const SHAPES = { tall: [1080, 1350], wide: [1080, 608] };
const [W, H] = SHAPES[process.argv[4] === 'wide' ? 'wide' : 'tall'];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
const problems = [];
page.on('pageerror', e => problems.push('' + e.message));
await page.goto(url, { waitUntil: 'networkidle' });
/* The cover art staggers to about 1.2s and the bars grow over 900ms. The print
   block finishes them, but the fonts still have to land. */
await page.waitForTimeout(1500);
await page.emulateMedia({ media: 'print' });

/* `zoom`, not the pdf() `scale` option. `scale` leaves the layout at 1080 and
   paints it onto a larger sheet, so the slide sat at 1x in the middle of a 2x
   page with its right edge cut off. `zoom` multiplies the used value of every
   length before layout: the same 1080-wide design, computed at 2160. Nothing
   reflows, because every ratio in it is unchanged.

   The @page rule and the paper size have to name the same number or Chrome
   lays out for one and paginates onto the other, and anything against a slide
   edge lands past the page boundary. */
async function write(path, k) {
  await page.addStyleTag({ content:
    `@page{size:${W * k}px ${H * k}px;margin:0}
     @media print{ #stage{zoom:${k}} }` });
  await page.pdf({
    path, printBackground: true, preferCSSPageSize: true,
    width: `${W * k}px`, height: `${H * k}px`,
    margin: { top: 0, bottom: 0, left: 0, right: 0 }
  });
  return path;
}

/* 1x is the one to upload: it matches what LinkedIn serves exactly, 1:1, so
 * nothing is resampled at any point. 2x is for printing, or for a tool that
 * rasterises at the page's nominal size. */
const written = [await write(out, 1), await write(out.replace(/\.pdf$/, '@2x.pdf'), 2)];
console.log(JSON.stringify({ written, problems }));
await browser.close();
