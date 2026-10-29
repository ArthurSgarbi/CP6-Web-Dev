# Supabase conectado e validado

Projeto: cp6-portfolio. Região: São Paulo. Plano gratuito.

## Configuração concluída

- As migrations 202610270001_contact.sql e 202610280001_admin_dashboard.sql foram executadas em uma transação pelo SQL Editor.
- A migration adicional 202610280002_featured_safe_delete.sql foi aplicada depois do teste real: este banco exige WHERE em DELETE. A função agora restringe a substituição às posições válidas entre 0 e 3, sem desabilitar a proteção do banco.
- contact_messages, contact_rate_limits e featured_projects têm RLS ativa.
- As três tabelas não permitem SELECT de anon nem INSERT/UPDATE/DELETE de authenticated (confirmado em pg_class e has_table_privilege).
- A API REST respondeu HTTP 200 usando service_role e HTTP 401 usando anon na consulta de contact_messages.
- A API do servidor leu quatro destaques nas posições 0, 1, 2, 3 e executou admin_message_counts.
- URL, chaves existentes e UUID do único administrador foram gravados somente no .env ignorado pelo Git. Nenhuma senha foi gravada no projeto.
- O usuário proprietário existe no Supabase Auth, com e-mail confirmado.
- A API local foi reiniciada na porta 3001 e atende o site na porta 5173.
- O proxy Vite preserva explicitamente o Host (changeOrigin: false), mantendo a verificação de origem das mutações.

## Verificação real pelo site local

- Login do proprietário abriu /dashboard.
- Reload conservou a sessão autenticada pelo cookie.
- Logout voltou a /login; acesso direto subsequente a /dashboard também voltou a /login.
- Novo login abriu novamente o dashboard.
- Uma mensagem técnica temporária foi inserida para teste. A marcação como respondida persistiu após reload e nova consulta; os filtros Novas e Respondidas refletiram o estado do banco.
- Somente essa mensagem de teste foi removida ao terminar. Nenhum contato real foi utilizado.
- A ordem de destaques foi alterada pelo dashboard, salva e confirmada após reload. Depois, a seleção e ordem originais foram restauradas pelo próprio dashboard.
- A home exibiu, nesta ordem: AETHER-front-end, meu-caixa, site-projeto-shopee, anninha-site-novo.
- O botão Acessar dashboard no rodapé abriu a área administrativa com sessão válida.
- Os 100 testes Vitest passaram; build Vite passou. A correção SQL adicional foi validada diretamente no banco.

## Limites da validação

- Apenas ambiente local com banco Supabase real. Nenhum deploy foi feito.
- Resend e envio real do formulário de contato não foram configurados/verificados nesta etapa.
- Expiração natural da sessão e HTTP 403 de um segundo usuário autenticado continuam cobertos por testes simulados; não foram reproduzidos com uma segunda conta real.
- Cookies Secure em HTTPS, leitor de tela e toque físico não foram verificados em produção.

Capturas: supabase-rls-verified.png e admin-real.png.
