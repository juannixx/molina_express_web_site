# Molina Express Website

New marketing website for Molina Express, a UK courier and logistics company. It targets B2B clients on the main funnel and has a dedicated page for driver recruitment.

## Highlights

- **Performance first:** static site built with Astro, with a Lighthouse target of 95+ in every category, LCP under 2s and CLS under 0.1
- **Placeholder guard:** real business data (numbers, case studies, logos) is centralized, and the production build fails if any `TODO_` placeholder is left
- **Pluggable lead forms:** forms go through a `LeadProvider` interface, so email or CRM delivery can be added later without touching the UI
- **Preview per pull request:** every PR gets its own deploy on GitHub Pages, with the URL commented on the PR automatically
- **Tested:** unit tests with Vitest and smoke tests with Playwright

## Tech stack

Astro 5, TypeScript, Tailwind CSS v4, Motion, Vitest, Playwright, GitHub Actions, GitHub Pages.

## Getting started

```bash
cd site
npm install
npm run dev                  # local development
npm test                     # unit tests
npm run test:e2e             # Playwright smoke tests
npm run check:placeholders   # list real data still pending
npm run build:prod           # production build (fails if placeholders remain)
```

## Project structure

```
site/
├── src/components/   # Header, Footer, lead form and page sections (Hero, Services, Tracking, Cases...)
├── src/content/      # centralized site content and placeholders
├── scripts/          # placeholder checker used by the production build
└── tests/            # Vitest unit tests and Playwright smoke tests
docs/superpowers/     # design spec and implementation plan (in Portuguese)
```
