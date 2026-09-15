import { readFileSync } from "node:fs";
import path from "node:path";
import { zipSync } from "fflate";
import categories from "@/data/logos.json";

// Prerendered at build: the zip is generated once from public/ and served as
// a static file, so it always matches what the gallery lists.
export const dynamic = "force-static";

const publicDir = path.join(process.cwd(), "public");

export function GET() {
  const files = { "logos.json": readFileSync("data/logos.json") };

  for (const c of categories) {
    for (const [format, template] of Object.entries(c.assets)) {
      for (const { slug } of c.items) {
        const href = template.replace("{slug}", slug);
        try {
          files[`${c.id}/${format}/${slug}.${format}`] = readFileSync(
            path.join(publicDir, href),
          );
        } catch {
          // Pending logo with no asset yet — leave it out of the archive.
        }
      }
    }
  }

  // PNGs are already compressed; store them and deflate the rest.
  const zipped = zipSync(
    Object.fromEntries(
      Object.entries(files).map(([name, data]) => [
        name,
        [data, { level: name.endsWith(".png") ? 0 : 6 }],
      ]),
    ),
  );

  return new Response(zipped, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="fin-logos.zip"',
    },
  });
}
