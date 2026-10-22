# Capas dos projetos — verificação local em 22/10/2026

Foram adicionadas quatro capas. A integração GitHub REST, os metadados, a seleção de repositórios, o fallback e todos os componentes/estilos existentes permanecem intactos. Nenhum deploy foi feito.

## Arquivos finais

Todos são PNGs reais de **1600 × 1100 px**, com os nomes e a capitalização exatos esperados por `formatRepository`.

| Arquivo em public/images | Bytes | KB (decimal) | Origem |
| --- | ---: | ---: | --- |
| meu-caixa.png | 60.975 | 60,98 | Derivada de sistema-de-gastos.png (1917 × 905) |
| site-projeto-shopee.png | 63.407 | 63,41 | Captura própria da demo pública do SYNC Mobile |
| anninha-site-novo.png | 153.854 | 153,85 | Derivada de site-pessoal-para-surpresa.png (1897 × 902) |
| ArthurSgarbi.png | 468.312 | 468,31 | Composição gráfica original, gerada com image_gen |

As capturas reaproveitadas foram reduzidas proporcionalmente sobre uma composição escura com nome e identificação de captura real. O conteúdo principal fica nos 800 px centrais para sobreviver ao `object-fit: cover` dos cards. Os originais não foram renomeados, apagados nem modificados. A moldura branca da fotografia da Anninha pertence à interface original capturada; não foi adicionada uma moldura externa.

## Pesquisa e autenticidade

