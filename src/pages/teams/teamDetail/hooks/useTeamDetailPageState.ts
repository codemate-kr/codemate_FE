import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { toast } from '../../../../components/common/toast';
import { teamsApi } from '../../../../api/teams';
import { useTeamStore, useCurrentTeamDetails, useDetailLoading, useDetailError, useTeams } from '../../../../store/teamStore';
import { useAuthStore } from '../../../../store/authStore';
import { useLoginModal } from '../../../../contexts/LoginModalContext';
import { isDemoMode, demoTeamDetails, demoActivityData, demoTeams, demoSquads } from '../../../../data/demoData';
import type { SquadResponse } from '../../../../api/squads';
import { useTimerStore } from '../../../../store/timerStore';
import type { SelectedCellInfo } from '../components/TeamActivityBoard';
import { getApiErrorMessage } from '../../../../utils/apiError';

export function useTeamDetailPageState() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated: realIsAuthenticated } = useAuthStore();
  const { openLoginModal } = useLoginModal();

  const isDemo = isDemoMode();
  const isAuthenticated = isDemo ? true : realIsAuthenticated;
  const isReadOnly = isDemo;

  const numericTeamId = useMemo(() => {
    if (!teamId) return null;
    const parsed = Number(teamId);
    if (!Number.isInteger(parsed) || parsed < 1) return null;
    return parsed;
  }, [teamId]);

  const realCurrentTeamDetails = useCurrentTeamDetails();
  const realDetailLoading = useDetailLoading();
  const realDetailError = useDetailError();
  const realTeams = useTeams();
  const { fetchTeamDetails, leaveTeam, deleteTeam, refreshSquadSettings } = useTeamStore();
  const leaveNavigateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deleteNavigateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentTeamDetails = isDemo ? demoTeamDetails : realCurrentTeamDetails;
  const detailLoading = isDemo ? false : realDetailLoading;
  const detailError = isDemo ? null : realDetailError;
  const teams = isDemo ? demoTeams : realTeams;

  const [selectedSquadId, setSelectedSquadId] = useState<number | null>(() => {
    if (!isDemo) return null;
    const mySquad = demoSquads.find((s) => (s.members ?? []).some((m) => m.isMe));
    return mySquad?.squadId ?? demoSquads[0]?.squadId ?? null;
  });

  const [showSquadSettings, setShowSquadSettings] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSentInvitationsModal, setShowSentInvitationsModal] = useState(false);
  const [showSquadManagement, setShowSquadManagement] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [selectedCellInfo, setSelectedCellInfo] = useState<SelectedCellInfo | null>(null);
  const [activityData] = useState(isDemo ? demoActivityData : null);
  const [activityLoading] = useState(false);
  const [activityReloadKey, setActivityReloadKey] = useState(0);

  const teamInfo = currentTeamDetails?.team ?? null;
  const teamMembers = useMemo(
    () => currentTeamDetails?.members ?? [],
    [currentTeamDetails?.members]
  );
  const [squads, setSquads] = useState<SquadResponse[]>(isDemo ? demoSquads : []);
  const selectedSquad = squads.find((s) => s.squadId === selectedSquadId) ?? null;
  const squadDetailsFromTeam = currentTeamDetails?.squads ?? [];
  const selectedSquadFromDetail = squadDetailsFromTeam.find((s) => s.squadId === selectedSquadId) ?? null;
  const activeRecommendationSettings = selectedSquad?.recommendationSettings ?? selectedSquadFromDetail?.recommendationSettings ?? null;
  const activeTodayProblems =
    selectedSquad?.todayProblems ??
    selectedSquadFromDetail?.todayProblems ??
    null;

  const currentUserMember = useMemo(
    () => teamMembers.find((member) => member.isMe),
    [teamMembers]
  );
  const isTeamLeader = currentUserMember?.role === 'LEADER';
  const isTeamMember = !!currentUserMember;

  const currentTeam = useMemo(
    () => teams.find((team) => team.teamId === numericTeamId),
    [teams, numericTeamId]
  );

  // 비팀원/공개 조회에서도 v2 팀 상세의 squads를 기본 소스로 사용
  useEffect(() => {
    if (isDemo) {
      setSquads(demoSquads);
      return;
    }
    setSquads(currentTeamDetails?.squads ?? []);
  }, [isDemo, numericTeamId, currentTeamDetails?.squads]);

  const { clearAllTimers } = useTimerStore();
  useEffect(() => {
    if (isDemo) {
      clearAllTimers();
    }
  }, [isDemo, clearAllTimers]);

  useEffect(() => () => {
    if (leaveNavigateTimeoutRef.current) {
      clearTimeout(leaveNavigateTimeoutRef.current);
    }
    if (deleteNavigateTimeoutRef.current) {
      clearTimeout(deleteNavigateTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (isDemo) return;
    if (numericTeamId) {
      fetchTeamDetails(numericTeamId);
    }
  }, [isDemo, numericTeamId, fetchTeamDetails]);

  useEffect(() => {
    if (squads.length === 0) {
      if (selectedSquadId !== null) {
        setSelectedSquadId(null);
      }
      return;
    }

    if (selectedSquadId !== null && squads.some((s) => s.squadId === selectedSquadId)) {
      return;
    }

    const mySquad = squads.find((s) => s.squadId === currentUserMember?.squadId)
      ?? squads.find((s) => (s.members ?? []).some((m) => m.isMe));
    setSelectedSquadId(mySquad?.squadId ?? squads[0]?.squadId ?? null);
  }, [squads, selectedSquadId, currentUserMember?.squadId]);

  const handleSquadSettingsUpdate = useCallback(async () => {
    if (!numericTeamId || !selectedSquad) return;
    await refreshSquadSettings(numericTeamId, selectedSquad.squadId);
  }, [numericTeamId, selectedSquad, refreshSquadSettings]);

  const handleRefreshActivity = useCallback(() => {
    if (isReadOnly || !numericTeamId) return;
    setActivityReloadKey((prev) => prev + 1);
  }, [isReadOnly, numericTeamId]);

  const handleRetry = useCallback(() => {
    if (numericTeamId) {
      fetchTeamDetails(numericTeamId);
    }
  }, [numericTeamId, fetchTeamDetails]);

  const handleRetrySilent = useCallback(() => {
    if (numericTeamId) {
      void fetchTeamDetails(numericTeamId, { silent: true });
    }
  }, [numericTeamId, fetchTeamDetails]);

  const handleLeaveTeam = useCallback(async () => {
    if (isReadOnly || !numericTeamId) return;

    setIsActionLoading(true);
    try {
      await leaveTeam(numericTeamId);
      toast('팀에서 탈퇴했습니다');
      setShowLeaveConfirm(false);
      leaveNavigateTimeoutRef.current = setTimeout(() => navigate('/teams'), 1000);
    } catch (error: unknown) {
      toast(getApiErrorMessage(error, '팀 탈퇴에 실패했습니다'), 'error');
      setShowLeaveConfirm(false);
    } finally {
      setIsActionLoading(false);
    }
  }, [isReadOnly, numericTeamId, leaveTeam, navigate]);

  const handleDeleteTeam = useCallback(async () => {
    if (isReadOnly || !numericTeamId) return;

    setIsActionLoading(true);
    try {
      await deleteTeam(numericTeamId);
      toast('팀이 해산되었습니다');
      setShowDeleteConfirm(false);
      deleteNavigateTimeoutRef.current = setTimeout(() => navigate('/teams'), 1000);
    } catch (error: unknown) {
      toast(getApiErrorMessage(error, '팀 해산에 실패했습니다'), 'error');
      setShowDeleteConfirm(false);
    } finally {
      setIsActionLoading(false);
    }
  }, [isReadOnly, numericTeamId, deleteTeam, navigate]);

  const handleInviteSuccess = useCallback(() => {
    if (numericTeamId) {
      fetchTeamDetails(numericTeamId);
    }
  }, [numericTeamId, fetchTeamDetails]);

  const handleOpenInvite = useCallback(() => setShowInviteModal(true), []);
  const handleCloseInvite = useCallback(() => setShowInviteModal(false), []);
  const handleOpenEditModal = useCallback(() => setShowEditModal(true), []);
  const handleCloseEditModal = useCallback(() => setShowEditModal(false), []);
  const handleOpenLeaveConfirm = useCallback(() => setShowLeaveConfirm(true), []);
  const handleCloseLeaveConfirm = useCallback(() => setShowLeaveConfirm(false), []);
  const handleOpenDeleteConfirm = useCallback(() => setShowDeleteConfirm(true), []);
  const handleCloseDeleteConfirm = useCallback(() => setShowDeleteConfirm(false), []);
  const handleOpenSentInvitations = useCallback(() => setShowSentInvitationsModal(true), []);
  const handleCloseSentInvitations = useCallback(() => setShowSentInvitationsModal(false), []);
  const handleOpenSquadSettings = useCallback(() => setShowSquadSettings(true), []);
  const handleCloseSquadSettings = useCallback(() => setShowSquadSettings(false), []);

  const { updateTeam } = useTeamStore();

  const [isEditLoading, setIsEditLoading] = useState(false);
  const handleEditSubmit = useCallback(async (data: { name: string; description: string; isPrivate: boolean }) => {
    if (isReadOnly || !numericTeamId) return;

    setIsEditLoading(true);
    try {
      await teamsApi.updateTeam(numericTeamId, {
        name: data.name,
        description: data.description,
        isPrivate: data.isPrivate,
      });
      updateTeam(numericTeamId, {
        teamName: data.name,
        teamDescription: data.description,
        isPrivate: data.isPrivate,
      });
      toast('팀 정보가 수정되었습니다');
      setShowEditModal(false);
      fetchTeamDetails(numericTeamId);
    } catch (error: unknown) {
      console.error('팀 정보 수정 실패:', error);
      toast(getApiErrorMessage(error, '팀 정보 수정에 실패했습니다'), 'error');
    } finally {
      setIsEditLoading(false);
    }
  }, [isReadOnly, numericTeamId, fetchTeamDetails, updateTeam]);

  return {
    route: {
      teamId,
      numericTeamId,
    },
    auth: {
      isDemo,
      isAuthenticated,
      isReadOnly,
      openLoginModal,
    },
    data: {
      detailLoading,
      detailError,
      teamInfo,
      teamMembers,
      currentTeam,
      squads,
      selectedSquadId,
      selectedSquad,
      selectedSquadFromDetail,
      activeRecommendationSettings,
      activeTodayProblems,
      currentUserMember,
      isTeamLeader,
      isTeamMember,
      isActionLoading,
      isEditLoading,
      selectedCellInfo,
      activityData,
      activityLoading,
      activityReloadKey,
    },
    ui: {
      showSquadSettings,
      showInviteModal,
      showEditModal,
      showLeaveConfirm,
      showDeleteConfirm,
      showSentInvitationsModal,
      showSquadManagement,
    },
    actions: {
      setSquads,
      setSelectedSquadId,
      setSelectedCellInfo,
      setShowSquadManagement,
      handleSquadSettingsUpdate,
      handleRefreshActivity,
      handleRetry,
      handleRetrySilent,
      handleLeaveTeam,
      handleDeleteTeam,
      handleInviteSuccess,
      handleOpenInvite,
      handleCloseInvite,
      handleOpenEditModal,
      handleCloseEditModal,
      handleOpenLeaveConfirm,
      handleCloseLeaveConfirm,
      handleOpenDeleteConfirm,
      handleCloseDeleteConfirm,
      handleOpenSentInvitations,
      handleCloseSentInvitations,
      handleOpenSquadSettings,
      handleCloseSquadSettings,
      handleEditSubmit,
    },
  };
}
