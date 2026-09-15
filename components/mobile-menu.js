"use client";

import { IconMenu2, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// Hamburger menu for small screens: a dropdown that slides out under the
// sticky header. `links` are the category anchors; `actions` are extra
// entries (download, request) shown below a divider.
export default function MobileMenu({ links, actions = [] }) {
  const [open, setOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const item =
    "block px-4 py-3 text-sm text-muted hover:bg-line/40 hover:text-fg";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-6 w-6 cursor-pointer items-center justify-center border border-line text-muted hover:border-fg hover:text-fg"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "menu"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex"
          >
            {open ? <IconX size={14} /> : <IconMenu2 size={14} />}
          </motion.span>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-x-0 top-full overflow-hidden border-b border-line bg-bg"
          >
            <div className="flex flex-col py-2">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={item}
                >
                  {l.label}
                </a>
              ))}
              {actions.length > 0 && (
                <div className="mt-2 flex flex-col border-t border-line pt-2">
                  {actions.map((a) => (
                    <a
                      key={a.href}
                      href={a.href}
                      onClick={() => setOpen(false)}
                      {...(a.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={item}
                    >
                      {a.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
