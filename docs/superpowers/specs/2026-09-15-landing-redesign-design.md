# ThreadVault Landing Redesign: Design Spec

## 1. Goal and what changes

Today's site (Astro 7 + Tailwind v4, `es` default at `/`, `en` at `/en/`) is
one page: Hero → Features → How it works → Pricing → Footer. This redesign
keeps the dark palette, the existing engineering (Tailwind v4 `@theme`
tokens, the `data-reveal` scroll pattern, bilingual `copy.ts`, static Astro
output) and:

- Adopts the reference template's **structure** (not its palette): split
  hero, a value-prop strip, card grids, one highlighted pricing plan, a
  full-width CTA banner, a richer footer.
- Replaces the hero's HTML "device mockup" with an **original inline SVG**
  illustration (no people, no rockets) and adds **real screenshots**, framed,
  to Features.
- Swaps the violet accent for the app's **gold** `#E8D5A3`; keeps emerald as
  the secondary "on-device" signal; adds a near-black `ink` surface family
  echoing the app icon.
- Drops testimonials/logo strip (no real social proof yet, no fabricated
  numbers) for a **Privacy / on-device** section built from `PRIVACY.md`:
  for this app, "nothing leaves your phone" *is* the trust pitch.
- Adds an **Android waitlist banner** (Cloudflare Pages Function + KV) and an
  **FAQ**.
- Final order: Nav → Hero → Value props → Features → How it works → Privacy
  → Pricing → Android notify → FAQ → Footer.

Everything ships static, plus one small edge function. No accounts, no CMS,
no third-party analytics/email service.

## 2. Visual system

### Tokens: add to `global.css`'s existing `@theme` block

```css
@theme {
  /* gold replaces violet as the primary accent; sampled from the app icon
     spec (#E8D5A3 on near-black, see Assets.xcassets / render-app-icon.swift) */
  --color-gold-50:  #FBF7EE;
  --color-gold-100: #F5EBD4;
  --color-gold-200: #F0E4C4;
  --color-gold-300: #E8D5A3; /* primary accent: CTA fill, focus ring, links */
  --color-gold-400: #DDC079;
  --color-gold-500: #CBA753;
  --color-gold-600: #A98937;
  --color-gold-950: #2A2210;

  /* near-black card-surface family, echoes the app icon's dark gradient */
  --color-ink-900: #1D1A15;
  --color-ink-950: #14120F;
}
```

`slate-950` stays the page background. Emerald stays the secondary
"on-device/found" signal (hero badge, privacy checks, Free-tier checks).
Every `violet-*` class becomes the matching `gold-*` step (mapped per task in
the plan); `::selection` / `:focus-visible` move from violet to gold.

**Primary CTA** (contrast flip from today): `bg-gold-300 text-ink-950
hover:bg-gold-200`, dark text on a gold pill, ~11:1 contrast, matches the
template's black-on-yellow pill. **Secondary CTA**: unchanged outline
pattern, hover border tints gold instead of white.

### Type, spacing, motion: mostly unchanged

Font stays `Inter Variable` (`@fontsource-variable/inter`, self-hosted). The
`.display` / `.heading` / `.lede` utilities in `global.css` are reused
as-is. Only change: the **hero headline** goes from 2 lines to 3, to match
the template. Scale: `.display text-[2.6rem] sm:text-6xl` (hero) →
`.display text-4xl` (pricing price, CTA banner) → `.heading text-3xl
sm:text-4xl` (section titles) → `.heading text-lg` (card titles) → 16px body
/ 14px meta.

Section rhythm unchanged: `py-20 sm:py-28`, `border-t border-white/[0.05]`,
`max-w-6xl` content, `px-5 sm:px-8` gutter. Cards keep `.surface` (existing
utility) except the Privacy section and hero illustration, which use the new
`ink-900`/`ink-950` tokens because they're meant to read as "the app," not
generic chrome. Shadows: existing soft colored glow under primary CTAs, now
`shadow-gold-500/50`. Motion: reuse `[data-reveal]` / `data-reveal-ready`
exactly as implemented in `Layout.astro` and `global.css`, visible without
JS, opts out only once the `IntersectionObserver` confirms it's running,
already neutralized under `prefers-reduced-motion`. No new library.

## 3. Sections

