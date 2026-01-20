import { useEffect, useState } from 'react';
import { X, Clock, Loader2, Send, UserPlus } from 'lucide-react';
import { teamJoinsApi, type TeamJoinResponse } from '../../../../api/teamJoins';

interface SentInvitationsModalProps {
  teamId: number;
  onClose: () => void;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export default function SentInvitationsModal({
  teamId,
  onClose,
  onShowToast,
}: SentInvitationsModalProps) {
  const [invitations, setInvitations] = useState<TeamJoinResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const data = await teamJoinsApi.getSentInvitations();
      const teamInvitations = data.filter(inv => inv.teamId === teamId);
      setInvitations(teamInvitations);
    } catch (error) {
      console.error('초대 목록 조회 실패:', error);
      onShowToast('초대 목록을 불러오는데 실패했습니다', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    setCancelingId(id);
    try {
      await teamJoinsApi.cancelInvitation(id);
      setInvitations(prev => prev.filter(inv => inv.id !== id));
      onShowToast('초대가 취소되었습니다');
    } catch (error: any) {
      console.error('초대 취소 실패:', error);
      onShowToast(error?.response?.data?.message || '초대 취소에 실패했습니다', 'error');
    } finally {
      setCancelingId(null);
    }
  };

  const getExpiryStatus = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMs <= 0) {
      return { text: '만료됨', color: 'text-red-500', bg: 'bg-red-50' };
    } else if (diffHours < 24) {
      return { text: `${diffHours}시간 남음`, color: 'text-orange-600', bg: 'bg-orange-50' };
    } else {
      return { text: `${diffDays}일 남음`, color: 'text-gray-500', bg: 'bg-gray-100' };
    }
  };

  const getInitial = (handle: string | null) => {
    if (!handle) return '?';
    return handle[0].toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* 오버레이 */}
        <div
          className="fixed inset-0 bg-black/40 transition-opacity"
          onClick={onClose}
        />

        {/* 모달 */}
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Send className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">초대 현황</h2>
                {!loading && (
                  <p className="text-xs text-gray-500">
                    {invitations.length > 0
                      ? `대기 중 ${invitations.length}명`
                      : '대기 중인 초대 없음'}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 본문 */}
          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            ) : invitations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <UserPlus className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  대기 중인 초대가 없습니다
                </p>
                <p className="text-xs text-gray-500 text-center">
                  멤버 초대 버튼을 눌러 팀원을 초대해보세요
                </p>
              </div>
            ) : (
              <div className="p-3">
                {invitations.map((invitation, index) => {
                  const expiryStatus = getExpiryStatus(invitation.expiresAt);
                  const isCanceling = cancelingId === invitation.id;

                  return (
                    <div
                      key={invitation.id}
                      className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors ${
                        index !== invitations.length - 1 ? 'mb-1' : ''
                      }`}
                    >
                      {/* 아바타 */}
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {getInitial(invitation.targetMemberHandle)}
                        </span>
                      </div>

                      {/* 정보 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          @{invitation.targetMemberHandle}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className={`text-xs ${expiryStatus.color}`}>
                            {expiryStatus.text}
                          </span>
                        </div>
                      </div>

                      {/* 취소 버튼 */}
                      <button
                        onClick={() => handleCancel(invitation.id)}
                        disabled={isCanceling}
                        className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isCanceling ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          '취소'
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="px-5 py-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
