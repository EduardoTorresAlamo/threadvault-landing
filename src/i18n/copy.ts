export const languages = { es: "Español", en: "English" } as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "es";

/** `/` is Spanish, `/en/` is English. */
export const pathFor = (lang: Lang) => (lang === "es" ? "/" : "/en/");

/*
 * Every feature claim below maps to code in the iOS app:
 *  - share sheet: links (web URL, or plain text that is a URL) and images
 *    (ThreadVaultShareExtension/ShareViewController.swift)
 *  - notes: typed in the app's add sheet (MainDashboard.swift) or spoken to
 *    Siri / Shortcuts (Intents/SaveToVaultIntent.swift, ThreadVaultShortcuts.swift)
 *  - summary / category / tags: Apple Intelligence via FoundationModels
 *    (Intelligence/AppleIntelligenceProvider.swift); images are described with
 *    Vision labels + OCR first (Intelligence/ImageDescriber.swift)
 *  - tag filter with counts, AND semantics, favourites (Views/TagFilterBar.swift)
 *  - literal search, optional semantic "related" results below exact matches
 *    (Views/MainDashboard.swift, Views/SemanticSearchSettings.swift)
 *  - Reader view for extracted article text (Views/ReaderView.swift)
 *  - inline embeds: YouTube, TikTok, Instagram, Threads, Reddit, X, Facebook
 *    (Utilities/EmbeddableMedia.swift)
 *  - "Rediscover" widget (ThreadVaultWidget/ThreadVaultWidget.swift)
 * Not in the app, so never claimed here: iCloud sync, Markdown export.
 */