**Nav**: unchanged shape (fixed, translucent, logo + links + lang switch),
gold accent, one addition: an FAQ link.
```
[Mark] ThreadVault   Features  How-it  FAQ  Pricing   [ES|EN]
```

**Hero**: split layout, left copy / right illustration. Headline becomes 3
lines. Badge, lede, both CTAs, footnote keep today's copy, recolored gold.
```
desktop (lg:grid-cols-[1fr_auto]):
● on-device badge          |   [SVG: card stack + chips + spark]
Tu memoria digital.        |
Todo lo que guardas,       |
entendido.                 |
lede…                      |
[● App Store] [Ver cómo →] |
footnote                   |
mobile: illustration moves below copy, centered, ~85vw
```
*Illustration*, one hand-written inline SVG, `viewBox="0 0 600 600"`,
`role="img"` + `aria-label`, back to front: (1) two soft blob/"leaf" paths
(quadratic curves, not literal plants) at 0.14–0.18 opacity, one gold one
emerald; (2) a 3-card fan (rounded rects, `ink-950`/`ink-900`, each rotated a
few degrees more than the one in front); (3) on the front card: a category
chip, a title bar, two summary bars, two tag chips, all solid bars/pills,
never `<text>`, so it needs no per-language variant; (4) a small gold
"on-device spark" badge (4-point star in a ring), top-right; (5) a small
emerald magnifying-glass glyph, bottom-left. Full markup (~90 lines) is in
the plan, Task 4.

**Value props (new)**: 3 items, icon + title + one line, no card borders
(lighter than Features, matches the template's plain icon strip): on-device
intelligence, no accounts/no servers, save from any app. Stacks to 1 column
on mobile.

**Features**: same `sm:grid-cols-2` card grid, each card gains a framed
screenshot above icon/title/body. Redefined to the 4 screenshotted things:
classification+summary, tags+filter, search (incl. semantic), reader/embeds.
Stacks to 1 column on mobile.

**How it works**: content/structure unchanged (save → organize → find).
Restyle only: numbered chips get a gold ring, the connecting rule gradients
gold instead of white, tying it visually to Features above it.

**Privacy / on-device (new, replaces testimonials + logos)**: 2-column:
left = intro + "never leaves" list (emerald checks); right = "leaves, and
why" list (neutral arrows); link to the full policy page below. Stacks on
mobile, "never" list first.

**Pricing**: same 2-card grid, Pro gets a new "Best value" tag and the gold
accent; Free stays a plain `.surface` card, visually secondary. On mobile,
Pro (the highlighted plan) leads.

**Android notify banner (new)**: full-width `ink-950` module (distinct from
the `slate-950` page background, reads as a dedicated block like the
template's CTA banner): title, body, inline email form + submit, honeypot
hidden, microcopy. Input/button stack on mobile.

**FAQ (new)**: native `<details>`/`<summary>`, 6 Q&As, single column,
`max-w-3xl` centered, no JS needed to expand.

**Footer**: same 2-column shape (tagline block / link nav), link list
grows: Features, How, Pricing, FAQ, Privacy policy, Contact, language
switch. The existing inline "Privacy" mini-card is removed (redundant with
the new Privacy section + policy page). App Store badge and copyright stay
centered below, unchanged.

## 4. Copy: ES / EN

Spanish is default (`defaultLang: "es"`). No em dash anywhere; commas and
periods only, matching the existing file.

**Nav addition**: `nav.faq`: es `"FAQ"` / en `"FAQ"`.

**Hero headline**: `titleTop/titleBottom` become `titleLine1/2/3`:
es `"Tu memoria digital."` / `"Todo lo que guardas,"` / `"entendido."`.
en `"Your digital memory."` / `"Everything you save,"` / `"understood."`.
Everything else in `hero.*` is unchanged; the `cards` array becomes unused
(the SVG replaces the mockup) and is deleted (see plan Task 2).

**Value props** (`values`):
- es eyebrow "Por qué ThreadVault", 1) "IA en el dispositivo" / "El modelo
  vive en tu iPhone. Nada de lo que guardas sale para clasificarse." 2) "Sin
  cuentas ni servidores" / "ThreadVault no tiene backend. No creas una cuenta
  y no hay nada que hackear en un servidor que no existe." 3) "Guarda desde
  cualquier app" / "La extensión de compartir de iOS acepta enlaces, texto e
  imágenes desde cualquier app."
- en eyebrow "Why ThreadVault", 1) "On-device intelligence" / "The model
  runs on your iPhone. Nothing you save leaves the device to get
  classified." 2) "No accounts, no servers" / "ThreadVault has no backend.
  There is no account to create and no server to break into, because there
  isn't one." 3) "Save from any app" / "iOS's share sheet takes links, text
  and images from any app you're using."

