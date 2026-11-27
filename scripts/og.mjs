// Generates public/og.png (1200x630). Run: node scripts/og.mjs
import sharp from 'sharp';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#111214"/>
  <rect x="0" y="0" width="14" height="630" fill="#86b8ff"/>
  <text x="90" y="200" font-family="Helvetica, Arial, sans-serif" font-size="78" font-weight="700" fill="#ffffff">Ashutosh Dey</text>
  <text x="90" y="270" font-family="Helvetica, Arial, sans-serif" font-size="38" fill="#86b8ff">Backend engineer · Java · PostgreSQL · AWS/GCP</text>
  <text font-family="Helvetica, Arial, sans-serif" font-size="34" fill="#d6d6d6">
    <tspan x="90" y="380">Building systems that stay correct under</tspan>
    <tspan x="90" y="428">concurrency, failure and access boundaries.</tspan>
  </text>
  <text x="90" y="550" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="#a3a3a3">ashutoshdey21.github.io</text>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile('public/og.png');
console.log('wrote public/og.png');
