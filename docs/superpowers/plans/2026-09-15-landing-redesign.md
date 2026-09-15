# ThreadVault Landing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the ThreadVault landing page to the reference template's layout (split hero, value props, card grids, single highlighted pricing plan, CTA banner, rich footer) while keeping the existing dark palette, swapping violet for the app's gold accent, replacing the hero's HTML mockup with an original inline SVG illustration, adding real screenshots to Features, adding a Privacy section, an Android email-capture waitlist backed by a Cloudflare Pages Function + KV, and an FAQ.

**Architecture:** Astro 7 static site, unchanged output mode (no SSR adapter). Every new section is a new `.astro` component consumed by both `src/pages/index.astro` (es) and `src/pages/en/index.astro` (en), driven by `src/i18n/copy.ts`. The one dynamic piece, the Android waitlist form, is a Cloudflare Pages Function (`functions/api/notify.ts`) reading/writing a Cloudflare KV namespace, deployed by the existing `wrangler pages deploy dist` command via Pages' native `functions/`-directory auto-detection (no adapter).

**Tech Stack:** Astro 7.2, Tailwind v4 (`@tailwindcss/vite`, CSS-first `@theme` tokens), `@fontsource-variable/inter`, TypeScript, Cloudflare Pages + Pages Functions + Workers KV, `wrangler` v3 (via `cloudflare/wrangler-action@v3`, already in `.github/workflows/deploy.yml`).

**Spec:** `docs/superpowers/specs/2026-09-15-landing-redesign-design.md`

## Global Constraints

- No em dash character anywhere in copy, commas and periods only.
- Spanish is the default language (`defaultLang: "es"`); every new string ships in both `es` and `en` in `src/i18n/copy.ts`, except the two standalone privacy-policy pages, which are per-language `.astro` files (page-specific prose, not `copy.ts` entries).
- No testimonials, no logo strip, no fabricated numbers anywhere.
- No new fonts, icon library, or animation library. No external `<script src>` at all, every script is `is:inline`.
- No `@astrojs/cloudflare` adapter, no SSR, the site stays static except the one `functions/api/notify.ts` route.
- No third-party email service, Cloudflare KV only.
- No people, no rockets, no stock photography, including in the hero SVG.
- Never mention the reference template's origin (name or vendor) anywhere in code, comments, or copy.
- Every task ends with `npm run build` green and a commit.
- Primary CTA style: `bg-gold-300 text-ink-950 hover:bg-gold-200` (dark text on gold fill). Secondary CTA: outlined, `border-white/10` hover-tinted gold.
- Reuse `[data-reveal]` / `data-reveal-ready` exactly as implemented in `Layout.astro` / `global.css` for every new section, no new reveal mechanism.

---

### Task 1: Gold/ink design tokens and shared CTA utilities

**Estimated effort:** 1 hour

**Files:**
- Modify: `src/styles/global.css`
- Verify (no change expected): `src/layouts/Layout.astro`

**Interfaces:**
- Produces: `--color-gold-{50,100,200,300,400,500,600,950}` and `--color-ink-{900,950}` CSS custom properties (and the Tailwind utility classes Tailwind v4 generates from them, e.g. `bg-gold-300`, `text-ink-950`, `border-gold-400/25`, `shadow-gold-500/50`). Produces two new component classes, `.cta-primary` and `.cta-secondary`, in `global.css`'s `@layer components`, for every later task's buttons to consume instead of repeating the full utility-class list.
- Consumes: nothing new (extends the existing `@theme` block).

- [ ] **Step 1: Add the gold and ink tokens to `@theme`**

Edit `src/styles/global.css`. Find:
```css
@theme {
  --font-sans: "Inter Variable", system-ui, -apple-system, "Segoe UI", sans-serif;

  /* Stronger than the built-in curves, which are too weak to read as intentional. */
  --ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out-strong: cubic-bezier(0.77, 0, 0.175, 1);
}
```
Replace with:
```css
@theme {
  --font-sans: "Inter Variable", system-ui, -apple-system, "Segoe UI", sans-serif;

  /* Stronger than the built-in curves, which are too weak to read as intentional. */
  --ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out-strong: cubic-bezier(0.77, 0, 0.175, 1);

  /* Gold replaces violet as the primary accent. Sampled from the app icon
     spec: a layered card stack in #E8D5A3 on a near-black radial gradient
     (see ThreadVault/Assets.xcassets, scripts/render-app-icon.swift). */
  --color-gold-50: #fbf7ee;
  --color-gold-100: #f5ebd4;
  --color-gold-200: #f0e4c4;
  --color-gold-300: #e8d5a3;
  --color-gold-400: #ddc079;
  --color-gold-500: #cba753;
  --color-gold-600: #a98937;
  --color-gold-950: #2a2210;

  /* Near-black card-surface family, echoes the app icon's dark gradient.
     Used where a surface should read as "the app," not generic site chrome:
     the hero illustration and the Privacy section. */
  --color-ink-900: #1d1a15;
  --color-ink-950: #14120f;
}
```

- [ ] **Step 2: Move `::selection` and `:focus-visible` from violet to gold**

Find:
```css
  ::selection {
    background-color: color-mix(in oklab, var(--color-violet-500) 35%, transparent);
    color: var(--color-white);
  }

  :focus-visible {
    outline: 2px solid var(--color-violet-400);
    outline-offset: 3px;
  }
```
Replace with:
```css
  ::selection {
    background-color: color-mix(in oklab, var(--color-gold-400) 35%, transparent);
    color: var(--color-white);
  }

  :focus-visible {
    outline: 2px solid var(--color-gold-300);
    outline-offset: 3px;
  }
```

- [ ] **Step 3: Add `.cta-primary` / `.cta-secondary` to `@layer components`**

