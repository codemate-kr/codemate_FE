import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, Users, Target, Bell, ChevronDown } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center px-6 pt-20 pb-16">
        <p className="text-sm font-medium text-blue-500 tracking-widest uppercase mb-2">CodeMate</p>
        <h1 className="font-bold text-center mb-6">
          <span className="block text-4xl sm:text-5xl md:text-6xl text-blue-600">알고리즘 스터디</span>
          <span className="block text-3xl sm:text-4xl md:text-5xl text-gray-900 mt-2">매일 문제가 도착합니다</span>
        </h1>

        <p className="text-gray-500 text-lg sm:text-xl mb-12">
          스터디원들과 매일 같은 문제를 풀어보세요
        </p>

        <Link
          to="/dashboard"
          className="group inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          시작하기
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 핵심 기능 */}
      <div className="flex justify-center gap-12 sm:gap-16 px-6 py-12 border-t border-gray-200">
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="h-5 w-5 text-blue-500" />
          <span>팀 스터디</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Target className="h-5 w-5 text-blue-500" />
          <span>난이도 맞춤</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Bell className="h-5 w-5 text-blue-500" />
          <span>매일 알림</span>
        </div>
      </div>

      {/* 미리보기 - 실제 TodayProblems와 동일한 UI */}
      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <TodayProblemsPreview />
        </div>
      </div>

      {/* FAQ 아코디언 */}
      <div className="px-6 py-12">
        <div className="max-w-xl mx-auto space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-4 py-3 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openFaq === i ? 'max-h-24' : 'max-h-0'
                }`}
              >
                <div className="px-4 pb-3 text-gray-600 text-sm">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
