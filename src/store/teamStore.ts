import { create } from 'zustand';
import type { StudyTeam } from '../types';

interface TeamStore {
  teams: StudyTeam[];
  currentTeam: StudyTeam | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTeams: (teams: StudyTeam[]) => void;
  addTeam: (team: StudyTeam) => void;
  updateTeam: (teamId: string, updates: Partial<StudyTeam>) => void;
  removeTeam: (teamId: string) => void;
  setCurrentTeam: (team: StudyTeam | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  currentTeam: null,
  isLoading: false,
  error: null,

  setTeams: (teams) => set({ teams }),

  addTeam: (team) =>
    set((state) => ({ teams: [...state.teams, team] })),

  updateTeam: (teamId, updates) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId ? { ...team, ...updates } : team
      ),
      currentTeam:
        state.currentTeam?.id === teamId
          ? { ...state.currentTeam, ...updates }
          : state.currentTeam,
    })),

  removeTeam: (teamId) =>
    set((state) => ({
      teams: state.teams.filter((team) => team.id !== teamId),
      currentTeam:
        state.currentTeam?.id === teamId ? null : state.currentTeam,
    })),

  setCurrentTeam: (team) => set({ currentTeam: team }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));