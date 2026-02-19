import { apiClient, type ApiResponse } from './client';

export interface RankingUser {
  rank: number;
  handle: string;
  solvedCount: number;
}

export interface GlobalRankingResponse {
  rankings: RankingUser[];
}

export const rankingApi = {
  getGlobalRanking: async (): Promise<GlobalRankingResponse> => {
    const response = await apiClient.get<ApiResponse<GlobalRankingResponse>>('/solve/ranking/global');
    return response.data.data;
  },
};
