import { create } from 'zustand';
import { teamJoinsApi, type TeamJoinResponse } from '../api/teamJoins';
import { useTeamStore } from './teamStore';

interface InvitationStore {
  // 상태
  invitations: TeamJoinResponse[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchInvitations: () => Promise<void>;
  acceptInvitation: (id: number) => Promise<void>;
  rejectInvitation: (id: number) => Promise<void>;
  removeInvitation: (id: number) => void;
  reset: () => void;
}

const initialState = {
  invitations: [],
  loading: false,
  error: null,
};

export const useInvitationStore = create<InvitationStore>((set, get) => ({
  ...initialState,

  fetchInvitations: async () => {
    try {
      set({ loading: true, error: null });
      const invitations = await teamJoinsApi.getReceivedInvitations();
      set({ invitations, error: null });
    } catch (error) {
      console.error('초대 목록 로딩 실패:', error);
      set({ error: '초대 목록을 불러오는데 실패했습니다.' });
    } finally {
      set({ loading: false });
    }
  },

  acceptInvitation: async (id: number) => {
    try {
      await teamJoinsApi.acceptInvitation(id);
      // 초대 목록에서 제거
      get().removeInvitation(id);
      // 팀 목록 갱신 (새로 가입한 팀 반영)
      await useTeamStore.getState().fetchTeams({ forceRefresh: true });
    } catch (error: any) {
      console.error('초대 수락 실패:', error);
      const errorMessage = error?.response?.data?.message || '초대 수락에 실패했습니다.';
      throw new Error(errorMessage);
    }
  },

  rejectInvitation: async (id: number) => {
    try {
      await teamJoinsApi.rejectInvitation(id);
      // 초대 목록에서 제거
      get().removeInvitation(id);
    } catch (error: any) {
      console.error('초대 거절 실패:', error);
      const errorMessage = error?.response?.data?.message || '초대 거절에 실패했습니다.';
      throw new Error(errorMessage);
    }
  },

  removeInvitation: (id: number) => {
    set((state) => ({
      invitations: state.invitations.filter((inv) => inv.id !== id),
    }));
  },

  reset: () => set(initialState),
}));

// Selector hooks
export const useInvitations = () => useInvitationStore((state) => state.invitations);
export const useInvitationsLoading = () => useInvitationStore((state) => state.loading);
