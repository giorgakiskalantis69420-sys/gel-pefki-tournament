"use client";

import type { Sport } from "@/lib/types";
import { SPORT_CONFIG } from "@/lib/types";
import { useSport } from "@/context/SportContext";

const options: Sport[] = ["basketball", "volleyball"];

export function SportSwitcher() {
  const { sport, setSport, hydrated } = useSport();

  if (!hydrated) {
    return (
      <div
        className="h-11 w-full max-w-md animate-pulse rounded-2xl bg-white/10 sm:w-80"
        aria-hidden
      />
    );
  }

  return (
    <div
      className="flex w-full max-w-md rounded-2xl border border-white/15 bg-school-blue/40 p-1 shadow-inner sm:w-auto"
      role="group"
      aria-label="Επιλογή αθλήματος"
    >
      {options.map((key) => {
        const cfg = SPORT_CONFIG[key];
        const selected = sport === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setSport(key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all sm:text-sm ${
              selected
                ? "bg-white text-school-navy shadow-md"
                : "text-white/90 hover:bg-white/10"
            }`}
            aria-pressed={selected}
          >
            <span aria-hidden>{cfg.emoji}</span>
            <span className="hidden min-[380px]:inline">{cfg.label}</span>
            <span className="min-[380px]:hidden">{key === "basketball" ? "3v3" : "4v4"}</span>
          </button>
        );
      })}
    </div>
  );
}
