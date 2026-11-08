import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('src', 'dist', { recursive: true });
await mkdir('dist/images', { recursive: true });
// Keep supplied originals in Git for future artwork, not in the public deployment.
for (const name of ['nads-party.webp', 'nads-cry.webp', 'nads-beer.webp', 'nads-roast.webp', 'nads-portrait.webp']) {
  await cp(`public/images/${name}`, `dist/images/${name}`);
}
console.log('Built static site in dist/ (only five optimised runtime images published).');
