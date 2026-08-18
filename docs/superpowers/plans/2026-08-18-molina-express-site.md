# Molina Express Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o novo site da Molina Express: LP de aquisição de clientes B2B (`/`) + página de recrutamento de motoristas (`/drivers`) + confirmação (`/thanks`), estático, em inglês.

**Architecture:** Astro 5 estático com Tailwind CSS v4 (tokens OKLCH). Todo o texto vive em um módulo tipado (`src/content/site.ts`) com placeholders `TODO_` verificados por script que bloqueia build de produção. Formulários em 2 passos usam uma state machine pura (testável) + wiring DOM fino, enviando por uma interface `LeadProvider` (NoopProvider no lançamento). Motion só no herói e na linha de rota.

**Tech Stack:** Astro 5, Tailwind CSS 4 (@tailwindcss/vite), motion, @fontsource-variable/archivo, @fontsource-variable/hanken-grotesk, @astrojs/sitemap, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-18-molina-express-site-design.md` (ler antes de executar qualquer task).

## Global Constraints

- Todo o site em **inglês**. Copy: frases curtas, benefício antes de característica. Palavras proibidas na copy: "solutions", "innovative", "revolutionizing", "excellence", superlativo sem número.
- Fontes proibidas (checklist anti-IA): Inter, Space Grotesk, DM Sans, Outfit, Playfair, Fraunces, Plus Jakarta. Usar somente Archivo Variable (display) e Hanken Grotesk Variable (corpo).
- Tokens de cor exatos (spec §6): `--color-brand: oklch(0.48 0.16 247)`, `--color-brand-strong: oklch(0.36 0.14 247)`, `--color-signal: oklch(0.88 0.19 122)` (máx. 10% de superfície), `--color-bg: oklch(1 0 0)`, `--color-surface: oklch(0.965 0.008 247)`, `--color-ink: oklch(0.22 0.02 247)`, `--color-ink-muted: oklch(0.45 0.02 247)`.
- Corpo de texto sempre em `text-ink` (nunca `text-ink-muted` em parágrafo longo). Cantos sempre `rounded-card` (8px). Sem gradiente em texto, sem glassmorphism, sem fundo creme, sem kicker maiúsculo repetido, sem grade de cards idênticos, sem ícone dentro de círculo colorido.
- Zero jQuery, zero widget de terceiro, zero CSS/JS de CDN externo.
- Nenhum texto hardcoded em componente: tudo importado de `src/content/site.ts`.
- Todo dado real pendente usa prefixo literal `TODO_` no valor string.
- Node ≥ 20. Diretório do site: `site/` na raiz do workspace. Todos os comandos rodam de `site/` salvo indicação.
- Git: trabalhar na branch `feat/site-foundation` (criar na Task 1). Nunca commitar na main. Mensagens Conventional Commits terminando com linha `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- `@media (prefers-reduced-motion: reduce)` obrigatório em toda animação; conteúdo visível por padrão sem JS.

---

### Task 1: Scaffold, toolchain e tokens

