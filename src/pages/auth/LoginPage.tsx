import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Chrome } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { env } from '../../config/env';

export default function LoginPage() {
  useDocumentTitle('로그인');
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // query parameter에서 리다이렉트 경로 가져오기
  const urlParams = new URLSearchParams(location.search);
  const redirectParam = urlParams.get('redirect');
  const from = redirectParam ? decodeURIComponent(redirectParam) : '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      // 팝업 창 크기 설정
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      // 팝업 창 열기
      const popup = window.open(
        `${env.OAUTH_BASE_URL}/oauth2/authorization/google`,
        'Google Login',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
      );

      if (!popup) {
        toast.error('팝업 차단을 해제해주세요.');
        setIsLoading(false);
        return;
      }

      // 팝업이 닫혔는지 주기적으로 확인
      let checkPopupClosed: NodeJS.Timeout | null = null;

      // 팝업에서 메시지 수신 대기
      const handleMessage = (event: MessageEvent) => {
        // 보안: origin 확인
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data.type === 'oauth-success') {
          console.log('OAuth 성공 메시지 수신:', event.data);

          try {
            if (popup && !popup.closed) {
              popup.close();
            }
          } catch (e) {
            // COOP 에러 무시
          }

          window.removeEventListener('message', handleMessage);
          if (checkPopupClosed) clearInterval(checkPopupClosed);

          toast.success('로그인 성공!');

          // handle 없으면 verify-handle로, 있으면 원래 페이지로 이동
          const user = event.data.user;
          const targetPath = !user?.handle ? '/verify-handle' : from;

          console.log('리다이렉트 경로:', targetPath);

          // 새로고침으로 상태 확실히 동기화
          window.location.href = targetPath;
        } else if (event.data.type === 'oauth-error') {
          if (popup && !popup.closed) {
            popup.close();
          }
          window.removeEventListener('message', handleMessage);
          if (checkPopupClosed) clearInterval(checkPopupClosed);
          toast.error('로그인에 실패했습니다.');
          setIsLoading(false);
        }
      };

      window.addEventListener('message', handleMessage);

      // 팝업이 닫혔는지 주기적으로 확인
      checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          if (checkPopupClosed) clearInterval(checkPopupClosed);
          window.removeEventListener('message', handleMessage);
          setIsLoading(false);
        }
      }, 500);
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('로그인 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-gray-50 py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
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