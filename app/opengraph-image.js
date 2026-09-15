import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import categories from "@/data/logos.json";

export const alt = "FinAssets: Indian fintech logos, one place";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A representative spread across categories for the preview grid.
const FEATURED = [
  ["banks", "sbin"],
  ["banks", "hdfc"],
  ["banks", "icic"],
  ["cards", "visa"],
  ["banks", "kkbk"],
  ["cards", "mastercard"],
  ["cards", "rupay"],
  ["upi", "phonepe"],
  ["upi", "google-pay"],
  ["upi", "paytm"],
  ["upi", "bhim"],
  ["upi", "cred"],
];

const olive = {
  950: "#0e0e0c",
  800: "#3a3a36",
  500: "#8a8a7d",
  400: "#b0b0a4",
  50: "#fbfbf9",
};

// The wordmark's text is black in the file; recolour it for the dark card.
async function brandLogoDataUri() {
  const svg = await readFile(
    path.join(process.cwd(), "public", "logo.svg"),
    "utf8",
  );
  const light = svg
    .replace('fill="black"', `fill="${olive[50]}"`)
    .replace('viewBox="0 0 1920 528"', 'viewBox="146 83 1614 362"');
  return `data:image/svg+xml;base64,${Buffer.from(light).toString("base64")}`;
}

async function logoDataUri(categoryId, slug) {
  const c = categories.find((x) => x.id === categoryId);
  const href = c.assets.png.replace("{slug}", slug);
  const buf = await readFile(path.join(process.cwd(), "public", href));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

export default async function Image() {
  const total = categories.reduce((n, c) => n + c.items.length, 0);
  const [brand, ...logos] = await Promise.all([
    brandLogoDataUri(),
    ...FEATURED.map(([cat, slug]) => logoDataUri(cat, slug)),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: olive[950],
        color: olive[50],
        fontFamily: "sans-serif",
      }}
    >
      {/* Copy */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 640,
          padding: "56px 0 56px 64px",
        }}
      >
        <div style={{ display: "flex" }}>
          {/* biome-ignore lint/performance/noImgElement: satori renders plain <img> */}
          <img src={brand} height={40} width={40 * (1614 / 362)} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -2.5,
            }}
          >
            Indian fintech logos, one place.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              lineHeight: 1.4,
              color: olive[400],
            }}
          >
            Clean, consistent, ready to drop into your product. Free to use, in
            svg and png.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: olive[500],
            letterSpacing: 0.5,
          }}
        >
          {total} logos · {categories.length} categories · svg + png
        </div>
      </div>

      {/* Logo grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignContent: "center",
          gap: 12,
          width: 464,
          margin: "auto 64px auto auto",
        }}
      >
        {logos.map((src) => (
          <div
            key={src.slice(-32)}
            style={{
              display: "flex",
              width: 107,
              height: 107,
              background: "#ffffff",
              border: `1px solid ${olive[800]}`,
            }}
          >
            {/* biome-ignore lint/performance/noImgElement: satori renders plain <img>, next/image isn't available here */}
            <img src={src} width={107} height={107} alt="" />
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
