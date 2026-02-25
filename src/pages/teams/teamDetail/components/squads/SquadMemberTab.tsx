import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Pencil, Trash2, GripVertical, CheckCircle } from 'lucide-react';
import type { SquadResponse } from '../../../../../api/squads';
import type { TeamMemberResponse } from '../../../../../api/teams';
import { squadsApi } from '../../../../../api/squads';
import CreateSquadModal from '../modals/CreateSquadModal';
import ConfirmModal from '../../../../../components/common/ConfirmModal';
import { getApiErrorMessage } from '../../../../../utils/apiError';

interface SquadMemberTabProps {
  teamId: number;
  squads: SquadResponse[];
  allMembers: TeamMemberResponse[];
  onShowToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  onSquadsChange?: (squads: SquadResponse[]) => void;
  onSaveSuccess?: () => void;
  isDemo?: boolean;
}

const UNASSIGNED_DROP_ID = -1; // sentinel for unassigned column drag-over state

export default function SquadMemberTab({
  teamId,
  squads,
  allMembers,
  onShowToast,
  onSquadsChange,
  onSaveSuccess,
  isDemo,
}: SquadMemberTabProps) {
  const [tooltip, setTooltip] = useState<{ text: string; left: number; top: number } | null>(null);

  const normalizeMemberId = useCallback((value: unknown): number | null => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return null;
    return parsed;
  }, []);

  const uniqueMembers = useMemo(() => {
    const memberMap = new Map<number, TeamMemberResponse>();
    allMembers.forEach((member) => {
      const normalizedMemberId = normalizeMemberId(member.memberId);
      if (normalizedMemberId === null) return;
      memberMap.set(normalizedMemberId, { ...member, memberId: normalizedMemberId });
    });
    return Array.from(memberMap.values());
  }, [allMembers, normalizeMemberId]);

  const showTooltip = useCallback((e: React.MouseEvent<HTMLElement>, text: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      text,
      left: rect.left + (rect.width / 2),
      top: rect.top - 6,
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip(null);
  }, []);

  const buildAssignments = useCallback((targetSquads: SquadResponse[]) => {
    const map = new Map<number, number | null>();
    const availableSquadIds = new Set(targetSquads.map((s) => s.squadId));

    // v2 팀 상세의 members[].squadId를 최우선으로 사용 (squads[].members 미포함 대응)
    uniqueMembers.forEach((member) => {
      if (typeof member.squadId === 'number' && availableSquadIds.has(member.squadId)) {
        map.set(member.memberId, member.squadId);
      }
    });

    // squads[].members가 내려오는 환경에서는 보조적으로 채움
    targetSquads.forEach((squad) => {
      (squad.members ?? []).forEach((m) => {
        const normalizedMemberId = normalizeMemberId(m.memberId);
        if (normalizedMemberId === null) return;
        if (!map.has(normalizedMemberId)) {
          map.set(normalizedMemberId, squad.squadId);
        }
      });
    });

    const defaultSquadId = targetSquads.find((s) => s.isDefault)?.squadId ?? targetSquads[0]?.squadId ?? null;
    uniqueMembers.forEach((m) => {
      if (!map.has(m.memberId)) map.set(m.memberId, defaultSquadId);
    });
    return map;
  }, [uniqueMembers, normalizeMemberId]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState<SquadResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SquadResponse | null>(null);
  const [deleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [localSquads, setLocalSquads] = useState<SquadResponse[]>(squads);
  const [originalSquads, setOriginalSquads] = useState<SquadResponse[]>(squads);

  useEffect(() => {
    onSquadsChange?.(localSquads);
  }, [localSquads, onSquadsChange]);

  // null = 미배정 (엣지케이스 — 정상적으론 isDefault 스쿼드로 자동 배정)
  const [originalAssignments, setOriginalAssignments] = useState<Map<number, number | null>>(
    () => buildAssignments(squads)
  );

  const [localAssignments, setLocalAssignments] = useState<Map<number, number | null>>(
    () => new Map(originalAssignments)
  );

  const [draggingMemberId, setDraggingMemberId] = useState<number | null>(null);
  const [dragOverColId, setDragOverColId] = useState<number | null>(null); // UNASSIGNED_DROP_ID or squadId
  const draggingRef = useRef<number | null>(null);

  const unassignedMembers = useMemo(
    () => uniqueMembers.filter((m) => localAssignments.get(m.memberId) === null),
    [uniqueMembers, localAssignments]
  );

  const hasUnassigned = unassignedMembers.length > 0;

  const changedAssignments = useMemo(() => {
    const changes: Array<{ memberId: number; targetSquadId: number }> = [];
    localAssignments.forEach((squadId, memberId) => {
      if (squadId !== null && originalAssignments.get(memberId) !== squadId) {
        changes.push({ memberId, targetSquadId: squadId });
      }
    });
    return changes;
  }, [localAssignments, originalAssignments]);

  const hasSquadChanges = useMemo(() => {
    if (localSquads.length !== originalSquads.length) return true;

    const originalMap = new Map(originalSquads.map((s) => [s.squadId, s.squadName]));
    for (const squad of localSquads) {
      const originalName = originalMap.get(squad.squadId);
      if (!originalName || originalName !== squad.squadName) return true;
    }
    return false;
  }, [localSquads, originalSquads]);

  const hasChanges = changedAssignments.length > 0 || hasSquadChanges;

  const getMembersForSquad = (squadId: number) =>
    uniqueMembers.filter((m) => localAssignments.get(m.memberId) === squadId);

  const handleDragStart = (e: React.DragEvent, memberId: number) => {
    draggingRef.current = memberId;
    setDraggingMemberId(memberId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    draggingRef.current = null;
    setDraggingMemberId(null);
    setDragOverColId(null);
  };

  const handleDragOver = (e: React.DragEvent, colId: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColId !== colId) setDragOverColId(colId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setDragOverColId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, colId: number) => {
    e.preventDefault();
    const memberId = draggingRef.current;
    draggingRef.current = null;
    setDraggingMemberId(null);
    setDragOverColId(null);
    if (memberId === null) return;
    const newSquadId = colId === UNASSIGNED_DROP_ID ? null : colId;
    if (localAssignments.get(memberId) === newSquadId) return;
    setLocalAssignments((prev) => new Map(prev).set(memberId, newSquadId));
  };

  const handleSave = useCallback(async () => {
    if (isDemo) {
      // 데모 모드: API 없이 로컬 상태에 커밋
      setOriginalSquads(localSquads);
      setOriginalAssignments(new Map(localAssignments));
      setLocalAssignments((prev) => new Map(prev)); // 재렌더 트리거
      onShowToast('변경사항이 저장되었습니다.', 'success');
      return;
    }
    if (!hasChanges) return;
    setSaveLoading(true);
    try {
      const originalIds = new Set(originalSquads.map((s) => s.squadId));
      const currentIds = new Set(localSquads.map((s) => s.squadId));
      const createdSquads = localSquads.filter((s) => !originalIds.has(s.squadId));
      const updatedSquads = localSquads.filter((s) => {
        const origin = originalSquads.find((o) => o.squadId === s.squadId);
        return !!origin && origin.squadName !== s.squadName;
      });
      const deletedSquads = originalSquads.filter(
        (s) => !currentIds.has(s.squadId) && !s.isDefault
      );

      const tempToCreated = new Map<number, SquadResponse>();

      // 1) 생성
      for (const squad of createdSquads) {
        const created = await squadsApi.createSquad(teamId, { name: squad.squadName });
        tempToCreated.set(squad.squadId, created);
      }

      // 2) 수정
      await Promise.all(
        updatedSquads
          .filter((s) => s.squadId > 0)
          .map((s) => squadsApi.updateSquad(teamId, s.squadId, { name: s.squadName }))
      );

      // 3) 삭제
      await Promise.all(
        deletedSquads.map((s) => squadsApi.deleteSquad(teamId, s.squadId))
      );

      // temp squad id -> real squad id 매핑
      const resolveSquadId = (id: number | null): number | null => {
        if (id === null) return null;
        return tempToCreated.get(id)?.squadId ?? id;
      };

      const finalizedSquads = localSquads.map((s) => tempToCreated.get(s.squadId) ?? s);
      const finalizedAssignments = new Map<number, number | null>();
      localAssignments.forEach((squadId, memberId) => {
        finalizedAssignments.set(memberId, resolveSquadId(squadId));
      });

      // 4) 멤버 이동
      const finalAssignmentChanges: Array<{ memberId: number; targetSquadId: number }> = [];
      finalizedAssignments.forEach((squadId, memberId) => {
        if (squadId === null) return;
        if (originalAssignments.get(memberId) !== squadId) {
          finalAssignmentChanges.push({ memberId, targetSquadId: squadId });
        }
      });

      await Promise.all(
        finalAssignmentChanges.map(({ memberId, targetSquadId }) =>
          squadsApi.assignMember(teamId, targetSquadId, memberId)
        )
      );

      setLocalSquads(finalizedSquads);
      onSquadsChange?.(finalizedSquads);
      setLocalAssignments(finalizedAssignments);
      setOriginalSquads(finalizedSquads);
      setOriginalAssignments(new Map(finalizedAssignments));
      onShowToast('변경사항이 저장되었습니다.', 'success');
      onSaveSuccess?.();
    } catch (error: unknown) {
      onShowToast(getApiErrorMessage(error, '저장에 실패했습니다.'), 'error');
    } finally {
      setSaveLoading(false);
    }
  }, [
    isDemo,
    hasChanges,
    teamId,
    localSquads,
    originalSquads,
    localAssignments,
    originalAssignments,
    onShowToast,
    onSquadsChange,
    onSaveSuccess,
  ]);

  const handleCreate = useCallback(async (name: string) => {
    const tempSquad: SquadResponse = {
      squadId: -Date.now(),
      squadName: name,
      teamId,
      isDefault: false,
      memberCount: 0,
      members: [],
      recommendationSettings: null,
      todayProblems: null,
    };
    const nextSquads = [...localSquads, tempSquad];
    setLocalSquads(nextSquads);
    onSquadsChange?.(nextSquads);
    setShowCreateModal(false);
  }, [teamId, localSquads, onSquadsChange]);

  const handleEdit = useCallback(async (name: string) => {
    if (!editTarget) return;
    const nextSquads = localSquads.map((s) =>
      s.squadId === editTarget.squadId ? { ...s, squadName: name } : s
    );
    setLocalSquads(nextSquads);
    onSquadsChange?.(nextSquads);
    setEditTarget(null);
  }, [editTarget, localSquads, onSquadsChange]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const nextAssignments = new Map(localAssignments);
    nextAssignments.forEach((squadId, memberId) => {
      if (squadId === deleteTarget.squadId) nextAssignments.set(memberId, null);
    });
    const nextSquads = localSquads.filter((s) => s.squadId !== deleteTarget.squadId);
    setLocalAssignments(nextAssignments);
    setLocalSquads(nextSquads);
    onSquadsChange?.(nextSquads);
    setDeleteTarget(null);
  }, [deleteTarget, localSquads, localAssignments, onSquadsChange]);

  const renderMemberCard = (member: TeamMemberResponse) => {
    const isDragging = draggingMemberId === member.memberId;
    const isChanged = localAssignments.get(member.memberId) !== originalAssignments.get(member.memberId);

    return (
      <div
        key={member.memberId}
        draggable
        onDragStart={(e) => handleDragStart(e, member.memberId)}
        onDragEnd={handleDragEnd}
        className={`group flex items-center gap-2 px-2.5 py-2.5 rounded-lg border bg-white select-none transition-all ${
          isDragging
            ? 'opacity-30 shadow-none'
            : isChanged
            ? 'border-l-2 border-l-blue-400 border-t-gray-200 border-r-gray-200 border-b-gray-200 shadow-sm cursor-grab active:cursor-grabbing'
            : 'border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 cursor-grab active:cursor-grabbing'
        }`}
      >
        <GripVertical className="h-3.5 w-3.5 text-gray-200 group-hover:text-gray-400 transition-colors flex-shrink-0" />
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-gray-100 text-gray-600">
          {member.handle[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-800 truncate">@{member.handle}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* 칸반 보드 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex gap-4 h-full min-h-[320px] items-start">

          {/* 미배정 컬럼 — 미배정 멤버가 있을 때만 노출 */}
          {hasUnassigned && (
          <div
            className={`flex flex-col w-56 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
              dragOverColId === UNASSIGNED_DROP_ID
                ? 'border-amber-400 ring-2 ring-amber-200 ring-offset-1'
                : 'border-amber-300'
            }`}
            onDragOver={(e) => handleDragOver(e, UNASSIGNED_DROP_ID)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, UNASSIGNED_DROP_ID)}
          >
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <span className="text-sm font-semibold text-gray-400">미배정</span>
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                hasUnassigned ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-400'
              }`}>
                {unassignedMembers.length}
              </span>
            </div>
            <div className="flex-1 bg-gray-50 p-2.5 space-y-2 overflow-y-auto">
              {unassignedMembers.map(renderMemberCard)}
              {unassignedMembers.length === 0 && (
                <div className={`flex items-center justify-center h-16 rounded-lg border-2 border-dashed text-xs transition-colors ${
                  dragOverColId === UNASSIGNED_DROP_ID
                    ? 'border-amber-400 text-amber-400 bg-amber-50'
                    : 'border-gray-200 text-gray-300'
                }`}>
                  없음
                </div>
              )}
            </div>
          </div>
          )}

          {/* 스쿼드 컬럼들 */}
          {localSquads.map((squad) => {
            const members = getMembersForSquad(squad.squadId);
            const isOver = dragOverColId === squad.squadId;

            return (
              <div
                key={squad.squadId}
                className={`flex flex-col w-56 flex-shrink-0 rounded-xl overflow-hidden shadow-sm border transition-all ${
                  isOver ? 'border-slate-400 ring-2 ring-slate-300 ring-offset-1' : 'border-gray-200'
                }`}
                onDragOver={(e) => handleDragOver(e, squad.squadId)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, squad.squadId)}
              >
                {/* 컬럼 헤더 */}
                <div className="bg-slate-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-semibold text-white truncate">{squad.squadName}</span>
                    {squad.isDefault && (
                      <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 bg-white/20 text-white/70 rounded font-medium">default</span>
                    )}
                    <span className="flex-shrink-0 text-xs font-medium px-1.5 py-0.5 bg-white/20 text-white rounded-full">
                      {members.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                    <div className="relative group">
                      <button
                        onClick={() => setEditTarget(squad)}
                        onMouseEnter={(e) => showTooltip(e, '이름 수정')}
                        onMouseLeave={hideTooltip}
                        className="p-1.5 text-white/70 hover:text-white hover:bg-white/15 transition-colors rounded"
                        aria-label="이름 수정"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {!squad.isDefault && (
                      <div className="relative group">
                        <button
                          onClick={() => setDeleteTarget(squad)}
                          onMouseEnter={(e) => showTooltip(e, localSquads.length <= 1 ? '스쿼드가 최소 1개 필요합니다' : '스쿼드 삭제')}
                          onMouseLeave={hideTooltip}
                          disabled={localSquads.length <= 1}
                          className="p-1.5 text-white/70 hover:text-red-300 hover:bg-white/15 transition-colors rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label={localSquads.length <= 1 ? '스쿼드가 최소 1개 필요합니다' : '스쿼드 삭제'}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 멤버 카드 영역 */}
                <div className="flex-1 bg-gray-50 p-2.5 space-y-2 overflow-y-auto">
                  {members.map(renderMemberCard)}
                  {members.length === 0 && (
                    <div className={`flex items-center justify-center h-16 rounded-lg border-2 border-dashed text-xs transition-colors ${
                      isOver ? 'border-slate-400 text-slate-500 bg-slate-50' : 'border-gray-200 text-gray-300'
                    }`}>
                      여기에 드롭
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* + 새 스쿼드 컬럼 */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-56 flex-shrink-0 rounded-xl border-2 border-dashed border-gray-200 hover:border-slate-400 hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-300 hover:text-slate-500 h-32"
          >
            <Plus className="h-6 w-6" />
            <span className="text-xs font-medium">새 스쿼드</span>
          </button>

        </div>
      </div>

      {/* 푸터 */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex flex-col gap-1">
          <p className={`text-sm font-semibold ${hasChanges ? 'text-blue-700' : 'text-gray-400'}`}>
            변경사항은 저장 버튼을 눌러야 최종 반영됩니다.
          </p>
          <p className={`text-xs ${hasUnassigned ? 'text-amber-500 font-medium' : 'text-gray-400'}`}>
            {hasUnassigned
              ? `미배정 멤버 ${unassignedMembers.length}명 — 저장 전 스쿼드에 배정해주세요`
              : hasChanges
              ? '미저장 변경사항이 있습니다'
              : '멤버를 드래그해서 스쿼드를 배정하세요'}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saveLoading || hasUnassigned}
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {saveLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              저장 중...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              저장
            </>
          )}
        </button>
      </div>

      {showCreateModal && (
        <CreateSquadModal
          initialName={`스쿼드${String.fromCharCode(65 + localSquads.length)}`}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />
      )}
      {editTarget && (
        <CreateSquadModal
          initialName={editTarget.squadName}
          isEdit
          onClose={() => setEditTarget(null)}
          onSubmit={handleEdit}
        />
      )}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="스쿼드 삭제"
        message={`'${deleteTarget?.squadName}' 스쿼드를 삭제하시겠습니까?\n소속 멤버는 미배정 상태로 이동됩니다.`}
        confirmText="삭제"
        cancelText="취소"
        confirmButtonVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteLoading}
      />
      {tooltip && createPortal(
        <div
          className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-full px-2 py-1 text-[10px] font-medium text-white bg-gray-900 rounded whitespace-nowrap"
          style={{ left: tooltip.left, top: tooltip.top }}
        >
          {tooltip.text}
        </div>,
        document.body
      )}
    </div>
  );
}
