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

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">참여 중인 그룹</p>
            <p className="text-2xl font-bold text-gray-900">{teamCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <BookOpen className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">오늘의 문제</p>
            <p className="text-2xl font-bold text-gray-900">{problemCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-lg">
            <Target className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">총 해결 문제</p>
            <p className="text-2xl font-bold text-gray-900">{solvedCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 opacity-60 relative">
        <span className="absolute top-2 right-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium">
          개발 중
        </span>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">연속 해결일</p>
            <p className="text-2xl font-bold text-gray-400">-</p>
          </div>
        </div>
      </div>
    </div>
  );
}
