// 데모 모드용 더미 데이터
// URL에 ?demo=true 붙이면 이 데이터로 렌더링됨
//
// === 데모 모드 단축키 ===
// Cmd+Shift+F (Mac) / Ctrl+Shift+F (Windows): 해결인증 성공/실패 모드 토글

import type { TodayProblem } from '../api/recommendation';
import type { MyTeamResponse, TeamActivityResponse, TodayProblemsResponse, TeamRecommendationSettingsResponse, TeamMemberResponse, TeamDetailResponse } from '../api/teams';

// ============ 대시보드용 데이터 ============

export const demoUser = {
  memberId: 1,
  email: 'demo@codemate.kr',
  handle: 'ryu_eclipse',
  solvedCount: 847,
  tier: 15, // Gold I
};

export const demoTeams: MyTeamResponse[] = [
  {
    teamId: 1,
    teamName: '알고리즘 마스터즈',
    teamDescription: '매일 백준 문제 3개씩 풀기',
    memberCount: 4,
    isPrivate: false,
    myRole: 'LEADER',
    isRecommendationActive: true,
    createdAt: new Date().toISOString(),
  },
];

interface DemoTeamProblem extends TodayProblem {
  teamId: number;
  teamName: string;
}

export const demoTodayProblems: DemoTeamProblem[] = [
  {
    problemId: 1260,
    title: 'DFS and BFS',
    titleKo: 'DFS와 BFS',
    level: 9, // Silver II
    url: 'https://www.acmicpc.net/problem/1260',
    acceptedUserCount: 142847,
    averageTries: 2.73,
    isSolved: true,
    solvedTime: '20:00',
    tags: [],
    teamId: 1,
    teamName: '알고리즘 마스터즈',
  },
  {
    problemId: 1753,
    title: 'Shortest Path',
    titleKo: '최단경로',
    level: 12, // Gold IV
    url: 'https://www.acmicpc.net/problem/1753',
    acceptedUserCount: 67234,
    averageTries: 3.21,
    isSolved: true,
    solvedTime: '01:11',
    tags: [],
    teamId: 1,
    teamName: '알고리즘 마스터즈',
  },
  {
    problemId: 11725,
    title: 'Finding the Parent of a Tree',
    titleKo: '트리의 부모 찾기',
    level: 9, // Silver II
    url: 'https://www.acmicpc.net/problem/11725',
    acceptedUserCount: 54892,
    averageTries: 1.89,
    isSolved: false,
    tags: [],
    teamId: 1,
    teamName: '알고리즘 마스터즈',
  },
];

// ============ 팀 상세 페이지용 데이터 ============

export const demoTeamMembers: TeamMemberResponse[] = [
  { memberId: 1, handle: 'ryu_eclipse', email: 'algo@test.com', role: 'LEADER', isMe: true },
  { memberId: 2, handle: 'code_ninja', email: 'ninja@test.com', role: 'MEMBER', isMe: false },
  { memberId: 3, handle: 'dev_rookie', email: 'rookie@test.com', role: 'MEMBER', isMe: false },
  { memberId: 4, handle: 'ps_lover', email: 'lover@test.com', role: 'MEMBER', isMe: false },
];

export const demoRecommendationSettings: TeamRecommendationSettingsResponse = {
  teamId: 1,
  teamName: '알고리즘 마스터즈',
  problemCount: 3,
  problemDifficultyPreset: 'NORMAL',
  minProblemLevel: 9, // Silver II
  maxProblemLevel: 12, // Gold IV
  includeTags: ['dp', 'graphs', 'greedy'],
  recommendationDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
  isActive: true,
};

export const demoTodayProblemsResponse: TodayProblemsResponse = {
  recommendationId: 1,
  createdAt: new Date().toISOString(),
  problems: [
    {
      problemId: 1260,
      title: 'DFS and BFS',
      titleKo: 'DFS와 BFS',
      level: 9,
      url: 'https://www.acmicpc.net/problem/1260',
      acceptedUserCount: 142847,
      averageTries: 2.73,
      isSolved: true,
      solvedTime: '20:00',
    },
    {
      problemId: 1753,
      title: 'Shortest Path',
      titleKo: '최단경로',
      level: 12,
      url: 'https://www.acmicpc.net/problem/1753',
      acceptedUserCount: 67234,
      averageTries: 3.21,
      isSolved: true,
      solvedTime: '01:11',
    },
    {
      problemId: 11725,
      title: 'Finding the Parent of a Tree',
      titleKo: '트리의 부모 찾기',
      level: 9,
      url: 'https://www.acmicpc.net/problem/11725',
      acceptedUserCount: 54892,
      averageTries: 1.89,
      isSolved: false,
    },
  ],
};