**Files:**
- Create: `site/package.json`, `site/astro.config.mjs`, `site/tsconfig.json`, `site/vitest.config.ts`, `site/src/styles/global.css`, `site/src/pages/index.astro` (provisório), `site/public/robots.txt`, `site/.gitignore`
- Test: `site/tests/unit/sanity.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: projeto Astro buildável; classes Tailwind `bg-brand`, `text-ink`, `bg-surface`, `rounded-card`, `font-display`, `font-body` disponíveis para todas as tasks seguintes.

- [ ] **Step 1: Criar branch**

```bash
cd /Users/juan/orca/workspaces/LP_molina-express/web-scrap-molina_express
git checkout -b feat/site-foundation
```

- [ ] **Step 2: Criar `site/package.json`**

```json
{
  "name": "molina-express-site",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "build:prod": "npm run check:placeholders && astro build",
    "preview": "astro preview",
    "check:placeholders": "node scripts/check-placeholders.mjs",
    "test": "vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@astrojs/sitemap": "^3.2.0",
    "@fontsource-variable/archivo": "^5.1.0",
    "@fontsource-variable/hanken-grotesk": "^5.1.0",
    "astro": "^5.0.0",
    "motion": "^11.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 3: Criar `site/astro.config.mjs`**

```js
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://mexpress.uk.com",
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 4: Criar `site/tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*", "tests/**/*", "scripts/**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Criar `site/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
});
```

- [ ] **Step 6: Criar `site/.gitignore`**

```
node_modules/
dist/
.astro/
test-results/
playwright-report/
```

- [ ] **Step 7: Criar `site/src/styles/global.css`**

```css
@import "tailwindcss";
@import "@fontsource-variable/archivo/wdth.css";
@import "@fontsource-variable/hanken-grotesk";

@theme {
  --color-brand: oklch(0.48 0.16 247);
  --color-brand-strong: oklch(0.36 0.14 247);
  --color-signal: oklch(0.88 0.19 122);
  --color-bg: oklch(1 0 0);
  --color-surface: oklch(0.965 0.008 247);
  --color-ink: oklch(0.22 0.02 247);
  --color-ink-muted: oklch(0.45 0.02 247);
  --font-display: "Archivo Variable", system-ui, sans-serif;
  --font-body: "Hanken Grotesk Variable", system-ui, sans-serif;
  --radius-card: 8px;
}

html {
  font-family: var(--font-body);
  color: var(--color-ink);
  background: var(--color-bg);
}

h1, h2, h3 {
  font-family: var(--font-display);
  text-wrap: balance;
}

.display-expanded {
  font-stretch: 125%;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.tabular {
  font-variant-numeric: tabular-nums;
}

:focus-visible {
  outline: 3px solid var(--color-brand);
  outline-offset: 2px;
}
```

- [ ] **Step 8: Criar `site/src/pages/index.astro` provisório**

```astro
---
import "../styles/global.css";
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Molina Express</title>
  </head>
  <body>
    <h1 class="display-expanded text-4xl text-brand">Molina Express</h1>
  </body>
</html>
```

- [ ] **Step 9: Criar `site/public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://mexpress.uk.com/sitemap-index.xml
```

- [ ] **Step 10: Criar teste de sanidade `site/tests/unit/sanity.test.ts`**

```ts
import { describe, it, expect } from "vitest";

describe("toolchain", () => {
  it("runs vitest", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 11: Instalar e verificar**

```bash
cd site
npm install
npm test
npm run build
```

Expected: vitest 1 passed; `astro build` termina com "Complete!" e gera `dist/index.html`.

- [ ] **Step 12: Verificar tokens no build**

```bash
grep -ro "oklch(0.48 0.16 247)" dist/ | head -1
```

Expected: pelo menos 1 ocorrência (token compilado no CSS).

- [ ] **Step 13: Commit**

```bash
cd ..
git add site/
git commit -m "feat(site): scaffold Astro 5 + Tailwind v4 com tokens OKLCH

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Scanner de placeholders

**Files:**
- Create: `site/scripts/placeholders.mjs`, `site/scripts/check-placeholders.mjs`
- Test: `site/tests/unit/placeholders.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `scanText(text: string): { line: number; match: string }[]` em `scripts/placeholders.mjs`; comando `npm run check:placeholders` que sai com código 1 se `src/content/site.ts` contiver `TODO_`.

- [ ] **Step 1: Escrever teste que falha**

`site/tests/unit/placeholders.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { scanText } from "../../scripts/placeholders.mjs";

describe("scanText", () => {
  it("finds TODO_ markers with line numbers", () => {
    const text = 'a: "ok"\nb: "TODO_deliveries_per_month"\nc: "TODO_on_time_rate"';
    expect(scanText(text)).toEqual([
      { line: 2, match: "TODO_deliveries_per_month" },
      { line: 3, match: "TODO_on_time_rate" },
    ]);
  });

  it("returns empty array when clean", () => {
    expect(scanText('a: "all real data"')).toEqual([]);
  });

  it("does not match the word TODO without underscore", () => {
    expect(scanText("// TODO fix later")).toEqual([]);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd site && npm test
```

Expected: FAIL (cannot find module `scripts/placeholders.mjs`).

- [ ] **Step 3: Implementar `site/scripts/placeholders.mjs`**

```js
export function scanText(text) {
  const results = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    for (const m of lines[i].matchAll(/TODO_[A-Za-z0-9_]+/g)) {
      results.push({ line: i + 1, match: m[0] });
    }
  }
  return results;
}
```

- [ ] **Step 4: Implementar CLI `site/scripts/check-placeholders.mjs`**

```js
import { readFileSync } from "node:fs";
import { scanText } from "./placeholders.mjs";

const file = "src/content/site.ts";
const findings = scanText(readFileSync(file, "utf-8"));

if (findings.length === 0) {
  console.log(`check:placeholders OK - no TODO_ markers in ${file}`);
  process.exit(0);
}

console.error(`check:placeholders FAILED - ${findings.length} placeholder(s) in ${file}:`);
for (const f of findings) console.error(`  ${file}:${f.line}  ${f.match}`);
console.error("Replace every TODO_ value with real data before a production build.");
process.exit(1);
```

- [ ] **Step 5: Rodar testes e ver passar**

```bash
npm test
```

Expected: PASS (4 testes no total, incluindo sanity).

- [ ] **Step 6: Commit**

```bash
cd .. && git add site/scripts site/tests
git commit -m "feat(site): scanner de placeholders TODO_ com gate de build

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Módulo de conteúdo `site.ts`

**Files:**
- Create: `site/src/content/site.ts`, `site/src/content.config.ts`
- Test: `site/tests/unit/content.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: export nomeado `site` com a forma exata abaixo (todas as tasks de UI importam daqui); tipos `FieldRule` e `FormStep` (usados pelas Tasks 4, 6, 12, 13).

- [ ] **Step 1: Escrever teste que falha**

`site/tests/unit/content.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { site } from "../../src/content/site";

describe("site content", () => {
  it("has the client funnel sections", () => {
    expect(site.hero.title.length).toBeGreaterThan(10);
    expect(site.proof.metrics).toHaveLength(4);
    expect(site.services.items).toHaveLength(4);
    expect(site.howItWorks.steps).toHaveLength(4);
    expect(site.sectors.items.length).toBeGreaterThanOrEqual(5);
    expect(site.cases.items.length).toBeGreaterThanOrEqual(2);
  });

  it("has two-step forms for quote, driver and fulfilment", () => {
    expect(site.quoteForm.steps).toHaveLength(2);
    expect(site.driverForm.steps).toHaveLength(2);
    expect(site.fulfilmentForm.steps).toHaveLength(2);
  });

  it("has the fulfilment vertical", () => {
    expect(site.fulfilment.services.items).toHaveLength(9);
    expect(site.fulfilment.capacity.points).toContain("126 installed pallet positions");
    expect(site.fulfilment.audience.items.length).toBeGreaterThanOrEqual(4);
  });

  it("uses no banned copy words", () => {
    const text = JSON.stringify(site).toLowerCase();
    for (const banned of ["solutions", "innovative", "revolutioniz", "excellence"]) {
      expect(text).not.toContain(banned);
    }
  });

  it("keeps real company data", () => {
    expect(site.company.address.postcode).toBe("IP2 0DD");
    expect(site.company.coverage).toEqual(["Norfolk", "Suffolk", "Essex"]);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd site && npm test
```

Expected: FAIL (cannot find `src/content/site`).

- [ ] **Step 3: Implementar `site/src/content/site.ts`**

Conteúdo completo (copy final em inglês; valores `TODO_` são os dados reais pendentes):

```ts
export type FieldRule = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "textarea";
  required: boolean;
  options?: string[];
};

export type FormStep = { title: string; fields: FieldRule[] };

export const site = {
  company: {
    name: "Molina Express",
    legalName: "Molina Express Ltd",
    url: "https://mexpress.uk.com",
    email: "TODO_commercial_email",
    recruitingEmail: "recruiting@mexpress.uk",
    whatsappUrl: "TODO_whatsapp_link",
    trackingUrl: "TODO_external_tracking_url",
    replyTimeHours: "TODO_reply_time_hours",
    address: {
      // Divergência entre fontes: site atual diz "Russel House, Elton Business Park",
      // docs GTM dizem "Elton Park Business Centre". Confirmar antes de publicar.
      street: "TODO_confirm_street_address",
      city: "Ipswich",
      postcode: "IP2 0DD",
      country: "GB",
    },
    coverage: ["Norfolk", "Suffolk", "Essex"],
  },

  nav: {
    links: [
      { label: "Services", href: "/#services" },
      { label: "Fulfilment", href: "/fulfilment" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Drive with us", href: "/drivers" },
    ],
    cta: { label: "Get a quote", href: "/#quote" },
  },

  hero: {
    title: "Your delivery, on time. If anything slips, you hear it from us first.",
    subtitle:
      "Same-day and next-day parcel delivery across Norfolk, Suffolk and Essex, run by a local fleet on prepared routes.",
    ctaPrimary: { label: "Get a quote", href: "#quote" },
    ctaSecondary: { label: "Track a delivery", href: "#tracking" },
    image: {
      src: "/images/hero-operation.svg",
      alt: "Molina Express driver loading labelled parcels into a branded van at first light",
      status: "TODO_replace_with_generated_photo",
    },
  },

  proof: {
    metrics: [
      { value: "TODO_deliveries_per_month", label: "deliveries a month" },
      { value: "TODO_on_time_rate", label: "delivered on time" },
      { value: "TODO_avg_pickup_minutes", label: "average pickup time" },
      { value: "TODO_towns_covered", label: "towns covered" },
    ],
  },

  services: {
    title: "Built around what you ship",
    items: [
      {
        name: "Same-day",
        useCase: "A pharmacy order placed at noon reaches the patient before 6pm.",
        sla: "Collected within TODO_sameday_pickup_window",
      },
      {
        name: "Next-day",
        useCase: "Your online orders picked up this evening, on doorsteps tomorrow.",
        sla: "Cut-off at TODO_nextday_cutoff",
      },
      {
        name: "Contract routes",
        useCase: "A fixed daily run between your depot and your stores, same driver, same window.",
        sla: "Weekly schedule agreed up front",
      },
      {
        name: "Collections and returns",
        useCase: "Failed fitting? We collect from the customer and bring it back to you.",
        sla: "Booked into your next route",
      },
    ],
  },

  howItWorks: {
    title: "How it works",
    steps: [
      { name: "Book", detail: "Send the job by form or WhatsApp. We confirm the pickup window." },
      { name: "Pickup", detail: "A uniformed driver collects at the agreed time and scans every parcel." },
      { name: "Track", detail: "You get a link with live status. So does your customer." },
      { name: "Delivered", detail: "Photo proof of delivery, straight to your inbox." },
    ],
  },

  tracking: {
    title: "Know where every parcel is",
    body: "Type a tracking code and see status, route and proof of delivery.",
    inputLabel: "Tracking code",
    buttonLabel: "Track",
    image: {
      src: "/images/tracking-mock.svg",
      alt: "Molina Express tracking screen showing a live map with driver position and delivery status",
      status: "TODO_replace_with_generated_mock",
    },
  },

  cases: {
    title: "Numbers from real routes",
    items: [
      {
        headline: "TODO_case1_headline_with_number",
        body: "TODO_case1_paragraph",
        client: "TODO_case1_client_name",
      },
      {
        headline: "TODO_case2_headline_with_number",
        body: "TODO_case2_paragraph",
        client: "TODO_case2_client_name",
      },
    ],
    logos: ["TODO_client_logo_list"],
  },

  sectors: {
    title: "Sectors we deliver for",
    items: ["E-commerce", "Pharmacy and health", "Food", "Documents", "Fashion"],
  },

  quoteForm: {
    title: "Get a quote",
    subtitle: "Two quick steps. We reply within TODO_reply_time_hours working hours.",
    steps: [
      {
        title: "About you",
        fields: [
          { name: "name", label: "Your name", type: "text", required: true },
          { name: "company", label: "Company", type: "text", required: true },
          { name: "email", label: "Work email", type: "email", required: true },
          { name: "phone", label: "Phone", type: "tel", required: true },
        ],
      },
      {
        title: "About your deliveries",
        fields: [
          { name: "volume", label: "Parcels per day (estimate)", type: "text", required: true },
          { name: "pickup_area", label: "Pickup town or area", type: "text", required: true },
          {
            name: "source",
            label: "How did you hear about us?",
            type: "select",
            required: false,
            options: ["Search", "Recommendation", "Social media", "Other"],
          },
        ],
      },
    ] as FormStep[],
    submitLabel: "Request quote",
  },

  driverForm: {
    title: "Apply to drive",
    subtitle: "Two quick steps. We reply within TODO_reply_time_hours working hours.",
    steps: [
      {
        title: "About you",
        fields: [
          { name: "name", label: "Your name", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "phone", label: "Phone", type: "tel", required: true },
        ],
      },
      {
        title: "Your experience",
        fields: [
          {
            name: "right_to_work",
            label: "Do you have the right to work in the UK?",
            type: "select",
            required: true,
            options: ["Yes", "No"],
          },
          { name: "licence_years", label: "Years holding a UK/EU driving licence", type: "text", required: true },
          {
            name: "preferred_area",
            label: "Preferred area",
            type: "select",
            required: true,
            options: ["Norfolk", "Suffolk", "Essex"],
          },
          { name: "availability", label: "Availability (days per week)", type: "text", required: true },
        ],
      },
    ] as FormStep[],
    submitLabel: "Send application",
  },

  fulfilment: {
    hero: {
      title: "Fulfilment from Ipswich, run by people who deliver",
      subtitle:
        "Operator-led 3PL on the Ipswich-Felixstowe corridor. 126 installed pallet positions, live capacity now, and a team that already runs delivery routes every day.",
      cta: { label: "Get a fulfilment quote", href: "#fulfilment-quote" },
      image: {
        src: "/images/hero-fulfilment.svg",
        alt: "Racked pallet positions inside the Molina Fulfilment warehouse in Ipswich",
        status: "TODO_replace_with_generated_photo",
      },
    },
    services: {
      title: "One warehouse, the whole operation",
      items: [
        { name: "Inbound receiving", detail: "Container and carton receiving, checked and put away the same day." },
        { name: "Pallet and carton storage", detail: "Racked storage with live stock counts." },
        { name: "Pick and pack", detail: "Single and multi-item orders picked to your packing spec." },
        { name: "UK parcel dispatch", detail: "Daily carrier collections from the warehouse door." },
        { name: "Returns", detail: "Received, inspected and back into stock with a report." },
        { name: "Rework and kitting", detail: "Bundles, inserts and product kits built to order." },
        { name: "Relabelling", detail: "Barcodes and compliance labels applied per unit." },
        { name: "Amazon FBA prep", detail: "Carton prep and labels to Amazon inbound spec." },
        { name: "B2B dispatch", detail: "Pallet and carton despatch to stores and wholesalers." },
      ],
    },
    capacity: {
      title: "East of England stockholding",
      body: "The warehouse sits minutes from the A14 on the Ipswich-Felixstowe corridor, with 126 installed pallet positions ready now. Import through Felixstowe, hold stock with us, dispatch across the UK.",
      points: ["126 installed pallet positions", "Ipswich-Felixstowe corridor", "Capacity available now"],
    },
    audience: {
      title: "Built for",
      items: [
        "UK and overseas e-commerce brands",
        "Importers landing stock at Felixstowe",
        "Shopify, Amazon, eBay and TikTok Shop sellers",
        "SMEs that need East of England stockholding",
      ],
    },
  },

  fulfilmentForm: {
    title: "Get a fulfilment quote",
    subtitle:
      "We price your operation from three numbers: pallets held, monthly orders and items per order. Two quick steps.",
    steps: [
      {
        title: "About you",
        fields: [
          { name: "name", label: "Your name", type: "text", required: true },
          { name: "company", label: "Company", type: "text", required: true },
          { name: "email", label: "Work email", type: "email", required: true },
          { name: "phone", label: "Phone", type: "tel", required: true },
        ],
      },
      {
        title: "Your operation",
        fields: [
          { name: "pallets", label: "Average pallets held", type: "text", required: true },
          { name: "orders_month", label: "Orders per month", type: "text", required: true },
          { name: "items_per_order", label: "Average items per order", type: "text", required: true },
          {
            name: "channels",
            label: "Main sales channel",
            type: "select",
            required: true,
            options: ["Shopify", "Amazon", "eBay", "TikTok Shop", "B2B / wholesale", "Other"],
          },
          { name: "product_type", label: "Product type (e.g. apparel, beauty, homeware)", type: "text", required: false },
        ],
      },
    ] as FormStep[],
    submitLabel: "Request fulfilment quote",
  },

  drivers: {
    hero: {
      title: "Drive with Molina Express",
      subtitle:
        "A 3.5-tonne van, fuel, insurance and prepared routes, all provided. You bring the work ethic.",
      cta: { label: "Apply now", href: "#apply" },
      image: {
        src: "/images/hero-drivers.svg",
        alt: "Molina Express driver in uniform closing the rear door of a long-wheelbase van",
        status: "TODO_replace_with_generated_photo",
      },
    },
    story: {
      title: "Started behind the wheel",
      body: "Our founder ran delivery routes before he owned a single van. That is why drivers here get prepared routes, paid training and a straight answer when something goes wrong. We grew from one driver to a fleet by keeping four habits: loyalty to the team, fair decisions, keeping our word, and character when the day gets hard.",
    },
    benefits: {
      title: "What you get",
      items: [
        "Long-wheelbase 3.5t van provided",
        "No fuel or insurance costs",
        "Uniform provided",
        "Secure parking at or near the depot",
        "Full paid training",
        "Prepared routes",
        "Performance bonuses",
        "Self-employed, with accountants available to help",
      ],
    },
    expectations: {
      title: "What we expect",
      items: [
        "Load, unload and drive with safety first",
        "Deliver to homes and businesses",
        "Treat every customer with patience and a smile",
        "Follow delivery procedures to the letter",
        "Take instructions well and ask when unsure",
        "Stay calm and professional in public",
      ],
    },
  },

  thanks: {
    title: "Got it. We are on it.",
    body: "Your message is with the team. We reply within TODO_reply_time_hours working hours.",
    backLabel: "Back to home",
  },

  seo: {
    home: {
      title: "Molina Express - Same-day and next-day delivery in East Anglia",
      description:
        "Parcel delivery across Norfolk, Suffolk and Essex. Local fleet, prepared routes, live tracking and photo proof of delivery.",
    },
    drivers: {
      title: "Drive with Molina Express - Delivery driver openings",
      description:
        "Van, fuel, insurance and routes provided. Paid training and performance bonuses. Apply to deliver in Norfolk, Suffolk or Essex.",
    },
    fulfilment: {
      title: "Molina Fulfilment - 3PL warehouse in Ipswich, Suffolk",
      description:
        "Operator-led fulfilment on the Ipswich-Felixstowe corridor. Receiving, storage, pick and pack, returns and Amazon FBA prep. 126 pallet positions, capacity available now.",
    },
    thanks: { title: "Thanks - Molina Express", description: "We received your message." },
    ogImage: "/images/og.jpg",
    ogImageStatus: "TODO_generate_og_image",
  },

  footer: {
    note: "Registered in England. TODO_company_number",
  },
} as const;
```

- [ ] **Step 4: Criar `site/src/content.config.ts`** (collections vazias, preparação fase 2)

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const page = z.object({ title: z.string(), description: z.string() });

export const collections = {
  cities: defineCollection({ loader: glob({ pattern: "**/*.md", base: "./src/content/cities" }), schema: page }),
  sectors: defineCollection({ loader: glob({ pattern: "**/*.md", base: "./src/content/sectors" }), schema: page }),
  services: defineCollection({ loader: glob({ pattern: "**/*.md", base: "./src/content/services" }), schema: page }),
};
```

```bash
mkdir -p src/content/cities src/content/sectors src/content/services
touch src/content/cities/.gitkeep src/content/sectors/.gitkeep src/content/services/.gitkeep
```

- [ ] **Step 5: Rodar testes e ver passar**

```bash
npm test
```

Expected: PASS. Rodar também `npm run check:placeholders` — Expected: **exit 1** listando os `TODO_` (comportamento correto nesta fase; confirma o gate).

- [ ] **Step 6: Commit**

```bash
cd .. && git add site/src site/tests
git commit -m "feat(site): conteudo central tipado com placeholders marcados

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Validação de formulário

