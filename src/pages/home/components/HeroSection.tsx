import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, Users, SlidersHorizontal, Mail, BarChart3, ChevronDown, Github, Star } from 'lucide-react';
import TodayProblemsPreview from './TodayProblemsPreview';

const faqs = [
  { q: '문제는 어떻게 추천되나요?', a: '팀원 모두가 아직 안 푼 문제 중에서, 설정한 난이도와 태그에 맞는 문제를 추천해드려요.' },
  { q: '이미 푼 문제가 나오나요?', a: '아니요, solved.ac 기준으로 팀원 중 한 명이라도 푼 문제는 제외됩니다.' },
  { q: '알림은 언제 오나요?', a: '매일 오전 9시에 이메일로 오늘의 문제가 발송됩니다. 문제는 오전 6시에 갱신돼요.' },
  { q: '혼자서도 사용할 수 있나요?', a: '네, 1인 팀도 가능해요. 개인 학습 관리 용도로도 좋습니다.' },
];

export default function HeroSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {/* Hero */}
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-28 pb-16 sm:pb-24 bg-gray-50">
        <p className="text-lg sm:text-2xl font-medium text-blue-500 tracking-widest uppercase mb-2 sm:mb-3">CodeMate</p>
        <h1 className="font-bold text-center mb-6 sm:mb-8">
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-blue-600">알고리즘 스터디</span>
          <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 mt-2 sm:mt-3">매일 문제가 도착합니다</span>
        </h1>

        <p className="text-gray-500 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 px-4">
          스터디원들과 매일 백준 문제를 풀어보세요
        </p>

        <Link
          to="/dashboard"
          className="group inline-flex items-center px-7 sm:px-8 py-3.5 sm:py-4 text-lg sm:text-lg font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          시작하기
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 핵심 기능 */}
      <div className="bg-gray-50 py-12 sm:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 p-4 sm:p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">팀 스터디</h3>
          <p className="text-sm sm:text-base text-gray-500">팀원 모두가 안 푼 문제만 추천받아 함께 풀어요</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 p-4 sm:p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <SlidersHorizontal className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">맞춤 추천</h3>
          <p className="text-sm sm:text-base text-gray-500">난이도, 알고리즘 태그, 문제 수, 요일을 직접 설정해요</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 p-4 sm:p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">이메일 알림</h3>
          <p className="text-sm sm:text-base text-gray-500">매일 오전 9시<span className="text-xs text-gray-400 ml-0.5">KST</span>, 오늘의 문제가 이메일로 도착해요</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 p-4 sm:p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">진행률 확인</h3>
          <p className="text-sm sm:text-base text-gray-500">팀원들의 문제 해결 현황을 한눈에 확인해요</p>
        </div>
        </div>
      </div>

      {/* 미리보기 - 실제 TodayProblems와 동일한 UI */}
      <div className="px-2 sm:px-4 md:px-6 py-12 sm:py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <TodayProblemsPreview />
        </div>
      </div>

      {/* FAQ + GitHub Star */}
      <div className="px-4 sm:px-6 py-12 sm:py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          {/* FAQ 헤더 */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">자주 묻는 질문</h2>

          {/* FAQ 목록 */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-xl overflow-hidden transition-all ${
                  openFaq === i
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-white border border-gray-200 hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between"
                >
                  <span className={`font-medium text-base ${openFaq === i ? 'text-blue-700' : 'text-gray-900'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? 'rotate-180 text-blue-600' : 'text-gray-400'
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openFaq === i ? 'max-h-32' : 'max-h-0'
                  }`}
                >
                  <div className="px-5 pb-4 text-gray-600 text-base leading-relaxed">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>

          {/* GitHub 스타 유도 카드 */}
          <a
            href="https://github.com/codemate-kr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between mt-10 sm:mt-14 p-6 sm:p-8 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-all group"
          >
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-700 flex items-center justify-center">
                <Github className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div>
                <p className="text-white text-lg sm:text-xl font-bold">
                  CodeMate가 도움이 되셨나요?
                </p>
                <p className="text-gray-400 text-sm sm:text-base">
                  GitHub에서 Star를 눌러 응원해주세요
                </p>
              </div>
            </div>
            <Star className="h-7 w-7 sm:h-8 sm:w-8 text-yellow-400 group-hover:scale-110 transition-transform flex-shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
}
