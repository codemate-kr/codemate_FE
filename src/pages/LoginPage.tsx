import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Chrome } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function LoginPage() {
  useDocumentTitle('로그인');
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    } catch (error) {
      console.error('Google login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Chrome className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            계정에 로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            CodeMate에서 스터디를 시작해보세요
          </p>
        </div>

        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <Chrome className="h-5 w-5 text-blue-300 group-hover:text-blue-200" />
            </span>
            {isLoading ? '로그인 중...' : 'Google로 로그인'}
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">로그인 후 백준 계정 연동 필요</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                백준 계정 연동 안내
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  로그인 후 백준 핸들을 입력하여 계정을 연동해주세요.
                  문제 해결 현황을 자동으로 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}