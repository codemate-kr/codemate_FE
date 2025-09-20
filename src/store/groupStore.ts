import { create } from 'zustand';
import type { StudyGroup } from '../types';

interface GroupStore {
  groups: StudyGroup[];
  currentGroup: StudyGroup | null;
  isLoading: boolean;
  error: string | null;

  setGroups: (groups: StudyGroup[]) => void;
  addGroup: (group: StudyGroup) => void;
  updateGroup: (groupId: string, updates: Partial<StudyGroup>) => void;
  removeGroup: (groupId: string) => void;
  setCurrentGroup: (group: StudyGroup | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  currentGroup: null,
  isLoading: false,
  error: null,

  setGroups: (groups) => set({ groups }),

  addGroup: (group) =>
    set((state) => ({ groups: [...state.groups, group] })),

  updateGroup: (groupId, updates) =>
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === groupId ? { ...group, ...updates } : group
      ),
      currentGroup:
        state.currentGroup?.id === groupId
          ? { ...state.currentGroup, ...updates }
          : state.currentGroup,
    })),

  removeGroup: (groupId) =>
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== groupId),
      currentGroup:
        state.currentGroup?.id === groupId ? null : state.currentGroup,
    })),

  setCurrentGroup: (group) => set({ currentGroup: group }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));