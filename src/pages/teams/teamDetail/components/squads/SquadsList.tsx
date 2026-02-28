import { Settings } from 'lucide-react';
import NewBadge from '../../../../../components/common/NewBadge';
import type { SquadResponse } from '../../../../../api/squads';

interface SquadsListProps {
  squads: SquadResponse[];
  isTeamLeader: boolean;
  loading: boolean;
  selectedSquadId: number | null;
  onSelectSquad: (squadId: number) => void;
  currentUserMemberId?: number;
  currentUserSquadId?: number | null;
  onOpenManagement: () => void;
  onOpenSettings?: () => void;
}

export default function SquadsList({
  squads,
  isTeamLeader,
  loading,
  selectedSquadId,
  onSelectSquad,
  currentUserMemberId,
  currentUserSquadId,
  onOpenManagement,
  onOpenSettings,
}: SquadsListProps) {
  if (loading) {
    return (
      <div className="flex gap-2 animate-pulse pb-3 border-b border-gray-200">
        {[1, 2].map((i) => <div key={i} className="h-8 w-24 bg-gray-100 rounded-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* 모바일: 탭/관리 분리 */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-gray-400 font-medium shrink-0">스쿼드</span>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide whitespace-nowrap pb-1 flex-1 min-w-0">
          {squads.map((squad) => {
            const isSelected = squad.squadId === selectedSquadId;
            const isMySquad = typeof currentUserSquadId === 'number'
              ? squad.squadId === currentUserSquadId
              : (squad.members ?? []).some((m) => m.memberId === currentUserMemberId);

            return (
              <div
                key={squad.squadId}
                className={`inline-flex shrink-0 items-center gap-1 px-3 py-2 rounded-full text-sm font-medium border transition-all ${
                  isSelected
                    ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectSquad(squad.squadId)}
                  className="flex items-center gap-1 min-h-[20px]"
                >
                  {squad.squadName}
                  {isMySquad && (
                    <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-gray-400'}`}>
                      내 스쿼드
                    </span>
                  )}
                </button>
                {isSelected && isTeamLeader && onOpenSettings && (
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    aria-label="문제추천설정"
                    className="relative group ml-1 pl-1.5 border-l border-white/30 text-white hover:text-white transition-colors min-h-[20px]"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      문제추천설정
                    </span>
                  </button>
                )}
              </div>
            );
          })}
          {!isTeamLeader && <NewBadge />}
          </div>
        </div>

        {isTeamLeader && (
          <div className="flex items-center justify-start gap-1.5">
            <button
              onClick={onOpenManagement}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              스쿼드관리
            </button>
            <NewBadge />
          </div>
        )}
      </div>

      {/* 데스크톱: 기존 레이아웃 유지 */}
      <div className="hidden sm:flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-400 font-medium shrink-0">스쿼드</span>
        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
        {squads.map((squad) => {
          const isSelected = squad.squadId === selectedSquadId;
          const isMySquad = typeof currentUserSquadId === 'number'
            ? squad.squadId === currentUserSquadId
            : (squad.members ?? []).some((m) => m.memberId === currentUserMemberId);

          return (
            <div
              key={squad.squadId}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                isSelected
                  ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectSquad(squad.squadId)}
                className="flex items-center gap-1"
              >
                {squad.squadName}
                {isMySquad && (
                  <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-gray-400'}`}>
                    내 스쿼드
                  </span>
                )}
              </button>
              {isSelected && isTeamLeader && onOpenSettings && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  aria-label="문제추천설정"
                  className="relative group ml-1 pl-1.5 border-l border-white/30 text-white hover:text-white transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    문제추천설정
                  </span>
                </button>
              )}
            </div>
          );
        })}

        {isTeamLeader && (
          <>
            <span className="text-gray-300 text-sm px-0.5 select-none">|</span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={onOpenManagement}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 transition-colors"
              >
                <Settings className="h-3.5 w-3.5" />
                스쿼드관리
              </button>
              <NewBadge />
            </div>
          </>
        )}

        {!isTeamLeader && <NewBadge />}
        </div>
      </div>
    </div>
  );
}
