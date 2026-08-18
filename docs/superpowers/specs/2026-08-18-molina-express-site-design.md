# Spec: Novo site Molina Express (mexpress.uk.com)

Data: 18/08/2026
Status: aprovado em brainstorming, aguardando plano de implementação
Fontes: `BLUEPRINT-SITE-MOLINA-EXPRESS.md` (benchmark HIVED/Zedify), `graphify-out/` (conteúdo do site atual mapeado), decisões registradas nesta spec.

## 1. Decisões de escopo (fechadas com o usuário)

| Decisão | Escolha |
|---|---|
| Público-alvo | Clientes B2B (funil principal, homepage) + recrutamento de motoristas (página dedicada `/drivers`) |
| Idioma | Inglês |
| Dados reais (números, cases, logos) | Placeholders marcados e centralizados; build de produção falha se sobrar placeholder |
| Envio de formulários | Sem backend no lançamento: interface `LeadProvider` com implementação `NoopProvider`; e-mail/HubSpot entram depois como providers |
| Estrutura | Abordagem A: LP única + `/drivers` (fase 1 do blueprint) |
| Imagens | Slots com SVG placeholder + `IMAGE-PROMPTS.md` com prompt descritivo por imagem; usuário gera as imagens em outra instância e substitui os arquivos |

## 2. Stack

- **Astro 5**, output estático. Astro Islands só onde há interatividade (formulários 2 passos, menu mobile).
- **Tailwind CSS v4** com tokens em CSS custom properties OKLCH.
- **Motion (motion.dev)**: coreografia de entrada do herói + linha de rota no scroll (stroke-dashoffset). Sem GSAP, sem jQuery.
- Fontes self-hosted, subset latin, `font-display: swap`: **Archivo** (display, variável, pesos 800/900, expandida em títulos) e **Hanken Grotesk** (corpo, 400/500/600). Algarismos tabulares da Archivo para números.
- Deploy: Railway (MCP configurado), quando o repositório remoto for fornecido pelo usuário.
- Código nasce em `site/` neste workspace e migra para o repo fornecido.

## 3. Rotas e conteúdo

### `/` — LP de aquisição de clientes (ordem das seções, blueprint §5)

1. **Herói**: promessa de resultado em uma frase, drench cobalto, título Archivo expandida, subtítulo de 1 frase, CTA primário "Get a quote", CTA secundário "Track a delivery", foto real da operação (slot de imagem). Título não pode estourar em 360px.
2. **Faixa de prova**: 3–4 números da operação (placeholders `TODO_`), algarismos tabulares.
3. **Serviços por necessidade**: same-day, next-day, rotas fixas/contrato, coletas e devoluções. Cada card com caso de uso concreto + prazo típico + micro-ilustração autoral. Composição assimétrica, não grade uniforme.
4. **Como funciona**: 4 passos reais (request, pickup, tracking, delivery). Numeração 01–04 legítima aqui (sequência real).
5. **Rastreio como produto**: mock visual da tela de rastreio (slot de imagem) + barra de input de código que redireciona para sistema externo (URL placeholder).
6. **Cases e clientes**: 2–3 cases com número no título + fila de logos. Tudo placeholder marcado.
7. **Setores atendidos**: e-commerce, farmácia/saúde, alimentação, documentos, moda. Lista simples; viram páginas na fase 2.
8. **Formulário de cotação em 2 passos**: passo 1 contato (nome, empresa, e-mail, telefone), passo 2 operação (volume/dia, cidade de coleta, como conheceu). Validação inline, teclado.
9. **Rodapé**: contato, WhatsApp link direto, área de cobertura (Norfolk, Suffolk, Essex), links legais, redes, dados da empresa (Molina Express Ltd, Russel House, Elton Business Park, Hadleigh Road, Ipswich, IP2 0DD).

### `/drivers` — recrutamento (conteúdo real do site atual, reescrito)

- Herói próprio ("Deliver with Molina Express" ou similar), CTA "Apply now".
- História do fundador (de motorista a dono da operação) — conteúdo mais autêntico do site atual, aproveitar.
- Valores (Loyalty, Justice, Fidelity, Character) integrados na narrativa, não como 4 cards numerados idênticos.
- Benefícios reais: van 3.5t fornecida, sem custo de combustível/seguro, uniforme, parking seguro, treinamento pago, rotas preparadas, bônus por performance, posição self-employed com suporte de contadores.
- Expectativas do parceiro (lista atual, reescrita).
- Formulário de aplicação em 2 passos (contato, depois experiência/disponibilidade).

### `/thanks` — confirmação

