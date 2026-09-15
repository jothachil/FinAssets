import { existsSync } from "node:fs";
import path from "node:path";
import categories from "@/data/logos.json";
import BgPicker from "./bg-picker";

const label =
  "block px-4 pb-2 font-mono text-xs leading-none tracking-[0.01em] text-dim";
const rule = "border-t border-line";
const grid =
  "grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-px border-b border-line bg-line";

// Tailwind needs static class names, so map the category's size to a ratio class.
const aspect = ([w, h]) => (w === h ? "aspect-square" : "aspect-[3/2]");

// Category asset templates ("/cards/{slug}.svg") → public URL / disk path.
const url = (template, slug) => template.replace("{slug}", slug);
const onDisk = (href) => existsSync(path.join(process.cwd(), "public", href));

export default function Home() {
  const sections = categories.map((c) => {
    const formats = Object.keys(c.assets);
    const items = c.items.map((i) => {
      const files = Object.fromEntries(
        formats.map((f) => [f, url(c.assets[f], i.slug)]),
      );
      // A logo is "done" once its SVG actually exists under public/.
      return { ...i, files, done: onDisk(files.svg) };
    });
    return { ...c, formats, items, done: items.filter((i) => i.done).length };
  });
  const total = sections.reduce((n, c) => n + c.items.length, 0);
  const done = sections.reduce((n, c) => n + c.done, 0);

  return (
    <div className="grid min-h-screen grid-cols-[minmax(1.5rem,1fr)_minmax(0,1280px)_minmax(1.5rem,1fr)]">
      <div className="bg-hatch" />
      <div className="border-x border-line">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg/90 px-4 py-5 backdrop-blur">
          <span className="font-bold tracking-[-0.02em]">fin-logos</span>
          <nav className="flex gap-6 text-sm text-muted">
            {sections.map((c) => (
              <a key={c.id} href={`#${c.id}`} className="hover:text-fg">
                {c.id}/
              </a>
            ))}
          </nav>
        </header>

        <section className="pt-24">
          <span className={label}>
            {done} logos · {sections.length} categories · svg + png
          </span>
          <div className={rule} />
          <h1 className="px-4 pt-2 pb-4 text-[clamp(2rem,5vw,4rem)] leading-[1] font-medium tracking-[-0.035em] text-balance">
            Every Indian fintech logo, one place.
          </h1>
          <div className={rule} />
          <p className="max-w-[60ch] px-4 pt-2 pb-6 text-lg text-muted [&_code]:font-mono [&_code]:text-[0.95em] [&_code]:text-accent">
            Banks, card networks and UPI apps. Bank and app symbols are trimmed,
            centred and exported as <code>svg</code> and <code>png</code> on a
            300×300 canvas with identical padding; card marks ship as 120×80
            badges.
          </p>
          <div className="px-4 pb-8">
            <a
              href="/download"
              download="fin-logos.zip"
              className="inline-flex items-center gap-3 bg-fg px-4 py-2.5 text-sm font-medium text-bg hover:bg-fg/90"
            >
              Download all logos
              <span className="font-mono text-xs font-normal opacity-60">
                {done} logos · svg + png · zip
              </span>
            </a>
          </div>
        </section>

        <div className="flex items-center justify-between gap-4 border-y border-line px-4 py-5">
          <BgPicker />
          <span className="font-mono text-[13px] text-dim">
            {done} / {total}
          </span>
        </div>

        <main>
          {sections.map((c) => (
            <section key={c.id} id={c.id} className="scroll-mt-16">
              <div className="flex items-baseline justify-between gap-4 px-4 pt-10 ">
                <h2 className="text-xl font-medium tracking-[-0.02em]">
                  {c.name}
                </h2>
                <span className="font-mono text-[13px] text-dim">
                  {c.done} / {c.items.length}
                </span>
              </div>
              <p className="px-4 pb-4 text-sm text-muted">{c.description}</p>

              {/* 1px gaps painted with the line colour so every cell is ruled */}
              <div className={grid}>
                {c.items.map(({ slug, name, files, done }) => (
                  <figure key={slug} className="bg-bg p-5">
                    {done ? (
                      // biome-ignore lint/performance/noImgElement: static SVGs, nothing for next/image to optimize
                      <img
                        src={files.svg}
                        width={c.size[0]}
                        height={c.size[1]}
                        alt={`${name} logo`}
                        loading="lazy"
                        className={`block h-auto w-full ${aspect(c.size)} ${c.transparent ? "bg-(--symbol-bg)" : ""}`}
                      />
                    ) : (
                      <div
                        className={`flex w-full items-center justify-center border border-dashed border-line font-mono text-xs text-dim ${aspect(c.size)}`}
                      >
                        pending
                      </div>
                    )}
                    <figcaption className="mt-4 flex flex-col gap-[0.35rem]">
                      <strong className="text-sm font-medium tracking-[-0.01em]">
                        {name}
                      </strong>
                      <span className="flex items-baseline justify-between font-mono text-xs text-dim">
                        <code>{slug}</code>
                        {done ? (
                          <span className="flex gap-3">
                            {c.formats.map((f) => (
                              <a
                                key={f}
                                href={files[f]}
                                className="hover:text-accent"
                              >
                                {f}
                              </a>
                            ))}
                          </span>
                        ) : (
                          <span>—</span>
                        )}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ))}
        </main>

        <footer className="px-4 pt-8 pb-16 font-mono text-xs text-dim">
          bank symbols exported by scripts/export-symbols.mjs
        </footer>
      </div>
      <div className="bg-hatch" />
    </div>
  );
}
