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

export interface TeamRecommendationSettingsRequest {
  recommendationDays: string[];
}

export interface TeamRecommendationSettingsResponse {
  teamId: number;
  teamName: string;
  recommendationDays: string[];
  recommendationDayNames: string[];
  isActive: boolean;
}

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