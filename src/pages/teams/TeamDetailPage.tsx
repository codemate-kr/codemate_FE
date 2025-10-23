import { useParams } from 'react-router-dom';
import { Lock, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TeamSettingsModal } from './components/TeamSettingsModal';
import { MemberInviteModal } from './components/MemberInviteModal';
import { TodayProblems } from './components/TodayProblems';
import { Toast } from '../../components/common/Toast';
import { TeamDetailError } from '../../components/common/TeamDetailError';
import { useTeamStore, useCurrentTeamDetails, useDetailLoading, useDetailError, useTeams } from '../../store/teamStore';
import { getTierName } from '../../utils/tierUtils';
import type { SolvedacTier } from '../../api/teams';

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();

  // Selector hooks 사용
  const currentTeamDetails = useCurrentTeamDetails();
  const detailLoading = useDetailLoading();
  const detailError = useDetailError();
  const teams = useTeams();
  const { fetchTeamDetails, refreshTeamSettings } = useTeamStore();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 현재 사용자가 팀장인지 확인
  const teamMembers = currentTeamDetails?.members || [];
  const recommendationSettings = currentTeamDetails?.settings || null;
  const currentUserMember = teamMembers.find(member => member.isMe);
  const isTeamLeader = currentUserMember?.role === 'LEADER';

  // 팀 기본 정보 가져오기
  const currentTeam = teams.find(team => team.teamId === Number(teamId));

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

  const handleRetry = () => {
    if (teamId) {
      fetchTeamDetails(Number(teamId));
    }
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

  // 에러 상태 표시
  if (detailError) {
    return <TeamDetailError error={detailError} onRetry={handleRetry} />;
  }

  return (
    <div className="relative">
      {/* 토스트 메시지 */}
      {showToast && <Toast message={toastMessage} type="success" />}

      <div className="px-4 sm:px-6 lg:px-8">
      {/* 심플한 헤더 */}
      <div className="py-6 mb-8 border-b border-gray-200">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                {currentTeam?.teamName || recommendationSettings?.teamName || `스터디 팀 #${teamId}`}
              </h1>
              {isTeamLeader && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 flex-shrink-0">
                  팀장
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 break-words">
              {currentTeam?.teamDescription || `${teamMembers.length}명의 팀원과 함께 성장하는 알고리즘 스터디`}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            {isTeamLeader ? (
              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors whitespace-nowrap"
              >
                <UserPlus className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">멤버 초대</span>
                <span className="sm:hidden">초대</span>
              </button>
            ) : (
              <div className="flex items-center text-xs text-gray-500 whitespace-nowrap">
                <Lock className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">팀장 전용</span>
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
            onOpenSettings={() => setShowSettingsModal(true)}
            recommendationSettings={recommendationSettings}
          />

          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">진행률</h3>
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-300">
              <div className="text-center">
                <svg className="h-12 w-12 text-gray-300 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <p className="text-sm text-gray-400">차트 준비 중</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* 팀 정보 - 심플 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">팀 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">팀원</span>
                <span className="font-medium">{teamMembers.length}명</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">문제 추천</span>
                <span className={recommendationSettings?.isActive ? 'text-green-600 font-medium' : 'text-gray-400'}>
                  {recommendationSettings?.isActive ? '활성' : '비활성'}
                </span>
              </div>
              {recommendationSettings?.isActive && (
                <>
                  {(recommendationSettings.minTierName && recommendationSettings.maxTierName) ||
                   (recommendationSettings.customMinLevel && recommendationSettings.customMaxLevel) ? (
                    <div className="flex justify-between">
                      <span className="text-gray-500">문제 난이도</span>
                      <span className="font-medium text-gray-900 text-sm">
                        {recommendationSettings.minTierName && recommendationSettings.maxTierName
                          ? `${recommendationSettings.minTierName} ~ ${recommendationSettings.maxTierName}`
                          : `${getTierName(recommendationSettings.customMinLevel as SolvedacTier)} ~ ${getTierName(recommendationSettings.customMaxLevel as SolvedacTier)}`
                        }
                      </span>
                    </div>
                  ) : null}
                  {recommendationSettings.recommendationDayNames && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1.5">추천 요일</p>
                      <div className="flex flex-wrap gap-1">
                        {recommendationSettings.recommendationDayNames.map((day) => (
                          <span key={day} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 멤버 목록 - 심플 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              멤버 ({teamMembers.length})
            </h3>
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.memberId}
                  className={`flex items-center gap-3 p-2 rounded ${
                    member.isMe ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    member.role === 'LEADER' ? 'bg-blue-600' : 'bg-gray-400'
                  }`}>
                    {member.handle?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      @{member.handle || '핸들 없음'}
                      {member.isMe && <span className="ml-1 text-xs text-blue-600">(나)</span>}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{member.email}</p>
                  </div>
                  {member.role === 'LEADER' && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">팀장</span>
                  )}
                </div>
              ))}
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

      {/* 멤버 초대 모달 */}
      {showInviteModal && (
        <MemberInviteModal
          teamId={Number(teamId)}
          onClose={() => setShowInviteModal(false)}
          onShowToast={showToastMessage}
          onInviteSuccess={() => {
            // 팀 멤버 목록 새로고침
            if (teamId) {
              fetchTeamDetails(Number(teamId));
            }
          }}
        />
      )}
      </div>
    </div>
  );
}
