"use client";

import type { BracketMatch, Team } from "@/lib/types";
import { getTeamName } from "@/lib/bracket-utils";
import { ChevronRight } from "lucide-react";

interface MatchCardProps {
  match: BracketMatch;
  teams: Team[];
  roundLabel: string;
  onAdvance: (matchId: string, winnerId: string) => void;
}

export function MatchCard({
  match,
  teams,
  roundLabel,
  onAdvance,
}: MatchCardProps) {
  const t1 = getTeamName(teams, match.team1Id);
  const t2 = getTeamName(teams, match.team2Id);
  const waiting = Boolean(
    (match.team1Id && !match.team2Id) || (!match.team1Id && match.team2Id)
  );
  const firstRoundBye = waiting && Boolean(match.winnerId);
  const canPickTeam1 = Boolean(match.team1Id && !match.winnerId);
  const canPickTeam2 = Boolean(match.team2Id && !match.winnerId);
  const waitingLabel = firstRoundBye
    ? "Bye — πέρασε στον επόμενο γύρο"
    : "Αναμονή αντιπάλου";

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm transition hover:shadow-md">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-school-blue">
        {roundLabel}
        {firstRoundBye ? " · Bye 1ου γύρου" : waiting && !match.winnerId ? " · Αναμονή" : ""}
      </p>
      <TeamRow
        name={!match.team1Id && waiting ? waitingLabel : t1}
        isWinner={match.winnerId === match.team1Id}
        canSelect={canPickTeam1}
        onSelect={() => match.team1Id && onAdvance(match.id, match.team1Id)}
        muted={!match.team1Id && waiting}
      />
      <div className="my-1 flex items-center justify-center">
        <span className="text-xs font-bold text-slate-300">VS</span>
      </div>
      <TeamRow
        name={!match.team2Id && waiting ? waitingLabel : t2}
        isWinner={match.winnerId === match.team2Id}
        canSelect={canPickTeam2}
        onSelect={() => match.team2Id && onAdvance(match.id, match.team2Id)}
        muted={!match.team2Id && waiting}
      />
      {match.winnerId && (
        <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-700">
          <ChevronRight className="h-3 w-3" />
          {firstRoundBye ? "Πέρασε στον επόμενο γύρο: " : "Προκρίθηκε: "}
          {getTeamName(teams, match.winnerId)}
        </p>
      )}
      {canPickTeam1 && canPickTeam2 && (
        <p className="mt-2 text-[10px] text-slate-500">
          Πάτα «Πρόκριση» δίπλα στην ομάδα νικητή
        </p>
      )}
      {(canPickTeam1 || canPickTeam2) && waiting && (
        <p className="mt-2 text-[10px] text-slate-500">
          Περίμενε αντίπαλο, ή πάτα «Πρόκριση» για να περάσει μόνο στον επόμενο γύρο
        </p>
      )}
    </div>
  );
}

function TeamRow({
  name,
  isWinner,
  canSelect,
  onSelect,
  muted,
}: {
  name: string;
  isWinner: boolean;
  canSelect: boolean;
  onSelect: () => void;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 ${
        isWinner ? "bg-emerald-50 ring-1 ring-emerald-200" : "bg-slate-50"
      } ${muted ? "opacity-60 italic" : ""}`}
    >
      <span
        className={`truncate text-sm font-medium ${
          isWinner ? "text-emerald-800" : "text-school-navy"
        }`}
      >
        {name}
      </span>
      {canSelect && (
        <button
          type="button"
          onClick={onSelect}
          className="shrink-0 rounded-lg bg-school-orange px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-orange-600 active:scale-95"
        >
          Πρόκριση
        </button>
      )}
    </div>
  );
}
