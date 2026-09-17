"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type TipState = {
  text: string;
  top: number;
  left: number;
  place: "top" | "bottom";
};

export default function GlobalActionTooltip() {
  const [tip, setTip] = useState<TipState | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const hide = () => setTip(null);

    const onPointerOver = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target || typeof target.closest !== "function") {
        hide();
        return;
      }

      const el = target.closest("[data-tooltip]") as HTMLElement | null;
      if (!el) {
        hide();
        return;
      }

      const text = el.getAttribute("data-tooltip")?.trim();
      if (!text) {
        hide();
        return;
      }

      const rect = el.getBoundingClientRect();
      const place: "top" | "bottom" = rect.top < 48 ? "bottom" : "top";
      setTip({
        text,
        top: place === "top" ? rect.top : rect.bottom,
        left: rect.left + rect.width / 2,
        place,
      });
    };

    document.addEventListener("pointerover", onPointerOver, true);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);

    return () => {
      document.removeEventListener("pointerover", onPointerOver, true);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, []);

  if (!mounted || !tip) return null;

  return createPortal(
    <div
      role="tooltip"
      style={{
        position: "fixed",
        top: tip.top,
        left: tip.left,
        transform:
          tip.place === "top"
            ? "translate(-50%, calc(-100% - 10px))"
            : "translate(-50%, 10px)",
        zIndex: 99999,
      }}
      className="pointer-events-none"
    >
      <div className="relative whitespace-nowrap rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-semibold tracking-wide text-black shadow-[0_8px_24px_rgba(28,36,52,0.14)] ring-1 ring-stroke dark:bg-boxdark dark:text-white dark:shadow-[0_10px_28px_rgba(0,0,0,0.45)] dark:ring-strokedark">
        <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-primary" />
        {tip.text}
        <span
          className={`absolute left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-white ring-1 ring-stroke dark:bg-boxdark dark:ring-strokedark ${
            tip.place === "top" ? "-bottom-1" : "-top-1"
          }`}
        />
      </div>
    </div>,
    document.body,
  );
}