In `src/styles/global.css`, inside the existing `@layer components { ... }` block, after the `.surface` rule and before the `[data-reveal]` rule, insert:
```css
  /* Primary CTA: dark text on a gold fill. Every button that represents the
     main action on its section (App Store download, notify-me submit)
     should use this instead of repeating the utility list. */
  .cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 9999px;
    background-color: var(--color-gold-300);
    color: var(--color-ink-950);
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    box-shadow: 0 8px 30px -8px color-mix(in oklab, var(--color-gold-500) 50%, transparent);
    transition: background-color 160ms var(--ease-out-strong);
  }

  .cta-primary:hover {
    background-color: var(--color-gold-200);
  }

  /* Secondary CTA: outlined, gold-tinted on hover. */
  .cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    border-radius: 9999px;
    border: 1px solid color-mix(in oklab, var(--color-white) 10%, transparent);
    color: var(--color-slate-200);
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: border-color 160ms ease, background-color 160ms ease, color 160ms ease;
  }

  .cta-secondary:hover {
    border-color: color-mix(in oklab, var(--color-gold-300) 40%, transparent);
    background-color: color-mix(in oklab, var(--color-white) 5%, transparent);
    color: var(--color-white);
  }
```
Both classes already carry the `pressable`-style transition inline (matching the existing `.pressable` timing/easing), so callers add `class="cta-primary pressable"` (keeping `.pressable`'s `:active { transform: scale(0.97) }` press feedback, which `.cta-primary`/`.cta-secondary` do not duplicate).

- [ ] **Step 4: Verify no violet references remain outside components not yet migrated**

Run: `grep -rn "violet" src/styles/global.css`
Expected: no matches (both occurrences replaced in Step 2; no other violet references exist in this file).

Run: `grep -rn "violet" src/layouts/Layout.astro`
Expected: one match, the skip-link's `focus-visible:bg-violet-500` class, leave `Layout.astro` untouched in this task; it is migrated together with `Nav.astro`'s other violet references in Task 3, since the skip-link and the nav share the same visual accent decision and should change in one reviewable diff.

- [ ] **Step 5: Build and commit**

Run: `npm run build`
Expected: build succeeds, no CSS errors (Tailwind v4 compiles the new `@theme` tokens into utility classes automatically; an unused token produces no warning).

```bash
git add src/styles/global.css
git commit -m "style: add gold/ink design tokens and shared CTA utility classes"
```

---

### Task 2: `copy.ts` restructure: all new/changed strings, ES and EN

**Estimated effort:** 2 hours

**Files:**
- Modify: `src/i18n/copy.ts` (full-file replacement, the diff touches nearly every top-level key)

**Interfaces:**
- Consumes: nothing (this is the data layer every component below reads from).
- Produces: `copy.<lang>.nav.faq`; `copy.<lang>.hero.titleLine1/2/3` (replacing `titleTop`/`titleBottom`; `hero.cards` removed); `copy.<lang>.values` (new); `copy.<lang>.features.items[].screenshot` (new field on each item, plus all 4 items redefined); `copy.<lang>.privacy` (new); `copy.<lang>.pricing.plans[1].badge` (new); `copy.<lang>.android` (new); `copy.<lang>.faq` (new); `copy.<lang>.footer.privacyLink` (new, replacing `footer.privacyTitle`/`privacyBody`). `Copy` type stays `(typeof copy)[Lang]`, inferred automatically from the new shape, no manual type edits needed.

- [ ] **Step 1: Write the complete new `src/i18n/copy.ts`**

```typescript
export const languages = { es: "Español", en: "English" } as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "es";

/** `/` is Spanish, `/en/` is English. */
export const pathFor = (lang: Lang) => (lang === "es" ? "/" : "/en/");

export const copy = {
  es: {
    htmlLang: "es",
    meta: {
      title: "ThreadVault: Tu memoria digital",
      description:
        "Guarda enlaces, textos e imágenes desde cualquier app. ThreadVault los resume, los clasifica y los etiqueta en tu iPhone. Sin cuentas, sin servidores.",
    },
    nav: {
      features: "Funciones",
      how: "Cómo funciona",
      pricing: "Precio",
      faq: "FAQ",
      skip: "Saltar al contenido",
      langLabel: "Idioma",
    },
    hero: {
      badge: "Procesamiento 100 % en el dispositivo",
      titleLine1: "Tu memoria digital.",
      titleLine2: "Todo lo que guardas,",
      titleLine3: "entendido.",
      lede: "Compartes un enlace y se acabó tu trabajo. ThreadVault lee el contenido, escribe el resumen, elige la categoría y saca las etiquetas, con el modelo que ya vive en tu iPhone.",
      ctaPrimary: "Descargar en el App Store",
      ctaSecondary: "Ver cómo funciona",
      footnote: "iOS 18 o superior. La clasificación necesita Apple Intelligence.",
    },
    values: {
      eyebrow: "Por qué ThreadVault",
      items: [
        {
          title: "IA en el dispositivo",
          body: "El modelo vive en tu iPhone. Nada de lo que guardas sale para clasificarse.",
        },
        {
          title: "Sin cuentas ni servidores",
          body: "ThreadVault no tiene backend. No creas una cuenta y no hay nada que hackear en un servidor que no existe.",
        },
        {
          title: "Guarda desde cualquier app",
          body: "La extensión de compartir de iOS acepta enlaces, texto e imágenes desde cualquier app.",
        },
      ],
    },
    features: {
      eyebrow: "Funciones",
      title: "Cuatro cosas, hechas bien",
      items: [
        {
          title: "Resumen y categoría",
          body: "Apple Intelligence lee el contenido y escribe un resumen corto. Cada elemento cae en su categoría sin que tengas que elegirla.",
          screenshot: "classify",
        },
        {
          title: "Etiquetas y filtro",
          body: "Las etiquetas salen del contenido y se cuentan. Filtra el vault por una o varias a la vez, desde la barra de arriba.",
          screenshot: "tags",
        },
        {
          title: "Búsqueda, incluida la semántica",
          body: "Busca por palabra exacta o por lo que recuerdas. Las coincidencias literales van primero, las relacionadas debajo, nunca mezcladas.",
          screenshot: "search",
        },
        {
          title: "Lector y contenido incrustado",
          body: "Abre cualquier elemento en una vista de lectura sin distracciones, o mira el video o la publicación incrustada, sin salir de la app.",
          screenshot: "reader",
        },
      ],
    },
    how: {
      eyebrow: "Cómo funciona",
      title: "Un toque tuyo. El resto lo pone el teléfono.",
      steps: [
        {
          title: "Guarda",
          body: "Compartir → ThreadVault. Enlace, texto o imagen, desde cualquier app de iOS.",
        },
        {
          title: "Organiza",
          body: "El modelo del dispositivo lee el contenido, escribe un resumen corto y le asigna categoría y etiquetas.",
        },
        {
          title: "Encuentra",
          body: "Busca, filtra por etiqueta, o deja que el widget te devuelva lo que guardaste y olvidaste.",
        },
      ],
    },
    privacy: {
      eyebrow: "Privacidad",
      title: "Lo que sale del teléfono. Y lo que nunca sale.",
      intro:
        "ThreadVault no tiene servidor, ni analítica, ni cuenta. Esto es exactamente lo que hace cada conexión de red que la app puede iniciar.",
      neverTitle: "Nunca sale",
      never: [
        "El resumen, la categoría y las etiquetas de cada elemento.",
        "Las imágenes que guardas.",
        "La clasificación con IA: corre en tu iPhone, no en un servidor.",
      ],
      leavesTitle: "Sale, y por qué",
      leaves: [
        "Una petición HTTPS para descargar la página que compartiste, igual que hace un navegador.",
        "Si activas la búsqueda semántica, una descarga única del modelo de Apple. Después, todo el cálculo es local.",
      ],
      policyLink: "Lee la política completa",
    },
    pricing: {
      eyebrow: "Precio",
      title: "Gratis para guardar. Pro para exprimirlo.",
      note: "Precios en USD. Descarga ThreadVault gratis en el App Store.",
      soon: "Próximamente",
      perMonth: "/mes",
      plans: [
        {
          name: "Free",
          price: "$0",
          tagline: "Todo el vault, sin límite de elementos.",
          featured: false,
          cta: "Incluido desde el día uno",
          features: [
            "Guardado ilimitado",
            "Resumen y categoría en el dispositivo",
            "Búsqueda por texto",
            "Extensión de compartir",
            "Widget de inicio",
          ],
        },
        {
          name: "Pro",
          price: "$4,99",
          tagline: "Para vaults que pasan de mil elementos.",
          featured: true,
          badge: "Mejor valor",
          cta: "Próximamente",
          features: [
            "Todo lo de Free",
            "Búsqueda semántica",
            "Sincronización por iCloud",
            "Exportación a Markdown",
            "Vista de lectura sin distracciones",
          ],
        },
      ],
    },
    android: {
      eyebrow: "Android",
      title: "ThreadVault, ahora para Android",
      body: "Estamos construyendo la versión Android: IA híbrida en el dispositivo con Gemini Nano y Gemma 4. Déjanos tu correo y te avisamos en cuanto esté lista.",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu@correo.com",
      submit: "Avisarme",
      microcopy: "Solo lo usamos para avisarte del lanzamiento. Sin spam.",
      success: "Listo. Te escribimos cuando esté disponible.",
      error: "Algo falló. Intenta de nuevo en un minuto.",
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      title: "Lo que la gente pregunta",
      items: [
        {
          q: "¿ThreadVault necesita cuenta?",
          a: "No. Abres la app y ya puedes guardar. No hay registro, ni correo, ni contraseña.",
        },
        {
          q: "¿Mis datos salen de mi iPhone?",
          a: "No para la clasificación. La IA corre en el dispositivo. Lo único que sale es la petición para descargar la página que compartiste.",
        },
        {
          q: "¿Qué necesito para la clasificación con IA?",
          a: "iOS 18 o superior, un iPhone compatible con Apple Intelligence y tenerla activada en Ajustes. Sin eso, ThreadVault sigue guardando y buscando, pero sin resumen ni categoría.",
        },
        {
          q: "¿Qué diferencia hay entre Free y Pro?",
          a: "Free guarda sin límite y clasifica en el dispositivo. Pro añade búsqueda semántica, sincronización por iCloud, exportación a Markdown y vista de lectura.",
        },
        {
          q: "¿Habrá versión para Android?",
          a: "Está en desarrollo, con IA híbrida en el dispositivo, Gemini Nano y Gemma 4. Déjanos tu correo más abajo y te avisamos.",
        },
        {
          q: "¿Cómo cancelo Pro?",
          a: "Desde Ajustes de tu cuenta de Apple, como cualquier suscripción del App Store. ThreadVault no gestiona pagos ni puede cobrarte fuera de ahí.",
        },
      ],
    },
    footer: {
      tagline: "Un vault que entiende lo que guardas, sin mandarlo a ningún sitio.",
      privacyLink: "Política de privacidad",
      contact: "Escríbeme",
      rights: "Hecho en Puerto Rico.",
    },
  },

  en: {
    htmlLang: "en",
    meta: {
      title: "ThreadVault: Your digital memory",
      description:
        "Save links, text and images from any app. ThreadVault summarises, files and tags them on your iPhone. No account, no server.",
    },
    nav: {
      features: "Features",
      how: "How it works",
      pricing: "Pricing",
      faq: "FAQ",
      skip: "Skip to content",
      langLabel: "Language",
    },
    hero: {
      badge: "Runs entirely on device",
      titleLine1: "Your digital memory.",
      titleLine2: "Everything you save,",
      titleLine3: "understood.",
      lede: "Share a link and your work is done. ThreadVault reads the content, writes the summary, picks the category and pulls the tags, using the model already living on your iPhone.",
      ctaPrimary: "Download on the App Store",
      ctaSecondary: "See how it works",
      footnote: "iOS 18 and later. Classification requires Apple Intelligence.",
    },
    values: {
      eyebrow: "Why ThreadVault",
      items: [
        {
          title: "On-device intelligence",
          body: "The model runs on your iPhone. Nothing you save leaves the device to get classified.",
        },
        {
          title: "No accounts, no servers",
          body: "ThreadVault has no backend. There is no account to create and no server to break into, because there isn't one.",
        },
        {
          title: "Save from any app",
          body: "iOS's share sheet takes links, text and images from any app you're using.",
        },
      ],
    },
    features: {
      eyebrow: "Features",
      title: "Four things, done properly",
      items: [
        {
          title: "Summary and category",
          body: "Apple Intelligence reads the content and writes a short summary. Every item lands in its category without you choosing one.",
          screenshot: "classify",
        },
        {
          title: "Tags and filter",
          body: "Tags are pulled from the content and counted. Filter the vault by one or several at once, from the bar up top.",
          screenshot: "tags",
        },
        {
          title: "Search, semantic included",
          body: "Search by exact word or by what you remember. Literal matches come first, related ones below, never blended.",
          screenshot: "search",
        },
        {
          title: "Reader and embedded content",
          body: "Open any item in a distraction-free reading view, or watch the embedded video or post, without leaving the app.",
          screenshot: "reader",
        },
      ],
    },
    how: {
      eyebrow: "How it works",
      title: "One tap from you. The phone does the rest.",
      steps: [
        {
          title: "Save",
          body: "Share → ThreadVault. A link, some text or an image, from any iOS app.",
        },
        {
          title: "Organise",
          body: "The on-device model reads the content, writes a short summary and assigns a category and tags.",
        },
        {
          title: "Find",
          body: "Search, filter by tag, or let the widget hand back something you saved and forgot.",
        },
      ],
    },
    privacy: {
      eyebrow: "Privacy",
      title: "What leaves your phone. And what never does.",
      intro:
        "ThreadVault has no server, no analytics and no account. Here is exactly what every network connection the app can make actually does.",
      neverTitle: "Never leaves",
      never: [
        "The summary, category and tags for every item.",
        "The images you save.",
        "AI classification: it runs on your iPhone, not on a server.",
      ],
      leavesTitle: "Leaves, and why",
      leaves: [
        "One HTTPS request to fetch the page you shared, the same thing a browser does.",
        "If you turn on semantic search, a one-time download of Apple's model. After that, every calculation stays local.",
      ],
      policyLink: "Read the full policy",
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Free to save. Pro to go deeper.",
      note: "Prices in USD. Download ThreadVault for free on the App Store.",
      soon: "Available now",
      perMonth: "/month",
      plans: [
        {
          name: "Free",
          price: "$0",
          tagline: "The whole vault, with no item limit.",
          featured: false,
          cta: "Included from day one",
          features: [
            "Unlimited saves",
            "On-device summary and category",
            "Text search",
            "Share extension",
            "Home screen widget",
          ],
        },
        {
          name: "Pro",
          price: "$4.99",
          tagline: "For vaults past a thousand items.",
          featured: true,
          badge: "Best value",
          cta: "Available now",
          features: [
            "Everything in Free",
            "Semantic search",
            "iCloud sync",
            "Markdown export",
            "Distraction-free reader",
          ],
        },
      ],
    },
    android: {
      eyebrow: "Android",
      title: "ThreadVault, coming to Android",
      body: "We are building the Android version: hybrid on-device AI with Gemini Nano and Gemma 4. Leave your email and we will let you know the moment it is ready.",
      emailLabel: "Email address",
      emailPlaceholder: "you@email.com",
      submit: "Notify me",
      microcopy: "We will only use it to tell you about the launch. No spam.",
      success: "Done. We will write when it is ready.",
      error: "Something went wrong. Try again in a minute.",
    },
    faq: {
      eyebrow: "Frequently asked",
      title: "What people ask",
      items: [
        {
          q: "Does ThreadVault need an account?",
          a: "No. Open the app and start saving. No sign-up, no email, no password.",
        },
        {
          q: "Does my data leave my iPhone?",
          a: "Not for classification. The AI runs on the device. The only thing that leaves is the request to fetch the page you shared.",
        },
        {
          q: "What do I need for AI classification?",
          a: "iOS 18 or later, an iPhone that supports Apple Intelligence, and it turned on in Settings. Without that, ThreadVault still saves and searches, just without a summary or category.",
        },
        {
          q: "What is the difference between Free and Pro?",
          a: "Free saves without limit and classifies on device. Pro adds semantic search, iCloud sync, Markdown export and a reading view.",
        },
        {
          q: "Will there be an Android version?",
          a: "It is in development, with hybrid on-device AI, Gemini Nano and Gemma 4. Leave your email below and we will let you know.",
        },
        {
          q: "How do I cancel Pro?",
          a: "From your Apple Account settings, like any App Store subscription. ThreadVault does not handle payments and cannot charge you outside of that.",
        },
      ],
    },
    footer: {
      tagline: "A vault that understands what you save, without sending it anywhere.",
      privacyLink: "Privacy policy",
      contact: "Get in touch",
      rights: "Made in Puerto Rico.",
    },
  },
} as const;

export type Copy = (typeof copy)[Lang];
```

- [ ] **Step 2: Confirm the removed `hero.cards` field has no remaining readers**

Run: `grep -rn "cards" src/components/Hero.astro src/pages`
Expected: no matches yet (Task 4 rewrites `Hero.astro` to stop reading `cards`; if this grep finds a match right now, before Task 4 runs, the build in Step 3 below will fail with a TypeScript error on `t.cards`, that failure is expected and resolved by Task 4, not by this task. Do not attempt to fix `Hero.astro` in this task.)

- [ ] **Step 3: Type-check (expect a known, temporary failure)**

Run: `npx tsc --noEmit`
Expected: errors in `src/components/Hero.astro` (`Property 'cards' does not exist`, `Property 'titleTop' does not exist`) and in `src/components/Footer.astro` (`Property 'privacyTitle' does not exist`). These are expected, `Hero.astro` and `Footer.astro` are rewritten in Tasks 4 and 12 respectively. Do not run `npm run build` at the end of this task; it will fail for the same reason. Commit `copy.ts` alone; the build goes green again once Task 4 lands.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/copy.ts
git commit -m "feat: restructure copy.ts for the landing redesign (values, privacy, android, faq sections; hero 3-line headline; features screenshots)"
```

---

### Task 3: Nav: gold accent, FAQ link, skip-link recolor

**Estimated effort:** 0.5 hour

**Files:**
- Modify: `src/components/Nav.astro`
- Modify: `src/layouts/Layout.astro` (skip-link accent only)

**Interfaces:**
- Consumes: `copy.<lang>.nav.faq` (from Task 2).
- Produces: nothing new consumed downstream; this is a leaf UI component.

- [ ] **Step 1: Add the FAQ link and recolor the Mark icon**

In `src/components/Nav.astro`, find:
```astro
const links = [
  { href: "#features", label: t.features },
  { href: "#how", label: t.how },
  { href: "#pricing", label: t.pricing },
];
```
Replace with:
```astro
const links = [
  { href: "#features", label: t.features },
  { href: "#how", label: t.how },
  { href: "#faq", label: t.faq },
  { href: "#pricing", label: t.pricing },
];
```

Find:
```astro
        <Mark class="h-5 w-5 text-violet-400" />
```
Replace with:
```astro
        <Mark class="h-5 w-5 text-gold-300" />
```

- [ ] **Step 2: Recolor the skip-link in `Layout.astro`**

In `src/layouts/Layout.astro`, find:
```astro
      class="pressable sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-violet-500 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white"
```
Replace with:
```astro
      class="pressable sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-gold-300 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-ink-950"
```
(Text flips to `text-ink-950` here too, matching the primary-CTA contrast rule, white text would fail contrast on a gold background.)

- [ ] **Step 3: Verify no violet remains in either file**

Run: `grep -n "violet" src/components/Nav.astro src/layouts/Layout.astro`
Expected: no matches.

- [ ] **Step 4: Build and commit**

`Nav.astro` and `Layout.astro` don't read `hero.cards` or `footer.privacyTitle`, so this build should succeed even though `Hero.astro`/`Footer.astro` haven't been migrated yet, Astro type-checks each component independently.

Run: `npm run build`
Expected: build succeeds (Nav/Layout are unaffected by the still-pending Hero/Footer prop changes from Task 2).

```bash
git add src/components/Nav.astro src/layouts/Layout.astro
git commit -m "style: gold accent + FAQ link in nav, recolor skip-link"
```

---

### Task 4: Hero: 3-line headline, inline SVG illustration, gold CTAs

**Estimated effort:** 3 hours

**Files:**
- Create: `src/components/VaultIllustration.astro`
- Modify: `src/components/Hero.astro`

**Interfaces:**
- Consumes: `copy.<lang>.hero.{badge,titleLine1,titleLine2,titleLine3,lede,ctaPrimary,ctaSecondary,footnote}` (Task 2); `.cta-primary`/`.cta-secondary` (Task 1).
- Produces: `VaultIllustration.astro`, a prop-less decorative component (`<VaultIllustration class="…" />`, `class` forwarded to the wrapping `<div>`), reusable if a later page ever wants the same illustration.

- [ ] **Step 1: Create `src/components/VaultIllustration.astro`**

```astro
---
interface Props {
  class?: string;
}

const { class: className = "" } = Astro.props;
---

<!--
  Original illustration: a fanned stack of vault cards with a category chip,
  title/summary bars and tag chips (drawn as solid shapes, never <text>, so
  this needs no per-language variant), a gold "on-device spark" badge, and an
  emerald search glyph. Two soft organic blob shapes sit behind the stack as
  the only echo of the reference layout's illustration language, abstracted
  into ThreadVault's own gold/emerald palette. No people, no rockets.
-->
<div class={className}>
  <svg
    viewBox="0 0 600 600"
    role="img"
    aria-label="Illustration of a stack of vault cards with a category tag, summary lines, and tag chips"
    class="h-auto w-full"
  >
    <!-- soft organic shapes, behind the stack -->
    <path
      d="M60,420 C40,320 120,240 220,250 C230,350 160,430 60,420 Z"
      fill="#E8D5A3"
      opacity="0.16"
    ></path>
    <path
      d="M520,140 C560,220 520,310 430,320 C410,240 440,150 520,140 Z"
      fill="#34D399"
      opacity="0.14"
    ></path>

    <!-- back card -->
    <g transform="rotate(-7 300 300)">
      <rect
        x="150"
        y="150"
        width="300"
        height="220"
        rx="26"
        fill="#14120F"
        stroke="rgba(255,255,255,0.06)"
      ></rect>
    </g>

    <!-- mid card -->
    <g transform="rotate(-2.5 300 300)">
      <rect
        x="150"
        y="150"
        width="300"
        height="220"
        rx="26"
        fill="#1D1A15"
        stroke="rgba(255,255,255,0.08)"
      ></rect>
    </g>

    <!-- front card, with the fake title/summary/tag content -->
    <g>
      <rect
        x="150"
        y="160"
        width="300"
        height="230"
        rx="26"
        fill="#1D1A15"
        stroke="rgba(232,213,163,0.25)"
        stroke-width="1.5"
      ></rect>

      <!-- category chip -->
      <rect x="176" y="188" width="86" height="22" rx="11" fill="rgba(232,213,163,0.16)"></rect>
      <rect x="188" y="196" width="62" height="6" rx="3" fill="#E8D5A3" opacity="0.7"></rect>

      <!-- title bar -->
      <rect x="176" y="228" width="220" height="12" rx="6" fill="rgba(255,255,255,0.85)"></rect>
      <!-- summary bars -->
      <rect x="176" y="252" width="248" height="8" rx="4" fill="rgba(255,255,255,0.35)"></rect>
      <rect x="176" y="268" width="200" height="8" rx="4" fill="rgba(255,255,255,0.35)"></rect>

      <!-- tag chips -->
      <rect x="176" y="340" width="64" height="20" rx="10" fill="rgba(255,255,255,0.06)"></rect>
      <rect x="188" y="347" width="40" height="6" rx="3" fill="rgba(255,255,255,0.4)"></rect>
      <rect x="248" y="340" width="80" height="20" rx="10" fill="rgba(255,255,255,0.06)"></rect>
      <rect x="260" y="347" width="56" height="6" rx="3" fill="rgba(255,255,255,0.4)"></rect>
    </g>

    <!-- on-device spark badge -->
    <g transform="translate(462 128)">
      <circle r="30" fill="#0B0A08" stroke="rgba(232,213,163,0.35)"></circle>
      <path d="M0,-14 L4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4 Z" fill="#E8D5A3"></path>
    </g>

    <!-- search glyph, floating -->
    <g
      transform="translate(120 470)"
      stroke="#34D399"
      stroke-width="3"
      fill="none"
      stroke-linecap="round"
    >
      <circle cx="0" cy="0" r="16"></circle>
      <line x1="12" y1="12" x2="26" y2="26"></line>
    </g>
  </svg>
</div>
```

- [ ] **Step 2: Rewrite `Hero.astro`**

Replace the entire file:
```astro
---
import { copy, type Lang } from "../i18n/copy";
import VaultIllustration from "./VaultIllustration.astro";

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = copy[lang].hero;
---

<section class="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
  <!-- One soft light source behind the illustration, low enough to read as depth. -->
  <div
    aria-hidden="true"
    class="pointer-events-none absolute left-1/2 top-0 -z-10 h-[46rem] w-[70rem] -translate-x-1/2"
    style="background: radial-gradient(50% 50% at 50% 32%, color-mix(in oklab, var(--color-gold-500) 15%, transparent), transparent 70%);"
  >
  </div>

  <div
    class="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20"
  >
    <div data-reveal>
      <p
        class="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1 text-xs font-medium text-emerald-300"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        {t.badge}
      </p>

      <h1 class="display mt-6 text-[2.6rem] font-semibold text-white sm:text-6xl">
        {t.titleLine1}<br />
        <span class="text-slate-500">{t.titleLine2}</span><br />
        <span class="text-slate-500">{t.titleLine3}</span>
      </h1>

      <p class="lede mt-6 max-w-xl text-[1.05rem] leading-relaxed text-slate-400 sm:text-lg">
        {t.lede}
      </p>

      <div class="mt-9 flex flex-wrap items-center gap-3">
        <a
          href="https://apps.apple.com/us/app/threadvault/id6757399918"
          target="_blank"
          rel="noopener noreferrer"
          class="cta-primary pressable"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M16.4 12.7c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7 1.3 0 1.6.7 2.8.7 1.1 0 1.9-1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.5-.1 0-2.2-.9-2.2-3.2zM14.2 5.9c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1.1 1.7-.9 2.6 1 .1 2-.5 2.6-1.2z"
            ></path>
          </svg>
          {t.ctaPrimary}
        </a>

        <a href="#how" class="cta-secondary pressable">
          {t.ctaSecondary}
          <svg
            class="h-4 w-4 text-slate-500"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M4 8h8m0 0-3-3m3 3-3 3"></path>
          </svg>
        </a>
      </div>

      <p class="mt-5 text-sm text-slate-600">{t.footnote}</p>
    </div>

    <div
      class="w-[19.5rem] justify-self-center sm:w-[24rem] lg:w-[26rem] lg:justify-self-end"
      data-reveal
      style="--reveal-delay: 90ms"
    >
      <VaultIllustration />
    </div>
  </div>
</section>
```

- [ ] **Step 3: Build and commit**

Run: `npx tsc --noEmit`
Expected: the `Hero.astro` errors from Task 2 Step 3 are gone. The `Footer.astro` `privacyTitle`/`privacyBody` errors remain, expected until Task 12.

Run: `npm run build`
Expected: build succeeds for the pages/components touched so far (Footer's pending errors are TypeScript-only warnings in `.astro` frontmatter type-checking; Astro's build does not fail on them unless `astro check` is run as a separate strict step, confirm by checking the build output ends with `✓ Complete` and lists both `dist/index.html` and `dist/en/index.html`). If the build does fail on the Footer property access, that means Astro's build includes type-checking in this project's config, in that case, stop here, do not attempt to fix Footer out of order; instead note the failure and proceed to Task 5 first (Value props doesn't touch Footer), returning to green only once Task 12 lands. Re-run `npm run build` after Task 5, 6, 7, 8, 9, 11 land too, for the same reason, only expecting full green after Task 12.

```bash
git add src/components/Hero.astro src/components/VaultIllustration.astro
git commit -m "feat: replace hero device mockup with original inline SVG illustration, 3-line headline"
```

---

### Task 5: Value props section

**Estimated effort:** 1 hour

**Files:**
- Create: `src/components/ValueProps.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`

**Interfaces:**
- Consumes: `copy.<lang>.values.{eyebrow,items[].title,items[].body}` (Task 2).
- Produces: `<ValueProps lang={lang} />`, inserted between `<Hero>` and `<Features>` in both page files.

- [ ] **Step 1: Create `src/components/ValueProps.astro`**

```astro
---
import { copy, type Lang } from "../i18n/copy";

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = copy[lang].values;

const icons = [
  // On-device: a phone with a core at its centre (same glyph family as Features).
  "M8.5 3h7a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 15.5 21h-7A1.5 1.5 0 0 1 7 19.5v-15A1.5 1.5 0 0 1 8.5 3Zm1.5 7.5h4v4h-4v-4Z",
  // No server: a crossed-out rack.
  "M4 5.5h16M4 10.5h16M4 15.5h9M6 5.5v10M18 5.5v3m-3 6 6 6m0-6-6 6",
  // Share: a card leaving the stack.
  "M8 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm4 9V5m0 0-2.5 2.5M12 5l2.5 2.5",
];
---

<section id="values" class="scroll-mt-24 py-16 sm:py-20">
  <div class="mx-auto max-w-6xl px-5 sm:px-8">
    <p class="text-center text-sm font-medium text-gold-300" data-reveal>{t.eyebrow}</p>

    <div class="mt-8 grid gap-10 sm:grid-cols-3 sm:gap-8">
      {
        t.items.map((item, index) => (
          <div class="text-center sm:text-left" data-reveal style={`--reveal-delay: ${index * 60}ms`}>
            <span class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-400/10 text-gold-300">
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d={icons[index]} />
              </svg>
            </span>
            <h3 class="heading mt-4 text-base font-semibold text-white">{item.title}</h3>
            <p class="lede mt-1.5 text-sm leading-relaxed text-slate-400">{item.body}</p>
          </div>
        ))
      }
    </div>
  </div>
</section>
```

- [ ] **Step 2: Wire it into both pages**

In `src/pages/index.astro`, find:
```astro
import Hero from "../components/Hero.astro";
import Features from "../components/Features.astro";
```
Replace with:
```astro
import Hero from "../components/Hero.astro";
import ValueProps from "../components/ValueProps.astro";
import Features from "../components/Features.astro";
```
Find:
```astro
  <Hero lang={lang} />
  <Features lang={lang} />
```
Replace with:
```astro
  <Hero lang={lang} />
  <ValueProps lang={lang} />
  <Features lang={lang} />
```

Apply the same two edits to `src/pages/en/index.astro` (paths are `"../../components/Hero.astro"` etc. there, keep the existing relative-path depth, only insert the `ValueProps` import/usage alongside it).

- [ ] **Step 3: Build and commit**

Run: `npm run build`
Expected: build succeeds; `dist/index.html` and `dist/en/index.html` both contain a `<section id="values">`.

```bash
git add src/components/ValueProps.astro src/pages/index.astro src/pages/en/index.astro
git commit -m "feat: add value props section (on-device AI, no accounts, save from any app)"
```

---

### Task 6: Features: screenshot frames with build-time placeholder

**Estimated effort:** 2.5 hours

**Files:**
- Create: `src/components/ScreenshotFrame.astro`
- Modify: `src/components/Features.astro`
- Create directory: `public/screens/` (empty until the owner drops files in; Git does not track empty directories, so this task creates a `public/screens/.gitkeep` placeholder file instead)

**Interfaces:**
- Consumes: `copy.<lang>.features.{eyebrow,title,items[].title,items[].body,items[].screenshot}` (Task 2); `.cta-primary` not used here.
- Produces: `<ScreenshotFrame name={string} alt={string} />`, `name` is one of `"classify" | "tags" | "search" | "reader"`, resolved to `public/screens/<name>.webp`. Any future section needing a framed screenshot reuses this component.

- [ ] **Step 1: Create `public/screens/.gitkeep`**

```bash
mkdir -p /Users/eduardotorres/Developer/XCodes/ThreadVault/landing/public/screens
touch /Users/eduardotorres/Developer/XCodes/ThreadVault/landing/public/screens/.gitkeep
```

- [ ] **Step 2: Create `src/components/ScreenshotFrame.astro`**

```astro
---
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

interface Props {
  /** File stem under public/screens/, without extension, e.g. "classify". */
  name: string;
  alt: string;
}

const { name, alt } = Astro.props;

// Astro component frontmatter runs in Node at build time, so this check
// happens once per `astro build`, not per request, cheap, and it means the
// page always builds even before the owner supplies real captures.
const screenshotPath = fileURLToPath(
  new URL(`../../public/screens/${name}.webp`, import.meta.url),
);
const hasScreenshot = existsSync(screenshotPath);

// Native capture is 1320x2868 (iPhone 17 Pro Max); delivered files are
// pre-scaled to 640x1392 (see docs/superpowers/specs/2026-09-15-landing-redesign-design.md §6).
const WIDTH = 640;
const HEIGHT = 1392;
---

<div
  class="mx-auto w-[9rem] overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-ink-950 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] sm:w-[10rem]"
>
  <div class="aspect-[640/1392] w-full">
    {
      hasScreenshot ? (
        <img
          src={`/screens/${name}.webp`}
          alt={alt}
          width={WIDTH}
          height={HEIGHT}
          loading="lazy"
          class="h-full w-full object-cover"
        />
      ) : (
        <div
          class="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-ink-900 to-ink-950 text-center"
          role="img"
          aria-label={alt}
        >
          <svg
            class="h-6 w-6 text-gold-300/50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <path d="M9 18h6" />
          </svg>
          <p class="px-3 text-[0.6rem] leading-tight text-slate-600">Screenshot: {name}</p>
        </div>
      )
    }
  </div>
</div>
```

- [ ] **Step 3: Rewrite `Features.astro` to use it**

Replace the entire file:
```astro
---
import { copy, type Lang } from "../i18n/copy";
import ScreenshotFrame from "./ScreenshotFrame.astro";

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = copy[lang].features;

const icons = [
  // Summary and category: a document with a check.
  "M7 4h7l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm7 0v4h4M9 14l2 2 4-4",
  // Tags and filter: one label, one counted duplicate behind it.
  "M4 10.8V5.5A1.5 1.5 0 0 1 5.5 4h5.3a1.5 1.5 0 0 1 1.06.44l7 7a1.5 1.5 0 0 1 0 2.12l-5.3 5.3a1.5 1.5 0 0 1-2.12 0l-7-7A1.5 1.5 0 0 1 4 10.8Zm4-3.3h.01",
  // Search, semantic included: a lens that also catches what sits beside the query.
  "M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm4.9 11.4L20 20M18.5 6.5h.01",
  // Reader and embeds: an open book.
  "M4 5.5c2-1 4.5-1 6.5 0v13c-2-1-4.5-1-6.5 0v-13Zm16 0c-2-1-4.5-1-6.5 0v13c2-1 4.5-1 6.5 0v-13Z",
];
---

<section id="features" class="scroll-mt-24 border-t border-white/[0.05] py-20 sm:py-28">
  <div class="mx-auto max-w-6xl px-5 sm:px-8">
    <div class="max-w-2xl" data-reveal>
      <p class="text-sm font-medium text-gold-300">{t.eyebrow}</p>
      <h2 class="heading mt-3 text-3xl font-semibold text-white sm:text-4xl">{t.title}</h2>
    </div>

    <div class="mt-12 grid gap-4 sm:grid-cols-2">
      {
        t.items.map((item, index) => (
          <article
            class="surface rounded-2xl p-6 transition-colors duration-200 hover:border-white/[0.14] sm:p-7"
            data-reveal
            style={`--reveal-delay: ${index * 60}ms`}
          >
            <ScreenshotFrame name={item.screenshot} alt={`ThreadVault: ${item.title}`} />

            <span class="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-400/10 text-gold-300">
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d={icons[index]} />
              </svg>
            </span>

            <h3 class="heading mt-5 text-lg font-semibold text-white">{item.title}</h3>
            <p class="lede mt-2 leading-relaxed text-slate-400">{item.body}</p>
          </article>
        ))
      }
    </div>
  </div>
</section>
```

- [ ] **Step 4: Build and commit**

Run: `npm run build`
Expected: build succeeds; both `dist/index.html` and `dist/en/index.html` contain four `Screenshot: classify|tags|search|reader` placeholder captions (no files exist under `public/screens/` yet beyond `.gitkeep`).

```bash
git add src/components/ScreenshotFrame.astro src/components/Features.astro public/screens/.gitkeep
git commit -m "feat: add screenshot frames to Features with build-time placeholder fallback"
```

---

### Task 7: How it works: gold restyle

**Estimated effort:** 0.5 hour

**Files:**
- Modify: `src/components/HowItWorks.astro`

**Interfaces:**
- Consumes: `copy.<lang>.how.*` (unchanged shape from today).
- Produces: nothing new downstream.

- [ ] **Step 1: Recolor the eyebrow, numbered chips, and connecting rule**

Find:
```astro
      <p class="text-sm font-medium text-emerald-400">{t.eyebrow}</p>
```
Replace with:
```astro
      <p class="text-sm font-medium text-gold-300">{t.eyebrow}</p>
```

Find:
```astro
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.03] text-[0.8rem] font-semibold tabular-nums text-slate-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              {/* The rule joins the steps rather than boxing them; it stops at the last one. */}
              {index < t.steps.length - 1 && (
                <span
                  aria-hidden="true"
                  class="hidden h-px flex-1 bg-gradient-to-r from-white/[0.12] to-transparent sm:block"
                />
              )}
