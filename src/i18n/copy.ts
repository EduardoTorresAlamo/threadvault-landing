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
      privacyPage: {
        title: "Privacidad: ThreadVault",
        description:
          "Lo que sale del teléfono, y lo que nunca sale. ThreadVault no tiene servidor, ni cuentas, ni analítica, ni publicidad.",
      },
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
        "Una petición HTTPS para descargar la página que compartiste, igual que hace un navegador. Solo HTTPS, sin cookies y con límites de tamaño; el sitio se entera de que alguien en tu IP la guardó.",
        "Una búsqueda oEmbed en TikTok, YouTube, Reddit o X cuando la página no trae vista previa propia. Sin token ni cuenta.",
        "Una petición HEAD al enlace corto para encontrar la publicación real detrás, siempre dentro del mismo dominio de la plataforma.",
        "Al abrir una publicación guardada, el reproductor de esa plataforma corre en una vista web aislada: cookies no persistentes, sin reproducción automática y un solo canal de mensajes hacia la app.",
        "Si activas la búsqueda semántica, una descarga única del modelo de Apple desde los servidores de Apple. Después, todo el cálculo es local.",
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
      privacyPage: {
        title: "Privacy: ThreadVault",
        description:
          "What leaves your phone, and what never does. ThreadVault has no server, no accounts, no analytics and no advertising.",
      },
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
        "One HTTPS request to fetch the page you shared, the same thing a browser does. HTTPS only, no cookies, size-capped; the site learns someone at your IP saved it.",
        "An oEmbed lookup on TikTok, YouTube, Reddit or X when the page ships no preview of its own. No token, no account.",
        "One HEAD request to the short link to find the real post behind it, always on the same platform's domain.",
        "Opening a saved post runs that platform's player in a sandboxed web view: non-persistent cookies, autoplay off, and one message channel back to the app.",
        "If you turn on semantic search, a one-time download of Apple's model from Apple's own servers. After that, every calculation stays local.",
      ],
      policyLink: "Read the full policy",
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
          badge: "Best value",
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
