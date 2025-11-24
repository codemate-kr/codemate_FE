import { Link } from 'react-router-dom';
import { Plus, Users, Crown, ChevronRight } from 'lucide-react';
import Tooltip from '../../../components/common/Tooltip';
import type { MyTeamResponse } from '../../../api/teams';

interface MyTeamsSectionProps {
  isAuthenticated: boolean;
  loginRedirect: string;
  teams: MyTeamResponse[];
}

const SAMPLE_TEAMS = [
  { teamId: 1, teamName: '알고리즘 스터디', memberCount: 5, myRole: 'LEADER' as const, isRecommendationActive: true },
  { teamId: 2, teamName: '코딩 테스트 준비반', memberCount: 8, myRole: 'MEMBER' as const, isRecommendationActive: true },
  { teamId: 3, teamName: 'PS 연습', memberCount: 3, myRole: 'MEMBER' as const, isRecommendationActive: false },
];

export default function MyTeamsSection({ isAuthenticated, loginRedirect, teams }: MyTeamsSectionProps) {
  const displayTeams = isAuthenticated ? teams : SAMPLE_TEAMS;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 relative">
      {!isAuthenticated && (
        <Link
          to={loginRedirect}
          className="absolute inset-0 z-10 rounded-xl flex flex-col items-center justify-center bg-gray-900/30 cursor-pointer group transition-all hover:bg-gray-900/40"
        >
          <p className="text-2xl font-bold text-white mb-2">참여 팀을 보려면</p>
          <p className="text-lg text-white/90 group-hover:text-white transition-colors">로그인이 필요해요 →</p>
        </Link>
      )}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">내 스터디 팀</h3>
          <Link
            to="/teams/my"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            전체 보기 →
          </Link>
        </div>
      </div>
      <div className="p-6">
        {isAuthenticated && teams.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              아직 참여한 스터디 팀이 없습니다
            </p>
            <Link
              to="/teams/my?action=create"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              팀 만들기
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {displayTeams.slice(0, 3).map((team) => (
              <Link
                key={team.teamId}
                to={isAuthenticated ? `/teams/${team.teamId}` : '#'}
                className={`group block bg-white border border-gray-200 rounded-lg p-4 ${
                  isAuthenticated ? 'hover:border-blue-400 hover:shadow-md' : 'cursor-default'
                } transition-all`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {team.teamName}
                        </h4>
                        {team.myRole === 'LEADER' && (
                          <Tooltip text="팀장">
                            <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        멤버 {team.memberCount}명
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 ml-2">
                    {team.isRecommendationActive && (
                      <Tooltip text="문제 추천 활성화됨">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700 flex-shrink-0">
                          추천 활성
                        </span>
                      </Tooltip>
                    )}
                    <ChevronRight className={`h-5 w-5 flex-shrink-0 ${
                      isAuthenticated ? 'text-gray-400 group-hover:text-blue-600' : 'text-gray-400'
                    } transition-colors`} />
                  </div>
                </div>
              </Link>
            ))}
            {isAuthenticated && teams.length > 3 && (
              <div className="pt-2 text-center">
                <Link
                  to="/teams/my"
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  외 {teams.length - 3}개 팀 →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
