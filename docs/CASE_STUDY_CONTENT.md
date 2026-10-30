# Conteúdo editorial dos estudos de caso

Fontes públicas consultadas em 23/10/2026 pelo conector GitHub, na branch padrão `main`. A revisão de 29–30/10/2026 preserva esses registros e reorganiza a apresentação pública. O conteúdo em `src/data/projectCaseStudies.js` complementa os metadados da API. `src/utils/formatRepository.js` define nomes, descrições e um destino editorial verificado; identificador, URL do repositório, linguagem, datas, estrelas e tópicos continuam vindo do GitHub. A descrição original permanece em `repositoryDescription`.

## Formato público atual

- As páginas continuam curtas, com apenas **Sobre o projeto** e **O desafio**. Contexto, problema, decisão, implementação, evidência e limites ficam dentro dessas seções.
- Nomes de apresentação: Meu Caixa, SYNC Mobile — Gestão de loja, AETHER — Portal institucional e Memórias a dois. Os slugs e repositórios não foram renomeados.
- Contribuição individual fica explicitamente em preparação, separada da finalidade do projeto. As durações específicas sem confirmação foram retiradas. Não se atribuem responsabilidades ou relatos pessoais de aprendizado sem evidência.
- SYNC Mobile aponta para `https://sync-mobile.vercel.app/demo`, com a ação **Abrir demonstração**. O endereço abriu no navegador em 30/10/2026; os exemplos são fictícios e a operação do produto é manual, sem sincronização com a Shopee.
- A imagem principal usa a primeira captura real disponível da galeria, com legenda honesta. Meu Caixa ainda mostra a tela pública de acesso; não é apresentada como painel financeiro autenticado.
- As páginas terminam com retorno aos projetos e contato. Zero estrelas deixa de ocupar espaço; metadados úteis permanecem.
- Componentes de galeria ampliada e seções antigas continuam como material reutilizável, com cobertura de testes/harness. Não voltaram à composição pública. Os critérios históricos abaixo se aplicam a esse material de pesquisa, e não significam que todas as seções sejam exibidas.

## Critérios de escrita

- As seis etapas representam uma leitura técnica dos arquivos disponíveis. Não são um diário, uma cronologia ou comprovação de que houve discovery, pesquisa, testes de uso ou um método específico de trabalho.
- Decisões descrevem escolhas observáveis no código. Desafios são problemas técnicos identificáveis; soluções apontam os mecanismos encontrados, sem atribuir uma intenção histórica não documentada.
- Resultados descrevem entregáveis presentes. Aprendizados são conclusões técnicas desta leitura, sem atribuir relatos pessoais ao proprietário.
- Próximos passos são propostas, identificadas como tal. Não representam compromissos do autor nem funcionalidades existentes.
- Papel individual e duração dependem de confirmação do proprietário. A página atual sinaliza contribuição em preparação e omite duração; datas de fotografias, do contador ou da API não são duração do projeto.
- Suítes dos projetos de origem foram inspecionadas, não executadas nesta revisão editorial. Testes do portfólio não comprovam funcionamento dos produtos externos.
- Não foram pesquisadas métricas comerciais, números de usuários, receita ou ganhos de performance. Nenhum desses resultados é atribuído aos produtos.

## Evidências por projeto

| Projeto | Arquivos consultados | Limite relevante |
| --- | --- | --- |
| AETHER-front-end | `readme.md`, `index.html`, `problema.html`, `tecnologia.html`, `objetivos.html`, `logs.html`, `style.css`, árvore raiz | Frontend institucional HTML/CSS. Edge Computing, C/C++, rádio e retenção de dados são descritos pela proposta; não estão implementados neste repositório. A auditoria é uma tabela estática explicitamente simulada. |
| meu-caixa | `README.md`, `app/chatgpt-auth.ts`, `app/api/transactions/route.ts`, `lib/finance-calculations.ts`, `db/index.ts`, `tests/tenant-security.test.mjs`, árvore recursiva | A consulta confirma autorização por proprietário, valores em centavos e testes com PGlite. Não confirma execução atual da suíte, login real, cotações ou resposta do provedor de IA. Contas bancárias são manuais. |
| site-projeto-shopee | `README.md`, `app/demo/page.tsx`, `db/index.ts`, `lib/records.ts`, `lib/records-api.ts`, `lib/auth.ts`, `tests/security-integration.mjs`, árvore recursiva | Produto identificado no README como SYNC Mobile. Sem sincronização Shopee/transportadoras. Demo usa exemplos e estado local. LibSQL pode usar arquivo local ou Turso; configuração remota não comprova deploy. |
| anninha-site-novo | `index.html`, `script.js`, `styles.css`, árvore raiz | Sem README na raiz consultada. Contador, filtros e ampliação existem no código. Retorno de foco existe, mas não foi comprovado um ciclo completo de foco ou uso com leitor de tela no produto original. |

Os links de fonte ficam no campo `sources` de cada estudo e levam aos arquivos específicos. Eles não são usados como links de deploy. As fontes seguem `main` e podem evoluir; esta é uma interpretação da versão consultada na data acima.

