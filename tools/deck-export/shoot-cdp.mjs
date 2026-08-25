/* Screenshot every slide of an HTML deck, one PNG per slide.
 *
 *   node shoot-cdp.mjs <deck-url> <out-dir>
 *
 * Same contract as tools/deck-export/shoot.mjs — 1920x1080 at twice the pixel
 * density, 1.8s per slide so bars and staggered cover art have finished, and a
 * second pass with the nav, progress bar and keyboard hint hidden, because those
 * belong to the web version and not to a file. The difference is the driver:
 * this one speaks CDP to the system Chrome, so it needs no Playwright download.
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const url = process.argv[2];
const out = process.argv[3];
if (!url || !out) { console.error('usage: node shoot-cdp.mjs <deck-url> <out-dir>'); process.exit(1); }
mkdirSync(out, { recursive: true });

/* Chrome lives somewhere different on every platform, and this was pinned to the
   macOS path — so the route the README recommends first died with ENOENT on
   Windows. First existing candidate wins; CHROME_PATH overrides the lot. */
const CHROME = process.env.CHROME_PATH || [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find(p => p && existsSync(p));

if (!CHROME) {
  console.error('no Chrome found. Set CHROME_PATH, or use shoot.mjs (Playwright) instead.');
  process.exit(1);
}
const PORT = 9300 + Math.floor(process.pid % 400);
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars',
  /* Absolute. Chrome on Windows silently refuses a relative --user-data-dir and
     then never opens the debugging port, which surfaces here as the unhelpful
     "chrome never came up" a few lines down. */
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${resolve(out, '.prof')}`, 'about:blank'], { stdio: 'ignore' });
process.on('exit', () => chrome.kill());
const sleep = ms => new Promise(r => setTimeout(r, ms));

let wsUrl;
for (let i = 0; i < 80; i++) {
  try { wsUrl = (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).webSocketDebuggerUrl; break; }
  catch { await sleep(400); }
}
if (!wsUrl) { console.error('chrome never came up'); process.exit(1); }
const ws = new WebSocket(wsUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

let mid = 0; const pending = new Map(); const problems = [];
ws.onmessage = e => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  else if (m.method === 'Runtime.exceptionThrown') problems.push('pageerror: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') problems.push('console: ' + m.params.args.map(a => a.value ?? '').join(' '));
  else if (m.method === 'Network.loadingFailed' && !/favicon|goatcounter|gc\.zgo\.at/.test(JSON.stringify(m.params))) problems.push('netfail: ' + m.params.errorText);
};
const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
  const id = ++mid; pending.set(id, m => m.error ? rej(new Error(m.error.message)) : res(m.result));
  ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  setTimeout(() => { if (pending.has(id)) { pending.delete(id); rej(new Error('timeout ' + method)); } }, 60000);
});

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: S } = await send('Target.attachToTarget', { targetId, flatten: true });
for (const d of ['Page', 'Runtime', 'Network']) await send(d + '.enable', {}, S);
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, S)).result.value;

await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 2, mobile: false }, S);
await send('Page.navigate', { url }, S);
await sleep(3500);
await ev(`document.fonts.ready.then(()=>1)`);
await sleep(1200);

const total = await ev(`document.querySelectorAll('.slide').length`);
if (!total) { console.error('no slides found at ' + url); process.exit(1); }

/* The chrome belongs to the web version. Hidden up front: the only reason the
   original shoots twice is that Playwright's keyboard walk has to happen before
   the DOM is touched. Driving the slide state directly needs one pass. */
await ev(`(()=>{for(const id of ['nav','hint','bar']){const el=document.getElementById(id);if(el)el.style.display='none'}return 1})()`);

for (let i = 1; i <= total; i++) {
  await ev(`(()=>{location.hash='#'+${i};
    const slides=[...document.querySelectorAll('.slide')];
    slides.forEach((s,k)=>{s.classList.toggle('on',k===${i}-1);s.classList.toggle('past',k<${i}-1);});
    document.body.classList.toggle('on-dark',
      slides[${i}-1].classList.contains('dark')||slides[${i}-1].classList.contains('grad'));
    return 1})()`);
  await sleep(1800);
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }, S);
  writeFileSync(`${out}/slide-${String(i).padStart(2, '0')}.png`, Buffer.from(shot.data, 'base64'));
}

console.log(JSON.stringify({ slides: total, out, problems }));
ws.close(); chrome.kill(); process.exit(0);
