import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import NotificationItem from '../../components/notification/NotificationItem';
import { notificationsApi, type Notification } from '../../api/notifications';

type TabType = 'unread' | 'all';

const PAGE_SIZE = 10;

export default function NotificationsPage() {
  useDocumentTitle('알림');
  const [activeTab, setActiveTab] = useState<TabType>('unread');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 알림 목록 조회
  const fetchNotifications = useCallback(async (tab: TabType, cursor?: number | null) => {
    const isInitial = cursor === undefined;
    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const api = tab === 'unread' ? notificationsApi.getUnread : notificationsApi.getAll;
      const response = await api({ cursor, size: PAGE_SIZE });

      if (isInitial) {
        setNotifications(response.notifications);
      } else {
        setNotifications((prev) => [...prev, ...response.notifications]);
      }
      setNextCursor(response.nextCursor);
      setHasNext(response.hasNext);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // 읽지 않은 개수 조회
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationsApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  // 초기 로딩
  useEffect(() => {
    fetchNotifications(activeTab);
    fetchUnreadCount();
  }, [activeTab, fetchNotifications, fetchUnreadCount]);

  // 탭 변경
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setNotifications([]);
    setNextCursor(null);
    setHasNext(false);
  };

  // 개별 읽음 처리
  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, readAt: new Date().toISOString() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  // 전체 읽음 처리
  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // 더 보기
  const handleLoadMore = () => {
    if (hasNext && !isLoadingMore) {
      fetchNotifications(activeTab, nextCursor);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">알림</h1>
              <p className="mt-1 text-sm text-gray-500">
                팀 활동과 관련된 알림을 확인하세요
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                모두 읽음
              </button>
            )}
          </div>
        </div>

        {/* 탭 + 모바일 모두 읽음 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => handleTabChange('unread')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'unread'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              새 알림
              {unreadCount > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 text-xs font-bold rounded-full ${
                  activeTab === 'unread'
                    ? 'text-blue-600 bg-blue-100'
                    : 'text-gray-500 bg-gray-200'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              전체
            </button>
          </div>

          {/* 모바일 모두 읽음 버튼 */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="sm:hidden p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="모두 읽음"
            >
              <CheckCheck className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 알림 목록 */}
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-2 text-gray-400 animate-spin" />
              <p className="text-sm text-gray-500">알림을 불러오는 중...</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => handleMarkAsRead(notification.id)}
              />
            ))
          ) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">
                {activeTab === 'unread' ? '새로운 알림이 없습니다' : '알림이 없습니다'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {activeTab === 'unread' ? '모든 알림을 확인했습니다' : '아직 받은 알림이 없습니다'}
              </p>
            </div>
          )}
        </div>

        {/* 더 보기 버튼 */}
        {hasNext && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all disabled:opacity-50"
            >
              {isLoadingMore ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  불러오는 중...
                </span>
              ) : (
                '더 보기'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
