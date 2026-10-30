// Reproducible optimization of existing screenshots; originals remain unchanged.
// Use SHARP_MODULE to point to an existing local sharp installation if needed.
import { createRequire } from 'node:module';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'public/images/hero');
await mkdir(output, { recursive: true });
const images = [
  ['sistema-de-gastos.png', 'meu-caixa'],
  ['sistema-de-estoque.png', 'sync-mobile'],
  ['site-pessoal-para-surpresa.png', 'memorias-a-dois'],
];
let originalBytes = 0;
const optimizedBytes = { 640: 0, 1280: 0, 1600: 0 };
for (const [source, name] of images) {
  const input = await readFile(resolve(root, 'public/images', source));
  originalBytes += input.length;
  for (const width of [640, 1280, 1600]) {
    const destination = resolve(output, `${name}-${width}.webp`);
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 85, effort: 6 }).toFile(destination);
    optimizedBytes[width] += (await stat(destination)).size;
  }
}
console.log(JSON.stringify({ originalBytes, optimizedBytes }));

// A typographic social card, not a screenshot or a claim about project results.
const social = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#f3f2ed"/>
  <rect x="64" y="64" width="66" height="66" fill="#d6eb78"/>
  <path d="M78 78h15v15H78zM101 78h15v15h-15zM78 101h15v15H78z" fill="#24251f"/>
  <circle cx="109" cy="109" r="7.5" fill="#24251f"/>
  <g fill="#24251f" font-family="Manrope, Arial, sans-serif">
    <text x="64" y="265" font-size="86" font-weight="600" letter-spacing="-4">Arthur Sgarbi</text>
    <text x="64" y="345" font-size="46" letter-spacing="-1">Desenvolvimento de software</text>
    <text x="64" y="533" font-size="27" fill="#536524">Engenharia de Software · FIAP</text>
  </g>
  <path d="M64 455H1136" stroke="#777d70"/>
</svg>`);
await sharp(social).png().toFile(resolve(root, 'public/images/portfolio-social.png'));
