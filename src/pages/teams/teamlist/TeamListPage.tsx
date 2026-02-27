import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Users } from 'lucide-react';
import { PublicTeamCard } from './components/PublicTeamCard';
import { teamsApi, type PublicTeamResponse } from '../../../api/teams';

export default function TeamListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTeamIds, setExpandedTeamIds] = useState<Set<number>>(new Set());
  const {
    data: teams = [],
    isLoading,
    error,
  } = useQuery<PublicTeamResponse[], Error>({
    queryKey: ['publicTeams'],
    queryFn: async () => {
      const data = await teamsApi.getPublicTeams();
      return [...data].sort((a, b) => b.teamId - a.teamId);
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const filteredTeams = teams.filter(team =>
    team.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTeamClick = (teamId: number) => {
    navigate(`/teams/${teamId}`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">팀 찾기</h1>
        </div>
        <p className="mt-1 sm:mt-2 text-sm text-gray-600">
          다양한 공개 스터디 팀을 탐색하고 참여하세요
        </p>
      </div>

      {/* 검색 */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="팀 이름으로 검색..."
            className="w-full sm:max-w-md pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* 팀 목록 */}
      <div className="flex flex-col gap-2 sm:gap-3">
        {isLoading ? (
          // 로딩 스켈레톤
          [1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 animate-pulse">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="hidden sm:block h-12 w-12 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3" />
                  <div className="flex gap-2 sm:gap-3">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-14 sm:w-16" />
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-10 sm:w-12" />
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="text-center py-16">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              오류가 발생했습니다
            </h3>
            <p className="text-sm text-gray-500">팀 목록을 불러오는데 실패했습니다</p>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? '검색 결과가 없습니다' : '공개된 팀이 없습니다'}
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery ? '다른 키워드로 검색해 보세요' : '새로운 팀을 만들어 보세요'}
            </p>
          </div>
        ) : (
          filteredTeams.map((team) => (
            <PublicTeamCard
              key={team.teamId}
              team={team}
              isExpanded={expandedTeamIds.has(team.teamId)}
              onToggle={() => {
                setExpandedTeamIds((prev) => {
                  const next = new Set(prev);
                  if (next.has(team.teamId)) {
                    next.delete(team.teamId);
                  } else {
                    next.add(team.teamId);
                  }
                  return next;
                });
              }}
              onNavigate={() => handleTeamClick(team.teamId)}
            />
          ))
        )}
      </div>
    </div>
  );
}
