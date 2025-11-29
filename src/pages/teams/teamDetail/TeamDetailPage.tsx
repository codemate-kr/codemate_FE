import { useParams, useNavigate, Link } from 'react-router-dom';
import { UserPlus, Lock } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from '../../../components/common/toast';
import { TeamSettingsModal } from '../components/TeamSettingsModal';
import { MemberInviteModal } from '../components/MemberInviteModal';
import { TodayProblems } from '../components/TodayProblems';
import { TeamDetailError } from '../../../components/common/TeamDetailError';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { teamsApi } from '../../../api/teams';
import TeamInfoSection from './components/TeamInfoSection';
import TeamMembersList from './components/TeamMembersList';
import TeamActionMenu from './components/TeamActionMenu';
import { useTeamStore, useCurrentTeamDetails, useDetailLoading, useDetailError, useTeams } from '../../../store/teamStore';
import { useAuthStore } from '../../../store/authStore';

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // teamId를 숫자로 변환 (메모이제이션)
  const numericTeamId = useMemo(() => teamId ? Number(teamId) : null, [teamId]);

  // Selector hooks 사용
  const currentTeamDetails = useCurrentTeamDetails();
  const detailLoading = useDetailLoading();
  const detailError = useDetailError();
  const teams = useTeams();
  const { fetchTeamDetails, refreshTeamSettings, leaveTeam, deleteTeam } = useTeamStore();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // 현재 팀 정보 (메모이제이션)
  const teamInfo = currentTeamDetails?.team ?? null;
  const teamMembers = currentTeamDetails?.members ?? [];
  const recommendationSettings = currentTeamDetails?.settings ?? null;

  const currentUserMember = useMemo(
    () => teamMembers.find(member => member.isMe),
    [teamMembers]
  );
  const isTeamLeader = currentUserMember?.role === 'LEADER';
  const isTeamMember = !!currentUserMember;

  // 팀 기본 정보 (통합 API의 team 정보 우선, 없으면 teams 목록에서 가져옴)
  const currentTeam = useMemo(
    () => teams.find(team => team.teamId === numericTeamId),
    [teams, numericTeamId]
  );

  useEffect(() => {
    if (numericTeamId) {
      fetchTeamDetails(numericTeamId);
    }
  }, [numericTeamId, fetchTeamDetails]);

  const handleSettingsUpdate = useCallback(async () => {
    if (!numericTeamId) return;
    await refreshTeamSettings(numericTeamId);
  }, [numericTeamId, refreshTeamSettings]);

  const handleRetry = useCallback(() => {
    if (numericTeamId) {
      fetchTeamDetails(numericTeamId);
    }
  }, [numericTeamId, fetchTeamDetails]);

  const handleLeaveTeam = useCallback(async () => {
    if (!numericTeamId) return;

    setIsActionLoading(true);
    try {
      await leaveTeam(numericTeamId);
      toast('팀에서 탈퇴했습니다');
      setShowLeaveConfirm(false);
      setTimeout(() => navigate('/teams'), 1000);
    } catch (error: any) {
      toast(error?.message || '팀 탈퇴에 실패했습니다', 'error');
      setShowLeaveConfirm(false);
    } finally {
      setIsActionLoading(false);
    }
  }, [numericTeamId, leaveTeam, navigate]);

  const handleDeleteTeam = useCallback(async () => {
    if (!numericTeamId) return;

    setIsActionLoading(true);
    try {
      await deleteTeam(numericTeamId);
      toast('팀이 해산되었습니다');
      setShowDeleteConfirm(false);
      setTimeout(() => navigate('/teams'), 1000);
    } catch (error: any) {
      toast(error?.message || '팀 해산에 실패했습니다', 'error');
      setShowDeleteConfirm(false);
    } finally {
      setIsActionLoading(false);
    }
  }, [numericTeamId, deleteTeam, navigate]);

  const handleInviteSuccess = useCallback(() => {
    if (numericTeamId) {
      fetchTeamDetails(numericTeamId);
    }
  }, [numericTeamId, fetchTeamDetails]);

  const handleOpenSettings = useCallback(() => setShowSettingsModal(true), []);
  const handleCloseSettings = useCallback(() => setShowSettingsModal(false), []);
  const handleOpenInvite = useCallback(() => setShowInviteModal(true), []);
  const handleCloseInvite = useCallback(() => setShowInviteModal(false), []);
  const handleOpenLeaveConfirm = useCallback(() => setShowLeaveConfirm(true), []);
  const handleCloseLeaveConfirm = useCallback(() => setShowLeaveConfirm(false), []);
  const handleOpenDeleteConfirm = useCallback(() => setShowDeleteConfirm(true), []);
  const handleCloseDeleteConfirm = useCallback(() => setShowDeleteConfirm(false), []);

  const handleJoinRequest = useCallback(() => {
    // TODO: 가입 신청 API 연동
    toast('가입 신청 기능은 준비 중입니다', 'error');
  }, []);

  const { updateTeam } = useTeamStore();

  const handleVisibilityToggle = useCallback(async () => {
    if (!numericTeamId) return;

    const currentIsPrivate = teamInfo?.isPrivate || currentTeam?.isPrivate;
    const newIsPrivate = !currentIsPrivate;

    try {
      await teamsApi.updateVisibility(numericTeamId, newIsPrivate);
      // teams 배열도 업데이트 (캐시 동기화)
      updateTeam(numericTeamId, { isPrivate: newIsPrivate });
      toast(newIsPrivate ? '비공개 팀으로 변경되었습니다' : '공개 팀으로 변경되었습니다');
      fetchTeamDetails(numericTeamId);
    } catch (error) {
      console.error('팀 공개 설정 변경 실패:', error);
      toast('설정 변경에 실패했습니다', 'error');
    }
  }, [numericTeamId, teamInfo?.isPrivate, currentTeam?.isPrivate, fetchTeamDetails, updateTeam]);

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

  if (detailError) {
    return <TeamDetailError error={detailError} onRetry={handleRetry} />;
  }

  return (
    <div className="relative">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="py-6 mb-8 border-b border-gray-200">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex-auto">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                  {teamInfo?.teamName || currentTeam?.teamName || `스터디 팀 #${teamId}`}
                </h1>
                {(teamInfo?.isPrivate || currentTeam?.isPrivate) && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 flex-shrink-0">
                    <Lock className="h-3 w-3 mr-1" />
                    비공개
                  </span>
                )}
                {isTeamLeader && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 flex-shrink-0">
                    팀장
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 break-words">
                {teamInfo?.description || currentTeam?.teamDescription || `${teamMembers.length}명의 팀원과 함께 성장하는 알고리즘 스터디`}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center justify-end gap-2">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors whitespace-nowrap"
                >
                  <Lock className="h-4 w-4 mr-1.5" />
                  로그인하여 참여하기
                </Link>
              ) : (
                <>
                  {isTeamLeader ? (
                    <button
                      onClick={handleOpenInvite}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors whitespace-nowrap"
                    >
                      <UserPlus className="h-4 w-4 mr-1.5" />
                      <span className="hidden sm:inline">멤버 초대</span>
                      <span className="sm:hidden">초대</span>
                    </button>
                  ) : !isTeamMember && (
                    <button
                      onClick={handleJoinRequest}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors whitespace-nowrap"
                    >
                      <UserPlus className="h-4 w-4 mr-1.5" />
                      <span className="hidden sm:inline">가입 신청</span>
                      <span className="sm:hidden">가입</span>
                    </button>
                  )}
                  <TeamActionMenu
                    isTeamLeader={isTeamLeader}
                    isTeamMember={isTeamMember}
                    isPrivate={teamInfo?.isPrivate || currentTeam?.isPrivate}
                    onLeaveClick={handleOpenLeaveConfirm}
                    onDeleteClick={handleOpenDeleteConfirm}
                    onVisibilityClick={handleVisibilityToggle}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TodayProblems
              teamId={numericTeamId!}
              isTeamLeader={isTeamLeader}
              isTeamMember={isTeamMember}
              onShowToast={toast}
              onOpenSettings={handleOpenSettings}
              recommendationSettings={recommendationSettings}
              initialTodayProblems={currentTeamDetails?.todayProblem}
            />

            <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">진행률</h3>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                  개발 중
                </span>
              </div>
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
            <TeamInfoSection
              memberCount={teamMembers.length}
              recommendationSettings={recommendationSettings}
            />

            <TeamMembersList members={teamMembers} />
          </div>
        </div>

        {/* 설정 모달 */}
        {showSettingsModal && (
          <TeamSettingsModal
            teamId={numericTeamId!}
            settings={recommendationSettings}
            onClose={handleCloseSettings}
            onSettingsUpdate={handleSettingsUpdate}
            onShowToast={toast}
          />
        )}

        {/* 멤버 초대 모달 */}
        {showInviteModal && (
          <MemberInviteModal
            teamId={numericTeamId!}
            onClose={handleCloseInvite}
            onShowToast={toast}
            onInviteSuccess={handleInviteSuccess}
          />
        )}

        {/* 팀 탈퇴 확인 모달 */}
        <ConfirmModal
          isOpen={showLeaveConfirm}
          title="팀 탈퇴"
          message={`정말 ${currentTeam?.teamName || '이 팀'}에서 탈퇴하시겠습니까?\n탈퇴 후에는 다시 초대를 받아야 합니다.`}
          confirmText="탈퇴"
          cancelText="취소"
          confirmButtonVariant="danger"
          onConfirm={handleLeaveTeam}
          onCancel={handleCloseLeaveConfirm}
          isLoading={isActionLoading}
        />

        {/* 팀 해산 확인 모달 */}
        <ConfirmModal
          isOpen={showDeleteConfirm}
          title="팀 해산"
          message={`정말 ${currentTeam?.teamName || '이 팀'}을(를) 해산하시겠습니까?\n해산된 팀은 복구할 수 없으며, 모든 팀원이 팀에서 제거됩니다.`}
          confirmText="해산"
          cancelText="취소"
          confirmButtonVariant="danger"
          onConfirm={handleDeleteTeam}
          onCancel={handleCloseDeleteConfirm}
          isLoading={isActionLoading}
        />
      </div>
    </div>
  );
}
