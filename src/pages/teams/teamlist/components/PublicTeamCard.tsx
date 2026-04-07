import { memo } from 'react';
import { Users, ChevronRight, Crown } from 'lucide-react';
import { getTierName } from '../../../../utils/tierUtils';
import { getTierIcon } from '../../../../components/common/TierIcon';
import { getTagNames } from '../../../../constants/algorithmTags';
import type { PublicTeamResponse } from '../../../../api/teams';

interface PublicTeamCardProps {
  team: PublicTeamResponse;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
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
  isExpanded,
  onToggle,
  onNavigate,
}: PublicTeamCardProps) {
  const description = team.description?.trim() ?? '';
  const hasDescription = description.length > 0;
  const squadSettings = (team.squads ?? []).map((squad) => {
    const dayLabel = squad.recommendationDays?.map((d) => DAY_MAP[d] || d).join(', ') || '미설정';
    const minLevel = squad.minProblemLevel;
    const maxLevel = squad.maxProblemLevel;
    const hasLevelRange = typeof minLevel === 'number' && typeof maxLevel === 'number';
    const levelLabel = hasLevelRange
      ? `${getTierName(minLevel)} ~ ${getTierName(maxLevel)}`
      : '난이도 미설정';

    return {
      id: squad.squadId,
      name: squad.name,
      isDefault: Boolean(squad.isDefault),
      isActive: squad.isActive,
      memberCount: squad.memberCount ?? 0,
      problemCount: squad.problemCount ?? 3,
      includeTags: squad.includeTags ?? [],
      dayLabel,
      levelLabel,
      minLevel: minLevel ?? null,
      maxLevel: maxLevel ?? null,
    };
  });
  const activeSquadSettings = squadSettings.filter((squad) => squad.isActive);

  const minTeamLevel = activeSquadSettings
    .map((squad) => squad.minLevel)
    .filter((level): level is number => typeof level === 'number')
    .reduce<number | null>((min, level) => (min === null ? level : Math.min(min, level)), null);

  const maxTeamLevel = activeSquadSettings
    .map((squad) => squad.maxLevel)
    .filter((level): level is number => typeof level === 'number')
    .reduce<number | null>((max, level) => (max === null ? level : Math.max(max, level)), null);

  return (
    <div
      onClick={onNavigate}
      className={`group bg-white dark:bg-slate-900 overflow-hidden rounded-lg border border-gray-200 dark:border-slate-800 hover:shadow-md transition-all hover:border-gray-400 dark:hover:border-slate-600 ${
        onNavigate ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex flex-shrink-0 mt-0.5">
              <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-lg bg-blue-50 dark:bg-slate-800 flex items-center justify-center">
                <Users className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5 text-blue-600 dark:text-blue-300" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-[15px] sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 transition-colors">
                  {team.teamName}
                </h3>
                <span className="text-xs sm:text-sm text-gray-400 dark:text-slate-500 flex-shrink-0">#{team.teamId}</span>
              </div>
              {hasDescription && (
                <p className="text-sm sm:text-[15px] mt-1 text-gray-500 dark:text-slate-400 line-clamp-1 sm:line-clamp-2">
                  {description}
                </p>
              )}

              <div className="mt-2.5 flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs sm:text-sm text-gray-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 sm:bg-transparent sm:px-0 sm:py-0">
                  <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500" />
                  <span className="font-medium text-gray-700 dark:text-slate-300">@{team.leaderHandle}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 sm:bg-transparent sm:px-0 sm:py-0">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 dark:text-slate-500" />
                  {team.memberCount}명
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 sm:bg-transparent sm:px-0 sm:py-0">스쿼드 {squadSettings.length}개</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0 mt-1">
            <ChevronRight className="h-5 w-5 text-gray-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
            <span className="text-[10px] text-gray-400 dark:text-slate-500 hidden sm:block">클릭 시 이동</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">난이도 범위</span>
            {minTeamLevel !== null && maxTeamLevel !== null ? (
              <div className="inline-flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2 py-1 text-xs sm:text-sm">
                  {getTierIcon(minTeamLevel, 15)}
                  {getTierName(minTeamLevel)}
                </span>
                <span className="text-gray-400 dark:text-slate-500 text-xs sm:text-sm">~</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2 py-1 text-xs sm:text-sm">
                  {getTierIcon(maxTeamLevel, 15)}
                  {getTierName(maxTeamLevel)}
                </span>
              </div>
            ) : (
              <span className="text-xs sm:text-sm text-gray-400 dark:text-slate-500">설정 없음</span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 px-2.5 sm:px-3 py-1.5 rounded-md transition-colors"
          >
            <span className="sm:hidden">{isExpanded ? '상세 닫기' : '추천 설정 보기'}</span>
            <span className="hidden sm:inline">{isExpanded ? '상세 닫기' : '추천 설정 상세 보기'}</span>
            <ChevronRight className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 sm:px-5 pb-3 sm:pb-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
          <div className="pt-2.5 mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-600 dark:text-slate-300">스쿼드 추천 설정</p>
            <span className="text-xs text-gray-400 dark:text-slate-500">{squadSettings.length}개</span>
          </div>
          {squadSettings.length === 0 ? (
            <div className="text-sm text-gray-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-md px-3 py-2">
              표시할 스쿼드 정보가 없습니다.
            </div>
          ) : (
            <div className="space-y-1.5">
              {squadSettings.map((squad) => (
                <div key={squad.id} className="rounded-md border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2">
                  <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[15px] font-medium text-gray-800 dark:text-slate-200 truncate">{squad.name}</span>
                      <span className="text-xs text-gray-500 dark:text-slate-400">{squad.memberCount}명</span>
                    </div>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                      squad.isActive
                        ? 'bg-green-50 dark:bg-green-900/25 text-green-700 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-300'
                    }`}>
                      {squad.isActive ? '활성' : '비활성'}
                    </span>
                    {squad.isDefault && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300">default</span>
                    )}
                  </div>
                  {squad.isActive && (
                    <>
                      <dl className="mt-1 grid grid-cols-[52px,1fr] gap-x-2 gap-y-0.5 text-sm">
                        <dt className="text-gray-400 dark:text-slate-500">요일</dt>
                        <dd className="text-gray-700 dark:text-slate-300">{squad.dayLabel}</dd>
                        <dt className="text-gray-400 dark:text-slate-500">문제수</dt>
                        <dd className="text-gray-700 dark:text-slate-300">{squad.problemCount}문제</dd>
                        <dt className="text-gray-400 dark:text-slate-500">태그</dt>
                        <dd className="text-gray-700 dark:text-slate-300">
                          {squad.includeTags.length > 0 ? getTagNames(squad.includeTags).join(', ') : '전체'}
                        </dd>
                      </dl>
                      {squad.minLevel !== null && squad.maxLevel !== null ? (
                        <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-300">
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2 py-1 text-sm">
                            {getTierIcon(squad.minLevel, 14)}
                            {getTierName(squad.minLevel)}
                          </span>
                          <span className="text-gray-400 dark:text-slate-500">~</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2 py-1 text-sm">
                            {getTierIcon(squad.maxLevel, 14)}
                            {getTierName(squad.maxLevel)}
                          </span>
                        </div>
                      ) : (
                        <div className="mt-1 text-sm text-gray-400 dark:text-slate-500">{squad.levelLabel}</div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
