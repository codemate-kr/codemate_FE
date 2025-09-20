import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, BookOpen, Target, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { memberApi, type MyProfileResponse } from '../api/member';
import { teamsApi, type MyTeamResponse } from '../api/teams';

export default function DashboardPage() {
  const { isAuthenticated } = useAuthStore();
  const [userProfile, setUserProfile] = useState<MyProfileResponse | null>(null);
  const [teams, setTeams] = useState<MyTeamResponse[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserProfile();
      loadTeams();
    }
  }, [isAuthenticated]);

  const loadUserProfile = async () => {
    try {
      const profile = await memberApi.getMe();
      setUserProfile(profile);
    } catch (error) {
      console.error('사용자 프로필 로딩 실패:', error);
    }
  };

  const loadTeams = async () => {
    try {
      const myTeams = await teamsApi.getMyTeams();
      setTeams(myTeams);
    } catch (error) {
      console.error('팀 목록 로딩 실패:', error);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            안녕하세요, {userProfile?.handle || '백준 미인증'}님!
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            오늘도 알고리즘 문제를 풀어보세요.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/groups?action=create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            스터디 팀 만들기
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      참여 중인 그룹
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {teams.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      오늘의 문제
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Target className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      이번 주 해결
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      연속 해결일
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              최근 활동
            </h3>
            <div className="mt-6">
              {teams.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    스터디 팀이 없습니다
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    새 스터디 팀을 만들거나 기존 팀에 참여해보세요.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/groups?action=create"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      스터디 팀 만들기
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {teams.map((team) => (
                    <div
                      key={team.teamId}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {team.teamName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {team.memberCount}명 참여 중
                          </p>
                        </div>
                        <Link
                          to={`/teams/${team.teamId}`}
                          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                          보기
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}