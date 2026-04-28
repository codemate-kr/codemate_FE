import { useState, useEffect, useMemo, useRef } from 'react';
import { Settings, X, Mail, Calendar, Signal, CheckCircle, Hash } from 'lucide-react';
import { squadsApi, type SquadRecommendationSettingsResponse } from '../../../../../api/squads';
import type { ProblemDifficultyPreset, RecommendationDayOfWeek } from '../../../../../api/teams';
import { CustomTierModal } from '../../../../problems/components/CustomTierModal';
import { getTierName } from '../../../../../utils/tierUtils';
import { buildSolvedAcSearchUrl } from '../../../../../utils/solvedAcSearch';
import { AlgorithmTagSelector } from './settings/AlgorithmTagSelector';
import { SettingsSummary } from './settings/SettingsSummary';

interface SquadSettingsModalProps {
  teamId: number;
  squadId: number;
  squadName: string;
  squadMemberHandles: string[];
  settings: SquadRecommendationSettingsResponse | null;
  onClose: () => void;
  onSettingsUpdate: () => void;
  onShowToast: (message: string) => void;
}

export function SquadSettingsModal({
  teamId,
  squadId,
  squadName,
  squadMemberHandles,
  settings,
  onClose,
  onSettingsUpdate,
  onShowToast,
}: SquadSettingsModalProps) {
  const isRecommendationSaveDisabled = false;
  const [selectedDays, setSelectedDays] = useState<RecommendationDayOfWeek[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<ProblemDifficultyPreset | null>(null);
  const [minProblemLevel, setMinProblemLevel] = useState<number | null>(null);
  const [maxProblemLevel, setMaxProblemLevel] = useState<number | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [problemCount, setProblemCount] = useState<number>(3);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const daySelectionRef = useRef<HTMLDivElement>(null);
  const settingsSignatureRef = useRef<string>('');

  const applySettings = (nextSettings: SquadRecommendationSettingsResponse | null) => {
    if (nextSettings) {
      setSelectedDays(nextSettings.recommendationDays || []);
      setIsEnabled(nextSettings.isActive || false);
      setSelectedPreset(nextSettings.problemDifficultyPreset || null);
      setMinProblemLevel(nextSettings.minProblemLevel || null);
      setMaxProblemLevel(nextSettings.maxProblemLevel || null);
      setProblemCount(nextSettings.problemCount ?? 3);
      setSelectedTags(nextSettings.includeTags || []);
      return;
    }

    setSelectedDays([]);
    setIsEnabled(false);
    setSelectedPreset(null);
    setMinProblemLevel(null);
    setMaxProblemLevel(null);
    setProblemCount(3);
    setSelectedTags([]);
  };

  useEffect(() => {
    if (isEnabled && contentRef.current && daySelectionRef.current) {
      setTimeout(() => {
        daySelectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isEnabled]);

  useEffect(() => {
    const signature = JSON.stringify(settings ?? {});
    if (settingsSignatureRef.current === signature) {
      return;
    }
    settingsSignatureRef.current = signature;
    applySettings(settings);
  }, [settings]);

  useEffect(() => {
    let cancelled = false;

    const fetchLatestSettings = async () => {
      setIsFetchingSettings(true);
      try {
        const latest = await squadsApi.getRecommendationSettings(teamId, squadId);
        if (!cancelled) {
          applySettings(latest);
        }
      } catch (error) {
        console.error('스쿼드 설정 조회 실패:', error);
      } finally {
        if (!cancelled) {
          setIsFetchingSettings(false);
        }
      }
    };

    fetchLatestSettings();

    return () => {
      cancelled = true;
    };
  }, [teamId, squadId]);

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
      const orderA = weekDays.find((d) => d.key === a)?.order || 0;
      const orderB = weekDays.find((d) => d.key === b)?.order || 0;
      return orderA - orderB;
    });
  };

  const handleDayToggle = (day: RecommendationDayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handlePresetSelect = (preset: ProblemDifficultyPreset) => {
    if (preset === 'CUSTOM') {
      setShowCustomModal(true);
    } else {
      setSelectedPreset((prev) => (prev === preset ? null : preset));
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
    if (isRecommendationSaveDisabled) {
      onShowToast('현재 추천 설정 저장은 비활성화되어 있습니다.');
      return;
    }

    if (isEnabled && selectedDays.length === 0) {
      onShowToast('최소 하나의 요일을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const sortedDays = isEnabled ? getSortedSelectedDays() : [];
      await squadsApi.updateRecommendationSettings(teamId, squadId, {
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
      console.error('스쿼드 설정 저장 실패:', error);
      onShowToast('설정 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const solvedAcSearchUrl = useMemo(
    () =>
      buildSolvedAcSearchUrl({
        selectedPreset,
        minProblemLevel,
        maxProblemLevel,
        selectedTags,
        solvedCountMin: 1000,
        unsolvedByHandles: squadMemberHandles,
      }),
    [selectedPreset, minProblemLevel, maxProblemLevel, selectedTags, squadMemberHandles]
  );

  const canOpenSolvedAcSearch =
    selectedPreset !== null ||
    selectedTags.length > 0;

  const handleOpenSolvedAcSearch = () => {
    if (!canOpenSolvedAcSearch) {
      onShowToast('난이도 또는 태그를 먼저 설정해주세요.');
      return;
    }

    const opened = window.open(solvedAcSearchUrl, '_blank', 'noopener,noreferrer');
    if (!opened) {
      onShowToast('팝업이 차단되었습니다. 브라우저 설정을 확인해주세요.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div
          className={`relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg transform transition-all flex flex-col ${
            isEnabled ? 'h-[calc(100vh-2rem)]' : 'h-auto max-h-[calc(100vh-2rem)]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 dark:bg-slate-800 rounded-lg">
                <Settings className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">추천 설정</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{squadName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              disabled={isLoading || isFetchingSettings}
            >
              <X className="h-5 w-5 text-gray-400 dark:text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div ref={contentRef} className="overflow-y-auto flex-1 px-6 py-4">
            {/* Toggle Switch */}
            <div className="mb-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">자동 문제 추천</p>
                    <p className="text-xs text-gray-600 dark:text-slate-400">정기적으로 문제를 추천합니다</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => setIsEnabled(e.target.checked)}
                    className="sr-only peer"
                    disabled={isLoading || isFetchingSettings}
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-slate-200 after:border-gray-300 dark:after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {!isEnabled ? (
              <div className="flex items-center justify-center py-4">
                <div className="text-center max-w-sm">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-full mb-3">
                    <Signal className="h-6 w-6 text-gray-400 dark:text-slate-500" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    문제 추천이 비활성화되어 있습니다
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                    위 토글을 켜면 요일과 난이도를 설정하여<br />
                    스쿼드원들에게 자동으로 문제를 추천할 수 있습니다.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div ref={daySelectionRef} className="border-t border-gray-200 dark:border-slate-800 -mx-6" />

                {/* Day Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-600 dark:text-slate-300" />
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        추천 요일<span className="text-red-500 ml-0.5">*</span>
                      </h4>
                    </div>
                    {selectedDays.length > 0 ? (
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-300">{selectedDays.length}개 선택됨</span>
                    ) : (
                      <span className="text-xs text-red-500">필수 선택</span>
                    )}
                  </div>
                  <div className="flex gap-1 max-h-10">
                    {weekDays.map((day) => (
                      <label
                        key={day.key}
                        className={`flex-1 aspect-square flex items-center justify-center rounded-md cursor-pointer transition-all select-none border ${
                          selectedDays.includes(day.key)
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border-blue-500 dark:border-blue-700'
                            : 'text-gray-400 dark:text-slate-500 border-gray-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDays.includes(day.key)}
                          onChange={() => handleDayToggle(day.key)}
                          className="sr-only"
                          disabled={isLoading || isFetchingSettings}
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
                      <Signal className="h-4 w-4 text-gray-600 dark:text-slate-300" />
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        문제 난이도<span className="text-red-500 ml-0.5">*</span>
                      </h4>
                    </div>
                    {selectedPreset ? (
                      <span className="text-xs text-gray-500 dark:text-slate-400">스쿼드 수준에 맞는 난이도를 선택하세요</span>
                    ) : (
                      <span className="text-xs text-red-500">필수 선택</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { key: 'EASY' as ProblemDifficultyPreset, label: '쉬움', subtitle: '브론즈Ⅰ~실버Ⅲ', color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' },
                        { key: 'NORMAL' as ProblemDifficultyPreset, label: '보통', subtitle: '실버Ⅱ~골드Ⅳ', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' },
                        { key: 'HARD' as ProblemDifficultyPreset, label: '어려움', subtitle: '골드Ⅲ~플래Ⅴ', color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300' },
                      ].map((preset) => (
                        <label
                          key={preset.key}
                          className={`flex flex-col items-center justify-center h-14 border rounded-md cursor-pointer transition-all ${
                            selectedPreset === preset.key
                              ? preset.color
                              : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="difficulty"
                            checked={selectedPreset === preset.key}
                            onChange={() => handlePresetSelect(preset.key)}
                            className="sr-only"
                            disabled={isLoading || isFetchingSettings}
                          />
                          <div className="flex items-center">
                            <span className="text-sm font-semibold">{preset.label}</span>
                            {selectedPreset === preset.key && <CheckCircle className="h-3.5 w-3.5 ml-1" />}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-slate-400">{preset.subtitle}</span>
                        </label>
                      ))}
                    </div>
                    <label
                      className={`flex flex-col items-center justify-center h-14 border rounded-md cursor-pointer transition-all ${
                        selectedPreset === 'CUSTOM'
                          ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                          : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600 border-dashed'
                      }`}
                      onClick={() => !(isLoading || isFetchingSettings) && setShowCustomModal(true)}
                    >
                      <input type="radio" name="difficulty" checked={selectedPreset === 'CUSTOM'} onChange={() => {}} className="sr-only" disabled={isLoading || isFetchingSettings} />
                      <div className="flex items-center">
                        <span className="text-sm font-semibold">커스텀</span>
                        {selectedPreset === 'CUSTOM' && <CheckCircle className="h-3.5 w-3.5 ml-1" />}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-slate-400">
                        {selectedPreset === 'CUSTOM' && minProblemLevel && maxProblemLevel
                          ? `${getTierName(minProblemLevel)} ~ ${getTierName(maxProblemLevel)}`
                          : '직접 선택'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Problem Count */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Hash className="h-4 w-4 text-gray-600 dark:text-slate-300" />
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        문제 수<span className="text-red-500 ml-0.5">*</span>
                      </h4>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-slate-400">매일 추천받을 문제 수</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((count) => (
                      <label
                        key={count}
                        className={`flex-1 aspect-square max-h-10 flex items-center justify-center rounded-md cursor-pointer transition-all select-none border ${
                          problemCount === count
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border-blue-500 dark:border-blue-700'
                            : 'text-gray-400 dark:text-slate-500 border-gray-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <input type="radio" name="problemCount" checked={problemCount === count} onChange={() => setProblemCount(count)} className="sr-only" disabled={isLoading || isFetchingSettings} />
                        <span className="text-xs font-medium">{count}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Algorithm Tags */}
                <AlgorithmTagSelector selectedTags={selectedTags} onChange={setSelectedTags} disabled={isLoading || isFetchingSettings} maxTags={16} />

                {/* 설정 요약 (모바일) */}
                <div className="lg:hidden">
                  <SettingsSummary
                    selectedDays={selectedDays}
                    selectedPreset={selectedPreset}
                    minProblemLevel={minProblemLevel}
                    maxProblemLevel={maxProblemLevel}
                    problemCount={problemCount}
                    selectedTags={selectedTags}
                    onOpenSolvedAcSearch={handleOpenSolvedAcSearch}
                    canOpenSolvedAcSearch={canOpenSolvedAcSearch}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex-shrink-0 bg-gray-50 dark:bg-slate-950">
            <button type="button" onClick={onClose} disabled={isLoading || isFetchingSettings} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors">
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isRecommendationSaveDisabled || isLoading || isFetchingSettings || (isEnabled && selectedDays.length === 0)}
              title={isRecommendationSaveDisabled ? '클릭금지' : undefined}
              className={`inline-flex items-center px-6 py-2 text-sm font-medium border rounded-md whitespace-nowrap space-x-2 ${
                isRecommendationSaveDisabled
                  ? 'text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 cursor-not-allowed'
                  : 'text-white bg-blue-600 border-transparent hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
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

        {/* 설정 요약 (데스크톱) */}
        {isEnabled && (
          <div
            className="hidden lg:block fixed w-72"
            style={{ left: 'calc(50% + 256px + 16px)', top: '1rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <SettingsSummary
              selectedDays={selectedDays}
              selectedPreset={selectedPreset}
              minProblemLevel={minProblemLevel}
              maxProblemLevel={maxProblemLevel}
              problemCount={problemCount}
              selectedTags={selectedTags}
              onOpenSolvedAcSearch={handleOpenSolvedAcSearch}
              canOpenSolvedAcSearch={canOpenSolvedAcSearch}
            />
          </div>
        )}

        {showCustomModal && (
          <CustomTierModal onClose={() => setShowCustomModal(false)} onSelect={handleCustomRangeSelect} currentMinLevel={minProblemLevel} currentMaxLevel={maxProblemLevel} />
        )}
      </div>
    </>
  );
}