### Identificadores de alguns arquivos consultados

| Arquivo | Blob SHA retornado pelo GitHub |
| --- | --- |
| AETHER-front-end/readme.md | `fb2ccbe71ae4dfa0eaa884045870577c8a0f8f6c` |
| AETHER-front-end/index.html | `7f53ee7114937ec1c61d9f043e72819b4c38d290` |
| meu-caixa/README.md | `f77666b38ea19451ec074425ff3e1761f07d5882` |
| site-projeto-shopee/README.md | `40866be8dfe4b504a13ae4f870aa36e748de4643` |
| anninha-site-novo/index.html | `3494bf04474d02de3f446d65d8ae674c58462b06` |
| anninha-site-novo/script.js | `88d1cd148b5cf1eb7f910c2fedbf7dd5d0e7aadb` |

Esses identificadores documentam o conteúdo retornado, sem afirmar que os repositórios permanecerão na mesma versão.

## Galerias e autenticidade das imagens

Os quatro originais abaixo foram abertos e inspecionados durante esta revisão. Nenhuma tela nova foi inventada. As cópias WebP mantêm proporção e conteúdo; sua preparação é feita separadamente da escrita editorial.

| Origem local real | Caminho de galeria | Dimensões do original | Conteúdo |
| --- | --- | --- | --- |
| `public/images/AETHER-front-end.png` | `/images/projects/AETHER-front-end/01-portal.webp` | 1901 × 911 | Página institucional, com menu e fotografia de satélite. |
| `public/images/sistema-de-gastos.png` | `/images/projects/meu-caixa/01-visao-geral.webp` | 1917 × 905 | Tela pública de acesso; o nome do arquivo de destino não implica visão geral autenticada. |
| `docs/project-images/shopee-demo-original.png` | `/images/projects/site-projeto-shopee/01-demo.webp` | 1600 × 1100 | Demo com dados fictícios, avisos, indicadores e tabela. Os valores não são resultados comerciais. |
| `public/images/site-pessoal-para-surpresa.png` | `/images/projects/anninha-site-novo/01-pagina-pessoal.webp` | 1897 × 902 | Abertura da página pessoal com texto e fotografia existentes. |

As capas `meu-caixa.png`, `site-projeto-shopee.png` e `anninha-site-novo.png` são composições que incluem capturas reais, conforme `docs/PROJECT_IMAGES.md` e `scripts/prepare-project-images.mjs`; não são novos screenshots integrais das aplicações. `AETHER-front-end.png` já é uma captura da página. Os cartões e prévias mantêm essas capas; a página completa usa a primeira captura não pendente e sua própria legenda. `coverCaption` fica como alternativa quando não existe captura disponível. A antiga composição do perfil `ArthurSgarbi.png` não faz parte destes quatro estudos.

Cada galeria reserva ainda `/images/projects/<nome-exato>/02-responsivo.webp`. Esses quatro arquivos estão pendentes: os itens possuem `pending: true`, legenda `[Imagem a adicionar]` e alt descritivo. Esse booleano pertence ao item da galeria e é diferente do array `pending` do estudo, que reúne informações a confirmar. O componente deve renderizar o placeholder diretamente para `pending: true`, sem criar uma imagem nem solicitar o caminho à rede; portanto, a pendência editorial não precisa provocar um HTTP 404. As dimensões 780 × 1688 são o espaço planejado para a captura, não uma medição de imagem existente. Ao inserir a captura real, remover `pending` ou defini-lo como `false`, conferir as dimensões e substituir legenda e texto alternativo.

Para Meu Caixa, a imagem extra deve usar somente dados fictícios em área autenticada. Para os demais, registrar navegação/tabela/galeria real em tela estreita. Não reutilizar a capa três vezes para aparentar uma coleção de screenshots.

## Informações que o proprietário precisa confirmar

O campo `pending` preserva o inventário interno abaixo. A página curta não renderiza esse inventário completo: mostra a contribuição em preparação e as limitações relevantes. Novas evidências devem ser verificadas antes de substituir os textos:

- Papel individual, divisão de responsabilidades, colaboradores e duração dos quatro projetos. O AETHER identifica participantes no README, mas não detalha a contribuição individual.
- Origem da ideia, pesquisa, sequência real das decisões e metodologia adotada, caso se deseje narrar o processo histórico.
- Critérios de aceite, testes com usuários, feedback e resultados medidos, caso existam.
- AETHER: evidências do ecossistema embarcado e validação do portal em celular.
- Meu Caixa: execução atual da suíte, serviços externos e capturas das áreas autenticadas com dados fictícios.
- SYNC Mobile: execução atual dos testes, entrega real de e-mail e capturas administrativas com dados fictícios.
- Anninha: validação completa de teclado/foco, leitor de tela, limites do contador e captura da galeria em celular.
- As quatro capturas `02-responsivo.webp` ainda precisam ser produzidas. Nenhum histórico de deploy ou desempenho foi inferido dessas imagens.
