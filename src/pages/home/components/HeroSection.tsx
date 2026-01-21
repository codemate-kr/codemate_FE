import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, Users, SlidersHorizontal, Mail, BarChart3, ChevronDown } from 'lucide-react';
import TodayProblemsPreview from './TodayProblemsPreview';

const faqs = [
  { q: '완전 무료인가요?', a: '네, 모든 기능이 무료입니다. 앞으로도 그럴 예정이에요.' },
  { q: '문제는 어떻게 추천되나요?', a: '팀원 모두가 아직 안 푼 문제 중에서, 설정한 난이도와 태그에 맞는 문제를 추천해드려요.' },
  { q: '이미 푼 문제가 나오나요?', a: '아니요, solved.ac 기준으로 팀원 중 한 명이라도 푼 문제는 제외됩니다.' },
  { q: '알림은 언제 오나요?', a: '매일 오전 9시에 이메일로 오늘의 문제가 발송됩니다. 문제는 오전 6시에 갱신돼요.' },
  { q: '혼자서도 사용할 수 있나요?', a: '네, 1인 팀도 가능해요. 개인 학습 관리 용도로도 좋습니다.' },
];

export default function HeroSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20 pb-12 sm:pb-16">
        <p className="text-sm sm:text-lg font-medium text-blue-500 tracking-widest uppercase mb-2 sm:mb-3">CodeMate</p>
        <h1 className="font-bold text-center mb-6 sm:mb-8">
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-blue-600">알고리즘 스터디</span>
          <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 mt-2 sm:mt-3">매일 문제가 도착합니다</span>
        </h1>

        <p className="text-gray-500 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 px-4">
          스터디원들과 매일 같은 문제를 풀어보세요
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 px-4 sm:px-6 py-8 sm:py-12 border-t border-gray-200 max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 p-3 sm:p-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">팀 스터디</h3>
          <p className="text-sm sm:text-base text-gray-500">팀원 모두가 안 푼 문제만 추천받아 함께 풀어요</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 p-3 sm:p-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <SlidersHorizontal className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">맞춤 추천</h3>
          <p className="text-sm sm:text-base text-gray-500">난이도, 알고리즘 태그, 문제 수, 요일을 직접 설정해요</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 p-3 sm:p-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">이메일 알림</h3>
          <p className="text-sm sm:text-base text-gray-500">매일 오전 9시<span className="text-xs text-gray-400 ml-0.5">KST</span>, 오늘의 문제가 이메일로 도착해요</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2 sm:gap-3 p-3 sm:p-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">진행률 확인</h3>
          <p className="text-sm sm:text-base text-gray-500">팀원들의 문제 해결 현황을 한눈에 확인해요</p>
        </div>
      </div>

      {/* 미리보기 - 실제 TodayProblems와 동일한 UI */}
      <div className="px-2 sm:px-4 md:px-6 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <TodayProblemsPreview />
        </div>
      </div>

      {/* FAQ 아코디언 */}
      <div className="px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-xl mx-auto space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-4 py-3 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 text-base">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openFaq === i ? 'max-h-24' : 'max-h-0'
                }`}
              >
                <div className="px-4 pb-3 text-gray-600 text-base">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
