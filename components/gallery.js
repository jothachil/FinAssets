"use client";

import { useMemo, useState } from "react";
import BgPicker from "@/components/bg-picker";
import LogoDialog from "@/components/logo-dialog";
import Search from "@/components/search";

const grid =
  "grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] gap-px border-y border-line bg-line";

// Tailwind needs static class names, so map the category's size to a ratio class.
const aspect = ([w, h]) => (w === h ? "aspect-square" : "aspect-[3/2]");

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// Sticky controls (background swatches, search, count) plus the category
// sections. Owns the search query so it can filter what the sections show.
export default function Gallery({ sections, total, done }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = normalize(query);
    if (!q) return sections;
    const terms = q.split(" ");
    return sections
      .map((c) => ({
        ...c,
        items: c.items.filter((i) => {
          const hay = `${normalize(i.name)} ${normalize(i.slug)} ${c.id}`;
          return terms.every((t) => hay.includes(t));
        }),
      }))
      .filter((c) => c.items.length > 0);
  }, [sections, query]);

  const shown = visible.reduce((n, c) => n + c.items.length, 0);

  return (
    <>
      <div className="sticky top-[65px] z-10 flex items-center justify-between gap-4 border-y border-line bg-bg/90 px-4 py-4 backdrop-blur">
        <div className="flex items-center gap-4 sm:gap-6">
          <Search value={query} onChange={setQuery} />
          <div className="hidden sm:block">
            <BgPicker />
          </div>
        </div>
        <span className="shrink-0 font-mono text-[13px] whitespace-nowrap text-dim">
          {query ? `${shown} / ${total}` : `${done} / ${total}`}
        </span>
      </div>

      <main>
        {visible.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-4 py-24 text-center">
            <p className="text-lg font-medium">No logos match “{query}”</p>
            <p className="text-sm text-muted">
              Try a shorter name or the slug, e.g. <code className="font-mono">sbin</code>.
            </p>
          </div>
        )}

        {visible.map((c) => (
          <section key={c.id} id={c.id} className="scroll-mt-32">
            <div className="flex items-baseline justify-between gap-4 px-4 pt-10">
              <h2 className="text-xl font-medium tracking-[-0.02em]">
                {c.name}
              </h2>
              <span className="flex items-baseline gap-4 font-mono text-[13px] whitespace-nowrap text-dim">
                <a
                  href={`/download/${c.id}`}
                  download={`finassets-${c.id}.zip`}
                  className="text-muted hover:text-fg"
                >
                  download zip
                </a>
                {query
                  ? `${c.items.length} / ${c.total}`
                  : `${c.done} / ${c.total}`}
              </span>
            </div>
            <p className="px-4 pb-4 text-sm text-muted">{c.description}</p>

            {/* 1px gaps painted with the line colour so every cell is ruled */}
            <div className={grid}>
              {c.items.map(({ slug, name, files, done }) => (
                <figure key={slug} className="bg-bg p-3">
                  {done ? (
                    <LogoDialog
                      slug={slug}
                      name={name}
                      category={c.id}
                      files={files}
                      size={c.size}
                      transparent={c.transparent}
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
    </>
  );
}
