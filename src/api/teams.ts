import { apiClient, type ApiResponse } from './client';
import type { SquadResponse, SquadRecommendationSettingsResponse } from './squads';

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
  email?: string;
  role: TeamRole;
  squadId?: number | null;
  squadName?: string | null;
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
  deprecationMessage?: string;
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
  isSolved: boolean | null; // 로그인 사용자의 해결 여부 (비로그인 null)
  solvedTime?: string; // 해결 시간 (mm:ss 형식)
  tags?: Array<{
    key: string;
    nameKo: string;
    nameEn: string;
  }>;
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
  squads?: SquadResponse[];
}

type RawTeamDetailResponse = {
  team?: {
    id?: number;
    teamId?: number;
    name?: string;
    teamName?: string;
    description?: string;
    isPrivate?: boolean;
    memberCount?: number;
  };
  members?: TeamMemberResponse[];
  recommendationSettings?: TeamRecommendationSettingsResponse | null;
  todayProblem?: TodayProblemsResponse | null;
  squads?: Array<{
    squadId?: number;
    name?: string;
    squadName?: string;
    isDefault?: boolean;
    memberCount?: number;
    isActive?: boolean;
    recommendationDays?: RecommendationDayOfWeek[];
    problemDifficultyPreset?: ProblemDifficultyPreset;
    minProblemLevel?: number;
    maxProblemLevel?: number;
    problemCount?: number;
    includeTags?: string[];
    recommendationSettings?: SquadRecommendationSettingsResponse | null;
    todayProblems?: TodayProblemsResponse | null;
  }>;
};

const normalizeTeamDetail = (raw: RawTeamDetailResponse): TeamDetailResponse => {
  const members = Array.isArray(raw.members) ? raw.members : [];
  const teamId = Number(raw.team?.teamId ?? raw.team?.id ?? 0);
  const teamName = raw.team?.teamName ?? raw.team?.name ?? '';

  const squads = Array.isArray(raw.squads)
    ? raw.squads.map((s) => {
      const squadId = Number(s.squadId ?? 0);
      const squadMembers = members.filter((m) => m.squadId === squadId);
      return {
        squadId,
        squadName: s.squadName ?? s.name ?? '이름 없음',
        teamId,
        isDefault: Boolean(s.isDefault),
        memberCount: typeof s.memberCount === 'number' ? s.memberCount : squadMembers.length,
        members: squadMembers,
        recommendationSettings: s.recommendationSettings ?? {
          squadId,
          squadName: s.squadName ?? s.name ?? '이름 없음',
          isActive: Boolean(s.isActive),
          recommendationDays: s.recommendationDays ?? [],
          problemDifficultyPreset: s.problemDifficultyPreset,
          minProblemLevel: s.minProblemLevel,
          maxProblemLevel: s.maxProblemLevel,
          problemCount: s.problemCount,
          includeTags: s.includeTags ?? [],
        },
        todayProblems: s.todayProblems ?? null,
      } satisfies SquadResponse;
    })
    : [];

  return {
    team: {
      teamId,
      teamName,
      description: raw.team?.description ?? '',
      isPrivate: Boolean(raw.team?.isPrivate),
      memberCount: Number(raw.team?.memberCount ?? members.length),
    },
    members,
    recommendationSettings: raw.recommendationSettings ?? null,
    todayProblem: raw.todayProblem ?? null,
    squads,
  };
};

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
  memberProblems?: Array<{
    memberId: number;
    problems: TeamActivityProblem[];
  }>;
}

export interface TeamActivityResponse {
  currentMemberId: number;
  period: TeamActivityPeriod;
  members: TeamActivityMember[];
  dailyActivities: TeamActivityDailyActivity[];
}

export interface TeamLeaderboardMemberRank {
  memberId: number;
  handle: string;
  squadId: number | null;
  squadName: string | null;
  rank: number;
  totalSolved: number;
}

export interface TeamLeaderboardResponse {
  currentMemberId: number;
  period: TeamActivityPeriod;
  memberRanks: TeamLeaderboardMemberRank[];
}

export interface TeamActivityRecommendationProblem {
  problemId: number;
  title: string;
  titleKo: string;
  tier: number;
  solved: boolean;
}

export interface TeamActivityDailyRecommendation {
  date: string;
  problems: TeamActivityRecommendationProblem[];
}

export interface TeamActivityMemberActivity {
  memberId: number;
  handle: string;
  squadId: number | null;
  squadName: string | null;
  dailyRecommendations: TeamActivityDailyRecommendation[];
}

export interface TeamActivityV2Response {
  currentMemberId: number;
  period: TeamActivityPeriod;
  memberActivities: TeamActivityMemberActivity[];
}

