# Screenshots

Drop four WebP files here, named exactly: `classify.webp`, `tags.webp`, `search.webp`, `reader.webp`.
`ScreenshotFrame.astro` falls back to an inline placeholder for any name it does not find, so the
site builds fine without them; each real file replaces its placeholder automatically on the next build.

Capture on an iPhone 17 Pro Max (native 1320x2868), then scale to 640x1392 and encode:

```bash
sips -Z 1392 capture-classify.png --out /tmp/classify.png
cwebp -q 82 /tmp/classify.png -o public/screens/classify.webp
```

See docs/superpowers/specs/2026-09-15-landing-redesign-design.md, section 6, for what each file
should show and the full size/quality rationale.