```
Replace with:
```astro
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/[0.06] text-[0.8rem] font-semibold tabular-nums text-gold-200">
                {String(index + 1).padStart(2, "0")}
              </span>
              {/* The rule joins the steps rather than boxing them; it stops at the last one. */}
              {index < t.steps.length - 1 && (
                <span
                  aria-hidden="true"
                  class="hidden h-px flex-1 bg-gradient-to-r from-gold-400/25 to-transparent sm:block"
                />
              )}
```

(Note: keeping emerald for the "on-device" signal is a deliberate choice per the spec, §2, but How it works' eyebrow/chips are recolored gold here because this section is about the *process*, tying it visually to Features above it, not specifically to the on-device claim, which is called out on its own in Privacy and the Value props badge.)

- [ ] **Step 2: Build and commit**

Run: `npm run build`
Expected: build succeeds.

```bash
git add src/components/HowItWorks.astro
git commit -m "style: recolor How it works numbered steps to gold"
```

---

### Task 8: Privacy / on-device section + standalone policy pages

**Estimated effort:** 2.5 hours

**Files:**
- Create: `src/components/Privacy.astro`
- Create: `src/pages/privacidad.astro`
- Create: `src/pages/en/privacy.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`

**Interfaces:**
- Consumes: `copy.<lang>.privacy.{eyebrow,title,intro,neverTitle,never[],leavesTitle,leaves[],policyLink}` (Task 2).
- Produces: `<Privacy lang={lang} />`, inserted between `<HowItWorks>` and `<Pricing>`; two new standalone routes `/privacidad/` and `/en/privacy/`, linked from `Privacy.astro`'s `policyLink` and (in Task 12) the footer.

- [ ] **Step 1: Create `src/components/Privacy.astro`**

```astro
---
import { copy, pathFor, type Lang } from "../i18n/copy";

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = copy[lang].privacy;
const policyHref = lang === "es" ? "/privacidad/" : "/en/privacy/";
---

