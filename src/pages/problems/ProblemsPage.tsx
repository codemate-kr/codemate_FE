import { Search } from 'lucide-react';

export default function ProblemsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">문제 검색</h1>
          <p className="mt-2 text-base text-gray-600">
            solved.ac에서 문제를 검색하고 스터디 그룹에 추가할 수 있습니다.
          </p>
        </div>

        {/* Under Construction Notice */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-24 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🚧 개발 중입니다
            </h2>
            <p className="text-base text-gray-600 mb-6 max-w-md mx-auto">
              문제 검색 기능을 준비 중입니다.<br />
              곧 solved.ac의 다양한 문제를 검색하고 스터디 팀에 추천할 수 있습니다.
            </p>

            {/* Preview of upcoming features */}
            <div className="mt-12 max-w-2xl mx-auto">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">준비 중인 기능</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 opacity-60">
                  <p className="text-sm font-medium text-gray-900">문제 검색</p>
                  <p className="text-xs text-gray-500 mt-1">제목, 번호, 태그로 검색</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 opacity-60">
                  <p className="text-sm font-medium text-gray-900">난이도 필터</p>
                  <p className="text-xs text-gray-500 mt-1">원하는 난이도 범위 설정</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 opacity-60">
                  <p className="text-sm font-medium text-gray-900">스터디 추가</p>
                  <p className="text-xs text-gray-500 mt-1">팀에 바로 문제 추천</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}