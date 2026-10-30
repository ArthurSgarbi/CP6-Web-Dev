---
version: alpha
name: Portfólio de Arthur Sgarbi
description: Identidade editorial, neutros quentes e verde para apresentar projetos de software com clareza.
---

## Overview

Preservar Manrope, títulos expressivos e a composição assimétrica dos projetos. O conteúdo apresenta Arthur como estudante de Engenharia de Software na FIAP. Benefícios e responsabilidades devem ter evidência; nomes editoriais não alteram identificadores do GitHub.

## Colors

Valores correspondem a `src/styles.css`. Seções Projetos, Processo e rodapé têm superfícies escuras próprias nos dois temas. O verde de fundo sempre recebe texto `on-accent`; não herdar a cor do tema.

```yaml
colors:
  primary: "#d6eb78"
  on-accent: "#171b12"
  paper-light: "#f3f2ed"
  ink-light: "#24251f"
  muted-light: "#67695f"
  line-light: "#d3d4c9"
  field-border-light: "#777d70"
  error-light: "#8c3029"
  accent-text-light: "#536524"
  paper-dark: "#171a16"
  ink-dark: "#f0f1e9"
  muted-dark: "#b2b7a8"
  line-dark: "#3e4539"
  field-border-dark: "#899080"
  error-dark: "#ffb4ab"
  accent-text-dark: "#d6eb78"
```

## Typography

Títulos fluidos têm espaçamento entre letras negativo. Informações auxiliares úteis usam no mínimo 12 px; texto de leitura, preferencialmente 14–16 px. Preservar nomes como React, TypeScript e GitHub; padronizar front-end, Shopee, Global Solution, painel e página inicial.

```yaml
typography:
  body:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.5
  heading:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: -0.04em
```

## Layout

Conteúdo centralizado, largura máxima de 1480 px e margem fluida; margem móvel de 22 px. Validar 320, 390, 768, 1024 e 1440 px. Resolver o dimensionamento dos elementos quando houver transbordamento; não ocultar o problema no documento. Menu móvel até 800 px inclui Contato.

```yaml
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  gutter-mobile: 22px
  lg: 32px
  section-mobile: 80px
```

## Elevation & Depth

Bordas e superfícies definem hierarquia; sombras são discretas. Modal nativo usa a camada superior do navegador. Sua barra de fechamento permanece visível ao rolar.

## Shapes

Formulários e cartões usam cantos discretos. Controles de tema permanecem circulares.

```yaml
rounded:
  sm: 4px
  md: 8px
  full: 9999px
```

## Components

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 12px
```

Botões devem ter alvo de pelo menos 44 px e foco visível. Campos usam bordas próprias, rótulos reais e erros textuais associados. Sucesso de contato confirma recebimento, não entrega de e-mail; novo preenchimento limpa a confirmação. Painel distingue recebimento, organização da caixa e notificação opcional.

Amostras de interfaces é um carrossel editorial independente da seção Projetos. Oferece pausa persistente, anterior/próximo e legenda integral; movimento reduzido mantém navegação manual. Acordeões abrem por clique/toque/teclado, sem mudar ao passar o mouse. Prévia abre modal; Ver estudo abre a página curta, com Sobre o projeto e O desafio.

## Do's and Don'ts

- Usar `--on-accent`, `--error`, `--field-border` e `--accent-text` em novos controles.
- Conferir texto comum com contraste mínimo de 4,5:1 e bordas necessárias com 3:1.
- Preservar Tab/Shift+Tab, Escape, foco inicial e retorno de foco do modal.
- Distinguir carregamento, falha, ausência de repositórios e seleção vazia.
- Não tratar estrelas, dados fictícios ou propostas como resultados comprovados.
- Não restaurar seções longas nem remover material histórico sem confirmar o abandono.
