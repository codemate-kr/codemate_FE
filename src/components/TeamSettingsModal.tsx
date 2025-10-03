import { useState, useEffect } from 'react';
import { Settings, X, Mail, Calendar, Target, Clock, CheckCircle } from 'lucide-react';
import { teamsApi, type TeamRecommendationSettingsResponse, type ProblemDifficultyPreset, type RecommendationDayOfWeek, type SolvedacTier } from '../api/teams';
import { CustomTierModal } from './CustomTierModal';

interface TeamSettingsModalProps {
  teamId: number;
  settings: TeamRecommendationSettingsResponse | null;
  onClose: () => void;
  onSettingsUpdate: () => void;
  onShowToast: () => void;
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
  const [customMinLevel, setCustomMinLevel] = useState<number | null>(null);
  const [customMaxLevel, setCustomMaxLevel] = useState<number | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // settings가 변경될 때마다 상태 업데이트
  useEffect(() => {
    if (settings) {
      setSelectedDays(settings.recommendationDays || []);
      setIsEnabled(settings.isActive || false);
      setSelectedPreset(settings.problemDifficultyPreset || null);
      setCustomMinLevel(settings.customMinLevel || null);
      setCustomMaxLevel(settings.customMaxLevel || null);
    } else {
      setSelectedDays([]);
      setIsEnabled(false);
      setSelectedPreset(null);
      setCustomMinLevel(null);
      setCustomMaxLevel(null);
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
      setCustomMinLevel(null);
      setCustomMaxLevel(null);
    }
  };

  const handleCustomRangeSelect = (minLevel: number, maxLevel: number) => {
    setSelectedPreset('CUSTOM');
    setCustomMinLevel(minLevel);
    setCustomMaxLevel(maxLevel);
    setShowCustomModal(false);
  };

  const getTierName = (tier: SolvedacTier): string => {
    const tierNames = [
      '', 'Bronze 5', 'Bronze 4', 'Bronze 3', 'Bronze 2', 'Bronze 1',
      'Silver 5', 'Silver 4', 'Silver 3', 'Silver 2', 'Silver 1',
      'Gold 5', 'Gold 4', 'Gold 3', 'Gold 2', 'Gold 1',
      'Platinum 5', 'Platinum 4', 'Platinum 3', 'Platinum 2', 'Platinum 1'
    ];
    return tierNames[tier] || `Tier ${tier}`;
  };

  const handleSave = async () => {
    if (isEnabled && selectedDays.length === 0) {
      alert('최소 하나의 요일을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      if (isEnabled) {
        const sortedDays = getSortedSelectedDays();
        await teamsApi.updateRecommendationSettings(teamId, {
          recommendationDays: sortedDays,
          problemDifficultyPreset: selectedPreset || undefined,
          customMinLevel: customMinLevel || undefined,
          customMaxLevel: customMaxLevel || undefined
        });
      } else {
        // await teamsApi.disableRecommendation(teamId);
        await teamsApi.updateRecommendationSettings(teamId, {
          recommendationDays: [],
          problemDifficultyPreset: selectedPreset || undefined,
          customMinLevel: customMinLevel || undefined,
          customMaxLevel: customMaxLevel || undefined
        });
      }

      onSettingsUpdate();
      onShowToast();
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
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  문제 추천 설정
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Toggle Switch */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">자동 문제 추천</p>
                    <p className="text-sm text-gray-500">팀원들에게 정기적으로 문제를 추천합니다</p>
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

              {/* Day Selection */}
              {isEnabled && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <h4 className="font-medium text-gray-900">추천 요일 선택</h4>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {weekDays.map(day => (
                      <label
                        key={day.key}
                        className={`relative flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer transition-all duration-200 select-none ${
                          selectedDays.includes(day.key)
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDays.includes(day.key)}
                          onChange={() => handleDayToggle(day.key)}
                          className="sr-only"
                          disabled={isLoading}
                        />
                        <span className="text-sm font-semibold">{day.label.charAt(0)}</span>
                        {selectedDays.includes(day.key) && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </label>
                    ))}
                  </div>

                  {selectedDays.length === 0 && (
                    <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                      <Target className="h-4 w-4" />
                      <p className="text-sm font-medium">최소 하나의 요일을 선택해주세요</p>
                    </div>
                  )}

                  {selectedDays.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-blue-900 mb-1">
                            선택된 요일 ({selectedDays.length}개)
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {getSortedSelectedDays().map(day => {
                              const dayInfo = weekDays.find(w => w.key === day);
                              return (
                                <span key={day} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                  {dayInfo?.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Difficulty Selection */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-gray-500" />
                  <h4 className="font-medium text-gray-900">문제 난이도 선택</h4>
                </div>

                <div className="space-y-3">
                  {/* First row: 쉬움, 보통, 어려움 */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'EASY' as ProblemDifficultyPreset, label: '쉬움', subtitle: '브론즈 1 ~ 실버 3', color: 'bg-green-50 border-green-200 text-green-700' },
                      { key: 'NORMAL' as ProblemDifficultyPreset, label: '보통', subtitle: '실버 2 ~ 골드 4', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                      { key: 'HARD' as ProblemDifficultyPreset, label: '어려움', subtitle: '골드 3 ~ 플래티넘 5', color: 'bg-red-50 border-red-200 text-red-700' }
                    ].map(preset => (
                      <label
                        key={preset.key}
                        className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
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
                        <div className="text-center">
                          <div className="flex items-center justify-center">
                            <span className="font-medium">{preset.label}</span>
                            {selectedPreset === preset.key && (
                              <CheckCircle className="h-4 w-4 ml-2" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{preset.subtitle}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Second row: 커스텀 (full width) */}
                  <label
                    className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPreset === 'CUSTOM'
                        ? 'bg-purple-50 border-purple-200 text-purple-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 border-dashed'
                    }`}
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      checked={selectedPreset === 'CUSTOM'}
                      onChange={() => handlePresetSelect('CUSTOM')}
                      className="sr-only"
                      disabled={isLoading}
                    />
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <span className="font-medium">커스텀</span>
                        {selectedPreset === 'CUSTOM' && (
                          <CheckCircle className="h-4 w-4 ml-2" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">직접 선택</span>
                    </div>
                  </label>

                  {selectedPreset && (
                    <div className={`rounded-lg p-3 ${
                      selectedPreset === 'CUSTOM'
                        ? 'bg-purple-50 border border-purple-200'
                        : 'bg-green-50 border border-green-200'
                    }`}>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className={`h-4 w-4 mt-0.5 ${
                          selectedPreset === 'CUSTOM' ? 'text-purple-600' : 'text-green-600'
                        }`} />
                        <div className={`text-sm ${
                          selectedPreset === 'CUSTOM' ? 'text-purple-700' : 'text-green-700'
                        }`}>
                          <p className="font-medium">선택된 난이도: {
                            selectedPreset === 'EASY' ? '쉬움 (Bronze 1 ~ Silver 3)' :
                            selectedPreset === 'NORMAL' ? '보통 (Silver 2 ~ Gold 4)' :
                            selectedPreset === 'HARD' ? '어려움 (Gold 3 ~ Platinum 5)' :
                            (customMinLevel && customMaxLevel) ? `커스텀 (${getTierName(customMinLevel as SolvedacTier)} ~ ${getTierName(customMaxLevel as SolvedacTier)})` : '커스텀'
                          }</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Spacer */}
              <div className="h-4"></div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">이메일 발송 안내</p>
                    <p>선택한 요일마다 <strong>오전 9시</strong>에 팀원들에게 추천 문제가 이메일로 발송됩니다.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
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
        </div>

        {/* 커스텀 티어 선택 모달 */}
        {showCustomModal && (
          <CustomTierModal
            onClose={() => setShowCustomModal(false)}
            onSelect={handleCustomRangeSelect}
            currentMinLevel={customMinLevel}
            currentMaxLevel={customMaxLevel}
          />
        )}
      </div>
    </>
  );
}