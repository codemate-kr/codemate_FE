import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  MyTeamResponse,
  TeamMemberResponse,
  TeamRecommendationSettingsResponse,
  CreateTeamRequest,
  CreateTeamResponse
} from '../api/teams';
import { teamsApi } from '../api/teams';

interface TeamDetailState {
  members: TeamMemberResponse[];
  settings: TeamRecommendationSettingsResponse | null;
}

type TeamDetailErrorType = 'not-found' | 'forbidden' | 'network' | 'unknown';

interface TeamDetailError {
  type: TeamDetailErrorType;
  message: string;
}

interface TeamStore {
  // 팀 목록 상태
  teams: MyTeamResponse[];
  teamsLoading: boolean;
  teamsError: string | null;
  teamsLastFetched: number | null; // 캐시 무효화를 위한 timestamp

  // 현재 팀 상세 상태
  currentTeamId: number | null;
  currentTeamDetails: TeamDetailState | null;
  detailLoading: boolean;
  detailError: TeamDetailError | null;

  // 팀 목록 Actions (내부용)
  setTeams: (teams: MyTeamResponse[]) => void;
  addTeam: (team: MyTeamResponse) => void;
  updateTeam: (teamId: number, updates: Partial<MyTeamResponse>) => void;
  removeTeam: (teamId: number) => void;
  setTeamsLoading: (loading: boolean) => void;
  setTeamsError: (error: string | null) => void;

  // 팀 목록 Actions (API 통합)
  fetchTeams: (options?: { forceRefresh?: boolean }) => Promise<void>;
  createTeam: (data: CreateTeamRequest) => Promise<CreateTeamResponse>;

  // 팀 상세 Actions (내부용)
  setCurrentTeamId: (teamId: number | null) => void;
  setCurrentTeamMembers: (members: TeamMemberResponse[]) => void;
  setCurrentTeamSettings: (settings: TeamRecommendationSettingsResponse | null) => void;
  updateTeamMember: (memberId: number, updates: Partial<TeamMemberResponse>) => void;
  removeMember: (memberId: number) => void;
  setDetailLoading: (loading: boolean) => void;
  setDetailError: (error: TeamDetailError | null) => void;

  // 팀 상세 Actions (API 통합)
  fetchTeamDetails: (teamId: number) => Promise<void>;
  refreshTeamSettings: (teamId: number) => Promise<void>;

  // 전체 초기화
  reset: () => void;
}

const initialState = {
  teams: [],
  teamsLoading: false,
  teamsError: null,
  teamsLastFetched: null,
  currentTeamId: null,
  currentTeamDetails: null,
  detailLoading: false,
  detailError: null,
};

