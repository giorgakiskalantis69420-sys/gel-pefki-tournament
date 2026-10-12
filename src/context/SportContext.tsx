"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { BracketState, Sport, Team } from "@/lib/types";
import { SPORT_CONFIG } from "@/lib/types";
import {
  clearSportData,
  getBracket,
  getStoredSport,
  getTeams,
  saveBracket,
  saveStoredSport,
  saveTeams,
} from "@/lib/storage";

interface SportContextValue {
  sport: Sport;
  setSport: (sport: Sport) => void;
  teams: Team[];
  refreshTeams: () => void;
  addTeam: (team: Team) => boolean;
  removeTeam: (id: string) => void;
  clearAllTeams: () => void;
  bracket: BracketState | null;
  setBracket: (bracket: BracketState | null) => void;
  persistBracket: (bracket: BracketState) => void;
  config: (typeof SPORT_CONFIG)[Sport];
  hydrated: boolean;
}

const SportContext = createContext<SportContextValue | null>(null);

export function SportProvider({ children }: { children: React.ReactNode }) {
  const [sport, setSportState] = useState<Sport>("basketball");
  const [teams, setTeams] = useState<Team[]>([]);
  const [bracket, setBracketState] = useState<BracketState | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const config = SPORT_CONFIG[sport];

  const loadForSport = useCallback((s: Sport) => {
    setTeams(getTeams(s));
    setBracketState(getBracket(s));
  }, []);

  useEffect(() => {
    const stored = getStoredSport();
    const initial = stored ?? "basketball";
    setSportState(initial);
    loadForSport(initial);
    setHydrated(true);
  }, [loadForSport]);

  const setSport = useCallback(
    (s: Sport) => {
      setSportState(s);
      saveStoredSport(s);
      loadForSport(s);
    },
    [loadForSport]
  );

  const refreshTeams = useCallback(() => {
    setTeams(getTeams(sport));
  }, [sport]);

  const addTeam = useCallback(
    (team: Team) => {
      const current = getTeams(sport);
      if (current.some((t) => t.name.trim().toLowerCase() === team.name.trim().toLowerCase())) {
        return false;
      }
      const updated = [...current, team];
      saveTeams(sport, updated);
      setTeams(updated);
      return true;
    },
    [sport]
  );

  const removeTeam = useCallback(
    (id: string) => {
      const updated = getTeams(sport).filter((t) => t.id !== id);
      saveTeams(sport, updated);
      setTeams(updated);
    },
    [sport]
  );

  const clearAllTeams = useCallback(() => {
    clearSportData(sport);
    setTeams([]);
    setBracketState(null);
  }, [sport]);

  const persistBracket = useCallback(
    (b: BracketState) => {
      saveBracket(sport, b);
      setBracketState(b);
    },
    [sport]
  );

  const setBracket = useCallback((b: BracketState | null) => {
    setBracketState(b);
  }, []);

  const value = useMemo(
    () => ({
      sport,
      setSport,
      teams,
      refreshTeams,
      addTeam,
      removeTeam,
      clearAllTeams,
      bracket,
      setBracket,
      persistBracket,
      config,
      hydrated,
    }),
    [
      sport,
      setSport,
      teams,
      refreshTeams,
      addTeam,
      removeTeam,
      clearAllTeams,
      bracket,
      setBracket,
      persistBracket,
      config,
      hydrated,
    ]
  );

  return (
    <SportContext.Provider value={value}>{children}</SportContext.Provider>
  );
}

export function useSport() {
  const ctx = useContext(SportContext);
  if (!ctx) throw new Error("useSport must be used within SportProvider");
  return ctx;
}
