"use client";

import { Input } from "@base-ui/react/input";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useEffect, useRef } from "react";

// Search box for the gallery. "/" focuses it from anywhere; Esc clears.
export default function Search({ value, onChange, placeholder = "Search" }) {
  const ref = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t instanceof HTMLElement && t.closest("input, textarea, [contenteditable]")) {
        return;
      }
      e.preventDefault();
      ref.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative flex w-full items-center">
      <IconSearch
        size={14}
        className="pointer-events-none absolute left-2.5 text-dim"
        aria-hidden="true"
      />
      <Input
        ref={ref}
        type="search"
        value={value}
        onValueChange={onChange}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onChange("");
            e.currentTarget.blur();
          }
        }}
        placeholder={placeholder}
        aria-label="Search logos"
        autoComplete="off"
        spellCheck={false}
        className="h-8 w-full border border-line bg-transparent pr-8 pl-8 font-mono text-[13px] text-fg placeholder:text-dim focus:border-fg focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
            ref.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute right-2 flex h-5 w-5 cursor-pointer items-center justify-center text-dim hover:text-fg"
        >
          <IconX size={12} />
        </button>
      ) : (
        <kbd
          className="pointer-events-none absolute right-2 hidden h-5 items-center border border-line px-1 font-mono text-[10px] text-dim sm:flex"
        >
          /
        </kbd>
      )}
    </div>
  );
}