**Features** (`features.items`, each gains a `screenshot` key):
- es eyebrow "Funciones", title "Cuatro cosas, hechas bien". 1) "Resumen y
  categoría" / "Apple Intelligence lee el contenido y escribe un resumen
  corto. Cada elemento cae en su categoría sin que tengas que elegirla." /
  `screenshot: "classify"`. 2) "Etiquetas y filtro" / "Las etiquetas salen
  del contenido y se cuentan. Filtra el vault por una o varias a la vez,
  desde la barra de arriba." / `"tags"`. 3) "Búsqueda, incluida la
  semántica" / "Busca por palabra exacta o por lo que recuerdas. Las
  coincidencias literales van primero, las relacionadas debajo, nunca
  mezcladas." / `"search"`. 4) "Lector y contenido incrustado" / "Abre
  cualquier elemento en una vista de lectura sin distracciones, o mira el
  video o la publicación incrustada, sin salir de la app." / `"reader"`.
- en eyebrow "Features", title "Four things, done properly". 1) "Summary and
  category" / "Apple Intelligence reads the content and writes a short
  summary. Every item lands in its category without you choosing one." /
  `"classify"`. 2) "Tags and filter" / "Tags are pulled from the content and
  counted. Filter the vault by one or several at once, from the bar up top."
  / `"tags"`. 3) "Search, semantic included" / "Search by exact word or by
  what you remember. Literal matches come first, related ones below, never
  blended." / `"search"`. 4) "Reader and embedded content" / "Open any item
  in a distraction-free reading view, or watch the embedded video or post,
  without leaving the app." / `"reader"`.

**How it works**: no copy changes.

**Privacy** (`privacy`):
- es: eyebrow "Privacidad", title "Lo que sale del teléfono. Y lo que nunca
  sale.", intro "ThreadVault no tiene servidor, ni analítica, ni cuenta. Esto
  es exactamente lo que hace cada conexión de red que la app puede iniciar."
  `neverTitle` "Nunca sale", "El resumen, la categoría y las etiquetas de
  cada elemento.", "Las imágenes que guardas.", "La clasificación con IA:
  corre en tu iPhone, no en un servidor." `leavesTitle` "Sale, y por qué":
  "Una petición HTTPS para descargar la página que compartiste, igual que
  hace un navegador.", "Si activas la búsqueda semántica, una descarga única
  del modelo de Apple. Después, todo el cálculo es local." `policyLink` "Lee
  la política completa".
- en: eyebrow "Privacy", title "What leaves your phone. And what never
  does.", intro "ThreadVault has no server, no analytics and no account.
  Here is exactly what every network connection the app can make actually
  does." `neverTitle` "Never leaves", "The summary, category and tags for
  every item.", "The images you save.", "AI classification: it runs on your
  iPhone, not on a server." `leavesTitle` "Leaves, and why", "One HTTPS
  request to fetch the page you shared, the same thing a browser does.", "If
  you turn on semantic search, a one-time download of Apple's model. After
  that, every calculation stays local." `policyLink` "Read the full policy".

**Pricing**: add `plans[1].badge`: es "Mejor valor" / en "Best value".
**Flagging, not fixing:** today's `copy.ts` has Pro's `cta` as "Próximamente"
(es) vs. "Available now" (en), and `pricing.soon` itself differs the same
way, the two languages disagree on whether Pro is live. Carried forward
unchanged; see open question #1.

**Android notify** (`android`):
- es: eyebrow "Android", title "ThreadVault, ahora para Android", body
  "Estamos construyendo la versión Android: IA híbrida en el dispositivo con
  Gemini Nano y Gemma 4. Déjanos tu correo y te avisamos en cuanto esté
  lista.", `emailPlaceholder` "tu@correo.com", `submit` "Avisarme",
  `microcopy` "Solo lo usamos para avisarte del lanzamiento. Sin spam.",
  `success` "Listo. Te escribimos cuando esté disponible.", `error` "Algo
  falló. Intenta de nuevo en un minuto."
