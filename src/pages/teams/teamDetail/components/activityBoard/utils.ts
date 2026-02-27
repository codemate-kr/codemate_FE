import type { TeamActivityDailyActivity, TeamActivityProblem } from '../../../../../api/teams';
import type { DayInfo, MemberDayStats } from './types';

export const getCellColor = (solvedCount: number, totalCount: number) => {
  if (totalCount === 0) return 'bg-gray-100 border-gray-200';
  if (solvedCount === 0) return 'bg-gray-200 border-gray-300 hover:bg-gray-300 hover:border-gray-400';
  const ratio = solvedCount / totalCount;
  if (ratio === 1) return 'bg-grass-2 border-grass-3 hover:bg-grass-3 hover:border-grass-4';
  if (ratio >= 0.5) return 'bg-grass-1 border-grass-2 hover:bg-grass-2 hover:border-grass-3';
  return 'bg-emerald-100 border-emerald-200 hover:bg-emerald-200 hover:border-emerald-300';
};

export const truncateHandle = (handle: string | null, maxLen = 12) => {
  if (!handle) return '(미인증)';
  return handle.length > maxLen ? `${handle.slice(0, maxLen)}..` : handle;
};

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 팀 미션 사이클이 오전 6시를 기준으로 바뀌므로,
// 로컬 시간 기준 06:00 이전에는 전날 활동으로 집계한다.
const getAdjustedToday = (): Date => {
  const now = new Date();
  if (now.getHours() < 6) {
    now.setDate(now.getDate() - 1);
  }
  now.setHours(12, 0, 0, 0);
  return now;
};

export const getRecentDays = (days: number): DayInfo[] => {
  const result: DayInfo[] = [];
  const adjustedToday = getAdjustedToday();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(adjustedToday);
    date.setDate(adjustedToday.getDate() - i);
    result.push({
      dateStr: formatLocalDate(date),
      day: date.getDate(),
      month: date.getMonth() + 1,
      weekday: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()],
      isToday: i === 0,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    });
  }
  return result;
};

export const getMemberDayStatsFromApi = (
  memberId: number,
  dateStr: string,
  dailyActivities: TeamActivityDailyActivity[] | null | undefined
): MemberDayStats => {
  if (!dailyActivities || dailyActivities.length === 0) {
    return { solvedCount: 0, totalCount: 0, problems: [], memberSolved: {} };
  }

  const dayActivity = dailyActivities.find((d) => d.date === dateStr);
  if (!dayActivity) {
    return { solvedCount: 0, totalCount: 0, problems: [], memberSolved: {} };
  }

  const memberSolvedInfo = dayActivity.memberSolved?.find((m) => Number(m.memberId) === memberId);
  const rawMemberSolved = memberSolvedInfo?.solved || {};
  const memberSpecificProblems = dayActivity.memberProblems?.find((m) => Number(m.memberId) === memberId)?.problems;
  const hasMemberScopedData = Boolean(memberSolvedInfo) || Array.isArray(memberSpecificProblems);
  if (!hasMemberScopedData) {
    return { solvedCount: 0, totalCount: 0, problems: [], memberSolved: {} };
  }
  const sourceProblems = memberSpecificProblems ?? [];

  // 클릭 시마다 독립 배열을 만들고 problemId 기준으로 중복 제거해 누적 렌더를 방지한다.
  const problemById = new Map<number, TeamActivityProblem>();
  sourceProblems.forEach((problem) => {
    const normalizedId = Number(problem.problemId);
    if (!Number.isFinite(normalizedId)) return;
    problemById.set(normalizedId, {
      ...problem,
      problemId: normalizedId,
    });
  });
  const problems = Array.from(problemById.values()).sort((a, b) => a.problemId - b.problemId);

  const memberSolved: Record<string, boolean> = {};
  problems.forEach((problem) => {
    memberSolved[String(problem.problemId)] = Boolean(rawMemberSolved[String(problem.problemId)]);
  });

  const solvedCount = problems.reduce((count, problem) => (
    memberSolved[String(problem.problemId)] ? count + 1 : count
  ), 0);

  return {
    solvedCount,
    totalCount: problems.length,
    problems,
    memberSolved,
  };
};
