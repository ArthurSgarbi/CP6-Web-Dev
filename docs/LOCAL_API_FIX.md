# Correção da API local — 29/10/2026

O comando `npm run dev` iniciava somente o Vite. Sem `npm run dev:api`, o proxy
tentava acessar a porta 3001 e recebia `ECONNREFUSED`. Isso bloqueava login e
destaques. O erro de destaques era apresentado como indisponibilidade do GitHub.

O Vite agora atende `/api` diretamente, reutilizando os mesmos handlers da API
separada. Basta `npm run dev`. O modo com dois processos continua disponível
mediante `API_PROXY_TARGET` explícito. As variáveis privadas ficam no Node.js.
Os erros da interface distinguem seleção de destaques, serviço de administração
indisponível e recusa de acesso. Nenhuma senha ou política de autorização foi alterada.

Validação local:

- GitHub real: HTTP 200, 12 repositórios públicos.
- `/api/featured`: HTTP 200, quatro projetos; cards conferidos no navegador.
- Login real confirmado pelo proprietário com a senha atual.
- Sessão sem cookie: HTTP 401; API desconhecida: HTTP 404 em JSON.
- 112 testes passaram, incluindo transporte local, cookie, origem, falhas e retry.
- `npm run build` e `git diff --check` passaram.
- Nenhum valor privado de Supabase/admin encontrado nos arquivos JS de `dist/assets`.

Os testes precisaram rodar fora do isolamento devido a `EPERM` em arquivos
temporários do Vitest no Windows. A correção foi validada localmente; não houve deploy.

![Projetos carregados após a correção](local-api-restored.jpg)
