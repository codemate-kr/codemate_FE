import { useState, useEffect, useRef } from 'react';
import { Settings, X, Mail, Calendar, Target, CheckCircle, Hash } from 'lucide-react';
import { teamsApi, type TeamRecommendationSettingsResponse, type ProblemDifficultyPreset, type RecommendationDayOfWeek } from '../../../api/teams';
import { CustomTierModal } from '../../problems/components/CustomTierModal';
import { getTierName } from '../../../utils/tierUtils';
import { AlgorithmTagSelector } from './settings/AlgorithmTagSelector';
import { SettingsSummary } from './settings/SettingsSummary';

interface TeamSettingsModalProps {
  teamId: number;
  settings: TeamRecommendationSettingsResponse | null;
  onClose: () => void;
  onSettingsUpdate: () => void;
  onShowToast: (message: string) => void;
}

export function TeamSettingsModal({
  teamId,
  settings,
  onClose,
  onSettingsUpdate,
  onShowToast
}: TeamSettingsModalProps) {
  const [selectedDays, setSelectedDays] = useState<RecommendationDayOfWeek[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<ProblemDifficultyPreset | null>(null);
  const [minProblemLevel, setMinProblemLevel] = useState<number | null>(null);
  const [maxProblemLevel, setMaxProblemLevel] = useState<number | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [problemCount, setProblemCount] = useState<number>(3);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const daySelectionRef = useRef<HTMLDivElement>(null);

  // 토글 ON 시 추천 요일 섹션이 상단에 오도록 부드럽게 스크롤
  useEffect(() => {
    if (isEnabled && contentRef.current && daySelectionRef.current) {
      // 약간의 딜레이를 주어 DOM이 렌더링된 후 스크롤
      setTimeout(() => {
        daySelectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [isEnabled]);

  useEffect(() => {
    if (settings) {
      setSelectedDays(settings.recommendationDays || []);
      setIsEnabled(settings.isActive || false);
      setSelectedPreset(settings.problemDifficultyPreset || null);
      setMinProblemLevel(settings.minProblemLevel || null);
      setMaxProblemLevel(settings.maxProblemLevel || null);
      setProblemCount(settings.problemCount ?? 3);
      setSelectedTags(settings.includeTags || []);
    } else {
      setSelectedDays([]);
      setIsEnabled(false);
      setSelectedPreset(null);
      setMinProblemLevel(null);
      setMaxProblemLevel(null);
      setProblemCount(3);
      setSelectedTags([]);
    }
  }, [settings]);

  const weekDays: Array<{ key: RecommendationDayOfWeek; label: string; order: number }> = [
    { key: 'MONDAY', label: '월요일', order: 1 },
    { key: 'TUESDAY', label: '화요일', order: 2 },
    { key: 'WEDNESDAY', label: '수요일', order: 3 },
    { key: 'THURSDAY', label: '목요일', order: 4 },
    { key: 'FRIDAY', label: '금요일', order: 5 },
    { key: 'SATURDAY', label: '토요일', order: 6 },
    { key: 'SUNDAY', label: '일요일', order: 7 },
  ];

  const getSortedSelectedDays = () => {
    return [...selectedDays].sort((a, b) => {
      const orderA = weekDays.find(day => day.key === a)?.order || 0;
      const orderB = weekDays.find(day => day.key === b)?.order || 0;
      return orderA - orderB;
    });
  };

  const handleDayToggle = (day: RecommendationDayOfWeek) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handlePresetSelect = (preset: ProblemDifficultyPreset) => {
    if (preset === 'CUSTOM') {
      setShowCustomModal(true);
    } else {
      setSelectedPreset(prev => prev === preset ? null : preset);
      setMinProblemLevel(null);
      setMaxProblemLevel(null);
    }
  };

  const handleCustomRangeSelect = (minLevel: number, maxLevel: number) => {
    setSelectedPreset('CUSTOM');
    setMinProblemLevel(minLevel);
    setMaxProblemLevel(maxLevel);
    setShowCustomModal(false);
  };

  const handleSave = async () => {
    if (isEnabled && selectedDays.length === 0) {
      alert('최소 하나의 요일을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const sortedDays = isEnabled ? getSortedSelectedDays() : [];
      await teamsApi.updateRecommendationSettings(teamId, {
        recommendationDays: sortedDays,
        problemDifficultyPreset: selectedPreset || undefined,
        minProblemLevel: minProblemLevel || undefined,
        maxProblemLevel: maxProblemLevel || undefined,
        problemCount,
        includeTags: selectedTags.length > 0 ? selectedTags : undefined,
      });

      onSettingsUpdate();
      onShowToast('저장되었습니다.');
      onClose();
    } catch (error) {
      console.error('설정 저장 실패:', error);
      alert('설정 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {/* 메인 모달 */}
        <div
          className={`relative bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all flex flex-col ${
            isEnabled ? 'h-[calc(100vh-2rem)]' : 'h-auto max-h-[calc(100vh-2rem)]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">추천 설정</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div ref={contentRef} className="overflow-y-auto flex-1 px-6 py-4">
              {/* Toggle Switch */}
              <div className="mb-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">자동 문제 추천</p>
                      <p className="text-xs text-gray-600">정기적으로 문제를 추천합니다</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) => setIsEnabled(e.target.checked)}
                      className="sr-only peer"
                      disabled={isLoading}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {!isEnabled ? (
                <div className="flex items-center justify-center py-4">
                  <div className="text-center max-w-sm">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                      <Target className="h-6 w-6 text-gray-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      문제 추천이 비활성화되어 있습니다
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      위 토글을 켜면 요일과 난이도를 설정하여<br />
                      팀원들에게 자동으로 문제를 추천할 수 있습니다.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* 구분선 */}
                  <div ref={daySelectionRef} className="border-t border-gray-200 -mx-6"></div>

                  {/* Day Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <h4 className="text-sm font-semibold text-gray-900">
                          추천 요일
                          <span className="text-red-500 ml-0.5">*</span>
                        </h4>
                      </div>
                      {selectedDays.length > 0 ? (
                        <span className="text-xs font-medium text-blue-600">{selectedDays.length}개 선택됨</span>
                      ) : (
                        <span className="text-xs text-red-500">필수 선택</span>
                      )}
                    </div>
                    <div className="flex gap-1 max-h-10">
                      {weekDays.map(day => (
                        <label
                          key={day.key}
                          className={`flex-1 aspect-square flex items-center justify-center rounded-md cursor-pointer transition-all select-none border ${
                            selectedDays.includes(day.key)
                              ? 'bg-blue-50 text-blue-600 border-blue-500'
                              : 'text-gray-300 border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedDays.includes(day.key)}
                            onChange={() => handleDayToggle(day.key)}
                            className="sr-only"
                            disabled={isLoading}
                          />
                          <span className="text-xs font-medium">{day.label.charAt(0)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-gray-600" />
                        <h4 className="text-sm font-semibold text-gray-900">
                          문제 난이도
                          <span className="text-red-500 ml-0.5">*</span>
                        </h4>
                      </div>
                      {selectedPreset ? (
                        <span className="text-xs text-gray-500">팀 수준에 맞는 난이도를 선택하세요</span>
                      ) : (
                        <span className="text-xs text-red-500">필수 선택</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { key: 'EASY' as ProblemDifficultyPreset, label: '쉬움', subtitle: '브론즈Ⅰ~실버Ⅲ', color: 'bg-green-50 border-green-200 text-green-700' },
                          { key: 'NORMAL' as ProblemDifficultyPreset, label: '보통', subtitle: '실버Ⅱ~골드Ⅳ', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                          { key: 'HARD' as ProblemDifficultyPreset, label: '어려움', subtitle: '골드Ⅲ~플래Ⅴ', color: 'bg-red-50 border-red-200 text-red-700' }
                        ].map(preset => (
                          <label
                            key={preset.key}
                            className={`flex flex-col items-center justify-center h-14 border rounded-md cursor-pointer transition-all ${
                              selectedPreset === preset.key
                                ? preset.color
                                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="difficulty"
                              checked={selectedPreset === preset.key}
                              onChange={() => handlePresetSelect(preset.key)}
                              className="sr-only"
                              disabled={isLoading}
                            />
                            <div className="flex items-center">
                              <span className="text-sm font-semibold">{preset.label}</span>
                              {selectedPreset === preset.key && (
                                <CheckCircle className="h-3.5 w-3.5 ml-1" />
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{preset.subtitle}</span>
                          </label>
                        ))}
                      </div>
                      <label
                        className={`flex flex-col items-center justify-center h-14 border rounded-md cursor-pointer transition-all ${
                          selectedPreset === 'CUSTOM'
                            ? 'bg-purple-50 border-purple-200 text-purple-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 border-dashed'
                        }`}
                        onClick={() => !isLoading && setShowCustomModal(true)}
                      >
                        <input
                          type="radio"
                          name="difficulty"
                          checked={selectedPreset === 'CUSTOM'}
                          onChange={() => {}}
                          className="sr-only"
                          disabled={isLoading}
                        />
                        <div className="flex items-center">
                          <span className="text-sm font-semibold">커스텀</span>
                          {selectedPreset === 'CUSTOM' && (
                            <CheckCircle className="h-3.5 w-3.5 ml-1" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {selectedPreset === 'CUSTOM' && minProblemLevel && maxProblemLevel
                            ? `${getTierName(minProblemLevel)} ~ ${getTierName(maxProblemLevel)}`
                            : '직접 선택'}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Problem Count Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-gray-600" />
                        <h4 className="text-sm font-semibold text-gray-900">
                          문제 수
                          <span className="text-red-500 ml-0.5">*</span>
                        </h4>
                      </div>
                      <span className="text-xs text-gray-500">매일 추천받을 문제 수</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(count => (
                        <label
                          key={count}
                          className={`flex-1 aspect-square max-h-10 flex items-center justify-center rounded-md cursor-pointer transition-all select-none border ${
                            problemCount === count
                              ? 'bg-blue-50 text-blue-600 border-blue-500'
                              : 'text-gray-300 border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="problemCount"
                            checked={problemCount === count}
                            onChange={() => setProblemCount(count)}
                            className="sr-only"
                            disabled={isLoading}
                          />
                          <span className="text-xs font-medium">{count}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Algorithm Tag Selection */}
                  <AlgorithmTagSelector
                    selectedTags={selectedTags}
                    onChange={setSelectedTags}
                    disabled={isLoading}
                    maxTags={10}
                  />

                  {/* 설정 요약 (모바일) */}
                  <div className="lg:hidden">
                    <SettingsSummary
                      selectedDays={selectedDays}
                      selectedPreset={selectedPreset}
                      minProblemLevel={minProblemLevel}
                      maxProblemLevel={maxProblemLevel}
                      problemCount={problemCount}
                      selectedTags={selectedTags}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading || (isEnabled && selectedDays.length === 0)}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>저장 중...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>저장</span>
                  </>
                )}
              </button>
            </div>
          </div>

        {/* 설정 요약 (데스크톱 - 모달 우측에 gap-4 간격, 상단 정렬) */}
        {isEnabled && (
          <div
            className="hidden lg:block fixed w-72"
            style={{
              left: 'calc(50% + 256px + 16px)',
              top: '1rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SettingsSummary
              selectedDays={selectedDays}
              selectedPreset={selectedPreset}
              minProblemLevel={minProblemLevel}
              maxProblemLevel={maxProblemLevel}
              problemCount={problemCount}
              selectedTags={selectedTags}
            />
          </div>
        )}

        {showCustomModal && (
          <CustomTierModal
            onClose={() => setShowCustomModal(false)}
            onSelect={handleCustomRangeSelect}
            currentMinLevel={minProblemLevel}
            currentMaxLevel={maxProblemLevel}
          />
        )}
      </div>
    </>
  );
}
