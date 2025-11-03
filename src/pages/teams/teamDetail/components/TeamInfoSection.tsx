import { useMemo } from 'react';
import { getTierName } from '../../../../utils/tierUtils';
import { sortDayNames } from '../../../../utils/dayUtils';
import type { TeamRecommendationSettingsResponse, SolvedacTier } from '../../../../api/teams';

interface TeamInfoSectionProps {
  memberCount: number;
  recommendationSettings: TeamRecommendationSettingsResponse | null;
}

export default function TeamInfoSection({
  memberCount,
  recommendationSettings,
}: TeamInfoSectionProps) {
  // 추천 요일 정렬 (월~일 순서)
  const sortedDayNames = useMemo(() => {
    if (!recommendationSettings?.recommendationDayNames) return [];
    return sortDayNames(recommendationSettings.recommendationDayNames);
  }, [recommendationSettings?.recommendationDayNames]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">팀 정보</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">팀원</span>
          <span className="font-medium">{memberCount}명</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">문제 추천</span>
          <span className={recommendationSettings?.isActive ? 'text-green-600 font-medium' : 'text-gray-400'}>
            {recommendationSettings?.isActive ? '활성' : '비활성'}
          </span>
        </div>
        {recommendationSettings?.isActive && (
          <>
            {(recommendationSettings.minTierName && recommendationSettings.maxTierName) ||
             (recommendationSettings.customMinLevel && recommendationSettings.customMaxLevel) ? (
              <div className="flex justify-between">
                <span className="text-gray-500">문제 난이도</span>
                <span className="font-medium text-gray-900 text-sm">
                  {recommendationSettings.minTierName && recommendationSettings.maxTierName
                    ? `${recommendationSettings.minTierName} ~ ${recommendationSettings.maxTierName}`
                    : `${getTierName(recommendationSettings.customMinLevel as SolvedacTier)} ~ ${getTierName(recommendationSettings.customMaxLevel as SolvedacTier)}`
                  }
                </span>
              </div>
            ) : null}
            {sortedDayNames.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1.5">추천 요일</p>
                <div className="flex flex-wrap gap-1">
                  {sortedDayNames.map((day) => (
                    <span key={day} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
