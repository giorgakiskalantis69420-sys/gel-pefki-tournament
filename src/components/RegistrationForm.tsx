"use client";

import { useCallback, useEffect, useState } from "react";
import { useSport } from "@/context/SportContext";
import { SPORT_CONFIG, type Player, type Sport } from "@/lib/types";
import { generateId } from "@/lib/team-utils";
import { Toast } from "./Toast";
import { UserPlus } from "lucide-react";

type PlayerForm = { name: string; age: string };

const emptyPlayers = (count: number): PlayerForm[] =>
  Array.from({ length: count }, () => ({ name: "", age: "" }));

export function RegistrationForm() {
  const { sport, setSport, addTeam, config, hydrated, teams } = useSport();
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState<PlayerForm[]>(() =>
    emptyPlayers(SPORT_CONFIG.basketball.playerCount)
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setPlayers(emptyPlayers(config.playerCount));
    setErrors([]);
  }, [sport, config.playerCount]);

  const updatePlayer = (index: number, field: keyof PlayerForm, value: string) => {
    setPlayers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const validate = useCallback((): Player[] | null => {
    const errs: string[] = [];
    const trimmedName = teamName.trim();

    if (!trimmedName) {
      errs.push("Συμπλήρωσε το όνομα της ομάδας.");
    } else if (
      teams.some((t) => t.name.trim().toLowerCase() === trimmedName.toLowerCase())
    ) {
      errs.push("Υπάρχει ήδη ομάδα με αυτό το όνομα για το επιλεγμένο άθλημα.");
    }

    const parsed: Player[] = [];
    players.forEach((p, i) => {
      const n = p.name.trim();
      const ageNum = Number(p.age);
      if (!n) errs.push(`Όνομα παίκτη ${i + 1}: υποχρεωτικό πεδίο.`);
      if (p.age === "" || Number.isNaN(ageNum)) {
        errs.push(`Ηλικία παίκτη ${i + 1}: έγκυρος αριθμός.`);
      }
      if (n && !Number.isNaN(ageNum)) {
        parsed.push({ name: n, age: ageNum });
      }
    });

    if (parsed.length !== config.playerCount) {
      setErrors(errs.length ? errs : ["Συμπλήρωσε όλα τα πεδία."]);
      return null;
    }

    setErrors(errs);
    return errs.length === 0 ? parsed : null;
  }, [teamName, players, config.playerCount, teams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roster = validate();
    if (!roster) return;

    const ok = addTeam({
      id: generateId(),
      name: teamName.trim(),
      players: roster,
      createdAt: Date.now(),
    });

    if (!ok) {
      setErrors(["Υπάρχει ήδη ομάδα με αυτό το όνομα."]);
      return;
    }

    const savedName = teamName.trim();
    setTeamName("");
    setPlayers(emptyPlayers(config.playerCount));
    setToast(`Η ομάδα «${savedName}» καταχωρήθηκε επιτυχώς!`);
  };

  if (!hydrated) {
    return <div className="h-96 animate-pulse rounded-2xl bg-white/60" />;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-card backdrop-blur sm:p-8"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-school-navy sm:text-2xl">
            Δήλωση Ομάδας
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {config.emoji} {config.label} · ακριβώς {config.playerCount}{" "}
            παίκτες
          </p>
        </div>

        <fieldset className="mb-6">
          <legend className="mb-2 text-sm font-semibold text-school-navy">
            Άθλημα
          </legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SPORT_CONFIG) as Sport[]).map((key) => {
              const c = SPORT_CONFIG[key];
              const on = sport === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSport(key)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    on
                      ? "bg-school-blue text-white shadow"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="mb-6 block">
          <span className="mb-1.5 block text-sm font-semibold text-school-navy">
            Όνομα Ομάδας
          </span>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-school-navy outline-none ring-school-sky transition focus:ring-2"
            placeholder="π.χ. Οι Αετοί"
            maxLength={60}
          />
        </label>

        <div className="space-y-4">
          <p className="text-sm font-semibold text-school-navy">Ρόστερ</p>
          {players.map((p, i) => (
            <div
              key={i}
              className="grid gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_100px]"
            >
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">
                  Παίκτης {i + 1} — Όνομα
                </span>
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => updatePlayer(i, "name", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-school-sky"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">
                  Ηλικία
                </span>
                <input
                  type="number"
                  value={p.age}
                  onChange={(e) => updatePlayer(i, "age", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-school-sky"
                />
              </label>
            </div>
          ))}
        </div>

        {errors.length > 0 && (
          <ul className="mt-4 space-y-1 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {errors.map((err, i) => (
              <li key={i}>• {err}</li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-school-orange py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:bg-orange-600 active:scale-[0.99] sm:w-auto sm:px-10"
        >
          <UserPlus className="h-5 w-5" />
          Υποβολή Δήλωσης
        </button>
      </form>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}
