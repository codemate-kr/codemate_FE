import { memo } from 'react';
import { Users, Crown, ChevronRight, Lock } from 'lucide-react';
import Tooltip from '../../../components/common/Tooltip';
import type { MyTeamResponse } from '../../../api/teams';

interface TeamCardProps {
  team: MyTeamResponse;
  onClick?: () => void;
  isInteractive?: boolean;
}

export const TeamCard = memo(function TeamCard({
  team,
  onClick,
  isInteractive = true,
}: TeamCardProps) {
  return (
    <div
      onClick={isInteractive ? onClick : undefined}
      className={`bg-white overflow-hidden rounded-lg border border-gray-200 ${
        isInteractive
          ? 'group cursor-pointer hover:shadow-md transition-all hover:border-gray-400'
          : 'cursor-default'
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0 mt-1">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {team.teamName}
                </h3>
                {team.isPrivate && (
                  <Tooltip text="비공개 팀">
                    <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </Tooltip>
                )}
                {team.myRole === 'LEADER' && (
                  <Tooltip text="팀장">
                    <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  </Tooltip>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {team.teamDescription || '설명이 없습니다'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <Tooltip text="멤버 수">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-1.5" />
                  <span className="font-medium">{team.memberCount}명</span>
                </div>
              </Tooltip>
              <span className={`px-2.5 py-1 text-xs font-medium rounded ${
                team.myRole === 'LEADER'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {team.myRole === 'LEADER' ? '팀장' : '팀원'}
              </span>
              {team.isRecommendationActive && (
                <Tooltip text="문제 추천 활성화됨">
                  <span className="px-2.5 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                    추천 활성
                  </span>
                </Tooltip>
              )}
            </div>
            <ChevronRight className={`h-5 w-5 text-gray-400 ${
              isInteractive ? 'group-hover:text-blue-600 transition-colors' : ''
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
});
