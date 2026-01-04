import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Trophy, Medal, X, Crown, ExternalLink, Loader2 } from 'lucide-react';
import { useActiveTimerCount } from '../../store/timerStore';
import { rankingApi, type RankingUser } from '../../api/ranking';

export default function RankingSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeTimerCount = useActiveTimerCount();
  const hasActiveTimer = activeTimerCount > 0;

  // 홈페이지에서는 숨김
  if (location.pathname === '/') {
    return null;
  }

  // 사이드바 열릴 때 데이터 fetch
  useEffect(() => {
    if (isOpen && rankings.length === 0) {
      fetchRankings();
    }
  }, [isOpen]);

  const fetchRankings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rankingApi.getGlobalRanking();
      setRankings(data.rankings);

    } catch (err) {
      console.error('랭킹 로드 실패:', err);
      setError('랭킹을 불러오지 못했습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const top3 = rankings.slice(0, 3);
  const rest = rankings.slice(3);

  return (
    <>
      {/* 플로팅 트로피 아이콘 버튼 - 타이머 활성 시 왼쪽으로 이동 */}
      <div
        className={`fixed bottom-4 z-40 ${
          hasActiveTimer ? 'right-72 sm:right-80' : 'right-4'
        }`}
      >
        {/* 후광 효과 */}
        <div className="absolute inset-0 bg-blue-400 rounded-xl blur-md opacity-50 animate-pulse" />
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-3 bg-white hover:bg-blue-50 active:bg-blue-100 rounded-xl shadow-lg border border-gray-200 transition-all hover:shadow-xl hover:scale-105 active:scale-95 group"
          aria-label="전체 랭킹 보기"
        >
          <Trophy className="h-6 w-6 text-blue-600 group-hover:text-blue-700" />
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded-full">
            N
          </span>
        </button>
      </div>

      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gray-50 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 헤더 */}
        <div className="bg-blue-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">전체 랭킹</h2>
                <p className="text-xs text-white/80">Top 10</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        )}

        {/* 에러 상태 */}
        {error && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchRankings}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 랭킹 콘텐츠 */}
        {!loading && !error && rankings.length > 0 && (
          <>
            {/* Top 3 포디엄 - 3명 이상일 때만 */}
            {top3.length >= 3 && (
              <div className="bg-white px-4 py-5 border-b border-gray-100">
                <div className="flex items-end justify-center gap-3">
                  {/* 2등 */}
                  <a
                    href={`https://www.acmicpc.net/user/${top3[1].handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center group"
                  >
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mb-2 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-200">
                      <Medal className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 rounded-t-lg w-16 h-12 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-gray-700">{top3[1].rank}</span>
                    </div>
                    <p className="text-[11px] font-medium text-gray-700 mt-1.5 group-hover:text-blue-600 transition-colors truncate max-w-[80px]">
                      @{top3[1].handle}
                    </p>
                    <p className="text-[10px] text-gray-500">{top3[1].solvedCount.toLocaleString()}</p>
                  </a>

                  {/* 1등 */}
                  <a
                    href={`https://www.acmicpc.net/user/${top3[0].handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center group -mt-4"
                  >
                    <Crown className="h-5 w-5 text-yellow-500 mb-1 animate-bounce" />
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-2 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-200 ring-4 ring-blue-200">
                      <Trophy className="h-7 w-7 text-white" />
                    </div>
                    <div className="bg-blue-600 rounded-t-lg w-20 h-16 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-2xl font-bold text-white">{top3[0].rank}</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-900 mt-1.5 group-hover:text-blue-600 transition-colors truncate max-w-[90px]">
                      @{top3[0].handle}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium">{top3[0].solvedCount.toLocaleString()}</p>
                  </a>

                  {/* 3등 */}
                  <a
                    href={`https://www.acmicpc.net/user/${top3[2].handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-200">
                      <Medal className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 rounded-t-lg w-14 h-10 flex flex-col items-center justify-center">
                      <span className="text-base font-bold text-gray-700">{top3[2].rank}</span>
                    </div>
                    <p className="text-[11px] font-medium text-gray-700 mt-1.5 group-hover:text-blue-600 transition-colors truncate max-w-[70px]">
                      @{top3[2].handle}
                    </p>
                    <p className="text-[10px] text-gray-500">{top3[2].solvedCount.toLocaleString()}</p>
                  </a>
                </div>
              </div>
            )}

            {/* 리스트 형태 - 3명 미만이면 전체, 3명 이상이면 4등 이후 */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {(top3.length >= 3 ? rest : rankings).map((user, index) => (
                  <a
                    key={`${user.rank}-${user.handle}-${index}`}
                    href={`https://www.acmicpc.net/user/${user.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      user.rank === 1 ? 'bg-blue-600' : user.rank <= 3 ? 'bg-gray-200' : 'bg-blue-50'
                    }`}>
                      {user.rank === 1 ? (
                        <Trophy className="h-4 w-4 text-white" />
                      ) : user.rank <= 3 ? (
                        <Medal className="h-4 w-4 text-gray-600" />
                      ) : (
                        <span className="text-sm font-bold text-blue-600">{user.rank}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate transition-colors">
                        @{user.handle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 tabular-nums">
                          {user.solvedCount.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-400">solved</p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-gray-300 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 빈 상태 */}
        {!loading && !error && rankings.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-500">랭킹 데이터가 없습니다</p>
          </div>
        )}

        {/* 푸터 */}
        <div className="bg-white border-t border-gray-100 px-4 py-3">
          <p className="text-[11px] text-gray-400 text-center">
            코드메이트 전체 유저 기준
          </p>
        </div>
      </div>
    </>
  );
}
