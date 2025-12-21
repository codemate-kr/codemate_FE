import { useState, useRef, useEffect, useCallback } from 'react';
import { Users, Calendar, Trophy, ChevronLeft, ChevronRight, CheckCircle, ExternalLink } from 'lucide-react';
import type { TeamActivityResponse, TeamActivityMember, TeamActivityDailyActivity, TeamActivityProblem } from '../../../../api/teams';
import { getTierIcon } from '../../../../components/common/TierIcon';
import NewBadge from '../../../../components/common/NewBadge';

// ============ 타입 정의 ============
type TabType = 'participation' | 'leaderboard';

interface DayInfo {
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

// ============ 유틸리티 함수 ============
const getCellColor = (solvedCount: number, totalCount: number) => {
  if (totalCount === 0) return 'bg-gray-100 border-gray-200';
  if (solvedCount === 0) return 'bg-gray-200 border-gray-300 hover:bg-gray-300 hover:border-gray-400';
  const ratio = solvedCount / totalCount;
  if (ratio === 1) return 'bg-grass-2 border-grass-3 hover:bg-grass-3 hover:border-grass-4';
  if (ratio >= 0.5) return 'bg-grass-1 border-grass-2 hover:bg-grass-2 hover:border-grass-3';
  return 'bg-emerald-100 border-emerald-200 hover:bg-emerald-200 hover:border-emerald-300';
};

const truncateHandle = (handle: string | null, maxLen = 12) => {
  if (!handle) return '(미인증)';
  return handle.length > maxLen ? handle.slice(0, maxLen) + '..' : handle;
};

const getRecentDays = (days: number): DayInfo[] => {
  const result: DayInfo[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.push({
      dateStr: date.toISOString().split('T')[0],
      day: date.getDate(),
      month: date.getMonth() + 1,
      weekday: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()],
      isToday: i === 0,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    });
  }
  return result;
};

// API 데이터에서 멤버별 일별 통계 추출
const getMemberDayStatsFromApi = (
  memberId: number,
  dateStr: string,
  dailyActivities: TeamActivityDailyActivity[] | null | undefined
): MemberDayStats => {
  if (!dailyActivities || dailyActivities.length === 0) {
    return { solvedCount: 0, totalCount: 0, problems: [], memberSolved: {} };
  }

  const dayActivity = dailyActivities.find(d => d.date === dateStr);
  if (!dayActivity) {
    return { solvedCount: 0, totalCount: 0, problems: [], memberSolved: {} };
  }

  const memberSolvedInfo = dayActivity.memberSolved?.find(m => m.memberId === memberId);
  const memberSolved = memberSolvedInfo?.solved || {};

  const solvedCount = Object.values(memberSolved).filter(Boolean).length;

  return {
    solvedCount,
    totalCount: dayActivity.problems?.length || 0,
    problems: dayActivity.problems || [],
    memberSolved,
  };
};