export const demoTeamDetails: TeamDetailResponse = {
  team: {
    teamId: 1,
    teamName: '알고리즘 마스터즈',
    description: '매일 백준 문제 3개씩 풀기',
    isPrivate: false,
    memberCount: 4,
  },
  members: demoTeamMembers,
  recommendationSettings: demoRecommendationSettings,
  todayProblem: demoTodayProblemsResponse,
};

// 최근 7일 날짜 생성
const getRecentDates = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  if (today.getHours() < 6) {
    today.setDate(today.getDate() - 1);
  }
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const recentDates = getRecentDates(30);

export const demoActivityData: TeamActivityResponse = {
  currentMemberId: 1,
  period: {
    days: 30,
    startDate: getRecentDates(30)[0],
    endDate: getRecentDates(30)[29],
  },
  members: [
    { memberId: 1, handle: 'ryu_eclipse', rank: 1, totalSolved: 28 },
    { memberId: 2, handle: 'code_ninja', rank: 2, totalSolved: 24 },
    { memberId: 3, handle: 'dev_rookie', rank: 3, totalSolved: 15 },
    { memberId: 4, handle: 'ps_lover', rank: 4, totalSolved: 12 },
  ],
  dailyActivities: recentDates.slice(-7).map((date, idx) => ({
    date,
    problems: [
      { problemId: 1260 + idx, title: `문제 ${idx + 1}`, tier: 10 + (idx % 5) },
      { problemId: 1270 + idx, title: `문제 ${idx + 2}`, tier: 11 + (idx % 4) },
      { problemId: 1280 + idx, title: `문제 ${idx + 3}`, tier: 12 + (idx % 3) },
    ],
    memberSolved: [
      { memberId: 1, solved: { [1260 + idx]: true, [1270 + idx]: true, [1280 + idx]: idx < 5 } },
      { memberId: 2, solved: { [1260 + idx]: true, [1270 + idx]: idx < 4, [1280 + idx]: false } },
      { memberId: 3, solved: { [1260 + idx]: idx < 3, [1270 + idx]: false, [1280 + idx]: false } },
      { memberId: 4, solved: { [1260 + idx]: idx < 2, [1270 + idx]: false, [1280 + idx]: false } },
    ],
  })),
};

// ============ 최근 활동 차트용 데이터 ============

export interface DemoDailySolvedProblem {
  problemId: number;
  title: string;
  tier: number;
}

export interface DemoDailySolved {
  date: string;
  count: number;
  problems: DemoDailySolvedProblem[];
}

export interface DemoDailySolvedResponse {
  dailySolved: DemoDailySolved[];
  totalCount: number;
}

// 최근 7일 풀이 데이터 생성
const generateDemoDailySolved = (): DemoDailySolvedResponse => {
  const today = new Date();
  if (today.getHours() < 6) {
    today.setDate(today.getDate() - 1);
  }

  const sampleProblems: DemoDailySolvedProblem[][] = [
    [
      { problemId: 1753, title: '최단경로', tier: 12 },
      { problemId: 1260, title: 'DFS와 BFS', tier: 9 },
      { problemId: 11725, title: '트리의 부모 찾기', tier: 9 },
    ],
    [
      { problemId: 2178, title: '미로 탐색', tier: 10 },
      { problemId: 1927, title: '최소 힙', tier: 9 },
    ],
    [
      { problemId: 1916, title: '최소비용 구하기', tier: 12 },
      { problemId: 1167, title: '트리의 지름', tier: 13 },
      { problemId: 2606, title: '바이러스', tier: 8 },
    ],
    [
      { problemId: 11279, title: '최대 힙', tier: 9 },
    ],
    [
      { problemId: 1197, title: '최소 스패닝 트리', tier: 12 },
      { problemId: 2667, title: '단지번호붙이기', tier: 10 },
    ],
    [
      { problemId: 7576, title: '토마토', tier: 11 },
      { problemId: 1012, title: '유기농 배추', tier: 9 },
      { problemId: 2468, title: '안전 영역', tier: 10 },
    ],
    [], // 오늘은 아직 안 품
  ];

  const dailySolved: DemoDailySolved[] = sampleProblems.map((problems, idx) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - idx));
    const dateStr = date.toISOString().split('T')[0];

    return {
      date: dateStr,
      count: problems.length,
      problems,
    };
  });

  const totalCount = dailySolved.reduce((sum, d) => sum + d.count, 0);

  return { dailySolved, totalCount };
};

export const demoDailySolvedData: DemoDailySolvedResponse = generateDemoDailySolved();

// 데모 모드 체크 유틸리티
export const isDemoMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('demo') === 'true';
};