- Mensagem com prazo de resposta real (placeholder `TODO_`), voltar para home.

### Preparação fase 2

- `src/content/config.ts` com collections vazias: `cities`, `sectors`, `services`. Sem páginas geradas ainda.

## 4. Conteúdo, placeholders e imagens

- **Fonte única de conteúdo**: `src/content/site.ts`, tipado. Nenhum texto hardcoded em componente.
- **Placeholders**: valores que exigem dado real levam prefixo `TODO_` (ex.: `TODO_deliveries_per_month`). Script `npm run check:placeholders` lista pendências; roda no build de produção e falha se houver placeholder. Build de dev não falha.
- **Copy** (inglês): frases curtas, benefício antes de característica. Proibido: "solutions", "innovative", "revolutionizing", "excellence", superlativo sem número.
- **Imagens**: cada slot tem SVG placeholder neutro no repo e uma entrada em `IMAGE-PROMPTS.md` (raiz do site) com: nome do arquivo esperado, dimensões, prompt de geração descritivo, alt text final. Slots previstos: herói home (foto operação), mock de rastreio, herói drivers (motorista/van), foto da seção "como funciona" (opcional), OG image.

## 5. Formulários e LeadProvider

```ts
interface LeadPayload { kind: 'quote' | 'driver'; fields: Record<string, string>; }
interface LeadProvider { submitLead(p: LeadPayload): Promise<{ ok: boolean; error?: string }>; }
```

- `NoopProvider`: valida, loga no console, resolve ok, redireciona `/thanks`.
- Providers futuros (e-mail/Resend, HubSpot) implementam a mesma interface; componentes não mudam.
- Validação: obrigatórios por passo, formato de e-mail/telefone, mensagens inline junto ao campo, `aria-describedby` correto.

## 6. Design system

- Tokens (blueprint §6): `--brand` oklch(0.48 0.16 247), `--brand-strong` oklch(0.36 0.14 247), `--signal` oklch(0.88 0.19 122) máx. 10% de superfície, `--bg` branco puro, `--surface` oklch(0.965 0.008 247), `--ink` oklch(0.22 0.02 247), `--ink-muted` oklch(0.45 0.02 247) nunca em corpo longo.
- Escala tipográfica modular ≥ 1.25, `clamp()` com teto 6rem, `letter-spacing` display ≥ -0.04em, `text-wrap: balance` em headings, corpo 65–75ch.
- Iconografia autoral: SVGs de traço 1.5–2px (rota, baú, etiqueta, cronômetro, mapa), inline.
- Motivo gráfico: **linha de rota** (traço com vértices) costurando seções, revelada no scroll.
- Cantos 8px consistentes. Proibições do blueprint §6 e checklist §9 valem como critérios de aceite.
- Motion: entrada do herói em sequência (título → número → foto), ease-out-quart, conteúdo visível por padrão, `prefers-reduced-motion` obrigatório.

## 7. Performance, acessibilidade e SEO

- Metas: Lighthouse ≥ 95 (todas as categorias), LCP < 2s em 4G, CLS < 0.1.
- Imagens AVIF/WebP com srcset via `astro:assets`.
- Contraste: corpo ≥ 4.5:1, texto grande ≥ 3:1, incluindo placeholders de input.
- HTML semântico, foco visível, formulários navegáveis por teclado.
- JSON-LD: LocalBusiness + Service. Open Graph com imagem própria (slot). Sitemap segmentado. robots.txt.
- Slots de GA4 e Meta Pixel comentados no layout, sem IDs.

## 8. Testes

- **Vitest**: validação de formulário (por passo, formatos, mensagens), script de placeholders (detecta `TODO_`, falha corretamente), helpers de conteúdo.
- **Playwright smoke**: `/`, `/drivers`, `/thanks` renderizam sem erro de console; formulário de cotação navega passo 1 → passo 2 → submit → `/thanks`; menu mobile abre/fecha.
- Checklist anti-cara-de-IA (blueprint §9) como checklist de PR.

## 9. Fluxo de trabalho

- Branch por fase + PR + revisão humana. Nunca commit direto na main.
- Fases (roadmap do blueprint): 1) fundação (scaffold, tokens, layout base, deploy contínuo), 2) LP completa + /drivers, 3) substituição de imagens geradas, 4) fase SEO, 5) rastreio como produto.
- Esta spec cobre as fases 1 e 2.

## 10. Fora de escopo (YAGNI)

CMS, blog, chat widget, analytics com IDs reais, páginas de cidade/setor/serviço (fase 2 futura), app de rastreio próprio, versão em português.
