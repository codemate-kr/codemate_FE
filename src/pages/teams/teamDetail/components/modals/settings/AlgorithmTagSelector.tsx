import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Tag, X, Check, CircleHelp } from 'lucide-react';
import {
  searchAlgorithmTags,
  getTagByKey,
} from '../../../../../../constants/algorithmTags';
interface AlgorithmTagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
  maxTags?: number;
}

const REFERENCE_REPO_URL = 'https://github.com/tony9402/baekjoon';

const COTE_FREQUENT_TAG_KEYS = [
  'queue',
  'stack',
  'deque',
  'set',
  'priority_queue',
  'dp',
  'dfs',
  'bfs',
  'bruteforcing',
  'trees',
  'binary_search',
  'two_pointer',
  'implementation',
  'simulation',
  'math',
  'greedy',
];

export function AlgorithmTagSelector({
  selectedTags,
  onChange,
  disabled = false,
  maxTags = 16,
}: AlgorithmTagSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredTags = useMemo(() => {
    return searchAlgorithmTags(searchQuery);
  }, [searchQuery]);

  // 검색어 변경 시 하이라이트 인덱스 리셋
  useEffect(() => {
    if (searchQuery) {
      setHighlightedIndex(0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [searchQuery]);

  // 하이라이트된 항목이 보이도록 스크롤
  useEffect(() => {
    if (listRef.current && filteredTags.length > 0) {
      const highlightedElement = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, filteredTags.length]);

  const handleTagToggle = (key: string) => {
    if (disabled) return;

    if (selectedTags.includes(key)) {
      onChange(selectedTags.filter((t) => t !== key));
    } else {
      if (selectedTags.length < maxTags) {
        onChange([...selectedTags, key]);
      }
    }
  };

  const handleRemoveTag = (key: string) => {
    if (disabled) return;
    onChange(selectedTags.filter((t) => t !== key));
  };

  const handleApplyBeginnerRecommendation = () => {
    if (disabled) return;
    onChange(COTE_FREQUENT_TAG_KEYS.slice(0, maxTags));
  };

  const recommendedTagKeys = COTE_FREQUENT_TAG_KEYS.slice(0, maxTags);
  const isRecommendedCombinationSelected =
    selectedTags.length === recommendedTagKeys.length &&
    recommendedTagKeys.every((key) => selectedTags.includes(key));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredTags.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => {
          if (prev === -1) return 0;
          return prev < filteredTags.length - 1 ? prev + 1 : prev;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex === -1 && filteredTags.length > 0) {
          // 하이라이트 없을 때 첫 번째 항목 선택
          const firstTag = filteredTags[0];
          if (!selectedTags.includes(firstTag.key) && !isMaxReached) {
            handleTagToggle(firstTag.key);
            setSearchQuery('');
          }
        } else if (highlightedIndex >= 0) {
          const highlightedTag = filteredTags[highlightedIndex];
          if (highlightedTag) {
            const isSelected = selectedTags.includes(highlightedTag.key);
            const canSelect = !isSelected && !isMaxReached;
            if (isSelected || canSelect) {
              handleTagToggle(highlightedTag.key);
              if (canSelect) {
                setSearchQuery('');
              }
            }
          }
        }
        break;
    }
  };

  const isMaxReached = selectedTags.length >= maxTags;

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="relative z-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4 text-gray-600 dark:text-slate-300" />
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">알고리즘 태그</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleApplyBeginnerRecommendation}
            disabled={disabled}
            className="relative inline-flex items-center gap-1.5 rounded-full border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 px-2.5 pr-7 py-1 text-xs font-normal text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className={isRecommendedCombinationSelected ? 'font-semibold' : 'font-normal'}>추천 태그 16개</span>
            <span
              className="group/help absolute right-2 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center text-gray-400 dark:text-slate-400 cursor-help"
              aria-label="추천 태그 16개 기준 보기"
              role="button"
              tabIndex={0}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <CircleHelp className="h-3.5 w-3.5" />
              <span className="pointer-events-auto hidden absolute right-0 top-full z-[9999] w-64 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-left text-[11px] leading-relaxed text-gray-600 dark:text-slate-300 shadow-lg group-hover/help:block group-focus-within/help:block">
                <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-100">선정 기준이 뭐예요?</p>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-600 dark:text-slate-300 break-words whitespace-normal">
                  코딩테스트 빈출 태그 16개를 선별해 적용합니다.
                  <br />
                  더 많은 태그는 참고 레포에서 확인해 주세요.
                </p>
                <a
                  href={REFERENCE_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto mt-2 inline-flex items-center text-[11px] font-medium text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  참고 레포 보기 (tony9402/baekjoon)
                </a>
              </span>
            </span>
          </button>
          <span className={`text-xs font-medium ${isMaxReached ? 'text-orange-600 dark:text-orange-300' : 'text-blue-600 dark:text-blue-300'}`}>
            {selectedTags.length}/{maxTags} 선택
          </span>
        </div>
      </div>

      {/* 선택된 태그 */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.map((key) => {
            const tag = getTagByKey(key);
            if (!tag) return null;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleRemoveTag(key)}
                disabled={disabled}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tag.nameKo}
                <X className="h-3 w-3" />
              </button>
            );
          })}
        </div>
      )}

      {/* 검색창 */}
      <div className="relative z-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="태그 검색 (한글/영문)"
          disabled={disabled}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-slate-900 disabled:opacity-50"
        />
      </div>

      {/* 안내 메시지 */}
      {selectedTags.length === 0 ? (
        <p className="text-xs text-blue-600 dark:text-blue-300 font-medium">
          * 태그를 선택하지 않으면 모든 유형의 문제가 추천됩니다.
        </p>
      ) : (
        <p className="text-xs text-gray-500 dark:text-slate-400">
          선택한 태그 중 하나라도 포함된 문제가 추천됩니다.
        </p>
      )}

      {/* 태그 목록 */}
      <div ref={listRef} className="relative z-0 max-h-48 overflow-y-auto border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
        {filteredTags.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500 dark:text-slate-400">
            검색 결과가 없습니다
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {filteredTags.map((tag, index) => {
              const isSelected = selectedTags.includes(tag.key);
              const isDisabledItem = !isSelected && isMaxReached;
              const isHighlighted = isFocused && index === highlightedIndex;

              return (
                <label
                  key={tag.key}
                  data-index={index}
                  className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                    isHighlighted
                      ? 'bg-blue-100 dark:bg-blue-900/40'
                      : isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/25'
                      : isDisabledItem
                      ? 'bg-gray-50 dark:bg-slate-900 cursor-not-allowed'
                      : 'hover:bg-gray-50 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleTagToggle(tag.key)}
                      disabled={disabled || isDisabledItem}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 flex items-center justify-center rounded border transition-colors ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : isDisabledItem
                          ? 'border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-700'
                          : 'border-gray-300 dark:border-slate-500'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          isDisabledItem ? 'text-gray-400 dark:text-slate-500' : 'text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {tag.nameKo}
                      </p>
                      <p
                        className={`text-xs truncate ${
                          isDisabledItem ? 'text-gray-300 dark:text-slate-600' : 'text-gray-500 dark:text-slate-400'
                        }`}
                      >
                        {tag.nameEn}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
