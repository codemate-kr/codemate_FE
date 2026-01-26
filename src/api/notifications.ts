import { apiClient, type ApiResponse } from './client';

// 알림 타입
export type NotificationType =
  | 'TEAM_INVITATION'
  | 'TEAM_INVITATION_ACCEPTED'
  | 'TEAM_INVITATION_REJECTED'
  | 'TEAM_APPLICATION'
  | 'TEAM_APPLICATION_ACCEPTED'
  | 'TEAM_APPLICATION_REJECTED'
  | 'MEMBER_LEFT'
  | 'MEMBER_JOINED';

export interface NotificationMetadata {
  teamId?: number;
  teamName?: string;
  inviterId?: number;
  inviterName?: string;
  memberId?: number;
  memberName?: string;
  applicantId?: number;
  applicantName?: string;
}

export interface Notification {
  id: number;
  type: NotificationType;
  metadata: NotificationMetadata;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationsResponse {
  notifications: Notification[];
  nextCursor: number | null;
  hasNext: boolean;
}

export interface GetNotificationsParams {
  cursor?: number | null;
  size?: number;
}

export const notificationsApi = {
  // 전체 알림 조회
  getAll: async (params?: GetNotificationsParams): Promise<NotificationsResponse> => {
    const response = await apiClient.get<ApiResponse<NotificationsResponse>>(
      '/notifications',
      { params }
    );
    return response.data.data;
  },

  // 읽지 않은 알림 조회
  getUnread: async (params?: GetNotificationsParams): Promise<NotificationsResponse> => {
    const response = await apiClient.get<ApiResponse<NotificationsResponse>>(
      '/notifications/unread',
      { params }
    );
    return response.data.data;
  },

  // 읽지 않은 알림 개수
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<ApiResponse<number>>('/notifications/unread-count');
    return response.data.data;
  },

  // 개별 읽음 처리
  markAsRead: async (id: number): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  // 전체 읽음 처리
  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all');
  },

  // 알림 삭제
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },
};