// 캐시 유효 시간 (5분)
const CACHE_DURATION = 5 * 60 * 1000;

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 팀 목록 Actions (내부용)
      setTeams: (teams) => set({
        teams,
        teamsError: null,
        teamsLastFetched: Date.now()
      }),

      addTeam: (team) =>
        set((state) => ({
          teams: [...state.teams, team],
          teamsError: null
        })),

      updateTeam: (teamId, updates) =>
        set((state) => ({
          teams: state.teams.map((team) =>
            team.teamId === teamId ? { ...team, ...updates } : team
          ),
        })),

      removeTeam: (teamId) =>
        set((state) => ({
          teams: state.teams.filter((team) => team.teamId !== teamId),
          currentTeamId: state.currentTeamId === teamId ? null : state.currentTeamId,
          currentTeamDetails: state.currentTeamId === teamId ? null : state.currentTeamDetails,
        })),

      setTeamsLoading: (loading) => set({ teamsLoading: loading }),
      setTeamsError: (error) => set({ teamsError: error }),

      // 팀 목록 Actions (API 통합)
      fetchTeams: async (options = {}) => {
        const { forceRefresh = false } = options;
        const state = get();

        // 캐시 확인
        if (!forceRefresh && state.teamsLastFetched) {
          const cacheAge = Date.now() - state.teamsLastFetched;
          if (cacheAge < CACHE_DURATION && state.teams.length > 0) {
            return; // 캐시된 데이터 사용
          }
        }

        try {
          set({ teamsLoading: true, teamsError: null });
          const teams = await teamsApi.getMyTeams();
          set({
            teams,
            teamsError: null,
            teamsLastFetched: Date.now()
          });
        } catch (error) {
          console.error('팀 목록 로딩 실패:', error);
          set({ teamsError: '팀 목록을 불러오는데 실패했습니다.' });
        } finally {
          set({ teamsLoading: false });
        }
      },

      createTeam: async (data) => {
        try {
          await teamsApi.create(data);

          // 팀 생성 후 전체 팀 목록을 다시 가져옴 (새 팀의 ID 포함)
          await get().fetchTeams({ forceRefresh: true });

          // 방금 생성한 팀 찾기 (가장 최근에 생성된 팀 = createdAt이 가장 늦은 팀)
          const teams = get().teams;
          const sortedTeams = [...teams].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          const newTeam = sortedTeams[0];

          if (!newTeam) {
            throw new Error('생성된 팀을 찾을 수 없습니다.');
          }

          // 팀 상세 정보 로드 (멤버 정보 포함)
          await get().fetchTeamDetails(newTeam.teamId);

          return {
            id: newTeam.teamId,
            name: newTeam.teamName,
            description: newTeam.teamDescription,
            leaderId: 0, // 불필요하지만 타입 호환성을 위해
            createdAt: newTeam.createdAt,
          };
        } catch (error) {
          console.error('팀 생성 실패:', error);
          set({ teamsError: '팀 생성에 실패했습니다.' });
          throw error;
        }
      },

      // 팀 상세 Actions (내부용)
      setCurrentTeamId: (teamId) => set({
        currentTeamId: teamId,
        currentTeamDetails: teamId === null ? null : get().currentTeamDetails,
      }),

      setCurrentTeamMembers: (members) =>
        set((state) => ({
          currentTeamDetails: {
            members,
            settings: state.currentTeamDetails?.settings || null,
          },
          detailError: null,
        })),

      setCurrentTeamSettings: (settings) =>
        set((state) => ({
          currentTeamDetails: {
            members: state.currentTeamDetails?.members || [],
            settings,
          },
          detailError: null,
        })),

      updateTeamMember: (memberId, updates) =>
        set((state) => ({
          currentTeamDetails: state.currentTeamDetails ? {
            ...state.currentTeamDetails,
            members: state.currentTeamDetails.members.map((member) =>
              member.memberId === memberId ? { ...member, ...updates } : member
            ),
          } : null,
        })),

      removeMember: (memberId) =>
        set((state) => ({
          currentTeamDetails: state.currentTeamDetails ? {
            ...state.currentTeamDetails,
            members: state.currentTeamDetails.members.filter(
              (member) => member.memberId !== memberId
            ),
          } : null,
        })),

      setDetailLoading: (loading) => set({ detailLoading: loading }),
      setDetailError: (error: TeamDetailError | null) => set({ detailError: error }),

      // 팀 상세 Actions (API 통합)
      fetchTeamDetails: async (teamId) => {
        try {
          set({ detailLoading: true, detailError: null });

          // 병렬로 멤버와 설정 로드
          const [members, settings] = await Promise.all([
            teamsApi.getTeamMembers(teamId),
            teamsApi.getRecommendationSettings(teamId).catch(() => null),
          ]);

          set({
            currentTeamId: teamId,
            currentTeamDetails: { members, settings },
            detailError: null,
          });
        } catch (error: any) {
          console.error('팀 데이터 로딩 실패:', error);

          // HTTP 상태 코드에 따라 에러 타입 구분
          const status = error?.response?.status;
          let errorType: TeamDetailErrorType = 'unknown';
          let errorMessage = '팀 정보를 불러오는데 실패했습니다.';

          if (status === 404) {
            errorType = 'not-found';
            errorMessage = '존재하지 않는 스터디입니다.';
          } else if (status === 403) {
            errorType = 'forbidden';
            errorMessage = '비공개 스터디입니다. 멤버만 볼 수 있습니다.';
          } else if (!status || status >= 500) {
            errorType = 'network';
            errorMessage = '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          }

          set({
            detailError: {
              type: errorType,
              message: errorMessage,
            }
          });
        } finally {
          set({ detailLoading: false });
        }
      },

      refreshTeamSettings: async (teamId) => {
        try {
          const settings = await teamsApi.getRecommendationSettings(teamId);
          get().setCurrentTeamSettings(settings);
        } catch (error) {
          console.error('추천 설정 로딩 실패:', error);
        }
      },

      // 전체 초기화
      reset: () => set(initialState),
    }),
    {
      name: 'team-storage',
      partialize: (state) => ({
        teams: state.teams,
        teamsLastFetched: state.teamsLastFetched,
        currentTeamId: state.currentTeamId,
        // 상세 정보는 캐시하지 않음 (항상 최신 데이터 로드)
      }),
    }
  )
);

// Selector hooks (메모이제이션을 위한)
export const useTeams = () => useTeamStore((state) => state.teams);
export const useTeamsLoading = () => useTeamStore((state) => state.teamsLoading);
export const useTeamsError = () => useTeamStore((state) => state.teamsError);
export const useCurrentTeamDetails = () => useTeamStore((state) => state.currentTeamDetails);
export const useDetailLoading = () => useTeamStore((state) => state.detailLoading);
export const useDetailError = () => useTeamStore((state) => state.detailError);

// 타입 export
export type { TeamDetailError, TeamDetailErrorType };