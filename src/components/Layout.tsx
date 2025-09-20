import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Users, BarChart3, BookOpen } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { memberApi, type MyProfileResponse } from '../api/member';
import { useState, useEffect } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, logout } = useAuthStore();
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">StudyHelp</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>대시보드</span>
                  </Link>
                  <Link
                    to="/groups"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <Users className="h-4 w-4" />
                    <span>스터디 팀</span>
                  </Link>
                  <Link
                    to="/problems"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>문제 검색</span>
                  </Link>

                  <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      {loadingProfile ? (
                        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        <span className="text-sm text-gray-700">
                          {userProfile?.handle
                            ? userProfile.handle
                            : '백준 미인증'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>로그아웃</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}