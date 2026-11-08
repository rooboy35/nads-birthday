import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { roasts, createDeck } from '../src/content.js';
assert.ok(roasts.length >= 25, 'At least 25 original roasts');
assert.equal(new Set(roasts).size, roasts.length, 'No duplicate roasts');
const pick = createDeck(roasts);
let previous;
for (let round = 0; round < 12; round++) {
  const seen = new Set();
  for (let i = 0; i < roasts.length; i++) {
    const value = pick();
    assert.notEqual(value, previous, 'No repeat across deck boundaries');
    assert.ok(!seen.has(value), 'No repeat before exhausting the deck');
    seen.add(value); previous = value;
  }
}
for (const name of ['nads-party.webp', 'nads-cry.webp', 'nads-beer.webp', 'nads-roast.webp']) await access(`public/images/${name}`);
for (const name of (await readdir('src')).filter(name => /\.(html|js|css)$/.test(name))) {
  const source = await readFile(`src/${name}`, 'utf8');
  assert.ok(!/https?:\/\/(?:fonts\.|images\.|cdn\.)/.test(source), 'No remote asset dependencies');
}
console.log(`Checked ${roasts.length} distinct roasts, 12 complete decks, required assets, and local-only asset references.`);
