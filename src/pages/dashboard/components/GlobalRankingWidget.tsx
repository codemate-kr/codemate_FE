import { Trophy, Medal, Construction } from 'lucide-react';

interface RankingUser {
  rank: number;
  handle: string;
  solvedCount: number;
  isMe?: boolean;
}

// 더미 데이터 (추후 API 연동)
const DUMMY_RANKING: RankingUser[] = [
  { rank: 1, handle: 'test_user1', solvedCount: 1247 },
  { rank: 2, handle: 'test_user2', solvedCount: 1189 },
  { rank: 3, handle: 'test_user3', solvedCount: 1056 },
  { rank: 4, handle: 'test_user4', solvedCount: 982, isMe: true },
  { rank: 5, handle: 'test_user5', solvedCount: 945 },
];

interface GlobalRankingWidgetProps {
  isAuthenticated: boolean;
}

export default function GlobalRankingWidget({ isAuthenticated }: GlobalRankingWidgetProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-3.5 w-3.5 text-yellow-500" />;
      case 2:
        return <Medal className="h-3.5 w-3.5 text-gray-400" />;
      case 3:
        return <Medal className="h-3.5 w-3.5 text-amber-600" />;
      default:
        return (
          <span className="text-xs font-medium text-gray-400 w-3.5 text-center">
            {rank}
          </span>
        );
    }
  };

  // 비로그인 시 isMe 제거
  const displayRanking = isAuthenticated
    ? DUMMY_RANKING
    : DUMMY_RANKING.map(u => ({ ...u, isMe: false }));

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
            <Trophy className="h-4 w-4 text-yellow-500" />
            전체 랭킹
          </h3>
          <span className="flex items-center gap-0.5 text-[10px] font-medium text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full">
            <Construction className="h-3 w-3" />
            개발중
          </span>
        </div>
      </div>

      <div className="p-4 relative">
        <div className="absolute inset-0 backdrop-blur-sm bg-white/50 z-10 rounded-b-xl" />
        <div className="space-y-1.5">
          {displayRanking.map((user) => (
            <div
              key={user.handle}
              className={`flex items-center gap-2 p-1.5 rounded ${
                user.isMe ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex-shrink-0 w-5 flex justify-center">
                {getRankIcon(user.rank)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  @{user.handle.slice(0, 12)}
                  {user.isMe && <span className="text-blue-600 ml-0.5">(나)</span>}
                </p>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0">
                {user.solvedCount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* 내 순위가 Top 5 밖일 경우 표시 - 로그인 시에만 */}
        {isAuthenticated && !DUMMY_RANKING.some(u => u.isMe) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 p-1.5 rounded bg-blue-50">
              <div className="flex-shrink-0 w-5 flex justify-center">
                <span className="text-xs font-medium text-gray-400">42</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  @my_handle
                  <span className="text-blue-600 ml-0.5">(나)</span>
                </p>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0">127</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
