import { useParams } from 'react-router-dom';
import { Users, Settings, Plus, Calendar, Target, X, Clock, Mail, CheckCircle, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { teamsApi, type TeamMemberResponse, type TeamRecommendationSettingsResponse } from '../api/teams';

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const [teamMembers, setTeamMembers] = useState<TeamMemberResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [recommendationSettings, setRecommendationSettings] = useState<TeamRecommendationSettingsResponse | null>(null);

  // 현재 사용자가 팀장인지 확인
  const currentUserMember = teamMembers.find(member => member.isMe);
  const isTeamLeader = currentUserMember?.role === 'LEADER';

  useEffect(() => {
    if (teamId) {
      loadTeamMembers();
      loadRecommendationSettings();
    }
  }, [teamId]);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const members = await teamsApi.getTeamMembers(Number(teamId));
      setTeamMembers(members);
    } catch (error) {
      console.error('팀 멤버 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendationSettings = async () => {
    try {
      const settings = await teamsApi.getRecommendationSettings(Number(teamId));
      setRecommendationSettings(settings);
    } catch (error) {
      console.error('추천 설정 로딩 실패:', error);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            스터디 팀 #{teamId}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            팀 상세 정보 및 멤버 관리
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          {isTeamLeader ? (
            <>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <Settings className="h-4 w-4 mr-2" />
                설정
              </button>
              <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                멤버 초대
              </button>
            </>
          ) : (
            <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-md">
              <Lock className="h-4 w-4 mr-2" />
              팀장만 설정할 수 있습니다
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                이번 주 과제
              </h3>
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  아직 과제가 없습니다
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  팀 리더가 문제를 추천하면 여기에 표시됩니다.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                진행률 차트
              </h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">차트가 여기에 표시됩니다</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                팀 정보
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">
                    {teamMembers.length}명 참여
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Target className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">
                    팀 ID: {teamId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                멤버 목록 ({teamMembers.length}명)
              </h3>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.memberId} className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {member.handle?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            @{member.handle || '핸들 없음'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {member.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.role === 'LEADER'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {member.role === 'LEADER' ? '팀장' : '팀원'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {teamMembers.length === 0 && (
                <div className="text-center py-4">
                  <Users className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    멤버 정보를 불러오는 중...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 설정 모달 */}
      {showSettingsModal && (
        <TeamSettingsModal
          teamId={Number(teamId)}
          settings={recommendationSettings}
          onClose={() => setShowSettingsModal(false)}
          onSettingsUpdate={loadRecommendationSettings}
        />
      )}
    </div>
  );
}

interface TeamSettingsModalProps {
  teamId: number;
  settings: TeamRecommendationSettingsResponse | null;
  onClose: () => void;
  onSettingsUpdate: () => void;
}

function TeamSettingsModal({ teamId, settings, onClose, onSettingsUpdate }: TeamSettingsModalProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // settings가 변경될 때마다 상태 업데이트
  useEffect(() => {
    console.log('모달 설정 로드:', settings);
    if (settings) {
      console.log('기존 설정 적용:', {
        days: settings.recommendationDays,
        isActive: settings.isActive
      });
      setSelectedDays(settings.recommendationDays || []);
      setIsEnabled(settings.isActive || false);
    } else {
      console.log('기본값 설정 적용');
      // settings가 없으면 기본값
      setSelectedDays([]);
      setIsEnabled(false);
    }
  }, [settings]);

  const weekDays = [
    { key: 'MONDAY', label: '월요일', order: 1 },
    { key: 'TUESDAY', label: '화요일', order: 2 },
    { key: 'WEDNESDAY', label: '수요일', order: 3 },
    { key: 'THURSDAY', label: '목요일', order: 4 },
    { key: 'FRIDAY', label: '금요일', order: 5 },
    { key: 'SATURDAY', label: '토요일', order: 6 },
    { key: 'SUNDAY', label: '일요일', order: 7 },
  ];

  // 선택된 요일을 요일 순으로 정렬
  const getSortedSelectedDays = () => {
    return [...selectedDays].sort((a, b) => {
      const orderA = weekDays.find(day => day.key === a)?.order || 0;
      const orderB = weekDays.find(day => day.key === b)?.order || 0;
      return orderA - orderB;
    });
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSave = async () => {
    if (isEnabled && selectedDays.length === 0) {
      alert('최소 하나의 요일을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      if (isEnabled) {
        // 요일 순으로 정렬하여 전송
        const sortedDays = getSortedSelectedDays();
        await teamsApi.updateRecommendationSettings(teamId, { recommendationDays: sortedDays });
      } else {
        await teamsApi.disableRecommendation(teamId);
      }
      onSettingsUpdate();
      onClose();
    } catch (error) {
      console.error('설정 저장 실패:', error);
      alert('설정 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

                <div className="grid grid-cols-2 gap-2">
                  {weekDays.map(day => (
                    <label
                      key={day.key}
                      className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedDays.includes(day.key)
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day.key)}
                        onChange={() => handleDayToggle(day.key)}
                        className="sr-only"
                        disabled={isLoading}
                      />
                      <span className="font-medium">{day.label}</span>
                      {selectedDays.includes(day.key) && (
                        <CheckCircle className="h-4 w-4 ml-2 text-blue-600" />
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
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="text-sm text-green-700">
                        <p className="font-medium">선택된 요일: {selectedDays.length}개</p>
                        <p>{getSortedSelectedDays().map(day => weekDays.find(w => w.key === day)?.label).join(', ')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

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
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
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
    </div>
  );
}