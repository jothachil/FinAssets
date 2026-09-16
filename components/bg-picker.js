"use client";

import { useState } from "react";

// Six canvas backgrounds to preview logos against. "transparent" shows a
// checkerboard so the padding is visible.
const SWATCHES = [
  { name: "white", value: "#ffffff" },
  { name: "paper", value: "#f2f1ec" },
  { name: "slate", value: "#3a3a36" },
  { name: "black", value: "#0e0e0c" },
  {
    name: "transparent",
    value:
      "repeating-conic-gradient(#8a8a84 0% 25%, #c9c8c1 0% 50%) 50% / 16px 16px",
  },
];

export default function BgPicker() {
  const [active, setActive] = useState(SWATCHES[0]);

  function pick(swatch) {
    setActive(swatch);
    document.documentElement.style.setProperty("--symbol-bg", swatch.value);
  }

  return (
    <div className="flex items-center">
      <div className="flex gap-1.5">
        {SWATCHES.map((s) => (
          <button
            key={s.name}
            type="button"
            aria-pressed={s === active}
            aria-label={s.name}
            title={s.name}
            onClick={() => pick(s)}
            style={{ background: s.value }}
            className={`h-6 w-6 cursor-pointer border ${
              s === active
                ? "border-fg ring-1 ring-fg ring-offset-1 ring-offset-bg"
                : "border-line hover:border-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
