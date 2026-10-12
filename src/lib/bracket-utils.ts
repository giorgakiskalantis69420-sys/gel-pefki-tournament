import type { BracketMatch, BracketState, Team } from "./types";
import { sortTeamsByAverageAge, generateId } from "./team-utils";

function emptyMatch(): BracketMatch {
  return {
    id: generateId(),
    team1Id: null,
    team2Id: null,
    winnerId: null,
  };
}

function matchFromPair(team1: Team | undefined, team2: Team | undefined): BracketMatch {
  return {
    id: generateId(),
    team1Id: team1?.id ?? null,
    team2Id: team2?.id ?? null,
    winnerId: null,
  };
}

function isEmptyMatch(match: BracketMatch): boolean {
  return !match.team1Id && !match.team2Id && !match.winnerId;
}

function adjacentPairs(sorted: Team[]): BracketMatch[] {
  const matches: BracketMatch[] = [];
  for (let i = 0; i < sorted.length; i += 2) {
    matches.push(matchFromPair(sorted[i], sorted[i + 1]));
  }
  return matches;
}

function cloneBracket(bracket: BracketState): BracketState {
  return {
    ...bracket,
    quarterfinals: bracket.quarterfinals.map((m) => ({ ...m })),
    semifinals: bracket.semifinals.map((m) => ({ ...m })),
    final: bracket.final ? { ...bracket.final } : null,
  };
}

function soloTeamId(match: BracketMatch): string | null {
  if (match.team1Id && !match.team2Id) return match.team1Id;
  if (!match.team1Id && match.team2Id) return match.team2Id;
  return null;
}

/** Place a winner into the next round slot only — never mark that next match as won. */
function placeInNextRound(
  bracket: BracketState,
  from: "quarterfinals" | "semifinals",
  matchIndex: number,
  winnerId: string
): void {
  if (from === "quarterfinals" && bracket.semifinals.length > 0) {
    const sfIdx = Math.min(Math.floor(matchIndex / 2), bracket.semifinals.length - 1);
    const slot = matchIndex % 2 === 0 ? "team1Id" : "team2Id";
    const sf = bracket.semifinals[sfIdx];
    sf[slot] = winnerId;
    if (sf.winnerId && sf.winnerId !== sf.team1Id && sf.winnerId !== sf.team2Id) {
      sf.winnerId = null;
    }
    return;
  }

  if (from === "semifinals" && bracket.final) {
    const slot = matchIndex === 0 ? "team1Id" : "team2Id";
    bracket.final[slot] = winnerId;
    if (
      bracket.final.winnerId &&
      bracket.final.winnerId !== bracket.final.team1Id &&
      bracket.final.winnerId !== bracket.final.team2Id
    ) {
      bracket.final.winnerId = null;
    }
  }
}

/** First-round byes only: fill the next slot. Do not auto-win later rounds or the final. */
function applyFirstRoundByes(bracket: BracketState): BracketState {
  const next = cloneBracket(bracket);

  if (next.quarterfinals.length > 0) {
    next.quarterfinals.forEach((match, i) => {
      const byeId = soloTeamId(match);
      if (!byeId || match.winnerId) return;
      match.winnerId = byeId;
      placeInNextRound(next, "quarterfinals", i, byeId);
    });
    return next;
  }

  next.semifinals.forEach((match, i) => {
    const byeId = soloTeamId(match);
    if (!byeId || match.winnerId) return;
    match.winnerId = byeId;
    placeInNextRound(next, "semifinals", i, byeId);
  });

  return next;
}

export function buildBracketFromTeams(teams: Team[]): BracketState {
  const sorted = sortTeamsByAverageAge(teams);
  const n = sorted.length;

  let quarterfinals: BracketMatch[] = [];
  let semifinals: BracketMatch[] = [emptyMatch(), emptyMatch()];
  const final: BracketMatch = emptyMatch();

  if (n <= 2) {
    semifinals = [];
    final.team1Id = sorted[0]?.id ?? null;
    final.team2Id = sorted[1]?.id ?? null;
  } else if (n <= 4) {
    semifinals = adjacentPairs(sorted);
    while (semifinals.length < 2) semifinals.push(emptyMatch());
  } else {
    quarterfinals = adjacentPairs(sorted);
  }

  return applyFirstRoundByes({
    quarterfinals,
    semifinals,
    final,
    generatedAt: Date.now(),
    teamCount: n,
  });
}

export function advanceWinner(
  bracket: BracketState,
  matchId: string,
  winnerId: string
): BracketState {
  const next = cloneBracket(bracket);

  const qIdx = next.quarterfinals.findIndex((m) => m.id === matchId);
  if (qIdx >= 0) {
    next.quarterfinals[qIdx].winnerId = winnerId;
    placeInNextRound(next, "quarterfinals", qIdx, winnerId);
    return next;
  }

  const sfIdx = next.semifinals.findIndex((m) => m.id === matchId);
  if (sfIdx >= 0) {
    next.semifinals[sfIdx].winnerId = winnerId;
    placeInNextRound(next, "semifinals", sfIdx, winnerId);
    return next;
  }

  if (next.final?.id === matchId) {
    next.final.winnerId = winnerId;
  }

  return next;
}

export function getTeamName(teams: Team[], id: string | null): string {
  if (!id) return "—";
  return teams.find((t) => t.id === id)?.name ?? "—";
}

export function visibleMatches(matches: BracketMatch[]): BracketMatch[] {
  return matches.filter((m) => !isEmptyMatch(m));
}
