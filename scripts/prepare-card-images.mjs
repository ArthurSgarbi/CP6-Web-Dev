// Optimize existing covers; never alter their content or overwrite originals.
import { createRequire } from 'node:module';
import { mkdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const root = resolve(import.meta.dirname, '../public/images');
await mkdir(resolve(root, 'covers'), { recursive: true });
for (const name of ['AETHER-front-end', 'meu-caixa', 'anninha-site-novo', 'site-projeto-shopee']) {
  const originalBytes = (await stat(resolve(root, `${name}.png`))).size;
  for (const width of [480, 800, 1200]) {
    const destination = resolve(root, `covers/${name}-${width}.webp`);
    await sharp(resolve(root, `${name}.png`)).resize({ width, withoutEnlargement: true }).webp({ quality: 85, effort: 6 }).toFile(destination);
    console.log(JSON.stringify({ name, width, originalBytes, optimizedBytes: (await stat(destination)).size }));
  }
}