**Files:**
- Create: `site/src/lib/validation.ts`
- Test: `site/tests/unit/validation.test.ts`

**Interfaces:**
- Consumes: `FieldRule` de `src/content/site.ts`.
- Produces: `validateField(rule: FieldRule, value: string): string | null` e `validateStep(rules: FieldRule[], values: Record<string, string>): Record<string, string>` (usados pelas Tasks 6 e 12).

- [ ] **Step 1: Escrever teste que falha**

`site/tests/unit/validation.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { validateField, validateStep } from "../../src/lib/validation";
import type { FieldRule } from "../../src/content/site";

const name: FieldRule = { name: "name", label: "Your name", type: "text", required: true };
const email: FieldRule = { name: "email", label: "Work email", type: "email", required: true };
const phone: FieldRule = { name: "phone", label: "Phone", type: "tel", required: true };
const source: FieldRule = { name: "source", label: "Source", type: "select", required: false };

describe("validateField", () => {
  it("rejects empty required field", () => {
    expect(validateField(name, "")).toBe("Your name is required");
    expect(validateField(name, "   ")).toBe("Your name is required");
  });
  it("accepts empty optional field", () => {
    expect(validateField(source, "")).toBeNull();
  });
  it("rejects malformed email", () => {
    expect(validateField(email, "not-an-email")).toBe("Enter a valid email");
    expect(validateField(email, "a@b.co")).toBeNull();
  });
  it("rejects malformed phone", () => {
    expect(validateField(phone, "abc")).toBe("Enter a valid phone number");
    expect(validateField(phone, "+44 7911 123456")).toBeNull();
    expect(validateField(phone, "07911123456")).toBeNull();
  });
});

describe("validateStep", () => {
  it("collects one error per invalid field", () => {
    const errors = validateStep([name, email], { name: "", email: "bad" });
    expect(errors).toEqual({ name: "Your name is required", email: "Enter a valid email" });
  });
  it("returns empty object when valid", () => {
    expect(validateStep([name], { name: "Ana" })).toEqual({});
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd site && npm test
```

Expected: FAIL (cannot find `src/lib/validation`).

- [ ] **Step 3: Implementar `site/src/lib/validation.ts`**

```ts
import type { FieldRule } from "../content/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{7,}$/;

export function validateField(rule: FieldRule, value: string): string | null {
  const v = value.trim();
  if (!v) return rule.required ? `${rule.label} is required` : null;
  if (rule.type === "email" && !EMAIL_RE.test(v)) return "Enter a valid email";
  if (rule.type === "tel" && !PHONE_RE.test(v)) return "Enter a valid phone number";
  return null;
}

export function validateStep(
  rules: FieldRule[],
  values: Record<string, string>,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const rule of rules) {
    const error = validateField(rule, values[rule.name] ?? "");
    if (error) errors[rule.name] = error;
  }
  return errors;
}
```

- [ ] **Step 4: Rodar testes e ver passar**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd .. && git add site/src/lib site/tests
git commit -m "feat(site): validacao de formulario por passo

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: LeadProvider e stepper (state machine)

**Files:**
- Create: `site/src/lib/leads.ts`, `site/src/lib/stepper.ts`
- Test: `site/tests/unit/leads.test.ts`, `site/tests/unit/stepper.test.ts`

**Interfaces:**
- Consumes: `validateStep` (Task 4), `FormStep` (Task 3).
- Produces: `LeadPayload`, `LeadProvider`, `leadProvider` (NoopProvider) em `leads.ts`; `createStepper(steps: FormStep[], submit: (values: Record<string,string>) => Promise<{ok: boolean; error?: string}>)` retornando `{ getState, setValue, next, back, submit }` — usado pela Task 12.

- [ ] **Step 1: Escrever testes que falham**

`site/tests/unit/leads.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { noopProvider } from "../../src/lib/leads";

describe("noopProvider", () => {
  it("resolves ok and logs the payload", async () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const result = await noopProvider.submitLead({ kind: "quote", fields: { name: "Ana" } });
    expect(result.ok).toBe(true);
    expect(spy).toHaveBeenCalledWith("[lead]", "quote", { name: "Ana" });
    spy.mockRestore();
  });
});
```

