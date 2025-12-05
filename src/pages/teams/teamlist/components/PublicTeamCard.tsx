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

// 티어 레벨을 짧은 이름으로 변환 (모바일용)
const getShortTierName = (level: number): string => {
  const tierPrefixes = ['B', 'S', 'G', 'P', 'D', 'R'];
  const tierIndex = Math.floor((level - 1) / 5);
  const tierNumber = 5 - ((level - 1) % 5);
  return `${tierPrefixes[tierIndex] || '?'}${tierNumber}`;
};

export const PublicTeamCard = memo(function PublicTeamCard({
  team,
  onClick,
}: PublicTeamCardProps) {
  const days = team.recommendationDays?.map(d => DAY_MAP[d] || d).join(',') || '';

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group active:bg-gray-50"
    >
      <div className="p-3 sm:p-4 flex items-center justify-between gap-3">
        {/* 왼쪽: 아이콘 (모바일에서 숨김) */}
        <div className="hidden sm:block flex-shrink-0">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        {/* 팀 정보 */}
        <div className="flex-1 min-w-0">
          {/* 팀 이름 */}
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {team.teamName}
          </h3>

          {/* 설명 */}
          {team.description && (
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
              {team.description}
            </p>
          )}

          {/* 메타 정보 */}
          <div className="flex items-center flex-wrap gap-x-2 sm:gap-x-3 gap-y-1 mt-1.5 sm:mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Crown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-500" />
              <span className="truncate max-w-[80px] sm:max-w-none">@{team.leaderHandle}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400" />
              <span>{team.memberCount}명</span>
            </div>
            {days && team.minProblemLevel > 0 && team.maxProblemLevel > 0 && (
              <>
                {/* 모바일: 짧은 형태 */}
                <div className="flex sm:hidden items-center gap-1">
                  <span className={`font-medium px-1 py-0.5 rounded text-xs ${getTierColor(team.minProblemLevel)}`}>
                    {getShortTierName(team.minProblemLevel)}
                  </span>
                  <span className="text-gray-400">~</span>
                  <span className={`font-medium px-1 py-0.5 rounded text-xs ${getTierColor(team.maxProblemLevel)}`}>
                    {getShortTierName(team.maxProblemLevel)}
                  </span>
                </div>
                {/* 데스크톱: 전체 이름 */}
                <div className="hidden sm:flex items-center gap-1">
                  <span className={`font-medium px-1.5 py-0.5 rounded text-xs ${getTierColor(team.minProblemLevel)}`}>
                    {getTierName(team.minProblemLevel)}
                  </span>
                  <span className="text-gray-400">~</span>
                  <span className={`font-medium px-1.5 py-0.5 rounded text-xs ${getTierColor(team.maxProblemLevel)}`}>
                    {getTierName(team.maxProblemLevel)}
                  </span>
                </div>
              </>
            )}
            {days && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400" />
                <span>{days}</span>
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 화살표 */}
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
      </div>
    </div>
  );
});
