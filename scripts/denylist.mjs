// Fails if any publishable file contains blocked content.
// Generic patterns live here; extra terms go in denylist.txt (committed, generic only)
// and denylist.local.txt (gitignored, for internal names that must never appear in the repo).
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.argv[2] ? join(process.cwd(), process.argv[2]) : process.cwd();
const SKIP_DIRS = new Set(['node_modules', '.git', '.astro', ...(process.argv[2] ? [] : ['dist'])]);
const SKIP_FILES = new Set(['denylist.txt', 'denylist.local.txt', 'PLAN.md', 'package-lock.json', 'scripts/denylist.mjs']);
const TEXT_EXT = /\.(md|mdx|astro|html|txt|json|ya?ml|mjs|js|ts|css|svg|tex|xml)$/i;

const patterns = [
  [/\bTP-\d+\b/, 'ticket ID'],
  [/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/, 'email address'],
  [/(?<![\w.])(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}(?!\d)/, 'phone number'],
];

function loadTerms(f) {
  return existsSync(f)
    ? readFileSync(f, 'utf8').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'))
    : [];
}
const terms = [...loadTerms('denylist.txt'), ...loadTerms('denylist.local.txt')].map(t => t.toLowerCase());

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const rel = relative(ROOT, p);
    if (SKIP_DIRS.has(name) || SKIP_FILES.has(rel)) continue;
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (TEXT_EXT.test(name)) yield [p, rel];
  }
}

let failures = 0;
for (const [p, rel] of walk(ROOT)) {
  const lines = readFileSync(p, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const [re, label] of patterns) {
      if (re.test(line)) { console.error(`${rel}:${i + 1}: ${label}`); failures++; }
    }
    const low = line.toLowerCase();
    for (const t of terms) {
      if (low.includes(t)) { console.error(`${rel}:${i + 1}: blocked term`); failures++; }
    }
  });
}
if (failures) { console.error(`\nDenylist check FAILED (${failures} hit(s)).`); process.exit(1); }
console.log(`Denylist check passed${process.argv[2] ? ` (${process.argv[2]})` : ''}.`);
