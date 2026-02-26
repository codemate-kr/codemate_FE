import { useEffect, useRef, useState } from 'react';
import { Users, Calendar, Trophy } from 'lucide-react';
import { teamsApi, type TeamActivityMember, type TeamActivityResponse, type TeamLeaderboardResponse, type TeamMemberResponse } from '../../../../api/teams';
import type { SquadResponse } from '../../../../api/squads';
import ParticipationTab from './activityBoard/ParticipationTab';
import LeaderboardTab from './activityBoard/LeaderboardTab';
import { ProblemDetail } from './activityBoard/ProblemDetail';
import type { SelectedCellInfo, TabType } from './activityBoard/types';

export { ProblemDetail };
export type { SelectedCellInfo };

interface TeamActivityBoardProps {
  teamId: number;
  activityData: TeamActivityResponse | null;
  loading?: boolean;
  reloadKey?: number;
  onCellSelect?: (info: SelectedCellInfo | null) => void;
  squads?: SquadResponse[];
  teamMembers?: TeamMemberResponse[];
  isDemo?: boolean;
}

const participationInFlight = new Map<string, Promise<TeamActivityResponse>>();
const leaderboardInFlight = new Map<string, Promise<TeamLeaderboardResponse>>();

export default function TeamActivityBoard({
  teamId,
  activityData,
  loading = false,
  reloadKey = 0,
  onCellSelect,
  squads,
  teamMembers,
  isDemo = false,
}: TeamActivityBoardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('participation');
  const [selectedCellInfo, setSelectedCellInfo] = useState<SelectedCellInfo | null>(null);
  const [participationDayRange, setParticipationDayRange] = useState<7 | 30>(7);
  const [participationLoading, setParticipationLoading] = useState(!isDemo);
  const [participationDataByRange, setParticipationDataByRange] = useState<Partial<Record<7 | 30, TeamActivityResponse>>>(() => {
    if (!activityData) return {};
    const days = activityData.period?.days;
    if (days !== 7 && days !== 30) return {};
    return { [days]: activityData };
  });
  const [leaderboardDayRange, setLeaderboardDayRange] = useState<7 | 30>(30);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardMembers, setLeaderboardMembers] = useState<TeamActivityMember[]>([]);
  const [leaderboardCurrentMemberId, setLeaderboardCurrentMemberId] = useState(0);
  const [lastParticipationData, setLastParticipationData] = useState<TeamActivityResponse | null>(activityData);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

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
  };

  useEffect(() => {
    if (!activityData) return;
    const days = activityData.period?.days;
    if (days !== 7 && days !== 30) return;
    setParticipationDataByRange((prev) => ({
      ...prev,
      [days]: activityData,
    }));
  }, [activityData]);

  useEffect(() => {
    if (isDemo || !teamId || reloadKey === 0) return;
    setParticipationDataByRange({});
    if (activeTab === 'leaderboard') {
      setLeaderboardMembers([]);
      setLeaderboardCurrentMemberId(0);
    }
    setSelectedCellInfo(null);
    onCellSelect?.(null);
  }, [isDemo, teamId, reloadKey, activeTab, onCellSelect]);

  const cachedParticipationData = participationDataByRange[participationDayRange] ?? null;

  useEffect(() => {
    if (cachedParticipationData) {
      setLastParticipationData(cachedParticipationData);
    }
  }, [cachedParticipationData]);

  useEffect(() => {
    if (activeTab !== 'participation') return;
    if (!teamId) return;
    if (isDemo) return;
    if (cachedParticipationData) return;

    let cancelled = false;
    const requestKey = `${teamId}:${participationDayRange}`;
    const request = participationInFlight.get(requestKey)
      ?? teamsApi.getTeamActivityParticipationV2(teamId, participationDayRange);
    if (!participationInFlight.has(requestKey)) {
      participationInFlight.set(requestKey, request);
      void request.finally(() => {
        participationInFlight.delete(requestKey);
      });
    }

    setParticipationLoading(true);
    request
      .then((response) => {
        if (cancelled) return;
        setParticipationDataByRange((prev) => ({
          ...prev,
          [participationDayRange]: response,
        }));
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('참여 현황 로드 실패:', error);
      })
      .finally(() => {
        if (cancelled) return;
        setParticipationLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, teamId, isDemo, participationDayRange, cachedParticipationData]);

  useEffect(() => {
    if (!activityData) return;
    setLeaderboardMembers(activityData.members);
    setLeaderboardCurrentMemberId(activityData.currentMemberId);
  }, [activityData]);

  useEffect(() => {
    if (activeTab !== 'leaderboard') return;
    if (!teamId) return;
    if (isDemo) return;

    let cancelled = false;
    const requestKey = `${teamId}:${leaderboardDayRange}`;
    const request = leaderboardInFlight.get(requestKey)
      ?? teamsApi.getTeamLeaderboardV2(teamId, leaderboardDayRange);
    if (!leaderboardInFlight.has(requestKey)) {
      leaderboardInFlight.set(requestKey, request);
      void request.finally(() => {
        leaderboardInFlight.delete(requestKey);
      });
    }

    setLeaderboardLoading(true);
    request
      .then((response) => {
        if (cancelled) return;
        setLeaderboardMembers(response.memberRanks.map((member) => ({
          memberId: member.memberId,
          handle: member.handle,
          rank: member.rank,
          totalSolved: member.totalSolved,
        })));
        setLeaderboardCurrentMemberId(response.currentMemberId);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('리더보드 로드 실패:', error);
      })
      .finally(() => {
        if (cancelled) return;
        setLeaderboardLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, teamId, isDemo, leaderboardDayRange]);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const updateHeight = () => {
      setContentHeight(node.getBoundingClientRect().height);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });
    resizeObserver.observe(node);

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeTab]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 max-sm:p-6">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <div className="w-5 h-5 max-sm:w-4 max-sm:h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-sm max-sm:text-xs">팀 활동 현황을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  const currentParticipationData = cachedParticipationData ?? lastParticipationData ?? null;
  const participationMembers = currentParticipationData?.members ?? [];
  const participationDailyActivities = currentParticipationData?.dailyActivities ?? [];
  const participationCurrentMemberId = currentParticipationData?.currentMemberId ?? 0;
  const isActiveLoading = activeTab === 'participation' ? participationLoading : leaderboardLoading;

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="border-b border-gray-200 px-4 max-sm:px-3 pt-4 max-sm:pt-3">
        <div className="flex items-center justify-between mb-3 max-sm:mb-2">
          <div className="flex items-center gap-2 max-sm:gap-1.5">
            <Users className="h-5 w-5 max-sm:h-4 max-sm:w-4 text-blue-600" />
            <h3 className="text-sm max-sm:text-xs font-semibold text-gray-900">팀 활동</h3>
          </div>
        </div>
        <div className="flex gap-1 max-sm:gap-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 max-sm:gap-1 px-3 max-sm:px-2 py-2 max-sm:py-1.5 text-sm max-sm:text-xs font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4 max-sm:h-3.5 max-sm:w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 max-sm:p-3">
        <div
          className="relative"
          style={isActiveLoading && contentHeight ? { minHeight: `${contentHeight}px` } : undefined}
        >
          {isActiveLoading && (
            <div className="absolute inset-0 z-10 bg-white/50 pointer-events-none" />
          )}
          <div
            ref={contentRef}
            className={`transition-opacity ${isActiveLoading ? 'opacity-80' : 'opacity-100'}`}
          >
            {activeTab === 'participation' && (
              <ParticipationTab
                members={participationMembers}
                dailyActivities={participationDailyActivities}
                currentMemberId={participationCurrentMemberId}
                selectedCellInfo={selectedCellInfo}
                onCellSelect={handleCellSelect}
                squads={squads}
                teamMembers={teamMembers}
                dayRange={participationDayRange}
                onDayRangeChange={setParticipationDayRange}
              />
            )}
            {activeTab === 'leaderboard' && (
              <LeaderboardTab
                members={leaderboardMembers}
                currentMemberId={leaderboardCurrentMemberId}
                dayRange={leaderboardDayRange}
                onDayRangeChange={setLeaderboardDayRange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
