import { UserPlus, Lock } from 'lucide-react';
import { toast } from '../../../components/common/toast';
import { SquadSettingsModal } from './components/modals/SquadSettingsModal';
import { MemberInviteModal } from './components/modals/MemberInviteModal';
import TeamEditModal from './components/modals/TeamEditModal';
import { TodayProblems } from './components/problems/TodayProblems';
import { TeamDetailError } from '../../../components/common/TeamDetailError';
import ConfirmModal from '../../../components/common/ConfirmModal';
import TeamInfoSection from './components/team/TeamInfoSection';
import TeamMembersList from './components/team/TeamMembersList';
import TeamActionMenu from './components/team/TeamActionMenu';
import TeamActivityBoard, { ProblemDetail } from './components/TeamActivityBoard';
import SentInvitationsModal from './components/modals/SentInvitationsModal';
import SquadsList from './components/squads/SquadsList';
import SquadManagementPage from './components/squads/SquadManagementPage';
import { useTeamDetailPageState } from './hooks/useTeamDetailPageState';

export default function TeamDetailPage() {
  const { route, auth, data, ui, actions } = useTeamDetailPageState();

  // 유효하지 않은 팀 ID
  if (!route.numericTeamId) {
    return <TeamDetailError error={{ type: 'not-found', message: '유효하지 않은 팀 ID입니다.' }} />;
  }

  if (data.detailLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (data.detailError) {
    return <TeamDetailError error={data.detailError} onRetry={actions.handleRetry} />;
  }

  return (
    <div className="relative">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="py-4 mb-4 border-b border-gray-200">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex-auto">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                  {data.teamInfo?.teamName || data.currentTeam?.teamName || `스터디 팀 #${route.teamId}`}
                </h1>
                {(data.teamInfo?.isPrivate || data.currentTeam?.isPrivate) && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 flex-shrink-0">
                    <Lock className="h-3 w-3 mr-1" />
                    비공개
                  </span>
                )}
                {data.isTeamLeader && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 flex-shrink-0">
                    팀장
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 break-words">
                {data.teamInfo?.description || data.currentTeam?.teamDescription || `${data.teamMembers.length}명의 팀원과 함께 성장하는 알고리즘 스터디`}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center justify-end gap-2">
              {!auth.isAuthenticated ? (
                <button
                  onClick={auth.openLoginModal}
                  disabled
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed whitespace-nowrap"
                  title="준비 중인 기능입니다"
                >
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">가입 신청</span>
                  <span className="sm:hidden">가입</span>
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-gray-200 text-gray-500 rounded">준비 중</span>
                </button>
              ) : (
                <>
                  {!auth.isReadOnly && data.isTeamLeader ? (
                    <button
                      onClick={actions.handleOpenInvite}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors whitespace-nowrap"
                    >
                      <UserPlus className="h-4 w-4 mr-1.5" />
                      <span className="hidden sm:inline">멤버 초대</span>
                      <span className="sm:hidden">초대</span>
                    </button>
                  ) : !auth.isReadOnly && !data.isTeamMember && (
                    <button
                      disabled
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed whitespace-nowrap"
                      title="준비 중인 기능입니다"
                    >
                      <UserPlus className="h-4 w-4 mr-1.5" />
                      <span className="hidden sm:inline">가입 신청</span>
                      <span className="sm:hidden">가입</span>
                      <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-gray-200 text-gray-500 rounded">준비 중</span>
                    </button>
                  )}
                  {!auth.isReadOnly && (
                    <TeamActionMenu
                      isTeamLeader={data.isTeamLeader}
                      isTeamMember={data.isTeamMember}
                      onLeaveClick={actions.handleOpenLeaveConfirm}
                      onDeleteClick={actions.handleOpenDeleteConfirm}
                      onEditClick={actions.handleOpenEditModal}
                      onSentInvitationsClick={actions.handleOpenSentInvitations}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* 스쿼드 탭 — 그리드 전체 위 */}
        {data.squads.length > 0 && (
          <div className="mt-6">
            <SquadsList
              squads={data.squads}
              isTeamLeader={data.isTeamLeader}
              loading={data.detailLoading}
              selectedSquadId={data.selectedSquadId}
              onSelectSquad={actions.setSelectedSquadId}
              currentUserMemberId={data.currentUserMember?.memberId}
              currentUserSquadId={data.currentUserMember?.squadId ?? null}
              onOpenManagement={() => actions.setShowSquadManagement(true)}
              onOpenSettings={actions.handleOpenSquadSettings}
            />
          </div>
        )}

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-3">
          <div className="lg:col-span-2">
            <TodayProblems
              teamId={route.numericTeamId!}
              isTeamLeader={data.isTeamLeader}
              isTeamMember={data.isTeamMember}
              onShowToast={toast}
              onOpenSettings={actions.handleOpenSquadSettings}
              onOpenSquadManagement={() => actions.setShowSquadManagement(true)}
              onRefreshActivity={actions.handleRefreshActivity}
              recommendationSettings={data.activeRecommendationSettings}
              initialTodayProblems={data.activeTodayProblems}
              selectedSquadId={data.selectedSquad?.squadId ?? null}
              selectedSquadMemberCount={data.selectedSquad?.memberCount ?? 0}
              isDemo={auth.isDemo}
            />

            <div className="mt-6">
              <TeamActivityBoard
                teamId={route.numericTeamId!}
                activityData={data.activityData}
                loading={data.activityLoading}
                reloadKey={data.activityReloadKey}
                onCellSelect={actions.setSelectedCellInfo}
                squads={data.squads}
                teamMembers={data.teamMembers}
                isDemo={auth.isDemo}
              />
            </div>

            {/* 셀 선택 시 문제 상세 팝업 - 모바일에서는 TeamActivityBoard 바로 밑에 표시 */}
            {data.selectedCellInfo && (
              <div className="mt-6 lg:hidden bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    해결 현황
                  </h3>
                  <button
                    onClick={() => actions.setSelectedCellInfo(null)}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                  >
                    닫기
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {data.selectedCellInfo.handle[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    @{data.selectedCellInfo.handle}
                  </span>
                </div>
                <ProblemDetail
                  date={data.selectedCellInfo.date}
                  data={data.selectedCellInfo.data}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <TeamInfoSection
              recommendationSettings={data.activeRecommendationSettings}
            />

            <TeamMembersList members={data.teamMembers} squads={data.squads} />

            {/* 셀 선택 시 문제 상세 팝업 - 데스크톱에서는 사이드바에 표시 */}
            {data.selectedCellInfo && (
              <div className="hidden lg:block bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    해결 현황
                  </h3>
                  <button
                    onClick={() => actions.setSelectedCellInfo(null)}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                  >
                    닫기
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {data.selectedCellInfo.handle[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    @{data.selectedCellInfo.handle}
                  </span>
                </div>
                <ProblemDetail
                  date={data.selectedCellInfo.date}
                  data={data.selectedCellInfo.data}
                />
              </div>
            )}
          </div>
        </div>

        {/* 스쿼드 관리 전체화면 */}
        {ui.showSquadManagement && (
          <SquadManagementPage
            teamId={route.numericTeamId!}
            squads={data.squads}
            allMembers={data.teamMembers}
            onClose={() => actions.setShowSquadManagement(false)}
            onSaveSuccess={() => {
              actions.setShowSquadManagement(false);
              actions.handleRetrySilent();
            }}
            onShowToast={toast}
            onSquadsChange={actions.setSquads}
            isDemo={auth.isDemo}
          />
        )}

        {/* 스쿼드 추천 설정 모달 (스쿼드 선택 시) */}
        {ui.showSquadSettings && data.selectedSquad && (
          <SquadSettingsModal
            teamId={route.numericTeamId!}
            squadId={data.selectedSquad.squadId}
            squadName={data.selectedSquad.squadName}
            settings={data.selectedSquad.recommendationSettings ?? data.selectedSquadFromDetail?.recommendationSettings ?? null}
            onClose={actions.handleCloseSquadSettings}
            onSettingsUpdate={actions.handleSquadSettingsUpdate}
            onShowToast={toast}
          />
        )}


        {/* 멤버 초대 모달 */}
        {ui.showInviteModal && (
          <MemberInviteModal
            teamId={route.numericTeamId!}
            onClose={actions.handleCloseInvite}
            onShowToast={toast}
            onInviteSuccess={actions.handleInviteSuccess}
          />
        )}

        {/* 팀 정보 수정 모달 */}
        {ui.showEditModal && (
          <TeamEditModal
            teamId={route.numericTeamId!}
            initialName={data.teamInfo?.teamName || data.currentTeam?.teamName || ''}
            initialDescription={data.teamInfo?.description || data.currentTeam?.teamDescription || ''}
            initialIsPrivate={data.teamInfo?.isPrivate || data.currentTeam?.isPrivate || false}
            onClose={actions.handleCloseEditModal}
            onSubmit={actions.handleEditSubmit}
            isLoading={data.isEditLoading}
          />
        )}

        {/* 팀 탈퇴 확인 모달 */}
        <ConfirmModal
          isOpen={ui.showLeaveConfirm}
          title="팀 탈퇴"
          message={`정말 ${data.currentTeam?.teamName || '이 팀'}에서 탈퇴하시겠습니까?\n탈퇴 후에는 다시 초대를 받아야 합니다.`}
          confirmText="탈퇴"
          cancelText="취소"
          confirmButtonVariant="danger"
          onConfirm={actions.handleLeaveTeam}
          onCancel={actions.handleCloseLeaveConfirm}
          isLoading={data.isActionLoading}
        />

        {/* 팀 해산 확인 모달 */}
        <ConfirmModal
          isOpen={ui.showDeleteConfirm}
          title="팀 해산"
          message={`정말 ${data.currentTeam?.teamName || '이 팀'}을(를) 해산하시겠습니까?\n해산된 팀은 복구할 수 없으며, 모든 팀원이 팀에서 제거됩니다.`}
          confirmText="해산"
          cancelText="취소"
          confirmButtonVariant="danger"
          onConfirm={actions.handleDeleteTeam}
          onCancel={actions.handleCloseDeleteConfirm}
          isLoading={data.isActionLoading}
        />

        {/* 초대 현황 모달 */}
        {ui.showSentInvitationsModal && (
          <SentInvitationsModal
            teamId={route.numericTeamId!}
            onClose={actions.handleCloseSentInvitations}
            onShowToast={toast}
          />
        )}
      </div>
    </div>
  );
}
