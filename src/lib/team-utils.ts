import type { Player, Team } from "./types";

export function averageAge(players: Player[]): number {
  if (players.length === 0) return 0;
  const sum = players.reduce((acc, p) => acc + p.age, 0);
  return Math.round((sum / players.length) * 10) / 10;
}

export function sortTeamsByAverageAge(teams: Team[]): Team[] {
  return [...teams].sort((a, b) => averageAge(a.players) - averageAge(b.players));
}

export function pairTeamsByClosestAge(teams: Team[]): [Team, Team | null][] {
  const sorted = sortTeamsByAverageAge(teams);
  const pairs: [Team, Team | null][] = [];
  for (let i = 0; i < sorted.length; i += 2) {
    pairs.push([sorted[i], sorted[i + 1] ?? null]);
  }
  return pairs;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
