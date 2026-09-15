import { existsSync } from "node:fs";
import path from "node:path";
import categories from "@/data/logos.json";
import BgPicker from "./bg-picker";
import ThemeToggle from "./theme-toggle";

const label =
  "block px-4 pb-2 font-mono text-xs leading-none tracking-[0.01em] text-dim";
const rule = "border-t border-line";
const grid =
  "grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] gap-px border-y border-line bg-line";

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
    <div className="grid min-h-screen grid-cols-[minmax(1.5rem,1fr)_minmax(0,1440px)_minmax(1.5rem,1fr)]">
      <div className="bg-hatch" />
      <div className="border-x border-line">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg/90 px-4 py-5 backdrop-blur">
          <span className="font-bold tracking-[-0.02em]">FinAssets</span>
          <div className="flex items-center gap-6">
            <nav className="flex gap-6 text-sm text-muted">
              {sections.map((c) => (
                <a key={c.id} href={`#${c.id}`} className="hover:text-fg">
                  {c.id}/
                </a>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </header>

        <section className="pt-24">
          <span className={label}>
            {done} logos · {sections.length} categories · svg + png
          </span>
          <div className={rule} />
          <h1 className="px-4 pt-2 pb-4 text-[clamp(2rem,5vw,4rem)] leading-[1] font-medium tracking-[-0.035em] text-balance">
            Indian fintech logos, one place.
          </h1>
          <div className={rule} />
          <p className="max-w-[60ch] px-4 pt-2 pb-6 text-lg text-muted [&_code]:font-mono [&_code]:text-[0.95em] [&_code]:text-accent">
            Clean, consistent logos for every Indian bank, card network and UPI
            app, ready to drop into your product. Free to use, available as{" "}
            <code>svg</code> and <code>png</code>.
          </p>
          <div className="flex flex-wrap items-center gap-3 px-4 pb-8">
            <a
              href="/download"
              download="finassets.zip"
              className="inline-flex items-center bg-fg px-4 py-2.5 text-sm font-medium text-bg hover:bg-fg/90"
            >
              Download all logos
            </a>
            <a
              href="https://github.com/jothachil/finassets/issues/new?template=logo-request.yml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border border-line px-4 py-2.5 text-sm font-medium text-muted hover:border-fg hover:text-fg"
            >
              Request a logo
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
                  <figure key={slug} className="bg-bg p-3">
                    {done ? (
                      // biome-ignore lint/performance/noImgElement: static SVGs, nothing for next/image to optimize
                      <img
                        src={files.svg}
                        width={c.size[0]}
                        height={c.size[1]}
                        alt={`${name} logo`}
                        loading="lazy"
                        className={`block h-auto w-full ${aspect(c.size)} ${c.transparent ? "[background:var(--symbol-bg)]" : ""}`}
                      />
                    ) : (
                      <div
                        className={`flex w-full items-center justify-center border border-dashed border-line font-mono text-xs text-dim ${aspect(c.size)}`}
                      >
                        pending
                      </div>
                    )}
                    <figcaption className="mt-3 flex flex-col gap-1">
                      <strong
                        title={name}
                        className="truncate text-xs font-medium tracking-[-0.01em]"
                      >
                        {name}
                      </strong>
                      <span className="flex items-baseline justify-between gap-2 font-mono text-[11px] text-dim">
                        <code className="truncate">{slug}</code>
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

        <footer className="flex items-center justify-between gap-4 px-4 pt-8 pb-16 font-mono text-xs text-dim">
          <span>
            made by{" "}
            <a
              href="https://johnthachil.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-fg"
            >
              John Thachil
            </a>
          </span>
          <span className="flex gap-4">
            <a
              href="https://github.com/jothachil/finassets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-fg"
            >
              github
            </a>
            <a
              href="https://github.com/jothachil/finassets/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-fg"
            >
              MIT license
            </a>
          </span>
        </footer>
      </div>
      <div className="bg-hatch" />
    </div>
  );
}
