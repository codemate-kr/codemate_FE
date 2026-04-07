import { Users, BookOpen, Target, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  teamCount: number;
  problemCount: number;
  solvedCount: number;
}

export default function StatsCards({
  isAuthenticated,
  onLoginClick,
  teamCount,
  problemCount,
  solvedCount,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8 relative">
      {!isAuthenticated && (
        <button
          onClick={onLoginClick}
          className="absolute inset-0 z-10 rounded-xl flex flex-col items-center justify-center bg-gray-900/30 cursor-pointer group transition-all hover:bg-gray-900/40"
        >
          <p className="text-2xl font-bold text-white mb-2">통계를 확인하려면</p>
          <p className="text-lg text-white/90 group-hover:text-white transition-colors">로그인이 필요해요 →</p>
        </button>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">참여 중인 그룹</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{teamCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <BookOpen className="h-6 w-6 text-green-600 dark:text-green-300" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">오늘의 문제</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{problemCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <Target className="h-6 w-6 text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">총 해결 문제</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{solvedCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 opacity-60 relative">
        <span className="absolute top-2 right-2 text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 rounded font-medium">
          개발 중
        </span>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
            <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-300" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">연속 해결일</p>
            <p className="text-2xl font-bold text-gray-400 dark:text-gray-500">-</p>
          </div>
        </div>
      </div>
    </div>
  );
}
