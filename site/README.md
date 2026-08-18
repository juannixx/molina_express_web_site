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
