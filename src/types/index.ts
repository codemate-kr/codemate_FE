export interface User {
  id: string;
  email: string;
  name: string;
  handle?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyTeam {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: User[];
  settings: TeamSettings;
  createdAt: string;
  updatedAt: string;
}

export interface TeamSettings {
  frequency: 'daily' | 'weekly' | 'custom';
  problemCount: number;
  difficulty: {
    min: number;
    max: number;
  };
  tags: string[];
  emailNotifications: boolean;
}

export interface Problem {
  id: number;
  title: string;
  titleKo: string;
  difficulty: number;
  tags: Tag[];
  acceptedUserCount: number;
  submissionCount: number;
  url: string;
}

export interface Tag {
  key: string;
  name: string;
  nameKo: string;
}

export interface Assignment {
  id: string;
  teamId: string;
  problems: Problem[];
  dueDate: string;
  createdAt: string;
}

export interface Progress {
  userId: string;
  problemId: number;
  solved: boolean;
  solvedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}