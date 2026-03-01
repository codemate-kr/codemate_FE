import type { ProblemDifficultyPreset } from '../api/teams';

interface SolvedAcSearchParams {
  selectedPreset: ProblemDifficultyPreset | null;
  minProblemLevel: number | null;
  maxProblemLevel: number | null;
  selectedTags: string[];
  solvedCountMin?: number;
  unsolvedByHandles?: string[];
}

function getTierRange(
  selectedPreset: ProblemDifficultyPreset | null,
  minProblemLevel: number | null,
  maxProblemLevel: number | null
): { min: number; max: number } {
  const clampTier = (value: number) => Math.min(30, Math.max(1, Math.floor(value)));

  if (!selectedPreset) {
    return { min: 1, max: 30 };
  }

  if (selectedPreset === 'EASY') return { min: 5, max: 8 };
  if (selectedPreset === 'NORMAL') return { min: 9, max: 12 };
  if (selectedPreset === 'HARD') return { min: 13, max: 16 };

  if (selectedPreset === 'CUSTOM' && minProblemLevel && maxProblemLevel) {
    const lower = clampTier(Math.min(minProblemLevel, maxProblemLevel));
    const upper = clampTier(Math.max(minProblemLevel, maxProblemLevel));
    return { min: lower, max: upper };
  }

  return { min: 1, max: 30 };
}

export function buildSolvedAcSearchUrl({
  selectedPreset,
  minProblemLevel,
  maxProblemLevel,
  selectedTags,
  solvedCountMin = 1000,
  unsolvedByHandles = [],
}: SolvedAcSearchParams): string {
  const tokens: string[] = [];
  const tierRange = getTierRange(selectedPreset, minProblemLevel, maxProblemLevel);
  tokens.push(`*${tierRange.min}..${tierRange.max}`);

  if (Number.isFinite(solvedCountMin) && solvedCountMin > 0) {
    tokens.push(`s#${Math.floor(solvedCountMin)}..`);
  } else {
    tokens.push('s#1000..');
  }

  tokens.push('%ko');

  if (selectedTags.length > 0) {
    const tagClause = selectedTags
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .map((tag) => tag.replace(/^#/, '').replace(/^tag:/, ''))
      .map((tag) => `#${tag}`)
      .join(' | ');
    tokens.push(`(${tagClause})`);
  }

  const normalizedHandles = unsolvedByHandles
    .map((handle) => handle.trim().replace(/^@+/, ''))
    .filter((handle) => handle.length > 0);

  if (normalizedHandles.length > 0) {
    for (const handle of normalizedHandles) {
      tokens.push(`!@${handle}`);
    }
  }

  const query = tokens.join(' ').trim();
  return `https://solved.ac/problems?query=${encodeURIComponent(query)}`;
}
