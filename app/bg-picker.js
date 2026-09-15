"use client";

import { useState } from "react";

const DEFAULT = "#ffffff";

export default function BgPicker() {
  const [value, setValue] = useState(DEFAULT);

  function onInput(e) {
    const next = e.target.value;
    setValue(next);
    document.documentElement.style.setProperty("--symbol-bg", next);
  }

  return (
    <label className="inline-flex items-center gap-[0.6rem] font-mono text-[13px] text-muted">
      symbol-bg{" "}
      <input
        type="color"
        id="bg"
        value={value}
        onInput={onInput}
        className="h-6 w-8 cursor-pointer rounded-none border border-line bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0"
      />{" "}
      <output htmlFor="bg" className="text-dim">
        {value}
      </output>
    </label>
  );
}
