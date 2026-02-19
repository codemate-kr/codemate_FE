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

// 스쿼드 추천 설정 요청 타입 (팀 설정과 동일한 구조)
export type SquadRecommendationSettingsRequest = TeamRecommendationSettingsRequest;

export const squadsApi = {
  getTeamSquads: async (teamId: number): Promise<SquadResponse[]> => {
    const response = await apiClient.get<ApiResponse<SquadResponse[]>>(`/teams/${teamId}/squads`);
    return response.data.data;
  },

  createSquad: async (teamId: number, data: CreateSquadRequest): Promise<SquadResponse> => {
    const response = await apiClient.post<ApiResponse<SquadResponse>>(`/teams/${teamId}/squads`, data);
    return response.data.data;
  },

  updateSquad: async (teamId: number, squadId: number, data: CreateSquadRequest): Promise<SquadResponse> => {
    const response = await apiClient.put<ApiResponse<SquadResponse>>(`/teams/${teamId}/squads/${squadId}`, data);
    return response.data.data;
  },

  deleteSquad: async (teamId: number, squadId: number): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}/squads/${squadId}`);
  },

  // 멤버를 특정 스쿼드에 배정 (백엔드에서 기존 스쿼드 제거 처리)
  assignMember: async (teamId: number, squadId: number, memberId: number): Promise<void> => {
    await apiClient.post(`/teams/${teamId}/squads/${squadId}/members/${memberId}`);
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
};