export const copy = {
  es: {
    htmlLang: "es",
    meta: {
      title: "ThreadVault: Tu memoria digital",
      description:
        "Guarda enlaces, imágenes y notas desde cualquier app. ThreadVault los resume, los clasifica y los etiqueta en tu iPhone. Sin cuentas, sin servidores.",
      privacyPage: {
        title: "Privacidad: ThreadVault",
        description:
          "Lo que sale del teléfono, y lo que nunca sale. ThreadVault no tiene servidor, ni cuentas, ni analítica, ni publicidad.",
      },
    },
    nav: {
      features: "Funciones",
      how: "Cómo funciona",
      faq: "FAQ",
      skip: "Saltar al contenido",
      langLabel: "Idioma",
    },
    hero: {
      badge: "Clasificación en el dispositivo",
      titleLine1: "Tu memoria digital.",
      titleLine2: "Todo lo que guardas,",
      titleLine3: "entendido.",
      lede: "Compartes un enlace y se acabó tu trabajo. ThreadVault lee el contenido, escribe el resumen, elige la categoría y saca las etiquetas, con el modelo que ya vive en tu iPhone.",
      ctaPrimary: "Próximamente en el App Store",
      ctaSecondary: "Ver cómo funciona",
      footnote:
        "iOS 18 o superior. El resumen, la categoría y las etiquetas requieren Apple Intelligence (iOS 26 y un iPhone compatible).",
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
          body: "La hoja de compartir de iOS acepta enlaces e imágenes desde cualquier app. Las notas, desde ThreadVault o con Siri.",
        },
      ],
    },
    features: {
      eyebrow: "Funciones",
      title: "Cuatro cosas, hechas bien",
      illustrative: "Ilustración",
      items: [
        {
          title: "Resumen y categoría",
          body: "Apple Intelligence lee el contenido y escribe un resumen corto. Cada elemento cae en su categoría sin que tengas que elegirla.",
          screenshot: "classify",
        },
        {
          title: "Etiquetas y filtro",
          body: "Las etiquetas salen del contenido y se cuentan. Filtra el vault por una o varias a la vez, o quédate solo con tus favoritos, desde la barra de arriba.",
          screenshot: "tags",
        },
        {
          title: "Búsqueda, y semántica si la activas",
          body: "Busca por palabra exacta. Si activas la búsqueda semántica, los elementos relacionados aparecen debajo de las coincidencias literales, nunca mezclados.",
          screenshot: "search",
        },
        {
          title: "Lector y publicaciones incrustadas",
          body: "Abre un artículo en una vista de lectura sin distracciones, o mira el video o la publicación de YouTube, TikTok, Instagram, Threads, Reddit, X o Facebook sin salir de la app.",
          screenshot: "reader",
        },
      ],
      moreTitle: "Y además",
      more: [
        {
          title: "Widget Redescubre",
          body: "Un widget que va devolviendo a la vista lo que guardaste, a lo largo del día.",
        },
        {
          title: "Siri y Atajos",
          body: "Guarda un enlace o una nota sin abrir la app. ThreadVault lo clasifica y te dice la categoría.",
        },
        {
          title: "Capturas e imágenes",
          body: "Guarda una imagen y ThreadVault lee su texto y lo que muestra, en el dispositivo, para clasificarla.",
        },
      ],
    },
    how: {
      eyebrow: "Cómo funciona",
      title: "Un toque tuyo. El resto lo pone el teléfono.",
      steps: [
        {
          title: "Guarda",
          body: "Compartir → ThreadVault. Un enlace o una imagen, desde cualquier app de iOS. Las notas, desde la app o con Siri.",
        },
        {
          title: "Organiza",
          body: "El modelo del dispositivo lee el contenido, escribe un resumen corto y le asigna categoría y etiquetas.",
        },
        {
          title: "Encuentra",
          body: "Busca, filtra por etiqueta o por favoritos, o deja que el widget te devuelva lo que guardaste y olvidaste.",
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
        "Una petición HEAD al enlace corto para encontrar la publicación real detrás. Solo HTTPS, sin cookies.",
        "Al abrir una publicación guardada, el reproductor de esa plataforma corre en una vista web aislada: cookies no persistentes, sin reproducción automática y un solo canal de mensajes hacia la app.",
        "Si activas la búsqueda semántica, una descarga única del modelo de Apple desde los servidores de Apple. Después, todo el cálculo es local.",
      ],
      policyLink: "Lee la política completa",
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
          a: "No para la clasificación. La IA corre en el dispositivo. Lo que sale por la red está listado en la política de privacidad: sobre todo, la petición para descargar la página que compartiste.",
        },
        {
          q: "¿Qué necesito para la clasificación con IA?",
          a: "Un iPhone compatible con Apple Intelligence, iOS 26 y tenerla activada en Ajustes. Sin eso, ThreadVault sigue guardando, mostrando vistas previas y buscando por texto, pero sin resumen, categoría ni etiquetas.",
        },
        {
          q: "¿Qué puedo guardar?",
          a: "Enlaces e imágenes desde la hoja de compartir de iOS, y notas escritas en la app o dictadas a Siri.",
        },
        {
          q: "¿Habrá versión para Android?",
          a: "Está en desarrollo, con IA híbrida en el dispositivo, Gemini Nano y Gemma 4. Déjanos tu correo más abajo y te avisamos.",
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
        "Save links, images and notes from any app. ThreadVault summarises, files and tags them on your iPhone. No account, no server.",
      privacyPage: {
        title: "Privacy: ThreadVault",
        description:
          "What leaves your phone, and what never does. ThreadVault has no server, no accounts, no analytics and no advertising.",
      },
    },
    nav: {
      features: "Features",
      how: "How it works",
      faq: "FAQ",
      skip: "Skip to content",
      langLabel: "Language",
    },
    hero: {
      badge: "Classifies on device",
      titleLine1: "Your digital memory.",
      titleLine2: "Everything you save,",
      titleLine3: "understood.",
      lede: "Share a link and your work is done. ThreadVault reads the content, writes the summary, picks the category and pulls the tags, using the model already living on your iPhone.",
      ctaPrimary: "Coming soon to the App Store",
      ctaSecondary: "See how it works",
      footnote:
        "iOS 18 and later. Summary, category and tags require Apple Intelligence (iOS 26 and a supported iPhone).",
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
          body: "iOS's share sheet takes links and images from any app you're using. Notes, from ThreadVault itself or with Siri.",
        },
      ],
    },
    features: {
      eyebrow: "Features",
      title: "Four things, done properly",
      illustrative: "Illustration",
      items: [
        {
          title: "Summary and category",
          body: "Apple Intelligence reads the content and writes a short summary. Every item lands in its category without you choosing one.",
          screenshot: "classify",
        },
        {
          title: "Tags and filter",
          body: "Tags are pulled from the content and counted. Filter the vault by one or several at once, or keep only your favourites, from the bar up top.",
          screenshot: "tags",
        },
        {
          title: "Search, semantic if you turn it on",
          body: "Search by exact word. Turn on semantic search and related items appear below the literal matches, never blended in.",
          screenshot: "search",
        },
        {
          title: "Reader and embedded posts",
          body: "Open an article in a distraction-free reading view, or watch the YouTube, TikTok, Instagram, Threads, Reddit, X or Facebook video or post without leaving the app.",
          screenshot: "reader",
        },
      ],
      moreTitle: "And also",
      more: [
        {
          title: "Rediscover widget",
          body: "A widget that keeps bringing what you saved back into view as the day goes on.",
        },
        {
          title: "Siri and Shortcuts",
          body: "Save a link or a note without opening the app. ThreadVault classifies it and tells you the category.",
        },
        {
          title: "Screenshots and images",
          body: "Save an image and ThreadVault reads its text and what it shows, on device, to classify it.",
        },
      ],
    },
    how: {
      eyebrow: "How it works",
      title: "One tap from you. The phone does the rest.",
      steps: [
        {
          title: "Save",
          body: "Share → ThreadVault. A link or an image, from any iOS app. Notes, from the app or with Siri.",
        },
        {
          title: "Organise",
          body: "The on-device model reads the content, writes a short summary and assigns a category and tags.",
        },
        {
          title: "Find",
          body: "Search, filter by tag or favourites, or let the widget hand back something you saved and forgot.",
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
        "One HEAD request to the short link to find the real post behind it. HTTPS only, no cookies.",
        "Opening a saved post runs that platform's player in a sandboxed web view: non-persistent cookies, autoplay off, and one message channel back to the app.",
        "If you turn on semantic search, a one-time download of Apple's model from Apple's own servers. After that, every calculation stays local.",
      ],
      policyLink: "Read the full policy",
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
          a: "Not for classification. The AI runs on the device. What does go over the network is listed in the privacy policy: mainly, the request to fetch the page you shared.",
        },
        {
          q: "What do I need for AI classification?",
          a: "An iPhone that supports Apple Intelligence, iOS 26, and it turned on in Settings. Without that, ThreadVault still saves, shows previews and searches by text, just without a summary, category or tags.",
        },
        {
          q: "What can I save?",
          a: "Links and images from the iOS share sheet, and notes typed in the app or dictated to Siri.",
        },
        {
          q: "Will there be an Android version?",
          a: "It is in development, with hybrid on-device AI, Gemini Nano and Gemma 4. Leave your email below and we will let you know.",
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
