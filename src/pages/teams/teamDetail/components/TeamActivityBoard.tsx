import { useState } from 'react';
import { Users, Calendar, TrendingUp, Flame, CheckCircle, XCircle, Construction } from 'lucide-react';

type TabType = 'participation' | 'summary';

// 팀 멤버 목록
const DUMMY_MEMBERS = [
  { handle: 'test_user1', isMe: false, streak: 14 },
  { handle: 'test_user2', isMe: true, streak: 4 },
  { handle: 'test_user3', isMe: false, streak: 2 },
];

// 날짜별 공통 추천 문제 (모든 멤버가 동일한 문제를 받음)
const DUMMY_DAILY_PROBLEMS: Record<string, { id: number; title: string; tier: string }[]> = {
  '2025-11-26': [
    { id: 1001, title: '이분탐색', tier: 'Silver II' },
    { id: 1002, title: 'BFS 기초', tier: 'Silver I' },
  ],
  '2025-11-27': [
    { id: 1003, title: 'DFS 응용', tier: 'Gold V' },
    { id: 1004, title: '그리디', tier: 'Gold IV' },
    { id: 1005, title: 'DP 입문', tier: 'Gold III' },
  ],
  '2025-11-28': [
    { id: 1006, title: '문자열', tier: 'Silver III' },
  ],
  '2025-12-02': [
    { id: 1007, title: '투 포인터', tier: 'Gold IV' },
    { id: 1008, title: '세그먼트 트리', tier: 'Gold II' },
  ],
};

// 멤버별 풀이 현황 (problemId -> solved)
const DUMMY_MEMBER_SOLVED: Record<string, Record<number, boolean>> = {
  'test_user1': { 1001: true, 1002: true, 1003: true, 1004: true, 1005: true, 1006: true, 1007: true, 1008: true },
  'test_user2': { 1001: true, 1002: false, 1003: true, 1004: true, 1005: false, 1006: false, 1007: true, 1008: false },
  'test_user3': { 1001: true, 1002: true, 1003: false, 1004: true, 1005: false, 1006: true, 1007: false, 1008: false },
};

const DUMMY_SUMMARY = {
  totalMembers: 3,
  activeRecent: 3,
  participationRate: 100,
  totalSolvedRecent: 18,
  averageSolved: 6.0,
  mostActiveDay: '화요일',
};

interface TeamActivityBoardProps {
  teamId: number;
}

export default function TeamActivityBoard({ teamId: _teamId }: TeamActivityBoardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('participation');

  const tabs = [
    { id: 'participation' as TabType, label: '참여 현황', icon: Calendar },
    { id: 'summary' as TabType, label: '팀 요약', icon: TrendingUp },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* 헤더 + 탭 */}
      <div className="border-b border-gray-200 px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">팀 활동</h3>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
            <Construction className="h-3.5 w-3.5" />
            개발중
          </span>
        </div>

        {/* 탭 버튼 */}
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      {/* 탭 콘텐츠 */}
      <div className="p-4 relative">
        {/* 개발중 오버레이 */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/30 z-10 flex flex-col items-center justify-center">
          <div className="bg-orange-100 border border-orange-200 rounded-lg px-4 py-3 text-center shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Construction className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-bold text-orange-700">개발중인 기능입니다</span>
            </div>
            <p className="text-xs text-orange-600">아래 데이터는 예시이며, 곧 실제 데이터로 제공됩니다</p>
          </div>
        </div>
        {activeTab === 'participation' && <ParticipationTab />}
        {activeTab === 'summary' && <SummaryTab />}
      </div>
    </div>
  );
}

