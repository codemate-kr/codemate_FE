import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TeamActivityDailyActivity, TeamActivityMember, TeamMemberResponse } from '../../../../../api/teams';
import type { SquadResponse } from '../../../../../api/squads';
import type { DayInfo, RowItem, SelectedCellInfo } from './types';
import { getCellColor, getMemberDayStatsFromApi, getRecentDays, truncateHandle } from './utils';
import { DayRangeToggle, Legend, MemberAvatar } from './common';

interface ParticipationTabProps {
  members: TeamActivityMember[];
  dailyActivities: TeamActivityDailyActivity[];
  currentMemberId: number;
  selectedCellInfo: SelectedCellInfo | null;
  onCellSelect: (info: SelectedCellInfo | null) => void;
  squads?: SquadResponse[];
  teamMembers?: TeamMemberResponse[];
  dayRange: 7 | 30;
  onDayRangeChange: (range: 7 | 30) => void;
}

export default function ParticipationTab({
  members,
  dailyActivities,
  currentMemberId,
  selectedCellInfo,
  onCellSelect,
  squads,
  teamMembers,
  dayRange,
  onDayRangeChange,
}: ParticipationTabProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const recentDays = getRecentDays(dayRange);
  const [viewMode, setViewMode] = useState<'squad' | 'integrated'>('squad');
  const [sortMode, setSortMode] = useState<'default' | 'handle' | 'solved'>('default');

  const solvedTotalsByMemberId = useMemo(() => {
    const totals = new Map<number, number>();
    members.forEach((member) => {
      const solvedTotal = recentDays.reduce((acc, day) => {
        const stats = getMemberDayStatsFromApi(member.memberId, day.dateStr, dailyActivities);
        return acc + stats.solvedCount;
      }, 0);
      totals.set(member.memberId, solvedTotal);
    });
    return totals;
  }, [members, recentDays, dailyActivities]);

  useEffect(() => {
    if (dayRange === 30 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [dayRange]);

  const scrollBy = useCallback((direction: 'left' | 'right') => {
    scrollContainerRef.current?.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
  }, []);

  const rows = useMemo((): RowItem[] => {
    const originalIndexMap = new Map<number, number>();
    members.forEach((member, index) => {
      originalIndexMap.set(member.memberId, index);
    });

    const sortMembers = (targetMembers: TeamActivityMember[]) => {
      if (sortMode === 'handle') {
        return [...targetMembers].sort((a, b) => {
          const compare = (a.handle ?? '').localeCompare(b.handle ?? '', 'ko');
          if (compare !== 0) return compare;
          return a.memberId - b.memberId;
        });
      }

      if (sortMode === 'solved') {
        return [...targetMembers].sort((a, b) => {
          const bSolved = solvedTotalsByMemberId.get(b.memberId) ?? 0;
          const aSolved = solvedTotalsByMemberId.get(a.memberId) ?? 0;
          if (bSolved !== aSolved) return bSolved - aSolved;
          const handleCompare = (a.handle ?? '').localeCompare(b.handle ?? '', 'ko');
          if (handleCompare !== 0) return handleCompare;
          return a.memberId - b.memberId;
        });
      }

      return [...targetMembers].sort((a, b) => {
        const aIndex = originalIndexMap.get(a.memberId) ?? Number.MAX_SAFE_INTEGER;
        const bIndex = originalIndexMap.get(b.memberId) ?? Number.MAX_SAFE_INTEGER;
        return aIndex - bIndex;
      });
    };

    if (!squads || squads.length === 0 || viewMode === 'integrated') {
      return sortMembers(members).map((m) => ({ type: 'member' as const, member: m }));
    }

    // 멤버-스쿼드 매핑은 teamMembers.squadId를 우선 사용하고,
    // 누락된 경우에만 squads[].members를 보조로 사용한다.
    const memberToSquadId = new Map<number, number>();
    (teamMembers ?? []).forEach((m) => {
      if (typeof m.squadId === 'number') {
        memberToSquadId.set(m.memberId, m.squadId);
      }
    });
    squads.forEach((squad) => {
      (squad.members ?? []).forEach((m) => {
        if (!memberToSquadId.has(m.memberId)) {
          memberToSquadId.set(m.memberId, squad.squadId);
        }
      });
    });

    const result: RowItem[] = [];
    squads.forEach((squad) => {
      const squadMembers = sortMembers(
        members.filter((m) => memberToSquadId.get(m.memberId) === squad.squadId)
      );
      if (squadMembers.length === 0) return;
      result.push({ type: 'divider' as const, squadName: squad.squadName });
      squadMembers.forEach((m) => {
        result.push({ type: 'member' as const, member: m });
      });
    });
    const assignedIds = new Set<number>(memberToSquadId.keys());
    const unassigned = sortMembers(members.filter((m) => !assignedIds.has(m.memberId)));
    if (unassigned.length > 0) {
      result.push({ type: 'divider' as const, squadName: '미배정' });
      unassigned.forEach((m) => {
        result.push({ type: 'member' as const, member: m });
      });
    }
    return result;
  }, [members, squads, teamMembers, viewMode, sortMode, solvedTotalsByMemberId]);

  const cellStatsMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getMemberDayStatsFromApi>>();
    rows.forEach((row) => {
      if (row.type !== 'member') return;
      recentDays.forEach((date) => {
        const key = `${row.member.memberId}:${date.dateStr}`;
        map.set(key, getMemberDayStatsFromApi(row.member.memberId, date.dateStr, dailyActivities));
      });
    });
    return map;
  }, [rows, recentDays, dailyActivities]);

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
    onDayRangeChange(range);
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

  const isThirtyDays = dayRange === 30;
  const dynamicGridMinWidth = `${recentDays.length * 2.25 + Math.max(recentDays.length - 1, 0) * 0.25}rem`;
  const rightColumnWrapperClass = isThirtyDays
    ? 'flex-1 overflow-x-auto scrollbar-hide'
    : 'flex-1';
  const rightColumnInnerClass = isThirtyDays
    ? 'space-y-2 max-sm:space-y-1.5'
    : 'space-y-2 max-sm:space-y-1.5';
  const dayHeaderCellClass = isThirtyDays
    ? 'w-9 max-sm:w-7 flex-shrink-0'
    : 'flex-1';
  const memberRowContainerClass = isThirtyDays
    ? 'flex gap-1 max-sm:gap-0.5 h-10 max-sm:h-8 items-center'
    : 'flex-1 flex gap-1 max-sm:gap-0.5 justify-between h-10 max-sm:h-8 items-center';
  const dayCellButtonClass = isThirtyDays
    ? 'w-9 max-sm:w-7 h-9 max-sm:h-7 flex-shrink-0'
    : 'flex-1 h-9 max-sm:h-7';

  const viewModeOptions: Array<{ value: 'squad' | 'integrated'; label: string }> = [
    { value: 'squad', label: '스쿼드별' },
    { value: 'integrated', label: '팀 통합' },
  ];

  const sortModeOptions: Array<{ value: 'default' | 'handle' | 'solved'; label: string }> = [
    { value: 'default', label: '기본순' },
    { value: 'handle', label: '핸들순' },
    { value: 'solved', label: '해결순' },
  ];

  const filterGroupClass = 'flex items-center bg-gray-100 rounded-md p-0.5';
  const filterButtonClass = (isActive: boolean) => `px-2 py-1 text-xs font-medium rounded transition-colors ${
    isActive
      ? 'bg-white text-blue-600 shadow-sm'
      : 'text-gray-500 hover:text-gray-700'
  }`;

  return (
    <div className="space-y-2 max-sm:space-y-1.5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <DayRangeToggle dayRange={dayRange} onChange={handleDayRangeChange} compact />

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-gray-500">보기</span>
            <div className={filterGroupClass}>
              {viewModeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setViewMode(option.value)}
                  className={filterButtonClass(viewMode === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-gray-500">정렬</span>
            <div className={filterGroupClass}>
              {sortModeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortMode(option.value)}
                  className={filterButtonClass(sortMode === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="flex-shrink-0 w-40 max-sm:w-24 space-y-2 max-sm:space-y-1.5">
          <div className="h-7 max-sm:h-5" />
          {rows.map((row, i) => {
            if (row.type === 'divider') {
              return (
                <div key={`div-${row.squadName}-${i}`} className="h-4 flex items-end pr-2 max-sm:pr-1">
                  <span className="text-[10px] max-sm:text-[9px] font-semibold text-slate-400 tracking-wide">{row.squadName}</span>
                </div>
              );
            }
            const member = row.member;
            const isMe = member.memberId === currentMemberId;
            return (
              <div key={member.memberId} className={`flex items-center gap-2 max-sm:gap-1 pr-2 max-sm:pr-1 h-10 max-sm:h-8 rounded-l ${isMe ? 'bg-blue-50' : ''}`}>
                <MemberAvatar handle={member.handle} isMe={isMe} />
                {member.handle ? (
                  <a
                    href={`https://www.acmicpc.net/user/${member.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs max-sm:text-[10px] font-medium text-gray-700 truncate hover:text-blue-600 hover:underline transition-colors"
                  >
                    {truncateHandle(member.handle)}
                  </a>
                ) : (
                  <p className="text-xs max-sm:text-[10px] font-medium text-gray-700 truncate">(미인증)</p>
                )}
              </div>
            );
          })}
        </div>

        <div className={rightColumnWrapperClass} ref={scrollContainerRef}>
          <div className={rightColumnInnerClass} style={isThirtyDays ? { minWidth: dynamicGridMinWidth } : undefined}>
            <div className="flex gap-1 max-sm:gap-0.5 h-7 max-sm:h-5 items-center">
              {recentDays.map((date) => (
                <div key={date.dateStr} className={`${dayHeaderCellClass} ${getDateHeaderClass(date)}`}>
                  <div className="text-[10px] max-sm:text-[9px]">{date.day}</div>
                  <div className="text-[10px] max-sm:text-[9px]">{date.isToday ? '(오늘)' : date.weekday}</div>
                </div>
              ))}
            </div>

            {rows.map((row, i) => {
              if (row.type === 'divider') {
                return (
                  <div key={`div-${row.squadName}-${i}`} className="flex gap-1 max-sm:gap-0.5 h-4 items-center">
                    {isThirtyDays ? (
                      <div className="w-full border-t border-dashed border-gray-200" />
                    ) : (
                      <div className="flex-1 border-t border-dashed border-gray-200" />
                    )}
                  </div>
                );
              }
              const member = row.member;
              return (
                <div key={member.memberId} className={memberRowContainerClass}>
                  {recentDays.map((date, dateIndex) => {
                    const { solvedCount, totalCount } = cellStatsMap.get(`${member.memberId}:${date.dateStr}`)
                      ?? { solvedCount: 0, totalCount: 0, problems: [], memberSolved: {} };
                    return (
                      <button
                        key={date.dateStr}
                        onClick={() => totalCount > 0 && handleCellClick(member, date.dateStr, dateIndex, date)}
                        disabled={totalCount === 0}
                        className={`${dayCellButtonClass} ${getCellClass(solvedCount, totalCount)}`}
                      >
                        {totalCount === 0 ? '-' : `${solvedCount}/${totalCount}`}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isThirtyDays && (
        <div className="flex justify-center gap-2 pt-2">
          <button onClick={() => scrollBy('left')} className="p-1.5 max-sm:p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
            <ChevronLeft className="w-4 h-4 max-sm:w-3.5 max-sm:h-3.5" />
          </button>
          <button onClick={() => scrollBy('right')} className="p-1.5 max-sm:p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
            <ChevronRight className="w-4 h-4 max-sm:w-3.5 max-sm:h-3.5" />
          </button>
        </div>
      )}
      <Legend />
    </div>
  );
}
