// Conteúdo editorial e evidências dos projetos. Metadados técnicos continuam vindo do GitHub.
// A sequência histórica, responsabilidades e métricas não confirmadas ficam em docs/CASE_STUDY_CONTENT.md.
export const projectCaseStudies = {
  "aether-front-end": {
    "eyebrow": "Portal institucional / Projeto acadêmico",
    "headline": "Comunicar resiliência quando a conexão falha",
    "coverCaption": "Captura real da página inicial do portal AETHER. A imagem apresenta o site institucional, sem telemetria em execução.",
    "summary": "Um portal que organiza o problema, a proposta técnica e o público de um ecossistema de monitoramento climático. A entrega deste repositório é a apresentação web da solução.",
    "context": "AETHER é um projeto em equipe desenvolvido para a Global Solution da FIAP. O portal apresenta uma proposta de resiliência em desastres climáticos para Defesa Civil, bombeiros, gestores públicos e pessoas em áreas de risco.",
    "problem": "Em eventos climáticos severos, a perda de comunicação dificulta o acesso a informações. O desafio do portal é explicar esse cenário e tornar a proposta técnica compreensível para diferentes públicos.",
    "objective": "Apresentar a solução e orientar a navegação entre seus fundamentos. Monitoramento de sensores, retenção local e transmissão por rádio são conceitos descritos pelo portal; este frontend não implementa esses serviços.",
    "audience": "Defesa Civil, bombeiros, gestores públicos e pessoas em áreas de risco são os públicos declarados em objetivos.html. O portal também permite apresentar a proposta em contexto acadêmico.",
    "role": "Trabalho em equipe; detalhamento da minha contribuição em preparação.",
    "process": [
      {
        "id": "discovery",
        "title": "Descoberta e definição do problema",
        "description": "A página do problema e o README delimitam o cenário de perda de conectividade. Essa documentação dá contexto à interface, sem comprovar uma pesquisa de campo ou entrevistas com usuários.",
        "decisions": [
          "Separar a explicação do problema da apresentação das tecnologias.",
          "Manter explícita a finalidade institucional do portal."
        ],
        "deliverables": [
          "Página de contexto do problema",
          "Descrição da proposta no README"
        ],
        "technologies": [
          "HTML para estruturar a narrativa por assuntos"
        ]
      },
      {
        "id": "planning",
        "title": "Planejamento e arquitetura de informação",
        "description": "Seis documentos HTML formam uma navegação por páginas: início, problema, tecnologia, objetivos, benefícios e auditoria. A organização observável cria um percurso da necessidade à aplicação proposta.",
        "decisions": [
          "Distribuir o conteúdo em arquivos independentes.",
          "Compartilhar uma folha de estilos entre as páginas."
        ],
        "deliverables": [
          "Menu com seis destinos",
          "Estrutura comum de cabeçalho, conteúdo e rodapé"
        ],
        "technologies": [
          "HTML multipágina",
          "CSS compartilhado em style.css"
        ]
      },
      {
        "id": "design",
        "title": "Interface e experiência de leitura",
        "description": "O código usa cabeçalho azul-marinho, superfícies claras, imagens temáticas e títulos hierárquicos. O link da página atual recebe aria-current, oferecendo uma referência de localização além da cor.",
        "decisions": [
          "Destacar a página atual no menu.",
          "Organizar textos com títulos, parágrafos, listas e imagens com texto alternativo."
        ],
        "deliverables": [
          "Identidade visual institucional",
          "Hierarquia de leitura e navegação semântica"
        ],
        "technologies": [
          "CSS para superfícies, espaçamento e tipografia",
          "Atributos HTML de navegação acessível"
        ]
      },
      {
        "id": "development",
        "title": "Desenvolvimento do portal",
        "description": "As páginas entregam o conteúdo diretamente no HTML e não carregam JavaScript de aplicação. A auditoria é uma tabela com eventos simulados escritos no documento, sem consulta a sensores ou backend.",
        "decisions": [
          "Servir conteúdo estático sem dependências de aplicação.",
          "Identificar a tabela como simulação de conectividade."
        ],
        "deliverables": [
          "Páginas institucionais estáticas",
          "Tabela demonstrativa de eventos"
        ],
        "technologies": [
          "HTML para conteúdo e tabela",
          "CSS para layout e estados visuais"
        ],
        "difficulty": "Distinguir a demonstração visual da operação do ecossistema proposto.",
        "solution": "A página de logs declara que os eventos são simulados; o estudo preserva esse limite."
      },
      {
        "id": "testing",
        "title": "Testes e limites de validação",
        "description": "A leitura confirma links entre documentos, textos alternativos e a indicação de página atual. Não foi identificada uma suíte automatizada na árvore consultada. Não há, nesta revisão editorial, prova de leitor de tela, operação embarcada ou recuperação de dados.",
        "decisions": [
          "Separar inspeção do código de teste de uso real.",
          "Não transformar metas do ecossistema em resultados medidos."
        ],
        "deliverables": [
          "Limites de validação registrados",
          "Pendências de teclado e responsividade do portal de origem"
        ],
        "technologies": [
          "Inspeção dos documentos HTML e da folha de estilos"
        ]
      },
      {
        "id": "delivery",
        "title": "Entrega e evolução sugerida",
        "description": "O README explica a abertura local do index.html e referencia uma publicação. A entrega verificável aqui é o conjunto de arquivos estáticos; disponibilidade contínua e uso por órgãos públicos dependem de confirmação.",
        "decisions": [
          "Manter a execução local sem instalação de pacotes.",
          "Tratar novas integrações como evolução futura."
        ],
        "deliverables": [
          "Instruções de execução",
          "Portal documentado por assunto"
        ],
        "technologies": [
          "Hospedagem de arquivos estáticos compatível com HTML/CSS"
        ]
      }
    ],
    "architecture": [
      {
        "title": "Navegador → documentos HTML",
        "description": "Cada item do menu abre um arquivo próprio. O navegador recebe a página pronta, sem roteador JavaScript ou consulta de dados."
      },
      {
        "title": "Documentos → CSS e imagens",
        "description": "style.css concentra a apresentação; a pasta imagens fornece as ilustrações referenciadas pelas páginas."
      },
      {
        "title": "Ecossistema descrito, além do frontend",
        "description": "Edge Computing, microcontroladores e sincronização aparecem como proposta técnica no conteúdo. O repositório consultado não contém a implementação desses componentes."
      }
    ],
    "features": [
      {
        "title": "Navegação por assunto",
        "description": "Menu compartilhado liga seis páginas institucionais.",
        "benefit": "Permite consultar cada parte da proposta sem percorrer um documento único longo."
      },
      {
        "title": "Objetivos e público explícitos",
        "description": "Uma página reúne os objetivos técnicos e os grupos a que a solução se destina.",
        "benefit": "Relaciona a proposta tecnológica ao contexto de aplicação."
      },
      {
        "title": "Auditoria ilustrativa",
        "description": "Tabela estática mostra estados de operação, alerta, isolamento e recuperação.",
        "benefit": "Torna o cenário explicado mais concreto, mantendo a indicação de simulação."
      }
    ],
    "challenges": [
      {
        "title": "Explicar uma proposta técnica",
        "description": "Conectividade, processamento local e armazenamento precisam de contexto antes de fazer sentido para o visitante.",
        "solution": "O conteúdo separa o problema, as tecnologias e os benefícios, permitindo consultar cada assunto pela navegação."
      },
      {
        "title": "Distinguir proposta de implementação",
        "description": "Uma tabela de eventos pode parecer um painel conectado.",
        "solution": "Os eventos são identificados como uma simulação estática. A entrega web apresenta o conceito, sem atribuir ao portal alertas ou recuperação de dados reais."
      }
    ],
    "results": [
      "Portal composto por seis páginas HTML com estilos compartilhados.",
      "Problema, proposta técnica e públicos documentados em arquivos separados.",
      "Tabela de auditoria identificada como simulação; sem métricas de impacto verificadas."
    ],
    "learnings": [
      "A arquitetura de informação ajuda a explicar uma solução mesmo antes da integração com serviços reais.",
      "Conteúdo demonstrativo precisa comunicar seu limite operacional para não sugerir uma funcionalidade inexistente."
    ],
    "nextSteps": [
      "Proposta: validar navegação, foco e leitura em celular no portal de origem.",
      "Proposta: documentar separadamente protótipos e evidências do ecossistema embarcado, caso existam.",
      "Proposta: registrar critérios de aceite e testes para as páginas institucionais."
    ],
    "gallery": [
      {
        "src": "/images/projects/AETHER-front-end/01-portal.webp",
        "alt": "Página inicial do portal AETHER com navegação azul-marinho, apresentação da proposta e fotografia de satélite.",
        "caption": "Captura real já disponível no portfólio. Mostra a página institucional, sem telemetria em execução.",
        "width": 1901,
        "height": 911
      },
      {
        "src": "/images/projects/AETHER-front-end/02-responsivo.webp",
        "pending": true,
        "alt": "Captura pendente da navegação do portal AETHER em celular.",
        "caption": "[Imagem a adicionar] Registrar a navegação real do portal em uma tela estreita.",
        "width": 780,
        "height": 1688
      }
    ],
    "sources": [
      {
        "label": "Proposta, contexto acadêmico e estrutura",
        "url": "https://github.com/ArthurSgarbi/AETHER-front-end/blob/main/readme.md"
      },
      {
        "label": "Página inicial e navegação",
        "url": "https://github.com/ArthurSgarbi/AETHER-front-end/blob/main/index.html"
      },
      {
        "label": "Objetivos e público declarado",
        "url": "https://github.com/ArthurSgarbi/AETHER-front-end/blob/main/objetivos.html"
      },
      {
        "label": "Escopo da proposta técnica",
        "url": "https://github.com/ArthurSgarbi/AETHER-front-end/blob/main/tecnologia.html"
      },
      {
        "label": "Auditoria explicitamente simulada",
        "url": "https://github.com/ArthurSgarbi/AETHER-front-end/blob/main/logs.html"
      },
      {
        "label": "Apresentação compartilhada",
        "url": "https://github.com/ArthurSgarbi/AETHER-front-end/blob/main/style.css"
      }
    ],
    "pending": [
      "Papel individual e divisão de responsabilidades entre os participantes.",
      "Duração e sequência real do desenvolvimento.",
      "Entrevistas, critérios de aceite e validações com o público, se realizados.",
      "Implementação e testes do ecossistema embarcado descrito pelo portal.",
      "Captura real do portal em celular e validação de sua responsividade."
    ],
    "implementation": "A apresentação foi organizada em seis páginas HTML, com estilos compartilhados: início, problema, tecnologias, objetivos, benefícios e auditoria. A navegação indica a página atual, e textos, listas e imagens explicam cada assunto.",
    "evidence": "A captura mostra a página institucional. O código público permite consultar as seis páginas e a tabela estática de eventos simulados. Não há telemetria em execução neste front-end.",
    "limitation": "Sensores, comunicação por rádio e retenção de dados fazem parte da proposta. Esses serviços não são implementados neste portal."
  },
  "meu-caixa": {
    "eyebrow": "Produto digital / Finanças pessoais",
    "headline": "Organizar o dinheiro sem perder o contexto",
    "coverCaption": "Composição gráfica com captura real da tela pública de acesso do Meu Caixa. Não mostra um painel autenticado.",
    "summary": "Uma aplicação que reúne lançamentos, contas, metas, cartões e investimentos, com regras explícitas para separar saldo confirmado, previsões e reservas.",
    "context": "Meu Caixa reúne o acompanhamento de finanças pessoais em uma área individual: receitas, despesas, contas, metas, cartões e investimentos. Os registros são vinculados à conta autenticada.",
    "problem": "Uma previsão de despesa, uma reserva para uma meta e um gasto confirmado têm significados diferentes. Somá-los sem distinguir essas situações pode distorcer o saldo disponível.",
    "objective": "Permitir o registro e a consulta das finanças pessoais, mantendo distinção entre saldo, previsão e patrimônio. As contas são manuais: o README informa que não existe movimentação de contas bancárias reais.",
    "audience": "Pessoas que desejam acompanhar as próprias finanças em uma área individual. Essa caracterização é inferida das funcionalidades e do escopo declarado no README; não representa uma pesquisa de público comprovada.",
    "role": "Detalhamento da minha contribuição em preparação.",
    "process": [
      {
        "id": "discovery",
        "title": "Descoberta das regras financeiras",
        "description": "A documentação diferencia saldo confirmado, previsão de recorrência, reserva para metas e aporte para investimentos. Essa leitura delimita o domínio e evita apresentar o mesmo dinheiro duas vezes.",
        "decisions": [
          "Manter transferências internas fora das receitas e despesas de consumo.",
          "Exigir confirmação explícita para transformar uma recorrência em lançamento."
        ],
        "deliverables": [
          "Regras financeiras descritas no README",
          "Funções de cálculo separadas da interface"
        ],
        "technologies": [
          "TypeScript para expressar os dados e cálculos do domínio"
        ]
      },
      {
        "id": "planning",
        "title": "Planejamento e separação de responsabilidades",
        "description": "O código divide painéis de interface, rotas de API, funções de domínio e acesso ao banco. A identidade usada pelas APIs vem da sessão validada, em vez de um identificador escolhido pelo navegador.",
        "decisions": [
          "Concentrar autenticação em uma função de servidor.",
          "Consultar e alterar transações com o proprietário autenticado."
        ],
        "deliverables": [
          "Rotas financeiras autenticadas",
          "Camada de acesso a PostgreSQL"
        ],
        "technologies": [
          "Next.js para interface e rotas de servidor",
          "Clerk para identidade",
          "Neon PostgreSQL para persistência"
        ]
      },
      {
        "id": "design",
        "title": "Interface para diferentes leituras do saldo",
        "description": "Os painéis organizam visão geral, gastos, contas, metas, cartões e investimentos. As preferências documentadas incluem tema, texto ampliado, redução de animações e modo discreto; mascarar valores não substitui autenticação.",
        "decisions": [
          "Separar carteira e saldo de aportes na visão geral.",
          "Tratar preferências visuais como dados da conta."
        ],
        "deliverables": [
          "Painéis por área financeira",
          "Configurações de apresentação"
        ],
        "technologies": [
          "React para painéis e estado de interface",
          "Preferências persistidas por usuário"
        ]
      },
      {
        "id": "development",
        "title": "Desenvolvimento com regras no servidor",
        "description": "A rota de transações valida descrição, tipo, data, categoria e centavos inteiros. As consultas usam parâmetros e combinam registro com owner_id. O adaptador de banco executa lotes em transações PostgreSQL.",
        "decisions": [
          "Representar valores monetários em centavos inteiros.",
          "Validar categoria e conta antes de gravar.",
          "Usar filtros de proprietário em consultas e alterações."
        ],
        "deliverables": [
          "CRUD de lançamentos autenticado",
          "Validações de entrada e regras de saldo"
        ],
        "technologies": [
          "TypeScript nas rotas e cálculos",
          "SQL parametrizado",
          "Transações via Neon"
        ],
        "difficulty": "Evitar dupla contagem e acesso cruzado entre contas.",
        "solution": "Regras de domínio distinguem os movimentos; a identidade da sessão é aplicada aos registros no servidor."
      },
      {
        "id": "testing",
        "title": "Testes presentes e validação pendente",
        "description": "A suíte consultada exercita rotas reais com identidades simuladas e PostgreSQL em memória via PGlite. Isso evidencia uma estratégia de teste de regras e isolamento; a suíte do produto não foi executada nesta revisão editorial e não comprova login real ou produção.",
        "decisions": [
          "Substituir o provedor de identidade e a conexão externa por fixtures nos testes.",
          "Verificar respostas sem autenticação e isolamento entre proprietários."
        ],
        "deliverables": [
          "Testes versionados de isolamento",
          "Casos de cálculos, recorrências e backup descritos no repositório"
        ],
        "technologies": [
          "node:test para testes",
          "PGlite para PostgreSQL temporário"
        ]
      },
      {
        "id": "delivery",
        "title": "Entrega documentada e evolução",
        "description": "O README contém comandos de execução, migrações e limites de backup. Serviços de identidade, cotações e assistente dependem de configuração de servidor; sua operação externa não foi testada nesta revisão.",
        "decisions": [
          "Manter segredos somente no servidor.",
          "Distinguir testes locais de validação dos provedores externos."
        ],
        "deliverables": [
          "Instruções de configuração",
          "Migrações e procedimento de backup"
        ],
        "technologies": [
          "Migrações PostgreSQL",
          "Integrações de servidor com Workers AI e brapi.dev documentadas no README"
        ]
      }
    ],
    "architecture": [
      {
        "title": "Navegador → interface e APIs Next.js",
        "description": "Painéis React apresentam os dados. Rotas de servidor validam entradas e executam as regras financeiras."
      },
      {
        "title": "Sessão Clerk → proprietário dos registros",
        "description": "app/chatgpt-auth.ts obtém o identificador validado pelo Clerk. A rota consultada associa leituras e alterações a esse proprietário."
      },
      {
        "title": "APIs → Neon PostgreSQL",
        "description": "O adaptador centraliza consultas parametrizadas e lotes transacionais, mantendo a persistência fora do navegador."
      },
      {
        "title": "Serviços complementares no servidor",
        "description": "O README documenta Workers AI para a assistente e brapi.dev para cotações. Não são necessários para demonstrar que o CRUD financeiro está separado da interface; seu funcionamento externo permanece a validar."
      }
    ],
    "features": [
      {
        "title": "Lançamentos e busca",
        "description": "Receitas e despesas possuem categoria, data e conta, com busca avançada descrita na documentação.",
        "benefit": "Permite consultar o histórico preservando o contexto de cada movimento."
      },
      {
        "title": "Contas e metas manuais",
        "description": "Contas, transferências internas e reservas para metas têm regras próprias de saldo livre.",
        "benefit": "Explicita onde o dinheiro está registrado e quanto permanece disponível."
      },
      {
        "title": "Cartões e recorrências",
        "description": "Faturas e previsões mensais aparecem separadas dos lançamentos confirmados.",
        "benefit": "Evita apresentar uma previsão como dinheiro já movimentado."
      },
      {
        "title": "Exportação e recuperação",
        "description": "O README descreve CSV de transações e backup JSON das áreas financeiras, com limites de restauração.",
        "benefit": "Oferece uma forma documentada de consultar e preservar os próprios registros."
      }
    ],
    "challenges": [
      {
        "title": "Dar significado ao saldo",
        "description": "Aportes, reservas e recorrências não devem ser confundidos com despesas ou dinheiro adicional.",
        "solution": "As regras financeiras distinguem cada movimento. Uma recorrência só se torna lançamento após confirmação."
      },
      {
        "title": "Separar os dados de cada pessoa",
        "description": "Um mesmo servidor recebe registros de diferentes contas.",
        "solution": "A identidade da sessão é aplicada às consultas e alterações. Os testes versionados incluem cenários com duas identidades simuladas."
      },
      {
        "title": "Validar valores monetários",
        "description": "Valores recebidos pelo formulário precisam de limites e representação consistentes.",
        "solution": "As rotas validam os campos e trabalham com centavos inteiros antes de persistir os lançamentos."
      }
    ],
    "results": [
      "Código de interface, APIs financeiras e persistência organizado em camadas observáveis.",
      "Regras de saldo e isolamento acompanhadas de testes versionados, sem execução do produto nesta revisão.",
      "Documentação de backup, configuração e limites de integração disponível; sem métricas de uso ou impacto verificadas."
    ],
    "learnings": [
      "Regras financeiras explícitas são parte da experiência: o usuário precisa saber se está vendo saldo, previsão ou reserva.",
      "Autenticação e autorização precisam se encontrar no servidor; esconder uma área na interface não protege o registro.",
      "Testes com identidades distintas permitem verificar isolamento sem depender do provedor externo."
    ],
    "nextSteps": [
      "Proposta: executar e registrar a suíte do produto no ambiente configurado.",
      "Proposta: validar login, backup e integrações externas em um ambiente autorizado.",
      "Proposta: obter capturas atuais das áreas autenticadas com dados fictícios e sem dados pessoais."
    ],
    "gallery": [
      {
        "src": "/images/projects/meu-caixa/01-visao-geral.webp",
        "alt": "Tela pública do Meu Caixa em azul-marinho, com apresentação do acesso individual e ações Entrar e Criar minha conta.",
        "caption": "Captura real da tela pública de acesso já disponível no portfólio. Não mostra um painel autenticado.",
        "width": 1917,
        "height": 905
      },
      {
        "src": "/images/projects/meu-caixa/02-responsivo.webp",
        "pending": true,
        "alt": "Captura pendente da interface do Meu Caixa em celular com dados fictícios.",
        "caption": "[Imagem a adicionar] Registrar uma área autenticada em celular usando somente dados fictícios.",
        "width": 780,
        "height": 1688
      }
    ],
    "sources": [
      {
        "label": "Escopo, regras e configuração",
        "url": "https://github.com/ArthurSgarbi/meu-caixa/blob/main/README.md"
      },
      {
        "label": "Identidade validada no servidor",
        "url": "https://github.com/ArthurSgarbi/meu-caixa/blob/main/app/chatgpt-auth.ts"
      },
      {
        "label": "Validação e isolamento das transações",
        "url": "https://github.com/ArthurSgarbi/meu-caixa/blob/main/app/api/transactions/route.ts"
      },
      {
        "label": "Cálculos e centavos",
        "url": "https://github.com/ArthurSgarbi/meu-caixa/blob/main/lib/finance-calculations.ts"
      },
      {
        "label": "Adaptador Neon e lotes transacionais",
        "url": "https://github.com/ArthurSgarbi/meu-caixa/blob/main/db/index.ts"
      },
      {
        "label": "Estratégia de testes de isolamento",
        "url": "https://github.com/ArthurSgarbi/meu-caixa/blob/main/tests/tenant-security.test.mjs"
      }
    ],
    "pending": [
      "Papel individual, colaboradores e duração do desenvolvimento.",
      "Origem da ideia, pesquisa de público e sequência real das decisões.",
      "Execução atual da suíte do produto e validação dos provedores externos.",
      "Capturas atuais das áreas autenticadas em desktop e celular, com dados fictícios.",
      "Métricas de uso ou resultados observados, caso existam."
    ],
    "implementation": "A aplicação separa saldo confirmado, previsões e patrimônio. Os painéis React se comunicam com rotas Next.js; o servidor valida os lançamentos, representa dinheiro em centavos inteiros e associa os registros à identidade autenticada pelo Clerk.",
    "evidence": "O código público inclui cálculos financeiros, consultas por proprietário e testes de isolamento com identidades simuladas. A imagem disponível apresenta a tela de acesso; uma captura do painel com dados fictícios ainda será adicionada.",
    "limitation": "As contas são registradas manualmente. A aplicação não movimenta contas bancárias reais. Os testes do portfólio não validam os serviços externos do Meu Caixa."
  },
  "site-projeto-shopee": {
    "eyebrow": "Gestão de loja / Operação manual",
    "headline": "Dar contexto à rotina da loja",
    "coverCaption": "Composição gráfica com captura real da demonstração pública do SYNC Mobile. Os dados exibidos são fictícios.",
    "summary": "Um painel de gestão para organizar produtos, pedidos, entregas e campanhas, acompanhado de uma demonstração pública isolada dos dados administrativos.",
    "context": "SYNC Mobile é um painel para organizar a operação de uma loja que vende na Shopee. Produtos, custos, pedidos e entregas são registrados manualmente pelo operador.",
    "problem": "Produtos, pedidos e entregas precisam permanecer relacionados. Ao apresentar o sistema, também é necessário proteger os cadastros administrativos e deixar claro que uma simulação não representa uma venda real.",
    "objective": "Centralizar o cadastro e a consulta da operação manual, protegendo a área administrativa e oferecendo uma demo com dados fictícios. O README informa que ainda não existe sincronização com Shopee ou transportadoras.",
    "audience": "Administradores de uma loja que registram e acompanham sua operação. Essa caracterização deriva do fluxo documentado; volume de vendas, número de operadores e uso comercial não foram comprovados.",
    "role": "Detalhamento da minha contribuição em preparação.",
    "process": [
      {
        "id": "discovery",
        "title": "Descoberta do fluxo operacional",
        "description": "A documentação conecta o cadastro de produto ao pedido e à entrega. Também declara os limites: estoque e indicadores são manuais, sem integração automática com marketplace ou transporte.",
        "decisions": [
          "Explicitar quais informações dependem do operador.",
          "Distinguir a demonstração pública da operação administrativa."
        ],
        "deliverables": [
          "Fluxo operacional documentado",
          "Limites de integração declarados"
        ],
        "technologies": [
          "TypeScript para os modelos de produtos, pedidos e entregas"
        ]
      },
      {
        "id": "planning",
        "title": "Planejamento dos limites de acesso",
        "description": "O projeto divide componentes de painel, rotas de API e módulos de autenticação e persistência. A rota /demo mantém estado local com produtos fictícios; as rotas administrativas verificam sessão.",
        "decisions": [
          "Separar a demo dos dados persistentes.",
          "Exigir uma sessão administrativa para consultar e alterar registros."
        ],
        "deliverables": [
          "Rota pública de demonstração",
          "Camada de autorização administrativa"
        ],
        "technologies": [
          "Next.js para páginas e APIs",
          "React para o estado local da demo",
          "Cookies HttpOnly para sessão"
        ]
      },
      {
        "id": "design",
        "title": "Interface e comunicação do estado",
        "description": "A demo identifica dados fictícios, informa que as alterações ficam na tela e oferece restauração. A ação de simular venda atualiza a mensagem de status e os indicadores locais.",
        "decisions": [
          "Exibir o limite da simulação antes dos indicadores.",
          "Comunicar a ação com uma região de status textual."
        ],
        "deliverables": [
          "Tabela de produtos demonstrativos",
          "Indicadores e feedback de venda simulada"
        ],
        "technologies": [
          "React useState e useMemo",
          "HTML com role=status"
        ]
      },
      {
        "id": "development",
        "title": "Desenvolvimento e consistência dos registros",
        "description": "O código de pedidos grava a venda e a entrega em um lote atômico. Um marcador e uma verificação de existência evitam gerar outra entrega ao salvar novamente. A conexão usa libSQL, com arquivo local ou Turso conforme a configuração.",
        "decisions": [
          "Gravar pedido e geração de entrega no mesmo lote.",
          "Preservar entregas manuais e exclusões deliberadas.",
          "Não simular sucesso de gravação quando o servidor falha."
        ],
        "deliverables": [
          "Persistência de pedidos e entregas",
          "Validação e mensagens de falha"
        ],
        "technologies": [
          "libSQL para banco local ou remoto",
          "Drizzle para acesso tipado ao schema",
          "SQL parametrizado em lotes de escrita"
        ],
        "difficulty": "Repetir uma gravação sem criar uma entrega duplicada.",
        "solution": "O lote consulta a relação existente e usa delivery_generated para preservar o estado registrado."
      },
      {
        "id": "testing",
        "title": "Testes presentes e limites de evidência",
        "description": "O repositório contém testes de persistência, fluxo de vendas e segurança. O arquivo de segurança consultado inclui tentativas de código inválido, origem da requisição e limites de corpo. Esses testes não foram executados nesta revisão editorial.",
        "decisions": [
          "Exercitar persistência com banco temporário.",
          "Verificar restrições da sessão e das mutações."
        ],
        "deliverables": [
          "Suítes versionadas para registros e autenticação",
          "Procedimento documentado de teste de persistência"
        ],
        "technologies": [
          "Testes Node e runtime de teste Next.js",
          "Banco temporário de testes"
        ]
      },
      {
        "id": "delivery",
        "title": "Entrega e configuração do ambiente",
        "description": "O README documenta o modo local, migrações, preservação do arquivo do banco e configuração remota. O envio do código de login depende do serviço de e-mail configurado; sua entrega real não foi testada nesta revisão.",
        "decisions": [
          "Manter credenciais fora dos arquivos versionados.",
          "Preservar o banco local entre reinicializações.",
          "Não tratar instrução de publicação como prova de deploy."
        ],
        "deliverables": [
          "Instruções para Windows",
          "Configuração de banco e autenticação documentada"
        ],
        "technologies": [
          "Resend para envio do código de acesso",
          "libSQL local ou Turso remoto"
        ]
      }
    ],
    "architecture": [
      {
        "title": "Navegador → painel Next.js",
        "description": "Componentes React organizam as áreas de produtos, pedidos, entregas, campanhas e configurações."
      },
      {
        "title": "Autenticação → APIs administrativas",
        "description": "Senha e código por e-mail precedem a sessão. O módulo de autenticação verifica validade, inatividade e confirmação da segunda etapa."
      },
      {
        "title": "APIs → libSQL",
        "description": "O banco usa um arquivo local por padrão ou uma conexão remota configurada. Lotes de escrita mantêm pedido e entrega relacionados."
      },
      {
        "title": "Demo → estado local isolado",
        "description": "app/demo/page.tsx importa produtos fictícios e altera apenas o estado React. Restaurar repõe os exemplos sem consultar o banco administrativo."
      }
    ],
    "features": [
      {
        "title": "Produtos e operação manual",
        "description": "Cadastros de produtos, custos, estoque e anúncios são descritos na documentação do painel.",
        "benefit": "Reúne registros necessários para acompanhar a rotina, sem prometer atualização automática da Shopee."
      },
      {
        "title": "Pedidos ligados às entregas",
        "description": "Um pedido pago pode gerar a entrega, com tratamento para reenvio e exclusões deliberadas.",
        "benefit": "Ajuda a manter o vínculo entre venda registrada e acompanhamento de envio."
      },
      {
        "title": "Acompanhamento do transporte",
        "description": "O operador registra status e datas reais de envio e recebimento; a documentação diferencia média e previsão.",
        "benefit": "Dá significado aos indicadores sem inventar datas desconhecidas."
      },
      {
        "title": "Demonstração pública",
        "description": "Produtos fictícios permitem simular uma venda e restaurar os dados da tela.",
        "benefit": "Apresenta o fluxo sem acessar cadastros administrativos."
      }
    ],
    "challenges": [
      {
        "title": "Manter pedido e entrega coerentes",
        "description": "Editar ou salvar novamente um pedido não deve criar outra entrega.",
        "solution": "A gravação conjunta verifica a relação existente e preserva o marcador de geração da entrega."
      },
      {
        "title": "Demonstrar sem expor a loja",
        "description": "Quem conhece o produto precisa entender o fluxo sem acessar informações administrativas.",
        "solution": "A demonstração usa dados fictícios locais e oferece restauração. A área administrativa exige autenticação."
      }
    ],
    "results": [
      "Código de painel administrativo e demonstração pública com responsabilidades separadas.",
      "Persistência de pedidos e entregas acompanhada de validações e testes versionados.",
      "Operação manual e ausência de sincronização com Shopee declaradas no README; sem resultados comerciais medidos."
    ],
    "learnings": [
      "Uma demo precisa ter limites próprios de dados e comunicar que os números são fictícios.",
      "Consistência operacional depende tanto de relações no banco quanto do comportamento ao repetir uma ação.",
      "Indicadores manuais devem deixar claro de onde vêm os registros e o que ainda depende do operador."
    ],
    "nextSteps": [
      "Proposta: executar os testes do produto e registrar o ambiente e os resultados.",
      "Proposta: validar o fluxo real de e-mail e sessão em um ambiente autorizado.",
      "Proposta: capturar as áreas administrativas com cadastros fictícios.",
      "Proposta: avaliar uma eventual integração com marketplace como um projeto separado, com requisitos próprios."
    ],
    "gallery": [
      {
        "src": "/images/projects/site-projeto-shopee/01-demo.webp",
        "alt": "Demonstração pública do SYNC Mobile com aviso de dados fictícios, quatro indicadores e tabela de produtos de exemplo.",
        "caption": "Captura real da demonstração pública já disponível no portfólio. Valores e pedidos são fictícios e não representam resultados da loja.",
        "width": 1600,
        "height": 1100
      },
      {
        "src": "/images/projects/site-projeto-shopee/02-responsivo.webp",
        "pending": true,
        "alt": "Captura pendente da demonstração do SYNC Mobile em celular.",
        "caption": "[Imagem a adicionar] Registrar a demonstração real em celular, incluindo a leitura da tabela.",
        "width": 780,
        "height": 1688
      }
    ],
    "sources": [
      {
        "label": "Fluxos, operação manual e configuração",
        "url": "https://github.com/ArthurSgarbi/site-projeto-shopee/blob/main/README.md"
      },
      {
        "label": "Demonstração com estado e dados fictícios",
        "url": "https://github.com/ArthurSgarbi/site-projeto-shopee/blob/main/app/demo/page.tsx"
      },
      {
        "label": "Persistência local e remota",
        "url": "https://github.com/ArthurSgarbi/site-projeto-shopee/blob/main/db/index.ts"
      },
      {
        "label": "Lotes de pedidos e entregas",
        "url": "https://github.com/ArthurSgarbi/site-projeto-shopee/blob/main/lib/records-api.ts"
      },
      {
        "label": "Desafios e sessões administrativas",
        "url": "https://github.com/ArthurSgarbi/site-projeto-shopee/blob/main/lib/auth.ts"
      },
      {
        "label": "Cenários de teste de segurança",
        "url": "https://github.com/ArthurSgarbi/site-projeto-shopee/blob/main/tests/security-integration.mjs"
      }
    ],
    "pending": [
      "Papel individual, colaboradores e duração do desenvolvimento.",
      "Origem do projeto e validação do fluxo com operadores reais.",
      "Execução atual dos testes do produto e envio real do código de autenticação.",
      "Capturas em celular e das áreas administrativas com dados fictícios.",
      "Resultados de uso e métricas comerciais, caso tenham sido medidos."
    ],
    "implementation": "O painel usa Next.js e libSQL para registrar a operação. Pedidos e entregas são gravados de forma conjunta, com verificação para evitar duplicações. A rota pública /demo mantém produtos fictícios apenas no estado da interface, separada dos dados administrativos.",
    "evidence": "A demonstração pública permite explorar indicadores e uma tabela de produtos, simular uma venda e restaurar os exemplos. A captura mostra esse ambiente com dados fictícios; os valores não representam resultados comerciais.",
    "limitation": "Não há sincronização automática com a Shopee ou transportadoras. A demonstração não grava pedidos reais nem acessa o banco administrativo."
  },
  "anninha-site-novo": {
    "eyebrow": "Experiência pessoal / Memórias digitais",
    "headline": "Transformar memórias em uma experiência navegável",
    "coverCaption": "Composição gráfica com captura real da abertura da página pessoal. A fotografia e os textos pertencem à interface original.",
    "summary": "Uma página pessoal que combina narrativa, contador de tempo e galeria por ano, com ampliação das fotografias e pequenos gestos de interação.",
    "context": "Memórias a dois é uma página pessoal de homenagem, com textos e fotografias organizados em um percurso de leitura. A experiência reúne uma abertura, um contador de tempo e uma galeria por ano.",
    "problem": "Quando uma coleção de fotografias cresce, fica mais difícil manter a continuidade da narrativa e encontrar uma memória. A galeria precisa permitir explorar as imagens sem perder a posição de origem.",
    "objective": "Apresentar uma homenagem pessoal com leitura contínua e exploração das imagens. O contador e as legendas fazem parte do conteúdo afetivo; não representam datas ou duração do trabalho de desenvolvimento.",
    "audience": "A destinatária da homenagem e pessoas que acessam a página compartilhada. Esse público é inferido do conteúdo, sem evidência de pesquisa ou testes com participantes.",
    "role": "Projeto pessoal; detalhamento da minha contribuição em preparação.",
    "process": [
      {
        "id": "discovery",
        "title": "Descoberta pela leitura do conteúdo",
        "description": "A abertura, as mensagens e as fotografias estabelecem a finalidade pessoal. O código indica uma experiência de memória e homenagem; não documenta entrevistas, briefing ou critérios de aceite.",
        "decisions": [
          "Combinar texto de abertura e imagem principal.",
          "Organizar as memórias por ano."
        ],
        "deliverables": [
          "Narrativa pessoal em HTML",
          "Coleção de fotografias com legendas"
        ],
        "technologies": [
          "HTML para conteúdo, seções e metadados das fotografias"
        ]
      },
      {
        "id": "planning",
        "title": "Planejamento de uma página estática",
        "description": "Conteúdo, apresentação e comportamento ficam em três arquivos principais. A galeria usa atributos de dados para ano e data, permitindo que o script filtre e navegue pelos elementos já presentes no documento.",
        "decisions": [
          "Separar HTML, CSS e JavaScript.",
          "Usar os dados dos elementos da galeria para filtro e legenda."
        ],
        "deliverables": [
          "Estrutura estática sem backend de aplicação",
          "Modelo de cartões com ano e data"
        ],
        "technologies": [
          "JavaScript e atributos data-*",
          "CSS em arquivo próprio"
        ]
      },
      {
        "id": "design",
        "title": "Interface e ritmo da narrativa",
        "description": "A página combina tipografia expressiva, tons de vinho e rosa, foto principal com moldura e uma galeria de proporções variadas. Media queries reorganizam o contador e as fotografias em telas menores.",
        "decisions": [
          "Alternar texto, contador e galeria para marcar o percurso.",
          "Adaptar a grade das imagens à largura disponível."
        ],
        "deliverables": [
          "Abertura com fotografia de destaque",
          "Grade responsiva e foco visível nos controles"
        ],
        "technologies": [
          "CSS Grid e media queries",
          "CSS com preferência por movimento reduzido"
        ]
      },
      {
        "id": "development",
        "title": "Desenvolvimento das interações",
        "description": "O script calcula tempo decorrido, atualiza o contador, aplica filtros por ano e abre uma visualização ampliada. Anterior e próximo percorrem apenas as imagens visíveis no filtro atual.",
        "decisions": [
          "Atualizar aria-pressed nos filtros.",
          "Manter a navegação ampliada coerente com o filtro.",
          "Devolver foco ao cartão ao fechar a imagem."
        ],
        "deliverables": [
          "Contador e filtros",
          "Ampliação de fotos com navegação por setas e Escape"
        ],
        "technologies": [
          "JavaScript para eventos e manipulação do DOM",
          "IntersectionObserver para revelação de elementos"
        ],
        "difficulty": "Manter o contexto da galeria ao filtrar, ampliar e retornar.",
        "solution": "O código guarda o cartão ativo, calcula a lista visível e devolve o foco a esse cartão no fechamento."
      },
      {
        "id": "testing",
        "title": "Testes e revisão de acessibilidade pendentes",
        "description": "O código contém foco inicial no fechamento da ampliação, retorno ao cartão e atalhos de teclado. A leitura não comprova um ciclo completo de foco ou leitor de tela. Não foi identificada suíte automatizada na árvore consultada, e essas interações do projeto original não foram executadas nesta revisão editorial.",
        "decisions": [
          "Distinguir mecanismos presentes de acessibilidade comprovada.",
          "Registrar validação completa do diálogo como pendência."
        ],
        "deliverables": [
          "Mapeamento das interações de teclado",
          "Limites de validação documentados"
        ],
        "technologies": [
          "Eventos keydown e foco no DOM",
          "Regras CSS de movimento reduzido"
        ]
      },
      {
        "id": "delivery",
        "title": "Entrega estática e manutenção do conteúdo",
        "description": "A entrega consultada contém página, estilos, script e imagens. Novas memórias dependem da atualização do HTML e de seus arquivos. Não há, nos arquivos inspecionados, um painel editorial ou persistência de comentários.",
        "decisions": [
          "Manter conteúdo versionado com os arquivos estáticos.",
          "Tratar novas ferramentas de edição como evolução sugerida."
        ],
        "deliverables": [
          "Página estática com conteúdo e imagens",
          "Interações executadas no navegador"
        ],
        "technologies": [
          "Arquivos HTML, CSS, JavaScript e imagens estáticas"
        ]
      }
    ],
    "architecture": [
      {
        "title": "Navegador → HTML, CSS e imagens",
        "description": "O conteúdo é servido como arquivos estáticos. Os cartões e suas legendas já existem no documento, sem uma API de galeria."
      },
      {
        "title": "JavaScript → estado da galeria no DOM",
        "description": "Filtros aplicam classes aos cartões; a ampliação copia a imagem e a legenda do item selecionado e acompanha a posição na seleção visível."
      },
      {
        "title": "Data de referência → contador",
        "description": "Uma função calcula anos, meses e unidades menores e atualiza os campos a cada segundo. A data é parte da narrativa pessoal, não um marco comprovado do projeto."
      }
    ],
    "features": [
      {
        "title": "Narrativa pessoal",
        "description": "Abertura, textos e fotografias formam um percurso de leitura.",
        "benefit": "Apresenta o contexto das memórias junto às imagens."
      },
      {
        "title": "Contador de tempo",
        "description": "Campos de anos, meses, dias, horas, minutos e segundos são atualizados pelo script.",
        "benefit": "Relaciona a narrativa a uma referência temporal definida no conteúdo."
      },
      {
        "title": "Filtro por ano",
        "description": "Botões alteram a seleção de fotografias e comunicam o estado com aria-pressed.",
        "benefit": "Ajuda a percorrer uma coleção maior sem perder sua organização."
      },
      {
        "title": "Fotografia ampliada",
        "description": "A visualização possui legenda, posição, anterior, próxima e fechamento por Escape.",
        "benefit": "Permite observar cada fotografia e voltar à coleção no item utilizado."
      }
    ],
    "challenges": [
      {
        "title": "Navegar na seleção correta",
        "description": "Depois de filtrar um ano, anterior e próximo precisam percorrer somente as fotografias daquele conjunto.",
        "solution": "A lista de cartões visíveis orienta a navegação e a contagem da imagem ampliada."
      },
      {
        "title": "Preservar a orientação",
        "description": "Fechar uma fotografia deve manter a referência do item que abriu a ampliação.",
        "solution": "O script guarda o cartão ativo e devolve o foco a ele. A validação completa com leitor de tela no projeto original permanece pendente."
      },
      {
        "title": "Adaptar a leitura ao celular",
        "description": "A grade de imagens e o contador precisam se reorganizar em telas estreitas.",
        "solution": "As regras responsivas alteram as colunas do contador e empilham as imagens conforme a largura disponível."
      }
    ],
    "results": [
      "Página pessoal com contador, filtro por ano e ampliação implementados em JavaScript.",
      "Layout com regras específicas para telas menores e preferência por movimento reduzido.",
      "Arquivos estáticos organizados sem backend de aplicação; sem métricas de audiência ou testes de uso comprovados."
    ],
    "learnings": [
      "Uma experiência pessoal também depende de hierarquia, contexto e orientação de navegação.",
      "O estado da galeria precisa ser compartilhado por filtro, contador e navegação da imagem ampliada.",
      "Adicionar atalhos de teclado é uma parte do trabalho; validar foco e leitura assistiva exige uso real."
    ],
    "nextSteps": [
      "Proposta: validar ciclo de foco, leitor de tela e fechamento da ampliação no projeto original.",
      "Proposta: registrar uma captura atual da galeria em celular.",
      "Proposta: documentar a inclusão e otimização de novas fotografias.",
      "Proposta: criar casos de teste para limites de calendário e navegação após filtros."
    ],
    "gallery": [
      {
        "src": "/images/projects/anninha-site-novo/01-pagina-pessoal.webp",
        "alt": "Abertura da página pessoal com fundo vinho, mensagem em tipografia rosa e fotografia de um casal em moldura clara.",
        "caption": "Captura real da abertura já disponível no portfólio; a fotografia e os textos pertencem à página original.",
        "width": 1897,
        "height": 902
      },
      {
        "src": "/images/projects/anninha-site-novo/02-responsivo.webp",
        "pending": true,
        "alt": "Captura pendente da galeria da página pessoal em celular.",
        "caption": "[Imagem a adicionar] Registrar os filtros e a galeria reais em uma tela estreita.",
        "width": 780,
        "height": 1688
      }
    ],
    "sources": [
      {
        "label": "Conteúdo, galeria e diálogo",
        "url": "https://github.com/ArthurSgarbi/anninha-site-novo/blob/main/index.html"
      },
      {
        "label": "Contador, filtros, ampliação e retorno de foco",
        "url": "https://github.com/ArthurSgarbi/anninha-site-novo/blob/main/script.js"
      },
      {
        "label": "Grid, responsividade e movimento reduzido",
        "url": "https://github.com/ArthurSgarbi/anninha-site-novo/blob/main/styles.css"
      }
    ],
    "pending": [
      "Papel individual, colaboradores e duração do desenvolvimento.",
      "Motivação detalhada e sequência real das decisões de implementação.",
      "Captura atual da galeria e da visualização ampliada em celular.",
      "Validação do ciclo de foco, leitor de tela, datas e movimento reduzido no projeto original.",
      "Feedback de uso, caso tenha sido coletado."
    ],
    "implementation": "HTML, CSS e JavaScript separam conteúdo, apresentação e interação. Os filtros selecionam as fotografias por ano; a ampliação percorre apenas a seleção visível e devolve o foco ao cartão de origem ao fechar.",
    "evidence": "A captura apresenta a abertura original. O código público contém o contador, os filtros e os controles de ampliação, além de regras para telas menores e preferência por movimento reduzido.",
    "limitation": "O contador pertence à narrativa da homenagem e não indica a duração do desenvolvimento. A página é estática; novas memórias são adicionadas aos arquivos do projeto."
  }
};

export function getProjectCaseStudy(name) {
  return projectCaseStudies[name.toLowerCase()] ?? null;
}
