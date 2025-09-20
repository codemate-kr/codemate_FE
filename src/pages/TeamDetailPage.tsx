import { useParams } from 'react-router-dom';
import { Users, Settings, Plus, Calendar, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import { teamsApi, type TeamMemberResponse } from '../api/teams';

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const [teamMembers, setTeamMembers] = useState<TeamMemberResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teamId) {
      loadTeamMembers();
    }
  }, [teamId]);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const members = await teamsApi.getTeamMembers(Number(teamId));
      setTeamMembers(members);
    } catch (error) {
      console.error('팀 멤버 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            스터디 팀 #{teamId}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            팀 상세 정보 및 멤버 관리
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Settings className="h-4 w-4 mr-2" />
            설정
          </button>
          <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            멤버 초대
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                이번 주 과제
              </h3>
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  아직 과제가 없습니다
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  팀 리더가 문제를 추천하면 여기에 표시됩니다.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                진행률 차트
              </h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">차트가 여기에 표시됩니다</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                팀 정보
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">
                    {teamMembers.length}명 참여
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Target className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">
                    팀 ID: {teamId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                멤버 목록 ({teamMembers.length}명)
              </h3>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.memberId} className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {member.handle?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            @{member.handle || '핸들 없음'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {member.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.role === 'LEADER'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {member.role === 'LEADER' ? '팀장' : '팀원'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {teamMembers.length === 0 && (
                <div className="text-center py-4">
                  <Users className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    멤버 정보를 불러오는 중...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}