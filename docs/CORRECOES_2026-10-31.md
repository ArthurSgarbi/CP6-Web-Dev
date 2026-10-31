# Correções da auditoria de 31/10/2026

Publicação: https://cp-6-web-dev-eight.vercel.app/  
Deployment final: `dpl_wierQhqeK8oMkcUseCcMxXhtDu5d`, Production, READY. As correções funcionais foram verificadas em `dpl_Etof5ebyuEfypk91ysmvZM7ksSVD`; a publicação final acrescenta a contribuição individual confirmada pelo proprietário.

As alterações estão no checkout local e foram publicadas diretamente pela API da Vercel. Não foi criado commit nem realizado push. O pacote publicado contém fontes e arquivos públicos; não contém `.env` nem credenciais locais. As variáveis privadas foram configuradas separadamente como segredos no servidor, apenas em Production.

## Falhas corrigidas

| Auditoria | Correção | Evidência de aceite |
| --- | --- | --- |
| F01 — contato retornava 503 | Configuradas as variáveis Supabase no projeto Vercel correto | Formulário real retornou 200 e mostrou sucesso em celular emulado. Confirmado um registro com o requestId do teste no banco, com status `new`. |
| F02 — painel retornava 503 | Configuradas URL, chave anônima, chave de serviço e lista de administradores | Tabelas acessíveis; usuário administrador existente e confirmado. APIs de sessão e mensagens devolvem 401 para visitante sem sessão. **Login real e operações autenticadas ainda precisam de validação com a conta do proprietário.** |
| F03 — login direto ocultava erro de sessão | Feedback usa o erro atual da sessão, com botão para repetir a consulta | Testado 503 na abertura direta e recuperação para 401; a mensagem desaparece quando o serviço se recupera, sem apresentar 401 como falha de infraestrutura. |
| F04 — robots.txt devolvia HTML | Criado arquivo estático com política de rastreamento e sitemap | Produção retorna 200 e `text/plain`; auditoria robots-txt passou; SEO 100. |
| F05 — URLs inválidas retornavam 200 | Build gera documentos para as rotas válidas e 404.html; fallback devolve status 404 | Dois caminhos inexistentes retornam 404 e exibem a interface de erro com noindex. Home, login, dashboard e quatro estudos retornam 200. |
| F06 — role incompatível no carrossel | Preservada a semântica nativa de figure/figcaption, nome do slide e posição | Regra axe aria-allowed-role sem violações em 8 combinações de tamanho/tema; navegação por teclado e suíte do carrossel passaram. |

O painel não usa a chave de serviço para simular o login do proprietário. A checagem de persistência leu apenas o registro identificado como teste técnico. A mensagem de teste foi mantida para conferência posterior no painel. Resend não foi configurado: o contato chega ao banco, mas a notificação por e-mail não é utilizada.

## Melhorias implementadas

- **M01:** quatro capas convertidas em WebP de 480, 800 e 1200 px, com srcset/sizes, decodificação assíncrona e fallback preservado. A maior versão do AETHER passou de 656.860 bytes para 45.580 bytes. Os originais foram preservados. A estimativa de economia adicional de imagens do Lighthouse caiu de 716 KiB na auditoria para 25 KiB na nova medição.
- **M02, parcialmente:** preload responsivo da primeira imagem do carrossel no HTML da home; leitura de dimensões em lote no efeito de entrada dos elementos para evitar alternar leituras e escritas de layout. Ainda existe oportunidade de reduzir trabalho JavaScript inicial. Não foi feita uma reescrita do roteador ou renderização do conteúdo React no servidor.
- **M03:** sitemap XML estático com home e quatro estudos; login e painel ficam fora do mapa. Produção retorna application/xml.
- **M04:** build gera título, descrição, URL canônica e metadados Open Graph/Twitter específicos para cada estudo, disponíveis no HTML inicial. Navegação no cliente atualiza os mesmos campos. Login, painel e erro recebem noindex. O build gera metadados estáticos; não pré-renderiza o conteúdo React completo dos estudos.
- **M05:** o proprietário confirmou em 31/10/2026 desenvolvimento individual de Meu Caixa, SYNC Mobile e Memórias a dois, e responsabilidade por toda a implementação em JavaScript no AETHER, desenvolvido em equipe. Os quatro campos de contribuição foram atualizados com esse escopo, sem atribuir resultados mensurados ou outras responsabilidades não confirmadas.

Os quatro estudos publicados são as rotas de projeto reconhecidas no servidor. Ao adicionar outro estudo, incluir sua apresentação no catálogo, os metadados do build, a rota e o sitemap; uma rota nova não deve depender do antigo fallback universal 200.

## Validação

- Build local e build da Vercel concluídos.
- Suíte final completa: 146/146 testes passaram; regressões direcionadas do login e carrossel: 29/29. Resultado salvo junto às evidências externas. A atualização editorial posterior recebeu validação direcionada dos estudos (18/18) e novo build na Vercel.
- Chromium automatizado local e em produção: 320, 390, 768 e 1440 px, temas claro e escuro, imagens carregadas, sem overflow horizontal, teclado do carrossel, feedback do login e metadados dos quatro estudos.
- HTML inicial conferido por requisições HTTP, incluindo Content-Type, status e tags sociais, sem depender da execução de JavaScript.
- Valores da chave de serviço e da lista de administradores ausentes dos arquivos JS, HTML e CSS do build local.
- Consulta de logs do deployment, filtrada por error/fatal nos 15 minutos finais, não retornou registros. Isso não cobre todo o histórico desde a publicação.

### Lighthouse móvel após a publicação

| Medição | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Primeira | 71 | 100 | 100 | 100 | 2,9 s | 820 ms | 0 |
| Repetição sem aviso de CPU | 83 | 100 | 100 | 100 | 1,8 s | 670 ms | 0 |

A primeira execução alertou sobre CPU lenta. A repetição sem esse aviso corresponde ao resultado móvel válido da auditoria anterior em desempenho, LCP e TBT. Portanto, houve redução mensurável dos arquivos de imagem e correção de SEO, mas **não há evidência de melhora no tempo de bloqueio JavaScript**. 83 é uma medição de laboratório, não uma garantia para todos os aparelhos.

Evidências locais: `../../correcao-2026-10-31/`, incluindo `production-results.json`, `browser-results.json`, capturas, `tests-final.json` e os relatórios Lighthouse. Os scripts usam Chromium emulado; não substituem testes físicos em iPhone/Android ou com leitor de tela.

## Aceite ainda necessário

Entrar com a conta do proprietário, localizar a mensagem de teste, atualizar seu status, recarregar, confirmar persistência, testar alteração/restauração de destaques e sair. Não redefinir senha nem criar sessão administrativa artificial para essa validação.
