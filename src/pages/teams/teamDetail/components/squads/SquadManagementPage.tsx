import { X, Users } from 'lucide-react';
import type { SquadResponse } from '../../../../../api/squads';
import type { TeamMemberResponse } from '../../../../../api/teams';
import SquadMemberTab from './SquadMemberTab';

interface SquadManagementPageProps {
  teamId: number;
  squads: SquadResponse[];
  allMembers: TeamMemberResponse[];
  onClose: () => void;
  onSaveSuccess?: () => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  onSquadsChange?: (squads: SquadResponse[]) => void;
  isDemo?: boolean;
}

export default function SquadManagementPage({
  teamId,
  squads,
  allMembers,
  onClose,
  onSaveSuccess,
  onShowToast,
  onSquadsChange,
  isDemo,
}: SquadManagementPageProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">스쿼드 관리</h2>
              {isDemo && (
                <p className="text-xs text-gray-400 mt-0.5">데모 모드 — 변경 사항이 저장되지 않습니다</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="닫기"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-hidden">
          <SquadMemberTab
            teamId={teamId}
            squads={squads}
            allMembers={allMembers}
            onShowToast={onShowToast}
            onSquadsChange={onSquadsChange}
            onSaveSuccess={onSaveSuccess}
            isDemo={isDemo}
          />
        </div>
      </div>
    </div>
  );
}
