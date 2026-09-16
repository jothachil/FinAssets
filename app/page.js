import { existsSync } from "node:fs";
import path from "node:path";
import Logo from "@/components/logo";
import Gallery from "@/components/gallery";
import MobileMenu from "@/components/mobile-menu";
import ThemeToggle from "@/components/theme-toggle";
import categories from "@/data/logos.json";

const label =
  "block px-4 pb-2 font-mono text-xs leading-none tracking-[0.01em] text-dim";
const rule = "border-t border-line";
const REQUEST_URL =
  "https://github.com/jothachil/finassets/issues/new?template=logo-request.yml";
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
    return {
      ...c,
      formats,
      items,
      total: items.length,
      done: items.filter((i) => i.done).length,
    };
  });
  const total = sections.reduce((n, c) => n + c.items.length, 0);
  const done = sections.reduce((n, c) => n + c.done, 0);

  return (
    <div className="grid min-h-screen grid-cols-[minmax(0.75rem,1fr)_minmax(0,1440px)_minmax(0.75rem,1fr)] sm:grid-cols-[minmax(1.5rem,1fr)_minmax(0,1440px)_minmax(1.5rem,1fr)]">
      <div className="bg-hatch" />
      <div className="border-x border-line">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-bg/90 px-4 py-5 backdrop-blur">
          <a href="/" aria-label="FinAssets home">
            <Logo height={26} />
          </a>
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden gap-6 text-sm text-muted sm:flex">
              {sections.map((c) => (
                <a key={c.id} href={`#${c.id}`} className="hover:text-fg">
                  {c.id}/
                </a>
              ))}
            </nav>
            <ThemeToggle />
            <div className="sm:hidden">
              <MobileMenu
                links={sections.map((c) => ({
                  href: `#${c.id}`,
                  label: `${c.id}/`,
                }))}
                actions={[
                  { href: "/download", label: "Download all logos" },
                  {
                    href: REQUEST_URL,
                    label: "Request a logo",
                    external: true,
                  },
                ]}
              />
            </div>
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
              href={REQUEST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border border-line px-4 py-2.5 text-sm font-medium text-muted hover:border-fg hover:text-fg"
            >
              Request a logo
            </a>
          </div>
        </section>

        <Gallery sections={sections} total={total} done={done} />

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