`site/tests/unit/stepper.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { createStepper } from "../../src/lib/stepper";
import type { FormStep } from "../../src/content/site";

const steps: FormStep[] = [
  { title: "About you", fields: [{ name: "name", label: "Your name", type: "text", required: true }] },
  { title: "Details", fields: [{ name: "volume", label: "Volume", type: "text", required: true }] },
];

describe("createStepper", () => {
  it("starts at step 0 editing", () => {
    const s = createStepper(steps, async () => ({ ok: true }));
    expect(s.getState()).toMatchObject({ step: 0, status: "editing", errors: {} });
  });

  it("blocks next() while the current step is invalid", () => {
    const s = createStepper(steps, async () => ({ ok: true }));
    s.next();
    expect(s.getState().step).toBe(0);
    expect(s.getState().errors.name).toBe("Your name is required");
  });

  it("advances when valid and clears errors", () => {
    const s = createStepper(steps, async () => ({ ok: true }));
    s.setValue("name", "Ana");
    s.next();
    expect(s.getState()).toMatchObject({ step: 1, errors: {} });
  });

  it("back() returns without losing values", () => {
    const s = createStepper(steps, async () => ({ ok: true }));
    s.setValue("name", "Ana");
    s.next();
    s.back();
    expect(s.getState().step).toBe(0);
    expect(s.getState().values.name).toBe("Ana");
  });

  it("submit validates the last step and calls the provider", async () => {
    const submitFn = vi.fn(async () => ({ ok: true }));
    const s = createStepper(steps, submitFn);
    s.setValue("name", "Ana");
    s.next();
    s.setValue("volume", "40");
    await s.submit();
    expect(submitFn).toHaveBeenCalledWith({ name: "Ana", volume: "40" });
    expect(s.getState().status).toBe("done");
  });

  it("submit with invalid step does not call the provider", async () => {
    const submitFn = vi.fn(async () => ({ ok: true }));
    const s = createStepper(steps, submitFn);
    s.setValue("name", "Ana");
    s.next();
    await s.submit();
    expect(submitFn).not.toHaveBeenCalled();
    expect(s.getState().status).toBe("editing");
  });

  it("provider failure sets status error", async () => {
    const s = createStepper(steps, async () => ({ ok: false, error: "boom" }));
    s.setValue("name", "Ana");
    s.next();
    s.setValue("volume", "40");
    await s.submit();
    expect(s.getState().status).toBe("error");
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

```bash
cd site && npm test
```

Expected: FAIL nos dois arquivos novos.

- [ ] **Step 3: Implementar `site/src/lib/leads.ts`**

```ts
export interface LeadPayload {
  kind: "quote" | "driver" | "fulfilment";
  fields: Record<string, string>;
}

export interface LeadProvider {
  submitLead(payload: LeadPayload): Promise<{ ok: boolean; error?: string }>;
}

export const noopProvider: LeadProvider = {
  async submitLead(payload) {
    console.info("[lead]", payload.kind, payload.fields);
    return { ok: true };
  },
};

// Trocar por emailProvider/hubspotProvider no futuro sem tocar nos componentes.
export const leadProvider: LeadProvider = noopProvider;
```

- [ ] **Step 4: Implementar `site/src/lib/stepper.ts`**

```ts
import type { FormStep } from "../content/site";
import { validateStep } from "./validation";

export interface StepperState {
  step: number;
  values: Record<string, string>;
  errors: Record<string, string>;
  status: "editing" | "submitting" | "done" | "error";
}

export function createStepper(
  steps: FormStep[],
  submitFn: (values: Record<string, string>) => Promise<{ ok: boolean; error?: string }>,
) {
  const state: StepperState = { step: 0, values: {}, errors: {}, status: "editing" };

  function validateCurrent(): boolean {
    state.errors = validateStep(steps[state.step].fields, state.values);
    return Object.keys(state.errors).length === 0;
  }

  return {
    getState: (): StepperState => state,
    setValue(name: string, value: string) {
      state.values[name] = value;
      delete state.errors[name];
    },
    next() {
      if (state.step >= steps.length - 1) return;
      if (validateCurrent()) state.step += 1;
    },
    back() {
      if (state.step > 0) state.step -= 1;
      state.errors = {};
    },
    async submit() {
      if (!validateCurrent()) return;
      state.status = "submitting";
      const result = await submitFn({ ...state.values });
      state.status = result.ok ? "done" : "error";
    },
  };
}
```

- [ ] **Step 5: Rodar testes e ver passar**

```bash
npm test
```

Expected: PASS (todos).

- [ ] **Step 6: Commit**

```bash
cd .. && git add site/src/lib site/tests
git commit -m "feat(site): LeadProvider (noop) e state machine do formulario 2 passos

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Ícones autorais e linha de rota

**Files:**
- Create: `site/src/components/Icon.astro`, `site/src/components/RouteLine.astro`

**Interfaces:**
- Consumes: nada.
- Produces: `<Icon name="route|van|label|timer|map" class="..." />` e `<RouteLine class="..." />` (path com `data-route-line` para a animação da Task 11).

- [ ] **Step 1: Implementar `site/src/components/Icon.astro`**

Set único de traço 1.75px, `stroke="currentColor"`, `fill="none"`, 24x24:

```astro
---
interface Props { name: "route" | "van" | "label" | "timer" | "map"; class?: string }
const { name, class: className } = Astro.props;
const paths: Record<Props["name"], string> = {
  route: "M4 19c0-3 3-3 6-5s2-5 5-6 5 1 5 4M4 19h.01M20 12h.01",
  van: "M2 16V8h11v8M13 10h5l3 3v3M2 16h1m4 0h7m4 0h1M6 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm12 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
  label: "M3 8l6-5 12 12-6 5L3 8zm5-1.5h.01M9 13l4-4",
  timer: "M12 8v5l3 2M12 21a8 8 0 110-16 8 8 0 010 16zM10 2h4",
  map: "M12 21s-6-5.2-6-10a6 6 0 1112 0c0 4.8-6 10-6 10zm0-8a2 2 0 100-4 2 2 0 000 4z",
};
---

<svg
  class={className}
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.75"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d={paths[name]}></path>
</svg>
```

- [ ] **Step 2: Implementar `site/src/components/RouteLine.astro`**

Motivo gráfico da marca: traço de rota com vértices, decorativo, costurando seções:

```astro
---
interface Props { class?: string }
const { class: className } = Astro.props;
---

<svg
  class={className}
  viewBox="0 0 1200 120"
  fill="none"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path
    data-route-line
    d="M0 100 L180 100 L260 40 L520 40 L600 90 L860 90 L940 30 L1200 30"
    stroke="currentColor"
    stroke-width="2"
    stroke-linejoin="round"
  ></path>
  <circle cx="260" cy="40" r="4" fill="currentColor"></circle>
  <circle cx="600" cy="90" r="4" fill="currentColor"></circle>
  <circle cx="940" cy="30" r="4" fill="currentColor"></circle>
</svg>
```

- [ ] **Step 3: Verificar build**

```bash
cd site && npm run build
```

Expected: build passa (componentes ainda não usados, só compilados pelo type-check do Astro).

- [ ] **Step 4: Commit**

```bash
cd .. && git add site/src/components
git commit -m "feat(site): iconografia autoral de traco e motivo linha de rota

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Slots de imagem e IMAGE-PROMPTS.md

**Files:**
- Create: `site/public/images/hero-operation.svg`, `site/public/images/tracking-mock.svg`, `site/public/images/hero-drivers.svg`, `site/public/images/hero-fulfilment.svg`, `site/IMAGE-PROMPTS.md`

**Interfaces:**
- Consumes: paths de imagem definidos em `site.ts` (Task 3).
- Produces: arquivos placeholder nos paths exatos que os componentes referenciam; guia de geração para o usuário.

- [ ] **Step 1: Criar SVG placeholder reutilizável**

Mesmo conteúdo para os 3 arquivos, mudando apenas o texto. `site/public/images/hero-operation.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
  <rect width="1600" height="1000" fill="oklch(0.965 0.008 247)"/>
  <rect x="24" y="24" width="1552" height="952" fill="none" stroke="oklch(0.48 0.16 247)" stroke-width="4" stroke-dasharray="16 12"/>
  <text x="800" y="480" text-anchor="middle" font-family="system-ui" font-size="56" fill="oklch(0.22 0.02 247)">PLACEHOLDER: hero-operation</text>
  <text x="800" y="560" text-anchor="middle" font-family="system-ui" font-size="32" fill="oklch(0.45 0.02 247)">See IMAGE-PROMPTS.md - replace before launch</text>
</svg>
```

Duplicar como `tracking-mock.svg` (texto "PLACEHOLDER: tracking-mock", viewBox 1200x900), `hero-drivers.svg` (texto "PLACEHOLDER: hero-drivers", viewBox 1600x1000) e `hero-fulfilment.svg` (texto "PLACEHOLDER: hero-fulfilment", viewBox 1600x1000).

- [ ] **Step 2: Criar `site/IMAGE-PROMPTS.md`**

```markdown
# Image generation prompts - Molina Express

Cada imagem abaixo tem um placeholder SVG no repo. Gerar a imagem, exportar
no formato/dimensão indicados e salvar por cima do path indicado (o código
já referencia esse path). Depois atualizar a extensão em `src/content/site.ts`
e remover o campo `status` correspondente.

## 1. hero-operation (home)
- Path final: `public/images/hero-operation.jpg` (1600x1000, JPG qualidade 80)
- Alt text (já no código): "Molina Express driver loading labelled parcels into a branded van at first light"
- Prompt: "Documentary photograph, delivery driver in navy uniform loading labelled cardboard parcels into the back of a white long-wheelbase van, early morning golden light, UK industrial estate, thermal shipping labels visible, shallow depth of field, candid working moment, no posing, natural colors, 35mm"

## 2. tracking-mock
- Path final: `public/images/tracking-mock.png` (1200x900, PNG)
- Alt text: "Molina Express tracking screen showing a live map with driver position and delivery status"
- Prompt: "Clean mobile app UI mockup of a parcel tracking screen, street map of Ipswich UK with a cobalt blue route line and van position marker, status timeline showing Picked up / In transit / Delivered with the middle step active, white background, sans-serif typography, no watermark, high fidelity UI design"

## 3. hero-drivers
- Path final: `public/images/hero-drivers.jpg` (1600x1000, JPG qualidade 80)
- Alt text: "Molina Express driver in uniform closing the rear door of a long-wheelbase van"
- Prompt: "Documentary photograph, confident delivery driver in navy uniform closing the rear roller door of a white 3.5 tonne van, British residential street, daylight, hi-vis vest draped on shoulder, genuine work moment, natural skin tones, 50mm lens"

## 4. hero-fulfilment
- Path final: `public/images/hero-fulfilment.jpg` (1600x1000, JPG qualidade 80)
- Alt text: "Racked pallet positions inside the Molina Fulfilment warehouse in Ipswich"
- Prompt: "Documentary photograph inside a small clean UK fulfilment warehouse, blue steel pallet racking filled with shrink-wrapped pallets and labelled cartons, worker with handheld scanner picking an order, bright even industrial lighting, packing bench with tape and boxes in foreground, realistic working operation, 35mm"

