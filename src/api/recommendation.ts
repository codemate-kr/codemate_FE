import { apiClient, type ApiResponse } from './client';

// 알고리즘 태그 타입
export interface ProblemTag {
  key: string;
  nameKo: string;
  nameEn: string;
}

// 오늘의 문제 타입
export interface TodayProblem {
  problemId: number;
  title: string;
  titleKo: string;
  level: number;
  url: string;
  acceptedUserCount: number;
  averageTries: number;
  isSolved: boolean;
  solvedTime?: string; // 해결 시간 (mm:ss 형식)
  tags: ProblemTag[];
}

// 팀별 오늘의 문제 정보
export interface TeamTodayProblems {
  teamId: number;
  teamName: string;
  recommendationId: number;
  createdAt: string;
  problems: TodayProblem[];
}

// 내 모든 팀의 오늘 추천 문제 응답
export interface MyTodayProblemsResponse {
  teams: TeamTodayProblems[];
  totalProblemCount: number;
  solvedCount: number;
}

export const recommendationApi = {
  // 로그인한 유저가 속한 모든 팀의 오늘 추천 문제 조회
  getMyTodayProblems: async (): Promise<MyTodayProblemsResponse> => {
    const response = await apiClient.get<ApiResponse<MyTodayProblemsResponse>>(
      '/recommendation/my/today-problems'
    );
    return response.data.data;
  },
};
