import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Users, BarChart3, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { memberApi, type MyProfileResponse } from '../../api/member';
import { useState, useEffect } from 'react';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<MyProfileResponse | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserProfile();
    }
  }, [isAuthenticated]);

  const loadUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const profile = await memberApi.getMe();
      setUserProfile(profile);
      // authStore의 user 정보도 업데이트
      updateUser({
        id: profile.id.toString(),
        email: profile.email,
        handle: profile.handle,
        name: profile.handle || profile.email,
      });
    } catch (error) {
      console.error('사용자 프로필 로딩 실패:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserProfile(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2">
                <img src="/logo.svg" alt="CodeMate" className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-base sm:text-xl font-bold text-gray-900">CodeMate</span>
              </Link>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-0.5 sm:space-x-1 px-1.5 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">대시보드</span>
                  </Link>
                  <Link
                    to="/teams"
                    className="flex items-center space-x-0.5 sm:space-x-1 px-1.5 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">스터디 팀</span>
                  </Link>
                  {/* <Link
                    to="/problems"
                    className="flex items-center space-x-0.5 sm:space-x-1 px-1.5 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">문제 검색</span>
                  </Link> */}

                  <div className="flex items-center gap-1 sm:gap-3 pl-1 sm:pl-3 border-l border-gray-200">
                    <div className="flex items-center space-x-1 sm:space-x-2 px-1 sm:px-2">
                      <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      {loadingProfile ? (
                        <div className="w-16 sm:w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">
                          {userProfile?.handle
                            ? userProfile.handle
                            : '미인증'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-0.5 sm:space-x-1 px-1.5 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">로그아웃</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
}