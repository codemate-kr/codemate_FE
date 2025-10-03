import { apiClient, type ApiResponse } from './client';

export interface CreateTeamRequest {
  name: string;
  description?: string;
}

export interface CreateTeamResponse {
  id: number;
  name: string;
  description?: string;
  leaderId: number;
  createdAt: string;
}


export type TeamRole = 'LEADER' | 'MEMBER';

export interface TeamMemberResponse {
  memberId: number;
  handle: string;
  email: string;
  role: TeamRole;
  isMe: boolean;
}

// 백엔드 API 스펙에 따른 타입 정의
export type RecommendationDayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type ProblemDifficultyPreset = 'EASY' | 'NORMAL' | 'HARD' | 'CUSTOM';

// solved.ac 티어 시스템 (Bronze5 = 1, ..., Platinum5 = 20)
export type SolvedacTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

export interface DifficultyRange {
  minTier: SolvedacTier;
  maxTier: SolvedacTier;
}

// 요청 DTO 타입 (백엔드 API 스펙에 맞춤)
export interface TeamRecommendationSettingsRequest {
  recommendationDays: RecommendationDayOfWeek[];
  problemDifficultyPreset?: ProblemDifficultyPreset;
  customMinLevel?: number;
  customMaxLevel?: number;
}

// 응답 DTO 타입 (백엔드 API 스펙에 맞춤)
export interface TeamRecommendationSettingsResponse {
  teamId: number;
  teamName: string;
  isActive: boolean;
  recommendationDays: RecommendationDayOfWeek[];
  recommendationDayNames: string[];
  problemDifficultyPreset?: ProblemDifficultyPreset;
  difficultyDisplayName?: string;
  customMinLevel?: number;
  customMaxLevel?: number;
}

// 하위 호환성을 위한 타입 alias
export type DifficultyPreset = ProblemDifficultyPreset;

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
}

export interface InviteMemberRequest {
  email: string;
}

export interface MyTeamResponse {
  teamId: number;
  teamName: string;
  teamDescription: string;
  myRole: TeamRole;
  memberCount: number;
  isRecommendationActive: boolean;
  createdAt: string;
}

export const teamsApi = {
  create: async (data: CreateTeamRequest): Promise<CreateTeamResponse> => {
    const response = await apiClient.post<ApiResponse<CreateTeamResponse>>('/teams', data);
    return response.data.data;
  },

  getMyTeams: async (): Promise<MyTeamResponse[]> => {
    const response = await apiClient.get<ApiResponse<MyTeamResponse[]>>('/teams/my');
    return response.data.data;
  },

  getTeamMembers: async (teamId: number): Promise<TeamMemberResponse[]> => {
    const response = await apiClient.get<ApiResponse<TeamMemberResponse[]>>(`/teams/${teamId}/members`);
    return response.data.data;
  },

  getRecommendationSettings: async (teamId: number): Promise<TeamRecommendationSettingsResponse> => {
    const response = await apiClient.get<ApiResponse<TeamRecommendationSettingsResponse>>(`/teams/${teamId}/recommendation-settings`);
    return response.data.data;
  },

  updateRecommendationSettings: async (
    teamId: number,
    settings: TeamRecommendationSettingsRequest
  ): Promise<TeamRecommendationSettingsResponse> => {
    const response = await apiClient.put<ApiResponse<TeamRecommendationSettingsResponse>>(
      `/teams/${teamId}/recommendation-settings`,
      settings
    );
    return response.data.data;
  },

  disableRecommendation: async (teamId: number): Promise<TeamRecommendationSettingsResponse> => {
    const response = await apiClient.delete<ApiResponse<TeamRecommendationSettingsResponse>>(`/teams/${teamId}/recommendation-settings`);
    return response.data.data;
  },

  inviteMember: async (
    teamId: number,
    data: InviteMemberRequest
  ): Promise<void> => {
    await apiClient.post(`/teams/${teamId}/invite`, data);
  },

  removeMember: async (teamId: number, userId: number): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}/members/${userId}`);
  },

  leaveTeam: async (teamId: number): Promise<void> => {
    await apiClient.post(`/teams/${teamId}/leave`);
  },
};