## 5. og (Open Graph)
- Path final: `public/images/og.jpg` (1200x630, JPG)
- Prompt: "Wide banner, white background, bold extra-wide dark blue headline 'Delivery across East Anglia' left-aligned, a cobalt route line with vertex dots crossing the composition, small green reflective accent, minimal, print-quality graphic design, no photo"

Regra: verificar cada imagem no navegador em 360px e 1440px antes de publicar.
```

- [ ] **Step 3: Commit**

```bash
cd /Users/juan/orca/workspaces/LP_molina-express/web-scrap-molina_express
git add site/public/images site/IMAGE-PROMPTS.md
git commit -m "feat(site): slots de imagem placeholder e prompts de geracao

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Layout base, Header e Footer

**Files:**
- Create: `site/src/layouts/Base.astro`, `site/src/components/Header.astro`, `site/src/components/Footer.astro`
- Modify: `site/src/pages/index.astro` (usar o layout)

**Interfaces:**
- Consumes: `site` (Task 3), `Icon` (Task 6).
- Produces: `<Base title description ogImage? jsonLd?>` com slot default — todas as páginas usam este layout. Header com nav + CTA persistente; Footer com contato/cobertura/legal.

- [ ] **Step 1: Implementar `site/src/layouts/Base.astro`**

```astro
---
import "../styles/global.css";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import { site } from "../content/site";

interface Props { title: string; description: string; jsonLd?: object }
const { title, description, jsonLd } = Astro.props;
const ogImage = new URL(site.seo.ogImage, site.company.url).href;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={new URL(Astro.url.pathname, site.company.url).href} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:type" content="website" />
    <link rel="sitemap" href="/sitemap-index.xml" />
    {jsonLd && <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />}
    <!-- GA4: descomentar e preencher o ID quando houver conta
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
    -->
    <!-- Meta Pixel: adicionar aqui apenas se houver tráfego pago -->
  </head>
  <body class="bg-bg text-ink font-body">
    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-bg focus:px-4 focus:py-2">
      Skip to content
    </a>
    <Header />
    <main id="main">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 2: Implementar `site/src/components/Header.astro`**

```astro
---
import { site } from "../content/site";
---

<header class="sticky top-0 z-40 border-b border-surface bg-bg/95 backdrop-blur-sm">
  <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
    <a href="/" class="font-display display-expanded text-xl text-brand">Molina Express</a>
    <nav aria-label="Main">
      <details class="group relative md:hidden">
        <summary class="cursor-pointer list-none rounded-card px-3 py-2 text-sm font-semibold">Menu</summary>
        <ul class="absolute right-0 mt-2 w-52 rounded-card border border-surface bg-bg p-2 shadow-lg">
          {site.nav.links.map((l) => (
            <li><a class="block rounded-card px-3 py-2 hover:bg-surface" href={l.href}>{l.label}</a></li>
          ))}
          <li>
            <a class="mt-1 block rounded-card bg-brand px-3 py-2 text-center font-semibold text-white" href={site.nav.cta.href}>
              {site.nav.cta.label}
            </a>
          </li>
        </ul>
      </details>
      <ul class="hidden items-center gap-6 md:flex">
        {site.nav.links.map((l) => (
          <li><a class="text-sm font-medium hover:text-brand" href={l.href}>{l.label}</a></li>
        ))}
        <li>
          <a class="rounded-card bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-strong" href={site.nav.cta.href}>
            {site.nav.cta.label}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</header>
```

- [ ] **Step 3: Implementar `site/src/components/Footer.astro`**

```astro
---
import { site } from "../content/site";
const year = new Date().getFullYear();
---

<footer class="mt-24 bg-brand-strong text-white">
  <div class="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
    <div>
      <p class="font-display display-expanded text-lg">Molina Express</p>
      <address class="mt-3 text-sm not-italic leading-relaxed opacity-90">
        {site.company.legalName}<br />
        {site.company.address.street}<br />
        {site.company.address.city}, {site.company.address.postcode}
      </address>
    </div>
    <div>
      <p class="font-semibold">Coverage</p>
      <ul class="mt-3 space-y-1 text-sm opacity-90">
        {site.company.coverage.map((area) => <li>{area}</li>)}
      </ul>
    </div>
    <div>
      <p class="font-semibold">Contact</p>
      <ul class="mt-3 space-y-1 text-sm opacity-90">
        <li><a class="underline" href={`mailto:${site.company.recruitingEmail}`}>{site.company.recruitingEmail}</a></li>
        <li><a class="underline" href={site.company.whatsappUrl}>WhatsApp</a></li>
        <li><a class="underline" href="/drivers">Drive with us</a></li>
      </ul>
    </div>
  </div>
  <div class="border-t border-white/20 py-4 text-center text-xs opacity-75">
    © {year} {site.company.legalName}. {site.footer.note}
  </div>
</footer>
```

- [ ] **Step 4: Atualizar `site/src/pages/index.astro`** para usar o layout (conteúdo mínimo, seções entram nas Tasks 9–10):

```astro
---
import Base from "../layouts/Base.astro";
import { site } from "../content/site";
---

<Base title={site.seo.home.title} description={site.seo.home.description}>
  <h1 class="display-expanded p-8 text-4xl">Sections land in the next tasks.</h1>
</Base>
```

- [ ] **Step 5: Build e verificar**

```bash
cd site && npm run build
grep -o "Skip to content" dist/index.html && grep -o "sitemap-index.xml" dist/index.html
```

Expected: build OK; as duas strings encontradas; `dist/sitemap-index.xml` existe.

- [ ] **Step 6: Commit**

```bash
cd .. && git add site/src
git commit -m "feat(site): layout base com SEO, header sticky e footer

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 9: Home, parte 1 - herói, prova, serviços, como funciona

**Files:**
- Create: `site/src/components/sections/Hero.astro`, `site/src/components/sections/ProofBand.astro`, `site/src/components/sections/Services.astro`, `site/src/components/sections/HowItWorks.astro`
- Modify: `site/src/pages/index.astro`

**Interfaces:**
- Consumes: `site` (Task 3), `Icon`, `RouteLine` (Task 6), `Base` (Task 8).
- Produces: seções da home com âncoras `#services`, `#how-it-works`; elementos `data-hero-seq` (animados na Task 11).

- [ ] **Step 1: Implementar `Hero.astro`** (drench cobalto, 1 ideia por dobra)

```astro
---
import { site } from "../../content/site";
---

<section class="bg-brand text-white">
  <div class="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
    <div>
      <h1 data-hero-seq class="display-expanded text-[clamp(2rem,6vw,4.5rem)] leading-[1.05]">
        {site.hero.title}
      </h1>
      <p data-hero-seq class="mt-5 max-w-[60ch] text-lg opacity-95">{site.hero.subtitle}</p>
      <div data-hero-seq class="mt-8 flex flex-wrap gap-3">
        <a href={site.hero.ctaPrimary.href} class="rounded-card bg-signal px-6 py-3 font-semibold text-ink">
          {site.hero.ctaPrimary.label}
        </a>
        <a href={site.hero.ctaSecondary.href} class="rounded-card border border-white/60 px-6 py-3 font-semibold text-white">
          {site.hero.ctaSecondary.label}
        </a>
      </div>
    </div>
    <img
      data-hero-seq
      src={site.hero.image.src}
      alt={site.hero.image.alt}
      width="1600"
      height="1000"
      class="rounded-card"
      fetchpriority="high"
    />
  </div>
</section>
```

- [ ] **Step 2: Implementar `ProofBand.astro`** (números tabulares)

```astro
---
import { site } from "../../content/site";
---

<section class="border-b border-surface bg-bg">
  <dl class="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 md:grid-cols-4">
    {site.proof.metrics.map((m) => (
      <div>
        <dd class="display-expanded tabular text-3xl text-brand md:text-4xl">{m.value}</dd>
        <dt class="mt-1 text-sm text-ink">{m.label}</dt>
      </div>
    ))}
  </dl>
</section>
```

- [ ] **Step 3: Implementar `Services.astro`** (composição assimétrica: primeiro card largo, sem grade uniforme)

```astro
---
import { site } from "../../content/site";
import Icon from "../Icon.astro";
const icons = ["timer", "van", "route", "label"] as const;
---

<section id="services" class="mx-auto max-w-6xl px-4 py-20">
  <h2 class="display-expanded text-3xl md:text-4xl">{site.services.title}</h2>
  <div class="mt-10 grid gap-4 md:grid-cols-3">
    {site.services.items.map((s, i) => (
      <article
        class:list={[
          "rounded-card border border-surface p-6",
          i === 0 && "md:col-span-2 bg-surface",
        ]}
      >
        <Icon name={icons[i]} class="text-brand" />
        <h3 class="mt-3 font-display text-xl font-bold">{s.name}</h3>
        <p class="mt-2 text-ink">{s.useCase}</p>
        <p class="mt-3 text-sm font-semibold text-brand">{s.sla}</p>
      </article>
    ))}
  </div>
</section>
```

- [ ] **Step 4: Implementar `HowItWorks.astro`** (numeração legítima, RouteLine costurando)

```astro
---
import { site } from "../../content/site";
import RouteLine from "../RouteLine.astro";
---

<section id="how-it-works" class="bg-surface py-20">
  <div class="mx-auto max-w-6xl px-4">
    <h2 class="display-expanded text-3xl md:text-4xl">{site.howItWorks.title}</h2>
    <RouteLine class="mt-6 h-16 w-full text-brand" />
    <ol class="mt-6 grid gap-8 md:grid-cols-4">
      {site.howItWorks.steps.map((step, i) => (
        <li>
          <span class="display-expanded tabular text-2xl text-brand">{String(i + 1).padStart(2, "0")}</span>
          <h3 class="mt-2 font-display text-lg font-bold">{step.name}</h3>
          <p class="mt-1 text-ink">{step.detail}</p>
        </li>
      ))}
    </ol>
  </div>
</section>
```

