#!/usr/bin/env node
// Export every SVG in an input folder as a square symbol: trimmed, centred
// with fixed padding, written as both PNG and SVG. Same pipeline the bank
// symbols came from, so every category lines up pixel for pixel.
//
//   node scripts/export-symbols.mjs --in assets/upi --out public/upi
//
// Writes <out>/svg/<slug>.svg and <out>/png/<slug>.png for each <in>/<slug>.svg.
import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { parseArgs } from "node:util";
import sharp from "sharp";

const { values } = parseArgs({
  args: process.argv.slice(2).filter((a) => a !== "--"),
  options: {
    in: { type: "string", short: "i" },
    out: { type: "string", short: "o" },
    size: { type: "string", short: "s", default: "300" },
    padding: { type: "string", short: "p", default: "30" },
    help: { type: "boolean", short: "h", default: false },
  },
});

if (values.help || !values.in || !values.out) {
  console.log(`Export every SVG in a folder as a square symbol, centred with padding.

Usage: node scripts/export-symbols.mjs --in <dir> --out <dir> [options]

Options:
  -i, --in      <dir>  Folder of <slug>.svg sources (required)
  -o, --out     <dir>  Output folder; writes png/ and svg/ inside (required)
  -s, --size    <px>   Canvas width/height. Default: 300
  -p, --padding <px>   Transparent padding on each side. Default: 30
  -h, --help           Show this help
`);
  process.exit(values.help ? 0 : 1);
}

const size = Number.parseInt(values.size, 10);
const padding = Number.parseInt(values.padding, 10);
if (!Number.isInteger(size) || size <= 0) {
  console.error(`Invalid --size: ${values.size}`);
  process.exit(1);
}
if (!Number.isInteger(padding) || padding < 0 || padding * 2 >= size) {
  console.error(
    `Invalid --padding: ${values.padding} (must be >= 0 and < size / 2)`,
  );
  process.exit(1);
}

const inner = size - padding * 2;
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

const slugs = (await readdir(values.in))
  .filter((f) => f.endsWith(".svg"))
  .map((f) => basename(f, ".svg"))
  .sort();

const pngDir = join(values.out, "png");
const svgDir = join(values.out, "svg");
await Promise.all([
  mkdir(pngDir, { recursive: true }),
  mkdir(svgDir, { recursive: true }),
]);
console.log(
  `Exporting ${slugs.length} symbol(s) → ${size}x${size} PNG + SVG (padding ${padding}px) into ${values.out}/`,
);

let exported = 0;
const failures = [];

// Parse the source SVG's root element: its viewBox (falling back to
// width/height) and the root tag with sizing/positioning attributes removed
// so it can be re-used as a nested <svg>.
function parseRootSvg(source) {
  const body = source.replace(/<\?xml[^>]*\?>|<!DOCTYPE[^>]*>/gi, "").trim();
  const match = body.match(/^<svg\b([^>]*)>/i);
  if (!match) throw new Error("no <svg> root element found");
  const attrs = match[1];
  const attr = (name) =>
    attrs.match(new RegExp(`\\s${name}=["']([^"']*)["']`, "i"))?.[1];
  let viewBox = attr("viewBox")
    ?.trim()
    .split(/[\s,]+/)
    .map(Number);
  if (!viewBox || viewBox.length !== 4 || viewBox.some(Number.isNaN)) {
    const w = Number.parseFloat(attr("width"));
    const h = Number.parseFloat(attr("height"));
    if (!(w > 0 && h > 0)) throw new Error("no usable viewBox or width/height");
    viewBox = [0, 0, w, h];
  }
  const cleaned = attrs.replace(
    /\s(?:x|y|width|height|viewBox|preserveAspectRatio)=["'][^"']*["']/gi,
    "",
  );
  return {
    viewBox,
    open: `<svg${cleaned}`,
    inner: body.slice(match[0].length).replace(/<\/svg>\s*$/i, ""),
  };
}

await Promise.all(
  slugs.map(async (slug) => {
    const svg = join(values.in, `${slug}.svg`);
    const outPng = join(pngDir, `${slug}.png`);
    const outSvg = join(svgDir, `${slug}.svg`);
    try {
      await access(svg);
      // Render large, trim any transparent margin baked into the SVG so the
      // padding is consistent across symbols, then fit inside the inner box.
      const raster = await sharp(svg, { density: 600 })
        .png()
        .toBuffer({ resolveWithObject: true });
      const trimmed = await sharp(raster.data)
        .trim({ background: transparent, threshold: 1 })
        .png()
        .toBuffer({ resolveWithObject: true });
      const symbol = await sharp(trimmed.data)
        .resize(inner, inner, { fit: "inside", background: transparent })
        .png()
        .toBuffer();

      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: transparent,
        },
      })
        .composite([{ input: symbol, gravity: "centre" }])
        .png()
        .toFile(outPng);

      // SVG: map the trimmed raster bounds back into the source viewBox units
      // and nest the original drawing inside a fixed-size canvas. The nested
      // <svg> with xMidYMid meet handles the centring.
      const {
        viewBox,
        open,
        inner: drawing,
      } = parseRootSvg(await readFile(svg, "utf8"));
      const [vbX, vbY, vbW, vbH] = viewBox;
      const sx = vbW / raster.info.width;
      const sy = vbH / raster.info.height;
      const tight = [
        vbX - trimmed.info.trimOffsetLeft * sx,
        vbY - trimmed.info.trimOffsetTop * sy,
        trimmed.info.width * sx,
        trimmed.info.height * sy,
      ].map((n) => Number(n.toFixed(4)));
      await writeFile(
        outSvg,
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
          `${open} x="${padding}" y="${padding}" width="${inner}" height="${inner}" ` +
          `viewBox="${tight.join(" ")}" preserveAspectRatio="xMidYMid meet">${drawing}</svg></svg>\n`,
      );
      exported++;
    } catch (err) {
      failures.push({ slug, message: err.message });
    }
  }),
);

console.log(`✓ ${exported} exported`);

if (failures.length > 0) {
  console.error(`✗ ${failures.length} failed:`);
  for (const { slug, message } of failures) {
    console.error(`  ${slug}: ${message}`);
  }
  process.exit(1);
}
