# Contributing

## Requesting a logo

Open a [logo request](https://github.com/jothachil/finassets/issues/new?template=logo-request.yml). Include the official website and, if you can find one, a link to an official SVG. That's usually all that's needed.

## Submitting a logo

1. Get the SVG from an official source (brand page, press kit, media assets). Avoid tracing or redrawing marks.
2. Pick a slug: lowercase, kebab-case, no suffixes (`google-pay`, not `googlepay-square`).
3. Save it as `assets/<category>/<slug>.svg`, where `<category>` is `banks`, `cards` or `upi`. It should have a transparent background; padding doesn't matter, the exporter trims it.
4. Add `{ "slug": "...", "name": "..." }` to the matching category in `data/logos.json`, keeping the list alphabetical by slug.
5. Run the exporter and check the result on the site:

   ```bash
   bun run export
   bun run dev
   ```

6. Commit the source SVG, the `logos.json` change, and the generated files under `public/<category>/`.
7. Open a pull request. The template has a short checklist.

Alternate marks (a wordmark vs. a symbol) go in as separate entries with an `-alt` suffix, like `visa` and `visa-alt`.

## Fixing a logo

If a logo is wrong, outdated, or mis-named, open an issue with the slug and what's off, or send a PR with the corrected source SVG. Re-run `bun run export` so the generated files stay in sync.