// 참여 현황 탭 - 멤버별 날짜별 문제 풀이 현황
function ParticipationTab() {
  const [expandedCell, setExpandedCell] = useState<string | null>(null);

  // 최근 7일 날짜 생성
  const getRecentDays = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        dateStr,
        day: date.getDate(),
        weekday: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()],
        isToday: i === 0,
      });
    }
    return days;
  };

  const recentDays = getRecentDays();

  // 해당 날짜의 추천 문제 가져오기
  const getProblemsForDate = (dateStr: string) => {
    return DUMMY_DAILY_PROBLEMS[dateStr] || [];
  };

  // 멤버의 특정 날짜 풀이 현황
  const getMemberDayStats = (handle: string, dateStr: string) => {
    const problems = getProblemsForDate(dateStr);
    const memberSolved = DUMMY_MEMBER_SOLVED[handle] || {};
    const solvedCount = problems.filter(p => memberSolved[p.id]).length;
    return { solvedCount, totalCount: problems.length };
  };

  // 멤버의 전체 풀이 수
  const getMemberTotalSolved = (handle: string) => {
    const memberSolved = DUMMY_MEMBER_SOLVED[handle] || {};
    return Object.values(memberSolved).filter(Boolean).length;
  };

  // 셀 클릭 토글
  const toggleCell = (handle: string, dateStr: string) => {
    const key = `${handle}:${dateStr}`;
    setExpandedCell(expandedCell === key ? null : key);
  };

  return (
    <div className="space-y-3">
      {/* 날짜 헤더 */}
      <div className="flex items-center">
        <div className="w-32 flex-shrink-0" />
        <div className="flex-1 flex">
          {recentDays.map((date) => (
            <div
              key={date.dateStr}
              className={`flex-1 text-center text-xs font-medium ${
                date.isToday ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <div>{date.day}</div>
              <div className="text-[10px]">{date.weekday}</div>
            </div>
          ))}
        </div>
        <div className="w-16 flex-shrink-0 text-center text-xs font-medium text-gray-500">
          연속
        </div>
      </div>

      {/* 멤버별 행 */}
      {DUMMY_MEMBERS.map((member) => {
        const totalSolved = getMemberTotalSolved(member.handle);

        return (
          <div key={member.handle} className="space-y-1">
            {/* 멤버 행 */}
            <div
              className={`flex items-center rounded-lg p-2 ${
                member.isMe ? 'bg-blue-50' : 'bg-gray-50'
              }`}
            >
              {/* 멤버 정보 */}
              <div className="w-32 flex-shrink-0 flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium">
                  {member.handle[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    @{member.handle.slice(0, 8)}
                    {member.isMe && <span className="text-blue-600 ml-0.5">(나)</span>}
                  </p>
                  <p className="text-[10px] text-gray-500">{totalSolved}문제</p>
                </div>
              </div>

              {/* 날짜별 셀 */}
              <div className="flex-1 flex gap-1">
                {recentDays.map((date) => {
                  const { solvedCount, totalCount } = getMemberDayStats(member.handle, date.dateStr);
                  const hasData = totalCount > 0;
                  const allSolved = hasData && solvedCount === totalCount;
                  const cellKey = `${member.handle}:${date.dateStr}`;
                  const isExpanded = expandedCell === cellKey;

                  return (
                    <button
                      key={date.dateStr}
                      onClick={() => hasData && toggleCell(member.handle, date.dateStr)}
                      disabled={!hasData}
                      className={`flex-1 h-8 rounded text-xs font-medium transition-all ${
                        !hasData
                          ? 'bg-gray-200 text-gray-400 cursor-default'
                          : allSolved
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
                      } ${isExpanded ? 'ring-2 ring-blue-500' : ''}`}
                      title={hasData ? `${solvedCount}/${totalCount} 완료` : '추천 없음'}
                    >
                      {hasData ? `${solvedCount}/${totalCount}` : '-'}
                    </button>
                  );
                })}
              </div>

              {/* 연속 참여일 */}
              <div className="w-16 flex-shrink-0 flex items-center justify-center gap-1">
                {member.streak > 0 && <Flame className="h-3.5 w-3.5 text-orange-500" />}
                <span className={`text-xs font-bold ${member.streak > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                  {member.streak}일
                </span>
              </div>
            </div>

            {/* 확장된 문제 상세 - 다른 멤버 풀이 현황도 표시 */}
            {recentDays.map((date) => {
              const cellKey = `${member.handle}:${date.dateStr}`;
              if (expandedCell !== cellKey) return null;

              const problems = getProblemsForDate(date.dateStr);
              if (problems.length === 0) return null;

              const memberSolved = DUMMY_MEMBER_SOLVED[member.handle] || {};

              return (
                <div
                  key={`detail-${cellKey}`}
                  className="ml-4 bg-white border border-gray-200 rounded-lg p-3 space-y-2"
                >
                  <p className="text-xs font-medium text-gray-600">
                    {date.day}일 ({date.weekday}) 추천 문제
                  </p>
                  {problems.map((problem) => {
                    const isSolved = memberSolved[problem.id] || false;

                    return (
                      <div
                        key={problem.id}
                        className={`flex items-center gap-2 text-sm ${
                          isSolved ? 'text-gray-700' : 'text-gray-400'
                        }`}
                      >
                        {isSolved ? (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                        )}
                        <span className="truncate font-medium">#{problem.id} {problem.title}</span>
                        <span className="text-xs text-gray-400 flex-shrink-0">({problem.tier})</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* 범례 */}
      <div className="flex items-center gap-4 pt-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span>전체 완료</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-yellow-400" />
          <span>일부 완료</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gray-200" />
          <span>추천 없음</span>
        </div>
      </div>
    </div>
  );
}


// 팀 요약 탭
function SummaryTab() {
  const data = DUMMY_SUMMARY;

  return (
    <div className="space-y-4">
      {/* 참여율 카드 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-600 font-medium">최근 7일 참여율</p>
            <p className="text-2xl font-bold text-blue-700">{data.participationRate}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {data.totalMembers}명 중 {data.activeRecent}명 참여
            </p>
          </div>
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* 통계 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">최근 7일 총 풀이</p>
          <p className="text-xl font-bold text-gray-900">{data.totalSolvedRecent}문제</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">1인당 평균</p>
          <p className="text-xl font-bold text-gray-900">{data.averageSolved}문제</p>
        </div>
      </div>

      {/* 추가 인사이트 */}
      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-green-600" />
          <p className="text-sm text-green-700">
            가장 활발한 요일: <span className="font-bold">{data.mostActiveDay}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
