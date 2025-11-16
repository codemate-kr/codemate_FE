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
export type SolvedacTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30;

export interface DifficultyRange {
  minTier: SolvedacTier;
  maxTier: SolvedacTier;
}

// 요청 DTO 타입 (백엔드 API 스펙에 맞춤)
export interface TeamRecommendationSettingsRequest {
  recommendationDays: RecommendationDayOfWeek[];
  problemDifficultyPreset?: ProblemDifficultyPreset;
  minProblemLevel?: number;
  maxProblemLevel?: number;
}

// 응답 DTO 타입 (백엔드 API 스펙에 맞춤)
export interface TeamRecommendationSettingsResponse {
  teamId: number;
  teamName: string;
  isActive: boolean;
  recommendationDays: RecommendationDayOfWeek[];
  problemDifficultyPreset?: ProblemDifficultyPreset;
  minProblemLevel?: number;
  maxProblemLevel?: number;
}

// 하위 호환성을 위한 타입 alias
export type DifficultyPreset = ProblemDifficultyPreset;

// 오늘의 문제 타입 정의
export interface TodayProblem {
  problemId: number;
  title: string;
  titleKo: string;
  level: number; // solved.ac 티어 레벨
  url: string;
  acceptedUserCount: number;
  averageTries: number;
  isSolved: boolean; // 로그인 사용자의 해결 여부
}

export interface TodayProblemsResponse {
  recommendationId: number;
  createdAt: string; // ISO 8601 날짜
  problems: TodayProblem[];
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
}

export interface InviteMemberRequest {
  memberId: number;
}

export interface InviteMemberResponse {
  teamMemberId: number;
  email: string;
  handle: string;
  teamName: string;
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
  ): Promise<InviteMemberResponse> => {
    const response = await apiClient.post<ApiResponse<InviteMemberResponse>>(`/teams/${teamId}/invite`, data);
    return response.data.data;
  },

  removeMember: async (teamId: number, userId: number): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}/members/${userId}`);
  },

  leaveTeam: async (teamId: number): Promise<void> => {
    await apiClient.post(`/teams/${teamId}/leaveTeam`);
  },

  deleteTeam: async (teamId: number): Promise<void> => {
    await apiClient.post(`/teams/${teamId}/deleteTeam`);
  },

  // 오늘의 문제 API - 로그인 시 해결 유무 정보 포함
  getTodayProblems: async (teamId: number): Promise<TodayProblemsResponse> => {
    const response = await apiClient.get<ApiResponse<TodayProblemsResponse>>(`/recommendation/team/${teamId}/today-problem`);
    return response.data.data;
  },

  refreshTodayProblems: async (teamId: number): Promise<TodayProblemsResponse> => {
    const response = await apiClient.post<ApiResponse<TodayProblemsResponse>>(`/recommendation/team/${teamId}/today-problem/refresh`);
    return response.data.data;
  },
};