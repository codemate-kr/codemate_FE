import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Tag, X, Check } from 'lucide-react';
import {
  searchAlgorithmTags,
  getTagByKey,
} from '../../../../constants/algorithmTags';
interface AlgorithmTagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
  maxTags?: number;
}

export function AlgorithmTagSelector({
  selectedTags,
  onChange,
  disabled = false,
  maxTags = 10,
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4 text-gray-600" />
          <h4 className="text-sm font-semibold text-gray-900">알고리즘 태그</h4>
        </div>
        <span className={`text-xs font-medium ${isMaxReached ? 'text-orange-600' : 'text-blue-600'}`}>
          {selectedTags.length}/{maxTags} 선택
        </span>
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
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tag.nameKo}
                <X className="h-3 w-3" />
              </button>
            );
          })}
        </div>
      )}

      {/* 검색창 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="태그 검색 (한글/영문)"
          disabled={disabled}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:opacity-50"
        />
      </div>

      {/* 안내 메시지 */}
      {selectedTags.length === 0 ? (
        <p className="text-xs text-blue-600 font-medium">
          * 태그를 선택하지 않으면 모든 유형의 문제가 추천됩니다.
        </p>
      ) : (
        <p className="text-xs text-gray-500">
          선택한 태그 중 하나라도 포함된 문제가 추천됩니다.
        </p>
      )}

      {/* 태그 목록 */}
      <div ref={listRef} className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
        {filteredTags.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            검색 결과가 없습니다
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
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
                      ? 'bg-blue-100'
                      : isSelected
                      ? 'bg-blue-50'
                      : isDisabledItem
                      ? 'bg-gray-50 cursor-not-allowed'
                      : 'hover:bg-gray-50'
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
                          ? 'border-gray-200 bg-gray-100'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          isDisabledItem ? 'text-gray-400' : 'text-gray-900'
                        }`}
                      >
                        {tag.nameKo}
                      </p>
                      <p
                        className={`text-xs truncate ${
                          isDisabledItem ? 'text-gray-300' : 'text-gray-500'
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
