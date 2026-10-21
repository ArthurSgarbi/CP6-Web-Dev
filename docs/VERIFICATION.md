# Verificação da entrega

Verificação realizada em 21/10/2026 no navegador integrado, com Node.js 24.19.0, React 19.3.1 e Vite 7.3.7.

## Resultados observados

| Verificação | Resultado |
| --- | --- |
| Instalação das dependências | Concluída; versões exatas registradas em `package-lock.json` |
| Build de produção | `npm run build` concluído sem erros; 42 módulos transformados |
| Aplicação servida localmente | Resposta HTTP 200 em desenvolvimento e carregamento do build pelo servidor de preview |
| Layout responsivo | Inspeção visual em 320, 390, 768 e 1440 px; sem rolagem horizontal |
| Menu mobile | Abertura, Escape, retorno do foco, seleção de âncora e fechamento ao passar para o desktop conferidos |
| Navegação por âncoras | Destino, URL e foco atualizados; nenhum link interno aponta para um ID ausente |
| Atalho para conteúdo | Enter em “Skip to content” move o foco para `main` |
| Histórico | Voltar recupera a âncora anterior |
| Galeria | Imagens locais carregadas, alternativas textuais presentes e identificação como estudos visuais |
| Modal | Abertura, anterior/próximo, navegação circular, setas do teclado, botão fechar, Escape e clique no fundo conferidos |
| Foco no modal | Tab e Shift+Tab circulam entre os controles; o fechamento devolve o foco ao estudo de origem |
| Seção editorial | Expansão por clique e Enter; `aria-expanded` e painel visível permanecem coerentes |
| Console | Nenhum erro ou aviso observado nos fluxos verificados, incluindo o build de produção |
| Fonte e imagens | Manrope e cinco imagens servidas localmente; nenhuma imagem depende de uma URL externa durante o uso |
| Anonimato | Revisão do conteúdo: sem informações pessoais, clientes, depoimentos ou resultados atribuídos ao usuário; parágrafos em Lorem Ipsum |

## Movimento reduzido

O tratamento foi revisado no código: o hook consulta `prefers-reduced-motion`, acompanha mudanças na preferência e dispensa as animações de entrada. A navegação troca a rolagem suave pela imediata, e o CSS reduz transições. Essa preferência não foi emulada no navegador durante a verificação.

## Evidências visuais

- `preview-desktop.png`: hero do build de produção em viewport desktop.
- `preview-mobile.png`: hero do build de produção em viewport mobile.

Os resultados descrevem inspeção funcional e visual no navegador integrado. Não constituem uma auditoria com leitores de tela nem uma matriz de testes em Safari, Firefox e dispositivos físicos. O escopo entregue é o frontend local; não foi realizado deploy público.
