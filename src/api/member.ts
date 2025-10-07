import { apiClient, type ApiResponse } from './client';

export interface MyProfileResponse {
  id: number;
  email: string;
  handle: string;
  verified: boolean;
  role: string;
  provider: string;
  providerId: string;
  joinedAt: string;
}

export interface MemberPublicResponse {
  id: number;
  handle: string;
  name: string;
  verified: boolean;
  tier: number;
  rating: number;
  solvedCount: number;
}

export interface MemberSearchResponse {
  id: number;
  handle: string;
  name: string;
  email?: string; // 인증된 사용자의 경우에만 포함
  verified: boolean;
  tier: number;
  rating: number;
  solvedCount: number;
}

export interface VerifySolvedAcRequest {
  handle: string;
}

export interface CheckEmailResponse {
  available: boolean;
}

export const memberApi = {
  /**
   * 내 프로필 조회 - 민감 정보 포함
   */
  getMe: async (): Promise<MyProfileResponse> => {
    const response = await apiClient.get<ApiResponse<MyProfileResponse>>('/member/me');
    return response.data.data;
  },

  /**
   * 멤버 공개 정보 조회 - 민감 정보 제외
   */
  getById: async (id: number): Promise<MemberPublicResponse> => {
    const response = await apiClient.get<ApiResponse<MemberPublicResponse>>(`/member/${id}`);
    return response.data.data;
  },

  /**
   * 핸들로 멤버 검색 - 인증된 사용자의 경우 이메일 포함
   */
  getByHandle: async (handle: string): Promise<MemberSearchResponse> => {
    const response = await apiClient.get<ApiResponse<MemberSearchResponse>>(`/member/search?handle=${handle}`);
    return response.data.data;
  },

  /**
   * 인증된 핸들 목록 조회
   */
  getVerifiedHandles: async (): Promise<string[]> => {
    const response = await apiClient.get<ApiResponse<string[]>>('/member/handles');
    return response.data.data;
  },

  /**
   * 백준 핸들 인증 - 업데이트된 프로필 반환
   */
  verifySolvedAc: async (handle: string): Promise<MyProfileResponse> => {
    const response = await apiClient.post<ApiResponse<MyProfileResponse>>('/member/me/verify-solvedac', { handle });
    return response.data.data;
  },

  /**
   * 이메일 변경 인증 요청 - 새 이메일로 인증 링크 발송
   */
  sendEmailVerification: async (email: string): Promise<void> => {
    await apiClient.post('/member/me/send-email-verification', { email });
  },

  /**
   * 이메일 인증 토큰 검증 - 이메일 변경 완료
   */
  verifyEmail: async (token: string): Promise<MyProfileResponse> => {
    const response = await apiClient.post<ApiResponse<MyProfileResponse>>('/member/verify-email', { token });
    return response.data.data;
  },

  /**
   * 이메일 사용 가능 여부 확인
   */
  checkEmail: async (email: string): Promise<boolean> => {
    const response = await apiClient.post<ApiResponse<CheckEmailResponse>>('/member/check-email', { email });
    return response.data.data.available;
  }
};