<section id="privacy" class="scroll-mt-24 border-t border-white/[0.05] py-20 sm:py-28">
  <div class="mx-auto max-w-6xl px-5 sm:px-8">
    <div class="max-w-2xl" data-reveal>
      <p class="text-sm font-medium text-gold-300">{t.eyebrow}</p>
      <h2 class="heading mt-3 text-3xl font-semibold text-white sm:text-4xl">{t.title}</h2>
      <p class="lede mt-4 leading-relaxed text-slate-400">{t.intro}</p>
    </div>

    <div class="mt-12 grid gap-8 rounded-3xl bg-ink-900/60 p-7 sm:p-9 md:grid-cols-2 md:gap-12">
      <div data-reveal>
        <h3 class="heading text-sm font-semibold uppercase tracking-wide text-emerald-300">
          {t.neverTitle}
        </h3>
        <ul class="mt-4 space-y-3 text-sm">
          {
            t.never.map((line) => (
              <li class="flex items-start gap-2.5 text-slate-300">
                <svg
                  class="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="m3.5 8.5 3 3 6-7" />
                </svg>
                {line}
              </li>
            ))
          }
        </ul>
      </div>

      <div data-reveal style="--reveal-delay: 60ms">
        <h3 class="heading text-sm font-semibold uppercase tracking-wide text-slate-500">
          {t.leavesTitle}
        </h3>
        <ul class="mt-4 space-y-3 text-sm">
          {
            t.leaves.map((line) => (
              <li class="flex items-start gap-2.5 text-slate-300">
                <svg
                  class="mt-0.5 h-4 w-4 shrink-0 text-slate-500"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 8h8m0 0-3-3m3 3-3 3" />
                </svg>
                {line}
              </li>
            ))
          }
        </ul>
      </div>
    </div>

    <a
      href={policyHref}
      class="pressable mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-gold-300 hover:text-gold-200"
      data-reveal
    >
      {t.policyLink}
      <svg
        class="h-4 w-4"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M4 8h8m0 0-3-3m3 3-3 3"></path>
      </svg>
    </a>
  </div>
