import { useEffect, useState } from 'react';
import { Bell, ChevronLeft, ChevronRight, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useInvitationStore, useInvitations, useInvitationsLoading } from '../../store/invitationStore';

export default function InvitationBanner() {
  const invitations = useInvitations();
  const loading = useInvitationsLoading();
  const { fetchInvitations, acceptInvitation, rejectInvitation } = useInvitationStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [processingAction, setProcessingAction] = useState<'accept' | 'reject' | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  useEffect(() => {
    if (currentIndex >= invitations.length && invitations.length > 0) {
      setCurrentIndex(invitations.length - 1);
    }
  }, [invitations.length, currentIndex]);

  const handleAccept = async (id: number) => {
    setProcessingId(id);
    setProcessingAction('accept');
    try {
      await acceptInvitation(id);
      toast.success('팀에 가입되었습니다!');
    } catch (error: any) {
      toast.error(error.message || '초대 수락에 실패했습니다.');
    } finally {
      setProcessingId(null);
      setProcessingAction(null);
    }
  };

  const handleReject = async (id: number) => {
    setProcessingId(id);
    setProcessingAction('reject');
    try {
      await rejectInvitation(id);
      toast.success('초대를 거절했습니다.');
    } catch (error: any) {
      toast.error(error.message || '초대 거절에 실패했습니다.');
    } finally {
      setProcessingId(null);
      setProcessingAction(null);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : invitations.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < invitations.length - 1 ? prev + 1 : 0));
  };

  if (loading || invitations.length === 0) {
    return null;
  }

  const currentInvitation = invitations[currentIndex];
  if (!currentInvitation) {
    return null;
  }

  const isProcessing = processingId === currentInvitation.id;
  const hasMultiple = invitations.length > 1;

  return (
    <div className="relative w-full animate-float">
      {/* 오로라 글로우 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 via-cyan-300/20 to-blue-500/30 rounded-xl blur-md" />
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
      <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-4 sm:px-5">
        {/* 데스크톱: 1줄 레이아웃 */}
        <div className="hidden sm:flex items-center gap-4">
          {/* 아이콘 */}
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Bell className="h-5 w-5 text-blue-600" />
          </div>

          {/* 내용 */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              <span className="font-semibold text-blue-600">{currentInvitation.teamName}</span>
              <span className="text-gray-700"> 팀에 초대되었습니다</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              초대자: @{currentInvitation.requesterHandle}
            </p>
          </div>

          {/* 네비게이션 */}
          {hasMultiple && (
            <div className="flex items-center gap-1 text-gray-400">
              <button
                onClick={handlePrev}
                disabled={isProcessing}
                className="p-1 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs tabular-nums">
                {currentIndex + 1}/{invitations.length}
              </span>
              <button
                onClick={handleNext}
                disabled={isProcessing}
                className="p-1 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleReject(currentInvitation.id)}
              disabled={isProcessing}
              className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              {isProcessing && processingAction === 'reject' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                '거절'
              )}
            </button>
            <button
              onClick={() => handleAccept(currentInvitation.id)}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isProcessing && processingAction === 'accept' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  참여하기
                </>
              )}
            </button>
          </div>
        </div>

        {/* 모바일: 2줄 레이아웃 */}
        <div className="sm:hidden">
          {/* 첫 번째 줄: 아이콘 + 내용 + 네비게이션 */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
              <Bell className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                <span className="font-semibold text-blue-600">{currentInvitation.teamName}</span>
                <span className="text-gray-700"> 팀에 초대됨</span>
              </p>
              <p className="text-xs text-gray-500">
                @{currentInvitation.requesterHandle}
              </p>
            </div>
            {hasMultiple && (
              <div className="flex items-center gap-0.5 text-gray-400">
                <button
                  onClick={handlePrev}
                  disabled={isProcessing}
                  className="p-1 hover:text-gray-600 rounded transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs tabular-nums">
                  {currentIndex + 1}/{invitations.length}
                </span>
                <button
                  onClick={handleNext}
                  disabled={isProcessing}
                  className="p-1 hover:text-gray-600 rounded transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* 두 번째 줄: 버튼 */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => handleReject(currentInvitation.id)}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              {isProcessing && processingAction === 'reject' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                '거절'
              )}
            </button>
            <button
              onClick={() => handleAccept(currentInvitation.id)}
              disabled={isProcessing}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isProcessing && processingAction === 'accept' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  참여하기
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