- **Meu Caixa:** a imagem existente mostra explicitamente a marca Meu Caixa e sua tela inicial de finanças. O [README do repositório](https://github.com/ArthurSgarbi/meu-caixa/blob/main/README.md) confirma a aplicação de finanças pessoais.
- **Anninha:** a imagem existente corresponde ao título, mensagem, fotografia e navegação do [index.html](https://github.com/ArthurSgarbi/anninha-site-novo/blob/main/index.html). O repositório não tem README na raiz consultada.
- **Shopee:** os [metadados GitHub](https://api.github.com/repos/ArthurSgarbi/site-projeto-shopee) informam `homepage=https://site-projeto-shopee.vercel.app`, que retornou `404 DEPLOYMENT_NOT_FOUND`. Esse dado foi preservado. A árvore do repositório foi inspecionada: README, app/demo/page.tsx, public/og.png, public/favicon.svg e public/sync-mobile-logo.jpeg; não havia pasta docs nem uma coleção de screenshots de README. O [README](https://github.com/ArthurSgarbi/site-projeto-shopee/blob/main/README.md) identifica o sistema como SYNC Mobile e descreve a rota pública /demo. A publicação [sync-mobile.vercel.app/demo](https://sync-mobile.vercel.app/demo) foi aberta e conferida com o código dessa rota. Foi capturada sua interface real, sem barras de navegador, sem login e sem executar vendas. Os dados são fictícios, como a própria demo informa. A captura original está em [shopee-demo-original.png](project-images/shopee-demo-original.png), 1600 × 1100 px; o recorte usado destaca os indicadores e a tabela. O código do GitHub confirma TypeScript, Next.js, React e Tailwind; nenhuma tela foi inventada.
- **ArthurSgarbi:** proprietário e nome do repositório coincidem (`ArthurSgarbi/ArthurSgarbi`), e seu [README](https://github.com/ArthurSgarbi/ArthurSgarbi/blob/main/README.md) é uma apresentação pessoal. Ele cita HTML e Python. A capa diz “PERFIL GITHUB” e representa uma composição gráfica, não uma aplicação. Foi criada com a ferramenta image_gen e otimizada sem alterar sua proporção.

Não foram usadas imagens de terceiros obtidas na internet. As fontes foram imagens já presentes no projeto, captura do projeto do proprietário e uma composição original gerada.

## Verificação no navegador

Portfólio servido em `http://127.0.0.1:5173/`, com os dados reais da API GitHub, sem mocks para a verificação das quatro capas.

| Verificação | Desktop 1440 × 1000 | Celular 390 × 844 |
| --- | --- | --- |
| Quatro cards, fontes corretas e imagens decodificadas | OK | OK |
| Abrir modal de cada projeto (4 por viewport) | OK | OK |
| Abrir página individual de cada projeto (4 por viewport) | OK | OK |
| Imagens 1600 × 1100, sem fallback nos quatro projetos | OK | OK |
| Ausência de distorção e cortes relevantes | OK | OK |
| Ausência de rolagem horizontal | OK | OK |

Também foram abertas diretamente as quatro URLs `/images/<nome-exato>.png`. Todas retornaram imagens decodificadas, `complete=true`, `naturalWidth=1600` e `naturalHeight=1100`.

O fallback foi exercitado com o repositório real **CP6-Web-Dev**, pela rota individual, sem adicioná-lo à listagem. `public/images/CP6-Web-Dev.png` realmente não existe; `ProjectImage` carregou `/images/hero-abstract.jpg`, com texto alternativo de composição abstrata e dimensões naturais 1800 × 1368.

Os espaços das imagens permanecem definidos pelas proporções CSS nos cards e pelas alturas explícitas no modal e na página. Não foi observado salto de layout atribuível às capas durante a navegação. Isso é inspeção visual e de geometria; não é uma medição numérica de CLS ou Lighthouse.

### Evidências

- [Cards desktop](project-images/desktop-cards.jpg) e [cards celular](project-images/mobile-cards.jpg).
- [Quatro modais desktop](project-images/desktop-modals.jpg) e [quatro modais celular](project-images/mobile-modals.jpg).
- [Quatro páginas desktop](project-images/desktop-details.jpg) e [quatro páginas celular](project-images/mobile-details.jpg).
- [Fallback real](project-images/fallback-mobile.jpg).
- [Fontes, decodificação e geometria coletadas no navegador](project-images/browser-checks.json).

## Testes e build

- `npm test`: **40 testes aprovados em 2 arquivos**.
- A primeira tentativa não executou testes por `EPERM` no rename de arquivo temporário do sandbox Windows. A suíte foi repetida com `TEMP` e `TMP` apontando para `node_modules/.cache/test-temp`; nenhum código/configuração de teste precisou mudar.
- `npm run build`: **sucesso**, 112 módulos transformados, build Vite concluído.
- `git hash-object` dos dois screenshots originais e de `hero-abstract.jpg` coincide com os respectivos blobs do Git. `git diff --name-only` não aponta alteração de arquivos existentes.
- As quatro capas são inferiores a 700 KB. PNGs em paleta de 256 cores, sem distorção geométrica.
- Nenhuma dependência foi adicionada. O script de preparação usa a instalação de Sharp fornecida pelo ambiente; é uma ferramenta de preparação, não uma dependência da aplicação.

## Reprodução e limitações

O script [prepare-project-images.mjs](../scripts/prepare-project-images.mjs) aceita o caminho da capa original gerada do perfil e usa `SHARP_MODULE` opcional para localizar Sharp. Ele lê os screenshots originais e escreve somente as quatro capas finais.

O prompt completo da composição está em [profile-cover-prompt.txt](project-images/profile-cover-prompt.txt). A imagem original gerada foi preservada no diretório de imagens geradas do Codex, fora do repositório.

As capas são prévias estáticas: textos pequenos dentro dos screenshots ficam reduzidos em telas pequenas. O nome do projeto e o assunto principal permanecem visíveis; o recorte nunca deve ser apresentado como uma tela nova do sistema.

A homepage antiga da Shopee continua indisponível. O link “Acessar projeto” mantém exatamente a homepage da API, conforme o limite do pedido; somente a capa usa a publicação atual conferida. Não foi necessário alterar metadados ou componentes. Testes realizados localmente, sem validação de deploy, Lighthouse ou métricas de produção.