</section>
```

- [ ] **Step 2: Create the Spanish policy page `src/pages/privacidad.astro`**

```astro
---
import Layout from "../layouts/Layout.astro";

const lang = "es" as const;
---

<Layout lang={lang}>
  <article class="mx-auto max-w-2xl px-5 py-32 sm:px-8 sm:py-40">
    <h1 class="display text-4xl font-semibold text-white">Privacidad</h1>

    <p class="lede mt-6 leading-relaxed text-slate-400">
      ThreadVault no tiene servidor, ni cuentas, ni analítica, ni publicidad. Esto es exactamente
      lo que la app puede enviar por la red.
    </p>

    <h2 class="heading mt-10 text-xl font-semibold text-white">Clasificación con IA</h2>
    <p class="lede mt-3 leading-relaxed text-slate-400">
      Corre en tu iPhone con Apple Intelligence. Lo que guardas nunca se envía a un modelo por
      internet, bajo ninguna configuración. Si tu dispositivo no es compatible, ThreadVault sigue
      guardando y buscando, solo sin resumen ni categoría.
    </p>

    <h2 class="heading mt-10 text-xl font-semibold text-white">La página que compartiste</h2>
    <p class="lede mt-3 leading-relaxed text-slate-400">
      Para mostrar el título y la vista previa, ThreadVault descarga la página que guardaste,
      igual que hace tu navegador. Solo HTTPS, sin cookies, sin sesión que persista.
    </p>

    <h2 class="heading mt-10 text-xl font-semibold text-white">Búsqueda semántica</h2>
    <p class="lede mt-3 leading-relaxed text-slate-400">
      Si la activas, Apple descarga una vez su modelo de embeddings. Después, todo el cálculo
      ocurre en tu teléfono.
    </p>

    <h2 class="heading mt-10 text-xl font-semibold text-white">Lo que nunca sale</h2>
    <p class="lede mt-3 leading-relaxed text-slate-400">
      Tus resúmenes, categorías, etiquetas, texto de artículos e imágenes guardadas viven solo en
      tu iPhone.
    </p>

    <p class="lede mt-10 text-sm text-slate-500">
      ¿Preguntas? Escríbeme a <a
        class="pressable text-gold-300 hover:text-gold-200"
        href="mailto:torreseduardo804@gmail.com?subject=ThreadVault">torreseduardo804@gmail.com</a
      >.
    </p>
  </article>
</Layout>
```

- [ ] **Step 3: Create the English policy page `src/pages/en/privacy.astro`**

```astro
---
import Layout from "../../layouts/Layout.astro";

const lang = "en" as const;
---

<Layout lang={lang}>
  <article class="mx-auto max-w-2xl px-5 py-32 sm:px-8 sm:py-40">
    <h1 class="display text-4xl font-semibold text-white">Privacy</h1>

    <p class="lede mt-6 leading-relaxed text-slate-400">
      ThreadVault has no server, no accounts, no analytics and no advertising. This is exactly
      what the app can send over the network.
    </p>

    <h2 class="heading mt-10 text-xl font-semibold text-white">AI classification</h2>
    <p class="lede mt-3 leading-relaxed text-slate-400">
      Runs on your iPhone with Apple Intelligence. What you save is never sent to a model over the
      internet, under any configuration. If your device is not eligible, ThreadVault still saves
      and searches, just without a summary or category.
    </p>

    <h2 class="heading mt-10 text-xl font-semibold text-white">The page you shared</h2>
    <p class="lede mt-3 leading-relaxed text-slate-400">
      To show the title and preview, ThreadVault downloads the page you saved, the same thing your
      browser does. HTTPS only, no cookies, no session that persists.
    </p>

    <h2 class="heading mt-10 text-xl font-semibold text-white">Semantic search</h2>
    <p class="lede mt-3 leading-relaxed text-slate-400">
      If you turn it on, Apple downloads its embedding model once. After that, every calculation
      happens on your phone.
    </p>

    <h2 class="heading mt-10 text-xl font-semibold text-white">What never leaves</h2>
    <p class="lede mt-3 leading-relaxed text-slate-400">
      Your summaries, categories, tags, article text and saved images live only on your iPhone.
    </p>

    <p class="lede mt-10 text-sm text-slate-500">
      Questions? Write to <a
        class="pressable text-gold-300 hover:text-gold-200"
        href="mailto:torreseduardo804@gmail.com?subject=ThreadVault">torreseduardo804@gmail.com</a
      >.
    </p>
  </article>
</Layout>
```

- [ ] **Step 4: Wire `Privacy` into both index pages**

In `src/pages/index.astro`, add the import alongside the others and insert `<Privacy lang={lang} />` between `<HowItWorks lang={lang} />` and `<Pricing lang={lang} />`. Same edit in `src/pages/en/index.astro` with the deeper relative import path. (Full `<Layout>` body order after this task and Task 5 combined: `Hero`, `ValueProps`, `Features`, `HowItWorks`, `Privacy`, `Pricing`, Task 10 and 11 append `AndroidNotify` and `Faq` after `Pricing` in their own tasks.)

- [ ] **Step 5: Build and commit**

Run: `npm run build`
Expected: build succeeds; `dist/privacidad/index.html` and `dist/en/privacy/index.html` both exist.

```bash
git add src/components/Privacy.astro src/pages/privacidad.astro src/pages/en/privacy.astro src/pages/index.astro src/pages/en/index.astro
git commit -m "feat: add Privacy/on-device section and standalone policy pages"
```

---

### Task 9: Pricing restyle: gold accent, "Best value" badge

**Estimated effort:** 1 hour

**Files:**
- Modify: `src/components/Pricing.astro`

**Interfaces:**
- Consumes: `copy.<lang>.pricing.plans[].badge` (new, Task 2) plus the existing `pricing.*` fields.
- Produces: nothing new downstream.

- [ ] **Step 1: Recolor the eyebrow and featured-card accents, add the badge**

Find:
```astro
      <p class="text-sm font-medium text-violet-400">{t.eyebrow}</p>
```
Replace with:
```astro
      <p class="text-sm font-medium text-gold-300">{t.eyebrow}</p>
```

Find:
```astro
            class:list={[
              "relative rounded-3xl p-7 sm:p-8",
              plan.featured
                ? "border border-violet-400/25 bg-violet-500/[0.06]"
                : "surface",
            ]}
            data-reveal
            style={`--reveal-delay: ${index * 70}ms`}
          >


            <h3 class="heading text-lg font-semibold text-white">{plan.name}</h3>
```
Replace with:
```astro
            class:list={[
              "relative rounded-3xl p-7 sm:p-8",
              plan.featured
                ? "border border-gold-400/30 bg-gold-400/[0.06]"
                : "surface",
            ]}
            data-reveal
            style={`--reveal-delay: ${index * 70}ms`}
          >
            {plan.featured && "badge" in plan && (
              <span class="absolute -top-3 left-7 rounded-full bg-gold-300 px-3 py-1 text-xs font-semibold text-ink-950 sm:left-8">
                {plan.badge}
              </span>
            )}

            <h3 class="heading text-lg font-semibold text-white">{plan.name}</h3>