- [ ] **Step 5: Montar em `index.astro`**

```astro
---
import Base from "../layouts/Base.astro";
import Hero from "../components/sections/Hero.astro";
import ProofBand from "../components/sections/ProofBand.astro";
import Services from "../components/sections/Services.astro";
import HowItWorks from "../components/sections/HowItWorks.astro";
import { site } from "../content/site";
---

<Base title={site.seo.home.title} description={site.seo.home.description}>
  <Hero />
  <ProofBand />
  <Services />
  <HowItWorks />
</Base>
```

- [ ] **Step 6: Build e inspeção visual**

```bash
cd site && npm run build && npm run preview &
sleep 2 && curl -s http://localhost:4321/ | grep -c "data-hero-seq"
```

Expected: build OK; `4` (título, subtítulo, CTAs, imagem). Encerrar o preview depois (`kill %1`). Abrir no navegador e conferir: herói não estoura em 360px (DevTools).

- [ ] **Step 7: Commit**

```bash
cd .. && git add site/src
git commit -m "feat(site): home - heroi, faixa de prova, servicos, como funciona

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 10: Home, parte 2 - rastreio, cases, setores

**Files:**
- Create: `site/src/components/sections/Tracking.astro`, `site/src/components/sections/Cases.astro`, `site/src/components/sections/Sectors.astro`
- Modify: `site/src/pages/index.astro`

**Interfaces:**
- Consumes: `site` (Task 3), `Base`.
- Produces: âncora `#tracking`; formulário de rastreio que redireciona para `site.company.trackingUrl` com o código como query `?code=`.

- [ ] **Step 1: Implementar `Tracking.astro`**

```astro
---
import { site } from "../../content/site";
---

<section id="tracking" class="mx-auto max-w-6xl px-4 py-20">
  <div class="grid items-center gap-10 md:grid-cols-2">
    <div>
      <h2 class="display-expanded text-3xl md:text-4xl">{site.tracking.title}</h2>
      <p class="mt-3 max-w-[60ch] text-ink">{site.tracking.body}</p>
      <form class="mt-6 flex max-w-md gap-2" data-tracking-form action={site.company.trackingUrl} method="get">
        <label class="sr-only" for="tracking-code">{site.tracking.inputLabel}</label>
        <input
          id="tracking-code"
          name="code"
          required
          placeholder="e.g. MX123456"
          class="tabular w-full rounded-card border border-ink-muted px-4 py-3"
        />
        <button type="submit" class="rounded-card bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-strong">
          {site.tracking.buttonLabel}
        </button>
      </form>
    </div>
    <img src={site.tracking.image.src} alt={site.tracking.image.alt} width="1200" height="900" class="rounded-card border border-surface" loading="lazy" />
  </div>
</section>
```

- [ ] **Step 2: Implementar `Cases.astro`** (número grande tabular + parágrafo)

```astro
---
import { site } from "../../content/site";
---

<section class="bg-surface py-20">
  <div class="mx-auto max-w-6xl px-4">
    <h2 class="display-expanded text-3xl md:text-4xl">{site.cases.title}</h2>
    <div class="mt-10 grid gap-6 md:grid-cols-2">
      {site.cases.items.map((c) => (
        <article class="rounded-card bg-bg p-8">
          <h3 class="display-expanded tabular text-2xl text-brand">{c.headline}</h3>
          <p class="mt-3 text-ink">{c.body}</p>
          <p class="mt-4 text-sm font-semibold">{c.client}</p>
        </article>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Implementar `Sectors.astro`** (lista simples, sem cards)

```astro
---
import { site } from "../../content/site";
---

<section class="mx-auto max-w-6xl px-4 py-20">
  <h2 class="display-expanded text-3xl md:text-4xl">{site.sectors.title}</h2>
  <ul class="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-lg font-medium">
    {site.sectors.items.map((s) => (
      <li class="border-b-2 border-signal pb-1">{s}</li>
    ))}
  </ul>
</section>
```

- [ ] **Step 4: Adicionar ao `index.astro`** após `<HowItWorks />`:

```astro
<Tracking />
<Cases />
<Sectors />
```

(com os imports correspondentes no frontmatter.)

- [ ] **Step 5: Build e verificar**

```bash
cd site && npm run build && grep -c 'id="tracking"' dist/index.html
```

Expected: `1`.

- [ ] **Step 6: Commit**

```bash
cd .. && git add site/src
git commit -m "feat(site): home - rastreio, cases e setores

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 11: Motion - coreografia do herói e linha de rota

**Files:**
- Create: `site/src/scripts/motion.ts`
- Modify: `site/src/layouts/Base.astro` (incluir script)

**Interfaces:**
- Consumes: elementos `[data-hero-seq]` (Task 9), `[data-route-line]` (Task 6).
- Produces: animações com guarda de `prefers-reduced-motion`; conteúdo visível por padrão (JS só realça).

- [ ] **Step 1: Implementar `site/src/scripts/motion.ts`**

```ts
import { animate, stagger } from "motion";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduced) {
  const heroItems = document.querySelectorAll<HTMLElement>("[data-hero-seq]");
  if (heroItems.length > 0) {
    animate(
      heroItems,
      { opacity: [0, 1], transform: ["translateY(16px)", "translateY(0)"] },
      { duration: 0.55, delay: stagger(0.12), easing: [0.25, 1, 0.5, 1] },
    );
  }

  for (const path of document.querySelectorAll<SVGPathElement>("[data-route-line]")) {
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          animate(path, { strokeDashoffset: [length, 0] }, { duration: 1.4, easing: [0.25, 1, 0.5, 1] });
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    ).observe(path);
  }
}
```

- [ ] **Step 2: Incluir no `Base.astro`**, antes de `</body>`:

```astro
<script src="../scripts/motion.ts"></script>
```

- [ ] **Step 3: Verificar manualmente**

```bash
cd site && npm run dev
```

No navegador: (a) herói entra em sequência; (b) linha de rota desenha no scroll; (c) com "Emulate CSS prefers-reduced-motion" no DevTools, nada anima e tudo está visível; (d) com JS desabilitado, tudo visível. Encerrar o dev server.

- [ ] **Step 4: Commit**

```bash
cd .. && git add site/src
git commit -m "feat(site): motion do heroi e linha de rota com reduced-motion

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 12: Formulário de cotação (island) e página /thanks

**Files:**
- Create: `site/src/components/LeadForm.astro`, `site/src/scripts/leadform-dom.ts`, `site/src/pages/thanks.astro`
- Modify: `site/src/pages/index.astro`

**Interfaces:**
- Consumes: `createStepper` (Task 5), `validateStep`/`FieldRule` (Tasks 3–4), `leadProvider` (Task 5).
- Produces: `<LeadForm kind="quote" config={site.quoteForm} anchor="quote" />` reutilizado pela Task 13 com `kind="driver"`. Submissão bem-sucedida navega para `/thanks`.

- [ ] **Step 1: Implementar `site/src/components/LeadForm.astro`**

Renderiza os 2 passos server-side; o script DOM controla visibilidade/validação:

```astro
---
import type { FormStep } from "../content/site";

interface Props {
  kind: "quote" | "driver" | "fulfilment";
  anchor: string;
  config: { title: string; subtitle: string; steps: readonly FormStep[]; submitLabel: string };
}
const { kind, anchor, config } = Astro.props;
---

<section id={anchor} class="bg-brand py-20 text-white">
  <div class="mx-auto max-w-2xl px-4">
    <h2 class="display-expanded text-3xl md:text-4xl">{config.title}</h2>
    <p class="mt-2 opacity-95">{config.subtitle}</p>

    <form data-lead-form data-kind={kind} novalidate class="mt-8 rounded-card bg-bg p-6 text-ink md:p-8">
      <script type="application/json" data-lead-steps set:html={JSON.stringify(config.steps)} />
      <p class="text-sm font-semibold text-ink-muted" data-step-indicator>Step 1 of {config.steps.length}</p>

      {config.steps.map((step, stepIndex) => (
        <fieldset data-step={stepIndex} class:list={[stepIndex > 0 && "hidden"]}>
          <legend class="mt-2 font-display text-xl font-bold">{step.title}</legend>
          {step.fields.map((f) => (
            <div class="mt-4">
              <label class="block text-sm font-semibold" for={`${kind}-${f.name}`}>{f.label}</label>
              {f.type === "select" ? (
                <select
                  id={`${kind}-${f.name}`}
                  name={f.name}
                  class="mt-1 w-full rounded-card border border-ink-muted px-4 py-3"
                  aria-describedby={`${kind}-${f.name}-error`}
                >
                  <option value="">Choose…</option>
                  {(f.options ?? []).map((o) => <option value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  id={`${kind}-${f.name}`}
                  name={f.name}
                  type={f.type}
                  class="mt-1 w-full rounded-card border border-ink-muted px-4 py-3"
                  aria-describedby={`${kind}-${f.name}-error`}
                />
              )}
              <p id={`${kind}-${f.name}-error`} data-error-for={f.name} class="mt-1 hidden text-sm font-semibold text-red-700"></p>
            </div>
          ))}
        </fieldset>
      ))}

      <div class="mt-6 flex gap-3">
        <button type="button" data-back class="hidden rounded-card border border-ink-muted px-5 py-3 font-semibold">Back</button>
        <button type="button" data-next class="rounded-card bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-strong">Continue</button>
        <button type="submit" data-submit class="hidden rounded-card bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-strong">
          {config.submitLabel}
        </button>
      </div>
      <p data-form-error class="mt-3 hidden text-sm font-semibold text-red-700">Something went wrong. Try again or email us.</p>
    </form>
  </div>
</section>

<script src="../scripts/leadform-dom.ts"></script>
```

- [ ] **Step 2: Implementar `site/src/scripts/leadform-dom.ts`**

```ts
import { createStepper } from "../lib/stepper";
import { leadProvider } from "../lib/leads";
import type { FormStep } from "../content/site";

for (const form of document.querySelectorAll<HTMLFormElement>("[data-lead-form]")) {
  const kind = form.dataset.kind as "quote" | "driver" | "fulfilment";
  const steps: FormStep[] = JSON.parse(form.querySelector("[data-lead-steps]")!.textContent!);
  const stepper = createStepper(steps, (fields) => leadProvider.submitLead({ kind, fields }));

  const fieldsets = form.querySelectorAll<HTMLFieldSetElement>("[data-step]");
  const backBtn = form.querySelector<HTMLButtonElement>("[data-back]")!;
  const nextBtn = form.querySelector<HTMLButtonElement>("[data-next]")!;
  const submitBtn = form.querySelector<HTMLButtonElement>("[data-submit]")!;
  const indicator = form.querySelector<HTMLElement>("[data-step-indicator]")!;
  const formError = form.querySelector<HTMLElement>("[data-form-error]")!;

  form.addEventListener("input", (e) => {
    const t = e.target as HTMLInputElement | HTMLSelectElement;
    if (t.name) stepper.setValue(t.name, t.value);
    render();
  });

  function render() {
    const { step, errors, status } = stepper.getState();
    fieldsets.forEach((fs, i) => fs.classList.toggle("hidden", i !== step));
    backBtn.classList.toggle("hidden", step === 0);
    nextBtn.classList.toggle("hidden", step === steps.length - 1);
    submitBtn.classList.toggle("hidden", step !== steps.length - 1);
    submitBtn.disabled = status === "submitting";
    indicator.textContent = `Step ${step + 1} of ${steps.length}`;
    formError.classList.toggle("hidden", status !== "error");
    for (const p of form.querySelectorAll<HTMLElement>("[data-error-for]")) {
      const msg = errors[p.dataset.errorFor!];
      p.textContent = msg ?? "";
      p.classList.toggle("hidden", !msg);
    }
    const firstError = Object.keys(errors)[0];
    if (firstError) form.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
  }

  backBtn.addEventListener("click", () => { stepper.back(); render(); });
  nextBtn.addEventListener("click", () => { stepper.next(); render(); });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await stepper.submit();
    render();
    if (stepper.getState().status === "done") window.location.href = "/thanks";
  });
}
```

- [ ] **Step 3: Criar `site/src/pages/thanks.astro`**

```astro
---
import Base from "../layouts/Base.astro";
import { site } from "../content/site";
---

