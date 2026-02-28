import { CheckCircle } from 'lucide-react';

export function DayRangeToggle({
  dayRange,
  onChange,
  compact = false,
}: {
  dayRange: 7 | 30;
  onChange: (range: 7 | 30) => void;
  compact?: boolean;
}) {
  return (
    <div className={`${compact ? '' : 'w-40 max-sm:w-24 pr-2 max-sm:pr-1'} flex-shrink-0 flex items-center gap-2 max-sm:gap-1`}>
      <span className="text-xs text-gray-500">최근</span>
      <div className="flex bg-gray-100 rounded-md p-0.5">
        <button
          onClick={() => onChange(7)}
          className={`px-2 max-sm:px-1.5 py-1 text-xs max-sm:text-[10px] font-medium rounded ${
            dayRange === 7 ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          7일
        </button>
        <button
          onClick={() => onChange(30)}
          className={`px-2 max-sm:px-1.5 py-1 text-xs max-sm:text-[10px] font-medium rounded ${
            dayRange === 30 ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          30일
        </button>
      </div>
    </div>
  );
}

export function MemberAvatar({ handle, isMe, size = 'sm' }: { handle: string | null; isMe: boolean; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-7 h-7 text-xs';
  const initial = handle ? handle[0].toUpperCase() : '?';
  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center text-white font-bold ${
      isMe ? 'bg-blue-600' : 'bg-gray-400'
    }`}>
      {initial}
    </div>
  );
}

export function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 max-sm:gap-2 text-[10px] max-sm:text-[9px] text-gray-500 pt-2">
      <div className="flex items-center gap-1">
        <span>Less</span>
        <div className="flex gap-0.5">
          <div className="w-3 h-3 max-sm:w-2.5 max-sm:h-2.5 rounded-sm bg-gray-200 border border-gray-300" />
          <div className="w-3 h-3 max-sm:w-2.5 max-sm:h-2.5 rounded-sm bg-emerald-100 border border-emerald-200" />
          <div className="w-3 h-3 max-sm:w-2.5 max-sm:h-2.5 rounded-sm bg-grass-1 border border-grass-2" />
          <div className="w-3 h-3 max-sm:w-2.5 max-sm:h-2.5 rounded-sm bg-grass-2 border border-grass-3" />
        </div>
        <span>More</span>
      </div>
      <span className="max-sm:hidden">|</span>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 max-sm:w-2.5 max-sm:h-2.5 rounded-sm bg-gray-100 border border-gray-200 flex items-center justify-center text-[8px] max-sm:text-[7px] text-gray-400">-</div>
        <span>추천없음</span>
      </div>
    </div>
  );
}

export function SolvedMark({ isSolved }: { isSolved: boolean }) {
  return (
    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
      isSolved ? 'bg-green-500 text-white' : 'bg-gray-200'
    }`}>
      {isSolved && <CheckCircle className="w-2.5 h-2.5" />}
    </div>
  );
}
