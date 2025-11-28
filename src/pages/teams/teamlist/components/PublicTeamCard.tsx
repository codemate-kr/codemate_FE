import { memo } from 'react';
import { Users, Calendar, ChevronRight, Crown } from 'lucide-react';
import { getTierName, getTierColor } from '../../../../utils/tierUtils';
import type { PublicTeamResponse } from '../../../../api/teams';

interface PublicTeamCardProps {
  team: PublicTeamResponse;
  onClick?: () => void;
}

// 영어 요일을 한국어 축약으로 변환
const DAY_MAP: Record<string, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
};

export const PublicTeamCard = memo(function PublicTeamCard({
  team,
  onClick,
}: PublicTeamCardProps) {
  const days = team.recommendationDays?.map(d => DAY_MAP[d] || d).join(',') || '';

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
    >
      <div className="p-4 flex items-center justify-between gap-4">
        {/* 왼쪽: 팀 정보 */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            {/* 팀 이름 + 팀장 */}
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {team.teamName}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                <Crown className="h-3.5 w-3.5 text-yellow-500" />
                <span>{team.leaderHandle}</span>
              </div>
            </div>

            {/* 설명 */}
            {team.description && (
              <p className="text-sm text-gray-500 mt-1 truncate">
                {team.description}
              </p>
            )}

            {/* 메타 정보 */}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-gray-400" />
                <span>{team.memberCount}명</span>
              </div>
              {team.minProblemLevel > 0 && team.maxProblemLevel > 0 && (
                <div className="flex items-center gap-1">
                  <span className={`font-medium px-1.5 py-0.5 rounded text-xs ${getTierColor(team.minProblemLevel)}`}>
                    {getTierName(team.minProblemLevel)}
                  </span>
                  <span className="text-gray-400">~</span>
                  <span className={`font-medium px-1.5 py-0.5 rounded text-xs ${getTierColor(team.maxProblemLevel)}`}>
                    {getTierName(team.maxProblemLevel)}
                  </span>
                </div>
              )}
              {days && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  <span>{days}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽: 화살표 */}
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
      </div>
    </div>
  );
});
