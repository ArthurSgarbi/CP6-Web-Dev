# Estudos de caso — implementação e verificação local

Verificação em 23/10/2026, no fuso America/Manaus. Este documento separa o comportamento do portfólio das funcionalidades descritas nos repositórios de origem. Nenhum commit, push ou deploy foi realizado.

## Entrega e arquitetura

A seleção encontrada no código é **AETHER-front-end, meu-caixa, site-projeto-shopee e anninha-site-novo**. ArthurSgarbi não integra a seleção atual. O filtro em `formatRepository.js` foi preservado.

Uma única rota `/projetos/:repositoryName` usa o template `ProjectDetailsPage`. Cada estudo inclui abertura, capa, contexto/problema/objetivo/público, desafios, seis etapas, arquitetura, funcionalidades, galeria, resultados observáveis, aprendizados técnicos, propostas de evolução e fontes. Papel e duração sem comprovação permanecem identificados.

| Responsabilidade | Arquivos |
| --- | --- |
| Composição da rota, estados e SEO | `src/pages/ProjectDetailsPage.jsx` |
| Estilos exclusivos da rota | `src/pages/project-case-study.css` |
| Conteúdo e fontes dos quatro estudos | `src/data/projectCaseStudies.js` |
| Cabeçalho e metadados da API | `ProjectHero.jsx` |
| Contexto e metadados editoriais | `ProjectOverview.jsx` |
| Seções, etapas e arquitetura | `CaseSection.jsx`, `ProjectProcess.jsx`, `ProjectArchitecture.jsx` |
| Desafios, funcionalidades, resultados e evolução | `ProjectNarrative.jsx` |
| Galeria, placeholders e diálogo nativo | `ProjectGallery.jsx` |
| Links anterior/próximo e coleção | `ProjectNavigation.jsx`, `src/hooks/useProjectNavigation.js` |

Todos os componentes acima ficam em `src/components/project-details/`, salvo os caminhos especificados. `ProjectImage.jsx` recebeu apenas um parâmetro opcional de loading: a capa da página usa eager; home e modal mantêm lazy como padrão. O CSS global, a home, header, carrossel, seleção e services não foram modificados.

O modelo editorial contém `eyebrow`, `headline`, `summary`, `coverCaption`, `context`, `problem`, `objective`, `audience`, `role`, `duration`, `process`, `architecture`, `features`, `challenges`, `results`, `learnings`, `nextSteps`, `gallery`, `sources` e `pending`. O campo `gallery[].pending` identifica arquivo ainda ausente; `pending` do estudo lista informações a confirmar. Nome, descrição, linguagem, tópicos, atualização, estrelas e URLs de ação vêm da API.

A lista/cache existente também determina os vizinhos na ordem da home. Em acesso direto sem cache há uma consulta do detalhe e uma da listagem (ou mais páginas se a API paginar). A segunda é necessária para conhecer a ordem atual; não é duplicação do endpoint de detalhe. Navegar da home com cache recente ou entre vizinhos reaproveita os dados. Erro da listagem omite os vizinhos sem inventar uma ordem.

A rota, o conteúdo e o CSS continuam sob demanda. Não há dependência nova. Título segue `Nome | Arthur Sgarbi`, descrição é atualizada e restaurada, e canonical usa o origin atual. São metadados de uma SPA no navegador, sem garantia de pré-renderização para robôs sociais.

## Conteúdo e imagens

| Estudo | Conteúdo comprovável | Imagem adicional real |
| --- | --- | --- |
| AETHER | Portal institucional HTML/CSS, seis páginas e auditoria estática simulada | `AETHER-front-end/01-portal.webp`, 1901 × 911, 111.220 bytes |
| Meu Caixa | Regras financeiras, camadas Next.js/Clerk/Neon e estratégia de testes versionada | `meu-caixa/01-visao-geral.webp`, 1917 × 905, 63.892 bytes; tela de acesso, sem dashboard autenticado |
| SYNC Mobile | Gestão manual, pedidos/entregas, autenticação e demo isolada com dados fictícios | `site-projeto-shopee/01-demo.webp`, 1600 × 1100, 75.318 bytes |
| Anninha | Página estática, contador, filtro por ano e ampliação de fotos | `anninha-site-novo/01-pagina-pessoal.webp`, 1897 × 902, 129.686 bytes |

