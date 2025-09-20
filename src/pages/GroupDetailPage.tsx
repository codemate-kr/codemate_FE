import { useParams } from 'react-router-dom';
import { Users, Settings, Plus, Calendar, Target } from 'lucide-react';

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();

  // TODO: Fetch group data based on groupId
  const mockGroup = {
    id: groupId,
    name: '알고리즘 스터디',
    description: '매일 1문제씩 풀어보는 스터디',
    members: [
      { id: '1', name: '김개발', bojHandle: 'kimdev' },
      { id: '2', name: '박코딩', bojHandle: 'parkcoding' },
    ],
    settings: {
      frequency: 'daily' as const,
      problemCount: 1,
      difficulty: { min: 1, max: 10 },
      tags: ['구현', '그래프'],
    },
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            {mockGroup.name}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {mockGroup.description}
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
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        1000. A+B
                      </h4>
                      <p className="text-sm text-gray-500">난이도: Bronze V</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        완료
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        1001. A-B
                      </h4>
                      <p className="text-sm text-gray-500">난이도: Bronze V</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        진행 중
                      </span>
                    </div>
                  </div>
                </div>
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
                그룹 정보
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">
                    {mockGroup.settings.frequency === 'daily' ? '매일' : '매주'}{' '}
                    {mockGroup.settings.problemCount}문제
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Target className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">
                    난이도 {mockGroup.settings.difficulty.min}-{mockGroup.settings.difficulty.max}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">
                    {mockGroup.members.length}명 참여
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                멤버 목록
              </h3>
              <div className="space-y-3">
                {mockGroup.members.map((member) => (
                  <div key={member.id} className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {member.name[0]}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        @{member.bojHandle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}