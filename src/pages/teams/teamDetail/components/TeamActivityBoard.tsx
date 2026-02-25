import { useState } from 'react';
import { Users, Calendar, Trophy } from 'lucide-react';
import type { TeamActivityResponse, TeamMemberResponse } from '../../../../api/teams';
import type { SquadResponse } from '../../../../api/squads';
import ParticipationTab from './activityBoard/ParticipationTab';
import LeaderboardTab from './activityBoard/LeaderboardTab';
import { ProblemDetail } from './activityBoard/ProblemDetail';
import type { SelectedCellInfo, TabType } from './activityBoard/types';

export { ProblemDetail };
export type { SelectedCellInfo };

interface TeamActivityBoardProps {
  activityData: TeamActivityResponse | null;
  loading?: boolean;
  onCellSelect?: (info: SelectedCellInfo | null) => void;
  squads?: SquadResponse[];
  teamMembers?: TeamMemberResponse[];
}

export default function TeamActivityBoard({
  activityData,
  loading = false,
  onCellSelect,
  squads,
  teamMembers,
}: TeamActivityBoardProps) {
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

  if (!activityData) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 max-sm:p-6">
        <div className="text-center text-gray-500">
          <p className="text-sm max-sm:text-xs">팀 활동 현황을 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

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
        {activeTab === 'participation' && (
          <ParticipationTab
            members={activityData.members}
            dailyActivities={activityData.dailyActivities}
            currentMemberId={activityData.currentMemberId}
            selectedCellInfo={selectedCellInfo}
            onCellSelect={handleCellSelect}
            squads={squads}
            teamMembers={teamMembers}
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
