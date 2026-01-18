import { memo, useMemo } from 'react';
import { getTierName, getTierColor } from '../../../../utils/tierUtils';
import { DayToKorean } from '../../../../utils/dayUtils';
import { getTagNames } from '../../../../constants/algorithmTags';
import type { TeamRecommendationSettingsResponse, SolvedacTier } from '../../../../api/teams';
import NewBadge from '../../../../components/common/NewBadge';

// 상수를 컴포넌트 외부로 추출
const ALL_DAYS = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'] as const;
const DAYS_FROM_SUNDAY = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'] as const;

interface TeamInfoSectionProps {
  memberCount: number;
  recommendationSettings: TeamRecommendationSettingsResponse | null;
}

export default memo(function TeamInfoSection({
  memberCount,
  recommendationSettings,
}: TeamInfoSectionProps) {
  // 영어 요일을 한국어로 변환
  const koreanDays = useMemo(() => {
    if (!recommendationSettings?.recommendationDays) return [];
    return DayToKorean(recommendationSettings.recommendationDays);
  }, [recommendationSettings?.recommendationDays]);

  // 오늘 요일 확인
  const todayDayName = useMemo(() => {
    return DAYS_FROM_SUNDAY[new Date().getDay()];
  }, []);

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
              <div className="flex justify-between items-center">
                <span className="text-gray-500">문제 난이도</span>
                <div className="flex items-center gap-1">
                  {recommendationSettings.minProblemLevel && recommendationSettings.maxProblemLevel && (
                    <>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${getTierColor(recommendationSettings.minProblemLevel as SolvedacTier)}`}>
                        {getTierName(recommendationSettings.minProblemLevel as SolvedacTier)}
                      </span>
                      <span className="text-gray-400 text-xs">~</span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${getTierColor(recommendationSettings.maxProblemLevel as SolvedacTier)}`}>
                        {getTierName(recommendationSettings.maxProblemLevel as SolvedacTier)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
            {/* 알고리즘 태그 */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1.5 mb-2">
                <p className="text-xs text-gray-500">알고리즘 태그</p>
                <NewBadge />
              </div>
              {recommendationSettings?.includeTags && recommendationSettings.includeTags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {getTagNames(recommendationSettings.includeTags).map((tagName) => (
                    <span
                      key={tagName}
                      className="inline-block px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded"
                    >
                      {tagName}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-gray-400">전체</span>
              )}
            </div>
            {recommendationSettings?.recommendationDays && recommendationSettings.recommendationDays.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">추천 요일</p>
                <div className="flex gap-1">
                  {ALL_DAYS.map((day) => {
                    const isActive = koreanDays.includes(day);
                    const isToday = day === todayDayName;
                    return (
                      <div
                        key={day}
                        className={`flex-1 text-center text-xs font-medium py-1.5 rounded-md border transition-all relative ${
                          isActive
                            ? isToday
                              ? 'bg-blue-50 text-blue-600 border-blue-500 shadow-sm'
                              : 'bg-blue-50 text-blue-600 border-blue-200'
                            : 'text-gray-300 border-gray-100'
                        }`}
                      >
                        {isToday && (
                          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        {day.slice(0, 1)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});