Os caminhos acima têm prefixo `public/images/projects/`. Os WebP foram derivados proporcionalmente dos originais já existentes; não foram inventadas novas telas. As quatro capas PNG permanecem intactas. A origem e os limites de cada captura estão em [CASE_STUDY_CONTENT.md](CASE_STUDY_CONTENT.md).

Faltam estes quatro arquivos, apresentados como placeholders explícitos, sem solicitar um arquivo conhecido como ausente:

- `public/images/projects/AETHER-front-end/02-responsivo.webp`
- `public/images/projects/meu-caixa/02-responsivo.webp`
- `public/images/projects/site-projeto-shopee/02-responsivo.webp`
- `public/images/projects/anninha-site-novo/02-responsivo.webp`

Cada galeria possui atualmente uma captura disponível. A navegação entre várias imagens é suportada pelo componente e exercitada com duas imagens reais distintas no harness de teste; não se repetiu uma captura para preencher os estudos. Textos alternativos, legendas, dimensões e lazy loading estão declarados. `onError` também oferece fallback para falhas não previstas.

## Validação executada

- **67 testes aprovados, em 4 arquivos**: os testes antigos foram preservados; três expectativas de acesso direto foram atualizadas para a consulta necessária da ordem. Cobertura de estados, quatro estudos, ausência editorial, etapas, links, foco, diálogo, imagens ausentes, vizinhos, recarregamento e compartilhamento no StrictMode.
- `npm run build`: sucesso, **124 módulos**. JavaScript inicial 329,63 kB (103,90 kB gzip); rota de detalhes aproximadamente 56 kB (16,94 kB gzip) e CSS exclusivo 8,99 kB (2,35 kB gzip). Tamanhos de bundle não são resultado de Lighthouse.
- `git diff --check`: aprovado. Há somente aviso de normalização LF/CRLF do Git, sem erro de whitespace.
- O Vitest encontrou a restrição EPERM do temporário padrão do Windows. A execução final usou TEMP/TMP em `node_modules/.cache/test-temp`, já ignorado pelo Git.
- Aplicação iniciada em `http://127.0.0.1:5180/`. As quatro páginas abriram com a API real, inclusive após atualização direta. Retornar à coleção preservou `/#work`. Histórico voltar/avançar entre Meu Caixa e Shopee conferido.
- As quatro galerias abriram no diálogo nativo, exibiram imagens decodificadas, receberam foco no botão fechar e devolveram foco ao acionador após Escape. Enter, Tab e botão fechar também foram conferidos.
- Repositório real `CP6-Web-Dev` sem editorial abriu mensagem neutra, dados da API e fallback abstrato da capa; não foi tratado como 404.
- Loading, erro da API, nova tentativa e404 foram exercitados no harness com metadados explicitamente simulados. O404 não ofereceu retry; o erro da API ofereceu. A recuperação voltou a apresentar o estudo.
- Console do fluxo com API real retornou lista vazia de erros/avisos. O harness contém um arquivo ausente intencionalmente para testar onError; esse caso é separado da aplicação real.

### Cache, diálogo e preview de produção

O harness final confirmou, no navegador interno, **1 consulta de detalhe durante loading e 2 após o sucesso direto** (1 detalhe + 1 lista). Partindo da home, abrir o estudo manteve **1 consulta total**. Com duas capturas distintas, Shift+Tab/Tab fecharam o ciclo de foco, a seta direita anunciou “Imagem 2 de 2”, o botão anterior voltou a “Imagem 1 de 2” e Escape devolveu foco ao acionador. Um arquivo intencionalmente inexistente foi substituído pelo placeholder e excluído da navegação. Os dados desse fluxo são simulados e identificados no harness. Evidência: [harness-checks.json](case-studies/harness-checks.json).

O build também foi servido em `http://127.0.0.1:4180/`. A rota direta `/projetos/meu-caixa` continuou funcionando após reload; a galeria decodificou a captura de 1917 px no diálogo, e o console do preview retornou `[]` para erros/avisos. Não houve publicação. [Lightbox do build](case-studies/production-lightbox.jpg), [galeria e pendência em 320 px](case-studies/gallery-and-placeholder-320.jpg) e [pendência em desktop](case-studies/gallery-and-placeholder-1440.jpg).

