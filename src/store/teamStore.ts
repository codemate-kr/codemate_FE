import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  MyTeamResponse,
  TeamMemberResponse,
  CreateTeamRequest,
  CreateTeamResponse,
  TeamInfo,
  TodayProblemsResponse,
  TeamDetailResponse,
} from '../api/teams';
import { teamsApi } from '../api/teams';
import { getApiErrorCode, getApiErrorMessage, getApiErrorStatus } from '../utils/apiError';

interface TeamDetailState {
  team: TeamInfo | null;
  members: TeamMemberResponse[];
  todayProblem: TodayProblemsResponse | null;
  squads: TeamDetailResponse['squads'];
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
  leaveTeam: (teamId: number) => Promise<void>;
  deleteTeam: (teamId: number) => Promise<void>;

  // 팀 상세 Actions (내부용)
  setCurrentTeamId: (teamId: number | null) => void;
  setCurrentTeamMembers: (members: TeamMemberResponse[]) => void;
  updateTeamMember: (memberId: number, updates: Partial<TeamMemberResponse>) => void;
  removeMember: (memberId: number) => void;
  setDetailLoading: (loading: boolean) => void;
  setDetailError: (error: TeamDetailError | null) => void;

  // 팀 상세 Actions (API 통합)
  fetchTeamDetails: (teamId: number, options?: { silent?: boolean }) => Promise<void>;

  // 스쿼드 Actions
  createSquad: (teamId: number, name: string) => Promise<void>;
  updateSquad: (teamId: number, squadId: number, name: string) => Promise<void>;
  deleteSquad: (teamId: number, squadId: number) => Promise<void>;
  assignMember: (teamId: number, squadId: number, memberId: number) => Promise<void>;
  refreshSquadSettings: (teamId: number, squadId: number) => Promise<void>;

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
          // 최신 팀이 먼저 나오도록 역순 정렬
          const sortedTeams = [...teams].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          set({
            teams: sortedTeams,
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
        } catch (error: unknown) {
          console.error('팀 생성 실패:', error);

          const errorMessage = getApiErrorMessage(error, '팀 생성에 실패했습니다.');
          set({ teamsError: errorMessage });

          // 에러 객체에 메시지 추가하여 throw
          throw new Error(errorMessage);
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
            team: state.currentTeamDetails?.team || null,
            members,
            todayProblem: state.currentTeamDetails?.todayProblem || null,
            squads: state.currentTeamDetails?.squads || [],
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
      fetchTeamDetails: async (teamId, options = {}) => {
        const { silent = false } = options;
        try {
          if (!silent) {
            set({ detailLoading: true, detailError: null });
          }

          // 통합 API로 모든 데이터 한번에 로드
          const detail = await teamsApi.getTeamDetail(teamId);

          set({
            currentTeamId: teamId,
            currentTeamDetails: {
              team: detail.team,
              members: detail.members,
              todayProblem: detail.todayProblem,
              squads: detail.squads ?? [],
            },
            detailError: null,
          });
        } catch (error: unknown) {
          console.error('팀 데이터 로딩 실패:', error);

          if (silent) {
            return;
          }

          // HTTP 상태 코드와 에러 코드에 따라 에러 타입 구분
          const status = getApiErrorStatus(error);
          const errorCode = getApiErrorCode(error);
          let errorType: TeamDetailErrorType = 'unknown';
          let errorMessage = '팀 정보를 불러오는데 실패했습니다.';

          if (status === 404 || errorCode === '3001') {
            errorType = 'not-found';
            errorMessage = '존재하지 않는 스터디입니다.';
          } else if (status === 403 || errorCode === '3005') {
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
          if (!silent) {
            set({ detailLoading: false });
          }
        }
      },

      // 팀 탈퇴 (MEMBER)
      leaveTeam: async (teamId) => {
        try {
          await teamsApi.leaveTeam(teamId);

          // 팀 목록에서 제거
          get().removeTeam(teamId);

          // 현재 보고 있던 팀이면 상세 정보도 초기화
          if (get().currentTeamId === teamId) {
            set({
              currentTeamId: null,
              currentTeamDetails: null,
            });
          }
        } catch (error: unknown) {
          console.error('팀 탈퇴 실패:', error);
          const errorMessage = getApiErrorMessage(error, '팀 탈퇴에 실패했습니다.');
          set({ teamsError: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // 팀 해산 (LEADER)
      deleteTeam: async (teamId) => {
        try {
          await teamsApi.deleteTeam(teamId);

          // 팀 목록에서 제거
          get().removeTeam(teamId);

          // 현재 보고 있던 팀이면 상세 정보도 초기화
          if (get().currentTeamId === teamId) {
            set({
              currentTeamId: null,
              currentTeamDetails: null,
            });
          }
        } catch (error: unknown) {
          console.error('팀 해산 실패:', error);
          const errorMessage = getApiErrorMessage(error, '팀 해산에 실패했습니다.');
          set({ teamsError: errorMessage });
          throw new Error(errorMessage);
        }
      },

      // 스쿼드 Actions (API 연동은 추후, 현재는 팀 상세 재조회로 동기화)
      createSquad: async (teamId: number, name: string) => {
        const { squadsApi } = await import('../api/squads');
        await squadsApi.createSquad(teamId, { name });
        await get().fetchTeamDetails(teamId);
      },

      updateSquad: async (teamId: number, squadId: number, name: string) => {
        const { squadsApi } = await import('../api/squads');
        await squadsApi.updateSquad(teamId, squadId, { name });
        await get().fetchTeamDetails(teamId);
      },

      deleteSquad: async (teamId: number, squadId: number) => {
        const { squadsApi } = await import('../api/squads');
        await squadsApi.deleteSquad(teamId, squadId);
        await get().fetchTeamDetails(teamId);
      },

      assignMember: async (teamId: number, squadId: number, memberId: number) => {
        const { squadsApi } = await import('../api/squads');
        await squadsApi.assignMember(teamId, squadId, memberId);
        await get().fetchTeamDetails(teamId);
      },

      refreshSquadSettings: async (teamId: number, squadId: number) => {
        const { squadsApi } = await import('../api/squads');
        const latestSettings = await squadsApi.getRecommendationSettings(teamId, squadId);
        set((state) => {
          if (!state.currentTeamDetails) return state;
          return {
            currentTeamDetails: {
              ...state.currentTeamDetails,
              squads: (state.currentTeamDetails.squads ?? []).map((squad) => {
                if (squad.squadId !== squadId) return squad;
                return {
                  ...squad,
                  recommendationSettings: latestSettings,
                };
              }),
            },
          };
        });
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
