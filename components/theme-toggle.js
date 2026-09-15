"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // The theme isn't known until the client mounts; render a placeholder
  // until then so server and client markup match.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dark = resolvedTheme === "dark";
  const label = mounted ? (dark ? "light" : "dark") : "theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={`Switch to ${label} theme`}
      title={`Switch to ${label} theme`}
      className="flex h-6 w-6 cursor-pointer items-center justify-center border border-line text-muted hover:border-fg hover:text-fg"
    >
      {mounted && dark ? <IconSun size={14} /> : <IconMoon size={14} />}
    </button>
  );
}
