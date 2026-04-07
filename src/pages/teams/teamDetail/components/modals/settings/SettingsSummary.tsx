import { Mail, Calendar, Signal, Hash, Tag, Users, HelpCircle, ExternalLink } from 'lucide-react';
import { getTierShortName } from '../../../../../../utils/tierUtils';
import { getTagNames } from '../../../../../../constants/algorithmTags';
import type { ProblemDifficultyPreset, RecommendationDayOfWeek } from '../../../../../../api/teams';

interface SettingsSummaryProps {
  selectedDays: RecommendationDayOfWeek[];
  selectedPreset: ProblemDifficultyPreset | null;
  minProblemLevel: number | null;
  maxProblemLevel: number | null;
  problemCount: number;
  selectedTags: string[];
  onOpenSolvedAcSearch?: () => void;
  canOpenSolvedAcSearch?: boolean;
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
  onOpenSolvedAcSearch,
  canOpenSolvedAcSearch = false,
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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl p-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-1.5 bg-blue-100 dark:bg-slate-800 rounded-lg">
          <Mail className="h-4 w-4 text-blue-600 dark:text-blue-300" />
        </div>
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">설정 요약</h4>
      </div>

      <div className="space-y-3">
        {/* 요일 */}
        <div className="flex items-start space-x-2">
          <Calendar className="h-4 w-4 text-gray-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">추천 요일</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {dayLabels || '미선택'}
            </p>
          </div>
        </div>

        {/* 난이도 */}
        <div className="flex items-start space-x-2">
          <Signal className="h-4 w-4 text-gray-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">난이도</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {getDifficultyLabel(selectedPreset, minProblemLevel, maxProblemLevel)}
            </p>
          </div>
        </div>

        {/* 문제 수 */}
        <div className="flex items-start space-x-2">
          <Hash className="h-4 w-4 text-gray-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">문제 수</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{problemCount}문제</p>
          </div>
        </div>

        {/* 해결자 수 */}
        <div className="flex items-start space-x-2">
          <Users className="h-4 w-4 text-gray-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xs text-gray-500 dark:text-slate-400">해결자 수</p>
              <div className="relative group">
                <HelpCircle className="h-3 w-3 text-gray-400 dark:text-slate-500 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  1,000명 이상 해결한 문제 중에서 추천합니다.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">1,000명 이상</p>
          </div>
        </div>

        {/* 알고리즘 태그 */}
        <div className="flex items-start space-x-2">
          <Tag className="h-4 w-4 text-gray-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 dark:text-slate-400">알고리즘 태그</p>
            {tagNames.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {tagNames.map((name) => (
                  <span
                    key={name}
                    className="inline-block px-1.5 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                  >
                    {name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">전체</p>
            )}
          </div>
        </div>
      </div>

      {/* 전송 시간 안내 */}
      {selectedDays.length > 0 && (
        <div className="mt-4 pt-3 border-t border-blue-100 dark:border-slate-700">
          <p className="text-xs text-gray-600 dark:text-slate-300">
            매주 <span className="font-semibold text-blue-700 dark:text-blue-300">{dayLabels}</span>요일{' '}
            <span className="font-semibold text-blue-700 dark:text-blue-300">오전 9시</span>에 문제가 추천됩니다.
          </p>
        </div>
      )}

      <div className="mt-3">
        <button
          type="button"
          onClick={onOpenSolvedAcSearch}
          disabled={!canOpenSolvedAcSearch}
          className="w-full px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-1.5"
          title={!canOpenSolvedAcSearch ? '난이도 또는 태그를 설정하면 이동할 수 있습니다.' : undefined}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>추천 문제 후보 보기</span>
        </button>
        <p className="mt-1.5 text-[11px] text-gray-500 dark:text-slate-400">solved.ac 검색 결과로 이동합니다.</p>
      </div>
    </div>
  );
}
