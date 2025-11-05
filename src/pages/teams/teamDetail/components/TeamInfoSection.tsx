import { useMemo } from 'react';
import { getTierName } from '../../../../utils/tierUtils';
import { DayToKorean } from '../../../../utils/dayUtils';
import type { TeamRecommendationSettingsResponse, SolvedacTier } from '../../../../api/teams';

interface TeamInfoSectionProps {
  memberCount: number;
  recommendationSettings: TeamRecommendationSettingsResponse | null;
}

export default function TeamInfoSection({
  memberCount,
  recommendationSettings,
}: TeamInfoSectionProps) {

  //영어 요일을 한국어로 변환
  const koreanDays = useMemo(() => {
    if (!recommendationSettings?.recommendationDays) return [];
    return DayToKorean(recommendationSettings.recommendationDays);
  }, [recommendationSettings?.recommendationDays]);

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
            {recommendationSettings.problemDifficultyPreset && (
              <div className="flex justify-between">
                <span className="text-gray-500">문제 난이도</span>
                <span className="font-medium text-gray-900 text-sm">
                  {recommendationSettings.minProblemLevel && recommendationSettings.maxProblemLevel
                    ? `${getTierName(recommendationSettings.minProblemLevel as SolvedacTier)} ~ ${getTierName(recommendationSettings.maxProblemLevel as SolvedacTier)}`
                    : ''}
                </span>
              </div>
            )}
            {koreanDays.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1.5">추천 요일</p>
                <div className="flex flex-wrap gap-1">
                  {koreanDays.map((day) => (
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
