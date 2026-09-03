/* Checks the Argue With Me deck in script.js. Run: node tools/deck-check.mjs
   The deck is inside a DOM-guarded IIFE, so this lifts the CARDS literal out by
   text and evaluates that alone. ponytail: text slice, not a parser — fine while
   there is exactly one `const CARDS = [` in the file, which the check asserts. */
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const src = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
assert.equal(src.split('const CARDS = [').length, 2, 'expected exactly one CARDS literal');

const from = src.indexOf('const CARDS = [');
const to = src.indexOf('\n  ];', from);
assert.ok(to > from, 'could not find the end of the CARDS literal');
const CARDS = eval(src.slice(from + 'const CARDS = '.length, to + 4));

assert.equal(CARDS.length, 6, 'six forks');
for (const [n, c] of CARDS.entries()) {
  const at = `card ${n + 1} (${c.topic})`;
  for (const f of ['topic', 'note', 'q', 'qnote', 'a', 'b', 'hers', 'mine', 'knew', 'assumed', 'wrong']) {
    assert.ok(typeof c[f] === 'string' && c[f].trim(), `${at}: missing ${f}`);
  }
  assert.ok(c.hers === 'a' || c.hers === 'b', `${at}: hers must be 'a' or 'b'`);
}

/* Two forks per product, and the answer must not sit on one side every time.
   The product is named at the head of `mine`, which is the reader's first
   sight of it, so that is where the count comes from. */
const perSrc = {};
for (const c of CARDS) {
  const product = c.mine.split('.')[0].trim();
  perSrc[product] = (perSrc[product] || 0) + 1;
}
assert.deepEqual(Object.values(perSrc).sort(), [2, 2, 2], 'two forks per product');
const sides = new Set(CARDS.map(c => c.hers));
assert.equal(sides.size, 2, 'the answer sits on the same side every time');

console.log('deck ok:', CARDS.length, 'forks,', Object.keys(perSrc).join(', '));
