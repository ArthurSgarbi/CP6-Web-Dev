import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { projectPresentation } from '../src/utils/formatRepository.js';
import { projectCaseStudies } from '../src/data/projectCaseStudies.js';
import { homeMetadata, siteOrigin } from '../src/utils/pageMetadata.js';
import { build } from 'vite';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '../dist');
const template = await readFile(resolve(root, 'index.html'), 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
function html({ title, description, image = homeMetadata.image, path, noindex = false, preload = false }) {
  const metadata = {
    description, robots: noindex ? 'noindex, follow' : 'index, follow',
    'og:title': title, 'og:description': description, 'og:image': new URL(image, siteOrigin).href,
    'og:image:alt': title, 'og:url': new URL(path, siteOrigin).href,
    'twitter:title': title, 'twitter:description': description, 'twitter:image': new URL(image, siteOrigin).href,
  };
  let result = template.replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/\s*<meta (?:name|property)="(?:description|robots|og:(?:title|description|image(?::\w+)?|url)|twitter:(?:title|description|image))"[^>]*>/g, '')
    .replace(/\s*<link rel="canonical"[^>]*>/g, '');
  const tags = Object.entries(metadata).map(([key, value]) => `<meta ${key.startsWith('og:') ? 'property' : 'name'}="${key}" content="${escape(value)}" />`);
  tags.push(`<link rel="canonical" href="${escape(new URL(path, siteOrigin).href)}" />`);
  if (preload) tags.push('<link rel="preload" as="image" href="/images/hero/meu-caixa-1280.webp" imagesrcset="/images/hero/meu-caixa-640.webp 640w, /images/hero/meu-caixa-1280.webp 1280w, /images/hero/meu-caixa-1600.webp 1600w" imagesizes="(max-width: 600px) calc(100vw - 44px), (max-width: 1640px) 91vw, 1480px" fetchpriority="high" />');
  return result.replace('</head>', `${tags.join('\n    ')}\n  </head>`);
}
async function page(file, data) { const destination = resolve(root, file); await mkdir(dirname(destination), { recursive: true }); await writeFile(destination, html(data)); }
// Renderize a estrutura pública durante a compilação. Os dados do GitHub continuam sendo consultados pelo cliente em tempo real;
// nenhum dado administrativo, credencial ou metadado inventado de repositório entra neste HTML.
const serverOutput = resolve(import.meta.dirname, '../.prerender');
await build({ build: { ssr: 'src/entry-server.jsx', outDir: serverOutput, emptyOutDir: true } });
const { renderHome } = await import(pathToFileURL(resolve(serverOutput, 'entry-server.js')).href);
await writeFile(resolve(root, 'index.html'), html({ ...homeMetadata, preload: true })
  .replace('<div id="root"></div>', () => `<div id="root">${renderHome()}</div>`));
for (const [slug, presentation] of Object.entries(projectPresentation)) {
  const name = slug === 'aether-front-end' ? 'AETHER-front-end' : slug;
  await page(`projetos/${name}/index.html`, { title: `${presentation.title} | Arthur Sgarbi`, description: projectCaseStudies[slug].summary, image: `/images/covers/${name}-1200.webp`, path: `/projetos/${name}` });
}
// Compile o painel separadamente para que seu mecanismo de roteamento de dados não faça parte do
// grafo de dependências público. A navegação administrativa mantém o comportamento de bloqueio existente.
const adminOutput = resolve(root, 'admin-assets');
await build({ base: '/admin-assets/', publicDir: false, build: { outDir: adminOutput, emptyOutDir: true, manifest: true,
  rollupOptions: { input: resolve(import.meta.dirname, '../src/admin-entry.jsx') } } });
const manifest = JSON.parse(await readFile(resolve(adminOutput, '.vite/manifest.json'), 'utf8'));
const entry = manifest['src/admin-entry.jsx'];
for (const path of ['/login', '/dashboard']) {
  const document = html({ title: 'Acesso ao painel — Arthur Sgarbi', description: 'Área de gestão do portfólio.', path, noindex: true })
    .replace(/<script type="module"[^>]*><\/script>/, `<script type="module" crossorigin src="/admin-assets/${entry.file}"></script>`)
    .replace(/<link rel="stylesheet"[^>]*>/g, '')
    .replace('</head>', `${(entry.css ?? []).map(file => `<link rel="stylesheet" href="/admin-assets/${file}" />`).join('\n')}\n</head>`);
  const destination = resolve(root, `${path.slice(1)}/index.html`);
  await mkdir(dirname(destination), { recursive: true }); await writeFile(destination, document);
}
await page('404.html', { title: 'Página não encontrada — Arthur Sgarbi', description: 'Confira o endereço ou volte para explorar os projetos.', path: '/404', noindex: true });
console.log('HTML com metadados: home, quatro estudos, login, dashboard e erro 404.');
