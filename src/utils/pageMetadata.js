export const siteOrigin = 'https://cp-6-web-dev-eight.vercel.app';
export const homeMetadata = {
  title: 'Arthur Sgarbi | Desenvolvimento de software',
  description: 'Arthur Sgarbi, estudante de Engenharia de Software na FIAP. Sites e aplicações para organizar informações, com projetos em React, TypeScript e desenvolvimento front-end.',
  image: '/images/portfolio-social.png', path: '/',
};

// Usado pelo navegador e pela compilação para que os rastreadores de redes sociais recebam os mesmos metadados.
export function setPageMetadata({ title, description, image = homeMetadata.image, path, noindex = false }) {
  const previous = [];
  function set(selector, tag, attributes, value, attribute = 'content') {
    let element = document.head.querySelector(selector);
    const created = !element;
    if (created) { element = document.createElement(tag); Object.entries(attributes).forEach(([key, val]) => element.setAttribute(key, val)); document.head.append(element); }
    const old = element.getAttribute(attribute);
    element.setAttribute(attribute, value);
    previous.push(() => { if (created) element.remove(); else if (old === null) element.removeAttribute(attribute); else element.setAttribute(attribute, old); });
  }
  const url = new URL(path, siteOrigin).href;
  const absoluteImage = new URL(image, siteOrigin).href;
  document.title = title;
  for (const [name, content] of Object.entries({ description, robots: noindex ? 'noindex, follow' : 'index, follow', 'twitter:title': title, 'twitter:description': description, 'twitter:image': absoluteImage })) {
    set(`meta[name="${name}"]`, 'meta', { name }, content);
  }
  for (const [property, content] of Object.entries({ 'og:title': title, 'og:description': description, 'og:image': absoluteImage, 'og:image:alt': title, 'og:url': url })) {
    set(`meta[property="${property}"]`, 'meta', { property }, content);
  }
  // Os tamanhos das capas variam por projeto; evite informar as dimensões da imagem da página inicial.
  for (const property of ['og:image:width', 'og:image:height']) {
    const element = document.querySelector(`meta[property="${property}"]`);
    if (element) { const old = element.content; element.remove(); previous.push(() => { element.content = old; document.head.append(element); }); }
  }
  set('link[rel="canonical"]', 'link', { rel: 'canonical' }, url, 'href');
  return () => previous.reverse().forEach(restore => restore());
}
