import { Mail, Calendar, Target, Hash, Tag } from 'lucide-react';
import type { ProblemDifficultyPreset, RecommendationDayOfWeek } from '../../../../api/teams';
import { getTierShortName } from '../../../../utils/tierUtils';
import { getTagNames } from '../../../../constants/algorithmTags';

interface SettingsSummaryProps {
  selectedDays: RecommendationDayOfWeek[];
  selectedPreset: ProblemDifficultyPreset | null;
  minProblemLevel: number | null;
  maxProblemLevel: number | null;
  problemCount: number;
  selectedTags: string[];
}

const weekDays: Array<{ key: RecommendationDayOfWeek; label: string; order: number }> = [
  { key: 'MONDAY', label: '월', order: 1 },
  { key: 'TUESDAY', label: '화', order: 2 },
  { key: 'WEDNESDAY', label: '수', order: 3 },
  { key: 'THURSDAY', label: '목', order: 4 },
  { key: 'FRIDAY', label: '금', order: 5 },
  { key: 'SATURDAY', label: '토', order: 6 },
  { key: 'SUNDAY', label: '일', order: 7 },
];

function getDifficultyLabel(
  preset: ProblemDifficultyPreset | null,
  minLevel: number | null,
  maxLevel: number | null
): string {
  if (!preset) return '미설정';
  switch (preset) {
    case 'EASY':
      return '쉬움 (브론즈Ⅰ~실버Ⅲ)';
    case 'NORMAL':
      return '보통 (실버Ⅱ~골드Ⅳ)';
    case 'HARD':
      return '어려움 (골드Ⅲ~플래티넘Ⅴ)';
    case 'CUSTOM':
      if (minLevel && maxLevel) {
        return `커스텀 (${getTierShortName(minLevel)}~${getTierShortName(maxLevel)})`;
      }
      return '커스텀';
    default:
      return '미설정';
  }
}

export function SettingsSummary({
  selectedDays,
  selectedPreset,
  minProblemLevel,
  maxProblemLevel,
  problemCount,
  selectedTags,
}: SettingsSummaryProps) {
  const sortedDays = [...selectedDays].sort((a, b) => {
    const orderA = weekDays.find((d) => d.key === a)?.order || 0;
    const orderB = weekDays.find((d) => d.key === b)?.order || 0;
    return orderA - orderB;
  });

  const dayLabels = sortedDays
    .map((day) => weekDays.find((d) => d.key === day)?.label)
    .filter(Boolean)
    .join(', ');

  const tagNames = getTagNames(selectedTags);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-1.5 bg-blue-100 rounded-lg">
          <Mail className="h-4 w-4 text-blue-600" />
        </div>
        <h4 className="text-sm font-bold text-gray-900">설정 요약</h4>
      </div>

      <div className="space-y-3">
        {/* 요일 */}
        <div className="flex items-start space-x-2">
          <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">추천 요일</p>
            <p className="text-sm font-medium text-gray-900">
              {dayLabels || '미선택'}
            </p>
          </div>
        </div>

        {/* 난이도 */}
        <div className="flex items-start space-x-2">
          <Target className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">난이도</p>
            <p className="text-sm font-medium text-gray-900">
              {getDifficultyLabel(selectedPreset, minProblemLevel, maxProblemLevel)}
            </p>
          </div>
        </div>

        {/* 문제 수 */}
        <div className="flex items-start space-x-2">
          <Hash className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">문제 수</p>
            <p className="text-sm font-medium text-gray-900">{problemCount}문제</p>
          </div>
        </div>

        {/* 알고리즘 태그 */}
        <div className="flex items-start space-x-2">
          <Tag className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500">알고리즘 태그</p>
            {tagNames.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {tagNames.map((name) => (
                  <span
                    key={name}
                    className="inline-block px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded"
                  >
                    {name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm font-medium text-gray-900">전체</p>
            )}
          </div>
        </div>
      </div>

      {/* 전송 시간 안내 */}
      {selectedDays.length > 0 && (
        <div className="mt-4 pt-3 border-t border-blue-100">
          <p className="text-xs text-gray-600">
            매주 <span className="font-semibold text-blue-700">{dayLabels}</span>요일{' '}
            <span className="font-semibold text-blue-700">오전 9시</span>에 문제가 추천됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
