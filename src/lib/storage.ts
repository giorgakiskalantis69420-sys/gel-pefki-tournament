import type { BracketState, Sport, Team } from "./types";
import { SPORT_CONFIG, SPORT_STORAGE_KEY } from "./types";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getTeams(sport: Sport): Team[] {
  return readJson<Team[]>(SPORT_CONFIG[sport].storageKey, []);
}

export function saveTeams(sport: Sport, teams: Team[]): void {
  writeJson(SPORT_CONFIG[sport].storageKey, teams);
}

export function getBracket(sport: Sport): BracketState | null {
  return readJson<BracketState | null>(SPORT_CONFIG[sport].bracketKey, null);
}

export function saveBracket(sport: Sport, bracket: BracketState): void {
  writeJson(SPORT_CONFIG[sport].bracketKey, bracket);
}

export function clearSportData(sport: Sport): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SPORT_CONFIG[sport].storageKey);
  localStorage.removeItem(SPORT_CONFIG[sport].bracketKey);
}

export function getStoredSport(): Sport | null {
  const v = readJson<string | null>(SPORT_STORAGE_KEY, null);
  if (v === "basketball" || v === "volleyball") return v;
  return null;
}

export function saveStoredSport(sport: Sport): void {
  writeJson(SPORT_STORAGE_KEY, sport);
}