### Responsividade e continuidade visual

As quatro páginas foram verificadas em **320, 375, 768, 1024 e 1440 px**, e comparadas com a home nas mesmas larguras. A barra de rolagem reservada ocupa 15 px: por exemplo, 320 px de viewport resultaram em 305 px de conteúdo. `scrollWidth` coincidiu com `clientWidth` em todas as medições; não houve overflow horizontal. Os controles novos medidos tinham pelo menos 44 × 44 px.

A inspeção confirmou Manrope, papel `#f3f2ed`, texto escuro, ação verde-lima, títulos fluidos, colunas que empilham, screenshots com contain e processo em faixa contínua `#242820`. Não existe DESIGN.md neste checkout; CSS e interface existentes foram a referência. Nenhum token global foi alterado.

Contrastes calculados pela luminância relativa WCAG: texto principal/papel 13,78:1; texto secundário/papel 4,98:1; oliva/papel 5,11:1; descrição do processo/fundo 9,34:1; verde-lima/fundo escuro 11,44:1; foco oliva/papel 4,87:1. A regra global de movimento reduzido continua aplicável; a preferência do sistema não foi alterada.

Evidências: [medições das quatro páginas](case-studies/browser-checks.json), [responsividade](case-studies/responsive-checks.json), [comparação da home](case-studies/home-comparison.json), [recarregamento](case-studies/direct-reload.json), [home 320](case-studies/home-320.jpg), [home 1440](case-studies/home-1440.jpg), [Meu Caixa 320](case-studies/meu-caixa-320.jpg), [Shopee 375](case-studies/site-projeto-shopee-375.jpg), [processo 1440](case-studies/process-1440.jpg) e [lightbox 320](case-studies/lightbox-320.jpg). A pasta contém as quatro aberturas em todas as cinco larguras.

### Links externos

Os quatro repositórios abriram no GitHub. O link do Meu Caixa fornecido pela API carregou a página pública de acesso. Não foi realizado login. O endereço de Shopee fornecido pela API retornou **404 DEPLOYMENT_NOT_FOUND**. O link foi preservado, pois o portfólio continua usando a homepage da API. AETHER e Anninha não tinham homepage na resposta e, portanto, não exibiram esse botão. Evidências em [external-links.json](case-studies/external-links.json).

## Pendências e limites

O proprietário precisa confirmar papel individual, colaboradores, duração, origem/pesquisa e sequência histórica dos projetos; critérios de aceite, testes com usuários e resultados medidos, caso existam. AETHER precisa de evidências separadas para o ecossistema embarcado; Meu Caixa e SYNC Mobile precisam de validação atual das suítes e serviços externos; Anninha precisa de validação completa de teclado/foco do produto original. A lista específica por projeto está no campo pending e em CASE_STUDY_CONTENT.md.

Não foram executadas as aplicações externas autenticadas nem suas suítes. Não foram medidos Lighthouse, CLS ou dados de produção. Não houve auditoria com leitor de tela, aparelho físico, Safari ou Firefox. As capturas disponíveis são evidências estáticas da versão registrada, não prova do estado atual de todas as telas dos produtos.

A hospedagem Vercel não foi alterada nem testada por um novo deploy. A disponibilidade do GitHub e sua cota pública continuam externas ao portfólio. Nenhuma etapa dependeu de credenciais no frontend.


## Inventário das alterações

Arquivos existentes modificados: `README.md`, `docs/GITHUB_VERIFICATION.md`, `src/pages/ProjectDetailsPage.jsx`, `src/components/ProjectImage.jsx`, `src/test/projects.test.jsx` e `src/test/browser/main.jsx`.

Arquivos novos: os oito componentes da tabela de arquitetura, `src/pages/project-case-study.css`, `src/data/projectCaseStudies.js`, `src/hooks/useProjectNavigation.js`, `src/test/caseStudies.test.jsx`, `src/test/projectGallery.test.jsx`, `src/test/browser/CaseGalleryHarness.jsx`, `scripts/prepare-case-study-images.mjs`, `docs/CASE_STUDY_CONTENT.md`, este relatório, quatro WebP em `public/images/projects/` e evidências em `docs/case-studies/`. Nenhum arquivo de dependência ou configuração de hospedagem foi modificado.
