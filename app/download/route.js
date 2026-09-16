import { readFileSync } from "node:fs";
import { buildZip, categories, collectFiles, zipResponse } from "@/lib/zip";

// Prerendered at build: the zip is generated once from public/ and served as
// a static file, so it always matches what the gallery lists.
export const dynamic = "force-static";

export function GET() {
  const files = {
    "logos.json": readFileSync("data/logos.json"),
    ...collectFiles(categories),
  };
  return zipResponse(buildZip(files), "finassets.zip");
}
