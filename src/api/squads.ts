import { apiClient, type ApiResponse } from './client';
import type {
  TeamMemberResponse,
  TodayProblemsResponse,
  RecommendationDayOfWeek,
  ProblemDifficultyPreset,
  TeamRecommendationSettingsRequest,
} from './teams';

export interface SquadRecommendationSettingsResponse {
  squadId: number;
  squadName: string;
  isActive: boolean;
  recommendationDays: RecommendationDayOfWeek[];
  problemDifficultyPreset?: ProblemDifficultyPreset;
  minProblemLevel?: number;
  maxProblemLevel?: number;
  problemCount?: number;
  includeTags?: string[];
}

export interface SquadResponse {
  squadId: number;
  squadName: string;
  teamId: number;
  isDefault: boolean;
  memberCount: number;
  members: TeamMemberResponse[];
  recommendationSettings: SquadRecommendationSettingsResponse | null;
  todayProblems: TodayProblemsResponse | null;
}

export interface CreateSquadRequest {
  name: string;
}

export interface UpdateMemberSquadRequest {
  squadId: number;
}

// 스쿼드 추천 설정 요청 타입 (팀 설정과 동일한 구조)
export type SquadRecommendationSettingsRequest = TeamRecommendationSettingsRequest;

type RawSquadResponse = Partial<SquadResponse> & {
  name?: string;
  recommendationSetting?: SquadRecommendationSettingsResponse | null;
  settings?: SquadRecommendationSettingsResponse | null;
  todayProblem?: TodayProblemsResponse | null;
};

const normalizeSquad = (squad: RawSquadResponse): SquadResponse => {
  const members = Array.isArray(squad.members) ? squad.members : [];
  const normalizedName = squad.squadName ?? squad.name ?? '이름 없음';
  const normalizedRecommendationSettings =
    squad.recommendationSettings ?? squad.recommendationSetting ?? squad.settings ?? null;
  const normalizedTodayProblems = squad.todayProblems ?? squad.todayProblem ?? null;

  return {
    ...squad,
    squadId: Number(squad.squadId ?? 0),
    squadName: normalizedName,
    teamId: Number(squad.teamId ?? 0),
    isDefault: Boolean(squad.isDefault),
    members,
    memberCount: typeof squad.memberCount === 'number' ? squad.memberCount : members.length,
    recommendationSettings: normalizedRecommendationSettings,
    todayProblems: normalizedTodayProblems,
  };
};

export const squadsApi = {
  getTeamSquads: async (teamId: number): Promise<SquadResponse[]> => {
    const response = await apiClient.get<ApiResponse<SquadResponse[]>>(`/teams/${teamId}/squads`);
    return response.data.data.map((item) => normalizeSquad(item as RawSquadResponse));
  },

  createSquad: async (teamId: number, data: CreateSquadRequest): Promise<SquadResponse> => {
    const response = await apiClient.post<ApiResponse<SquadResponse>>(`/teams/${teamId}/squads`, data);
    return normalizeSquad(response.data.data as RawSquadResponse);
  },

  updateSquad: async (teamId: number, squadId: number, data: CreateSquadRequest): Promise<SquadResponse> => {
    const response = await apiClient.put<ApiResponse<SquadResponse>>(`/teams/${teamId}/squads/${squadId}`, data);
    return normalizeSquad(response.data.data as RawSquadResponse);
  },

  deleteSquad: async (teamId: number, squadId: number): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}/squads/${squadId}`);
  },

  // 멤버를 특정 스쿼드에 배정 (백엔드에서 기존 스쿼드 제거 처리)
  assignMember: async (teamId: number, squadId: number, memberId: number): Promise<void> => {
    const payload: UpdateMemberSquadRequest = { squadId };
    await apiClient.put(`/teams/${teamId}/members/${memberId}/squad`, payload);
  },

  removeMember: async (teamId: number, squadId: number, memberId: number): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}/squads/${squadId}/members/${memberId}`);
  },

  getRecommendationSettings: async (teamId: number, squadId: number): Promise<SquadRecommendationSettingsResponse> => {
    const response = await apiClient.get<ApiResponse<SquadRecommendationSettingsResponse>>(
      `/teams/${teamId}/squads/${squadId}/recommendation-settings`
    );
    return response.data.data;
  },

  updateRecommendationSettings: async (
    teamId: number,
    squadId: number,
    settings: SquadRecommendationSettingsRequest
  ): Promise<SquadRecommendationSettingsResponse> => {
    const response = await apiClient.put<ApiResponse<SquadRecommendationSettingsResponse>>(
      `/teams/${teamId}/squads/${squadId}/recommendation-settings`,
      settings
    );
    return response.data.data;
  },

  disableRecommendation: async (teamId: number, squadId: number): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}/squads/${squadId}/recommendation-settings`);
  },

  getTodayProblems: async (teamId: number, squadId: number): Promise<TodayProblemsResponse> => {
    const response = await apiClient.get<ApiResponse<TodayProblemsResponse>>(
      `/teams/${teamId}/squads/${squadId}/today-problems`
    );
    return response.data.data;
  },

  refreshProblems: async (teamId: number, squadId: number): Promise<TodayProblemsResponse> => {
    const response = await apiClient.post<ApiResponse<TodayProblemsResponse>>(
      `/teams/${teamId}/squads/${squadId}/today-problems/refresh`
    );
    return response.data.data;
  },

  // 스쿼드 수동 추천 생성 - 팀장 전용
  createManualRecommendation: async (teamId: number, squadId: number): Promise<TodayProblemsResponse> => {
    const response = await apiClient.post<ApiResponse<TodayProblemsResponse>>(
      `/recommendation/team/${teamId}/squad/${squadId}/manual`
    );
    return response.data.data;
  },
};
