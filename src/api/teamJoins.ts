import { apiClient, type ApiResponse } from './client';

// 초대/가입 요청 타입
export type TeamJoinType = 'INVITATION' | 'APPLICATION';

// 요청 상태
export type TeamJoinStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED' | 'EXPIRED';

// 초대/가입 요청 응답
export interface TeamJoinResponse {
  id: number;
  teamId: number;
  teamName: string;
  type: TeamJoinType;
  requesterHandle: string;
  targetMemberHandle: string | null;
  status: TeamJoinStatus;
  expiresAt: string;
  createdAt: string;
}

// 초대 요청 (팀장 → 멤버)
export interface TeamJoinInviteRequest {
  teamId: number;
  targetMemberId: number;
}

export const teamJoinsApi = {
  // 받은 초대 목록 조회 (PENDING 상태만)
  getReceivedInvitations: async (): Promise<TeamJoinResponse[]> => {
    const response = await apiClient.get<ApiResponse<TeamJoinResponse[]>>('/team-joins/received');
    return response.data.data;
  },

  // 보낸 초대 목록 조회 (PENDING 상태만)
  getSentInvitations: async (): Promise<TeamJoinResponse[]> => {
    const response = await apiClient.get<ApiResponse<TeamJoinResponse[]>>('/team-joins/sent');
    return response.data.data;
  },

  // 초대 수락
  acceptInvitation: async (id: number): Promise<TeamJoinResponse> => {
    const response = await apiClient.post<ApiResponse<TeamJoinResponse>>(`/team-joins/${id}/accept`);
    return response.data.data;
  },

  // 초대 거절
  rejectInvitation: async (id: number): Promise<TeamJoinResponse> => {
    const response = await apiClient.post<ApiResponse<TeamJoinResponse>>(`/team-joins/${id}/reject`);
    return response.data.data;
  },

  // 초대 취소 (보낸 초대)
  cancelInvitation: async (id: number): Promise<TeamJoinResponse> => {
    const response = await apiClient.post<ApiResponse<TeamJoinResponse>>(`/team-joins/${id}/cancel`);
    return response.data.data;
  },

  // 멤버 초대 (팀장용)
  inviteMember: async (data: TeamJoinInviteRequest): Promise<TeamJoinResponse> => {
    const response = await apiClient.post<ApiResponse<TeamJoinResponse>>('/team-joins/invite', data);
    return response.data.data;
  },
};