- en: eyebrow "Android", title "ThreadVault, coming to Android", body "We
  are building the Android version: hybrid on-device AI with Gemini Nano and
  Gemma 4. Leave your email and we will let you know the moment it is
  ready.", `emailPlaceholder` "you@email.com", `submit` "Notify me",
  `microcopy` "We will only use it to tell you about the launch. No spam.",
  `success` "Done. We will write when it is ready.", `error` "Something went
  wrong. Try again in a minute."

**FAQ** (`faq`):
- es eyebrow "Preguntas frecuentes", title "Lo que la gente pregunta". Q1
  "¿ThreadVault necesita cuenta?" A "No. Abres la app y ya puedes guardar. No
  hay registro, ni correo, ni contraseña." Q2 "¿Mis datos salen de mi
  iPhone?" A "No para la clasificación. La IA corre en el dispositivo. Lo
  único que sale es la petición para descargar la página que compartiste."
  Q3 "¿Qué necesito para la clasificación con IA?" A "iOS 18 o superior, un
  iPhone compatible con Apple Intelligence y tenerla activada en Ajustes. Sin
  eso, ThreadVault sigue guardando y buscando, pero sin resumen ni
  categoría." Q4 "¿Qué diferencia hay entre Free y Pro?" A "Free guarda sin
  límite y clasifica en el dispositivo. Pro añade búsqueda semántica,
  sincronización por iCloud, exportación a Markdown y vista de lectura." Q5
  "¿Habrá versión para Android?" A "Está en desarrollo, con IA híbrida en el
  dispositivo, Gemini Nano y Gemma 4. Déjanos tu correo más abajo y te
  avisamos." Q6 "¿Cómo cancelo Pro?" A "Desde Ajustes de tu cuenta de Apple,
  como cualquier suscripción del App Store. ThreadVault no gestiona pagos ni
  puede cobrarte fuera de ahí."
- en eyebrow "Frequently asked", title "What people ask". Q1 "Does
  ThreadVault need an account?" A "No. Open the app and start saving. No
  sign-up, no email, no password." Q2 "Does my data leave my iPhone?" A "Not
  for classification. The AI runs on the device. The only thing that leaves
  is the request to fetch the page you shared." Q3 "What do I need for AI
  classification?" A "iOS 18 or later, an iPhone that supports Apple
  Intelligence, and it turned on in Settings. Without that, ThreadVault
  still saves and searches, just without a summary or category." Q4 "What
  is the difference between Free and Pro?" A "Free saves without limit and
  classifies on device. Pro adds semantic search, iCloud sync, Markdown
  export and a reading view." Q5 "Will there be an Android version?" A "It
  is in development, with hybrid on-device AI, Gemini Nano and Gemma 4.
  Leave your email below and we will let you know." Q6 "How do I cancel
  Pro?" A "From your Apple Account settings, like any App Store
  subscription. ThreadVault does not handle payments and cannot charge you
  outside of that."

**Footer**: add `footer.privacyLink`: es "Política de privacidad" / en
"Privacy policy". Remove `footer.privacyTitle`/`privacyBody` (superseded by
the Privacy section + policy page).

**Standalone privacy page** (`/privacidad/` es, `/en/privacy/` en), plain-
language condensation of `PRIVACY.md`, not verbatim legal text, outside
`copy.ts` since it's page-specific prose:
- es: "# Privacidad", "ThreadVault no tiene servidor, ni cuentas, ni
  analítica, ni publicidad. Esto es exactamente lo que la app puede enviar
  por la red." § "Clasificación con IA": "Corre en tu iPhone con Apple
  Intelligence. Lo que guardas nunca se envía a un modelo por internet, bajo
  ninguna configuración. Si tu dispositivo no es compatible, ThreadVault
  sigue guardando y buscando, solo sin resumen ni categoría." § "La página
  que compartiste": "Para mostrar el título y la vista previa, ThreadVault
  descarga la página que guardaste, igual que hace tu navegador. Solo
  HTTPS, sin cookies, sin sesión que persista." § "Búsqueda semántica": "Si
  la activas, Apple descarga una vez su modelo de embeddings. Después, todo
  el cálculo ocurre en tu teléfono." § "Lo que nunca sale": "Tus resúmenes,
  categorías, etiquetas, texto de artículos e imágenes guardadas viven solo
  en tu iPhone." "¿Preguntas? Escríbeme a torreseduardo804@gmail.com."
