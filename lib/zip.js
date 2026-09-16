import { readFileSync } from "node:fs";
import path from "node:path";
import { zipSync } from "fflate";
import categories from "@/data/logos.json";

const publicDir = path.join(process.cwd(), "public");

// Collect every exported asset for the given categories as { zipPath: bytes }.
// Pending logos with no file yet are skipped.
export function collectFiles(cats) {
  const files = {};
  for (const c of cats) {
    for (const [format, template] of Object.entries(c.assets)) {
      for (const { slug } of c.items) {
        const href = template.replace("{slug}", slug);
        try {
          files[`${c.id}/${format}/${slug}.${format}`] = readFileSync(
            path.join(publicDir, href),
          );
        } catch {
          // no asset yet
        }
      }
    }
  }
  return files;
}

// PNGs are already compressed; store them and deflate the rest.
export function buildZip(files) {
  return zipSync(
    Object.fromEntries(
      Object.entries(files).map(([name, data]) => [
        name,
        [data, { level: name.endsWith(".png") ? 0 : 6 }],
      ]),
    ),
  );
}

export function zipResponse(bytes, filename) {
  return new Response(bytes, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

export { categories };
