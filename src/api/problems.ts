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
  teamId?: string;
}

export interface CreateAssignmentRequest {
  teamId: string;
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

  getAssignments: async (teamId: string): Promise<Assignment[]> => {
    const response = await apiClient.get(`/teams/${teamId}/assignments`);
    return response.data;
  },

  createAssignment: async (data: CreateAssignmentRequest): Promise<Assignment> => {
    const response = await apiClient.post('/assignments', data);
    return response.data;
  },

  getProgress: async (teamId: string): Promise<Progress[]> => {
    const response = await apiClient.get(`/teams/${teamId}/progress`);
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