# Evidências — correção de 30/10/2026

[Relatório completo](../CORRECOES_2026-10-30.md) · [Fluxos no navegador](browser-results.json) · [Medições de layout](layout-results.json) · [Imagem visível](image-paint-results.json) · [Testes direcionados](tests-targeted.json) · [Suíte completa](tests-full.json).

## Capturas revisadas

As capturas do carrossel usam contextos independentes, relógio real e movimento reduzido emulado. Mostram imagem, legenda e controles sem alterar estilos ou o conteúdo do produto. As páginas completas documentam a composição da home; algumas capturas completas/componentes apresentaram imagem vazia, embora a imagem estivesse decodificada. A causa dessa variação de captura não foi determinada. Use `reel-*` para revisar a pintura da imagem; o relatório detalha a investigação.

| Largura | Carrossel claro | Carrossel escuro | Home completa |
| --- | --- | --- | --- |
| 320 px | [Abrir](reel-320-light.png) | [Abrir](reel-320-dark.png) | [Claro](home-320-light.png) / [Escuro](home-320-dark.png) |
| 390 px | [Abrir](reel-390-light.png) | [Abrir](reel-390-dark.png) | [Claro](home-390-light.png) / [Escuro](home-390-dark.png) |
| 768 px | [Abrir](reel-768-light.png) | [Abrir](reel-768-dark.png) | [Claro](home-768-light.png) / [Escuro](home-768-dark.png) |
| 1440 px | [Abrir](reel-1440-light.png) | [Abrir](reel-1440-dark.png) | [Claro](home-1440-light.png) / [Escuro](home-1440-dark.png) |

- [Suspensão por hover](carousel-hover.png)
- [Reprodução explícita por teclado](carousel-keyboard.png)
- [Menu móvel](menu-320.png)
- [Modal após rolar, com fechamento visível](modal-320.png)
- [Estudo curto do Meu Caixa](study-meu-caixa.png)

## Scripts

- [verify_browser.py](verify_browser.py): oito fluxos, relógio controlado no carrossel, visibilidade simulada, menu/modal e navegação; `--layout-only` verifica só a apresentação em outro contexto.
- [inspect_image_paint.py](inspect_image_paint.py): contextos novos por tamanho/tema, rolagem até a imagem e capturas `reel-*`.

Os scripts bloqueiam métodos HTTP de escrita. Consultas públicas ao GitHub/destaques são reais. Não há envio real de contato ou alteração administrativa. Consulte `--help` e o relatório para dependências e reprodução.
