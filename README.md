# Two profiles

A static double profile for **Irvan Baihaqi** (IT Infrastructure Engineer) and
**Enrico Dwidhanto Indrawan** (Back End Developer), presented as two worlds
separated by a glowing diagonal rift.

- `/` — choose a profile; the seam leans toward whichever side the pointer is on
- `/irvan` — The Grid: neon, chamfered HUD, a shell session as résumé
- `/enrico` — The Green March: engraved codex, an API console as résumé

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

### Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, used for `metadataBase`, canonicals, OG image URLs, `sitemap.xml`, `robots.txt` and `llms-full.txt`. Set it in production (`https://your-domain`) or those files will point at `localhost:3000`. |

## Content rules

Every professional fact on these pages is transcribed from the subject's own
LinkedIn profile export (`docs/*.md`, exported ~2026-10). Nothing is inferred:
no tools, employers, projects or metrics beyond those documents, and durations
and "Present" end dates are as reported. Where the source is missing something
— Enrico's email, the dates of Irvan's vocational school — the page says so
rather than filling the gap.

The two worlds, their names, artwork and voice lines are invented presentation
and make no factual claim about either subject. `/llms.txt` and
`/llms-full.txt` state this explicitly for machine readers, since provenance is
what keeps an automated summary from embellishing.

## How it is put together

```
src/
  app/
    layout.tsx            fonts, metadata, WebSite JSON-LD, rift overlay
    page.tsx              the choose screen
    irvan/ enrico/        profile pages + per-route OG/Twitter images
    robots.ts sitemap.ts manifest.ts
    icon.svg icon.png apple-icon.png favicon.ico   (rasterised from icon.svg)
    llms-full.txt/route.ts  plain-text transcript of both profiles
  components/
    rift/                 WebGL field, seam line, transition, world sync
    story/                reveal/parallax primitives, chronicle rail, chapter spine
    role/                 role-native artefacts (shell session, JSON console, Go literal)
    worlds/               the two art scenes and sigils
    ui/                   shadcn primitives + the guarded Panel
  data/profiles.ts        the only source of truth for page content
  lib/seam.ts             the one seam equation, shared by shader and DOM
  lib/seo.tsx             metadata + schema.org builders
  lib/og.tsx              satori social cards (fonts vendored in lib/fonts)
```

### The seam is one equation

`lib/seam.ts` defines the boundary in screen space:

```
sin(θ)·(u − 0.5) + cos(θ)·(v − 0.5) = offset
```

The WebGL shader receives it as a uniform, the chooser's `clip-path` polygons
and the crisp `SeamLine` solve it in JS. That is why the glowing edge and the
world boundary never drift apart, even while scrolling moves the seam.

### Performance

The page is built to stay smooth on integrated graphics:

- the WebGL field rasterises below CSS resolution (≈0.55×) at 30 fps, with
  3-octave noise and one shard draw call;
- it measures real frame gaps and walks a quality ladder down on its own,
  ending at a slow drift plus `html[data-perf="low"]`, which also stops the art
  scenes' lamp/ember animations;
- no `backdrop-filter` anywhere, no full-screen blend modes;
- the art scenes pause their ~250 animated SVG nodes when out of view
  (`ArtGate`), and the heavy crossover block is skipped entirely off-screen
  (`content-visibility`);
- `prefers-reduced-motion` renders a single static field frame, drops the
  pinned filmstrip into a plain list, and skips the navigation wipe.

### SEO and machine readability

Server-rendered HTML for all content, per-route `opengraph-image`/`twitter-image`
(satori, 1200×630), `robots.txt` (explicitly allowing major AI crawlers),
`sitemap.xml` with image entries, a web manifest, four icon formats, and
schema.org `WebSite` + `ItemList` on `/` with `ProfilePage` + `Person` on each
profile (occupation, employer, skills, credentials, alumni).
