import { buildZip, categories, collectFiles, zipResponse } from "@/lib/zip";

// One zip per category, prerendered at build like the full bundle.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export async function GET(_request, { params }) {
  const { category } = await params;
  const cat = categories.find((c) => c.id === category);
  if (!cat) return new Response("Not found", { status: 404 });
  return zipResponse(
    buildZip(collectFiles([cat])),
    `finassets-${cat.id}.zip`,
  );
}
