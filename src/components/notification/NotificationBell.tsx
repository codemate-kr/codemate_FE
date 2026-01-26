import { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { notificationsApi, type Notification } from '../../api/notifications';
import NotificationItem from './NotificationItem';

const RECENT_SIZE = 5;
const POLLING_INTERVAL = 60 * 1000; // 1분

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 읽지 않은 알림 개수 조회
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationsApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  // 최근 읽지 않은 알림 조회
  const fetchRecentNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await notificationsApi.getUnread({ size: RECENT_SIZE });
      setNotifications(response.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 로딩 + 폴링 + 포커스 이벤트
  useEffect(() => {
    fetchUnreadCount();

    // 폴링: 1분마다 unreadCount 조회
    const interval = setInterval(fetchUnreadCount, POLLING_INTERVAL);

    // 포커스: 탭 활성화 시 unreadCount 조회
    const handleFocus = () => fetchUnreadCount();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchUnreadCount]);

  // 드롭다운 열릴 때 최근 알림 조회
  useEffect(() => {
    if (isOpen) {
      fetchRecentNotifications();
    }
  }, [isOpen, fetchRecentNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const isMobile = window.innerWidth < 768;

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (isMobile) {
        document.body.style.overflow = 'unset';
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      if (isMobile) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* 벨 아이콘 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 active:bg-gray-200 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
        aria-label="알림"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* 모바일: 바텀 시트 오버레이 */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden animate-in fade-in duration-200" />

          {/* 데스크톱: 드롭다운 */}
          <div className="hidden md:block absolute right-0 mt-2 w-96 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in zoom-in-95 duration-100">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">알림</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  모두 읽음
                </button>
              )}
            </div>

            {/* 알림 목록 */}
            <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-100">
              {isLoading ? (
                <div className="py-10 text-center">
                  <Loader2 className="w-6 h-6 mx-auto mb-2 text-gray-300 animate-spin" />
                  <p className="text-sm text-gray-500">불러오는 중...</p>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={() => handleMarkAsRead(notification.id)}
                    compact
                  />
                ))
              ) : (
                <div className="py-10 text-center">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">새로운 알림이 없습니다</p>
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="border-t border-gray-100">
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="block w-full py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors"
              >
                전체 보기
              </Link>
            </div>
          </div>

          {/* 모바일: 바텀 시트 */}
          <div className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="p-4">
              {/* 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">알림</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium px-2 py-1"
                    >
                      모두 읽음
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 active:bg-gray-200 rounded-lg transition-colors touch-manipulation"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* 알림 목록 */}
              <div className="max-h-[50vh] overflow-y-auto -mx-4">
                {isLoading ? (
                  <div className="py-10 text-center">
                    <Loader2 className="w-8 h-8 mx-auto mb-2 text-gray-300 animate-spin" />
                    <p className="text-gray-500">불러오는 중...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={() => handleMarkAsRead(notification.id)}
                        compact
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <Bell className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">새로운 알림이 없습니다</p>
                  </div>
                )}
              </div>

              {/* 전체 보기 버튼 */}
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="block w-full mt-4 py-3 text-center text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-colors touch-manipulation"
              >
                전체 보기
              </Link>

              {/* Safe area padding for iOS */}
              <div className="h-safe-bottom" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
