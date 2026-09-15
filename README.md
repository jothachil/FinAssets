# fin-logos

Clean, consistent logos for every Indian bank, card network and UPI app. Free to use, available as `svg` and `png`.

Every logo is trimmed, centred and exported on a 300×300 transparent canvas with 30px padding, so any two line up pixel for pixel.

| Category | Count | Path |
| --- | --- | --- |
| Banks | 41 | `public/symbols/{svg,png}/<slug>.*` |
| Card networks | 11 | `public/cards/{svg,png}/<slug>.*` |
| UPI & payment apps | 67 | `public/upi/{svg,png}/<slug>.*` |

The full set is also available as a single zip from the **Download all logos** button on the site (served from `/download`).

## Using the logos

Reference a logo by its category folder and slug. Slugs and display names live in [`data/logos.json`](data/logos.json).

```
/symbols/svg/sbin.svg        State Bank of India
/cards/svg/rupay.svg         RuPay
/upi/png/phonepe.png         PhonePe
```

Bank slugs follow the bank's SWIFT/IFSC prefix (`hdfc`, `icic`, `sbin`); card and UPI slugs are kebab-case names (`american-express`, `google-pay`).

## Development

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
bun run build     # production build (also prerenders the download zip)
bun run lint      # biome check
bun run format    # biome format --write
```

## Adding or updating logos

Source SVGs live under `assets/<category>/<slug>.svg`. The export script rasterises each one at high density, trims transparent margins, fits it inside the padded box, and writes both a PNG and a wrapped SVG so the two match exactly.

1. Drop the source SVG into `assets/cards/` or `assets/upi/` using the slug as the filename.
2. Add `{ "slug", "name" }` to the matching category in `data/logos.json`.
3. Regenerate the exports:

   ```bash
   bun run export          # cards + upi
   bun run export:cards
   bun run export:upi
   ```

   Or target any folder directly:

   ```bash
   node scripts/export-symbols.mjs --in <dir> --out <dir> [--size 300] [--padding 30]
   ```

Bank symbols come pre-exported from [praveenpuglia/indian-banks](https://github.com/praveenpuglia/indian-banks) and are checked in under `public/symbols/`.

A logo listed in `logos.json` with no file under `public/` shows as *pending* on the site and is left out of the zip, so it's safe to add entries ahead of the artwork.

## Project layout

```
app/
  page.js               gallery, built from data/logos.json
  bg-picker.js          client-side canvas colour picker
  download/route.js     static zip of every exported logo
assets/                 source SVGs (cards, upi)
data/logos.json         categories, slugs, names, asset paths
public/                 exported svg + png per category
scripts/
  export-symbols.mjs    trim → fit → centre exporter
```

Built with Next.js and Tailwind CSS.

## License

[MIT](LICENSE) for the packaging and export work in this repository. Logos and trademarks remain the property of their respective owners and are provided for identification purposes only.

Made by [John Thachil](https://johnthachil.com).
