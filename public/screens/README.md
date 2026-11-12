# Screenshots

Drop four WebP files here, named exactly: `classify.webp`, `tags.webp`, `search.webp`, `reader.webp`.
`ScreenshotFrame.astro` falls back to an inline placeholder for any name it does not find, so the
site builds fine without them; each real file replaces its placeholder automatically on the next build.

Capture on an iPhone 17 Pro Max (native 1320x2868), then scale to 640x1392 and encode:

```bash
sips -Z 1392 capture-classify.png --out /tmp/classify.png
cwebp -q 82 /tmp/classify.png -o public/screens/classify.webp
```

Each file shows the matching feature: `classify` (a saved link with its category and summary),
`tags` (the tag filter row over the card grid), `search` (a search query with results), `reader`
(the reading view). Files are 640x1392 WebP at quality 82; `ScreenshotFrame.astro` renders them at
that size with a 640/1392 aspect ratio.