<Base title={site.seo.thanks.title} description={site.seo.thanks.description}>
  <section class="mx-auto max-w-2xl px-4 py-32 text-center">
    <h1 class="display-expanded text-4xl">{site.thanks.title}</h1>
    <p class="mt-4 text-lg text-ink">{site.thanks.body}</p>
    <a href="/" class="mt-8 inline-block rounded-card bg-brand px-6 py-3 font-semibold text-white">{site.thanks.backLabel}</a>
  </section>
</Base>
```

- [ ] **Step 4: Adicionar ao `index.astro`** após `<Sectors />`:

```astro
<LeadForm kind="quote" anchor="quote" config={site.quoteForm} />
```

(import no frontmatter.)

- [ ] **Step 5: Verificar manualmente**

```bash
cd site && npm run dev
```

No navegador: passo 1 vazio + Continue → erros inline e foco no primeiro campo; preencher → passo 2; Back preserva valores; submit válido → `/thanks`. Encerrar dev server.

- [ ] **Step 6: Rodar testes e build**

```bash
npm test && npm run build
```

Expected: PASS + build OK.

- [ ] **Step 7: Commit**

```bash
cd .. && git add site/src
git commit -m "feat(site): formulario de cotacao 2 passos e pagina thanks

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 13: Página /drivers

**Files:**
- Create: `site/src/pages/drivers.astro`
- Modify: nada.

**Interfaces:**
- Consumes: `Base`, `LeadForm` (Task 12), `Icon`, `site.drivers`, `site.driverForm`.
- Produces: página completa de recrutamento em `/drivers`.

- [ ] **Step 1: Implementar `site/src/pages/drivers.astro`**

```astro
---
import Base from "../layouts/Base.astro";
import LeadForm from "../components/LeadForm.astro";
import Icon from "../components/Icon.astro";
import { site } from "../content/site";
const d = site.drivers;
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: "Delivery Driver (self-employed)",
  hiringOrganization: { "@type": "Organization", name: site.company.legalName },
  jobLocation: {
    "@type": "Place",
    address: { "@type": "PostalAddress", addressLocality: site.company.address.city, addressCountry: "GB" },
  },
  employmentType: "CONTRACTOR",
  description: d.hero.subtitle,
};
---

<Base title={site.seo.drivers.title} description={site.seo.drivers.description} jsonLd={jsonLd}>
  <section class="bg-brand text-white">
    <div class="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
      <div>
        <h1 data-hero-seq class="display-expanded text-[clamp(2rem,6vw,4.5rem)] leading-[1.05]">{d.hero.title}</h1>
        <p data-hero-seq class="mt-5 max-w-[60ch] text-lg opacity-95">{d.hero.subtitle}</p>
        <a data-hero-seq href={d.hero.cta.href} class="mt-8 inline-block rounded-card bg-signal px-6 py-3 font-semibold text-ink">
          {d.hero.cta.label}
        </a>
      </div>
      <img data-hero-seq src={d.hero.image.src} alt={d.hero.image.alt} width="1600" height="1000" class="rounded-card" fetchpriority="high" />
    </div>
  </section>

  <section class="mx-auto max-w-3xl px-4 py-20">
    <h2 class="display-expanded text-3xl md:text-4xl">{d.story.title}</h2>
    <p class="mt-4 text-lg leading-relaxed text-ink">{d.story.body}</p>
  </section>

  <section class="bg-surface py-20">
    <div class="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2">
      <div>
        <h2 class="display-expanded text-2xl md:text-3xl">{d.benefits.title}</h2>
        <ul class="mt-6 space-y-3">
          {d.benefits.items.map((item) => (
            <li class="flex items-start gap-3">
              <Icon name="label" class="mt-0.5 shrink-0 text-brand" />
              <span class="text-ink">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 class="display-expanded text-2xl md:text-3xl">{d.expectations.title}</h2>
        <ul class="mt-6 space-y-3">
          {d.expectations.items.map((item) => (
            <li class="flex items-start gap-3">
              <Icon name="route" class="mt-0.5 shrink-0 text-brand" />
              <span class="text-ink">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>

  <LeadForm kind="driver" anchor="apply" config={site.driverForm} />
</Base>
```

- [ ] **Step 2: Build e verificar**

```bash
cd site && npm run build && grep -c "JobPosting" dist/drivers/index.html
```

Expected: `1`.

- [ ] **Step 3: Commit**

```bash
cd .. && git add site/src
git commit -m "feat(site): pagina /drivers com historia, beneficios e aplicacao

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 14: JSON-LD da home e OG

**Files:**
- Modify: `site/src/pages/index.astro`

**Interfaces:**
- Consumes: prop `jsonLd` do `Base` (Task 8).
- Produces: LocalBusiness + Service em JSON-LD na home.

- [ ] **Step 1: Adicionar ao frontmatter de `index.astro`**

```ts
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.company.legalName,
  url: site.company.url,
  email: site.company.recruitingEmail,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.company.address.street,
    addressLocality: site.company.address.city,
    postalCode: site.company.address.postcode,
    addressCountry: site.company.address.country,
  },
  areaServed: site.company.coverage,
  makesOffer: site.services.items.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.name, description: s.useCase },
  })),
};
```

E passar `jsonLd={jsonLd}` no `<Base>`.

- [ ] **Step 2: Build e verificar**

```bash
cd site && npm run build && grep -c "LocalBusiness" dist/index.html
```

Expected: `1`.

- [ ] **Step 3: Commit**

```bash
cd .. && git add site/src
git commit -m "feat(site): JSON-LD LocalBusiness e Service na home

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 15: Suite Playwright, README e checklist de PR

**Files:**
- Create: `site/playwright.config.ts`, `site/tests/e2e/smoke.spec.ts`, `site/README.md`, `.github/pull_request_template.md` (raiz do repo)

**Interfaces:**
- Consumes: site completo (Tasks 1–14).
- Produces: `npm run test:e2e` verde; documentação de operação.

- [ ] **Step 1: Criar `site/playwright.config.ts`**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  webServer: {
    command: "npm run build && npm run preview",
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: "http://localhost:4321" },
});
```

- [ ] **Step 2: Escrever `site/tests/e2e/smoke.spec.ts`**

```ts
import { test, expect, type Page } from "@playwright/test";

function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

