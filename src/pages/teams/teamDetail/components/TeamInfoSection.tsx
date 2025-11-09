import { useMemo } from 'react';
import { getTierName, getTierColor } from '../../../../utils/tierUtils';
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

  // 모든 요일 정의 (월~일)
  const allDays = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

  //영어 요일을 한국어로 변환
  const koreanDays = useMemo(() => {
    if (!recommendationSettings?.recommendationDays) return [];
    return DayToKorean(recommendationSettings.recommendationDays);
  }, [recommendationSettings?.recommendationDays]);

  // 오늘 요일 확인
  const todayDayName = useMemo(() => {
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return days[new Date().getDay()];
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
            {recommendationSettings?.recommendationDays && recommendationSettings.recommendationDays.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">추천 요일</p>
                <div className="flex gap-1">
                  {allDays.map((day) => {
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
}
