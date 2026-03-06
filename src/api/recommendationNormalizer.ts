import type { TodayProblem, TodayProblemsResponse } from './teams';

export type RawTodayProblemsResponse = Partial<TodayProblemsResponse> & {
  id?: number;
  recommendationDate?: string;
  sentAt?: string;
  status?: string;
  problems?: TodayProblem[];
};

const toMissionStatus = (rawStatus: string | undefined, problems: TodayProblem[]): TodayProblemsResponse['status'] => {
  const status = (rawStatus ?? '').toUpperCase();

  if (status === 'PENDING' || status === 'IN_PROGRESS' || status === 'PROCESSING') {
    return 'PENDING';
  }
  if (status === 'FAILED' || status === 'FAIL' || status === 'ERROR') {
    return 'FAILED';
  }
  if (status === 'SUCCESS' || status === 'SENT' || status === 'COMPLETED') {
    return 'SUCCESS';
  }
  return problems.length > 0 ? 'SUCCESS' : 'PENDING';
};

const toMissionDate = (raw: RawTodayProblemsResponse): string => {
  const directDate = raw.date ?? raw.recommendationDate;
  if (typeof directDate === 'string' && directDate.length >= 10) {
    return directDate.slice(0, 10);
  }

  if (typeof raw.sentAt === 'string' && raw.sentAt.length >= 10) {
    return raw.sentAt.slice(0, 10);
  }

  return new Date().toISOString().slice(0, 10);
};

export const normalizeTodayProblemsResponse = (raw: RawTodayProblemsResponse | null | undefined): TodayProblemsResponse | null => {
  if (!raw) return null;

  const problems = Array.isArray(raw.problems) ? raw.problems : [];
  const recommendationId = Number(raw.recommendationId ?? raw.id ?? 0);

  return {
    recommendationId,
    date: toMissionDate(raw),
    status: toMissionStatus(raw.status, problems),
    problems,
  };
};

