import { memo, useMemo } from 'react';
import { Signal, Hash, Users, Tag, Calendar, HelpCircle } from 'lucide-react';
import { getTierName, getTierColor } from '../../../../../utils/tierUtils';
import { DayToKorean } from '../../../../../utils/dayUtils';
import { getTagNames } from '../../../../../constants/algorithmTags';
import type { SolvedacTier } from '../../../../../api/teams';
import type { SquadRecommendationSettingsResponse } from '../../../../../api/squads';
// 상수를 컴포넌트 외부로 추출
const ALL_DAYS = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'] as const;
const DAYS_FROM_SUNDAY = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'] as const;

interface TeamInfoSectionProps {
  recommendationSettings: SquadRecommendationSettingsResponse | null;
}

export default memo(function TeamInfoSection({
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
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">문제 추천 정보</h3>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-800">
          <span className="text-gray-500 dark:text-slate-400">문제 추천</span>
          <span className={recommendationSettings?.isActive ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-400 dark:text-slate-500'}>
            {recommendationSettings?.isActive ? '활성' : '비활성'}
          </span>
        </div>
        {recommendationSettings?.isActive && (
          <>
            {recommendationSettings.problemDifficultyPreset && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Signal className="h-3.5 w-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-gray-500 dark:text-slate-400">난이도</span>
                </div>
                <div className="flex items-center gap-1">
                  {recommendationSettings.minProblemLevel && recommendationSettings.maxProblemLevel && (
                    <>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${getTierColor(recommendationSettings.minProblemLevel as SolvedacTier)}`}>
                        {getTierName(recommendationSettings.minProblemLevel as SolvedacTier)}
                      </span>
                      <span className="text-gray-400 dark:text-slate-500">~</span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${getTierColor(recommendationSettings.maxProblemLevel as SolvedacTier)}`}>
                        {getTierName(recommendationSettings.maxProblemLevel as SolvedacTier)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-gray-400 dark:text-slate-500" />
                <span className="text-gray-500 dark:text-slate-400">문제 수</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">{recommendationSettings.problemCount ?? 3}문제</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-gray-400 dark:text-slate-500" />
                <span className="text-gray-500 dark:text-slate-400">해결자 수</span>
                <div className="relative group">
                  <HelpCircle className="h-3 w-3 text-gray-400 dark:text-slate-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 dark:bg-slate-700 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    1,000명 이상 해결한 문제 중에서 추천합니다.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800 dark:border-t-slate-700"></div>
                  </div>
                </div>
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">1,000명 이상</span>
            </div>
            {/* 알고리즘 태그 */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Tag className="h-3.5 w-3.5 text-gray-400 dark:text-slate-500" />
                <span className="text-gray-500 dark:text-slate-400">알고리즘 태그</span>
              </div>
              {recommendationSettings?.includeTags && recommendationSettings.includeTags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {getTagNames(recommendationSettings.includeTags).map((tagName) => (
                    <span
                      key={tagName}
                      className="inline-block px-1.5 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                    >
                      {tagName}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400 dark:text-slate-500">전체</span>
              )}
            </div>
            {recommendationSettings?.recommendationDays && recommendationSettings.recommendationDays.length > 0 && (
              <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-slate-500" />
                  <span className="text-gray-500 dark:text-slate-400">추천 요일</span>
                </div>
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
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border-blue-500 dark:border-blue-700 shadow-sm'
                              : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-700/70'
                            : 'text-gray-300 dark:text-slate-600 border-gray-100 dark:border-slate-700'
                        }`}
                      >
                        {isToday && (
                          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
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
