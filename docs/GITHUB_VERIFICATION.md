# Atualização — estudos de caso em 23/10/2026

Foram implementados estudos para a seleção realmente encontrada no código: **AETHER-front-end, meu-caixa, site-projeto-shopee e anninha-site-novo**. A seleção e a home foram preservadas. As seções abaixo registram a verificação histórica de 22/10/2026 e não substituem esta atualização.

- 67 testes aprovados em 4 arquivos; build aprovado com 124 módulos; diff-check sem erros.
- Quatro rotas reais e reload direto conferidos no navegador; galeria, Escape, foco e histórico verificados.
- Responsividade e comparação com a home em 320, 375, 768, 1024 e 1440 px, sem overflow nas medições.
- Quatro capturas reais adicionais em WebP e quatro capturas de celular explicitamente pendentes.
- A navegação entre projetos reutiliza a lista/cache da home. Acesso direto consulta detalhe e lista para obter a ordem, sem duplicar o endpoint de detalhe.
- A homepage de Shopee retornou 404 DEPLOYMENT_NOT_FOUND; o endereço vindo da API foi preservado. Meu Caixa abriu a tela pública de acesso.
- Nenhum commit, push, deploy, Lighthouse ou teste das áreas externas autenticadas foi realizado.

O inventário de arquivos, fontes, imagens, evidências e limitações está em [CASE_STUDY_VERIFICATION.md](CASE_STUDY_VERIFICATION.md) e [CASE_STUDY_CONTENT.md](CASE_STUDY_CONTENT.md). O README explica como cadastrar e manter os estudos.

---

# Verificação da integração GitHub

Realizada em **22/10/2026**, no Windows, com Node.js 24.19.0, React 19, Vite 7.3.7, TanStack Query 5.104.5, React Router DOM 7.18.4 e Vitest 4.1.12. Este relatório descreve a integração atual; `VERIFICATION.md` registra a versão anterior.

História verificada: abrir o portfólio → consultar repositórios públicos → filtrar e transformar dados → renderizar cards → abrir e navegar no modal → acessar a página individual → recarregar sem cache.

## Atualização da seleção de projetos

Ainda em 22/10/2026, a pedido do proprietário, a listagem passou a exibir somente `meu-caixa`, `site-projeto-shopee`, `anninha-site-novo` e `ArthurSgarbi`. O navegador confirmou exatamente esses quatro cards, mantendo os metadados da API e a ordenação por atualização. A seleção é aplicada antes da renderização e também limita os itens disponíveis na navegação do modal.

Após essa alteração, **40 testes passaram** e `npm run build` concluiu com sucesso em 5,63 segundos. O JavaScript inicial ficou em 323,31 kB, ou 101,98 kB gzip. A [captura da seleção atualizada](github-selected-projects.png) registra essa versão. Os números e capturas da seção abaixo correspondem à verificação inicial da integração, antes dessa seleção.

## Verificações executadas

