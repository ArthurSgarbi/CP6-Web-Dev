import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { projectPresentation } from '../src/utils/formatRepository.js';
import { projectCaseStudies } from '../src/data/projectCaseStudies.js';
import { homeMetadata, siteOrigin } from '../src/utils/pageMetadata.js';

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
await page('index.html', { ...homeMetadata, preload: true });
for (const [slug, presentation] of Object.entries(projectPresentation)) {
  const name = slug === 'aether-front-end' ? 'AETHER-front-end' : slug;
  await page(`projetos/${name}/index.html`, { title: `${presentation.title} | Arthur Sgarbi`, description: projectCaseStudies[slug].summary, image: `/images/covers/${name}-1200.webp`, path: `/projetos/${name}` });
}
for (const path of ['/login', '/dashboard']) await page(`${path.slice(1)}/index.html`, { title: 'Acesso ao painel — Arthur Sgarbi', description: 'Área de gestão do portfólio.', path, noindex: true });
await page('404.html', { title: 'Página não encontrada — Arthur Sgarbi', description: 'Confira o endereço ou volte para explorar os projetos.', path: '/404', noindex: true });
console.log('HTML com metadados: home, quatro estudos, login, dashboard e erro 404.');
