import { Globe, Users, Trophy } from 'lucide-react';

export default function OpenStudyPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <div className="py-6 mb-8 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Globe className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">오픈 스터디</h1>
        </div>
        <p className="text-sm text-gray-500">
          다양한 공개 스터디 팀을 탐색하고 참여하세요
        </p>
      </div>

      {/* Under Development 메시지 */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <Globe className="h-10 w-10 text-gray-400" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🚧 개발 중입니다
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            오픈 스터디 기능은 현재 개발 중입니다.<br />
            곧 만나보실 수 있습니다.
          </p>

          {/* 예정된 기능 안내 */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              예정된 기능
            </h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    전체 공개 팀 탐색
                  </h4>
                  <p className="text-sm text-gray-600">
                    플랫폼에 등록된 모든 공개 스터디 팀을 둘러보고, 원하는 팀을 찾을 수 있습니다. "팀 관리" 메뉴는 내가 가입한 팀만 표시됩니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    간편한 팀 가입
                  </h4>
                  <p className="text-sm text-gray-600">
                    초대 없이도 공개 팀에 자유롭게 가입하여 새로운 동료들과 함께 알고리즘을 공부할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    팀 검색 및 필터링
                  </h4>
                  <p className="text-sm text-gray-600">
                    팀 이름, 난이도, 멤버 수 등 다양한 조건으로 내게 맞는 스터디 팀을 쉽게 찾을 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
