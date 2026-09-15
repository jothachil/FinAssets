"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useEffect, useState } from "react";

const button =
  "inline-flex h-9 cursor-pointer items-center justify-center px-4 text-sm font-medium";

// Wraps a grid tile so clicking it opens a preview with download / copy actions.
export default function LogoDialog({ slug, name, files, size, transparent }) {
  const [copied, setCopied] = useState(false);
  const canvas = transparent ? "[background:var(--symbol-bg)]" : "";
  const fileName = `${slug}.svg`;

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  async function copySvg() {
    const svg = await fetch(files.svg).then((r) => r.text());
    await navigator.clipboard.writeText(svg);
    setCopied(true);
  }

  return (
    <Dialog.Root onOpenChange={(open) => !open && setCopied(false)}>
      <Dialog.Trigger
        className="block w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
        aria-label={`Preview ${name}`}
      >
        {/* biome-ignore lint/performance/noImgElement: static SVGs, nothing for next/image to optimize */}
        <img
          src={files.svg}
          width={size[0]}
          height={size[1]}
          alt={`${name} logo`}
          loading="lazy"
          className={`block aspect-square h-auto w-full ${canvas}`}
        />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-20 min-h-dvh bg-black/40 backdrop-blur-sm transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:bg-black/60" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-30 w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 border border-line bg-bg text-fg shadow-xl transition-[scale,opacity] duration-150 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
          <div className="flex flex-col sm:flex-row">
            {/* Preview */}
            <div className="flex shrink-0 items-center justify-center border-b border-line p-6 sm:w-64 sm:border-r sm:border-b-0">
              {/* biome-ignore lint/performance/noImgElement: static SVGs */}
              <img
                src={files.svg}
                width={size[0]}
                height={size[1]}
                alt=""
                className={`block aspect-square h-auto w-full max-w-52 border border-line ${canvas}`}
              />
            </div>

            {/* Details */}
            <div className="flex min-w-0 grow flex-col justify-between gap-6 p-6">
              <div className="flex flex-col gap-2">
                <Dialog.Title className="text-lg font-medium tracking-[-0.02em]">
                  {name}
                </Dialog.Title>
                <Dialog.Description className="truncate font-mono text-xs text-dim">
                  {fileName}
                </Dialog.Description>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={files.png}
                  download={`${slug}.png`}
                  className={`${button} bg-fg text-bg hover:bg-fg/90`}
                >
                  Download png
                </a>
                <button
                  type="button"
                  onClick={copySvg}
                  className={`${button} border border-line text-muted hover:border-fg hover:text-fg`}
                >
                  {copied ? "Copied" : "Copy svg"}
                </button>
              </div>
            </div>
          </div>

          <Dialog.Close
            aria-label="Close"
            className="absolute top-3 right-3 flex h-7 w-7 cursor-pointer items-center justify-center text-dim hover:text-fg"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <title>Close</title>
              <path
                d="M2 2l10 10M12 2L2 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
