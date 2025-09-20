import { useState } from 'react';
import { Search, Filter, ExternalLink } from 'lucide-react';

export default function ProblemsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [difficultyRange, setDifficultyRange] = useState({ min: 1, max: 30 });

  // Mock data
  const mockProblems = [
    {
      id: 1000,
      title: 'A+B',
      titleKo: 'A+B',
      difficulty: 1,
      tags: [{ key: 'math', name: 'Mathematics', nameKo: '수학' }],
      acceptedUserCount: 500000,
      submissionCount: 800000,
    },
    {
      id: 1001,
      title: 'A-B',
      titleKo: 'A-B',
      difficulty: 1,
      tags: [{ key: 'math', name: 'Mathematics', nameKo: '수학' }],
      acceptedUserCount: 400000,
      submissionCount: 600000,
    },
  ];

  const mockTags = [
    { key: 'math', name: 'Mathematics', nameKo: '수학' },
    { key: 'implementation', name: 'Implementation', nameKo: '구현' },
    { key: 'dp', name: 'Dynamic Programming', nameKo: '다이나믹 프로그래밍' },
    { key: 'graph', name: 'Graph Theory', nameKo: '그래프 이론' },
  ];

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 5) return 'text-amber-600';
    if (difficulty <= 10) return 'text-gray-600';
    if (difficulty <= 15) return 'text-green-600';
    if (difficulty <= 20) return 'text-blue-600';
    if (difficulty <= 25) return 'text-purple-600';
    return 'text-red-600';
  };

  const getDifficultyTier = (difficulty: number) => {
    const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ruby'];
    const tierIndex = Math.floor((difficulty - 1) / 5);
    const level = 5 - ((difficulty - 1) % 5);
    return `${tiers[tierIndex]} ${level}`;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">문제 검색</h1>
          <p className="mt-2 text-sm text-gray-700">
            solved.ac에서 문제를 검색하고 스터디 그룹에 추가해보세요.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="문제 제목, 번호 또는 태그로 검색..."
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    난이도 범위
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={difficultyRange.min}
                      onChange={(e) => setDifficultyRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                      className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm"
                    />
                    <span className="text-gray-500">~</span>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={difficultyRange.max}
                      onChange={(e) => setDifficultyRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    태그
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {mockTags.map((tag) => (
                      <button
                        key={tag.key}
                        onClick={() => {
                          setSelectedTags(prev =>
                            prev.includes(tag.key)
                              ? prev.filter(t => t !== tag.key)
                              : [...prev, tag.key]
                          );
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedTags.includes(tag.key)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {tag.nameKo}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <Filter className="h-4 w-4 mr-2" />
                  필터 적용
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {mockProblems.map((problem) => (
              <li key={problem.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div>
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-blue-600">
                            {problem.id}. {problem.titleKo}
                          </p>
                          <a
                            href={`https://www.acmicpc.net/problem/${problem.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className={`font-medium ${getDifficultyColor(problem.difficulty)}`}>
                            {getDifficultyTier(problem.difficulty)}
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            {Math.round((problem.acceptedUserCount / problem.submissionCount) * 100)}% 정답률
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            {problem.acceptedUserCount.toLocaleString()} 명 해결
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {problem.tags.map((tag) => (
                            <span
                              key={tag.key}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag.nameKo}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                        스터디에 추가
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}