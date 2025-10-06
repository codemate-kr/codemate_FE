import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, BarChart3, Mail, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Footer from '../../components/common/Footer';

export default function HomePage() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/logo.svg" alt="CodeMate" className="h-8 w-8" />
                <span className="text-xl font-bold text-gray-900">CodeMate</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    대시보드로 가기
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>로그아웃</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center pt-20 pb-16">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              스마트한 알고리즘 학습 플랫폼
            </span>
          </div>
          <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
            <span className="block mb-2">코딩테스트를</span>
            <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              더 스마트하게
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 sm:text-xl">
            그룹 기반 문제 큐레이션과 진행률 관리로 효율적인 알고리즘 학습을 시작하세요.
            <br className="hidden sm:block" />
            매일 개인 맞춤형 문제를 이메일로 받아보세요.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/login"
              className="group flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              시작하기
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-sm text-blue-600 font-bold tracking-wider uppercase mb-3">
              주요 기능
            </h2>
            <p className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              스터디를 더 효율적으로
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
            <div className="group">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="absolute -top-6 left-8">
                  <span className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="h-7 w-7 text-white" />
                  </span>
                </div>
                <div className="pt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    스터디 그룹 관리
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    친구들과 스터디 그룹을 만들고 함께 문제를 풀어보세요.
                  </p>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="absolute -top-6 left-8">
                  <span className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <BookOpen className="h-7 w-7 text-white" />
                  </span>
                </div>
                <div className="pt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    맞춤 문제 추천
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    그룹원 모두가 풀지 않은 문제를 난이도와 태그별로 추천합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="absolute -top-6 left-8">
                  <span className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-7 w-7 text-white" />
                  </span>
                </div>
                <div className="pt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    진행률 시각화
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    개인별, 그룹별 문제 해결 현황을 한눈에 확인하세요.
                  </p>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="absolute -top-6 left-8">
                  <span className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Mail className="h-7 w-7 text-white" />
                  </span>
                </div>
                <div className="pt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    이메일 알림
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    매일 아침 9시, 추천 문제를 이메일로 받아보세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}