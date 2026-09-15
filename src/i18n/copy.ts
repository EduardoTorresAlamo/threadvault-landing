export const languages = { es: "Español", en: "English" } as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "es";

/** `/` is Spanish, `/en/` is English. */
export const pathFor = (lang: Lang) => (lang === "es" ? "/" : "/en/");

export const copy = {
  es: {
    htmlLang: "es",
    meta: {
      title: "ThreadVault — Tu memoria digital",
      description:
        "Guarda enlaces, textos e imágenes desde cualquier app. ThreadVault los resume, los clasifica y los etiqueta en tu iPhone. Sin cuentas, sin servidores.",
    },
    nav: {
      features: "Funciones",
      how: "Cómo funciona",
      pricing: "Precio",
      skip: "Saltar al contenido",
      langLabel: "Idioma",
    },
    hero: {
      badge: "Procesamiento 100 % en el dispositivo",
      titleTop: "Tu memoria digital.",
      titleBottom: "Todo lo que guardas, entendido.",
      lede: "Compartes un enlace y se acabó tu trabajo. ThreadVault lee el contenido, escribe el resumen, elige la categoría y saca las etiquetas — con el modelo que ya vive en tu iPhone.",
      ctaPrimary: "Descargar en el App Store",
      ctaSecondary: "Ver cómo funciona",
      footnote: "iOS 18 o superior. La clasificación necesita Apple Intelligence.",
      mockTitle: "Vault",
      mockSubtitle: "128 elementos",
      mockStatus: "Clasificado en el dispositivo · 1,2 s",
      cards: [
        {
          category: "Artículo",
          title: "El coste real de una dependencia",
          summary:
            "Cada paquete añade superficie de mantenimiento que nadie contabiliza hasta que rompe.",
          tags: ["arquitectura", "swift"],
        },
        {
          category: "Video",
          title: "Designing Fluid Interfaces",
          summary: "Por qué un gesto interrumpible se siente vivo y una animación fija no.",
          tags: ["motion", "ios"],
        },
        {
          category: "Receta",
          title: "Mofongo de plátano verde",
          summary: "Tres plátanos, ajo, chicharrón. El pilón importa más que la receta.",
          tags: ["cocina"],
        },
        {
          category: "Producto",
          title: "Teclado ortolineal de 40 %",
          summary: "Menos teclas, más capas. Curva de aprendizaje de unas dos semanas.",
          tags: ["hardware"],
        },
      ],
    },
    features: {
      eyebrow: "Funciones",
      title: "Cuatro cosas, hechas bien",
      items: [
        {
          title: "Guarda desde cualquier app",
          body: "La extensión de compartir acepta enlaces, texto e imágenes. Un toque desde Safari, Mail o donde estés leyendo, y ya está dentro.",
        },
        {
          title: "IA en el dispositivo",
          body: "Apple Intelligence resume y clasifica cada elemento. No hay cuenta, ni clave de API, ni petición de red: la app no tiene a dónde enviar tus datos.",
        },
        {
          title: "Búsqueda semántica",
          body: "Busca por lo que recuerdas, no por las palabras exactas. Las coincidencias literales van primero y las relacionadas debajo, nunca mezcladas.",
        },
        {
          title: "Etiquetas que se ganan su sitio",
          body: "Las etiquetas salen del contenido y se cuentan. Las que aparecen una sola vez no llenan la barra de filtros.",
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
    footer: {
      tagline: "Un vault que entiende lo que guardas, sin mandarlo a ningún sitio.",
      privacyTitle: "Privacidad",
      privacyBody:
        "ThreadVault no tiene servidor, ni cuentas, ni analítica. Lo único que sale de tu iPhone es la petición para descargar la página que compartiste.",
      contact: "Escríbeme",
      rights: "Hecho en Puerto Rico.",
    },
  },

  en: {
    htmlLang: "en",
    meta: {
      title: "ThreadVault — Your digital memory",
      description:
        "Save links, text and images from any app. ThreadVault summarises, files and tags them on your iPhone. No account, no server.",
    },
    nav: {
      features: "Features",
      how: "How it works",
      pricing: "Pricing",
      skip: "Skip to content",
      langLabel: "Language",
    },
    hero: {
      badge: "Runs entirely on device",
      titleTop: "Your digital memory.",
      titleBottom: "Everything you save, understood.",
      lede: "Share a link and your work is done. ThreadVault reads the content, writes the summary, picks the category and pulls the tags — using the model already living on your iPhone.",
      ctaPrimary: "Download on the App Store",
      ctaSecondary: "See how it works",
      footnote: "iOS 18 and later. Classification requires Apple Intelligence.",
      mockTitle: "Vault",
      mockSubtitle: "128 items",
      mockStatus: "Classified on device · 1.2 s",
      cards: [
        {
          category: "Article",
          title: "What a dependency actually costs",
          summary:
            "Every package adds maintenance surface nobody counts until the day it breaks.",
          tags: ["architecture", "swift"],
        },
        {
          category: "Video",
          title: "Designing Fluid Interfaces",
          summary: "Why an interruptible gesture feels alive and a fixed animation doesn't.",
          tags: ["motion", "ios"],
        },
        {
          category: "Recipe",
          title: "Green plantain mofongo",
          summary: "Three plantains, garlic, pork crackling. The pilón matters more than the recipe.",
          tags: ["cooking"],
        },
        {
          category: "Product",
          title: "40% ortholinear keyboard",
          summary: "Fewer keys, more layers. Roughly a two-week learning curve.",
          tags: ["hardware"],
        },
      ],
    },
    features: {
      eyebrow: "Features",
      title: "Four things, done properly",
      items: [
        {
          title: "Save from any app",
          body: "The share extension takes links, text and images. One tap from Safari, Mail, or wherever you were reading, and it's in.",
        },
        {
          title: "On-device intelligence",
          body: "Apple Intelligence summarises and files every item. No account, no API key, no network call — the app has nowhere to send your data.",
        },
        {
          title: "Semantic search",
          body: "Search by what you remember, not the exact words. Literal matches come first and related ones below, never blended together.",
        },
        {
          title: "Tags that earn their place",
          body: "Tags are derived from the content and counted. The ones that appear on a single item never clutter the filter bar.",
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
    pricing: {
      eyebrow: "Pricing",
      title: "Free to save. Pro to go deeper.",
      note: "Prices in USD. Download ThreadVault for free on the App Store.",
      soon: "Coming soon",
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
          cta: "Coming soon",
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
    footer: {
      tagline: "A vault that understands what you save, without sending it anywhere.",
      privacyTitle: "Privacy",
      privacyBody:
        "ThreadVault has no server, no accounts and no analytics. The only thing that leaves your iPhone is the request that fetches the page you shared.",
      contact: "Get in touch",
      rights: "Made in Puerto Rico.",
    },
  },
} as const;

export type Copy = (typeof copy)[Lang];
