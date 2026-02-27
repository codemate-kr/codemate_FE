import { ExternalLink } from 'lucide-react';
import { getTierIcon } from '../../../../../components/common/TierIcon';
import type { MemberDayStats } from './types';
import { SolvedMark } from './common';

export function ProblemDetail({ date, data }: { date: { month: number; day: number; weekday: string }; data: MemberDayStats }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">날짜</span>
        <span className="font-medium">{date.month}/{date.day} ({date.weekday})</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">진행률</span>
        <span className={data.solvedCount === data.totalCount ? 'text-green-600 font-medium' : 'font-medium'}>
          {data.solvedCount}/{data.totalCount} 완료
        </span>
      </div>

      <div className="pt-2 border-t border-gray-100 space-y-1.5">
        {data.problems.map((problem) => {
          const isSolved = data.memberSolved[String(problem.problemId)] || false;
          const bojUrl = `https://www.acmicpc.net/problem/${problem.problemId}`;

          return (
            <a
              key={problem.problemId}
              href={bojUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-blue-100 transition-colors ${isSolved ? 'bg-blue-50' : ''}`}
            >
              <SolvedMark isSolved={isSolved} />
              {getTierIcon(problem.tier, 16)}
              <span className="flex-1 min-w-0 text-xs font-medium text-gray-700 truncate">
                {problem.title}
              </span>
              <span className="text-[10px] text-gray-400 flex-shrink-0">
                #{problem.problemId}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
