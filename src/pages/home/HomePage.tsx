import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, BarChart3, Mail } from 'lucide-react';
import Layout from '../../components/common/Layout';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <Layout>
        {/* Hero Section */}
        <div className="text-center pt-12 sm:pt-20 pb-12 sm:pb-16">
          <div className="mb-6 sm:mb-8">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold">
              스마트한 알고리즘 학습 플랫폼
            </span>
          </div>
          <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight font-extrabold text-gray-900 px-4">
            <span className="block mb-2">알고리즘 스터디</span>
            <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              코드메이트
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 px-4">
            그룹 기반 문제 추천과 진행률 관리로 효율적인 알고리즘 학습을.
            <br />
            매일 미션 문제를 이메일로 받아보세요.
          </p>
          <div className="mt-8 sm:mt-10 flex justify-center gap-4 px-4">
            <Link
              to="/login"
              className="group flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              시작하기
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 sm:py-20">
          <div className="text-center mb-12 sm:mb-16 px-4">
            <h2 className="text-xs sm:text-sm text-blue-600 font-bold tracking-wider uppercase mb-2 sm:mb-3">
              주요 기능
            </h2>
            <p className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
              스터디를 더 효율적으로
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4 px-4 pb-12">
            <div className="group">
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="absolute -top-6 left-6 sm:left-8">
                  <span className="inline-flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </span>
                </div>
                <div className="pt-6 sm:pt-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                    스터디 팀
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    스터디 팀을 만들고 함께 학습해 보세요.
                  </p>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="absolute -top-6 left-6 sm:left-8">
                  <span className="inline-flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </span>
                </div>
                <div className="pt-6 sm:pt-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                    미션 문제
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    난이도별 백준 미션 문제를 자동 추천합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="absolute -top-6 left-6 sm:left-8">
                  <span className="inline-flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </span>
                </div>
                <div className="pt-6 sm:pt-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                    진행률 확인
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    팀원들의 문제 해결 현황을 확인하세요.
                  </p>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="absolute -top-6 left-6 sm:left-8">
                  <span className="inline-flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Mail className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </span>
                </div>
                <div className="pt-6 sm:pt-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                    이메일 알림
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    매일 아침 9시, 미션 문제를 이메일로 받아보세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
