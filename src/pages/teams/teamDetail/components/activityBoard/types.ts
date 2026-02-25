import type { TeamActivityProblem } from '../../../../../api/teams';

export type TabType = 'participation' | 'leaderboard';

export type RowItem =
  | { type: 'divider'; squadName: string }
  | { type: 'member'; member: { memberId: number; handle: string; rank: number; totalSolved: number } };

export interface DayInfo {
  dateStr: string;
  day: number;
  month: number;
  weekday: string;
  isToday: boolean;
  isWeekend: boolean;
}

export interface MemberDayStats {
  solvedCount: number;
  totalCount: number;
  problems: TeamActivityProblem[];
  memberSolved: Record<string, boolean>;
}

export interface SelectedCellInfo {
  handle: string;
  memberId: number;
  dateStr: string;
  dateIndex: number;
  date: { month: number; day: number; weekday: string };
  data: MemberDayStats;
}
