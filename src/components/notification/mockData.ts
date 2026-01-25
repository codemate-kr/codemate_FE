// 디자인 확인용 목업 데이터 (나중에 삭제)

export type NotificationType =
  | 'TEAM_INVITATION'
  | 'TEAM_INVITATION_ACCEPTED'
  | 'TEAM_INVITATION_REJECTED'
  | 'TEAM_APPLICATION'
  | 'TEAM_APPLICATION_ACCEPTED'
  | 'TEAM_APPLICATION_REJECTED'
  | 'MEMBER_LEFT'
  | 'MEMBER_JOINED'
  | 'ANNOUNCEMENT';

export interface NotificationMetadata {
  teamId?: number;
  teamName?: string;
  inviterId?: number;
  inviterName?: string;
  memberId?: number;
  memberName?: string;
  applicantId?: number;
  applicantName?: string;
  message?: string;
}

export interface Notification {
  id: number;
  type: NotificationType;
  metadata: NotificationMetadata;
  createdAt: string;
  readAt: string | null;
}

// 목업 알림 데이터
export const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'MEMBER_JOINED',
    metadata: { teamId: 1, teamName: '알고리즘팀', memberId: 5, memberName: 'koosaga' },
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2분 전
    readAt: null,
  },
  {
    id: 2,
    type: 'TEAM_INVITATION',
    metadata: { teamId: 2, teamName: '코딩스터디', inviterId: 3, inviterName: 'tourist' },
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1시간 전
    readAt: null,
  },
  {
    id: 3,
    type: 'TEAM_INVITATION_ACCEPTED',
    metadata: { teamId: 1, teamName: '알고리즘팀', memberId: 6, memberName: 'jhnah917' },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    readAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    type: 'TEAM_APPLICATION',
    metadata: { teamId: 1, teamName: '알고리즘팀', applicantId: 7, applicantName: 'rkm0959' },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    readAt: null,
  },
  {
    id: 5,
    type: 'MEMBER_LEFT',
    metadata: { teamId: 1, teamName: '알고리즘팀', memberId: 8, memberName: 'dotorya' },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
    readAt: new Date().toISOString(),
  },
  {
    id: 6,
    type: 'ANNOUNCEMENT',
    metadata: { message: '서버 점검이 1월 30일 오전 2시에 예정되어 있습니다.' },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
    readAt: new Date().toISOString(),
  },
  {
    id: 7,
    type: 'TEAM_APPLICATION_ACCEPTED',
    metadata: { teamId: 3, teamName: 'PS마스터' },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 전
    readAt: new Date().toISOString(),
  },
];
