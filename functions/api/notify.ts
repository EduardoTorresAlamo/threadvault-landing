// Cloudflare Pages Function. Deployed by `wrangler pages deploy dist`, which
// auto-detects this `functions/` directory at the repo root (independent of
// the `dist/` static output dir), see spec §5 for why no Astro adapter is
// needed.
//
// Minimal ambient types for the Pages Functions runtime, declared locally
// (rather than depending on `@cloudflare/workers-types`, which is not a
// project dependency) so this file type-checks under `astro check`/`tsc`.
// Wrangler supplies the real KV/Request/Response globals at request time;
// these are structural stand-ins for the type checker only.
interface KVNamespaceListKey {
  name: string;
}

interface KVNamespaceListResult {
  keys: KVNamespaceListKey[];
}

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  list(options?: { prefix?: string }): Promise<KVNamespaceListResult>;
}

interface Env {
  NOTIFY: KVNamespace;
}

interface PagesFunctionContext<E> {
  request: Request;
  env: E;
}

type PagesFunction<E = unknown> = (
  context: PagesFunctionContext<E>,
) => Response | Promise<Response>;

// Strict-enough email shape check plus a hard length cap (RFC 5321's 254
// octet limit for the whole address). HTML5 `<input type="email" required>`
// already covers real users with JS on or off; this branch is realistically
// bots/curl only, so it does not need to be a full RFC 5322 parser.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_MAX_LENGTH = 254;
const ALLOWED_RETURN_PATHS = new Set(["/", "/en/"]);
const RATE_LIMIT_PER_HOUR = 5;

// Content types this endpoint understands. Anything else (text/plain,
// multipart/form-data meant for a file upload, no header at all, etc.) is
// rejected before we even try to parse a body.
const JSON_CONTENT_TYPE = "application/json";
const FORM_CONTENT_TYPE = "application/x-www-form-urlencoded";

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

function isValidEmail(email: string): boolean {
  return email.length > 0 && email.length <= EMAIL_MAX_LENGTH && EMAIL_RE.test(email);
}

type Fields = { email: string; lang: string; company: string };

/**
 * Parses the request body for the two content types this endpoint accepts.
 * Returns `null` for anything else (unexpected/missing Content-Type), which
 * the caller treats as a 400/redirect, never by guessing at a shape.
 */
async function readFields(request: Request): Promise<Fields | null> {
  const contentType = (request.headers.get("Content-Type") ?? "").toLowerCase();

  if (contentType.includes(JSON_CONTENT_TYPE)) {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return null;
    }
    if (typeof body !== "object" || body === null) return null;
    const record = body as Record<string, unknown>;
    return {
      email: String(record.email ?? "").trim(),
      lang: String(record.lang ?? "es"),
      company: String(record.company ?? ""),
    };
  }

  if (contentType.includes(FORM_CONTENT_TYPE)) {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return null;
    }
    return {
      email: String(form.get("email") ?? "").trim(),
      lang: String(form.get("lang") ?? "es"),
      company: String(form.get("company") ?? ""),
    };
  }

  return null;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const json = isJsonRequest(request);
  const referer = request.headers.get("Referer");
  const returnPath = safeReturnPath(referer);

  const fields = await readFields(request);

  if (fields === null) {
    // Unexpected or missing Content-Type / unparsable body. Never reflect
    // the raw input back in the response.
    return json
      ? Response.json({ ok: false, error: "unsupported_content_type" }, { status: 400 })
      : Response.redirect(new URL(returnPath, request.url), 303);
  }

  const notifyLang = fields.lang === "en" ? "en" : "es";

  // Honeypot: pretend success, write nothing. A bot that filled this field
  // should not learn that its submission was rejected.
  if (fields.company.trim() !== "") {
    return json
      ? Response.json({ ok: true })
      : Response.redirect(
          new URL(notifyLang === "en" ? "/en/thanks/" : "/gracias/", request.url),
          303,
        );
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

  if (!isValidEmail(fields.email)) {
    return json
      ? Response.json({ ok: false, error: "invalid_email" }, { status: 400 })
      : Response.redirect(new URL(returnPath, request.url), 303);
  }

  await env.NOTIFY.put(rateLimitKey, String(currentCount + 1), { expirationTtl: 3600 });

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
  // Never console.log fields.email (or the record above) anywhere in this
  // file: KV is the only place the address is written.

  return json
    ? Response.json({ ok: true })
    : Response.redirect(
        new URL(notifyLang === "en" ? "/en/thanks/" : "/gracias/", request.url),
        303,
      );
};
