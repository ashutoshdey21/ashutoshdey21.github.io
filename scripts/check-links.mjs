// Fails the build if any internal link or asset in dist/ points to a file that doesn't exist.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const pages = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (n.endsWith('.html')) pages.push(p);
  }
})(DIST);

const exists = (path) => {
  const clean = decodeURI(path.split('#')[0].split('?')[0]);
  const f = join(DIST, clean);
  return existsSync(f) && (statSync(f).isFile() || existsSync(join(f, 'index.html')));
};

let bad = 0, checked = 0;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    let url = m[1];
    if (url.startsWith('https://ashutoshdey21.github.io/')) url = url.slice('https://ashutoshdey21.github.io'.length);
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    if (url.startsWith('/neurostore/')) continue; // separate project site
    checked++;
    if (!exists(url)) { console.error(`${page}: broken link ${m[1]}`); bad++; }
  }
}
if (bad) { console.error(`\nLink check FAILED (${bad} broken).`); process.exit(1); }
console.log(`Link check passed (${checked} internal links).`);
