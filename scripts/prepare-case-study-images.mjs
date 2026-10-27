import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const root = resolve(import.meta.dirname, '..');
const entries = [
  ['public/images/AETHER-front-end.png', 'AETHER-front-end', '01-portal.webp'],
  ['public/images/sistema-de-gastos.png', 'meu-caixa', '01-visao-geral.webp'],
  ['docs/project-images/shopee-demo-original.png', 'site-projeto-shopee', '01-demo.webp'],
  ['public/images/site-pessoal-para-surpresa.png', 'anninha-site-novo', '01-pagina-pessoal.webp'],
];
for (const [source, repo, name] of entries) {
  const folder = resolve(root, 'public/images/projects', repo);
  await mkdir(folder, { recursive: true });
  const result = await sharp(resolve(root, source)).webp({ quality: 88 }).toFile(`${folder}/${name}`);
  console.log(repo, result.width, result.height, result.size);
}
