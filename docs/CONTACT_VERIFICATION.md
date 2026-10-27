# Verificação da seção Contato — 27/10/2026

## Implementação

- Última seção do `main`, `id="contato"`, imediatamente antes do footer.
- CSS isolado, Manrope e tokens existentes; nenhuma edição nos estilos das outras seções.
- Validação compartilhada no blur, submit e servidor; mensagens individuais,
  contador, labels, `aria-describedby`, `aria-invalid`, foco no primeiro inválido,
  região de resultado e controle síncrono contra submissões concorrentes.
- API Node com Supabase REST, Resend, honeypot, limites de entrada e cooldown.
- Migração SQL com reserva atômica, controle persistente de frequência, RLS e
  revogação de acesso para visitantes e usuários autenticados diretamente nas tabelas.
- `/dashboard` com login Supabase Auth e autorização por UUID validada na API,
  paginação, prévia, conteúdo completo, data e status. Token somente em memória.
- Nenhuma dependência instalada e nenhuma credencial externa criada.

## Testes executados

| Verificação | Resultado e limites |
| --- | --- |
| `npm test` | 81 testes passaram, 7 arquivos; inclui a suíte anterior |
| Temporários Windows | Primeira execução falhou com EPERM; passou com TEMP/TMP em `node_modules/.cache/contact-tests` |
| Lint | Indisponível: não há script nem configuração de lint no projeto |
| `npm run build` | Passou |
| `git diff --check` | Passou; avisos de conversão LF/CRLF em arquivos anteriores |
| Inspeção de `dist` | Nenhuma ocorrência de nomes das chaves privadas, marcadores de segredo de teste ou harness de contato |
| API HTTP local real | Mensagem curta: 422 por campo; mensagem válida sem configuração: 503 genérico; admin sem configuração: 503 |
| Fluxo frontend → API local | Formulário válido chegou ao backend e apresentou erro seguro sem limpar os dados |
| Navegador — validação | Envio vazio mostra quatro erros e foca Nome; e-mail inválido e mensagem de 14 caracteres bloqueados; foco passa ao e-mail |
| Navegador — teclado | Preenchimento com Tab e envio com Enter; foco e mensagens de campo conferidos |
| Navegador — simulações | Sucesso limpa campos após confirmação; offline e HTTP 502 preservam dados; retry após erro chega a sucesso |
| Clique duplo no navegador | Uma requisição no contador do harness; campos e botão desabilitados durante o processamento |
| Desktop 1440 px | Composição em duas colunas, sem overflow horizontal |
| Mobile 375 e 320 px | Campos em uma coluna, sem overflow horizontal; foco e botão visíveis ao navegar pelo formulário |
| Build no navegador | Preview em 4174: acesso direto e reload de `/#contato` e `/dashboard` funcionando |
| Dashboard sem sessão | Só o login é renderizado; nenhuma mensagem pública |
| Console | Sem avisos/erros JavaScript capturados no harness e no preview das rotas conferidas |

Os testes de backend simulam as respostas do Supabase e Resend. Cobrem ordem de
persistência/envio, falha do banco antes/depois do e-mail, falha do provedor,
replay confirmado, bloqueio de reserva/cooldown, autorização ausente/inválida,
usuário não autorizado e consulta autorizada. Os testes do dashboard simulam login,
consulta com token, visualização, saída e negação de acesso. Esses testes não
executam o SQL nem comprovam RLS ou concorrência em um Postgres real.

As primeiras tentativas de acesso aos servidores iniciados dentro do sandbox
sofreram bloqueio de conexão. API e preview foram reiniciados fora do sandbox;
as verificações HTTP e de preview acima foram concluídas depois disso.

## Evidências visuais

- `contact/desktop-section.png`: seção completa em desktop.
- `contact/desktop.png`: captura do preview com foco no campo Nome.
- `contact/mobile.png`: 320 px, formulário e início do rodapé.
- Harness de testes: `/src/test/browser/contact.html`, disponível apenas no dev.

## Integrações externas pendentes

O `.env` existente tem apenas `VITE_GITHUB_USERNAME` (somente os nomes foram
inspecionados). Não há configuração de Supabase, Resend ou administradores.

Portanto, **não foram testados**: aplicação da migração, gravação real, locks ou
cooldown no banco, RLS real com papéis anon/authenticated, autenticação real,
acesso autorizado real ao dashboard, envio/entrega de e-mail e deploy na Vercel.
Não houve teste com leitor de tela ou aparelho móvel físico. Preview local não
comprova deploy nem execução das funções na plataforma.

Para homologar, siga o README: aplicar SQL, cadastrar administrador, preencher
variáveis server-side e verificar domínio Resend. Em staging, enviar uma mensagem,
conferir uma única linha e recibo do provedor, receber o e-mail, provocar uma falha
e repetir após 60 segundos. Verificar negação das tabelas com anon/authenticated,
negação da API sem sessão/usuário autorizado e leitura pelo administrador.

`email_status=sent` registra aceitação pelo provedor; entrega exige confirmação
adicional. Pendências/falhas ficam consultáveis, mas não há recuperação automática
sem nova tentativa. Controles simples de spam não substituem uma política de
retenção e monitoramento conforme o volume real.

## Arquivos desta funcionalidade

Novos:

- `src/components/Contact.jsx`, `src/components/contact.css`: seção e estilos.
- `shared/contactValidation.js`: regras compartilhadas.
- `src/services/contactApi.js`: comunicação e tratamento de falhas.
- `api/contact.js`, `server/contactBackend.js`: endpoint e processamento.
- `api/admin.js`, `src/pages/DashboardPage.jsx`: autenticação e consulta.
- `server/devApi.js`: servidor local.
- `supabase/migrations/202610270001_contact.sql`: banco e permissões.
- `src/test/contact.test.jsx`, `src/test/contactBackend.test.js`,
  `src/test/contactDashboard.test.jsx`: testes automatizados.
- `src/test/browser/contact.html`, `src/test/browser/contact.jsx`: harness isolado.
- Este relatório e imagens em `docs/contact/`.

Modificados:

- `src/pages/HomePage.jsx`: import e inserção de Contato.
- `src/App.jsx`: rota administrativa carregada sob demanda.
- `vite.config.js`: proxy local de `/api`.
- `vercel.json`: impedir fallback HTML para APIs desconhecidas.
- `package.json`: comando `dev:api`.
- `.env.example`: nomes de variáveis novas, sem valores.
- `README.md`: configuração e execução.

Havia alterações anteriores em estudos de caso, testes, imagens e documentação.
Elas foram preservadas e não fazem parte desta implementação de Contato.
