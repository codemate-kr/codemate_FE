import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Settings, Crown, ChevronRight } from 'lucide-react';
import { type CreateTeamRequest } from '../../api/teams';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { useTeamStore, useTeams, useTeamsLoading } from '../../store/teamStore';
import { Toast } from '../../components/common/Toast';

export default function TeamsPage() {
  useDocumentTitle('스터디 팀');
  const navigate = useNavigate();
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Selector hooks 사용 (필요한 상태만 구독)
  const teams = useTeams();
  const teamsLoading = useTeamsLoading();
  const { fetchTeams, createTeam } = useTeamStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateTeamRequest>({
    name: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // store의 fetchTeams 사용 (자동 캐싱)
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    if (showCreateForm && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showCreateForm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);
    try {
      // store의 createTeam 사용 (자동으로 store 업데이트)
      const newTeam = await createTeam(formData);
      setShowCreateForm(false);
      setFormData({ name: '', description: '' });
      showToastMessage(`${newTeam.name} 팀이 생성되었습니다`);
    } catch (error) {
      // 에러는 이미 store에서 처리됨
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (!isLoading) {
      setShowCreateForm(false);
      setFormData({ name: '', description: '' });
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCreateForm) {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showCreateForm, isLoading]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* 토스트 메시지 */}
      {showToast && <Toast message={toastMessage} type="success" />}

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
        {teamsLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 animate-pulse">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="h-5 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              아직 참여한 스터디 팀이 없어요
            </h3>
            <p className="text-sm text-gray-600 max-w-sm mx-auto mb-8">
              새 스터디 팀을 만들어 친구들과 함께 알고리즘 문제를 풀어보세요.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              첫 스터디 팀 만들기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team.teamId}
                onClick={() => navigate(`/teams/${team.teamId}`)}
                className="group bg-white overflow-hidden rounded-lg cursor-pointer hover:shadow-md transition-all border border-gray-200 hover:border-gray-400"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {team.teamName}
                          </h3>
                          {team.myRole === 'LEADER' && (
                            <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {team.teamDescription || '설명이 없습니다'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0 ml-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="팀 설정"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-1.5" />
                          <span className="font-medium">{team.memberCount}명</span>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded ${
                          team.myRole === 'LEADER'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {team.myRole === 'LEADER' ? '팀장' : '팀원'}
                        </span>
                        {team.isRecommendationActive && (
                          <span className="px-2.5 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                            추천 활성
                          </span>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="relative mx-auto w-full max-w-md animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  새 스터디 팀 만들기
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    팀 이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="알고리즘 스터디"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설명
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="팀에 대한 간단한 설명을 작성해주세요"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isLoading}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.name.trim()}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        생성 중...
                      </span>
                    ) : '생성'}
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