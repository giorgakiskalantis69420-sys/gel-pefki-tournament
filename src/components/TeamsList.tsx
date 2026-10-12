"use client";

import { useState } from "react";
import { useSport } from "@/context/SportContext";
import { averageAge } from "@/lib/team-utils";
import { ChevronDown, Trash2, Users } from "lucide-react";

export function TeamsList() {
  const { teams, config, removeTeam, clearAllTeams, hydrated } = useSport();
  const [openId, setOpenId] = useState<string | null>(null);

  const handleClearAll = () => {
    const ok = window.confirm(
      `Εκκαθάριση όλων των ομάδων για ${config.emoji} ${config.label}; Θα διαγραφούν και τα brackets αυτού του αθλήματος. Η ενέργεια δεν αναιρείται.`
    );
    if (!ok) return;
    clearAllTeams();
    setOpenId(null);
  };

  if (!hydrated) {
    return <div className="h-48 animate-pulse rounded-2xl bg-white/60" />;
  }

  if (teams.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
        <Users className="mx-auto mb-3 h-10 w-10 text-slate-300" />
        <p className="font-medium text-slate-600">
          Δεν υπάρχουν καταχωρημένες ομάδες για {config.emoji} {config.label}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleClearAll}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 shadow-sm transition hover:bg-red-600 hover:text-white hover:border-red-600"
      >
        <Trash2 className="h-4 w-4" />
        Εκκαθάριση Όλων των Ομάδων
      </button>
      {teams.map((team) => {
        const open = openId === team.id;
        const avg = averageAge(team.players);
        return (
          <article
            key={team.id}
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-card"
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : team.id)}
              className="flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-school-blue/10 text-lg">
                {config.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold text-school-navy">{team.name}</h3>
                <p className="text-xs text-slate-500">
                  Μέση ηλικία:{" "}
                  <span className="font-semibold text-school-blue">{avg}</span> ·{" "}
                  {team.players.length} παίκτες
                </p>
              </div>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-400 transition ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-4 sm:px-5">
                <ul className="space-y-2">
                  {team.players.map((p, i) => (
                    <li
                      key={i}
                      className="flex justify-between rounded-lg bg-white px-3 py-2 text-sm"
                    >
                      <span className="font-medium text-school-navy">{p.name}</span>
                      <span className="text-slate-500">{p.age} ετών</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        `Διαγραφή της ομάδας «${team.name}»; Η ενέργεια δεν αναιρείται.`
                      )
                    ) {
                      removeTeam(team.id);
                      if (openId === team.id) setOpenId(null);
                    }
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Διαγραφή ομάδας
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
