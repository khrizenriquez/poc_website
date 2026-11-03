# PoC · Regional corporate website

A bilingual corporate website demo with six country sites across Central America. It pairs an interactive 3D hero with a regional map, a sample product catalog, and simulated service forms. The visual direction draws on Lusion, Montfort, and Apple.

[View the live demo](https://khrizenriquez.github.io/poc_website/)

## Getting started

Use Node.js 26.13.0 and pnpm 12.16.1. The project uses those exact versions locally and in CI. React 19.3.1, Vite 8.3.5, Tailwind CSS 4.3.4, and Vitest 5.1.0 are pinned in `package.json` and `pnpm-lock.yaml`.

With nvm installed, run the following from the repository root:

```sh
nvm install
nvm use
npm install --global pnpm@12.16.1
pnpm install --frozen-lockfile
pnpm dev
```

Open the URL printed by Vite, usually `http://127.0.0.1:5173/poc_website/`.

To preview the production build locally:

```sh
pnpm build
pnpm preview
```

## Tests and coverage

```sh
pnpm test                 # Run unit and DOM integration tests
pnpm test:coverage        # Run tests with V8 coverage
pnpm test:watch           # Rerun tests as files change
pnpm check                # Run coverage, build the site, and audit static delivery
```

Coverage includes all JavaScript and JSX files in `src/`, from the app entry point to the 3D scene, navigation, and forms. The suite requires at least 95% coverage for statements, branches, functions, and lines. The latest run passed **499 tests with 100% coverage across all four metrics**.

The HTML report is at `coverage/index.html`, the JSON summary at `coverage/coverage-summary.json`, and the build audit at `test-results/build-audit.json`. See the [verification report](docs/sdd/verification.md) and [test matrix](docs/sdd/test-matrix.md).

## Branding and motion

The logo, favicon, page titles, and interface use the **PoC** brand. The footer reads `© 2026 PoC - Christofer Enríquez`. The original photographs from Guatemala serve as visual references for the region.

GSAP ScrollTrigger adds parallax to large images on country homepages, panoramic sections, editorial pages, and individual news stories. The effect keeps the image within its frame and respects the visitor's reduced motion preference. Thumbnails, flags, and form images stay still.

## What's included

- Eight corporate routes and twelve routes for each country site: Guatemala, El Salvador, Honduras, Nicaragua, Costa Rica, and Panama.
- Two legal routes and a 404 page. The 82 content routes are available in Spanish and English, for 164 localized routes. The 404 page is also bilingual.
- Six fictional products with search, category filters, accessible product details, and a link to a sample order form.
- Three sample news stories with shareable links.
- Forms for contact, general inquiries, orders, returns, adverse event reporting, ethics concerns, and job applications. Each form validates input locally and clearly marks the confirmation as a simulation.
- Light, dark, and system appearance settings with saved preferences and synchronization across tabs.
- A mobile menu, country and language selectors, keyboard navigation, and support for reduced motion.

The country sites share a visual identity and use sample content tailored to each country. Everything runs in the browser. The demo keeps only language and appearance preferences in local storage, and form submissions are simulated.

## Languages and content

| File                                                  | Purpose                                                            |
| ----------------------------------------------------- | ------------------------------------------------------------------ |
| `src/config/languages.js`                             | Supported languages, Spanish as the default, and the storage key   |
| `src/i18n/locales/es.js` and `src/i18n/locales/en.js` | Page copy, accessible labels, error messages, and interface states |
| `src/i18n/index.js`                                   | i18next setup and local translation resources                      |
| `src/data/site.js`                                    | Country data, route definitions, sample products, and news stories |

To add a language, register it in `src/config/languages.js`, create its translation file, and add it to `resources` in `src/i18n/index.js`. Extend the translation parity tests to cover the new language.

The language in the URL takes precedence over a saved preference. First-time visitors use Spanish by default. The language selector keeps the current country, page, and query parameters. Route slugs are shared across languages.

## Light, dark, and system appearance

The **Appearance** selector sits next to the language selector. The default **System** setting follows the device's appearance and updates when that setting changes. Visitors can choose **Light** or **Dark** to override it. Browsers without `matchMedia` fall back to Light.

The choice is saved under `leterago-poc.theme`. Invalid saved values fall back to System, and visitors can still change the theme for the current session if storage is unavailable. The theme persists across navigation, and switching themes preserves form drafts and catalog filters.

| File                          | Purpose                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------- |
| `src/config/theme.js`         | Appearance options, storage key, and system preference query                    |
| `src/theme/ThemeProvider.jsx` | Shared appearance state, storage, tab synchronization, and browser theme colors |
| `src/styles/themes.css`       | Color tokens for light and dark mode                                            |

See the [theme behavior and acceptance criteria](docs/sdd/theme.md).

## GitHub Pages

Vite uses `/poc_website/` as its base path. React Router's `HashRouter` lets visitors open or reload a deep link on GitHub Pages:

```text
/poc_website/#/es/
/poc_website/#/es/guatemala/productos/
/poc_website/#/en/guatemala/pedidos/?product=P01
```

The workflow in `.github/workflows/pages.yml` runs `pnpm check`. It deploys after successful validation on pushes to `main` or manual runs on `main`. Pull requests and manual runs on other branches run validation only.

To enable deployment in another copy of the repository, select **GitHub Actions** under **Settings → Pages → Build and deployment → Source**. If you change the repository name, update the base path and its checks to match. See the [deployment guide](docs/github-pages.md).

## Project structure

```text
src/
  components/    Navigation, regional map, dialogs, and 3D scene
  config/        Language and appearance settings
  data/          Demo content and route definitions
  i18n/          Translation setup and locale files
  lib/           Routing, catalog filters, and form validation
  pages/         Homepages, editorial pages, catalog, news, and forms
  styles/        Branding, themes, and responsive layouts
  theme/         Shared appearance state
public/media/    Local image and media assets
scripts/         Static build audit
tests/           Unit and integration tests
docs/sdd/        Technical direction, implementation plan, and test matrix
```

[Asset sources](docs/asset-sources.md) · [Visual direction](direccion-visual.md) · [Design references](referencias-web.md)