| Verificação | Resultado e evidência |
| --- | --- |
| Testes | `npm test`: **38 testes aprovados em 2 arquivos**, execução final em 8,29 segundos |
| Lint | Não executado: o projeto não possui script nem configuração de lint |
| Build | `npm run build`: sucesso, 112 módulos transformados, 2,96 segundos |
| JavaScript inicial | 323,19 kB; **101,93 kB gzip**, conforme Vite |
| CSS | 27,99 kB; 6,70 kB gzip |
| Código sob demanda | Detalhes: 1,70 kB; página 404: 0,83 kB, antes de gzip |
| Dependências | Instalação final informou **0 vulnerabilidades**; a primeira versão instalada do Vitest foi substituída pela 4.1.12 corrigida |
| HTTP local | Preview: `/` e `/projetos/meu-caixa` responderam **200 text/html**; `/images/hero-abstract.jpg` respondeu **200 image/jpeg** |
| API real | Página inicial mostrou **9 repositórios elegíveis de ArthurSgarbi** no momento da inspeção |
| Cards | Nome, descrição, linguagem e data reais; índice por posição; links individuais; imagens de fallback quando não havia PNG correspondente |
| Modal | Projeto correto, metadados, anterior/próximo, setas, fechamento por Escape, botão e fundo conferidos no navegador |
| Foco | Foco inicial no botão fechar; Shift+Tab leva ao último controle; Tab retorna ao primeiro; fechamento devolve o foco ao acionador |
| Links | Código e homepage vieram dos dados; homepage ausente ocultou o botão; links externos com `noopener noreferrer` |
| Rota individual | `/projetos/meu-caixa` abriu por navegação e continuou exibindo os dados reais após atualizar o navegador, em desenvolvimento e no preview de produção |
| 404 real | `/projetos/repositorio-inexistente-cp6-verificacao` mostrou a página “Repositório não encontrado”, consultando o GitHub real |
| Loading simulado | Quatro skeletons, `aria-busy=true`, anúncio de carregamento e uma requisição no contador do harness; liberar a resposta exibiu o card |
| Erro e limite simulados | Mensagens distintas para indisponibilidade e limite temporário; recuperar a API e clicar em “Tentar novamente” exibiu os dados, com duas requisições no total |
| Vazio simulado | Mensagem correta para resposta vazia e para lista composta apenas de forks/arquivados, sem mensagem de erro |
| Desktop | Inspeção em **1440 × 1000**; largura do conteúdo 1425 px, sem overflow horizontal |
| Mobile | Cards, modal e detalhes em **390 × 844**; largura do conteúdo 375 px. Erro, vazio e 404 também inspecionados em **320 × 780**, com conteúdo de 305 px |
| Console | Consulta dos logs de erro/aviso do navegador retornou `[]` nos fluxos finais do preview e do harness |
| Tokens | Varredura de 31 arquivos da aplicação/build: **0 padrões de tokens GitHub**, 0 referências de código a `VITE_GITHUB_TOKEN` |
| Isolamento dos testes | Bundle sem `portfolio-owner`, `projeto-de-teste` ou “API simulada”; o harness não foi incluído no build |
| Git | `.env` e `.env.local` confirmados como ignorados; `.env.example` contém somente o nome público de usuário; `git diff --check` sem erros de whitespace |

O preview foi iniciado para a inspeção e encerrado ao final. O servidor de desenvolvimento já existente em `127.0.0.1:5173` foi preservado.

## Suíte automatizada

`src/test/githubApi.test.js` verifica endpoint/Accept sem autenticação, detalhe, paginação, falha sem dados parciais, HTTP 403/404/429/503, limite secundário, rede, configuração ausente, contrato/JSON inválido, filtragem, ordenação, fallbacks, homepage segura e datas.

`src/test/projects.test.jsx` verifica carregamento, sucesso, vazio original e após filtragem, erro, retry manual e automático limitado, seleção correta, dados/links do modal, navegação e foco, remoção do projeto selecionado, imagem sem loop, deduplicação no StrictMode e entre seções/modal/detalhe, movimento reduzido, âncoras, acesso direto sem consulta paralela da listagem, remontagem sem cache e páginas 404.

Os testes fazem mock de `fetch`, sem depender da rede do GitHub. O jsdom recebe uma implementação mínima de `showModal/close`; o comportamento nativo do diálogo também foi verificado no navegador.

## Evidências visuais

- [Projetos reais em desktop](github-projects-desktop.png).
- [Projetos reais em celular](github-projects-mobile.png).
- [Modal com dados reais em celular](github-modal-mobile.png).
- [Página individual após reload](github-details-mobile.png).
- [Lista vazia simulada em 320 px](github-empty-mobile.png).

O harness reproduzível fica em `/src/test/browser/index.html`, acessível pelo servidor de desenvolvimento. Sua faixa identifica claramente que os dados são simulados.

## Limites da validação

- Não foi realizado deploy. `vercel.json` foi preparado com prioridade para arquivos estáticos e fallback da SPA; o roteamento da hospedagem Vercel ainda precisa ser confirmado após um deploy autorizado. O reload local foi validado no Vite e no preview.
- Não foi executado Lighthouse nem medido um novo score mobile. Os tamanhos acima são do build; não equivalem a uma medição de Core Web Vitals.
- Não houve auditoria com leitor de tela, Safari, Firefox ou aparelho físico. A inspeção visual usou o navegador integrado e viewports emulados.
- Movimento reduzido foi verificado no teste automatizado com `matchMedia` simulado e nas regras CSS; a preferência do sistema operacional não foi alterada.
- As imagens disponíveis atualmente têm nomes diferentes dos repositórios; o fallback se repete. Imagens específicas podem ser adicionadas seguindo a convenção documentada no README.
- Cache em memória não sobrevive a reload. Disponibilidade e limite da API pública continuam sendo dependências externas.
