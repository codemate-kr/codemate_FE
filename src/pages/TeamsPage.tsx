import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Settings } from 'lucide-react';
import { teamsApi, type CreateTeamRequest, type MyTeamResponse } from '../api/teams';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function TeamsPage() {
  useDocumentTitle('스터디 팀');
  const [teams, setTeams] = useState<MyTeamResponse[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateTeamRequest>({
    name: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoadingTeams(true);
      const myTeams = await teamsApi.getMyTeams();
      setTeams(myTeams);
    } catch (error) {
      console.error('팀 목록 로딩 실패:', error);
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);
    try {
      await teamsApi.create(formData);
      setShowCreateForm(false);
      setFormData({ name: '', description: '' });
      loadTeams(); // 팀 목록 새로고침
    } catch (error) {
      console.error('팀 생성 실패:', error);
      // TODO: 에러 알림 표시
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">스터디 팀</h1>
          <p className="mt-2 text-sm text-gray-700">
            참여 중인 스터디 팀을 관리하고 새 팀을 만들어보세요.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            새 팀 만들기
          </button>
        </div>
      </div>

      <div className="mt-8">
        {loadingTeams ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">팀 목록을 불러오는 중...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              스터디 팀이 없습니다
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              새 스터디 팀을 만들어 친구들과 함께 알고리즘 문제를 풀어보세요.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                스터디 팀 만들기
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team.teamId}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {team.teamName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {team.teamDescription}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{team.memberCount}명 참여</span>
                      <span className={`ml-4 px-2 py-1 text-xs rounded-full ${
                        team.myRole === 'LEADER'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {team.myRole === 'LEADER' ? '팀장' : '팀원'}
                      </span>
                      {team.isRecommendationActive && (
                        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          추천 활성
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Link
                      to={`/teams/${team.teamId}`}
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      팀 보기
                    </Link>
                    <button className="text-gray-400 hover:text-gray-500">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                새 스터디 팀 만들기
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    팀 이름 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="알고리즘 스터디"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    설명
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="팀에 대한 간단한 설명을 작성해주세요"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.name.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '생성 중...' : '생성'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}