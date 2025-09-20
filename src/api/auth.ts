import { apiClient } from './client';
import type { User } from '../types';

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface GoogleAuthRequest {
  code: string;
}

export interface BojVerificationRequest {
  bojHandle: string;
}

export const authApi = {
  googleLogin: async (data: GoogleAuthRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/google', data);
    return response.data;
  },

  verifyBoj: async (data: BojVerificationRequest): Promise<User> => {
    const response = await apiClient.post('/auth/verify-boj', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};