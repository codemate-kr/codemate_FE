import { useParams } from 'react-router-dom';
import { Users, Settings, Plus, Target, Lock, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TeamSettingsModal } from './components/TeamSettingsModal';
import { TodayProblems } from './components/TodayProblems';
import { useTeamStore, useCurrentTeamDetails, useDetailLoading } from '../../store/teamStore';

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();

  // Selector hooks 사용
  const currentTeamDetails = useCurrentTeamDetails();
  const detailLoading = useDetailLoading();
  const { fetchTeamDetails, refreshTeamSettings } = useTeamStore();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 현재 사용자가 팀장인지 확인
  const teamMembers = currentTeamDetails?.members || [];
  const recommendationSettings = currentTeamDetails?.settings || null;
  const currentUserMember = teamMembers.find(member => member.isMe);
  const isTeamLeader = currentUserMember?.role === 'LEADER';

  useEffect(() => {
    if (teamId) {
      // store의 fetchTeamDetails 사용
      fetchTeamDetails(Number(teamId));
    }
  }, [teamId, fetchTeamDetails]);

  const loadRecommendationSettings = async () => {
    if (!teamId) return;
    // store의 refreshTeamSettings 사용
    await refreshTeamSettings(Number(teamId));
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  if (detailLoading) {
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
    <div className="relative">
      {/* 토스트 메시지 */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-2xl px-5 py-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-green-900">{toastMessage}</p>
                <p className="text-xs text-green-600 mt-0.5">성공적으로 처리되었습니다</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8">
      {/* 개선된 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 mb-8 border-b border-gray-200">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                스터디 팀 #{teamId}
              </h1>
              {isTeamLeader && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
                  팀장
                </span>
              )}
            </div>
            <p className="text-base text-gray-600">
              {teamMembers.length}명의 팀원과 함께 성장하는 알고리즘 스터디
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            {isTeamLeader ? (
              <>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  문제 추천 설정
                </button>
                <button className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all hover:shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  멤버 초대
                </button>
              </>
            ) : (
              <div className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2.5 rounded-lg shadow-sm">
                <Lock className="h-4 w-4 mr-2" />
                팀장만 설정할 수 있습니다
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodayProblems
            teamId={Number(teamId)}
            isTeamLeader={isTeamLeader}
            onShowToast={showToastMessage}
          />

          <div className="mt-6 bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                진행률 차트
              </h3>
            </div>
            <div className="p-6">
              <div className="h-64 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-purple-200">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-2">진행률 차트 준비 중</p>
                <p className="text-sm text-gray-500">팀원들의 문제 풀이 통계가 곧 표시됩니다</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Target className="h-5 w-5 mr-2" />
                팀 정보
              </h3>
            </div>
            <div className="px-6 py-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">팀원 수</p>
                      <p className="text-lg font-bold text-gray-900">{teamMembers.length}명</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <Settings className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">문제 추천</p>
                      <p className="text-sm font-bold text-gray-900">
                        {recommendationSettings?.isActive ? (
                          <span className="text-green-600">활성화</span>
                        ) : (
                          <span className="text-gray-500">비활성화</span>
                        )}
                      </p>
                    </div>
                  </div>
                  {recommendationSettings?.isActive && (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>

                {recommendationSettings?.isActive && recommendationSettings.recommendationDayNames && (
                  <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <p className="text-xs text-gray-600 font-medium mb-2">추천 요일</p>
                    <div className="flex flex-wrap gap-1.5">
                      {recommendationSettings.recommendationDayNames.map((day) => (
                        <span key={day} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-700">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  멤버 목록
                </span>
                <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                  {teamMembers.length}명
                </span>
              </h3>
            </div>
            <div className="px-6 py-5">
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.memberId}
                    className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                      member.isMe
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md'
                        : 'bg-white border border-gray-200 hover:border-blue-200 hover:shadow-md'
                    }`}
                  >
                    <div className="relative">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${
                        member.role === 'LEADER'
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                          : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                      }`}>
                        {member.handle?.[0]?.toUpperCase() || '?'}
                      </div>
                      {member.isMe && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-900">
                              @{member.handle || '핸들 없음'}
                            </p>
                            {member.isMe && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-green-100 text-green-700">
                                나
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {member.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                            member.role === 'LEADER'
                              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border border-orange-200'
                              : 'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                            {member.role === 'LEADER' ? '👑 팀장' : '팀원'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {teamMembers.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">
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
          onShowToast={showToastMessage}
        />
      )}
      </div>
    </div>
  );
}