```

Find:
```astro
              {plan.featured && <span class="text-sm text-slate-500">{t.perMonth}</span>}
            </p>

            <p
              class:list={[
                "mt-6 rounded-xl px-4 py-2.5 text-center text-sm font-medium",
                plan.featured
                  ? "bg-violet-500/15 text-violet-200"
                  : "bg-white/[0.04] text-slate-400",
              ]}
            >
```
Replace with:
```astro
              {plan.featured && <span class="text-sm text-slate-500">{t.perMonth}</span>}
            </p>

            <p
              class:list={[
                "mt-6 rounded-xl px-4 py-2.5 text-center text-sm font-medium",
                plan.featured
                  ? "bg-gold-400/15 text-gold-200"
                  : "bg-white/[0.04] text-slate-400",
              ]}
            >
```

Find:
```astro
                    class:list={[
                      "mt-0.5 h-4 w-4 shrink-0",
                      plan.featured ? "text-violet-300" : "text-emerald-400",
                    ]}
```
Replace with:
```astro
                    class:list={[
                      "mt-0.5 h-4 w-4 shrink-0",
                      plan.featured ? "text-gold-300" : "text-emerald-400",
                    ]}
```

- [ ] **Step 2: Build and commit**

Run: `npm run build`
Expected: build succeeds; the Pro card in both `dist/index.html` and `dist/en/index.html` shows a "Mejor valor"/"Best value" badge pill.

```bash
git add src/components/Pricing.astro
git commit -m "style: gold accent + Best value badge on the featured pricing plan"
```

---

### Task 10: Android notify banner: component, Pages Function, KV, no-JS fallback

**Estimated effort:** 4 hours

**Files:**
- Create: `src/components/AndroidNotify.astro`
- Create: `src/pages/gracias.astro`
- Create: `src/pages/en/thanks.astro`
- Create: `functions/api/notify.ts`
- Create: `wrangler.toml`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`

**Interfaces:**
- Consumes: `copy.<lang>.android.{eyebrow,title,body,emailLabel,emailPlaceholder,submit,microcopy,success,error}` (Task 2).
- Produces: `POST /api/notify` (contract in spec §5); a `NOTIFY` KV binding declared in `wrangler.toml`, consumed only by `functions/api/notify.ts`.

- [ ] **Step 1: Create `functions/api/notify.ts`**

```typescript
// Cloudflare Pages Function. Deployed by `wrangler pages deploy dist`, which
// auto-detects this `functions/` directory at the repo root (independent of
// the `dist/` static output dir), see spec §5 for why no Astro adapter is
// needed.

interface Env {
  NOTIFY: KVNamespace;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_RETURN_PATHS = new Set(["/", "/en/"]);
const RATE_LIMIT_PER_HOUR = 5;

function isJsonRequest(request: Request): boolean {
  return request.headers.get("X-Requested-With") === "fetch";
}

function safeReturnPath(referer: string | null): string {
  if (!referer) return "/";
  try {
    const url = new URL(referer);
    return ALLOWED_RETURN_PATHS.has(url.pathname) ? url.pathname : "/";
  } catch {
    return "/";
  }
}

async function readFields(
  request: Request,
): Promise<{ email: string; lang: string; company: string }> {
  const contentType = request.headers.get("Content-Type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as Record<string, unknown>;
    return {
      email: String(body.email ?? "").trim(),
      lang: String(body.lang ?? "es"),
      company: String(body.company ?? ""),
    };
  }
  const form = await request.formData();
  return {
    email: String(form.get("email") ?? "").trim(),
    lang: String(form.get("lang") ?? "es"),
    company: String(form.get("company") ?? ""),
  };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const json = isJsonRequest(request);
  const referer = request.headers.get("Referer");
  const returnPath = safeReturnPath(referer);
  const lang = returnPath === "/en/" ? "en" : "es";

  const fields = await readFields(request);

  // Honeypot: pretend success, write nothing. A bot that filled this field
  // should not learn that its submission was rejected.
  if (fields.company.trim() !== "") {
    return json
      ? Response.json({ ok: true })
      : Response.redirect(new URL(fields.lang === "en" ? "/en/thanks/" : "/gracias/", request.url), 303);
  }

  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const rateLimitKey = `rl:${ip}`;
  const currentCountRaw = await env.NOTIFY.get(rateLimitKey);
  const currentCount = currentCountRaw ? Number.parseInt(currentCountRaw, 10) : 0;

  if (currentCount >= RATE_LIMIT_PER_HOUR) {
    return json
      ? Response.json({ ok: false, error: "rate_limited" }, { status: 429 })
      : Response.redirect(new URL(returnPath, request.url), 303);
  }

  if (!EMAIL_RE.test(fields.email)) {
    return json
      ? Response.json({ ok: false, error: "invalid_email" }, { status: 400 })
      : Response.redirect(new URL(returnPath, request.url), 303);
  }

  await env.NOTIFY.put(rateLimitKey, String(currentCount + 1), { expirationTtl: 3600 });

  const notifyLang = fields.lang === "en" ? "en" : "es";
  const key = `notify:${Date.now()}:${crypto.randomUUID()}`;
  await env.NOTIFY.put(
    key,
    JSON.stringify({
      email: fields.email,
      lang: notifyLang,
      ts: new Date().toISOString(),
      ua: request.headers.get("User-Agent") ?? "",
    }),
  );

  return json
    ? Response.json({ ok: true })
    : Response.redirect(new URL(notifyLang === "en" ? "/en/thanks/" : "/gracias/", request.url), 303);
};
```

- [ ] **Step 2: Create `wrangler.toml` at the repo root**

```toml
name = "threadvault-landing"
compatibility_date = "2026-09-01"
pages_build_output_dir = "dist"

[[kv_namespaces]]
binding = "NOTIFY"
id = "REPLACE_WITH_KV_NAMESPACE_ID"
```

Leave the `id` as the literal placeholder string, the owner replaces it after running `wrangler kv namespace create NOTIFY` (Task 15, owner step). A placeholder id does not break `npm run build` (Astro never reads `wrangler.toml`), but it does mean `wrangler pages deploy` will fail until the owner sets a real id, call this out explicitly in Task 15.

- [ ] **Step 3: Create `src/components/AndroidNotify.astro`**

```astro
---
import { copy, type Lang } from "../i18n/copy";

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = copy[lang].android;
---

<section id="android" class="scroll-mt-24 py-16 sm:py-20">
  <div class="mx-auto max-w-6xl px-5 sm:px-8">
    <div
      class="rounded-3xl bg-ink-950 px-7 py-12 text-center sm:px-14 sm:py-16"
      data-reveal
    >
      <p class="text-sm font-medium text-gold-300">{t.eyebrow}</p>
      <h2 class="heading mx-auto mt-3 max-w-lg text-3xl font-semibold text-white sm:text-4xl">
        {t.title}
      </h2>
      <p class="lede mx-auto mt-4 max-w-md leading-relaxed text-slate-400">{t.body}</p>

      <form
        method="POST"
        action="/api/notify"
        data-android-notify
        class="mx-auto mt-8 flex max-w-md flex-col items-stretch gap-3 sm:flex-row"
      >
        <input type="hidden" name="lang" value={lang} />

        {/* Honeypot: hidden from sighted and assistive-tech users alike, never
            submitted by a real visitor. See spec §7. */}
        <div class="absolute left-[-9999px]" aria-hidden="true">
          <label for="company">Company</label>
          <input type="text" id="company" name="company" tabindex="-1" autocomplete="off" />
        </div>

        <label for="android-email" class="sr-only">{t.emailLabel}</label>
        <input
          id="android-email"
          type="email"
          name="email"
          required
          placeholder={t.emailPlaceholder}
          class="flex-1 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus-visible:border-gold-300/50"
        />
        <button type="submit" class="cta-primary pressable justify-center">
          {t.submit}
        </button>
      </form>

      <p class="mt-4 text-xs text-slate-600" data-android-notify-microcopy>{t.microcopy}</p>
      <p class="mt-4 hidden text-sm font-medium text-emerald-300" data-android-notify-success>
        {t.success}
      </p>
      <p class="mt-4 hidden text-sm font-medium text-red-300" data-android-notify-error>
        {t.error}
      </p>
    </div>
  </div>
</section>

<script is:inline>
  // Progressive enhancement only: the form above already works with this
  // script absent (plain POST → 303 redirect to /gracias/ or /en/thanks/,
  // see functions/api/notify.ts). When JS runs, intercept submit and swap in
  // an inline success/error state instead of navigating away.
  (() => {
    const form = document.querySelector("[data-android-notify]");
    if (!(form instanceof HTMLFormElement)) return;

    const microcopy = form.parentElement?.querySelector("[data-android-notify-microcopy]");
    const success = form.parentElement?.querySelector("[data-android-notify-success]");
    const error = form.parentElement?.querySelector("[data-android-notify-error]");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      error?.classList.add("hidden");

      try {
        const response = await fetch(form.action, {
          method: "POST",
          headers: { "X-Requested-With": "fetch", "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
        });
        const data = await response.json();

        if (data.ok) {
          form.hidden = true;
          microcopy?.classList.add("hidden");
          success?.classList.remove("hidden");
        } else {
          error?.classList.remove("hidden");
        }
      } catch {
        error?.classList.remove("hidden");
      }
    });
  })();
</script>
```

- [ ] **Step 4: Create the two static thank-you pages**

`src/pages/gracias.astro`:
```astro
---
import Layout from "../layouts/Layout.astro";

const lang = "es" as const;
---

<Layout lang={lang}>
  <section class="mx-auto max-w-lg px-5 py-40 text-center sm:px-8">
    <h1 class="display text-4xl font-semibold text-white">Gracias</h1>
    <p class="lede mt-4 leading-relaxed text-slate-400">
      Te avisamos por correo en cuanto ThreadVault para Android esté disponible.
    </p>
    <a href="/" class="cta-secondary pressable mt-8 inline-flex">Volver al inicio</a>
  </section>
</Layout>
```

`src/pages/en/thanks.astro`:
```astro
---
import Layout from "../../layouts/Layout.astro";

const lang = "en" as const;
---

<Layout lang={lang}>
  <section class="mx-auto max-w-lg px-5 py-40 text-center sm:px-8">
    <h1 class="display text-4xl font-semibold text-white">Thanks</h1>
    <p class="lede mt-4 leading-relaxed text-slate-400">
      We will email you as soon as ThreadVault for Android is ready.
    </p>
    <a href="/en/" class="cta-secondary pressable mt-8 inline-flex">Back to home</a>
  </section>
</Layout>
```

- [ ] **Step 5: Wire `AndroidNotify` into both index pages, after Pricing**

