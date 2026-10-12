"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Users, ClipboardList } from "lucide-react";
import { SportSwitcher } from "./SportSwitcher";
import { SPORT_CONFIG, type Sport } from "@/lib/types";
import { useSport } from "@/context/SportContext";

const nav = [
  { href: "/", label: "Δήλωση Ομάδας", icon: ClipboardList },
  { href: "/brackets", label: "Κλήρωση & Brackets", icon: Trophy },
  { href: "/teams", label: "Ομάδες & Ρόστερ", icon: Users },
];

export function Header() {
  const pathname = usePathname();
  const { sport } = useSport();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-school-navy/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-school-sky">
              1ο ΓΕΛ Πεύκης
            </p>
            <h1 className="truncate text-lg font-bold text-white sm:text-xl">
              Σχολικό Τουρνουά
            </h1>
          </div>
          <SportSwitcher />
        </div>

        <nav
          className="mt-3 flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Κύρια πλοήγηση"
        >
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-school-orange text-white shadow-md"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="whitespace-nowrap">{label}</span>
              </Link>
            );
          })}
        </nav>

        <p className="mt-2 text-center text-xs text-slate-400 sm:text-right">
          Ενεργό: {SPORT_CONFIG[sport as Sport].emoji}{" "}
          {SPORT_CONFIG[sport as Sport].label}
        </p>
      </div>
    </header>
  );
}
