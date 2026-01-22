import { apiClient, type ApiResponse } from './client';

export interface CreateTeamRequest {
  name: string;
  description?: string;
  isPrivate?: boolean;
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
  minProblemLevel?: number | null;
  maxProblemLevel?: number | null;
  problemCount?: number; // 추천 문제 수 (1~10, 기본값 3)
  includeTags?: string[]; // 알고리즘 태그 키 배열
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
  problemCount?: number; // 추천 문제 수 (1~10, 기본값 3)
  includeTags?: string[]; // 알고리즘 태그 키 배열
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
  solvedTime?: string; // 해결 시간 (mm:ss 형식)
}

export interface TodayProblemsResponse {
  recommendationId: number;
  createdAt: string; // ISO 8601 날짜
  problems: TodayProblem[];
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  isPrivate?: boolean;
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
  isPrivate: boolean;
  createdAt: string;
}

// 팀 상세 통합 조회 응답
export interface TeamInfo {
  teamId: number;
  teamName: string;
  description: string;
  isPrivate: boolean;
  memberCount: number;
}

export interface TeamDetailResponse {
  team: TeamInfo;
  members: TeamMemberResponse[];
  recommendationSettings: TeamRecommendationSettingsResponse | null;
  todayProblem: TodayProblemsResponse | null;
}

// 공개 팀 목록 응답 타입
export interface PublicTeamResponse {
  teamId: number;
  teamName: string;
  description?: string;
  leaderHandle: string;
  memberCount: number;
  recommendationDays: RecommendationDayOfWeek[];
  minProblemLevel: number;
  maxProblemLevel: number;
}

// ============ 팀 활동 현황 API 타입 ============
export interface TeamActivityPeriod {
  days: number;
  startDate: string;
  endDate: string;
}

export interface TeamActivityMember {
  memberId: number;
  handle: string;
  rank: number;
  totalSolved: number;
}

export interface TeamActivityProblem {
  problemId: number;
  title: string;
  tier: number;
}

export interface TeamActivityMemberSolved {
  memberId: number;
  solved: Record<string, boolean>; // { "1001": true, "1002": false }
}

export interface TeamActivityDailyActivity {
  date: string;
  problems: TeamActivityProblem[];
  memberSolved: TeamActivityMemberSolved[];
}

export interface TeamActivityResponse {
  currentMemberId: number;
  period: TeamActivityPeriod;
  members: TeamActivityMember[];
  dailyActivities: TeamActivityDailyActivity[];
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

  // 팀 상세 통합 조회 (멤버, 설정, 오늘의 문제 포함)
  getTeamDetail: async (teamId: number): Promise<TeamDetailResponse> => {
    const response = await apiClient.get<ApiResponse<TeamDetailResponse>>(`/teams/${teamId}`);
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

  // 수동 추천 생성 - 팀장 전용
  createManualRecommendation: async (teamId: number): Promise<TodayProblemsResponse> => {
    const response = await apiClient.post<ApiResponse<TodayProblemsResponse>>(
      `/recommendation/team/${teamId}/manual`
    );
    return response.data.data;
  },

  // 공개 팀 목록 조회 (비로그인 가능)
  getPublicTeams: async (): Promise<PublicTeamResponse[]> => {
    const response = await apiClient.get<ApiResponse<PublicTeamResponse[]>>('/teams/public');
    return response.data.data;
  },

  // 팀 정보 수정 (팀장만 가능)
  updateTeam: async (teamId: number, data: UpdateTeamRequest): Promise<void> => {
    await apiClient.post(`/teams/${teamId}/updateInfo`, data);
  },

  // 팀 공개/비공개 설정 변경 (팀장만 가능) - deprecated: updateTeam 사용 권장
  updateVisibility: async (teamId: number, isPrivate: boolean): Promise<void> => {
    await apiClient.patch(`/teams/${teamId}/visibility`, { isPrivate });
  },

  // 팀 활동 현황 조회 (참여 현황 + 리더보드 통합)
  getTeamActivity: async (teamId: number, days: number = 30): Promise<TeamActivityResponse> => {
    const response = await apiClient.get<ApiResponse<TeamActivityResponse>>(
      `/teams/${teamId}/activity`,
      { params: { days } }
    );
    return response.data.data;
  },
};