Same pattern as Task 5/8: add the import, insert `<AndroidNotify lang={lang} />` after `<Pricing lang={lang} />` in both `src/pages/index.astro` and `src/pages/en/index.astro`.

- [ ] **Step 6: Build and commit**

Run: `npm run build`
Expected: build succeeds; `dist/gracias/index.html` and `dist/en/thanks/index.html` exist; `functions/api/notify.ts` is untouched by the Astro build (it lives outside `src/`, Astro never looks at it).

```bash
git add src/components/AndroidNotify.astro src/pages/gracias.astro src/pages/en/thanks.astro functions/api/notify.ts wrangler.toml src/pages/index.astro src/pages/en/index.astro
git commit -m "feat: add Android waitlist banner with Cloudflare Pages Function + KV backend"
```

- [ ] **Step 7: Local test via `wrangler pages dev` + `curl`**

This step needs the real KV namespace from Task 15's owner step to fully pass (the `id = "REPLACE_WITH_KV_NAMESPACE_ID"` placeholder makes `wrangler pages dev` fail to bind `NOTIFY`), run it now to confirm the *shape* of the responses is correct using `wrangler`'s local KV emulation, which works even with a placeholder id because `wrangler pages dev` creates a local, on-disk KV store for any declared binding when running without `--remote`:

```bash
npm run build
npx wrangler pages dev dist --port 8788 &
sleep 2

# No-JS path: expect a 303 redirect to /gracias/
curl -i -X POST http://localhost:8788/api/notify \
  --data "email=test@example.com&lang=es" \
  -H "Referer: http://localhost:8788/"
# Expected: "HTTP/1.1 303 See Other" and "location: /gracias/"

# JS path: expect 200 {"ok":true}
curl -i -X POST http://localhost:8788/api/notify \
  -H "Content-Type: application/json" -H "X-Requested-With: fetch" \
  -d '{"email":"test2@example.com","lang":"en"}'
# Expected: "HTTP/1.1 200 OK" and body {"ok":true}

# Honeypot: expect 200 {"ok":true} but no KV write (verified in the next command)
curl -i -X POST http://localhost:8788/api/notify \
  -H "Content-Type: application/json" -H "X-Requested-With: fetch" \
  -d '{"email":"bot@example.com","lang":"es","company":"AcmeCo"}'
# Expected: "HTTP/1.1 200 OK" and body {"ok":true}

# Invalid email: expect 400
curl -i -X POST http://localhost:8788/api/notify \
  -H "Content-Type: application/json" -H "X-Requested-With: fetch" \
  -d '{"email":"not-an-email","lang":"es"}'
# Expected: "HTTP/1.1 400 Bad Request" and body {"ok":false,"error":"invalid_email"}

# Rate limit: repeat a valid request 5 more times from the same IP, 6th should 429
for i in $(seq 1 6); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:8788/api/notify \
    -H "Content-Type: application/json" -H "X-Requested-With: fetch" \
    -d "{\"email\":\"rl$i@example.com\",\"lang\":\"es\"}"
done
# Expected: five "200" lines then one "429" line (this request plus Step 7's
# earlier two successful JS-path calls already used 2 of the 5 allowed, so
# adjust the expected 200/429 split accordingly if running the whole step
# top-to-bottom in one session: the honeypot and invalid-email calls above
# do not count against the limit)

kill %1
```

If `wrangler pages dev` errors on startup with a KV-binding message even
locally, confirm the `wrangler` version matches what `wrangler-action@v3`
resolves to (`npx wrangler --version`), local KV emulation for `[[kv_namespaces]]`
in `wrangler.toml` has been stable Wrangler 3.x behavior throughout 2026, so a
failure here points at a stale global `wrangler` install rather than the
function code.

---

### Task 11: FAQ: native `<details>`

**Estimated effort:** 1 hour

**Files:**
- Create: `src/components/Faq.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`

**Interfaces:**
- Consumes: `copy.<lang>.faq.{eyebrow,title,items[].q,items[].a}` (Task 2).
- Produces: `<Faq lang={lang} />`, inserted after `<AndroidNotify lang={lang} />`, before `<Layout>`'s closing tag (i.e., the last section before the footer).

- [ ] **Step 1: Create `src/components/Faq.astro`**

```astro
---
import { copy, type Lang } from "../i18n/copy";

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = copy[lang].faq;
---

<section id="faq" class="scroll-mt-24 border-t border-white/[0.05] py-20 sm:py-28">
  <div class="mx-auto max-w-3xl px-5 sm:px-8">
    <div class="text-center" data-reveal>
      <p class="text-sm font-medium text-gold-300">{t.eyebrow}</p>
      <h2 class="heading mt-3 text-3xl font-semibold text-white sm:text-4xl">{t.title}</h2>
    </div>

    <div class="mt-10 divide-y divide-white/[0.06] rounded-2xl border border-white/[0.06]">
      {
        t.items.map((item, index) => (
          <details class="group p-5 sm:p-6" data-reveal style={`--reveal-delay: ${index * 40}ms`}>
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-slate-100 marker:content-none">
              {item.q}
              <svg
                class="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 group-open:rotate-45"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="M8 3v10M3 8h10" />
              </svg>
            </summary>
            <p class="lede mt-3 leading-relaxed text-slate-400">{item.a}</p>
          </details>
        ))
      }
    </div>
  </div>
</section>
```

- [ ] **Step 2: Wire it into both index pages**

Same pattern as prior tasks: import `Faq`, insert `<Faq lang={lang} />` immediately after `<AndroidNotify lang={lang} />` in both `src/pages/index.astro` and `src/pages/en/index.astro`. Final section order in both files is now: `Hero`, `ValueProps`, `Features`, `HowItWorks`, `Privacy`, `Pricing`, `AndroidNotify`, `Faq`, matching the spec's §3 order (Footer is rendered by `Layout.astro` itself, outside `<slot />`).

- [ ] **Step 3: Build and commit**

Run: `npm run build`
Expected: build succeeds; both pages contain 6 `<details>` elements under `#faq`.

```bash
git add src/components/Faq.astro src/pages/index.astro src/pages/en/index.astro
git commit -m "feat: add FAQ section using native details/summary"
```

---

### Task 12: Footer restyle: richer link list, drop inline privacy card

**Estimated effort:** 1 hour

**Files:**
- Modify: `src/components/Footer.astro`

**Interfaces:**
- Consumes: `copy.<lang>.footer.{tagline,privacyLink,contact,rights}` (Task 2, replacing `privacyTitle`/`privacyBody`); `copy.<lang>.nav.faq`.
- Produces: nothing new downstream, this closes out the `t.footer.privacyTitle`/`privacyBody` TypeScript errors flagged as expected back in Task 2 Step 3.

- [ ] **Step 1: Rewrite the links array and drop the inline privacy card**

Find:
```astro
const links = [
  { href: "#features", label: t.nav.features },
  { href: "#how", label: t.nav.how },
  { href: "#pricing", label: t.nav.pricing },
];
```
Replace with:
```astro
const links = [
  { href: "#features", label: t.nav.features },
  { href: "#how", label: t.nav.how },
  { href: "#pricing", label: t.nav.pricing },
  { href: "#faq", label: t.nav.faq },
];

const policyHref = lang === "es" ? "/privacidad/" : "/en/privacy/";
```

Find:
```astro
        <a
          href={pathFor(lang)}
          class="pressable inline-flex items-center gap-2.5 text-slate-100 hover:text-white"
        >
          <Mark class="h-5 w-5 text-violet-400" />
          <span class="text-[0.95rem] font-semibold tracking-tight">ThreadVault</span>
        </a>
        <p class="lede mt-3 max-w-sm text-sm leading-relaxed text-slate-500">{t.footer.tagline}</p>

        <div class="mt-8 max-w-md rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p class="text-sm font-medium text-slate-200">{t.footer.privacyTitle}</p>
          <p class="lede mt-1.5 text-sm leading-relaxed text-slate-500">{t.footer.privacyBody}</p>
        </div>
      </div>
```
Replace with:
```astro
        <a
          href={pathFor(lang)}
          class="pressable inline-flex items-center gap-2.5 text-slate-100 hover:text-white"
        >
          <Mark class="h-5 w-5 text-gold-300" />
          <span class="text-[0.95rem] font-semibold tracking-tight">ThreadVault</span>
        </a>
        <p class="lede mt-3 max-w-sm text-sm leading-relaxed text-slate-500">{t.footer.tagline}</p>
      </div>
```

