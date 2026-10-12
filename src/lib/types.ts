export type Sport = "basketball" | "volleyball";

export interface Player {
  name: string;
  age: number;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  createdAt: number;
}

export interface BracketMatch {
  id: string;
  team1Id: string | null;
  team2Id: string | null;
  winnerId: string | null;
}

export interface BracketState {
  quarterfinals: BracketMatch[];
  semifinals: BracketMatch[];
  final: BracketMatch | null;
  generatedAt: number | null;
  teamCount: number;
}

export const SPORT_CONFIG = {
  basketball: {
    label: "Basketball 3v3",
    emoji: "🏀",
    playerCount: 3,
    storageKey: "tournoua-teams-basketball",
    bracketKey: "tournoua-bracket-basketball",
  },
  volleyball: {
    label: "Volleyball 4v4",
    emoji: "🏐",
    playerCount: 4,
    storageKey: "tournoua-teams-volleyball",
    bracketKey: "tournoua-bracket-volleyball",
  },
} as const;

export const SPORT_STORAGE_KEY = "tournoua-active-sport";
