// Execute com uma instalação local do sharp e a capa de perfil original gerada.
// Os originais são apenas lidos; somente os quatro arquivos com nomes de repositórios são gravados.
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'public/images');
const profileSource = process.argv[2];
if (!profileSource) throw new Error('Informe o caminho da capa original do perfil.');

function canvas({ title, subtitle, caption, background, accent }) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100">
    <defs><radialGradient id="glow"><stop stop-color="${accent}" stop-opacity=".12"/><stop offset="1" stop-color="${background}" stop-opacity="0"/></radialGradient></defs>
    <rect width="1600" height="1100" fill="${background}"/>
    <ellipse cx="800" cy="530" rx="900" ry="650" fill="url(#glow)"/>
    <path d="M100 150H300M1300 950H1500" stroke="${accent}" stroke-opacity=".2"/>
    <g text-anchor="middle" font-family="Arial, sans-serif">
      <text x="800" y="215" fill="${accent}" font-size="22" letter-spacing="5">${subtitle}</text>
      <text x="800" y="310" fill="#f3f2ed" font-size="72" font-weight="700" letter-spacing="-2">${title}</text>
      <text x="800" y="910" fill="${accent}" font-size="20" letter-spacing="2">${caption}</text>
    </g>
  </svg>`);
}

async function screenshotCover(source, filename, theme, crop) {
  let screenshot = sharp(await readFile(source));
  if (crop) screenshot = screenshot.extract(crop);
  const resized = await screenshot.resize({ width: 800, withoutEnlargement: true }).png().toBuffer();
  const { height } = await sharp(resized).metadata();
  await sharp(canvas(theme)).composite([{ input: resized, left: 400, top: Math.round(590 - height / 2) }])
    .png({ palette: true, colours: 256, quality: 95, effort: 10, dither: 0.3 })
    .toFile(resolve(output, filename));
}

await screenshotCover(resolve(output, 'sistema-de-gastos.png'), 'meu-caixa.png', {
  title: 'Meu Caixa', subtitle: 'FINANÇAS PESSOAIS', caption: 'CAPTURA REAL DO PROJETO',
  background: '#111827', accent: '#d2b78b',
});
await screenshotCover(resolve(output, 'site-pessoal-para-surpresa.png'), 'anninha-site-novo.png', {
  title: 'Minha Anninha', subtitle: 'UMA HISTÓRIA EM CÓDIGO', caption: 'CAPTURA REAL DO PROJETO',
  background: '#200d16', accent: '#ed91a5',
});
await screenshotCover(resolve(root, 'docs/project-images/shopee-demo-original.png'), 'site-projeto-shopee.png', {
  title: 'SYNC Mobile', subtitle: 'SITE-PROJETO-SHOPEE', caption: 'CAPTURA REAL · DEMONSTRAÇÃO PÚBLICA',
  background: '#1c100d', accent: '#f28c73',
}, { left: 185, top: 430, width: 1230, height: 625 });

await sharp(profileSource).resize(1600, 1100, { fit: 'contain', background: '#111510' })
  .png({ palette: true, colours: 256, quality: 95, effort: 10, dither: 0.3 })
  .toFile(resolve(output, 'ArthurSgarbi.png'));

for (const filename of ['meu-caixa.png', 'site-projeto-shopee.png', 'anninha-site-novo.png', 'ArthurSgarbi.png']) {
  const { width, height, size } = await sharp(await readFile(resolve(output, filename))).metadata();
  console.log(JSON.stringify({ filename, width, height, bytes: size }));
}