for (const path of ["/", "/drivers", "/thanks"]) {
  test(`${path} renders without console errors`, async ({ page }) => {
    const errors = trackConsoleErrors(page);
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("quote form walks two steps to /thanks", async ({ page }) => {
  await page.goto("/");
  const form = page.locator('[data-lead-form][data-kind="quote"]');
  await form.scrollIntoViewIfNeeded();

  await form.getByRole("button", { name: "Continue" }).click();
  await expect(form.locator('[data-error-for="name"]')).toBeVisible();

  await form.locator('[name="name"]').fill("Test Person");
  await form.locator('[name="company"]').fill("Test Co");
  await form.locator('[name="email"]').fill("test@example.com");
  await form.locator('[name="phone"]').fill("07911123456");
  await form.getByRole("button", { name: "Continue" }).click();

  await form.locator('[name="volume"]').fill("40");
  await form.locator('[name="pickup_area"]').fill("Ipswich");
  await form.getByRole("button", { name: "Request quote" }).click();

  await page.waitForURL("**/thanks");
  await expect(page.locator("h1")).toContainText("Got it");
});

test("driver form reaches /thanks", async ({ page }) => {
  await page.goto("/drivers");
  const form = page.locator('[data-lead-form][data-kind="driver"]');
  await form.scrollIntoViewIfNeeded();
  await form.locator('[name="name"]').fill("Test Driver");
  await form.locator('[name="email"]').fill("driver@example.com");
  await form.locator('[name="phone"]').fill("07911123456");
  await form.getByRole("button", { name: "Continue" }).click();
  await form.locator('[name="right_to_work"]').selectOption("Yes");
  await form.locator('[name="licence_years"]').fill("5");
  await form.locator('[name="preferred_area"]').selectOption("Suffolk");
  await form.locator('[name="availability"]').fill("5");
  await form.getByRole("button", { name: "Send application" }).click();
  await page.waitForURL("**/thanks");
});
```

- [ ] **Step 3: Instalar browsers e rodar**

```bash
cd site && npx playwright install chromium && npm run test:e2e
```

Expected: todos os testes PASS. Se falhar, corrigir o site (não o teste) e re-rodar.

- [ ] **Step 4: Criar `site/README.md`**

```markdown
# Molina Express - site

Astro 5 + Tailwind v4. Spec: `../docs/superpowers/specs/2026-08-18-molina-express-site-design.md`.

## Comandos
- `npm run dev` - desenvolvimento
- `npm run build` - build (aceita placeholders)
- `npm run build:prod` - build de produção (FALHA se houver TODO_ em src/content/site.ts)
- `npm run check:placeholders` - lista dados reais pendentes
- `npm test` / `npm run test:e2e` - unit / smoke

## Antes de publicar
1. `npm run check:placeholders` e substituir cada TODO_ por dado real.
2. Gerar as imagens de `IMAGE-PROMPTS.md` e substituir os SVG placeholder.
3. Rodar Lighthouse (meta ≥ 95 em todas as categorias, LCP < 2s, CLS < 0.1).
4. Checklist anti-cara-de-IA do PR template.
```

- [ ] **Step 5: Criar `.github/pull_request_template.md`** (na raiz do repo, checklist do blueprint §9)

```markdown
## Checklist anti-cara-de-IA (bloqueante)

- [ ] Nenhum gradiente em texto
- [ ] Nenhum fundo creme/areia/bege
- [ ] Nenhuma fonte da lista proibida (Inter, Space Grotesk, DM Sans, Outfit, Playfair, Fraunces, Plus Jakarta)
- [ ] Nenhum kicker maiúsculo repetido acima de seções
- [ ] Numeração de seção só onde há sequência real
- [ ] Nenhuma grade de cards idênticos com ícone + título + texto
- [ ] Nenhum ícone em círculo colorido acima de título
- [ ] Nenhum glassmorphism
- [ ] Corpo de texto em --ink (não cinza claro)
- [ ] Foto real/gerada na primeira dobra (não placeholder) — ou PR marcado como pré-lançamento
- [ ] Números exibidos têm fonte real — ou `check:placeholders` ainda os lista
- [ ] Herói não estoura em 360px
- [ ] Teste do concorrente: a frase que descreve a página não descreve a página deles
```

- [ ] **Step 6: Rodar tudo e commitar**

```bash
cd site && npm test && npm run test:e2e && npm run build
cd .. && git add site .github
git commit -m "test(site): suite smoke Playwright, README e checklist de PR

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 16: Página /fulfilment e faixa na home

**Files:**
- Create: `site/src/pages/fulfilment.astro`, `site/src/components/sections/FulfilmentBand.astro`
- Modify: `site/src/pages/index.astro`, `site/tests/e2e/smoke.spec.ts`

**Interfaces:**
- Consumes: `Base` (Task 8), `LeadForm` (Task 12), `Icon`/`RouteLine` (Task 6), `site.fulfilment`, `site.fulfilmentForm` (Task 3).
- Produces: página `/fulfilment` completa; faixa na home após `<Sectors />` linkando para ela; smoke tests cobrindo a página e o formulário.

- [ ] **Step 1: Implementar `site/src/pages/fulfilment.astro`**

```astro
---
import Base from "../layouts/Base.astro";
import LeadForm from "../components/LeadForm.astro";
import Icon from "../components/Icon.astro";
import RouteLine from "../components/RouteLine.astro";
import { site } from "../content/site";
const f = site.fulfilment;
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Third-party logistics (3PL) and e-commerce fulfilment",
  provider: { "@type": "Organization", name: site.company.legalName, url: site.company.url },
  areaServed: "GB",
  description: site.seo.fulfilment.description,
};
---

<Base title={site.seo.fulfilment.title} description={site.seo.fulfilment.description} jsonLd={jsonLd}>
  <section class="bg-brand text-white">
    <div class="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
      <div>
        <h1 data-hero-seq class="display-expanded text-[clamp(2rem,6vw,4.5rem)] leading-[1.05]">{f.hero.title}</h1>
        <p data-hero-seq class="mt-5 max-w-[60ch] text-lg opacity-95">{f.hero.subtitle}</p>
        <a data-hero-seq href={f.hero.cta.href} class="mt-8 inline-block rounded-card bg-signal px-6 py-3 font-semibold text-ink">
          {f.hero.cta.label}
        </a>
      </div>
      <img data-hero-seq src={f.hero.image.src} alt={f.hero.image.alt} width="1600" height="1000" class="rounded-card" fetchpriority="high" />
    </div>
  </section>

  <section class="mx-auto max-w-6xl px-4 py-20">
    <h2 class="display-expanded text-3xl md:text-4xl">{f.services.title}</h2>
    <dl class="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-3">
      {f.services.items.map((s) => (
        <div class="border-t border-surface pt-4">
          <dt class="font-display text-lg font-bold">{s.name}</dt>
          <dd class="mt-1 text-ink">{s.detail}</dd>
        </div>
      ))}
    </dl>
  </section>

  <section class="bg-surface py-20">
    <div class="mx-auto max-w-6xl px-4">
      <h2 class="display-expanded text-3xl md:text-4xl">{f.capacity.title}</h2>
      <p class="mt-4 max-w-[65ch] text-lg text-ink">{f.capacity.body}</p>
      <RouteLine class="mt-8 h-16 w-full text-brand" />
      <ul class="mt-6 flex flex-wrap gap-x-10 gap-y-3">
        {f.capacity.points.map((p) => (
          <li class="display-expanded tabular border-b-2 border-signal pb-1 text-xl text-brand">{p}</li>
        ))}
      </ul>
    </div>
  </section>

  <section class="mx-auto max-w-6xl px-4 py-20">
    <h2 class="display-expanded text-3xl md:text-4xl">{f.audience.title}</h2>
    <ul class="mt-8 grid gap-4 md:grid-cols-2">
      {f.audience.items.map((item) => (
        <li class="flex items-start gap-3">
          <Icon name="map" class="mt-0.5 shrink-0 text-brand" />
          <span class="text-lg text-ink">{item}</span>
        </li>
      ))}
    </ul>
  </section>

  <LeadForm kind="fulfilment" anchor="fulfilment-quote" config={site.fulfilmentForm} />
</Base>
```

- [ ] **Step 2: Implementar `site/src/components/sections/FulfilmentBand.astro`**

```astro
---
import { site } from "../../content/site";
---

<section class="bg-brand-strong text-white">
  <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-14">
    <div>
      <h2 class="display-expanded text-2xl md:text-3xl">Need a warehouse, not just a courier?</h2>
      <p class="mt-2 max-w-[60ch] opacity-95">
        Storage, pick and pack, returns and Amazon prep from our Ipswich warehouse. 126 pallet positions, capacity available now.
      </p>
    </div>
    <a href="/fulfilment" class="rounded-card bg-signal px-6 py-3 font-semibold text-ink">See fulfilment</a>
  </div>
</section>
```

- [ ] **Step 3: Adicionar ao `index.astro`** após `<Sectors />` (antes do `<LeadForm ... />`):

```astro
<FulfilmentBand />
```

(import no frontmatter.)

- [ ] **Step 4: Estender `site/tests/e2e/smoke.spec.ts`**

Trocar a lista de rotas por `["/", "/drivers", "/fulfilment", "/thanks"]` e acrescentar:

```ts
test("fulfilment form reaches /thanks", async ({ page }) => {
  await page.goto("/fulfilment");
  const form = page.locator('[data-lead-form][data-kind="fulfilment"]');
  await form.scrollIntoViewIfNeeded();
  await form.locator('[name="name"]').fill("Test Buyer");
  await form.locator('[name="company"]').fill("Brand Co");
  await form.locator('[name="email"]').fill("ops@example.com");
  await form.locator('[name="phone"]').fill("07911123456");
  await form.getByRole("button", { name: "Continue" }).click();
  await form.locator('[name="pallets"]').fill("60");
  await form.locator('[name="orders_month"]').fill("2000");
  await form.locator('[name="items_per_order"]').fill("1.4");
  await form.locator('[name="channels"]').selectOption("Shopify");
  await form.getByRole("button", { name: "Request fulfilment quote" }).click();
  await page.waitForURL("**/thanks");
});
```

- [ ] **Step 5: Rodar tudo**

```bash
cd site && npm test && npm run test:e2e && npm run build && grep -c "Third-party logistics" dist/fulfilment/index.html
```

Expected: unit PASS, e2e PASS, build OK, grep retorna `1`.

- [ ] **Step 6: Commit**

```bash
cd .. && git add site/src site/tests
git commit -m "feat(site): pagina /fulfilment (vertical 3PL) e faixa na home

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Pós-plano (fora das tasks, requer o usuário)

1. Usuário fornece a URL do repositório → `git remote add origin <url>` (ou mover `site/` para o novo repo), push da branch, abrir PR.
2. Usuário gera as 5 imagens de `IMAGE-PROMPTS.md` e substitui os placeholders.
2b. Usuário confirma o endereço correto (Russel House/Elton Business Park vs Elton Park Business Centre) e substitui `TODO_confirm_street_address`.
3. Usuário fornece os dados reais dos `TODO_` (rodar `npm run check:placeholders` para a lista).
4. Deploy no Railway com `npm run build:prod` como comando de build (o gate de placeholders passa a valer).
```