- en: "# Privacy", "ThreadVault has no server, no accounts, no analytics
  and no advertising. This is exactly what the app can send over the
  network." § "AI classification": "Runs on your iPhone with Apple
  Intelligence. What you save is never sent to a model over the internet,
  under any configuration. If your device is not eligible, ThreadVault
  still saves and searches, just without a summary or category." § "The
  page you shared": "To show the title and preview, ThreadVault downloads
  the page you saved, the same thing your browser does. HTTPS only, no
  cookies, no session that persists." § "Semantic search": "If you turn it
  on, Apple downloads its embedding model once. After that, every
  calculation happens on your phone." § "What never leaves": "Your
  summaries, categories, tags, article text and saved images live only on
  your iPhone." "Questions? Write to torreseduardo804@gmail.com."

## 5. Email capture architecture

**Decision: keep Astro static (no `@astrojs/cloudflare` adapter).** Pages
natively deploys a `functions/` directory at the repo root, independent of
the static output dir. `wrangler pages deploy dist`, already the command in
`deploy.yml`, auto-detects `./functions` relative to its CWD (the repo
root, since the workflow never `cd`s) and bundles it as a Functions Worker
alongside `dist/`. Zero change to `astro.config.mjs` or `deploy.yml`. An
adapter would make the whole site SSR to give one form a backend; Pages
Functions already does that for one route, framework-free.

```
landing/
├── functions/api/notify.ts   ← POST /api/notify
├── wrangler.toml              ← KV binding, compatibility date
├── src/…
└── dist/                      ← build output, unrelated to functions/
```

`wrangler.toml` (new, repo root):
```toml
name = "threadvault-landing"
compatibility_date = "2026-09-01"
pages_build_output_dir = "dist"

[[kv_namespaces]]
binding = "NOTIFY"
id = "REPLACE_WITH_KV_NAMESPACE_ID"
```
Wrangler 3.x (already what `wrangler-action@v3` uses) reads this file for
Pages KV bindings automatically, no dashboard step, since this project
deploys via `wrangler pages deploy`, not Cloudflare's Git-integration UI.

**Contract, `POST /api/notify`:** body is `x-www-form-urlencoded` (plain
form) or `application/json` (JS `fetch`, which also sets header
`X-Requested-With: fetch`, that header decides JSON-vs-redirect response).
Fields: `email` (required), `lang` (`es`|`en`, hidden), `company` (honeypot,
must be empty).

- No-JS success → `303` to `/gracias/` (es) / `/en/thanks/` (en), two new
  static pages, so confirmation needs no query-string parsing.
- No-JS honeypot tripped → same 303, silently, without writing to KV.
- No-JS invalid/rate-limited → `303` back to `Referer` (allowlisted to `/`
  and `/en/`, falls back to `/`).
- JS success → `200 {"ok":true}`. JS honeypot → `200 {"ok":true}` (same
  anti-tip-off logic), no write. JS invalid → `400
  {"ok":false,"error":"invalid_email"}`. JS rate-limited → `429
  {"ok":false,"error":"rate_limited"}`.

HTML5 `<input type="email" required>` covers real users with JS off; the
server-side invalid-email branch is realistically bots/curl only.