Find (the footer nav's link list, to append the privacy-policy link after the section links and before the contact/language items):
```astro
          {
            links.map((link) => (
              <li>
                <a class="pressable text-slate-400 hover:text-white" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))
          }
          <li>
            <a
              class="pressable text-slate-400 hover:text-white"
              href="mailto:torreseduardo804@gmail.com?subject=ThreadVault"
            >
              {t.footer.contact}
            </a>
          </li>
```
Replace with:
```astro
          {
            links.map((link) => (
              <li>
                <a class="pressable text-slate-400 hover:text-white" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))
          }
          <li>
            <a class="pressable text-slate-400 hover:text-white" href={policyHref}>
              {t.footer.privacyLink}
            </a>
          </li>
          <li>
            <a
              class="pressable text-slate-400 hover:text-white"
              href="mailto:torreseduardo804@gmail.com?subject=ThreadVault"
            >
              {t.footer.contact}
            </a>
          </li>
```

- [ ] **Step 2: Recolor the App Store badge and fix its hardcoded Spanish label**

The existing footer App Store link has a hardcoded Spanish `"Descargar en el App Store"` string even on the English page, a pre-existing bug, worth fixing while touching this file since it directly affects the bilingual quality bar this redesign is raising. Find:
```astro
    <div class="mt-10 flex justify-center">
      <a
        href="https://apps.apple.com/us/app/threadvault/id6757399918"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/80 transition-colors border border-white/10"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.4 12.7c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7 1.3 0 1.6.7 2.8.7 1.1 0 1.9-1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.5-.1 0-2.2-.9-2.2-3.2zM14.2 5.9c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1.1 1.7-.9 2.6 1 .1 2-.5 2.6-1.2z"/>
        </svg>
        Descargar en el App Store
      </a>
    </div>
```
Replace with:
```astro
    <div class="mt-10 flex justify-center">
      <a
        href="https://apps.apple.com/us/app/threadvault/id6757399918"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black/80"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.4 12.7c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7 1.3 0 1.6.7 2.8.7 1.1 0 1.9-1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.5-.1 0-2.2-.9-2.2-3.2zM14.2 5.9c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1.1 1.7-.9 2.6 1 .1 2-.5 2.6-1.2z"/>
        </svg>
        {t.hero.ctaPrimary}
      </a>
    </div>
```
(`t.hero.ctaPrimary` already holds the correct per-language App Store label:
"Descargar en el App Store" / "Download on the App Store". Reusing it here
instead of a hardcoded string is the fix.)

- [ ] **Step 3: Verify no violet remains**

Run: `grep -n "violet" src/components/Footer.astro`
Expected: no matches.

- [ ] **Step 4: Build and commit**

Run: `npm run build`
Expected: build succeeds, this is the first fully green build since Task 2 (Hero, Footer and Pricing property-access errors are all resolved now).

Run: `npx tsc --noEmit`
Expected: no errors.

```bash
git add src/components/Footer.astro
git commit -m "style: richer footer link list, gold accent, fix hardcoded English App Store label"
```

---

### Task 13: Responsive + reduced-motion pass

**Estimated effort:** 2 hours

**Files:**
- Modify: any component from Tasks 3-12 found to break at a checked breakpoint (specific fixes depend on what the manual check finds, this task is a verification + fix-up pass, not new feature work)

**Interfaces:**
- Consumes: every section built so far.
- Produces: nothing new, closes out the "no horizontal scroll, no overlap, reduced-motion respected" bar for all 8 new/changed sections at once.

- [ ] **Step 1: Start the preview server**

```bash
npm run build
npm run preview -- --port 4321 &
sleep 2
```

- [ ] **Step 2: Manual checklist, check both `/` and `/en/` at each width**

Using the browser (resize the window or use devtools device toolbar) at
`http://localhost:4321/` and `http://localhost:4321/en/`, check at each of:
**375px** (small phone), **414px** (large phone), **768px** (tablet
portrait), **1024px** (tablet landscape / small laptop), **1440px**
(desktop):

- [ ] No horizontal scrollbar on the `<body>` at any width (check via
      devtools: `document.documentElement.scrollWidth >
      document.documentElement.clientWidth` should be `false`).
- [ ] Hero: illustration doesn't overlap or crowd the headline at 375-414px;
      3-line headline doesn't wrap mid-word.
- [ ] Value props: 3-column grid collapses to 1 column below `sm:` (640px)
      cleanly, no orphaned icon-only row.
- [ ] Features: screenshot placeholder frames stay centered and don't distort
      aspect ratio at any width; 2-column grid collapses to 1 column below
      `sm:`.
- [ ] Privacy: 2-column never-leaves/leaves grid stacks cleanly on mobile
      with the "Nunca sale"/"Never leaves" list first.
- [ ] Pricing: "Best value" badge pill doesn't clip or overflow its card at
      375px; Pro card doesn't visually collide with the badge's negative
      top offset (`-top-3`).
- [ ] Android notify: input + button stack vertically below `sm:`, full
      width, no overflow; honeypot field (open devtools, inspect
      `#company`) is confirmed off-screen and non-interactive at every
      width.
- [ ] FAQ: `<details>` open/close doesn't cause layout jump wider than the
      content column; long answers wrap, never overflow.
- [ ] Footer: link list wraps to 2 columns on narrow widths without
      overlapping the tagline block.
- [ ] Nav: FAQ link doesn't cause the desktop link row to wrap at 1024px
      (the narrowest width the `md:flex` link row is visible at); confirm the
      mobile nav (links hidden below `md:`) still shows logo + lang switch
      only, unchanged from today.

- [ ] **Step 3: Reduced-motion check**

In devtools, enable "Emulate CSS prefers-reduced-motion: reduce" (Chrome:
Rendering tab; Firefox: about:config `ui.prefersReducedMotion` = 1). Reload
both `/` and `/en/`. Confirm:
- [ ] All `[data-reveal]` content is visible immediately (no persistent
      opacity-0 elements), this is already guaranteed by the existing
      `global.css` media query, this step confirms none of the 5 new
      sections (ValueProps, Privacy, AndroidNotify, Faq, and the restyled
      Features/Pricing/HowItWorks) broke it by, e.g., adding an inline style
      that overrides the transform reset.
- [ ] FAQ's `<details>` open/close still works (native browser behavior,
      unaffected by CSS motion preferences either way).

- [ ] **Step 4: Fix anything the checklist surfaces**

If any check fails, fix it in the relevant component file directly (most
likely candidates: a fixed width instead of a relative one on the
illustration wrapper, or a missing `flex-wrap` on the footer nav). Re-run
Steps 2-3 for the specific breakpoint/section that failed until it passes.

- [ ] **Step 5: Stop the preview server, build, and commit**

```bash
kill %1
npm run build
```
Expected: build succeeds.

```bash
git add -A
git commit -m "fix: responsive and reduced-motion pass across new sections"
```
(If Step 4 required no fixes, skip this commit, nothing to commit.)

---

### Task 14: Lighthouse run and fixes

**Estimated effort:** 1.5 hours

**Files:**
- Modify: whatever the Lighthouse report flags (specific files depend on findings)

**Interfaces:**
- Consumes: the full built site from `dist/`.
- Produces: a Lighthouse report confirming the spec's 95+ target (spec §7) across Performance, Accessibility, Best Practices, and SEO.

- [ ] **Step 1: Build and serve the production output**

```bash
npm run build
npm run preview -- --port 4321 &
sleep 2
```

- [ ] **Step 2: Run Lighthouse via Chrome DevTools or the CLI**

CLI option (no extra install if `npx` can reach the package):
```bash
npx lighthouse http://localhost:4321/ \
  --output=json --output-path=/tmp/lh-es.json \
  --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo
npx lighthouse http://localhost:4321/en/ \
  --output=json --output-path=/tmp/lh-en.json \
  --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo
```
Expected: both JSON reports show all four category scores at `0.95` or
above (`jq '.categories | to_entries[] | {(.key): .value.score}' /tmp/lh-es.json`
to read them quickly).

- [ ] **Step 3: Fix anything under 95**

Common causes given this build (fix the specific one the report names):
- **Accessibility < 95**: usually a missing `alt`, insufficient contrast, or
  a missing form label, re-check the honeypot markup (Task 10) and the
  `ScreenshotFrame` placeholder's `role="img"`/`aria-label` (Task 6) first,
  since those are the newest, least-battle-tested markup in this plan.
- **Performance < 95**: check whether real screenshots have landed in
  `public/screens/` yet (they inflate page weight if not yet compressed to
  spec, re-run the `sips`/`cwebp` pipeline from spec §6) and whether the
  hero SVG (Task 4) is being inlined once, not duplicated per page (it
  should already be inline-per-page by construction, so this is a sanity
  check, not an expected finding).
- **SEO < 95**: check `Layout.astro`'s existing meta tags are still present
  in the new pages (`gracias.astro`, `en/thanks.astro`, `privacidad.astro`,
  `en/privacy.astro`, all four route through `Layout.astro`, so this should
  already pass, but the 4 new page routes are the ones to spot-check since
  they didn't exist before this plan).

- [ ] **Step 4: Re-run Step 2 after any fix, stop the server, commit**

```bash
kill %1
npm run build
git add -A
git commit -m "fix: address Lighthouse findings, confirm 95+ across all four categories"
```
(Skip the commit if Step 3 required no changes, report the clean scores
instead.)

---

### Task 15: Deploy + owner steps

**Estimated effort:** 1 hour (agent steps) + owner time for Cloudflare account actions

**Files:**
- None (this task is operational: real KV namespace creation, `wrangler.toml` id update, verifying the live deploy, and dropping in real screenshots)

**Interfaces:**
- Consumes: `wrangler.toml`'s `REPLACE_WITH_KV_NAMESPACE_ID` placeholder (Task 10); the existing `.github/workflows/deploy.yml`, unmodified by this plan.
- Produces: a live deploy at `vault.eduardo-torres.com` with the notify endpoint working end-to-end.

- [ ] **Step 1 (owner, local machine, not this session): create the KV namespace**

```bash
wrangler login
wrangler kv namespace create NOTIFY
```
Expected output includes a block like:
```
[[kv_namespaces]]
binding = "NOTIFY"
id = "a1b2c3d4e5f6..."
```

- [ ] **Step 2 (owner): paste the real id into `wrangler.toml`**

Replace `REPLACE_WITH_KV_NAMESPACE_ID` in the repo's `wrangler.toml` with the
id from Step 1.

```bash
git add wrangler.toml
git commit -m "chore: set real Cloudflare KV namespace id for NOTIFY"
git push origin main
```

- [ ] **Step 3: Confirm the GitHub Action deploy succeeds**

```bash
gh run watch --exit-status
```
Expected: the `Deploy to Cloudflare Pages` workflow (`.github/workflows/deploy.yml`, unmodified) completes green. This single push carries every task in this plan plus the real KV id live at once, since Tasks 1-14 were committed to `main` incrementally but this is the first push since `wrangler.toml` had a working id.

- [ ] **Step 4: Smoke-test the live notify endpoint**

```bash
curl -i -X POST https://vault.eduardo-torres.com/api/notify \
  --data "email=smoketest@example.com&lang=es" \
  -H "Referer: https://vault.eduardo-torres.com/"
```
Expected: `HTTP/2 303` with `location: /gracias/`.

- [ ] **Step 5 (owner): verify the KV write landed**

```bash
wrangler kv key list --binding=NOTIFY --remote
```
Expected: a `notify:<timestamp>:<uuid>` key from the smoke test above.
Delete the smoke-test entry once confirmed (it is not a real signup):
```bash
wrangler kv key get --binding=NOTIFY --remote  # find the exact key from the list above, then:
wrangler kv key delete --binding=NOTIFY "notify:<timestamp>:<uuid>" --remote
```

- [ ] **Step 6 (owner): drop in real screenshots**

Capture the four screens per spec §6 (iPhone 17 Pro Max simulator or
device, native 1320×2868), then:
```bash
sips -Z 1392 capture-classify.png --out /tmp/classify.png && cwebp -q 82 /tmp/classify.png -o public/screens/classify.webp
sips -Z 1392 capture-tags.png --out /tmp/tags.png && cwebp -q 82 /tmp/tags.png -o public/screens/tags.webp
sips -Z 1392 capture-search.png --out /tmp/search.png && cwebp -q 82 /tmp/search.png -o public/screens/search.webp
sips -Z 1392 capture-reader.png --out /tmp/reader.png && cwebp -q 82 /tmp/reader.png -o public/screens/reader.webp
npm run build   # confirm the placeholders are gone from dist/ and real images appear
git add public/screens/*.webp
git commit -m "content: add real feature screenshots"
git push origin main
```
`ScreenshotFrame.astro`'s `existsSync` check (Task 6) picks these up
automatically, no code change needed for this step.

- [ ] **Step 7: Final verification**

Visit `https://vault.eduardo-torres.com/` and `https://vault.eduardo-torres.com/en/`
directly, confirm: hero illustration renders, all 4 Features cards show real
screenshots (post Step 6) or placeholders (pre Step 6), Privacy section
links to a working `/privacidad/` (and `/en/privacy/` from the English
page), Android notify form submits successfully with JS on (inline success
message appears) and, in a separate check with devtools' "Disable
JavaScript" toggled on, with JS off (page navigates to `/gracias/` or
`/en/thanks/`), FAQ entries expand/collapse, footer's App Store badge and
new links all resolve.