const buildLegacyActivityFromV2 = (
  activity: TeamActivityV2Response,
  leaderboard?: TeamLeaderboardResponse
): TeamActivityResponse => {
  const leaderboardByMemberId = new Map<number, TeamLeaderboardMemberRank>(
    (leaderboard?.memberRanks ?? []).map((entry) => [entry.memberId, entry])
  );

  const membersById = new Map<number, TeamActivityMember>();
  activity.memberActivities.forEach((member) => {
    const ranked = leaderboardByMemberId.get(member.memberId);
    membersById.set(member.memberId, {
      memberId: member.memberId,
      handle: member.handle,
      rank: ranked?.rank ?? 0,
      totalSolved: ranked?.totalSolved ?? 0,
    });
  });

  (leaderboard?.memberRanks ?? []).forEach((member) => {
    if (!membersById.has(member.memberId)) {
      membersById.set(member.memberId, {
        memberId: member.memberId,
        handle: member.handle,
        rank: member.rank,
        totalSolved: member.totalSolved,
      });
    }
  });

  const members = Array.from(membersById.values()).sort((a, b) => {
    if (a.rank === 0 && b.rank !== 0) return 1;
    if (a.rank !== 0 && b.rank === 0) return -1;
    if (a.rank !== b.rank) return a.rank - b.rank;
    if (a.totalSolved !== b.totalSolved) return b.totalSolved - a.totalSolved;
    return a.memberId - b.memberId;
  });

  const dayMap = new Map<
    string,
    {
      problemsById: Map<number, TeamActivityProblem>;
      memberSolvedByMemberId: Map<number, Record<string, boolean>>;
      memberProblemsByMemberId: Map<number, TeamActivityProblem[]>;
    }
  >();

  activity.memberActivities.forEach((member) => {
    member.dailyRecommendations.forEach((daily) => {
      const dayState = dayMap.get(daily.date) ?? {
        problemsById: new Map<number, TeamActivityProblem>(),
        memberSolvedByMemberId: new Map<number, Record<string, boolean>>(),
        memberProblemsByMemberId: new Map<number, TeamActivityProblem[]>(),
      };

      const sortedProblems = [...daily.problems]
        .sort((a, b) => a.problemId - b.problemId)
        .map((problem) => {
          const normalized: TeamActivityProblem = {
            problemId: problem.problemId,
            title: problem.titleKo || problem.title,
            tier: problem.tier,
          };
          dayState.problemsById.set(problem.problemId, normalized);
          return normalized;
        });

      const solvedMap: Record<string, boolean> = {};
      daily.problems.forEach((problem) => {
        solvedMap[String(problem.problemId)] = problem.solved;
      });

      dayState.memberSolvedByMemberId.set(member.memberId, solvedMap);
      dayState.memberProblemsByMemberId.set(member.memberId, sortedProblems);
      dayMap.set(daily.date, dayState);
    });
  });

  const dailyActivities: TeamActivityDailyActivity[] = Array.from(dayMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, state]) => ({
      date,
      problems: Array.from(state.problemsById.values()).sort((a, b) => a.problemId - b.problemId),
      memberSolved: Array.from(state.memberSolvedByMemberId.entries()).map(([memberId, solved]) => ({
        memberId,
        solved,
      })),
      memberProblems: Array.from(state.memberProblemsByMemberId.entries()).map(([memberId, problems]) => ({
        memberId,
        problems,
      })),
    }));

  return {
    currentMemberId: activity.currentMemberId,
    period: activity.period,
    members,
    dailyActivities,
  };
};

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
    const response = await apiClient.get<ApiResponse<RawTeamDetailResponse>>(`/v2/teams/${teamId}`);
    return normalizeTeamDetail(response.data.data);
  },

  getTeamMembers: async (teamId: number): Promise<TeamMemberResponse[]> => {
    const response = await apiClient.get<ApiResponse<TeamMemberResponse[]>>(`/teams/${teamId}/members`);
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
    const response = await apiClient.get<ApiResponse<PublicTeamResponse[]>>('/v2/teams/public');
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

  // 팀 활동(참여 현황) v2
  getTeamActivityV2: async (teamId: number, days: number = 30): Promise<TeamActivityV2Response> => {
    const response = await apiClient.get<ApiResponse<TeamActivityV2Response>>(
      `/v2/teams/${teamId}/activity`,
      { params: { days } }
    );
    return response.data.data;
  },

  // 팀 리더보드 v2
  getTeamLeaderboardV2: async (teamId: number, days: number = 30): Promise<TeamLeaderboardResponse> => {
    const response = await apiClient.get<ApiResponse<TeamLeaderboardResponse>>(
      `/v2/teams/${teamId}/leaderboard`,
      { params: { days } }
    );
    return response.data.data;
  },

  // 화면 하위호환용: v2 activity + leaderboard를 기존 TeamActivityResponse 형태로 변환
  getTeamActivityViewV2: async (teamId: number, days: number = 30): Promise<TeamActivityResponse> => {
    const [activity, leaderboard] = await Promise.all([
      teamsApi.getTeamActivityV2(teamId, days),
      teamsApi.getTeamLeaderboardV2(teamId, days),
    ]);
    return buildLegacyActivityFromV2(activity, leaderboard);
  },

  // 참여 현황 전용: leaderboard 호출 없이 activity만 변환
  getTeamActivityParticipationV2: async (teamId: number, days: number = 30): Promise<TeamActivityResponse> => {
    const activity = await teamsApi.getTeamActivityV2(teamId, days);
    return buildLegacyActivityFromV2(activity);
  },
};
