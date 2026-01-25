import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Notification, NotificationType, NotificationMetadata } from './mockData';

// 알림 메시지 생성 (볼드 처리 포함)
function getNotificationMessage(type: NotificationType, m: NotificationMetadata): ReactNode {
  const bold = (text: string | undefined) => (
    <span className="font-semibold">{text}</span>
  );

  const templates: Record<NotificationType, (m: NotificationMetadata) => ReactNode> = {
    TEAM_INVITATION: (m) => <>{bold(m.inviterName)}님이 {bold(m.teamName)}에 초대했습니다</>,
    TEAM_INVITATION_ACCEPTED: (m) => <>{bold(m.memberName)}님이 {bold(m.teamName)} 초대를 수락했습니다</>,
    TEAM_INVITATION_REJECTED: (m) => <>{bold(m.memberName)}님이 {bold(m.teamName)} 초대를 거절했습니다</>,
    TEAM_APPLICATION: (m) => <>{bold(m.applicantName)}님이 {bold(m.teamName)}에 가입을 신청했습니다</>,
    TEAM_APPLICATION_ACCEPTED: (m) => <>{bold(m.teamName)} 가입이 승인되었습니다</>,
    TEAM_APPLICATION_REJECTED: (m) => <>{bold(m.teamName)} 가입이 거절되었습니다</>,
    MEMBER_LEFT: (m) => <>{bold(m.memberName)}님이 {bold(m.teamName)}에서 탈퇴했습니다</>,
    MEMBER_JOINED: (m) => <>{bold(m.memberName)}님이 {bold(m.teamName)}에 합류했습니다</>,
    ANNOUNCEMENT: (m) => <>{m.message || '새로운 공지사항이 있습니다'}</>,
  };

  return templates[type](m);
}

// 상대 시간 포맷
function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}


// 클릭 가능한 알림 타입 (초대, 가입신청만)
const CLICKABLE_TYPES: NotificationType[] = [
  'TEAM_INVITATION',
  'TEAM_APPLICATION',
];

// 알림 타입별 이동 경로
function getActionUrl(type: NotificationType, metadata: NotificationMetadata): string | null {
  switch (type) {
    case 'TEAM_INVITATION':
      return '/dashboard';
    case 'TEAM_APPLICATION':
      return metadata.teamId ? `/teams/${metadata.teamId}` : null;
    default:
      return null;
  }
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: () => void;
  compact?: boolean;
}

export default function NotificationItem({ notification, onMarkAsRead, compact = false }: NotificationItemProps) {
  const navigate = useNavigate();
  const { type, metadata, createdAt, readAt } = notification;
  const isUnread = !readAt;
  const message = getNotificationMessage(type, metadata);
  const relativeTime = getRelativeTime(createdAt);

  const isClickable = CLICKABLE_TYPES.includes(type);
  const actionUrl = getActionUrl(type, metadata);

  const handleMarkAsRead = () => {
    if (isUnread) {
      onMarkAsRead?.();
    }
  };

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (actionUrl) {
      navigate(actionUrl);
    }
  };

  if (compact) {
    // 드롭다운용 컴팩트 레이아웃
    return (
      <div
        onClick={handleMarkAsRead}
        title={isUnread ? '클릭하여 읽음 처리' : undefined}
        className={`relative w-full px-4 py-2.5 text-left transition-colors touch-manipulation hover:bg-gray-100 active:bg-gray-200 cursor-pointer border-l-[3px] flex items-center justify-between gap-3 ${
          isUnread ? 'border-l-blue-500' : 'border-l-gray-200'
        }`}
      >
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${isUnread ? 'text-gray-900' : 'text-gray-500'}`}>
            {message}
          </p>
          <span className="text-xs text-gray-400 mt-0.5 block">{relativeTime}</span>
        </div>
        {isClickable && actionUrl && (
          <button
            onClick={handleNavigate}
            className="flex items-center px-2 py-1 text-xs font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 rounded-md transition-colors shrink-0"
          >
            이동
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // 전체 페이지용 레이아웃
  return (
    <div
      onClick={handleMarkAsRead}
      title={isUnread ? '클릭하여 읽음 처리' : undefined}
      className={`relative w-full px-4 py-3 text-left transition-colors touch-manipulation cursor-pointer border-l-[3px] flex items-center justify-between gap-4 ${
        isUnread
          ? 'bg-white hover:bg-gray-50 active:bg-gray-100 border-l-blue-500'
          : 'bg-gray-50/50 hover:bg-gray-100 active:bg-gray-150 border-l-gray-200'
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${isUnread ? 'text-gray-900' : 'text-gray-500'}`}>
          {message}
        </p>
        <span className="text-xs text-gray-400 mt-1 block">{relativeTime}</span>
      </div>
      {isClickable && actionUrl && (
        <button
          onClick={handleNavigate}
          className="flex items-center px-2.5 py-1 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 rounded-md transition-colors shrink-0"
        >
          이동
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
