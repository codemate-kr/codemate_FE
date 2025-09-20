import { apiClient } from './client';
import type { Problem, Tag, Assignment, Progress } from '../types';

export interface SearchProblemsRequest {
  query?: string;
  tags?: string[];
  difficulty?: {
    min: number;
    max: number;
  };
  limit?: number;
  offset?: number;
  excludeSolved?: boolean;
  groupId?: string;
}

export interface CreateAssignmentRequest {
  groupId: string;
  problemIds: number[];
  dueDate: string;
}

export const problemsApi = {
  searchProblems: async (params: SearchProblemsRequest): Promise<{
    problems: Problem[];
    total: number;
  }> => {
    const response = await apiClient.get('/problems/search', { params });
    return response.data;
  },

  getProblem: async (problemId: number): Promise<Problem> => {
    const response = await apiClient.get(`/problems/${problemId}`);
    return response.data;
  },

  getTags: async (): Promise<Tag[]> => {
    const response = await apiClient.get('/problems/tags');
    return response.data;
  },

  getAssignments: async (groupId: string): Promise<Assignment[]> => {
    const response = await apiClient.get(`/groups/${groupId}/assignments`);
    return response.data;
  },

  createAssignment: async (data: CreateAssignmentRequest): Promise<Assignment> => {
    const response = await apiClient.post('/assignments', data);
    return response.data;
  },

  getProgress: async (groupId: string): Promise<Progress[]> => {
    const response = await apiClient.get(`/groups/${groupId}/progress`);
    return response.data;
  },

  updateProgress: async (
    assignmentId: string,
    problemId: number
  ): Promise<void> => {
    await apiClient.post(`/assignments/${assignmentId}/progress`, {
      problemId,
    });
  },
};