// ============ 공통 컴포넌트 ============
function DayRangeToggle({ dayRange, onChange }: { dayRange: 7 | 30; onChange: (range: 7 | 30) => void }) {
  return (
    <div className="w-40 flex-shrink-0 flex items-center gap-2 pr-2">
      <span className="text-xs text-gray-500">최근</span>
      <div className="flex bg-gray-100 rounded-md p-0.5">
        <button
          onClick={() => onChange(7)}
          className={`px-2 py-1 text-xs font-medium rounded ${
            dayRange === 7 ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          7일
        </button>
        <button
          onClick={() => onChange(30)}
          className={`px-2 py-1 text-xs font-medium rounded ${
            dayRange === 30 ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          30일
        </button>
      </div>
    </div>
  );
}

function MemberAvatar({ handle, isMe, size = 'sm' }: { handle: string | null; isMe: boolean; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-7 h-7 text-xs';
  const initial = handle ? handle[0].toUpperCase() : '?';
  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center text-white font-bold ${
      isMe ? 'bg-blue-600' : 'bg-gray-400'
    }`}>
      {initial}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-3 text-[10px] text-gray-500 pt-2">
      <div className="flex items-center gap-1">
        <span>Less</span>
        <div className="flex gap-0.5">
          <div className="w-3 h-3 rounded-sm bg-gray-200 border border-gray-300" />
          <div className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-200" />
          <div className="w-3 h-3 rounded-sm bg-grass-1 border border-grass-2" />
          <div className="w-3 h-3 rounded-sm bg-grass-2 border border-grass-3" />
        </div>
        <span>More</span>
      </div>
      |
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200 flex items-center justify-center text-[8px] text-gray-400">-</div>
        <span>추천없음</span>
      </div>
    </div>
  );
}

export function ProblemDetail({ date, data }: { date: { month: number; day: number; weekday: string }; data: MemberDayStats }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">날짜</span>
        <span className="font-medium">{date.month}/{date.day} ({date.weekday})</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">진행률</span>
        <span className={data.solvedCount === data.totalCount ? 'text-green-600 font-medium' : 'font-medium'}>
          {data.solvedCount}/{data.totalCount} 완료
        </span>
      </div>

      <div className="pt-2 border-t border-gray-100 space-y-1.5">
        {data.problems.map((problem) => {
          const isSolved = data.memberSolved[String(problem.problemId)] || false;
          const bojUrl = `https://www.acmicpc.net/problem/${problem.problemId}`;

          return (
            <a
              key={problem.problemId}
              href={bojUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-blue-100 transition-colors ${isSolved ? 'bg-blue-50' : ''}`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                isSolved ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}>
                {isSolved && <CheckCircle className="w-2.5 h-2.5" />}
              </div>
              {getTierIcon(problem.tier, 16)}
              <span className="flex-1 min-w-0 text-xs font-medium text-gray-700 truncate">
                {problem.title}
              </span>
              <span className="text-[10px] text-gray-400 flex-shrink-0">
                #{problem.problemId}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ============ 참여 현황 탭 ============
interface ParticipationTabProps {
  members: TeamActivityMember[];
  dailyActivities: TeamActivityDailyActivity[];
  currentMemberId: number;
  selectedCellInfo: SelectedCellInfo | null;
  onCellSelect: (info: SelectedCellInfo | null) => void;
}

function ParticipationTab({ members, dailyActivities, currentMemberId, selectedCellInfo, onCellSelect }: ParticipationTabProps) {
  const [dayRange, setDayRange] = useState<7 | 30>(7);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const recentDays = getRecentDays(dayRange);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [dayRange]);

  const scrollBy = useCallback((direction: 'left' | 'right') => {
    scrollContainerRef.current?.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
  }, []);

  const handleCellClick = (member: TeamActivityMember, dateStr: string, dateIndex: number, date: DayInfo) => {
    const isAlreadySelected = selectedCellInfo?.memberId === member.memberId && selectedCellInfo?.dateStr === dateStr;
    if (isAlreadySelected) {
      onCellSelect(null);
    } else {
      const data = getMemberDayStatsFromApi(member.memberId, dateStr, dailyActivities);
      onCellSelect({
        handle: member.handle,
        memberId: member.memberId,
        dateStr,
        dateIndex,
        date: { month: date.month, day: date.day, weekday: date.weekday },
        data,
      });
    }
  };

  const handleDayRangeChange = (range: 7 | 30) => {
    setDayRange(range);
    onCellSelect(null);
  };

  const getDateHeaderClass = (date: DayInfo) =>
    `text-center text-[10px] ${date.isWeekend ? 'text-red-400' : 'text-gray-400'} ${date.isToday ? 'font-bold' : ''}`;

  const getCellClass = (solvedCount: number, totalCount: number) => {
    const base = `rounded border flex items-center justify-center text-[10px] font-bold transition-all duration-150 ${getCellColor(solvedCount, totalCount)}`;
    const interactive = totalCount === 0
      ? 'text-gray-400 cursor-default'
      : solvedCount === totalCount
        ? 'text-white cursor-pointer hover:scale-105 hover:shadow-md'
        : 'text-gray-600 cursor-pointer hover:scale-105 hover:shadow-md';
    return `${base} ${interactive}`;
  };

  // 7일 모드
  if (dayRange === 7) {
    return (
      <div className="space-y-2">
        <div className="flex items-center h-10">
          <DayRangeToggle dayRange={dayRange} onChange={handleDayRangeChange} />
          <div className="flex-1 flex gap-1 justify-between">
            {recentDays.map((date) => (
              <div key={date.dateStr} className={`flex-1 ${getDateHeaderClass(date)}`}>
                <div>{date.day}</div>
                <div>{date.isToday ? '(오늘)' : date.weekday}</div>
              </div>
            ))}
          </div>
        </div>

        {members.map((member) => {
          const isMe = member.memberId === currentMemberId;
          return (
            <div key={member.memberId} className="flex items-center h-10">
              <div className={`w-40 flex-shrink-0 flex items-center gap-2 pr-2 h-10 rounded-l ${isMe ? 'bg-blue-50' : ''}`}>
                <MemberAvatar handle={member.handle} isMe={isMe} />
                <p className="text-xs font-medium text-gray-700 truncate">{truncateHandle(member.handle)}</p>
              </div>
              <div className="flex-1 flex gap-1 justify-between h-10 items-center">
                {recentDays.map((date, dateIndex) => {
                  const { solvedCount, totalCount } = getMemberDayStatsFromApi(member.memberId, date.dateStr, dailyActivities);
                  return (
                    <button
                      key={date.dateStr}
                      onClick={() => totalCount > 0 && handleCellClick(member, date.dateStr, dateIndex, date)}
                      disabled={totalCount === 0}
                      className={`flex-1 h-9 ${getCellClass(solvedCount, totalCount)}`}
                    >
                      {totalCount === 0 ? '-' : `${solvedCount}/${totalCount}`}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        <Legend />
      </div>
    );
  }

  // 30일 모드
  return (
    <div className="space-y-2">
      <div className="flex">
        <div className="flex-shrink-0 w-40 space-y-2">
          <div className="h-10 flex items-center">
            <DayRangeToggle dayRange={dayRange} onChange={handleDayRangeChange} />
          </div>
          {members.map((member) => {
            const isMe = member.memberId === currentMemberId;
            return (
              <div key={member.memberId} className={`flex items-center gap-2 pr-2 h-10 rounded-l ${isMe ? 'bg-blue-50' : ''}`}>
                <MemberAvatar handle={member.handle} isMe={isMe} />
                <p className="text-xs font-medium text-gray-700 truncate">{truncateHandle(member.handle)}</p>
              </div>
            );
          })}
        </div>

        <div className="flex-1 overflow-x-auto scrollbar-hide" ref={scrollContainerRef}>
          <div className="space-y-2" style={{ minWidth: '1200px' }}>
            <div className="flex gap-1 h-10 items-center">
              {recentDays.map((date) => (
                <div key={date.dateStr} className={`w-9 flex-shrink-0 ${getDateHeaderClass(date)}`}>
                  <div>{date.day}{date.isToday && <span className="text-[8px] block">(오늘)</span>}</div>
                  {!date.isToday && <div>{date.weekday}</div>}
                </div>
              ))}
            </div>

            {members.map((member) => (
              <div key={member.memberId} className="flex gap-1 h-10 items-center">
                {recentDays.map((date, dateIndex) => {
                  const { solvedCount, totalCount } = getMemberDayStatsFromApi(member.memberId, date.dateStr, dailyActivities);
                  return (
                    <button
                      key={date.dateStr}
                      onClick={() => totalCount > 0 && handleCellClick(member, date.dateStr, dateIndex, date)}
                      disabled={totalCount === 0}
                      className={`w-9 h-9 flex-shrink-0 ${getCellClass(solvedCount, totalCount)}`}
                    >
                      {totalCount === 0 ? '-' : `${solvedCount}/${totalCount}`}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 pt-2">
        <button onClick={() => scrollBy('left')} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={() => scrollBy('right')} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <Legend />
    </div>
  );
}

// ============ 리더보드 탭 ============
interface LeaderboardTabProps {
  members: TeamActivityMember[];
  currentMemberId: number;
}

function LeaderboardTab({ members, currentMemberId }: LeaderboardTabProps) {
  // members는 이미 rank 순으로 정렬되어 있음
  const myRank = members.find(m => m.memberId === currentMemberId)?.rank || 0;
  const myIndex = members.findIndex(m => m.memberId === currentMemberId);

  return (
    <div className="space-y-3">
      {/* 기간 안내 */}
      <div className="text-[11px] text-gray-400 text-right">
        최근 30일 기준
      </div>
      {/* 순위 목록 */}
      <div className="space-y-1.5">
        {members.map((member) => {
          const isMe = member.memberId === currentMemberId;
          return (
            <div
              key={member.memberId}
              className={`flex items-center gap-3 p-2.5 rounded-lg border ${
                isMe ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="w-6 text-center text-sm font-bold text-gray-500">
                {member.rank}
              </div>
              <MemberAvatar handle={member.handle} isMe={isMe} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {member.handle ? `@${member.handle}` : '(미인증)'}
                  {isMe && <span className="text-blue-600 ml-1">(나)</span>}
                </p>
              </div>
              <span className="text-sm font-medium text-gray-600">{member.totalSolved}문제</span>
            </div>
          );
        })}
      </div>

      {/* 동기부여 메시지 */}
      {myRank > 1 && myIndex > 0 && (
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          {members[myIndex - 1].totalSolved - members[myIndex].totalSolved}문제만 더 풀면 {myRank - 1}위!
        </div>
      )}
    </div>
  );
}

// ============ 메인 컴포넌트 ============
interface TeamActivityBoardProps {
  activityData: TeamActivityResponse | null;
  loading?: boolean;
  onCellSelect?: (info: SelectedCellInfo | null) => void;
}

export default function TeamActivityBoard({ activityData, loading = false, onCellSelect }: TeamActivityBoardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('participation');
  const [selectedCellInfo, setSelectedCellInfo] = useState<SelectedCellInfo | null>(null);

  const tabs = [
    { id: 'participation' as TabType, label: '참여 현황', icon: Calendar },
    { id: 'leaderboard' as TabType, label: '리더보드', icon: Trophy },
  ];

  const handleCellSelect = (info: SelectedCellInfo | null) => {
    setSelectedCellInfo(info);
    onCellSelect?.(info);
  };

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    handleCellSelect(null);
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-sm">팀 활동 현황을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!activityData) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-center text-gray-500">
          <p className="text-sm">팀 활동 현황을 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="border-b border-gray-200 px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">팀 활동</h3>
            <NewBadge />
          </div>
        </div>
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {activeTab === 'participation' && (
          <ParticipationTab
            members={activityData.members}
            dailyActivities={activityData.dailyActivities}
            currentMemberId={activityData.currentMemberId}
            selectedCellInfo={selectedCellInfo}
            onCellSelect={handleCellSelect}
          />
        )}
        {activeTab === 'leaderboard' && (
          <LeaderboardTab
            members={activityData.members}
            currentMemberId={activityData.currentMemberId}
          />
        )}
      </div>
    </div>
  );
}