**Storage:** key `notify:<unix_ms>:<uuid>`, value `{email, lang, ts, ua}`,
no TTL (see open question #3). **Rate limit:** key `rl:<CF-Connecting-IP>`,
count with `expirationTtl: 3600`, cap 5/hour/IP; over limit → 429 or
referer-redirect, nothing written to `notify:`.

**Owner steps (need Cloudflare account access this session doesn't have):**
1. `wrangler login` (local). 2. `wrangler kv namespace create NOTIFY`, paste
the returned id into `wrangler.toml`. 3. Commit + push, next `deploy.yml`
run picks up the binding. 4. Export later:
```bash
wrangler kv key list --binding=NOTIFY --remote > /tmp/keys.json
wrangler kv key get --binding=NOTIFY "notify:1234567890:abcd-…" --remote
```

## 6. Screenshot spec

Source: **iPhone 17 Pro Max, native 1320×2868** (Simulator: `xcrun simctl io
booted screenshot`, or a real device).

| File → `public/screens/` | Feature card | Capture |
|---|---|---|
| `classify.webp` | Resumen y categoría | Item detail: summary + category badge |
| `tags.webp` | Etiquetas y filtro | Dashboard with `TagFilterBar` open, tags active |
| `search.webp` | Búsqueda | Search with "Related" semantic results below exact matches |
| `reader.webp` | Lector | Distraction-free reader or embedded post |

Displayed via `ScreenshotFrame` at CSS width **220px mobile / 260px
desktop**. Deliver WebP pre-scaled to **640×1392** (native × 0.4848, ratio
preserved), ~2.5–2.9x density at display size, each file well under 150 KB
at `-q 82`:
```bash
sips -Z 1392 capture-classify.png --out /tmp/classify.png
cwebp -q 82 /tmp/classify.png -o public/screens/classify.webp
```
(`-Z 1392` scales the longer/2868 side to 1392; the 1320 side lands at ~640
automatically.) Every `<img>` carries explicit `width="640" height="1392"`
regardless of real vs. placeholder, so there's never layout shift.

**Placeholder:** `ScreenshotFrame.astro`'s frontmatter runs in Node at build
time; it checks whether the target file exists under `public/screens/` and,
if not, renders an inline SVG placeholder at the identical 640×1392 box (a
device silhouette, soft gradient, centered caption like "Screenshot:
classify") so the page builds and looks intentional today, and swaps to the
real file automatically the moment the owner adds it, no code change. Full
code: plan Task 6.

## 7. Accessibility and performance

- Reuse `[data-reveal]`/`data-reveal-ready` exactly as implemented, visible
  without JS, opts out only once the observer confirms it's running, already
  neutralized under `prefers-reduced-motion`. No new script for this.
- Every new section is `<section id="…">` (extends today's `#features`,
  `#how`, `#pricing` pattern to `#values`, `#privacy`, `#android`, `#faq`).
  Email input has a real `<label>` (can be `sr-only`, must exist, not
  placeholder-only).
- Honeypot field: `tabindex="-1"`, `autocomplete="off"`, `aria-hidden="true"`,
  hidden by off-screen absolute position, not `display:none`/`hidden` (some
  bots skip those when deciding what to fill).
- FAQ: native `<details>`/`<summary>`, no JS, no extra ARIA needed.
- All screenshots (real or placeholder) get `width`/`height` and `alt` text
  describing the feature, not the literal screenshot.
- No external scripts anywhere: only the existing inline reveal-observer and
  a new tiny inline progressive-enhancement script for the notify form
  (fetch + inline success/error swap), both `is:inline`.
- Fonts stay self-hosted (`@fontsource-variable/inter`), unchanged.
- Target: Lighthouse **95+** across the board, verified in plan Task 14.

## 8. Explicitly not included

No testimonials, logo strip, or fabricated numbers. No third-party email
service (KV only, v1). No CMS or database beyond the one KV namespace. No
new fonts, icon library, or animation library. No people, rockets, or stock
photography, including in the hero illustration. No SSR/adapter, static
except the one Function route. No mention of the reference template's
origin anywhere in the repo. No changes to the iOS or Android app codebases.

## 9. Open questions for the owner

1. **Pricing inconsistency:** today's `copy.ts` has Pro's CTA reading
   "coming soon" in Spanish but "available now" in English (§4). Is Pro
   actually purchasable today? Carried forward unchanged rather than
   guessed; fix both languages at once once known.
2. **Privacy page depth:** the new policy pages paraphrase `PRIVACY.md`
   rather than reproduce it verbatim (§4). Acceptable, or should it be a
   closer section-by-section translation?
3. **Waitlist retention:** KV entries have no TTL (§5). Confirm indefinite
   storage is intended, versus e.g. a 12-month expiry.
4. **KV namespace ID:** `wrangler.toml` needs a real id from `wrangler kv
   namespace create NOTIFY`, which only the owner's Cloudflare account can
   generate (§5).
5. **Screenshot placeholder:** ship the Features section live with build-
   time placeholders until real captures land (§6), or hold that section
   back until captures are ready?
