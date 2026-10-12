"use client";

import { useSport } from "@/context/SportContext";
import {
  advanceWinner,
  buildBracketFromTeams,
  visibleMatches,
} from "@/lib/bracket-utils";
import { MatchCard } from "./MatchCard";
import { Dices, Info, RefreshCw } from "lucide-react";

export function BracketView() {
  const { teams, bracket, persistBracket, config, hydrated } = useSport();

  const drawBrackets = () => {
    if (teams.length < 2) return;
    persistBracket(buildBracketFromTeams(teams));
  };

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-2xl bg-white/50" />;
  }

  if (teams.length < 2) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <Info className="mx-auto mb-2 h-8 w-8 text-amber-600" />
        <p className="font-medium text-amber-900">
          Χρειάζονται τουλάχιστον 2 ομάδες για κλήρωση ({config.emoji}{" "}
          {config.label}).
        </p>
        <p className="mt-1 text-sm text-amber-800">
          Καταχώρησε ομάδες στη σελίδα Δήλωση Ομάδας.
        </p>
      </div>
    );
  }

  const hasDraw = Boolean(bracket?.generatedAt && bracket.final);
  const qf = hasDraw ? visibleMatches(bracket!.quarterfinals) : [];
  const sf = hasDraw ? visibleMatches(bracket!.semifinals) : [];
  const finalMatch = hasDraw ? bracket!.final : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p className="text-sm text-slate-600">
          Πάτα <strong className="text-school-navy">Κλήρωση Brackets</strong> για
          να ζευγαρώσουν όλες οι τρέχουσες ομάδες με την πιο κοντινή μέση ηλικία.
          Bye στον 1ο γύρο βάζει την ομάδα μόνο στο επόμενο ματς. Κάθε επόμενη
          πρόκριση γίνεται μόνο με «Πρόκριση».
        </p>
        <button
          type="button"
          onClick={drawBrackets}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-school-orange px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-orange-600 active:scale-[0.99]"
        >
          {hasDraw ? (
            <RefreshCw className="h-4 w-4" />
          ) : (
            <Dices className="h-4 w-4" />
          )}
          Κλήρωση Brackets
        </button>
      </div>

      {!hasDraw && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
          <Dices className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-600">
            Δεν έχει γίνει κλήρωση ακόμα για {config.emoji} {config.label}.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {teams.length} ομάδες έτοιμες. Πάτα το κουμπί για να δημιουργηθεί το
            ταμπλό.
          </p>
        </div>
      )}

      {hasDraw && finalMatch && (
        <div className="overflow-x-auto pb-4">
          <div className="flex min-w-[720px] items-stretch justify-between gap-4">
            {qf.length > 0 && (
              <>
                <RoundColumn title="Προημιτελικοί">
                  {qf.map((m, i) => (
                    <MatchCard
                      key={m.id}
                      match={m}
                      teams={teams}
                      roundLabel={`Αγώνας ${i + 1}`}
                      onAdvance={(matchId, winnerId) =>
                        persistBracket(advanceWinner(bracket!, matchId, winnerId))
                      }
                    />
                  ))}
                </RoundColumn>
                <Connector />
              </>
            )}

            {sf.length > 0 && (
              <>
                <RoundColumn title="Ημιτελικοί">
                  {sf.map((m, i) => (
                    <MatchCard
                      key={m.id}
                      match={m}
                      teams={teams}
                      roundLabel={`Ημιτελικός ${i + 1}`}
                      onAdvance={(matchId, winnerId) =>
                        persistBracket(advanceWinner(bracket!, matchId, winnerId))
                      }
                    />
                  ))}
                </RoundColumn>
                <Connector />
              </>
            )}

            <RoundColumn title="Τελικός" narrow>
              <MatchCard
                match={finalMatch}
                teams={teams}
                roundLabel="Μεγάλος Τελικός"
                onAdvance={(matchId, winnerId) =>
                  persistBracket(advanceWinner(bracket!, matchId, winnerId))
                }
              />
              {finalMatch.winnerId && (
                <div className="mt-2 rounded-xl bg-gradient-to-r from-school-amber to-school-orange p-4 text-center shadow-md">
                  <p className="text-xs font-bold uppercase text-white/90">
                    Πρωταθλήτρια ομάδα
                  </p>
                  <p className="text-lg font-black text-white">
                    {teams.find((t) => t.id === finalMatch.winnerId)?.name}
                  </p>
                </div>
              )}
            </RoundColumn>
          </div>
        </div>
      )}
    </div>
  );
}

function RoundColumn({
  title,
  children,
  narrow,
}: {
  title: string;
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-3 ${narrow ? "w-52" : "w-56"}`}>
      <h3 className="text-center text-sm font-bold uppercase tracking-wide text-school-navy">
        {title}
      </h3>
      <div className="flex flex-1 flex-col justify-around gap-3">{children}</div>
    </div>
  );
}

function Connector() {
  return (
    <div className="hidden w-8 flex-col justify-center sm:flex" aria-hidden>
      <div className="h-full w-px bg-gradient-to-b from-transparent via-school-sky to-transparent" />
    </div>
  );
}
